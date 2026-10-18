"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { statement } from "@/lib/features";

/**
 * The argument, in two lines and nothing else. The words light as the section scrolls past:
 * what most AI does settles quiet, what Juno does lands in full, with "work" in the page's
 * own colour.
 */
export function FxStatement() {
  const root = useRef<HTMLElement>(null);
  const lead = statement.lead.split(" ");
  const punch = statement.punch.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const ws = gsap.utils.toArray<HTMLElement>(".st-w", root.current);
        gsap.set(ws, { opacity: 0.12, y: 14 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 50%", scrub: 0.4 },
        });
        ws.forEach((w, i) =>
          tl.to(w, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, i * 0.45),
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="fx-statement"
      aria-label={`${statement.lead} ${statement.punch}`}
      className="relative scroll-mt-24 py-[22vh]"
    >
      <h2 className="sr-only">
        {statement.lead} {statement.punch}
      </h2>
      <div aria-hidden className="container-page text-center">
        <p className="t-display-xl text-muted">
          {lead.map((w, i) => (
            <span key={i} className="st-w inline-block">
              {w}
              {i < lead.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <p className="t-display-xl mt-1 text-text">
          {punch.map((w, i) => {
            const last = i === punch.length - 1;
            return (
              <span key={i} className="st-w inline-block">
                {last ? (
                  <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_45%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">
                    {w}
                  </span>
                ) : (
                  w
                )}
                {!last ? " " : ""}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
