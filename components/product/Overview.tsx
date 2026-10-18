"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { AppWindow, BookOpen, Check, ChevronRight, FileText, Globe, ImageIcon, ListChecks, Lock, Play, Repeat, Sparkles } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { JunoPointer } from "./frame";

/**
 * The hero. "Inside Juno.", then everything Juno does, gathered around Juno: six live previews float out of it and settle
 * around it, each tilted a touch toward the middle and leaning with the cursor. Each one has
 * its own look and one small thing happening inside it. Phones get the same cards, stacked.
 */

const calm = [0.16, 1, 0.3, 1] as const;

/** Steps 0..count-1 on a loop while `on`. */
function useLoop(on: boolean, count: number, gap: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const iv = window.setInterval(() => setN((x) => (x + 1) % count), gap);
    return () => window.clearInterval(iv);
  }, [on, count, gap]);
  return n;
}

/* ------------------------------------------------------------------ the card shell */

function Shell({ icon, title, href, children }: { icon: ReactNode; title: string; href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group/card block overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#0F1524] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-white/[0.2] hover:shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(166,187,255,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <div className="flex h-[52px] items-center gap-2.5 border-b border-white/[0.08] px-5 text-[15px] font-medium text-text">
        <span className="text-[#AEB8C6]">{icon}</span>
        {title}
        <ChevronRight size={16} className="ml-auto text-muted transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:text-text" aria-hidden />
      </div>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ the six previews */

function Knowledge({ n }: { n: number }) {
  const chips = ["Files", "Learnings"];
  return (
    <>
      <div className="relative flex items-center gap-5 bg-[#F3EEE3] px-5 py-6 text-[#1E2A22]">
        {/* the wiki, as a book */}
        <div className="relative h-[104px] w-[78px] shrink-0 -rotate-[8deg] rounded-[6px] rounded-l-[3px] bg-[linear-gradient(135deg,#3E6B4E,#2B4C37)] shadow-[6px_10px_20px_-6px_rgba(30,42,34,0.55),inset_4px_0_0_rgba(0,0,0,0.18)]">
          <span className="absolute inset-y-2 right-1.5 w-px bg-white/10" />
          <BookOpen size={26} strokeWidth={1.6} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D9E8DC]" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-[10.5px] font-medium tracking-[0.12em] text-[#6E6A5E]">COMPANY WIKI</p>
          <p className="mt-1 text-[30px] font-semibold leading-[30px] tracking-[-0.04em]">The way we work.</p>
        </div>
      </div>
      <div className="flex items-center gap-4 px-5 py-3.5 text-[13.5px]">
        {chips.map((c, i) => (
          <span key={c} className={`flex items-center gap-1.5 transition-colors duration-500 ${n % 2 === i ? "text-text" : "text-muted"}`}>
            {i ? <Sparkles size={14} aria-hidden /> : <FileText size={14} aria-hidden />}
            {c}
          </span>
        ))}
        <span className="ml-auto flex gap-1.5">
          <span className="grid size-7 place-items-center rounded-[7px] bg-white">
            <BrandIcon id="slack" size={16} className="!shadow-none" />
          </span>
          <span className="grid size-7 place-items-center rounded-[7px] bg-white">
            <BrandIcon id="linear" size={16} className="!shadow-none" />
          </span>
        </span>
      </div>
    </>
  );
}

function Apps({ n }: { n: number }) {
  const approved = n >= 2;
  const rows = [
    { i: "L", t: "Product ready", ok: true },
    { i: "S", t: "Launch email", ok: approved },
    { i: "E", t: "Help article", ok: true },
  ];
  return (
    <div className="@container bg-[#E7E9CB]">
      <div className="grid gap-5 px-6 py-5 text-[#1F3324] @md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="flex flex-col">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">Launch room</p>
          <p className="mt-auto text-balance pt-3 text-[32px] font-semibold leading-[32px] tracking-[-0.045em] @md:pt-6">
            Launch day.
            <br />
            No loose ends.
          </p>
          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-[10px] bg-[#1F3324]/[0.07] px-2.5 py-1.5">
            <motion.span key={approved ? "0" : "1"} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: calm }} className="text-[18px] font-semibold leading-none">
              {approved ? 0 : 1}
            </motion.span>
            <span className="whitespace-nowrap text-[10.5px] leading-none text-[#1F3324]/70">{approved ? "approvals to go" : "approval to go"}</span>
          </span>
        </div>
        <div>
          <p className="text-[12px] text-[#1F3324]/60 @md:text-right">Before Friday</p>
          <div className="mt-3 space-y-2">
            {rows.map((r) => (
              <div key={r.t} className="flex h-11 items-center gap-2.5 whitespace-nowrap rounded-[10px] bg-white px-3 text-[13px] shadow-[0_1px_0_rgba(31,51,36,0.06)] ring-1 ring-[#1F3324]/[0.08]">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#E7E9CB] text-[10px] font-semibold">{r.i}</span>
                <span className="min-w-0 truncate">{r.t}</span>
                <span className="ml-auto shrink-0">
                  {r.ok ? (
                    <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25, ease: calm }} className="block">
                      <Check size={15} strokeWidth={2.25} className="text-[#2F6B45]" aria-hidden />
                    </motion.span>
                  ) : (
                    <span className="text-[11px] text-[#A0612A]">In review</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Images({ n, on }: { n: number; on: boolean }) {
  return (
    <div className="relative h-[230px] overflow-hidden bg-[#121C3A]">
      <Image
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=75"
        alt=""
        fill
        sizes="380px"
        className="object-cover object-[70%_50%] [filter:hue-rotate(200deg)_saturate(0.75)_brightness(0.62)] [mask-image:linear-gradient(90deg,transparent_18%,#000_62%)]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#121C3A_30%,transparent_75%)]" />
      <div className="relative flex h-full flex-col p-5 text-white">
        <p className="text-[12px] font-semibold tracking-[-0.01em]">everyday objects</p>
        <p className="mt-4 text-[34px] font-semibold leading-[33px] tracking-[-0.045em]">
          Find your
          <br />
          focus.
        </p>
        <span className="mt-auto flex w-fit items-center gap-2 rounded-[9px] border border-white/15 bg-white/[0.06] px-2.5 py-1.5 text-[12px]">
          {["#7A8FFF", "#C3B6FF", "#F3EEE3"].map((c) => (
            <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
          ))}
          In your brand
        </span>
      </div>
      <span className="absolute bottom-5 right-5 grid size-10 place-items-center rounded-full bg-white text-[#121C3A] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <Play size={16} className="ml-0.5 fill-current" aria-hidden />
      </span>
      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
        <motion.span className="block h-full bg-white/80" initial={false} animate={{ width: on ? `${25 + n * 25}%` : "10%" }} transition={{ duration: 2.4, ease: "linear" }} />
      </span>
    </div>
  );
}

function Tasks({ n }: { n: number }) {
  const tasks = [
    { t: "Write the announcement", I: FileText },
    { t: "Create the social visuals", I: ImageIcon },
    { t: "Prepare customer emails", I: Check },
  ];
  return (
    <div className="px-6 pb-4 pt-5">
      <p className="text-[24px] font-semibold tracking-[-0.03em] text-text">Let&apos;s get this launched.</p>
      <ul className="mt-3">
        {tasks.map(({ t, I }, i) => {
          const done = n > i;
          return (
            <li key={t} className="flex h-[52px] items-center gap-3 border-b border-white/[0.07] text-[14.5px] last:border-0">
              <span className={`grid size-[22px] place-items-center rounded-full border transition-colors duration-500 ${done ? "border-[#5BE3A2]/70 text-[#5BE3A2]" : "border-white/20 text-transparent"}`}>
                <Check size={12} strokeWidth={2.75} aria-hidden />
              </span>
              <span className={`transition-colors duration-500 ${done ? "text-text" : "text-muted"}`}>{t}</span>
              <I size={16} className="ml-auto text-muted" aria-hidden />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Jobs({ n }: { n: number }) {
  const delivered = n >= 1;
  return (
    <div className="p-5">
      <div className="flex items-center gap-4">
        <div className="w-[60px] overflow-hidden rounded-[10px] bg-[#F3EEE3] text-center shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]">
          <p className="bg-white/60 py-1 text-[9px] font-semibold tracking-[0.1em] text-[#6E6A5E]">EVERY</p>
          <p className="pb-1.5 text-[24px] font-bold leading-[28px] tracking-[-0.04em] text-[#5A2E1E]">FRI</p>
        </div>
        <div>
          <p className="text-[24px] font-medium tracking-[-0.03em] text-text">Competitor watch</p>
          <p className="text-[14.5px] text-muted">On it. Every week.</p>
        </div>
      </div>
      <div className="mt-4 flex h-12 items-center gap-3 rounded-[12px] bg-white/[0.05] px-4 text-[14.5px] text-text">
        <FileText size={16} className="text-muted" aria-hidden />
        Your weekly briefing
        <span className="ml-auto">
          {delivered ? (
            <motion.span key="d" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25, ease: calm }} className="block">
              <Check size={17} className="text-text" aria-hidden />
            </motion.span>
          ) : (
            <span className="block size-4 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
          )}
        </span>
      </div>
    </div>
  );
}

function Computer({ n }: { n: number }) {
  const saved = n >= 2;
  return (
    <div className="p-4 pt-3.5">
      <div className="overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex h-8 items-center border-b border-black/[0.06] bg-[#EEF0F3] px-3">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[7px] rounded-full bg-black/15" />
            ))}
          </span>
          <span className="mx-auto flex items-center gap-1.5 text-[11.5px] text-[#4a4f5c]">
            <Lock size={10} aria-hidden />
            Company journal
          </span>
          <span className="w-[27px]" />
        </div>
        <div className="relative px-5 pb-4 pt-4">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8a909c]">IN THE EDITOR</p>
          <p className="mt-2 text-[28px] font-semibold leading-[29px] tracking-[-0.045em]">
            Scheduled Reports.
            <br />
            Monday, handled.
          </p>
          <div className="mt-3 space-y-1.5">
            <span className="block h-[5px] w-[88%] rounded-full bg-black/[0.07]" />
            <span className="block h-[5px] w-[64%] rounded-full bg-black/[0.07]" />
          </div>
          <p className={`mt-3 flex items-center gap-1.5 text-[12px] transition-opacity duration-300 ${saved ? "text-[#1f7a4d] opacity-100" : "opacity-0"}`}>
            <Check size={12} strokeWidth={2.5} aria-hidden />
            Draft saved
          </p>
          <motion.span
            aria-hidden
            className="absolute flex items-start"
            initial={false}
            animate={{ left: n === 0 ? "48%" : "70%", top: n === 0 ? "58%" : "66%" }}
            transition={{ duration: 1.1, ease: calm }}
          >
            <JunoPointer />
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ the stage */

type Spot = {
  id: string;
  title: string;
  href: string;
  icon: ReactNode;
  /** what you'd ask Juno for this one */
  ask: string;
  x: number;
  y: number;
  w: number;
  rx: number;
  ry: number;
  rz: number;
  depth: number;
};

/** Hand-set on a 1320 × 720 stage, as in the layout we agreed: Juno in the middle, tilted a touch toward it. */
const spots: Spot[] = [
  { id: "knowledge", title: "Company knowledge", href: "#knowledge", icon: <BookOpen size={18} strokeWidth={1.75} />, ask: "What should we prioritize next?", x: 35, y: 75, w: 357, rx: 4, ry: 8, rz: -2.5, depth: 1.2 },
  { id: "apps", title: "Apps, sites & dashboards", href: "#apps", icon: <AppWindow size={18} strokeWidth={1.75} />, ask: "Build a launch dashboard for the team.", x: 437, y: 35, w: 565, rx: 5, ry: 0, rz: 0, depth: 0.7 },
  { id: "images", title: "Images & video", href: "#brand", icon: <ImageIcon size={18} strokeWidth={1.75} />, ask: "Make it look and sound like us.", x: 1047, y: 75, w: 357, rx: 4, ry: -8, rz: 2, depth: 1.1 },
  { id: "tasks", title: "Tasks, taken care of", href: "#tools", icon: <ListChecks size={18} strokeWidth={1.75} />, ask: "Let’s get this launched.", x: 35, y: 420, w: 428, rx: -3, ry: 8, rz: -2, depth: 1 },
  { id: "jobs", title: "Jobs", href: "#jobs", icon: <Repeat size={18} strokeWidth={1.75} />, ask: "Brief me every Friday at 9 AM.", x: 508, y: 560, w: 424, rx: -5, ry: 0, rz: 0, depth: 0.8 },
  { id: "computer", title: "A computer of its own", href: "#computer", icon: <Globe size={18} strokeWidth={1.75} />, ask: "Add this article to our CMS as a draft.", x: 977, y: 420, w: 428, rx: -3, ry: -8, rz: 2, depth: 1.3 },
];
/** Order on tablets and smaller laptops, where the cards sit in a two-column grid. */
const GRID = ["apps", "knowledge", "images", "tasks", "computer", "jobs"] as const;
const SW = 1440;
const SH = 800;
const JUNO = { x: 720, y: 400 };
/** cards are drawn at this size, so the scene can breathe */
const CS = 0.84;
const CYCLE = 4200;

function Body({ id, n, on }: { id: string; n: number; on: boolean }) {
  if (id === "knowledge") return <Knowledge n={n} />;
  if (id === "apps") return <Apps n={n} />;
  if (id === "images") return <Images n={n} on={on} />;
  if (id === "tasks") return <Tasks n={n} />;
  if (id === "jobs") return <Jobs n={n} />;
  return <Computer n={n} />;
}

function Floating({
  s,
  i,
  on,
  reduce,
  mx,
  my,
  n,
  lit,
  dim,
  onHover,
  cardRef,
}: {
  cardRef: (el: HTMLDivElement | null) => void;
  s: Spot;
  i: number;
  on: boolean;
  reduce: boolean;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  n: number;
  lit: boolean;
  dim: boolean;
  onHover: (on: boolean) => void;
}) {
  const x = useTransform(mx, (v) => v * s.depth);
  const y = useTransform(my, (v) => v * s.depth);
  // where Juno is, from this card's point of view: they come out of it
  const fromX = JUNO.x - (s.x + (s.w * CS) / 2);
  const fromY = JUNO.y - (s.y + 120);
  return (
    <motion.div
      ref={cardRef}
      className="pointer-events-none absolute [&_a]:pointer-events-auto"
      style={{ left: s.x, top: s.y, width: s.w, x, y, zIndex: lit ? 20 : 10 }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, x: fromX, y: fromY, scale: 0.4 }}
        animate={on || reduce ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined}
        transition={{ duration: 1.1, delay: 0.5 + i * 0.07, ease: calm }}
      >
        <div className="cta-drift origin-top-left" style={{ animationDelay: `${-i * 1.4}s`, scale: CS }}>
          <motion.div
            style={{ transformPerspective: 1100 }}
            initial={false}
            animate={
              lit
                ? { rotateX: 0, rotateY: 0, rotate: 0, scale: 1.04, y: -8, opacity: 1 }
                : { rotateX: s.rx, rotateY: s.ry, rotate: s.rz, scale: 1, y: 0, opacity: dim ? 0.72 : 1 }
            }
            transition={{ duration: 0.6, ease: calm }}
            className="rounded-[22px]"
          >
            <div className={`rounded-[22px] transition-shadow duration-500 ${lit ? "shadow-[0_0_0_1px_rgba(166,187,255,0.35),0_0_60px_-10px_rgba(90,120,255,0.45)]" : ""}`}>
              <Shell icon={s.icon} title={s.title} href={s.href}>
                <Body id={s.id} n={n} on={on} />
              </Shell>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PxHero() {
  const reduce = Boolean(useReducedMotion());
  const stage = useRef<HTMLDivElement>(null);
  const juno = useRef<MascotApi>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setSeen(true), reduce ? 0 : 250);
    return () => window.clearTimeout(t);
  }, [reduce]);
  const inView = useInView(stage, { amount: 0.1 });
  const n = useLoop(inView && !reduce, 4, 2200);
  const shown = reduce ? 3 : n;

  // Juno turns to one card after another: it lights up while Juno looks over and nods
  const [a, setA] = useState(0);
  const [done, setDone] = useState(-1);
  const [hovered, setHovered] = useState<number | null>(null);
  useEffect(() => {
    if (reduce || hovered !== null || !inView) return;
    const iv = window.setInterval(() => setA((x) => (x + 1) % spots.length), CYCLE);
    return () => window.clearInterval(iv);
  }, [reduce, hovered, inView]);
  const asking = hovered ?? a;
  useEffect(() => {
    if (!seen) return;
    const wait = reduce || hovered !== null ? 0 : 500;
    const t = window.setTimeout(() => {
      setDone(asking);
      juno.current?.lookAt(cards.current[asking]);
      if (hovered === null) juno.current?.nod();
    }, wait);
    return () => window.clearTimeout(t);
  }, [asking, seen, reduce, hovered]);
  const lit = done === asking ? done : -1;

  // the stage scales down to fit narrower desktops
  const [k, setK] = useState(1);
  useEffect(() => {
    const fit = () => setK(Math.min(1, (stage.current?.clientWidth ?? SW) / SW));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // the whole field leans with the cursor
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 80, damping: 20, mass: 0.8 });
  const my = useSpring(py, { stiffness: 80, damping: 20, mass: 0.8 });
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    px.set(((e.clientX - (r.left + r.width / 2)) / r.width) * -18);
    py.set(((e.clientY - (r.top + r.height / 2)) / r.height) * -14);
  };

  const word = (w: string, i: number) => (
    <motion.span
      key={w}
      className={i ? "inline-block" : "mr-[0.24em] inline-block"}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.05 + i * 0.12, ease: calm }}
    >
      {i ? <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_55%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">{w}</span> : w}
    </motion.span>
  );

  return (
    <section aria-labelledby="px-title" className="relative overflow-x-clip pt-[136px] md:pt-[152px]">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <h1 id="px-title" className="t-display-xl text-balance">
            {["Inside", "Juno."].map(word)}
          </h1>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1384px] px-8">
          {/* desktop: one scene, the headline and Juno in the middle, everything it does around them */}
          <div
            ref={stage}
            onPointerMove={onMove}
            onPointerLeave={() => {
              px.set(0);
              py.set(0);
            }}
            className="relative mx-auto hidden max-w-[1320px] xl:block"
            style={{ height: SH * k }}
          >
            {/* glow 1 of 2 */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[130%] -translate-x-1/2 -translate-y-1/2"
              style={{ background: "radial-gradient(38% 36% at 50% 46%, rgba(50,76,255,0.24), rgba(70,60,200,0.08) 50%, transparent 72%)" }}
            />
            <div className="absolute left-0 top-0 origin-top-left" style={{ width: SW, height: SH, transform: `scale(${k})` }}>

              {/* Juno, in the middle of it all, with the request it's working on */}
              <motion.div
                className="absolute grid place-items-center"
                style={{ left: JUNO.x - 80, top: JUNO.y - 80, width: 160, height: 160 }}
                initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.3, ease: calm }}
              >
                <span aria-hidden className="cta-breathe absolute -inset-16 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(90,120,255,0.55), rgba(90,120,255,0.12) 55%, transparent)" }} />
                <Mascot size={150} state="idle" halo={false} trackCursor apiRef={juno} />
              </motion.div>

              {spots.map((s, i) => (
                <Floating
                  key={s.id}
                  s={s}
                  i={i}
                  on={seen}
                  reduce={reduce}
                  mx={mx}
                  my={my}
                  n={shown}
                  lit={lit === i}
                  dim={lit >= 0 && lit !== i}
                  onHover={(h) => setHovered((cur) => (h ? i : cur === i ? null : cur))}
                  cardRef={(el) => {
                    cards.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>

      </div>
      <div className="container-page">

        {/* phones and tablets: Juno and its request, then the cards, stacked */}
        <div className="mt-12 flex flex-col items-center xl:hidden">
          <div className="relative grid place-items-center">
            <span aria-hidden className="cta-breathe absolute -inset-12 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(90,120,255,0.5), rgba(90,120,255,0.1) 55%, transparent)" }} />
            <Mascot size={120} state="idle" halo={false} />
          </div>
        </div>
        <ul className="mx-auto mt-10 grid max-w-[720px] gap-4 sm:grid-cols-2 xl:hidden">
          {/* the wide ones span the row, the rest pair up, so no row is left half empty */}
          {GRID.map((id) => spots.find((s) => s.id === id)!).map((s) => (
            <li key={s.id} className={s.id === "apps" || s.id === "jobs" ? "sm:col-span-2" : ""}>
              <Shell icon={s.icon} title={s.title} href={s.href}>
                <Body id={s.id} n={shown} on />
              </Shell>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The six previews, shared with the nav's Product menu. */
export { Knowledge as KnowledgePreview, Apps as AppsPreview, Images as ImagesPreview, Tasks as TasksPreview, Jobs as JobsPreview, Computer as ComputerPreview };
