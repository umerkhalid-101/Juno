"use client";

import { useRef } from "react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

const question = "What if someone took this off your plate?".split(" ");
const lead = "That's".split("");
const name = "Juno.".split("");

/** The turn in the story: the question, then Juno arrives as the answer. */
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const q = gsap.utils.selector(root);
        gsap.set(q(".st-word"), { opacity: 0, y: 40, filter: "blur(12px)" });
        gsap.set(q(".st-char"), { opacity: 0, y: 28, rotateX: -70, filter: "blur(10px)" });
        gsap.set(q(".st-mascot"), { opacity: 0, scale: 0.2, rotate: -200 });
        gsap.set(q(".st-halo"), { opacity: 0, scale: 0.3 });
        gsap.set(q(".st-wave"), { opacity: 0, scale: 0.4 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "cubic-bezier(0.16,1,0.3,1)" } });
        tl.to(q(".st-word"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.06 }, 0)
          // Juno arrives: spins in with an overshoot, a shockwave and a halo bloom
          .to(q(".st-mascot"), { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.9)" }, 0.75)
          .to(q(".st-wave"), { keyframes: [{ opacity: 0.9, scale: 0.6, duration: 0.05 }, { opacity: 0, scale: 3.2, duration: 1.1, ease: "power2.out" }] }, 1.05)
          .to(q(".st-halo"), { opacity: (_: number, el: Element) => (el.classList.contains("juno-halo") ? 0.32 : 1), scale: 1, duration: 1.2 }, 1.0)
          .call(() => mascot.current?.cheer(), [], 1.35)
          // the name lands letter by letter, then flashes bright once
          .to(q(".st-char"), { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.04 }, 1.0)
          .to(q(".st-name"), { keyframes: [{ filter: "brightness(1.9) drop-shadow(0 0 18px rgba(122,143,255,0.9))", duration: 0.25 }, { filter: "brightness(1) drop-shadow(0 0 0px rgba(122,143,255,0))", duration: 0.9 }], stagger: 0.05 }, 1.55);

        const trigger = gsap.timeline({
          scrollTrigger: { trigger: q(".st-stage")[0], start: "top 72%", once: true, onEnter: () => tl.play() },
        });
        return () => {
          trigger.kill();
          tl.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Meet Juno" className="chapter">
      <div className="container-page">
        <div className="st-stage mx-auto flex max-w-[1040px] flex-col items-center py-16 text-center md:py-28">
          <p className="text-[44px] font-medium leading-[48px] tracking-[-0.04em] text-balance md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[84px]">
            {question.map((w, i) => (
              <span key={i} className="st-word inline-block will-change-transform">
                {w}
                {i < question.length - 1 && " "}
              </span>
            ))}
          </p>

          <div className="mt-14 flex flex-col items-center gap-6 md:mt-16 md:flex-row md:gap-8">
            {/* Juno, with a living gradient ring */}
            <div className="relative grid place-items-center">
              <span aria-hidden className="st-halo juno-halo pointer-events-none absolute size-[180px] rounded-full md:size-[200px]" />
              <span aria-hidden className="st-halo juno-ring pointer-events-none absolute size-[156px] rounded-full md:size-[168px]" />
              <span aria-hidden className="st-wave pointer-events-none absolute size-[150px] rounded-full border-2 border-[#7AE3FF]/70 shadow-[0_0_30px_rgba(80,229,255,0.5)]" />
              <div className="st-mascot relative">
                <Mascot size={128} state="idle" apiRef={mascot} float interactive halo={false} />
              </div>
            </div>

            <p className="text-[44px] font-medium leading-[48px] tracking-[-0.04em] [perspective:600px] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[84px]">
              <span className="sr-only">That&apos;s Juno.</span>
              <span aria-hidden>
                {lead.map((c, i) => (
                  <span key={`l${i}`} className="st-char inline-block origin-bottom will-change-transform">
                    {c}
                  </span>
                ))}
                {" "}
                {name.map((c, i) => (
                  <span key={`n${i}`} className="st-char st-name accent-text inline-block origin-bottom will-change-transform">
                    {c}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
