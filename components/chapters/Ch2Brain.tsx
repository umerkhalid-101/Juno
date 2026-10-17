"use client";

import { useMemo, useRef, useState } from "react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { Mascot } from "@/components/mascot/Mascot";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { tools, type ToolId } from "@/lib/story";
import { BrandMark } from "@/components/ui/BrandIcon";

/** Tools grouped by what they know. Neighbors on the ring share an area. */
const groups: { id: string; label: string; tools: ToolId[] }[] = [
  { id: "customers", label: "Customers", tools: ["gmail", "slack"] },
  { id: "sales", label: "Sales", tools: ["hubspot"] },
  { id: "support", label: "Support", tools: ["intercom"] },
  { id: "product", label: "Product", tools: ["linear", "jira", "github"] },
  { id: "brand", label: "Brand", tools: ["figma"] },
  { id: "market", label: "Market", tools: ["notion", "drive"] },
];
const ring = groups.flatMap((g) => g.tools);
const STEP = 360 / ring.length;
const FIRST = -90 - STEP / 2; // centers the first group on top
const angleOf = (id: ToolId) => FIRST + ring.indexOf(id) * STEP;

const C = 360; // center (viewBox units)
const R = 228; // tool ring
const NODE = 28;
const AR = 322; // knowledge arc ring
const CORE = 66; // where pulses land, just outside Juno
const ARC_PAD = 13; // degrees an arc extends past its outer tools

const rad = (d: number) => (d * Math.PI) / 180;
// rounded so server and browser render identical numbers (no hydration mismatch)
const r2 = (n: number) => Math.round(n * 100) / 100;
const pt = (r: number, deg: number) => ({ x: r2(C + Math.cos(rad(deg)) * r), y: r2(C + Math.sin(rad(deg)) * r) });

