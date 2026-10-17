"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  Heart,
  LayoutTemplate,
  Mail,
  MessagesSquare,
  Search,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { siX } from "simple-icons";
import { Reveal } from "@/components/ui/Reveal";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { MascotMark } from "@/components/mascot/Mascot";
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
  return <span className={`inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-medium ${t}`}>{children}</span>;
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
const LinkedInMark = ({ s = 16 }: { s?: number }) => (
  <span className="grid shrink-0 place-items-center rounded-[4px] bg-[#0A66C2] font-bold text-white" style={{ width: s, height: s, fontSize: s * 0.62 }}>
    in
  </span>
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
  /** What Juno does, step by step, before it answers. */
  steps: [string, string, string];
  sources: { tool: ToolId; label: string }[];
  /** The closing line: a question for you, or a plain status. */
  ask: string;
  question?: boolean;
  work: ReactNode;
};

/** 1. Announce that feature: the launch kit, one piece per channel. */
const LaunchKit = () => {
  const pieces = [
    { ch: "Email", icon: <Mail size={14} className="text-[#3346e0]" aria-hidden />, title: ["Monday.", "Handled."], foot: <Pill tone="ok">Weekly report · Delivered</Pill>, tint: "from-[#E9EDFF] to-[#F6F1FF]" },
    { ch: "LinkedIn", icon: <LinkedInMark s={14} />, title: ["Right on", "time."], foot: <Pill tone="blue">Every Mon · 9:00 AM</Pill>, tint: "from-[#E4F1FB] to-[#EEF5FF]" },
    { ch: "X", icon: <XMark s={13} />, title: ["Reports.", "On repeat."], foot: <Pill>Weekly report · Scheduled</Pill>, tint: "from-[#F1F1F1] to-[#FAFAFA]" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {pieces.map((p, i) => (
        <Rise key={p.ch} d={i * 0.1}>
          <Paper className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/[0.06] px-3.5 py-2.5 text-[12.5px] font-medium">
              {p.icon}
              {p.ch}
            </div>
            <div className={`mx-3 mt-3 rounded-xl bg-gradient-to-br ${p.tint} px-3.5 pb-4 pt-3.5`}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3346e0]/70">Orbit</p>
              <p className="mt-6 text-[20px] font-semibold leading-[1.05] tracking-[-0.03em]">
                {p.title[0]}
                <br />
                {p.title[1]}
              </p>
            </div>
            <div className="px-3.5 py-3">{p.foot}</div>
          </Paper>
        </Rise>
      ))}
    </div>
  );
};

