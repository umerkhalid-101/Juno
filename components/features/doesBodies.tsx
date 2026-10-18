"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Bold,
  Calendar,
  Check,
  Circle,
  FileSpreadsheet,
  Globe,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  Loader2,
  Mic,
  MousePointer2,
  Plus,
  SignalHigh,
  Tag,
} from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import { Browser } from "@/components/computer/Browser";
import { Face } from "@/components/jobs/scenes";
import type { ToolId } from "@/lib/story";

/**
 * What the Juno window shows for each of chapter 2's features: real screens with real detail.
 * `on` plays the moment once and stays on, so scrolling back shows the finished state.
 */

const T =
  "transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-base)]";

/** A list of steps Juno takes, each ticking over in turn. */
function Steps({
  on,
  items,
  start = 200,
  gap = 420,
}: {
  on: boolean;
  items: string[];
  start?: number;
  gap?: number;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const ts = items.map((_, i) => window.setTimeout(() => setN(i + 1), start + (i + 1) * gap));
    return () => ts.forEach(window.clearTimeout);
  }, [on, items, start, gap]);
  return (
    <ul className="space-y-2">
      {items.map((s, i) => {
        const done = n > i;
        const busy = on && n === i;
        return (
          <li
            key={s}
            className={`flex items-center gap-2.5 text-[12.5px] transition-opacity duration-300 ${
              done || busy ? "text-text" : "text-subtle"
            }`}
          >
            <span className="grid size-4 shrink-0 place-items-center">
              {done ? (
                <span className="grid size-4 place-items-center rounded-full bg-[#3DD68C] text-[#06120c]">
                  <Check size={10} strokeWidth={3} aria-hidden />
                </span>
              ) : busy ? (
                <Loader2 size={13} className="animate-spin text-muted" aria-hidden />
              ) : (
                <span className="size-1.5 rounded-full bg-white/20" />
              )}
            </span>
            {s}
          </li>
        );
      })}
    </ul>
  );
}

/* 1. Connected Apps: the call request becomes a Linear issue. */
const appSteps = [
  "Read the call summary",
  "Matched it to Reporting",
  "Created the issue in Linear",
];
const stack: ToolId[] = ["slack", "linear", "hubspot", "notion", "jira"];

function Prop({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-[5px] text-[12.5px]">
      <span className="w-[68px] shrink-0 text-[#8a909c]">{k}</span>
      <span className="flex min-w-0 items-center gap-1.5 text-[#16181d]">{children}</span>
    </div>
  );
}

