"use client";

import { useRef } from "react";
import { ArrowUpRight, CalendarClock, Clock, FileText, Megaphone, MessagesSquare, Search, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP } from "@/lib/gsap";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { heroTiles, type TaskKind } from "@/lib/jobs";

/** Sparks drifting up off the plate: fixed positions so server and browser agree. */
const embers = Array.from({ length: 30 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    x: Math.round((r(1) - 0.5) * 1180),
    y: Math.round(r(2) * 120),
    s: 2 + Math.round(r(3) * 2),
    d: Math.round((5 + r(4) * 5) * 10) / 10,
    delay: -Math.round(r(5) * 100) / 10,
    c: ["#A6BBFF", "#C3B6FF", "#F2C6B0", "#8FDCCB"][i % 4],
  };
});

const kindIcon: Record<TaskKind, LucideIcon> = {
  marketing: Megaphone,
  sales: Users,
  team: MessagesSquare,
  meetings: CalendarClock,
  investors: FileText,
  research: Search,
};

/**
 * "Off your plate. On Juno’s." Text first; below it, the things on your plate fanned out as
 * tiles. As you scroll they fold into a single deck and disappear into Juno, and Juno has it.
 * The same fold as the homepage's "Your whole stack. One Juno.", told with your work.
 */

const N = heroTiles.length;
const mid = (N - 1) / 2;
// fanned positions, hand-set by formula so the arc is even (desktop, then phones)
const fanD = (i: number) => {
  const o = i - mid;
  return { x: o * 214, y: o * o * 5, rotate: o * 3.5 };
};
// phones: the middle four, loosely piled two by two so every one is readable
const pile = [
  { x: 0, y: 0, rotate: 0 },
  { x: -82, y: -70, rotate: -4 },
  { x: 84, y: -60, rotate: 3.5 },
  { x: -80, y: 76, rotate: 3 },
  { x: 86, y: 84, rotate: -4 },
  { x: 0, y: 0, rotate: 0 },
];
const fanM = (i: number) => pile[i];
// tiles shown on phones
const onPhone = (i: number) => i > 0 && i < N - 1;

