"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, Paperclip } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Mascot, MascotMark } from "@/components/mascot/Mascot";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { connectedTools, tools } from "@/lib/story";

/**
 * "Your whole stack. One Juno."
 * Ten tool cards fanned out fold into a single deck as you scroll, and Juno lands on top.
 * Then the proof: asked in Slack, done in Linear, with the Intercom context attached.
 */

const ease = [0.2, 0.8, 0.2, 1] as const;
const N = connectedTools.length;
const mid = (N - 1) / 2;

// fanned positions (desktop)
const fan = (i: number) => {
  const o = i - mid;
  return { x: o * 108, y: o * o * 5.5, rotate: o * 7 };
};

export function ChStack() {
  const root = useRef<HTMLElement>(null);
  const proof = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const proofIn = useInView(proof, { once: true, amount: 0.4 });
  const on = proofIn || !!reduce;

  // the fold: scrubbed by scroll, no pinning
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".stack-tool", root.current);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ".stack-stage", start: "top 80%", end: "center 45%", scrub: 0.6 },
        });
        cards.forEach((c, i) => {
          const f = fan(i);
          tl.fromTo(c, { x: f.x, y: f.y, rotate: f.rotate }, { x: 0, y: 0, rotate: (i - mid) * 1.2, ease: "power2.inOut", duration: 1 }, 0);
        });
        tl.fromTo(".stack-juno", { opacity: 0, scale: 0.7, y: 30 }, { opacity: 1, scale: 1, y: 0, ease: "back.out(1.6)", duration: 0.35 }, 0.72);
        tl.fromTo(".stack-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, 0.8);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="chapter">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <h2 id="stack-title" className="t-display-l text-balance">
            Your whole stack. <span className="accent-text block">One Juno.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-[27px] text-muted">
            Ask in one tool, get it done in another. Juno already knows how they connect.
          </p>
        </Reveal>

        {/* the fold */}
        <div className="stack-stage relative mx-auto mt-14 hidden h-[360px] max-w-[1180px] md:mt-20 md:block" aria-label="Ten connected tools fold into one Juno" role="img">
          <div className="absolute left-1/2 top-[90px]">
            {connectedTools.map((id, i) => {
              const f = fan(i);
              return (
                <div
                  key={id}
                  className="stack-tool absolute -left-[64px] -top-[78px] flex h-[156px] w-[128px] flex-col items-center justify-center gap-3 rounded-[22px] bg-white text-[#14161f] shadow-[0_24px_50px_-22px_rgba(0,0,0,0.85)] ring-1 ring-black/5"
                  style={{ transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotate}deg)`, zIndex: i < mid ? i : N - i }}
                >
                  <ToolLogo id={id} size={40} brand />
                  <span className="text-[13px] text-[#3a3f4f]">{tools[id].name}</span>
                </div>
              );
            })}
            {/* Juno lands on top */}
            <div className="stack-juno absolute -left-[74px] -top-[90px] z-20 flex h-[180px] w-[148px] flex-col items-center justify-center gap-3 rounded-[24px] bg-[linear-gradient(160deg,#1b2140,#0e1120)] opacity-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-[#A6BBFF]/30">
              <Mascot size={78} state="idle" halo={false} />
              <span className="text-[14px] font-medium text-white">Juno</span>
            </div>
          </div>
          <p className="stack-label absolute inset-x-0 bottom-0 text-center text-[15px] text-muted opacity-0">
            Ten tools, <span className="text-text">one teammate who works across all of them.</span>
          </p>
        </div>

        {/* mobile: a simple grid */}
        <div className="mt-10 grid grid-cols-5 gap-2 md:hidden">
          {connectedTools.map((id) => (
            <span key={id} className="grid aspect-square place-items-center rounded-xl bg-white text-[#14161f]">
              <ToolLogo id={id} size={22} brand />
            </span>
          ))}
        </div>

        {/* the proof: asked in Slack, done in Linear */}
        <div ref={proof} className="mx-auto mt-20 grid max-w-[1080px] items-center gap-6 md:mt-28 md:grid-cols-[1fr_auto_1fr]">
          <motion.div
            initial={false}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 20 }}
            transition={{ duration: 0.6, ease }}
            className="rounded-[22px] bg-white p-6 text-[#14161f] shadow-[0_40px_80px_-36px_rgba(0,0,0,0.9)]"
          >
            <p className="mb-5 flex items-center gap-2 border-b border-black/[0.06] pb-4 text-[14px] font-semibold">
              <ToolLogo id="slack" size={18} brand /># product
            </p>
            <div className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#ece9ff] text-[12px] font-semibold text-[#5b5bd6]">MC</span>
              <div>
                <p className="text-[13px] font-semibold">Maya</p>
                <p className="mt-1 text-[15px] leading-[23px] text-[#3a3f4f]">Juno, turn the export questions in Intercom into a brief for Leo.</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <MascotMark size={36} />
              <div>
                <p className="text-[13px] font-semibold">Juno</p>
                <p className="mt-1 text-[15px] leading-[23px] text-[#3a3f4f]">
                  Done. It&apos;s in Linear: <span className="font-medium text-[#14161f]">PDF layouts that fit every chart.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* the hop between tools */}
          <motion.div
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.8 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
            className="flex items-center justify-center gap-2 md:flex-col"
            aria-hidden
          >
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#A6BBFF]/60 md:h-10 md:w-px md:bg-gradient-to-b" />
            <span className="grid size-12 place-items-center rounded-full bg-[#11151E] ring-1 ring-[#A6BBFF]/30">
              <MascotMark size={30} />
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-[#A6BBFF]/60 to-transparent md:h-10 md:w-px md:bg-gradient-to-b" />
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="rounded-[22px] bg-white p-6 text-[#14161f] shadow-[0_40px_80px_-36px_rgba(0,0,0,0.9)]"
          >
            <div className="mb-5 flex items-center gap-2 border-b border-black/[0.06] pb-4 text-[14px] font-semibold">
              <ToolLogo id="linear" size={18} brand />
              Product brief
              <span className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-[#2f8a5f]">
                <Check size={13} strokeWidth={2.5} aria-hidden />
                Created
              </span>
            </div>
            <p className="text-[26px] font-semibold leading-[1.08] tracking-[-0.03em]">PDF layouts that fit every chart.</p>
            <p className="mt-3 text-[14px] leading-[22px] text-[#5b6070]">42 customers say exported PDFs cut off wide charts. Fit charts to the page before Thursday&apos;s launch.</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-4 text-[12px]">
              <span className="text-[#7a7f8c]">Assigned to Leo</span>
              <span className="text-[#c0c4cc]">·</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F1F4] px-2.5 py-1 text-[#3a3f4f]">
                <Paperclip size={11} strokeWidth={2} aria-hidden />
                <ToolLogo id="intercom" size={11} brand />
                12 conversations attached
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
