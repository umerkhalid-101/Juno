"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart2,
  Globe,
  MessageCircle,
  MessageSquare,
  Repeat2,
  Send,
  ThumbsUp,
  ArrowUp,
  Check,
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
import { siX } from "simple-icons";
import { Reveal } from "@/components/ui/Reveal";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { type ToolId } from "@/lib/story";
import { IMG } from "@/lib/images";

/**
 * "What’s on your plate?"
 * Pick a task. Your request lands, Juno thinks for a beat, then answers with what it read,
 * the finished work, and one question for you. Content mirrors runjuno.ai.
 */

const ease = [0.2, 0.8, 0.2, 1] as const;
const calm = [0.16, 1, 0.3, 1] as const;
const DWELL = 7000; // ms a finished answer stays before the next task

/* ------------------------------------------------------------ small parts */

/** Light paper card for the finished work. */
const Paper = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-[18px] bg-[#FBFAF7] text-[#14161f] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-black/5 ${className}`}>{children}</div>
);
const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-[#7a7f8c] ${className}`}>{children}</p>
);
const Pill = ({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "warn" | "blue" }) => {
  const t = {
    neutral: "bg-[#EEEDE8] text-[#4b515c]",
    ok: "bg-[#E6F4EC] text-[#1f7a4d]",
    warn: "bg-[#FDF0DC] text-[#9a5b0a]",
    blue: "bg-[#E9EDFF] text-[#3346e0]",
  }[tone];
  return <span className={`inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11.5px] font-medium ${t}`}>{children}</span>;
};
const Avatar = ({ n, bg, fg }: { n: string; bg: string; fg: string }) => (
  <span className="grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold" style={{ background: bg, color: fg }}>
    {n}
  </span>
);
/** Child that rises into place as the card unfolds. */
const Rise = ({ children, className = "", d = 0 }: { children: ReactNode; className?: string; d?: number }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 + d, ease: calm }}>
    {children}
  </motion.div>
);
/** LinkedIn's official mark. */
const LinkedInMark = ({ s = 16 }: { s?: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
    <path
      fill="#0A66C2"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </svg>
);
const XMark = ({ s = 16 }: { s?: number }) => (
  <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden>
    <path d={siX.path} fill="#000" />
  </svg>
);

/* ------------------------------------------------------------ the eight tasks */

type Task = {
  label: string;
  icon: LucideIcon;
  you: string;
  reply: string;
  sources: { tool: ToolId; label: string }[];
  work: ReactNode;
};

/** Orbit's little brand mark, for the posts and the email. */
const OrbitMark = ({ s = 28 }: { s?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2B3A8C,#0B1030)]" style={{ width: s, height: s }}>
    <svg viewBox="0 0 20 20" width={s * 0.62} height={s * 0.62} aria-hidden>
      <ellipse cx="10" cy="10" rx="7.5" ry="3.2" fill="none" stroke="#9DB0FF" strokeWidth="1.3" transform="rotate(-22 10 10)" />
      <circle cx="10" cy="10" r="2.6" fill="#50E5FF" />
    </svg>
  </span>
);

/** A real-looking screenshot of Orbit's weekly report: KPIs and an area chart on a grid. */
const ReportShot = ({ dark = false, compact = false, chart }: { dark?: boolean; compact?: boolean; chart?: number }) => {
  const pts = [30, 34, 31, 40, 38, 47, 45, 55, 52, 61, 66, 72];
  const w = 200;
  const h = chart ?? (compact ? 46 : 58);
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => h - (v / 80) * h;
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const ink = dark ? "#F4F6F8" : "#14161f";
  const sub = dark ? "rgba(244,246,248,0.55)" : "#7a7f8c";
  const grid = dark ? "rgba(255,255,255,0.08)" : "rgba(20,22,31,0.07)";
  return (
    <div className={`rounded-lg p-2.5 ${dark ? "bg-[#0E1218] ring-1 ring-white/10" : "bg-white ring-1 ring-black/[0.06]"}`}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: ink }}>
          <OrbitMark s={12} />
          Weekly report
        </span>
        <span className="font-mono text-[8.5px]" style={{ color: sub }}>
          Oct 6 to 12
        </span>
      </div>
      {!compact && (
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {[
            ["Revenue", "$48.2K", "+12%"],
            ["Active users", "3,410", "+8%"],
          ].map(([k, v, d]) => (
            <div key={k}>
              <p className="text-[8.5px]" style={{ color: sub }}>
                {k}
              </p>
              <p className="flex items-baseline gap-1 text-[13px] font-semibold tracking-[-0.02em]" style={{ color: ink }}>
                {v}
                <span className="text-[8.5px] font-medium text-[#1f9d5c]">{d}</span>
              </p>
            </div>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-1.5 w-full" style={{ height: h }} preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`area-${dark ? "d" : "l"}-${compact ? "c" : "f"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B6DFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5B6DFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke={grid} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#area-${dark ? "d" : "l"}-${compact ? "c" : "f"})`} />
        <path d={line} fill="none" stroke="#4F63F5" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r="2.6" fill="#4F63F5" />
      </svg>
    </div>
  );
};

/** 1. Announce that feature: the email in the inbox, the LinkedIn post and the X post. */
const LaunchKit = () => (
  <>
    {/* phone: the email, plus the two posts as ready lines */}
    <div className="space-y-2 sm:hidden">
      <Rise>
        <Paper className="overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-3.5 py-2.5">
            <OrbitMark s={26} />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[12.5px] font-semibold">Monday. Handled.</span>
              <span className="block truncate text-[11px] text-[#7a7f8c]">Orbit · to all customers</span>
            </span>
            <ToolLogo id="gmail" size={14} />
          </div>
          <div className="p-2.5">
            <ReportShot chart={34} />
          </div>
        </Paper>
      </Rise>
      <Rise d={0.15} className="flex items-center gap-3 rounded-xl bg-[#FBFAF7] px-3.5 py-2.5 text-[#14161f] ring-1 ring-black/5">
        <span className="flex items-center gap-2">
          <LinkedInMark s={16} />
          <XMark s={14} />
        </span>
        <span className="flex-1 truncate text-[13.5px] font-medium">Posts for LinkedIn and X</span>
        <Pill>Ready</Pill>
      </Rise>
    </div>

    {/* larger screens: the email up front, the posts fanned behind it */}
    <div className="relative mx-auto h-[300px] max-w-[620px] max-sm:hidden">
      {/* LinkedIn post */}
      <motion.div className="absolute left-0 top-7 w-[228px]" initial={{ opacity: 0, x: 120, rotate: 0 }} animate={{ opacity: 1, x: 0, rotate: -5 }} transition={{ duration: 0.7, delay: 0.45, ease: calm }}>
        <div className="overflow-hidden rounded-[10px] bg-white text-[#14161f] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-black/[0.08]">
          <div className="flex items-start gap-2 px-3 pt-3">
            <OrbitMark s={30} />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[11.5px] font-semibold">Orbit</span>
              <span className="block text-[9.5px] text-[#666]">1,240 followers</span>
              <span className="flex items-center gap-1 text-[9.5px] text-[#666]">
                2h · <Globe size={9} aria-hidden />
              </span>
            </span>
            <span className="text-[10px] font-semibold text-[#0A66C2]">+ Follow</span>
          </div>
          <p className="px-3 pt-2 text-[10.5px] leading-[14px]">
            Right on time. Scheduled Reports now land every Monday at 9, before your first coffee. <span className="text-[#666]">…more</span>
          </p>
          <div className="mt-2 bg-[#EEF2FF] p-2">
            <ReportShot compact chart={36} />
          </div>
          <div className="flex items-center justify-between px-3 pt-1.5 text-[9.5px] text-[#666]">
            <span className="flex items-center">
              <span className="grid size-3.5 place-items-center rounded-full bg-[#378FE9] ring-1 ring-white">
                <ThumbsUp size={7} className="fill-white text-white" aria-hidden />
              </span>
              <span className="-ml-1 grid size-3.5 place-items-center rounded-full bg-[#44712E] ring-1 ring-white">
                <Sparkles size={7} className="text-white" aria-hidden />
              </span>
              <span className="-ml-1 grid size-3.5 place-items-center rounded-full bg-[#DF704D] ring-1 ring-white">
                <Heart size={7} className="fill-white text-white" aria-hidden />
              </span>
              <span className="ml-1">128</span>
            </span>
            <span>14 comments · 6 reposts</span>
          </div>
          <div className="mx-3 mt-1.5 flex items-center justify-between border-t border-black/[0.08] py-1.5 text-[9.5px] font-semibold text-[#555]">
            {[
              [ThumbsUp, "Like"],
              [MessageSquare, "Comment"],
              [Repeat2, "Repost"],
              [Send, "Send"],
            ].map(([I, l]) => {
              const Icon = I as LucideIcon;
              return (
                <span key={l as string} className="flex items-center gap-1">
                  <Icon size={10} aria-hidden />
                  {l as string}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* X post */}
      <motion.div className="absolute right-0 top-7 w-[228px]" initial={{ opacity: 0, x: -120, rotate: 0 }} animate={{ opacity: 1, x: 0, rotate: 3 }} transition={{ duration: 0.7, delay: 0.55, ease: calm }}>
        <div className="rounded-[14px] bg-white p-3 text-[#0f1419] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.9)] ring-1 ring-black/[0.08]">
          <div className="flex gap-2">
            <OrbitMark s={30} />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[11px] leading-tight">
                <span className="font-bold">Orbit</span>
                <BadgeCheck size={11} className="fill-[#1D9BF0] text-white" aria-hidden />
                <span className="truncate text-[#536471]">@orbit · 1m</span>
              </p>
              <p className="mt-0.5 text-[11px] leading-[15px]">Reports. On repeat. Every Monday at 9, without anyone lifting a finger.</p>
              <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-black/[0.08]">
                <ReportShot dark compact chart={40} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[9.5px] text-[#536471]">
                {[
                  [MessageCircle, "12"],
                  [Repeat2, "48"],
                  [Heart, "310"],
                  [BarChart2, "2.1K"],
                ].map(([I, n]) => {
                  const Icon = I as LucideIcon;
                  return (
                    <span key={n as string} className="flex items-center gap-1">
                      <Icon size={10} aria-hidden />
                      {n as string}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* the email, open in the inbox */}
      <motion.div className="absolute left-1/2 top-0 z-10 w-[296px] -translate-x-1/2" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: calm }}>
        <div className="overflow-hidden rounded-[12px] bg-white text-[#1f1f1f] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-black/[0.08]">
          <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F6F8FC] px-3 py-2 text-[10.5px] text-[#5f6368]">
            <ToolLogo id="gmail" size={13} />
            <span className="flex-1 truncate font-medium text-[#1f1f1f]">Monday. Handled.</span>
            <span className="rounded bg-[#E8EAED] px-1.5 py-px text-[9px]">Inbox</span>
          </div>
          <div className="flex items-center gap-2 px-3 pt-2.5">
            <OrbitMark s={24} />
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[11px] font-semibold">
                Orbit <span className="font-normal text-[#5f6368]">&lt;hello@orbit.app&gt;</span>
              </span>
              <span className="block text-[9.5px] text-[#5f6368]">to me</span>
            </span>
            <span className="text-[9.5px] text-[#5f6368]">9:00 AM</span>
          </div>
          {/* the email body */}
          <div className="mx-3 mb-3 mt-2 rounded-lg bg-[#F7F7FB] p-2.5">
            <p className="text-[14px] font-semibold leading-[17px] tracking-[-0.02em]">Your report, every Monday at 9.</p>
            <div className="mt-2">
              <ReportShot chart={34} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-md bg-[#3346e0] px-3 py-1.5 text-[10.5px] font-semibold text-white">Turn on Scheduled Reports</span>
              <span className="text-[8.5px] text-[#9aa0ab]">Unsubscribe</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </>
);

/** 2. Make sense of the feedback: the real messages, the themes, and the fix. */
const themes = [
  { t: "Delivery date", v: 62 },
  { t: "Shipping cost", v: 21 },
  { t: "Payment", v: 17 },
];
const Feedback = () => (
  <div className="grid gap-3 sm:grid-cols-[1fr_1.05fr]">
    <Paper className="p-3.5 max-sm:hidden">
      <div className="flex items-center gap-2 text-[11.5px] text-[#7a7f8c]">
        <ToolLogo id="intercom" size={13} />
        Checkout conversations
      </div>
      <div className="mt-2.5 space-y-2">
        {[
          { n: "Priya", q: "Will it arrive by Friday?", c: "#E9E3FF", f: "#5b45d6", t: "9:12" },
          { n: "Tom", q: "I need it before my trip.", c: "#DFF1EA", f: "#1f7a4d", t: "9:40" },
          { n: "Ana", q: "Do weekends count?", c: "#FDE8E1", f: "#B8401F", t: "10:05" },
        ].map((m, i) => (
          <Rise key={m.n} d={i * 0.12} className="flex gap-2.5">
            <Avatar n={m.n[0]} bg={m.c} fg={m.f} />
            <div className="min-w-0 flex-1">
              <p className="flex justify-between text-[11.5px]">
                <span className="font-semibold">{m.n}</span>
                <span className="font-mono text-[10px] text-[#9aa0ab]">{m.t}</span>
              </p>
              <p className="mt-0.5 w-fit rounded-xl rounded-tl-sm bg-[#EFEEE9] px-2.5 py-1.5 text-[12.5px] leading-[17px]">{m.q}</p>
            </div>
          </Rise>
        ))}
      </div>
    </Paper>
    <Rise d={0.3}>
      <Paper className="h-full p-3.5">
        <Label>214 conversations · top themes</Label>
        <div className="mt-2.5 space-y-2">
          {themes.map((th, i) => (
            <div key={th.t}>
              <div className="flex justify-between text-[12px]">
                <span className={i === 0 ? "font-semibold" : "text-[#5d6370]"}>{th.t}</span>
                <span className="font-mono text-[11px] text-[#7a7f8c]">{th.v}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EEEDE8]">
                <motion.div className="h-full rounded-full" style={{ background: i === 0 ? "#3346e0" : "#B9C1D9" }} initial={{ width: 0 }} animate={{ width: `${th.v}%` }} transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: calm }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.07]">
          <p className="text-[14.5px] font-semibold leading-[19px] tracking-[-0.01em]">Show the arrival date before they pay.</p>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#E6F4EC] px-2.5 py-1.5 text-[12px] font-medium text-[#1f7a4d]">
            <span>Arrives Thursday</span>
            <span>at checkout</span>
          </div>
        </div>
      </Paper>
    </Rise>
  </div>
);

/** 3. Close the loop: the shipped issue, who asked, and a personal note. */
const CloseLoop = () => (
  <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
    <Paper className="p-3.5 max-sm:hidden">
      <div className="flex items-center gap-2 text-[11.5px] text-[#7a7f8c]">
        <ToolLogo id="linear" size={13} />
        SR-118
        <span className="ml-auto">
          <Pill tone="ok">
            <Check size={11} strokeWidth={3} aria-hidden />
            Done
          </Pill>
        </span>
      </div>
      <p className="mt-2 text-[16px] font-semibold tracking-[-0.02em]">Scheduled Reports</p>
      <p className="text-[11.5px] text-[#7a7f8c]">Shipped Monday · 2 customer requests linked</p>
      <div className="mt-3 space-y-2">
        {[
          { n: "M", who: "Maya", q: "Can reports run every Monday?", bg: "#E9E3FF", fg: "#5b45d6" },
          { n: "L", who: "Leo", q: "Weekly reports by email?", bg: "#DFF1EA", fg: "#1f7a4d" },
        ].map((p, i) => (
          <Rise key={p.who} d={i * 0.12} className="flex items-center gap-2.5 rounded-xl bg-white p-2 ring-1 ring-black/[0.06]">
            <Avatar n={p.n} bg={p.bg} fg={p.fg} />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11.5px] font-semibold">
                {p.who}
                <ToolLogo id="intercom" size={10} />
              </p>
              <p className="truncate text-[12px] text-[#4b515c]">“{p.q}”</p>
            </div>
          </Rise>
        ))}
      </div>
    </Paper>
    <Rise d={0.3}>
      <Paper className="h-full overflow-hidden">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2.5 text-[11.5px] text-[#7a7f8c]">
          <ToolLogo id="gmail" size={13} />
          To <span className="text-[#14161f]">Maya</span>
          <span className="sm:hidden">and Leo</span>
          <span className="ml-auto">
            <Pill>Draft</Pill>
          </span>
        </div>
        <div className="p-3.5">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">You asked. It’s here.</p>
          <p className="mt-1.5 text-[13px] leading-[19px] text-[#3a3f4f]">Maya, your Monday report can now arrive automatically. Want to try it?</p>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F3F2EE] px-2.5 py-1.5 text-[11.5px] text-[#5d6370]">
            <ToolLogo id="intercom" size={11} />
            She asked: “Can reports run every Monday?”
          </div>
        </div>
      </Paper>
    </Rise>
  </div>
);

/** 4. Build us a website: a real storefront for the spring collection. */
const products = [
  { n: "Stone vase", p: "$48", img: IMG.vaseStone },
  { n: "Sand vase", p: "$36", img: IMG.vaseSand },
  { n: "Dome lamp", p: "$84", img: IMG.lampDome },
];
const Website = () => (
  <Rise d={0}>
    <Paper className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F3F2EE] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto rounded-md bg-white px-3 py-0.5 text-[11px] text-[#7a7f8c] ring-1 ring-black/5">everydayobjects.co</span>
        <Pill tone="ok">Ready to publish</Pill>
      </div>
      {/* the site */}
      <div className="flex items-center justify-between px-4 py-2.5 text-[11.5px]">
        <span className="font-semibold tracking-[-0.01em]">Everyday Objects®</span>
        <span className="flex items-center gap-3 text-[#5d6370]">
          <span>Collection</span>
          <span className="max-sm:hidden">About</span>
          <span className="rounded-full bg-[#14161f] px-2 py-0.5 text-[10.5px] text-white">Bag 0</span>
        </span>
      </div>
      <div className="relative mx-3 overflow-hidden rounded-xl bg-[#EDE6DC]">
        <Image src={IMG.ceramicsHero} alt="" fill sizes="(max-width: 640px) 100vw, 600px" className="object-cover object-[70%_55%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F4EF] from-25% via-[#F7F4EF]/70 via-45% to-transparent to-75%" />
        <div className="relative flex flex-col items-start px-4 py-3">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#a2541f]">The Spring Edit</p>
          <p className="mock-serif mt-0.5 text-[24px] leading-[0.98] tracking-[-0.02em] sm:text-[27px]">
            Everyday,
            <br />
            beautiful.
          </p>
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-[#14161f] px-3 py-1 text-[11px] font-medium text-white">
            Explore the collection
            <ArrowRight size={11} aria-hidden />
          </span>
        </div>
      </div>
      <div className="px-3 pb-3 pt-2.5">
        <p className="px-1 text-[11px] font-medium text-[#7a7f8c]">New arrivals</p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {products.map((pr, i) => (
            <Rise key={pr.n} d={0.2 + i * 0.08} className="rounded-lg bg-white p-1.5 ring-1 ring-black/[0.05]">
              <div className="relative h-[42px] overflow-hidden rounded-md bg-[#EDE6DC] sm:h-[36px]">
                <Image src={pr.img} alt="" fill sizes="160px" className="object-cover" />
              </div>
              <p className="mt-1 flex justify-between px-0.5 text-[10.5px]">
                <span className="truncate font-medium">{pr.n}</span>
                <span className="text-[#7a7f8c]">{pr.p}</span>
              </p>
            </Rise>
          ))}
        </div>
      </div>
    </Paper>
  </Rise>
);

/** 5. Make something worth sharing: the visual, already in a LinkedIn post and an X post. */
const SpringVisual = ({ h, compact = false }: { h: string; compact?: boolean }) => (
  <div className={`relative overflow-hidden rounded-lg bg-[#EFE6D8] ${h}`}>
    <Image src={IMG.springEdit} alt="" fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover object-[50%_62%]" />
    {/* the sunlit wall on the left carries the type */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#F4ECDF]/85 via-[#F4ECDF]/40 via-45% to-transparent to-70%" />
    <div className={`absolute inset-y-0 left-0 flex flex-col justify-between text-[#2a2118] ${compact ? "p-2.5" : "p-3.5"}`}>
      <p className={`font-semibold tracking-[-0.01em] ${compact ? "text-[9.5px]" : "text-[11px]"}`}>Everyday Objects®</p>
      <div>
        <p className={`mock-serif leading-[0.98] tracking-[-0.01em] ${compact ? "text-[20px]" : "text-[27px]"}`}>
          A brighter
          <br />
          everyday.
        </p>
        {!compact && <p className="mt-1.5 text-[10px] font-medium tracking-[0.02em] text-[#8a5a2b]">The Spring Edit</p>}
      </div>
    </div>
  </div>
);
const Social = () => (
  <div className="relative mx-auto sm:h-[300px] sm:max-w-[560px]">
    {/* X post, fanned behind */}
    <motion.div className="absolute right-0 top-8 w-[210px] max-sm:hidden" initial={{ opacity: 0, x: -100, rotate: 0 }} animate={{ opacity: 1, x: 0, rotate: 3 }} transition={{ duration: 0.7, delay: 0.5, ease: calm }}>
      <Paper className="p-3">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="grid size-6 place-items-center rounded-full bg-[#14161f] text-[9px] font-bold text-white">EO</span>
          <span className="flex-1">
            <span className="font-semibold">Everyday Objects</span> <span className="text-[#7a7f8c]">@everyday</span>
          </span>
          <XMark s={11} />
        </div>
        <p className="mt-1.5 text-[11.5px] leading-[15px]">Spring is in. Meet the new edit.</p>
        <div className="mt-2">
          <SpringVisual h="h-[110px]" compact />
        </div>
        <p className="mt-2 flex justify-between font-mono text-[9.5px] text-[#7a7f8c]">
          <span>18</span>
          <span>64</span>
          <span>412</span>
          <span>3.4K</span>
        </p>
      </Paper>
    </motion.div>
    {/* LinkedIn post, up front */}
    <motion.div className="relative z-10 w-full sm:absolute sm:left-6 sm:top-0 sm:w-[310px]" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: calm }}>
      <Paper className="p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-[#14161f] text-[10.5px] font-bold text-white">EO</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold leading-tight">Everyday Objects</span>
            <span className="block text-[10.5px] text-[#7a7f8c]">3,180 followers · now</span>
          </span>
          <LinkedInMark s={15} />
        </div>
        <p className="mt-2 text-[12px] leading-[16px]">A brighter everyday starts here. The Spring Edit is live.</p>
        <div className="mt-2">
          <SpringVisual h="h-[120px] sm:h-[150px]" />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10.5px] text-[#7a7f8c]">
          <span className="flex items-center gap-1">
            <span className="size-3 rounded-full bg-[#0A66C2]" />
            <span className="-ml-1.5 size-3 rounded-full bg-[#DF704D] ring-1 ring-white" />
            <span className="ml-0.5">126</span>
          </span>
          <span>14 comments · 9 reposts</span>
        </div>
      </Paper>
    </motion.div>
  </div>
);

/** 6. Prepare performance reviews: a real review doc, the whole quarter in one place. */
const peers = [
  { n: "J", bg: "#E9E3FF", fg: "#5b45d6" },
  { n: "R", bg: "#DFF1EA", fg: "#1f7a4d" },
  { n: "S", bg: "#FDE8E1", fg: "#B8401F" },
];
const Review = () => (
  <Paper className="overflow-hidden">
    <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2 text-[11.5px] text-[#7a7f8c]">
      <ToolLogo id="notion" size={13} className="text-[#14161f]" />
      Reviews / Q3 / Alex Morgan
      <span className="ml-auto">
        <Pill>Draft</Pill>
      </span>
    </div>
    <div className="p-3.5 sm:p-4">
      <div className="flex items-center gap-3">
        <span className="mock-serif grid size-10 place-items-center rounded-full bg-[#E3E8DF] text-[15px] text-[#3c4a35]">AM</span>
        <div>
          <p className="text-[16px] font-semibold tracking-[-0.02em]">Alex Morgan</p>
          <p className="text-[11.5px] text-[#7a7f8c]">Product designer · Q3 review</p>
        </div>
        <div className="ml-auto text-right max-sm:hidden">
          <p className="text-[10.5px] text-[#7a7f8c]">Goals met</p>
          <p className="text-[15px] font-semibold">3 of 4</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Jul", "Onboarding redesigned"],
          ["Aug", "Design system shipped"],
          ["Sep", "Handoffs simplified"],
        ].map(([m, w], i) => (
          <Rise key={m} d={i * 0.1} className="rounded-lg bg-white p-2 ring-1 ring-black/[0.05]">
            <p className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#7a7f8c]">
              <Check size={10} strokeWidth={3} className="text-[#1f7a4d]" aria-hidden />
              {m}
            </p>
            <p className="mt-1 text-[12px] font-medium leading-[15px]">{w}</p>
          </Rise>
        ))}
      </div>
      <Rise d={0.35} className="mt-2.5 rounded-lg bg-[#F3F2EE] p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[12.5px] font-medium">“Made complex flows feel simple.”</p>
          <span className="flex">
            {peers.map((p, i) => (
              <span key={p.n} className={`grid size-5 place-items-center rounded-full text-[9px] font-semibold ring-2 ring-[#F3F2EE] ${i ? "-ml-1.5" : ""}`} style={{ background: p.bg, color: p.fg }}>
                {p.n}
              </span>
            ))}
          </span>
        </div>
        <p className="mt-0.5 text-[10.5px] text-[#7a7f8c]">From 3 teammates</p>
      </Rise>
      <Rise d={0.45} className="mt-2.5 max-sm:hidden">
        <p className="text-[10.5px] font-medium text-[#7a7f8c]">1:1 agenda</p>
        <p className="mt-1 flex items-center gap-2 text-[12.5px]">
          <span className="size-3.5 rounded-[4px] ring-1 ring-black/25" />
          Bring engineering in earlier
          <span className="text-[10.5px] text-[#9aa0ab]">· planning retro</span>
        </p>
      </Rise>
    </div>
  </Paper>
);

/** 7. Keep the updates coming: the Friday email, written and sent by Juno. */
const Updates = () => (
  <Paper className="overflow-hidden">
    <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2 text-[11.5px] text-[#7a7f8c]">
      <ToolLogo id="gmail" size={13} />
      From <span className="text-[#14161f]">Juno</span> to <span className="text-[#14161f]">Team</span>
      <span className="ml-auto">
        <Pill tone="blue">Every Fri · 9:00 AM</Pill>
      </span>
    </div>
    <div className="p-3.5 sm:p-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7a7f8c]">Your company update</p>
          <p className="text-[22px] font-semibold tracking-[-0.03em]">This week.</p>
        </div>
        <div className="flex gap-1 max-sm:hidden" aria-hidden>
          {["M", "T", "W", "T", "F"].map((d, i) => (
            <span key={i} className={`grid size-6 place-items-center rounded-md text-[10px] font-medium ${i === 4 ? "bg-[#14161f] text-white" : "bg-[#EEEDE8] text-[#9aa0ab]"}`}>
              {d}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {[
          { t: "Shipped", tone: "ok" as const, w: "Client portal is live.", d: "Used by 12 clients on day one.", tool: "linear" as ToolId },
          { t: "Ready", tone: "blue" as const, w: "Spring campaign is ready.", d: "Email and posts scheduled for Monday.", tool: "hubspot" as ToolId },
          { t: "Needs you", tone: "warn" as const, w: "Approve the delivery dates.", d: "Two orders are waiting on this.", tool: "slack" as ToolId },
        ].map((r, i) => (
          <Rise key={r.t} d={i * 0.12} className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-black/[0.05]">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#F3F2EE]">
              <ToolLogo id={r.tool} size={14} className="text-[#14161f]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">{r.w}</span>
              <span className="block truncate text-[11.5px] text-[#7a7f8c] max-sm:hidden">{r.d}</span>
            </span>
            <Pill tone={r.tone}>{r.t}</Pill>
          </Rise>
        ))}
      </div>
    </div>
  </Paper>
);

/** 8. Find our next customers: scored leads in the CRM, and a personal intro. */
const leads = [
  { m: "n.", n: "Northstar Studio", s: "Growing its client team", fit: 94, bg: "#14161f" },
  { m: "c.", n: "Cedar & Co.", s: "Launching a client service", fit: 88, bg: "#a2541f" },
  { m: "s.", n: "Sunday Studio", s: "Hiring account managers", fit: 81, bg: "#3346e0" },
];
const Prospects = () => (
  <div className="grid gap-3 sm:grid-cols-[1.1fr_1fr]">
    <Paper className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2 text-[11.5px] text-[#7a7f8c]">
        <ToolLogo id="hubspot" size={13} />
        New leads
        <span className="ml-auto">
          <Pill tone="blue">3 good fits</Pill>
        </span>
      </div>
      <div className="space-y-1.5 p-2.5">
        {leads.map((c, i) => (
          <Rise key={c.n} d={i * 0.1} className="flex items-center gap-2.5 rounded-xl bg-white p-2 ring-1 ring-black/[0.05]">
            <span className="mock-serif grid size-8 shrink-0 place-items-center rounded-lg text-[15px] text-white" style={{ background: c.bg }}>
              {c.m}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-semibold">{c.n}</span>
              <span className="block truncate text-[11px] text-[#7a7f8c]">{c.s}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-mono text-[12px] font-semibold text-[#1f7a4d]">{c.fit}%</span>
              <span className="block text-[9.5px] text-[#9aa0ab]">fit</span>
            </span>
          </Rise>
        ))}
      </div>
    </Paper>
    <Rise d={0.35} className="max-sm:hidden">
      <Paper className="h-full overflow-hidden">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2 text-[11.5px] text-[#7a7f8c]">
          <ToolLogo id="gmail" size={13} />
          To <span className="text-[#14161f]">Maya, Northstar</span>
          <span className="ml-auto">
            <Pill>Draft</Pill>
          </span>
        </div>
        <div className="p-3.5">
          <p className="text-[15.5px] font-semibold leading-[20px] tracking-[-0.02em]">More clients. Less back-and-forth.</p>
          <p className="mt-1.5 text-[12.5px] leading-[18px] text-[#3a3f4f]">
            Hi Maya, saw you’re growing the client team. We bring files, feedback and approvals into one shared space. Worth a quick look?
          </p>
        </div>
      </Paper>
    </Rise>
  </div>
);

const tasks: Task[] = [
  {
    label: "Announce that feature.",
    icon: Sparkles,
    you: "We’re launching Scheduled Reports. Get the email and social posts ready.",
    reply: "Your launch kit is ready. In your brand.",
    sources: [
      { tool: "linear", label: "Release notes" },
      { tool: "figma", label: "Brand kit" },
    ],
    work: <LaunchKit />,
  },
  {
    label: "Make sense of the feedback.",
    icon: Heart,
    you: "What are customers struggling with at checkout?",
    reply: "They need a date they can plan around.",
    sources: [
      { tool: "intercom", label: "Customer feedback" },
      { tool: "zendesk", label: "Tickets" },
    ],
    work: <Feedback />,
  },
  {
    label: "Close the loop with customers.",
    icon: MessagesSquare,
    you: "Scheduled Reports is live. Who asked for it?",
    reply: "I found the customers who asked.",
    sources: [
      { tool: "linear", label: "Shipped" },
      { tool: "intercom", label: "Requests" },
    ],
    work: <CloseLoop />,
  },
  {
    label: "Build us a website.",
    icon: LayoutTemplate,
    you: "Build a beautiful site for our spring collection.",
    reply: "A fresh home for your collection.",
    sources: [
      { tool: "drive", label: "Spring photos" },
      { tool: "figma", label: "Brand" },
    ],
    work: <Website />,
  },
  {
    label: "Make something worth sharing.",
    icon: Wand2,
    you: "Create a social visual for our spring collection. Keep it in our brand.",
    reply: "Ready to share. In your brand.",
    sources: [
      { tool: "figma", label: "Brand" },
      { tool: "drive", label: "Spring photos" },
    ],
    work: <Social />,
  },
  {
    label: "Prepare performance reviews.",
    icon: ClipboardCheck,
    you: "Help me prepare for Alex’s performance review.",
    reply: "The whole quarter. Brought together.",
    sources: [
      { tool: "linear", label: "Project work" },
      { tool: "slack", label: "Peer feedback" },
      { tool: "notion", label: "Past goals" },
    ],
    work: <Review />,
  },
  {
    label: "Keep the updates coming.",
    icon: FileText,
    you: "Give me a weekly company update. Every Friday at 9.",
    reply: "Every Friday at 9 AM.",
    sources: [
      { tool: "linear", label: "Projects" },
      { tool: "slack", label: "Team updates" },
      { tool: "hubspot", label: "Deals" },
    ],
    work: <Updates />,
  },
  {
    label: "Find our next customers.",
    icon: Search,
    you: "Find our next customers for the client portal.",
    reply: "Good fits. A personal way in.",
    sources: [
      { tool: "hubspot", label: "Best customers" },
      { tool: "analytics", label: "Who visits" },
    ],
    work: <Prospects />,
  },
];

/* ------------------------------------------------------------ the section */

/** 0: your request lands. 1: Juno thinks. 2: the answer unfolds. */
type Step = 0 | 1 | 2;

export function ChAsk() {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.35 });
  const [idx, setIdx] = useState(0);
  // nothing plays until the section is in view: an empty conversation waits for you
  const [step, setStep] = useState<Step>(0);
  const [sent, setSent] = useState(false); // your message has been sent into the conversation
  const juno = useRef<MascotApi>(null);
  const [hold, setHold] = useState(false);
  const [armed, setArmed] = useState(false);
  const task = tasks[idx];

  const pick = (i: number) => {
    setArmed(true);
    setIdx(i);
    setStep(reduce ? 2 : 0);
    setSent(true);
  };

  // first time in view: start the first task from the top
  useEffect(() => {
    if (!inView || armed) return;
    const t = window.setTimeout(() => {
      setArmed(true);
      pick(0);
    }, reduce ? 0 : 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, armed, reduce]);

  // your request is sent in, then Juno reads its sources, then answers
  useEffect(() => {
    if (!armed || !sent) return;
    if (step === 0) {
      const t = window.setTimeout(() => setStep(1), 350);
      return () => window.clearTimeout(t);
    }
    if (step === 1) {
      const t = window.setTimeout(() => setStep(2), 650);
      return () => window.clearTimeout(t);
    }
  }, [step, sent, armed, idx]);

  // Juno nods when the work is done
  useEffect(() => {
    if (step === 2 && !reduce) juno.current?.nod();
  }, [step, idx, reduce]);

  // next task after a beat (paused on hover or off screen)
  useEffect(() => {
    if (step !== 2 || !armed || hold || !inView || reduce) return;
    const t = window.setTimeout(() => pick((idx + 1) % tasks.length), DWELL);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, armed, hold, inView, idx, reduce]);

  const autoplay = step === 2 && armed && !hold && inView && !reduce;

  return (
    <section id="work" aria-labelledby="ask-title" className="chapter">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <h2 id="ask-title" className="t-display-l text-balance">
            What’s on your plate?
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-12 md:gap-10">
          {/* the plate */}
          <ul className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:col-span-4 md:flex-col md:gap-1 md:self-center md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden" aria-label="Things to ask Juno">
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
                    className={`relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border px-3.5 py-3 text-left text-[15px] transition-[color,background-color,border-color] duration-200 md:text-[16px] ${
                      on ? "border-white/[0.12] bg-white/[0.05] text-text" : "border-transparent text-muted hover:bg-white/[0.02] hover:text-text"
                    }`}
                  >
                    <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] transition-colors duration-200 ${on ? "bg-white/[0.1] text-text" : "bg-white/[0.04] text-muted"}`}>
                      <Icon size={17} strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="whitespace-nowrap md:whitespace-normal">{t.label}</span>
                    {on && (
                      <span
                        key={`${idx}-${step}`}
                        aria-hidden
                        className="ask-timer absolute inset-x-3.5 bottom-0 h-px origin-left bg-white/40"
                        style={{ animationDuration: `${DWELL}ms`, animationPlayState: autoplay ? "running" : "paused", opacity: step === 2 ? 1 : 0 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* the conversation */}
          <div
            ref={boxRef}
            onPointerEnter={() => setHold(true)}
            onPointerLeave={() => setHold(false)}
            className="relative -mx-2 flex h-[660px] flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B0E14] p-4 sm:mx-0 md:col-span-8 md:h-[680px] md:p-7"
          >
            {/* the stage brightens while Juno reads */}
            <div aria-hidden className={`pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(122,143,255,0.16),transparent_70%)] transition-opacity duration-700 ${step === 1 ? "opacity-100" : "opacity-60"}`} />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={idx} className="flex min-h-0 flex-1 flex-col" exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                {/* you */}
                <div className="relative z-10 flex min-h-[44px] justify-end">
                  {sent && (
                    <motion.p
                      className="max-w-[82%] origin-bottom-right rounded-[20px] rounded-br-md bg-[#F4F6F8] px-4 py-2.5 text-[14.5px] leading-[21px] text-[#07090D] md:text-[15px]"
                      initial={{ opacity: 0, y: 40, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    >
                      {task.you}
                    </motion.p>
                  )}
                </div>

                {/* Juno */}
                <div className="relative z-10 mt-5 flex items-start gap-3 md:mt-6">
                  <span className={`shrink-0 transition-opacity duration-300 ${!sent ? "opacity-40" : "opacity-100"}`}>
                    <Mascot size={32} state="idle" halo={false} apiRef={juno} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[12px] text-subtle transition-opacity duration-300 ${!sent ? "opacity-0" : "opacity-100"}`}>Juno</p>
                    {step === 2 ? (
                      <motion.p className="mt-0.5 text-[19px] font-medium leading-[26px] tracking-[-0.02em] text-text md:text-[22px] md:leading-[30px]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: calm }}>
                        {task.reply}
                      </motion.p>
                    ) : (
                      <span className={`mt-2 flex h-6 items-center gap-1 transition-opacity ${sent ? "opacity-100" : "opacity-0"}`} aria-label="Juno is reading">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="think-dot size-1.5 rounded-full bg-white/60" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                {step >= 1 && (
                    <motion.div className="relative z-10 mt-3 flex flex-wrap gap-2 pl-[44px]" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}>
                      {task.sources.map((s) => (
                        <motion.span
                          key={s.label}
                          variants={{ h: { opacity: 0, y: 6 }, s: { opacity: 1, y: 0, transition: { duration: 0.35, ease } } }}
                          className={`inline-flex h-8 items-center gap-2 rounded-full border pl-1.5 pr-3 text-[12.5px] transition-colors duration-300 ${
                            step === 1 ? "reading border-white/[0.14] bg-white/[0.06] text-text" : "border-white/[0.08] bg-white/[0.04] text-muted"
                          }`}
                        >
                          <span className="grid size-5 place-items-center rounded-full bg-white">
                            <ToolLogo id={s.tool} size={12} className="text-[#14161f]" />
                          </span>
                          {s.label}
                        </motion.span>
                      ))}
                    </motion.div>
                )}

                {step === 2 && (
                  <>
                    {/* the finished work */}
                    <div className="relative z-10 mt-5 min-h-0 flex-1 [perspective:1200px]">
                      <motion.div
                        className="relative mx-auto w-full max-w-[640px]"
                        initial={{ opacity: 0, y: 36, rotateX: 18, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: calm }}
                        style={{ transformOrigin: "50% 0%" }}
                      >
                        {task.work}
                      </motion.div>
                    </div>

                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* the composer */}
            <div className="relative z-10 mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#11151E] py-2 pl-4 pr-2 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.8)]">
              <p className="min-h-6 min-w-0 flex-1 truncate text-[14.5px] leading-6 md:text-[15px]">
                <span className="text-subtle">Ask Juno anything</span>
              </p>
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-subtle"
              >
                <ArrowUp size={16} strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

