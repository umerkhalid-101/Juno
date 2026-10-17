"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  Globe,
  Inbox,
  MessageSquare,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Mascot, MascotMark } from "@/components/mascot/Mascot";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { groups, jobs, type Job, type Source } from "@/lib/jobs";
import { GoLink, JobVisual } from "./visuals";

const WEEK = ["M", "T", "W", "T", "F"];
const BEATS = ["Ask", "Rhythm", "Juno works", "Your call"] as const;
// seconds into the story where each beat starts, and when it is complete
const AT = [0, 2.4, 4.4, 7.2];
const END = 10.4;

export const sourceName = (s: Source) =>
  s === "browser"
    ? "Juno's browser"
    : s === "cms"
      ? "Juno CMS"
      : s === "drive"
        ? "Google Drive"
        : s.charAt(0).toUpperCase() + s.slice(1);
const toolLabel = (s: Source) =>
  s === "hubspot" ? "HubSpot" : s === "github" ? "GitHub" : sourceName(s);

function SourceMark({ src, size = 12 }: { src: Source; size?: number }) {
  if (src === "browser" || src === "cms")
    return <Globe size={size} strokeWidth={1.75} className="text-[#14161f]" aria-hidden />;
  return <ToolLogo id={src} size={size} className="text-[#14161f]" />;
}

/* ------------------------------------------------------------------ the 4-beat story */

