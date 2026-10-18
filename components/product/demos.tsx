"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, Circle, FileText, ImageIcon, Link2, Loader2, Paperclip, Search, Share2 } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";
import { hero } from "@/lib/product";
import { Browser, Cursor, Flip, In, Paper, Pill, SrcIcon, base, calm, snap, type Demo, type DeskProps } from "./frame";

/**
 * Every demo on the Product page: the live runjuno.ai/product demos, one script each, drawn as
 * the real Juno Desk. Copy is verbatim from the live page (Leo and Emma as teammates); the few
 * words Juno adds to keep a conversation natural are marked [new].
 */

/* ------------------------------------------------------------------ shared bits */

const Mark = ({ children }: { children: ReactNode }) => <mark className="rounded-[3px] bg-[#7A8FFF]/22 px-0.5 text-text">{children}</mark>;

function Initials({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-[#E4E1FF] text-[10px] font-semibold text-[#3B3486]" style={{ width: size, height: size }}>
      {name
        .split(" ")
        .map((w) => w[0])
        .join("")}
    </span>
  );
}

const Who = ({ name }: { name: "Leo" | "Sam" | "Emma" }) =>
  name === "Emma" ? <Initials name="Emma" size={22} /> : <Face who={name === "Leo" ? "leo" : "sam"} size={22} className="!ring-0" />;

/** A dark card on the Desk. */
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[12px] border border-white/[0.08] bg-[#131820] ${className}`}>{children}</div>;
}

function CardHead({ icon, title, meta, right }: { icon: ReactNode; title: string; meta?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px]">
      {icon}
      <span className="shrink-0 whitespace-nowrap font-medium text-text/90">{title}</span>
      {meta && <span className="min-w-0 truncate text-subtle">{meta}</span>}
      {right && <span className="ml-auto">{right}</span>}
    </div>
  );
}

/** A small "working" spinner that becomes a check. */
function Tick({ done, light = false }: { done: boolean; light?: boolean }) {
  return (
    <Flip
      on={done}
      a={<Loader2 size={15} className={`animate-spin ${light ? "text-[#8a909c]" : "text-muted"}`} aria-hidden />}
      b={
        <span className={`grid size-[15px] place-items-center rounded-full ${light ? "bg-[#2f9e6a] text-white" : "bg-[#3DD68C] text-[#06120c]"}`}>
          <Check size={10} strokeWidth={3.5} aria-hidden />
        </span>
      }
    />
  );
}

/** A cover in the company's brand: navy, with the product itself on it. */
function Cover({ className = "h-[76px]" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(135deg,#1B2440_0%,#2C3B6B_60%,#5468B0_100%)] ${className}`}>
      <span aria-hidden className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:18px_18px]" />
      <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-[8px] bg-white/95 py-1.5 pl-1.5 pr-2.5 text-[#16181d] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]">
        <span className="grid size-5 place-items-center rounded-[5px] bg-[#1B2440] text-white">
          <FileText size={11} aria-hidden />
        </span>
        <span className="leading-none">
          <span className="block text-[10.5px] font-semibold">Weekly report</span>
          <span className="mt-0.5 block text-[9px] text-[#6b7080]">Mon · 9:00 AM</span>
        </span>
        <span className="ml-1 grid size-3.5 place-items-center rounded-full bg-[#2f9e6a] text-white">
          <Check size={8} strokeWidth={3.5} aria-hidden />
        </span>
      </span>
    </div>
  );
}

/** The announcement, in the brand Juno learned: a cover, a label, a clear headline. */
function Announcement({ eyebrow, title, children, className = "", cover = true }: { eyebrow: string; title: string; children?: ReactNode; className?: string; cover?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] ${className}`}>
      {cover && <Cover />}
      <div className="p-4">
        <p className="text-[11.5px] font-medium text-[#3b4fd8]">{eyebrow}</p>
        <p className="mt-1 text-[20px] font-semibold leading-[24px] tracking-[-0.025em] @lg:text-[22px] @lg:leading-[26px]">{title}</p>
        {children}
      </div>
    </div>
  );
}

/* ================================================================== hero */

/** A LinkedIn post, as it will look in the feed. */
function LinkedInPost() {
  return (
    <Paper className="h-full">
      <div className="flex items-center gap-2 p-3 pb-2">
        <span className="grid size-7 place-items-center rounded-[6px] bg-[#1B2440] text-[11px] font-bold text-white">Y</span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[11.5px] font-semibold">Your company</p>
          <p className="text-[10px] text-[#8a909c]">Just now</p>
        </div>
        <span className="ml-auto grid size-4 place-items-center rounded-[3px] bg-[#0A66C2] text-[8.5px] font-bold text-white">in</span>
      </div>
      <p className="px-3 pb-2 text-[11.5px] leading-[16px] text-[#2b2f38]">Your Monday. Already handled. Scheduled Reports is here.</p>
      <Cover className="h-[92px]" />
      <div className="flex gap-3 px-3 py-2 text-[10px] text-[#8a909c]">
        <span>Like</span>
        <span>Comment</span>
        <span>Repost</span>
      </div>
    </Paper>
  );
}

/** A Gmail draft, ready to send. */
function GmailDraft() {
  return (
    <Paper className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 bg-[#F2F6FC] px-3 py-2 text-[11px] font-medium text-[#1f1f1f]">
        <BrandIcon id="gmail" size={12} className="!shadow-none" />
        New message
      </div>
      <div className="divide-y divide-black/[0.06] px-3 text-[11px]">
        <p className="truncate py-1.5">
          <span className="text-[#8a909c]">To</span> Customers who asked
        </p>
        <p className="truncate py-1.5 font-medium">You asked. It&apos;s here.</p>
      </div>
      <p className="px-3 pt-2 text-[11.5px] leading-[16px] text-[#2b2f38]">Your Monday report can now arrive automatically. Want to try it?</p>
      <span className="m-3 mt-auto inline-flex h-7 w-fit items-center rounded-full bg-[#0B57D0] px-3.5 text-[11px] font-medium text-white">Send</span>
    </Paper>
  );
}

function HeroDesk({ s }: DeskProps) {
  const outputs = [
    <Announcement key="a" eyebrow="Introducing Scheduled Reports" title="Your Monday. Already handled." className="h-full">
      <p className="mt-1.5 text-[11.5px] leading-[16px] text-[#4a4f5c]">Set a schedule. We&apos;ll send the report. Start your week in the know.</p>
    </Announcement>,
    <LinkedInPost key="l" />,
    <GmailDraft key="g" />,
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2">
        <MascotMark size={16} />
        <p className="text-[13px] font-medium text-text">Launch plan</p>
        <span className="text-[13px] text-subtle">Scheduled Reports</span>
        <span className="ml-auto">
          <Pill tone={s >= 5 ? "ok" : "muted"}>{s >= 5 ? "All done" : `${Math.max(0, Math.min(3, s - 2))} of 3`}</Pill>
        </span>
      </div>
      <div className="mt-4 grid min-h-0 flex-1 gap-3 @lg:grid-cols-3">
        {hero.tasks.map((t, i) => (
          <div key={t} className={`flex min-h-0 flex-col gap-2.5 ${i ? "max-@lg:[&>*:last-child]:hidden" : ""}`}>
            <In s={s} at={2}>
              <p className="flex h-10 items-center gap-2.5 rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-3 text-[12.5px]">
                <Tick done={s >= 3 + i} />
                <span className={`truncate ${s >= 3 + i ? "text-text" : "text-muted"}`}>{t}</span>
              </p>
            </In>
            <In s={s} at={3 + i} className="min-h-0 flex-1">
              {outputs[i]}
            </In>
          </div>
        ))}
      </div>
    </div>
  );
}

export const heroDemo: Demo = {
  label: "Launch plan",
  steps: 6,
  gap: 900,
  chat: [
    { from: "you", text: hero.you, at: 1 },
    { from: "juno", text: hero.juno, at: 2 },
  ],
  ask: { q: hero.approval, at: 6, done: "Approved. Sending now." },
  Desk: HeroDesk,
};

/* ================================================================== 01 · company knowledge */

const sources = [
  { tool: "intercom" as const, label: "Intercom", meta: "Customer feedback", text: <>Can I <Mark>share this report</Mark> with my client?</> },
  { tool: "linear" as const, label: "Linear", meta: "Planned", text: <><Mark>Shareable report links</Mark></> },
  { tool: "call" as const, label: "Sales call", meta: "Transcript", text: <>We need <Mark>a link we can send</Mark> to clients.</> },
];

function SourcesDesk({ s }: DeskProps) {
  return (
    <div className="space-y-2.5">
      <In s={s} at={1}>
        <p className="flex items-center gap-2 text-[12.5px] text-muted">
          <Search size={13} aria-hidden />
          Searching across your tools
          <span className="ml-auto">{s >= 4 ? <Pill tone="ok">3 sources</Pill> : <Loader2 size={13} className="animate-spin" aria-hidden />}</span>
        </p>
      </In>
      {sources.map((x, i) => (
        <In key={x.label} s={s} at={2 + i}>
          <Card className="flex items-start gap-3 px-3.5 py-3">
            <SrcIcon tool={x.tool} size={22} />
            <div className="min-w-0">
              <p className="text-[12px] text-muted">
                {x.label} <span className="text-subtle">· {x.meta}</span>
              </p>
              <p className="mt-0.5 text-[13.5px] leading-5 text-text/90">&ldquo;{x.text}&rdquo;</p>
            </div>
          </Card>
        </In>
      ))}
      <In s={s} at={5}>
        <div className="rounded-[12px] border border-[#7A8FFF]/30 bg-[#7A8FFF]/[0.07] p-4">
          <p className="text-[18px] font-medium tracking-[-0.02em] text-text">Build shared reports next.</p>
          <p className="mt-1 text-[13px] leading-5 text-muted">Customers ask for it in support and sales calls. It&apos;s already on your roadmap.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Customer request", "Roadmap", "Sales call"].map((c) => (
              <Pill key={c} tone="blue">
                {c}
              </Pill>
            ))}
          </div>
        </div>
      </In>
    </div>
  );
}

function WikiDesk({ s }: DeskProps) {
  return (
    <div className="space-y-3">
      <In s={s} at={2}>
        <Card className="p-3.5">
          <CardHead icon={<BrandIcon id="slack" size={16} className="!shadow-none" />} title="#product-updates" right={s >= 3 ? <Pill tone="blue">Added to the wiki</Pill> : undefined} />
          <div className="mt-2.5 flex items-start gap-2.5">
            <Face who="leo" size={26} className="!ring-0" />
            <div>
              <p className="text-[12.5px]">
                <span className="font-medium text-text">Leo</span> <span className="text-subtle">9:41 AM</span>
              </p>
              <p className="text-[13px] text-text/85">A new update. Shared reports is live. On every plan.</p>
            </div>
          </div>
        </Card>
      </In>
      <In s={s} at={4}>
        <Paper>
          <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F7F7F8] px-4 py-2 text-[11.5px] text-[#6b7080]">
            <MascotMark size={14} />
            Company Wiki
            <span className="text-[#b0b5bf]">/</span> Product <span className="text-[#b0b5bf]">/</span> Features
            <span className="ml-auto">{s >= 6 ? <Pill tone="lightOk">Up to date</Pill> : <Pill tone="light">Updating</Pill>}</span>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[19px] font-semibold tracking-[-0.02em]">Shared reports</p>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors duration-300 ${s >= 5 ? "bg-[#E9F7EF] text-[#1f7a4d]" : "bg-[#F1F2F4] text-[#6b7080]"}`}>
                <Flip on={s >= 5} a="In development" b="Now available" />
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#4a4f5c]">Give clients a live view of their reports.</p>
            <p className="mt-3.5 text-[12px] font-semibold text-[#16181d]">Sharing with clients</p>
            <p className={`mt-1 rounded-[6px] px-2 py-1.5 text-[13px] leading-5 transition-colors duration-500 ${s >= 6 ? "bg-[#EEF2FF] text-[#16181d]" : "text-[#4a4f5c]"}`}>
              <Flip on={s >= 6} a="Export a PDF to share a report." b="Share a link. No export needed. Available on every plan." />
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#8a909c]">
              <MascotMark size={12} /> Updated by Juno · Source: Slack
            </p>
          </div>
        </Paper>
      </In>
    </div>
  );
}

