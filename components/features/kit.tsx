"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  AppWindow,
  BookOpen,
  CalendarClock,
  Clapperboard,
  Command,
  FileSpreadsheet,
  Globe,
  KeyRound,
  ListChecks,
  Mic,
  Monitor,
  Newspaper,
  Palette,
  Plug,
  RotateCcw,
  Users,
  type LucideIcon,
} from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Feature, FeatureId } from "@/lib/features";

export const icons: Record<FeatureId, LucideIcon> = {
  "meeting-recorder": Mic,
  "company-wiki": BookOpen,
  "brand-context": Palette,
  skills: ListChecks,
  learnings: RotateCcw,
  "connected-apps": Plug,
  "files-and-spreadsheets": FileSpreadsheet,
  automations: CalendarClock,
  "computer-and-browser": Monitor,
  "app-builder": AppWindow,
  "website-builder": Globe,
  "built-in-cms": Newspaper,
  "image-and-video": Clapperboard,
  vault: KeyRound,
  "quick-ask": Command,
  "shared-conversations": Users,
};

/** A feature's icon on a soft tile in its chapter's tint. */
export function FeatureIcon({ f, size = 28 }: { f: Feature; size?: number }) {
  const Icon = icons[f.id];
  return <Glyph icon={Icon} size={size} />;
}

/**
 * A quiet tile for an icon: a dark key with a light top edge and a plain grey glyph, like the
 * app icons in a real product, not a coloured badge.
 */
export function Glyph({
  icon: Icon,
  size = 28,
  lit = false,
}: {
  icon: LucideIcon;
  size?: number;
  lit?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center border border-white/[0.08] bg-[linear-gradient(180deg,#1B2029,#12161D)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.4)] transition-colors duration-300 ${
        lit ? "text-text" : "text-[#AEB8C6]"
      }`}
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <Icon size={Math.round(size * 0.5)} strokeWidth={1.6} aria-hidden />
    </span>
  );
}

/**
 * How a feature introduces itself: its icon and name, the line that matters, then one
 * concrete sentence. The name stays the heading (H2 for tiers 1 and 2,
 * H3 for tier 3) so the page outline reads feature by feature.
 */
export function Anatomy({
  f,
  className = "",
  size,
  bare = false,
  children,
}: {
  f: Feature;
  className?: string;
  size?: "lg" | "md" | "sm";
  /** the name is shown elsewhere (the card's own header), so start at the line */
  bare?: boolean;
  children?: ReactNode;
}) {
  const s = size ?? (f.tier === 3 ? "sm" : f.tier === 1 ? "lg" : "md");
  const H = f.tier === 3 ? "h3" : "h2";
  return (
    <div className={className}>
      {!bare && (
        <div className="mb-6 flex items-center gap-3">
          <FeatureIcon f={f} size={40} />
          <H className="text-[20px] font-medium tracking-[-0.015em] text-[#A6BBFF] md:text-[22px]">{f.name}</H>
        </div>
      )}
      <p
        className={`text-balance font-medium text-text ${
          s === "lg"
            ? "text-[30px] leading-[36px] tracking-[-0.03em] md:text-[38px] md:leading-[44px]"
            : s === "md"
              ? "text-[28px] leading-[34px] tracking-[-0.025em] md:text-[32px] md:leading-[38px]"
              : "text-[24px] leading-[30px] tracking-[-0.02em] md:text-[26px] md:leading-[32px]"
        }`}
      >
        {f.line}
      </p>
      <p className="mt-4 max-w-[44ch] text-[16px] leading-[25px] text-muted">{f.proof}</p>
      {children}
    </div>
  );
}

/**
 * A soft coloured stage for a product screen: the chapter's tint as light from one corner,
 * the screen set in from the top and left and running off the bottom edge.
 */
export function Stage({
  color,
  children,
  className = "",
  from = "85% 0%",
  inset = "pl-6 pr-6 pt-6 md:pl-9 md:pr-9 md:pt-9",
}: {
  color: string;
  children: ReactNode;
  className?: string;
  /** Where the light comes from. */
  from?: string;
  inset?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/[0.06] ${className}`}
      style={{
        background: `radial-gradient(110% 90% at ${from}, color-mix(in srgb, ${color} 26%, transparent), transparent 62%), radial-gradient(80% 70% at 0% 100%, color-mix(in srgb, ${color} 11%, transparent), transparent 70%), #0B0F15`,
      }}
    >
      {/* a fine grain of dots, quieter toward the bottom */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]"
        style={{
          backgroundImage: `radial-gradient(color-mix(in srgb, ${color} 45%, transparent) 1px, transparent 1.2px)`,
          backgroundSize: "18px 18px",
        }}
      />
      <div className={`relative h-full translate-y-5 ${inset}`}>{children}</div>
    </div>
  );
}

/** Section header: the homepage's own chapter header, so every page reads the same. */
export function SectionHead({
  title,
  muted,
  sub,
  id,
  className = "",
}: {
  title: string;
  muted: string;
  sub: string;
  id?: string;
  className?: string;
}) {
  return <ChapterIntro id={id} lead={title} muted={muted} sub={sub} className={className} />;
}

export function Keycap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={`inline-grid h-6 min-w-6 place-items-center rounded-[6px] border border-white/10 bg-white/[0.04] px-1.5 font-mono text-[11.5px] text-muted shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)] ${className}`}
    >
      {children}
    </kbd>
  );
}

