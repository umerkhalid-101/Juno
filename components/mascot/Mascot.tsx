"use client";

// Official Juno mascot (source: public/mascot/juno.svg), inlined so the eyes can animate.
// Shape, colors, and face are locked.
// Eyes are separate elements so they can blink, glance, and track.

import { useCallback, useEffect, useId, useImperativeHandle, useRef, type Ref } from "react";
import { animate, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export type MascotState =
  | "sleeping"
  | "waking"
  | "idle"
  | "glancing"
  | "thinking"
  | "checking"
  | "calm"
  | "happy";

export type MascotApi = {
  /** Look toward a normalized direction, x and y in -1..1. */
  look: (x: number, y: number) => void;
  /** Look at a DOM element on screen. */
  lookAt: (el: Element | null) => void;
  blink: () => void;
  nod: () => void;
  glance: () => void;
  setState: (s: MascotState) => void;
  track: (on: boolean) => void;
  /** Squash, stretch, and a little jump. */
  hop: () => void;
  /** Happy squint + hop, then back to the previous state. */
  cheer: () => void;
};

type Props = {
  size?: number;
  state?: MascotState;
  trackCursor?: boolean;
  /** Max eye travel in CSS px for look() and lookAt(). Cursor tracking caps at 4px. */
  travel?: number;
  /** Max eye travel in CSS px while following the cursor. */
  trackTravel?: number;
  halo?: boolean;
  autoBlink?: boolean;
  className?: string;
  label?: string;
  apiRef?: Ref<MascotApi>;
  /** Gentle continuous float. */
  float?: boolean;
  /** Looks around on its own when nothing else is happening. */
  wander?: boolean;
  /** Reacts to hover (happy squint) and click (hop). */
  interactive?: boolean;
  /** Listen for page-wide juno:* events (nod, look, cheer). */
  listen?: boolean;
};

const LID: Record<MascotState, number> = {
  sleeping: 0.1,
  waking: 1,
  idle: 1,
  glancing: 1,
  thinking: 0.62,
  checking: 1,
  calm: 0.8,
  happy: 0.5,
};

const VB = 512;

export function Mascot({
  size = 160,
  state: initialState = "idle",
  trackCursor = false,
  travel,
  trackTravel,
  halo = true,
  autoBlink = true,
  className = "",
  label,
  apiRef,
  float = false,
  wander = false,
  interactive = false,
  listen = false,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<MascotState>(initialState);
  const trackingRef = useRef(trackCursor);

  const pxToVb = VB / size;
  const lookTravel = (travel ?? Math.max(4, size * 0.05)) * pxToVb;
  const cursorTravel = (trackTravel ?? Math.min(9, Math.max(4, size * 0.055))) * pxToVb;

  const eyeXRaw = useMotionValue(0);
  const eyeYRaw = useMotionValue(0);
  const eyeX = useSpring(eyeXRaw, { stiffness: 180, damping: 22, mass: 0.6 });
  const eyeY = useSpring(eyeYRaw, { stiffness: 180, damping: 22, mass: 0.6 });
  const lid = useMotionValue(LID[initialState]);
  const bodyY = useMotionValue(0);
  const sx = useMotionValue(1);
  const sy = useMotionValue(1);
  const smileGlow = useMotionValue(0);
  const lastPointer = useRef(0);
  const shimmerX = useMotionValue(-200);
  const shimmerOpacity = useMotionValue(0);
  const shimmerAnim = useRef<ReturnType<typeof animate> | null>(null);

  const look = useCallback(
    (x: number, y: number) => {
      eyeXRaw.set(Math.max(-1, Math.min(1, x)) * lookTravel);
      eyeYRaw.set(Math.max(-1, Math.min(1, y)) * lookTravel * 0.8);
    },
    [eyeXRaw, eyeYRaw, lookTravel],
  );

  const lookAt = useCallback(
    (el: Element | null) => {
      const root = rootRef.current;
      if (!el || !root) return;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      look(dx / d, dy / d);
    },
    [look],
  );

  const blink = useCallback(() => {
    if (stateRef.current === "sleeping") return;
    const open = LID[stateRef.current];
    animate(lid, [open, 0.08, open], { duration: 0.18, times: [0, 0.4, 1], ease: "easeInOut" });
  }, [lid]);

  const nod = useCallback(() => {
    if (reduce) return;
    animate(bodyY, [0, size * 0.05, 0], { duration: 0.42, ease: [0.3, 0, 0, 1] });
  }, [bodyY, reduce, size]);

  const setState = useCallback(
    (s: MascotState) => {
      const prev = stateRef.current;
      stateRef.current = s;
      const target = LID[s];
      if (s === "waking" && prev === "sleeping") {
        animate(lid, [0.1, 1.08, 1], { duration: 0.5, times: [0, 0.7, 1], ease: "easeOut" });
      } else {
        animate(lid, target, { duration: s === "calm" ? 0.8 : 0.25, ease: [0.16, 1, 0.3, 1] });
      }
      if (s === "checking") look(0.15, 0.55);
      if (s === "thinking" && !reduce) {
        shimmerAnim.current?.stop();
        shimmerOpacity.set(1);
        shimmerAnim.current = animate(shimmerX, [-200, 560], {
          duration: 1.5,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 0.2,
        });
      } else {
        shimmerAnim.current?.stop();
        animate(shimmerOpacity, 0, { duration: 0.3 });
      }
    },
    [lid, look, reduce, shimmerOpacity, shimmerX],
  );

  const glance = useCallback(() => {
    look(-1, -0.1);
    window.setTimeout(() => look(1, -0.1), 420);
    window.setTimeout(() => look(0, 0), 1000);
  }, [look]);

  const track = useCallback((on: boolean) => {
    trackingRef.current = on;
  }, []);

  const hop = useCallback(() => {
    if (reduce) return;
    const t = { duration: 0.55, times: [0, 0.18, 0.5, 0.82, 1], ease: "easeOut" as const };
    animate(sy, [1, 0.86, 1.1, 0.95, 1], t);
    animate(sx, [1, 1.12, 0.94, 1.04, 1], t);
    animate(bodyY, [0, size * 0.04, -size * 0.2, 0, 0], t);
  }, [bodyY, reduce, size, sx, sy]);

  const cheerTimer = useRef<number | undefined>(undefined);
  const restState = useRef<MascotState>(initialState);
  const cheer = useCallback(() => {
    if (stateRef.current !== "happy") restState.current = stateRef.current;
    window.clearTimeout(cheerTimer.current);
    stateRef.current = "happy";
    animate(lid, LID.happy, { duration: 0.18, ease: [0.3, 0, 0, 1] });
    animate(smileGlow, [0, 1, 0.6], { duration: 0.6 });
    hop();
    cheerTimer.current = window.setTimeout(() => {
      stateRef.current = restState.current;
      animate(lid, LID[restState.current], { duration: 0.4, ease: [0.16, 1, 0.3, 1] });
      animate(smileGlow, 0, { duration: 0.8 });
    }, 1400);
  }, [hop, lid, smileGlow]);

  useImperativeHandle(apiRef, () => ({ look, lookAt, blink, nod, glance, setState, track, hop, cheer }), [
    hop,
    cheer,
    look,
    lookAt,
    blink,
    nod,
    glance,
    setState,
    track,
  ]);

  // Apply initial / controlled state.
  useEffect(() => {
    setState(initialState);
  }, [initialState, setState]);

  // Natural blink, every 3 to 6 seconds.
  useEffect(() => {
    if (!autoBlink || reduce) return;
    let t: number;
    const loop = () => {
      t = window.setTimeout(
        () => {
          blink();
          loop();
        },
        3000 + Math.random() * 3000,
      );
    };
    loop();
    return () => window.clearTimeout(t);
  }, [autoBlink, blink, reduce]);

  // Wander: glance somewhere new every few seconds when the cursor is idle.
  useEffect(() => {
    if (!wander || reduce) return;
    let t: number;
    const loop = () => {
      t = window.setTimeout(
        () => {
          const idle = performance.now() - lastPointer.current > 2500 || !trackingRef.current;
          const s = stateRef.current;
          if (idle && (s === "idle" || s === "calm" || s === "checking")) {
            const a = Math.random() * Math.PI * 2;
            look(Math.cos(a) * 0.9, Math.sin(a) * 0.6);
            if (Math.random() < 0.35) window.setTimeout(blink, 350);
            window.setTimeout(() => look(0, 0), 1100 + Math.random() * 600);
          }
          loop();
        },
        3500 + Math.random() * 3500,
      );
    };
    loop();
    return () => window.clearTimeout(t);
  }, [blink, look, reduce, wander]);

  // Page-wide reactions for the companion.
  useEffect(() => {
    if (!listen) return;
    const onNod = () => nod();
    const onCheer = () => cheer();
    const onLook = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number }>).detail;
      look(d.x, d.y);
    };
    window.addEventListener("juno:nod", onNod);
    window.addEventListener("juno:cheer", onCheer);
    window.addEventListener("juno:look", onLook);
    return () => {
      window.removeEventListener("juno:nod", onNod);
      window.removeEventListener("juno:cheer", onCheer);
      window.removeEventListener("juno:look", onLook);
    };
  }, [cheer, listen, look, nod]);

  // Cursor tracking (hero), eased.
  useEffect(() => {
    trackingRef.current = trackCursor;
  }, [trackCursor]);
  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const onMove = (e: PointerEvent) => {
      lastPointer.current = performance.now();
      if (!trackingRef.current || !rootRef.current) return;
      const r = rootRef.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const f = Math.min(1, d / 360);
      eyeXRaw.set((dx / d) * f * cursorTravel);
      eyeYRaw.set((dy / d) * f * cursorTravel);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [cursorTravel, eyeXRaw, eyeYRaw, reduce]);

  const g = (n: string) => `${uid}-${n}`;

  return (
    <motion.div
      ref={rootRef}
      className={`relative inline-block shrink-0 ${float ? "mascot-float" : ""} ${interactive ? "cursor-pointer" : ""} ${className}`}
      style={{ width: size, height: size, y: bodyY, scaleX: sx, scaleY: sy, transformOrigin: "50% 90%" }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onPointerEnter={interactive ? () => cheer() : undefined}
      onClick={interactive ? () => cheer() : undefined}
    >
      {halo && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: size * 1.9,
            height: size * 1.9,
            background:
              "radial-gradient(closest-side, rgba(0,156,255,0.32), rgba(50,76,255,0.14) 55%, transparent)",
          }}
        />
      )}
      <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} className="relative block overflow-visible">
        <defs>
          <radialGradient id={g("face")} cx="38%" cy="28%" r="78%">
            <stop stopColor="#101d33" />
            <stop offset=".58" stopColor="#07111f" />
            <stop offset="1" stopColor="#030812" />
          </radialGradient>
          <linearGradient id={g("rim")} x1="92" y1="72" x2="420" y2="438" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58d8ff" />
            <stop offset=".35" stopColor="#2588ff" />
            <stop offset=".72" stopColor="#5960ff" />
            <stop offset="1" stopColor="#b99aff" />
          </linearGradient>
          <linearGradient id={g("smile")} x1="88" y1="278" x2="410" y2="442" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6fb5ff" />
            <stop offset=".42" stopColor="#324cff" />
            <stop offset=".78" stopColor="#533cff" />
            <stop offset="1" stopColor="#8675ff" />
          </linearGradient>
          <linearGradient id={g("eye")} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#50e5ff" />
            <stop offset="1" stopColor="#009cff" />
          </linearGradient>
          <linearGradient id={g("shimmer")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7fdcff" stopOpacity="0" />
            <stop offset="50%" stopColor="#7fdcff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7fdcff" stopOpacity="0" />
          </linearGradient>
          <filter id={g("eyeglow")} x="-180%" y="-100%" width="460%" height="300%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feFlood floodColor="#007cff" floodOpacity=".65" />
            <feComposite in2="b" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={g("aura")} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <clipPath id={g("clip")}>
            <circle cx="256" cy="256" r="211" />
          </clipPath>
        </defs>

        {/* face */}
        <circle cx="256" cy="256" r="211" fill={`url(#${g("face")})`} />
        <circle cx="256" cy="256" r="211" fill="none" stroke={`url(#${g("rim")})`} strokeWidth="4" />

        {/* thinking shimmer */}
        <g clipPath={`url(#${g("clip")})`}>
          <motion.rect
            y="-40"
            width="160"
            height="600"
            fill={`url(#${g("shimmer")})`}
            style={{ x: shimmerX, opacity: shimmerOpacity, rotate: 18 }}
          />
        </g>

        {/* eyes: separate elements so they can blink, glance, and track */}
        <motion.g style={{ x: eyeX, y: eyeY }}>
          <motion.g style={{ scaleY: lid, transformBox: "fill-box", originX: 0.5, originY: 0.5 }}>
            <g opacity=".42" filter={`url(#${g("aura")})`} fill="#087fff">
              <rect x="181" y="169" width="36" height="102" rx="18" />
              <rect x="295" y="169" width="36" height="102" rx="18" />
            </g>
            <g fill={`url(#${g("eye")})`} filter={`url(#${g("eyeglow")})`}>
              <rect className="juno-eye-l" x="181" y="169" width="36" height="102" rx="18" />
              <rect className="juno-eye-r" x="295" y="169" width="36" height="102" rx="18" />
            </g>
          </motion.g>
        </motion.g>

        {/* smile glow (happy) */}
        <motion.g clipPath={`url(#${g("clip")})`} style={{ opacity: smileGlow }} filter={`url(#${g("aura")})`}>
          <path d="M42 258C88 284 113 365 191 399C270 433 361 399 410 344C439 311 456 279 470 258V478H42Z" fill="#6fb5ff" />
        </motion.g>

        {/* smile */}
        <g clipPath={`url(#${g("clip")})`}>
          <path
            d="M42 258C88 284 113 365 191 399C270 433 361 399 410 344C439 311 456 279 470 258V478H42Z"
            fill={`url(#${g("smile")})`}
          />
          <path
            d="M42 258C88 284 113 365 191 399C270 433 361 399 410 344C439 311 456 279 470 258"
            fill="none"
            stroke="#9cc7ff"
            strokeOpacity=".72"
            strokeWidth="3.5"
          />
        </g>
      </svg>
    </motion.div>
  );
}

