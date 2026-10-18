"use client";

import { useEffect, useRef } from "react";

/**
 * A living dot graphic behind a card's product, after Stripe's particle globe. Each mode tells
 * the job's story: a globe of people to reach, rising columns of growth, a radar that watches,
 * a wave of signals, ripples from an incoming call. Runs only while `play` is true.
 */

export type DotMode = "globe" | "rise" | "radar" | "wave" | "ripple";

export function DotField({
  mode,
  rgb,
  rgb2,
  play,
}: {
  mode: DotMode;
  rgb: string;
  rgb2: string;
  play: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const playing = useRef(play);
  const start = useRef<() => void>(() => {});
  useEffect(() => {
    playing.current = play;
    if (play) start.current();
  }, [play]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const size = () => {
      // layout size, not the on-screen box: the card morphs with transforms when it opens,
      // and measuring mid-morph would stretch every dot
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    // points on a sphere, evenly spread (Fibonacci lattice)
    const sphere = Array.from({ length: 300 }, (_, i) => {
      const y = 1 - (i / 299) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, hot: i % 23 === 0 };
    });

    let t = reduce ? 2 : 0;
    let last = performance.now();
    let lastPaint = 0;
    const draw = (now: number) => {
      raf = 0;
      // 30 frames a second is plenty for a backdrop
      if (now - lastPaint < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastPaint = now;
      const dt = Math.min(0.08, (now - last) / 1000);
      last = now;
      if (playing.current && !reduce) t += dt;
      ctx.clearRect(0, 0, w, h);
      let colour = "";
      const dot = (x: number, y: number, s: number, a: number, c = "255,255,255") => {
        if (a <= 0.01) return;
        if (c !== colour) {
          colour = c;
          ctx.fillStyle = `rgb(${c})`;
        }
        ctx.globalAlpha = a > 1 ? 1 : a;
        ctx.fillRect(x - s, y - s, s * 2, s * 2);
      };

      if (mode === "globe") {
        const R = Math.min(w * 0.42, h * 0.62);
        const cx = w * 0.8;
        const cy = h * 0.8;
        const rot = t * 0.18;
        const c = Math.cos(rot);
        const s = Math.sin(rot);
        for (const p of sphere) {
          const x = p.x * c - p.z * s;
          const z = p.x * s + p.z * c;
          const depth = (z + 1) / 2;
          const pulse = p.hot ? 0.5 + 0.5 * Math.sin(t * 2.4 + p.y * 9) : 0;
          dot(
            cx + x * R,
            cy + p.y * R * 0.96,
            p.hot ? 1.8 + pulse * 1.8 : 1.25,
            p.hot ? 0.6 + pulse * 0.4 : 0.1 + depth * 0.6,
            p.hot ? rgb2 : undefined,
          );
        }
      } else if (mode === "rise") {
        const cols = Math.floor(w / 14);
        for (let i = 0; i < cols; i++) {
          const x = 7 + i * 14;
          const height = (0.35 + 0.45 * (i / cols) + 0.08 * Math.sin(i * 1.7)) * h;
          for (let y = h - 6; y > h - height; y -= 12) {
            const k = (h - y) / height;
            const wave = 0.5 + 0.5 * Math.sin(t * 2 - k * 6 + i * 0.35);
            dot(x, y, 1.3, (0.12 + 0.6 * wave) * (1 - k * 0.5), wave > 0.92 ? rgb2 : undefined);
          }
        }
      } else if (mode === "radar") {
        const cx = w * 0.82;
        const cy = h * 0.95;
        const sweep = (t * 0.9) % (Math.PI * 2);
        for (let r = 24; r < Math.max(w, h) * 1.1; r += 18) {
          const n = Math.floor((r * Math.PI) / 9);
          for (let k = 0; k < n; k++) {
            const a = Math.PI + (k / n) * Math.PI;
            const d = (((sweep - a) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const lit = Math.max(0, 1 - d / 1.4);
            dot(
              cx + Math.cos(a) * r,
              cy + Math.sin(a) * r,
              1.15 + lit * 1.2,
              0.1 + lit * 0.8,
              lit > 0.6 ? rgb2 : undefined,
            );
          }
        }
      } else if (mode === "wave") {
        for (let x = 6; x < w; x += 13) {
          for (let j = 0; j < 9; j++) {
            const base = h * 0.55 + j * 13;
            const y = base + Math.sin(x * 0.018 + t * 1.2 + j * 0.45) * (18 + j * 2);
            dot(x, y, 1.25, 0.14 + (j / 9) * 0.6, j === 4 ? rgb2 : undefined);
          }
        }
      } else if (mode === "ripple") {
        const cx = w * 0.3;
        const cy = h * 0.55;
        for (let ring = 0; ring < 7; ring++) {
          const r = ((t * 40 + ring * 46) % 320) + 10;
          const fade = 1 - r / 330;
          const n = Math.floor(r / 5);
          for (let k = 0; k < n; k++) {
            const a = (k / n) * Math.PI * 2;
            dot(
              cx + Math.cos(a) * r,
              cy + Math.sin(a) * r,
              1.25,
              0.7 * fade,
              ring % 2 ? rgb2 : undefined,
            );
          }
        }
      }
      ctx.globalAlpha = 1;
      if (playing.current && !reduce) raf = requestAnimationFrame(draw);
    };
    // paint the first frame straight away so the card is never empty
    lastPaint = -100;
    draw(performance.now());
    start.current = () => {
      if (!raf && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    return () => {
      cancelAnimationFrame(raf);
      start.current = () => {};
      ro.disconnect();
    };
  }, [mode, rgb, rgb2]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-60 [mask-image:linear-gradient(to_bottom,transparent_8%,#000_55%)]"
    />
  );
}