function FilesDesk({ s }: DeskProps) {
  const files = [
    { name: "Customer interviews.pdf", kind: "PDF", quote: <><Mark>I just need a link</Mark> to share with my client.</> },
    { name: "Quarterly priorities.md", kind: "MD", quote: <>Make <Mark>client reporting effortless.</Mark></> },
  ];
  return (
    <div className="space-y-3">
      <div className="grid gap-3 @lg:grid-cols-2">
        {files.map((f, i) => (
          <In key={f.name} s={s} at={2 + i}>
            <Card className="p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-8 place-items-center rounded-[5px] bg-white text-[9px] font-bold text-[#C2412F]">{f.kind}</span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-text">{f.name}</p>
                  <p className="text-[11.5px] text-subtle">Uploaded · Read by Juno</p>
                </div>
              </div>
              <p className="mt-3 border-l-2 border-white/10 pl-3 text-[13px] leading-5 text-text/85">&ldquo;{f.quote}&rdquo;</p>
            </Card>
          </In>
        ))}
      </div>
      <In s={s} at={4}>
        <div className="rounded-[12px] border border-[#7A8FFF]/30 bg-[#7A8FFF]/[0.07] p-4">
          <p className="text-[18px] font-medium tracking-[-0.02em] text-text">Make reports easy to share.</p>
          <p className="mt-1 text-[13px] leading-5 text-muted">Customers want a simple link. It also supports this quarter&apos;s reporting priority.</p>
        </div>
      </In>
    </div>
  );
}

export const knowledgeDemos: Demo[] = [
  {
    label: "Connected sources",
    steps: 5,
    chat: [
      { from: "you", text: "What should we prioritize next?", at: 1 },
      { from: "juno", title: "Build shared reports next.", text: "Customers ask for it in support and sales calls. It’s already on your roadmap.", at: 5 },
    ],
    Desk: SourcesDesk,
  },
  {
    label: "Company Wiki",
    steps: 6,
    chat: [
      { from: "you", text: "Keep our company wiki organized and up to date.", at: 1 },
      { from: "juno", title: "A little knowledge. Everywhere.", text: "Launch notes · Sales talking points · Support answers", at: 2 },
    ],
    Desk: WikiDesk,
  },
  {
    label: "Uploaded files",
    steps: 4,
    chat: [
      { from: "you", text: "Based on these files, what should we build next?", at: 1 },
      { from: "juno", title: "Make reports easy to share.", text: "Customers want a simple link. It also supports this quarter’s reporting priority.", at: 4 },
    ],
    Desk: FilesDesk,
  },
];

/* ================================================================== 02 · brand, skills & memory */

