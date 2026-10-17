"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
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

/**
 * "What's on your plate?"
 * Pick a task. Your request lands, Juno thinks for a beat, then answers with what it read,
 * the finished work, and one question for you. Content mirrors runjuno.ai.
 */

const ease = [0.2, 0.8, 0.2, 1] as const;
const calm = [0.16, 1, 0.3, 1] as const;
const DWELL = 7000; // ms a finished answer stays before the next task
const photo = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

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

/** A tiny weekly report, the thing being launched. */
const MiniReport = ({ tall = false }: { tall?: boolean }) => (
  <div className="rounded-lg bg-white p-2.5 shadow-[0_8px_20px_-10px_rgba(40,50,120,0.35)] ring-1 ring-black/[0.05]">
    <div className="flex items-center justify-between">
      <span className="text-[10.5px] font-semibold">Weekly report</span>
      <span className="font-mono text-[9px] text-[#7a7f8c]">MON 9:00</span>
    </div>
    <div className={`mt-2 flex items-end gap-1 ${tall ? "h-14" : "h-9"}`}>
      {[38, 52, 44, 66, 58, 80, 92].map((h, i) => (
        <span key={i} className="flex-1 rounded-sm bg-[linear-gradient(180deg,#7A8FFF,#3346e0)]" style={{ height: `${h}%`, opacity: 0.45 + i * 0.08 }} />
      ))}
    </div>
  </div>
);

const PostActions = () => (
  <div className="mt-2.5 flex items-center justify-between border-t border-black/[0.06] pt-2 text-[10.5px] text-[#7a7f8c]">
    <span>Like</span>
    <span>Comment</span>
    <span>Repost</span>
    <span>Send</span>
  </div>
);

/** 1. Announce that feature: the email, the LinkedIn post and the X post, ready to go. */
const LaunchKit = () => (
  <>
    {/* phone: the email, plus the two posts as ready lines */}
    <div className="space-y-2 sm:hidden">
      <Rise>
        <Paper className="p-3.5">
          <div className="flex items-center gap-2 text-[11.5px] text-[#7a7f8c]">
            <ToolLogo id="gmail" size={14} />
            To all customers
            <span className="ml-auto">
              <Pill tone="ok">Ready</Pill>
            </span>
          </div>
          <p className="mt-2 text-[16px] font-semibold tracking-[-0.02em]">Monday. Handled.</p>
          <div className="mt-2 rounded-xl bg-gradient-to-br from-[#E9EDFF] to-[#F3EEFF] p-2.5">
            <MiniReport />
          </div>
        </Paper>
      </Rise>
      {[
        { m: <LinkedInMark s={16} />, n: "LinkedIn", t: "Right on time." },
        { m: <XMark s={14} />, n: "X", t: "Reports. On repeat." },
      ].map((p, i) => (
        <Rise key={p.n} d={0.15 + i * 0.1} className="flex items-center gap-3 rounded-xl bg-[#FBFAF7] px-3.5 py-2.5 text-[#14161f] ring-1 ring-black/5">
          {p.m}
          <span className="flex-1 truncate text-[13.5px] font-medium">{p.t}</span>
          <Pill>Post ready</Pill>
        </Rise>
      ))}
    </div>

    {/* larger screens: the email up front, the posts fanned behind it */}
    <div className="relative mx-auto h-[290px] max-w-[600px] max-sm:hidden">
      {/* LinkedIn post */}
      <motion.div className="absolute left-0 top-6 w-[220px]" initial={{ opacity: 0, x: 120, rotate: 0 }} animate={{ opacity: 1, x: 0, rotate: -5 }} transition={{ duration: 0.7, delay: 0.45, ease: calm }}>
        <Paper className="p-3">
          <div className="flex items-center gap-2">
            <OrbitMark s={26} />
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold leading-tight">Orbit</span>
              <span className="block text-[10px] text-[#7a7f8c]">1,240 followers · now</span>
            </span>
            <LinkedInMark s={14} />
          </div>
          <p className="mt-2 text-[12px] leading-[16px]">
            <span className="font-semibold">Right on time.</span> Scheduled Reports land every Monday at 9.
          </p>
          <div className="mt-2 rounded-lg bg-gradient-to-br from-[#E4F1FB] to-[#EEF2FF] p-2">
            <MiniReport />
          </div>
          <PostActions />
        </Paper>
      </motion.div>

      {/* X post */}
      <motion.div className="absolute right-0 top-6 w-[220px]" initial={{ opacity: 0, x: -120, rotate: 0 }} animate={{ opacity: 1, x: 0, rotate: 5 }} transition={{ duration: 0.7, delay: 0.55, ease: calm }}>
        <Paper className="p-3">
          <div className="flex items-center gap-2">
            <OrbitMark s={26} />
            <span className="min-w-0 flex-1 text-[11.5px] leading-tight">
              <span className="font-semibold">Orbit</span> <span className="text-[#7a7f8c]">@orbit · 1m</span>
            </span>
            <XMark s={12} />
          </div>
          <p className="mt-2 text-[12.5px] font-medium leading-[17px]">Reports. On repeat. Every Monday, before your first coffee.</p>
          <div className="mt-2 grid h-[64px] place-items-center rounded-lg bg-[#14161f] text-white">
            <span className="text-center">
              <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-white/60">Every Mon</span>
              <span className="block text-[18px] font-semibold tracking-[-0.02em]">9:00 AM</span>
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-black/[0.06] pt-2 font-mono text-[10px] text-[#7a7f8c]">
            <span>12</span>
            <span>48</span>
            <span>310</span>
            <span>2.1K</span>
          </div>
        </Paper>
      </motion.div>

      {/* the email, up front */}
      <motion.div className="absolute left-1/2 top-0 z-10 w-[300px] -translate-x-1/2" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: calm }}>
        <Paper className="overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2.5 text-[11.5px] text-[#7a7f8c]">
            <ToolLogo id="gmail" size={14} />
            To <span className="text-[#14161f]">All customers</span>
            <span className="ml-auto">
              <Pill tone="ok">Ready</Pill>
            </span>
          </div>
          <p className="px-3.5 pt-2.5 text-[16px] font-semibold tracking-[-0.02em]">Monday. Handled.</p>
          <div className="mx-3.5 mt-2.5 rounded-xl bg-gradient-to-br from-[#E9EDFF] to-[#F3EEFF] p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <OrbitMark s={16} />
              <span className="text-[10.5px] font-semibold text-[#3346e0]">Orbit</span>
            </div>
            <MiniReport />
          </div>
          <div className="flex items-center justify-between gap-2 p-3.5 pt-2.5">
            <span className="text-[11.5px] leading-[15px] text-[#4b515c]">Every Monday at 9, on its own.</span>
            <span className="inline-flex shrink-0 rounded-full bg-[#14161f] px-3 py-1.5 text-[11.5px] font-medium text-white">Try it</span>
          </div>
        </Paper>
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