/** A quiet tile for the kind of task: grey glyph on a light key, no brand colours. */
function TaskIcon({ kind }: { kind: TaskKind }) {
  const I = kindIcon[kind];
  return (
    <span className="grid size-7 place-items-center rounded-[8px] bg-[#F1F2F5] text-[#3a3f4f] ring-1 ring-black/[0.05]">
      <I size={15} strokeWidth={1.75} aria-hidden />
    </span>
  );
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
          scrollTrigger: {
            trigger: ".jh-stage",
            // fanned on arrival; the first scroll folds it, done while the hero is still in view
            start: () => {
              const stage = root.current!.querySelector<HTMLElement>(".jh-stage")!;
              const top = stage.getBoundingClientRect().top + window.scrollY;
              return Math.max(1, top - window.innerHeight * 0.8);
            },
            end: () => {
              const stage = root.current!.querySelector<HTMLElement>(".jh-stage")!;
              const top = stage.getBoundingClientRect().top + window.scrollY;
              return Math.max(1, top - window.innerHeight * 0.8) + Math.min(440, window.innerHeight * 0.5);
            },
            invalidateOnRefresh: true,
            scrub: 0.6,
          },
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
            { x: f.x, y: f.y, rotate: f.rotate, scale: 1, opacity: 1 },
            { x: 0, y: 0, rotate: (i - mid) * 1.5, ease: "power2.inOut", duration: 0.58 },
            0,
          );
          // then the deck goes into Juno
          tl.to(
            t,
            { scale: 0.35, y: -6, opacity: 0, ease: "power2.in", duration: 0.14 },
            0.5 + Math.abs(i - mid) * 0.01,
          );
        });
        tl.to(".jh-embers", { opacity: 0, ease: "power1.in", duration: 0.5 }, 0);
        tl.to(".jh-light", { opacity: 0.35, ease: "power1.in", duration: 0.6 }, 0);
        tl.fromTo(
          ".jh-glow",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, ease: "power2.out", duration: 0.3 },
          0.6,
        );
        // Juno catches it: a ring goes out as the last card lands
        tl.fromTo(
          ".jh-ring",
          { opacity: 0, scale: 0.6 },
          {
            keyframes: { opacity: [0, 0.9, 0], scale: [0.6, 1.2, 2.4] },
            ease: "power2.out",
            duration: 0.3,
          },
          0.66,
        );
        tl.fromTo(
          ".jh-juno",
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, ease: "back.out(1.8)", duration: 0.28 },
          0.64,
        );
        tl.fromTo(".jh-got", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.22 }, 0.8);
      };
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => fold(fanD));
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => fold(fanM));
      // reduced motion: the finished state, Juno on top of the deck
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils
          .toArray<HTMLElement>(".jh-tile", root.current)
          .forEach((t) => gsap.set(t, { opacity: 0 }));
        gsap.set(".jh-juno, .jh-got, .jh-glow", { opacity: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="jobs-title"
      className="relative overflow-x-clip pb-28 pt-[156px] md:pb-40 md:pt-[184px]"
    >
      {/* text first */}
      <div className="container-page flex flex-col items-center text-center">
        <h1 id="jobs-title" className="t-display-xl text-balance">
          Off your plate.{" "}
          <span className="block text-muted">
            On{" "}
            <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_55%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">
              Juno&apos;s.
            </span>
          </span>
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
        className="jh-stage relative mx-auto mt-24 h-[310px] max-w-[1180px] md:mt-32 md:h-[340px]"
        role="img"
        aria-label="Six recurring tasks fold together and disappear into Juno. Juno got it."
      >
        {/* light rising off the plate, and sparks drifting up from it */}
        <span
          aria-hidden
          className="jh-light pointer-events-none absolute left-1/2 top-[-220px] h-[640px] w-[min(1400px,150vw)] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(50% 45% at 50% 62%, rgba(50,76,255,0.26), rgba(143,124,255,0.1) 50%, transparent 78%), radial-gradient(30% 30% at 30% 70%, rgba(242,198,176,0.07), transparent 70%), radial-gradient(30% 30% at 72% 68%, rgba(143,220,203,0.06), transparent 70%)",
          }}
        />
        <div aria-hidden className="jh-embers pointer-events-none absolute left-1/2 top-[120px] h-0 w-0">
          {embers.map((e, i) => (
            <span
              key={i}
              className="jh-ember absolute rounded-full"
              style={
                {
                  left: e.x,
                  top: e.y,
                  width: e.s,
                  height: e.s,
                  background: e.c,
                  color: e.c,
                  animationDuration: `${e.d}s`,
                  animationDelay: `${e.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <div className="absolute left-1/2 top-[150px] md:top-[110px]">
          {heroTiles.map((t, i) => {
            const f = fanD(i);
            return (
              <div
                key={t.text}
                className={`jh-tile absolute -left-[78px] -top-[66px] flex h-[132px] w-[156px] flex-col justify-between rounded-[18px] bg-white p-3 text-left text-[#14161f] shadow-[0_24px_50px_-22px_rgba(0,0,0,0.85)] ring-1 ring-black/5 md:-left-[135px] md:-top-[84px] md:h-[168px] md:w-[270px] md:rounded-[20px] md:p-4 ${onPhone(i) ? "" : "max-md:hidden"}`}
                style={{
                  transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotate}deg)`,
                  zIndex: i < mid ? i : N - i,
                }}
              >
                <span className="flex items-center gap-2">
                  <TaskIcon kind={t.kind} />
                  <span className="text-[12px] font-medium text-[#6b7080]">{t.label}</span>
                </span>
                <span className="flex items-start gap-2">
                  <span className="mt-[2px] size-[15px] shrink-0 rounded-full ring-[1.5px] ring-[#c6cad4] md:size-4" />
                  <span className="text-[13px] font-medium leading-[17px] tracking-[-0.01em] md:text-[15px] md:leading-[20px]">
                    {t.text}
                  </span>
                </span>
                <span
                  className={`flex items-center gap-1.5 border-t border-black/[0.06] pt-2 text-[11.5px] md:pt-2.5 md:text-[12px] ${t.late ? "text-[#b4540a]" : "text-[#7a7f8c]"}`}
                >
                  <Clock size={12} strokeWidth={2} aria-hidden />
                  {t.note}
                </span>
              </div>
            );
          })}
          {/* the deck goes into Juno: just Juno, its light, and the line */}
          <span
            aria-hidden
            className="jh-glow pointer-events-none absolute -left-[210px] -top-[210px] size-[420px] rounded-full opacity-0"
            style={{
              background:
                "radial-gradient(closest-side, rgba(122,143,255,0.38), rgba(170,140,255,0.14) 45%, rgba(255,190,170,0.05) 70%, transparent)",
            }}
          />
          <span
            aria-hidden
            className="jh-ring pointer-events-none absolute -left-[60px] -top-[60px] size-[120px] rounded-full opacity-0 ring-2 ring-[#B4C2FF]/70"
          />
          <div className="jh-juno absolute -left-[56px] -top-[56px] z-20 opacity-0">
            <Mascot size={112} state="idle" halo={false} apiRef={mascot} />
          </div>
        </div>
        <p className="jh-got t-display-l absolute inset-x-0 top-[238px] text-center opacity-0 md:top-[220px]">
          <span className="bg-[linear-gradient(100deg,#A6BBFF_10%,#C7B5FF_55%,#FFC4B0_95%)] bg-clip-text text-transparent">
            Juno
          </span>{" "}
          got it.
        </p>
      </div>
    </section>
  );
}
