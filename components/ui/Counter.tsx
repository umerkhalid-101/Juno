"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** Rolls up when it enters view. Server renders the final value (no-JS safe). */
export function Counter({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const armed = useRef(false);

  useEffect(() => {
    if (reduce || !ref.current || armed.current) return;
    armed.current = true;
    ref.current.textContent = `0${suffix}`;
  }, [reduce, suffix]);

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const el = ref.current;
    const c = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => c.stop();
  }, [inView, reduce, suffix, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  );
}
