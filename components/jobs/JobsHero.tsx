"use client";

import { useRef } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP } from "@/lib/gsap";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { heroTiles as allTiles, type Source } from "@/lib/jobs";

// eight on the plate keeps every task readable in the fan
const heroTiles = allTiles.slice(0, 8);

/**
 * "Off your plate. On Juno's." Text first; below it, the things on your plate fanned out as
 * tiles. As you scroll they fold into a single deck, Juno lands on top, and Juno has it.
 * The same fold as the homepage's "Your whole stack. One Juno.", told with your work.
 */

const N = heroTiles.length;
const mid = (N - 1) / 2;
// fanned positions, hand-set by formula so the arc is even (desktop, then phones)
const fanD = (i: number) => {
  const o = i - mid;
  return { x: o * 156, y: o * o * 5, rotate: o * 4 };
};
const fanM = (i: number) => {
  const o = i - mid;
  return { x: o * 40, y: o * o * 3, rotate: o * 4.5 };
};

function TileIcon({ src }: { src: Source }) {
  if (src === "browser" || src === "cms")
    return (
      <span className="grid size-[34px] place-items-center rounded-[10px] bg-[#EEF0F5] text-[#3a3f4f]">
        <Globe size={18} strokeWidth={1.75} aria-hidden />
      </span>
    );
  return <BrandIcon id={src} size={34} className="!shadow-none ring-1 ring-black/[0.06]" />;
}

export function JobsHero() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);

  // the fold: scrubbed by scroll, no pinning (same as the homepage's stack)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const fold = (fan: typeof fanD) => {
        const tiles = gsap.utils.toArray<HTMLElement>(".jh-tile", root.current);
        let cheered = false;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".jh-stage", start: "top 72%", end: "center 38%", scrub: 0.6 },
          onUpdate() {
            if (this.progress() > 0.85 && !cheered) {
              cheered = true;
              mascot.current?.cheer();
            } else if (this.progress() < 0.6) cheered = false;
          },
        });
        tiles.forEach((t, i) => {
          const f = fan(i);
          tl.fromTo(
            t,
            { x: f.x, y: f.y, rotate: f.rotate },
            { x: 0, y: 0, rotate: (i - mid) * 1.2, ease: "power2.inOut", duration: 1 },
            0,
          );
        });
        tl.fromTo(
          ".jh-juno",
          { opacity: 0, scale: 0.7, y: 30 },
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.6)", duration: 0.35 },
          0.72,
        );
        tl.fromTo(".jh-got", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, 0.82);
      };
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => fold(fanD));
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => fold(fanM));
      // reduced motion: the finished state, Juno on top of the deck
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils
          .toArray<HTMLElement>(".jh-tile", root.current)
          .forEach((t, i) => gsap.set(t, { x: 0, y: 0, rotate: (i - mid) * 1.2 }));
        gsap.set(".jh-juno, .jh-got", { opacity: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="jobs-title"
      className="relative overflow-x-clip pb-24 pt-[136px] md:pb-32 md:pt-[168px]"
    >
      {/* text first */}
      <div className="container-page flex flex-col items-center text-center">
        <p className="t-eyebrow text-muted">Jobs by Juno</p>
        <h1 id="jobs-title" className="t-display-xl mt-5 text-balance">
          Off your plate. <span className="block text-muted">On Juno&apos;s.</span>
        </h1>
        <p className="t-body-l mt-6 max-w-[44ch] text-pretty text-muted">
          More customers. Fewer loose ends. A company that keeps moving, without you chasing every
          detail.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            href="#jobs-catalog"
            onClick={(e) => {
              const target = document.getElementById("jobs-catalog");
              if (!target) return;
              e.preventDefault();
              target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "auto"
                  : "smooth",
              });
            }}
          >
            Imagine handing this over
          </Button>
          <Button
            size="lg"
            variant="white"
            href={CTA_HREF}
            trailing={<ArrowUpRight size={17} strokeWidth={2} aria-hidden />}
          >
            {CTA_LABEL}
          </Button>
        </div>
      </div>

      {/* your plate, fanned out; scroll and it folds into Juno's hands */}
      <div
        className="jh-stage relative mx-auto mt-20 h-[330px] max-w-[1180px] md:mt-24 md:h-[360px]"
        role="img"
        aria-label="Eight recurring tasks fold into one deck, and Juno takes them."
      >
        <div className="absolute left-1/2 top-[96px] md:top-[110px]">
          {heroTiles.map((t, i) => {
            const f = fanD(i);
            return (
              <div
                key={t.text}
                className="jh-tile absolute -left-[60px] -top-[74px] flex h-[148px] w-[120px] flex-col justify-between rounded-[20px] bg-white p-3.5 text-left text-[#14161f] shadow-[0_24px_50px_-22px_rgba(0,0,0,0.85)] ring-1 ring-black/5 md:-left-[72px] md:-top-[86px] md:h-[172px] md:w-[144px] md:p-4"
                style={{
                  transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotate}deg)`,
                  zIndex: i < mid ? i : N - i,
                }}
              >
                <TileIcon src={t.tool} />
                <span>
                  <span className="block text-[13px] font-medium leading-[17px] tracking-[-0.01em] md:text-[14px] md:leading-[18px]">
                    {t.text}
                  </span>
                  <span
                    className={`mt-1.5 block text-[11.5px] md:text-[12px] ${t.late ? "text-[#a35f00]" : "text-[#7a7f8c]"}`}
                  >
                    {t.note}
                  </span>
                </span>
              </div>
            );
          })}
          {/* Juno lands on top */}
          <div className="jh-juno absolute -left-[70px] -top-[86px] z-20 flex h-[172px] w-[140px] flex-col items-center justify-center gap-3 rounded-[24px] bg-[linear-gradient(160deg,#1b2140,#0e1120)] opacity-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-[#A6BBFF]/30 md:-left-[80px] md:-top-[98px] md:h-[196px] md:w-[160px]">
            <Mascot size={78} state="idle" halo={false} apiRef={mascot} />
            <span className="text-[14px] font-medium text-white">Juno</span>
          </div>
        </div>
        <p className="jh-got t-h2 absolute inset-x-0 bottom-0 text-center opacity-0">
          Juno got it.
        </p>
      </div>
    </section>
  );
}