export function Ch2Brain() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ToolId | null>(null);

  const nodes = useMemo(
    () =>
      ring.map((id) => {
        const deg = angleOf(id);
        const p = pt(R, deg);
        const s = pt(R - NODE - 6, deg);
        const e = pt(CORE, deg);
        return { id, deg, ...p, line: { x1: s.x, y1: s.y, x2: e.x, y2: e.y } };
      }),
    [],
  );

  const arcs = useMemo(
    () =>
      groups.map((k) => {
        const from = angleOf(k.tools[0]) - ARC_PAD;
        const to = angleOf(k.tools[k.tools.length - 1]) + ARC_PAD;
        const mid = (from + to) / 2;
        const a0 = pt(AR, from);
        const a1 = pt(AR, to);
        const pos = pt(AR, mid);
        const w = k.label.length * 7.4 + 30;
        return { ...k, d: `M ${a0.x} ${a0.y} A ${AR} ${AR} 0 0 1 ${a1.x} ${a1.y}`, pos, w };
      }),
    [],
  );

  // Build once when it scrolls into view, then keep a steady pulse of knowledge flowing to Juno.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const q = gsap.utils.selector(root);
        const lines = q(".b-line") as unknown as SVGLineElement[];
        lines.forEach((l) => {
          const len = l.getTotalLength();
          gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(".b-node", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
        gsap.set([".b-label", ".b-pulse"], { opacity: 0 });
        gsap.set(".b-core", { scale: 0.85, opacity: 0 });

        const ripple = () =>
          gsap.fromTo(
            ".b-ripple",
            { attr: { r: CORE }, opacity: 0.55 },
            { attr: { r: CORE + 46 }, opacity: 0, duration: 1.2, ease: "power2.out", overwrite: true },
          );
        let lastRipple = 0;

        // random pulses: any spoke, irregular gaps, sometimes two at once
        const dots = q(".b-pulse") as unknown as SVGCircleElement[];
        const busy = new Set<number>();
        let running = false;
        let next: gsap.core.Tween | null = null;
        let last = -1;
        const fire = () => {
          const free = nodes.map((_, i) => i).filter((i) => !busy.has(i) && i !== last);
          if (!free.length) return;
          const i = free[Math.floor(Math.random() * free.length)];
          last = i;
          busy.add(i);
          const n = nodes[i];
          gsap.fromTo(
            dots[i],
            { attr: { cx: n.line.x1, cy: n.line.y1 }, opacity: 0 },
            {
              keyframes: [
                { opacity: 1, duration: 0.5 },
                { attr: { cx: n.line.x2, cy: n.line.y2 }, duration: gsap.utils.random(2.2, 3.4), ease: "sine.inOut" },
                { opacity: 0, duration: 0.4 },
              ],
              onComplete: () => {
                busy.delete(i);
                const now = performance.now();
                if (now - lastRipple > 1200) {
                  lastRipple = now;
                  ripple();
                }
              },
            },
          );
        };
        const loop = () => {
          if (!running) return;
          fire();
          if (Math.random() < 0.15) gsap.delayedCall(gsap.utils.random(0.4, 0.9), fire);
          next = gsap.delayedCall(gsap.utils.random(0.8, 2.0), loop);
        };
        const pulses = {
          play: () => {
            if (running) return;
            running = true;
            loop();
          },
          pause: () => {
            running = false;
            next?.kill();
          },
        };

        const build = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        build
          .to(".b-core", { scale: 1, opacity: 1, duration: 0.8 }, 0)
          .to(".b-node", { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05 }, 0.2)
          .to(lines, { strokeDashoffset: 0, duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, 0.5)
          .to(".b-label", { opacity: 1, duration: 0.5, stagger: 0.08 }, 1.2);

        ScrollTrigger.create({ trigger: ".b-graph", start: "top 70%", once: true, onEnter: () => build.play() });
        // only pulse while on screen
        ScrollTrigger.create({
          trigger: ".b-graph",
          start: "top 60%",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? pulses.play() : pulses.pause()),
        });
      });
    },
    { scope: root },
  );

  const related = active ? new Set(groups.filter((k) => k.tools.includes(active)).map((k) => k.id)) : null;

  return (
    <section ref={root} id="brain" aria-labelledby="ch2-title" className="chapter">
      <div className="container-page">
        <Reveal>
          <ChapterIntro
            id="ch2-title"
            lead="Every tool."
            muted="One brain."
            sub="Juno connects your customers, product, sales, and support into one picture it can act on."
          />
        </Reveal>

        {/* Desktop: the brain */}
        <div className="b-graph relative mx-auto mt-10 hidden aspect-[800/720] w-full max-w-[860px] md:block">
          <svg
            viewBox="-40 0 800 720"
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label="Juno at the center of ten connected tools grouped into customers, sales, support, product, brand, and market. Information pulses from every tool into Juno."
          >
            <defs>
              <filter id="pulseGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* tool to Juno lines, kept faint */}
            {nodes.map((n) => (
              <line
                key={n.id}
                className="b-line"
                {...n.line}
                stroke={active === n.id ? "#A6BBFF" : "#FFFFFF"}
                strokeWidth={1}
                style={{ opacity: active === n.id ? 0.7 : active ? 0.04 : 0.08, transition: "opacity 200ms, stroke 200ms" }}
              />
            ))}

            {/* Juno receives */}
            <circle className="b-ripple" cx={C} cy={C} r={CORE} fill="none" stroke="#A6BBFF" strokeWidth="1.5" opacity="0" />

            {/* pulses */}
            {nodes.map((n) => (
              <circle key={n.id} className="b-pulse" cx={n.line.x2} cy={n.line.y2} r="4" fill="#D6DFFF" filter="url(#pulseGlow)" style={{ opacity: 0 }} />
            ))}

            {/* tool nodes */}
            {nodes.map((n) => {
              const t = tools[n.id];
              const on = active === n.id;
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                  <g
                    className="b-node cursor-pointer outline-none"
                    tabIndex={0}
                    role="img"
                    aria-label={t.name}
                    onPointerEnter={() => setActive(n.id)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(n.id)}
                    onBlur={() => setActive(null)}
                  >
                    <circle r={NODE + 10} fill="transparent" />
                    <circle
                      r={NODE}
                      fill="#0E1218"
                      stroke={on ? "#A6BBFF" : "rgba(255,255,255,0.14)"}
                      strokeWidth={on ? 1.5 : 1}
                      style={{ transition: "stroke 150ms" }}
                    />
                    <g transform="translate(-11 -11)">
                      <BrandMark id={n.id} size={22} dark />
                    </g>
                  </g>
                </g>
              );
            })}

            {/* area labels sit on their arcs */}
            {arcs.map((a) => {
              const on = related?.has(a.id);
              const dim = related && !on;
              return (
                <g key={a.id} transform={`translate(${a.pos.x} ${a.pos.y})`}>
                  <g className="b-label" style={{ opacity: dim ? 0.45 : 1, transition: "opacity 200ms" }}>
                    <rect
                      x={-a.w / 2}
                      y={-15}
                      width={a.w}
                      height={30}
                      rx={15}
                      fill="#0B0E14"
                      stroke={on ? "#A6BBFF" : "rgba(255,255,255,0.14)"}
                      style={{ transition: "stroke 200ms" }}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="14"
                      fontWeight="500"
                      fill={on ? "#F4F6F8" : "#9AA6B8"}
                      style={{ transition: "fill 200ms" }}
                    >
                      {a.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          <div className="b-core absolute z-10" style={{ left: `${((C + 40) / 800) * 100}%`, top: `${(C / 720) * 100}%`, translate: "-50% -50%" }}>
            <Mascot size={112} state="idle" halo={false} float wander interactive />
          </div>
        </div>

        {/* Mobile: areas as a simple list */}
        <Reveal as="ul" className="mt-10 space-y-3 md:hidden" aria-label="Connected knowledge">
          {groups.map((k) => (
            <li key={k.id} className="rounded-md border border-line bg-surface p-4">
              <p className="mb-3 text-[15px] font-medium">{k.label}</p>
              <div className="flex flex-wrap gap-2">
                {k.tools.map((id) => (
                  <span key={id} className="inline-flex h-8 items-center gap-2 rounded-full border border-line bg-surface-2 px-3 text-[13px] text-text">
                    <BrandMark id={id} size={14} dark />
                    {tools[id].name}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
