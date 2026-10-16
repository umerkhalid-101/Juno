"use client";

import { useRef } from "react";
import { NotificationCard } from "@/components/demo/NotificationCard";
import { gsap } from "@/lib/gsap";
import { usePinnedStory } from "@/lib/usePinnedStory";
import { notifications, unreadSteps } from "@/lib/story";

const N = notifications.length;
const PEAK = unreadSteps[N - 1];

/** Where a card sits when it is `depth` layers behind the newest one. */
function layer(depth: number) {
  return { y: -depth * 24, scale: 1 - depth * 0.05, opacity: Math.max(0, 1 - depth * 0.15) };
}

/** Monday morning: pings land on a growing stack as the section scrolls into view. */
export function Ch1Chaos() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  usePinnedStory(
    root,
    stage,
    () => {
      const q = gsap.utils.selector(root);
      const cards = q(".stack-card") as HTMLElement[];
      const veils = cards.map((c) => c.querySelector<HTMLElement>(".stack-veil")!);
      const proxy = { v: 0 };
      const render = () => {
        if (counter.current) counter.current.textContent = String(Math.round(proxy.v));
      };
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.45 } });

      tl.set(cards, { y: 90, scale: 1, opacity: 0, x: 0 }, 0)
        .set(veils, { opacity: 0 }, 0)
        .set(proxy, { v: 0, onComplete: render }, 0);

      cards.forEach((card, k) => {
        const at = 0.2 + k * 0.5;
        tl.fromTo(card, { y: 90, opacity: 0, scale: 1.04 }, { ...layer(0) }, at);
        cards.slice(0, k).forEach((older, j) => tl.to(older, layer(k - j), at));
        if (k > 0) tl.to(veils[k - 1], { opacity: 1, duration: 0.25 }, at);
        tl.to(
          proxy,
          { v: unreadSteps[k], duration: 0.3, ease: "power2.out", onUpdate: render },
          at + 0.1,
        );
      });

      tl.to({}, { duration: 0.4 });
      return tl;
    },
    { pin: false, start: "top 75%", end: "center 35%", mobileEnd: "center 40%" },
  );

  return (
    <section ref={root} id="chaos" aria-labelledby="ch1-title" className="chapter">
      <div ref={stage} className="relative">
        <div className="container-page">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
            {/* words: three beats share one spot */}
            <div className="relative md:col-span-6">
              <div className="grid">
                <div>
                  <h2
                    id="ch1-title"
                    className="text-[clamp(2.25rem,1.4rem+2.2vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.035em]"
                  >
                    You started a company.{" "}
                    <span className="accent-text">Somehow you&apos;re running inboxes.</span>
                  </h2>
                  <p className="mt-5 max-w-[40ch] text-[17px] leading-[27px] text-muted">
                    Pings, threads, and follow-ups pile up until the real work waits.
                  </p>
                </div>
              </div>

              <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-danger/30 bg-danger/10 py-2 pl-3 pr-4 text-danger">
                <span className="size-2 rounded-full bg-current" />
                <span className="text-[15px]">
                  <span ref={counter} className="font-medium tabular-nums">
                    {PEAK}
                  </span>{" "}
                  unread
                </span>
              </div>
            </div>

            {/* the pile */}
            <div
              className="relative h-[320px] md:col-span-6 md:col-start-7 md:h-[400px]"
              role="list"
              aria-label="Monday morning notifications"
            >
              <div className="absolute inset-x-0 bottom-10 flex justify-center md:bottom-16">
                {notifications.map((n, k) => {
                  const l = layer(N - 1 - k);
                  return (
                    <div
                      key={n.id}
                      role="listitem"
                      className="stack-card absolute bottom-0 origin-top will-change-transform"
                      style={{
                        zIndex: k + 1,
                        transform: `translateY(${l.y}px) scale(${l.scale})`,
                        opacity: l.opacity,
                      }}
                    >
                      <NotificationCard
                        n={n}
                        className="!bg-surface-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] md:!w-[440px]"
                      />
                      <span
                        aria-hidden
                        className="stack-veil pointer-events-none absolute inset-0 rounded-md border border-white/10 bg-surface-2"
                        style={{ opacity: k === N - 1 ? 0 : 1 }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
