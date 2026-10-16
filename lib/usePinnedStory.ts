"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "./gsap";
import { config } from "./config";

type BuildCtx = { isMobile: boolean };
type Options = {
  /** false: no scroll lock. The timeline scrubs as the section passes through the viewport. */
  pin?: boolean;
  /** Start position when unpinned (default "top 80%"). */
  start?: string;
  /** Pin length on desktop. Max 2.5 screens. */
  end?: string;
  /** Pin length on mobile. Max 1.5 screens. */
  mobileEnd?: string;
  /** Set false to scrub without pinning on mobile. */
  pinMobile?: boolean;
  onProgress?: (p: number) => void;
};

/**
 * Pinned, scroll-scrubbed chapter. The timeline is built paused and follows
 * scroll progress with light smoothing (native scroll speed, no scroll-jacking).
 * Reduced motion: nothing is built, markup renders its final state.
 * Pause: jumps the timeline to its final state and stops following scroll.
 */
export function usePinnedStory(
  scope: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  build: (ctx: BuildCtx) => gsap.core.Timeline | null,
  opts: Options = {},
) {
  const barRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const optsRef = useRef(opts);
  useEffect(() => {
    optsRef.current = opts;
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop, mobile } = ctx.conditions as { desktop: boolean; mobile: boolean };
        if (!desktop && !mobile) return;
        const el = stage.current;
        if (!el) return;
        const tl = build({ isMobile: mobile });
        if (!tl) return;
        tl.pause(0);
        tlRef.current = tl;
        const o = optsRef.current;
        const pinned = o.pin !== false && (mobile ? o.pinMobile !== false : true);
        const st = ScrollTrigger.create({
          trigger: el,
          start: pinned ? "top top" : (o.start ?? "top 80%"),
          end: mobile ? (o.mobileEnd ?? "+=120%") : (o.end ?? "+=150%"),
          pin: pinned,
          anticipatePin: 1,
          markers: config.debugMarkers,
          onUpdate(self) {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
            optsRef.current.onProgress?.(self.progress);
            if (pausedRef.current) return;
            gsap.to(tl, { progress: self.progress, duration: 0.4, ease: "power2.out", overwrite: true });
          },
        });
        stRef.current = st;
        if (st.progress > 0) tl.progress(st.progress);
        setActive(true);
        return () => {
          tlRef.current = null;
          stRef.current = null;
          setActive(false);
        };
      });
    },
    { scope },
  );

  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    const tl = tlRef.current;
    if (!tl) return;
    gsap.killTweensOf(tl);
    if (next) tl.progress(1);
    else tl.progress(stRef.current?.progress ?? 0);
  }, []);

  return { barRef, paused, togglePause, active };
}
