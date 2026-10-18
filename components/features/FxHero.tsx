"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CornerDownLeft,
  Library,
  MousePointerClick,
  Shapes,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/mascot/Mascot";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { features, groups, hero, type GroupKey } from "@/lib/features";
import { CommandBar, FeatureIcon, Glyph, Keycap, Sparks } from "./kit";
import { goToFeature } from "./goTo";

/**
 * "So much built in." The hero is a table of contents in Juno's own launcher: the four things
 * Juno can do on the left, the features behind the highlighted one on the right. It steps
 * through the four on its own until you take over; anything you pick jumps down the page,
 * where each feature is shown properly.
 */

const calm = [0.16, 1, 0.3, 1] as const;
const base = [0.2, 0.8, 0.2, 1] as const;
const snap = [0.3, 0, 0, 1] as const;

const topicIcon: Record<GroupKey, LucideIcon> = {
  knows: Library,
  does: MousePointerClick,
  makes: Shapes,
  terms: ShieldCheck,
};

function usePlaceholder(on: boolean) {
  const [s, setS] = useState({ i: 0, n: 0, del: false });
  useEffect(() => {
    if (!on) return;
    const p = hero.prompts[s.i];
    const t = window.setTimeout(
      () => {
        if (!s.del && s.n < p.length) setS({ ...s, n: s.n + 1 });
        else if (!s.del) setS({ ...s, del: true });
        else if (s.n > 0) setS({ ...s, n: s.n - 1 });
        else setS({ i: (s.i + 1) % hero.prompts.length, n: 0, del: false });
      },
      !s.del && s.n === p.length ? 1600 : s.del ? 18 : 42,
    );
    return () => window.clearTimeout(t);
  }, [on, s]);
  return hero.prompts[s.i].slice(0, s.n);
}

function goToChapter(key: GroupKey, reduce: boolean) {
  const el = document.getElementById(key);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 72,
    behavior: reduce ? "auto" : "smooth",
  });
}