/** 4. Build us a website: the spring collection site. */
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
      </div>
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-[1.05fr_1fr]">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold tracking-[-0.01em]">Everyday Objects®</span>
            <span className="flex gap-3 text-[#5d6370]">
              <span>Collection</span>
              <span>About</span>
            </span>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#a2541f] sm:mt-6">The Spring Edit</p>
          <p className="mock-serif mt-2 text-[30px] leading-[0.98] tracking-[-0.02em] sm:text-[34px]">
            Everyday,
            <br />
            beautiful.
          </p>
          <p className="mt-3 text-[13px] leading-[19px] text-[#5d6370] max-sm:hidden">Good things. For the place you call home.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#14161f] px-3.5 py-1.5 text-[12px] font-medium text-white">
            Explore the collection
            <ArrowRight size={12} aria-hidden />
          </span>
        </div>
        <div className="relative h-[84px] bg-[#EDE6DC] sm:h-auto sm:min-h-[230px]">
          <Image src={photo("1638303322325-ff70d6224a22")} alt="" fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover" />
        </div>
      </div>
    </Paper>
  </Rise>
);

/** 5. Make something worth sharing: the social visual, ready for both channels. */
const channels = [
  { m: <LinkedInMark s={16} />, n: "LinkedIn", s: "1200 × 1200" },
  { m: <XMark s={14} />, n: "X", s: "1600 × 900" },
];
const Social = () => (
  <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto] sm:gap-4">
    <Rise d={0}>
      <Paper className="overflow-hidden p-2.5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#E9DCCB]">
          <Image src={photo("1613424777445-f93a2a48e285")} alt="" fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <p className="absolute left-4 top-3.5 text-[12px] font-semibold text-white/95">Everyday Objects®</p>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="mock-serif text-[28px] leading-[1] sm:text-[30px]">
              A brighter
              <br />
              everyday.
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">The Spring Edit</p>
          </div>
        </div>
      </Paper>
    </Rise>
    <div className="flex gap-2 sm:block sm:space-y-2">
      {channels.map((c, i) => (
        <Rise key={c.n} d={0.25 + i * 0.1} className="max-sm:flex-1">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#FBFAF7] px-3 py-2.5 text-[#14161f] ring-1 ring-black/5 sm:w-[150px]">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-black/5">{c.m}</span>
            <span>
              <span className="block text-[12.5px] font-semibold">{c.n}</span>
              <span className="block whitespace-nowrap text-[11px] text-[#7a7f8c]">{c.s}</span>
            </span>
          </div>
        </Rise>
      ))}
    </div>
  </div>
);

