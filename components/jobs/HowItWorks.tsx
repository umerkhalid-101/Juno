"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { DotField } from "./DotField";
import { Face } from "./scenes";
import { ToolLogo } from "@/components/ui/ToolLogo";

/**
 * "Hand over the outcome. Leave the follow-through." One job, built across three steps.
 * The visual stays put while the steps scroll past it, so nothing is hijacked.
 */

const steps = [
  {
    title: "Tell Juno what good looks like.",
    body: "The result you want, the context that matters and how you like things done.",
  },
  {
    title: "Give it a rhythm.",
    body: "Make it part of the working week. You shouldn't have to remember to ask again.",
  },
  {
    title: "Come back to the next move.",
    body: "The work prepared. The loose ends connected. A clear action to take.",
  },
];

const ASK = "Keep customers in the loop. Make it personal.";
const WEEK = ["M", "T", "W", "T", "F"];
const updates: { to: string; who: "maya" | "leo" | "priya"; what: string }[] = [
  { to: "Maya Chen", who: "maya", what: "Share links are live" },
  { to: "Leo Park", who: "leo", what: "Bulk export is here" },
  { to: "Priya Shah", who: "priya", what: "Team plans shipped" },
];

/** The job, as far as it has been built: `step` 0, 1 or 2. */
const chips = [
  { text: "Draft", cls: "border-white/10 bg-white/[0.04] text-muted" },
  { text: "Every Fri · 9:00 AM", cls: "border-[#7A8FFF]/30 bg-[#324CFF]/12 text-[#A6BBFF]" },
  { text: "Active", cls: "border-[#3DD68C]/30 bg-[#3DD68C]/10 text-[#3DD68C]" },
];

function Dots() {
  return (
    <span className="flex h-6 items-center gap-1" aria-label="Juno is working">
      {[0, 1, 2].map((d) => (
        <span
          key={d}
          className="think-dot size-1.5 rounded-full bg-white/60"
          style={{ animationDelay: `${d * 0.15}s` }}
        />
      ))}
    </span>
  );
}

