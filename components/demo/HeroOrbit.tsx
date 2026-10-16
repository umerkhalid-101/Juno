"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { tools, type ToolId } from "@/lib/story";

/** Tasks that flow through Juno's orbit. Pills pick up a new one each lap. */
const pool: { tool: ToolId; text: string }[] = [
  { tool: "gmail", text: "Investor update" },
  { tool: "linear", text: "Triage 6 bugs" },
  { tool: "slack", text: "Release notes to #launch" },
  { tool: "hubspot", text: "Follow up with Northwind" },
  { tool: "notion", text: "Weekly metrics report" },
  { tool: "intercom", text: "Answer 4 setup questions" },
  { tool: "drive", text: "Prep the call brief" },
  { tool: "github", text: "Summarize merged PRs" },
  { tool: "figma", text: "Export launch visuals" },
  { tool: "jira", text: "Sync partner tickets" },
  { tool: "gmail", text: "Reply to 12 customers" },
  { tool: "notion", text: "Update the launch doc" },
];

const TAU = Math.PI * 2;
const COUNT = 6;
const desktopPills = Array.from({ length: COUNT }, (_, i) => ({ a: 0.35 + (i * TAU) / COUNT, task: i }));

export function HeroOrbit({
  children,
  started,
  onFocusPill,
  onDone,
}: {
  children: ReactNode;
  /** Pills appear and start moving once the intro is done. */
  started: boolean;
  onFocusPill?: (el: HTMLElement | null) => void;
  /** Called when a task swings to the front and is done. */
  onDone?: (text: string) => void;
}) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const pillEls = useRef<(HTMLDivElement | null)[]>([]);
  const state = useRef(desktopPills.map((p) => ({ ...p, done: false })));
  const nextTask = useRef(desktopPills.length);
  const speed = useRef(1);
  const target = useRef(1);
  const startedRef = useRef(started);
  const onFocusRef = useRef(onFocusPill);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    startedRef.current = started;
    onFocusRef.current = onFocusPill;
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const setTask = (i: number, task: number) => {
      const p = pillEls.current[i];
      if (!p) return;
      const t = pool[task % pool.length];
      p.querySelector<SVGPathElement>("path")!.setAttribute("d", tools[t.tool].path);
      p.querySelector<SVGSVGElement>("svg")!.setAttribute("fill", tools[t.tool].hex.toUpperCase() === "#FFFFFF" ? "currentColor" : tools[t.tool].hex);
      p.querySelector<HTMLSpanElement>("[data-text]")!.textContent = t.text;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed.current += (target.current - speed.current) * Math.min(1, dt * 4);
      const w = el.clientWidth;
      const h = el.clientHeight;
      const mobile = w < 640;
      const r = mobile ? { rx: w * 0.4, ry: h * 0.34 } : { rx: Math.min(400, w * 0.36), ry: h * 0.36 };
      state.current.forEach((p, i) => {
        const node = pillEls.current[i];
        if (!node) return;
        if (mobile && i % 2 === 1) {
          node.style.opacity = "0";
          return;
        }
        if (startedRef.current && !reduce) p.a = (p.a + dt * speed.current * 0.14) % TAU;
        const x = w / 2 + Math.cos(p.a) * r.rx;
        const y = h / 2 + Math.sin(p.a) * r.ry;
        const depth = Math.sin(p.a); // 1 = front, -1 = back
        const k = (depth + 1) / 2;
        // Done as it swings across the front; picks up a new task at the back.
        if (!p.done && depth > 0.92) {
          p.done = true;
          node.dataset.done = "true";
          if (startedRef.current && !reduce) {
            onDoneRef.current?.(node.querySelector<HTMLSpanElement>("[data-text]")?.textContent ?? "");
          }
        } else if (p.done && depth < -0.92) {
          p.done = false;
          node.dataset.done = "false";
          setTask(i, nextTask.current++);
        }
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${0.82 + k * 0.18})`;
        node.style.opacity = startedRef.current ? String(0.22 + k * 0.78) : "0";
        node.style.zIndex = depth > 0 ? "30" : "5";
        node.style.filter = depth < -0.2 ? `blur(${(-depth - 0.2) * 1.6}px)` : "none";
      });
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = window.setTimeout(() => (raf = requestAnimationFrame(frame)), 250) as unknown as number;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(raf);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <div ref={box} className="relative h-[280px] w-full max-w-[1180px] md:h-[320px]">
      {/* tilted rings */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="orbitRing" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8FE3FF" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#A6BBFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C7B0FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="50" rx="36" ry="36" fill="none" stroke="url(#orbitRing)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="hidden md:block" />
        <ellipse cx="50" cy="50" rx="40" ry="34" fill="none" stroke="url(#orbitRing)" strokeWidth="1" vectorEffect="non-scaling-stroke" className="md:hidden" />
      </svg>

      {/* Juno at the center */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">{children}</div>

      {/* orbiting tasks */}
      {desktopPills.map((p, i) => {
        const t = pool[p.task];
        return (
          <div
            key={i}
            ref={(el) => {
              pillEls.current[i] = el;
            }}
            data-done="false"
            onPointerEnter={(e) => {
              target.current = 0;
              onFocusRef.current?.(e.currentTarget);
            }}
            onPointerLeave={() => {
              target.current = 1;
              onFocusRef.current?.(null);
            }}
            className="group absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 pl-2.5 pr-1.5 text-[12.5px] text-text/90 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-[border-color] duration-200 will-change-transform hover:border-[#A6BBFF]/40"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill={tools[t.tool].hex.toUpperCase() === "#FFFFFF" ? "currentColor" : tools[t.tool].hex} aria-hidden>
              <path d={tools[t.tool].path} />
            </svg>
            <span data-text>{t.text}</span>
            <span
              aria-hidden
              className="ml-0.5 grid size-4 place-items-center rounded-full border border-white/15 transition-[background-color,border-color] duration-150 group-data-[done=true]:border-transparent group-data-[done=true]:bg-success"
            >
              <svg viewBox="0 0 12 12" width="9" height="9" className="scale-50 opacity-0 transition-[opacity,transform] duration-150 group-data-[done=true]:scale-100 group-data-[done=true]:opacity-100">
                <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="#07111F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        );
      })}
    </div>
  );
}
