"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { Maximize2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { groups, jobs, type GroupId, type Job } from "@/lib/jobs";
import { JobScene } from "./scenes";
import { JobPanel } from "./JobPanel";

/**
 * The catalog: four goals, twelve jobs, Stripe-style bento cards that open into a full page for
 * the job. Each closed card shows its title, an expand control, and a product moment that bleeds
 * off the card's edge.
 */

/** Bento placement per group (desktop). Each group has its own shape so the page never repeats:
 *  big + two stacked, three tall, one full-width + two halves, tall + two wide. */
const layout: Record<GroupId, { cls: string; card: string[] }> = {
  grow: {
    cls: "lg:grid-rows-[300px_300px]",
    card: ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5"],
  },
  keep: { cls: "lg:grid-rows-[480px]", card: ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4"] },
  move: {
    cls: "lg:grid-rows-[380px_320px]",
    card: [
      "lg:col-span-6 lg:col-start-1 lg:row-start-2",
      "lg:col-span-12 lg:row-start-1",
      "lg:col-span-6 lg:col-start-7 lg:row-start-2",
    ],
  },
  ahead: {
    cls: "lg:grid-rows-[300px_300px]",
    card: [
      "lg:col-span-8 lg:col-start-5 lg:row-start-1",
      "lg:col-span-8 lg:col-start-5 lg:row-start-2",
      "lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1",
    ],
  },
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
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const seen = useInView(ref, { amount: 0.25 });
  // which shape this card is, so its scene is framed to fit
  const fit = cls.includes("col-span-12")
    ? "wide"
    : cls.includes("row-span-2")
      ? cls.includes("col-span-4")
        ? "tall"
        : "big"
      : cls.includes("col-span-8")
        ? "landscape"
        : cls.includes("col-span-4")
          ? "tall"
          : "small";
  return (
    <motion.button
      ref={ref}
      layoutId={reduce ? undefined : `job-${job.slug}`}
      type="button"
      data-job={job.slug}
      onClick={(e) => onOpen(job.slug, e.currentTarget)}
      whileHover={reduce ? undefined : { scale: 1.01 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className={`group relative isolate flex h-[420px] flex-col items-stretch justify-start overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0E1218] text-left transition-[border-color] duration-200 hover:border-white/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090D] md:h-[440px] lg:h-auto ${cls} ${hidden ? "opacity-0" : ""}`}
      title="See the handoff"
    >
      {/* the job's own world: colour, product, motion */}
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <JobScene slug={job.slug} play={seen} fit={fit} ribbon={fit === "big" || fit === "wide"} />
      </span>
      <span className="relative z-10 flex items-start justify-between gap-4 p-7 md:p-8">
        <span className="t-h3 max-w-[17ch] text-text">{job.title}</span>
        <span className="grid size-11 shrink-0 place-items-center">
          <span className="grid size-9 place-items-center rounded-[10px] border border-white/[0.14] bg-[#151A22] text-text transition-colors duration-200 group-hover:border-[#324CFF] group-hover:bg-[#324CFF]">
            <Maximize2 size={15} strokeWidth={1.75} aria-hidden />
          </span>
        </span>
      </span>
      <span className="sr-only">See the handoff: {job.title}</span>
    </motion.button>
  );
}

export function Catalog() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);
  const [from, setFrom] = useState<string | null>(null);
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
        <h2 id="catalog-title" className="t-display-l mx-auto max-w-[16ch] text-balance">
          What would you love <span className="text-muted">to stop worrying about?</span>
        </h2>
        <p className="t-body-l mx-auto mt-5 max-w-[42ch] text-muted">
          A few things you could put on Juno&apos;s plate. And finally take off yours.
        </p>
      </Reveal>

      {/* the four goals */}
      <LayoutGroup>
        <motion.div
          className="container-page mt-6 md:mt-10"
          animate={{ scale: open && !reduce ? 0.98 : 1 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div>
            {groups.map((g) => {
              const list = jobs.filter((j) => j.group === g.id);
              const l = layout[g.id];
              return (
                <div key={g.id} id={`goal-${g.id}`} data-goal={g.id} className="scroll-mt-28">
                  {/* a quiet section break: the topic, small, with its line beside it */}
                  <div className="flex flex-col gap-1.5 pb-6 pt-16 md:flex-row md:items-baseline md:justify-between md:gap-8 md:pb-7 md:pt-24">
                    <h2 className="text-[24px] font-medium leading-[1.15] tracking-[-0.025em] text-text md:text-[32px]">
                      {g.title}
                    </h2>
                    <p className="text-[15px] leading-[23px] text-muted md:text-right">{g.sub}</p>
                  </div>
                  <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-12 ${l.cls}`}>
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
          </div>
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
