"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Mascot, MascotMark, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { faqs } from "@/lib/story";
import { PortalParticles } from "@/components/demo/PortalParticles";

const ease = [0.2, 0.8, 0.2, 1] as const;
const PORTAL: [number, number] = [0.5, 0.24];
const SIGNUP = "https://www.runjuno.ai/signup";
/** How far the charge builds while you hover (particle boost). */
const FULL = 2.4;

/** Questions on the left, Juno answers on the right: the reply streams in word by word. */
function FaqConsole() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = faqs[active];

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + faqs.length) % faqs.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mx-auto mt-14 grid max-w-[1120px] gap-5 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8">
      <div
        role="tablist"
        aria-orientation="vertical"
        aria-label="Questions"
        onKeyDown={onKey}
        className="flex flex-col gap-1"
      >
        {faqs.map((q, i) => {
          const on = i === active;
          return (
            <button
              key={q.q}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`faq-tab-${i}`}
              aria-selected={on}
              aria-controls="faq-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className="group relative flex min-h-[60px] w-full items-center gap-4 rounded-2xl px-5 text-left"
            >
              {on && (
                <motion.span
                  layoutId="faq-active"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgba(166,187,255,0.12),rgba(166,187,255,0.03))] ring-1 ring-[#A6BBFF]/25"
                />
              )}
              <span
                className={`relative size-1.5 shrink-0 rounded-full transition-all duration-300 ${
                  on
                    ? "bg-[#A6BBFF] shadow-[0_0_12px_2px_rgba(166,187,255,0.7)]"
                    : "bg-white/20 group-hover:bg-white/45"
                }`}
              />
              <span
                className={`relative text-[16px] leading-6 tracking-[-0.01em] transition-colors duration-300 md:text-[17px] ${
                  on ? "text-text" : "text-muted group-hover:text-text"
                }`}
              >
                {q.q}
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                aria-hidden
                className={`relative ml-auto shrink-0 text-[#A6BBFF] transition-all duration-300 ${
                  on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* the answer, inside a slowly orbiting light border */}
      <div className="faq-panel relative rounded-[28px] p-px">
        <div
          id="faq-panel"
          role="tabpanel"
          aria-labelledby={`faq-tab-${active}`}
          className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[27px] bg-[#0a0d15] p-7 md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-32 size-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(80,110,255,0.22),transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:100%_28px] [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]"
          />

          <div className="relative flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#11151E] ring-1 ring-[#A6BBFF]/30">
              <MascotMark size={28} />
            </span>
            <div>
              <p className="text-[14px] font-medium text-text">Juno</p>
              <p className="flex items-center gap-1.5 text-[12px] text-subtle">
                <span className="faq-live size-1.5 rounded-full bg-[#5ee0a0]" />
                Answering
              </p>
            </div>
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mt-8 flex-1"
          >
            <p className="text-[13px] text-subtle">{f.q}</p>
            <motion.p
              initial="hide"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: reduce ? 0 : 0.028, delayChildren: 0.12 } },
              }}
              className="mt-3 text-[22px] leading-[1.35] tracking-[-0.02em] text-text md:text-[27px]"
            >
              {f.a.split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hide: reduce ? { opacity: 1 } : { opacity: 0, filter: "blur(8px)", y: 6 },
                    show: {
                      opacity: 1,
                      filter: "blur(0px)",
                      y: 0,
                      transition: { duration: 0.45, ease },
                    },
                  }}
                  className="inline-block whitespace-pre"
                >
                  {w}{" "}
                </motion.span>
              ))}
            </motion.p>
            {f.placeholder && (
              <span className="mt-4 inline-block rounded-sm border border-dashed border-line-strong px-1.5 font-mono text-[11px] text-subtle">
                placeholder
              </span>
            )}
          </motion.div>

          <a
            href="#contact"
            className="group relative mt-10 flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-5 py-4 ring-1 ring-white/[0.06] transition-colors hover:bg-white/[0.06]"
          >
            <span className="text-[14px] text-muted">
              Something else? <span className="text-text">Ask the team.</span>
            </span>
            <ArrowUpRight
              size={16}
              strokeWidth={1.75}
              aria-hidden
              className="text-[#A6BBFF] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Ch7Close() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);
  const cta = useRef<HTMLDivElement>(null);
  const boost = useRef(0);
  const [hot, setHot] = useState(false);
  const [launch, setLaunch] = useState<{ x: number; y: number; d: number } | null>(null);
  const reduce = useReducedMotion();
  const charging = useRef<gsap.core.Tween | null>(null);
  const pulses = useRef<gsap.core.Timeline | null>(null);

  // Hovering the CTA charges Juno: the longer you hold, the stronger it gets.
  const power = (on: boolean) => {
    if (launch) return;
    setHot(on);
    charging.current?.kill();
    charging.current = on
      ? gsap.to(boost, { current: FULL, duration: 2.6, ease: "power1.in" })
      : gsap.to(boost, { current: 0, duration: 1.1, ease: "power2.out" });
    if (on) pulses.current?.play();
    else pulses.current?.pause();
    if (!on) gsap.to(".charge-ring", { opacity: 0, duration: 0.4, overwrite: true });
  };

  // Request access: a quick wave bursts from the button and the signup page opens as it fills the screen.
  const requestAccess = (e: ReactMouseEvent) => {
    if (reduce || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // plain link behaviour
    e.preventDefault();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const d =
      2 * Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    charging.current?.kill();
    gsap.to(boost, { current: 5, duration: 0.5, ease: "power2.in" });
    mascot.current?.cheer();
    setLaunch({ x, y, d });
    window.setTimeout(() => window.location.assign(SIGNUP), 380);
  };

  // dev only: play the burst without leaving the page
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    Object.assign(window, {
      __previewLaunch: () =>
        setLaunch({
          x: window.innerWidth / 2,
          y: window.innerHeight * 0.7,
          d: 2 * Math.hypot(window.innerWidth, window.innerHeight),
        }),
    });
  }, []);

  // coming back with the browser's back button: clear the overlay
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setLaunch(null);
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
          <FaqConsole />
        </Reveal>
      </div>

      <div
        data-hot={hot || undefined}
        className="close-stage relative mt-32 overflow-hidden pb-56 pt-32 md:mt-56 md:pb-72 md:pt-40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_22%)]"
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
              className={`cta-halo relative isolate inline-flex rounded-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${launch ? "scale-125" : hot ? "scale-[1.04]" : ""}`}
            >
              <Button
                size="xl"
                href={SIGNUP}
                onClick={requestAccess}
                trailing={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />}
              >
                Request access
              </Button>
            </span>
          </div>
          {/* PLACEHOLDER: free plan or trial line */}
          <p data-placeholder="true" className="mt-6 font-mono text-[12px] text-subtle">
            Free plan or trial details go here
          </p>
        </div>
      </div>

      {/* the burst that carries you to the signup page */}
      {launch &&
        createPortal(
          <div className="fixed inset-0 z-[200]" aria-hidden>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.42, ease: [0.55, 0, 0.25, 1] }}
              className="absolute rounded-full bg-[radial-gradient(closest-side,#EAF0FF,#A6BBFF_25%,#5B6DFF_55%,#1A1F4D_80%,#07090D)]"
              style={{
                left: launch.x - launch.d / 2,
                top: launch.y - launch.d / 2,
                width: launch.d,
                height: launch.d,
              }}
            />
          </div>,
          document.body,
        )}
    </section>
  );
}
