"use client";

import { useEffect, useRef, type RefObject } from "react";

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };

/**
 * Specks of light drift up from the floor and get pulled into the portal.
 * `boost` (a ref, 0..1) speeds them up when the CTA is hovered.
 * Pauses off-screen, and draws nothing for reduced motion.
 */
export function PortalParticles({
  target = [0.5, 0.3],
  boost,
  className = "",
}: {
  target?: [number, number];
  boost?: RefObject<number>;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const count = w < 768 ? 40 : 80;
    const spawn = (p?: P): P => {
      const q = p ?? ({} as P);
      q.x = Math.random() * w;
      q.y = h * (0.75 + Math.random() * 0.3);
      q.vx = 0;
      q.vy = -(0.15 + Math.random() * 0.35);
      q.life = 0;
      q.max = 260 + Math.random() * 260;
      q.r = 0.6 + Math.random() * 1.3;
      return q;
    };
    const ps: P[] = Array.from({ length: count }, () => {
      const p = spawn();
      p.life = Math.random() * p.max; // start mid-flight so the field is full on first view
      p.y = h * (0.2 + Math.random() * 0.8);
      return p;
    });

    let raf = 0;
    let running = false;
    const tick = () => {
      const b = boost?.current ?? 0;
      const tx = target[0] * w;
      const ty = target[1] * h;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        const dx = tx - p.x;
        const dy = ty - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const pull = (0.004 + b * 0.02) * Math.min(1, 220 / d);
        p.vx = (p.vx + (dx / d) * pull) * 0.985;
        p.vy = (p.vy + (dy / d) * pull) * 0.985;
        const speed = 1 + b * 2.2;
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        p.life += speed;
        // fade in, fade out, and vanish as they reach the portal
        const t = p.life / p.max;
        const edge = Math.min(1, t * 6, (1 - t) * 4);
        const near = Math.min(1, d / 90);
        const a = Math.max(0, edge * near) * (0.55 + b * 0.35);
        if (p.life > p.max || d < 18) spawn(p);
        if (a <= 0.01) continue;
        ctx.beginPath();
        ctx.fillStyle = `rgba(176,194,255,${a})`;
        ctx.arc(p.x, p.y, p.r * (1 + b * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [boost, target]);

  return <canvas ref={canvas} aria-hidden className={`pointer-events-none ${className}`} />;
}