/** The job, as far as it has been built: `step` 0, 1 or 2. Juno is in the conversation, doing it. */
function Build({ step }: { step: number }) {
  const juno = useRef<MascotApi>(null);
  const you = useRef<HTMLParagraphElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { amount: 0.3 });
  const [working, setWorking] = useState(false);

  // Juno reacts to each step: reads your message, nods to the rhythm, works, then cheers
  useEffect(() => {
    const j = juno.current;
    let t = 0;
    let w = 0;
    if (step === 0) {
      j?.setState("idle");
      j?.lookAt(you.current);
    } else if (step === 1) {
      j?.look(0.2, 0.2);
      j?.nod();
    } else {
      w = window.setTimeout(() => setWorking(true), 0);
      j?.setState("thinking");
      t = window.setTimeout(() => {
        setWorking(false);
        j?.setState("idle");
        j?.cheer();
      }, 1200);
    }
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(w);
    };
  }, [step]);

  const chip = chips[step];

  return (
    <div
      ref={stage}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B0E14]"
    >
      {/* the stage's world, in Juno's own colours */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, rgba(166,187,255,0.04) 72%, rgba(182,166,240,0.08) 100%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] opacity-40">
        <DotField mode="rise" rgb="166,187,255" rgb2="182,166,240" play={seen} />
      </div>

      {/* the job itself: its name and where it stands */}
      <div className="relative flex items-center gap-3 border-b border-white/[0.06] bg-[#0E1218]/80 px-5 py-3.5 backdrop-blur md:px-7">
        <ToolLogo id="gmail" size={16} />
        <span className="text-[14.5px] font-medium text-text">Customer follow-through</span>
        <span className="relative ml-auto h-7 min-w-[148px]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={step}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className={`t-eyebrow absolute right-0 top-0 inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 !text-[10.5px] ${chip.cls}`}
            >
              {step === 2 && <span className="size-1.5 rounded-full bg-current" />}
              {chip.text}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>

      <div className="relative p-5 md:p-7">
        {/* you */}
        <div className="flex justify-end">
          <p
            ref={you}
            className="max-w-[86%] rounded-[20px] rounded-br-md bg-[#F4F6F8] px-4 py-2.5 text-[15px] leading-[22px] text-[#07090D]"
          >
            {ASK}
          </p>
        </div>

        {/* Juno, in the conversation, doing the work. Every part is always here, so the
            window never changes height; each step only crossfades what is shown in its place. */}
        <div className="mt-5 flex items-start gap-3">
          <span className="shrink-0">
            <Mascot size={36} state="idle" halo={false} apiRef={juno} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-subtle">Juno</p>

            {/* the reply: listening, then the rhythm */}
            <div className="mt-0.5 grid h-6 items-center">
              <span
                className={`[grid-area:1/1] transition-opacity duration-300 ${step === 0 ? "opacity-100" : "opacity-0"}`}
              >
                <Dots />
              </span>
              <p
                className={`[grid-area:1/1] text-[15px] text-text transition-opacity duration-300 ${step >= 1 ? "opacity-100" : "opacity-0"}`}
              >
                Every Friday, then. I&apos;ll make each one personal.
              </p>
            </div>
            <div className="mt-2.5 flex gap-1" aria-hidden>
              {WEEK.map((d, k) => {
                const on = step >= 1 && k === 4;
                return (
                  <span
                    key={k}
                    className={`grid size-9 place-items-center rounded-lg font-mono text-[12px] font-medium transition-[background-color,color,box-shadow] duration-300 ${
                      on
                        ? "bg-[#A6BBFF] text-[#07111F] shadow-[0_0_0_4px_rgba(166,187,255,0.18)]"
                        : step >= 1
                          ? "bg-[#1A1F2A] text-[#9AA6B8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                          : "text-white/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                    }`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>

            {/* the results: the same footprint before, during and after */}
            <div className="mt-5 grid">
              {/* waiting, or working */}
              <div
                className={`[grid-area:1/1] transition-opacity duration-500 ${step < 2 || working ? "opacity-100" : "pointer-events-none opacity-0"}`}
                aria-hidden
              >
                <div className="flex h-6 items-center text-[13px] text-subtle">
                  {working ? <Dots /> : "Friday's updates land here"}
                </div>
                <div className="mt-3 space-y-2 rounded-[18px] border border-dashed border-white/[0.12] p-3.5">
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      className="flex h-[54px] items-center gap-3 rounded-xl bg-white/[0.03] px-3"
                    >
                      <span className="size-[30px] rounded-full bg-white/[0.06]" />
                      <span className="flex-1 space-y-1.5">
                        <span className="block h-2 w-24 rounded bg-white/[0.08]" />
                        <span className="block h-1.5 w-36 rounded bg-white/[0.05]" />
                      </span>
                      <span className="h-6 w-24 rounded-md bg-white/[0.05]" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-[118px] rounded-2xl border border-dashed border-white/[0.08]" />
              </div>

              {/* ready */}
              <div
                className={`[grid-area:1/1] transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${step === 2 && !working ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
              >
                <p className="flex h-6 items-center text-[15px] text-text">
                  Friday&apos;s updates are ready.
                </p>
                <div className="mt-3 rounded-[18px] bg-[#FBFAF7] p-3.5 text-[#14161f]">
                  <ul className="space-y-2">
                    {updates.map((u) => (
                      <li
                        key={u.to}
                        className="flex h-[54px] items-center gap-3 rounded-xl bg-white px-3 ring-1 ring-black/[0.06]"
                      >
                        <Face who={u.who} size={30} />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block text-[13.5px] font-medium">{u.to}</span>
                          <span className="block text-[12px] text-[#6b7080]">{u.what}</span>
                        </span>
                        <span className="inline-flex h-6 items-center rounded-md bg-[#E9F7EF] px-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#1f7a4d]">
                          Ready to send
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3 rounded-2xl bg-[#151A22] p-3.5 ring-1 ring-white/10">
                  <p className="t-eyebrow inline-flex items-center gap-1.5 !text-[10.5px] text-[#FFB547]">
                    <span className="size-1.5 rounded-full bg-[#FFB547]" />
                    Needs your yes
                  </p>
                  <p className="mt-1.5 text-[14px] text-text">
                    Send these updates and let the account owners know?
                  </p>
                  <span className="mt-3 flex gap-2" aria-hidden>
                    <span className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-[#F4F6F8] text-[13px] font-semibold text-[#07090D]">
                      Approve
                    </span>
                    <span className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] text-muted ring-1 ring-white/10">
                      Edit
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setStep(Number((e.target as HTMLElement).dataset.step)),
        ),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const shown = reduce ? 2 : step;

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="chapter scroll-mt-20">
      <div className="container-page">
        <header className="mx-auto max-w-[820px] text-center">
          <h2 id="how-title" className="t-display-l text-balance">
            Hand over the outcome.{" "}
            <span className="block text-muted">Leave the follow-through.</span>
          </h2>
        </header>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* the steps, with a rail that fills as you go */}
          {/* the steps as statements: the one you are on is lit, the rest wait quietly */}
          <ol className="lg:col-span-5">
            {steps.map((s, k) => (
              <li
                key={s.title}
                ref={(el) => {
                  refs.current[k] = el;
                }}
                data-step={k}
                aria-current={k === shown ? "step" : undefined}
                className="py-8 lg:flex lg:min-h-[64vh] lg:items-center lg:py-0"
              >
                <div className="max-w-[18ch] lg:max-w-none">
                  <h3
                    className={`text-[30px] font-medium leading-[1.08] tracking-[-0.035em] transition-colors duration-500 md:text-[40px] ${
                      k === shown ? "text-text" : "text-text lg:text-white/20"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`mt-4 max-w-[36ch] text-[17px] leading-[27px] transition-colors duration-500 ${
                      k === shown ? "text-muted" : "text-muted lg:text-white/15"
                    }`}
                  >
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* one job, built step by step; it stays put while the steps pass */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[96px]">
              <Build step={shown} />
            </div>
          </div>
          <div className="lg:hidden">
            <Build step={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
