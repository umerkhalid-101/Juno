"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
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
  // Looping CSS animations (halos, shimmers, the CTA orbit) pause while their section is off
  // screen and pick up again just before it scrolls back in, so nothing works out of sight.
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-offscreen", !e.isIntersecting)),
      { rootMargin: "300px 0px" },
    );
    const t = window.setTimeout(() => document.querySelectorAll("main section, footer").forEach((el) => io.observe(el)), 50);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
      document.querySelectorAll("[data-offscreen]").forEach((el) => el.removeAttribute("data-offscreen"));
    };
  }, [path]);
  return null;
}
