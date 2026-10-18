"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Lock } from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";

/** Motion tokens from the brief. */
export const snap = [0.3, 0, 0, 1] as const;
export const base = [0.2, 0.8, 0.2, 1] as const;
export const calm = [0.16, 1, 0.3, 1] as const;

/**
 * A browser window for the things Juno builds. The apps are light and branded; the chrome takes
 * the app's own paper tone so each one reads as its own product.
 */
export function Window({
  url,
  children,
  className = "",
  chrome = "#F2F1EC",
  ink = "#1d1f24",
  bodyClassName = "",
}: {
  url: ReactNode;
  children: ReactNode;
  className?: string;
  chrome?: string;
  ink?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[18px] shadow-[0_40px_120px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] ring-1 ring-black/10 ${className}`}
      style={{ color: ink }}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-black/[0.06] px-3.5" style={{ background: chrome }}>
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-[10px] rounded-full bg-[#FF5F57]" />
          <span className="size-[10px] rounded-full bg-[#FEBC2E]" />
          <span className="size-[10px] rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto flex h-6 min-w-0 max-w-[60%] items-center justify-center gap-1.5 truncate rounded-full bg-white/80 px-3 text-[11.5px] text-[#5d6370] ring-1 ring-black/[0.05]">
          <Lock size={10} className="shrink-0 text-[#8a909c]" aria-hidden />
          <span className="truncate">{url}</span>
        </span>
        <span className="w-[46px]" aria-hidden />
      </div>
      <div className={`@container relative min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

/** What you asked Juno, in the chat. */
export function YouBubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rounded-[18px] rounded-br-[6px] bg-[#1C222C] px-4 py-3 text-[15px] leading-[22px] text-text ring-1 ring-white/[0.06] ${className}`}>
      {children}
    </p>
  );
}

/** Juno's answer, with the mark. */
export function JunoLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <MascotMark size={24} className="mt-px shrink-0" />
      <div className="min-w-0">
        <p className="text-[12px] text-subtle">Juno</p>
        <p className="text-[15px] leading-[22px] text-text">{children}</p>
      </div>
    </div>
  );
}

/** A soft status pill inside the built apps, always with a word. */
export function Tag({ children, tone = "ok", className = "" }: { children: ReactNode; tone?: "ok" | "muted" | "blue" | "warn" | "violet"; className?: string }) {
  const t = {
    ok: "bg-[#E4F3EA] text-[#1f7a4d]",
    muted: "bg-black/[0.05] text-[#5d6370]",
    blue: "bg-[#E7ECFF] text-[#3346e0]",
    warn: "bg-[#FBEEDC] text-[#9a5b0a]",
    violet: "bg-[#EEEAFE] text-[#5b45d6]",
  }[tone];
  return <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11.5px] font-medium ${t} ${className}`}>{children}</span>;
}

/** The note every demo field carries. */
export function DemoNote({ className = "" }: { className?: string }) {
  return <p className={`text-[11px] text-[#8a8f99] ${className}`}>Demo. Nothing is sent.</p>;
}

/**
 * Marks something Juno just added or changed: a blue outline that pulses once and a small tag,
 * both gone after 1.5s. `k` restarts it.
 */
export function Diff({ k, label = "Added", children, className = "" }: { k: number | string | null; label?: string; children: ReactNode; className?: string }) {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (k === null) return;
    // pulse once per new key, then fade out
    const t0 = window.setTimeout(() => setOn(true), 0);
    const t1 = window.setTimeout(() => setOn(false), 1500);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, [k]);
  return (
    <div className={`relative ${className}`}>
      {children}
      <AnimatePresence>
        {on && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-1.5 rounded-[14px] ring-2 ring-[#324CFF]"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: [0, 1, 0.55, 1], scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.6, ease: base }}
          >
            <span className="absolute -top-2.5 right-3 rounded-full bg-[#324CFF] px-2 py-0.5 text-[10.5px] font-medium text-white">{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Plays something once if the visitor leaves it alone: starts counting when `ref` is in view,
 * gives up for good after any interaction (call `touch`).
 */
export function useIdle(ref: RefObject<Element | null>, ms: number, run: () => void) {
  const seen = useInView(ref, { amount: 0.5 });
  const touched = useRef(false);
  const fired = useRef(false);
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });
  useEffect(() => {
    if (!seen || touched.current || fired.current) return;
    const t = window.setTimeout(() => {
      if (touched.current || document.hidden) return;
      fired.current = true;
      runRef.current();
    }, ms);
    return () => window.clearTimeout(t);
  }, [seen, ms]);
  return () => {
    touched.current = true;
  };
}

/** Section wrapper with the site's rhythm. */
export function Section({ id, labelledBy, children, className = "" }: { id?: string; labelledBy: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative scroll-mt-24 pt-36 md:pt-56 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