/** Tiny static mark for nav, footer, and chat avatars (official mascot). */
export function MascotMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} className={className} aria-hidden>
      <defs>
        <radialGradient id={`${uid}-f`} cx="38%" cy="28%" r="78%">
          <stop stopColor="#101d33" />
          <stop offset=".58" stopColor="#07111f" />
          <stop offset="1" stopColor="#030812" />
        </radialGradient>
        <linearGradient id={`${uid}-r`} x1="92" y1="72" x2="420" y2="438" gradientUnits="userSpaceOnUse">
          <stop stopColor="#58d8ff" />
          <stop offset=".35" stopColor="#2588ff" />
          <stop offset=".72" stopColor="#5960ff" />
          <stop offset="1" stopColor="#b99aff" />
        </linearGradient>
        <linearGradient id={`${uid}-s`} x1="88" y1="278" x2="410" y2="442" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6fb5ff" />
          <stop offset=".42" stopColor="#324cff" />
          <stop offset=".78" stopColor="#533cff" />
          <stop offset="1" stopColor="#8675ff" />
        </linearGradient>
        <linearGradient id={`${uid}-e`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#50e5ff" />
          <stop offset="1" stopColor="#009cff" />
        </linearGradient>
        <clipPath id={`${uid}-c`}>
          <circle cx="256" cy="256" r="211" />
        </clipPath>
      </defs>
      <circle cx="256" cy="256" r="211" fill={`url(#${uid}-f)`} />
      <circle cx="256" cy="256" r="211" fill="none" stroke={`url(#${uid}-r)`} strokeWidth="14" />
      <g fill={`url(#${uid}-e)`}>
        <rect x="181" y="169" width="36" height="102" rx="18" />
        <rect x="295" y="169" width="36" height="102" rx="18" />
      </g>
      <g clipPath={`url(#${uid}-c)`}>
        <path d="M42 258C88 284 113 365 191 399C270 433 361 399 410 344C439 311 456 279 470 258V478H42Z" fill={`url(#${uid}-s)`} />
      </g>
    </svg>
  );
}
