"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Check, Loader2, MousePointer2, Pause, Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MascotMark } from "@/components/mascot/Mascot";
import { Browser, CANVAS } from "@/components/computer/Browser";
import { clock, easeInOut, prog, type Scenario } from "@/components/computer/kit";
import { reconcile } from "@/components/computer/sites/CloudHost";
import { offsite } from "@/components/computer/sites/Retreatly";
import { prices } from "@/components/computer/sites/Shopfront";
import { appstore } from "@/components/computer/sites/AppHarbor";

/**
 * "And a computer of its own to handle the rest."
 * A live loop of Juno's own screen: four jobs on sites with no integration, each ending on a
 * question for you. Everything on screen is a pure function of one clock, so pausing, jumping
 * between jobs and reduced motion all come for free. Juno never approves anything itself.
 */

const scenarios: Scenario[] = [appstore, reconcile, offsite, prices];
/** The frame we show without JS or with reduced motion: work done, question asked. */
const finalT = (s: Scenario) => s.askAt + 0.6;
const FADE = 0.45;

/**
 * Pacing: every job takes about 10 seconds of work, with a short beat after each step so you can
 * read what just happened, then the question for you stays up for a moment before the next job.
 */
const WORK = 10;
const ASK_REAL = 2.5;
const HOLD = 0.35;
const holds = new Map(
  scenarios.map((sc) => [
    sc.id,
    sc.cursor.map((k, i) => {
      const next = sc.cursor[i + 1];
      const nextMove = next ? Math.max(k.at + 0.15, next.at - 0.75) : Infinity;
      return { at: Math.min(k.at + 0.45, nextMove, sc.askAt), h: HOLD };
    }),
  ]),
);
/** Scene seconds of work (including the beats) squeezed or stretched into WORK real seconds. */
const workLen = (sc: Scenario) => sc.askAt + holds.get(sc.id)!.reduce((n, x) => n + x.h, 0);
const realDuration = () => WORK + ASK_REAL;
/** Real elapsed seconds to scene time. */
const warp = (sc: Scenario, rt: number) => {
  if (rt >= WORK) return Math.min(sc.duration, sc.askAt + ((rt - WORK) / ASK_REAL) * (sc.duration - sc.askAt));
  const w = (rt / WORK) * workLen(sc);
  let acc = 0;
  for (const x of holds.get(sc.id)!) {
    if (w < x.at + acc) return w - acc;
    if (w < x.at + acc + x.h) return x.at;
    acc += x.h;
  }
  return Math.min(sc.askAt, w - acc);
};
/** Scene time back to real elapsed seconds (for jumps and seeks). */
const unwarp = (sc: Scenario, t: number) => {
  if (t >= sc.askAt) return WORK + ((t - sc.askAt) / (sc.duration - sc.askAt)) * ASK_REAL;
  const w = t + holds.get(sc.id)!.filter((x) => x.at < t).reduce((n, x) => n + x.h, 0);
  return (w / workLen(sc)) * WORK;
};

