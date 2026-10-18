"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { ArrowDown, Check, CheckCheck, ChevronsLeftRight, Flag, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { apps } from "@/lib/apps";
import { calm, snap } from "./kit";

const h = apps.hero;
const b = h.builds[0];

/** Built: the real app. Wire: the same app as Juno's blueprint of it. */
const BUILT = { bg: "#FFFFFF", chrome: "#F3F4F7", ink: "#1b1d24", muted: "#5d6370", accent: "#324CFF", soft: "#E7ECFF", line: "rgba(0,0,0,0.07)" };
const WIRE = "#8EA2FF";

/**
 * The hero: one window, split by a seam. Left of it is Juno's blueprint of the app; right of it is
 * the app, built. It sweeps across once when you arrive; then the seam is yours to drag.
 */
export function AppsHeroWireframe() {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.4 });
  const pct = useMotionValue(reduce ? 50 : 100);
  const [val, setVal] = useState(reduce ? 50 : 100);
  const [touched, setTouched] = useState(false);
  const [ready, setReady] = useState(false);
  const dragging = useRef(false);
  const clip = useMotionTemplate`inset(0 calc(100% - ${pct}%) 0 0)`;
  const left = useMotionTemplate`${pct}%`;

  useEffect(() => pct.on("change", (v) => setVal(Math.round(v))), [pct]);

  // the reveal: blueprint becomes software, once
  useEffect(() => {
    if (!seen || reduce || touched) return;
    const c = animate(pct, [100, 8, 42], { duration: 2.8, ease: [0.65, 0, 0.35, 1], times: [0, 0.62, 1], delay: 0.5 });
    return () => c.stop();
  }, [seen, reduce, touched, pct]);

  const setFrom = (clientX: number) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    pct.stop();
    pct.set(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  const down = (e: ReactPointerEvent) => {
    // the Mark ready button stays a button
    if ((e.target as HTMLElement).closest("button")) return;
    dragging.current = true;
    setTouched(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFrom(e.clientX);
  };
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowLeft" ? -5 : e.key === "ArrowRight" ? 5 : e.key === "Home" ? -100 : e.key === "End" ? 100 : 0;
    if (!step) return;
    e.preventDefault();
    setTouched(true);
    pct.stop();
    pct.set(Math.max(0, Math.min(100, pct.get() + step)));
  };

  return (
    <section aria-labelledby="apps-title" className="relative overflow-x-clip pt-[140px] md:pt-[168px]">
      <div className="container-page">
        <header className="mx-auto max-w-[900px] text-center">
          <h1 id="apps-title" className="t-display-xl text-balance">
            {h.lead} <span className="accent-text block">{h.muted}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[44ch] text-pretty text-[18px] leading-[28px] text-muted">{h.sub}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href={CTA_HREF} variant="white" size="lg">
              {CTA_LABEL}
            </Button>
            <Button href="#website-blog-cms" variant="secondary" size="lg" trailing={<ArrowDown size={16} aria-hidden />}>
              {h.secondary}
            </Button>
          </div>
        </header>

        <div className="relative mx-auto mt-16 max-w-[1000px] md:mt-24">
          {/* glow 1 of 2 */}
          <div aria-hidden className="pointer-events-none absolute inset-x-[-8%] inset-y-[-6%] -z-10 opacity-50 blur-[100px]" style={{ background: "var(--glow)" }} />

          {/* the prompt this came from */}
          <p className="mb-5 text-center text-[15px] text-muted">
            “{b.prompt.map((x) => x.t).join("")}”
          </p>

          {/* the window: blueprint over built, cut by the seam */}
          <div
            ref={stage}
            onPointerDown={down}
            onPointerMove={(e) => dragging.current && setFrom(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            className="relative h-[600px] cursor-ew-resize select-none overflow-hidden rounded-[18px] shadow-[0_40px_120px_rgba(0,0,0,0.5)] ring-1 ring-white/10 [touch-action:pan-y] md:h-[620px]"
          >
            <LaunchApp ready={ready} onReady={() => setReady(true)} onReset={() => setReady(false)} />
            {!reduce && <Teammates />}

            {/* the blueprint, on top, showing left of the seam */}
            <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ clipPath: clip }}>
              <LaunchApp wire ready={false} />
            </motion.div>

            {/* the seam */}
            <motion.div className="pointer-events-none absolute inset-y-0 z-20 w-0" style={{ left }}>
              <span className="absolute inset-y-0 -left-px w-[2px] bg-[#A6BBFF] shadow-[0_0_18px_2px_rgba(122,143,255,0.7)]" />
              <span
                role="slider"
                tabIndex={0}
                aria-label="Blueprint to finished app"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={val}
                aria-valuetext={`${100 - val}% built`}
                onKeyDown={onKey}
                className="pointer-events-auto absolute top-1/2 grid h-11 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#A6BBFF] text-[#07111F] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF]"
              >
                <ChevronsLeftRight size={16} strokeWidth={2.25} aria-hidden />
              </span>
            </motion.div>

            {/* side labels */}
            <motion.span aria-hidden className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full bg-[#0B1226]/80 px-3 py-1 text-[12px] text-[#A6BBFF] ring-1 ring-[#8EA2FF]/30" style={{ opacity: val > 14 ? 1 : 0 }}>
              Juno&apos;s sketch
            </motion.span>
            <motion.span aria-hidden className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[12px] font-medium text-[#1b1d24] ring-1 ring-black/10" style={{ opacity: val < 86 ? 1 : 0 }}>
              Built by Juno
            </motion.span>
          </div>

          <p className="mt-5 text-center text-[14px] text-text">{b.reply}</p>
          <p className="mt-1 text-center text-[13px] text-subtle">{touched ? " " : "Drag to see it built"}</p>
        </div>
      </div>
    </section>
  );
}

/** A blueprint note on a part of the app. */
function Note({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-[5px] bg-[#0A1124] px-1.5 py-0.5 text-[10.5px] leading-none ring-1 ring-[#8EA2FF]/40 ${className}`} style={{ color: WIRE }}>
      {children}
    </span>
  );
}

/** The launch room. `wire` draws it as Juno's blueprint: same bones, outlines and notes only. */
function LaunchApp({ wire = false, ready, onReady, onReset }: { wire?: boolean; ready: boolean; onReady?: () => void; onReset?: () => void }) {
  const count = ready ? 4 : 3;
  const ink = wire ? WIRE : BUILT.ink;
  const muted = wire ? "rgba(142,162,255,0.6)" : BUILT.muted;
  const dashed = { border: `1px dashed ${WIRE}88` };
  const box = (built: React.CSSProperties) => (wire ? { ...dashed, background: "rgba(142,162,255,0.05)" } : built);

  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={
        wire
          ? {
              background: "#0A1124",
              backgroundImage: "linear-gradient(rgba(142,162,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(142,162,255,0.07) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              color: ink,
            }
          : { background: BUILT.bg, color: ink }
      }
    >
      {/* chrome */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b px-3.5" style={wire ? { borderColor: `${WIRE}33`, borderBottomStyle: "dashed" } : { background: BUILT.chrome, borderColor: "rgba(0,0,0,0.06)" }}>
        <span className="flex gap-1.5" aria-hidden>
          {(wire ? ["", "", ""] : ["#FF5F57", "#FEBC2E", "#28C840"]).map((c, i) => (
            <span key={i} className="size-[10px] rounded-full" style={wire ? dashed : { background: c }} />
          ))}
        </span>
        <span className="mx-auto flex h-6 items-center gap-1.5 rounded-full px-3 text-[11.5px]" style={wire ? { ...dashed, color: muted } : { background: "rgba(255,255,255,0.8)", color: BUILT.muted, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }}>
          <Lock size={10} aria-hidden />
          {b.url}
        </span>
        <span className="w-[46px]" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5 md:px-9 md:pt-6">
        {/* header */}
        <div className="flex items-center gap-2.5">
          <Flag size={15} strokeWidth={1.75} style={{ color: wire ? WIRE : BUILT.accent }} aria-hidden />
          <span className="text-[15px] font-semibold tracking-[-0.01em]">{b.title}</span>
          <span className="ml-auto flex -space-x-1.5">
            {[
              ["L", "#E7ECFF", "#3346e0"],
              ["S", "#E4F3EA", "#1f7a4d"],
              ["E", "#FDE6DE", "#c2441f"],
            ].map(([l, bg, fg]) => (
              <span key={l} className="grid size-7 place-items-center rounded-full text-[11px] font-semibold" style={wire ? { ...dashed, background: "#0A1124", color: WIRE } : { background: bg, color: fg, boxShadow: "0 0 0 2px #fff" }}>
                {l}
              </span>
            ))}
          </span>
        </div>

        <span className="mt-6 inline-flex h-6 w-fit items-center rounded-full px-2.5 text-[11.5px] font-medium" style={box({ background: BUILT.soft, color: BUILT.accent })}>
          {b.chip}
        </span>
        <p className="relative mt-2 w-fit text-[28px] font-semibold leading-[32px] tracking-[-0.03em] md:text-[34px] md:leading-[38px]">
          {b.name}
          {wire && <Note className="-right-16 top-1">Title</Note>}
        </p>
        <p className="mt-1 text-[14px]" style={{ color: muted }}>
          {b.sub}
        </p>

        {/* progress */}
        <div className="relative mt-5 flex items-center gap-5 rounded-[14px] px-5 py-4" style={wire ? { ...dashed, background: "rgba(142,162,255,0.06)" } : { background: BUILT.accent, color: "#fff" }}>
          {wire && <Note className="-top-2.5 left-4">Progress, from the checklist</Note>}
          <div className="shrink-0">
            <p className="flex items-baseline text-[26px] font-semibold leading-none">
              {wire ? count : <RollingNumber value={count} />}
              <span className="ml-0.5 text-[15px] font-normal opacity-70">/ 4</span>
              {!wire && <span className="sr-only">{count} of 4</span>}
            </p>
            <p className="mt-1 text-[11.5px] opacity-75">{b.stat}</p>
          </div>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: wire ? "transparent" : "rgba(255,255,255,0.25)", ...(wire ? dashed : {}) }}>
            {!wire && <motion.span className="absolute inset-y-0 left-0 rounded-full bg-white" animate={{ width: `${(count / 4) * 100}%` }} transition={{ duration: 0.8, ease: calm }} />}
          </span>
          <CheckCheck size={18} className="shrink-0 opacity-80" aria-hidden />
        </div>

        {/* checklist */}
        <ul className="relative mt-3">
          {wire && <Note className="-left-1 -top-1.5">Checklist · who owns what</Note>}
          {b.rows.map((r, i) => {
            const mine = i === b.rows.length - 1;
            const ok = !mine || ready;
            return (
              <li key={r.task} className="flex h-[50px] items-center gap-3 border-t text-[14px] first:border-0" style={{ borderColor: wire ? `${WIRE}2a` : BUILT.line, borderTopStyle: wire ? "dashed" : "solid" }}>
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-full"
                  style={wire ? dashed : ok ? { background: BUILT.accent, color: "#fff" } : { boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.25)" }}
                >
                  {ok && !wire && <Check size={11} strokeWidth={3} aria-hidden />}
                </span>
                <span className="flex-1 truncate">{r.task}</span>
                <span className="text-[12.5px]" style={{ color: muted }}>
                  {r.meta}
                </span>
                <span className="w-[108px] shrink-0 text-right">
                  {mine && !ready ? (
                    wire ? (
                      <span className="relative inline-flex h-8 items-center rounded-full px-3.5 text-[12.5px]" style={dashed}>
                        {b.action}
                        <Note className="-top-3.5 right-0">Your action</Note>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={onReady}
                        className="h-8 cursor-pointer whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-semibold text-white transition-[box-shadow,transform] duration-200 hover:shadow-[0_0_0_4px_rgba(50,76,255,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] active:scale-[0.97]"
                        style={{ background: BUILT.ink }}
                      >
                        {b.action}
                      </button>
                    )
                  ) : (
                    <motion.span
                      key={`${r.task}-${ok}`}
                      initial={mine && !wire ? { scale: 0.85, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.12, ease: snap }}
                      className="inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-medium"
                      style={box({ background: BUILT.soft, color: BUILT.accent })}
                    >
                      {b.tag}
                    </motion.span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {/* footer */}
        <div className="mt-auto flex items-center gap-2 pt-3 text-[12.5px]" style={{ color: muted }}>
          <span className="size-1.5 rounded-full" style={{ background: wire ? WIRE : BUILT.accent }} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(ready)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} aria-live={wire ? undefined : "polite"}>
              {ready ? b.done : b.note}
            </motion.span>
          </AnimatePresence>
          {ready && !wire && (
            <button type="button" onClick={onReset} className="ml-2 cursor-pointer text-[12px] underline-offset-2 hover:underline" style={{ color: BUILT.accent }}>
              Reset
            </button>
          )}
          <span className="ml-auto">{b.when}</span>
        </div>
      </div>
    </div>
  );
}

/** Two teammates already using what Juno just built. */
function Teammates() {
  const people = [
    { name: "Leo", color: "#3346e0", x: ["64%", "76%", "52%", "70%", "64%"], y: ["24%", "58%", "70%", "42%", "24%"], delay: 3.4 },
    { name: "Emma", color: "#e8532e", x: ["58%", "82%", "66%", "90%", "58%"], y: ["66%", "48%", "84%", "60%", "66%"], delay: 4 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {people.map((pp) => (
        <motion.span
          key={pp.name}
          className="absolute left-0 top-0 flex items-start"
          initial={{ left: pp.x[0], top: pp.y[0], opacity: 0 }}
          animate={{ left: pp.x, top: pp.y, opacity: 1 }}
          transition={{
            left: { duration: 14, ease: "easeInOut", repeat: Infinity, delay: pp.delay },
            top: { duration: 14, ease: "easeInOut", repeat: Infinity, delay: pp.delay },
            opacity: { duration: 0.4, delay: pp.delay },
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M3.5 2.5 21 10.2l-7.6 2.3-3.3 7.9z" fill={pp.color} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span className="ml-0.5 mt-3 rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.35)]" style={{ background: pp.color }}>
            {pp.name}
          </span>
        </motion.span>
      ))}
    </div>
  );
}
