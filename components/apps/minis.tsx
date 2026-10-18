"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  Folder,
  LayoutGrid,
  LifeBuoy,
  MessageCircle,
  MessageSquare,
  Plug,
  Plus,
  Receipt,
  Rocket,
  Search,
  Sparkles,
  ThumbsUp,
  Users,
} from "lucide-react";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Face } from "@/components/jobs/scenes";
import { DemoNote, Diff, base, calm } from "./kit";

/**
 * The six small apps Juno builds. Each is a believable product for a believable company, with its
 * own palette, real people and working controls. State stays in the browser.
 * Layouts answer to their window (container queries), so they read at any size.
 */

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF]";

function Pill({ children, ink, line, className = "" }: { children: ReactNode; ink?: string; line: string; className?: string }) {
  return (
    <span className={`inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-[11px] ${className}`} style={{ borderColor: line, color: ink }}>
      {children}
    </span>
  );
}

function SideItem({ icon, label, on, badge, ink, muted, soft, onClick }: { icon: ReactNode; label: string; on?: boolean; badge?: number; ink: string; muted: string; soft: string; onClick?: () => void }) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={`flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-[12.5px] ${onClick ? focus : ""}`}
      style={{ background: on ? soft : "transparent", color: on ? ink : muted }}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {badge ? (
        <span className="rounded-full px-1.5 text-[10.5px] font-medium" style={{ background: ink, color: "#fff" }}>
          {badge}
        </span>
      ) : null}
    </Tag>
  );
}

/* ------------------------------------------------------------------ 1. Customer portal */

export const PORTAL = { bg: "#F1F2EA", panel: "#E7EADB", ink: "#1f2a1c", muted: "#6b7262", accent: "#2F3A2A", soft: "#E1E6D3", line: "rgba(31,42,28,0.12)" };

const UPDATES = [
  { who: "leo" as const, name: "Leo", text: "uploaded Homepage design v3", at: "10:12" },
  { who: "maya" as const, name: "Maya", text: "shared the new sitemap", at: "Yesterday" },
  { who: "sam" as const, name: "Sam", text: "booked your review call for Thursday", at: "Mon" },
];

