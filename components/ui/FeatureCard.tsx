"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/** Surface card. 3D tilt toward cursor (max 4deg), border brightens on hover. */
export function FeatureCard({
  children,
  className = "",
  dashed = false,
  spot = "rgba(255,255,255,0.05)",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  dashed?: boolean;
  /** Cursor spotlight color. */
  spot?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
          ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry.set(px * 8);
          rx.set(-py * 8);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", ["--spot" as string]: spot }}
        className={`group relative h-full overflow-hidden rounded-lg bg-surface p-6 transition-[border-color] duration-200 md:p-8 ${
          dashed ? "border border-dashed border-line-strong" : "border border-line hover:border-line-strong"
        } ${className}`}
        {...(rest as object)}
      >
        <div aria-hidden className="spotlight pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">{children}</div>
      </motion.div>
    </div>
  );
}
