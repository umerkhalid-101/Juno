"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, Check, CheckCheck, Inbox, Lock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { apps } from "@/lib/apps";
import { base, calm, snap } from "./kit";

const h = apps.hero;
const b = h.builds[0];
/** Juno dark: the app sits in the page's own world. */
const C = { bg: "#0E1218", card: "#151A22", chrome: "#0B0E13", ink: "#F4F6F8", muted: "#9AA6B8", accent: "#7A8FFF", fill: "linear-gradient(135deg,#324CFF,#5D6BFF)", soft: "rgba(122,143,255,0.14)", tagInk: "#B4C2FF", line: "rgba(255,255,255,0.07)" };

/**
 * Where each piece waits before Juno puts the app together: offset from its own slot, in px at
 * desktop size, with a tilt. Phones use the same layout at a third of the distance.
 */
const SCATTER: Record<string, { x: number; y: number; r: number }> = {
  head: { x: -120, y: -70, r: -6 },
  people: { x: 150, y: -90, r: 8 },
  chip: { x: -230, y: 10, r: -7 },
  name: { x: -250, y: 60, r: -4 },
  sub: { x: 260, y: -40, r: 5 },
  progress: { x: 200, y: 30, r: 4 },
  row0: { x: -200, y: 60, r: -4 },
  row1: { x: 210, y: 70, r: 3 },
  row2: { x: -180, y: 110, r: -3 },
  row3: { x: 190, y: 120, r: 4 },
  foot: { x: -120, y: 150, r: -4 },
};
const ORDER = Object.keys(SCATTER);

const Build = createContext({ done: true, k: 1, reduce: false });

/** A piece of the app: it floats as a little card until Juno puts it in place. */
function Piece({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  const { done, k, reduce } = useContext(Build);
  const s = SCATTER[id];
  const i = ORDER.indexOf(id);
  return (
    <motion.div
      className={`relative rounded-[10px] ${className}`}
      initial={false}
      animate={
        done
          ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: C.bg, boxShadow: "0 0 0 0px rgba(21,26,34,1), 0 0 0 1px rgba(255,255,255,0), 0 0 0 0 rgba(0,0,0,0)" }
          : { x: s.x * k, y: s.y * k, rotate: s.r, scale: 0.8, opacity: 0, backgroundColor: C.card, boxShadow: "0 0 0 10px rgba(21,26,34,1), 0 0 0 11px rgba(255,255,255,0.1), 0 24px 50px -12px rgba(0,0,0,0.8)" }
      }
      transition={
        reduce
          ? { duration: 0 }
          : done
            ? { duration: 0.75, ease: calm, delay: 0.05 + i * 0.07, opacity: { duration: 0.25, delay: 0.05 + i * 0.07 } }
            : { duration: 0.35, ease: base }
      }
      style={{ zIndex: done ? 1 : 20 + i }}
    >
      {children}
    </motion.div>
  );
}

