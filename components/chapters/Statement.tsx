"use client";

import { useRef } from "react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** The turn in the story, on its own: the question, then Juno as the answer. */
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.set(".st-answer", { opacity: 0, y: 32 });
        gsap.to(".st-answer", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "cubic-bezier(0.16,1,0.3,1)",
          scrollTrigger: { trigger: ".st-answer", start: "top 80%", once: true },
          onComplete: () => mascot.current?.cheer(),
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Meet Juno" className="chapter">
      <div className="container-page">
        <div className="mx-auto flex max-w-[900px] flex-col items-center py-16 text-center md:py-28">
          <p className="text-[40px] font-medium leading-[44px] tracking-[-0.035em] text-balance md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[66px]">
            What if someone took this off your plate?
          </p>

          <div className="st-answer mt-14 flex flex-col items-center gap-5 md:flex-row md:gap-6">
            <Mascot size={96} state="idle" apiRef={mascot} float interactive halo={false} />
            <p className="text-[40px] font-medium leading-[44px] tracking-[-0.035em] text-muted md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[66px]">
              That&apos;s Juno.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