/** 6. Prepare performance reviews: the whole quarter, brought together. */
const Review = () => (
  <Paper className="p-4 max-sm:p-3.5">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <span className="mock-serif grid size-11 place-items-center rounded-full bg-[#E3E8DF] text-[16px] text-[#3c4a35]">AM</span>
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.02em]">Alex Morgan</p>
          <p className="text-[12px] text-[#7a7f8c]">Product designer · Q3 review</p>
        </div>
      </div>
      <Pill>Draft</Pill>
    </div>
    <div className="relative mt-4 grid grid-cols-3 max-sm:mt-3">
      <span aria-hidden className="absolute left-[10px] right-[calc(33%-10px)] top-[26px] h-px bg-black/10" />
      {[
        ["Jul", "Onboarding redesigned"],
        ["Aug", "Design system shipped"],
        ["Sep", "Team handoffs simplified"],
      ].map(([m, w], i) => (
        <Rise key={m} d={i * 0.12}>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7a7f8c]">{m}</p>
          <span className="relative mt-1.5 grid size-5 place-items-center rounded-full bg-[#E6F4EC] text-[#1f7a4d]">
            <Check size={11} strokeWidth={3} aria-hidden />
          </span>
          <p className="mt-1.5 pr-3 text-[12.5px] font-medium leading-[16px] sm:text-[13px] sm:leading-[17px]">{w}</p>
        </Rise>
      ))}
    </div>
    <div className="mt-4 grid gap-2.5 max-sm:mt-3 sm:grid-cols-2">
      <Rise d={0.4} className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
        <Label>What stood out</Label>
        <p className="mt-1.5 text-[13.5px] font-medium leading-[18px]">“Made complex flows feel simple.”</p>
        <p className="mt-1 text-[11px] text-[#7a7f8c]">Peer feedback</p>
      </Rise>
      <Rise d={0.5} className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06] max-sm:hidden">
        <Label>Talk through next</Label>
        <p className="mt-1.5 text-[13.5px] font-medium leading-[18px]">Bring engineering in earlier.</p>
        <p className="mt-1 text-[11px] text-[#7a7f8c]">Planning retro</p>
      </Rise>
    </div>
  </Paper>
);

