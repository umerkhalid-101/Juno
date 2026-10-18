"use client";

import { motion } from "motion/react";
import { Check, Command } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { MascotMark } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";
import { Keycap, usePlayOnce } from "@/components/features/kit";
import { day } from "@/lib/product";
import { SrcIcon } from "./frame";

const calm = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ part of your day */

function QuickAsk() {
  return (
    <div className="relative h-full p-4">
      <div className="rounded-[12px] bg-white p-3.5 text-[#16181d]">
        <p className="text-[10.5px] text-[#8a909c]">Launch plan</p>
        <p className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em]">Ready for Friday.</p>
        {["Website ready", "Social posts ready"].map((t) => (
          <p key={t} className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#4a4f5c]">
            <Check size={11} strokeWidth={3} className="text-[#2f9e6a]" aria-hidden />
            {t}
          </p>
        ))}
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#4a4f5c]">
          <span className="size-[11px] rounded-full border border-[#c9cdd6]" />
          Customer email
        </p>
      </div>
      <div className="absolute inset-x-6 bottom-3.5 rounded-[14px] border border-white/[0.12] bg-[#1A202B]/95 p-2.5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur">
        <p className="flex items-center gap-2 text-[12.5px] text-text">
          <MascotMark size={16} />
          What&apos;s left before launch?
          <span className="ml-auto flex gap-0.5" aria-hidden>
            <Keycap>
              <Command size={9} />
            </Keycap>
            <Keycap>J</Keycap>
          </span>
        </p>
        <p className="mt-2 border-t border-white/[0.07] pt-2 text-[12.5px] text-muted">Just the customer email.</p>
      </div>
    </div>
  );
}

function Shared() {
  return (
    <div className="h-full space-y-2.5 p-4">
      <p className="text-[11px] text-subtle">Launch day</p>
      <div className="flex items-start gap-2">
        <MascotMark size={18} />
        <p className="rounded-[12px] rounded-tl-[4px] bg-white/[0.05] px-3 py-2 text-[12.5px] text-text">The announcement is ready.</p>
      </div>
      <div className="ml-7 rounded-[10px] bg-white px-3 py-2 text-[12px] font-medium text-[#16181d]">Feature announcement</div>
      <div className="flex items-start justify-end gap-2">
        <p className="rounded-[12px] rounded-tr-[4px] bg-[#7A8FFF]/18 px-3 py-2 text-[12.5px] text-text">Looks good. Let&apos;s ship.</p>
        <Face who="leo" size={20} />
      </div>
      <p className="pt-1 text-center text-[11.5px] text-subtle">One conversation. Together.</p>
    </div>
  );
}

function Access() {
  return (
    <div className="h-full p-4">
      <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.03] p-3.5">
        <p className="text-[10.5px] text-subtle">Project</p>
        <p className="text-[15px] font-medium text-text">Product launch</p>
        <p className="text-[12px] text-muted">Product team</p>
        <p className="mt-3 text-[10.5px] text-subtle">Connected tools</p>
        {(["linear", "slack"] as const).map((t) => (
          <p key={t} className="mt-1.5 flex items-center gap-2 text-[12.5px] text-text">
            <SrcIcon tool={t} size={18} />
            {t === "linear" ? "Linear" : "Slack"}
            <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10.5px] text-muted">Product team</span>
          </p>
        ))}
        <p className="mt-3 border-t border-white/[0.06] pt-2.5 text-[11.5px] text-subtle">Access, on your terms.</p>
      </div>
    </div>
  );
}

const visuals = [QuickAsk, Shared, Access];

export function Day() {
  const [ref, on] = usePlayOnce<HTMLUListElement>(0.25);
  return (
    <section aria-labelledby="day-title" className="pt-44 md:pt-72">
      <div className="container-page">
        <ChapterIntro id="day-title" lead={day.title} muted={day.muted} sub="Juno is there wherever the work is: on your screen, in the thread, across the team." />
        <ul ref={ref} className="mx-auto mt-14 grid max-w-[1100px] gap-4 md:mt-16 md:grid-cols-3">
          {day.tiles.map((t, i) => {
            const V = visuals[i];
            return (
              <motion.li
                key={t.title}
                className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0E1218] transition-colors duration-300 hover:border-white/[0.18]"
                initial={{ opacity: 0, y: 18 }}
                animate={on ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.7, ease: calm, delay: i * 0.08 }}
              >
                <div className="relative h-[284px] border-b border-white/[0.06] bg-[radial-gradient(120%_80%_at_0%_0%,rgba(122,143,255,0.07),transparent_60%)]">
                  <V />
                </div>
                <div className="p-5">
                  <p className="text-[17px] font-medium text-text">{t.title}</p>
                  <p className="mt-1 text-[14.5px] leading-[22px] text-muted">{t.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