/** The hero: the pieces of an app fly in and snap together into the finished, usable app. */
export function AppsHeroAssemble() {
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.35 });
  const [built, setBuilt] = useState(false);
  const [round, setRound] = useState(0);
  const [ready, setReady] = useState(false);
  const [small, setSmall] = useState(false);
  const done = reduce || built;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setSmall(mq.matches);
    const t = window.setTimeout(on, 0);
    mq.addEventListener("change", on);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", on);
    };
  }, []);

  // assemble once it comes into view (and again after "Build it again")
  useEffect(() => {
    if (!seen || reduce) return;
    const t = window.setTimeout(() => setBuilt(true), round === 0 ? 250 : 450);
    return () => window.clearTimeout(t);
  }, [seen, reduce, round]);

  const rebuild = () => {
    setBuilt(false);
    setReady(false);
    setRound((r) => r + 1);
  };

  const count = ready ? 4 : 3;
  const late = done && !reduce ? 0.75 : 0;

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

        {/* the stage */}
        <Build.Provider value={{ done, k: small ? 0.3 : 1, reduce }}>
          <div ref={stage} className="relative mx-auto mt-20 max-w-[860px] md:mt-36">
            {/* glow 1 of 2 */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-[-10%] inset-y-[-8%] -z-10 blur-[100px]"
              style={{ background: "var(--glow)" }}
              animate={{ opacity: done ? 0.55 : 0.18 }}
              transition={{ duration: 1.2, ease: calm }}
            />

            {/* the frame: an outline while the pieces wait, a real window once they land */}
            <div className="relative rounded-[18px]">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-[18px]"
                initial={false}
                animate={{
                  backgroundColor: done ? C.bg : "rgba(255,255,255,0.02)",
                  boxShadow: done ? "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)" : "0 0 0 1px rgba(166,187,255,0.28), 0 0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ duration: reduce ? 0 : 0.6, ease: base, delay: late }}
              />
              {/* chrome */}
              <motion.div
                className="relative flex h-10 items-center gap-2 rounded-t-[18px] border-b px-3.5"
                initial={false}
                animate={{ backgroundColor: done ? C.chrome : "rgba(255,255,255,0)", borderColor: done ? "rgba(255,255,255,0.07)" : "rgba(166,187,255,0.18)" }}
                transition={{ duration: reduce ? 0 : 0.6, ease: base, delay: late }}
              >
                <span className="flex gap-1.5" aria-hidden>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <motion.span key={c} className="size-[10px] rounded-full" initial={false} animate={{ backgroundColor: done ? c : "rgba(166,187,255,0.25)" }} transition={{ duration: 0.4, delay: late }} />
                  ))}
                </span>
                <span className={`mx-auto flex h-6 items-center gap-1.5 rounded-full px-3 text-[11.5px] transition-colors duration-500 ${done ? "bg-white/[0.06] text-muted ring-1 ring-white/[0.06]" : "text-[#A6BBFF]/60"}`}>
                  <Lock size={10} aria-hidden />
                  {b.url}
                </span>
                <span className="w-[46px]" />
              </motion.div>

              {/* the app, in pieces until it is built */}
              <div className="relative px-5 pb-5 pt-4 text-text md:px-8 md:pb-6 md:pt-5">
                <div className="flex items-center justify-between gap-3">
                  <Piece id="head" className="flex items-center gap-2.5 px-1 py-0.5">
                    <Inbox size={15} strokeWidth={1.75} style={{ color: C.accent }} aria-hidden />
                    <span className="text-[15px] font-semibold tracking-[-0.01em]">{b.title}</span>
                  </Piece>
                  <Piece id="people" className="flex -space-x-1.5 p-0.5">
                    {[
                      ["L", "#24305E", "#B4C2FF"],
                      ["S", "#173B2C", "#7FE0B0"],
                      ["E", "#47231A", "#FFB49E"],
                    ].map(([l, bg, fg]) => (
                      <span key={l} className="grid size-7 place-items-center rounded-full text-[11px] font-semibold ring-2 ring-[#0E1218]" style={{ background: bg, color: fg }}>
                        {l}
                      </span>
                    ))}
                  </Piece>
                </div>

                <div className="mt-5 flex">
                  <Piece id="chip">
                    <span className="inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-medium" style={{ background: C.soft, color: C.tagInk }}>
                      {b.chip}
                    </span>
                  </Piece>
                </div>
                <div className="mt-2 flex">
                  <Piece id="name" className="px-1">
                    <p className="text-[26px] font-semibold leading-[30px] tracking-[-0.03em] md:text-[32px] md:leading-[36px]">{b.name}</p>
                  </Piece>
                </div>
                <div className="mt-1 flex">
                  <Piece id="sub" className="px-1">
                    <p className="text-[14px]" style={{ color: C.muted }}>
                      {b.sub}
                    </p>
                  </Piece>
                </div>

                <div className="mt-4">
                  <Piece id="progress" className="!rounded-[14px]">
                    <div className="flex items-center gap-5 rounded-[14px] px-5 py-4 text-white shadow-[0_20px_40px_-20px_rgba(50,76,255,0.8)]" style={{ background: C.fill }}>
                      <div className="shrink-0">
                        <p className="flex items-baseline text-[26px] font-semibold leading-none">
                          <RollingNumber value={count} />
                          <span className="ml-0.5 text-[15px] font-normal text-white/70">/ 4</span>
                          <span className="sr-only">{count} of 4</span>
                        </p>
                        <p className="mt-1 text-[11.5px] text-white/75">{b.stat}</p>
                      </div>
                      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
                        <motion.span className="absolute inset-y-0 left-0 rounded-full bg-white" animate={{ width: `${(count / 4) * 100}%` }} transition={{ duration: 0.8, ease: calm }} />
                      </span>
                      <CheckCheck size={18} className="shrink-0 text-white/80" aria-hidden />
                    </div>
                  </Piece>
                </div>

                <ul className="mt-3">
                  {b.rows.map((r, i) => {
                    const mine = i === b.rows.length - 1;
                    const ok = !mine || ready;
                    return (
                      <li key={r.task} className="border-t transition-colors duration-500 first:border-0" style={{ borderColor: done ? C.line : "transparent" }}>
                        <Piece id={`row${i}`} className="flex h-[48px] items-center gap-3 px-1 text-[14px]">
                          <span className="grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-[120ms]" style={ok ? { background: "#324CFF", color: "#fff" } : { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)" }}>
                            {ok && <Check size={11} strokeWidth={3} aria-hidden />}
                          </span>
                          <span className="flex-1 truncate">{r.task}</span>
                          <span className="text-[12.5px]" style={{ color: C.muted }}>
                            {r.meta}
                          </span>
                          <span className="w-[104px] shrink-0 text-right">
                            {mine && !ready ? (
                              <button
                                type="button"
                                onClick={() => setReady(true)}
                                disabled={!done}
                                className="h-8 whitespace-nowrap rounded-full bg-[#F4F6F8] px-3.5 text-[12.5px] font-semibold text-[#07090D] transition-[box-shadow,transform] duration-200 hover:shadow-[0_0_0_4px_rgba(50,76,255,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] active:scale-[0.97]"
                              >
                                {b.action}
                              </button>
                            ) : (
                              <motion.span
                                key={`${r.task}-${ok}`}
                                initial={mine ? { scale: 0.85, opacity: 0 } : false}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.12, ease: snap }}
                                className="inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-medium"
                                style={{ background: C.soft, color: C.tagInk }}
                              >
                                {"tag" in r ? r.tag : b.tag}
                              </motion.span>
                            )}
                          </span>
                        </Piece>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 flex">
                  <Piece id="foot" className="flex flex-1 items-center gap-2 px-1 py-1 text-[12.5px]">
                    <span className="size-1.5 rounded-full" style={{ background: C.accent }} />
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={String(ready)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} style={{ color: C.muted }} aria-live="polite">
                        {ready ? b.done : b.note}
                      </motion.span>
                    </AnimatePresence>
                    <span className="ml-auto" style={{ color: C.muted }}>
                      {b.when}
                    </span>
                  </Piece>
                </div>

                {done && !reduce && <Teammates key={round} />}
              </div>
            </div>

            {/* what just happened, and a way to see it again */}
            <div className="mt-6 flex min-h-8 items-center justify-center text-center text-[14px]">
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.p key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: calm, delay: reduce ? 0 : 1.2 }} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted">
                    <span className="text-text">{b.reply}</span>
                    {!reduce && (
                      <button type="button" onClick={rebuild} className="flex items-center gap-1.5 text-[13px] text-[#A6BBFF] transition-colors hover:text-text">
                        <RotateCcw size={13} aria-hidden />
                        Build it again
                      </button>
                    )}
                  </motion.p>
                ) : (
                  <motion.p key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-subtle">
                    “{b.prompt.map((x) => x.t).join("")}”
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Build.Provider>
      </div>
    </section>
  );
}

/** Two teammates already using what Juno just built. */
function Teammates() {
  const people = [
    { name: "Leo", color: "#3346e0", x: ["64%", "72%", "44%", "58%", "64%"], y: ["20%", "56%", "68%", "40%", "20%"], delay: 1.6 },
    { name: "Emma", color: "#e8532e", x: ["22%", "34%", "78%", "52%", "22%"], y: ["50%", "80%", "46%", "62%", "50%"], delay: 2.2 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-b-[18px]">
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
