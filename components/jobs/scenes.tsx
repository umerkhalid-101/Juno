"use client";

import type { CSSProperties, ReactNode } from "react";
import { Check, Globe, Search } from "lucide-react";
import { ToolLogo } from "@/components/ui/ToolLogo";
import type { ToolId } from "@/lib/story";

/**
 * The catalog card scenes, after Stripe: each job gets its own colour world, a main product
 * object with a second panel layered over it (both cropped by the card), and one motion that
 * shows the work happening. Motions only run while the card is on screen (`[data-play]`).
 */

const INK = "#14161f";
const MUTED = "#6b7080";

type World = { a: string; b: string; at?: string };
// a colour field per job, glowing up from the bottom of the card
export const worlds: Record<string, World> = {
  "find-our-next-customers": { a: "255,122,89", b: "255,77,141" },
  "turn-search-into-signups": { a: "56,189,248", b: "52,211,153", at: "30% 115%" },
  "make-every-ad-dollar-count": { a: "168,85,247", b: "236,72,153" },
  "catch-customers-before-they-leave": { a: "251,146,60", b: "239,68,68", at: "30% 115%" },
  "get-new-customers-to-their-first-win": { a: "52,211,153", b: "34,197,94" },
  "close-the-loop-with-customers": { a: "99,102,241", b: "56,189,248", at: "70% 115%" },
  "keep-every-promise-moving": { a: "192,38,211", b: "124,58,237" },
  "keep-our-launches-on-track": { a: "79,70,229", b: "34,211,238", at: "65% 115%" },
  "walk-into-every-call-prepared": { a: "234,67,53", b: "251,188,4" },
  "show-me-whats-driving-growth": { a: "132,204,22", b: "16,185,129", at: "35% 115%" },
  "keep-us-ahead-of-competitors": { a: "14,165,233", b: "99,102,241" },
  "keep-investors-in-the-loop": { a: "245,158,11", b: "234,88,12", at: "60% 115%" },
};

const card =
  "absolute rounded-[16px] bg-white text-[13px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.04)]";
const S = (o: CSSProperties) => o;