/** Juno's command bar: the mark, what you asked, the shortcut. */
export function CommandBar({
  text,
  caret = false,
  placeholder = false,
  keys = true,
  mark,
  right,
  className = "",
}: {
  mark?: ReactNode;
  right?: ReactNode;
  text: string;
  caret?: boolean;
  placeholder?: boolean;
  keys?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex h-14 items-center gap-3 px-4 ${className}`}>
      <span className="relative grid size-6 shrink-0 place-items-center">
        {mark ?? <MascotMark size={22} />}
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-[15px] ${placeholder ? "text-muted" : "text-text"}`}
      >
        {text}
        {caret && (
          <span className="caret ml-px inline-block h-[17px] w-px translate-y-[3px] bg-text/80" />
        )}
      </span>
      {right ? (
        <span className="hidden shrink-0 sm:flex">{right}</span>
      ) : (
        keys && (
          <span className="hidden shrink-0 items-center gap-1 sm:flex" aria-hidden>
            <Keycap>⌃</Keycap>
            <Keycap>⌘</Keycap>
            <Keycap>J</Keycap>
          </span>
        )
      )}
    </div>
  );
}

/** True once the element has been in view; immediately true with reduced motion. */
export function usePlayOnce<T extends Element>(amount = 0.4) {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  return [ref, Boolean(seen || reduce), Boolean(reduce)] as const;
}

/** Types `text` out once `on` is true, at `cps` characters a second. */
export function useTyped(text: string, on: boolean, cps = 40, delay = 0, run = 0) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (reduce) {
      const t = window.setTimeout(() => setN(text.length), 0);
      return () => window.clearTimeout(t);
    }
    let i = 0;
    let iv = 0;
    const start = window.setTimeout(() => {
      setN(0);
      iv = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) window.clearInterval(iv);
      }, 1000 / cps);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(iv);
    };
  }, [on, text, cps, delay, reduce, run]);
  return { shown: text.slice(0, on ? n : 0), done: on && n >= text.length };
}

/**
 * Text that lights word by word as it scrolls through, opacity only. With `emphasis`, those
 * phrases light to full white and the rest settles at the muted tone, so the sentence ends
 * two-tone like the headlines. Screen readers and reduced motion get the plain sentence.
 */
export function ScrollLit({
  text,
  emphasis = [],
  className = "",
  as: Tag = "p",
  start = "top 80%",
  end = "bottom 45%",
}: {
  text: string;
  emphasis?: string[];
  className?: string;
  as?: "p" | "h2";
  start?: string;
  end?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  // split into words, tagging the ones that belong to an emphasised phrase
  const words: { w: string; em?: boolean }[] = [];
  let rest = text;
  while (rest.length) {
    let hit = -1;
    let at = rest.length;
    emphasis.forEach((m, i) => {
      const k = rest.indexOf(m);
      if (k !== -1 && k < at) {
        at = k;
        hit = i;
      }
    });
    rest
      .slice(0, at)
      .split(" ")
      .filter(Boolean)
      .forEach((w) => words.push({ w }));
    if (hit === -1) break;
    emphasis[hit].split(" ").forEach((w) => words.push({ w, em: true }));
    rest = rest.slice(at + emphasis[hit].length);
    // punctuation glued to the phrase stays with its last word
    const p = rest.match(/^[^\s]+/);
    if (p) {
      words[words.length - 1].w += p[0];
      rest = rest.slice(p[0].length);
    }
  }
  const twoTone = emphasis.length > 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const ws = gsap.utils.toArray<HTMLElement>(".sl-w", root.current);
        gsap.set(ws, { opacity: 0.16 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start, end, scrub: 0.4 },
        });
        ws.forEach((w, i) => tl.to(w, { opacity: 1, duration: 1, ease: "none" }, i * 0.5));
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <Tag className="sr-only">{text}</Tag>
      <Tag aria-hidden className="text-balance">
        {words.map((x, i) => (
          <span key={i}>
            <span className={`sl-w ${twoTone && !x.em ? "text-muted" : "text-text"}`}>
              {x.w}
            </span>{" "}
          </span>
        ))}
      </Tag>
    </div>
  );
}

// hand-set, so the drift reads as designed: start offset, size, colour, duration, delay
const sparks = [
  { x: -92, s: 2, c: "#A6BBFF", d: 3.2, delay: 0 },
  { x: -54, s: 3, c: "#C3B6FF", d: 3.8, delay: 1.1 },
  { x: -18, s: 2, c: "#A6BBFF", d: 2.9, delay: 2.2 },
  { x: 22, s: 2.5, c: "#F2C6B0", d: 3.5, delay: 0.6 },
  { x: 60, s: 2, c: "#C3B6FF", d: 3.1, delay: 1.7 },
  { x: 96, s: 3, c: "#A6BBFF", d: 4, delay: 2.8 },
  { x: -70, s: 2, c: "#F2C6B0", d: 3.6, delay: 3.3 },
  { x: 40, s: 2, c: "#A6BBFF", d: 3.3, delay: 3.9 },
];

/** A few particles rising and gathering toward the top centre of their box. */
export function Sparks() {
  return (
    <>
      {sparks.map((p, i) => (
        <span
          key={i}
          className="fx-spark absolute bottom-0 left-1/2 rounded-full"
          style={
            {
              width: p.s,
              height: p.s,
              background: p.c,
              color: p.c,
              "--x0": `${p.x}px`,
              "--x1": `${p.x * 0.15}px`,
              animationDuration: `${p.d}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
