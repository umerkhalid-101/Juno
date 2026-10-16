"use client";

import { AnimatePresence, motion } from "motion/react";

export type Status = "Draft" | "Needs you" | "Scheduled" | "Sent" | "Shipped" | "Done" | "Blocked";

const tone: Record<Status, { c: string; bg: string }> = {
  Draft: { c: "var(--st-muted)", bg: "rgba(154,166,184,0.16)" },
  "Needs you": { c: "var(--st-warn)", bg: "rgba(255,181,71,0.17)" },
  Scheduled: { c: "var(--st-blue)", bg: "rgba(122,143,255,0.16)" },
  Sent: { c: "var(--st-ok)", bg: "rgba(61,214,140,0.16)" },
  Shipped: { c: "var(--st-ok)", bg: "rgba(61,214,140,0.16)" },
  Done: { c: "var(--st-ok)", bg: "rgba(61,214,140,0.16)" },
  Blocked: { c: "var(--st-bad)", bg: "rgba(255,101,104,0.16)" },
};

/** sm radius, 12px mono, status color at 15% fill + full-color text. Flips with a snap. */
export function StatusChip({ status, className = "" }: { status: Status; className?: string }) {
  const t = tone[status];
  return (
    <span
      className={`relative inline-flex h-6 items-center overflow-hidden rounded-sm px-2 font-mono text-[12px] leading-4 font-medium transition-colors duration-[120ms] ${className}`}
      style={{ background: t.bg, color: t.c, transitionTimingFunction: "var(--ease-snap)" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.12, ease: [0.3, 0, 0, 1] }}
          className="inline-flex items-center gap-1.5"
        >
          <span aria-hidden className="size-1.5 rounded-full" style={{ background: t.c }} />
          {status}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Static chip used inside GSAP-driven scenes (no React state). Swap text via data attributes. */
export function chipStyle(status: Status) {
  const t = tone[status];
  return { background: t.bg, color: t.c };
}
