"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ListTodo, MessageSquare, RotateCcw } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import { ApprovalPrompt } from "@/components/demo/ApprovalPrompt";
import { useAutoPlay } from "@/components/ui/useAutoPlay";
import { Face } from "@/components/jobs/scenes";
import { compare } from "@/lib/features";
import { SectionHead, usePlayOnce, useTyped } from "./kit";

/**
 * Same ask, different outcome. One prompt, two answers side by side: a paragraph of advice,
 * and the work itself, waiting for your yes. Plays once in view; replay after.
 */

const snap = [0.3, 0, 0, 1] as const;

function LinkedIn({ size = 28 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center bg-[#0A66C2] font-semibold text-white"
      style={{ width: size, height: size, borderRadius: size * 0.28, fontSize: size * 0.46 }}
      aria-hidden
    >
      in
    </span>
  );
}

function Output({
  show,
  icon,
  kind,
  title,
  children,
}: {
  show: boolean;
  icon: ReactNode;
  kind: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className="flex items-start gap-3 rounded-[14px] border border-line bg-surface-2/70 p-3"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: snap }}
        >
          {icon}
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] text-muted">{kind}</span>
            <span className="mt-0.5 block truncate text-[14px] font-medium text-text">{title}</span>
            {children}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FxCompare() {
  const reduce = useReducedMotion();
  const [ref, on] = usePlayOnce<HTMLDivElement>(0.4);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<"bot" | "juno">("bot");
  const [picked, setPicked] = useState(false);
  const tabs = useRef<HTMLDivElement>(null);
  // phones: the chatbot first, then three seconds later Juno (unless they've picked a side)
  useAutoPlay(tabs, () => setTab("juno"), tab === "bot" && !picked);

  const prompt = useTyped(compare.prompt, on, 38, 200);
  // the chatbot streams once the prompt is sent; replays restart it
  const bot = useTyped(compare.chatbot, prompt.done, 55, 300, run);

  useEffect(() => {
    if (!prompt.done) return;
    if (reduce) {
      const t = window.setTimeout(() => setStep(6), 0);
      return () => window.clearTimeout(t);
    }
    const at = [500, 1200, 1900, 2600, 3500, 4300];
    const ts = at.map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
    return () => ts.forEach(window.clearTimeout);
  }, [prompt.done, run, reduce]);

  const replay = () => {
    setStep(0);
    setRun((r) => r + 1);
  };

  const botDone = bot.done;

  return (
    <section aria-labelledby="fx-compare-title" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHead
          id="fx-compare-title"
          title={compare.title}
          muted={compare.muted}
          sub={compare.sub}
        />

        <div ref={ref} className="mx-auto mt-14 max-w-[1080px] md:mt-16">
          {/* the shared ask */}
          <div className="mx-auto flex h-14 max-w-[640px] items-center gap-3 rounded-full border border-line bg-surface pl-5 pr-2 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
            <span className="min-w-0 flex-1 truncate text-[15px] text-text">
              {prompt.shown || <span className="text-muted">Ask anything</span>}
              {on && !prompt.done && (
                <span className="caret ml-px inline-block h-[17px] w-px translate-y-[3px] bg-text/80" />
              )}
            </span>
            <span
              className={`grid size-10 place-items-center rounded-full transition-colors duration-200 ${
                prompt.done ? "bg-[#F4F6F8] text-[#07090D]" : "bg-white/[0.06] text-muted"
              }`}
              aria-hidden
            >
              <ArrowUp size={17} strokeWidth={2} />
            </span>
          </div>

          {/* phones: one at a time */}
          <div ref={tabs} className="mt-8 flex justify-center md:hidden" role="tablist" aria-label="Compare">
            <div className="flex rounded-full border border-line bg-surface p-1">
              {(["bot", "juno"] as const).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => {
                    setPicked(true);
                    setTab(k);
                  }}
                  className={`h-10 rounded-full px-5 text-[14px] font-medium transition-colors ${
                    tab === k ? "bg-white/[0.08] text-text" : "text-muted"
                  }`}
                >
                  {k === "bot" ? "Chatbot" : "Juno"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:mt-10 md:grid-cols-2">
            {/* a typical chatbot: muted, flat, words only */}
            <div
              className={`flex min-h-[460px] flex-col rounded-[24px] border border-line bg-white/[0.015] p-5 md:p-6 ${
                tab === "bot" ? "" : "max-md:hidden"
              }`}
            >
              <div className="flex items-center gap-2.5 text-[14px] text-muted">
                <span className="grid size-7 place-items-center rounded-full bg-white/[0.06]">
                  <MessageSquare size={14} strokeWidth={1.75} aria-hidden />
                </span>
                A typical chatbot
              </div>
              <div className="mt-6 flex-1">
                {prompt.done && (
                  <p className="rounded-[16px] rounded-tl-[6px] bg-white/[0.05] p-4 text-[14.5px] leading-6 text-muted">
                    {bot.shown}
                    {!botDone && (
                      <span className="caret ml-px inline-block h-[15px] w-px translate-y-[3px] bg-muted" />
                    )}
                  </p>
                )}
              </div>
              <div
                className={`mt-6 flex items-center gap-2 border-t border-line pt-4 text-[14px] text-muted transition-opacity duration-500 ${
                  botDone ? "opacity-100" : "opacity-0"
                }`}
              >
                <ListTodo size={16} strokeWidth={1.75} aria-hidden />
                {compare.chatbotEnd}
              </div>
            </div>

            {/* Juno: the work itself */}
            <div
              className={`flex min-h-[460px] flex-col rounded-[24px] border border-line-strong bg-surface p-5 md:p-6 ${
                tab === "juno" ? "" : "max-md:hidden"
              }`}
            >
              <div className="flex items-center gap-2.5 text-[14px] font-medium text-text">
                <MascotMark size={26} />
                Juno
              </div>
              <div className="mt-6 flex flex-1 flex-col gap-2.5">
                <Output
                  show={step >= 1}
                  icon={<BrandIcon id="gmail" size={32} />}
                  kind="Email draft"
                  title="Scheduled Reports are here"
                />
                <Output
                  show={step >= 2}
                  icon={<LinkedIn size={32} />}
                  kind="LinkedIn post"
                  title="Mondays just got quieter. Meet Scheduled Reports."
                />
                <Output
                  show={step >= 3}
                  icon={<BrandIcon id="notion" size={32} />}
                  kind="Help article draft"
                  title="How to schedule a report"
                />
                <Output
                  show={step >= 4}
                  icon={
                    <span className="flex shrink-0 -space-x-2">
                      <Face who="maya" size={28} className="!ring-surface" />
                      <Face who="sam" size={28} className="!ring-surface" />
                      <Face who="leo" size={28} className="!ring-surface" />
                    </span>
                  }
                  kind="3 personal follow-ups"
                  title="To Maya, Sam, and Alex, who asked for it"
                />
                <div className="mt-auto pt-3">
                  <AnimatePresence initial={false}>
                    {step >= 5 && (
                      <motion.div
                        key={run}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ApprovalPrompt question={compare.approval} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div
                className={`mt-5 flex items-center justify-between border-t border-line pt-4 text-[14px] transition-opacity duration-500 ${
                  step >= 6 ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="flex items-center gap-2 text-text">
                  <span className="size-2 rounded-full bg-success" aria-hidden />
                  {compare.junoEnd}
                </span>
                <button
                  type="button"
                  onClick={replay}
                  className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] text-muted transition-colors hover:bg-white/[0.06] hover:text-text"
                >
                  <RotateCcw size={13} strokeWidth={2} aria-hidden />
                  Replay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
