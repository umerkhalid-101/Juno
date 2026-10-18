"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Check, Lock, Palette, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandIcon";
import { Face } from "@/components/jobs/scenes";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import type { ToolId } from "@/lib/story";
import { apps } from "@/lib/apps";
import { base, calm } from "./kit";

const h = apps.hero;

/**
 * The hero: one sentence, and the client portal Juno builds from it. Each piece flies in from
 * where it lives in your company (the CRM, the plan, the files, the team chat, the brand kit),
 * carrying a small tag that says so, then settles. [new] copy; cast matches the site.
 */
type Src = ToolId | "brand";
const PIECES: { id: string; from: Src; label: string; x: number; y: number; r: number }[] = [
  { id: "brand", from: "brand", label: "Your brand kit", x: -220, y: -90, r: -6 },
  { id: "client", from: "hubspot", label: "From HubSpot", x: 260, y: -60, r: 5 },
  { id: "plan", from: "notion", label: "From Notion", x: -280, y: 20, r: -4 },
  { id: "files", from: "drive", label: "From Google Drive", x: 290, y: 70, r: 5 },
  { id: "chat", from: "slack", label: "From Slack", x: -240, y: 120, r: -5 },
];
const GAP = 0.42;
const DARK = { bg: "#0E1218", chrome: "#0B0E13", accent: "#A8D08D", soft: "rgba(168,208,141,0.13)", logo: "#2F3A2A" };

const Built = createContext({ done: true, k: 1, reduce: false, tags: false });

