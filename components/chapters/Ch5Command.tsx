"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { Reveal } from "@/components/ui/Reveal";
import { StatusChip, type Status } from "@/components/ui/StatusChip";
import { ToolBadge, ToolLogo } from "@/components/ui/ToolLogo";
import { MascotMark } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { approvalQueue, notifications } from "@/lib/story";

const calm = [0.16, 1, 0.3, 1] as const;

export function Ch5Command() {
  const root = useRef<HTMLElement>(null);

  // "The clear": the exact Chapter 1 mess returns ghosted, fades out one by one,
  // and a calm approval queue takes its place. Plays once, calm easing throughout.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const q = gsap.utils.selector(root);
        const ghosts = q(".ghost-row");
        const items = q(".queue-item");
        gsap.set(".ghost-layer", { autoAlpha: 1 });
        gsap.set(ghosts, { opacity: 0.5 });
        gsap.set(items, { opacity: 0, y: 24 });
        gsap.set(".queue-head", { opacity: 0 });
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.to(ghosts, { opacity: 0, x: -12, filter: "blur(4px)", duration: 0.8, stagger: 0.14, ease: "power2.inOut" }, 0.3)
          .set(".ghost-layer", { autoAlpha: 0 })
          .to(".queue-head", { opacity: 1, duration: 0.8 }, "-=0.2")
          .to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18 }, "<0.1");
        ScrollTrigger.create({ trigger: ".clear-panel", start: "top 70%", once: true, onEnter: () => tl.play() });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="command" aria-labelledby="ch5-title" className="chapter">
      <div className="container-page">
        <Reveal>
          <ChapterIntro
            id="ch5-title"
            lead="Nothing goes out"
            muted="without your yes."
            sub="Juno asks before it sends, posts, or changes anything. You choose what runs on its own."
          />
        </Reveal>

        <div className="mx-auto mt-10 max-w-[720px] md:mt-16">
          {/* The clear */}
          <div className="clear-panel relative min-h-[460px] overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <MascotMark size={24} />
              <span className="text-[14px] font-medium">Waiting for you</span>
              <span className="ml-auto font-mono text-[12px] text-muted">Monday, 8:47 AM</span>
            </div>

            <div className="relative p-4 md:p-5">
              {/* ghosted callback of Chapter 1 */}
              <ul aria-hidden className="ghost-layer invisible absolute inset-4 space-y-2 opacity-0 md:inset-5">
                {notifications.map((n) => (
                  <li key={n.id} className="ghost-row flex h-11 items-center gap-3 rounded-md border border-line px-3">
                    <ToolLogo id={n.tool} size={14} className="text-muted" />
                    <span className="truncate text-[13px] text-muted">{n.short}</span>
                    <span className="ml-auto size-1.5 rounded-full bg-danger/70" />
                  </li>
                ))}
              </ul>

              <div className="relative">
                <p className="queue-head mb-4 text-[14px] text-muted">
                  47 pings handled. <span className="text-text">3 need your yes.</span>
                </p>
                <ul className="space-y-3" aria-label="Approval queue">
                  {approvalQueue.map((a) => (
                    <QueueItem key={a.id} a={a} />
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

function QueueItem({ a }: { a: (typeof approvalQueue)[number] }) {
  const [status, setStatus] = useState<Status>("Needs you");
  return (
    <li className="queue-item rounded-lg border border-line bg-surface-2 p-4">
      <div className="flex items-start gap-3">
        <ToolBadge id={a.tool} size={30} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-5 font-medium text-text">{a.title}</p>
          <p className="mt-0.5 text-[13px] text-muted">{a.meta}</p>
        </div>
        <StatusChip status={status} />
      </div>
      <AnimatePresence initial={false}>
        {status === "Needs you" && (
          <motion.div
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.8, ease: calm }}
            className="mt-3 flex justify-end gap-2 overflow-hidden"
          >
            <button type="button" className="h-10 rounded-full px-4 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text">
              Edit
            </button>
            <button
              type="button"
              onClick={() => setStatus(a.tool === "linear" ? "Done" : a.id === "a1" ? "Scheduled" : "Sent")}
              className="h-10 rounded-full bg-[#A6BBFF]/15 px-4 text-[13px] font-medium text-[#C9D5FF] transition-colors hover:bg-[#A6BBFF]/25"
            >
              Approve
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
