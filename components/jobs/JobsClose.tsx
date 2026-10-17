"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FaqConsole } from "@/components/ui/FaqConsole";
import { Mascot } from "@/components/mascot/Mascot";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const faqs = [
  {
    q: "Does my Job have to be on this page?",
    a: "Start with the outcome you want. These examples are starting points for what you could hand over, not a fixed menu. Tell Juno what matters, which tools are involved and how often it should come back to the work.",
  },
  {
    q: "How much control do I have?",
    a: "You set the instructions and schedule. Juno brings the work and the next step back into the conversation, where you can review, refine and decide how to proceed.",
  },
  {
    q: "What makes a good Job to hand over?",
    a: "Work that keeps coming back, needs context from more than one place, and has a useful next action. Think keeping a launch on track, helping a stuck customer or finding the next company to talk to.",
  },
];

export function JobsFaq() {
  return (
    <section aria-labelledby="jobs-faq-title" className="chapter">
      <div className="container-page">
        <h2 id="jobs-faq-title" className="t-display-l text-center">
          A few good questions.
        </h2>
        <FaqConsole items={faqs} />
      </div>
    </section>
  );
}

/** The close: Juno rises above the question, one glow behind it, one button. */
export function JobsCta() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const on = seen || !!reduce;
  const calm = [0.16, 1, 0.3, 1] as const;
  return (
    <section
      aria-labelledby="jobs-cta-title"
      className="relative overflow-hidden pb-40 pt-32 md:pb-56 md:pt-44"
    >
      <div ref={ref} className="container-page relative flex flex-col items-center text-center">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[18%] -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] md:size-[680px]"
          style={{ background: "var(--glow)" }}
          initial={false}
          animate={{ opacity: on ? 0.45 : 0, scale: on ? 1 : 0.85 }}
          transition={{ duration: reduce ? 0 : 1.6, ease: calm }}
        />
        <motion.div
          initial={false}
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : 24 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: calm }}
        >
          <Mascot size={96} state="idle" halo={false} />
        </motion.div>
        <motion.h2
          id="jobs-cta-title"
          className="t-display-l mt-10 text-balance"
          initial={false}
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: 0.15, ease: calm }}
        >
          What would you get back to?
        </motion.h2>
        <motion.p
          className="t-body-l mt-5 text-muted"
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.8, delay: 0.3 }}
        >
          If Juno had the follow-through covered.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={false}
          animate={{ opacity: on ? 1 : 0, y: on ? 0 : 10 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: 0.45, ease: calm }}
        >
          <Button
            size="xl"
            variant="white"
            href={CTA_HREF}
            trailing={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />}
          >
            {CTA_LABEL}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