export function ChComputer() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);

  const [si, setSi] = useState(0);
  const [t, setT] = useState(finalT(scenarios[0]));
  const [rt, setRt] = useState(unwarp(scenarios[0], finalT(scenarios[0])));
  const [scale, setScale] = useState(1);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const started = useRef(false);
  const clockRef = useRef({ si: 0, rt: unwarp(scenarios[0], finalT(scenarios[0])) });

  const s = scenarios[si];
  const running = inView && !hover && !userPaused && !hidden && !reduce;

  // fit the 760 × 540 design canvas to the space we have
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1.08, e.contentRect.width / CANVAS.w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // in view, tab visibility
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // the clock
  useEffect(() => {
    if (!running) return;
    if (!started.current) {
      // first time on screen: start the first job from the top
      started.current = true;
      clockRef.current = { si: clockRef.current.si, rt: 0 };
    }
    let raf = 0;
    let last = performance.now();
    let lastPaint = -1;
    let lastRt = -1;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const c = clockRef.current;
      c.rt += dt;
      if (c.rt >= realDuration()) {
        c.si = (c.si + 1) % scenarios.length;
        c.rt = 0;
        setSi(c.si);
      }
      const q = Math.round(warp(scenarios[c.si], c.rt) * 30) / 30;
      if (q !== lastPaint) {
        lastPaint = q;
        setT(q);
      }
      const qr = Math.round(c.rt * 30) / 30;
      if (qr !== lastRt) {
        lastRt = qr;
        setRt(qr);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // dev only: seek to any frame, for checking the demo without waiting on the clock
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    Object.assign(window, {
      __seekComputer: (i: number, at: number) => {
        clockRef.current = { si: i, rt: unwarp(scenarios[i], at) };
        started.current = true;
        setSi(i);
        setT(at);
        setRt(clockRef.current.rt);
      },
    });
  }, []);

  const jump = (i: number) => {
    const next = reduce ? finalT(scenarios[i]) : 0;
    started.current = true;
    clockRef.current = { si: i, rt: unwarp(scenarios[i], next) };
    setSi(i);
    setT(next);
    setRt(clockRef.current.rt);
  };

  // Juno's cursor: eased curves between targets, a ripple on each click. Derived from t.
  useLayoutEffect(() => {
    const cv = canvas.current;
    const cur = cursor.current;
    if (!cv || !cur) return;
    const box = cv.getBoundingClientRect();
    const k = box.width / CANVAS.w || 1;
    const at = (target: string, fallback: { x: number; y: number }) => {
      const el = cv.querySelector<HTMLElement>(`[data-c="${target}"]`);
      if (!el) return fallback;
      const r = el.getBoundingClientRect();
      return { x: (r.left - box.left + Math.min(r.width * 0.5, 60)) / k, y: (r.top - box.top + r.height * 0.6) / k };
    };
    const keys = s.cursor;
    let pos = { x: 420, y: 330 };
    let prevAt = 0;
    for (let i = 0; i < keys.length; i++) {
      const kf = keys[i];
      const target = at(kf.target, pos);
      if (t >= kf.at) {
        pos = target;
        prevAt = kf.at;
        continue;
      }
      const start = Math.max(prevAt + 0.15, kf.at - 0.75);
      const p = easeInOut(prog(t, start, kf.at));
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const bend = Math.sin(Math.PI * p) * Math.min(48, Math.hypot(dx, dy) * 0.16);
      const len = Math.hypot(dx, dy) || 1;
      pos = { x: pos.x + dx * p + (-dy / len) * bend, y: pos.y + dy * p + (dx / len) * bend };
      break;
    }
    const fade = Math.min(prog(t, 0.2, 0.5), 1 - prog(t, s.duration - FADE, s.duration));
    cur.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    cur.style.opacity = String(fade);
    const click = [...keys].reverse().find((kf) => kf.click && t >= kf.at);
    const rp = click ? prog(t, click.at, click.at + 0.45) : 1;
    if (ripple.current) {
      ripple.current.style.transform = `scale(${0.3 + rp * 2.2})`;
      ripple.current.style.opacity = String(rp < 1 ? 0.7 * (1 - rp) : 0);
    }
  }, [t, si, s, scale]);

  const asking = t >= s.askAt;
  const fadeOut = 1 - prog(t, s.duration - FADE, s.duration);
  const fadeIn = reduce ? 1 : prog(t, 0, 0.35);
  const chrome = s.chrome(t);
  const Page = s.Page;
  const log = s.log.filter((l) => t >= l.at);

  return (
    <section ref={section} id="computer" aria-labelledby="computer-title" className="chapter">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[900px] text-center">
          <h2 id="computer-title" className="text-[40px] font-medium leading-[44px] tracking-[-0.035em] text-balance md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[66px]">
            And a computer of its own <span className="block text-muted">to handle the rest.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-[17px] leading-[27px] text-muted">
            No integration? Juno signs in, clicks through, and does the hard part on its own secure computer.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-12 w-full max-w-[1140px] md:mt-16">
          {/* Juno glow (glow 2 of 2), faint, behind the computer */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[45%] -z-10 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[90px]" style={{ background: "var(--glow)" }} />

          {/* jobs as tabs, live label, pause */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div role="tablist" aria-label="Jobs Juno can do on its computer" className="flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none] max-md:[mask-image:linear-gradient(90deg,#000_85%,transparent)] [&::-webkit-scrollbar]:hidden">
              {scenarios.map((sc, i) => {
                const on = i === si;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => jump(i)}
                    className={`relative h-11 shrink-0 rounded-full px-4 text-[14px] transition-colors duration-200 ${on ? "bg-white/[0.06] text-text" : "text-muted hover:text-text"}`}
                  >
                    {sc.tab}
                    {on && (
                      <span aria-hidden className="absolute inset-x-4 bottom-1.5 h-px overflow-hidden rounded-full bg-white/10">
                        <span className="block h-full origin-left bg-[#F4F6F8]" style={{ transform: `scaleX(${reduce ? 1 : Math.min(1, rt / realDuration())})` }} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <span className="t-eyebrow inline-flex items-center gap-2 text-muted">
                <span className={`size-2 rounded-full ${running ? "rec-dot bg-[#FF6568]" : "bg-white/30"}`} />
                Juno&apos;s computer · {running ? "Live" : "Paused"}
              </span>
              {!reduce && (
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? "Play the demo" : "Pause the demo"}
                  className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-text transition-colors hover:bg-white/[0.08]"
                >
                  {userPaused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
                </button>
              )}
            </div>
          </div>

          {/* a dark MacBook */}
          <div className="relative rounded-t-[22px] rounded-b-[6px] bg-[linear-gradient(180deg,#2a2c31,#16171a)] p-[10px] pb-[12px] shadow-[0_40px_120px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] md:p-[12px] md:pb-[14px]">
            <div className="relative overflow-hidden rounded-[12px] bg-black p-[2px]">
              <span aria-hidden className="absolute left-1/2 top-0 z-40 h-[14px] w-[110px] -translate-x-1/2 rounded-b-[8px] bg-black" />
              <div className="relative flex gap-4 overflow-hidden rounded-[10px] bg-[radial-gradient(120%_120%_at_0%_0%,#1d2440_0%,#121729_45%,#0b0e18_100%)] p-3 md:p-4">
                {/* the browser, scaled from its design canvas */}
                <div ref={area} className="relative min-w-0 flex-1" style={{ height: CANVAS.h * scale }} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
                  <div
                    ref={canvas}
                    className="absolute left-0 top-0 origin-top-left"
                    style={{ width: CANVAS.w, height: CANVAS.h, transform: `scale(${scale})`, opacity: Math.min(fadeOut, fadeIn) }}
                    aria-hidden
                  >
                    <Browser chrome={chrome}>
                      <Page t={t} />
                    </Browser>

                    {/* Juno's cursor */}
                    <div ref={cursor} className="pointer-events-none absolute left-0 top-0 z-30" style={{ opacity: 0 }}>
                      <span ref={ripple} className="absolute -left-3 -top-3 size-6 rounded-full border-2 border-[#8F7CFF]" style={{ opacity: 0 }} />
                      <MousePointer2 size={26} strokeWidth={1.5} className="relative -translate-x-[3px] -translate-y-[2px] fill-[#5b74ff] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]" />
                      <span className="absolute left-5 top-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#1b2134] py-1 pl-1 pr-3.5 text-[14px] font-medium text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                        <MascotMark size={26} />
                        Juno
                      </span>
                    </div>
                  </div>

                  {/* mobile: the question overlays the frame */}
                  {asking && (
                    <div className="ask-in absolute inset-x-2 bottom-2 z-40 rounded-xl bg-[#151A22]/95 p-2.5 ring-1 ring-white/10 backdrop-blur md:hidden">
                      <Ask question={s.approval} compact />
                    </div>
                  )}
                </div>

                {/* Juno's activity log */}
                <div className="hidden w-[300px] shrink-0 flex-col rounded-2xl bg-[#0E1218]/95 p-4 ring-1 ring-white/[0.08] md:flex" style={{ height: CANVAS.h * scale }}>
                  <div className="mb-4 flex items-center gap-2.5">
                    <MascotMark size={28} />
                    <span className="flex-1">
                      <span className="block text-[14px] font-medium text-text">Juno</span>
                      <span className="t-eyebrow block !text-[11px] text-muted">{asking ? "Needs you" : "Working"}</span>
                    </span>
                    <span className="t-eyebrow !text-[11px] tabular-nums text-subtle">{clock(si * 40 + t)}</span>
                  </div>
                  <ul className="min-h-0 flex-1 space-y-3 overflow-hidden" aria-hidden>
                    {log.map((l) => {
                      const done = t >= (l.done ?? l.at + 0.8);
                      return (
                        <li key={`${s.id}-${l.text}`} className="log-in flex gap-2.5">
                          <span className={`mt-[3px] grid size-4 shrink-0 place-items-center rounded-full transition-colors duration-[120ms] ${done ? "bg-[#3DD68C]/15 text-[#3DD68C]" : "text-muted"}`}>
                            {done ? <Check size={10} strokeWidth={3} /> : <Loader2 size={12} className="animate-spin" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="t-eyebrow block !text-[10.5px] text-subtle">{clock(si * 40 + l.at)}</span>
                            <span className={`block text-[13px] leading-[18px] ${done ? "text-text" : "text-muted"}`}>{!done && l.live ? l.live(t) : l.text}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {asking && (
                    <div className="ask-in mt-3 rounded-2xl bg-[#151A22] p-3.5 ring-1 ring-white/10">
                      <Ask question={s.approval} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden className="relative -mx-[5%] h-[14px] rounded-b-[18px] rounded-t-[3px] bg-[linear-gradient(180deg,#3a3c42_0%,#1c1d21_60%,#0e0f11_100%)] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)]">
            <span className="absolute left-1/2 top-0 h-[6px] w-[16%] -translate-x-1/2 rounded-b-[8px] bg-[#121316]" />
          </div>

          <p className="sr-only" aria-live="polite">
            {s.tab}: Juno does the work on its own computer, then asks: {s.approval}
          </p>
        </div>
      </div>
    </section>
  );
}

/** The approval prompt. Juno waits here: nothing is approved on your behalf. */
function Ask({ question, compact = false }: { question: string; compact?: boolean }) {
  return (
    <>
      <p className="t-eyebrow inline-flex items-center gap-1.5 !text-[11px] text-[#FFB547]">
        <span className="size-1.5 rounded-full bg-[#FFB547]" />
        Needs your yes
      </p>
      <p className={`mt-1.5 text-text ${compact ? "text-[13px] leading-[18px]" : "text-[14px] leading-[20px]"}`}>{question}</p>
      <span className={`flex gap-2 ${compact ? "mt-2" : "mt-3"}`} aria-hidden>
        <span className={`inline-flex ${compact ? "h-8" : "h-9"} flex-1 items-center justify-center rounded-full bg-[#F4F6F8] text-[13px] font-semibold text-[#07090D]`}>Approve</span>
        <span className={`inline-flex ${compact ? "h-8" : "h-9"} items-center justify-center rounded-full px-4 text-[13px] text-muted ring-1 ring-white/10`}>Review</span>
      </span>
    </>
  );
}
