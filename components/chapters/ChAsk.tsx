"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  Check,
  CircleAlert,
  ClipboardCheck,
  FileText,
  Heart,
  LayoutTemplate,
  MessagesSquare,
  Search,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { MascotMark } from "@/components/mascot/Mascot";
import { tools, type ToolId } from "@/lib/story";

const ease = [0.2, 0.8, 0.2, 1] as const;
const DWELL = 5200; // ms a finished result stays before the next task

/* ------------------------------------------------------------ the deliverables
   One family: warm paper, small label, big title, quiet status, tool badge. */

const INK = "#14161f";

function Paper({
  tool,
  kicker,
  title,
  status,
  children,
  footer,
}: {
  tool: ToolId;
  kicker: string;
  title: string;
  status?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className="theme-light rounded-[22px] !bg-[#F7F6F2] p-6 shadow-[inset_0_1px_0_#fff] md:p-7"
      style={{ color: INK }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#7a7f8c]">
          {kicker}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] text-[#5b6070] shadow-[0_1px_2px_rgba(20,22,31,0.06)] ring-1 ring-black/[0.05]">
          <ToolLogo id={tool} size={12} brand />
          {tools[tool].name}
        </span>
      </div>
      <p className="mt-3 text-[28px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[34px]">
        {title}
      </p>
      {status && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#2f8a5f]">
          <Check size={14} strokeWidth={2.25} aria-hidden />
          {status}
        </p>
      )}
      <div className="mt-5">{children}</div>
      {footer && <div className="mt-5 border-t border-black/[0.07] pt-4">{footer}</div>}
    </div>
  );
}