export function FxHero() {
  const reduce = Boolean(useReducedMotion());
  const win = useRef<HTMLDivElement>(null);
  const inView = useInView(win, { amount: 0.2 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), reduce ? 0 : 600);
    const vis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [reduce]);

  const live = open && inView && visible && !reduce;
  const typed = usePlaceholder(live);
  const placeholder = live || typed ? typed : hero.prompts[0];

  // steps through the four on its own until you take over
  useEffect(() => {
    if (!live || !auto) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % groups.length), 3600);
    return () => window.clearInterval(t);
  }, [live, auto]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const n = (active + (e.key === "ArrowDown" ? 1 : -1) + groups.length) % groups.length;
    pick(n);
    win.current?.querySelector<HTMLElement>(`[data-topic="${n}"]`)?.focus();
  };

  const g = groups[active];
  const items = features.filter((f) => f.group === g.key);

  return (
    <section
      aria-labelledby="fx-title"
      className="relative overflow-x-clip pb-24 pt-[136px] md:pb-28 md:pt-[168px]"
    >
      <div className="container-page flex flex-col items-center text-center">
        <h1 id="fx-title" className="t-display-xl text-balance">
          So much{" "}
          <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_45%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">
            built in.
          </span>
        </h1>
        <p className="t-body-l mt-6 max-w-[40ch] text-pretty text-muted">{hero.sub}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="relative inline-flex">
            <Button
              size="lg"
              variant="white"
              href={CTA_HREF}
              trailing={<ArrowUpRight size={17} strokeWidth={2} aria-hidden />}
            >
              {CTA_LABEL}
            </Button>
            {/* a few particles rising off the launcher and gathering into the button */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full hidden h-20 w-[220px] -translate-x-1/2 md:block"
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : 1.2 }}
            >
              <Sparks />
            </motion.span>
          </span>
          <Button
            size="lg"
            variant="secondary"
            href="#fx-statement"
            onClick={(e) => {
              const el = document.getElementById("fx-statement");
              if (!el) return;
              e.preventDefault();
              el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
            }}
          >
            {hero.secondary}
          </Button>
        </div>
      </div>

      {/* the launcher */}
      <div className="container-page mt-16 md:mt-20">
        <div className="relative mx-auto max-w-[920px]">
          {/* glow 1 of 2: a soft light under the window */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-x-[12%] -bottom-20 top-1/3"
            style={{
              background:
                "radial-gradient(50% 55% at 35% 50%, rgba(50,76,255,0.2), transparent 70%), radial-gradient(45% 50% at 70% 55%, rgba(143,124,255,0.14), transparent 70%)",
            }}
            initial={false}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1.4, ease: calm }}
          />
          <motion.div
            ref={win}
            className="fx-ring relative overflow-hidden rounded-[24px] bg-[#0D1117] text-left shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)]"
            initial={false}
            animate={{
              clipPath: open
                ? "inset(0px 0px 0px 0px round 24px)"
                : "inset(14px calc(100% - 46px) calc(100% - 44px) 14px round 12px)",
            }}
            transition={{ duration: reduce ? 0 : 0.7, ease: base }}
          >
            <CommandBar
              text={placeholder}
              placeholder
              caret={live}
              className="border-b border-white/[0.07]"
              mark={<Mascot size={24} state="idle" halo={false} />}
            />

            <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
              {/* the four things Juno does */}
              <nav
                aria-label="What Juno does"
                onKeyDown={onKey}
                className="border-white/[0.07] p-2 md:border-r"
              >
                <ul className="grid grid-cols-2 gap-1 md:block md:space-y-1">
                  {groups.map((t, i) => {
                    const Icon = topicIcon[t.key];
                    const on = i === active;
                    const n = features.filter((f) => f.group === t.key).length;
                    return (
                      <motion.li
                        key={t.key}
                        className="shrink-0"
                        initial={false}
                        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 6 }}
                        transition={{
                          duration: reduce ? 0 : 0.2,
                          ease: snap,
                          delay: reduce ? 0 : 0.5 + i * 0.06,
                        }}
                      >
                        <button
                          type="button"
                          data-topic={i}
                          onMouseEnter={() => pick(i)}
                          onFocus={() => pick(i)}
                          onClick={() => goToChapter(t.key, reduce)}
                          aria-current={on ? "true" : undefined}
                          className={`flex w-full items-center gap-2.5 rounded-[12px] px-2.5 py-2.5 text-left outline-none transition-[background-color,box-shadow] duration-300 md:gap-3 md:px-3 md:py-3 ${
                            on ? "" : "hover:bg-white/[0.03]"
                          }`}
                          style={
                            on
                              ? {
                                  background: `linear-gradient(90deg, color-mix(in srgb, ${t.tint} 14%, transparent), rgba(255,255,255,0.03))`,
                                  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${t.tint} 18%, transparent)`,
                                }
                              : undefined
                          }
                        >
                          <Glyph icon={Icon} size={36} lit={on} />
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-[13px] font-medium leading-[17px] md:text-[14.5px] md:leading-normal ${on ? "text-text" : "text-text/75"}`}
                            >
                              {t.chapter}
                            </span>
                            <span className="hidden text-[12.5px] text-subtle md:block">
                              {t.label} · {n}
                            </span>
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* what's behind it: names and one-liners, each a link down the page */}
              <div
                className="relative h-[372px] overflow-hidden p-5 md:h-[424px] md:p-7"
                style={{
                  background: `radial-gradient(80% 70% at 100% 0%, color-mix(in srgb, ${g.tint} 13%, transparent), transparent 65%)`,
                  transition: "background 0.6s",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={g.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: open ? 1 : 0, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: base }}
                  >
                    <ul className="space-y-0.5">
                      {items.map((f, k) => (
                        <motion.li
                          key={f.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: reduce ? 0 : 0.2,
                            ease: snap,
                            delay: reduce ? 0 : 0.05 + k * 0.05,
                          }}
                        >
                          <a
                            href={`#${f.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              goToFeature(f.id);
                            }}
                            className="group flex items-center gap-3.5 rounded-[12px] px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                          >
                            <FeatureIcon f={f} size={30} />
                            <span className="min-w-0 flex-1">
                              <span className="block text-[14.5px] font-medium text-text">
                                {f.name}
                              </span>
                              <span className="block truncate text-[13px] text-muted">
                                {f.line}
                              </span>
                            </span>
                            <ArrowRight
                              size={15}
                              className="shrink-0 text-muted opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                              aria-hidden
                            />
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* footer */}
            <motion.div
              className="flex h-11 items-center justify-between border-t border-white/[0.07] px-4 text-[12px] text-muted"
              initial={false}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.3, delay: reduce ? 0 : 0.9 }}
            >
              <span>{features.length} features</span>
              <span className="hidden items-center gap-1.5 sm:flex" aria-hidden>
                <Keycap>↑</Keycap>
                <Keycap>↓</Keycap>
                <span className="mr-2">to browse</span>
                <Keycap>
                  <CornerDownLeft size={11} strokeWidth={2} />
                </Keycap>
                <span>to open</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
