"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";
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
const updates = [
  { to: "Maya Chen", what: "Share links are live" },
  { to: "Leo Park", what: "Bulk export is here" },
  { to: "Priya Shah", what: "Team plans shipped" },
];

/** The job, as far as it has been built: `step` 0, 1 or 2. */
function Build({ step }: { step: number }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B0E14] p-5 md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(122,143,255,0.12),transparent_70%)]"
      />
      {/* 1. you */}
      <div className="relative flex justify-end">
        <p className="max-w-[86%] rounded-[20px] rounded-br-md bg-[#F4F6F8] px-4 py-2.5 text-[15px] leading-[22px] text-[#07090D]">
          {ASK}
        </p>
      </div>

      {/* 2. rhythm */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mt-5 flex items-start gap-3"
          >
            <MascotMark size={28} />
            <div>
              <p className="text-[15px] text-text">Every Friday, then.</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="flex gap-1" aria-hidden>
                  {WEEK.map((d, k) => (
                    <span
                      key={k}
                      className={`t-eyebrow grid size-8 place-items-center rounded-md border !text-[10.5px] ${k === 4 ? "border-[#7A8FFF]/40 bg-[#324CFF]/15 text-[#A6BBFF]" : "border-white/[0.08] text-subtle"}`}
                    >
                      {d}
                    </span>
                  ))}
                </span>
                <span className="t-eyebrow inline-flex h-8 items-center rounded-md border border-[#7A8FFF]/25 bg-[#324CFF]/10 px-2.5 !text-[10.5px] text-[#A6BBFF]">
                  Every Friday · 9:00 AM
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. the next move */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-5 pl-10"
          >
            <div className="rounded-[18px] bg-[#FBFAF7] p-4 text-[#14161f]">
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                <ToolLogo id="gmail" size={15} />
                Updates ready to send
              </p>
              <ul className="mt-3 space-y-2">
                {updates.map((u, k) => (
                  <motion.li
                    key={u.to}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + k * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-black/[0.06]"
                  >
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-[13.5px] font-medium">{u.to}</span>
                      <span className="block text-[12px] text-[#6b7080]">{u.what}</span>
                    </span>
                    <span className="inline-flex h-6 items-center rounded-md bg-[#E9F7EF] px-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#1f7a4d]">
                      Ready to send
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 rounded-2xl bg-[#151A22] p-3.5 ring-1 ring-white/10"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
          <p className="t-eyebrow text-muted">Your way of working, on repeat</p>
          <h2 id="how-title" className="t-display-l mt-5 text-balance">
            Hand over the outcome.{" "}
            <span className="block text-muted">Leave the follow-through.</span>
          </h2>
        </header>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* the steps, with a rail that fills as you go */}
          <ol className="relative lg:col-span-5">
            <span
              aria-hidden
              className="absolute bottom-6 left-[15px] top-6 hidden w-px bg-white/[0.08] lg:block"
            >
              <span
                className="block w-full origin-top bg-[#7A8FFF] transition-transform duration-500"
                style={{ height: "100%", transform: `scaleY(${shown / 2})` }}
              />
            </span>
            {steps.map((s, k) => (
              <li
                key={s.title}
                ref={(el) => {
                  refs.current[k] = el;
                }}
                data-step={k}
                className="relative flex gap-5 py-6 lg:min-h-[62vh] lg:items-center lg:py-0"
              >
                <span
                  className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[12px] transition-colors duration-300 ${
                    k <= shown
                      ? "border-[#7A8FFF]/50 bg-[#151A22] text-text"
                      : "border-white/[0.08] bg-[#0B0E14] text-subtle"
                  }`}
                >
                  {k < shown ? (
                    <Check size={14} strokeWidth={2.5} className="text-[#3DD68C]" aria-hidden />
                  ) : (
                    k + 1
                  )}
                </span>
                <div className="max-w-[40ch]">
                  <h3
                    className={`t-h3 transition-colors duration-300 ${k === shown ? "text-text" : "text-subtle"}`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`mt-2 text-[16px] leading-[26px] transition-colors duration-300 ${k === shown ? "text-muted" : "text-subtle"}`}
                  >
                    {s.body}
                  </p>
                </div>
                {/* phones: each step carries its own picture */}
                <span className="sr-only">Step {k + 1} of 3</span>
              </li>
            ))}
          </ol>

          {/* one job, built step by step; it stays put while the steps pass */}
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-[calc(50vh-240px)]">
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
