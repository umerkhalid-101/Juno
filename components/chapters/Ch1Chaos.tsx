"use client";

import { useRef, useState } from "react";
import { NotificationCard } from "@/components/demo/NotificationCard";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { gsap } from "@/lib/gsap";
import { usePinnedStory } from "@/lib/usePinnedStory";
import { notifications, type CardStatus } from "@/lib/story";
import { BrandIcon } from "@/components/ui/BrandIcon";

const N = notifications.length;
const NM = notifications.filter((n) => n.mobile).length;

/** Where a card sits when it is `depth` layers behind the newest one. */
function layer(depth: number) {
  return { y: -depth * 26, scale: 1 - depth * 0.045, opacity: Math.max(0, 1 - depth * 0.14) };
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
      const chips = list.map((c) => q(`.stack-chip[data-id="${c.dataset.id}"]`)[0] as HTMLElement);
      const row = q(".stack-row")[0] as HTMLElement;
      const anchor = isMobile ? 32 : 56;
      const lift = isMobile ? 18 : 26;
      const lay = (d: number) => ({ ...layer(d), y: -d * lift });
      const proxy = { v: 0 };
      let last = -1;
      const sync = () => {
        const v = Math.round(proxy.v);
        if (v !== last) setLanded((last = v));
      };
      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.8 } });

      tl.set(list, { y: 90, scale: 1, opacity: 0, x: 0, rotate: 0 }, 0)
        .set(veils, { opacity: 0 }, 0)
        .set(chips, { opacity: 0, scale: 0.8, x: 0, y: 0 }, 0)
        // the icon row sits just above the pile and rises as the pile grows
        .set(row, { top: "auto", bottom: () => anchor + (list[0]?.offsetHeight ?? 220) + 18, y: 0 }, 0)
        .set(proxy, { v: 0, onComplete: sync }, 0);

      list.forEach((card, k) => {
        const at = 0.2 + k * 0.7;
        // a tiny jitter as each one lands
        const tilt = (k % 2 ? 1 : -1) * (isMobile ? 0.6 : 1.4);
        tl.fromTo(card, { y: 90, opacity: 0, scale: 1.04, rotate: tilt * 2 }, { ...lay(0), rotate: tilt }, at);
        list.slice(0, k).forEach((older, j) => tl.to(older, { ...lay(k - j), rotate: 0 }, at));
        if (k > 0) tl.to(row, { y: -k * lift, ease: "power2.out" }, at);
        if (k > 0) {
          tl.to(veils[k - 1], { opacity: 1, duration: 0.5 }, at);
          // the buried card's tool icon lifts off the card and flies up into its place in the row
          const chip = chips[k - 1];
          const card = list[k - 1];
          const flight = () => {
            const badge = card.querySelector<HTMLElement>("header > span")?.getBoundingClientRect();
            const home = chip.offsetParent?.getBoundingClientRect();
            if (!badge || !home) return { x: 0, y: 0 };
            return {
              x: badge.left + badge.width / 2 - (home.left + chip.offsetLeft + chip.offsetWidth / 2),
              y: badge.top + badge.height / 2 - (home.top + chip.offsetTop + chip.offsetHeight / 2),
            };
          };
          let from = { x: 0, y: 0 };
          tl.set(chip, { opacity: 1, scale: 0.8, x: () => (from = flight()).x, y: () => from.y }, at + 0.05).to(
            chip,
            { x: 0, y: 0, scale: 1, duration: 0.7, ease: "power3.inOut" },
            at + 0.06,
          );
        }
        tl.to(proxy, { v: k + 1, duration: 0.3, onUpdate: sync }, at + 0.2);
      });

      tl.to({}, { duration: 0.4 });
      return tl;
    },
    { pin: false, start: "top 65%", end: "bottom 10%", mobileEnd: "bottom 25%" },
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
            <div className="relative h-[430px] md:col-span-6 md:col-start-7 md:h-[580px]" role="list" aria-label="Work waiting on you">
              {/* tools that are waiting on you, collected left to right as the pile grows */}
              <div aria-hidden className="stack-row absolute inset-x-0 top-0 z-20 flex justify-center md:top-4">
                <div className="flex items-center">
                  {notifications.slice(0, N - 1).map((n, k) => (
                    <span
                      key={n.id}
                      data-id={n.id}
                      className={`stack-chip -ml-2.5 rounded-[10px] ring-[3px] ring-[#0B0E14] first:ml-0 md:-ml-3 md:rounded-[13px] ${n.mobile && mobileIndex[k] < NM - 1 ? "" : "max-md:hidden"}`}
                      style={{ zIndex: k + 1 }}
                    >
                      <BrandIcon id={n.tool} size={34} className="md:hidden" />
                      <BrandIcon id={n.tool} size={46} className="max-md:hidden" />
                    </span>
                  ))}
                </div>
              </div>
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
                      data-id={n.id}
                      className={`stack-card stack-pos absolute bottom-0 origin-top will-change-transform ${n.mobile ? "" : "max-md:hidden"}`}
                      style={{
                        zIndex: k + 1,
                        ["--ly-d" as string]: `${d.y}px`,
                        ["--ls-d" as string]: d.scale,
                        ["--lo-d" as string]: d.opacity,
                        ["--ly-m" as string]: `${(m.y * 18) / 26}px`,
                        ["--ls-m" as string]: m.scale,
                        ["--lo-m" as string]: m.opacity,
                      }}
                    >
                      <NotificationCard n={n} />
                      <span
                        aria-hidden
                        className="stack-veil stack-veil-pos pointer-events-none absolute inset-0 rounded-[22px] border border-white/[0.08] bg-[#10141c]"
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
