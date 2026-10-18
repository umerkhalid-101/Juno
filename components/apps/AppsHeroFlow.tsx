"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Check, Lock, Palette } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import type { ToolId } from "@/lib/story";
import { apps } from "@/lib/apps";
import { base, calm } from "./kit";

const h = apps.hero;

/**
 * What Juno builds from: the company's own things. Each one feeds one part of the client portal.
 * Copy here is [new]; the cast and companies match the rest of the site.
 */
type Part = "brand" | "client" | "plan" | "files" | "chat";
const SOURCES: { part: Part; tool: ToolId | "brand"; name: string; detail: string }[] = [
  { part: "client", tool: "hubspot", name: "Northwind", detail: "Deal · Website refresh" },
  { part: "plan", tool: "notion", name: "Project plan", detail: "Kickoff to launch" },
  { part: "files", tool: "drive", name: "Design files", detail: "Homepage design v3" },
  { part: "chat", tool: "slack", name: "#northwind", detail: "Leo: v3 is ready" },
  { part: "brand", tool: "brand", name: "Brand kit", detail: "Studio North colors" },
];
const ORDER = SOURCES.map((s) => s.part);
const STEP = 1100;

/* the portal before and after it takes on the agency's brand */
const PLAIN = { accent: "#9AA6B8", soft: "rgba(255,255,255,0.06)", logo: "#2A3040" };
const BRAND = { accent: "#A8D08D", soft: "rgba(168,208,141,0.14)", logo: "#2F3A2A" };

/**
 * The hero, top to bottom: your company's own things, Juno reading them one by one, and the
 * client portal it builds from them. Hover a source to see what it fed.
 */