export function AppsBody({ on }: { on: boolean }) {
  const [made, setMade] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = window.setTimeout(() => setMade(true), 1400);
    return () => window.clearTimeout(t);
  }, [on]);
  return (
    <div className="grid h-full gap-4 p-4 sm:grid-cols-[0.8fr_1.2fr] md:p-5">
      <div className="flex flex-col gap-4">
        <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-3.5">
          <span className="flex items-center gap-2 text-[12px] text-muted">
            <Mic size={13} strokeWidth={1.75} className="text-[#A6BBFF]" aria-hidden />
            Northwind weekly sync
          </span>
          <p className="mt-2 text-[13.5px] leading-5 text-text">
            &ldquo;Can we share reports with clients?&rdquo;
          </p>
          <span className="mt-2 flex items-center gap-1.5 text-[11.5px] text-subtle">
            <Face who="maya" size={16} className="!ring-0" />
            Maya Chen · 10:14
          </span>
        </div>
        <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-3.5">
          <span className="mb-3 flex items-center gap-2 text-[12px] text-muted">
            <MascotMark size={16} />
            Juno
          </span>
          <Steps on={on} items={appSteps} />
        </div>
        <div className="mt-auto hidden items-center gap-1.5 sm:flex">
          {stack.map((id) => (
            <BrandIcon key={id} id={id} size={24} />
          ))}
          <span className="ml-1 text-[11.5px] text-subtle">Connected</span>
        </div>
      </div>

      {/* the issue, in Linear */}
      <div
        className={`flex flex-col overflow-hidden rounded-[14px] bg-white text-[#16181d] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] ${T} ${
          made ? "" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-2.5 text-[12px] text-[#6b7080]">
          <BrandIcon id="linear" size={18} className="!shadow-none" />
          Reporting
          <span className="text-[#c4c7ce]">/</span>
          CLI-214
          <span className="ml-auto inline-flex h-5 items-center gap-1 rounded-full bg-[#E9F7EF] px-2 text-[11px] font-medium text-[#1f7a4d]">
            <Check size={10} strokeWidth={3} aria-hidden />
            Created
          </span>
        </div>
        <div className="flex-1 px-4 py-3.5">
          <p className="text-[17px] font-semibold tracking-[-0.01em]">Client report sharing</p>
          <p className="mt-1.5 text-[12.5px] leading-[19px] text-[#4a4f5c]">
            Customers want to share scheduled reports with their own clients. Requested by Maya Chen
            at Northwind on today&apos;s call.
          </p>
          <div className="mt-3 border-t border-black/[0.06] pt-2">
            <Prop k="Status">
              <Circle size={12} strokeWidth={2.5} className="text-[#8a909c]" aria-hidden />
              Todo
            </Prop>
            <Prop k="Priority">
              <SignalHigh size={13} className="text-[#e5484d]" aria-hidden />
              High
            </Prop>
            <Prop k="Assignee">
              <Face who="sam" size={16} className="!ring-0" />
              Sam Lee
            </Prop>
            <Prop k="Labels">
              <span className="inline-flex h-5 items-center gap-1 rounded-full bg-[#F1F0FF] px-2 text-[11px] text-[#5442c9]">
                <span className="size-1.5 rounded-full bg-[#7c6cf0]" />
                Customer request
              </span>
            </Prop>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-black/[0.06] bg-[#FAFAFB] px-4 py-2.5 text-[11.5px] text-[#6b7080]">
          <MascotMark size={14} />
          Juno created this from the Northwind call · just now
        </div>
      </div>
    </div>
  );
}

/* 2. Files & Spreadsheets: two messy exports, one clean file, straightened column by column. */
const cols = ["Name", "Company", "Plan", "Seats", "Status"];
const clean = [
  ["Maya Chen", "Northwind", "Team", "12", "Active"],
  ["Sam Lee", "Brightline", "Business", "40", "Active"],
  ["Alex Kim", "Fieldnote", "Team", "8", "Active"],
  ["Priya Shah", "Orbit", "Business", "25", "Trial"],
  ["Dana Ruiz", "Lumen", "Team", "5", "Active"],
];
const messy = [
  ["maya chen", "NORTHWIND inc.", "team ", "12 seats", "active"],
  [" Sam Lee", "brightline", "BUSINESS", "forty", "Active "],
  ["ALEX KIM", "Fieldnote ", "tm", "8", "actv"],
  ["priya s.", "orbit", "business", " 25", "TRIAL"],
  ["Dana  Ruiz", "lumen co", "Team", "5.0", "active"],
];
const skew = [-8, 6, -4, 9, -6];

export function FilesBody({ on }: { on: boolean }) {
  const [c, setC] = useState(0);
  useEffect(() => {
    if (!on) return;
    const ts = [1, 2, 3, 4, 5].map((k) => window.setTimeout(() => setC(k), 300 + k * 320));
    return () => ts.forEach(window.clearTimeout);
  }, [on]);
  const done = c >= 5;
  return (
    <div className="flex h-full flex-col gap-3 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        {[
          ["Customers.csv", "214 rows"],
          ["Export.csv", "188 rows"],
        ].map(([n, r]) => (
          <span
            key={n}
            className="inline-flex h-8 items-center gap-2 rounded-full bg-white/[0.05] px-3 text-muted"
          >
            <FileSpreadsheet size={13} strokeWidth={1.75} aria-hidden />
            <span className="text-text">{n}</span>
            {r}
          </span>
        ))}
        <span
          className={`ml-auto text-[12px] transition-colors duration-300 ${done ? "text-[#5BE3A2]" : "text-subtle"}`}
        >
          {done ? "3 duplicates removed · 31 cells fixed" : "Cleaning"}
        </span>
      </div>

      {/* the sheet */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2 border-b border-black/[0.07] px-3 py-2 text-[12px]">
          <span className="grid size-5 place-items-center rounded-[5px] bg-[#1f8a4c] text-white">
            <FileSpreadsheet size={12} aria-hidden />
          </span>
          <span className="font-medium">Customers, cleaned.xlsx</span>
          <span
            className={`ml-auto text-[11px] transition-opacity ${done ? "text-[#2f9e6a] opacity-100" : "opacity-0"}`}
          >
            Saved
          </span>
        </div>
        <div className="flex items-center gap-2 border-b border-black/[0.07] bg-[#FAFAFB] px-3 py-1.5 text-[11.5px] text-[#6b7080]">
          <span className="italic text-[#8a909c]">fx</span>
          <span className="text-[#16181d]">{done ? "=PROPER(TRIM(A2))" : "maya chen"}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden text-[12px]">
          <div className="grid grid-cols-[28px_repeat(3,minmax(0,1fr))] sm:grid-cols-[28px_repeat(5,minmax(0,1fr))] border-b border-black/[0.07] bg-[#F3F4F6] text-[11px] text-[#8a909c]">
            <span />
            {"ABCDE".split("").map((l, k) => (
              <span key={l} className={`border-l border-black/[0.06] px-2 py-1 ${k > 2 ? "max-sm:hidden" : ""}`}>
                {l}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[28px_repeat(3,minmax(0,1fr))] sm:grid-cols-[28px_repeat(5,minmax(0,1fr))] border-b border-black/[0.07] font-medium">
            <span className="bg-[#F3F4F6] py-1.5 text-center text-[11px] text-[#8a909c]">1</span>
            {cols.map((h, k) => (
              <span key={h} className={`truncate border-l border-black/[0.06] px-2 py-1.5 ${k > 2 ? "max-sm:hidden" : ""}`}>
                {h}
              </span>
            ))}
          </div>
          {clean.map((row, r) => (
            <div
              key={r}
              className="grid grid-cols-[28px_repeat(3,minmax(0,1fr))] sm:grid-cols-[28px_repeat(5,minmax(0,1fr))] border-b border-black/[0.05]"
            >
              <span className="bg-[#F3F4F6] py-1.5 text-center text-[11px] text-[#8a909c]">
                {r + 2}
              </span>
              {row.map((cell, k) => {
                const fixed = k < c;
                return (
                  <span
                    key={k}
                    className={`truncate border-l border-black/[0.06] px-2 py-1.5 transition-[transform,background-color] duration-500 ${
                      fixed ? "" : "bg-[#FFF6EC] text-[#9a4b2f]"
                    } ${k > 2 ? "max-sm:hidden" : ""}`}
                    style={{ transform: fixed ? "none" : `translateX(${skew[(r + k) % 5]}px)` }}
                  >
                    {fixed ? cell : messy[r][k]}
                    {k === 4 && fixed && (
                      <span
                        className={`ml-1.5 inline-block size-1.5 -translate-y-px rounded-full ${
                          cell === "Trial" ? "bg-[#e5a23a]" : "bg-[#2f9e6a]"
                        }`}
                      />
                    )}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 3. Automations: a job on a rhythm, Friday snaps on, and the briefing it sends back. */
const sites = ["orbit.io", "northstar.app", "fieldnote.co"];
export function AutomationsBody({ on }: { on: boolean }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="grid h-full gap-4 p-4 sm:grid-cols-[1fr_1fr] md:p-5">
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[18px] font-medium tracking-[-0.02em] text-text">Competitor watch</p>
            <p className="mt-0.5 text-[12px] text-muted">Every Fri · 9:00 AM</p>
          </div>
          <span
            className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11.5px] font-medium transition-colors delay-[900ms] duration-300 ${
              on ? "bg-[#3DD68C]/12 text-[#5BE3A2]" : "bg-white/[0.06] text-muted"
            }`}
          >
            <span className={`size-1.5 rounded-full ${on ? "bg-[#5BE3A2]" : "bg-muted"}`} />
            {on ? "Active" : "Draft"}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <span
              key={i}
              className={`grid h-9 place-items-center rounded-[8px] text-[12px] transition-[background-color,color,transform] duration-150 ${
                i === 4 && on
                  ? "scale-105 bg-[#8FDCCB] font-medium text-[#08201b]"
                  : "bg-white/[0.04] text-muted"
              }`}
              style={{ transitionDelay: i === 4 && on ? "500ms" : "0ms" }}
            >
              {d}
            </span>
          ))}
        </div>
        <dl className="mt-4 divide-y divide-white/[0.06] text-[12.5px]">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-subtle">Watches</dt>
            <dd className="flex items-center gap-1.5">
              <span className="grid size-5 place-items-center rounded-[6px] bg-white/[0.06] text-muted ring-1 ring-white/[0.08]">
                <Globe size={11} strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-text">{sites[0]}</span>
              <span className="text-subtle">+{sites.length - 1}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-subtle">Sends to</dt>
            <dd className="flex items-center gap-1.5 text-text">
              <BrandIcon id="slack" size={18} />
              #leadership
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-subtle">Next run</dt>
            <dd className="flex items-center gap-1.5 text-text">
              <Calendar size={12} className="text-muted" aria-hidden />
              Fri, 9:00 AM
            </dd>
          </div>
        </dl>
        <p className="mt-auto flex items-center gap-2 pt-3 text-[13px] text-text">
          <MascotMark size={18} />
          On it. Every week.
        </p>
      </div>

      {/* what comes back */}
      <div
        className={`flex flex-col rounded-[14px] border border-white/[0.07] bg-white/[0.02] p-4 ${T} delay-[1100ms] ${
          on ? "" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="flex items-center gap-2 text-[12px] text-muted">
          <Globe size={13} strokeWidth={1.75} aria-hidden />
          Last Friday
        </span>
        <p className="mt-2 text-[15px] font-medium text-text">Your weekly briefing</p>
        <p className="text-[12.5px] text-muted">What changed. What to do next.</p>
        <ul className="mt-3 space-y-2 text-[12.5px] leading-[18px] text-text/85">
          {[
            ["O", "#5b6cff", "Orbit cut its Team plan to $12 a seat."],
            ["N", "#e5484d", "Northstar shipped client portals."],
            ["F", "#2f9e6a", "Fieldnote is hiring four sales roles."],
          ].map(([l, c, t]) => (
            <li key={t} className="flex gap-2.5">
              <span
                className="mt-px grid size-4 shrink-0 place-items-center rounded-[4px] text-[9px] font-semibold text-white"
                style={{ background: c }}
              >
                {l}
              </span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-[10px] bg-[#8FDCCB]/[0.08] p-2.5 text-[12px] text-[#A8E8DA]">
          Next: review our Team pricing before Monday.
        </div>
      </div>
    </div>
  );
}

/* 4. Computer & Browser: Juno, on its own computer, drafts the post in your CMS. */
const TITLE = "Scheduled Reports are here.";
const BODY = [
  "Every Monday at 9, your team gets its weekly report on its own. No exports, no copy and paste.",
  "Pick the metrics once, choose who gets it, and it arrives every week.",
];
// where Juno's cursor goes, as a share of the editor area
const marks = {
  newBtn: { x: 90, y: 6 },
  cover: { x: 40, y: 24 },
  title: { x: 30, y: 49 },
  schedule: { x: 88, y: 30 },
  rest: { x: 70, y: 82 },
};

/** The launch cover Juno drops in: on brand, not a stock photo. */
function Cover() {
  const bars = [28, 40, 34, 52, 46, 64, 58, 76];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#1B2340,#2A2F5C)]">
      <div
        className="absolute inset-y-0 right-[6%] flex items-end gap-[3%] pb-[8%]"
        style={{ width: "40%" }}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-[3px]"
            style={{
              height: `${h}%`,
              background: i === bars.length - 1 ? "#A6BBFF" : "rgba(166,187,255,0.22)",
            }}
          />
        ))}
      </div>
      <div className="absolute left-[5%] top-1/2 -translate-y-1/2">
        <span className="text-[10px] font-medium text-[#A6BBFF]">New</span>
        <p className="font-[family-name:var(--font-mock-serif)] text-[clamp(18px,2.4cqw,30px)] leading-none text-[#F4EEE3]">
          Scheduled Reports
        </p>
      </div>
    </div>
  );
}

export function ComputerBody({ on }: { on: boolean }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = window.setTimeout(() => setT(12), 0);
      return () => window.clearTimeout(r);
    }
    const t0 = performance.now();
    const iv = window.setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      setT(s);
      if (s > 9) window.clearInterval(iv);
    }, 80);
    return () => window.clearInterval(iv);
  }, [on]);

  const editor = t >= 1.3;
  const cover = t >= 2.6;
  const typedN = Math.max(0, Math.min(TITLE.length, Math.floor((t - 3.4) * 26)));
  const body = t >= 4.8;
  const scheduled = t >= 6.2;
  const saved = t >= 6.8;
  const at =
    t < 1
      ? marks.newBtn
      : t < 2.2
        ? marks.cover
        : t < 5.6
          ? marks.title
          : t < 7.4
            ? marks.schedule
            : marks.rest;
  const pressed = (t > 1.05 && t < 1.25) || (t > 2.35 && t < 2.55) || (t > 6.05 && t < 6.25);

  return (
    <div className="relative h-full p-3 md:p-4">
      <Browser
        chrome={{
          tabs: [
            { title: "Blog · Your Company", icon: <Globe size={13} aria-hidden />, active: true },
            { title: "Analytics", icon: <SignalHigh size={13} aria-hidden />, active: false },
          ],
          url: "yourcompany.com / blog",
          typing: false,
          loading: false,
          session: false,
        }}
      >
        <div className="flex h-full bg-[#FAFAFB]">
          <aside className="hidden w-[150px] shrink-0 border-r border-black/[0.06] p-4 text-[12.5px] text-[#5d6370] lg:block">
            <p className="flex items-center gap-2 font-semibold text-[#16181d]">
              <span className="grid size-5 place-items-center rounded-[6px] bg-[#1F2A44] text-[10px] text-[#A6BBFF]">
                Y
              </span>
              Your Company
            </p>
            <ul className="mt-5 space-y-1">
              {["Blog", "Pages", "Media", "Settings"].map((n) => (
                <li
                  key={n}
                  className={`rounded-[7px] px-2 py-1.5 ${n === "Blog" ? "bg-black/[0.05] text-[#16181d]" : ""}`}
                >
                  {n}
                </li>
              ))}
            </ul>
          </aside>
          <div className="relative flex min-w-0 flex-1 [container-type:size]">
            <div className="min-w-0 flex-1 overflow-hidden p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#16181d]">
                  {editor ? "New article" : "Blog posts"}
                </span>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#16181d] px-3 text-[12.5px] font-medium text-white">
                  <Plus size={13} aria-hidden />
                  New article
                </span>
              </div>
              {!editor ? (
                <ul className="mt-4 space-y-2 text-[13px]">
                  {[
                    ["Reports, on repeat.", "Published"],
                    ["Better customer feedback", "Published"],
                    ["Our spring roadmap", "Draft"],
                  ].map(([p, s]) => (
                    <li
                      key={p}
                      className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2.5 ring-1 ring-black/[0.05]"
                    >
                      {p}
                      <span className="text-[11.5px] text-[#8a909c]">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="page-in mt-3">
                  {/* formatting bar */}
                  <div className="flex items-center gap-3 border-b border-black/[0.06] pb-2 text-[#8a909c]">
                    {[Bold, Italic, Heading2, List, Link2, ImageIcon].map((I, i) => (
                      <I key={i} size={14} aria-hidden />
                    ))}
                  </div>
                  {/* the cover drops in */}
                  <div
                    className={`relative mt-3 h-[26cqh] min-h-[80px] overflow-hidden rounded-[10px] ${
                      cover
                        ? ""
                        : "grid place-items-center border-2 border-dashed border-black/10 bg-white"
                    }`}
                  >
                    {cover ? (
                      <div className="page-in absolute inset-0">
                        <Cover />
                      </div>
                    ) : (
                      <span className="flex items-center gap-2 text-[12px] text-[#8a909c]">
                        <ImageIcon size={14} aria-hidden />
                        Drop a cover image
                      </span>
                    )}
                  </div>
                  <p className="mt-4 min-h-[30px] text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[#16181d] md:text-[24px]">
                    {TITLE.slice(0, typedN)}
                    {typedN > 0 && typedN < TITLE.length && (
                      <span className="caret ml-px inline-block h-[20px] w-px translate-y-[3px] bg-[#16181d]" />
                    )}
                    {typedN === 0 && <span className="text-[#c4c7ce]">Title</span>}
                  </p>
                  <div
                    className={`mt-2 space-y-2 text-[13px] leading-[20px] text-[#4a4f5c] ${T} ${body ? "" : "opacity-0"}`}
                  >
                    {BODY.map((b) => (
                      <p key={b}>{b}</p>
                    ))}
                    <p className="pt-2 text-[15px] font-semibold text-[#16181d]">How it works</p>
                    <ol className="list-decimal space-y-1 pl-5">
                      <li>Pick the metrics your team cares about.</li>
                      <li>Choose who gets it, and when.</li>
                      <li>It lands every Monday at 9, ready to read.</li>
                    </ol>
                    <blockquote className="border-l-2 border-[#7A8FFF] pl-3 text-[#16181d]">
                      &ldquo;Our Monday standup finally starts with the numbers.&rdquo;
                      <span className="mt-0.5 block text-[12px] text-[#8a909c]">
                        Maya Chen, Northwind
                      </span>
                    </blockquote>
                  </div>
                </div>
              )}
            </div>

            {/* post settings */}
            {editor && (
              <aside className="page-in hidden w-[200px] shrink-0 border-l border-black/[0.06] bg-white p-4 text-[12px] md:block">
                <p className="font-medium text-[#16181d]">Post settings</p>
                <dl className="mt-3 space-y-3">
                  <div>
                    <dt className="text-[#8a909c]">Status</dt>
                    <dd className="mt-1 flex items-center gap-2">
                      Draft
                      <span
                        className={`inline-flex h-5 items-center gap-1 rounded-full bg-[#E9F7EF] px-2 text-[10.5px] font-medium text-[#1f7a4d] transition-[opacity,transform] duration-150 ${
                          saved ? "scale-100 opacity-100" : "scale-90 opacity-0"
                        }`}
                      >
                        <Check size={10} strokeWidth={3} aria-hidden />
                        Draft saved
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8a909c]">Publish</dt>
                    <dd
                      className={`mt-1 inline-flex h-7 items-center gap-1.5 rounded-[7px] px-2 transition-colors ${
                        scheduled ? "bg-[#EEF1FF] text-[#3346c9]" : "bg-[#F3F4F6] text-[#8a909c]"
                      }`}
                    >
                      <Calendar size={12} aria-hidden />
                      {scheduled ? "Mon 9:00" : "Not scheduled"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8a909c]">Author</dt>
                    <dd className="mt-1 flex items-center gap-1.5 text-[#16181d]">
                      <Face who="leo" size={18} className="!ring-0" />
                      You
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8a909c]">Tags</dt>
                    <dd className="mt-1 flex flex-wrap gap-1">
                      {["Product", "Launch"].map((g) => (
                        <span
                          key={g}
                          className="inline-flex h-5 items-center gap-1 rounded-full bg-[#F3F4F6] px-2 text-[10.5px] text-[#4a4f5c]"
                        >
                          <Tag size={9} aria-hidden />
                          {g}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#8a909c]">URL</dt>
                    <dd className="mt-1 truncate text-[#16181d]">/blog/scheduled-reports</dd>
                  </div>
                </dl>
              </aside>
            )}

            {/* Juno's cursor */}
            {on && (
              <div
                className="pointer-events-none absolute left-0 top-0 z-10 transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(0.45,0,0.2,1)]"
                // once the draft is saved, Juno steps away from the work
                style={{ transform: `translate(${at.x}cqw, ${at.y}cqh)`, opacity: t > 7.6 ? 0 : 1 }}
              >
                <MousePointer2
                  size={22}
                  strokeWidth={1.5}
                  className={`fill-[#5b74ff] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)] transition-transform duration-100 ${pressed ? "scale-90" : ""}`}
                />
                <span className="absolute left-4 top-5 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1b2134] py-0.5 pl-0.5 pr-2.5 text-[12px] font-medium text-white shadow-lg ring-1 ring-white/10">
                  <MascotMark size={18} />
                  Juno
                </span>
              </div>
            )}
          </div>
        </div>
      </Browser>
    </div>
  );
}
