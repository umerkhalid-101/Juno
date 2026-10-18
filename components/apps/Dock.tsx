"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, BatteryFull, BookOpen, Calculator, ChevronsUp, DoorOpen, FolderCheck, Send, Wifi } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { MascotMark } from "@/components/mascot/Mascot";
import { CTA_HREF } from "@/lib/site";
import { apps, type AppId } from "@/lib/apps";
import { Section, Window, base } from "./kit";
import { CustomerPortal, FeedbackBoard, HelpCenter, LaunchSite, RoiCalculator, TeamOnboarding } from "./minis";

const d = apps.dock;

/** Each app, its icon, its address and the colour its light throws on the desktop. */
const APPS: Record<AppId, { Glyph: ComponentType<{ size?: number; strokeWidth?: number }>; url: string; chrome: string; tint: string; App: ComponentType }> = {
  portal: { Glyph: FolderCheck, url: "Customer space", chrome: "#E4E7DA", tint: "86,140,70", App: CustomerPortal },
  feedback: { Glyph: ChevronsUp, url: "Ideas & roadmap", chrome: "#E2DFF2", tint: "112,84,230", App: FeedbackBoard },
  onboarding: { Glyph: DoorOpen, url: "Welcome aboard", chrome: "#F2E8D8", tint: "200,84,110", App: TeamOnboarding },
  roi: { Glyph: Calculator, url: "Make room for more", chrome: "#E3E6DC", tint: "40,150,120", App: RoiCalculator },
  help: { Glyph: BookOpen, url: "Your help center", chrome: "#E2E7F3", tint: "60,90,255", App: HelpCenter },
  launch: { Glyph: Send, url: "Your next big thing", chrome: "#EEDCCF", tint: "226,100,56", App: LaunchSite },
};
const IDS = d.apps.map((a) => a.id);
const TILE = 58;

/** A clock for the menu bar, set on the client so the server and browser agree. */
function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      setT(new Date().toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).replace(",", ""));
    const t0 = window.setTimeout(fmt, 0);
    const iv = window.setInterval(fmt, 30_000);
    return () => {
      window.clearTimeout(t0);
      window.clearInterval(iv);
    };
  }, []);
  return t;
}

