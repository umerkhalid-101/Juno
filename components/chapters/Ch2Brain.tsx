"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { Mascot } from "@/components/mascot/Mascot";
import { Reveal } from "@/components/ui/Reveal";
import { BrandMark } from "@/components/ui/BrandIcon";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { tools, type ToolId } from "@/lib/story";

/** Tools grouped by what they know. Neighbors on the ring share an area. */
const groups: { id: string; label: string; tools: ToolId[]; dot: string }[] = [
  { id: "customers", label: "Customers", tools: ["gmail", "slack"], dot: "#36C5F0" },
  { id: "sales", label: "Sales", tools: ["hubspot"], dot: "#FF7A59" },
  { id: "support", label: "Support", tools: ["intercom"], dot: "#1F8DED" },
  { id: "product", label: "Product", tools: ["linear", "jira", "github"], dot: "#5E6AD2" },
  { id: "brand", label: "Brand", tools: ["figma"], dot: "#A259FF" },
  { id: "market", label: "Market", tools: ["notion", "drive"], dot: "#FFBA00" },
];
const ring = groups.flatMap((g) => g.tools);
const groupOf = (id: ToolId) => groups.find((g) => g.tools.includes(id))!;
const STEP = 360 / ring.length;
const FIRST = -90 - STEP / 2; // centers the first group on top
const angleOf = (id: ToolId) => FIRST + ring.indexOf(id) * STEP;

/** The packet's color as it leaves each tool. */
const pulseColor: Record<ToolId, string> = {
  gmail: "#EA4335",
  slack: "#36C5F0",
  hubspot: "#FF7A59",
  intercom: "#1F8DED",
  linear: "#5E6AD2",
  jira: "#2684FF",
  github: "#F4F6F8",
  figma: "#A259FF",
  notion: "#F4F6F8",
  drive: "#FFBA00",
  calendar: "#4285F4",
};

/** Same diagram on every screen; mobile uses roomier proportions so it stays legible. */
const GEO = {
  desktop: { C: 360, R: 228, NODE: 28, AR: 318, CORE: 66, font: 13, logo: 22, dash: 46, vb: [-40, 0, 800, 720], mascot: 112, label: 7.4 },
  mobile: { C: 200, R: 124, NODE: 25, AR: 198, CORE: 50, font: 15, logo: 20, dash: 30, vb: [-60, -22, 520, 444], mascot: 80, label: 8.7 },
};

const rad = (d: number) => (d * Math.PI) / 180;
// rounded so server and browser render identical numbers (no hydration mismatch)
const r2 = (n: number) => Math.round(n * 100) / 100;

const mq = "(max-width: 767px)";
const subscribe = (cb: () => void) => {
  const m = window.matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useMobile = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(mq).matches,
    () => false,
  );

function geometry(mobile: boolean) {
  const g = mobile ? GEO.mobile : GEO.desktop;
  const pt = (r: number, deg: number) => ({ x: r2(g.C + Math.cos(rad(deg)) * r), y: r2(g.C + Math.sin(rad(deg)) * r) });
  const nodes = ring.map((id) => {
    const deg = angleOf(id);
    const p = pt(g.R, deg);
    const s = pt(g.R - g.NODE - 6, deg);
    const e = pt(g.CORE, deg);
    return { id, deg, ...p, line: { x1: s.x, y1: s.y, x2: e.x, y2: e.y }, len: r2(Math.hypot(e.x - s.x, e.y - s.y)) };
  });
  // areas sit evenly around the ring, one every 60 degrees, starting at the top
  const labels = groups.map((k, i) => {
    const deg = -90 + (i * 360) / groups.length;
    const t0 = pt(g.AR - g.font * 2.4, deg);
    const t1 = pt(g.AR - g.font * 1.5, deg);
    return { ...k, deg, pos: pt(g.AR, deg), tick: { x1: t0.x, y1: t0.y, x2: t1.x, y2: t1.y } };
  });
  return { g, nodes, labels };
}

