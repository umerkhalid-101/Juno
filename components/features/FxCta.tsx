"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { finalCta, runOn } from "@/lib/features";
import { CommandBar, Sparks, useTyped } from "./kit";

/**
 * The close, and the hero's bookend. A question rises and steps back; Juno arrives in its
 * light with the answer; then Juno's command bar opens out under the button, asking where to
 * start, with the same particles rising from it into the button as at the top of the page.
 */
export function FxCta() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);
  const [typing, setTyping] = useState(false);
  const typed = useTyped(finalCta.prompt, typing, 28, 200);
  const words = runOn.question.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ paused: true });
        tl.set(q(".cl-word"), { yPercent: 115, rotate: 4, opacity: 0 }, 0)
          .set(q(".cl-q"), { opacity: 1 }, 0)
          .set(q(".cl-juno"), { opacity: 0, scale: 0.6, y: 24 }, 0)
          .set(q(".cl-halo"), { opacity: 0, scale: 0.4 }, 0)
          .set(q(".cl-answer"), { opacity: 0, x: -16, filter: "blur(6px)" }, 0)
          .set(q(".cl-rise"), { opacity: 0, y: 14 }, 0)
          .set(q(".cl-bar"), { clipPath: "inset(0% 50% 0% 50% round 999px)", opacity: 0 }, 0)
          .set(q(".cl-glow"), { opacity: 0, scale: 0.8 }, 0)
          .set(q(".cl-sparks"), { opacity: 0 }, 0)
          .call(() => setTyping(false), [], 0);

        // 1. the question rises word by word, then steps back
        tl.to(
          q(".cl-word"),
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1, stagger: 0.05, ease: "expo.out" },
          0.05,
        ).to(q(".cl-q"), { opacity: 0.4, duration: 0.8, ease: "power2.out" }, 1.1);
        // 2. Juno arrives in its light, and answers
        tl.to(
          q(".cl-juno"),
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "elastic.out(1, 0.55)" },
          1.15,
        )
          .to(
            q(".cl-halo"),
            {
              opacity: (_: number, el: Element) => (el.classList.contains("juno-halo") ? 0.32 : 1),
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
            },
            1.2,
          )
          .call(() => mascot.current?.cheer(), [], 1.45)
          .to(
            q(".cl-answer"),
            { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.9, ease: "expo.out" },
            1.45,
          );
        // 3. the line and the button, then the bar opens out from the middle in Juno's light
        tl.to(
          q(".cl-rise"),
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "expo.out" },
          2.05,
        )
          .to(q(".cl-glow"), { opacity: 1, scale: 1, duration: 2.2, ease: "expo.out" }, 2.2)
          .to(
            q(".cl-bar"),
            {
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 999px)",
              duration: 1,
              ease: "expo.out",
            },
            2.35,
          )
          .call(() => setTyping(true), [], 2.9)
          .to(q(".cl-sparks"), { opacity: 1, duration: 1 }, 3.1);

        // the whole close plays quickly: about two seconds from question to command bar
        tl.timeScale(1.8);
        tl.progress(0.001, true).progress(0, true).pause();
        const play = ScrollTrigger.create({
          trigger: q(".cl-stage")[0],
          start: "top 82%",
          onEnter: () => {
            if (tl.progress() === 0) tl.play(0);
          },
        });
        const reset = ScrollTrigger.create({
          trigger: q(".cl-stage")[0],
          start: "top bottom",
          onLeaveBack: () => tl.progress(0).pause(),
        });
        return () => {
          play.kill();
          reset.kill();
          tl.kill();
        };
      });
      // reduced motion: everything in its finished place
      mm.add(MQ.reduce, () => setTyping(true));
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="fx-close-title" className="relative overflow-x-clip">
      <div className="container-page">
        <div className="cl-stage mx-auto flex max-w-[1040px] flex-col items-center pb-36 pt-24 text-center md:pb-48 md:pt-36">
          <h2 id="fx-close-title" className="sr-only">
            {runOn.question} {runOn.answer} {runOn.name}
          </h2>
          <p
            aria-hidden
            className="cl-q text-[44px] font-medium leading-[48px] tracking-[-0.04em] text-balance md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[84px]"
          >
            {words.map((w, i) => (
              <span
                key={i}
                className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top"
              >
                <span className="cl-word inline-block origin-bottom-left will-change-transform">
                  {w}
                  {i < words.length - 1 && " "}
                </span>
              </span>
            ))}
          </p>

          <div
            aria-hidden
            className="mt-12 flex flex-col items-center gap-6 md:mt-14 md:flex-row md:gap-8"
          >
            <div className="relative grid place-items-center">
              <span className="cl-halo juno-halo pointer-events-none absolute size-[170px] rounded-full md:size-[190px]" />
              <span className="cl-halo juno-ring pointer-events-none absolute size-[146px] rounded-full md:size-[158px]" />
              <div className="cl-juno relative">
                <Mascot size={120} state="idle" apiRef={mascot} float interactive halo={false} />
              </div>
            </div>
            <p className="cl-answer text-[44px] font-medium leading-[48px] tracking-[-0.04em] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[84px]">
              {runOn.answer} <span className="accent-text">{runOn.name}</span>
            </p>
          </div>

          <p className="cl-rise t-body-l mt-12 text-muted md:mt-14">{finalCta.sub}</p>

          {/* the button, with the bar under it and Juno's light behind both */}
          <div className="relative mt-8 flex w-full flex-col items-center">
            <span
              aria-hidden
              className="cl-glow pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[min(1000px,140%)] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(45% 50% at 40% 55%, rgba(50,76,255,0.2), transparent 70%), radial-gradient(40% 45% at 62% 50%, rgba(143,124,255,0.15), transparent 70%)",
              }}
            />
            <div className="cl-rise relative">
              <Button
                size="xl"
                variant="white"
                href={CTA_HREF}
                trailing={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />}
              >
                {CTA_LABEL}
              </Button>
              {/* the same particles as the hero, rising from the bar into the button */}
              <span
                aria-hidden
                className="cl-sparks pointer-events-none absolute left-1/2 top-full hidden h-16 w-[220px] -translate-x-1/2 md:block"
              >
                <Sparks />
              </span>
            </div>
            <div className="cl-bar fx-ring relative mt-16 w-full max-w-[600px] rounded-full bg-[#0D1117] text-left shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
              <CommandBar
                text={typed.shown || " "}
                caret={typing && !typed.done}
                className="h-16 px-5"
                mark={<Mascot size={26} state="idle" halo={false} />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
