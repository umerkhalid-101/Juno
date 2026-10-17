"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * A number that rolls when it changes: up when it grows, down when it shrinks. Never hard-swaps.
 * Decorative: pair it with a visually hidden static equivalent.
 */
export function RollingNumber({ value, className = "" }: { value: number; className?: string }) {
  // remember the last value and which way it moved (derived state, updated during render)
  const [seen, setSeen] = useState({ v: value, dir: 1 });
  const dir = seen.v !== value ? (value > seen.v ? 1 : -1) : seen.dir;
  if (seen.v !== value) setSeen({ v: value, dir });
  const digits = String(value).length;
  return (
    <span aria-hidden className={`relative inline-grid h-[1.2em] overflow-hidden tabular-nums ${className}`} style={{ width: `${digits}ch` }}>
      <AnimatePresence initial={false} mode="popLayout" custom={dir}>
        <motion.span
          key={value}
          custom={dir}
          variants={{
            enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%", opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (d: number) => ({ y: d > 0 ? "-100%" : "100%", opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.3, 0, 0, 1] }}
          className="col-start-1 row-start-1 text-center leading-[1.2em]"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
