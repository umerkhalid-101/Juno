"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";

const calm = [0.16, 1, 0.3, 1] as const;

/** Everywhere a lost visitor might have meant to go, and the words that point there. */
const PLACES = [
  { label: "Product", href: "/product", line: "Inside Juno", k: "product overview inside knowledge brand memory" },
  { label: "Features", href: "/features", line: "So much built in", k: "features feature computer browser tools built" },
  { label: "Automations", href: "/jobs", line: "Recurring work, handled", k: "automations automation jobs job recurring schedule workflow tasks" },
  { label: "Apps", href: "/apps", line: "From an idea to a working app", k: "apps app website site builder cms blog" },
  { label: "Download for Mac", href: "/download", line: "One shortcut, right there", k: "download mac macos macbook app desktop install quick ask shortcut" },
  { label: "Contact", href: "/contact", line: "Talk to the team", k: "contact sales support help team talk email demo" },
  { label: "Pricing", href: "/contact", line: "Ask the team about plans", k: "pricing price cost plans billing" },
  { label: "Sign in", href: "https://www.runjuno.ai/login", line: "Back to your workspace", k: "login log signin sign account" },
  { label: "Privacy", href: "/privacy", line: "How we handle your data", k: "privacy data gdpr policy security" },
  { label: "Terms", href: "/terms", line: "The fine print", k: "terms legal conditions tos" },
  { label: "Home", href: "/", line: "Knows your company. Gets things done.", k: "home start index juno" },
];

/** Best matches for whatever was typed (or for the broken URL itself). */
function suggest(q: string) {
  const words = q.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 1);
  if (!words.length) return PLACES.slice(0, 4);
  const scored = PLACES.map((p) => {
    const hay = `${p.label} ${p.k}`.toLowerCase();
    const score = words.reduce((n, w) => n + (hay.includes(w) ? 3 : hay.split(" ").some((h) => h.startsWith(w.slice(0, 3))) ? 1 : 0), 0);
    return { p, score };
  });
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.p);
  return hits.length ? hits.slice(0, 4) : PLACES.slice(0, 4);
}

