"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { notifications, type CardStatus } from "@/lib/story";

/**
 * The turn in the story, on its own. Juno works through the pile above as you scroll:
 * every card it handles leaves the "waiting" count, and the ones that need a yes are counted too.
 */
export function Statement() {
  const root = useRef<HTMLElement>(null);
  const mascot = useRef<MascotApi>(null);
  const [mobile, setMobile] = useState(false);
  // How many cards Juno has handled. Final state by default (no JS, reduced motion).
  const [handled, setHandled] = useState(notifications.length);

  const shown = notifications.filter((n) => !mobile || n.mobile);
  const cards: { id: string; status: CardStatus }[] = shown.map((n, i) => ({
    id: n.id,
    status: i < handled ? n.handled.status : "waiting",
  }));
  const waitingCount = cards.filter((c) => c.status === "waiting").length;
  const approvalCount = cards.filter((c) => c.status === "needs-approval").length;
  const clear = waitingCount === 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const isMobile = !!(ctx.conditions as { mobile: boolean }).mobile;
        const total = notifications.filter((n) => !isMobile || n.mobile).length;
        setMobile(isMobile);
        const proxy = { v: 0 };
        let last = -1;
        let wasClear = false;
        const sync = () => {
          const v = Math.round(proxy.v);
          if (v === last) return;
          last = v;
          setHandled(v);
          const nowClear = v >= total;
          if (nowClear && !wasClear) window.setTimeout(() => mascot.current?.cheer(), 150);
          wasClear = nowClear;
        };
        gsap.set(".st-answer", { opacity: 0, y: 32 });
        // Driven by scroll in both directions: scrolling back restores the waiting count.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 50%", scrub: 0.5, invalidateOnRefresh: true },
        });
        tl.fromTo(proxy, { v: 0 }, { v: total, ease: "none", onUpdate: sync, onComplete: sync, onReverseComplete: sync }).to(
          ".st-answer",
          { opacity: 1, y: 0, ease: "cubic-bezier(0.16,1,0.3,1)", duration: 0.35 },
          0.75,
        );
        sync();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Meet Juno" className="chapter">
      <div className="container-page">
        <div className="mx-auto flex max-w-[900px] flex-col items-center py-16 text-center md:py-28">
          <p className="text-[40px] font-medium leading-[44px] tracking-[-0.035em] text-balance md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[66px]">
            What if someone took this off your plate?
          </p>

          <span
            className={`t-eyebrow mt-9 inline-flex h-10 items-center gap-2.5 rounded-full border px-4 transition-colors duration-[120ms] [transition-timing-function:cubic-bezier(0.3,0,0,1)] ${
              clear ? "border-[#3DD68C]/25 bg-[#3DD68C]/[0.08] text-[#3DD68C]" : "border-[#FFB547]/25 bg-[#FFB547]/[0.08] text-[#FFB547]"
            }`}
          >
            {clear ? <Check size={14} strokeWidth={2.5} aria-hidden /> : <span className="size-2 rounded-full bg-current" />}
            <span aria-hidden className="inline-flex items-center">
              <RollingNumber value={waitingCount} className="text-[#F4F6F8]" />
              &nbsp;waiting on you
              {clear && (
                <span className="text-[#FFB547]">
                  &nbsp;·&nbsp;{approvalCount} {approvalCount === 1 ? "needs" : "need"} your yes
                </span>
              )}
            </span>
            <span className="sr-only">
              0 waiting on you. {notifications.filter((n) => (!mobile || n.mobile) && n.handled.status === "needs-approval").length} need your yes.
            </span>
          </span>

          <div className="st-answer mt-12 flex flex-col items-center gap-5 md:flex-row md:gap-6">
            <Mascot size={96} state="idle" apiRef={mascot} float interactive halo={false} />
            <p className="text-[40px] font-medium leading-[44px] tracking-[-0.035em] md:text-[56px] md:leading-[60px] lg:text-[64px] lg:leading-[66px]">
              That&apos;s Juno.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