export function CustomerPortal({
  approveCard = true,
  filesTab = true,
  launchDate = false,
  marks = {},
}: {
  approveCard?: boolean;
  filesTab?: boolean;
  launchDate?: boolean;
  marks?: { approve?: number | null; files?: number | null; date?: number | null };
}) {
  const C = PORTAL;
  const [tab, setTab] = useState<"overview" | "files">("overview");
  const [approved, setApproved] = useState(false);
  const steps = ["Kickoff", "Design", "Build", "Launch"];
  const at = approved ? 2 : 1;
  const pct = approved ? 62 : 45;
  const view = filesTab ? tab : "overview";

  return (
    <div className="flex h-full" style={{ background: C.bg, color: C.ink }}>
      {/* client sidebar */}
      <aside className="hidden w-[176px] shrink-0 flex-col border-r p-3 @2xl:flex" style={{ borderColor: C.line, background: C.panel }}>
        <div className="flex items-center gap-2 px-1.5 py-1">
          <span className="grid size-7 place-items-center rounded-[8px] text-[12px] font-bold text-white" style={{ background: C.accent }}>
            N
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[12.5px] font-semibold">Northwind</span>
            <span className="block text-[10.5px]" style={{ color: C.muted }}>
              Client space
            </span>
          </span>
        </div>
        <div className="mt-4 space-y-0.5">
          <SideItem icon={<LayoutGrid size={14} aria-hidden />} label="Overview" on={view === "overview"} ink={C.ink} muted={C.muted} soft={C.soft} onClick={() => setTab("overview")} />
          {filesTab && <SideItem icon={<Folder size={14} aria-hidden />} label="Files" on={view === "files"} ink={C.ink} muted={C.muted} soft={C.soft} onClick={() => setTab("files")} />}
          <SideItem icon={<MessageSquare size={14} aria-hidden />} label="Messages" badge={2} ink={C.ink} muted={C.muted} soft={C.soft} />
          <SideItem icon={<Receipt size={14} aria-hidden />} label="Invoices" ink={C.ink} muted={C.muted} soft={C.soft} />
        </div>
        <div className="mt-auto rounded-[10px] bg-white/60 p-2.5">
          <p className="text-[10.5px]" style={{ color: C.muted }}>
            Your contact
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Face who="leo" size={26} className="!ring-0" />
            <span className="leading-tight">
              <span className="block text-[12px] font-medium">Leo Park</span>
              <span className="block text-[10.5px]" style={{ color: C.muted }}>
                Studio North
              </span>
            </span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col p-5 @2xl:p-6">
        <div className="flex items-center gap-2 whitespace-nowrap text-[12.5px]" style={{ color: C.muted }}>
          <Folder size={14} className="shrink-0" aria-hidden />
          Website refresh
          <Pill line={C.line} ink={C.ink} className="ml-1">
            In progress
          </Pill>
          <span className="ml-auto flex -space-x-1.5">
            <Face who="leo" size={24} />
            <Face who="maya" size={24} />
            <Face who="sam" size={24} />
          </span>
        </div>
        <p className="mt-4 text-[26px] font-semibold leading-[30px] tracking-[-0.035em] @2xl:text-[28px] @2xl:leading-[32px]">
          Good things
          <br />
          <span style={{ color: C.accent }}>are taking shape.</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-[13px]" style={{ color: C.muted }}>
            Your website refresh, all in one place.
          </p>
          {launchDate && (
            <Diff k={marks.date ?? null} label="Added" className="w-fit">
              <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: C.soft, color: C.accent }}>
                <CalendarDays size={13} aria-hidden />
                Launches Friday, June 12
              </span>
            </Diff>
          )}
        </div>

        {/* tabs (on narrow windows, where the sidebar is hidden) */}
        <div className="mt-4 flex gap-5 border-b text-[13px] @2xl:hidden" style={{ borderColor: C.line }} role="tablist">
          <button type="button" role="tab" aria-selected={view === "overview"} onClick={() => setTab("overview")} className={`relative h-9 ${focus}`} style={{ color: view === "overview" ? C.ink : C.muted }}>
            Overview
            {view === "overview" && <span className="absolute inset-x-0 -bottom-px h-[2px]" style={{ background: C.ink }} />}
          </button>
          {filesTab && (
            <Diff k={marks.files ?? null} label="Added">
              <button type="button" role="tab" aria-selected={view === "files"} onClick={() => setTab("files")} className={`relative h-9 ${focus}`} style={{ color: view === "files" ? C.ink : C.muted }}>
                Files
                {view === "files" && <span className="absolute inset-x-0 -bottom-px h-[2px]" style={{ background: C.ink }} />}
              </button>
            </Diff>
          )}
        </div>
        {/* on wide windows the Files entry lives in the sidebar; mark it there too */}
        {filesTab && marks.files != null && (
          <div className="pointer-events-none absolute left-3 top-[88px] hidden w-[152px] @2xl:block">
            <Diff k={marks.files ?? null} label="Added">
              <span className="block h-8" />
            </Diff>
          </div>
        )}

        <div className="relative mt-4 min-h-0 flex-1 @2xl:mt-5">
          <AnimatePresence mode="wait" initial={false}>
            {view === "overview" ? (
              <motion.div key="o" className="grid grid-cols-[minmax(0,1fr)] gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div>
                  {/* progress */}
                  <div className="flex items-center justify-between text-[12px]" style={{ color: C.muted }}>
                    <span>Project progress</span>
                    <span className="font-medium tabular-nums" style={{ color: C.ink }}>
                      {pct}%
                    </span>
                  </div>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full" style={{ background: C.soft }}>
                    <motion.span className="block h-full rounded-full" style={{ background: C.accent }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: calm }} />
                  </span>
                  <ol className="mt-3 flex items-center gap-2 text-[12px]">
                    {steps.map((s, i) => (
                      <li key={s} className="flex flex-1 items-center gap-1.5 last:flex-none">
                        <span className="flex shrink-0 items-center gap-1.5" style={{ color: i <= at ? C.ink : C.muted }}>
                          <span
                            className="grid size-[18px] shrink-0 place-items-center rounded-full transition-colors duration-300"
                            style={{ background: i < at ? C.accent : i === at ? C.soft : "transparent", border: i > at ? `1px solid ${C.line}` : "none", color: "#fff" }}
                          >
                            {i < at && <Check size={10} strokeWidth={3} aria-hidden />}
                            {i === at && <span className="size-1.5 rounded-full" style={{ background: C.accent }} />}
                          </span>
                          <span className={i === at ? "" : "@max-md:hidden"}>{s}</span>
                        </span>
                        {i < steps.length - 1 && <span className="h-px min-w-3 flex-1" style={{ background: C.line }} />}
                      </li>
                    ))}
                  </ol>
                  {approveCard && (
                    <Diff k={marks.approve ?? null} label="Added" className="mt-4">
                      <div className="flex items-center gap-3 rounded-[14px] bg-white p-3 shadow-[0_1px_2px_rgba(31,42,28,0.06)]">
                        <span className="relative hidden h-12 w-16 shrink-0 overflow-hidden rounded-[8px] bg-[linear-gradient(135deg,#d9dfcb,#c7d0b3)] @md:block" aria-hidden>
                          <span className="absolute left-2 top-2 h-1.5 w-8 rounded-full bg-white/80" />
                          <span className="absolute left-2 top-5 h-4 w-12 rounded-[3px] bg-white/60" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px]" style={{ color: C.muted }}>
                            {marks.approve !== undefined ? "Ready for your customer" : "Ready for your eyes"}
                          </p>
                          <p className="text-[14px] font-medium">Homepage design</p>
                        </div>
                        <AnimatePresence mode="wait" initial={false}>
                          {approved ? (
                            <motion.span key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: calm }} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium" style={{ background: C.soft, color: C.accent }}>
                              <Check size={13} strokeWidth={2.5} aria-hidden />
                              Approved
                            </motion.span>
                          ) : (
                            <motion.button
                              key="btn"
                              type="button"
                              exit={{ opacity: 0, transition: { duration: 0.12 } }}
                              onClick={() => setApproved(true)}
                              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-semibold text-white ${focus}`}
                              style={{ background: C.accent }}
                            >
                              Approve
                              <ArrowRight size={13} aria-hidden />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </Diff>
                  )}
                </div>
                {/* what happened lately */}
                <div className="hidden rounded-[14px] px-3 py-2.5 @2xl:block" style={{ background: C.panel }}>
                  <p className="text-[12px] font-medium">Latest updates</p>
                  <ul className="mt-2 space-y-2">
                    {UPDATES.slice(0, 2).map((u) => (
                      <li key={u.text} className="flex items-start gap-2 text-[12px] leading-[16px]">
                        <Face who={u.who} size={22} className="!ring-0" />
                        <span className="min-w-0 flex-1">
                          <span className="font-medium">{u.name}</span> <span style={{ color: C.muted }}>{u.text}</span>
                        </span>
                        <span className="shrink-0 text-[10.5px]" style={{ color: C.muted }}>
                          {u.at}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.ul key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden rounded-[14px] bg-white">
                {[
                  ["Homepage design v3.fig", "Leo", "Today"],
                  ["Sitemap.pdf", "Maya", "Yesterday"],
                  ["Brand guidelines.pdf", "Sam", "Mon"],
                  ["Kickoff notes.doc", "Leo", "May 28"],
                ].map(([f, by, d]) => (
                  <li key={f} className="flex items-center gap-3 border-b px-3.5 py-2.5 text-[13px] last:border-0" style={{ borderColor: C.line }}>
                    <FileText size={15} style={{ color: C.muted }} aria-hidden />
                    <span className="flex-1 truncate">{f}</span>
                    <span className="text-[11.5px]" style={{ color: C.muted }}>
                      {by} · {d}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 2. Feedback board */

type Idea = { t: string; v: number; s: "Building" | "Planned" | "Under review"; c: number; by: "maya" | "dana" | "priya" | "sam" };
const STATUS_TONE: Record<Idea["s"], [string, string]> = {
  Building: ["#E7ECFF", "#3346e0"],
  Planned: ["#EEEAFE", "#5b45d6"],
  "Under review": ["#EFEFF3", "#5f5c72"],
};

export function FeedbackBoard() {
  const C = { bg: "#F4F3FB", panel: "#ECEAF8", ink: "#23203a", muted: "#6c6887", accent: "#5b45d6", line: "rgba(35,32,58,0.1)" };
  const [rows, setRows] = useState<Idea[]>([
    { t: "Shareable reports", v: 24, s: "Building", c: 8, by: "maya" },
    { t: "Custom dashboard", v: 18, s: "Planned", c: 5, by: "dana" },
    { t: "Dark mode", v: 12, s: "Under review", c: 3, by: "priya" },
    { t: "Slack alerts for reports", v: 9, s: "Planned", c: 2, by: "sam" },
  ]);
  const [mine, setMine] = useState<string[]>([]);
  const [filter, setFilter] = useState<"All" | Idea["s"]>("All");
  const vote = (t: string) => {
    const on = mine.includes(t);
    setMine((m) => (on ? m.filter((x) => x !== t) : [...m, t]));
    setRows((r) => r.map((x) => (x.t === t ? { ...x, v: x.v + (on ? -1 : 1) } : x)).sort((a, b) => b.v - a.v));
  };
  const shown = rows.filter((r) => filter === "All" || r.s === filter);
  const filters: ("All" | Idea["s"])[] = ["All", "Building", "Planned", "Under review"];

  return (
    <div className="flex h-full" style={{ background: C.bg, color: C.ink }}>
      <aside className="hidden w-[168px] shrink-0 flex-col border-r p-3 @2xl:flex" style={{ borderColor: C.line, background: C.panel }}>
        <div className="flex items-center gap-2 px-1.5 py-1 text-[13px] font-semibold">
          <MessageCircle size={15} strokeWidth={1.75} style={{ color: C.accent }} aria-hidden />
          Made together
        </div>
        <p className="mt-4 px-2 text-[10.5px]" style={{ color: C.muted }}>
          Roadmap
        </p>
        <div className="mt-1 space-y-0.5">
          {filters.map((f) => (
            <SideItem
              key={f}
              icon={<span className="size-2 rounded-full" style={{ background: f === "All" ? C.muted : STATUS_TONE[f][1] }} />}
              label={f}
              on={filter === f}
              ink={C.ink}
              muted={C.muted}
              soft="#fff"
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
        <div className="mt-auto rounded-[10px] bg-white/70 p-2.5 text-[11.5px] leading-[15px]">
          <p className="font-medium">Recently shipped</p>
          <p className="mt-1 flex items-center gap-1.5" style={{ color: C.muted }}>
            <Check size={12} style={{ color: "#1f7a4d" }} aria-hidden />
            CSV export
          </p>
          <p className="mt-0.5 flex items-center gap-1.5" style={{ color: C.muted }}>
            <Check size={12} style={{ color: "#1f7a4d" }} aria-hidden />
            Team folders
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col p-5 @2xl:p-6">
        <div className="flex items-start gap-3">
          <p className="text-[26px] font-semibold leading-[30px] tracking-[-0.035em] @2xl:text-[28px] @2xl:leading-[32px]">
            What should we
            <br />
            <span style={{ color: C.accent }}>make next?</span>
          </p>
          <span className="ml-auto hidden h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-semibold text-white @xl:flex" style={{ background: C.accent }}>
            <Plus size={13} aria-hidden />
            Share an idea
          </span>
        </div>
        <p className="mt-2 text-[12.5px]" style={{ color: C.muted }}>
          Your voice matters. Vote for what helps you most.
        </p>
        <ul className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {shown.map((r) => {
              const on = mine.includes(r.t);
              const [bg, fg] = STATUS_TONE[r.s];
              return (
                <motion.li
                  key={r.t}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.4, ease: base }}
                  className="flex items-center gap-3 rounded-[12px] bg-white p-2.5 shadow-[0_1px_2px_rgba(35,32,58,0.06)]"
                >
                  <button
                    type="button"
                    onClick={() => vote(r.t)}
                    aria-pressed={on}
                    aria-label={`Vote for ${r.t}, ${r.v} votes`}
                    className={`flex h-11 w-10 shrink-0 flex-col items-center justify-center rounded-[9px] text-[12px] font-semibold transition-colors duration-200 ${focus}`}
                    style={{ background: on ? C.accent : "#F3F1FC", color: on ? "#fff" : C.ink }}
                  >
                    <ArrowUp size={12} strokeWidth={2.5} aria-hidden />
                    <RollingNumber value={r.v} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium">{r.t}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px]" style={{ color: C.muted }}>
                      <Face who={r.by} size={16} className="!ring-0" />
                      Suggested by a customer
                    </p>
                  </div>
                  <span className="hidden rounded-full px-2 py-0.5 text-[11px] font-medium @lg:inline" style={{ background: bg, color: fg }}>
                    {r.s}
                  </span>
                  <span className="flex items-center gap-1 text-[11.5px]" style={{ color: C.muted }}>
                    <MessageCircle size={12} aria-hidden />
                    {r.c}
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 3. Team onboarding */

export function TeamOnboarding() {
  const C = { bg: "#FBF5EC", panel: "#F4EADB", ink: "#2b2218", muted: "#7a6c5c", accent: "#b0703a", line: "rgba(43,34,24,0.12)" };
  const steps = [
    { t: "Meet your buddy, Leo", d: "Coffee at 10:00, second floor" },
    { t: "Find your way around", d: "A 15-minute tour of the tools" },
    { t: "Share your first idea", d: "Anything you noticed this week" },
  ];
  const [done, setDone] = useState<number[]>([]);
  const [hi, setHi] = useState(false);
  const all = done.length === steps.length;
  return (
    <div className="grid h-full @2xl:grid-cols-[1.35fr_1fr]" style={{ background: C.bg, color: C.ink }}>
      <div className="flex min-w-0 flex-col p-5 @2xl:p-6">
        <div className="flex items-center gap-2 text-[12.5px] font-medium">
          <Sparkles size={14} strokeWidth={1.75} style={{ color: C.accent }} aria-hidden />
          A good beginning
          <Pill line={C.line} className="ml-auto">
            Week one
          </Pill>
        </div>
        <p className="mt-4 text-[26px] font-semibold leading-[30px] tracking-[-0.035em] @2xl:text-[28px] @2xl:leading-[32px]">
          Hey Alex.
          <br />
          <span style={{ color: C.accent }}>You&apos;re one of us now.</span>
        </p>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="flex -space-x-2">
            <Face who="maya" size={28} />
            <Face who="sam" size={28} />
            <Face who="priya" size={28} />
          </span>
          <p className="text-[12px] leading-4" style={{ color: C.muted }}>
            Good people. <span style={{ color: C.ink }}>Your people.</span>
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11.5px]" style={{ color: C.muted }}>
          <span>Your first week</span>
          <span className="tabular-nums">
            {done.length} of {steps.length}
          </span>
        </div>
        <span className="mt-1.5 block h-1 overflow-hidden rounded-full" style={{ background: C.panel }}>
          <motion.span className="block h-full rounded-full" style={{ background: C.accent }} animate={{ width: `${(done.length / steps.length) * 100}%` }} transition={{ duration: 0.4, ease: base }} />
        </span>
        <ul className="mt-2">
          {steps.map((s, i) => {
            const on = done.includes(i);
            return (
              <li key={s.t}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => setDone((d) => (on ? d.filter((x) => x !== i) : [...d, i]))}
                  className={`flex w-full items-center gap-3 border-b py-2.5 text-left ${focus}`}
                  style={{ borderColor: C.line }}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-medium transition-colors duration-[120ms]" style={{ background: on ? C.accent : C.panel, color: on ? "#fff" : C.muted }}>
                    {on ? <Check size={12} strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px]" style={{ textDecoration: on ? "line-through" : "none", color: on ? C.muted : C.ink }}>
                      {s.t}
                    </span>
                    <span className="block text-[11.5px]" style={{ color: C.muted }}>
                      {s.d}
                    </span>
                  </span>
                  <ChevronRight size={15} style={{ color: C.muted }} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 h-5" aria-live="polite">
          <AnimatePresence>
            {all && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: calm }} className="text-[13.5px] font-medium" style={{ color: C.accent }}>
                Week one, done.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* your buddy and the week ahead */}
      <aside className="hidden flex-col gap-3 border-l p-5 @2xl:flex" style={{ borderColor: C.line, background: C.panel }}>
        <div className="rounded-[14px] bg-white p-4">
          <p className="text-[11px]" style={{ color: C.muted }}>
            Your buddy
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Face who="leo" size={44} className="!ring-0" />
            <span className="leading-tight">
              <span className="block text-[14px] font-semibold">Leo Park</span>
              <span className="block text-[11.5px]" style={{ color: C.muted }}>
                Product designer
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setHi(true)}
            className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[12.5px] font-semibold transition-colors ${focus}`}
            style={{ background: hi ? C.panel : C.ink, color: hi ? C.ink : "#fff" }}
          >
            {hi ? (
              <>
                <Check size={13} aria-hidden /> Said hi
              </>
            ) : (
              "Say hi"
            )}
          </button>
        </div>
        <div className="rounded-[14px] bg-white p-4">
          <p className="text-[11px]" style={{ color: C.muted }}>
            This week
          </p>
          <ul className="mt-2 space-y-2 text-[12.5px]">
            {[
              ["Mon", "Team lunch", "12:30"],
              ["Tue", "Product tour", "10:00"],
              ["Thu", "First 1:1 with Sam", "15:00"],
            ].map(([d, t, h]) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="w-8 shrink-0 text-[11px] font-medium" style={{ color: C.accent }}>
                  {d}
                </span>
                <span className="flex-1 truncate">{t}</span>
                <span className="text-[11px] tabular-nums" style={{ color: C.muted }}>
                  {h}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ 4. ROI calculator */

export function RoiCalculator() {
  const C = { bg: "#F1F3EC", ink: "#1f2a1c", muted: "#6b7262", accent: "#2F4A35", line: "rgba(31,42,28,0.12)" };
  const [people, setPeople] = useState(12);
  const [hours, setHours] = useState(3);
  const week = people * hours;
  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number) => (
    <label className="block">
      <span className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{v}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={v}
        onChange={(e) => set(Number(e.target.value))}
        className={`roi-range mt-2.5 w-full ${focus}`}
        style={{ ["--fill" as string]: `${((v - min) / (max - min)) * 100}%`, ["--ink" as string]: C.accent }}
      />
    </label>
  );
  return (
    <div className="flex h-full flex-col p-5 @2xl:p-7" style={{ background: C.bg, color: C.ink }}>
      <div className="flex items-center gap-2 text-[12.5px] font-medium">
        <span className="grid size-6 place-items-center rounded-[7px] text-[11px] font-bold text-white" style={{ background: C.accent }}>
          T
        </span>
        Tempo
        <span className="font-normal" style={{ color: C.muted }}>
          · A little less busy
        </span>
        <Pill line={C.line} className="ml-auto">
          Time calculator
        </Pill>
      </div>
      <p className="mt-5 text-[26px] font-semibold leading-[30px] tracking-[-0.035em] @2xl:text-[30px] @2xl:leading-[34px]">
        What could your
        <br />
        <span style={{ color: C.accent }}>team get back?</span>
      </p>
      <div className="mt-5 grid flex-1 gap-5 @2xl:grid-cols-[1fr_230px] @2xl:items-center">
        <div className="space-y-5">
          {slider("People on your team", people, setPeople, 1, 200)}
          {slider("Hours saved each week", hours, setHours, 0, 20)}
          <p className="text-[11.5px]" style={{ color: C.muted }}>
            Per person. Set your own estimate.
          </p>
        </div>
        <div className="overflow-hidden rounded-[16px] text-white" style={{ background: C.accent }}>
          <div className="px-4 pb-4 pt-5 text-center">
            <p className="text-[11.5px] text-white/70">Room for better things</p>
            <p className="mt-2 text-[50px] font-light leading-none tracking-[-0.04em]">
              <RollingNumber value={week} />
            </p>
            <p className="mt-2 text-[12px] text-white/75" aria-live="polite">
              <span className="sr-only">{week} </span>team hours / week
            </p>
          </div>
          <div className="grid grid-cols-2 border-t border-white/15 text-center text-[11px] text-white/70">
            <p className="border-r border-white/15 px-2 py-2.5">
              <span className="block text-[15px] font-medium text-white tabular-nums">{(week * 52).toLocaleString("en-US")}</span>
              hours a year
            </p>
            <p className="px-2 py-2.5">
              <span className="block text-[15px] font-medium text-white tabular-nums">{Math.round((week * 52) / 40)}</span>
              work weeks back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 5. Help center (skinnable) */

export type Skin = "help" | "everyday" | "tempo" | "gather";
export const SKINS: Record<Skin, { name: string; bg: string; card: string; ink: string; muted: string; accent: string; line: string; radius: number; font?: string; a: string; b: string; brand: string }> = {
  help: { name: "Help center", bg: "#F1F4FC", card: "#FFFFFF", ink: "#18233a", muted: "#5f6b85", accent: "#3346e0", line: "rgba(24,35,58,0.1)", radius: 12, a: "A little help.", b: "A lot further.", brand: "Orbit" },
  everyday: { name: "Everyday Objects", bg: "#F6F1E9", card: "#FFFDF9", ink: "#26291f", muted: "#6f6a5f", accent: "#3f4a2f", line: "rgba(38,41,31,0.12)", radius: 6, font: "mock-serif", a: "Here to help,", b: "every day.", brand: "everyday objects." },
  tempo: { name: "Tempo", bg: "#F4F6F8", card: "#FFFFFF", ink: "#0f172a", muted: "#64748b", accent: "#0f766e", line: "rgba(15,23,42,0.1)", radius: 10, a: "Answers, calmly.", b: "Right on time.", brand: "tempo" },
  gather: { name: "Gather", bg: "#FFF3EB", card: "#FFFFFF", ink: "#2a1a12", muted: "#8a6a5a", accent: "#e8532e", line: "rgba(42,26,18,0.1)", radius: 22, a: "Stuck? No worries.", b: "We've got you.", brand: "gather" },
};
const CATS = [
  { t: "Getting started", n: 6, I: Rocket },
  { t: "Your team", n: 4, I: Users },
  { t: "Reports", n: 9, I: FileText },
  { t: "Billing", n: 5, I: CreditCard },
  { t: "Integrations", n: 7, I: Plug },
  { t: "Troubleshooting", n: 8, I: LifeBuoy },
];
const ARTICLES = [
  { t: "Getting started", c: "Getting started", d: "Set up your space and invite your first teammates in a few minutes." },
  { t: "Invite your team", c: "Your team", d: "Send invites by email or share a link. Everyone joins the same workspace." },
  { t: "Schedule a report", c: "Reports", d: "Pick a report, choose a time and who gets it. It goes out on its own." },
  { t: "Update your billing details", c: "Billing", d: "Change your card or billing email any time from Settings." },
];

export function HelpCenter({ skin = "help" }: { skin?: Skin }) {
  const S = SKINS[skin];
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const [helpful, setHelpful] = useState(false);
  const query = q.trim().toLowerCase();
  const results = ARTICLES.map((a, i) => ({ ...a, i })).filter((a) => !query || a.t.toLowerCase().includes(query) || a.c.toLowerCase().includes(query));
  const serif = S.font === "mock-serif";
  const r = S.radius;
  return (
    <div className="flex h-full flex-col transition-colors duration-500" style={{ background: S.bg, color: S.ink }}>
      {/* site bar */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-5 text-[12.5px]" style={{ borderColor: S.line }}>
        <BookOpen size={15} strokeWidth={1.75} aria-hidden style={{ color: S.accent }} />
        <span className={`font-semibold ${serif ? "mock-serif text-[15px] font-normal" : ""}`}>{S.brand}</span>
        <span style={{ color: S.muted }}>Help center</span>
        <span className="ml-auto hidden gap-4 @xl:flex" style={{ color: S.muted }}>
          <span>Guides</span>
          <span>What&apos;s new</span>
        </span>
        <span className="ml-3 hidden h-8 items-center px-3 text-[12px] font-semibold text-white @xl:flex" style={{ background: S.accent, borderRadius: Math.min(r, 999) }}>
          Contact us
        </span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {open === null ? (
          <motion.div key="home" className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5 @2xl:px-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className={`tracking-[-0.03em] ${serif ? "mock-serif text-[30px] leading-[1.02]" : "text-[26px] font-semibold leading-[30px] @2xl:text-[28px] @2xl:leading-[32px]"}`}>
              {S.a}
              <br />
              <span style={{ color: S.accent }} className={serif ? "italic" : ""}>
                {S.b}
              </span>
            </p>
            <label className="mt-4 flex h-11 shrink-0 items-center gap-2.5 border px-3.5 text-[13.5px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]" style={{ background: S.card, borderColor: S.line, borderRadius: r }}>
              <Search size={15} style={{ color: S.muted }} aria-hidden />
              <span className="sr-only">Search the help center</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What can we help with?" className="min-w-0 flex-1 bg-transparent outline-none placeholder:opacity-50" />
            </label>
            {query ? (
              <ul className="mt-3">
                {results.map((a) => (
                  <li key={a.t}>
                    <button type="button" onClick={() => setOpen(a.i)} className={`flex h-11 w-full items-center gap-2.5 border-b text-left text-[13.5px] ${focus}`} style={{ borderColor: S.line }}>
                      <FileText size={14} style={{ color: S.muted }} aria-hidden />
                      <span className="flex-1">{a.t}</span>
                      <span className="text-[11.5px]" style={{ color: S.muted }}>
                        {a.c}
                      </span>
                    </button>
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="py-3 text-[13px]" style={{ color: S.muted }}>
                    Nothing yet for “{q}”. Try “report”.
                  </li>
                )}
              </ul>
            ) : (
              <>
                <div className="mt-4 hidden grid-cols-3 gap-2.5 @2xl:grid">
                  {CATS.map(({ t, n, I }) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQ(t.split(" ")[0])}
                      className={`flex items-center gap-2.5 border p-2.5 text-left transition-shadow hover:shadow-[0_4px_14px_-6px_rgba(0,0,0,0.15)] ${focus}`}
                      style={{ background: S.card, borderColor: S.line, borderRadius: r }}
                    >
                      <span className="grid size-8 shrink-0 place-items-center" style={{ background: S.bg, color: S.accent, borderRadius: Math.max(6, r - 4) }}>
                        <I size={15} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate text-[12.5px] font-medium">{t}</span>
                        <span className="block text-[11px]" style={{ color: S.muted }}>
                          {n} articles
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[11.5px] @2xl:hidden" style={{ color: S.muted }}>
                  Popular
                </p>
                <ul className="mt-1 @2xl:hidden">
                  {ARTICLES.slice(0, 3).map((a, i) => (
                    <li key={a.t}>
                      <button type="button" onClick={() => setOpen(i)} className={`flex h-10 w-full items-center gap-2.5 border-b text-left text-[13.5px] ${focus}`} style={{ borderColor: S.line }}>
                        <FileText size={14} style={{ color: S.muted }} aria-hidden />
                        <span className="flex-1">{a.t}</span>
                        <ChevronRight size={15} style={{ color: S.muted }} aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key={`a${open}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: base }} className="px-5 pt-5 @2xl:px-7">
            <button
              type="button"
              onClick={() => {
                setOpen(null);
                setHelpful(false);
              }}
              className={`flex items-center gap-1.5 text-[12px] ${focus}`}
              style={{ color: S.muted }}
            >
              <ArrowLeft size={13} aria-hidden />
              Help center / {ARTICLES[open].c}
            </button>
            <p className={`mt-4 tracking-[-0.02em] ${serif ? "mock-serif text-[28px]" : "text-[24px] font-semibold"}`}>{ARTICLES[open].t}</p>
            <p className="mt-1 text-[11.5px]" style={{ color: S.muted }}>
              2 min read · Updated last week
            </p>
            <p className="mt-4 max-w-[46ch] text-[14px] leading-[22px]">{ARTICLES[open].d}</p>
            <ol className="mt-3 space-y-1.5 text-[13px]" style={{ color: S.muted }}>
              {["Open Settings from the sidebar.", "Choose what you want to change.", "Save, and you're done."].map((s, i) => (
                <li key={s} className="flex gap-2">
                  <span className="font-medium" style={{ color: S.accent }}>
                    {i + 1}.
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center gap-2 text-[12.5px]">
              <span style={{ color: S.muted }}>{helpful ? "Thanks for letting us know." : "Was this helpful?"}</span>
              {!helpful && (
                <button type="button" onClick={() => setHelpful(true)} className={`flex h-8 items-center gap-1.5 border px-3 ${focus}`} style={{ borderColor: S.line, borderRadius: r, background: S.card }}>
                  <ThumbsUp size={13} aria-hidden />
                  Yes
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ 6. Launch site */

export function LaunchSite() {
  const C = { bg: "#F7EBE1", ink: "#2b1d16", muted: "#806a5d", accent: "#b4582f", button: "#3a2a22", line: "rgba(43,29,22,0.12)" };
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState(1284);
  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ background: C.bg, color: C.ink }}>
      <div className="flex h-12 shrink-0 items-center gap-5 px-5 text-[12.5px] @2xl:px-7">
        <span className="flex items-center gap-1.5 text-[14px] font-semibold">
          <Plus size={14} strokeWidth={2.75} style={{ color: C.accent }} aria-hidden />
          together
        </span>
        <span className="hidden gap-4 @xl:flex" style={{ color: C.muted }}>
          <span>How it works</span>
          <span>Stories</span>
        </span>
        <span className="ml-auto text-[11.5px]" style={{ color: C.muted }}>
          Less busy. More together.
        </span>
      </div>
      <div className="px-5 pt-4 text-center @2xl:px-7">
        <p className="mx-auto w-fit rounded-full bg-white/60 px-3 py-1 text-[11px]" style={{ color: C.muted }}>
          A calmer way to plan
        </p>
        <p className="mt-3 text-[30px] font-semibold leading-[32px] tracking-[-0.035em] @2xl:text-[36px] @2xl:leading-[38px]">
          Great plans.
          <br />
          <span style={{ color: C.accent }}>Better together.</span>
        </p>
        <p className="mt-2.5 text-[13.5px]" style={{ color: C.muted }}>
          One home for your team&apos;s next big thing.
        </p>
        <div className="mx-auto mt-4 h-[72px] max-w-[400px]">
          <AnimatePresence mode="wait" initial={false}>
            {!joined ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  setJoined(true);
                  window.setTimeout(() => setCount((c) => c + 1), 350);
                }}
                className="flex gap-2"
              >
                <label className="sr-only" htmlFor="waitlist-email">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 min-w-0 flex-1 rounded-full bg-white/85 px-4 text-[13.5px] outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-[#009CFF]"
                />
                <button type="submit" className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white ${focus}`} style={{ background: C.button }}>
                  Join the waitlist
                  <ArrowRight size={13} aria-hidden />
                </button>
              </motion.form>
            ) : (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: calm }} className="flex h-11 items-center justify-center gap-2 text-[14px] font-medium" aria-live="polite">
                <span className="grid size-5 place-items-center rounded-full text-white" style={{ background: C.accent }}>
                  <Check size={11} strokeWidth={3} aria-hidden />
                </span>
                You&apos;re on the list
                <span className="ml-1 flex items-center gap-1 text-[12.5px] font-normal" style={{ color: C.muted }}>
                  <RollingNumber value={count} /> waiting
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px]" style={{ color: C.muted }}>
            <span className="flex -space-x-1.5">
              <Face who="dana" size={18} />
              <Face who="sam" size={18} />
              <Face who="priya" size={18} />
            </span>
            Joined by 1,284 teams
            <DemoNote className="ml-1" />
          </div>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-[1.3fr_1fr] gap-3 px-5 pb-5 @2xl:px-7">
        <div className="rounded-[16px] bg-white/75 p-4">
          <p className="text-[11px]" style={{ color: C.muted }}>
            The next big thing
          </p>
          <p className="mt-1 text-[17px] font-semibold leading-[21px] tracking-[-0.02em]">
            Make room
            <br />
            for the good work.
          </p>
        </div>
        <div className="flex flex-col justify-end rounded-[16px] p-4 text-white" style={{ background: C.accent }}>
          <p className="text-[14px] leading-[18px]">
            All together.
            <br />
            <span className="font-semibold">All moving.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
