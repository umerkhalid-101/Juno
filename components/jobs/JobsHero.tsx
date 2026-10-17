"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { tools } from "@/lib/story";
import { lanes, plate, type Source } from "@/lib/jobs";

/**
 * "Off your plate. On Juno's." The hero performs the headline: twelve recurring tasks sit on your
 * plate; as you scroll, Juno takes them one at a time and files each onto its own schedule.
 */

/* ---------------------------------------------------------------- geometry (hand-set) */

// Desktop stage, designed at 1152 × 694 and scaled down to fit narrower or shorter screens.
const D = {
  w: 1152,
  h: 694,
  cardW: 280,
  cardH: 34,
  step: 30,
  colX: [0, 270],
  top: [276, 293],
  bodyTop: 64,
};
// Phone stage: one loose column of six, then the schedule beneath it.
const M = { cardH: 34, step: 26, top: 44 };

const phonePlate = plate.filter((t) => t.phone);
const SEG = 1; // timeline length of one hand-over
const END = plate.length * SEG; // when the plate is clear

/** Desktop rest position of a task on the plate, before its tilt. */
const restD = (n: number) => {
  const t = plate.find((p) => p.n === n)!;
  const inCol = plate.filter((p) => p.pile.col === t.pile.col);
  const i = inCol.indexOf(t);
  return { x: D.colX[t.pile.col] + t.pile.dx, y: D.top[t.pile.col] + i * D.step };
};
/** Phone rest position (x relative to the stage, which is full width). */
const restM = (n: number) => {
  const t = phonePlate.find((p) => p.n === n)!;
  const i = phonePlate.indexOf(t);
  return { x: t.pile.dx, y: M.top + i * M.step };
};

/* ---------------------------------------------------------------- pieces */

function SourceIcon({ src, size = 14 }: { src: Source; size?: number }) {
  if (src === "browser" || src === "cms")
    return <Globe size={size} strokeWidth={1.75} aria-hidden />;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={tools[src].path} />
    </svg>
  );
}

function TaskCard({ n, style }: { n: number; style?: React.CSSProperties }) {
  const t = plate.find((p) => p.n === n)!;
  return (
    <div
      data-card={n}
      className="absolute left-0 top-0 flex items-center gap-2.5 rounded-[10px] border border-white/[0.08] bg-[#151A22] px-3 text-[13px] text-text shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)] will-change-transform"
      style={{ height: D.cardH, ...style }}
    >
      <span className="text-muted">
        <SourceIcon src={t.tool} />
      </span>
      <span className="truncate">{t.text}</span>
      <span className="sr-only">
        (
        {t.tool === "browser"
          ? "Juno's browser"
          : tools[t.tool as Exclude<Source, "browser" | "cms">].name}
        )
      </span>
    </div>
  );
}

function Chip({ n }: { n: number }) {
  const t = plate.find((p) => p.n === n)!;
  return (
    <span
      data-chip={n}
      className="t-eyebrow inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-md border border-[#7A8FFF]/25 bg-[#324CFF]/10 px-2 !text-[10.5px] text-[#7A8FFF] opacity-0"
    >
      {t.chip}
    </span>
  );
}

