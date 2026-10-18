"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { TextLink } from "@/components/ui/TextLink";
import { AUTOMATIONS_HREF } from "@/lib/site";
import { chapters, feature, type FeatureId } from "@/lib/features";
import { Anatomy, CommandBar, SectionHead, useTyped } from "./kit";
import { AppsBody, AutomationsBody, ComputerBody, FilesBody } from "./doesBodies";

/**
 * Chapter 2: watch it work. Text on the left, the Juno window held on the right. As each
 * feature comes into focus the window types the ask and turns into the work. The last one,
 * Juno's own computer, takes over the screen, then gives it back as you scroll on.
 */

const steps: { id: FeatureId; Body: ComponentType<{ on: boolean }> }[] = [
  { id: "connected-apps", Body: AppsBody },
  { id: "files-and-spreadsheets", Body: FilesBody },
  { id: "automations", Body: AutomationsBody },
  { id: "computer-and-browser", Body: ComputerBody },
];
const base = [0.2, 0.8, 0.2, 1] as const;

/** The window: command bar typing the ask, the body turning into the work. */
function Window({
  step,
  played,
  typedOnce,
}: {
  step: number;
  played: Set<number>;
  typedOnce: Set<number>;
}) {
  const { id, Body } = steps[step];
  const cmd = chapters.does.commands[id] ?? "";
  const again = typedOnce.has(step);
  const typed = useTyped(cmd, true, 40, 0, step);
  const text = again ? cmd : typed.shown;
  const busy = !again && !typed.done;
  return (
    <motion.div
      layout
      transition={{ duration: 0.5, ease: base }}
      style={{ borderRadius: 24 }}
      className="flex h-full flex-col overflow-hidden border border-line bg-surface shadow-[var(--shadow-frame)]"
    >
      <motion.div layout="position" transition={{ duration: 0.5, ease: base }}>
        <CommandBar
          text={text}
          caret={busy}

          className="border-b border-line"
          right={
            id === "computer-and-browser" ? (
              <span className="flex items-center gap-1.5 text-[12px] text-muted">
                <span className="size-1.5 rounded-full bg-success" />
                Juno&apos;s computer
              </span>
            ) : undefined
          }
        />
      </motion.div>
      <motion.div
        layout
        transition={{ duration: 0.5, ease: base }}
        className="relative min-h-0 flex-1"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99, transition: { duration: 0.18 } }}
            transition={{ duration: 0.4, ease: base }}
          >
            <Body on={played.has(step) && (again || typed.done)} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/** Phones: each feature's window inline under its text, playing once in view. */
function InlineWindow({ step }: { step: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const { id, Body } = steps[step];
  return (
    <div ref={ref} className="mt-8 md:hidden">
      <div
        className={`flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface ${step === 3 ? "h-[440px]" : "h-[400px]"}`}
      >
        <CommandBar
          text={chapters.does.commands[id] ?? ""}
          keys={false}
          className="border-b border-line"
        />
        <div className="relative min-h-0 flex-1">
          <Body on={Boolean(seen || reduce)} />
        </div>
      </div>
    </div>
  );
}

export function FxDoes() {
  const reduce = useReducedMotion();
  // 0..3 the features; 4 the takeover runway; 5 handing the screen back
  const [active, setActive] = useState(0);
  const [played, setPlayed] = useState<Set<number>>(() => new Set([0]));
  const [typedOnce, setTypedOnce] = useState<Set<number>>(() => new Set());
  const blocks = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = blocks.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!els) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const n = Number((e.target as HTMLElement).dataset.step);
          setActive(n);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const step = Math.min(active, 3);
  // remember what has played and been typed, so scrolling back never replays
  const prev = useRef(step);
  useEffect(() => {
    const p = prev.current;
    prev.current = step;
    const t = window.setTimeout(() => {
      setPlayed((s) => (s.has(step) ? s : new Set(s).add(step)));
      if (p !== step) setTypedOnce((s) => (s.has(p) ? s : new Set(s).add(p)));
    }, 0);
    return () => window.clearTimeout(t);
  }, [step]);

  const takeover = active === 4 && !reduce;

  return (
    <section
      id="does"
      aria-labelledby="does-title"
      className="relative scroll-mt-24 overflow-x-clip py-24 md:py-40"
    >
      <div className="container-page">
        <SectionHead
          id="does-title"
          title={chapters.does.title}
          muted={chapters.does.muted}
          sub={chapters.does.sub}
        />
      </div>

      <div className="relative mt-16 md:mt-24">
        {/* the window, held on screen while the text scrolls (desktop) */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          <div className="sticky top-0 h-screen">
            <div className="container-page relative h-full">
              <div
                className={`pointer-events-auto absolute ${
                  takeover
                    ? "inset-x-5 bottom-8 top-[136px] z-10"
                    : "left-[calc(41.666%+20px)] right-5 top-[calc(50%-236px)] h-[520px]"
                }`}
              >
                <div className="relative h-full">
                  <Window step={step} played={played} typedOnce={typedOnce} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* the text, scrolling past */}
        <div ref={blocks} className="container-page relative">
          <div className="relative md:w-5/12 md:pr-12">
            {steps.map((s, i) => {
              const f = feature(s.id);
              return (
                <div
                  key={s.id}
                  id={s.id}
                  data-step={i}
                  className={`scroll-mt-32 py-12 transition-opacity duration-500 md:flex md:min-h-[72vh] md:flex-col md:justify-center md:py-0 ${
                    active === i ? "md:opacity-100" : takeover ? "md:opacity-0" : "md:opacity-30"
                  }`}
                >
                  <Anatomy f={f}>
                    {s.id === "automations" && (
                      <div className="mt-5">
                        <TextLink href={AUTOMATIONS_HREF}>See all automations</TextLink>
                      </div>
                    )}
                  </Anatomy>
                  <InlineWindow step={i} />
                </div>
              );
            })}
            {/* runway for the takeover, then the screen is handed back */}
            <div data-step={4} className="hidden h-[130vh] md:block" />
            <div data-step={5} className="hidden h-[40vh] md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