function BrandKit({ compact }: { compact: boolean }) {
  return (
    <Card className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ${compact ? "p-3" : "p-4"}`}>
      <div className="flex -space-x-1.5">
        {["#1B2440", "#5468B0", "#F4F5F7"].map((c) => (
          <span key={c} className="size-7 rounded-full ring-2 ring-[#131820]" style={{ background: c }} />
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[24px] font-semibold leading-none tracking-[-0.03em] text-text">Aa</span>
        <span className="text-[12px] text-muted">Clean. Confident.</span>
      </div>
      <div className="ml-auto hidden text-right @md:block">
        <p className="text-[11px] text-subtle">Voice</p>
        <p className="text-[12.5px] text-text/85">Clear. Warm. Useful.</p>
      </div>
    </Card>
  );
}

function BrandDesk({ s }: DeskProps) {
  return (
    <div className="space-y-3">
      <In s={s} at={2}>
        <p className="mb-2 text-[12px] text-muted">Your brand</p>
        <BrandKit compact={s >= 3} />
      </In>
      <In s={s} at={3}>
        <Announcement eyebrow="Introducing Scheduled Reports" title="Your Monday. Already handled.">
          <p className="mt-1.5 text-[12.5px] opacity-80">Scheduled Reports is now available.</p>
          <div className="mt-3 flex items-center gap-2.5 rounded-[9px] bg-[#F4F5F7] px-3 py-2">
            <span className="grid size-7 place-items-center rounded-[7px] bg-[#1B2440] text-white">
              <FileText size={13} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold">Weekly report</p>
              <p className="text-[10.5px] uppercase tracking-[0.08em] text-[#6b7080]">Every Mon 9:00 AM</p>
            </div>
            <span className="rounded-full bg-[#E9F7EF] text-[#1f7a4d] px-2 py-0.5 text-[10.5px] font-medium">Delivered</span>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-[19px] opacity-80">Schedule reports for delivery at a chosen time. Set a schedule. We&apos;ll send the report. Start your week in the know.</p>
          <span className="mt-3 inline-flex h-8 items-center rounded-full bg-[#1B2440] px-3.5 text-[12px] font-medium text-white">Set up your first report</span>
        </Announcement>
      </In>
    </div>
  );
}

function SkillDesk({ s }: DeskProps) {
  return (
    <div className="space-y-3">
      <In s={s} at={2}>
        <Card className="p-3.5">
          <CardHead icon={<MascotMark size={16} />} title="Saved skill" right={<Pill tone={s >= 3 ? "blue" : "muted"}>{s >= 3 ? "In use" : "Skill"}</Pill>} />
          <p className="mt-2 text-[15px] font-medium text-text">Announce a feature.</p>
          <ol className={`grid gap-1 text-[12.5px] text-muted transition-all duration-500 ${s >= 4 ? "mt-1.5 @md:grid-cols-3" : "mt-2"}`}>
            {["Lead with the benefit.", "Show it in action.", "One clear next step."].map((x, i) => (
              <li key={x} className="flex gap-1.5">
                <span className="text-subtle">{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </Card>
      </In>
      <In s={s} at={4}>
        <Announcement eyebrow="Introducing Shared Reports" title="A clear view. One simple link.">
          <p className="mt-1.5 text-[12.5px] opacity-80">Give clients the full picture. Without another PDF.</p>
          <div className="mt-3 rounded-[10px] bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-semibold">Client report</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-2 py-0.5 text-[11px]">
                <Share2 size={10} aria-hidden /> Share
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-[7px] bg-[#F4F5F7] px-2.5 py-1.5 text-[11.5px]">
              <Link2 size={12} className="text-[#6b7080]" aria-hidden />
              <span className="text-[#6b7080]">Share with a link</span>
              <span className="truncate font-medium">reports / weekly</span>
              <span className="ml-auto shrink-0 text-[10.5px] text-[#1f7a4d]">Ready for your client</span>
            </div>
          </div>
          <span className="mt-3 inline-flex h-8 items-center rounded-full bg-[#1B2440] px-3.5 text-[12px] font-medium text-white">Try Shared Reports</span>
        </Announcement>
      </In>
    </div>
  );
}

function LearningDesk({ s }: DeskProps) {
  return (
    <div className="space-y-3">
      <In s={s} at={2}>
        <Card className="p-3.5">
          <CardHead icon={<MascotMark size={16} />} title="Learning saved" right={<span className="text-[12px] text-[#A6BBFF]">Edit learning</span>} />
          <p className="mt-2 text-[15px] font-medium text-text">Weekly updates</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill tone="blue">Decisions first.</Pill>
            <Pill tone="blue">Three bullets.</Pill>
          </div>
        </Card>
      </In>
      <In s={s} at={4}>
        <Paper className="p-4">
          <p className="flex items-center gap-1.5 text-[11px] text-[#8a909c]">
            <MascotMark size={12} /> Company update · Using your learning
          </p>
          <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.02em]">This week. What matters.</p>
          <ul className="mt-3 space-y-2">
            {[
              ["Decision", "Launch Shared Reports on Monday."],
              ["Progress", "The help center is ready."],
              ["Needs you", "Approve the customer email."],
            ].map(([k, v], i) => (
              <In key={k} s={s} at={4}>
                <li className="flex gap-2.5 text-[13px] leading-5">
                  <span className={`mt-[7px] size-1.5 shrink-0 rounded-full ${i === 2 ? "bg-[#5b74ff]" : "bg-[#16181d]"}`} />
                  <span>
                    <span className="font-semibold">{k}:</span> <span className="text-[#4a4f5c]">{v}</span>
                  </span>
                </li>
              </In>
            ))}
          </ul>
        </Paper>
      </In>
    </div>
  );
}

export const brandDemos: Demo[] = [
  {
    label: "Announcement",
    steps: 4,
    gap: 950,
    chat: [
      { from: "you", text: "Announce Scheduled Reports. Make it look and sound like us.", at: 1 },
      { from: "juno", text: "Here it is, in your brand.", at: 4 }, // [new]
    ],
    Desk: BrandDesk,
  },
  {
    label: "Announcement",
    steps: 4,
    gap: 950,
    chat: [
      { from: "you", text: "Use our launch skill to announce Shared Reports.", at: 1 },
      { from: "juno", text: "Using your skill: Announce a feature.", at: 3 }, // [new]
    ],
    Desk: SkillDesk,
  },
  {
    label: "Company update",
    steps: 4,
    gap: 1000,
    chat: [
      { from: "you", text: "Too much detail. For weekly updates, give me three bullets. Decisions first.", at: 1 },
      { from: "juno", text: "Got it. I’ll remember that.", at: 2 }, // [new]
      { from: "you", text: "Write this week’s company update.", at: 3 },
    ],
    Desk: LearningDesk,
  },
];

/* ================================================================== 03 · computer & browser */

const rawRows = [
  ["01/06/26", "team", "Cedar & Co.", "January.csv"],
  ["1/14/26", "Team plan", "Halcyon", "January.csv"],
  ["2026-02-03", "Team plan", "Northwind", "February.xlsx"],
  ["2026-02-17", "TEAM", "Lumen Labs", "February.xlsx"],
  ["Mar 2 2026", "TEAM", "Brightline", "March.csv"],
  ["Mar 19 2026", "team", "Oakridge", "March.csv"],
];
const cleanDates = ["Jan 06, 2026", "Jan 14, 2026", "Feb 03, 2026", "Feb 17, 2026", "Mar 02, 2026", "Mar 19, 2026"];

function SheetDesk({ s }: DeskProps) {
  const done = s >= 6;
  return (
    <div className="relative h-full">
      <Cursor x={s >= 5 ? 40 : s >= 3 ? 14 : 70} y={s >= 5 ? 32 : s >= 3 ? 30 : 80} show={s >= 2 && !done} />
      <Paper>
        <div className="flex items-center gap-1 border-b border-black/[0.07] bg-[#F3F4F6] px-2 pt-1.5">
          {(done ? ["Sales report.xlsx"] : ["January.csv", "February.xlsx", "March.csv"]).map((t, i) => (
            <span key={t} className={`truncate rounded-t-[6px] px-2.5 py-1.5 text-[11.5px] ${i === 0 ? "bg-white font-medium" : "text-[#6b7080]"}`}>
              {t}
            </span>
          ))}
          {done && <Pill tone="lightOk" className="mb-1 ml-auto">All sales · Ready to use</Pill>}
        </div>
        {done && <p className="px-3.5 pt-3 text-[14px] font-semibold">Sales report.xlsx · January to March</p>}
        <div className="p-2.5 text-[12px]">
          <div className="grid grid-cols-[1.1fr_0.9fr_1fr] gap-2 border-b border-black/[0.06] px-2 py-1.5 text-[11px] font-medium text-[#8a909c] @lg:grid-cols-[1.1fr_0.9fr_1fr_1fr]">
            <span>Date</span>
            <span>Plan</span>
            <span>Customer</span>
            <span className="hidden @lg:block">Source</span>
          </div>
          {rawRows.map((r, i) => (
            <div key={i} className="grid grid-cols-[1.1fr_0.9fr_1fr] gap-2 border-b border-black/[0.04] px-2 py-2 last:border-0 @lg:grid-cols-[1.1fr_0.9fr_1fr_1fr]">
              <span className={`transition-colors duration-500 ${s >= 4 ? "" : "text-[#C2412F]"}`}>
                <Flip on={s >= 4} a={r[0]} b={cleanDates[i]} />
              </span>
              <span className={`transition-colors duration-500 ${s >= 5 ? "" : "text-[#C2412F]"}`}>
                <Flip on={s >= 5} a={r[1]} b="Team" />
              </span>
              <span>{r[2]}</span>
              <span className="hidden text-[#8a909c] @lg:block">{r[3]}</span>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}

const tools = [
  { name: "Dropbox Sign", head: "Reusable signing templates.", line: "Reuse your own documents." },
  { name: "Docusign", head: "Roles. Fields. Signing order.", line: "Set recipient roles and routing." },
  { name: "PandaDoc", head: "Proposals, ready to sign.", line: "Reusable content + pricing tables." },
];

function ResearchDesk({ s }: DeskProps) {
  const tab = Math.min(2, Math.max(0, s - 2));
  const found = s >= 5;
  return (
    <div className="relative h-full">
      <Cursor x={found ? 80 : 18 + tab * 26} y={found ? 88 : 4} show={s >= 2 && s < 6} />
      <Browser url={found ? "Juno’s notes · E-signature tools" : `${tools[tab].name.toLowerCase().replace(" ", "")}.com / features`} lock={!found}>
        <div className="flex gap-1 border-b border-black/[0.06] bg-[#FAFAFB] px-2 pt-1.5">
          {tools.map((t, i) => (
            <span
              key={t.name}
              className={`flex min-w-0 items-center gap-1.5 truncate rounded-t-[6px] px-2.5 py-1.5 text-[11.5px] transition-opacity ${
                !found && i === tab ? "bg-white font-medium" : "text-[#6b7080]"
              } ${s >= 2 + i ? "opacity-100" : "opacity-0"}`}
            >
              {t.name}
            </span>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {!found ? (
            <motion.div key={tab} className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <p className="text-[11px] text-[#8a909c]">{tools[tab].name} · Features</p>
              <p className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">{tools[tab].head}</p>
              <div className="mt-3 space-y-2">
                {[92, 78, 85, 60].map((w, i) => (
                  <span key={i} className="block h-2 rounded-full bg-black/[0.07]" style={{ width: `${w}%` }} />
                ))}
              </div>
              <p className="mt-3 inline-block rounded-[4px] bg-[#DCE3FF] px-1 text-[12.5px]">{tools[tab].line}</p>
            </motion.div>
          ) : (
            <motion.div key="found" className="p-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: base }}>
              <p className="text-[18px] font-semibold tracking-[-0.02em]">Here&apos;s the difference.</p>
              <div className="mt-3 grid gap-2 @xl:grid-cols-3">
                {tools.map((t) => (
                  <div key={t.name} className={`rounded-[9px] p-3 ring-1 ${t.name === "PandaDoc" && s >= 6 ? "bg-[#EEF2FF] ring-[#5b74ff]/40" : "bg-[#F7F7F8] ring-black/[0.05]"}`}>
                    <p className="text-[11px] text-[#6b7080]">{t.name}</p>
                    <p className="mt-0.5 text-[13px] font-semibold leading-[18px]">{t.head}</p>
                    <p className="mt-1 text-[11.5px] text-[#4a4f5c]">{t.line}</p>
                    <p className="mt-1.5 text-[11px] text-[#5b74ff] underline underline-offset-2">Source</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Browser>
    </div>
  );
}

function WebsiteDesk({ s }: DeskProps) {
  const inBrowser = s >= 3;
  const cover = s >= 5;
  const saved = s >= 7;
  return (
    <div className="relative h-full">
      <Cursor x={s >= 6 ? 78 : s >= 4 ? 30 : 50} y={s >= 6 ? 13 : s >= 4 ? 40 : 60} show={s >= 4 && !saved} />
      <AnimatePresence mode="wait" initial={false}>
        {!inBrowser ? (
          <motion.div key="files" className="grid gap-3 @lg:grid-cols-2" exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}>
            <In s={s} at={1}>
              <Card className="p-3.5">
                <CardHead icon={<span className="grid h-6 w-5 place-items-center rounded-[3px] bg-[#2B579A] text-[7px] font-bold text-white">W</span>} title="Article.docx" />
                <p className="mt-3 text-[16px] font-medium text-text">Meet Scheduled Reports.</p>
                <p className="mt-1 text-[12.5px] text-muted">Your reports. Delivered before anyone has to ask.</p>
              </Card>
            </In>
            <In s={s} at={2}>
              <Card className="p-3.5">
                <CardHead icon={<ImageIcon size={15} className="text-muted" aria-hidden />} title="Cover.jpg" />
                <div className="mt-3 h-[84px] rounded-[8px] bg-[radial-gradient(80%_120%_at_30%_20%,#E9D8BF,#B79670_60%,#6E5844)]" />
              </Card>
            </In>
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: base }}>
            <Browser url="yourcompany.com / editor">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5">
                <p className="text-[12.5px] font-medium">New article</p>
                <span className="flex items-center gap-2">
                  {saved && <Pill tone="lightOk">Draft saved</Pill>}
                  <span className={`inline-flex h-7 items-center rounded-[7px] px-3 text-[11.5px] font-medium transition-colors ${s >= 6 ? "bg-[#16181d] text-white" : "bg-[#F1F2F4] text-[#16181d]"}`}>Save draft</span>
                </span>
              </div>
              <div className="p-4">
                <div className={`grid h-[92px] place-items-center overflow-hidden rounded-[8px] transition-all duration-500 ${cover ? "bg-[radial-gradient(80%_120%_at_30%_20%,#E9D8BF,#B79670_60%,#6E5844)]" : "border border-dashed border-black/15 bg-[#FAFAFB]"}`}>
                  {!cover && (
                    <span className="flex items-center gap-1.5 text-[12px] text-[#6b7080]">
                      <ImageIcon size={13} aria-hidden /> Add cover image
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em]">Meet Scheduled Reports.</p>
                <p className="mt-1 text-[13px] text-[#4a4f5c]">Your reports. Delivered before anyone has to ask.</p>
              </div>
            </Browser>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const computerDemos: Demo[] = [
  {
    label: "Juno’s computer",
    steps: 6,
    gap: 950,
    chat: [
      { from: "you", text: "Turn these sales exports into one clean workbook.", at: 1 },
      { from: "juno", text: "Sales report.xlsx · January to March. All sales, ready to use.", at: 6 },
    ],
    Desk: SheetDesk,
  },
  {
    label: "Juno’s browser",
    steps: 6,
    gap: 950,
    chat: [
      { from: "you", text: "Compare e-signature tools for our sales proposals.", at: 1 },
      { from: "juno", title: "Here’s the difference.", text: "Juno’s take: For sales proposals, I’d try PandaDoc first.", at: 6 },
    ],
    Desk: ResearchDesk,
  },
  {
    label: "Juno’s browser",
    steps: 7,
    gap: 850,
    chat: [
      { from: "you", text: "Add this article and cover to our CMS. Save it as a draft.", at: 1 },
      { from: "juno", text: "Draft saved.", at: 7 },
    ],
    Desk: WebsiteDesk,
  },
];

/* ================================================================== 04 · app builder */

const checklist = [
  { who: "Leo" as const, task: "Product ready", status: "QA complete" },
  { who: "Sam" as const, task: "Launch email", status: "Needs final approval" },
  { who: "Emma" as const, task: "Help article", status: "Published" },
];

function LaunchRoom({ s, from = 0, live = false, compact = false }: { s: number; from?: number; live?: boolean; compact?: boolean }) {
  return (
    <Browser url="launch.yourcompany.com" lock={live}>
      <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-2.5">
        <span className="grid size-5 place-items-center rounded-[5px] bg-[#16181d] text-[9px] font-bold text-white">L</span>
        <p className="whitespace-nowrap text-[12.5px] font-semibold">Launch room</p>
        <span className="truncate text-[12px] text-[#8a909c] max-sm:hidden">Scheduled Reports</span>
        <span className="ml-auto">{live ? <Pill tone="lightOk">Live</Pill> : <Pill tone="light">Private preview</Pill>}</span>
      </div>
      <div className={compact ? "p-3.5" : "p-4"}>
        <In s={s} at={from + 1}>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[12px] text-[#8a909c]">Scheduled Reports launch</p>
              <p className={`font-semibold tracking-[-0.02em] ${compact ? "text-[17px]" : "text-[21px]"}`}>Launch day. No loose ends.</p>
            </div>
            <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[11px] font-medium text-[#3b4fd8]">1 approval to go</span>
          </div>
        </In>
        <div className={`mt-3 grid gap-3 ${compact ? "" : "@xl:grid-cols-[1.4fr_1fr]"}`}>
          <In s={s} at={from + 2}>
            <div className="rounded-[9px] ring-1 ring-black/[0.06]">
              <p className="border-b border-black/[0.05] px-3 py-2 text-[11.5px] font-semibold">Launch checklist</p>
              {checklist.map((c) => (
                <div key={c.who} className="flex items-center gap-2.5 border-b border-black/[0.04] px-3 py-2 text-[12px] last:border-0">
                  <Who name={c.who} />
                  <span className="w-10 font-medium">{c.who}</span>
                  <span className="min-w-0 flex-1 truncate text-[#4a4f5c]">{c.task}</span>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10.5px] ${c.status === "Needs final approval" ? "bg-[#EEF2FF] text-[#3b4fd8]" : "bg-[#E9F7EF] text-[#1f7a4d]"}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </In>
          {!compact && (
            <In s={s} at={from + 3}>
              <div className="h-full rounded-[9px] bg-[#F7F7F8] p-3">
                <p className="text-[13px] font-semibold">Promises to keep.</p>
                <p className="mt-0.5 text-[11.5px] text-[#6b7080]">Customer commitments, in one place.</p>
                <div className="mt-2.5 rounded-[7px] bg-white p-2.5 text-[11.5px] ring-1 ring-black/[0.05]">
                  <p className="text-[10.5px] text-[#8a909c]">Customer commitment</p>
                  <p className="mt-0.5 font-medium">Send the pilot team a walkthrough.</p>
                </div>
              </div>
            </In>
          )}
        </div>
      </div>
    </Browser>
  );
}

function BuildDesk({ s }: DeskProps) {
  return (
    <In s={s} at={2}>
      <LaunchRoom s={s} from={2} />
    </In>
  );
}

function DataDesk({ s }: DeskProps) {
  const approved = s >= 4;
  const published = s >= 5;
  return (
    <div className="relative space-y-3">
      <Cursor x={s >= 5 ? 82 : 70} y={s >= 5 ? 6 : 34} show={s >= 3 && s < 6} />
      <In s={s} at={1}>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5 text-[12.5px]">
            <SrcIcon tool="cms" size={18} />
            <span className="text-muted">Content</span>
            <span className="text-subtle">/</span>
            <span className="font-medium text-text">Launch checklist</span>
            <span className="ml-auto">
              <Flip on={published} a={<span className="inline-flex h-7 items-center rounded-[7px] bg-white/[0.08] px-2.5 text-[11.5px] text-text">Publish update</span>} b={<Pill tone="ok">Published</Pill>} />
            </span>
          </div>
          {checklist.map((c) => (
            <div key={c.who} className="flex items-center gap-2.5 border-b border-white/[0.05] px-3.5 py-2.5 text-[12.5px] last:border-0">
              <Who name={c.who} />
              <span className="w-10 text-text">{c.who}</span>
              <span className="min-w-0 flex-1 truncate text-muted">{c.task}</span>
              {c.who === "Sam" ? <Flip on={approved} a={<Pill tone="blue">In review</Pill>} b={<Pill tone="ok">Approved</Pill>} /> : <Pill tone="ok">{c.status}</Pill>}
            </div>
          ))}
        </Card>
      </In>
      <In s={s} at={6}>
        <Card className="flex items-center gap-3 p-3.5">
          <span className="grid size-8 place-items-center rounded-[8px] bg-white text-[11px] font-bold text-[#16181d]">L</span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text">Launch room · Checklist connected</p>
            <p className="text-[12px] text-muted">Every owner. One view.</p>
          </div>
          <Pill tone="ok" className="ml-auto">Synced</Pill>
        </Card>
      </In>
    </div>
  );
}

function PublishDesk({ s }: DeskProps) {
  const rows = [
    { k: "Publish app", v: "Published", a: "Publish app", at: 4 },
    { k: "Custom domain", v: "Verified", a: "Verify", at: 5, sub: "launch.yourcompany.com" },
    { k: "Connect domain", v: "Connected", a: "Connect domain", at: 6 },
  ];
  return (
    <div className="grid gap-3 @xl:grid-cols-[1fr_1.15fr]">
      <In s={s} at={3}>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5 text-[12.5px]">
            <span className="grid size-5 place-items-center rounded-[5px] bg-white text-[9px] font-bold text-[#16181d]">L</span>
            <span className="text-muted">Your app</span>
            <span className="text-subtle">/</span>
            <span className="font-medium text-text">Launch room</span>
          </div>
          {rows.map((r) => (
            <div key={r.k} className="flex items-center gap-3 border-b border-white/[0.05] px-3.5 py-3 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-text">{r.k}</p>
                {r.sub && <p className="truncate text-[11.5px] text-muted">{r.sub}</p>}
              </div>
              <Flip on={s >= r.at} a={<span className="inline-flex h-7 items-center rounded-[7px] bg-white/[0.08] px-2.5 text-[11.5px] text-text">{r.a}</span>} b={<Pill tone="ok">{r.v}</Pill>} />
            </div>
          ))}
        </Card>
      </In>
      <In s={s} at={3} className="hidden @xl:block">
        <LaunchRoom s={99} live={s >= 7} compact />
      </In>
    </div>
  );
}

export const appsDemos: Demo[] = [
  {
    label: "Launch room · Preview",
    steps: 5,
    gap: 1000,
    chat: [
      { from: "you", text: "Build a launch dashboard with owners, blockers, and customer commitments.", at: 1 },
      { from: "juno", title: "Your launch. In one place.", text: "Owners, blockers, and commitments, live in a preview.", at: 2 }, // text [new]
    ],
    Desk: BuildDesk,
  },
  {
    label: "Content",
    steps: 6,
    gap: 950,
    chat: [
      { from: "you", text: "Connect our launch checklist so the dashboard stays up to date.", at: 1 },
      { from: "juno", title: "Every owner. One view.", text: "Checklist connected.", at: 6 },
    ],
    Desk: DataDesk,
  },
  {
    label: "Publish",
    steps: 7,
    gap: 850,
    chat: [
      { from: "you", text: "Publish the launch dashboard at launch.yourcompany.com.", at: 1 },
      { from: "juno", text: "Let’s go live.", at: 2 },
      { from: "juno", text: "Live at launch.yourcompany.com.", at: 7 }, // [new]
    ],
    Desk: PublishDesk,
  },
];

/* ================================================================== 05 · content & CMS */

const posts = [
  { t: "Meet Scheduled Reports.", c: "Product updates" },
  { t: "Share reports with your clients.", c: "Guides" },
  { t: "Turn feedback into priorities.", c: "Insights" },
];

function CollectionsDesk({ s }: DeskProps) {
  const published = s >= 4;
  return (
    <div className="space-y-3">
      <In s={s} at={2}>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5 text-[12.5px]">
            <SrcIcon tool="cms" size={18} />
            <span className="text-muted">Juno CMS</span>
            <span className="text-subtle">/</span>
            <span className="font-medium text-text">Blog posts</span>
            <span className="ml-auto">
              <Flip on={published} a={<span className={`inline-flex h-7 items-center rounded-[7px] px-2.5 text-[11.5px] transition-colors ${s >= 3 ? "bg-white text-[#16181d]" : "bg-white/[0.08] text-text"}`}>Publish posts</span>} b={<Pill tone="ok">Published</Pill>} />
            </span>
          </div>
          {posts.map((p) => (
            <div key={p.t} className="flex items-center gap-3 border-b border-white/[0.05] px-3.5 py-2.5 text-[12.5px] last:border-0">
              <span className="min-w-0 flex-1 truncate text-text">{p.t}</span>
              <span className="hidden text-muted @md:block">{p.c}</span>
              <Flip on={published} a={<Pill>Draft</Pill>} b={<Pill tone="ok">Live</Pill>} />
            </div>
          ))}
        </Card>
      </In>
      <In s={s} at={5}>
        <Browser url="yourcompany.com / journal">
          <div className="bg-white p-4 text-[#16181d]">
            <p className="text-[12px] font-semibold tracking-[-0.01em]">the journal. <span className="font-normal opacity-60">Updates. Guides. Ideas.</span></p>
            <p className="mt-3 text-[11px] font-medium text-[#3b4fd8]">The product journal</p>
            <p className="mt-1 text-[22px] font-semibold leading-[26px] tracking-[-0.025em]">What&apos;s new. What&apos;s next.</p>
          </div>
        </Browser>
      </In>
    </div>
  );
}

function DraftsDesk({ s }: DeskProps) {
  const live = s >= 4;
  return (
    <In s={s} at={2}>
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5 text-[12.5px]">
          <SrcIcon tool="cms" size={18} />
          <span className="text-muted">Juno CMS</span>
          <span className="text-subtle">/</span>
          <span className="font-medium text-text">Scheduled Reports</span>
          <span className="ml-auto">
            <Flip on={live} a={<Pill tone="blue">Draft</Pill>} b={<Pill tone="ok">Live</Pill>} />
          </span>
        </div>
        <div className="p-3.5">
          <Announcement eyebrow="Product update" title="Your Monday. Already handled.">
            <p className="mt-1.5 text-[12.5px] leading-[19px] text-[#4a4f5c]">Set a schedule. Your team gets the report, right on time.</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              {["Choose the report.", "Pick the day."].map((x, i) => (
                <span key={x} className="flex items-center gap-1.5 rounded-[7px] bg-[#F4F5F7] px-2.5 py-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-[#1B2440] text-[9px] text-white">{i + 1}</span>
                  {x}
                </span>
              ))}
            </div>
          </Announcement>
          <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted">
            {live ? <Check size={12} className="text-[#5BE3A2]" aria-hidden /> : <Circle size={11} aria-hidden />}
            {live ? "Published to yourcompany.com / journal" : "Waiting for your review"}
          </p>
        </div>
      </Card>
    </In>
  );
}

function FormDesk({ s }: DeskProps) {
  const name = "Alex Morgan";
  const email = "alex@northwind.co";
  const typedName = s >= 2 ? name : "";
  const typedEmail = s >= 2 ? email : "";
  const sent = s >= 3;
  return (
    <div className="space-y-3">
      <In s={s} at={1}>
        <Browser url="yourcompany.com / workshop">
          <div className="grid gap-3 bg-white p-4 text-[#16181d] @xl:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-[11px] font-medium text-[#3b4fd8]">Customer research workshop</p>
              <p className="mt-1 text-[20px] font-semibold leading-[24px] tracking-[-0.025em]">Better questions. Better products.</p>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {!sent ? (
                <motion.div key="form" className="space-y-1.5 text-[11.5px]" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                  {[
                    ["Name", typedName],
                    ["Work email", typedEmail],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-[6px] bg-white px-2.5 py-1.5 ring-1 ring-black/[0.08]">
                      <span className="block text-[9.5px] text-[#8a909c]">{k}</span>
                      <span className="block h-4">{v}</span>
                    </div>
                  ))}
                  <span className="flex h-8 items-center justify-center rounded-[7px] bg-[#1B2440] text-[11.5px] font-medium text-white">Save my spot</span>
                </motion.div>
              ) : (
                <motion.div key="ok" className="grid place-items-center rounded-[8px] bg-white p-4 text-center ring-1 ring-black/[0.06]" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.12, ease: snap }}>
                  <span className="grid size-7 place-items-center rounded-full bg-[#2f9e6a] text-white">
                    <Check size={14} strokeWidth={3} aria-hidden />
                  </span>
                  <p className="mt-1.5 text-[13px] font-semibold">You&apos;re on the list</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Browser>
      </In>
      <In s={s} at={4}>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5 text-[12.5px]">
            <SrcIcon tool="cms" size={18} />
            <span className="text-muted">Juno CMS</span>
            <span className="text-subtle">/</span>
            <span className="font-medium text-text">Submissions</span>
          </div>
          <div className="px-3.5 py-3">
            <p className="text-[13px] font-medium text-text">Workshop signups</p>
            <div className="mt-2 flex items-center gap-2.5 rounded-[8px] bg-white/[0.04] px-3 py-2 text-[12.5px]">
              <Initials name="Alex Morgan" />
              <span className="text-text">Alex Morgan</span>
              <span className="hidden truncate text-muted @md:block">Turning interviews into product decisions.</span>
              <Pill tone="blue" className="ml-auto">New lead</Pill>
            </div>
          </div>
        </Card>
      </In>
    </div>
  );
}

export const contentDemos: Demo[] = [
  {
    label: "Juno CMS",
    steps: 5,
    gap: 950,
    chat: [
      { from: "you", text: "Organize these posts into our blog and publish them.", at: 1 },
      { from: "juno", text: "Your posts. All in one place.", at: 2 },
    ],
    Desk: CollectionsDesk,
  },
  {
    label: "Juno CMS",
    steps: 4,
    gap: 1100,
    chat: [
      { from: "you", text: "Draft the Scheduled Reports announcement. I’ll review it before it goes live.", at: 1 },
      { from: "juno", text: "Ready for your review.", at: 2 },
      { from: "you", text: "Looks good. Publish it.", at: 3 },
      { from: "juno", text: "Published to your website.", at: 4 },
    ],
    Desk: DraftsDesk,
  },
  {
    label: "Submissions",
    steps: 5,
    gap: 1000,
    chat: [{ from: "juno", title: "Alex is in.", text: "Want me to send the workshop details?", at: 5 }],
    Desk: FormDesk,
  },
];

/* ================================================================== 06 · connected tools & permissions */

function ActionsDesk({ s, approved }: DeskProps) {
  const created = approved && s >= 4;
  return (
    <div className="space-y-3">
      <In s={s} at={2}>
        <Card className="p-3.5">
          <CardHead icon={<SrcIcon tool="call" size={18} />} title="Customer call" meta="· Transcript · Finance workflow" />
          <p className="mt-2 border-l-2 border-[#7A8FFF]/50 pl-3 text-[13px] leading-5 text-text/85">
            &ldquo;We need <Mark>a CSV of our invoices for a date range</Mark>, so finance can reconcile the month.&rdquo;
          </p>
        </Card>
      </In>
      <In s={s} at={3}>
        <Paper>
          <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F7F7F8] px-3.5 py-2 text-[11.5px] text-[#6b7080]">
            <BrandIcon id="linear" size={14} className="!shadow-none" />
            Product
            <span className="text-[#b0b5bf]">›</span>
            <span className="inline-flex items-center gap-1">
              <Circle size={10} className="text-[#8a909c]" aria-hidden /> Todo
            </span>
            <span className="ml-auto">
              <Flip
                on={created}
                a={<span className="inline-flex h-6 items-center rounded-[6px] bg-[#5E6AD2] px-2.5 text-[11px] font-medium text-white">Create issue</span>}
                b={<Pill tone="lightOk">Created</Pill>}
              />
            </span>
          </div>
          <div className="p-3.5">
            <p className="text-[16px] font-semibold tracking-[-0.01em]">Export invoices by date range</p>
            <p className="mt-1 text-[12.5px] text-[#4a4f5c]">Let finance export invoices for monthly reconciliation.</p>
            <p className="mt-3 text-[11.5px] font-semibold">What to build</p>
            {["Choose a date range", "Download invoices as a CSV"].map((x) => (
              <p key={x} className="mt-1 flex items-center gap-2 text-[12.5px] text-[#4a4f5c]">
                <span className="size-3 rounded-[3px] ring-1 ring-black/20" />
                {x}
              </p>
            ))}
            <div className="mt-3 flex items-center gap-2 rounded-[7px] bg-[#F4F5F7] px-2.5 py-1.5 text-[11.5px]">
              <Paperclip size={12} className="text-[#6b7080]" aria-hidden />
              <span className="shrink-0 whitespace-nowrap font-medium">Customer call</span>
              <span className="min-w-0 truncate text-[#6b7080]">Invoice export request</span>
              <span className="ml-auto shrink-0 text-[10.5px] text-[#1f7a4d]">Context included</span>
            </div>
          </div>
        </Paper>
      </In>
    </div>
  );
}

function BillingDesk({ s }: DeskProps) {
  const inPortal = s >= 3;
  return (
    <div className="relative h-full space-y-3">
      <Cursor x={s >= 4 ? 70 : 40} y={s >= 4 ? 70 : 40} show={s >= 3 && s < 5} />
      <In s={s} at={2}>
        <Card className={`flex items-center gap-3 transition-all duration-500 ${inPortal ? "px-3 py-2" : "p-3.5"}`}>
          <SrcIcon tool="browser" size={inPortal ? 18 : 24} />
          <div className="min-w-0">
            <p className="text-[12px] text-muted">Connected account</p>
            {!inPortal && <p className="text-[14px] text-text">Billing portal · Company account</p>}
          </div>
          <Pill tone="ok" className="ml-auto">Connected</Pill>
        </Card>
      </In>
      <In s={s} at={3}>
        <Browser url="Billing portal · Your company">
          <div className="flex">
            <aside className="hidden w-[118px] shrink-0 border-r border-black/[0.06] p-2.5 text-[11.5px] @lg:block">
              <p className="px-2 pb-2 font-semibold">Billing</p>
              {["Overview", "Invoices", "Payment methods"].map((x) => (
                <p key={x} className={`rounded-[5px] px-2 py-1.5 ${x === "Invoices" ? "bg-[#F1F2F4] font-medium" : "text-[#6b7080]"}`}>
                  {x}
                </p>
              ))}
            </aside>
            <div className="min-w-0 flex-1 p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8a909c]">Billing history</p>
              <p className="mt-0.5 text-[17px] font-semibold">Your invoices.</p>
              {["September invoice 2026", "August invoice 2026"].map((x) => (
                <div key={x} className="mt-1.5 flex items-center justify-between border-b border-black/[0.05] py-1.5 text-[12px] last:border-0">
                  <span>{x}</span>
                  <span className="rounded-full bg-[#E9F7EF] px-1.5 py-0.5 text-[10.5px] text-[#1f7a4d]">Paid</span>
                </div>
              ))}
              <div className={`mt-2.5 rounded-[8px] p-2.5 ring-1 transition-colors duration-500 ${s >= 4 ? "bg-[#EEF2FF] ring-[#5b74ff]/40" : "ring-black/[0.06]"}`}>
                <p className="text-[11.5px] font-semibold">Export invoices</p>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    ["Date range", "All time, Last month"],
                    ["Format", "CSV, PDF"],
                  ].map(([k, v]) => (
                    <span key={k} className="flex items-center justify-between rounded-[5px] bg-white px-2 py-1 ring-1 ring-black/[0.08]">
                      <span className="truncate">
                        <span className="text-[#8a909c]">{k}</span> {v}
                      </span>
                      <ChevronDown size={11} className="shrink-0 text-[#8a909c]" aria-hidden />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Browser>
      </In>
    </div>
  );
}

/** Ask or Auto: the visitor flips it and approves for real. */
function AskAutoDesk({ s, approved, approve }: DeskProps) {
  const [mode, setMode] = useState<"ask" | "auto">("ask");
  const [autoStep, setAutoStep] = useState(0);
  useEffect(() => {
    if (mode !== "auto" || s < 2) return;
    const a = window.setTimeout(() => setAutoStep(1), 300);
    const b = window.setTimeout(() => setAutoStep(2), 1400);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [mode, s]);
  const posted = mode === "ask" ? approved : autoStep >= 2;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] font-medium text-text">{mode === "ask" ? "A quick yes from you." : "Already in Juno’s hands."}</p>
        <div role="radiogroup" aria-label="Permission" className="flex rounded-full border border-white/[0.1] bg-white/[0.03] p-0.5">
          {(["ask", "auto"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => {
                setMode(m);
                setAutoStep(0);
              }}
              className={`h-8 rounded-full px-3.5 text-[12.5px] transition-colors ${mode === m ? "bg-white text-[#16181d]" : "text-muted hover:text-text"}`}
            >
              {m === "ask" ? "Ask" : "Auto"}
            </button>
          ))}
        </div>
      </div>
      <In s={s} at={2}>
        <Card className="p-3.5">
          <CardHead icon={<BrandIcon id="slack" size={16} className="!shadow-none" />} title="#team" right={<Flip on={posted} a={<Pill tone="blue">{mode === "ask" ? "Needs your yes" : "Posting"}</Pill>} b={<Pill tone="ok">Posted</Pill>} />} />
          <div className="mt-2.5 flex items-start gap-2.5">
            <MascotMark size={26} />
            <div>
              <p className="text-[12.5px]">
                <span className="font-medium text-text">Juno</span> <span className="text-subtle">{posted ? "just now" : "draft"}</span>
              </p>
              <p className="text-[14px] font-medium text-text">Scheduled Reports are live.</p>
              <p className="text-[13px] text-text/80">Pick a report. Set a schedule. We&apos;ll handle the delivery.</p>
            </div>
          </div>
        </Card>
      </In>
      <In s={s} at={2}>
        <AnimatePresence mode="wait" initial={false}>
          {mode === "ask" ? (
            <motion.div key="ask" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: calm }} className="flex items-center justify-between gap-3 rounded-[12px] border border-white/[0.1] bg-[#151A22] p-3">
              {!approved ? (
                <>
                  <span className="flex items-center gap-2 text-[13.5px] text-text">
                    <MascotMark size={18} /> Post this to #team?
                  </span>
                  <button type="button" onClick={approve} className="h-8 shrink-0 rounded-full bg-text px-3.5 text-[12.5px] font-semibold text-bg transition-shadow hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)]">
                    Approve
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-2 text-[13.5px] text-text">
                  <span className="grid size-5 place-items-center rounded-full bg-[#3DD68C] text-[#06120c]">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                  Approved by you · Posted
                </span>
              )}
            </motion.div>
          ) : (
            <motion.div key="auto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: calm }} className="space-y-2 rounded-[12px] border border-white/[0.1] bg-[#151A22] p-3 text-[13.5px] text-text">
              <p className="flex items-center gap-2">
                <MascotMark size={18} /> {autoStep >= 2 ? "Posted in #team." : "I’ll post it in #team."}
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-muted">
                <BrandIcon id="slack" size={12} className="!shadow-none" /> Slack · Send messages · Permission already granted
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </In>
    </div>
  );
}

export const toolsDemos: Demo[] = [
  {
    label: "Linear issue",
    steps: 5,
    gate: 3,
    chat: [
      { from: "you", text: "Turn the invoice export request from yesterday’s call into a Linear issue.", at: 1 },
      { from: "juno", text: "Ready for your approval.", at: 3 },
      { from: "juno", text: "Created in Linear. Call attached, too.", at: 5 },
    ],
    ask: { q: "Create this Linear issue?", at: 3 },
    Desk: ActionsDesk,
  },
  {
    label: "Juno’s browser",
    steps: 5,
    gap: 1000,
    chat: [
      { from: "you", text: "Open our billing portal and check the invoice export options.", at: 1 },
      { from: "juno", text: "I’ll take a look.", at: 2 },
      { from: "juno", title: "CSV or PDF. Filtered by date.", text: "Want me to export last month?", at: 5 },
    ],
    Desk: BillingDesk,
  },
  {
    label: "Slack · #team",
    steps: 2,
    chat: [
      { from: "you", text: "Share the launch update in #team.", at: 1 },
      { from: "juno", text: "Post this to #team?", at: 2 },
    ],
    Desk: AskAutoDesk,
  },
];

/* ================================================================== 07 · jobs */

function InstructionsDesk({ s }: DeskProps) {
  const watch = ["Product launches", "Pricing changes", "Competitor websites"];
  return (
    <In s={s} at={2}>
      <Card className="p-4">
        <CardHead icon={<MascotMark size={16} />} title="New job" right={<Pill tone={s >= 4 ? "ok" : "muted"}>{s >= 4 ? "Ready" : "Setting up"}</Pill>} />
        <p className="mt-3 text-[18px] font-medium tracking-[-0.02em] text-text">Weekly competitor watch</p>
        <p className="mt-4 text-[12px] text-muted">Keep an eye on</p>
        <div className="mt-2 space-y-1.5">
          {watch.map((w) => (
            <In key={w} s={s} at={3}>
              <p className="flex items-center gap-2.5 rounded-[8px] bg-white/[0.04] px-3 py-2 text-[13px] text-text/90">
                <span className="grid size-4 place-items-center rounded-[4px] bg-[#7A8FFF] text-[#0B0E13]">
                  <Check size={11} strokeWidth={3} aria-hidden />
                </span>
                {w}
              </p>
            </In>
          ))}
        </div>
        <In s={s} at={4}>
          <div className="mt-4 rounded-[10px] border border-white/[0.08] p-3">
            <p className="text-[12px] text-muted">Your weekly briefing</p>
            <p className="mt-0.5 text-[13.5px] text-text">What changed. Sources. Next steps.</p>
          </div>
        </In>
      </Card>
    </In>
  );
}

function ScheduleDesk({ s }: DeskProps) {
  const active = s >= 3;
  return (
    <In s={s} at={1}>
      <Card className="p-4">
        <CardHead icon={<MascotMark size={16} />} title="Recurring job" right={<Flip on={active} a={<span className="inline-flex h-7 items-center rounded-[7px] bg-white px-2.5 text-[11.5px] font-medium text-[#16181d]">Create job</span>} b={<Pill tone="ok">Active</Pill>} />} />
        <p className="mt-3 text-[18px] font-medium tracking-[-0.02em] text-text">Weekly competitor watch</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
          {[
            ["Repeats", "Every Friday"],
            ["Time", "9:00 AM"],
            ["Timezone", "Asia/Dubai"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[8px] bg-white/[0.04] px-2.5 py-2">
              <p className="text-subtle">{k}</p>
              <p className="mt-0.5 truncate text-text">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-muted">Next runs</p>
        <div className="mt-2 space-y-1.5">
          {["October 02", "October 09", "October 16"].map((d, i) => (
            <In key={d} s={s} at={2}>
              <p className="flex items-center gap-2.5 rounded-[8px] border border-white/[0.06] px-3 py-2 text-[13px]">
                <span className="w-[86px] text-text">{d}</span>
                <span className="text-muted">Fri · 9:00 AM</span>
                {i === 0 && active && <Pill tone="blue" className="ml-auto">Next</Pill>}
              </p>
            </In>
          ))}
        </div>
        <In s={s} at={4}>
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted">
            <Check size={12} className="text-[#5BE3A2]" aria-hidden /> Checking sources · Up to date.
          </p>
        </In>
      </Card>
    </In>
  );
}

const briefings = [
  { d: "Fri, Oct 2", t: "A new annual plan.", l: "Pricing changes, with the source." },
  { d: "Fri, Oct 9", t: "A reporting feature launched.", l: "What shipped. Why it matters." },
  { d: "Fri, Oct 16", t: "Their positioning shifted.", l: "New messaging. What to consider." },
];

function ResultsDesk({ s }: DeskProps) {
  return (
    <div className="space-y-3">
      <In s={s} at={1}>
        <p className="text-[12.5px] text-muted">Your Friday briefings</p>
      </In>
      <div className="space-y-1.5">
        {briefings.map((b, i) => (
          <In key={b.d} s={s} at={1 + i}>
            <Card className={`flex items-start gap-3 px-3.5 py-2.5 ${i === 2 ? "border-[#7A8FFF]/30" : ""}`}>
              <span className="w-[68px] shrink-0 pt-0.5 text-[11.5px] text-muted">{b.d}</span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-medium text-text">{b.t}</p>
                <p className="text-[12px] text-muted">{b.l}</p>
              </div>
              <Pill tone="ok" className="ml-auto hidden @md:inline-flex">Delivered</Pill>
            </Card>
          </In>
        ))}
      </div>
      <In s={s} at={4}>
        <Card className="p-3.5">
          <p className="text-[12px] text-muted">Next moves</p>
          {["Update our pricing comparison.", "Check the overlap with our roadmap.", "Refresh our sales talking points."].map((x, i) => (
            <p key={x} className="mt-1.5 flex items-center gap-2 text-[13px] text-text/90">
              <ArrowRight size={12} className={i === 0 ? "text-[#A6BBFF]" : "text-subtle"} aria-hidden />
              {x}
            </p>
          ))}
        </Card>
      </In>
    </div>
  );
}

export const jobsDemos: Demo[] = [
  {
    label: "New job",
    steps: 4,
    gap: 1000,
    chat: [
      { from: "you", text: "Watch our competitors for product and pricing changes. Brief me every Friday at 9 AM.", at: 1 },
      { from: "juno", text: "I’m setting that up.", at: 2 },
      { from: "juno", title: "Consider it covered.", text: "A weekly briefing, right here.", at: 4 },
    ],
    Desk: InstructionsDesk,
  },
  {
    label: "Recurring job",
    steps: 4,
    gap: 1000,
    chat: [
      { from: "you", text: "Brief me every Friday at 9 AM.", at: 1 },
      { from: "juno", text: "Every Friday at 9:00 AM. Starting October 02.", at: 3 }, // [new]
    ],
    Desk: ScheduleDesk,
  },
  {
    label: "Briefings",
    steps: 5,
    gap: 950,
    chat: [
      { from: "juno", title: "Your competitor briefing is ready.", text: "Three changes this month, each with a source.", at: 4 }, // text [new]
    ],
    ask: { q: "I’d start with our sales comparison. Want me to update it?", at: 5, done: "On it" },
    Desk: ResultsDesk,
  },
];

export const chapterDemos: Record<string, Demo[]> = {
  knowledge: knowledgeDemos,
  brand: brandDemos,
  computer: computerDemos,
  apps: appsDemos,
  content: contentDemos,
  tools: toolsDemos,
  jobs: jobsDemos,
};

