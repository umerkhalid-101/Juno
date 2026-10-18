"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, Check, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandIcon";
import { Face } from "@/components/jobs/scenes";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import type { ToolId } from "@/lib/story";
import { apps } from "@/lib/apps";
import { base, calm } from "./kit";

const h = apps.hero;

/**
 * The hero: a renewals dashboard Juno built for a SaaS team. Each part flies in from the tool it
 * comes from; while it lands, a tag in the margin beside the window says which. [new] copy.
 */
type Part = "kpis" | "chart" | "risk" | "email";
const PARTS: { id: Part; from: ToolId; label: string; side: "left" | "right"; x: number; y: number; r: number }[] = [
  { id: "kpis", from: "hubspot", label: "Pipeline from HubSpot", side: "left", x: -240, y: -40, r: -5 },
  { id: "chart", from: "hubspot", label: "Renewals from HubSpot", side: "left", x: -280, y: 30, r: -3 },
  { id: "risk", from: "intercom", label: "Tickets from Intercom", side: "right", x: 280, y: 0, r: 4 },
  { id: "email", from: "gmail", label: "Drafts in Gmail", side: "right", x: 240, y: 80, r: 4 },
];
const GAP = 0.4;

/* twelve weeks of renewals, in $k: what came up and what was renewed */
const DUE = [18, 24, 22, 30, 28, 36, 34, 40, 38, 46, 44, 52];
const WON = [14, 20, 21, 25, 26, 31, 32, 35, 36, 40, 41, 47];
const RISK: [string, number][] = [
  ["Export issues", 5],
  ["Slow support replies", 3],
  ["Pricing questions", 2],
];

/** A line through the points, scaled into a w x h box. */
function line(pts: number[], w: number, h: number, max: number) {
  return pts.map((v, i) => `${i === 0 ? "M" : "L"}${((i / (pts.length - 1)) * w).toFixed(1)} ${(h - (v / max) * h).toFixed(1)}`).join(" ");
}

const Built = createContext({ done: true, k: 1, reduce: false });

