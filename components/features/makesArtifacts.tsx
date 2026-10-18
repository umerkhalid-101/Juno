"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LayoutGroup, motion } from "motion/react";
import {
  Calendar,
  Check,
  FileText,
  Filter,
  Globe,
  Image as ImageIcon,
  Lock,
  Pause,
  Play,
  Plus,
  Search,
  Share2,
  ShoppingBag,
  Video,
} from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { MascotMark } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";
import { IMG } from "@/lib/images";

/**
 * Chapter 3's artifacts: real things Juno made, shown the way you'd see them. Each plays its
 * moment once when its card arrives (`on`), then rests finished.
 */

const P = {
  ceramics: IMG.ceramicsHero,
  shelf: IMG.vaseStone,
  amber: IMG.lampDome,
  field: IMG.vaseSand,
};
const T =
  "transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-base)]";

function useAfter(on: boolean, ms: number) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = window.setTimeout(() => setV(true), ms);
    return () => window.clearTimeout(t);
  }, [on, ms]);
  return v;
}

/** A light browser frame: traffic lights, the address, and whatever sits on the right. */
function Chrome({ url, right, children }: { url: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-white text-[#16181d] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-black/10">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-black/[0.06] bg-[#F3F3F1] px-3.5">
        <span className="flex gap-[6px]" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#FF5F57]" />
          <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="size-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="flex h-6 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[7px] bg-white px-2 text-[11.5px] text-[#4a4740]">
          <Lock size={10} aria-hidden />
          <span className="truncate">{url}</span>
        </span>
        {right}
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* 1. App Builder: a launch room, built on your data and shared with the team. */
function Task({
  id,
  title,
  who,
  due,
  tag,
}: {
  id: string;
  title: string;
  who: "sam" | "maya" | "leo";
  due: string;
  tag: string;
}) {
  return (
    <motion.div
      layoutId={id}
      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      className="rounded-[10px] bg-white p-2.5 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]"
    >
      <p className="text-[12.5px] font-medium">{title}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-[5px] bg-[#F1F0FF] px-1.5 py-0.5 text-[10px] text-[#5442c9]">
          {tag}
        </span>
        <span className="flex items-center gap-1.5 text-[10.5px] text-[#8a909c]">
          {due}
          <Face who={who} size={16} className="!ring-0" />
        </span>
      </div>
    </motion.div>
  );
}

export function AppArtifact({ on }: { on: boolean }) {
  const moved = useAfter(on, 1100);
  const pct = moved ? 72 : 58;
  return (
    <Chrome
      url="launch-room.yourcompany.app"
      right={
        <span className="hidden items-center gap-1 rounded-[6px] bg-[#16181d] px-2 py-1 text-[10.5px] font-medium text-white sm:flex">
          <Share2 size={10} aria-hidden />
          Share
        </span>
      }
    >
      <div className="flex h-full bg-[#F7F7F5]">
        <aside className="hidden w-[150px] shrink-0 flex-col border-r border-black/[0.06] p-3 text-[12px] text-[#5d6370] lg:flex">
          <span className="flex items-center gap-2 font-semibold text-[#16181d]">
            <span className="grid size-5 place-items-center rounded-[6px] bg-[#5442c9] text-[10px] text-white">
              L
            </span>
            Launch room
          </span>
          <ul className="mt-4 space-y-0.5">
            {["Board", "Timeline", "Assets", "Customers"].map((n) => (
              <li
                key={n}
                className={`rounded-[6px] px-2 py-1.5 ${n === "Board" ? "bg-black/[0.05] text-[#16181d]" : ""}`}
              >
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-auto text-[10.5px] text-[#8a909c]">Data from</p>
          <span className="mt-1.5 flex gap-1">
            <BrandIcon id="linear" size={18} />
            <BrandIcon id="hubspot" size={18} />
            <BrandIcon id="notion" size={18} />
          </span>
        </aside>
        <div className="min-w-0 flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="flex items-center gap-1.5 text-[11px] text-[#8a909c]">
                Scheduled Reports
                <span className="rounded-full bg-[#EDEBFF] px-1.5 py-px text-[10px] font-medium text-[#5442c9]">
                  Team
                </span>
              </span>
              <p className="mt-0.5 text-[20px] font-semibold tracking-[-0.02em]">
                Let&apos;s ship this.
              </p>
            </div>
            <span className="flex -space-x-1.5">
              <Face who="maya" size={22} />
              <Face who="sam" size={22} />
              <Face who="leo" size={22} />
            </span>
          </div>
          {/* readiness */}
          <div className="mt-3 flex items-center gap-3 text-[11px] text-[#6b7080]">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
              <span
                className="block h-full origin-left rounded-full bg-[#5442c9] transition-transform duration-700"
                style={{ transform: `scaleX(${pct / 100})` }}
              />
            </span>
            <span className="tabular-nums">{pct}% ready</span>
            <span className="flex items-center gap-1">
              <Calendar size={11} aria-hidden />
              Mon 9:00
            </span>
          </div>
          <LayoutGroup>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-[12px] bg-black/[0.035] p-2">
                <span className="flex items-center justify-between px-1 text-[10.5px] font-medium text-[#8a909c]">
                  In progress <span>{moved ? 1 : 2}</span>
                </span>
                <div className="mt-2 space-y-1.5">
                  <Task id="email" title="Launch email" who="sam" due="Fri" tag="Email" />
                  {!moved && (
                    <Task id="help" title="Help article" who="maya" due="Thu" tag="Docs" />
                  )}
                </div>
              </div>
              <div className="rounded-[12px] bg-black/[0.035] p-2">
                <span className="flex items-center justify-between px-1 text-[10.5px] font-medium text-[#8a909c]">
                  Ready <span>{moved ? 2 : 1}</span>
                </span>
                <div className="mt-2 space-y-1.5">
                  <Task id="preview" title="Product preview" who="leo" due="Done" tag="Web" />
                  {moved && (
                    <Task id="help" title="Help article" who="maya" due="Done" tag="Docs" />
                  )}
                </div>
              </div>
            </div>
          </LayoutGroup>
        </div>
      </div>
    </Chrome>
  );
}

/* 2. Website Builder: a real storefront, in your brand, published on your domain. */
const products = [
  {
    n: "Stoneware vase",
    m: "Bone · 3 sizes",
    p: "$48",
    src: P.shelf,
    dots: ["#E8E1D4", "#3B3631"],
  },
  { n: "Sand vase", m: "Raw clay", p: "$36", src: P.field, dots: ["#C9A27A", "#9C7F5E"] },
  { n: "Dome lamp", m: "Opal glass", p: "$84", src: P.amber, dots: ["#F1EEE8"] },
];

export function SiteArtifact({ on }: { on: boolean }) {
  const live = useAfter(on, 1700);
  const blk = (i: number) => ({
    className: `${T} ${on ? "" : "translate-y-3 opacity-0"}`,
    style: { transitionDelay: on ? `${i * 140}ms` : "0ms" },
  });
  return (
    <Chrome
      url="everydayobjects.com"
      right={
        <span
          className={`inline-flex h-6 items-center gap-1.5 rounded-full bg-[#E9F7EF] px-2 text-[10.5px] font-medium text-[#1f7a4d] transition-[opacity,transform] duration-200 ${
            live ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          <span className="size-1.5 rounded-full bg-[#2f9e6a]" />
          Live
        </span>
      }
    >
      <div className="h-full overflow-hidden bg-[#FBF9F5] text-[#1d1b17]">
        {/* announcement */}
        <div {...blk(0)}>
          <p className="bg-[#1d1b17] py-1.5 text-center text-[10px] tracking-[0.02em] text-[#EDE6DA]">
            The spring collection is here · Free shipping over $80
          </p>
        </div>
        {/* nav */}
        <div {...blk(0)}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.06] px-5 py-2.5 text-[11px] text-[#5e584e]">
            <span className="flex gap-4">
              <span className="text-[#1d1b17]">Shop</span>
              <span className="hidden sm:inline">Spring</span>
              <span className="hidden sm:inline">Journal</span>
            </span>
            <span className="whitespace-nowrap font-[family-name:var(--font-mock-serif)] text-[16px] leading-none text-[#1d1b17] sm:text-[19px]">
              everyday objects
            </span>
            <span className="flex items-center justify-end gap-3">
              <Search size={12} aria-hidden />
              <span className="flex items-center gap-1">
                <ShoppingBag size={12} aria-hidden />2
              </span>
            </span>
          </div>
        </div>
        {/* hero: the photograph carries it */}
        <div
          {...blk(1)}
          className={`${blk(1).className} relative mx-3 mt-3 h-[178px] overflow-hidden rounded-[10px]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={P.ceramics}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,27,23,0.62),rgba(29,27,23,0.15)_55%,transparent)]" />
          <div className="absolute inset-y-0 left-5 flex flex-col justify-center text-[#FBF9F5]">
            <span className="text-[9.5px] font-medium tracking-[0.16em] text-[#EBD9B8]">
              SPRING COLLECTION
            </span>
            <p className="mt-1.5 font-[family-name:var(--font-mock-serif)] text-[32px] leading-[0.95]">
              Made for
              <br />
              everyday.
            </p>
            <p className="mt-1.5 max-w-[24ch] text-[10.5px] leading-[15px] text-[#FBF9F5]/80">
              Stoneware, linen and oak, made in small batches.
            </p>
            <span className="mt-2.5 flex items-center gap-3 text-[10.5px]">
              <span className="rounded-full bg-[#FBF9F5] px-3 py-1.5 font-medium text-[#1d1b17]">
                Find your favorite
              </span>
              <span className="underline decoration-white/40 underline-offset-2">Our story</span>
            </span>
          </div>
        </div>
        {/* the collection */}
        <div {...blk(2)} className={`${blk(2).className} px-3 pt-3`}>
          <div className="flex items-baseline justify-between px-0.5">
            <p className="font-[family-name:var(--font-mock-serif)] text-[17px]">New this season</p>
            <span className="text-[10.5px] text-[#6d685e] underline underline-offset-2">
              Shop all
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {products.map((x, i) => (
              <div key={x.n}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-[#EFE9DF]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-[#FBF9F5] px-1.5 py-0.5 text-[8.5px] font-medium">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1.5 flex justify-between text-[10.5px] font-medium">
                  {x.n}
                  <span className="font-normal">{x.p}</span>
                </p>
                <p className="mt-0.5 flex items-center justify-between text-[9.5px] text-[#8a8376]">
                  {x.m}
                  <span className="flex gap-0.5">
                    {x.dots.map((d) => (
                      <span
                        key={d}
                        className="size-2 rounded-full ring-1 ring-black/10"
                        style={{ background: d }}
                      />
                    ))}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* published, tucked into the top corner of the page */}
      <span
        className={`absolute right-6 top-[108px] inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] bg-[#16181d] py-1.5 pl-1.5 pr-3 text-[11px] text-white shadow-lg ${T} ${
          live ? "" : "-translate-y-2 opacity-0"
        }`}
      >
        <MascotMark size={18} />
        Published to everydayobjects.com
      </span>
    </Chrome>
  );
}

/* 3. Built-in CMS: the blog collection, and the reports post goes live. */
export function CmsArtifact({ on }: { on: boolean }) {
  const pub = useAfter(on, 1000);
  const rows = [
    {
      t: "Scheduled Reports are here",
      s: pub ? "Published" : "Draft",
      who: "leo" as const,
      d: pub ? "Just now" : "Today",
    },
    { t: "Reports, on repeat.", s: "Published", who: "maya" as const, d: "Mar 3" },
    { t: "Better customer feedback", s: "Published", who: "sam" as const, d: "Mar 1" },
    { t: "Our spring roadmap", s: "Scheduled", who: "leo" as const, d: "Mon 9:00" },
  ];
  const tone = (s: string) =>
    s === "Published"
      ? "bg-[#E9F7EF] text-[#1f7a4d]"
      : s === "Scheduled"
        ? "bg-[#EEF1FF] text-[#3346c9]"
        : "bg-[#F3F4F6] text-[#6b7080]";
  return (
    <Chrome url="yourcompany.com / admin / blog">
      <div className="flex h-full bg-white">
        <aside className="hidden w-[150px] shrink-0 border-r border-black/[0.06] bg-[#FAFAFB] p-3 text-[12px] text-[#5d6370] lg:block">
          <p className="px-2 text-[10.5px] font-medium text-[#8a909c]">Collections</p>
          <ul className="mt-2 space-y-0.5">
            {[
              ["Blog posts", "12"],
              ["Changelog", "8"],
              ["Case studies", "4"],
              ["Pages", "6"],
            ].map(([n, c]) => (
              <li
                key={n}
                className={`flex justify-between rounded-[6px] px-2 py-1.5 ${n === "Blog posts" ? "bg-black/[0.05] text-[#16181d]" : ""}`}
              >
                {n}
                <span className="text-[#8a909c]">{c}</span>
              </li>
            ))}
          </ul>
        </aside>
        <div className="relative min-w-0 flex-1 p-4">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold">Blog posts</p>
            <span className="ml-auto hidden h-7 items-center gap-1.5 rounded-[7px] bg-[#F3F4F6] px-2 text-[11px] text-[#8a909c] sm:flex">
              <Search size={11} aria-hidden />
              Search
            </span>
            <span className="grid size-7 place-items-center rounded-[7px] bg-[#F3F4F6] text-[#6b7080]">
              <Filter size={12} aria-hidden />
            </span>
            <span className="inline-flex h-7 items-center gap-1 rounded-[7px] bg-[#16181d] px-2.5 text-[11px] font-medium text-white">
              <Plus size={11} aria-hidden />
              New post
            </span>
          </div>
          <div className="mt-3 overflow-hidden rounded-[10px] ring-1 ring-black/[0.07]">
            <div className="grid grid-cols-[1fr_96px] gap-3 bg-[#FAFAFB] px-3 py-2 text-[10.5px] font-medium text-[#8a909c] sm:grid-cols-[1fr_96px_60px_80px]">
              <span>Title</span>
              <span>Status</span>
              <span className="hidden sm:block">Author</span>
              <span className="hidden sm:block">Updated</span>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.t}
                className={`grid grid-cols-[1fr_96px] items-center gap-3 border-t border-black/[0.05] px-3 py-2.5 text-[12px] transition-colors duration-500 sm:grid-cols-[1fr_96px_60px_80px] ${
                  i === 0 && pub ? "bg-[#F6FBF8]" : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FileText size={12} className="shrink-0 text-[#8a909c]" aria-hidden />
                  <span className="truncate">{r.t}</span>
                </span>
                <span
                  className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium transition-colors duration-200 ${tone(r.s)}`}
                >
                  {r.s === "Published" && <Check size={9} strokeWidth={3} aria-hidden />}
                  {r.s}
                </span>
                <span className="hidden sm:block">
                  <Face who={r.who} size={18} className="!ring-0" />
                </span>
                <span className="hidden text-[11px] text-[#8a909c] sm:block">{r.d}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#8a909c]">
            <Globe size={11} aria-hidden />
            Connected to your website · yourcompany.com/blog
          </p>
          <span
            className={`absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-[10px] bg-[#16181d] px-3 py-2 text-[11.5px] text-white shadow-lg ${T} ${
              pub ? "" : "translate-y-2 opacity-0"
            }`}
          >
            <Check size={12} className="text-[#5BE3A2]" strokeWidth={3} aria-hidden />
            Published. Live on your blog.
          </span>
        </div>
      </div>
    </Chrome>
  );
}

/* 4. Image & Video: the campaign visual, then it moves. */
export function MediaArtifact({ on }: { on: boolean }) {
  const video = useAfter(on, 900);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!video) return;
    const ts = [
      window.setTimeout(() => setFrame(1), 1300),
      window.setTimeout(() => setFrame(2), 2600),
    ];
    return () => ts.forEach(window.clearTimeout);
  }, [video]);
  const frames = [P.field, P.amber, P.shelf];
  const shown = video ? frame : 0;
  return (
    <div className="flex h-[calc(100%-28px)] overflow-hidden rounded-[14px] bg-[#111418] text-text shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
      {/* canvas */}
      <div className="flex min-w-0 flex-1 flex-col p-3">
        <div className="relative mx-auto aspect-[4/5] h-full max-h-full overflow-hidden rounded-[8px] bg-black">
          {frames.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: shown === i ? 1 : 0,
                transform: video && shown === i ? "scale(1.05)" : "none",
                transition: "opacity 0.6s, transform 1.6s linear",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),transparent_35%,rgba(0,0,0,0.5))]" />
          <span className="absolute left-3 top-3 font-[family-name:var(--font-mock-serif)] text-[13px] text-white">
            everyday objects
          </span>
          <p className="absolute bottom-4 left-3 font-[family-name:var(--font-mock-serif)] text-[30px] leading-[0.95] text-white">
            Find your
            <br />
            focus.
          </p>
        </div>
      </div>
      {/* settings */}
      <aside className="hidden w-[170px] shrink-0 flex-col border-l border-white/[0.07] p-3.5 text-[11.5px] sm:flex">
        <p className="text-[10.5px] text-subtle">Format</p>
        <span className="mt-1.5 flex rounded-[8px] bg-white/[0.05] p-0.5">
          <span
            className={`flex flex-1 items-center justify-center gap-1 rounded-[6px] py-1.5 transition-colors ${video ? "text-muted" : "bg-white/[0.1] text-text"}`}
          >
            <ImageIcon size={11} aria-hidden />
            Image
          </span>
          <span
            className={`flex flex-1 items-center justify-center gap-1 rounded-[6px] py-1.5 transition-colors ${video ? "bg-white/[0.1] text-text" : "text-muted"}`}
          >
            <Video size={11} aria-hidden />
            Video
          </span>
        </span>
        <p className="mt-3.5 text-[10.5px] text-subtle">Size</p>
        <p className="mt-1 text-text">1080 × 1350 · Feed</p>
        <p className="mt-3.5 text-[10.5px] text-subtle">Brand</p>
        <p className="mt-1 flex items-center gap-1.5 text-text">
          <span className="size-3 rounded-full bg-[#E9B949]" />
          everyday objects
        </p>
        <p className="mt-3.5 text-[10.5px] text-subtle">Length</p>
        <p className="mt-1 text-text">{video ? "0:06 · 3 scenes" : "Still"}</p>
        {/* timeline */}
        <div className={`mt-auto ${T} ${video ? "" : "opacity-0"}`}>
          <div className="flex items-center gap-1.5 text-muted">
            {frame < 2 ? (
              <Play size={11} className="fill-current" aria-hidden />
            ) : (
              <Pause size={11} aria-hidden />
            )}
            <span className="tabular-nums">0:0{frame * 2 + 2}</span>
          </div>
          <div className="mt-2 flex gap-1">
            {frames.map((src, i) => (
              <span
                key={src}
                className={`relative h-9 flex-1 overflow-hidden rounded-[4px] ring-1 transition-colors ${i === frame ? "ring-[#E9B949]" : "ring-white/10"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
