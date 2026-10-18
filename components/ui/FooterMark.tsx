"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP } from "@/lib/gsap";

const word =
  "text-center text-[31vw] font-semibold leading-[0.78] tracking-[-0.075em] md:text-[25vw] xl:text-[340px]";

/**
 * The page's last moment: Juno rises from behind a giant wordmark and peeks over it.
 * The letters are dark until light touches them: the cursor carries a soft
 * Juno-colored light (touch screens get one slow sweep instead).
 */
export function FooterMark() {
  const root = useRef<HTMLDivElement>(null);
  const mascot = useRef<MascotApi>(null);

  // Rises when the footer is actually on screen (an observer, not a scroll position measured
  // at load, so pages that grow as their demos fill in can't leave Juno half behind the letters)
  const seen = useInView(root, { amount: 0.35 });
  const woke = useRef(false);
  const reduce = useReducedMotion();
  useGSAP(
    () => {
      gsap.set(".fm-mascot", { yPercent: reduce ? 0 : 85 });
    },
    { scope: root, dependencies: [reduce] },
  );
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const m = el.querySelector(".fm-mascot");
    if (reduce) {
      mascot.current?.setState("idle");
      return;
    }
    if (!seen) {
      gsap.to(m, { yPercent: 85, duration: 0.6, ease: "power2.in", overwrite: "auto" });
      return;
    }
    gsap.to(m, { yPercent: 0, duration: 1.1, ease: "power3.out", overwrite: "auto" });
    if (woke.current) return;
    woke.current = true;
    mascot.current?.setState("waking");
    const t = window.setTimeout(() => mascot.current?.cheer(), 700);
    // one slow sweep of light across the letters
    gsap.fromTo(el, { "--mx": "-10%" }, { "--mx": "110%", duration: 2.4, ease: "power2.inOut" });
    return () => window.clearTimeout(t);
  }, [seen, reduce]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !root.current) return;
    const r = root.current.getBoundingClientRect();
    gsap.to(root.current, {
      "--mx": `${((e.clientX - r.left) / r.width) * 100}%`,
      "--my": `${((e.clientY - r.top) / r.height) * 100}%`,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={root}
      onPointerMove={onMove}
      className="relative mx-auto max-w-[1400px] select-none overflow-x-clip px-4 pt-[92px] md:pt-[112px]"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "55%" }}
    >
      {/* Juno, peeking over the letters */}
      <div className="fm-mascot absolute left-1/2 top-0 z-0 -translate-x-1/2 pt-[2vw] md:pt-6">
        <Mascot
          size={128}
          state="sleeping"
          apiRef={mascot}
          trackCursor
          travel={10}
          interactive
          halo
        />
      </div>

      {/* dark letters (occlude Juno's lower half) */}
      <p
        aria-hidden
        className={`relative z-10 ${word}`}
        style={{ color: "#0F131A", textShadow: "0 -1px 0 rgba(255,255,255,0.06)" }}
      >
        Juno
      </p>

      {/* the light: same letters in Juno's colors, revealed around the cursor */}
      <p
        aria-hidden
        className={`pointer-events-none absolute inset-x-4 bottom-0 z-20 ${word}`}
        style={{
          color: "transparent",
          backgroundImage:
            "linear-gradient(100deg,#50E5FF 0%,#009CFF 30%,#324CFF 60%,#8F7CFF 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitMaskImage:
            "radial-gradient(circle 260px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
          maskImage:
            "radial-gradient(circle 260px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
        }}
      >
        Juno
      </p>
    </div>
  );
}
