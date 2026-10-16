"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Apple, ArrowUpRight } from "lucide-react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { HeroOrbit } from "@/components/demo/HeroOrbit";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { connectedTools, tools } from "@/lib/story";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

const line1 = ["Juno", "runs", "the", "work."];
const line2 = ["You", "run", "the", "company."];

export function Ch0Promise() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);
  const [tracking, setTracking] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const [said, setSaid] = useState<{ id: number; text: string } | null>(null);
  const saidTimer = useRef<number | undefined>(undefined);

  // Juno's character: a small nod and a word each time a task lands.
  const onDone = (text: string) => {
    mascot.current?.nod();
    window.clearTimeout(saidTimer.current);
    setSaid({ id: Date.now(), text });
    saidTimer.current = window.setTimeout(() => setSaid(null), 2400);
  };

  // Signature moment: "Juno wakes up". Under 2 seconds total.
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
          .call(() => mascot.current?.setState("waking"), [], 0.35)
          .to(
            ".intro-word",
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.06 },
            0.3,
          )
          .call(() => mascot.current?.blink(), [], 0.8)
          .to(".intro-sub", { opacity: 1, y: 0, duration: 0.5 }, 0.85)
          .to(".intro-cta", { opacity: 1, y: 0, duration: 0.5 }, 0.95)
          .call(() => mascot.current?.look(-1, 0.2), [], 0.95)
          .call(() => mascot.current?.look(1, 0.2), [], 1.3)
          .call(() => setOrbiting(true), [], 1.1);
        tl.call(() => mascot.current?.look(0, 0), [], 1.85).call(
          () => {
            mascot.current?.setState("idle");
            setTracking(true);
          },
          [],
          1.95,
        );
        gsap.set([".intro-sub", ".intro-cta"], { y: 12 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-[88px] pb-12 md:pt-[96px] md:pb-16"
    >
      {/* soft fade into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="container-page relative z-[2] flex min-h-[calc(100svh-96px)] flex-col items-center justify-center pb-6 text-center">
        <HeroOrbit
          started={orbiting}
          onFocusPill={(el) => (el ? mascot.current?.lookAt(el) : mascot.current?.look(0, 0))}
          onDone={onDone}
        >
          {/* Juno glow: the hero's breathing light (6s), centered on Juno */}
          <div
            aria-hidden
            className="hero-glow-wrap intro-hide pointer-events-none absolute left-1/2 top-1/2 -z-10"
          >
            <div
              className="hero-glow absolute left-0 top-0 size-[420px] rounded-full blur-[80px] md:size-[560px]"
              style={{ background: "var(--glow)", transform: "translate(-50%, -50%)" }}
            />
          </div>
          {/* Juno says what it just finished */}
          <div
            className="pointer-events-none absolute bottom-[calc(50%+58px)] left-[calc(50%+54px)] z-40 hidden sm:block"
            aria-live="polite"
          >
            <AnimatePresence mode="popLayout">
              {said && (
                <motion.p
                  key={said.id}
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className="origin-bottom-left whitespace-nowrap rounded-2xl rounded-bl-sm border border-white/10 bg-[#151A24]/90 px-3.5 py-2 text-[13px] text-text shadow-[0_12px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md"
                >
                  {said.text}. <span className="text-[#A6BBFF]">Done.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="hero-mascot intro-hide">
            <Mascot
              size={150}
              state="sleeping"
              trackCursor={tracking}
              travel={12}
              float={tracking}
              wander={tracking}
              interactive={tracking}
              apiRef={mascot}
              label="Juno, a glowing orb with two eyes"
            />
          </div>
        </HeroOrbit>

        <h1
          id="hero-title"
          className="mt-4 max-w-[16ch] text-[clamp(3rem,1.5rem+4.6vw,5.75rem)] font-medium leading-[1] tracking-[-0.045em] text-balance md:mt-8 md:max-w-none"
        >
          <span className="block">
            {line1.map((w, i) => (
              <span key={i} className="intro-word inline-block will-change-transform">
                {w}
                {i < line1.length - 1 && "\u00A0"}
              </span>
            ))}
          </span>
          <span className="block">
            {line2.map((w, i) => (
              <span key={i} className="intro-word accent-text inline-block will-change-transform">
                {w}
                {i < line2.length - 1 && "\u00A0"}
              </span>
            ))}
          </span>
        </h1>
        <p className="intro-hide intro-sub t-body-l mt-5 max-w-[46ch] text-pretty text-muted md:mt-7">
          Juno learns how your company works, then handles the busywork across Slack, Gmail, Notion,
          Linear, and more.
        </p>
        <div className="intro-hide intro-cta mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
          <Button
            size="lg"
            href="#close"
            trailing={<ArrowUpRight size={17} strokeWidth={2} aria-hidden />}
          >
            Get Juno
          </Button>
          <Button
            size="lg"
            variant="secondary"
            href="#download"
            icon={<Apple size={18} strokeWidth={1.5} aria-hidden />}
          >
            Download for Mac
          </Button>
        </div>

        <div className="intro-hide intro-cta mt-9 flex flex-col items-center gap-3 md:mt-10">
          <p className="text-[13px] text-subtle">Works with the tools you already use</p>
          <ul
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            aria-label="Works with"
          >
            {connectedTools.map((id) => (
              <li
                key={id}
                title={tools[id].name}
                className="text-white/50 transition-colors duration-200 hover:text-[var(--brand)]"
                style={{
                  ["--brand" as string]:
                    tools[id].hex.toUpperCase() === "#FFFFFF" ? "#F4F6F8" : tools[id].hex,
                }}
              >
                <ToolLogo id={id} size={20} />
                <span className="sr-only">{tools[id].name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
