"use client";

import type { ReactNode } from "react";
import { BookOpen, Compass, FileSpreadsheet, FileText, Folder, Lock, Mail, MessageSquare, Wifi } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import type { ToolId } from "@/lib/story";

/**
 * What sits around each chapter's Juno window, so no two chapters look alike: the sources
 * Juno reads, the brand kit, the computer it works on, the phone the app ships to, the site
 * it publishes, the tools it connects, the calendar it keeps. All decorative.
 */

/** A small card that floats, tilted, at the window's edge. */
function Float({ className, rotate, children, delay = 0 }: { className: string; rotate: number; children: ReactNode; delay?: number }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute z-20 hidden xl:block ${className}`} style={{ rotate: `${rotate}deg` }}>
      <div className="cta-drift" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </div>
  );
}

const dark = "rounded-[16px] border border-white/[0.1] bg-[#0F1524] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]";

/* ------------------------------------------------------------------ 01 · the sources, around the window */

function Source({ tool, head, meta, text }: { tool: ToolId; head: string; meta: string; text: string }) {
  return (
    <div className={`w-[230px] p-3.5 ${dark}`}>
      <p className="flex items-center gap-2 text-[12px] text-muted">
        <BrandIcon id={tool} size={16} className="!shadow-none" />
        <span className="font-medium text-text/90">{head}</span>
        <span className="truncate text-subtle">{meta}</span>
      </p>
      <p className="mt-2 text-[13px] leading-[19px] text-text/85">{text}</p>
    </div>
  );
}

export function KnowledgeDecor() {
  return (
    <>
      <Float className="-left-[96px] top-[150px]" rotate={-4}>
        <Source tool="slack" head="#product-updates" meta="Leo" text="Shared reports is live. On every plan." />
      </Float>
      <Float className="-left-[70px] bottom-[70px]" rotate={3} delay={-2}>
        <Source tool="intercom" head="Intercom" meta="Maya, Cedar & Co." text="Can I share this report with my client?" />
      </Float>
      <Float className="-right-[84px] -top-[46px]" rotate={3} delay={-3.5}>
        <Source tool="linear" head="Linear" meta="Planned" text="Shareable report links" />
      </Float>
      <Float className="-bottom-[54px] -right-[90px]" rotate={-3} delay={-5}>
        <Source tool="drive" head="Drive" meta="Quarterly priorities.md" text="Make client reporting effortless." />
      </Float>
    </>
  );
}

/* ------------------------------------------------------------------ 02 · the brand kit, on the corner */

export function BrandDecor() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute -inset-24 -z-10" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,150,130,0.10), transparent 70%)" }} />
      <Float className="-bottom-[64px] -left-[84px]" rotate={-4}>
        <div className="w-[250px] overflow-hidden rounded-[16px] bg-[#F4F1EC] text-[#16181d] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 text-[11.5px] text-[#6b7080]">
            Brand kit
            <span className="rounded-full bg-[#E9F7EF] px-2 py-0.5 text-[10.5px] font-medium text-[#1f7a4d]">In use</span>
          </div>
          <div className="p-4">
            <div className="flex items-end justify-between">
              <span className="text-[52px] font-semibold leading-none tracking-[-0.05em]">Aa</span>
              <span className="pb-1 text-right text-[11px] leading-4 text-[#6b7080]">
                Clean.
                <br />
                Confident.
              </span>
            </div>
            <div className="mt-4 flex gap-1.5">
              {["#1B2440", "#5468B0", "#A6BBFF", "#F4F5F7"].map((c) => (
                <span key={c} className="h-8 flex-1 rounded-[6px] ring-1 ring-black/[0.06]" style={{ background: c }} />
              ))}
            </div>
            <p className="mt-3.5 text-[11px] text-[#8a909c]">Voice</p>
            <p className="text-[13px] font-medium">Clear. Warm. Useful.</p>
          </div>
        </div>
      </Float>
    </>
  );
}

/* ------------------------------------------------------------------ 03 · a desktop for its own computer */

const dock = [
  { I: Folder, bg: "linear-gradient(180deg,#6FB6FF,#2E7BEA)" },
  { I: Compass, bg: "linear-gradient(180deg,#FFFFFF,#E6E8EC)", dark: true },
  { I: FileSpreadsheet, bg: "linear-gradient(180deg,#38C27A,#1E8E55)" },
  { I: FileText, bg: "linear-gradient(180deg,#5B8CFF,#3256D8)" },
  { I: Mail, bg: "linear-gradient(180deg,#7DD3FC,#2563EB)" },
  { I: MessageSquare, bg: "linear-gradient(180deg,#A78BFA,#6D28D9)" },
];

/** A MacBook Pro: Juno's own computer, with its desktop, menu bar and dock, and the work on screen. */
export function MacBook({
  children,
  app = "Juno's computer",
  menu = ["File", "Edit", "View"],
  inner = "px-2 pb-2 pt-3 md:px-12 md:pb-[96px] md:pt-7",
  className = "max-w-[1200px]",
}: {
  children: ReactNode;
  /** the app named in the menu bar */
  app?: string;
  menu?: string[];
  /** padding around what's on screen */
  inner?: string;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto ${className}`}>
      {/* the lid: aluminium edge, black bezel, the notch */}
      <div className="rounded-[20px] bg-[linear-gradient(180deg,#4a4d55,#24262b_30%,#1a1b1f)] p-px shadow-[0_80px_140px_-50px_rgba(0,0,0,0.95)] md:rounded-[30px]">
        <div className="rounded-[19px] bg-[#060708] p-[6px] md:rounded-[29px] md:p-[14px] md:pb-[16px]">
          <div className="relative overflow-hidden rounded-[13px] md:rounded-[16px]">
            {/* the desktop */}
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_90%_at_20%_10%,#2B3C86_0%,transparent_60%),radial-gradient(60%_80%_at_85%_30%,#5B4AA8_0%,transparent_60%),radial-gradient(80%_80%_at_60%_110%,#B5758A_0%,transparent_60%),linear-gradient(180deg,#121A3A,#1A1F45)]" />
            <span aria-hidden className="absolute left-1/2 top-0 z-10 hidden h-[26px] w-[170px] -translate-x-1/2 rounded-b-[12px] bg-[#060708] md:block">
              <span className="absolute left-1/2 top-[9px] size-[7px] -translate-x-1/2 rounded-full bg-[#1b2030] ring-1 ring-[#2a3350]" />
            </span>
            {/* menu bar */}
            <div aria-hidden className="relative flex h-6 items-center gap-4 bg-black/25 px-4 text-[11.5px] text-white/85 backdrop-blur md:h-[26px]">
              <MascotMark size={13} />
              <span className="font-semibold">{app}</span>
              {menu.map((m) => (
                <span key={m} className="hidden text-white/60 sm:inline">
                  {m}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-3 text-white/70">
                <Wifi size={12} />
                <span className="hidden sm:inline">Fri 9:41 AM</span>
              </span>
            </div>
            {/* the work, on screen */}
            <div className={`relative ${inner}`}>{children}</div>
            {/* dock */}
            <div aria-hidden className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-end gap-2 rounded-[20px] border border-white/15 bg-white/10 px-2.5 py-2 backdrop-blur-xl md:flex">
              {dock.map(({ I, bg, dark: d }, i) => (
                <span key={i} className="grid size-12 place-items-center rounded-[12px] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.6)]" style={{ background: bg }}>
                  <I size={22} className={d ? "text-[#4285F4]" : "text-white"} strokeWidth={1.75} />
                </span>
              ))}
              <span className="mx-1 h-10 w-px self-center bg-white/20" />
              <span className="relative grid size-12 place-items-center rounded-[12px] bg-[#0F1524]">
                <MascotMark size={30} />
                <span className="absolute -bottom-1.5 size-1 rounded-full bg-white/80" />
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* the base, a touch wider than the lid, with the thumb notch */}
      <div aria-hidden className="relative -mx-[3%] h-3 rounded-b-[14px] rounded-t-[3px] bg-[linear-gradient(180deg,#6a6d75,#3a3c42_45%,#17181b)] shadow-[0_30px_40px_-20px_rgba(0,0,0,0.9)] md:h-[22px] md:rounded-b-[26px]">
        <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-[10px] bg-[#2a2c31] md:h-2" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 05 · the published journal, on the corner */

export function ContentDecor() {
  return (
    <Float className="-bottom-[70px] -left-[84px]" rotate={-3}>
      <div className="w-[290px] overflow-hidden rounded-[14px] bg-white text-[#16181d] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.9)]">
        <div className="flex h-8 items-center gap-2 border-b border-black/[0.06] bg-[#F3F4F6] px-3">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[7px] rounded-full bg-black/15" />
            ))}
          </span>
          <span className="mx-auto flex items-center gap-1 text-[10.5px] text-[#4a4f5c]">
            <Lock size={9} /> yourcompany.com / journal
          </span>
        </div>
        <div className="p-4">
          <p className="text-[12px] font-semibold">
            the journal. <span className="font-normal text-[#8a909c]">Updates. Guides. Ideas.</span>
          </p>
          <p className="mt-3 text-[10.5px] font-medium text-[#3b4fd8]">The product journal</p>
          <p className="mt-0.5 text-[21px] font-semibold leading-[23px] tracking-[-0.03em]">What&apos;s new. What&apos;s next.</p>
          <div className="mt-3 space-y-2">
            {[
              ["Meet Scheduled Reports.", "Product updates"],
              ["Share reports with your clients.", "Guides"],
            ].map(([t, c], i) => (
              <div key={t} className="flex items-center gap-2.5">
                <span className={`size-9 shrink-0 rounded-[7px] ${i ? "bg-[linear-gradient(135deg,#C3B6FF,#7A8FFF)]" : "bg-[linear-gradient(135deg,#1B2440,#5468B0)]"}`} />
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-medium">{t}</p>
                  <p className="text-[10px] text-[#8a909c]">{c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Float>
  );
}

/* ------------------------------------------------------------------ 07 · the calendar it keeps */

export function JobsDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-14 -inset-y-16 -z-10 hidden opacity-35 lg:block [mask-image:radial-gradient(72%_70%_at_50%_50%,#000_60%,transparent_100%)]">
      <div className="grid h-full grid-cols-7 gap-2.5">
        {Array.from({ length: 35 }, (_, i) => {
          const fri = i % 7 === 4;
          return (
            <div key={i} className={`relative rounded-[12px] border ${fri ? "border-[#7A8FFF]/20 bg-[#7A8FFF]/[0.05]" : "border-white/[0.04] bg-white/[0.012]"}`}>
              <span className={`absolute left-2.5 top-2 text-[11px] ${fri ? "text-[#A6BBFF]/60" : "text-white/10"}`}>{((i + 27) % 31) + 1}</span>
              {fri && (
                <span className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[10px] text-[#A6BBFF]/60">
                  <BookOpen size={10} /> 9:00
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
