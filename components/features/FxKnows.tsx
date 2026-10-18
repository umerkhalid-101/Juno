"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { chapters, feature, type FeatureId } from "@/lib/features";
import { Anatomy, Stage } from "./kit";
import {
  BrandVisual,
  LearningsVisual,
  RecorderVisual,
  SkillsVisual,
  WikiVisual,
} from "./knowsVisuals";

/**
 * Chapter 1: one customer call travels through five features. On desktop the section pins and
 * the panels move sideways along a single line; each plays its moment as it reaches the middle.
 * On phones it is a vertical timeline, each step playing as it scrolls in.
 */

// one family of soft hues, a step apart, so the five read as one system
const hues = ["#A6BBFF", "#B4AFFF", "#E8C9A0", "#8FDCCB", "#9CCBFF"];

// how long the last card holds, as a share of the sideways travel
const HOLD = 0.05;

const steps: { id: FeatureId; Visual: ComponentType<{ on: boolean }> }[] = [
  { id: "meeting-recorder", Visual: RecorderVisual },
  { id: "company-wiki", Visual: WikiVisual },
  { id: "brand-context", Visual: BrandVisual },
  { id: "skills", Visual: SkillsVisual },
  { id: "learnings", Visual: LearningsVisual },
];

function Panel({ i, active }: { i: number; active: number }) {
  const { id, Visual } = steps[i];
  const f = feature(id);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.7 });
  const wide = f.tier === 1;
  return (
    <article
      id={id}
      ref={ref}
      data-panel={i}
      className={`relative shrink-0 scroll-mt-28 transition-opacity duration-700 ${
        wide ? "md:w-[72vw] md:max-w-[1080px]" : "md:w-[64vw] md:max-w-[960px]"
      } ${active === i ? "md:opacity-100" : "md:opacity-30"}`}
    >
      {/* the step: its name, then its point on the line */}
      <div aria-hidden className="relative mb-10 hidden h-[41px] md:block">
        <span
          className={`block text-[13px] font-medium transition-colors duration-500 ${
            active === i ? "text-text" : active > i ? "text-[#A6BBFF]/80" : "text-subtle"
          }`}
        >
          {chapters.knows.steps[i]}
        </span>
        <span
          className="absolute left-0 top-[28px] block size-[13px] -translate-x-1/2 rounded-full transition-[background-color,box-shadow] duration-500"
          style={{
            background: active >= i ? "#A6BBFF" : "#151a22",
            boxShadow:
              active === i
                ? "0 0 0 5px rgba(166,187,255,0.18)"
                : active > i
                  ? "none"
                  : "inset 0 0 0 1px rgba(255,255,255,0.22)",
          }}
        />
      </div>
      <p className="mb-4 text-[13px] text-muted md:hidden">
        {i + 1} / {steps.length} · {chapters.knows.steps[i]}
      </p>
      <div className="md:grid md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:items-center md:gap-12">
        <Anatomy f={f} />
        <Stage color={hues[i]} from={i % 2 ? "10% 0%" : "90% 0%"} className="mt-8 md:mt-0">
          <Visual on={Boolean(seen || reduce)} />
        </Stage>
      </div>
    </article>
  );
}

