"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  Bookmark,
  Check,
  ChevronRight,
  FileText,
  Hash,
  Mic,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";

/**
 * Chapter 1's five moments, one customer call travelling through Juno. Each is a real screen
 * of Juno's own app, so they share one window. `on` plays the moment once by transitioning to
 * the finished state; reduced motion starts there.
 */

const T =
  "transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-base)]";

/** Juno's app window: a quiet title bar, then the screen. */
export function AppWindow({
  icon,
  title,
  meta,
  children,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-white/[0.09] bg-[#0F131A] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    >
      <div className="flex h-11 items-center gap-2.5 border-b border-white/[0.06] bg-white/[0.02] px-4">
        <span className="text-muted">{icon}</span>
        <span className="truncate text-[13px] font-medium text-text">{title}</span>
        <span className="ml-auto flex shrink-0 items-center gap-2">{meta}</span>
      </div>
      {children}
    </div>
  );
}

export function Chip({
  children,
  tone = "ok",
  className = "",
}: {
  children: ReactNode;
  tone?: "ok" | "blue" | "muted";
  className?: string;
}) {
  const t =
    tone === "ok"
      ? "bg-[#3DD68C]/12 text-[#5BE3A2]"
      : tone === "blue"
        ? "bg-[#7A8FFF]/14 text-[#AFC0FF]"
        : "bg-white/[0.06] text-muted";
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[11.5px] font-medium ${t} ${className}`}
    >
      {children}
    </span>
  );
}

/** A section name inside the app, quiet and in sentence case. */
export const Label = ({ children }: { children: ReactNode }) => (
  <p className="text-[12px] font-medium text-subtle">{children}</p>
);

/* 1. The call: the request lifts out of the transcript into the summary. */
export function RecorderVisual({ on }: { on: boolean }) {
  const lines = [
    { t: "10:12", name: "You", text: "The weekly reports have been great for the team." },
    { t: "10:14", name: "Maya", text: "Can we share reports with clients?", key: true },
    { t: "10:15", name: "You", text: "Good one. Let me check with product." },
  ];
  return (
    <AppWindow
      icon={<Mic size={14} strokeWidth={1.75} />}
      title="Northwind weekly sync"
      meta={
        <>
          <span className="hidden text-[12px] text-subtle sm:inline">Today · 32 min</span>
          <Chip className={`${T} ${on ? "" : "opacity-0"} delay-[1200ms]`}>
            <Check size={11} strokeWidth={2.75} aria-hidden />
            Notes ready
          </Chip>
        </>
      }
    >
      <div className="grid sm:grid-cols-[1.25fr_1fr]">
        {/* transcript */}
        <div className="border-white/[0.06] p-4 sm:border-r">
          <div className="flex items-center gap-2">
            <span className="flex -space-x-1.5">
              <Face who="maya" size={22} className="!ring-[#0F131A]" />
              <Face who="leo" size={22} className="!ring-[#0F131A]" />
            </span>
            <span className="text-[12px] text-muted">Maya Chen, Northwind · You</span>
          </div>
          <ul className="mt-4 space-y-1">
            {lines.map((l) => (
              <li
                key={l.t}
                className={`flex gap-3 rounded-[10px] px-2.5 py-2 transition-colors delay-[300ms] duration-500 ${
                  l.key && on ? "bg-[#7A8FFF]/[0.09]" : ""
                }`}
              >
                <span className="w-9 shrink-0 pt-px text-[11.5px] tabular-nums text-subtle">
                  {l.t}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11.5px] text-muted">{l.name}</span>
                  <span
                    className={`block text-[13.5px] leading-5 ${l.key ? "text-text" : "text-text/70"}`}
                  >
                    {l.key ? `“${l.text}”` : l.text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* summary */}
        <div className="border-t border-white/[0.06] p-4 sm:border-t-0">
          <Label>Summary</Label>
          <p className="mt-1.5 text-[13px] leading-5 text-muted">
            Weekly cadence stays. Reports are landing well.
          </p>
          <div className="mt-4">
            <Label>Requests</Label>
            <div
              className={`mt-2 rounded-[12px] bg-[#7A8FFF]/[0.1] p-3 ring-1 ring-[#7A8FFF]/25 ${T} delay-[500ms] duration-700 ${
                on ? "" : "-translate-x-6 -translate-y-3 scale-[0.96] opacity-0"
              }`}
            >
              <span className="flex items-center gap-2 text-[13.5px] font-medium text-text">
                <MascotMark size={16} />
                Client sharing requested
              </span>
              <span className="mt-1 block text-[12px] text-muted">
                Added to the meeting summary.
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Label>Next step</Label>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-text/80">
              <span className="size-3.5 rounded-[4px] ring-[1.5px] ring-white/25" />
              Send Maya the recap
            </p>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* 2. The wiki: the page updates itself from the call. */
export function WikiVisual({ on }: { on: boolean }) {
  const tree = [
    { n: "Company", d: 0 },
    { n: "Product", d: 0, open: true },
    { n: "Reporting", d: 1, active: true },
    { n: "Billing", d: 1 },
    { n: "Customers", d: 0 },
    { n: "How we work", d: 0 },
  ];
  return (
    <AppWindow icon={<FileText size={14} strokeWidth={1.75} />} title="Company wiki">
      <div className="flex">
        <aside className="hidden w-[164px] shrink-0 border-r border-white/[0.06] p-3 sm:block">
          <span className="flex h-8 items-center gap-2 rounded-[8px] bg-white/[0.04] px-2.5 text-[12px] text-subtle">
            <Search size={12} aria-hidden />
            Search
          </span>
          <ul className="mt-3 space-y-0.5 text-[12.5px]">
            {tree.map((t) => (
              <li
                key={t.n}
                className={`flex h-7 items-center gap-1.5 rounded-[7px] pr-2 ${
                  t.active ? "bg-white/[0.06] text-text" : "text-muted"
                }`}
                style={{ paddingLeft: 8 + t.d * 18 }}
              >
                {t.d === 0 && (
                  <ChevronRight size={12} className={t.open ? "rotate-90" : ""} aria-hidden />
                )}
                {t.n}
              </li>
            ))}
          </ul>
        </aside>
        <div className="min-w-0 flex-1 p-5">
          <span className="text-[12px] text-subtle">Product / Reporting</span>
          <p className="mt-1.5 text-[24px] font-medium leading-8 tracking-[-0.02em] text-text">
            The way we work.
          </p>
          <div className="mt-2 flex items-center gap-2 text-[12px] text-muted">
            <MascotMark size={16} />
            {on ? "Updated by Juno · just now" : "Updated 2 days ago"}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3 rounded-[12px] border border-white/[0.07] px-3 py-2.5">
              <FileText size={14} strokeWidth={1.75} className="text-muted" aria-hidden />
              <span className="flex-1 truncate text-[13.5px] text-text">Scheduled Reports</span>
              <span className="text-[11.5px] text-subtle">2 days ago</span>
            </div>
            <div
              className={`rounded-[12px] border px-3 py-2.5 transition-colors delay-[500ms] duration-700 ${
                on ? "border-[#7A8FFF]/35 bg-[#7A8FFF]/[0.06]" : "border-white/[0.07]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={14} strokeWidth={1.75} className="text-muted" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[13.5px] text-text">
                  Customer sharing
                </span>
                <Chip tone="blue" className={`${T} delay-[900ms] ${on ? "" : "opacity-0"}`}>
                  Updated with the latest
                </Chip>
              </div>
              <div
                className={`grid transition-[grid-template-rows,opacity] delay-[700ms] duration-500 ${
                  on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-2.5 border-t border-white/[0.06] pt-2.5 text-[12.5px] leading-5 text-muted">
                    Clients can receive shared reports.
                    <span className="mt-1 flex items-center gap-1.5 text-subtle">
                      <Mic size={11} aria-hidden />
                      From the Northwind call, today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* 3. Your brand: the kit Juno works from, and everything it makes wearing it. */
const palette = [
  { c: "#1F2A44", n: "Ink" },
  { c: "#E9B949", n: "Saffron" },
  { c: "#F4EEE3", n: "Paper" },
  { c: "#C8754E", n: "Clay" },
];

function Thumb({ kind, on, i }: { kind: "email" | "post" | "page"; on: boolean; i: number }) {
  const d = { transitionDelay: on ? `${900 + i * 220}ms` : "0ms" };
  const t = "transition-colors duration-500";
  return (
    <div className="min-w-0">
      <div
        className={`relative h-[58px] overflow-hidden rounded-[8px] ring-1 ring-white/10 ${t} ${on ? "bg-[#F4EEE3]" : "bg-white/[0.05]"}`}
        style={d}
      >
        {kind === "email" && (
          <>
            <span
              className={`block h-3.5 ${t} ${on ? "bg-[#1F2A44]" : "bg-white/[0.06]"}`}
              style={d}
            />
            <span
              className={`mx-2 mt-2 block text-[9px] leading-[10px] ${t} ${on ? "font-[family-name:var(--font-mock-serif)] text-[13px] leading-[13px] text-[#1F2A44]" : "text-muted"}`}
              style={d}
            >
              Good news.
            </span>
            <span
              className={`mx-2 mt-1.5 block h-1 w-3/4 rounded-full ${t} ${on ? "bg-[#1F2A44]/25" : "bg-white/10"}`}
              style={d}
            />
            <span
              className={`mx-2 mt-1.5 block h-2.5 w-8 rounded-full ${t} ${on ? "bg-[#1F2A44]" : "bg-white/10"}`}
              style={d}
            />
          </>
        )}
        {kind === "post" && (
          <div
            className={`flex h-full flex-col justify-end p-2 ${t} ${on ? "bg-[#1F2A44]" : ""}`}
            style={d}
          >
            <span
              className={`block h-1 w-6 rounded-full ${t} ${on ? "bg-[#E9B949]" : "bg-white/10"}`}
              style={d}
            />
            <span
              className={`mt-1 block text-[11px] leading-[12px] ${t} ${on ? "font-[family-name:var(--font-mock-serif)] text-[#F4EEE3]" : "text-muted"}`}
              style={d}
            >
              Mondays, handled.
            </span>
          </div>
        )}
        {kind === "page" && (
          <div className="p-2">
            <span
              className={`block h-1 w-full rounded-full ${t} ${on ? "bg-[#1F2A44]/15" : "bg-white/[0.06]"}`}
              style={d}
            />
            <span
              className={`mt-2 block text-[11px] leading-[12px] ${t} ${on ? "font-[family-name:var(--font-mock-serif)] text-[#1F2A44]" : "text-muted"}`}
              style={d}
            >
              Reports, on repeat.
            </span>
            <span
              className={`mt-1.5 block h-2.5 w-10 rounded-full ${t} ${on ? "bg-[#C8754E]" : "bg-white/10"}`}
              style={d}
            />
          </div>
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-muted">
        {kind === "email" ? "Launch email" : kind === "post" ? "Social post" : "Web page"}
      </p>
    </div>
  );
}

export function BrandVisual({ on }: { on: boolean }) {
  return (
    <AppWindow
      icon={<Bookmark size={14} strokeWidth={1.75} />}
      title="Your brand"
      meta={<span className="text-[12px] text-subtle">From yourcompany.com</span>}
    >
      <div className="p-4">
        {/* the kit */}
        <div className="grid grid-cols-[1.1fr_1fr] gap-4">
          <div>
            <Label>Colors</Label>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {palette.map((x, i) => (
                <div
                  key={x.c}
                  className={`${T} ${on ? "" : "translate-y-1.5 opacity-0"}`}
                  style={{ transitionDelay: on ? `${120 + i * 90}ms` : "0ms" }}
                >
                  <span
                    className="block h-11 rounded-[8px] ring-1 ring-white/10"
                    style={{ background: x.c }}
                  />
                  <span className="mt-1 block text-[11px] text-text/85">{x.n}</span>
                  <span className="block font-mono text-[9.5px] text-subtle">{x.c}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label>Type</Label>
            <div className="mt-2 space-y-1.5">
              <p className="flex items-baseline gap-2.5">
                <span className="font-[family-name:var(--font-mock-serif)] text-[28px] leading-none text-text">
                  Aa
                </span>
                <span className="text-[11.5px] text-muted">Serif · Headlines</span>
              </p>
              <p className="flex items-baseline gap-2.5">
                <span className="text-[24px] font-medium leading-none text-text">Aa</span>
                <span className="text-[11.5px] text-muted">Sans · Body</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-[10px] bg-white/[0.03] px-3 py-2.5">
          <div className="flex items-baseline justify-between">
            <Label>Voice</Label>
            <span className="text-[12.5px] text-text">Clear. Warm. Useful.</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-[12px] text-text/85">
            <Check size={12} strokeWidth={2.5} className="shrink-0 text-[#5BE3A2]" aria-hidden />
            &ldquo;Your numbers, every Monday.&rdquo;
          </p>
          <p className="mt-1 flex items-center gap-2 text-[12px] text-subtle line-through decoration-white/20">
            <span className="w-3 shrink-0 text-center no-underline">×</span>
            &ldquo;Leverage our robust reporting solution.&rdquo;
          </p>
        </div>
        {/* everything Juno makes, wearing it */}
        <div className="mt-3">
          <Label>Used in</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Thumb kind="email" on={on} i={0} />
            <Thumb kind="post" on={on} i={1} />
            <Thumb kind="page" on={on} i={2} />
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* 4. The skill: the process, saved once, checks itself off. */
export function SkillsVisual({ on }: { on: boolean }) {
  const steps = [
    "Start with the customer benefit",
    "Use our brand and voice",
    "Prepare email and social",
  ];
  return (
    <AppWindow
      icon={<Zap size={14} strokeWidth={1.75} />}
      title="Saved skill"
      meta={<span className="text-[12px] text-subtle">Used 12 times</span>}
    >
      <div className="p-5">
        <p className="text-[20px] font-medium tracking-[-0.02em] text-text">Announce a feature</p>
        <p className="mt-1.5 text-[12.5px] text-muted">
          <span className="text-subtle">Runs when</span> a feature ships
        </p>
        <ol className="mt-4 space-y-1.5">
          {steps.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-3 rounded-[10px] bg-white/[0.03] px-3 py-2.5 text-[13.5px] text-text"
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full text-[10.5px] tabular-nums ring-[1.5px] transition-colors duration-200 ${
                  on ? "bg-[#3DD68C] text-[#06120c] ring-[#3DD68C]" : "text-muted ring-white/20"
                }`}
                style={{ transitionDelay: on ? `${300 + i * 420}ms` : "0ms" }}
              >
                {on ? <Check size={11} strokeWidth={3} aria-hidden /> : i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
          <span className={`text-[12.5px] text-muted ${T} delay-[1600ms] ${on ? "" : "opacity-0"}`}>
            Ready for the next launch
          </span>
          <span className="flex gap-1">
            <BrandIcon id="gmail" size={20} />
            <BrandIcon id="slack" size={20} />
            <BrandIcon id="notion" size={20} />
          </span>
        </div>
      </div>
    </AppWindow>
  );
}

/* 5. The lesson: one correction, and the next update leads with it. */
const sections = [
  { n: "Decisions & blockers", p: "Pricing page waits on legal. Ship date holds." },
  { n: "Highlights", p: "Scheduled Reports used by 41 teams." },
  { n: "Metrics", p: "Activation up, churn flat." },
];
export function LearningsVisual({ on }: { on: boolean }) {
  const order = on ? sections : [sections[1], sections[2], sections[0]];
  return (
    <AppWindow icon={<Users size={14} strokeWidth={1.75} />} title="Company update">
      <div className="p-4">
        <div className="flex justify-end">
          <span className="max-w-[85%] rounded-[14px] rounded-br-[5px] bg-white/[0.07] px-3.5 py-2 text-[13px] text-text">
            Lead with decisions and blockers.
          </span>
        </div>
        <div
          className={`mt-2.5 flex items-center gap-2 ${T} delay-[250ms] ${on ? "" : "translate-y-1 opacity-0"}`}
        >
          <MascotMark size={18} />
          <Chip tone="blue">Remembered for next time.</Chip>
        </div>
        <div className="mt-4 rounded-[12px] border border-white/[0.07] p-3">
          <div className="flex items-center justify-between">
            <Label>Your next company update</Label>
            <span className="flex items-center gap-1 text-[11.5px] text-subtle">
              <Hash size={11} aria-hidden />
              leadership
            </span>
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {order.map((s) => (
              <motion.li
                key={s.n}
                layout
                transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay: 0.6 }}
                className={`rounded-[9px] px-3 py-2 ${
                  s.n === "Decisions & blockers" && on ? "bg-[#7A8FFF]/[0.1]" : "bg-white/[0.03]"
                }`}
              >
                <span className="block text-[13px] font-medium text-text">{s.n}</span>
                <span className="block truncate text-[12px] text-muted">{s.p}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <p className={`mt-3 text-[12.5px] text-muted ${T} delay-[1200ms] ${on ? "" : "opacity-0"}`}>
          First, just how you like it.
        </p>
      </div>
    </AppWindow>
  );
}
