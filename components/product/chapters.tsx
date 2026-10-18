"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { chapters, type Chapter } from "@/lib/product";
import { AppFrame, calm, type Demo, type NavId, type Variant } from "./frame";
import { chapterDemos } from "./demos";
import { BrandDecor, MacBook, ContentDecor, JobsDecor, KnowledgeDecor } from "./decor";

/**
 * The seven chapters. Each is one big Juno frame and one simple control, in four patterns
 * that alternate down the page: tabs over a full frame, a feature list beside the frame, an
 * autoplay showcase, and a stepper.
 */

type FrameOpts = { variant: Variant; nav?: NavId; chatWidth: number; height: number; rail?: boolean; thread: string; project?: string };

const frames: Record<string, FrameOpts> = {
  knowledge: { variant: "full", nav: "Knowledge", chatWidth: 320, height: 600, thread: "Next quarter's priorities", project: "Product" },
  brand: { variant: "chat+desk", chatWidth: 290, height: 600, thread: "Scheduled Reports launch", project: "Marketing" },
  computer: { variant: "chat+desk", chatWidth: 320, height: 540, thread: "Hands-on work", project: "Operations" },
  apps: { variant: "chat+desk", chatWidth: 340, height: 620, thread: "Launch dashboard", project: "Product launch" },
  content: { variant: "chat+desk", chatWidth: 290, height: 600, thread: "The journal", project: "Marketing" },
  tools: { variant: "full", nav: "Chat", chatWidth: 320, height: 600, thread: "Invoice exports", project: "Product" },
  jobs: { variant: "full", nav: "Jobs", chatWidth: 270, height: 600, rail: true, thread: "Weekly competitor watch", project: "Strategy" },
};

/** Roughly how long a demo takes to play through, for progress lines. */
const runtime = (d: Demo) => 450 + d.steps * (d.gap ?? 820);

/** Every demo's words in the page HTML, for the tabs that aren't showing. */
function HiddenText({ demos, active }: { demos: Demo[]; active: number }) {
  return (
    <div className="sr-only">
      {demos.map((d, i) =>
        i === active ? null : (
          <div key={i}>
            {d.chat.map((m, k) => (
              <p key={k}>
                {m.title ? `${m.title} ` : ""}
                {m.text}
              </p>
            ))}
          </div>
        ),
      )}
    </div>
  );
}

function LeftHead({ c }: { c: Chapter }) {
  return (
    <header>
      <h2 id={`${c.id}-title`} className="text-balance text-[36px] font-medium leading-[40px] tracking-[-0.03em] md:text-[44px] md:leading-[48px]">
        {c.title} <span className="accent-text block">{c.muted}</span>
      </h2>
      <p className="mt-4 max-w-[46ch] text-pretty text-[16px] leading-[26px] text-muted">{c.sub}</p>
    </header>
  );
}

function ChapterLink({ c, className = "mt-8" }: { c: Chapter; className?: string }) {
  if (!c.link) return <span />;
  return (
    <Link href={c.link.href} className={`group inline-flex ${className} items-center gap-1.5 text-[15px] font-medium text-[#A6BBFF] transition-colors hover:text-text`}>
      {c.link.label}
      <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

const LOOP_GAP = 3500;

/**
 * Plays a chapter's demos on a loop while it's on screen: when one finishes, the next one
 * starts a moment later, round and round. Picking one jumps there and carries on from it.
 */
function useCycle(count: number) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const play = useInView(ref, { amount: 0.3 });
  const [tab, setTab] = useState(0);
  const [run, setRun] = useState(0);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const onDone = useCallback(() => {
    if (reduce) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setTab((t) => (t + 1) % count);
      setRun((r) => r + 1);
    }, LOOP_GAP);
  }, [reduce, count]);
  const pick = (i: number) => {
    window.clearTimeout(timer.current);
    setTab(i);
    setRun((r) => r + 1);
  };
  return { ref, play, tab, run, pick, onDone };
}

/** Arrow keys move along a tablist. */
function useArrows(count: number, current: number, pick: (i: number) => void, vertical = false) {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    const next = vertical ? "ArrowDown" : "ArrowRight";
    const prev = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key !== next && e.key !== prev) return;
    e.preventDefault();
    const n = (current + (e.key === next ? 1 : -1) + count) % count;
    pick(n);
    (e.currentTarget.querySelectorAll<HTMLElement>("[role=tab]")[n] as HTMLElement | undefined)?.focus();
  };
}