export function FxKnows() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [ended, setEnded] = useState(false);

  // Desktop: the whole section holds still, heading and all, while the cards slide sideways
  // with the scroll, smoothed a little so it glides both ways. The amber line follows the
  // middle of the screen; each card comes into focus as it reaches it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const pin = root.current!.querySelector<HTMLElement>(".kn-pin")!;
        const track = root.current!.querySelector<HTMLElement>(".kn-track")!;
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
        const base = root.current!.querySelector<HTMLElement>(".kn-base")!;
        const fill = root.current!.querySelector<HTMLElement>(".kn-fill")!;
        const last = panels.length - 1;
        const centre = (i: number) =>
          -(panels[i].offsetLeft + panels[i].offsetWidth / 2 - window.innerWidth / 2);
        const span = () => centre(0) - centre(last);
        // the line runs from the first card's dot to the last one's
        const lay = () => {
          const x0 = panels[0].offsetLeft;
          gsap.set([base, fill], { left: x0, width: panels[last].offsetLeft - x0 });
        };
        const setFill = gsap.quickSetter(fill, "scaleX");
        let current = -1;
        const sync = () => {
          const x = gsap.getProperty(track, "x") as number;
          const mid = window.innerWidth / 2 - x; // the screen's middle, in track terms
          let best = 0;
          let bestD = Infinity;
          panels.forEach((p, i) => {
            const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - mid);
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          });
          if (best !== current) {
            current = best;
            setActive(best);
          }
          // the amber travels with the cards and meets the last dot as the last card settles
          setFill(Math.min(1, Math.max(0, (centre(0) - x) / span())));
          setEnded((x - centre(last)) / span() < 0.03);
        };
        lay();
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            // roughly one to one with the scroll, so it never races ahead of your hand
            // plus a held beat at the end, so the last card is read before the page moves on
            end: () => `+=${span() * 0.85 * (1 + HOLD)}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onRefresh: () => {
              lay();
              sync();
            },
          },
        });
        tl.fromTo(
          track,
          { x: () => centre(0) },
          { x: () => centre(last), ease: "none", duration: 1, onUpdate: sync },
        );
        // nothing moves here: the last card simply stays on screen a while
        tl.to({}, { duration: HOLD });
        sync();
        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });
    },
    { scope: root },
  );

  // the launcher's links land on the right panel, not the start of the pin
  useEffect(() => {
    const go = (e: Event) => {
      const id = (e as CustomEvent<FeatureId>).detail;
      const i = steps.findIndex((s) => s.id === id);
      if (i === -1 || !window.matchMedia(MQ.desktop).matches) return;
      const st = ScrollTrigger.getAll().find(
        (t) => t.pin === root.current?.querySelector(".kn-pin"),
      );
      if (!st) return;
      e.preventDefault();
      // land with that card in the middle
      const panels = root.current!.querySelectorAll<HTMLElement>("[data-panel]");
      const c = (j: number) => panels[j].offsetLeft + panels[j].offsetWidth / 2;
      const k = (c(i) - c(0)) / (c(panels.length - 1) - c(0));
      window.scrollTo({ top: st.start + k * (st.end - st.start), behavior: "smooth" });
    };
    window.addEventListener("fx:goto", go);
    return () => window.removeEventListener("fx:goto", go);
  }, []);

  return (
    <section
      ref={root}
      id="knows"
      aria-labelledby="knows-title"
      className="relative scroll-mt-24 py-24 md:py-0"
    >
      <div className="kn-pin relative md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden md:pb-0 md:pt-[80px]">
        <div className="container-page">
          <header className="mx-auto max-w-[820px] text-center">
            <h2 id="knows-title" className="t-display-l text-balance">
              {chapters.knows.title}{" "}
              <span className="accent-text block">{chapters.knows.muted}</span>
            </h2>
            {/* the sub line, and the point it lands on once the call has run its course */}
            <div className="relative mx-auto mt-5 max-w-[46ch] text-[17px] leading-[27px]">
              <p
                className={`text-pretty text-muted transition-opacity duration-500 ${ended ? "md:opacity-0" : ""}`}
              >
                {chapters.knows.sub}
              </p>
              <p
                aria-hidden={!ended}
                className={`absolute inset-x-0 top-0 hidden text-text transition-opacity duration-500 md:block ${
                  ended ? "opacity-100" : "opacity-0"
                }`}
              >
                {chapters.knows.end}
              </p>
            </div>
          </header>
        </div>

        <div className="kn-track container-page relative mt-14 flex flex-col gap-16 md:mt-[clamp(20px,4vh,44px)] md:w-max md:max-w-none md:flex-row md:items-start md:gap-[7vw] md:px-0 md:will-change-transform">
          {/* the line through every card's start: amber as far as you've come */}
          <span
            aria-hidden
            className="kn-base absolute top-[34px] hidden h-px bg-white/10 md:block"
          />
          <span
            aria-hidden
            className="kn-fill absolute top-[34px] hidden h-px origin-left bg-[#A6BBFF] md:block"
            style={{ transform: "scaleX(0)" }}
          />
          {steps.map((s, i) => (
            <Panel key={s.id} i={i} active={active} />
          ))}
          <p className="t-h2 text-muted md:hidden">{chapters.knows.end}</p>
        </div>
      </div>
    </section>
  );
}