/** 2. Make sense of the feedback: what customers said, and what it means. */
const Feedback = () => (
  <div className="grid grid-cols-[1fr_1.05fr] gap-3">
    <Paper className="p-4">
      <Label>Customer feedback</Label>
      <div className="mt-3 space-y-2">
        {["Will it arrive by Friday?", "I need it before my trip.", "Do weekends count?"].map((q, i) => (
          <Rise key={q} d={i * 0.12}>
            <p className="w-fit max-w-full rounded-2xl rounded-bl-md bg-[#EFEEE9] px-3 py-2 text-[13.5px] leading-[19px]">“{q}”</p>
          </Rise>
        ))}
      </div>
    </Paper>
    <Rise d={0.4}>
      <Paper className="h-full p-4">
        <Label>What it means</Label>
        <p className="mt-2 text-[17px] font-semibold leading-[22px] tracking-[-0.02em]">Show the arrival date before they pay.</p>
        <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-black/[0.07]">
          <p className="text-[11px] font-medium text-[#7a7f8c]">Checkout</p>
          <div className="mt-2 flex items-center justify-between text-[13px]">
            <span>Order total</span>
            <span className="font-semibold">$84.00</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-[#E6F4EC] px-2.5 py-1.5 text-[12.5px] font-medium text-[#1f7a4d]">
            <span>Arrives Thursday</span>
            <span>before Friday</span>
          </div>
          <div className="mt-2.5 rounded-lg bg-[#14161f] py-1.5 text-center text-[12px] font-medium text-white">Pay now</div>
        </div>
      </Paper>
    </Rise>
  </div>
);

/** 3. Close the loop: who asked, and a personal note to each. */
const CloseLoop = () => (
  <div className="grid grid-cols-[1fr_1.1fr] gap-3">
    <Paper className="p-4">
      <div className="flex items-center justify-between">
        <Pill tone="ok">
          <Check size={11} strokeWidth={3} aria-hidden />
          Shipped
        </Pill>
        <span className="font-mono text-[10.5px] text-[#7a7f8c]">MON · 9:00 AM</span>
      </div>
      <p className="mt-2 text-[17px] font-semibold tracking-[-0.02em]">Scheduled Reports</p>
      <Label className="mt-4">Who asked</Label>
      <div className="mt-2 space-y-2.5">
        {[
          { n: "M", who: "Maya", q: "Can reports run every Monday?", bg: "#E9E3FF", fg: "#5b45d6" },
          { n: "L", who: "Leo", q: "Weekly reports by email?", bg: "#DFF1EA", fg: "#1f7a4d" },
        ].map((p, i) => (
          <Rise key={p.who} d={i * 0.12} className="flex gap-2.5">
            <Avatar n={p.n} bg={p.bg} fg={p.fg} />
            <div>
              <p className="text-[12.5px] font-semibold">{p.who}</p>
              <p className="text-[13px] leading-[18px] text-[#4b515c]">“{p.q}”</p>
            </div>
          </Rise>
        ))}
      </div>
    </Paper>
    <Rise d={0.35}>
      <Paper className="h-full p-4">
        <div className="flex items-center justify-between text-[12px] text-[#7a7f8c]">
          <span>
            To <span className="font-medium text-[#14161f]">Maya</span>
          </span>
          <Pill>Draft</Pill>
        </div>
        <p className="mt-3 text-[18px] font-semibold tracking-[-0.02em]">You asked. It’s here.</p>
        <p className="mt-2 text-[13.5px] leading-[20px] text-[#3a3f4f]">Maya, your Monday report can now arrive automatically. Want to try it?</p>
        <div className="mt-4 flex items-center gap-2 border-t border-black/[0.06] pt-3 text-[12px] text-[#7a7f8c]">
          <span className="grid size-5 place-items-center rounded-full bg-[#E9EDFF] text-[10px] font-semibold text-[#3346e0]">+1</span>
          Leo gets his own note
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
      <div className="grid grid-cols-[1.05fr_1fr]">
        <div className="p-5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-semibold tracking-[-0.01em]">Everyday Objects®</span>
            <span className="flex gap-3 text-[#5d6370]">
              <span>Collection</span>
              <span>About</span>
            </span>
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#a2541f]">The Spring Edit</p>
          <p className="mock-serif mt-2 text-[34px] leading-[0.98] tracking-[-0.02em]">
            Everyday,
            <br />
            beautiful.
          </p>
          <p className="mt-3 text-[13px] leading-[19px] text-[#5d6370]">Good things. For the place you call home.</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#14161f] px-3.5 py-1.5 text-[12px] font-medium text-white">
            Explore the collection
            <ArrowRight size={12} aria-hidden />
          </span>
        </div>
        <div className="relative min-h-[230px] bg-[#EDE6DC]">
          <Image src={photo("1638303322325-ff70d6224a22")} alt="" fill sizes="320px" className="object-cover" />
        </div>
      </div>
    </Paper>
  </Rise>
);

/** 5. Make something worth sharing: the social visual, ready for both channels. */
const Social = () => (
  <div className="grid grid-cols-[1fr_auto] items-center gap-4">
    <Rise d={0}>
      <Paper className="overflow-hidden p-2.5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#E9DCCB]">
          <Image src={photo("1613424777445-f93a2a48e285")} alt="" fill sizes="420px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <p className="absolute left-4 top-3.5 text-[12px] font-semibold text-white/95">Everyday Objects®</p>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="mock-serif text-[30px] leading-[1]">
              A brighter
              <br />
              everyday.
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/80">The Spring Edit</p>
          </div>
        </div>
      </Paper>
    </Rise>
    <div className="space-y-2">
      {[
        { m: <LinkedInMark s={18} />, n: "LinkedIn", s: "1200 × 1200" },
        { m: <XMark s={16} />, n: "X", s: "1600 × 900" },
      ].map((c, i) => (
        <Rise key={c.n} d={0.25 + i * 0.1}>
          <div className="flex w-[150px] items-center gap-2.5 rounded-xl bg-[#FBFAF7] px-3 py-2.5 text-[#14161f] ring-1 ring-black/5">
            <span className="grid size-7 place-items-center rounded-lg bg-white ring-1 ring-black/5">{c.m}</span>
            <span>
              <span className="block text-[12.5px] font-semibold">{c.n}</span>
              <span className="block text-[11px] text-[#7a7f8c]">{c.s} · in brand</span>
            </span>
          </div>
        </Rise>
      ))}
    </div>
  </div>
);

/** 6. Prepare performance reviews: the whole quarter, brought together. */
const Review = () => (
  <Paper className="p-4">
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
    <div className="relative mt-4 grid grid-cols-3">
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
          <p className="mt-1.5 pr-3 text-[13px] font-medium leading-[17px]">{w}</p>
        </Rise>
      ))}
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2.5">
      <Rise d={0.4} className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
        <Label>What stood out</Label>
        <p className="mt-1.5 text-[13.5px] font-medium leading-[18px]">“Made complex flows feel simple.”</p>
        <p className="mt-1 text-[11px] text-[#7a7f8c]">Peer feedback</p>
      </Rise>
      <Rise d={0.5} className="rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
        <Label>Talk through next</Label>
        <p className="mt-1.5 text-[13.5px] font-medium leading-[18px]">Bring engineering in earlier.</p>
        <p className="mt-1 text-[11px] text-[#7a7f8c]">Planning retro</p>
      </Rise>
    </div>
  </Paper>
);