const noop = () => () => {};
const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** A four you can grab and throw. It always comes home. */
function Four({ onGrab, onLetGo }: { onGrab: (el: Element) => void; onLetGo: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  return (
    <motion.span
      ref={ref}
      drag={!reduce}
      dragSnapToOrigin
      dragElastic={0.7}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
      whileHover={reduce ? undefined : { rotate: -4, scale: 1.03 }}
      whileDrag={{ scale: 1.08, rotate: 8 }}
      onDragStart={() => ref.current && onGrab(ref.current)}
      onDrag={() => ref.current && onGrab(ref.current)}
      onDragEnd={onLetGo}
      className="relative inline-block cursor-grab touch-none select-none bg-[linear-gradient(160deg,#C9D4FF_0%,#A6BBFF_40%,#7A8FFF_100%)] bg-clip-text text-transparent active:cursor-grabbing"
    >
      4
    </motion.span>
  );
}

export function NotFoundView() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const juno = useRef<MascotApi>(null);
  const [q, setQ] = useState("");
  const [throws, setThrows] = useState(0);
  const [pick, setPick] = useState(0);
  // Juno is the zero, so it sizes with the numerals: 0.74em of clamp(132px, 30vw, 320px)
  const [face, setFace] = useState(220);
  useEffect(() => {
    const fit = () => setFace(Math.round(0.74 * Math.min(320, Math.max(132, window.innerWidth * 0.3))));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // until they type, guess from the address they tried. The page is prerendered without it, so
  // it is read in the browser after hydration (an empty string on the server keeps them in sync).
  const path = useSyncExternalStore(noop, () => window.location.pathname, () => "/");
  const tried = safeDecode(path).replace(/^\//, "");
  const list = useMemo(() => suggest(q || tried), [q, tried]);
  const guessed = !q && suggest(tried)[0] !== PLACES[0] && tried.length > 1;

  useEffect(() => {
    juno.current?.setState(q ? "thinking" : "idle");
  }, [q]);

  const go = (href: string) => {
    juno.current?.cheer();
    if (href.startsWith("http")) window.location.href = href;
    else router.push(href);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setPick((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length);
    } else if (e.key === "Enter" && list[pick]) {
      e.preventDefault();
      go(list[pick].href);
    }
  };

  const lines = ["Juno looked everywhere.", "Juno watched that one go.", "It always comes back.", "Okay, you’re having fun.", "Still not the page, though."];

  return (
    <main id="main" className="relative flex min-h-[100svh] flex-col items-center overflow-x-clip px-4 pb-24 pt-[128px] text-center md:pt-[150px]">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[120px] h-[700px] w-[min(1200px,160vw)] -translate-x-1/2"
        style={{ background: "radial-gradient(40% 40% at 50% 45%, rgba(50,76,255,0.26), rgba(143,124,255,0.08) 60%, transparent 78%)" }}
      />

      {/* 4, Juno, 4 */}
      <h1 className="relative flex items-center justify-center gap-[0.04em] text-[clamp(132px,30vw,320px)] font-semibold leading-[0.9] tracking-[-0.06em]">
        <span className="sr-only">404, page not found</span>
        <Four onGrab={(el) => juno.current?.lookAt(el)} onLetGo={() => setThrows((n) => n + 1)} />
        <motion.span
          aria-hidden
          className="mx-[0.02em] inline-grid place-items-center"
          initial={reduce ? false : { scale: 0.4, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
        >
          <Mascot size={face} apiRef={juno} trackCursor trackTravel={10} float interactive wander label="Juno" />
        </motion.span>
        <Four onGrab={(el) => juno.current?.lookAt(el)} onLetGo={() => setThrows((n) => n + 1)} />
      </h1>

      <motion.p
        key={throws}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: calm }}
        className="t-display-l relative mt-6 text-balance md:mt-8"
      >
        {lines[Math.min(throws, lines.length - 1)]} <span className="accent-text block">This page isn’t here.</span>
      </motion.p>
      <p className="relative mt-4 max-w-[44ch] text-pretty text-[16px] leading-[26px] text-muted md:text-[17px] md:leading-[27px]">
        {tried ? (
          <>
            Nothing lives at <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[14px] text-text/80">/{tried.slice(0, 40)}</span>. Tell Juno where you were headed.
          </>
        ) : (
          "Tell Juno where you were headed."
        )}
      </p>

      {/* ask Juno the way */}
      <div className="relative mt-8 w-full max-w-[520px] text-left">
        <div className="flex items-center gap-3 rounded-[18px] border border-white/[0.1] bg-[#0B0E14] px-4 shadow-[0_24px_60px_-30px_rgba(50,76,255,0.6)] focus-within:border-[#A6BBFF]/50">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPick(0);
            }}
            onKeyDown={onKey}
            onFocus={(e) => juno.current?.lookAt(e.currentTarget)}
            placeholder="Where were you headed?"
            aria-label="Where were you headed?"
            aria-controls="nf-places"
            className="h-14 min-w-0 flex-1 bg-transparent text-[16px] text-text outline-none placeholder:text-white/35"
          />
          <CornerDownLeft size={16} className="shrink-0 text-subtle" aria-hidden />
        </div>
        {guessed && <p className="mt-3 px-1 text-[13px] text-subtle">Juno’s best guess from that address:</p>}
        <ul id="nf-places" className="mt-3 space-y-1.5">
          {list.map((p, i) => (
            <li key={p.label}>
              <a
                href={p.href}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) return;
                  e.preventDefault();
                  go(p.href);
                }}
                onPointerEnter={() => setPick(i)}
                className={`group flex items-center gap-3 rounded-[14px] px-4 py-3 transition-colors ${i === pick ? "bg-[linear-gradient(90deg,rgba(166,187,255,0.12),rgba(166,187,255,0.03))] ring-1 ring-[#A6BBFF]/25" : "hover:bg-white/[0.03]"}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium text-text">{p.label}</span>
                  <span className="block truncate text-[13px] text-muted">{p.line}</span>
                </span>
                <ArrowRight size={16} className={`shrink-0 text-[#A6BBFF] transition-all ${i === pick ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative mt-10 hidden text-[13px] text-subtle md:block">Psst. The fours are loose. Give one a throw.</p>
    </main>
  );
}
