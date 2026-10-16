"use client";

import { useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type Props = {
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: (e: ReactMouseEvent) => void;
  ariaLabel?: string;
};

const sizes = {
  sm: "h-10 px-4",
  md: "h-12 px-6",
  lg: "h-[52px] px-6",
};

/** Primary: white pill, magnetic (drifts up to 6px toward cursor), lifts 1px with a 30% blue ring. */
export function Button({
  href = "#",
  variant = "primary",
  size = "md",
  magnetic = variant === "primary",
  icon,
  trailing,
  children,
  className = "",
  onClick,
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (!magnetic || reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const clamp = (v: number) => Math.max(-6, Math.min(6, v));
    mx.set(clamp(dx * 0.18));
    my.set(clamp(dy * 0.3) - 1);
  };
  const onLeave = () => {
    setHover(false);
    mx.set(0);
    my.set(0);
  };

  const base =
    "relative inline-flex select-none items-center justify-center gap-2 rounded-full t-button whitespace-nowrap transition-[background-color,box-shadow,border-color,color] duration-200 ease-out";
  const look =
    variant === "primary"
      ? "bg-[#A6BBFF] text-[#07111F] hover:bg-[#BCCBFF] hover:shadow-[0_0_0_4px_rgba(166,187,255,0.22)]"
      : "border border-white/10 bg-white/[0.06] text-text hover:bg-white/[0.1]";

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerEnter={() => setHover(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y: magnetic ? y : hover && !reduce ? -1 : 0 }}
      className={`${base} ${look} ${sizes[size]} ${className}`}
    >
      {icon}
      <span>{children}</span>
      {trailing}
    </motion.a>
  );
}
