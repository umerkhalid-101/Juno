"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Maximize2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { groups, jobs, type GroupId, type Job } from "@/lib/jobs";
import { JobVisual } from "./visuals";
import { JobPanel } from "./JobPanel";

/**
 * The catalog: four goals, twelve jobs, Stripe-style bento cards that open into a full page for
 * the job. Each closed card shows its title, an expand control, and a product moment that bleeds
 * off the card's edge.
 */

/** Bento placement per group, on the 12-column grid (desktop). */
const layout: Record<GroupId, { cls: string; card: string[] }> = {
  // wide card + two stacked
  grow: {
    cls: "lg:grid-rows-[300px_300px]",
    card: ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5"],
  },
  // three equal, tall
  keep: { cls: "lg:grid-rows-[460px]", card: ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4"] },
  // two stacked + wide card (the wide one is the middle job)
  move: {
    cls: "lg:grid-rows-[300px_300px]",
    card: [
      "lg:col-span-5 lg:col-start-1 lg:row-start-1",
      "lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1",
      "lg:col-span-5 lg:col-start-1 lg:row-start-2",
    ],
  },
  ahead: { cls: "lg:grid-rows-[460px]", card: ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4"] },
};

function JobCard({
  job,
  cls,
  onOpen,
  hidden,
}: {
  job: Job;
  cls: string;
  onOpen: (slug: string, el: HTMLElement) => void;
  hidden: boolean;
}) {
  const [live, setLive] = useState(false);
  const reduce = useReducedMotion();
  const wide = cls.includes("col-span-7");
  return (
    <motion.button
      layoutId={reduce ? undefined : `job-${job.slug}`}
      type="button"
      data-job={job.slug}
      onClick={(e) => onOpen(job.slug, e.currentTarget)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setLive(true)}
      onPointerLeave={() => setLive(false)}
      onFocus={() => setLive(true)}
      onBlur={() => setLive(false)}
      whileHover={reduce ? undefined : { scale: 1.01 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className={`group relative flex h-[420px] flex-col items-stretch justify-start overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0E1218] text-left transition-[border-color] duration-200 hover:border-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090D] md:h-[440px] lg:h-auto ${cls} ${hidden ? "opacity-0" : ""}`}
      title="See the handoff"
    >
      <span className="relative z-10 flex items-start justify-between gap-4 p-7 md:p-8">
        <span className="t-h3 line-clamp-2 max-w-[17ch] text-text">{job.title}</span>
        <span className="grid size-11 shrink-0 place-items-center">
          <span className="grid size-9 place-items-center rounded-[10px] border border-white/[0.14] bg-[#151A22] text-text transition-colors duration-200 group-hover:border-[#324CFF] group-hover:bg-[#324CFF]">
            <Maximize2 size={15} strokeWidth={1.75} aria-hidden />
          </span>
        </span>
      </span>
      <span className="sr-only">See the handoff: {job.title}</span>
      {/* the product moment, cropped by the card */}
      <span
        aria-hidden
        className={`pointer-events-none absolute ${wide ? "left-7 top-[112px] md:left-8 lg:left-14 lg:top-[140px] lg:origin-top-left lg:scale-[1.3]" : "left-7 top-[112px] md:left-8"}`}
      >
        <JobVisual slug={job.slug} live={live} />
      </span>
    </motion.button>
  );
}

export function Catalog() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const [from, setFrom] = useState<string | null>(null);
  const [active, setActive] = useState<GroupId>("grow");
  const returnFocus = useRef<HTMLElement | null>(null);
  const pushed = useRef(false);

  const lock = (on: boolean) => {
    const html = document.documentElement;
    if (on) {
      const gap = window.innerWidth - html.clientWidth;
      html.style.overflow = "hidden";
      html.style.paddingRight = gap ? `${gap}px` : "";
    } else {
      html.style.overflow = "";
      html.style.paddingRight = "";
    }
  };

  const openJob = useCallback((slug: string, el?: HTMLElement | null, push = true) => {
    returnFocus.current = el ?? document.querySelector<HTMLElement>(`[data-job="${slug}"]`);
    setFrom(slug);
    setOpen(slug);
    lock(true);
    if (push) {
      window.history.pushState({ job: slug }, "", `#${slug}`);
      pushed.current = true;
    }
  }, []);

  const close = useCallback((fromHistory = false) => {
    setOpen(null);
    lock(false);
    if (!fromHistory) {
      if (pushed.current) window.history.back();
      else window.history.replaceState(null, "", window.location.pathname);
    }
    pushed.current = false;
    window.setTimeout(() => returnFocus.current?.focus({ preventScroll: true }), 460);
  }, []);

  const go = (slug: string) => {
    setOpen(slug);
    window.history.replaceState({ job: slug }, "", `#${slug}`);
  };

  // deep links and the back button
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      return jobs.some((j) => j.slug === h) ? h : null;
    };
    const initial = fromHash();
    let t = 0;
    if (initial) {
      t = window.setTimeout(() => {
        document.getElementById("jobs-catalog")?.scrollIntoView();
        openJob(initial, null, false);
      }, 600);
    }
    const onPop = () => {
      const h = fromHash();
      if (!h) {
        if (document.documentElement.style.overflow === "hidden") close(true);
      } else openJob(h, null, false);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("popstate", onPop);
    };
  }, [openJob, close]);

  // scroll-spy for the goal bar
  useEffect(() => {
    const els = groups
      .map((g) => document.getElementById(`goal-${g.id}`))
      .filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (e) => e.isIntersecting && setActive(e.target.id.replace("goal-", "") as GroupId),
        );
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const makeOwn = () => {
    close();
    window.setTimeout(
      () =>
        document
          .getElementById("how-it-works")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }),
      500,
    );
  };

  return (
    <section
      id="jobs-catalog"
      aria-labelledby="catalog-title"
      className="relative scroll-mt-24 pb-24 pt-24 md:pb-40 md:pt-32"
    >
      {/* intro */}
      <Reveal className="container-page text-center">
        <p className="t-eyebrow text-muted">Think bigger than a to-do list</p>
        <h2 id="catalog-title" className="t-display-l mx-auto mt-5 max-w-[16ch] text-balance">
          What would you love <span className="text-muted">to stop worrying about?</span>
        </h2>
        <p className="t-body-l mx-auto mt-5 max-w-[42ch] text-muted">
          A few things you could put on Juno&apos;s plate. And finally take off yours.
        </p>
      </Reveal>

      {/* sticky goal bar */}
      <div className="sticky top-[72px] z-30 mt-14 border-y border-white/[0.06] bg-[#07090D]/80 backdrop-blur-xl md:mt-20">
        <nav
          aria-label="Goals"
          className="container-page flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#goal-${g.id}`}
              aria-current={active === g.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(`goal-${g.id}`)
                  ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
              }}
              className={`t-eyebrow inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 transition-colors duration-200 ${
                active === g.id
                  ? "border-white/[0.14] bg-[#151A22] text-text"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              {g.tab}
            </a>
          ))}
        </nav>
      </div>

      {/* the four goals */}
      <LayoutGroup>
        <motion.div
          className="container-page"
          animate={{ scale: open && !reduce ? 0.98 : 1 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {groups.map((g) => {
            const list = jobs.filter((j) => j.group === g.id);
            const l = layout[g.id];
            return (
              <div key={g.id} id={`goal-${g.id}`} className="scroll-mt-40 pt-20 md:pt-28">
                <Reveal>
                  <h2 className="t-display-l max-w-[18ch] !text-[clamp(2rem,1.4rem+1.8vw,3rem)]">
                    {g.title}
                  </h2>
                  <p className="t-body-l mt-3 max-w-[48ch] text-muted">{g.sub}</p>
                </Reveal>
                <div
                  className={`mt-10 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-12 ${l.cls}`}
                >
                  {list.map((j, k) => (
                    <JobCard
                      key={j.slug}
                      job={j}
                      cls={l.card[k]}
                      onOpen={openJob}
                      hidden={!reduce && from === j.slug && open !== null}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence onExitComplete={() => setFrom(null)}>
          {open && from && (
            <JobPanel
              key="panel"
              slug={open}
              layoutFrom={from}
              onClose={() => close()}
              onGo={go}
              onMakeOwn={makeOwn}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
