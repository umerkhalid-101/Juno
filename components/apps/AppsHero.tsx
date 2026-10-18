"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MascotMark } from "@/components/mascot/Mascot";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { apps } from "@/lib/apps";
import { Window, calm } from "./kit";
import { CustomerPortal, FeedbackBoard, RoiCalculator } from "./minis";

const h = apps.hero;

/** One sentence in, one app out. [new] prompts; the apps are the same ones further down the page. */
const IDEAS: { label: string; ask: string; url: string; chrome: string; App: ComponentType }[] = [
  { label: "Client portal", ask: "Give our clients one place to see progress and approve work.", url: "portal.yourcompany.com", chrome: "#E4E7DA", App: CustomerPortal },
  { label: "Ideas board", ask: "Let customers vote on what we build next.", url: "ideas.yourcompany.com", chrome: "#E2DFF2", App: FeedbackBoard },
  { label: "Time calculator", ask: "Show prospects how much time their team would get back.", url: "roi.yourcompany.com", chrome: "#E3E6DC", App: RoiCalculator },
];
const DWELL = 11000;

/**
 * The hero: a Juno command bar and one large window. A sentence types in, and the app it
 * describes resolves underneath, ready to use. Left alone, it moves on to the next idea.
 */
export function AppsHero() {
  const reduce = !!useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { amount: 0.35 });
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(false);
  const [touched, setTouched] = useState(false);
  const [started, setStarted] = useState(false);
  const idea = IDEAS[i];
  const text = reduce ? idea.ask : idea.ask.slice(0, typed);
  const open = reduce || shown;

  // type the sentence, then the app resolves
  useEffect(() => {
    if (reduce || !started) return;
    const ts: number[] = [];
    const len = IDEAS[i].ask.length;
    for (let c = 1; c <= len; c++) ts.push(window.setTimeout(() => setTyped(c), 250 + c * 24));
    ts.push(window.setTimeout(() => setShown(true), 250 + len * 24 + 450));
    return () => ts.forEach(window.clearTimeout);
  }, [i, started, reduce]);

  // start once the stage is in view
  useEffect(() => {
    if (!seen || started) return;
    const t = window.setTimeout(() => setStarted(true), 0);
    return () => window.clearTimeout(t);
  }, [seen, started]);

  function go(n: number) {
    setShown(false);
    setTyped(0);
    window.setTimeout(() => setI(n), reduce ? 0 : 350);
  }

  // left alone (and in view), move on to the next idea
  useEffect(() => {
    if (reduce || touched || !seen || !shown) return;
    const t = window.setTimeout(() => {
      setShown(false);
      setTyped(0);
      window.setTimeout(() => setI((i + 1) % IDEAS.length), 350);
    }, DWELL);
    return () => window.clearTimeout(t);
  }, [reduce, touched, seen, shown, i]);

  return (
    <section aria-labelledby="apps-title" className="relative overflow-x-clip pt-[140px] md:pt-[168px]">
      <div className="container-page">
        <header className="mx-auto max-w-[900px] text-center">
          <h1 id="apps-title" className="t-display-xl text-balance">
            {h.lead} <span className="accent-text block">{h.muted}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[44ch] text-pretty text-[18px] leading-[28px] text-muted">{h.sub}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href={CTA_HREF} variant="white" size="lg">
              {CTA_LABEL}
            </Button>
            <Button href="#website-blog-cms" variant="secondary" size="lg" trailing={<ArrowDown size={16} aria-hidden />}>
              {h.secondary}
            </Button>
          </div>
        </header>

        <div ref={stage} className="relative mx-auto mt-20 max-w-[1080px] md:mt-28">
          {/* glow 1 of 2: a soft pool of light under the window */}
          <div aria-hidden className="pointer-events-none absolute inset-x-[6%] bottom-[-6%] top-[18%] -z-10 opacity-45 blur-[110px]" style={{ background: "var(--glow)" }} />

          {/* the command bar */}
          <div className="relative z-20 mx-auto max-w-[680px]">
            <div className="flex h-[64px] items-center gap-3 rounded-[20px] border border-white/[0.12] bg-[#12161E] pl-4 pr-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
              <MascotMark size={26} className="shrink-0" />
              <p className="min-w-0 flex-1 truncate text-[15px] text-text md:text-[16px]">
                <span aria-hidden>
                  {text || <span className="text-subtle">Describe the app you need</span>}
                  {!reduce && !open && typed > 0 && <span className="caret ml-px inline-block h-[1.05em] w-px translate-y-[3px] bg-text" />}
                </span>
                <span className="sr-only">{idea.ask}</span>
              </p>
              <span
                aria-hidden
                className={`flex h-9 items-center gap-1.5 rounded-[11px] px-3 text-[12.5px] transition-colors duration-200 ${
                  open ? "bg-white/[0.06] text-muted" : typed >= idea.ask.length ? "bg-[#A6BBFF] text-[#07111F]" : "bg-white/[0.06] text-subtle"
                }`}
              >
                <CornerDownLeft size={13} />
                Build
              </span>
            </div>
          </div>

          {/* the app it becomes */}
          <div className="relative mt-6 h-[560px] [perspective:1800px] md:mt-8 md:h-[600px]">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key={idea.label}
                  className="absolute inset-0 origin-top"
                  initial={reduce ? false : { opacity: 0, rotateX: 10, y: 24, scale: 0.97, filter: "blur(14px)" }}
                  animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(10px)", transition: { duration: 0.3 } }}
                  transition={{ duration: 1, ease: calm }}
                  onPointerDown={() => setTouched(true)}
                >
                  <Window url={idea.url} chrome={idea.chrome} className="h-full">
                    <idea.App />
                  </Window>
                </motion.div>
              ) : (
                <motion.div key="empty" className="absolute inset-0 rounded-[18px] border border-dashed border-white/[0.08]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} aria-hidden />
              )}
            </AnimatePresence>
          </div>

          {/* jump between ideas */}
          <div role="tablist" aria-label="Ideas" className="mt-6 flex justify-center gap-1">
            {IDEAS.map((x, n) => {
              const on = n === i;
              return (
                <button
                  key={x.label}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setTouched(true);
                    if (!on) go(n);
                  }}
                  className={`relative h-10 px-3.5 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] ${on ? "text-text" : "text-muted hover:text-text"}`}
                >
                  {x.label}
                  {on && <motion.span layoutId="hero-idea" className="absolute inset-x-0 bottom-1 mx-auto h-[2px] w-5 rounded-full bg-[#A6BBFF]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
