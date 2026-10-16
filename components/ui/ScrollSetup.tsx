"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { config } from "@/lib/config";

/** Refresh pins after fonts settle; optional Lenis behind a flag (off by default). */
export function ScrollSetup() {
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    let destroy: (() => void) | undefined;
    if (config.lenis && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      import("lenis").then(({ default: Lenis }) => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        let raf = 0;
        const loop = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        destroy = () => {
          cancelAnimationFrame(raf);
          lenis.destroy();
        };
      });
    }
    return () => {
      window.clearTimeout(t);
      destroy?.();
    };
  }, []);
  return null;
}