/** Juno's plate: the week, one lane per rhythm, a dashed place waiting for each task. */
function Schedule({ tasks, phone = false }: { tasks: typeof plate; phone?: boolean }) {
  return (
    <div className="space-y-3">
      {lanes.map((l) => {
        const rows = tasks.filter((t) => t.lane === l.id).sort((a, b) => a.n - b.n);
        if (!rows.length) return null;
        return (
          <div key={l.id}>
            <p className="t-eyebrow mb-1.5 !text-[10.5px] text-muted">{l.label}</p>
            <ul className="space-y-1">
              {rows.map((t) => (
                <li
                  key={t.n}
                  className={phone ? "space-y-1.5" : "flex items-center justify-between gap-2"}
                >
                  <span
                    data-slot={t.n}
                    className="block rounded-[10px] border border-dashed border-white/[0.12]"
                    style={{ height: D.cardH, width: phone ? "100%" : D.cardW }}
                  />
                  <span className={phone ? "flex justify-end" : ""}>
                    <Chip n={t.n} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function PlateCount({ value }: { value: number }) {
  return (
    <span className="t-eyebrow inline-flex items-center gap-2 text-muted">
      Your plate <RollingNumber value={value} className="text-text" />
    </span>
  );
}

function JunoCount({ value }: { value: number }) {
  return (
    <span className="t-eyebrow inline-flex items-center gap-2 text-muted">
      Juno&apos;s plate · <RollingNumber value={value} className="text-text" /> on schedule
    </span>
  );
}

/* ---------------------------------------------------------------- the hero */

export function JobsHero() {
  const root = useRef<HTMLElement>(null);
  const mascotD = useRef<MascotApi>(null);
  const mascotM = useRef<MascotApi>(null);
  const [landed, setLanded] = useState(0);
  const [hint, setHint] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      /** Build the hand-over for one layout. Cards travel inside `stage`; slots are measured. */
      const build = (opts: {
        stage: HTMLElement;
        tasks: typeof plate;
        rest: (n: number) => { x: number; y: number };
        scale: () => number;
        phone: boolean;
      }) => {
        const { stage, tasks, rest, scale, phone } = opts;
        const mascot = phone ? mascotM : mascotD;
        const q = (sel: string) => stage.querySelector<HTMLElement>(sel)!;
        const seq = [...tasks].sort((a, b) => a.order - b.order);
        const tl = gsap.timeline({ paused: true });
        const s = scale();
        const box = stage.getBoundingClientRect();

        seq.forEach((t, k) => {
          const card = q(`[data-card="${t.n}"]`);
          const chip = q(`[data-chip="${t.n}"]`);
          const slot = q(`[data-slot="${t.n}"]`).getBoundingClientRect();
          const from = rest(t.n);
          const to = { x: (slot.left - box.left) / s, y: (slot.top - box.top) / s };
          const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - (phone ? 0 : 36) };
          const at = k * SEG;
          gsap.set(card, {
            x: from.x,
            y: from.y,
            rotation: t.pile.rot,
            zIndex: 10 + k,
            width: phone ? slot.width / s : D.cardW,
          });
          // lift: straighten, rise 4px, border brightens
          tl.to(
            card,
            {
              rotation: 0,
              y: from.y - 4,
              borderColor: "rgba(255,255,255,0.14)",
              duration: 0.16,
              ease: "power2.out",
            },
            at,
          );
          tl.set(card, { zIndex: 100 }, at);
          // travel along a gentle arc, no trail
          tl.to(
            card,
            {
              keyframes: phone
                ? [{ x: to.x, y: to.y + 2, ease: "power2.inOut" }]
                : [
                    { x: mid.x, y: mid.y, ease: "sine.out" },
                    { x: to.x, y: to.y + 2, ease: "sine.in" },
                  ],
              duration: 0.6,
            },
            at + 0.16,
          );
          // land: settle the 2px overshoot, stamp the schedule chip
          tl.to(
            card,
            { y: to.y, borderColor: "rgba(255,255,255,0.1)", duration: 0.1, ease: "power2.out" },
            at + 0.76,
          );
          tl.set(card, { zIndex: 20 }, at + 0.86);
          tl.fromTo(
            chip,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 0.12, ease: "power3.out" },
            at + 0.78,
          );
        });
        // the plate is clear
        tl.to(q(".jh-clear"), { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, END);
        tl.to(q(".jh-glow"), { opacity: 1, duration: 0.6, ease: "power2.out" }, END);
        tl.fromTo(
          q(".jh-progress"),
          { scaleX: 0 },
          { scaleX: 1, duration: END + 0.6, ease: "none" },
          0,
        );

        // counters and Juno's gaze follow the timeline
        let lastLanded = -1;
        let watching = -1;
        let cleared = false;
        tl.eventCallback("onUpdate", () => {
          const time = tl.time();
          const n = seq.filter((_, k) => time >= k * SEG + 0.8).length;
          if (n !== lastLanded) {
            lastLanded = n;
            setLanded(n);
          }
          const k = Math.floor(time / SEG);
          if (k < seq.length && time - k * SEG < 0.8 && k !== watching) {
            watching = k;
            mascot.current?.lookAt(q(`[data-card="${seq[k].n}"]`));
          }
          if (time >= END + 0.3 && !cleared) {
            cleared = true;
            watching = -1;
            mascot.current?.blink();
            window.setTimeout(() => mascot.current?.look(0, 0.2), 220);
          } else if (time < END && cleared) {
            cleared = false;
          }
        });
        return tl;
      };

      // desktop: pinned for 1.5 screens, scroll drives the hand-over
      mm.add("(min-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
        const wrap = el.querySelector<HTMLElement>(".jh-wrap")!;
        const canvas = el.querySelector<HTMLElement>(".jh-canvas")!;
        const fit = () => {
          const s = Math.min(1, wrap.clientWidth / D.w, (window.innerHeight - 120) / D.h);
          canvas.style.transform = `scale(${s})`;
          wrap.style.height = `${D.h * s}px`;
          return s;
        };
        let s = fit();
        mascotD.current?.look(-0.8, 0.1);
        const tl = build({
          stage: canvas,
          tasks: plate,
          rest: restD,
          scale: () => s,
          phone: false,
        });

        // the hint: if nobody has scrolled 1.5s in, task 9 makes the trip on its own
        let floor = 0;
        let scrolled = false;
        const st = ScrollTrigger.create({
          trigger: wrap,
          start: "top 96px",
          end: () => `+=${window.innerHeight * 1.5}`,
          pin: true,
          onUpdate: (self) => {
            gsap.to(tl, {
              time: (floor + (1 - floor) * self.progress) * tl.duration(),
              duration: 0.45,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });
        const onScroll = () => {
          if (window.scrollY > 4 && !scrolled) {
            scrolled = true;
            setHint(false);
          }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        const hintTimer = window.setTimeout(() => {
          if (scrolled || window.scrollY > 4) return;
          floor = SEG / tl.duration();
          gsap.to(tl, {
            time: SEG,
            duration: 1.6,
            ease: "power2.inOut",
            onComplete: () => !scrolled && setHint(true),
          });
        }, 1500);
        const onResize = () => {
          s = fit();
        };
        window.addEventListener("resize", onResize);
        return () => {
          window.clearTimeout(hintTimer);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onResize);
          st.kill();
          tl.kill();
        };
      });

      // phones and small tablets: no pin; six tasks drop into the schedule as the section passes
      mm.add("(max-width: 959px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = el.querySelector<HTMLElement>(".jh-phone")!;
        const tl = build({ stage, tasks: phonePlate, rest: restM, scale: () => 1, phone: true });
        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top 70%",
          end: "bottom 75%",
          onUpdate: (self) =>
            gsap.to(tl, {
              time: self.progress * tl.duration(),
              duration: 0.45,
              ease: "power3.out",
              overwrite: true,
            }),
        });
        return () => {
          st.kill();
          tl.kill();
        };
      });

      // reduced motion: the finished state, no travel
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const wide = window.matchMedia("(min-width: 960px)").matches;
        if (wide) {
          const wrap = el.querySelector<HTMLElement>(".jh-wrap")!;
          const canvas = el.querySelector<HTMLElement>(".jh-canvas")!;
          const s = Math.min(1, wrap.clientWidth / D.w, (window.innerHeight - 120) / D.h);
          canvas.style.transform = `scale(${s})`;
          wrap.style.height = `${D.h * s}px`;
          build({
            stage: canvas,
            tasks: plate,
            rest: restD,
            scale: () => s,
            phone: false,
          }).progress(1);
        } else {
          build({
            stage: el.querySelector<HTMLElement>(".jh-phone")!,
            tasks: phonePlate,
            rest: restM,
            scale: () => 1,
            phone: true,
          }).progress(1);
        }
      });
    },
    { scope: root },
  );

  const total = plate.length;

  return (
    <section
      ref={root}
      aria-labelledby="jobs-title"
      className="relative pb-24 pt-[136px] md:pb-32 md:pt-[168px]"
    >
      {/* top block: visible on load, so the call to action never waits for the animation */}
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

      <p className="sr-only" aria-live="polite">
        {total - landed} tasks on your plate, {landed} on Juno&apos;s schedule.
      </p>

      {/* desktop: the stage, designed at a fixed size and scaled to fit */}
      <div className="container-page mt-16 hidden min-[960px]:block md:mt-20">
        <div className="jh-wrap relative w-full" style={{ height: D.h }}>
          <div
            className="jh-canvas absolute left-1/2 top-0 origin-top"
            style={{ width: D.w, height: D.h, marginLeft: -D.w / 2 }}
          >
            {/* labels, counters, and one thin progress line under them */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between">
              <PlateCount value={total - landed} />
              <JunoCount value={landed} />
            </div>
            <div className="absolute inset-x-0 top-[34px] h-px overflow-hidden bg-white/[0.08]">
              <span className="jh-progress block h-full origin-left scale-x-0 bg-[#7A8FFF]" />
            </div>

            {/* the empty plate, once Juno has it all */}
            <p className="jh-clear absolute left-0 top-[364px] w-[568px] translate-y-2 text-center text-[17px] text-muted opacity-0">
              Nothing left to chase.
            </p>

            {/* Juno, small, in the gap between the two plates */}
            <div className="absolute left-[584px] top-[330px] grid w-[64px] place-items-center">
              <Mascot size={64} state="idle" halo={false} apiRef={mascotD} />
            </div>

            {/* Juno's plate */}
            <div className="absolute right-0 top-[64px] w-[500px]">
              <div
                aria-hidden
                className="jh-glow pointer-events-none absolute -inset-10 -z-10 rounded-[48px] opacity-0 blur-[70px]"
                style={{ background: "var(--glow)" }}
              />
              <div className="rounded-[20px] border border-white/[0.08] bg-[#0E1218] p-[18px]">
                <Schedule tasks={plate} />
              </div>
            </div>

            {/* the twelve tasks, starting on your plate */}
            {plate.map((t) => {
              const r = restD(t.n);
              return (
                <TaskCard
                  key={t.n}
                  n={t.n}
                  style={{
                    width: D.cardW,
                    transform: `translate(${r.x}px, ${r.y}px) rotate(${t.pile.rot}deg)`,
                    zIndex: 10 + t.order,
                  }}
                />
              );
            })}
          </div>
        </div>
        <p
          className={`t-eyebrow mt-6 text-center text-muted transition-opacity duration-300 ${hint ? "opacity-100" : "opacity-0"}`}
          aria-hidden
        >
          Scroll to hand it over ↓
        </p>
      </div>

      {/* phones: six tasks in one loose column, then Juno's plate beneath */}
      <div className="container-page mt-14 min-[960px]:hidden">
        <div className="jh-phone relative">
          <PlateCount value={phonePlate.length - Math.min(landed, phonePlate.length)} />
          <div
            className="relative"
            style={{ height: M.top + phonePlate.length * M.step + M.cardH }}
          >
            <p className="jh-clear absolute inset-x-0 top-[96px] translate-y-2 text-center text-[16px] text-muted opacity-0">
              Nothing left to chase.
            </p>
          </div>
          <div className="my-6 grid place-items-center">
            <Mascot size={56} state="idle" halo={false} apiRef={mascotM} />
          </div>
          <div className="mb-3">
            <JunoCount value={Math.min(landed, phonePlate.length)} />
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="jh-glow pointer-events-none absolute -inset-6 -z-10 rounded-[40px] opacity-0 blur-[60px]"
              style={{ background: "var(--glow)" }}
            />
            <div className="rounded-[20px] border border-white/[0.08] bg-[#0E1218] p-4">
              <Schedule tasks={phonePlate} phone />
            </div>
          </div>
          <span aria-hidden className="jh-progress hidden" />
          {phonePlate.map((t) => {
            const r = restM(t.n);
            return (
              <TaskCard
                key={t.n}
                n={t.n}
                style={{
                  width: "calc(100% - 16px)",
                  transform: `translate(${r.x}px, ${r.y}px) rotate(${t.pile.rot}deg)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