const Dot = ({ c }: { c: string }) => (
  <span className="size-1.5 shrink-0 rounded-full" style={{ background: c }} />
);
const Chip = ({
  tone,
  children,
  className = "",
  style,
}: {
  tone: "ok" | "warn" | "blue" | "violet";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => {
  const t = {
    ok: "bg-[#E9F7EF] text-[#1f7a4d]",
    warn: "bg-[#FFF4E0] text-[#a35f00]",
    blue: "bg-[#EEF0FF] text-[#3346e0]",
    violet: "bg-[#F3E8FF] text-[#7e22ce]",
  }[tone];
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-md px-2 font-mono text-[10px] uppercase tracking-[0.08em] ${t} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};
const Logo = ({ id, size = 14 }: { id: ToolId; size?: number }) => (
  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white ring-1 ring-black/[0.06]">
    <ToolLogo id={id} size={size} className="text-[#14161f]" />
  </span>
);

/* ------------------------------------------------------------------ scenes */

function Prospects() {
  const rows = [
    { n: "Orbit Studio", w: "Growing their client services team", f: 94, c: "#3346e0", i: "O" },
    { n: "Lumen Health", w: "Opened a second office", f: 88, c: "#0EA5E9", i: "L" },
    { n: "Parcel & Co", w: "Hiring 3 account managers", f: 81, c: "#F97316", i: "P" },
    { n: "Kestrel", w: "Raised a seed round", f: 76, c: "#10B981", i: "K" },
  ];
  return (
    <>
      <div className={card} style={S({ left: 32, top: 26, width: 430 })}>
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <Logo id="hubspot" />
          <span className="font-medium" style={{ color: INK }}>
            Prospects
          </span>
          <span className="ml-auto text-[12px]" style={{ color: MUTED }}>
            This week
          </span>
        </div>
        <ul className="relative px-2 py-2">
          {/* Juno reads down the list */}
          <span
            aria-hidden
            className="scene-scan pointer-events-none absolute inset-x-2 top-2 h-[52px] rounded-xl bg-[#EEF0FF]"
          />
          {rows.map((r) => (
            <li key={r.n} className="relative flex h-[52px] items-center gap-3 px-2">
              <span
                className="grid size-8 place-items-center rounded-lg text-[12px] font-semibold text-white"
                style={{ background: r.c }}
              >
                {r.i}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block font-medium" style={{ color: INK }}>
                  {r.n}
                </span>
                <span className="block truncate text-[12px]" style={{ color: MUTED }}>
                  {r.w}
                </span>
              </span>
              <span className="font-mono text-[12px] tabular-nums" style={{ color: INK }}>
                {r.f}% fit
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${card} scene-rise p-4`} style={S({ left: 250, top: 230, width: 330 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="gmail" size={13} />
          To Dana at Orbit Studio
          <Chip tone="blue" className="scene-pop ml-auto">
            New lead
          </Chip>
        </div>
        <p
          className="mt-2.5 text-[18px] font-semibold leading-[1.1] tracking-[-0.03em]"
          style={{ color: INK }}
        >
          Your next “let&apos;s talk.”
        </p>
        <p className="mt-1.5 text-[12.5px] leading-[18px]" style={{ color: MUTED }}>
          Saw you&apos;re expanding the team. Here&apos;s a simpler way to share client reports.
        </p>
      </div>
    </>
  );
}

function SearchPage() {
  return (
    <>
      <div className={card} style={S({ left: 28, top: 26, width: 400 })}>
        <div className="p-4">
          <div
            className="flex h-10 items-center gap-2 rounded-full bg-[#F1F3F4] px-4"
            style={{ color: INK }}
          >
            <Search size={14} style={{ color: MUTED }} aria-hidden />
            <span className="scene-type overflow-hidden whitespace-nowrap">
              best client reporting tools
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[70, 88, 60].map((w, k) => (
              <div key={k}>
                <span className="block h-2 rounded bg-[#1a0dab]/50" style={{ width: `${w}%` }} />
                <span
                  className="mt-1.5 block h-1.5 rounded bg-black/10"
                  style={{ width: `${w + 8}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`${card} scene-rise overflow-hidden`}
        style={S({ left: 200, top: 168, width: 300 })}
      >
        <div
          className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#F7F7F5] px-3 py-2 font-mono text-[11px]"
          style={{ color: MUTED }}
        >
          <Globe size={11} aria-hidden />
          /compare/reporting-tools
        </div>
        <div className="p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>
            Your next comparison page
          </p>
          <p
            className="mt-1.5 text-[18px] font-semibold leading-[1.1] tracking-[-0.03em]"
            style={{ color: INK }}
          >
            The search. The answer. Your company.
          </p>
          <Chip tone="ok" className="mt-3">
            Draft ready
          </Chip>
        </div>
      </div>
    </>
  );
}

function Ads() {
  return (
    <>
      <div className={`${card} overflow-hidden`} style={S({ left: 28, top: 30, width: 196 })}>
        <div className="h-[92px] bg-[linear-gradient(135deg,#c7d2fe,#e9d5ff)]" />
        <div className="p-3">
          <p
            className="text-[14px] font-semibold leading-[17px] tracking-[-0.02em]"
            style={{ color: INK }}
          >
            Reporting, simplified.
          </p>
          <p className="mt-1 font-mono text-[11px]" style={{ color: MUTED }}>
            $84 per lead
          </p>
          <Chip tone="warn" className="mt-2">
            Needs a refresh
          </Chip>
        </div>
      </div>
      <div
        className={`${card} scene-win overflow-hidden`}
        style={S({ left: 238, top: 14, width: 210 })}
      >
        <div className="h-[100px] bg-[linear-gradient(135deg,#fbcfe8,#f0abfc_55%,#a78bfa)]" />
        <div className="p-3">
          <p
            className="text-[14px] font-semibold leading-[17px] tracking-[-0.02em]"
            style={{ color: INK }}
          >
            Your Monday. Already handled.
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-mono text-[11px]" style={{ color: MUTED }}>
              $21 per lead
            </p>
            <svg viewBox="0 0 60 20" className="h-5 w-[60px]" aria-hidden>
              <path
                className="scene-draw"
                d="M1 17 L12 14 L22 15 L33 9 L44 8 L59 2"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
              />
            </svg>
          </div>
          <Chip tone="ok" className="mt-2">
            Winner
          </Chip>
        </div>
      </div>
      <div
        className={`${card} scene-rise flex items-center gap-2 px-3 py-2.5`}
        style={S({ left: 120, top: 262 })}
      >
        <Dot c="#a855f7" />
        <span style={{ color: INK }}>New creative. Ready to test.</span>
      </div>
    </>
  );
}

function Renewal() {
  return (
    <>
      <div className={`${card} p-4`} style={S({ left: 28, top: 26, width: 300 })}>
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-[#0EA5E9] text-[12px] font-semibold text-white">
            N
          </span>
          <span className="leading-tight">
            <span className="block font-medium" style={{ color: INK }}>
              Northwind
            </span>
            <span className="block text-[12px]" style={{ color: MUTED }}>
              Renews in 30 days
            </span>
          </span>
        </div>
        <p className="mt-4 text-[11.5px]" style={{ color: MUTED }}>
          Account health
        </p>
        <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-black/[0.06]">
          <span className="scene-health block h-full rounded-full bg-[linear-gradient(90deg,#f59e0b,#ef4444)]" />
        </span>
      </div>
      <div className={`${card} scene-rise p-3.5`} style={S({ left: 120, top: 150, width: 270 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="intercom" size={13} />
          Northwind support thread
        </div>
        <p
          className="mt-2 rounded-2xl rounded-tl-md bg-[#F1F3F6] px-3 py-2 text-[12.5px]"
          style={{ color: INK }}
        >
          “We&apos;re still waiting on the export.”
        </p>
        <span className="relative mt-3 block h-6">
          <Chip tone="warn" className="scene-out absolute left-0 top-0">
            Blocker found
          </Chip>
          <Chip tone="ok" className="scene-in absolute left-0 top-0">
            Check-in ready
          </Chip>
        </span>
      </div>
    </>
  );
}

function Onboarding() {
  return (
    <>
      <div className={`${card} p-4`} style={S({ left: 28, top: 26, width: 300 })}>
        <div className="flex items-center justify-between">
          <span className="font-medium" style={{ color: INK }}>
            Maya&apos;s team setup
          </span>
          <span className="font-mono text-[11px]" style={{ color: MUTED }}>
            2 of 3
          </span>
        </div>
        <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <span className="scene-fill block h-full w-2/3 rounded-full bg-[#16a34a]" />
        </span>
        <ul className="mt-4 space-y-2.5">
          {["Account created", "Team invited"].map((s) => (
            <li key={s} className="flex items-center gap-2.5" style={{ color: INK }}>
              <span className="grid size-5 place-items-center rounded-full bg-[#E9F7EF] text-[#1f7a4d]">
                <Check size={12} strokeWidth={3} aria-hidden />
              </span>
              {s}
            </li>
          ))}
          <li className="scene-ring flex items-center gap-2.5 rounded-lg" style={{ color: INK }}>
            <span className="size-5 rounded-full border-[1.5px] border-black/20" />
            Connect your data
          </li>
        </ul>
      </div>
      <div className={`${card} scene-rise p-4`} style={S({ left: 170, top: 196, width: 260 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="notion" size={13} />
          Guide
        </div>
        <p
          className="mt-2 text-[15px] font-semibold leading-[1.15] tracking-[-0.02em]"
          style={{ color: INK }}
        >
          Connect your data in two minutes
        </p>
        <p className="mt-1.5 text-[12px]" style={{ color: MUTED }}>
          The right guide. Ready to send.
        </p>
      </div>
    </>
  );
}

function Shipped() {
  return (
    <>
      <div className={`${card} p-5`} style={S({ left: 36, top: 60, width: 420 })}>
        <div className="flex items-center gap-2 text-[12px]" style={{ color: MUTED }}>
          <Logo id="gmail" size={13} />
          To Maya · Asked for this last month
        </div>
        <p
          className="mt-3 text-[24px] font-semibold leading-[1.05] tracking-[-0.035em]"
          style={{ color: INK }}
        >
          You asked. It&apos;s here.
        </p>
        <p className="mt-2 text-[13.5px] leading-[20px]" style={{ color: MUTED }}>
          You can now share a live report with your clients. I thought of your team.
        </p>
        <span className="mt-4 inline-flex h-9 items-center rounded-full bg-[#14161f] px-4 text-[12.5px] font-medium text-white">
          Try your first share link
        </span>
      </div>
      <div
        className={`${card} scene-drop flex items-center gap-2.5 px-3.5 py-2.5`}
        style={S({ left: 200, top: 18 })}
      >
        <Logo id="linear" size={13} />
        <span className="font-medium" style={{ color: INK }}>
          Client report sharing
        </span>
        <Chip tone="ok">Just shipped</Chip>
      </div>
      <div
        className={`${card} scene-rise flex items-center gap-2 px-3 py-2`}
        style={S({ left: 300, top: 300 })}
      >
        <span className="flex -space-x-1.5">
          {["#3346e0", "#16a34a", "#f97316"].map((c, k) => (
            <span
              key={k}
              className="size-5 rounded-full ring-2 ring-white"
              style={{ background: c }}
            />
          ))}
        </span>
        <span className="text-[12px]" style={{ color: INK }}>
          3 personal notes
        </span>
      </div>
    </>
  );
}

function Commitments() {
  return (
    <>
      <div className={`${card} p-4`} style={S({ left: 28, top: 26, width: 330 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="drive" size={13} />
          Monday sync · notes
        </div>
        <ul className="mt-3 space-y-2 text-[12.5px]" style={{ color: MUTED }}>
          <li>Pricing page goes live Friday</li>
          <li className="relative w-fit">
            <span
              aria-hidden
              className="scene-mark absolute -inset-x-1 inset-y-0 rounded bg-[#FDE68A]"
            />
            <span className="relative" style={{ color: INK }}>
              Sam to approve launch copy by Thursday
            </span>
          </li>
          <li>Leo shares the help docs</li>
        </ul>
      </div>
      <div className={`${card} scene-rise p-3.5`} style={S({ left: 140, top: 160, width: 290 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="slack" size={13} />
          Direct message · Sam Rivera
        </div>
        <p className="mt-2 text-[13px] leading-[19px]" style={{ color: INK }}>
          Sam, anything you need to unblock this?
        </p>
        <span className="scene-typing mt-2 flex gap-1" aria-hidden>
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="size-1.5 rounded-full bg-black/30"
              style={{ animationDelay: `${d * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </>
  );
}

function Launch() {
  return (
    <>
      <div className={`${card} p-5`} style={S({ left: 36, top: 40, width: 360 })}>
        <div className="flex items-center justify-between">
          <span className="font-medium" style={{ color: INK }}>
            Friday&apos;s launch
          </span>
          <Logo id="linear" size={13} />
        </div>
        <ul className="mt-4 space-y-3">
          {["Feature shipped", "Campaign ready"].map((s) => (
            <li key={s} className="flex items-center gap-2.5" style={{ color: INK }}>
              <span className="grid size-5 place-items-center rounded-full bg-[#E9F7EF] text-[#1f7a4d]">
                <Check size={12} strokeWidth={3} aria-hidden />
              </span>
              {s}
            </li>
          ))}
          <li className="flex items-center gap-2.5" style={{ color: INK }}>
            <span className="grid size-5 place-items-center rounded-full bg-[#EEF0FF] text-[#3346e0]">
              <span className="size-1.5 rounded-full bg-current" />
            </span>
            Help article
            <Chip tone="blue" className="ml-auto">
              Drafting
            </Chip>
          </li>
        </ul>
      </div>
      <div className={`${card} scene-rise p-5`} style={S({ left: 210, top: 210, width: 360 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="notion" size={13} />
          Help center · Draft
        </div>
        <p className="mt-2 text-[17px] font-semibold tracking-[-0.02em]" style={{ color: INK }}>
          Share a live report with clients
        </p>
        <div className="mt-3 space-y-2">
          {[92, 84, 70].map((w, k) => (
            <span
              key={k}
              className="scene-line block h-1.5 rounded bg-black/10"
              style={{ width: `${w}%`, animationDelay: `${k * 0.5}s` }}
            />
          ))}
        </div>
        <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
          Juno has the first draft.
        </p>
      </div>
    </>
  );
}

function CallPrep() {
  return (
    <>
      <div className={`${card} overflow-hidden`} style={S({ left: 28, top: 26, width: 280 })}>
        <div className="flex">
          <span className="w-1.5 bg-[#4285F4]" />
          <div className="p-3.5">
            <p className="font-medium" style={{ color: INK }}>
              Call with Maya
            </p>
            <p className="text-[12px]" style={{ color: MUTED }}>
              10:00 to 10:30 · Google Meet
            </p>
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-[#3346e0]">
              <Dot c="#3346e0" />
              Starts in 20 min
            </p>
          </div>
        </div>
      </div>
      <div className={`${card} scene-rise p-4`} style={S({ left: 110, top: 128, width: 320 })}>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>
          Before your 10:00 with Maya
        </p>
        <dl className="mt-3 space-y-2 text-[12.5px]">
          {[
            ["Last time", "Asked about client reporting."],
            ["Since then", "Share links are now live."],
            ["Next up", "Show her the new workflow."],
          ].map(([k, v], n) => (
            <div
              key={k}
              className="scene-row flex gap-3"
              style={{ animationDelay: `${n * 0.35}s` }}
            >
              <dt className="w-[70px] shrink-0 font-medium" style={{ color: INK }}>
                {k}
              </dt>
              <dd style={{ color: MUTED }}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

function Growth() {
  return (
    <>
      <div className={`${card} p-4`} style={S({ left: 28, top: 26, width: 360 })}>
        <div className="flex items-center justify-between">
          <span className="font-medium" style={{ color: INK }}>
            Activated teams by source
          </span>
          <span className="font-mono text-[11px] text-[#16a34a]">+38%</span>
        </div>
        <svg viewBox="0 0 320 110" className="mt-3 h-[110px] w-full" aria-hidden>
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#16a34a" stopOpacity="0.22" />
              <stop offset="1" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[28, 56, 84].map((y) => (
            <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="#000" strokeOpacity="0.05" />
          ))}
          <path
            d="M0 96 L40 90 L80 92 L120 78 L160 70 L200 56 L240 44 L280 30 L320 18 L320 110 L0 110 Z"
            fill="url(#sg)"
          />
          <path
            className="scene-draw"
            d="M0 96 L40 90 L80 92 L120 78 L160 70 L200 56 L240 44 L280 30 L320 18"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinejoin="round"
            pathLength={1}
          />
        </svg>
      </div>
      <div
        className={`${card} scene-rise flex items-center gap-2 px-3.5 py-2.5`}
        style={S({ left: 150, top: 200 })}
      >
        <span className="rounded-md bg-[#F1F3F6] px-2 py-1 text-[12px]" style={{ color: INK }}>
          Comparison pages
        </span>
        <span className="text-[#16a34a]">→</span>
        <span className="rounded-md bg-[#F1F3F6] px-2 py-1 text-[12px]" style={{ color: INK }}>
          Activated teams
        </span>
      </div>
      <div
        className={`${card} scene-rise px-3.5 py-2.5 text-[12px]`}
        style={S({ left: 60, top: 262, color: INK })}
      >
        Your next page brief is ready.
      </div>
    </>
  );
}

function Competitors() {
  return (
    <>
      <div className={`${card} overflow-hidden`} style={S({ left: 28, top: 26, width: 320 })}>
        <div
          className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#F7F7F5] px-3 py-2 font-mono text-[11px]"
          style={{ color: MUTED }}
        >
          <Globe size={11} aria-hidden />
          rivalreports.example/pricing
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          {["Team", "Business"].map((p) => (
            <div key={p} className="rounded-lg bg-[#F7F7F5] p-2.5">
              <p className="text-[12px]" style={{ color: MUTED }}>
                {p}
              </p>
              <p
                className="relative mt-1 h-5 overflow-hidden text-[15px] font-semibold"
                style={{ color: INK }}
              >
                <span className="scene-flip-a block">{p === "Team" ? "$49 / mo" : "$99 / mo"}</span>
                <span className="scene-flip-b absolute inset-x-0 top-0 block">
                  {p === "Team" ? "$468 / yr" : "$948 / yr"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={`${card} scene-rise p-3.5`} style={S({ left: 140, top: 168, width: 290 })}>
        <div className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
          <Logo id="notion" size={13} />
          Sales comparison
        </div>
        <p className="mt-2 font-medium" style={{ color: INK }}>
          Pricing changed
        </p>
        <p className="text-[12.5px]" style={{ color: MUTED }}>
          Annual-only plans introduced
        </p>
        <Chip tone="ok" className="mt-2.5">
          Sales comparison updated
        </Chip>
      </div>
    </>
  );
}

function Investors() {
  const kpi = [
    ["MRR", "$48.2k", "+12%"],
    ["Teams", "318", "+24"],
    ["Runway", "22 mo", ""],
  ];
  return (
    <>
      <div className={`${card} p-5`} style={S({ left: 36, top: 40, width: 400 })}>
        <div className="flex items-center gap-2 text-[12px]" style={{ color: MUTED }}>
          <Logo id="gmail" size={13} />
          To investors · October update
        </div>
        <p
          className="mt-3 text-[22px] font-semibold leading-[1.05] tracking-[-0.035em]"
          style={{ color: INK }}
        >
          The month. Already written.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {kpi.map(([k, v, d]) => (
            <div key={k} className="rounded-lg bg-[#F7F7F5] p-2.5">
              <p className="text-[11px]" style={{ color: MUTED }}>
                {k}
              </p>
              <p
                className="scene-count mt-0.5 text-[16px] font-semibold tabular-nums"
                style={{ color: INK }}
              >
                {v}
              </p>
              {d && <p className="text-[11px] text-[#16a34a]">{d}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className={`${card} scene-rise p-4`} style={S({ left: 230, top: 250, width: 320 })}>
        <dl className="space-y-2 text-[12.5px]">
          {[
            ["The win", "Team plans launched."],
            ["The focus", "Faster first-time setup."],
            ["The ask", "Introductions to agencies."],
          ].map(([k, v], n) => (
            <div
              key={k}
              className="scene-row flex gap-3"
              style={{ animationDelay: `${n * 0.35}s` }}
            >
              <dt className="w-[70px] shrink-0 font-medium" style={{ color: INK }}>
                {k}
              </dt>
              <dd style={{ color: MUTED }}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

const scenes: Record<string, () => ReactNode> = {
  "find-our-next-customers": Prospects,
  "turn-search-into-signups": SearchPage,
  "make-every-ad-dollar-count": Ads,
  "catch-customers-before-they-leave": Renewal,
  "get-new-customers-to-their-first-win": Onboarding,
  "close-the-loop-with-customers": Shipped,
  "keep-every-promise-moving": Commitments,
  "keep-our-launches-on-track": Launch,
  "walk-into-every-call-prepared": CallPrep,
  "show-me-whats-driving-growth": Growth,
  "keep-us-ahead-of-competitors": Competitors,
  "keep-investors-in-the-loop": Investors,
};

/** The colour world plus the layered scene. Fills its parent; the card crops it. */
export function JobScene({
  slug,
  play = true,
  big = false,
  offset = 0,
}: {
  slug: string;
  play?: boolean;
  big?: boolean;
  /** Where the product starts inside the scene, so the colour can run behind the title. */
  offset?: number;
}) {
  const w = worlds[slug];
  const Scene = scenes[slug];
  return (
    <div data-play={play ? "true" : "false"} className="scene absolute inset-0 overflow-hidden">
      {/* the colour world, glowing up from the bottom edge */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(100% 75% at ${w.at ?? "50% 112%"}, rgba(${w.a},0.85), rgba(${w.b},0.4) 42%, transparent 78%), radial-gradient(70% 55% at 100% 100%, rgba(${w.b},0.45), transparent 70%)`,
        }}
      />
      <div
        className={`absolute left-0 origin-top-left ${big ? "scale-[1.08] md:scale-[1.14]" : "md:scale-[0.9]"}`}
        style={{ top: offset, width: 600, height: 420 }}
      >
        {Scene && <Scene />}
      </div>
    </div>
  );
}
