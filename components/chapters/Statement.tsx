"use client";

import { useRef } from "react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";

const question = "What if someone took this off your plate?".split(" ");
const SPARKS = 16;

/** The turn in the story: the question, then Juno arrives as the answer, with a bang. */
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const q = gsap.utils.selector(root);
        const sparks = q(".st-spark");

        const tl = gsap.timeline({ paused: true });
        // set every starting state inside the timeline, so resetting replays it cleanly
        tl.set(q(".st-word-in"), { yPercent: 115, rotate: 4, opacity: 0 }, 0)
          .set(q(".st-q"), { opacity: 1 }, 0)
          .set(q(".st-reveal"), { maskPosition: "100% 0%", webkitMaskPosition: "100% 0%", letterSpacing: "0.02em", filter: "blur(8px)" }, 0)
          .set(q(".st-mascot"), { opacity: 1, y: 170, scale: 0.9 }, 0)
          .set(q(".st-emerge"), { clipPath: "inset(-400px -400px 0px -400px)" }, 0)
          .set(q(".st-portal"), { opacity: 0, scaleX: 0, scaleY: 0.6 }, 0)
          .set(q(".st-streak"), { opacity: 0, scaleY: 0 }, 0)
          .set(q(".st-flash"), { opacity: 0, scale: 0.2 }, 0)
          .set(q(".st-wave"), { opacity: 0, scale: 0.3 }, 0)
          .set(q(".st-halo"), { opacity: 0, scale: 0.3 }, 0)
          .set(sparks, { opacity: 0, x: 0, y: 0, scale: 1 }, 0)
          .set(q(".st-shake"), { x: 0, y: 0 }, 0);

        // 1. the question rises into place word by word, then steps back
        tl.to(q(".st-word-in"), { yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, stagger: 0.045, ease: "expo.out" }, 0.05).to(
          q(".st-q"),
          { opacity: 0.4, duration: 0.8, ease: "power2.out" },
          1.25,
        );

        // 2. a portal opens and Juno emerges through it, light rising behind; impact as it clears
        const hit = 1.55;
        tl.to(q(".st-portal"), { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.45, ease: "expo.out" }, hit - 0.85)
          .to(q(".st-streak"), { opacity: 1, scaleY: 1, duration: 0.5, ease: "power3.out" }, hit - 0.55)
          .to(q(".st-mascot"), { y: -18, scale: 1.08, duration: 0.6, ease: "power3.out" }, hit - 0.6)
          .set(q(".st-emerge"), { clipPath: "none" }, hit)
          .to(q(".st-streak"), { opacity: 0, duration: 0.6, ease: "power2.out" }, hit)
          .to(q(".st-portal"), { opacity: 0, scaleX: 0.2, duration: 0.6, ease: "power2.in" }, hit + 0.1)
          .to(q(".st-flash"), { keyframes: [{ opacity: 0.95, scale: 1, duration: 0.08 }, { opacity: 0, scale: 1.8, duration: 0.7, ease: "power2.out" }] }, hit)
          .to(q(".st-wave"), { keyframes: [{ opacity: 1, scale: 0.5, duration: 0.04 }, { opacity: 0, scale: 3.6, duration: 1.2, ease: "power3.out" }], stagger: 0.16 }, hit)
          .to(
            sparks,
            {
              keyframes: [
                { opacity: 1, duration: 0.05 },
                {
                  x: (i: number) => Math.cos((i / SPARKS) * Math.PI * 2 + 0.3) * gsap.utils.random(120, 260),
                  y: (i: number) => Math.sin((i / SPARKS) * Math.PI * 2 + 0.3) * gsap.utils.random(120, 220),
                  scale: 0,
                  opacity: 0,
                  duration: 1.1,
                  ease: "power3.out",
                },
              ],
            },
            hit,
          )
          .to(q(".st-shake"), { keyframes: { x: [0, -10, 9, -6, 4, -2, 0], y: [0, 5, -4, 3, -2, 1, 0] }, duration: 0.45, ease: "none" }, hit)
          // Juno lands from the rise and settles with a wobble
          .to(q(".st-mascot"), { y: 0, scale: 1, duration: 1, ease: "elastic.out(1.1, 0.45)" }, hit)
          .to(q(".st-halo"), { opacity: (_: number, el: Element) => (el.classList.contains("juno-halo") ? 0.32 : 1), scale: 1, duration: 1.2, ease: "expo.out" }, hit + 0.1)
          .call(() => mascot.current?.cheer(), [], hit + 0.35);

        // 3. the name is revealed by a soft light edge sweeping across, tracking in and sharpening
        const name0 = hit + 0.35;
        tl.to(q(".st-reveal"), { maskPosition: "0% 0%", webkitMaskPosition: "0% 0%", letterSpacing: "-0.04em", filter: "blur(0px)", duration: 1.3, ease: "expo.out" }, name0).to(
          q(".st-name"),
          { keyframes: [{ filter: "brightness(1.5)", duration: 0.25 }, { filter: "brightness(1)", duration: 0.9 }] },
          name0 + 0.55,
        );

        // render the starting state now: a fresh timeline already sits at 0, so progress(0) alone would not apply the sets
        tl.progress(0.001, true).progress(0, true).pause();
        // plays when it comes into view; resets only once it is fully off screen below,
        // so scrolling back up never makes it vanish in front of you
        const play = ScrollTrigger.create({
          trigger: q(".st-stage")[0],
          start: "top 65%",
          onEnter: () => {
            if (tl.progress() === 0) tl.play(0);
          },
        });
        const reset = ScrollTrigger.create({
          trigger: q(".st-stage")[0],
          start: "top bottom",
          onLeaveBack: () => tl.progress(0).pause(),
        });
        const trigger = { kill: () => (play.kill(), reset.kill()) };
        return () => {
          trigger.kill();
          tl.kill();
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Meet Juno" className="chapter overflow-x-clip">
      <div className="container-page">
        <div className="st-stage st-shake mx-auto flex max-w-[1040px] flex-col items-center py-16 text-center md:py-28">
          <p className="st-q text-[44px] font-medium leading-[48px] tracking-[-0.04em] text-balance [perspective:800px] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[84px]">
            {question.map((w, i) => (
              <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
                <span className="st-word-in inline-block origin-bottom-left will-change-transform">
                  {w}
                  {i < question.length - 1 && "\u00A0"}
                </span>
              </span>
            ))}
          </p>

          <div className="mt-14 flex flex-col items-center gap-6 md:mt-16 md:flex-row md:gap-8">
            {/* Juno, with its impact effects and a living gradient ring */}
            <div className="relative grid place-items-center">
              <span aria-hidden className="st-streak pointer-events-none absolute bottom-[calc(50%-64px)] left-1/2 h-[300px] w-[120px] origin-bottom -translate-x-1/2 bg-[linear-gradient(0deg,rgba(80,229,255,0.45),rgba(122,143,255,0.12)_45%,transparent)] opacity-0 [clip-path:polygon(30%_100%,70%_100%,100%_0,0_0)] blur-[6px]" />
              <span aria-hidden className="st-flash pointer-events-none absolute size-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),rgba(122,180,255,0.5)_40%,transparent)] opacity-0" />
              <span aria-hidden className="st-halo juno-halo pointer-events-none absolute size-[180px] rounded-full md:size-[200px]" />
              <span aria-hidden className="st-halo juno-ring pointer-events-none absolute size-[156px] rounded-full md:size-[168px]" />
              <span aria-hidden className="st-wave pointer-events-none absolute size-[150px] rounded-full border-2 border-[#7AE3FF]/80 opacity-0 shadow-[0_0_30px_rgba(80,229,255,0.6)]" />
              <span aria-hidden className="st-wave pointer-events-none absolute size-[150px] rounded-full border border-[#8F7CFF]/70 opacity-0" />
              {Array.from({ length: SPARKS }, (_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="st-spark pointer-events-none absolute size-[5px] rounded-full opacity-0"
                  style={{ background: i % 3 === 0 ? "#8F7CFF" : i % 3 === 1 ? "#50E5FF" : "#ffffff", boxShadow: "0 0 10px 2px rgba(122,180,255,0.8)" }}
                />
              ))}
              <div className="st-emerge relative">
                <div className="st-mascot relative">
                  <Mascot size={128} state="idle" apiRef={mascot} float interactive halo={false} />
                </div>
              </div>
              {/* the portal Juno rises out of */}
              <span aria-hidden className="st-portal pointer-events-none absolute left-1/2 top-[calc(50%+64px)] h-[22px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#ffffff,#50E5FF_35%,rgba(50,76,255,0.6)_65%,transparent)] opacity-0 shadow-[0_0_40px_10px_rgba(80,229,255,0.45)]" />
            </div>

            <p className="st-line text-[44px] font-medium leading-[48px] tracking-[-0.04em] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[84px]">
              <span className="sr-only">That&apos;s Juno.</span>
              <span aria-hidden className="st-reveal inline-block">
                {"That's"}
                {"\u00A0"}
                <span className="st-name accent-text inline-block">Juno.</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