export function Ch2Brain() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ToolId | null>(null);
  const mobile = useMobile();
  const { g, nodes, labels } = useMemo(() => geometry(mobile), [mobile]);

  // Build once when it scrolls into view, then knowledge keeps arriving at random.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const q = gsap.utils.selector(root);
        const lines = q(".b-line") as unknown as SVGLineElement[];
        lines.forEach((l, i) => gsap.set(l, { strokeDasharray: nodes[i].len, strokeDashoffset: nodes[i].len }));
        gsap.set(q(".b-node"), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
        gsap.set(q(".b-label"), { opacity: 0 });
        gsap.set(q(".b-core"), { scale: 0.85, opacity: 0 });
        const flows = q(".b-flow") as unknown as SVGLineElement[];
        flows.forEach((f, i) => gsap.set(f, { strokeDasharray: `${g.dash} ${nodes[i].len + g.dash * 2}`, strokeDashoffset: g.dash, opacity: 0 }));

        const ripple = () =>
          gsap.fromTo(q(".b-ripple"), { attr: { r: g.CORE }, opacity: 0.6 }, { attr: { r: g.CORE * 1.7 }, opacity: 0, duration: 1.4, ease: "power2.out", overwrite: true });
        let lastRipple = 0;

        // a packet of light leaves a random tool and travels the wire to Juno
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
          const lbl = q(`.b-label[data-g="${groupOf(n.id).id}"]`)[0];
          // the tool lights up as it sends, and so does its area
          gsap.fromTo(q(`.b-send[data-id="${n.id}"]`), { opacity: 0.9, attr: { r: g.NODE } }, { opacity: 0, attr: { r: g.NODE * 1.45 }, duration: 1.2, ease: "power2.out" });
          if (lbl) gsap.fromTo(lbl, { "--lit": 1 }, { "--lit": 0, duration: 2.4, ease: "power1.out" });
          gsap.fromTo(
            flows[i],
            { strokeDashoffset: g.dash, opacity: 0 },
            {
              keyframes: [
                { opacity: 1, duration: 0.3 },
                { strokeDashoffset: -n.len, duration: gsap.utils.random(2.2, 3.0), ease: "sine.inOut" },
              ],
              onComplete: () => {
                busy.delete(i);
                gsap.set(flows[i], { opacity: 0 });
                const now = performance.now();
                if (now - lastRipple > 1400) {
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
          if (Math.random() < 0.15) gsap.delayedCall(gsap.utils.random(0.6, 1.2), fire);
          next = gsap.delayedCall(gsap.utils.random(1.0, 2.0), loop);
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
          .to(q(".b-core"), { scale: 1, opacity: 1, duration: 0.8 }, 0)
          .to(q(".b-node"), { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05 }, 0.2)
          .to(lines, { strokeDashoffset: 0, duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, 0.5)
          .to(q(".b-label"), { opacity: 1, duration: 0.5, stagger: 0.08 }, 1.2);

        const graph = q(".b-graph")[0];
        const a = ScrollTrigger.create({ trigger: graph, start: "top 75%", once: true, onEnter: () => build.play() });
        // only pulse while on screen
        const b = ScrollTrigger.create({
          trigger: graph,
          start: "top 65%",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? pulses.play() : pulses.pause()),
        });
        return () => {
          pulses.pause();
          a.kill();
          b.kill();
        };
      });
    },
    { scope: root, dependencies: [mobile], revertOnUpdate: true },
  );

  const related = active ? new Set(groups.filter((k) => k.tools.includes(active)).map((k) => k.id)) : null;
  const [vx, vy, vw, vh] = g.vb;

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

        <div className="b-graph relative mx-auto mt-10 w-full max-w-[860px] md:mt-12" style={{ aspectRatio: `${vw} / ${vh}` }}>
          <svg
            viewBox={g.vb.join(" ")}
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label="Juno at the center of ten connected tools grouped into customers, sales, support, product, brand, and market. Information flows from every tool into Juno."
          >
            <defs>
              <radialGradient id="bNodeFill" cx="50%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#1A2130" />
                <stop offset="100%" stopColor="#0B0E14" />
              </radialGradient>
              <filter id="flowGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {nodes.map((n) => (
                <linearGradient key={n.id} id={`flow-${n.id}`} gradientUnits="userSpaceOnUse" x1={n.line.x1} y1={n.line.y1} x2={n.line.x2} y2={n.line.y2}>
                  <stop offset="0%" stopColor={pulseColor[n.id]} />
                  <stop offset="100%" stopColor="#B9C8FF" />
                </linearGradient>
              ))}
            </defs>

            {/* tool to Juno wires, kept faint */}
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

            {/* packets of light travelling the wires */}
            {nodes.map((n) => (
              <line key={n.id} className="b-flow" {...n.line} stroke={`url(#flow-${n.id})`} strokeWidth={mobile ? 2 : 2.5} strokeLinecap="round" filter="url(#flowGlow)" style={{ opacity: 0 }} />
            ))}

            {/* Juno receives */}
            <circle className="b-ripple" cx={g.C} cy={g.C} r={g.CORE} fill="none" stroke="#A6BBFF" strokeWidth="1.5" opacity="0" />

            {/* tool nodes */}
            {nodes.map((n) => {
              const t = tools[n.id];
              const on = active === n.id;
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                  <circle className="b-send" data-id={n.id} r={g.NODE} fill="none" stroke={pulseColor[n.id]} strokeWidth={1.5} style={{ opacity: 0 }} />
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
                    <circle r={g.NODE + 10} fill="transparent" />
                    <circle r={g.NODE} fill="url(#bNodeFill)" stroke={on ? "#A6BBFF" : "rgba(255,255,255,0.13)"} strokeWidth={on ? 1.5 : 1} style={{ transition: "stroke 150ms" }} />
                    <path d={`M ${r2(-g.NODE * 0.7)} ${r2(-g.NODE * 0.62)} A ${g.NODE} ${g.NODE} 0 0 1 ${r2(g.NODE * 0.7)} ${r2(-g.NODE * 0.62)}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                    <g transform={`translate(${-g.logo / 2} ${-g.logo / 2})`}>
                      <BrandMark id={n.id} size={g.logo} dark />
                    </g>
                  </g>
                </g>
              );
            })}

            {/* areas: quiet mono labels with a hairline tick toward Juno; they take their color when the area sends */}
            {labels.map((a) => {
              const on = related?.has(a.id);
              const dim = related && !on;
              return (
                <g key={a.id} className="b-label" data-g={a.id} style={{ opacity: dim ? 0.35 : 1, transition: "opacity 200ms", ["--lit" as string]: 0, ["--area" as string]: a.dot }}>
                  <line {...a.tick} className="b-tick" strokeWidth={1} strokeLinecap="round" />
                  <text
                    x={a.pos.x}
                    y={a.pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={g.font}
                    fontWeight="500"
                    letterSpacing="0.14em"
                    className="b-label-text font-mono uppercase"
                    data-on={on || undefined}
                  >
                    {a.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Juno at the center, with a slow light ring */}
          <div className="b-core absolute z-10 grid place-items-center" style={{ left: `${((g.C - vx) / vw) * 100}%`, top: `${((g.C - vy) / vh) * 100}%`, translate: "-50% -50%" }}>
            <span aria-hidden className="juno-halo pointer-events-none absolute rounded-full" style={{ width: g.mascot * 1.5, height: g.mascot * 1.5, opacity: 0.22 }} />
            <span aria-hidden className="juno-ring pointer-events-none absolute rounded-full" style={{ width: g.mascot + 22, height: g.mascot + 22 }} />
            <Mascot size={g.mascot} state="idle" halo={false} float wander={!mobile} interactive />
          </div>
        </div>
      </div>
    </section>
  );
}
