"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, FileText, KeyRound, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { TextLink } from "@/components/ui/TextLink";
import { useAutoPlay } from "@/components/ui/useAutoPlay";
import { MascotMark } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";
import { chapters, feature } from "@/lib/features";
import { Anatomy, Glyph, Keycap, SectionHead } from "./kit";

/**
 * Chapter 4: control you can feel. Every tile answers back: flip a key on, press the real
 * shortcut, bring a teammate in, approve the queue.
 */

const snap = [0.3, 0, 0, 1] as const;
const calm = [0.16, 1, 0.3, 1] as const;

function Tile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-[20px] border border-line bg-surface p-5 transition-colors duration-200 hover:border-line-strong md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${on ? "bg-success" : "bg-white/15"}`}
    >
      <span
        className="absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform duration-200 [transition-timing-function:var(--ease-snap)]"
        style={{ transform: on ? "translateX(20px)" : "none" }}
      />
    </button>
  );
}

/* Vault: approve access to a key without ever seeing it. */
function VaultDemo() {
  const [keys, setKeys] = useState({ web: false, api: true });
  const rows = [
    { k: "web" as const, name: "Website login" },
    { k: "api" as const, name: "API credential" },
  ];
  return (
    <div className="mt-8 rounded-[16px] border border-line bg-white/[0.02] p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[14px] font-medium text-text">
          <KeyRound size={15} strokeWidth={1.75} className="text-[#FFC9A8]" aria-hidden />
          Company vault
        </span>
        <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-success/15 px-2.5 text-[12px] font-medium text-success">
          <ShieldCheck size={12} aria-hidden />
          Approved access
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => {
          const on = keys[r.k];
          return (
            <li key={r.k} className="flex items-center gap-3 rounded-[12px] bg-white/[0.03] p-3">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                  on ? "bg-success/15 text-success" : "bg-white/[0.06] text-muted"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={on ? "ok" : "lock"}
                    initial={{ scale: 0.6, opacity: 0, rotate: on ? -30 : 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.2, ease: snap }}
                  >
                    {on ? (
                      <Check size={14} strokeWidth={2.5} aria-hidden />
                    ) : (
                      <Lock size={14} aria-hidden />
                    )}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] text-text">{r.name}</span>
                <span className="block font-mono text-[12px] tracking-[0.1em] text-muted">
                  •••• •••• ••••
                </span>
              </span>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.span
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: calm }}
                    className="hidden text-[12px] text-muted sm:inline"
                  >
                    Approved by you
                  </motion.span>
                )}
              </AnimatePresence>
              <Toggle
                on={on}
                label={`Let Juno use the ${r.name.toLowerCase()}`}
                onChange={() => setKeys((s) => ({ ...s, [r.k]: !s[r.k] }))}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* Quick Ask: the real shortcut opens Juno over your work. */
function QuickAskDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [pressed, setPressed] = useState(-1);
  const [open, setOpen] = useState(false);

  const fire = () => {
    if (reduce) {
      setOpen(true);
      return;
    }
    [0, 1, 2].forEach((k) => window.setTimeout(() => setPressed(k), k * 90));
    window.setTimeout(() => {
      setPressed(-1);
      setOpen(true);
    }, 380);
  };

  // only listen while the tile is on screen, and never swallow other shortcuts
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const j = e.key.toLowerCase() === "j" || e.code === "KeyJ";
      if (j && e.ctrlKey && (e.metaKey || e.altKey)) {
        e.preventDefault();
        fire();
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // three seconds on screen and the keys press themselves
  useAutoPlay(ref, fire, !open && pressed === -1);
  return (
    <div
      ref={ref}
      className="relative mt-8 flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-[16px] border border-line bg-white/[0.02] p-5"
    >
      <button
        type="button"
        onClick={fire}
        aria-label="Open Quick Ask"
        className="flex items-center gap-2 rounded-[14px] p-2 outline-none"
      >
        {["⌃", "⌘", "J"].map((k, i) => (
          <Keycap
            key={k}
            className={`!h-12 !min-w-12 !rounded-[10px] !text-[18px] !text-text transition-transform duration-100 ${
              pressed === i
                ? "translate-y-[2px] !bg-white/[0.1] !shadow-none"
                : "shadow-[inset_0_-3px_0_rgba(255,255,255,0.08)]"
            }`}
          >
            {k}
          </Keycap>
        ))}
      </button>
      <span className="mt-3 text-[13px] text-muted">Try it</span>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-3 flex flex-col rounded-[14px] border border-line-strong bg-surface-2 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: snap }}
            role="dialog"
            aria-label="Quick Ask"
          >
            <div className="flex items-center gap-2.5 border-b border-line pb-3 text-[14px] text-muted">
              <MascotMark size={20} />
              Ask about what&apos;s on screen
            </div>
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: calm }}
            >
              <span className="text-[12px] font-medium text-[#A6BBFF]">Juno</span>
              <p className="mt-1 text-[15px] text-text">Here&apos;s what the customer needs.</p>
              <ul className="mt-2 space-y-1 text-[13px] text-muted">
                <li>Client sharing for scheduled reports</li>
                <li>A preview before the first send</li>
              </ul>
            </motion.div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-auto self-end text-[12px] text-muted hover:text-text"
            >
              Esc to close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Shared Conversations: bring Maya in and everyone has the same context. */
function SharedDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const bring = () => {
    if (step) return;
    setStep(1);
    window.setTimeout(() => setStep(2), 600);
    window.setTimeout(() => setStep(3), 1500);
  };
  useAutoPlay(ref, bring, step === 0);
  return (
    <div ref={ref} className="mt-8 flex flex-1 flex-col rounded-[16px] border border-line bg-white/[0.02] p-4">
      <div className="flex h-[42px] items-center justify-between border-b border-line pb-3">
        <span className="text-[13px] text-muted">Launch planning</span>
        <span className="flex items-center -space-x-2">
          <AnimatePresence initial={false}>
            {step >= 1 && (
              <motion.span
                key="m"
                className="flex"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: snap }}
              >
                <Face who="maya" size={26} className="!ring-surface" />
              </motion.span>
            )}
          </AnimatePresence>
          <Face who="sam" size={26} className="!ring-surface" />
          <Face who="leo" size={26} className="!ring-surface" />
        </span>
      </div>
      <div className="min-h-[252px] flex-1 space-y-3 py-4 text-[14px]">
        <AnimatePresence initial={false}>
          {step >= 2 && (
            <motion.div
              key="maya"
              className="flex items-start gap-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: snap }}
            >
              <Face who="maya" size={24} className="!ring-0" />
              <span>
                <span className="block text-[12px] text-muted">Maya</span>
                <span className="text-text">What&apos;s left before we launch?</span>
              </span>
            </motion.div>
          )}
          {step >= 3 && (
            <motion.div
              key="juno"
              className="flex items-start gap-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: snap }}
            >
              <MascotMark size={24} />
              <span className="min-w-0">
                <span className="block text-[12px] text-muted">Juno</span>
                <span className="text-text">
                  The website is ready. Let&apos;s review the announcement together.
                </span>
                <span className="mt-2 flex w-fit items-center gap-2 rounded-[10px] bg-white/[0.05] px-3 py-2 text-[13px] text-text">
                  <FileText size={14} strokeWidth={1.75} className="text-muted" aria-hidden />
                  Launch announcement
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={bring}
        disabled={step > 0}
        className="h-11 rounded-full bg-[#F4F6F8] text-[14px] font-semibold text-[#07090D] transition-opacity disabled:opacity-40"
      >
        {step ? "Maya is in" : "Bring Maya in"}
      </button>
    </div>
  );
}

/* Approval: the queue waits for you; approve all and each goes out in turn. */
const queue = ["Launch email to 2,140 customers", "Post in #team", "Follow-up to Maya"];
function ApprovalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(0);
  const [busy, setBusy] = useState(false);
  const all = () => {
    if (busy || sent) return;
    setBusy(true);
    queue.forEach((_, i) =>
      window.setTimeout(
        () => {
          setSent(i + 1);
          if (i === queue.length - 1) setBusy(false);
        },
        250 + i * 260,
      ),
    );
  };
  useAutoPlay(ref, all, sent === 0 && !busy);
  return (
    <div ref={ref} className="mt-8 rounded-[16px] border border-line bg-white/[0.02] p-4">
      <ul className="space-y-2">
        {queue.map((q, i) => {
          const done = sent > i;
          return (
            <li
              key={q}
              className="flex items-center justify-between gap-3 rounded-[12px] bg-white/[0.03] p-3.5"
            >
              <span className="min-w-0 truncate text-[14px] text-text">{q}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={done ? "s" : "n"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12, ease: snap }}
                  className={`inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium ${
                    done ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                  }`}
                >
                  {done && <Check size={12} strokeWidth={2.5} aria-hidden />}
                  {done ? "Sent" : "Needs your yes"}
                </motion.span>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={all}
          disabled={sent > 0}
          className="h-11 rounded-full bg-[#F4F6F8] px-5 text-[14px] font-semibold text-[#07090D] transition-opacity disabled:opacity-40"
        >
          Approve all
        </button>
        <button
          type="button"
          onClick={() => setSent(0)}
          className={`flex h-11 items-center gap-1.5 px-3 text-[13px] text-muted transition-opacity hover:text-text ${sent === queue.length ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <RotateCcw size={13} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  );
}

