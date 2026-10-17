"use client";

import { useRef, useState } from "react";
import { Apple, ArrowUpRight } from "lucide-react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { HeroOrbit } from "@/components/demo/HeroOrbit";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const line1 = ["Knows", "your", "company."];
const line2 = ["Gets", "things", "done."];

export function Ch0Promise() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);
  const mascotWrap = useRef<HTMLDivElement>(null);
  const [tracking, setTracking] = useState(false);
  const [orbiting, setOrbiting] = useState(false);

  // Signature moment: Juno wakes up and the headline lands word by word.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.reduce, () => {
        gsap.set(".intro-hide, .intro-word", { clearProps: "all", opacity: 1 });
        mascot.current?.setState("idle");
        setOrbiting(true);
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        gsap.set([".intro-sub", ".intro-cta"], { y: 14 });
        tl.fromTo(
          ".hero-mascot",
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.45 },
          0,
        )
          .fromTo(
            ".hero-glow-wrap",
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: "power2.out" },
            0,
          )
          .call(() => mascot.current?.setState("waking"), [], 0.3)
          // words land: base timing, 60ms stagger
          .to(
            ".intro-word",
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.4,
              stagger: 0.06,
              ease: "cubic-bezier(0.2,0.8,0.2,1)",
            },
            0.4,
          )
          .call(() => mascot.current?.blink(), [], 0.75)
          // subhead and buttons: calm timing
          .to(
            ".intro-sub",
            { opacity: 1, y: 0, duration: 0.8, ease: "cubic-bezier(0.16,1,0.3,1)" },
            0.9,
          )
          .to(
            ".intro-cta",
            { opacity: 1, y: 0, duration: 0.8, ease: "cubic-bezier(0.16,1,0.3,1)", stagger: 0.08 },
            1.0,
          )
          .call(() => mascot.current?.look(-1, 0.2), [], 0.95)
          .call(() => mascot.current?.look(1, 0.2), [], 1.3)
          .call(() => setOrbiting(true), [], 1.1)
          .call(() => mascot.current?.look(0, 0), [], 1.85)
          .call(
            () => {
              mascot.current?.setState("idle");
              setTracking(true);
            },
            [],
            1.95,
          );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-[88px] pb-12 md:pt-[96px] md:pb-16"
      onPointerEnter={() => tracking && mascot.current?.look(0, 0)}
      onPointerLeave={() => mascot.current?.look(0, 0)}
    >

      <div className="container-page relative z-[2] flex min-h-[calc(100svh-96px)] flex-col items-center justify-center pb-6 text-center">
        <HeroOrbit
          started={orbiting}
          onFocusPill={(el) => (el ? mascot.current?.lookAt(el) : mascot.current?.look(0, 0))}
          onDone={() => mascot.current?.nod()}
        >
          {/* Juno glow (glow 1 of 2): breathes slowly, centered on Juno */}
          <div
            aria-hidden
            className="hero-glow-wrap intro-hide pointer-events-none absolute left-1/2 top-1/2 -z-10"
          >
            <div
              className="hero-glow absolute left-0 top-0 size-[420px] rounded-full blur-[80px] md:size-[560px]"
              style={{ background: "var(--glow)", transform: "translate(-50%, -50%)" }}
            />
          </div>
          <div ref={mascotWrap} className="hero-mascot intro-hide">
            <Mascot
              size={150}
              state="sleeping"
              trackCursor={tracking}
              travel={12}
              trackTravel={6}
              float={tracking}
              interactive={tracking}
              apiRef={mascot}
              label="Juno, a glowing orb with two eyes"
            />
          </div>
        </HeroOrbit>

        <h1
          id="hero-title"
          className="mt-4 max-w-[16ch] text-[48px] font-medium leading-[50px] tracking-[-0.04em] text-balance md:max-w-none md:text-[72px] md:leading-[72px] lg:text-[88px] lg:leading-[88px]"
        >
          <span className="block">
            {line1.map((w, i) => (
              <span key={i} className="intro-word inline-block will-change-transform">
                {w}
                {i < line1.length - 1 && " "}
              </span>
            ))}
          </span>
          <span className="block text-muted">
            {line2.map((w, i) => (
              <span key={i} className="intro-word inline-block will-change-transform">
                {w}
                {i < line2.length - 1 && " "}
              </span>
            ))}
          </span>
        </h1>
        <p className="intro-hide intro-sub t-body-l mt-6 max-w-[46ch] text-pretty text-muted md:mt-7">
          Juno keeps up with your company and puts that knowledge to work across your apps.
        </p>
        <div className="intro-hide intro-cta mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
          <Button
            size="xl"
            variant="white"
            href={CTA_HREF}
            trailing={<ArrowUpRight size={17} strokeWidth={2} aria-hidden />}
          >
            {CTA_LABEL}
          </Button>
          <Button
            size="xl"
            variant="secondary"
            href="#download"
            icon={<Apple size={18} strokeWidth={1.5} aria-hidden />}
          >
            Download for Mac
          </Button>
        </div>
      </div>
    </section>
  );
}