function Section({ c, children, className = "" }: { c: Chapter; children: ReactNode; className?: string }) {
  return (
    <section id={c.id} aria-labelledby={`${c.id}-title`} className={`scroll-mt-24 overflow-x-clip pt-36 md:pt-56 ${className}`} data-chapter={c.id}>
      <div className="container-page">{children}</div>
    </section>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: calm }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ A · full frame + tabs */

function TabsChapter({ c }: { c: Chapter }) {
  const demos = chapterDemos[c.id];
  const f = frames[c.id];
  const { ref, play, tab, run, pick, onDone } = useCycle(demos.length);
  const onKey = useArrows(c.items.length, tab, pick);
  return (
    <Section c={c}>
      <ChapterIntro id={`${c.id}-title`} lead={c.title} muted={c.muted} sub={c.sub} />
      <div role="tablist" aria-label={c.name} onKeyDown={onKey} className="fx-scroll mx-auto mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-white/[0.02] p-1">
        {c.items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            role="tab"
            id={`${c.id}-tab-${i}`}
            aria-selected={tab === i}
            aria-controls={`${c.id}-panel`}
            tabIndex={tab === i ? 0 : -1}
            onClick={() => pick(i)}
            className={`h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-[14px] transition-colors duration-200 ${tab === i ? "bg-white/[0.1] text-text" : "text-muted hover:text-text"}`}
          >
            {it.name}
          </button>
        ))}
      </div>
      <Reveal className="mt-10 md:mt-12">
        <div ref={ref} id={`${c.id}-panel`} role="tabpanel" aria-labelledby={`${c.id}-tab-${tab}`} className="relative isolate">
          <AppFrame key={`${tab}-${run}`} demo={demos[tab]} play={play} onDone={onDone} {...f} />
          {c.id === "knowledge" && <KnowledgeDecor />}
        </div>
        <HiddenText demos={demos} active={tab} />
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ B · feature list + frame */

function ListChapter({ c }: { c: Chapter }) {
  const demos = chapterDemos[c.id];
  const f = frames[c.id];
  const { ref, play, tab, run, pick, onDone } = useCycle(demos.length);
  const reduce = useReducedMotion();
  const onKey = useArrows(c.items.length, tab, pick, true);
  return (
    <Section c={c}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className={`lg:col-span-4 ${c.mirror ? "lg:order-2" : ""}`}>
          <LeftHead c={c} />
          <div role="tablist" aria-label={c.name} aria-orientation="vertical" onKeyDown={onKey} className="mt-8 space-y-1">
            {c.items.map((it, i) => (
              <button
                key={it.name}
                type="button"
                role="tab"
                id={`${c.id}-tab-${i}`}
                aria-selected={tab === i}
                aria-controls={`${c.id}-panel`}
                tabIndex={tab === i ? 0 : -1}
                onClick={() => pick(i)}
                className={`relative block w-full overflow-hidden rounded-[14px] py-3.5 pl-5 pr-4 text-left transition-colors duration-200 ${tab === i ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
              >
                <span className={`absolute inset-y-3 left-0 w-[2px] rounded-full transition-colors ${tab === i ? "bg-[#7A8FFF]" : "bg-white/[0.08]"}`} />
                <span className={`block text-[16px] font-medium transition-colors ${tab === i ? "text-text" : "text-muted"}`}>{it.name}</span>
                <span className={`mt-0.5 block text-[14px] leading-[21px] transition-colors ${tab === i ? "text-muted" : "text-subtle"}`}>{it.line}</span>
                {tab === i && (
                  <span className="absolute inset-x-5 bottom-0 h-px bg-white/[0.06]">
                    <motion.span
                      key={run}
                      className="block h-full origin-left bg-[#7A8FFF]/70"
                      initial={{ scaleX: reduce ? 1 : 0 }}
                      animate={{ scaleX: play ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : runtime(demos[i]) / 1000, ease: "linear" }}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
          <ChapterLink c={c} />
        </Reveal>
        <Reveal className={`min-w-0 lg:col-span-8 ${c.mirror ? "lg:order-1" : ""}`}>
          <div ref={ref} id={`${c.id}-panel`} role="tabpanel" aria-labelledby={`${c.id}-tab-${tab}`} className="relative isolate">
            <AppFrame key={`${tab}-${run}`} demo={demos[tab]} play={play} onDone={onDone} {...f} />
            {c.id === "brand" && <BrandDecor />}
            {c.id === "content" && <ContentDecor />}
            {c.id === "jobs" && <JobsDecor />}
          </div>
          <HiddenText demos={demos} active={tab} />
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ C · autoplay showcase */

const DWELL = 11000;

function AutoplayChapter({ c }: { c: Chapter }) {
  const demos = chapterDemos[c.id];
  const f = frames[c.id];
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const elapsed = useRef(0);
  const p = useMotionValue(0);
  const width = useTransform(p, (v) => `${Math.min(100, v * 100)}%`);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  const go = useCallback(
    (i: number) => {
      elapsed.current = 0;
      p.set(0);
      setIdx(i);
    },
    [p],
  );

  const running = !reduce && !paused && !hover && inView && !hidden;
  useAnimationFrame((_, delta) => {
    if (!running) return;
    elapsed.current += Math.min(delta, 100);
    p.set(elapsed.current / DWELL);
    if (elapsed.current >= DWELL) go((idx + 1) % demos.length);
  });

  const onKey = useArrows(c.items.length, idx, go);
  return (
    <Section c={c}>
      <ChapterIntro id={`${c.id}-title`} lead={c.title} muted={c.muted} sub={c.sub} />
      <Reveal className="mt-14 md:mt-16">
        <div ref={ref} id={`${c.id}-panel`} role="tabpanel" aria-labelledby={`${c.id}-tab-${idx}`} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} >
          <MacBook>
            <AppFrame key={idx} demo={demos[idx]} play={inView} {...f} />
          </MacBook>
        </div>
        <div className="mx-auto mt-12 flex max-w-[760px] items-start gap-3">
          <div role="tablist" aria-label={c.name} onKeyDown={onKey} className="grid flex-1 grid-cols-3 gap-3">
            {c.items.map((it, i) => (
              <button
                key={it.name}
                type="button"
                role="tab"
                id={`${c.id}-tab-${i}`}
                aria-selected={idx === i}
                aria-controls={`${c.id}-panel`}
                tabIndex={idx === i ? 0 : -1}
                onClick={() => go(i)}
                className="group text-left"
              >
                <span className="block h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                  {i < idx ? (
                    <span className="block h-full w-full bg-white/30" />
                  ) : i === idx ? (
                    <motion.span className="block h-full bg-[#7A8FFF]" style={{ width: reduce ? "100%" : width }} />
                  ) : null}
                </span>
                <span className={`mt-3 block text-[14px] transition-colors ${idx === i ? "text-text" : "text-muted group-hover:text-text"}`}>{it.name}</span>
              </button>
            ))}
          </div>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((x) => !x)}
              aria-label={paused ? "Play" : "Pause"}
              className="-mt-3 grid size-9 shrink-0 place-items-center rounded-full border border-white/[0.1] text-muted transition-colors hover:text-text"
            >
              {paused ? <Play size={13} aria-hidden /> : <Pause size={13} aria-hidden />}
            </button>
          )}
        </div>
        <HiddenText demos={demos} active={idx} />
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ D · stepper */

function StepperChapter({ c }: { c: Chapter }) {
  const demos = chapterDemos[c.id];
  const f = frames[c.id];
  // in order, like a sequence, and back to the start after the last step
  const { ref, play, tab: step, run, pick, onDone } = useCycle(demos.length);
  const onKey = useArrows(c.items.length, step, pick);
  return (
    <Section c={c}>
      <ChapterIntro id={`${c.id}-title`} lead={c.title} muted={c.muted} sub={c.sub} />
      <div role="tablist" aria-label={c.name} onKeyDown={onKey} className="relative mx-auto mt-12 grid max-w-[760px] grid-cols-3">
        <span aria-hidden className="absolute left-[16.66%] right-[16.66%] top-[15px] h-px bg-white/[0.1]">
          <motion.span className="block h-full origin-left bg-[#7A8FFF]/70" initial={false} animate={{ scaleX: step / (demos.length - 1) }} transition={{ duration: 0.8, ease: calm }} />
        </span>
        {c.items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            role="tab"
            id={`${c.id}-tab-${i}`}
            aria-selected={step === i}
            aria-controls={`${c.id}-panel`}
            tabIndex={step === i ? 0 : -1}
            onClick={() => pick(i)}
            className="group relative flex flex-col items-center gap-3 px-2"
          >
            <span
              className={`grid size-[31px] place-items-center rounded-full border text-[12.5px] font-medium transition-colors duration-300 ${
                step === i ? "border-[#7A8FFF] bg-[#7A8FFF] text-[#0B0E13]" : i < step ? "border-[#7A8FFF]/60 bg-[#0B0E13] text-[#A6BBFF]" : "border-white/[0.14] bg-[#0B0E13] text-muted"
              }`}
            >
              {i + 1}
            </span>
            <span className={`text-center text-[14px] transition-colors ${step === i ? "text-text" : "text-muted group-hover:text-text"}`}>{it.name}</span>
          </button>
        ))}
      </div>
      <Reveal className="mt-10 md:mt-12">
        <div ref={ref} id={`${c.id}-panel`} role="tabpanel" aria-labelledby={`${c.id}-tab-${step}`} className="relative isolate">
          <AppFrame key={`${step}-${run}`} demo={demos[step]} play={play} onDone={onDone} {...f} />
        </div>
        <ChapterLink c={c} className="mt-6" />
        <HiddenText demos={demos} active={step} />
      </Reveal>
    </Section>
  );
}

export function Chapters() {
  return (
    <>
      {chapters.map((c) =>
        c.pattern === "tabs" ? (
          <TabsChapter key={c.id} c={c} />
        ) : c.pattern === "list" ? (
          <ListChapter key={c.id} c={c} />
        ) : c.pattern === "autoplay" ? (
          <AutoplayChapter key={c.id} c={c} />
        ) : (
          <StepperChapter key={c.id} c={c} />
        ),
      )}
    </>
  );
}