/** 7. Keep the updates coming: every Friday at 9, on its own. */
const Updates = () => (
  <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
    <Paper className="p-3.5 max-sm:hidden">
      <Label>Schedule</Label>
      <div className="mt-2.5 space-y-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
          <div key={d} className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12.5px] ${d === "Fri" ? "bg-[#14161f] font-medium text-white" : "text-[#9aa0ab]"}`}>
            {d}
            {d === "Fri" && <span className="font-mono text-[10.5px]">9:00 AM</span>}
          </div>
        ))}
      </div>
    </Paper>
    <Paper className="p-4">
      <div className="flex items-center justify-between">
        <Label>Your company update</Label>
        <Pill tone="ok">
          <span className="sm:hidden">Fri · 9:00 AM</span>
          <span className="max-sm:hidden">Right on time</span>
        </Pill>
      </div>
      <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em]">This week.</p>
      <div className="mt-3 divide-y divide-black/[0.06]">
        {[
          { t: "Shipped", tone: "ok" as const, w: "Client portal is live." },
          { t: "Ready", tone: "blue" as const, w: "Spring campaign is ready." },
          { t: "Needs you", tone: "warn" as const, w: "Approve the delivery dates." },
        ].map((r, i) => (
          <Rise key={r.t} d={i * 0.12} className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-[13.5px] font-medium">{r.w}</span>
            <Pill tone={r.tone}>{r.t}</Pill>
          </Rise>
        ))}
      </div>
    </Paper>
  </div>
);

/** 8. Find our next customers: good fits, and a personal way in. */
const Prospects = () => (
  <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
    <Paper className="p-4">
      <div className="flex items-center justify-between">
        <Label>Your next customers</Label>
        <span className="sm:hidden">
          <Pill tone="blue">3 intros drafted</Pill>
        </span>
      </div>
      <div className="mt-2.5 space-y-2">
        {[
          { m: "n.", n: "Northstar Studio", k: "Design agency", s: "Growing its client team", bg: "#14161f" },
          { m: "c.", n: "Cedar & Co.", k: "Creative studio", s: "Launching a client service", bg: "#a2541f" },
          { m: "s.", n: "Sunday Studio", k: "Brand agency", s: "Hiring account managers", bg: "#3346e0" },
        ].map((c, i) => (
          <Rise key={c.n} d={i * 0.1} className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-black/[0.06]">
            <span className="mock-serif grid size-9 shrink-0 place-items-center rounded-lg text-[17px] text-white" style={{ background: c.bg }}>
              {c.m}
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold">{c.n}</span>
              <span className="block truncate text-[11.5px] text-[#7a7f8c]">
                {c.k} · {c.s}
              </span>
            </span>
          </Rise>
        ))}
      </div>
    </Paper>
    <Rise d={0.35} className="max-sm:hidden">
      <Paper className="h-full p-4">
        <div className="flex items-center justify-between text-[12px] text-[#7a7f8c]">
          <span>Personal introduction</span>
          <Pill>Draft</Pill>
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <Avatar n="M" bg="#E9E3FF" fg="#5b45d6" />
          <span className="text-[12.5px]">
            <span className="font-semibold">Maya</span> <span className="text-[#7a7f8c]">· Northstar Studio</span>
          </span>
        </div>
        <p className="mt-3 text-[17px] font-semibold leading-[21px] tracking-[-0.02em]">More clients. Less back-and-forth.</p>
        <p className="mt-2 text-[13px] leading-[19px] text-[#3a3f4f]">
          Hi Maya, saw you’re growing the client team. We bring files, feedback and approvals into one shared space. Worth a quick look?
        </p>
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
  const [step, setStep] = useState<Step>(2);
  const [sent, setSent] = useState(true); // your message has been sent from the composer
  const [typed, setTyped] = useState(0); // characters typed into the composer
  const juno = useRef<MascotApi>(null);
  const [hold, setHold] = useState(false);
  const [armed, setArmed] = useState(false);
  const task = tasks[idx];

  const pick = (i: number) => {
    setIdx(i);
    setStep(reduce ? 2 : 0);
    setSent(!!reduce);
    setTyped(0);
  };

  // first time in view: start the first task from the top
  useEffect(() => {
    if (!inView || armed || reduce) return;
    const t = window.setTimeout(() => {
      setArmed(true);
      pick(0);
    }, 200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, armed, reduce]);

  // request lands, then Juno works through its steps one by one, then answers
  useEffect(() => {
    if (step === 0) {
      // type into the composer, send, then Juno starts reading
      if (!sent) {
        const done = typed >= task.you.length;
        const t = window.setTimeout(() => (done ? setSent(true) : setTyped((n) => n + 2)), done ? 380 : 26);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setStep(1), 650);
      return () => window.clearTimeout(t);
    }
    if (step === 1) {
      const t = window.setTimeout(() => setStep(2), 1300);
      return () => window.clearTimeout(t);
    }
  }, [step, sent, typed, idx, task.you.length]);

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
                        <span aria-hidden className="ask-shine pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]" />
                      </motion.div>
                    </div>

                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* the composer: your request is typed here, then sent up into the conversation */}
            <div className="relative z-10 mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#11151E] py-2 pl-4 pr-2 shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.8)]">
              <p className="min-h-6 min-w-0 flex-1 truncate text-[14.5px] leading-6 md:text-[15px]">
                {!sent && typed > 0 ? (
                  <span className="text-text">
                    {task.you.slice(0, typed)}
                    <span aria-hidden className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-[#A6BBFF]" />
                  </span>
                ) : (
                  <span className="text-subtle">Ask Juno anything</span>
                )}
              </p>
              <span
                aria-hidden
                className={`grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-200 ${
                  !sent && typed >= task.you.length ? "scale-95 bg-[#F4F6F8] text-[#07090D]" : !sent && typed > 0 ? "bg-[#F4F6F8] text-[#07090D]" : "bg-white/[0.08] text-subtle"
                }`}
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

