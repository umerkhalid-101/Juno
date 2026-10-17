"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Questions on the left, Juno answers on the right: the reply streams in word by word. */
export function FaqConsole({ items }: { items: { q: string; a: string; placeholder?: string }[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = items[active];

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mx-auto mt-14 grid max-w-[1120px] gap-5 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Questions"
        onKeyDown={onKey}
        className="flex flex-col gap-1"
      >
        {items.map((q, i) => {
          const on = i === active;
          return (
            <button
              key={q.q}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`faq-tab-${i}`}
              aria-selected={on}
              aria-controls="faq-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className="group relative flex min-h-[60px] w-full items-center gap-4 rounded-2xl px-5 text-left"
            >
              {on && (
                <motion.span
                  layoutId="faq-active"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(166,187,255,0.12),rgba(166,187,255,0.03))] ring-1 ring-[#A6BBFF]/25"
                />
              )}
              <span
                className={`relative size-1.5 shrink-0 rounded-full transition-all duration-300 ${
                  on
                    ? "bg-[#A6BBFF] shadow-[0_0_12px_2px_rgba(166,187,255,0.7)]"
                    : "bg-white/20 group-hover:bg-white/45"
                }`}
              />
              <span
                className={`relative text-[16px] leading-6 tracking-[-0.01em] transition-colors duration-300 md:text-[17px] ${
                  on ? "text-text" : "text-muted group-hover:text-text"
                }`}
              >
                {q.q}
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                aria-hidden
                className={`relative ml-auto shrink-0 text-[#A6BBFF] transition-all duration-300 ${
                  on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* the answer, inside a slowly orbiting light border */}
      <div className="faq-panel relative rounded-[28px] p-px">
        <div
          id="faq-panel"
          role="tabpanel"
          aria-labelledby={`faq-tab-${active}`}
          className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[27px] bg-[#0a0d15] p-7 md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-32 size-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(80,110,255,0.22),transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:100%_28px] [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]"
          />

          <div className="relative flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#11151E] ring-1 ring-[#A6BBFF]/30">
              <MascotMark size={28} />
            </span>
            <div>
              <p className="text-[14px] font-medium text-text">Juno</p>
              <p className="flex items-center gap-1.5 text-[12px] text-subtle">
                <span className="faq-live size-1.5 rounded-full bg-[#5ee0a0]" />
                Answering
              </p>
            </div>
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mt-8 flex-1"
          >
            <p className="text-[13px] text-subtle">{f.q}</p>
            <motion.p
              initial="hide"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: reduce ? 0 : 0.028, delayChildren: 0.12 } },
              }}
              className="mt-3 text-[22px] leading-[1.35] tracking-[-0.02em] text-text md:text-[27px]"
            >
              {f.a.split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hide: reduce ? { opacity: 1 } : { opacity: 0, filter: "blur(8px)", y: 6 },
                    show: {
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                      transition: { duration: 0.45, ease },
                    },
                  }}
                  className="inline-block whitespace-pre"
                >
                  {w}{" "}
                </motion.span>
              ))}
            </motion.p>
            {f.placeholder && (
              <span className="mt-4 inline-block rounded-sm border border-dashed border-line-strong px-1.5 font-mono text-[11px] text-subtle">
                placeholder
              </span>
            )}
          </motion.div>

          <a
            href="#contact"
            className="group relative mt-10 flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-5 py-4 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06]"
          >
            <span className="text-[14px] text-muted">
              Something else? <span className="text-text">Ask the team.</span>
            </span>
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden
              className="text-[#A6BBFF] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
