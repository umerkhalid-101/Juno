"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Globe, Lock, RotateCw } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { apps } from "@/lib/apps";
import { Section, Window, base, calm, snap, useIdle } from "./kit";
import { HelpCenter, SKINS, type Skin } from "./minis";

const m = apps.made;

function Tile({ title, line, className = "", children }: { title: string; line: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,#10141B,#0C0F14)] p-6 md:p-8 ${className}`}>
      <h3 className="text-[20px] font-medium tracking-[-0.02em] text-text">{title}</h3>
      <p className="mt-1.5 max-w-[42ch] text-[15px] leading-[23px] text-muted">{line}</p>
      <div className="mt-7 min-h-0 flex-1">{children}</div>
    </div>
  );
}

export function Bento() {
  return (
    <Section id="made-around-you" labelledBy="made-title">
      <ChapterIntro id="made-title" lead={m.lead} muted={m.muted} sub={m.sub} />
      <div className="mx-auto mt-14 grid max-w-[1200px] gap-4 md:mt-20 md:gap-5 lg:grid-cols-12">
        <Tile title={m.look.title} line={m.look.line} className="lg:col-span-7">
          <Look />
        </Tile>
        <Tile title={m.work.title} line={m.work.line} className="lg:col-span-5">
          <Work />
        </Tile>
        <Tile title={m.open.title} line={m.open.line} className="lg:col-span-12">
          <Open />
        </Tile>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ your look, your voice */

const BRANDS: Skin[] = ["everyday", "tempo", "gather"];

function Look() {
  const [skin, setSkin] = useState<Skin>("everyday");
  const S = SKINS[skin];
  return (
    <div className="flex h-full flex-col gap-5">
      <Window url={`help.${S.name.toLowerCase().replace(/\s+/g, "")}.com`} chrome={S.bg} className="h-[400px] transition-colors duration-500">
        <HelpCenter skin={skin} />
      </Window>
      <div role="radiogroup" aria-label="Brand" className="flex flex-wrap gap-2">
        {BRANDS.map((b) => {
          const B = SKINS[b];
          const on = b === skin;
          return (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSkin(b)}
              className={`flex h-11 items-center gap-2.5 rounded-full py-1 pl-1 pr-4 text-[13.5px] ring-1 transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] ${
                on ? "bg-white/[0.08] text-text ring-white/25" : "text-muted ring-white/[0.08] hover:text-text"
              }`}
            >
              <span
                className={`grid size-9 place-items-center rounded-full text-[13px] font-semibold ${B.font === "mock-serif" ? "mock-serif text-[15px]" : ""}`}
                style={{ background: B.bg, color: B.accent, borderRadius: B.radius > 14 ? 999 : B.radius + 6 }}
              >
                Aa
              </span>
              {B.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ a place for real work */

const REQUESTS = [
  { who: "Northwind", ask: "Export to CSV", tag: "Reports" },
  { who: "Lumen", ask: "Single sign-on", tag: "Security" },
  { who: "Halcyon", ask: "Weekly digest email", tag: "Email" },
  { who: "Bright & Co", ask: "Custom date ranges", tag: "Reports" },
];

function Work() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const [run, setRun] = useState(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduce) {
      const t = window.setTimeout(() => setN(REQUESTS.length), 0);
      return () => window.clearTimeout(t);
    }
    const ts = REQUESTS.map((_, i) => window.setTimeout(() => setN(i + 1), 500 + i * 520));
    ts.unshift(window.setTimeout(() => setN(0), 0));
    return () => ts.forEach(window.clearTimeout);
  }, [seen, run, reduce]);
  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      {/* company data */}
      <div className="rounded-[16px] border border-white/[0.08] bg-[#0B0E13] p-3">
        <p className="px-1 text-[12.5px] text-muted">{m.work.from}</p>
        <ul className="mt-2 space-y-1">
          {REQUESTS.map((r, i) => (
            <li key={r.ask} className={`flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12.5px] transition-colors duration-300 ${i < n ? "text-subtle" : "text-text/85"}`}>
              <span className="size-1.5 rounded-full bg-[#7A8FFF]" />
              <span className="flex-1 truncate">{r.ask}</span>
              <span className="text-subtle">{r.who}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center gap-2 text-[12px] text-subtle" aria-hidden>
        <span className="h-px w-8 bg-white/10" />
        <ArrowRight size={13} className="rotate-90" />
        <span className="h-px w-8 bg-white/10" />
      </div>
      {/* the app, filling from it */}
      <div className="flex-1 overflow-hidden rounded-[16px] bg-[#F7F8FA] p-3 text-[#16181d]">
        <div className="flex items-center justify-between px-1">
          <p className="text-[13px] font-semibold">{m.work.to}</p>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            aria-label="Sync again"
            className="grid size-8 place-items-center rounded-full text-[#5d6370] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#009CFF]"
          >
            <RotateCw size={14} aria-hidden />
          </button>
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-black/[0.07] px-1 pb-1.5 text-[11px] text-[#8a8f99]">
          <span>Request</span>
          <span>Area</span>
          <span className="w-[58px]" />
        </div>
        <ul className="min-h-[176px]">
          <AnimatePresence initial={false}>
            {REQUESTS.slice(0, n).map((r) => (
              <motion.li
                key={`${run}-${r.ask}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12, ease: snap }}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-b border-black/[0.05] px-1 py-2 text-[12.5px]"
              >
                <span className="truncate">
                  {r.ask} <span className="text-[#8a8f99]">· {r.who}</span>
                </span>
                <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] text-[#5d6370]">{r.tag}</span>
                <span className="flex w-[58px] items-center justify-end gap-1 text-[11px] font-medium text-[#1f7a4d]">
                  <Check size={11} strokeWidth={3} aria-hidden />
                  Synced
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ an idea you can open */

const URL = m.open.url;

function Open() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // 0 private preview · 1 typing the domain · 2 secured · 3 live
  const [s, setS] = useState(0);
  const [typed, setTyped] = useState(0);
  const go = () => {
    if (s > 0) return;
    if (reduce) {
      setTyped(URL.length);
      return setS(3);
    }
    setS(1);
    URL.split("").forEach((_, i) => window.setTimeout(() => setTyped(i + 1), 40 * (i + 1)));
    window.setTimeout(() => setS(2), 40 * URL.length + 250);
    window.setTimeout(() => setS(3), 40 * URL.length + 750);
  };
  const touch = useIdle(ref, 3000, go);
  const reset = () => {
    touch();
    setS(0);
    setTyped(0);
  };
  return (
    <div ref={ref} className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.1] bg-[#0B0E13] pl-2 pr-5">
        <AnimatePresence mode="wait" initial={false}>
          {s < 3 ? (
            <motion.span key="p" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }} className="shrink-0 rounded-full bg-white/[0.06] px-3 py-1.5 text-[12.5px] text-muted">
              Private preview
            </motion.span>
          ) : (
            <motion.span key="l" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: calm }} className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#3DD68C]/15 px-3 py-1.5 text-[12.5px] font-medium text-[#3DD68C]">
              <span className="size-1.5 rounded-full bg-[#3DD68C]" />
              Live
            </motion.span>
          )}
        </AnimatePresence>
        <span className="flex min-w-0 items-center gap-2 text-[16px] text-text md:text-[18px]">
          <AnimatePresence>
            {s >= 2 && (
              <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.12, ease: snap }}>
                <Lock size={15} className="text-[#3DD68C]" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
          {s === 0 ? (
            <span className="truncate text-subtle">preview.juno.app/ideas</span>
          ) : (
            <span className="truncate">
              {URL.slice(0, typed)}
              {s === 1 && <span className="caret ml-px inline-block h-[1.1em] w-px translate-y-[3px] bg-text" />}
            </span>
          )}
          <span className="sr-only">{URL}</span>
        </span>
        <Globe size={16} className="ml-auto shrink-0 text-subtle" aria-hidden />
      </div>
      {s < 3 ? (
        <button
          type="button"
          onClick={() => {
            touch();
            go();
          }}
          disabled={s > 0}
          className="h-14 shrink-0 rounded-full bg-[#F4F6F8] px-7 text-[15px] font-semibold text-[#07090D] transition-[box-shadow,opacity] duration-200 hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF]"
        >
          Publish
        </button>
      ) : (
        <motion.button
          type="button"
          onClick={reset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: base }}
          className="h-14 shrink-0 rounded-full px-6 text-[14px] text-muted transition-colors hover:text-text"
        >
          Start over
        </motion.button>
      )}
    </div>
  );
}
