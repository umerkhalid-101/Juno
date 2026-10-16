/**
 * Motion tokens. Juno acting = snap. You deciding = calm.
 * Durations in seconds (GSAP + motion both take seconds).
 */
export const motion = {
  snap: { duration: 0.12, ease: [0.3, 0, 0, 1] as const, css: "cubic-bezier(0.3,0,0,1)" },
  fast: { duration: 0.2, ease: "easeOut" as const, css: "ease-out" },
  base: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const, css: "cubic-bezier(0.2,0.8,0.2,1)" },
  calm: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, css: "cubic-bezier(0.16,1,0.3,1)" },
} as const;

/** GSAP equivalents (CustomEase-free approximations). */
export const gsapEase = {
  snap: "power4.out",
  base: "power3.out",
  calm: "expo.out",
  story: "none",
} as const;

export const stagger = {
  reveal: 0.06,
  words: 0.06,
  tiles: 0.08,
} as const;