/** Small apps on a Juno desktop: pick one from the dock and it opens, ready to use. */
export function Dock() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<AppId>("portal");
  const [hover, setHover] = useState<number | null>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const clock = useClock();
  // like a reel: the apps sit side by side and every 3 seconds the screen scrolls across to the
  // next one (back to the first after the last). Hovering the desktop or scrolling away pauses it;
  // a trackpad swipe or the dock moves it too.
  const screen = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const glide = useRef<ReturnType<typeof animate> | null>(null);
  const moving = useRef(false);
  const inView = useInView(screen, { amount: 0.4 });
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (reduce || held || !inView) return;
    const t = window.setTimeout(() => setOpen((o) => IDS[(IDS.indexOf(o) + 1) % IDS.length]), 3000);
    return () => window.clearTimeout(t);
  }, [open, reduce, held, inView]);
  const slideTo = useCallback(
    (i: number, instant = false) => {
      const el = reel.current;
      if (!el) return;
      glide.current?.stop();
      const to = i * el.clientWidth;
      if (instant || reduce) {
        el.scrollLeft = to;
        return;
      }
      moving.current = true;
      glide.current = animate(el.scrollLeft, to, {
        duration: 0.85,
        ease: [0.65, 0, 0.35, 1],
        onUpdate: (v) => {
          el.scrollLeft = v;
        },
        onComplete: () => {
          moving.current = false;
        },
      });
    },
    [reduce],
  );
  useEffect(() => {
    const i = IDS.indexOf(open);
    slideTo(i);
    // on a phone the dock scrolls too: keep the open app's icon in view
    const b = btns.current[i];
    const bar = b?.parentElement;
    if (b && bar && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }, [open, slideTo, reduce]);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  // keep the open app lined up when the window resizes
  useEffect(() => {
    const fit = () => slideTo(IDS.indexOf(openRef.current), true);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [slideTo]);
  // a swipe across the reel settles on the nearest app
  const settle = useRef(0);
  const onReelScroll = () => {
    if (moving.current) return;
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const el = reel.current;
      if (!el) return;
      const i = Math.round(el.scrollLeft / el.clientWidth);
      if (IDS[i] === openRef.current) slideTo(i);
      else setOpen(IDS[i]);
    }, 140);
  };
  const idx = IDS.indexOf(open);
  const app = d.apps[idx];
  const tint = APPS[open].tint;
  const label = hover ?? idx;

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const at = btns.current.findIndex((b) => b === document.activeElement);
    btns.current[(Math.max(at, 0) + step + IDS.length) % IDS.length]?.focus();
  };

  return (
    <Section id="app-ideas" labelledBy="dock-title">
      <ChapterIntro id="dock-title" lead={d.lead} muted={d.muted} sub={d.sub} />

      <div className="mt-14 md:mt-20">
        <div>
          {/* the screen */}
          <div
            ref={screen}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
            onPointerLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={() => setHeld(false)}
            className="mx-auto max-w-[1240px] rounded-[30px] border border-white/[0.08] bg-[#0A0C11] p-2 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.9)] md:rounded-[36px] md:p-2.5"
          >
            <div
              className="relative h-[700px] overflow-hidden rounded-[24px] bg-[#05070B] md:h-[780px] md:rounded-[28px]"
              style={{ ["--tint" as string]: tint }}
            >
              {/* wallpaper: dark, with the open app's light falling across it */}
              <div aria-hidden className="apps-wall absolute inset-0" />

              {/* menu bar */}
              <div className="relative z-20 flex h-9 items-center gap-5 px-4 text-[12.5px] text-text/85 md:h-10 md:px-6">
                <MascotMark size={15} />
                <span className="font-semibold text-text">{app.name}</span>
                {["File", "Edit", "View", "Share", "Help"].map((m) => (
                  <span key={m} className="hidden text-text/70 md:inline">
                    {m}
                  </span>
                ))}
                <span className="ml-auto hidden items-center gap-1.5 text-text/70 lg:flex">
                  <span className="size-1.5 rounded-full bg-[#3DD68C]" />
                  Built by Juno
                </span>
                <Wifi size={14} className="hidden text-text/70 sm:block" aria-hidden />
                <BatteryFull size={16} className="hidden text-text/70 sm:block" aria-hidden />
                <span className="min-w-[110px] text-right tabular-nums text-text/85 max-sm:ml-auto max-sm:min-w-0">{clock}</span>
              </div>

              {/* the apps, side by side on a reel that scrolls across */}
              <div
                ref={reel}
                onScroll={onReelScroll}
                className="absolute [scrollbar-width:none] [&::-webkit-scrollbar]:hidden inset-x-0 bottom-[118px] top-[52px] z-10 flex overflow-x-auto overscroll-x-contain md:bottom-[132px] md:top-[76px]"
              >
                {IDS.map((id) => {
                  const { App, url, chrome } = APPS[id];
                  return (
                    <div key={id} className="h-full w-full shrink-0 px-3 md:px-10" aria-hidden={id !== open} inert={id !== open}>
                      <Window url={url} chrome={chrome} className="mx-auto h-full max-w-[920px]">
                        <App />
                      </Window>
                    </div>
                  );
                })}
              </div>

              {/* the dock, with the label of the app you're on (or pointing at) above it */}
              <div className="absolute inset-x-0 bottom-5 z-20 flex flex-col items-center px-3 md:bottom-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    transition={{ duration: 0.15 }}
                    className="mb-3 whitespace-nowrap rounded-[8px] border border-white/[0.12] bg-[#151A22] px-3 py-1 text-[13px] text-text"
                  >
                    {d.apps[label].name}
                  </motion.span>
                </AnimatePresence>
                <div
                  role="toolbar"
                  aria-label="App ideas"
                  onKeyDown={onKey}
                  onPointerLeave={() => setHover(null)}
                  className="flex max-w-full items-end gap-2.5 overflow-x-auto rounded-[24px] border border-white/[0.1] bg-[#0D1016]/90 p-2.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)] lg:overflow-visible"
                >
                  {d.apps.map((a, i) => {
                    const { Glyph } = APPS[a.id];
                    const on = a.id === open;
                    const dist = hover === null ? 9 : Math.abs(hover - i);
                    const scale = reduce ? 1 : dist === 0 ? 1.18 : dist === 1 ? 1.06 : 1;
                    return (
                      <motion.button
                        key={a.id}
                        ref={(el) => {
                          btns.current[i] = el;
                        }}
                        type="button"
                        aria-label={a.name}
                        aria-pressed={on}
                        tabIndex={on ? 0 : -1}
                        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
                        onFocus={() => setHover(i)}
                        onBlur={() => setHover(null)}
                        onClick={() => setOpen(a.id)}
                        animate={{ scale, y: on ? -4 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`grid shrink-0 origin-bottom place-items-center rounded-[16px] ring-1 transition-[background,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF] ${
                          on
                            ? "bg-[linear-gradient(180deg,#3A404C,#1C2028)] text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] ring-white/20"
                            : "bg-[linear-gradient(180deg,#1A1E26,#12151B)] text-muted ring-white/[0.07] hover:text-text"
                        }`}
                        style={{ width: TILE, height: TILE }}
                      >
                        <Glyph size={22} strokeWidth={1.6} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* the open idea, in words */}
          <div className="mx-auto mt-10 max-w-[620px] text-center" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={open} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.4, ease: base }}>
                <h3 className="text-[24px] font-medium leading-[30px] tracking-[-0.025em] text-text md:text-[28px] md:leading-[34px]">{app.headline}</h3>
                <p className="mx-auto mt-3 max-w-[48ch] text-[16px] leading-[26px] text-muted">{app.body}</p>
                <a href={CTA_HREF} className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#A6BBFF] transition-colors hover:text-text">
                  {d.try}
                  <ArrowUpRight size={15} aria-hidden />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* the other ideas, for search and screen readers */}
      <div className="sr-only">
        {d.apps
          .filter((a) => a.id !== open)
          .map((a) => (
            <div key={a.id}>
              <h3>{a.name}</h3>
              <p>{a.headline}</p>
              <p>{a.body}</p>
            </div>
          ))}
      </div>
    </Section>
  );
}