/** 7. Keep the updates coming: every Friday at 9, on its own. */
const Updates = () => (
  <div className="grid grid-cols-[150px_1fr] gap-3">
    <Paper className="p-3.5">
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
        <Pill tone="ok">Right on time</Pill>
      </div>
      <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em]">This week.</p>
      <div className="mt-3 divide-y divide-black/[0.06]">
        {[
          { t: "Shipped", tone: "ok" as const, w: "Client portal is live." },
          { t: "Ready to go", tone: "blue" as const, w: "Spring campaign is ready." },
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
  <div className="grid grid-cols-[1fr_1.1fr] gap-3">
    <Paper className="p-4">
      <Label>Your next customers</Label>
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
    <Rise d={0.35}>
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
    steps: ["Read the release notes in Linear", "Pulled your brand kit from Figma", "Wrote the email, LinkedIn and X posts"],
    sources: [
      { tool: "linear", label: "Release notes" },
      { tool: "figma", label: "Brand kit" },
    ],
    ask: "Shall I send the email and post on LinkedIn and X?",
    question: true,
    work: <LaunchKit />,
  },
  {
    label: "Make sense of the feedback.",
    icon: Heart,
    you: "What are customers struggling with at checkout?",
    reply: "They need a date they can plan around.",
    steps: ["Read 214 checkout conversations", "Grouped them into 6 themes", "Found the one most people hit"],
    sources: [
      { tool: "intercom", label: "Customer feedback" },
      { tool: "zendesk", label: "Tickets" },
    ],
    ask: "Shall I create a ticket for the product team?",
    question: true,
    work: <Feedback />,
  },
  {
    label: "Close the loop with customers.",
    icon: MessagesSquare,
    you: "Scheduled Reports is live. Who asked for it?",
    reply: "I found the customers who asked.",
    steps: ["Matched the release to 31 requests", "Found who asked, and how", "Wrote each of them a note"],
    sources: [
      { tool: "linear", label: "Shipped" },
      { tool: "intercom", label: "Requests" },
    ],
    ask: "Shall I send each of them a personal update?",
    question: true,
    work: <CloseLoop />,
  },
  {
    label: "Build us a website.",
    icon: LayoutTemplate,
    you: "Build a beautiful site for our spring collection.",
    reply: "A fresh home for your collection.",
    steps: ["Picked 12 photos from the spring shoot", "Matched your fonts and colors", "Built and tested the site"],
    sources: [
      { tool: "drive", label: "Spring photos" },
      { tool: "figma", label: "Brand" },
    ],
    ask: "Shall I publish it? I’ll handle the hosting, too.",
    question: true,
    work: <Website />,
  },
  {
    label: "Make something worth sharing.",
    icon: Wand2,
    you: "Create a social visual for our spring collection. Keep it in our brand.",
    reply: "Ready to share. In your brand.",
    steps: ["Pulled the spring photos", "Laid it out in your brand", "Sized it for LinkedIn and X"],
    sources: [
      { tool: "figma", label: "Brand" },
      { tool: "drive", label: "Spring photos" },
    ],
    ask: "Shall I post it on LinkedIn and X?",
    question: true,
    work: <Social />,
  },
  {
    label: "Prepare performance reviews.",
    icon: ClipboardCheck,
    you: "Help me prepare for Alex’s performance review.",
    reply: "The whole quarter. Brought together.",
    steps: ["Read Alex’s Q3 projects in Linear", "Collected 9 pieces of peer feedback", "Checked last quarter’s goals"],
    sources: [
      { tool: "linear", label: "Project work" },
      { tool: "slack", label: "Peer feedback" },
      { tool: "notion", label: "Past goals" },
    ],
    ask: "Shall I save the review and prepare your 1:1 agenda?",
    question: true,
    work: <Review />,
  },
  {
    label: "Keep the updates coming.",
    icon: FileText,
    you: "Give me a weekly company update. Every Friday at 9.",
    reply: "Every Friday at 9 AM.",
    steps: ["Read this week’s projects and deals", "Wrote the update", "Scheduled it for Friday at 9"],
    sources: [
      { tool: "linear", label: "Projects" },
      { tool: "slack", label: "Team updates" },
      { tool: "hubspot", label: "Deals" },
    ],
    ask: "Next Friday, same time.",
    work: <Updates />,
  },
  {
    label: "Find our next customers.",
    icon: Search,
    you: "Find our next customers for the client portal.",
    reply: "Good fits. A personal way in.",
    steps: ["Studied your best customers in HubSpot", "Found 3 companies that look like them", "Wrote a personal intro for each"],
    sources: [
      { tool: "hubspot", label: "Best customers" },
      { tool: "analytics", label: "Who visits" },
    ],
    ask: "Shall I save these leads and send the introductions?",
    question: true,
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
  const [worked, setWorked] = useState(3); // how many work steps are done
  const [hold, setHold] = useState(false);
  const [armed, setArmed] = useState(false);
  const task = tasks[idx];

  const pick = (i: number) => {
    setIdx(i);
    setStep(reduce ? 2 : 0);
    setWorked(reduce ? 3 : 0);
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
      const t = window.setTimeout(() => setStep(1), 650);
      return () => window.clearTimeout(t);
    }
    if (step === 1) {
      const t = window.setTimeout(() => {
        if (worked < 3) setWorked((w) => w + 1);
        else setStep(2);
      }, worked < 3 ? 750 : 350);
      return () => window.clearTimeout(t);
    }
  }, [step, worked, idx]);

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
            className="relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[radial-gradient(90%_60%_at_50%_0%,rgba(122,143,255,0.1),transparent_70%),#0B0E14] p-5 md:col-span-8 md:h-[720px] md:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={idx} className="flex min-h-0 flex-1 flex-col" exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                {/* you */}
                <motion.div className="flex justify-end" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
                  <p className="max-w-[78%] rounded-[20px] rounded-br-md bg-[#F4F6F8] px-4 py-2.5 text-[14.5px] leading-[21px] text-[#07090D] md:text-[15px]">{task.you}</p>
                </motion.div>

                {/* Juno */}
                <div className="mt-5 flex items-start gap-3 md:mt-6">
                  <MascotMark size={30} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-subtle">Juno</p>
                    {step === 1 ? (
                      // the work, as it happens
                      <div className="mt-2 space-y-2">
                        {task.steps.map((w, i) =>
                          i <= worked ? (
                            <motion.p key={w} className="flex items-center gap-2.5 text-[14px] md:text-[15px]" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }}>
                              <span className={`grid size-[18px] shrink-0 place-items-center rounded-full transition-colors duration-150 ${i < worked ? "bg-[#3DD68C]/15 text-[#3DD68C]" : "text-muted"}`}>
                                {i < worked ? <Check size={11} strokeWidth={3} aria-hidden /> : <span className="work-spin size-3.5 rounded-full border-[1.5px] border-white/20 border-t-white/80" />}
                              </span>
                              <span className={i < worked ? "text-muted" : "shimmer-text"}>{w}</span>
                            </motion.p>
                          ) : null,
                        )}
                      </div>
                    ) : step === 2 ? (
                      <>
                        <motion.p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-subtle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                          <Check size={12} strokeWidth={2.5} className="text-[#3DD68C]" aria-hidden />
                          Worked through {task.steps.length} steps
                        </motion.p>
                        <motion.p className="mt-0.5 text-[19px] font-medium leading-[26px] tracking-[-0.02em] text-text md:text-[22px] md:leading-[30px]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: calm }}>
                          {task.reply}
                        </motion.p>
                      </>
                    ) : (
                      <span className="mt-2 flex h-6 items-center gap-1" aria-label="Juno is reading">
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="think-dot size-1.5 rounded-full bg-white/60" style={{ animationDelay: `${d * 0.15}s` }} />
                        ))}
                      </span>
                    )}
                  </div>
                </div>

                {step >= 1 && (
                    <motion.div className="mt-3 flex flex-wrap gap-2 pl-[42px]" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}>
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
                    <motion.div className="mt-5 min-h-0 flex-1" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: calm }}>
                      <div className="mx-auto w-full max-w-[640px] max-sm:[zoom:0.72]">{task.work}</div>
                    </motion.div>

                    {/* one question for you */}
                    <motion.div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#11151E] py-2.5 pl-4 pr-2.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.75, ease: calm }}>
                      <p className="flex items-center gap-2.5 text-[14px] text-text md:text-[15px]">
                        <MascotMark size={20} />
                        {task.ask}
                      </p>
                      {task.question ? (
                        <span className="flex gap-2" aria-hidden>
                          <span className="yes-pulse inline-flex h-9 items-center rounded-full bg-[#F4F6F8] px-4 text-[13px] font-semibold text-[#07090D]">Yes</span>
                          <span className="inline-flex h-9 items-center rounded-full px-3.5 text-[13px] text-muted ring-1 ring-white/10">Not yet</span>
                        </span>
                      ) : (
                        <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#3DD68C]/10 px-3.5 text-[13px] text-[#3DD68C]">
                          <Check size={14} strokeWidth={2.5} aria-hidden />
                          Scheduled
                        </span>
                      )}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

