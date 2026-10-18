"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { Check, Globe, Search } from "lucide-react";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { DotField, type DotMode } from "./DotField";
import type { ToolId } from "@/lib/story";

/** People, as real portraits (Unsplash, free licence). Names match the rest of the site. */
const people = {
  maya: "1494790108377-be9c29b29330",
  dana: "1659481993364-4512775ed911",
  priya: "1609436132311-e4b0c9370469",
  sam: "1500648767791-00dcc994a43e",
  leo: "1507003211169-0a1dd7228f2d",
};
function Face({
  who,
  size = 22,
  className = "",
}: {
  who: keyof typeof people;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-[#e5e7eb] ring-2 ring-white ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`https://images.unsplash.com/photo-${people[who]}?auto=format&fit=crop&crop=faces&w=${size * 3}&h=${size * 3}&q=75`}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}

/** Real photography for the ad creatives (Unsplash, free licence). */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=75`;

/**
 * The catalog card scenes, after Stripe: each job gets its own colour world, a main product
 * object with a second panel layered over it (both cropped by the card), and one motion that
 * shows the work happening. Motions only run while the card is on screen (`[data-play]`).
 */

const INK = "#14161f";
const MUTED = "#6b7080";

type World = { a: string; b: string; at?: string; dots?: DotMode };
// a colour field per job, glowing up from the bottom of the card
// One palette that sits with the site's navy and periwinkle: dawn (peach, rose, sand),
// sea (mint, teal, sky) and dusk (lavender, periwinkle). Soft, desaturated, never loud.
const P = {
  peach: "244,182,156",
  rose: "232,164,196",
  sand: "232,204,150",
  mint: "150,214,190",
  teal: "120,196,206",
  sky: "140,186,240",
  lavender: "182,166,240",
  periwinkle: "166,187,255",
};
export const worlds: Record<string, World> = {
  "find-our-next-customers": { a: P.peach, b: P.rose, dots: "globe" },
  "turn-search-into-signups": { a: P.teal, b: P.sky, at: "30% 115%", dots: "wave" },
  "make-every-ad-dollar-count": { a: P.lavender, b: P.rose },
  "catch-customers-before-they-leave": { a: P.sand, b: P.peach, at: "30% 115%", dots: "wave" },
  "get-new-customers-to-their-first-win": { a: P.mint, b: P.teal, dots: "rise" },
  "close-the-loop-with-customers": { a: P.sky, b: P.periwinkle, at: "70% 115%", dots: "globe" },
  "keep-every-promise-moving": { a: P.lavender, b: P.rose, dots: "ripple" },
  "keep-our-launches-on-track": { a: P.periwinkle, b: P.teal, at: "65% 115%", dots: "rise" },
  "walk-into-every-call-prepared": { a: P.peach, b: P.sand, dots: "ripple" },
  "show-me-whats-driving-growth": { a: P.mint, b: P.sky, at: "35% 115%", dots: "rise" },
  "keep-us-ahead-of-competitors": { a: P.sky, b: P.lavender, dots: "radar" },
  "keep-investors-in-the-loop": { a: P.sand, b: P.rose, at: "60% 115%", dots: "globe" },
};

const card =
  "absolute rounded-[16px] bg-white text-[13px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.04)]";
const S = (o: CSSProperties) => o;

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
          <Face who="dana" />
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

/** A feed ad, the way it actually runs (brand, "Sponsored", the creative, a call to action),
 *  with Juno's read of it underneath: cost per lead and a verdict. */
function FeedAd({
  img,
  headline,
  style,
  className = "",
  strong = false,
  cpl,
  verdict,
}: {
  img: string;
  headline: ReactNode;
  style: CSSProperties;
  className?: string;
  strong?: boolean;
  cpl: string;
  verdict: ReactNode;
}) {
  return (
    <div className={`${card} overflow-hidden ${className}`} style={style}>
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="grid size-6 place-items-center rounded-full bg-[#3346e0]">
          <span className="size-2.5 rounded-full border-[2px] border-white" />
        </span>
        <span className="leading-none">
          <span className="block text-[11.5px] font-semibold" style={{ color: INK }}>
            Orbit
          </span>
          <span className="mt-0.5 block text-[9.5px]" style={{ color: MUTED }}>
            Sponsored
          </span>
        </span>
      </div>
      <div className="relative h-[128px] bg-[#1b1d24]">
        <Image src={photo(img)} alt="" fill sizes="240px" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.62))]" />
        <p
          className={`absolute inset-x-3 bottom-2.5 font-semibold leading-[1.05] tracking-[-0.03em] text-white ${strong ? "text-[19px]" : "text-[15px] opacity-90"}`}
        >
          {headline}
        </p>
      </div>
      <div className="flex items-center justify-between bg-[#F0F2F5] px-3 py-1.5">
        <span className="text-[10.5px] font-semibold" style={{ color: INK }}>
          orbit.app
        </span>
        <span
          className="rounded-md bg-[#E4E6EB] px-2 py-0.5 text-[10.5px] font-semibold"
          style={{ color: INK }}
        >
          Learn more
        </span>
      </div>
      {/* Juno's read */}
      <div className="flex items-center justify-between gap-2 border-t border-black/[0.06] px-3 py-2">
        <span
          className="whitespace-nowrap font-mono text-[11px] tabular-nums"
          style={{ color: INK }}
        >
          {cpl}
        </span>
        {verdict}
      </div>
    </div>
  );
}

function Ads() {
  return (
    <>
      {/* the tired creative, set back */}
      <FeedAd
        img="1575318634028-6a0cfcb60c59"
        headline="Reporting, simplified."
        cpl="$84 / lead"
        verdict={<Chip tone="warn">Needs a refresh</Chip>}
        style={S({ left: 20, top: 30, width: 210 })}
        className="opacity-90"
      />
      {/* the winner, in front */}
      <FeedAd
        img="1542330952-bffc55e812b2"
        headline={
          <>
            Your Monday.
            <br />
            Already handled.
          </>
        }
        cpl="$21 / lead"
        verdict={
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 48 16" className="h-4 w-10" aria-hidden>
              <path
                className="scene-draw"
                d="M1 14 L10 11 L18 12 L27 7 L36 6 L47 2"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
              />
            </svg>
            <Chip tone="ok">Winner</Chip>
          </span>
        }
        style={S({ left: 246, top: 14, width: 224 })}
        className="scene-win"
        strong
      />
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
          <Face who="priya" />
          Priya at Northwind · via Intercom
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
          <span className="flex items-center gap-2 font-medium" style={{ color: INK }}>
            <Face who="maya" />
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
          <Face who="maya" />
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
          {(["maya", "leo", "priya"] as const).map((p) => (
            <Face key={p} who={p} size={22} />
          ))}
        </span>
        <span className="text-[12px]" style={{ color: INK }}>
          3 personal notes
        </span>
      </div>
    </>
  );
}

function Launch() {
  return (
    <>
      <div className={`${card} p-5`} style={S({ left: 0, top: 10, width: 340 })}>
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
      <div className={`${card} scene-rise p-5`} style={S({ left: 370, top: 40, width: 360 })}>
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

/* ------------------------------------------------------------------ frames: the objects people recognise */

/** A light browser window: traffic lights and an address bar. */
function Browser({
  url,
  children,
  style,
  className = "",
}: {
  url: string;
  children: ReactNode;
  style: CSSProperties;
  className?: string;
}) {
  return (
    <div className={`${card} overflow-hidden ${className}`} style={style}>
      <div className="flex items-center gap-3 border-b border-black/[0.06] bg-[#F3F3F1] px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span
          className="flex h-6 flex-1 items-center gap-1.5 truncate rounded-md bg-white px-2 font-mono text-[10.5px] ring-1 ring-black/[0.05]"
          style={{ color: MUTED }}
        >
          <Globe size={10} aria-hidden />
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/** A phone, front on: dark bezel, rounded screen, a dynamic island. */
function Phone({
  children,
  style,
  screen = "#F2F2F7",
}: {
  children: ReactNode;
  style: CSSProperties;
  screen?: string;
}) {
  return (
    <div
      className="absolute rounded-[38px] bg-[#111318] p-[9px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.12)]"
      style={style}
    >
      <div
        className="relative h-full overflow-hidden rounded-[30px]"
        style={{ background: screen }}
      >
        <span className="absolute left-1/2 top-2 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-[#111318]" />
        {children}
      </div>
    </div>
  );
}

function SearchPage() {
  return (
    <>
      <Browser url="google.com/search" style={S({ left: 28, top: 26, width: 420 })}>
        <div className="p-4">
          <div
            className="flex h-10 items-center gap-2 rounded-full bg-white px-4 shadow-[0_1px_6px_rgba(32,33,36,0.18)]"
            style={{ color: INK }}
          >
            <Search size={14} style={{ color: MUTED }} aria-hidden />
            <span className="scene-type overflow-hidden whitespace-nowrap">
              best client reporting tools
            </span>
          </div>
          <div className="mt-4 space-y-3.5">
            {[
              ["G2 · Reporting software", 72],
              ["The 9 best client reporting tools", 86],
              ["Reddit · What do agencies use?", 64],
            ].map(([t, w]) => (
              <div key={t as string}>
                <p className="text-[13px] text-[#1a0dab]">{t}</p>
                <span
                  className="mt-1.5 block h-1.5 rounded bg-black/10"
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </Browser>
      <div className={`${card} scene-rise p-4`} style={S({ left: 230, top: 196, width: 300 })}>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>
          /compare/reporting-tools
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
    </>
  );
}

function Commitments() {
  return (
    <>
      <div className={`${card} p-4`} style={S({ left: 28, top: 40, width: 300 })}>
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
      {/* Sam's phone lights up */}
      <Phone
        style={S({ left: 300, top: 14, width: 210, height: 380 })}
        screen="linear-gradient(180deg,#3b1d4a,#1a1030)"
      >
        <p className="mt-12 text-center text-[40px] font-light leading-none text-white/90">9:41</p>
        <div className="scene-rise mx-2.5 mt-6 rounded-[18px] bg-white/85 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-[11px]" style={{ color: MUTED }}>
            <Logo id="slack" size={12} />
            Slack · now
          </div>
          <p className="mt-1.5 text-[12px] font-semibold" style={{ color: INK }}>
            Juno
          </p>
          <p className="text-[12px] leading-[16px]" style={{ color: INK }}>
            Sam, anything you need to unblock this?
          </p>
        </div>
      </Phone>
    </>
  );
}

function CallPrep() {
  return (
    <>
      <Phone
        style={S({ left: 36, top: 18, width: 210, height: 390 })}
        screen="linear-gradient(180deg,#1e293b,#0f172a)"
      >
        <p className="mt-12 text-center text-[13px] text-white/70">Tuesday, Nov 18</p>
        <p className="text-center text-[44px] font-light leading-none text-white/90">9:40</p>
        <div className="scene-drop mx-2.5 mt-6 rounded-[18px] bg-white/85 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-[11px]" style={{ color: MUTED }}>
            <Logo id="calendar" size={12} />
            Calendar · in 20 min
          </div>
          <p className="mt-1.5 text-[12.5px] font-semibold" style={{ color: INK }}>
            Call with Maya
          </p>
          <p className="text-[11.5px]" style={{ color: MUTED }}>
            Juno prepared your brief
          </p>
        </div>
      </Phone>
      <div className={`${card} scene-rise p-4`} style={S({ left: 210, top: 150, width: 310 })}>
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
  const bars = [18, 22, 20, 26, 24, 31, 29, 36, 34, 42, 40, 49, 47, 55, 58, 64];
  return (
    <>
      <div className={`${card} p-4`} style={S({ left: 28, top: 26, width: 380 })}>
        <div className="flex items-center justify-between">
          <span className="leading-tight">
            <span className="block text-[12px]" style={{ color: MUTED }}>
              Activated teams from comparison pages
            </span>
            <span
              className="block text-[20px] font-semibold tabular-nums tracking-[-0.02em]"
              style={{ color: INK }}
            >
              1,284
            </span>
          </span>
          <Chip tone="ok">+38%</Chip>
        </div>
        <div className="mt-4 flex h-[110px] items-end gap-[5px]">
          {bars.map((h, k) => (
            <span
              key={k}
              className="scene-bar flex-1 origin-bottom rounded-t-[3px] bg-[linear-gradient(180deg,#22c55e,#16a34a)]"
              style={{ height: `${h + 30}%`, animationDelay: `${k * 0.06}s` }}
            />
          ))}
        </div>
      </div>
      <div
        className={`${card} scene-rise flex items-center gap-2 px-3.5 py-2.5`}
        style={S({ left: 420, top: 70 })}
      >
        <span className="rounded-md bg-[#F1F3F6] px-2 py-1 text-[12px]" style={{ color: INK }}>
          Comparison pages
        </span>
        <span className="text-[#16a34a]">→</span>
        <span className="rounded-md bg-[#F1F3F6] px-2 py-1 text-[12px]" style={{ color: INK }}>
          Activated teams
        </span>
      </div>
    </>
  );
}

function Competitors() {
  return (
    <>
      <Browser url="rivalreports.example/pricing" style={S({ left: 28, top: 26, width: 380 })}>
        <div className="grid grid-cols-2 gap-2 p-3">
          {["Team", "Business"].map((p) => (
            <div key={p} className="rounded-lg bg-[#F7F7F5] p-3">
              <p className="text-[12px]" style={{ color: MUTED }}>
                {p}
              </p>
              <p
                className="relative mt-1 h-6 overflow-hidden text-[17px] font-semibold"
                style={{ color: INK }}
              >
                <span className="scene-flip-a block">{p === "Team" ? "$49 / mo" : "$99 / mo"}</span>
                <span className="scene-flip-b absolute inset-x-0 top-0 block">
                  {p === "Team" ? "$468 / yr" : "$948 / yr"}
                </span>
              </p>
              <span className="mt-2 block h-6 rounded-md bg-[#14161f]" />
            </div>
          ))}
        </div>
      </Browser>
      <div className={`${card} scene-rise p-3.5`} style={S({ left: 420, top: 40, width: 280 })}>
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
      {/* the update, open in a mail window */}
      <div className={`${card} overflow-hidden`} style={S({ left: 30, top: 30, width: 420 })}>
        <div
          className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F6F8FC] px-4 py-2.5 text-[12px]"
          style={{ color: MUTED }}
        >
          <Logo id="gmail" size={13} />
          <span className="font-medium" style={{ color: INK }}>
            October update
          </span>
          <span className="ml-auto">To 14 investors</span>
        </div>
        <div className="p-5">
          <p
            className="text-[22px] font-semibold leading-[1.05] tracking-[-0.035em]"
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
          <dl className="mt-4 space-y-2 text-[12.5px]">
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
      </div>
      <div
        className={`${card} scene-rise flex items-center gap-2.5 px-3.5 py-2.5`}
        style={S({ left: 250, top: 372 })}
      >
        <span className="inline-flex h-7 items-center rounded-full bg-[#14161f] px-3 text-[12px] font-medium text-white">
          Review and send
        </span>
        <span className="text-[12px]" style={{ color: MUTED }}>
          Waits for your yes
        </span>
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
export type SceneFit = "big" | "wide" | "landscape" | "tall" | "small";

/** How much room each scene's content needs (right and bottom edge of its furthest panel). */
const extent: Record<string, [number, number]> = {
  "find-our-next-customers": [585, 372],
  "turn-search-into-signups": [535, 344],
  "make-every-ad-dollar-count": [475, 326],
  "catch-customers-before-they-leave": [395, 305],
  "get-new-customers-to-their-first-win": [435, 300],
  "close-the-loop-with-customers": [470, 345],
  "keep-every-promise-moving": [515, 396],
  "keep-our-launches-on-track": [735, 255],
  "walk-into-every-call-prepared": [525, 410],
  "show-me-whats-driving-growth": [690, 230],
  "keep-us-ahead-of-competitors": [705, 215],
  "keep-investors-in-the-loop": [500, 415],
};

// the most each card shape scales its scene, and where the scene starts below the title
const fits: Record<SceneFit, { max: number; top: number }> = {
  big: { max: 1.14, top: 140 },
  wide: { max: 1.08, top: 104 },
  landscape: { max: 1, top: 96 },
  tall: { max: 1, top: 126 },
  small: { max: 0.95, top: 96 },
};

/** The colour world plus the layered scene, scaled and centred to sit fully inside its card. */
export function JobScene({
  slug,
  play = true,
  fit = "small",
  ribbon = false,
}: {
  slug: string;
  play?: boolean;
  fit?: SceneFit;
  ribbon?: boolean;
}) {
  const w = worlds[slug];
  const Scene = scenes[slug];
  const f = fits[fit];
  const [ex, ey] = extent[slug] ?? [600, 420];
  const root = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // fit the width fully; let tall scenes run a little past the bottom edge, like Stripe's
  const scale = box
    ? Math.max(
        0.5,
        Math.min(
          f.max,
          (box.w - 40) / ex,
          Math.max(0.6, (box.h - f.top + (fit === "small" || fit === "landscape" ? 6 : 36)) / ey),
        ),
      )
    : Math.min(f.max, 0.9);
  const left = box ? Math.max(12, (box.w - ex * scale) / 2) : 12;

  return (
    <div
      ref={root}
      data-play={play ? "true" : "false"}
      className="scene absolute inset-0 overflow-hidden"
    >
      {/* the colour world: a sweep that deepens toward the bottom, like Stripe's */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 28%, rgba(${w.a},0.14) 62%, rgba(${w.b},0.32) 100%), radial-gradient(90% 55% at ${w.at ?? "50% 112%"}, rgba(${w.a},0.38), transparent 72%)`,
        }}
      />
      {/* larger cards get a soft ribbon of colour behind the product */}
      {ribbon && (
        <div
          aria-hidden
          className="absolute -left-[20%] top-[46%] h-[180px] w-[140%] -rotate-[9deg] rounded-[50%] opacity-30 blur-[56px]"
          style={{
            background: `linear-gradient(90deg, rgba(${w.b},0), rgba(${w.a},0.9) 35%, rgba(${w.b},0.85) 70%, rgba(${w.a},0))`,
          }}
        />
      )}
      {/* a living dot graphic that tells the job's story */}
      {w.dots && <DotField mode={w.dots} rgb={w.a} rgb2={w.b} play={play} />}
      {/* the product leans in a touch when you hover the card */}
      <div className="absolute inset-0 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]">
        <div
          className="absolute origin-top-left"
          style={{
            left,
            top: f.top,
            width: ex,
            height: ey,
            transform: `scale(${scale})`,
            opacity: box ? 1 : 0,
          }}
        >
          {Scene && <Scene />}
        </div>
      </div>
    </div>
  );
}
