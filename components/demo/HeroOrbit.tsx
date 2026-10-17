"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { type ToolId } from "@/lib/story";

/** The six tasks Juno is working through. Each rides the orbit and gets done at the front. */
export const heroTasks: { tool: ToolId; text: string }[] = [
  { tool: "gmail", text: "Investor update" },
  { tool: "linear", text: "Triage 6 bugs" },
  { tool: "slack", text: "Release notes to #launch" },
  { tool: "hubspot", text: "Follow up with Northwind" },
  { tool: "notion", text: "Weekly metrics report" },
  { tool: "intercom", text: "Answer 4 setup questions" },
];

const TAU = Math.PI * 2;
const COUNT = heroTasks.length;
/** Parallax travel per chip, px (4 to 12). */
const depthPx = [9, 5, 12, 7, 11, 4];
/** Juno's radius, px: the beam leaves from the edge of the orb. */
const ORB = 72;

export function HeroOrbit({
  children,
  started,
  onFocusPill,
  onDone,
}: {
  children: ReactNode;
  /** Chips appear and start moving once the intro is done. */
  started: boolean;
  onFocusPill?: (el: HTMLElement | null) => void;
  /** Called when a task swings to the front and is done. */
  onDone?: (text: string) => void;
}) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const pillEls = useRef<(HTMLDivElement | null)[]>([]);
  const beam = useRef<SVGLineElement>(null);
  const beamGlow = useRef<SVGLineElement>(null);
  const beamGrad = useRef<SVGLinearGradientElement>(null);
  const spark = useRef<SVGCircleElement>(null);
  const comet = useRef<SVGCircleElement>(null);
  const cometA = useRef(-Math.PI / 2);
  const state = useRef(heroTasks.map((_, i) => ({ a: 0.9 + (i * TAU) / COUNT, done: false })));
  const speed = useRef(1);
  const target = useRef(1);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const startedRef = useRef(started);
  const cbs = useRef({ onFocusPill, onDone });

  useEffect(() => {
    startedRef.current = started;
    cbs.current = { onFocusPill, onDone };
  });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const section = el.closest("section");
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let flow = 0;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const parallax = window.matchMedia("(pointer: fine) and (min-width: 768px)").matches && !reduce;
    const onMove = (e: PointerEvent) => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      pointer.current.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => ((pointer.current.tx = 0), (pointer.current.ty = 0));
    if (parallax && section) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      flow = (flow + dt) % 1;
      speed.current += (target.current - speed.current) * Math.min(1, dt * 4);
      const p = pointer.current;
      p.x += (p.tx - p.x) * Math.min(1, dt * 3);
      p.y += (p.ty - p.y) * Math.min(1, dt * 3);
      const w = el.clientWidth;
      const h = el.clientHeight;
      const mobile = w < 640;
      const r = mobile ? { rx: w * 0.2, ry: h * 0.4 } : { rx: Math.min(430, w * 0.38), ry: h * 0.38 };
      const cx = w / 2;
      const cy = h / 2;
      let best = { work: 0, x: 0, y: 0, top: 0 };
      state.current.forEach((s, i) => {
        const node = pillEls.current[i];
        if (!node) return;
        if (mobile && i % 2 === 1) {
          node.style.opacity = "0";
          return;
        }
        if (startedRef.current && !reduce) s.a = (s.a + dt * speed.current * 0.13) % TAU;
        const depth = Math.sin(s.a); // 1 = front, -1 = back
        const k = (depth + 1) / 2;
        // Juno works the chip as it comes round the front: it leans in, fills, then flips to Done.
        const work = s.done ? 0 : Math.max(0, (depth - 0.6) / 0.37);
        const half = node.offsetWidth / 2 + 8;
        const x = Math.min(w - half, Math.max(half, cx + Math.cos(s.a) * r.rx + p.x * depthPx[i]));
        const y = cy + Math.sin(s.a) * r.ry + p.y * depthPx[i];
        if (!s.done && depth > 0.97) {
          s.done = true;
          node.dataset.done = "true";
          if (startedRef.current && !reduce) cbs.current.onDone?.(heroTasks[i].text);
        } else if (s.done && depth < -0.6) {
          s.done = false;
          node.dataset.done = "false";
        }
        const wk = Math.min(1, work);
        node.dataset.working = wk > 0.02 ? "true" : "false";
        node.style.setProperty("--work", String(wk));
        if (wk > best.work) best = { work: wk, x, y, top: y - node.offsetHeight / 2 };
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${0.78 + k * 0.22})`;
        node.style.opacity = startedRef.current ? String(0.16 + k * 0.84) : "0";
        node.style.zIndex = depth > 0 ? "30" : "5";
        node.style.filter = depth < -0.1 ? `blur(${(-depth - 0.1) * 2.2}px)` : "none";
      });

      // a point of light running the orbit, dimmer as it passes behind Juno
      if (comet.current) {
        if (!reduce) cometA.current = (cometA.current + dt * 0.7) % TAU;
        const ca = cometA.current;
        const d = Math.sin(ca);
        comet.current.setAttribute("cx", String(cx + Math.cos(ca) * r.rx));
        comet.current.setAttribute("cy", String(cy + Math.sin(ca) * r.ry));
        comet.current.style.opacity = startedRef.current && !mobile ? String(0.15 + ((d + 1) / 2) * 0.75) : "0";
      }

      // the beam: from the edge of the orb to the chip being worked on
      if (beam.current && beamGlow.current && beamGrad.current && spark.current) {
        const show = startedRef.current && !reduce && best.work > 0.02 && !mobile;
        const tx = best.x;
        const ty = best.top;
        const dx = tx - cx;
        const dy = ty - cy;
        const len = Math.hypot(dx, dy) || 1;
        const sx = cx + (dx / len) * ORB;
        const sy = cy + (dy / len) * ORB;
        const op = show ? Math.min(1, best.work * 2.2) * (1 - Math.max(0, best.work - 0.92) * 8) : 0;
        for (const l of [beam.current, beamGlow.current]) {
          l.setAttribute("x1", String(sx));
          l.setAttribute("y1", String(sy));
          l.setAttribute("x2", String(tx));
          l.setAttribute("y2", String(ty));
        }
        beamGrad.current.setAttribute("x1", String(sx));
        beamGrad.current.setAttribute("y1", String(sy));
        beamGrad.current.setAttribute("x2", String(tx));
        beamGrad.current.setAttribute("y2", String(ty));
        beam.current.style.opacity = String(op * 0.45);
        beamGlow.current.style.opacity = String(op * 0.2);
        // a spark travelling down the beam, Juno handing off work
        const f = (flow * 1.6) % 1;
        spark.current.setAttribute("cx", String(sx + (tx - sx) * f));
        spark.current.setAttribute("cy", String(sy + (ty - sy) * f));
        spark.current.style.opacity = String(op * 0.55 * Math.sin(Math.PI * f));
      }

      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = window.setTimeout(() => (raf = requestAnimationFrame(frame)), 250) as unknown as number;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(raf);
      io.disconnect();
      section?.removeEventListener("pointermove", onMove);
      section?.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div ref={box} className="relative h-[290px] w-full max-w-[1180px] md:h-[340px]">
      {/* the orbit in perspective: back half dim, front half lit, a comet running round */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="orbitFront" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7A8FFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#9DB0FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7A8FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="hidden md:block">
          <path d="M12 50 A38 38 0 0 1 88 50" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M88 50 A38 38 0 0 1 12 50" fill="none" stroke="url(#orbitFront)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <ellipse cx="50" cy="50" rx="26" ry="26" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="1 5" vectorEffect="non-scaling-stroke" />
        </g>
        <g className="md:hidden">
          <path d="M12 50 A38 36 0 0 1 88 50" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M88 50 A38 36 0 0 1 12 50" fill="none" stroke="url(#orbitFront)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>

      {/* Juno's beam to the task in hand (pixel space) */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 z-[25] h-full w-full overflow-visible">
        <defs>
          <linearGradient id="beamGrad" ref={beamGrad} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#50E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8F7CFF" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <line ref={beamGlow} stroke="#5B7CFF" strokeWidth="6" strokeLinecap="round" style={{ opacity: 0, filter: "blur(4px)" }} />
        <line ref={beam} stroke="url(#beamGrad)" strokeWidth="1.25" strokeLinecap="round" strokeDasharray="3 5" className="beam-flow" style={{ opacity: 0 }} />
        <circle ref={comet} r="2" fill="#DCE4FF" style={{ opacity: 0, filter: "drop-shadow(0 0 5px #9DB0FF) drop-shadow(0 0 12px #7A8FFF)" }} />
        <circle ref={spark} r="2.5" fill="#E6FBFF" style={{ opacity: 0, filter: "drop-shadow(0 0 6px #50E5FF)" }} />
      </svg>

      {/* Juno at the center */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">{children}</div>

      {/* tasks in orbit */}
      {heroTasks.map((t, i) => (
        <div
          key={t.text}
          ref={(el) => {
            pillEls.current[i] = el;
          }}
          data-done="false"
          data-working="false"
          onPointerEnter={(e) => {
            target.current = 0;
            cbs.current.onFocusPill?.(e.currentTarget);
          }}
          onPointerLeave={() => {
            target.current = 1;
            cbs.current.onFocusPill?.(null);
          }}
          className="orbit-chip group absolute left-0 top-0 opacity-0 will-change-transform"
        >
          <div className="relative flex items-center gap-3 whitespace-nowrap rounded-[18px] bg-[linear-gradient(180deg,rgba(28,34,48,0.82),rgba(14,18,24,0.82))] py-2 pl-2 pr-3 backdrop-blur-xl">
            {/* light edge: brighter on top, lit blue while Juno works it */}
            <span aria-hidden className="chip-edge pointer-events-none absolute inset-0 rounded-[18px]" />
            <BrandIcon id={t.tool} size={30} />
            <span className="text-[13.5px] font-medium tracking-[-0.01em] text-text">{t.text}</span>
            {/* status: a ring that fills while Juno works, then a check (snap) */}
            <span className="relative mr-1 grid size-[18px] shrink-0 place-items-center" aria-hidden>
              <svg viewBox="0 0 20 20" width="18" height="18" className="absolute inset-0 -rotate-90 transition-opacity duration-[120ms] group-data-[done=true]:opacity-0" aria-hidden>
                <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="8" fill="none" stroke="#7A8FFF" strokeWidth="1.5" strokeLinecap="round" pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: "calc(1 - var(--work, 0))" }} />
              </svg>
              <svg viewBox="0 0 12 12" width="12" height="12" className="scale-50 text-[#3DD68C] opacity-0 transition-[opacity,transform] duration-[120ms] [transition-timing-function:cubic-bezier(0.3,0,0,1)] group-data-[done=true]:scale-100 group-data-[done=true]:opacity-100" aria-hidden>
                <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
