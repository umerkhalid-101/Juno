"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";
import { useInView } from "motion/react";

/**
 * Plays a click-to-try demo by itself once it has been on screen for a few seconds, so nobody
 * has to find the button. `ready` is the demo's idle state; it waits again whenever it's false.
 */
export function useAutoPlay(ref: RefObject<Element | null>, run: () => void, ready = true, delay = 3000) {
  const inView = useInView(ref, { amount: 0.5 });
  const play = useEffectEvent(run);
  useEffect(() => {
    if (!inView || !ready) return;
    const t = window.setTimeout(() => play(), delay);
    return () => window.clearTimeout(t);
  }, [inView, ready, delay]);
}
