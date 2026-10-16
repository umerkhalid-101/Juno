"use client";

import { useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

const START = 47;

/**
 * The turn in the story, on its own. The unread count from the pile above
 * rolls down to zero as you scroll, and Juno appears as the answer.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const mascot = useRef<MascotApi>(null);
  // Final state by default (no JS, reduced motion).
  const [cleared, setCleared] = useState(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        setCleared(false);
        const proxy = { v: START };
        let wasDone = false;
        const render = () => {
          if (count.current) count.current.textContent = String(Math.round(proxy.v));
        };
        render();
        gsap.set(".st-answer", { opacity: 0, y: 24 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 50%", scrub: 0.5 },
        });
        tl.to(proxy, {
          v: 0,
          ease: "power1.in",
          onUpdate: () => {
            render();
            const done = Math.round(proxy.v) === 0;
            if (done === wasDone) return;
            wasDone = done;
            setCleared(done);
            if (done) window.setTimeout(() => mascot.current?.cheer(), 150);
          },
        }).to(".st-answer", { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 }, 0.75);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Meet Juno" className="chapter">
      <div className="container-page">
        <div className="mx-auto flex max-w-[900px] flex-col items-center py-16 text-center md:py-28">
          <p className="text-[clamp(2.25rem,1.3rem+3vw,4rem)] font-medium leading-[1.06] tracking-[-0.035em] text-balance">
            What if someone handled all of this?
          </p>

          <span
            className={`mt-8 inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[15px] transition-colors duration-300 ${
              cleared ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger"
            }`}
          >
            {cleared ? <Check size={16} strokeWidth={2.25} aria-hidden /> : <Bell size={16} strokeWidth={1.75} aria-hidden />}
            <span>
              <span ref={count} className="tabular-nums">
                0
              </span>{" "}
              unread
            </span>
          </span>

          <div className="st-answer mt-12 flex flex-col items-center gap-5 md:flex-row md:gap-6">
            <Mascot size={96} state="idle" apiRef={mascot} float interactive halo={false} />
            <p className="accent-text text-[clamp(2.25rem,1.3rem+3vw,4rem)] font-medium leading-[1.06] tracking-[-0.035em]">
              That&apos;s Juno.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
