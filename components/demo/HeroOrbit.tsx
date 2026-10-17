"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { tools, type ToolId } from "@/lib/story";

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

export function HeroOrbit({
  children,
  started,
  onFocusPill,
  onDone,
  onStatus,
}: {
  children: ReactNode;
  /** Chips appear and start moving once the intro is done. */
  started: boolean;
  onFocusPill?: (el: HTMLElement | null) => void;
  /** Called when a task swings to the front and is done. */
  onDone?: (text: string) => void;
  /** Tasks still in motion, derived from chip state. */
  onStatus?: (inMotion: number) => void;
}) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const pillEls = useRef<(HTMLDivElement | null)[]>([]);
  // start with the front chip just past done, so the first flip comes quickly
  const state = useRef(heroTasks.map((_, i) => ({ a: 0.9 + (i * TAU) / COUNT, done: false })));
  const speed = useRef(1);
  const target = useRef(1);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const startedRef = useRef(started);
  const cbs = useRef({ onFocusPill, onDone, onStatus });

  useEffect(() => {
    startedRef.current = started;
    cbs.current = { onFocusPill, onDone, onStatus };
  });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const section = el.closest("section");
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let lastCount = -1;
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
      speed.current += (target.current - speed.current) * Math.min(1, dt * 4);
      const p = pointer.current;
      p.x += (p.tx - p.x) * Math.min(1, dt * 3);
      p.y += (p.ty - p.y) * Math.min(1, dt * 3);
      const w = el.clientWidth;
      const h = el.clientHeight;
      const mobile = w < 640;
      const r = mobile ? { rx: w * 0.2, ry: h * 0.4 } : { rx: Math.min(430, w * 0.38), ry: h * 0.38 };
      let inMotion = 0;
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
        // Juno works the chip as it comes round the front: it leans in, then flips to Done.
        const work = Math.max(0, (depth - 0.72) / 0.28);
        const pull = 1 - work * 0.1;
        // keep the whole chip on screen, whatever the width
        const half = node.offsetWidth / 2 + 8;
        const x = Math.min(w - half, Math.max(half, w / 2 + Math.cos(s.a) * r.rx * pull + p.x * depthPx[i]));
        const y = h / 2 + Math.sin(s.a) * r.ry * pull + p.y * depthPx[i] - work * 6;
        if (!s.done && depth > 0.97) {
          s.done = true;
          node.dataset.done = "true";
          if (startedRef.current && !reduce) cbs.current.onDone?.(heroTasks[i].text);
        } else if (s.done && depth < -0.6) {
          s.done = false;
          node.dataset.done = "false";
        }
        node.dataset.working = work > 0.05 && !s.done ? "true" : "false";
        if (!s.done) inMotion++;
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${0.8 + k * 0.2 + work * 0.03})`;
        node.style.opacity = startedRef.current ? String(0.2 + k * 0.8) : "0";
        node.style.zIndex = depth > 0 ? "30" : "5";
        node.style.filter = depth < -0.2 ? `blur(${(-depth - 0.2) * 1.8}px)` : "none";
      });
      if (inMotion !== lastCount) {
        lastCount = inMotion;
        cbs.current.onStatus?.(inMotion);
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
      {/* the orbit: a hairline ring with a faint inner track */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="orbitRing" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#7A8FFF" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="hidden md:block">
          <ellipse cx="50" cy="50" rx="38" ry="38" fill="none" stroke="url(#orbitRing)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <ellipse cx="50" cy="50" rx="27" ry="27" fill="none" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
        </g>
        <ellipse cx="50" cy="50" rx="38" ry="36" fill="none" stroke="url(#orbitRing)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="md:hidden" />
      </svg>

      {/* Juno at the center */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">{children}</div>

      {/* tasks in orbit */}
      {heroTasks.map((t, i) => {
        const tool = tools[t.tool];
        return (
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
            className="group absolute left-0 top-0 opacity-0 will-change-transform"
          >
            <div className="flex items-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/[0.08] bg-[#0E1218]/80 py-1.5 pl-1.5 pr-1.5 shadow-[0_14px_34px_-18px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-[border-color,background-color] duration-200 group-hover:border-white/[0.16] group-data-[working=true]:border-white/[0.16] group-data-[working=true]:bg-[#151A22]/90">
              <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-white/[0.06] ring-1 ring-inset ring-white/[0.06]">
                <svg viewBox="0 0 24 24" width="14" height="14" fill={tool.hex.toUpperCase() === "#FFFFFF" ? "#F4F6F8" : tool.hex} aria-hidden>
                  <path d={tool.path} />
                </svg>
              </span>
              <span className="text-[13px] text-text md:text-[13.5px]">{t.text}</span>
              {/* status: In progress → Done (snap) */}
              <span className="relative grid h-[22px] min-w-[100px] overflow-hidden rounded-full bg-white/[0.05] font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] transition-colors duration-[120ms] [transition-timing-function:cubic-bezier(0.3,0,0,1)] group-data-[done=true]:bg-[#3DD68C]/[0.12]">
                <span className="col-start-1 row-start-1 flex items-center justify-center gap-1.5 px-2 text-muted transition-[transform,opacity] duration-[120ms] [transition-timing-function:cubic-bezier(0.3,0,0,1)] group-data-[done=true]:-translate-y-full group-data-[done=true]:opacity-0">
                  <span className="size-1.5 rounded-full bg-white/30 group-data-[working=true]:animate-pulse group-data-[working=true]:bg-[#7A8FFF]" />
                  In progress
                </span>
                <span className="col-start-1 row-start-1 flex translate-y-full items-center justify-center gap-1 px-2 text-[#3DD68C] opacity-0 transition-[transform,opacity] duration-[120ms] [transition-timing-function:cubic-bezier(0.3,0,0,1)] group-data-[done=true]:translate-y-0 group-data-[done=true]:opacity-100">
                  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
                    <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Done
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