export function AppsHeroFlow() {
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const juno = useRef<MascotApi>(null);
  const seen = useInView(stage, { once: true, amount: 0.35 });
  const [n, setN] = useState(0);
  const [hover, setHover] = useState<Part | null>(null);
  const [approved, setApproved] = useState(false);
  const built = reduce ? ORDER.length : n;
  const reading = !reduce && n < ORDER.length && seen ? ORDER[n] : null;

  // Juno reads each source in turn and builds its part
  useEffect(() => {
    if (!seen || reduce) return;
    const ts: number[] = [];
    ORDER.forEach((_, i) => {
      ts.push(window.setTimeout(() => juno.current?.lookAt(cards.current[i]), 500 + i * STEP));
      ts.push(window.setTimeout(() => setN(i + 1), 500 + i * STEP + 700));
    });
    ts.push(
      window.setTimeout(() => {
        juno.current?.look(1, 0);
        juno.current?.cheer();
      }, 500 + ORDER.length * STEP + 200),
    );
    return () => ts.forEach(window.clearTimeout);
  }, [seen, reduce]);

  const has = (p: Part) => ORDER.indexOf(p) < built;
  const lit = (p: Part) => hover === p || reading === p;
  const B = has("brand") ? BRAND : PLAIN;
  const done = built >= ORDER.length;

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

        <div ref={stage} className="relative mx-auto mt-20 flex max-w-[1080px] flex-col items-center md:mt-28">
          {/* your company */}
          <div className="w-full">
            <p className="mb-3 text-center text-[13px] text-subtle">Your company</p>
            <ul className="flex flex-wrap justify-center gap-2.5">
              {SOURCES.map((s, i) => {
                const on = lit(s.part);
                const used = has(s.part);
                return (
                  <li key={s.part} className="shrink-0">
                    <div
                      ref={(el) => {
                        cards.current[i] = el;
                      }}
                      tabIndex={0}
                      onPointerEnter={() => {
                        setHover(s.part);
                        juno.current?.lookAt(cards.current[i]);
                      }}
                      onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover(s.part)}
                      onBlur={() => setHover(null)}
                      aria-label={`${s.name}: ${s.detail}`}
                      className={`flex w-[200px] items-center gap-3 rounded-[14px] border px-3 py-2.5 transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] ${
                        on
                          ? "border-[#A6BBFF]/45 bg-[#A6BBFF]/[0.08] shadow-[0_0_0_4px_rgba(166,187,255,0.08)]"
                          : "border-white/[0.08] bg-[#0E1218]"
                      }`}
                    >
                      {s.tool === "brand" ? (
                        <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-[#2F3A2A] text-[#A8D08D]">
                          <Palette size={15} strokeWidth={1.75} aria-hidden />
                        </span>
                      ) : (
                        <BrandIcon id={s.tool} size={32} />
                      )}
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-[13.5px] text-text">{s.name}</span>
                        <span className="block truncate text-[12px] text-muted">{s.detail}</span>
                      </span>
                      <span className={`grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-300 ${used ? "bg-[#3DD68C]/15 text-[#3DD68C]" : "text-transparent"}`} aria-hidden>
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Juno, reading */}
          <div className="relative my-6 flex flex-col items-center md:my-8">
            <span aria-hidden className="h-8 w-px bg-[linear-gradient(180deg,transparent,rgba(166,187,255,0.4))]" />
            {/* glow 1 of 2 */}
            <span aria-hidden className="pointer-events-none absolute top-1/2 size-[240px] -translate-y-1/2 rounded-full opacity-40 blur-[70px]" style={{ background: "var(--glow)" }} />
            <div className="relative">
              <Mascot size={84} apiRef={juno} halo={false} float label="Juno" />
            </div>
            <p className="relative mt-2 min-w-[96px] text-center text-[12.5px] text-muted" aria-live="polite">
              {done ? "Built" : reading ? "Reading" : " "}
            </p>
            <span aria-hidden className="mt-2 h-8 w-px bg-[linear-gradient(180deg,rgba(166,187,255,0.4),transparent)]" />
          </div>

          {/* what it builds */}
          <div className="relative w-full max-w-[760px]">
            <div className="overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#0E1218] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
              <div className="flex h-10 items-center gap-2 border-b border-white/[0.06] bg-[#0B0E13] px-3.5">
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

              <div className="min-h-[372px] p-5 md:p-6">
                {/* the agency's portal header: takes on the brand */}
                <Slot part="brand" show lit={lit("brand")}>
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-[9px] text-[12px] font-bold transition-colors duration-700" style={{ background: B.logo, color: B.accent }}>
                      SN
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[13.5px] font-semibold text-text">Studio North</span>
                      <span className="block text-[11.5px] text-muted">Client portal</span>
                    </span>
                  </div>
                </Slot>

                {/* the client, from the CRM */}
                <Slot part="client" show={has("client")} lit={lit("client")} className="mt-5">
                  <div className="flex items-center gap-3">
                    <Face who="dana" size={36} className="!ring-0" />
                    <div className="min-w-0">
                      <p className="text-[22px] font-semibold leading-[26px] tracking-[-0.025em] text-text">Hi Dana, here&apos;s Northwind.</p>
                      <p className="text-[13px] text-muted">Website refresh · on track for June 12</p>
                    </div>
                  </div>
                </Slot>

                {/* the plan, from Notion */}
                <Slot part="plan" show={has("plan")} lit={lit("plan")} className="mt-5">
                  <ol className="flex items-center gap-2 text-[12px]">
                    {["Kickoff", "Design", "Build", "Launch"].map((s, i) => {
                      const at = approved ? 2 : 1;
                      return (
                        <li key={s} className="flex flex-1 items-center gap-2 last:flex-none">
                          <span className="flex items-center gap-1.5" style={{ color: i <= at ? "#F4F6F8" : "#6B7789" }}>
                            <span
                              className="grid size-[18px] place-items-center rounded-full transition-colors duration-500"
                              style={{ background: i < at ? B.accent : i === at ? B.soft : "transparent", border: i > at ? "1px solid rgba(255,255,255,0.15)" : "none", color: "#0E1218" }}
                            >
                              {i < at && <Check size={10} strokeWidth={3} aria-hidden />}
                              {i === at && <span className="size-1.5 rounded-full" style={{ background: B.accent }} />}
                            </span>
                            {s}
                          </span>
                          {i < 3 && <span className="h-px flex-1 bg-white/10" />}
                        </li>
                      );
                    })}
                  </ol>
                </Slot>

                {/* the design, from Drive, with the one thing the client has to do */}
                <Slot part="files" show={has("files")} lit={lit("files")} className="mt-5">
                  <div className="flex items-center gap-3 rounded-[14px] p-3" style={{ background: B.soft }}>
                    <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-[8px] bg-[linear-gradient(135deg,#2a3324,#1d2419)]" aria-hidden>
                      <span className="absolute left-2 top-2 h-1.5 w-8 rounded-full bg-white/40" />
                      <span className="absolute left-2 top-5 h-4 w-11 rounded-[3px] bg-white/20" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11.5px] text-muted">Ready for your eyes</p>
                      <p className="text-[14px] font-medium text-text">Homepage design v3</p>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      {approved ? (
                        <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: calm }} className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: B.accent }}>
                          <Check size={13} strokeWidth={2.5} aria-hidden />
                          Approved
                        </motion.span>
                      ) : (
                        <motion.button
                          key="b"
                          type="button"
                          onClick={() => setApproved(true)}
                          exit={{ opacity: 0, transition: { duration: 0.12 } }}
                          className="flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-semibold text-[#0E1218] transition-colors duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF]"
                          style={{ background: B.accent }}
                        >
                          Approve
                          <ArrowRight size={13} aria-hidden />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </Slot>

                {/* the latest from the team, from Slack */}
                <Slot part="chat" show={has("chat")} lit={lit("chat")} className="mt-4">
                  <div className="flex items-start gap-2.5 rounded-[12px] border border-white/[0.06] p-3">
                    <Face who="leo" size={26} className="!ring-0" />
                    <div className="min-w-0 flex-1 text-[13px] leading-[18px]">
                      <p>
                        <span className="font-medium text-text">Leo</span> <span className="text-subtle">· Studio North · 10:12</span>
                      </p>
                      <p className="text-text/85">{approved ? "Thanks Dana. Starting the build today." : "v3 is ready for your review. Shout if anything feels off."}</p>
                    </div>
                  </div>
                </Slot>
              </div>
            </div>
          </div>
        </div>

        {/* what it means for you */}
        <ul className="mx-auto mt-10 flex max-w-[900px] flex-wrap justify-center gap-x-8 gap-y-3 text-[14px] text-muted">
          {["Built from one sentence", "From what your company already has", "In your brand", "Live on your own domain"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check size={14} className="text-[#A6BBFF]" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A part of the portal: appears when Juno builds it, and lights up with the source that fed it. */
function Slot({ part, show, lit, className = "", children }: { part: Part; show: boolean; lit: boolean; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-part={part}
      className={`relative rounded-[14px] ${className}`}
      initial={false}
      animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(6px)" }}
      transition={{ duration: reduce ? 0 : 0.6, ease: base }}
    >
      {children}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-2 rounded-[16px] ring-1 transition-[opacity,box-shadow] duration-300 ${lit && show ? "opacity-100 ring-[#A6BBFF]/50 shadow-[0_0_0_4px_rgba(166,187,255,0.08)]" : "opacity-0 ring-transparent"}`}
      />
    </motion.div>
  );
}
