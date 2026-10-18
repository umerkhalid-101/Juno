"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import { payoff } from "@/lib/product";
import { Ask, Pill, SrcIcon, calm } from "./frame";

/**
 * From launch to loyalty: a band across the page. Three Desk close-ups, one release from the
 * request to the follow-up, each building in turn; then the follow-ups wait for your yes.
 */

function Mini({ label, icon, children, n, on }: { label: string; icon: ReactNode; children: ReactNode; n: number; on: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      className="relative overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#0E1218] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={on || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay: n * 0.35, ease: calm }}
    >
      <div className="flex h-10 items-center gap-2 border-b border-white/[0.07] bg-[#0B0E13] px-3.5 text-[12.5px]">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[9px] rounded-full bg-white/[0.12]" />
          ))}
        </span>
        <span className="ml-2 flex items-center gap-1.5 text-muted">
          {icon}
          {label}
        </span>
      </div>
      <div className="p-4 md:h-[230px]">{children}</div>
    </motion.li>
  );
}

export function Payoff() {
  const ref = useRef<HTMLOListElement>(null);
  const on = useInView(ref, { once: true, amount: 0.35 });
  const [approved, setApproved] = useState(false);
  return (
    <section id="loyalty" aria-labelledby="loyalty-title" className="relative mt-36 scroll-mt-24 overflow-hidden border-y border-white/[0.06] bg-[#0A0D13] py-24 md:mt-56 md:py-[120px]">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(50%_100%_at_50%_0%,rgba(122,143,255,0.12),transparent_70%)]" />
      <div className="container-page relative">
        <ChapterIntro id="loyalty-title" lead={payoff.title} muted={payoff.muted} sub={payoff.sub} />
        <ol ref={ref} className="relative mx-auto mt-14 grid max-w-[1100px] gap-4 md:mt-16 md:grid-cols-3 md:gap-6">
          {[0, 1].map((k) => (
            <span
              key={k}
              aria-hidden
              className="absolute top-1/2 z-10 hidden size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/[0.12] bg-[#0A0D13] text-[#A6BBFF] md:grid"
              style={{ left: k ? "66.66%" : "33.33%" }}
            >
              <ArrowRight size={14} />
            </span>
          ))}
          <Mini n={0} on={on} label="Customer request" icon={<SrcIcon tool="intercom" size={16} />}>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-[#E4E1FF] text-[11px] font-semibold text-[#3B3486]">FT</span>
                <div>
                  <p className="text-[13px] text-text">Finance team</p>
                  <p className="text-[11.5px] text-subtle">Customer · via Intercom</p>
                </div>
              </div>
              <p className="mt-4 rounded-[14px] rounded-tl-[4px] bg-white/[0.06] px-3.5 py-2.5 text-[14.5px] leading-[21px] text-text">Can we export invoices for a date range?</p>
              <span className="mt-4 self-start md:mt-auto">
                <Pill tone="blue">Customer request</Pill>
              </span>
            </div>
          </Mini>
          <Mini n={1} on={on} label="Product update" icon={<BrandIcon id="linear" size={14} className="!shadow-none" />}>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[17px] font-medium tracking-[-0.01em] text-text">Invoice exports</p>
                <Pill tone="ok">Shipped</Pill>
              </div>
              <p className="mt-1.5 text-[13px] text-muted">Matched to the people who asked.</p>
              <div className="mt-4 space-y-1.5">
                {["Finance team", "Cedar & Co.", "Northwind"].map((x) => (
                  <p key={x} className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] px-2.5 py-1.5 text-[12.5px] text-text/85">
                    <Check size={12} className="text-[#5BE3A2]" aria-hidden />
                    {x}
                  </p>
                ))}
              </div>
            </div>
          </Mini>
          <Mini n={2} on={on} label="Personal follow-up · Draft" icon={<BrandIcon id="gmail" size={14} className="!shadow-none" />}>
            <div className="h-full overflow-hidden rounded-[12px] bg-white p-3.5 text-[#16181d]">
              <p className="text-[11px] text-[#8a909c]">Subject</p>
              <p className="text-[14px] font-semibold leading-5">The invoice export you asked for</p>
              <p className="mt-2.5 text-[12.5px] leading-[19px] text-[#4a4f5c]">You mentioned that finance needed invoices for a specific date range. That&apos;s now live.</p>
              <p className="mt-1.5 text-[12.5px] leading-[19px] text-[#4a4f5c]">Choose your dates, then download a CSV. Ready for your next reconciliation.</p>
            </div>
          </Mini>
        </ol>

        <div className="mx-auto mt-14 max-w-[520px] text-center">
          <p className="text-[22px] font-medium tracking-[-0.02em] text-text">You stay in control.</p>
          <div className="mt-5 text-left">
            <Ask q={payoff.approval} approved={approved} onApprove={() => setApproved(true)} done="Approved. Sending the follow-ups." />
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-muted">
            <MascotMark size={14} />
            {approved ? "Sent" : "Awaiting your approval"}
          </p>
        </div>
      </div>
    </section>
  );
}
