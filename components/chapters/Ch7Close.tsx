"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { faqs } from "@/lib/story";
import { FaqConsole } from "@/components/ui/FaqConsole";
import { PortalParticles } from "@/components/demo/PortalParticles";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

const PORTAL: [number, number] = [0.5, 0.24];
const SIGNUP = CTA_HREF;
/** How far the charge builds while you hover (particle boost). */
const FULL = 2.4;

export function Ch7Close() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);
  const cta = useRef<HTMLDivElement>(null);
  const boost = useRef(0);
  const [hot, setHot] = useState(false);
  const charging = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);
  const pulses = useRef<gsap.core.Timeline | null>(null);

  // Hovering the CTA charges Juno: the longer you hold, the stronger it gets.
  const power = (on: boolean) => {
    setHot(on);
    charging.current?.kill();
    // on hover the dots start shooting at once, then the charge keeps building while you hold
    charging.current = on
      ? gsap
          .timeline()
          .to(boost, { current: FULL * 0.6, duration: 0.15, ease: "power2.out" })
          .to(boost, { current: FULL, duration: 2.2, ease: "power1.in" })
      : gsap.to(boost, { current: 0, duration: 1.1, ease: "power2.out" });
    if (on) pulses.current?.play();
    else pulses.current?.pause();
    if (!on) gsap.to(".charge-ring", { opacity: 0, duration: 0.4, overwrite: true });
  };

  // coming back with the browser's back button: start uncharged
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setHot(false);
      boost.current = 0;
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  // The charge drives everything every frame: Juno vibrates, the rings spin up, the light swells.
  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>(".close-stage");
    const shake = root.current?.querySelector<HTMLElement>(".close-shake");
    if (!stage || !shake) return;
    let last = -1;
    let anims: Animation[] = [];
    const tick = () => {
      const c = Math.min(1.4, boost.current / FULL);
      if (c === 0 && last === 0) return;
      last = c;
      stage.style.setProperty("--charge", c.toFixed(3));
      const amp = c * 3.2;
      gsap.set(shake, {
        x: amp ? (Math.random() - 0.5) * 2 * amp : 0,
        y: amp ? (Math.random() - 0.5) * 2 * amp : 0,
      });
      if (!anims.length)
        anims = [...stage.querySelectorAll<HTMLElement>(".ring-arc, .ring-dot")].flatMap((el) =>
          el.getAnimations(),
        );
      anims.forEach((a) => (a.playbackRate = 1 + c * 5));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        // The portal powers up as the close scrolls into view.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".close-stage",
            start: "top bottom",
            end: "center 55%",
            scrub: 0.6,
          },
        });
        tl.fromTo(
          ".close-glow",
          { opacity: 0, scale: 0.55 },
          { opacity: 0.5, scale: 1, ease: "none" },
          0,
        )
          .fromTo(
            ".close-ring",
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, stagger: 0.08, ease: "power2.out" },
            0.1,
          )
          .fromTo(
            ".close-floor-wrap",
            { opacity: 0, yPercent: 20 },
            { opacity: 1, yPercent: 0, ease: "power2.out" },
            0.2,
          );
        // energy rings pulse out of Juno while it charges
        pulses.current = gsap
          .timeline({ paused: true, repeat: -1 })
          .fromTo(
            ".charge-ring",
            { scale: 0.75, opacity: 0.75 },
            { scale: 2.5, opacity: 0, duration: 1.1, ease: "power2.out", stagger: 0.37 },
            0,
          );
        // The mascot turns to look at the button.
        ScrollTrigger.create({
          trigger: ".close-stage",
          start: "top 45%",
          onEnter: () => {
            mascot.current?.look(0, -0.2);
            window.setTimeout(() => mascot.current?.lookAt(cta.current), 500);
          },
          onLeaveBack: () => mascot.current?.look(0, 0),
        });
      });
      // the portal tilts toward the cursor, layers move at different depths
      mm.add(`${MQ.desktop} and (pointer: fine)`, () => {
        const stage = root.current?.querySelector<HTMLElement>(".close-stage");
        if (!stage) return;
        gsap.set(".close-portal", { transformPerspective: 900 });
        const rx = gsap.quickTo(".close-portal", "rotationX", {
          duration: 0.8,
          ease: "power3.out",
        });
        const ry = gsap.quickTo(".close-portal", "rotationY", {
          duration: 0.8,
          ease: "power3.out",
        });
        const mx = gsap.quickTo(".close-mascot", "x", { duration: 1, ease: "power3.out" });
        const my = gsap.quickTo(".close-mascot", "y", { duration: 1, ease: "power3.out" });
        const gx = gsap.quickTo(".close-glow", "x", { duration: 1.4, ease: "power3.out" });
        const gy = gsap.quickTo(".close-glow", "y", { duration: 1.4, ease: "power3.out" });
        const fx = gsap.quickTo(".close-floor", "x", { duration: 1.4, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
          const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
          rx(-ny * 14);
          ry(nx * 18);
          mx(nx * 10);
          my(ny * 8);
          gx(-nx * 40);
          gy(-ny * 30);
          fx(-nx * 60);
        };
        const leave = () => {
          rx(0);
          ry(0);
          mx(0);
          my(0);
          gx(0);
          gy(0);
          fx(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        };
      });
      mm.add(MQ.reduce, () => {
        mascot.current?.lookAt(cta.current);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="close" aria-labelledby="faq-title" className="chapter pb-0 md:pb-0">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 id="faq-title" className="t-display-l text-balance">
            Questions, <span className="accent-text">answered.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[17px] leading-[27px] text-muted">
            Pick one. Juno will take it from here.
          </p>
        </Reveal>
        <Reveal>
          <FaqConsole items={faqs} />
        </Reveal>
      </div>

      <div
        data-hot={hot || undefined}
        className="close-stage relative mt-32 overflow-hidden pb-56 pt-32 md:mt-56 md:pb-72 md:pt-40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]"
        >
          <div
            className="close-glow absolute left-1/2 top-[30%] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] md:size-[620px]"
            style={{ background: "var(--glow)", opacity: 0.5 }}
          />
          <div className="close-boost absolute left-1/2 top-[30%] size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(166,187,255,0.55),rgba(100,120,255,0.2)_50%,transparent)] blur-2xl md:size-[520px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_30%,var(--bg)_85%)]" />
          {/* light grid floor running toward the horizon */}
          <div className="close-floor-wrap absolute inset-x-0 bottom-0 h-[26%] overflow-hidden [perspective:520px] [mask-image:radial-gradient(ellipse_55%_100%_at_50%_100%,#000_30%,transparent_100%)]">
            <div className="close-floor absolute -inset-x-[60%] bottom-0 h-[220%]">
              <span className="floor-ripple" />
              <span className="floor-ripple [animation-delay:-2s]" />
            </div>
          </div>
          <PortalParticles target={PORTAL} boost={boost} className="absolute inset-0 size-full" />
        </div>

        <div className="container-page relative flex flex-col items-center text-center">
          {/* the portal: rings orbit the mascot */}
          <div className="relative mb-16 grid place-items-center md:mb-24">
            <div
              aria-hidden
              className="close-portal pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.8] [transform-style:preserve-3d] md:scale-100"
            >
              {[180, 260, 340].map((s, i) => (
                <div
                  key={s}
                  className="close-ring absolute left-1/2 top-1/2 rounded-full ring-1 ring-white/[0.07]"
                  style={{ width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2 }}
                >
                  <div
                    className="ring-arc absolute inset-0 rounded-full"
                    style={{
                      animationDuration: `${7 + i * 4}s`,
                      animationDirection: i % 2 ? "reverse" : "normal",
                    }}
                  />
                  <span
                    className="ring-dot absolute left-1/2 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-[#A6BBFF] shadow-[0_0_10px_2px_rgba(166,187,255,0.8)]"
                    style={{
                      transformOrigin: `3px ${s / 2 + 3}px`,
                      animationDuration: `${12 + i * 6}s`,
                      animationDirection: i % 2 ? "reverse" : "normal",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="close-mascot relative">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  className="charge-ring pointer-events-none absolute inset-0 rounded-full border-2 border-[#A6BBFF]/80 opacity-0 shadow-[0_0_24px_rgba(122,143,255,0.6)]"
                />
              ))}
              <div className="close-shake relative">
                <Mascot size={150} state="calm" apiRef={mascot} travel={12} float interactive />
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -bottom-6 left-1/2 h-6 w-28 -translate-x-1/2 rounded-[50%] bg-[#6f86ff]/35 blur-xl"
            />
          </div>

          <h2 id="close-title" className="t-display-xl text-balance">
            Put Juno <span className="accent-text">to work.</span>
          </h2>
          <p className="t-body-l mt-4 max-w-[46ch] text-pretty text-muted md:mt-6">
            Give it the busywork today and see what your week looks like tomorrow.
          </p>
          <div
            ref={cta}
            onPointerEnter={() => {
              mascot.current?.cheer();
              power(true);
            }}
            onPointerLeave={() => {
              mascot.current?.lookAt(cta.current);
              power(false);
            }}
            onFocus={() => power(true)}
            onBlur={() => power(false)}
            className="mt-9 flex flex-wrap items-center justify-center gap-3 md:mt-11"
          >
            <span
              className={`cta-halo relative isolate inline-flex rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${hot ? "scale-[1.04]" : ""}`}
            >
              <Button
                size="xl"
                href={SIGNUP}
                trailing={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />}
              >
                {CTA_LABEL}
              </Button>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
