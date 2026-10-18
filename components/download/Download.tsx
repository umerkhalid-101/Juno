"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, FileText, Globe, Keyboard, Mic, Play } from "lucide-react";
import { siApple } from "simple-icons";
import { Button } from "@/components/ui/Button";
import { FaqConsole } from "@/components/ui/FaqConsole";
import { MascotMark } from "@/components/mascot/Mascot";
import { MacBook } from "@/components/product/decor";
import { BROWSER_HREF, DOWNLOAD_HREF, download } from "@/lib/download";

/**
 * Download Juno for Mac. The hero is the product's one trick, played out on a MacBook: you're
 * in your launch plan, three keys go down, the screen is read in one sweep of light, Quick Ask
 * opens, a question types itself, and Juno answers. Press ⌃⌘J yourself and it plays again.
 */

const calm = [0.16, 1, 0.3, 1] as const;

export function AppleMark({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={siApple.path} />
    </svg>
  );
}

/* ------------------------------------------------------------------ keys */

const keyWords: Record<string, string> = { "⌃": "control", "⌘": "command" };

/** A real Mac key: symbol top right, its name under it, and a proper press. */
function Keycap({ k, down }: { k: string; down: boolean }) {
  const word = keyWords[k];
  return (
    <span
      className="relative grid size-[68px] select-none place-items-center rounded-[14px] border border-white/[0.08] transition-[transform,box-shadow,background,color] duration-150 md:size-[84px] md:rounded-[16px]"
      style={{
        transform: down ? "translateY(4px)" : "none",
        background: down ? "linear-gradient(180deg,#263152,#1B2238)" : "linear-gradient(180deg,#1E232D,#14181F)",
        color: down ? "#D6DEFF" : "#C8CFDA",
        boxShadow: down
          ? "0 1px 0 #04060A, 0 0 0 1px rgba(122,143,255,0.55), 0 0 40px -6px rgba(122,143,255,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 6px 0 #05070A, 0 14px 30px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {word ? (
        <>
          <span className="absolute right-2.5 top-2 text-[17px] md:right-3 md:top-2.5 md:text-[20px]">{k}</span>
          <span className="absolute bottom-2 left-2.5 text-[10.5px] tracking-[0.01em] md:bottom-2.5 md:left-3 md:text-[12px]">{word}</span>
        </>
      ) : (
        <span className="text-[26px] font-medium md:text-[30px]">{k}</span>
      )}
    </span>
  );
}

function MiniKeys() {
  return (
    <span className="flex gap-1" aria-hidden>
      {download.shortcut.keys.map((k) => (
        <kbd key={k} className="grid h-6 min-w-6 place-items-center rounded-[6px] border border-white/[0.12] bg-white/[0.05] px-1 font-sans text-[11px] text-muted">
          {k}
        </kbd>
      ))}
    </span>
  );
}

/** Types itself out once; remount to type again. */
function Typed({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) return;
    const iv = window.setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), 38);
    return () => window.clearInterval(iv);
  }, [text, reduce]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="caret ml-px inline-block h-[15px] w-px translate-y-[2px] bg-text/80" />}
    </>
  );
}

/* ------------------------------------------------------------------ the screen */

const s = download.screen;