export function FxTerms() {
  return (
    <section
      id="terms"
      aria-labelledby="terms-title"
      className="relative scroll-mt-24 py-24 md:py-40"
    >
      <div className="container-page">
        <SectionHead
          id="terms-title"
          title={chapters.terms.title}
          muted={chapters.terms.muted}
          sub={chapters.terms.sub}
        />
        <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-5 md:mt-24 md:grid-cols-12">
          <Tile className="md:col-span-7">
            <div id="vault" className="scroll-mt-32">
              <Anatomy f={feature("vault")} />
            </div>
            <VaultDemo />
          </Tile>
          <Tile className="md:col-span-5">
            <div id="quick-ask" className="scroll-mt-32">
              <Anatomy f={feature("quick-ask")}>
                <div className="mt-4">
                  <TextLink href="/download">Download for Mac</TextLink>
                </div>
              </Anatomy>
            </div>
            <QuickAskDemo />
          </Tile>
          <Tile className="md:col-span-5">
            <div id="shared-conversations" className="scroll-mt-32">
              <Anatomy f={feature("shared-conversations")} />
            </div>
            <SharedDemo />
          </Tile>
          <Tile className="md:col-span-7">
            <div className="flex items-center gap-3">
              <Glyph icon={ShieldCheck} size={40} />
              <h3 className="text-[20px] font-medium tracking-[-0.015em] text-[#A6BBFF] md:text-[22px]">Approval</h3>
            </div>
            <p className="mt-6 text-balance text-[24px] font-medium leading-[30px] tracking-[-0.02em] text-text md:text-[26px] md:leading-[32px]">
              Nothing goes out without your yes.
            </p>
            <p className="mt-4 max-w-[44ch] text-[16px] leading-[25px] text-muted">Juno drafts it. You approve it with one click.</p>
            <ApprovalDemo />
          </Tile>
        </div>
      </div>
    </section>
  );
}
