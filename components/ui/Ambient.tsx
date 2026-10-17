"use client";

import { useEffect, useRef } from "react";

/**
 * The page's backdrop. A soft light falls from the top, the tint drifts from blue to violet
 * to teal as you read down the page, the edges sink into a vignette, and a fine still grain
 * keeps the dark from looking flat. Felt more than seen.
 */
export function Ambient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--sp", String(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div ref={root} aria-hidden className="ambient">
        <span className="ambient-light" />
        <span className="ambient-field ambient-blue" />
        <span className="ambient-field ambient-violet" />
        <span className="ambient-field ambient-teal" />
        <span className="ambient-vignette" />
      </div>
      <div aria-hidden className="grain" />
    </>
  );
}