/** A part of the dashboard: flies in from its source, with a tag in the margin while it lands. */
function Piece({ id, children, className = "" }: { id: Part; children: ReactNode; className?: string }) {
  const { done, k, reduce } = useContext(Built);
  const i = PARTS.findIndex((p) => p.id === id);
  const p = PARTS[i];
  const delay = 0.1 + i * GAP;
  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={done ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 } : { x: p.x * k, y: p.y * k, rotate: p.r, scale: 0.92, opacity: 0 }}
        transition={reduce ? { duration: 0 } : done ? { duration: 0.8, ease: calm, delay, opacity: { duration: 0.3, delay } } : { duration: 0.3, ease: base }}
      >
        {children}
      </motion.div>
      {/* where it came from: outside the window, never over the content */}
      {!reduce && done && (
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#151A22] py-1 pl-1.5 pr-2.5 text-[12px] text-text ring-1 ring-white/[0.1] xl:flex ${
            p.side === "left" ? "right-[calc(100%+52px)]" : "left-[calc(100%+52px)]"
          }`}
          initial={{ opacity: 0, x: p.side === "left" ? 8 : -8 }}
          animate={{ opacity: [0, 1, 1, 0], x: 0 }}
          transition={{ duration: 2.6, delay, times: [0, 0.12, 0.78, 1] }}
        >
          <span className="grid size-5 place-items-center rounded-full bg-white">
            <BrandMark id={p.from} size={11} />
          </span>
          {p.label}
        </motion.span>
      )}
    </div>
  );
}

export function AppsHero() {
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.3 });
  const visible = useInView(stage, { amount: 0.3 });
  const [hover, setHover] = useState(false);
  const [built, setBuilt] = useState(false);
  const [round, setRound] = useState(0);
  const [drafted, setDrafted] = useState(false);
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

  useEffect(() => {
    if (!seen || reduce) return;
    const t = window.setTimeout(() => setBuilt(true), 350);
    return () => window.clearTimeout(t);
  }, [seen, reduce, round]);

  const again = () => {
    setBuilt(false);
    setDrafted(false);
    setRound((r) => r + 1);
  };
  const settled = 0.1 + PARTS.length * GAP + 0.5;

  // on a loop: once built, hold for 10 seconds, then build it again (paused on hover or off screen)
  useEffect(() => {
    if (!built || reduce || !visible || hover) return;
    const t = window.setTimeout(again, (settled + 10) * 1000);
    return () => window.clearTimeout(t);
    // the timer restarts whenever the build does
  }, [built, reduce, visible, hover, round, settled]);

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

        <div ref={stage} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} className="relative mx-auto mt-20 max-w-[900px] md:mt-28">
          {/* glow 1 of 2 */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-8%] inset-y-[-8%] -z-10 blur-[100px]"
            style={{ background: "var(--glow)" }}
            initial={false}
            animate={{ opacity: done ? 0.42 : 0.15 }}
            transition={{ duration: 1.4, ease: calm }}
          />

          <Built.Provider value={{ done, k: small ? 0.3 : 1, reduce }}>
            <div className="rounded-[18px] border border-white/[0.09] bg-[#0E1218] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
              {/* chrome */}
              <div className="flex h-10 items-center gap-2 rounded-t-[18px] border-b border-white/[0.06] bg-[#0B0E13] px-3.5">
                <span className="flex gap-1.5" aria-hidden>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <span key={c} className="size-[10px] rounded-full" style={{ background: c }} />
                  ))}
                </span>
                <span className="mx-auto flex h-6 items-center gap-1.5 rounded-full bg-white/[0.05] px-3 text-[11.5px] text-muted">
                  <Lock size={10} aria-hidden />
                  renewals.yourcompany.com
                </span>
                <span className="w-[46px]" />
              </div>

              <div key={round} className="p-4 md:p-5">
                {/* app header */}
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[18px] font-semibold tracking-[-0.02em] text-text">Renewals</p>
                    <p className="text-[12.5px] text-muted">This quarter · updated 2 min ago</p>
                  </div>
                  <span className="ml-auto hidden h-9 items-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.03] px-3 text-[12.5px] text-subtle sm:flex">
                    <Search size={13} aria-hidden />
                    Search accounts
                  </span>
                </div>

                {/* numbers, each with its trend */}
                <Piece id="kpis" className="mt-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { l: "Up for renewal", v: "$412k", pts: DUE.slice(6), tone: "#B4C2FF" },
                      { l: "Renewed", v: "$186k", pts: WON.slice(6), tone: "#3DD68C" },
                      { l: "At risk", v: "$60k", pts: [4, 6, 5, 8, 9, 11], tone: "#FF8A8C" },
                    ].map((k) => (
                      <div key={k.l} className="flex items-end justify-between gap-2 rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                        <div>
                          <p className="truncate text-[11px] text-muted">{k.l}</p>
                          <p className="mt-0.5 text-[18px] font-semibold tracking-[-0.02em] md:text-[21px]" style={{ color: k.l === "At risk" ? k.tone : "#F4F6F8" }}>
                            {k.v}
                          </p>
                        </div>
                        <svg viewBox="0 0 60 24" className="hidden h-6 w-[60px] shrink-0 sm:block" aria-hidden>
                          <path d={line(k.pts, 60, 22, Math.max(...k.pts) * 1.05)} fill="none" stroke={k.tone} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </Piece>

                <div className="mt-3 grid gap-3 md:grid-cols-[1.6fr_1fr]">
                  {/* the main chart */}
                  <Piece id="chart">
                    <div className="h-full rounded-[12px] border border-white/[0.06] p-3.5">
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-muted">Renewals by week</span>
                        <span className="flex items-center gap-3 text-subtle">
                          <span className="flex items-center gap-1.5">
                            <span className="h-[2px] w-3 rounded-full bg-[#7A8FFF]" />
                            Renewed
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="h-[2px] w-3 rounded-full bg-white/30" />
                            Due
                          </span>
                        </span>
                      </div>
                      <Chart round={round} />
                    </div>
                  </Piece>

                  {/* why accounts are at risk */}
                  <Piece id="risk">
                    <div className="h-full rounded-[12px] border border-white/[0.06] p-3.5">
                      <p className="text-[11.5px] text-muted">Why accounts are at risk</p>
                      <ul className="mt-3 space-y-3">
                        {RISK.map(([label, n], i) => (
                          <li key={label}>
                            <div className="flex justify-between text-[12.5px]">
                              <span className="text-text/90">{label}</span>
                              <span className="tabular-nums text-muted">{n}</span>
                            </div>
                            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                              <motion.span
                                className="block h-full rounded-full"
                                style={{ background: i === 0 ? "#FF8A8C" : "#7A8FFF" }}
                                initial={false}
                                animate={{ width: done ? `${(n / 5) * 100}%` : "0%" }}
                                transition={{ duration: 0.9, ease: calm, delay: 0.9 + i * 0.12 }}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Piece>
                </div>

                {/* the one thing to do now */}
                <Piece id="email" className="mt-3">
                  <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-white/[0.06] px-3.5 py-2.5">
                    <Face who="maya" size={28} className="!ring-0" />
                    <div className="min-w-0 flex-1 basis-[200px]">
                      <p className="text-[13px] text-text sm:truncate">
                        <span className="font-medium">Lumen</span> renews in 12 days with 3 open tickets about exports.
                      </p>
                      <p className="text-[11.5px] text-muted">{drafted ? "A check-in email is ready in Gmail for Maya." : "Owner: Maya · $36k ARR"}</p>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      {drafted ? (
                        <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: calm }} className="flex shrink-0 items-center gap-1.5 text-[12.5px] font-medium text-[#3DD68C]">
                          <Check size={13} strokeWidth={2.5} aria-hidden />
                          Drafted
                        </motion.span>
                      ) : (
                        <motion.button
                          key="b"
                          type="button"
                          onClick={() => setDrafted(true)}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          className="h-9 shrink-0 rounded-full bg-[#F4F6F8] px-4 text-[12.5px] font-semibold text-[#07090D] transition-shadow hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] max-sm:w-full"
                        >
                          Draft check-in
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </Piece>
              </div>
            </div>
          </Built.Provider>

        </div>
      </div>
    </section>
  );
}

/** Twelve weeks of renewals: what was due, and the renewed area drawing in underneath. */
function Chart({ round }: { round: number }) {
  const reduce = useReducedMotion();
  const { done } = useContext(Built);
  const on = done ? 1 : 0;
  const W = 520;
  const H = 130;
  const max = 56;
  const won = line(WON, W, H, max);
  const area = `${won} L${W} ${H} L0 ${H} Z`;
  return (
    <svg key={round} viewBox={`0 0 ${W} ${H + 18}`} className="mt-3 h-[148px] w-full" preserveAspectRatio="none" aria-label="Renewed revenue has grown every few weeks this quarter">
      <defs>
        <linearGradient id="won-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A8FFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7A8FFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.05)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      <motion.path d={area} fill="url(#won-fill)" initial={false} animate={{ opacity: on }} transition={{ duration: 0.8, delay: reduce ? 0 : 1.4 }} />
      <motion.path
        d={line(DUE, W, H, max)}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: on }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: reduce ? 0 : 0.8 }}
      />
      <motion.path
        d={won}
        fill="none"
        stroke="#7A8FFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={false}
        animate={{ pathLength: on }}
        transition={{ duration: 1.3, ease: "easeInOut", delay: reduce ? 0 : 0.9 }}
      />
      {["Apr", "May", "Jun"].map((m, i) => (
        <text key={m} x={(W / 3) * i + 4} y={H + 14} fill="#6B7789" fontSize="10">
          {m}
        </text>
      ))}
    </svg>
  );
}