const Part = ({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
    transition={{ duration: 0.4, ease }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

const Avatar = ({ n, hue }: { n: string; hue: string }) => (
  <span
    className="grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white"
    style={{ background: `linear-gradient(135deg, ${hue}, #1d2440)` }}
  >
    {n
      .split(" ")
      .map((x) => x[0])
      .join("")}
  </span>
);

const Gradient = ({ className = "" }: { className?: string }) => (
  <div
    className={`bg-[radial-gradient(120%_100%_at_15%_0%,#9fe0ff_0%,#6b82ff_45%,#2b2370_100%)] ${className}`}
  />
);

type Task = {
  icon: LucideIcon;
  label: string;
  prompt: string;
  reads: ToolId[];
  output: ReactNode;
};

const tasks: Task[] = [
  /* 1. a launch kit: three channels, fanned on the stage */
  {
    icon: Sparkles,
    label: "Announce that feature.",
    prompt: "We're launching Scheduled Reports. Get the email and social posts ready.",
    reads: ["linear", "notion", "figma"],
    output: (
      <div style={{ color: INK }}>
        <div className="relative h-[300px]">
          {[
            {
              k: "Email",
              sub: "To 2,140 customers",
              badge: (
                <span className="grid size-6 place-items-center rounded-md bg-[#EA4335] text-[11px] font-bold text-white">
                  @
                </span>
              ),
              t: "Your reports now send themselves",
              b: "Pick a dashboard, pick a time. Done.",
              r: -6,
              x: "0%",
              y: 28,
            },
            {
              k: "LinkedIn",
              sub: "Orbit page",
              badge: (
                <span className="grid size-6 place-items-center rounded-md bg-[#0A66C2] text-[11px] font-bold text-white">
                  in
                </span>
              ),
              t: "Meet Scheduled Reports",
              b: "Monday numbers, without the Monday scramble.",
              r: 0,
              x: "30%",
              y: 0,
            },
            {
              k: "X",
              sub: "@orbit",
              badge: (
                <span className="grid size-6 place-items-center rounded-md bg-black text-[11px] font-bold text-white">
                  X
                </span>
              ),
              t: "Shipping today",
              b: "Scheduled Reports: PDF or CSV, every Monday at 9.",
              r: 6,
              x: "60%",
              y: 28,
            },
          ].map((c, i) => (
            <Part
              key={c.k}
              className="absolute w-[40%]"
              style={{ left: c.x, top: c.y, zIndex: i === 1 ? 3 : 1 }}
            >
              <div
                className="overflow-hidden rounded-[20px] bg-white shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75)]"
                style={{ transform: `rotate(${c.r}deg)` }}
              >
                <div className="flex items-center gap-2 px-4 pt-3.5">
                  {c.badge}
                  <span>
                    <span className="block text-[12px] font-semibold leading-4">{c.k}</span>
                    <span className="block text-[11px] leading-4 text-[#7a7f8c]">{c.sub}</span>
                  </span>
                </div>
                <Gradient className="mx-4 mt-3 h-20 rounded-xl" />
                <div className="px-4 pb-4 pt-3">
                  <p className="text-[15px] font-semibold leading-5 tracking-[-0.01em]">{c.t}</p>
                  <p className="mt-1 text-[12px] leading-[17px] text-[#5b6070]">{c.b}</p>
                </div>
              </div>
            </Part>
          ))}
        </div>
        <Part className="mx-auto mt-2 flex w-fit items-center gap-3 rounded-full border border-white/12 bg-[#11151E]/90 py-1.5 pl-4 pr-1.5 text-[14px] text-text backdrop-blur-md">
          Send the email and post on LinkedIn and X?
          <span className="rounded-full bg-[#A6BBFF] px-4 py-1.5 text-[13px] font-medium text-[#07111F]">
            Approve
          </span>
        </Part>
      </div>
    ),
  },
  /* 2. what customers want, with their words */
  {
    icon: Heart,
    label: "Make sense of the feedback.",
    prompt: "What are customers telling us about exports this month?",
    reads: ["intercom", "gmail", "hubspot"],
    output: (
      <Paper
        tool="intercom"
        kicker="Feedback, October"
        title="PDF layouts lead."
        status="Read 85 conversations"
      >
        <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3.5">
            {[
              ["Better PDF layouts", 42],
              ["Scheduled sends", 31],
              ["Faster CSV downloads", 12],
            ].map(([t, n], i) => (
              <Part key={t as string}>
                <div className="mb-1.5 flex items-baseline justify-between text-[14px]">
                  <span>{t}</span>
                  <span className="text-[12px] text-[#7a7f8c]">{n}</span>
                </div>
                <div className="h-2.5 rounded-full bg-black/[0.06]">
                  <motion.div
                    className="h-2.5 rounded-full"
                    style={{ background: ["#5b74ff", "#8a9bff", "#bcc6ff"][i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((n as number) / 42) * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease }}
                  />
                </div>
              </Part>
            ))}
          </div>
          <Part>
            <figure className="h-full rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(20,22,31,0.06)] ring-1 ring-black/[0.05]">
              <blockquote className="text-[14px] leading-[21px]">
                &ldquo;The PDF cuts off our charts. Fix that and the whole board gets it.&rdquo;
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2 text-[12px] text-[#7a7f8c]">
                <Avatar n="Priya Shah" hue="#d4a27a" />
                Priya Shah, Northwind
              </figcaption>
            </figure>
          </Part>
        </div>
      </Paper>
    ),
  },
  /* 3. a support chat window, closed out */
  {
    icon: MessagesSquare,
    label: "Close the loop with customers.",
    prompt: "Reply to everyone who reported the CSV bug, now that it's fixed.",
    reads: ["intercom", "linear"],
    output: (
      <div
        className="mx-auto max-w-[480px] overflow-hidden rounded-[24px] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
        style={{ color: INK }}
      >
        <div className="flex items-center gap-3 bg-[#1d2440] px-5 py-4 text-white">
          <ToolLogo id="intercom" size={18} brand />
          <span className="flex-1">
            <span className="block text-[14px] font-semibold leading-5">Orbit Support</span>
            <span className="block text-[12px] text-white/60">Diego Alvarez, Tallyhq</span>
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/80">
            Resolved
          </span>
        </div>
        <div className="space-y-3 bg-[#F4F5F8] px-5 py-5">
          <Part className="flex items-end gap-2.5">
            <Avatar n="Diego Alvarez" hue="#7ab0d4" />
            <p className="max-w-[78%] rounded-[18px] rounded-bl-md bg-white px-4 py-2.5 text-[14px] leading-[21px] shadow-[0_1px_2px_rgba(20,22,31,0.06)]">
              CSV exports keep timing out on big dashboards.
              <span className="mt-1 block text-[11px] text-[#9aa0ad]">3 days ago</span>
            </p>
          </Part>
          <Part className="flex items-end justify-end gap-2.5">
            <p className="max-w-[78%] rounded-[18px] rounded-br-md bg-[#5b74ff] px-4 py-2.5 text-[14px] leading-[21px] text-white">
              Good news, Diego: that&apos;s fixed. Big exports now finish in seconds. Thanks for
              flagging it.
              <span className="mt-1 block text-[11px] text-white/70">Juno, just now</span>
            </p>
            <MascotMark size={32} />
          </Part>
        </div>
        <Part className="flex items-center gap-3 border-t border-black/[0.06] px-5 py-3.5">
          <span className="grid size-6 place-items-center rounded-full bg-[#e5f2ea] text-[#2f8a5f]">
            <Check size={13} strokeWidth={2.5} aria-hidden />
          </span>
          <span className="flex-1 text-[13px]">Sent to all 12 customers who reported it</span>
          <span className="h-1.5 w-20 rounded-full bg-[#2f8a5f]" />
        </Part>
      </div>
    ),
  },
  /* 4. a website, live */
  {
    icon: LayoutTemplate,
    label: "Build us a website.",
    prompt: "Build a launch page for Scheduled Reports with a waitlist.",
    reads: ["figma", "notion"],
    output: (
      <div
        className="overflow-hidden rounded-[22px] bg-white shadow-[inset_0_1px_0_#fff]"
        style={{ color: INK }}
      >
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F1F0EC] px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#FF5F57]" />
            <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="size-2.5 rounded-full bg-[#28C840]" />
          </span>
          <span className="mx-auto rounded-md bg-white px-3 py-1 text-[11px] text-[#7a7f8c] ring-1 ring-black/[0.05]">
            orbit.com/scheduled-reports
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] text-[#2f8a5f]">
            <Check size={12} strokeWidth={2.5} aria-hidden />
            Live
          </span>
        </div>
        <div className="flex items-center justify-between px-6 pt-4 text-[12px] text-[#7a7f8c]">
          <span className="font-semibold text-[#14161f]">orbit</span>
          <span className="flex gap-4">
            <span>Product</span>
            <span>Pricing</span>
            <span>Customers</span>
          </span>
        </div>
        <div className="grid items-center gap-6 px-6 pb-7 pt-5 sm:grid-cols-[1.15fr_1fr]">
          <div>
            <Part>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#5b74ff]">
                New from Orbit
              </p>
            </Part>
            <Part>
              <p className="mt-2 text-[32px] font-semibold leading-[1] tracking-[-0.04em]">
                Reports that send themselves.
              </p>
            </Part>
            <Part>
              <p className="mt-3 text-[14px] leading-[21px] text-[#5b6070]">
                Pick a dashboard and a time. It lands in every inbox, every week.
              </p>
            </Part>
            <Part className="mt-5 flex gap-2">
              <span className="flex-1 rounded-xl px-3 py-2.5 text-[13px] text-[#9aa0ad] ring-1 ring-black/10">
                you@company.com
              </span>
              <span className="rounded-xl bg-[#14161f] px-4 py-2.5 text-[13px] font-medium text-white">
                Join the waitlist
              </span>
            </Part>
          </div>
          <Part>
            <div className="rounded-2xl bg-[#F7F6F2] p-4 ring-1 ring-black/[0.05]">
              <p className="text-[11px] text-[#7a7f8c]">Weekly revenue</p>
              <p className="text-[22px] font-semibold tracking-[-0.03em]">$412k</p>
              <div className="mt-3 flex h-20 items-end gap-1.5">
                {[38, 52, 46, 64, 58, 76, 88].map((h, i) => (
                  <motion.span
                    key={i}
                    className="flex-1 origin-bottom rounded-t-md"
                    style={{ height: `${h}%`, background: i === 6 ? "#5b74ff" : "#c9d1ff" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.05, ease }}
                  />
                ))}
              </div>
            </div>
          </Part>
        </div>
      </div>
    ),
  },
  /* 5. a post people will share */
  {
    icon: Wand2,
    label: "Make something worth sharing.",
    prompt: "Make a post about how much time Scheduled Reports saves teams.",
    reads: ["hubspot", "figma"],
    output: (
      <div className="rounded-[22px] bg-white p-5 md:p-6" style={{ color: INK }}>
        <Part className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#14161f] text-[13px] font-semibold text-white">
            o
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold leading-5">Orbit</span>
            <span className="block text-[12px] text-[#7a7f8c]">
              2,410 followers · Draft for LinkedIn
            </span>
          </span>
          <span className="grid size-6 place-items-center rounded bg-[#0A66C2] text-[11px] font-bold text-white">
            in
          </span>
        </Part>
        <Part>
          <p className="mt-3 text-[14px] leading-[21px]">
            Monday mornings used to mean screenshots and spreadsheets. Now the numbers just show up.
          </p>
        </Part>
        <Part className="mt-3">
          <div className="relative overflow-hidden rounded-2xl">
            <Gradient className="h-[150px]" />
            <div className="absolute inset-0 flex items-end justify-between p-5 text-white">
              <div>
                <p className="text-[48px] font-semibold leading-none tracking-[-0.05em]">6 hrs</p>
                <p className="mt-1 text-[13px] text-white/85">saved per team, every week</p>
              </div>
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/70">
                Orbit
              </p>
            </div>
          </div>
        </Part>
        <Part className="mt-3 flex items-center justify-between border-t border-black/[0.07] pt-3">
          <span className="text-[13px] text-[#7a7f8c]">Post tomorrow at 10:00 AM?</span>
          <span className="rounded-full bg-[#14161f] px-4 py-1.5 text-[13px] font-medium text-white">
            Approve
          </span>
        </Part>
      </div>
    ),
  },
  /* 6. people, and what they did: three cards on the stage */
  {
    icon: ClipboardCheck,
    label: "Prepare performance reviews.",
    prompt: "Prep performance reviews for the product team.",
    reads: ["linear", "github", "slack"],
    output: (
      <div style={{ color: INK }}>
        <div className="grid grid-cols-3 items-start gap-4">
          {[
            {
              n: "Leo Park",
              r: "Head of product",
              h: "Shipped Scheduled Reports a week early.",
              hue: "#7a8fff",
              s: 5,
              y: 0,
              src: "Linear",
            },
            {
              n: "Ana Ruiz",
              r: "Engineer",
              h: "Closed 64 bugs, the most on the team.",
              hue: "#d48a7a",
              s: 4,
              y: 36,
              src: "GitHub",
            },
            {
              n: "Ben Okoye",
              r: "Designer",
              h: "Led the pricing page redesign.",
              hue: "#7ad4b0",
              s: 4,
              y: 12,
              src: "Figma",
            },
          ].map((p) => (
            <Part key={p.n} style={{ marginTop: p.y }}>
              <div className="rounded-[22px] bg-white p-5 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between">
                  <Avatar n={p.n} hue={p.hue} />
                  <span className="rounded-full bg-[#F1F0EC] px-2 py-0.5 text-[10px] text-[#7a7f8c]">
                    Draft
                  </span>
                </div>
                <p className="mt-4 text-[16px] font-semibold leading-5">{p.n}</p>
                <p className="text-[12px] text-[#7a7f8c]">{p.r}</p>
                <p className="mt-4 text-[14px] leading-[20px]">&ldquo;{p.h}&rdquo;</p>
                <p className="mt-2 text-[11px] text-[#9aa0ad]">Evidence from {p.src}</p>
                <div className="mt-4 flex gap-1" aria-label={`${p.s} of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 flex-1 rounded-full"
                      style={{ background: i < p.s ? p.hue : "rgba(20,22,31,0.08)" }}
                    />
                  ))}
                </div>
              </div>
            </Part>
          ))}
        </div>
        <Part className="mt-6 text-center text-[13px] text-muted">
          3 review drafts in Notion, each backed by real work.
        </Part>
      </div>
    ),
  },
  /* 7. the update that never misses */
  {
    icon: FileText,
    label: "Keep the updates coming.",
    prompt: "Give me a weekly company update. Every Friday at 9.",
    reads: ["linear", "hubspot", "slack"],
    output: (
      <Paper
        tool="notion"
        kicker="Your company update"
        title="This week."
        status="Right on time, Friday 9:00 AM"
      >
        <div className="space-y-2.5">
          {[
            {
              k: "Shipped",
              t: "Scheduled Reports is live.",
              bg: "#e5f2ea",
              fg: "#2f8a5f",
              Icon: Check,
            },
            {
              k: "Ready to go",
              t: "Launch campaign is ready.",
              bg: "#ecebfb",
              fg: "#5b5bd6",
              Icon: Sparkles,
            },
            {
              k: "Needs you",
              t: "Approve the Northwind pricing.",
              bg: "#f8ecdc",
              fg: "#a35f00",
              Icon: CircleAlert,
            },
          ].map(({ k, t, bg, fg, Icon }) => (
            <Part key={k}>
              <div
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                style={{ background: bg }}
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/80"
                  style={{ color: fg }}
                >
                  <Icon size={16} strokeWidth={2} aria-hidden />
                </span>
                <span>
                  <span
                    className="block text-[11px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: fg }}
                  >
                    {k}
                  </span>
                  <span className="block text-[16px]">{t}</span>
                </span>
              </div>
            </Part>
          ))}
        </div>
      </Paper>
    ),
  },
  /* 8. who to sell to next: a CRM list */
  {
    icon: Search,
    label: "Find our next customers.",
    prompt: "Find 20 companies that look like our best customers.",
    reads: ["hubspot", "drive"],
    output: (
      <div
        className="overflow-hidden rounded-[18px] bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
        style={{ color: INK }}
      >
        <div className="flex items-center gap-3 border-b border-black/[0.06] px-5 py-3.5">
          <ToolLogo id="hubspot" size={16} brand />
          <span className="text-[13px] text-[#7a7f8c]">Lists</span>
          <span className="text-[13px] text-[#c0c4cc]">/</span>
          <span className="text-[13px] font-semibold">Lookalikes of top accounts</span>
          <span className="ml-auto rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-medium text-[#c75a1a]">
            20 new
          </span>
        </div>
        <div className="grid grid-cols-[1.4fr_1.6fr_70px] bg-[#FAFAF8] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#9aa0ad]">
          <span>Company</span>
          <span>Why they fit</span>
          <span className="text-right">Fit</span>
        </div>
        {[
          {
            n: "Fieldline Analytics",
            m: "Series B · 140 people",
            why: "Hiring 4 data analysts",
            f: 94,
            c: "#5b74ff",
          },
          {
            n: "Brightwater Health",
            m: "Series A · 60 people",
            why: "Same stack as Northwind",
            f: 91,
            c: "#2f8a5f",
          },
          {
            n: "Copperleaf Retail",
            m: "Growth · 300 people",
            why: "Asked about reporting on G2",
            f: 88,
            c: "#d4763a",
          },
          {
            n: "Northpass Logistics",
            m: "Series B · 210 people",
            why: "Churned from a competitor",
            f: 84,
            c: "#9b6bd4",
          },
        ].map((r, i) => (
          <Part
            key={r.n}
            className="grid grid-cols-[1.4fr_1.6fr_70px] items-center border-t border-black/[0.05] px-5 py-3"
          >
            <span className="flex items-center gap-3">
              <span
                className="grid size-8 shrink-0 place-items-center rounded-lg text-[12px] font-semibold text-white"
                style={{ background: r.c }}
              >
                {r.n[0]}
              </span>
              <span>
                <span className="block text-[14px] font-medium leading-5">{r.n}</span>
                <span className="block text-[11px] text-[#9aa0ad]">{r.m}</span>
              </span>
            </span>
            <span className="text-[13px] text-[#5b6070]">{r.why}</span>
            <span className="flex items-center justify-end gap-2">
              <span className="h-1.5 w-8 overflow-hidden rounded-full bg-black/[0.06]">
                <motion.span
                  className="block h-full rounded-full bg-[#2f8a5f]"
                  initial={{ width: 0 }}
                  animate={{ width: `${r.f}%` }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease }}
                />
              </span>
              <span className="text-[13px] font-semibold">{r.f}</span>
            </span>
          </Part>
        ))}
      </div>
    ),
  },
];

/* ------------------------------------------------------------ the section */

type Phase = "typing" | "working" | "done";

export function ChAsk() {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.4 });
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("done");
  const [typed, setTyped] = useState(tasks[0].prompt.length);
  const [hold, setHold] = useState(false);
  const [armed, setArmed] = useState(false);

  const task = tasks[idx];

  const pick = (i: number) => {
    setIdx(i);
    setTyped(reduce ? tasks[i].prompt.length : 0);
    setPhase(reduce ? "done" : "typing");
  };

  // first time in view: start from a blank box
  useEffect(() => {
    if (!inView || armed || reduce) return;
    const t = window.setTimeout(() => {
      setArmed(true);
      pick(0);
    }, 200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, armed, reduce]);

  // typing
  useEffect(() => {
    if (phase !== "typing") return;
    const full = task.prompt.length;
    const t = window.setInterval(() => {
      setTyped((n) => {
        if (n + 1 >= full) {
          window.clearInterval(t);
          window.setTimeout(() => setPhase("working"), 350);
          return full;
        }
        return n + 1;
      });
    }, 26);
    return () => window.clearInterval(t);
  }, [phase, task.prompt.length]);

  // working, then unfold
  useEffect(() => {
    if (phase !== "working") return;
    const t = window.setTimeout(() => setPhase("done"), 1400);
    return () => window.clearTimeout(t);
  }, [phase]);

  // next task after a beat (paused on hover or off screen)
  useEffect(() => {
    if (phase !== "done" || !armed || hold || !inView || reduce) return;
    const t = window.setTimeout(() => pick((idx + 1) % tasks.length), DWELL);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, armed, hold, inView, idx, reduce]);

  const autoplay = phase === "done" && armed && !hold && inView && !reduce;

  return (
    <section id="work" aria-labelledby="ask-title" className="chapter">
      <div className="container-page">
        <Reveal>
          <ChapterIntro
            id="ask-title"
            lead="What's on your plate?"
            muted="Just ask."
            sub="Say it in one sentence. Juno brings it back finished, in your brand."
          />
        </Reveal>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:items-center md:gap-10">
          {/* the plate */}
          <ul
            className="flex gap-2 overflow-x-auto pb-2 md:col-span-4 md:flex-col md:gap-1.5 md:overflow-visible md:pb-0"
            aria-label="Things to ask Juno"
          >
            {tasks.map((t, i) => {
              const on = i === idx;
              const Icon = t.icon;
              return (
                <li key={t.label} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setArmed(true);
                      pick(i);
                    }}
                    aria-pressed={on}
                    className={`relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 text-left text-[15px] transition-[color,background-color,border-color] duration-200 md:text-[17px] ${
                      on
                        ? "border-white/15 bg-white/[0.05] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        : "border-transparent text-muted hover:text-text"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors duration-200 ${on ? "bg-[#A6BBFF]/20 text-[#C9D5FF]" : "bg-white/[0.05] text-muted"}`}
                    >
                      <Icon size={17} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="whitespace-nowrap md:whitespace-normal">{t.label}</span>
                    {/* story-style timer to the next task */}
                    {on && (
                      <span
                        key={`${idx}-${phase}`}
                        aria-hidden
                        className="ask-timer absolute inset-x-4 bottom-0 h-px origin-left bg-[#A6BBFF]/70"
                        style={{
                          animationDuration: `${DWELL}ms`,
                          animationPlayState: autoplay ? "running" : "paused",
                          opacity: phase === "done" ? 1 : 0,
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* the stage: your sentence becomes the finished work */}
          <div
            ref={boxRef}
            onPointerEnter={() => setHold(true)}
            onPointerLeave={() => setHold(false)}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[radial-gradient(90%_70%_at_50%_0%,rgba(122,143,255,0.14),transparent_70%)] md:col-span-8 md:h-[640px]"
            style={{ perspective: 1400 }}
          >
            <div
              aria-hidden
              className="canvas-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(80%_70%_at_50%_40%,#000,transparent)]"
            />

            {/* the ask */}
            <div className="relative z-20 p-4 md:absolute md:inset-x-8 md:top-8 md:p-0">
              <div className="flex items-center gap-3 rounded-full border border-white/12 bg-[#11151E]/90 py-2 pl-3 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <MascotMark size={28} />
                <p className="min-h-6 flex-1 truncate text-[15px] leading-6 text-text md:text-[16px]">
                  {task.prompt.slice(0, typed)}
                  {phase === "typing" && (
                    <span
                      aria-hidden
                      className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-[#A6BBFF]"
                    />
                  )}
                </p>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                    phase === "typing" ? "bg-white/10 text-muted" : "bg-[#A6BBFF] text-[#07111F]"
                  }`}
                >
                  {phase === "done" ? (
                    <Check size={16} strokeWidth={2.25} aria-hidden />
                  ) : (
                    <ArrowUp size={16} strokeWidth={2} aria-hidden />
                  )}
                </span>
              </div>
            </div>

            {/* Juno gathers: the tools it reads fly into the ask */}
            <AnimatePresence>
              {phase === "working" && (
                <motion.div
                  key={`gather-${idx}`}
                  className="pointer-events-none absolute inset-0 z-10 hidden md:block"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {task.reads.map((r, i) => {
                    const spots = [
                      { x: "18%", y: "62%" },
                      { x: "78%", y: "70%" },
                      { x: "50%", y: "84%" },
                    ];
                    const p = spots[i % spots.length];
                    return (
                      <motion.span
                        key={r}
                        className="absolute grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/10 bg-[#141925] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
                        initial={{ left: p.x, top: p.y, opacity: 0, scale: 0.6 }}
                        animate={{
                          left: [p.x, p.x, "50%"],
                          top: [p.y, p.y, "8%"],
                          opacity: [0, 1, 0],
                          scale: [0.6, 1, 0.4],
                        }}
                        transition={{
                          duration: 1.25,
                          delay: i * 0.12,
                          times: [0, 0.35, 1],
                          ease: "easeInOut",
                        }}
                      >
                        <ToolLogo id={r} size={20} brand />
                      </motion.span>
                    );
                  })}
                  <motion.p
                    className="shimmer-text absolute left-1/2 top-[38%] -translate-x-1/2 text-[15px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Juno is on it
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* the result rises out of the ask */}
            <div className="relative z-10 flex items-center justify-center p-4 pt-2 md:absolute md:inset-x-10 md:bottom-10 md:top-[112px] md:p-0">
              <AnimatePresence mode="wait" initial={false}>
                {phase === "done" && (
                  <motion.div
                    key={idx}
                    className="w-full max-w-[620px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)] [border-radius:18px]"
                    initial={{ opacity: 0, y: -40, scale: 0.92, rotateX: 14 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, rotate: -0.6 }}
                    exit={{ opacity: 0, y: -24, scale: 0.97, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.7, ease }}
                    style={{ transformOrigin: "50% 0%" }}
                  >
                    <motion.div
                      initial="hidden"
                      animate="show"
                      variants={{
                        show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
                      }}
                    >
                      {task.output}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