function StoryPlayer({ job }: { job: Job }) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(reduce ? END : 0);
  const [hold, setHold] = useState(false);
  const done = t >= END;

  useEffect(() => {
    if (reduce || hold || done) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setT((v) => Math.min(END, v + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, hold, done]);

  const typed = job.ask.slice(0, Math.max(0, Math.floor((t - 0.2) * 42)));
  const beat = AT.filter((a) => t >= a).length - 1;
  const lit = Math.max(0, Math.min(job.connects.length, Math.floor((t - AT[2] - 0.3) / 0.35) + 1));
  const lines = Math.max(0, Math.min(3, Math.floor((t - AT[2] - 0.9) / 0.55) + 1));

  return (
    <div
      className="flex h-full flex-col"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
      onPointerLeave={() => setHold(false)}
    >
      {/* four beats */}
      <div className="flex items-center gap-2">
        {BEATS.map((b, k) => {
          const fill = Math.max(0, Math.min(1, (t - AT[k]) / ((AT[k + 1] ?? END) - AT[k])));
          return (
            <div key={b} className="min-w-0 flex-1">
              <span className="block h-[3px] overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full origin-left rounded-full bg-[#A6BBFF]"
                  style={{ transform: `scaleX(${fill})` }}
                />
              </span>
              <span
                className={`t-eyebrow mt-2 block truncate !text-[10px] ${k <= beat ? "text-text" : "text-subtle"}`}
              >
                {b}
              </span>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setT(0)}
          aria-label="Replay"
          className={`-mr-2 grid size-11 shrink-0 place-items-center rounded-full text-muted transition-opacity hover:text-text ${done ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <RotateCcw size={15} aria-hidden />
        </button>
      </div>

      {/* the conversation, newest at the bottom */}
      <div className="relative mt-4 flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_56px)]">
        {/* ask */}
        <div className="flex justify-end">
          <p className="max-w-[86%] rounded-[20px] rounded-br-md bg-[#F4F6F8] px-4 py-2.5 text-[14px] leading-[21px] text-[#07090D]">
            {typed || " "}
            {typed.length < job.ask.length && (
              <span
                aria-hidden
                className="caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#3346e0]"
              />
            )}
          </p>
        </div>

        {/* rhythm */}
        {t >= AT[1] && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-start gap-3"
          >
            <MascotMark size={28} />
            <div>
              <p className="text-[14px] text-text">
                On it. I&apos;ll come back to this{" "}
                {job.when.charAt(0).toLowerCase() + job.when.slice(1).replace(/\.$/, "")}.
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {job.days.length > 0 && (
                  <span className="flex gap-1" aria-hidden>
                    {WEEK.map((d, k) => (
                      <span
                        key={k}
                        className={`t-eyebrow grid size-7 place-items-center rounded-md border !text-[10px] transition-colors duration-[120ms] ${
                          job.days.includes(k) && t >= AT[1] + 0.3 + job.days.indexOf(k) * 0.08
                            ? "border-[#7A8FFF]/40 bg-[#324CFF]/15 text-[#A6BBFF]"
                            : "border-white/[0.08] text-subtle"
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </span>
                )}
                {t >= AT[1] + 0.9 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.12 }}
                    className="t-eyebrow inline-flex h-7 items-center rounded-md border border-[#7A8FFF]/25 bg-[#324CFF]/10 px-2 !text-[10px] text-[#A6BBFF]"
                  >
                    {job.schedule}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Juno works */}
        {t >= AT[2] && t < AT[3] + 0.6 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3"
          >
            <span className="shrink-0">
              <Mascot size={28} state="thinking" halo={false} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-1.5">
                {job.connects.map((s, k) => (
                  <span
                    key={s}
                    className={`inline-flex h-7 items-center gap-1.5 rounded-full border pl-1 pr-2.5 text-[12px] transition-colors duration-[120ms] ${
                      k < lit
                        ? "border-white/[0.14] bg-white/[0.08] text-text"
                        : "border-white/[0.06] bg-transparent text-subtle"
                    }`}
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-white">
                      <SourceMark src={s} size={11} />
                    </span>
                    {toolLabel(s)}
                  </span>
                ))}
              </div>
              <ul className="mt-3 space-y-1.5">
                {job.activity.slice(0, lines).map((a) => (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.12 }}
                    className="t-eyebrow flex items-center gap-2 !text-[10.5px] text-muted"
                  >
                    <Check size={12} strokeWidth={2.5} className="text-[#3DD68C]" aria-hidden />
                    {a}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* your call */}
        {t >= AT[3] && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pl-10"
          >
            <div className="origin-top-left scale-[0.86]" style={{ marginBottom: "-6%" }}>
              <JobVisual slug={job.slug} live />
            </div>
            {t >= AT[3] + 1.4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 max-w-[420px] rounded-2xl bg-[#151A22] p-3.5 ring-1 ring-white/10"
              >
                <p className="t-eyebrow inline-flex items-center gap-1.5 !text-[10.5px] text-[#FFB547]">
                  <span className="size-1.5 rounded-full bg-[#FFB547]" />
                  Needs your yes
                </p>
                <p className="mt-1.5 text-[14px] leading-[20px] text-text">{job.action}</p>
                <span className="mt-3 flex gap-2" aria-hidden>
                  <span className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-[#F4F6F8] text-[13px] font-semibold text-[#07090D]">
                    Approve
                  </span>
                  <span className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] text-muted ring-1 ring-white/10">
                    Edit
                  </span>
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ the job itself, as a setting */

function JobSettings({ job }: { job: Job }) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(!!reduce);
  useEffect(() => {
    if (reduce) return;
    const id = window.setTimeout(() => setOn(true), 500);
    return () => window.clearTimeout(id);
  }, [reduce]);
  return (
    <div className="flex h-full flex-col gap-4 text-[13px]">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-medium text-text">
          <MascotMark size={20} />
          Job
        </span>
        <span className="t-eyebrow inline-flex h-6 items-center gap-1.5 rounded-md bg-[#3DD68C]/10 px-2 !text-[10px] text-[#3DD68C]">
          <span className="size-1.5 rounded-full bg-[#3DD68C]" />
          Active
        </span>
      </div>
      <div>
        <p className="t-eyebrow mb-1.5 !text-[10px] text-subtle">Instruction</p>
        <p className="rounded-xl bg-white/[0.04] p-3 leading-[19px] text-text ring-1 ring-white/[0.08]">
          {job.ask}
        </p>
      </div>
      <div>
        <p className="t-eyebrow mb-1.5 !text-[10px] text-subtle">Schedule</p>
        {job.days.length > 0 ? (
          <div className="flex gap-1.5">
            {WEEK.map((d, k) => (
              <span
                key={k}
                className={`t-eyebrow grid h-8 flex-1 place-items-center rounded-md border !text-[10.5px] transition-colors duration-[120ms] ${
                  on && job.days.includes(k)
                    ? "border-[#7A8FFF]/40 bg-[#324CFF]/15 text-[#A6BBFF]"
                    : "border-white/[0.08] text-subtle"
                }`}
                style={{ transitionDelay: `${job.days.indexOf(k) * 60}ms` }}
              >
                {d}
              </span>
            ))}
          </div>
        ) : null}
        <p className="mt-2 text-muted">{job.when}</p>
      </div>
      <div>
        <p className="t-eyebrow mb-1.5 !text-[10px] text-subtle">Connected</p>
        <ul className="divide-y divide-white/[0.06] rounded-xl ring-1 ring-white/[0.08]">
          {job.connects.map((s, k) => (
            <li key={s} className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="grid size-6 place-items-center rounded-md bg-white">
                <SourceMark src={s} size={13} />
              </span>
              <span className="flex-1 text-text">{toolLabel(s)}</span>
              <span
                aria-label={on ? "On" : "Off"}
                className={`relative h-5 w-9 rounded-full transition-colors duration-[120ms] ${on ? "bg-[#324CFF]" : "bg-white/10"}`}
                style={{ transitionDelay: `${k * 80}ms` }}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform duration-[120ms] [transition-timing-function:cubic-bezier(0.3,0,0,1)] ${on ? "translate-x-[18px]" : "translate-x-0.5"}`}
                  style={{ transitionDelay: `${k * 80}ms` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ the opened card */

export function JobPanel({
  slug,
  layoutFrom,
  onClose,
  onGo,
  onMakeOwn,
}: {
  slug: string;
  layoutFrom: string;
  onClose: () => void;
  onGo: (slug: string) => void;
  onMakeOwn: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const i = jobs.findIndex((j) => j.slug === slug);
  const job = jobs[i];
  const group = groups.find((g) => g.id === job.group)!;
  const gi = groups.indexOf(group);
  const nextGroup = groups[(gi + 1) % groups.length];
  const related = [
    ...jobs.filter((j) => j.group === job.group && j.slug !== job.slug),
    jobs.find((j) => j.group === nextGroup.id)!,
  ];

  // focus, Esc, and a simple focus trap
  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // a new job swaps in place: back to the top
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [slug]);

  const go = (n: number) => onGo(jobs[(n + jobs.length) % jobs.length].slug);

  return (
    <div className="fixed inset-0 z-[70]" role="presentation">
      <motion.div
        className="absolute inset-0 bg-[#07090D]/75 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        layoutId={reduce ? undefined : `job-${layoutFrom}`}
        initial={reduce ? { opacity: 0 } : undefined}
        animate={reduce ? { opacity: 1 } : undefined}
        exit={reduce ? { opacity: 0 } : undefined}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-title"
        className="absolute inset-0 overflow-hidden bg-[#0E1218] md:inset-x-6 md:bottom-0 md:top-12 md:mx-auto md:max-w-[1200px] md:rounded-t-[28px] md:border md:border-b-0 md:border-white/[0.08] md:shadow-[0_-40px_120px_-40px_rgba(0,0,0,0.9)]"
        style={{ borderRadius: undefined }}
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-[10px] border border-white/[0.14] bg-[#151A22] text-text transition-colors hover:bg-[#1c2230] md:right-6 md:top-6"
        >
          <X size={17} aria-hidden />
        </button>

        <div ref={scroller} className="h-full overflow-y-auto overscroll-contain pb-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {/* A. header */}
              <div className="grid gap-10 px-5 pb-12 pt-16 md:grid-cols-12 md:px-12 md:pt-12">
                <div className="md:col-span-7">
                  <p className="t-eyebrow text-muted">{group.tab}</p>
                  <h2
                    id="job-title"
                    className="t-h2 mt-4 max-w-[18ch] text-balance md:text-[44px] md:leading-[48px]"
                  >
                    {job.title}
                  </h2>
                  <p className="t-body-l mt-4 max-w-[40ch] text-muted">{job.outcome}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      size="md"
                      variant="white"
                      href={CTA_HREF}
                      trailing={<ArrowUpRight size={16} strokeWidth={2} aria-hidden />}
                    >
                      {CTA_LABEL}
                    </Button>
                    <Button
                      size="md"
                      variant="secondary"
                      href="#how-it-works"
                      onClick={(e) => {
                        e.preventDefault();
                        onMakeOwn();
                      }}
                    >
                      Make it your own
                    </Button>
                  </div>
                </div>
                <div className="md:col-span-5 md:pt-10">
                  <p className="t-eyebrow text-muted">What Juno handles</p>
                  <ul className="mt-4 space-y-3">
                    {job.handles.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-[15px] text-text">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#3DD68C]/12 text-[#3DD68C]">
                          <Check size={12} strokeWidth={3} aria-hidden />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* B. the handoff */}
              <div className="mx-5 grid gap-4 rounded-[28px] border border-white/[0.08] bg-[#151A22] p-4 md:mx-12 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:p-5">
                <div className="h-[560px] rounded-[20px] border border-white/[0.06] bg-[#0B0E14] p-5">
                  <StoryPlayer key={slug} job={job} />
                </div>
                <div className="rounded-[20px] border border-white/[0.06] bg-[#0B0E14] p-5">
                  <JobSettings key={slug} job={job} />
                </div>
              </div>

              {/* C. three points */}
              <div className="grid gap-8 px-5 py-16 md:grid-cols-3 md:px-12 md:py-20">
                {[
                  { icon: MessageSquare, label: "What you ask", text: job.ask },
                  { icon: CalendarClock, label: "When it runs", text: job.when },
                  { icon: Inbox, label: "What you get back", text: job.result },
                ].map(({ icon: Icon, label, text }) => (
                  <div key={label}>
                    <span className="grid size-10 place-items-center rounded-[10px] bg-[#151A22] text-[#A6BBFF] ring-1 ring-white/[0.06]">
                      <Icon size={20} strokeWidth={1.5} aria-hidden />
                    </span>
                    <p className="t-eyebrow mt-5 text-muted">{label}</p>
                    <p className="mt-2 text-[16px] leading-[25px] text-text">{text}</p>
                  </div>
                ))}
              </div>

              {/* D. more jobs like this */}
              <div className="border-t border-white/[0.06] px-5 py-14 md:px-12">
                <h3 className="t-h3">More jobs like this.</h3>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {related.map((r) => (
                    <button
                      key={r.slug}
                      type="button"
                      onClick={() => onGo(r.slug)}
                      className="group overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#0B0E14] text-left transition-colors hover:border-white/[0.16]"
                    >
                      <span className="relative block h-[180px] overflow-hidden">
                        <span className="absolute left-5 top-5 block origin-top-left scale-[0.62]">
                          <JobVisual slug={r.slug} />
                        </span>
                      </span>
                      <span className="block border-t border-white/[0.06] p-5">
                        <span className="block text-[16px] font-medium text-text">{r.title}</span>
                        <span className="mt-1.5 block text-[14px] leading-[21px] text-muted">
                          {r.summary}
                        </span>
                        <span className="mt-4 block">
                          <GoLink>See the handoff</GoLink>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* E. proof, placeholder until Juno has a real one */}
              <figure
                data-placeholder="true"
                className="mx-auto max-w-[720px] px-5 py-16 text-center md:py-20"
              >
                <span className="t-eyebrow inline-block rounded-sm border border-dashed border-white/20 px-1.5 !text-[10px] text-subtle">
                  Placeholder
                </span>
                <p className="mt-6 text-[15px] font-semibold tracking-[0.18em] text-muted">
                  NORTHWIND
                </p>
                <blockquote className="mt-5 text-[22px] leading-[1.35] tracking-[-0.02em] text-text md:text-[26px]">
                  “{job.title} used to be a Friday afternoon. Now it is a two-minute review.”
                </blockquote>
                <figcaption className="mt-5 text-[14px] text-muted">
                  Jordan Lee, Head of operations
                </figcaption>
              </figure>

              {/* F. close */}
              <div className="border-t border-white/[0.06] px-5 py-16 text-center md:py-20">
                <p className="t-h2">Put this job on Juno&apos;s plate.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    size="md"
                    variant="white"
                    href={CTA_HREF}
                    trailing={<ArrowUpRight size={16} strokeWidth={2} aria-hidden />}
                  >
                    {CTA_LABEL}
                  </Button>
                  <Button
                    size="md"
                    variant="secondary"
                    href="#jobs-catalog"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                  >
                    See all automations
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* move through all twelve without closing */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-white/[0.06] bg-[#0E1218]/92 px-4 py-2 backdrop-blur md:px-8">
          <button
            type="button"
            onClick={() => go(i - 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[14px] text-muted transition-colors hover:text-text"
          >
            <ArrowLeft size={15} aria-hidden />
            Previous
          </button>
          <span className="t-eyebrow tabular-nums text-muted">
            {i + 1} / {jobs.length}
          </span>
          <button
            type="button"
            onClick={() => go(i + 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[14px] text-muted transition-colors hover:text-text"
          >
            Next
            <ArrowRight size={15} aria-hidden />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