/** A piece of the portal. It flies in from its source with a tag, lands, and the tag fades. */
function Piece({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  const { done, k, reduce, tags } = useContext(Built);
  const i = PIECES.findIndex((p) => p.id === id);
  const p = PIECES[i];
  const delay = 0.1 + i * GAP;
  return (
    <motion.div
      className={`relative ${className}`}
      initial={false}
      animate={done ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 } : { x: p.x * k, y: p.y * k, rotate: p.r, scale: 0.9, opacity: 0 }}
      transition={reduce ? { duration: 0 } : done ? { duration: 0.8, ease: calm, delay, opacity: { duration: 0.3, delay } } : { duration: 0.3, ease: base }}
      style={{ zIndex: done ? 1 : 10 }}
    >
      {children}
      {/* where it came from */}
      <AnimatePresence>
        {tags && done && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -top-3 right-2 z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F4F6F8] py-1 pl-1.5 pr-2.5 text-[11px] font-medium text-[#0E1218] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: [0, 1, 1, 0], y: 0 }}
            transition={{ duration: 2.2, delay, times: [0, 0.12, 0.75, 1] }}
          >
            {p.from === "brand" ? <Palette size={12} className="text-[#2F3A2A]" /> : <BrandMark id={p.from} size={12} />}
            {p.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AppsHeroPortal() {
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { once: true, amount: 0.35 });
  const [built, setBuilt] = useState(false);
  const [round, setRound] = useState(0);
  const [approved, setApproved] = useState(false);
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
    const t = window.setTimeout(() => setBuilt(true), round === 0 ? 400 : 450);
    return () => window.clearTimeout(t);
  }, [seen, reduce, round]);

  const again = () => {
    setBuilt(false);
    setApproved(false);
    setRound((r) => r + 1);
  };
  const settled = 0.1 + PIECES.length * GAP + 0.6;

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

        <div ref={stage} className="relative mx-auto mt-20 max-w-[780px] md:mt-28">
          {/* glow 1 of 2 */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-12%] inset-y-[-10%] -z-10 blur-[100px]"
            style={{ background: "var(--glow)" }}
            initial={false}
            animate={{ opacity: done ? 0.45 : 0.15 }}
            transition={{ duration: 1.4, ease: calm }}
          />

          {/* the one sentence */}
          <p className="mb-5 text-center text-[15px] text-muted">“Build Northwind a client portal.”</p>

          <Built.Provider value={{ done, k: small ? 0.3 : 1, reduce, tags: !reduce }}>
            <div className="overflow-visible rounded-[18px] border border-white/[0.09] shadow-[0_40px_120px_rgba(0,0,0,0.55)]" style={{ background: DARK.bg }}>
              {/* chrome */}
              <div className="flex h-10 items-center gap-2 rounded-t-[18px] border-b border-white/[0.06] px-3.5" style={{ background: DARK.chrome }}>
                <span className="flex gap-1.5" aria-hidden>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <span key={c} className="size-[10px] rounded-full" style={{ background: c }} />
                  ))}
                </span>
                <span className="mx-auto flex h-6 items-center gap-1.5 rounded-full bg-white/[0.05] px-3 text-[11.5px] text-muted">
                  <Lock size={10} aria-hidden />
                  portal.studionorth.com
                </span>
                <span className="w-[46px]" />
              </div>

              <div key={round} className="min-h-[392px] p-5 md:p-7">
                <Piece id="brand" className="w-fit">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-[9px] text-[12px] font-bold" style={{ background: DARK.logo, color: DARK.accent }}>
                      SN
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[13.5px] font-semibold text-text">Studio North</span>
                      <span className="block text-[11.5px] text-muted">Client portal</span>
                    </span>
                  </div>
                </Piece>

                <Piece id="client" className="mt-6">
                  <div className="flex items-center gap-3">
                    <Face who="dana" size={40} className="!ring-0" />
                    <div className="min-w-0">
                      <p className="text-[22px] font-semibold leading-[27px] tracking-[-0.025em] text-text md:text-[26px] md:leading-[30px]">Hi Dana, here&apos;s Northwind.</p>
                      <p className="text-[13px] text-muted">Website refresh · on track for June 12</p>
                    </div>
                  </div>
                </Piece>

                <Piece id="plan" className="mt-6">
                  <ol className="flex items-center gap-2 text-[12px]">
                    {["Kickoff", "Design", "Build", "Launch"].map((s, i) => {
                      const at = approved ? 2 : 1;
                      return (
                        <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
                          <span className="flex items-center gap-1.5" style={{ color: i <= at ? "#F4F6F8" : "#6B7789" }}>
                            <span
                              className="grid size-[18px] place-items-center rounded-full transition-colors duration-500"
                              style={{ background: i < at ? DARK.accent : i === at ? DARK.soft : "transparent", border: i > at ? "1px solid rgba(255,255,255,0.15)" : "none", color: DARK.bg }}
                            >
                              {i < at && <Check size={10} strokeWidth={3} aria-hidden />}
                              {i === at && <span className="size-1.5 rounded-full" style={{ background: DARK.accent }} />}
                            </span>
                            {s}
                          </span>
                          {i < 3 && <span className="h-px flex-1 bg-white/10" />}
                        </li>
                      );
                    })}
                  </ol>
                </Piece>

                <Piece id="files" className="mt-6">
                  <div className="flex items-center gap-3 rounded-[14px] p-3" style={{ background: DARK.soft }}>
                    <span className="relative hidden h-12 w-16 shrink-0 overflow-hidden rounded-[8px] bg-[linear-gradient(135deg,#2a3324,#1d2419)] sm:block" aria-hidden>
                      <span className="absolute left-2 top-2 h-1.5 w-8 rounded-full bg-white/40" />
                      <span className="absolute left-2 top-5 h-4 w-11 rounded-[3px] bg-white/20" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] text-muted">Ready for your eyes</p>
                      <p className="text-[14px] font-medium text-text">Homepage design v3</p>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      {approved ? (
                        <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: calm }} className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: DARK.accent }}>
                          <Check size={13} strokeWidth={2.5} aria-hidden />
                          Approved
                        </motion.span>
                      ) : (
                        <motion.button
                          key="b"
                          type="button"
                          onClick={() => setApproved(true)}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF]"
                          style={{ background: DARK.accent, color: DARK.bg }}
                        >
                          Approve
                          <ArrowRight size={13} aria-hidden />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </Piece>

                <Piece id="chat" className="mt-4">
                  <div className="flex items-start gap-2.5 rounded-[12px] border border-white/[0.06] p-3">
                    <Face who="leo" size={26} className="!ring-0" />
                    <div className="min-w-0 flex-1 text-[13px] leading-[18px]">
                      <p>
                        <span className="font-medium text-text">Leo</span> <span className="text-subtle">· Studio North · 10:12</span>
                      </p>
                      <p className="text-text/85">{approved ? "Thanks Dana. Starting the build today." : "v3 is ready for your review. Shout if anything feels off."}</p>
                    </div>
                  </div>
                </Piece>
              </div>
            </div>
          </Built.Provider>

          {/* the point, in one line */}
          <div className="mt-6 flex min-h-8 items-center justify-center text-center text-[14px]">
            <AnimatePresence mode="wait" initial={false}>
              {done && (
                <motion.p
                  key={`d${round}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: calm, delay: reduce ? 0 : settled }}
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted"
                >
                  <span className="text-text">Built from one sentence and what your company already has.</span>
                  {!reduce && (
                    <button type="button" onClick={again} className="flex items-center gap-1.5 text-[13px] text-[#A6BBFF] transition-colors hover:text-text">
                      <RotateCcw size={13} aria-hidden />
                      See it again
                    </button>
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