function Screen({ step }: { step: number }) {
  const reduce = useReducedMotion();
  const scanning = step === 4;
  const open = step >= 5;
  const answered = step >= 6;
  return (
    <div className="relative h-[330px] overflow-hidden md:h-[520px]">
      {/* the launch plan, in its own window */}
      <div className="absolute inset-x-0 top-0 mx-auto h-full max-w-[860px] overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex h-9 items-center gap-2 border-b border-black/[0.07] bg-[#F3F4F6] px-3.5">
          <span className="flex gap-1.5" aria-hidden>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <span key={c} className="size-[10px] rounded-full" style={{ background: c }} />
            ))}
          </span>
          <span className="mx-auto text-[12px] font-medium text-[#4a4f5c]">{s.label}</span>
          <span className="w-[42px]" />
        </div>
        <div className="flex h-[calc(100%-36px)]">
          <aside className="hidden w-[190px] shrink-0 border-r border-black/[0.06] bg-[#FAFAFB] p-4 text-[12.5px] md:block">
            <p className="font-semibold">{s.app}</p>
            {["Friday", "Launch checklist", "Announcement", "Customer email"].map((x, i) => (
              <p key={x} className={`mt-1.5 rounded-[6px] px-2 py-1.5 ${i === 1 ? "bg-[#EEF0F3] font-medium" : "text-[#6b7080]"}`}>
                {x}
              </p>
            ))}
          </aside>
          <div className="min-w-0 flex-1 p-5 md:p-9">
            <p className="text-[10.5px] font-semibold tracking-[0.14em] text-[#8a909c]">{s.eyebrow.toUpperCase()}</p>
            <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.04em] md:text-[46px]">{s.title}</p>
            <p className="mt-3 text-[14px] text-[#4a4f5c] md:text-[16px]">{s.sub}</p>
            <ul className="mt-5 max-w-[420px] space-y-2 md:mt-7">
              {s.checklist.map((c, i) => {
                const last = i === s.checklist.length - 1;
                return (
                  <li
                    key={c}
                    className={`flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] ring-1 transition-[box-shadow,background-color] duration-500 ${
                      last && answered ? "bg-[#EEF2FF] ring-[#5b74ff]/60 shadow-[0_0_0_4px_rgba(91,116,255,0.12)]" : "bg-white ring-black/[0.07]"
                    }`}
                  >
                    {last ? (
                      <span className="size-[18px] rounded-full border-2 border-[#c6cad4]" />
                    ) : (
                      <span className="grid size-[18px] place-items-center rounded-full bg-[#2f9e6a] text-white">
                        <Check size={11} strokeWidth={3.5} aria-hidden />
                      </span>
                    )}
                    <span className={last ? "font-medium" : "text-[#4a4f5c]"}>{c}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* the screen, read in one sweep of light */}
      <AnimatePresence>
        {scanning && !reduce && (
          <motion.span
            key="scan"
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-28"
            style={{ background: "linear-gradient(180deg, transparent, rgba(122,143,255,0.18) 70%, rgba(166,187,255,0.9) 98%, transparent)" }}
            initial={{ top: "-30%" }}
            animate={{ top: "105%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.45, 0, 0.25, 1] }}
          />
        )}
      </AnimatePresence>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] transition-[box-shadow,background-color] duration-300"
        style={{
          boxShadow: scanning ? "inset 0 0 0 2px rgba(166,187,255,0.75), inset 0 0 60px rgba(122,143,255,0.25)" : "inset 0 0 0 0 transparent",
          background: open ? "rgba(5,7,12,0.32)" : "transparent",
        }}
      />

      {/* Quick Ask */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="qa"
            className="absolute left-1/2 top-[10%] w-[min(470px,92%)] -translate-x-1/2"
            initial={reduce ? false : { opacity: 0, y: -14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="dl-panel overflow-hidden rounded-[20px] p-4 text-left">
              <div className="flex items-center gap-2.5">
                <MascotMark size={24} />
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-text">Quick Ask</p>
                  <p className="text-[12px] text-muted">{s.quick}</p>
                </div>
                <span className="ml-auto">
                  <MiniKeys />
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2.5 rounded-[12px] border border-white/[0.08] bg-white/[0.03] p-2">
                <span className="h-9 w-14 shrink-0 overflow-hidden rounded-[6px] bg-white p-1">
                  <span className="block h-1 w-6 rounded-full bg-black/20" />
                  <span className="mt-1 block h-1.5 w-9 rounded-full bg-black/70" />
                  <span className="mt-1 block h-1 w-10 rounded-full bg-black/15" />
                  <span className="mt-0.5 block h-1 w-8 rounded-full bg-black/15" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] text-text">{s.attach}</span>
                  <span className="block text-[11.5px] text-subtle">Your screen</span>
                </span>
              </div>
              <p className="mt-3 flex min-h-[42px] items-center rounded-[12px] border border-white/[0.1] bg-[#0B0E14] px-3.5 text-[14.5px] text-text">
                <Typed key={`ask-${step >= 5}`} text={s.ask} />
              </p>
              <AnimatePresence>
                {answered && (
                  <motion.p
                    className="mt-3 flex items-center gap-2.5 text-[15px] text-text"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: calm }}
                  >
                    <MascotMark size={20} />
                    {s.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

// idle, ⌃, ⌘, J, the sweep, Quick Ask opens and types, Juno answers
const durations = [1900, 360, 360, 460, 900, 1800, 3800];

export function DlHero() {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.25 });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const t = window.setTimeout(() => setStep((x) => (x + 1) % durations.length), durations[step]);
    return () => window.clearTimeout(t);
  }, [step, inView, reduce]);

  // press the real shortcut and it plays for you
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.metaKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setStep(1);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const shown = reduce ? 6 : step;
  const h = download.hero;

  return (
    <section aria-labelledby="dl-title" className="relative overflow-x-clip pt-[140px] md:pt-[168px]">
      {/* glow 1 of 2 */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[260px] h-[900px] w-[min(1500px,170vw)] -translate-x-1/2"
        style={{ background: "radial-gradient(45% 40% at 50% 50%, rgba(50,76,255,0.24), rgba(143,124,255,0.09) 55%, transparent 76%)" }}
      />
      <div className="container-page relative flex flex-col items-center text-center">
        <h1 id="dl-title" className="t-display-xl text-balance">
          {[h.lead, h.word, h.tail].map((w, i) => (
            <motion.span
              key={w}
              className={`inline-block ${i < 2 ? "mr-[0.24em]" : ""}`}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 + i * 0.1, ease: calm }}
            >
              {i === 1 ? <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_55%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">{w}</span> : w}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="t-body-l mt-5 max-w-[36ch] text-pretty text-muted"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: calm }}
        >
          {h.sub}
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: calm }}
        >
          <Button size="lg" variant="white" href={DOWNLOAD_HREF} trailing={<AppleMark size={16} />}>
            {h.primary}
          </Button>
          <Button size="lg" variant="secondary" href={BROWSER_HREF} trailing={<Globe size={16} strokeWidth={1.75} aria-hidden />}>
            {h.secondary}
          </Button>
        </motion.div>
        <p className="mt-4 text-[13px] text-subtle">{h.note}</p>
      </div>

      {/* the Mac, doing the one thing */}
      <motion.div
        ref={stage}
        className="container-page relative mt-14 md:mt-20"
        initial={reduce ? false : { opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: calm }}
      >
        <MacBook app={s.app} menu={["File", "View"]} className="max-w-[1080px]" inner="px-2 pb-2 pt-3 md:px-10 md:pb-[96px] md:pt-7">
          <Screen step={shown} />
        </MacBook>
      </motion.div>

      {/* the shortcut, on real keys */}
      <div className="container-page relative mt-16 flex flex-col items-center text-center md:mt-20">
        <div className="flex items-end gap-3 md:gap-4" aria-hidden>
          {download.shortcut.keys.map((k, i) => (
            <Keycap key={k} k={k} down={shown >= i + 1 && shown <= 4} />
          ))}
        </div>
        <h2 className="t-display-l mt-12 text-balance">
          {download.shortcut.title} <span className="accent-text block">{download.shortcut.muted}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] text-pretty text-[17px] leading-[27px] text-muted">{download.shortcut.sub}</p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-5 text-[14px] font-medium text-text transition-colors hover:bg-white/[0.07]"
        >
          <Play size={13} className="fill-current" aria-hidden />
          {download.shortcut.try}
          <span className="ml-1 hidden sm:inline">
            <MiniKeys />
          </span>
        </button>
        <span className="sr-only">Press Control, Command and J to open Quick Ask.</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ made for the way you work */

function Card({ title, body, children, tint, i }: { title: string; body: string; children: ReactNode; tint: string; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0E1218]"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: calm, delay: i * 0.08 }}
    >
      <div
        className="relative h-[300px] overflow-hidden border-b border-white/[0.06]"
        style={{ background: `radial-gradient(90% 80% at 50% 100%, rgba(${tint},0.18), transparent 70%), radial-gradient(70% 60% at 0% 0%, rgba(${tint},0.06), transparent 60%)` }}
      >
        {children}
      </div>
      <div className="p-7">
        <p className="text-[22px] font-medium tracking-[-0.02em] text-text">{title}</p>
        <p className="mt-2 text-[15.5px] leading-[24px] text-muted">{body}</p>
      </div>
    </motion.li>
  );
}

function VoiceVisual() {
  return (
    <div className="grid h-full place-items-center px-6">
      <div className="w-full max-w-[320px]">
        <div className="flex items-center gap-3 rounded-full border border-white/[0.1] bg-[#151A22] p-2 pr-5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]">
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-[#5b74ff] text-white">
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#5b74ff]/40" />
            <Mic size={18} className="relative" aria-hidden />
          </span>
          <span className="dl-wave flex h-8 flex-1 items-center justify-between" aria-hidden>
            {Array.from({ length: 22 }, (_, i) => (
              <span key={i} className="w-[3px] rounded-full bg-[#A6BBFF]" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * 0.11}s` } as CSSProperties} />
            ))}
          </span>
        </div>
        <p className="mt-5 text-center text-[18px] text-text">“Help me think this through.”</p>
        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted">
          <Keyboard size={14} aria-hidden />
          Or type it out
        </p>
      </div>
    </div>
  );
}

function ContinueVisual() {
  return (
    <div className="relative h-full px-6 pt-8">
      <div className="relative z-10 ml-1 w-[230px] rounded-[14px] border border-white/[0.1] bg-[#151A22] p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]">
        <p className="flex items-center gap-2 text-[12px] text-muted">
          <MascotMark size={16} /> Quick Ask
        </p>
        <p className="mt-1.5 text-[13px] text-text">The customer email is next.</p>
      </div>
      <svg aria-hidden className="absolute left-[120px] top-[96px]" width="80" height="60" viewBox="0 0 80 60" fill="none">
        <path d="M2 2 C 10 40, 40 52, 74 54" stroke="rgba(166,187,255,0.5)" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d="M68 49 L75 54 L68 58" stroke="rgba(166,187,255,0.7)" strokeWidth="1.5" />
      </svg>
      <div className="absolute bottom-0 right-5 w-[270px] overflow-hidden rounded-t-[14px] bg-white text-[#16181d] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#F3F4F6] px-3 py-2 text-[11px] text-[#6b7080]">
          <MascotMark size={12} /> Juno · Launch plan
        </div>
        <div className="p-3.5">
          <p className="text-[14px] font-semibold">The customer email is next.</p>
          <div className="mt-2.5 flex items-center gap-2 rounded-[8px] bg-[#F4F5F7] px-2.5 py-2 text-[12px]">
            <FileText size={13} className="text-[#6b7080]" aria-hidden />
            <span className="font-medium">Feature announcement</span>
            <span className="ml-auto text-[11px] text-[#3b4fd8]">Ready for your review</span>
          </div>
          <span className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-[#16181d] px-3.5 text-[12px] font-medium text-white">
            Keep going in Juno <ArrowRight size={12} aria-hidden />
          </span>
          <span className="block h-4" />
        </div>
      </div>
    </div>
  );
}

function NotifyVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { amount: 0.4 });
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!on) return;
    const iv = window.setInterval(() => setK((x) => x + 1), 5200);
    return () => window.clearInterval(iv);
  }, [on]);
  return (
    <div ref={ref} className="relative h-full overflow-hidden bg-[radial-gradient(70%_90%_at_20%_10%,#2B3C86_0%,transparent_60%),radial-gradient(60%_80%_at_90%_40%,#5B4AA8_0%,transparent_60%),linear-gradient(180deg,#121A3A,#1A1F45)]">
      <div className="absolute bottom-6 left-6">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-white/70">FRIDAY</p>
        <p className="mt-1 text-[38px] font-semibold leading-none tracking-[-0.04em] text-white">Good morning.</p>
      </div>
      <AnimatePresence mode="popLayout">
        {on && (
          <motion.div
            key={k}
            className="absolute right-4 top-4 w-[270px] rounded-[16px] bg-[#1E2433]/95 p-3 text-left shadow-[0_20px_40px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.1]"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.3 }}
          >
            <p className="flex items-center gap-2 text-[11.5px] text-white/60">
              <span className="grid size-5 place-items-center rounded-[6px] bg-[#0B0E14]">
                <MascotMark size={14} />
              </span>
              Juno
              <span className="ml-auto">now</span>
            </p>
            <p className="mt-1.5 text-[13.5px] font-semibold text-white">Your briefing is ready.</p>
            <p className="text-[12.5px] text-white/70">Here’s what changed this week.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DlMade() {
  const m = download.made;
  const visuals = [<VoiceVisual key="v" />, <ContinueVisual key="c" />, <NotifyVisual key="n" />];
  const tints = ["122,143,255", "195,182,255", "143,220,203"];
  return (
    <section aria-labelledby="made-title" className="pt-36 md:pt-56">
      <div className="container-page">
        <h2 id="made-title" className="t-display-l mx-auto max-w-[820px] text-balance text-center">
          {m.title} <span className="accent-text block">{m.muted}</span>
        </h2>
        <ul className="mx-auto mt-14 grid max-w-[1200px] gap-4 md:mt-16 md:grid-cols-3">
          {m.cards.map((c, i) => (
            <Card key={c.title} title={c.title} body={c.body} tint={tints[i]} i={i}>
              {visuals[i]}
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ questions */

export function DlFaq() {
  const f = download.faq;
  return (
    <section aria-labelledby="faq-title" className="pt-36 md:pt-56">
      <div className="container-page">
        <h2 id="faq-title" className="t-display-l mx-auto max-w-[820px] text-balance text-center">
          {f.title} <span className="accent-text block">{f.muted}</span>
        </h2>
        <FaqConsole items={f.items} />
        <p className="mx-auto mt-8 max-w-[760px] text-center text-[14px] text-muted">
          Prefer the web?{" "}
          <a href={BROWSER_HREF} className="inline-flex items-center gap-1 text-[#A6BBFF] transition-colors hover:text-text">
            {download.hero.secondary} <ArrowUpRight size={13} aria-hidden />
          </a>
        </p>
      </div>
    </section>
  );
}
