"use client";

import { useRef, useState } from "react";
import { NotificationCard } from "@/components/demo/NotificationCard";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { gsap } from "@/lib/gsap";
import { usePinnedStory } from "@/lib/usePinnedStory";
import { notifications, type CardStatus } from "@/lib/story";

const N = notifications.length;
const NM = notifications.filter((n) => n.mobile).length;

/** Where a card sits when it is `depth` layers behind the newest one. */
function layer(depth: number) {
  return { y: -depth * 24, scale: 1 - depth * 0.05, opacity: Math.max(0, 1 - depth * 0.15) };
}

/** Position among the cards shown on mobile (5 of 8), or -1 when hidden there. */
const mobileIndex = notifications.map((n, i) => (n.mobile ? notifications.slice(0, i).filter((m) => m.mobile).length : -1));

/** Monday morning: work lands on a growing pile as the section scrolls into view. */
export function Ch1Chaos() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  // Single source of truth: how many cards have landed, and which cards this screen shows.
  // Final state by default (no JS, reduced motion).
  const [landed, setLanded] = useState(N);
  const [mobile, setMobile] = useState(false);

  const shown = notifications.filter((n) => !mobile || n.mobile);
  const cards: { id: string; status: CardStatus | "incoming" }[] = shown.map((n, i) => ({
    id: n.id,
    status: i < landed ? "waiting" : "incoming",
  }));
  const waitingCount = cards.filter((c) => c.status === "waiting").length;

  usePinnedStory(
    root,
    stage,
    ({ isMobile }) => {
      setMobile(isMobile);
      const q = gsap.utils.selector(root);
      const all = q(".stack-card") as HTMLElement[];
      const list = all.filter((c) => !isMobile || c.dataset.mobile === "true");
      const veils = list.map((c) => c.querySelector<HTMLElement>(".stack-veil")!);
      const lift = isMobile ? 18 : 24;
      const lay = (d: number) => ({ ...layer(d), y: -d * lift });
      const proxy = { v: 0 };
      let last = -1;
      const sync = () => {
        const v = Math.round(proxy.v);
        if (v !== last) setLanded((last = v));
      };
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.45 } });

      tl.set(list, { y: 90, scale: 1, opacity: 0, x: 0, rotate: 0 }, 0)
        .set(veils, { opacity: 0 }, 0)
        .set(proxy, { v: 0, onComplete: sync }, 0);

      list.forEach((card, k) => {
        const at = 0.2 + k * 0.5;
        // a tiny jitter as each one lands
        const tilt = (k % 2 ? 1 : -1) * (isMobile ? 0.6 : 1.4);
        tl.fromTo(card, { y: 90, opacity: 0, scale: 1.04, rotate: tilt * 2 }, { ...lay(0), rotate: tilt }, at);
        list.slice(0, k).forEach((older, j) => tl.to(older, { ...lay(k - j), rotate: 0 }, at));
        if (k > 0) tl.to(veils[k - 1], { opacity: 1, duration: 0.25 }, at);
        tl.to(proxy, { v: k + 1, duration: 0.2, onUpdate: sync }, at + 0.1);
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
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
            <div className="relative md:col-span-6">
              <h2
                id="ch1-title"
                className="text-[40px] font-medium leading-[44px] tracking-[-0.035em] text-balance md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[66px]"
              >
                You started a company. <span className="text-muted">Now it runs you.</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[17px] leading-[27px] text-muted">
                Launches slip, deals go quiet, investors wait. The real work gets whatever time is left.
              </p>

              {/* counter: computed from card state */}
              <p className="mt-8 flex items-baseline gap-1.5 text-[17px] leading-[27px] text-muted">
                <RollingNumber value={waitingCount} className="text-[17px] font-medium text-text" />
                <span aria-hidden>{waitingCount === 1 ? "thing" : "things"} waiting on you</span>
                <span className="sr-only">{mobile ? NM : N} things waiting on you</span>
              </p>
            </div>

            {/* the pile */}
            <div className="relative h-[330px] md:col-span-6 md:col-start-7 md:h-[420px]" role="list" aria-label="Work waiting on you">
              <div className="absolute inset-x-0 bottom-8 flex justify-center md:bottom-14">
                {notifications.map((n, k) => {
                  const d = layer(N - 1 - k);
                  const mi = mobileIndex[k];
                  const m = layer(mi < 0 ? 0 : NM - 1 - mi);
                  return (
                    <div
                      key={n.id}
                      role="listitem"
                      data-mobile={n.mobile}
                      className={`stack-card stack-pos absolute bottom-0 origin-top will-change-transform ${n.mobile ? "" : "max-md:hidden"}`}
                      style={{
                        zIndex: k + 1,
                        ["--ly-d" as string]: `${d.y}px`,
                        ["--ls-d" as string]: d.scale,
                        ["--lo-d" as string]: d.opacity,
                        ["--ly-m" as string]: `${(m.y * 18) / 24}px`,
                        ["--ls-m" as string]: m.scale,
                        ["--lo-m" as string]: m.opacity,
                      }}
                    >
                      <NotificationCard n={n} />
                      <span
                        aria-hidden
                        className="stack-veil stack-veil-pos pointer-events-none absolute inset-0 rounded-[18px] border border-white/[0.08] bg-[#10141c]"
                        style={{ ["--vo-d" as string]: k === N - 1 ? 0 : 1, ["--vo-m" as string]: mi === NM - 1 ? 0 : 1 }}
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
