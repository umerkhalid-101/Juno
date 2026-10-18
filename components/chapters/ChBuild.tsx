"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  LayoutGrid,
  LineChart,
  Search,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { IMG } from "@/lib/images";

/**
 * "Imagine it. Make it an app."
 * Five apps Juno built, each a different brand, each actually usable on the page.
 * Photos: Unsplash (free license), served from /public/img via lib/images.
 */

const ease = [0.2, 0.8, 0.2, 1] as const;
const P = {
  ceramicsHero: IMG.ceramicsHero,
  ceramicsShelf: IMG.springEdit,
  vaseAmber: IMG.vaseSand,
  vaseField: IMG.vaseStone,
  coffeeBag: IMG.coffeeBag,
  coffeeBeans: IMG.coffeeLatte,
};

/** A block of the app that assembles in as Juno builds. */
const Blk = ({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
      show: { opacity: 1, y: 0, filter: "blur(0px)" },
    }}
    transition={{ duration: 0.55, ease }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------ 1. Hearth: ceramics website */

function Hearth() {
  const [bag, setBag] = useState(0);
  const [added, setAdded] = useState<string | null>(null);
  const products = [
    { name: "The shelf set", note: "Five pieces", price: "$180", img: P.ceramicsShelf },
    { name: "Sand vase", note: "Raw clay", price: "$64", img: P.vaseAmber },
    { name: "Stone vase", note: "Matte white", price: "$72", img: P.vaseField },
  ];
  return (
    <div className="flex h-full flex-col bg-[#F6F1E9] text-[#2d2a24]">
      <Blk className="flex items-center justify-between px-7 py-3 sm:py-4">
        <span>
          <span className="mock-serif block text-[28px] leading-none">hearth</span>
          <span className="text-[11px] text-[#8a8174]">Ceramics, made slowly.</span>
        </span>
        <span className="hidden gap-7 text-[13px] text-[#5a5248] sm:flex">
          <span>Shop</span>
          <span>Studio</span>
          <span>Journal</span>
        </span>
        <motion.span
          key={bag}
          initial={{ scale: bag ? 1.15 : 1 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#d9cfc1] px-3 py-1.5 text-[12px]"
        >
          <ShoppingBag size={13} strokeWidth={1.75} aria-hidden />
          Bag ({bag})
        </motion.span>
      </Blk>
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-[1fr_1.15fr]">
        <Blk className="flex flex-col justify-center bg-[#EDE5D8] px-6 py-5 sm:px-8 sm:py-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8174]">The autumn edit</p>
          <p className="mock-serif mt-2 text-[36px] leading-[0.95] text-[#2f3a2a] sm:mt-3 sm:text-[46px] md:text-[54px]">
            Made slowly.
          </p>
          <p className="mock-serif text-[36px] italic leading-[0.95] text-[#9a4a2c] sm:text-[46px] md:text-[54px]">
            Kept for years.
          </p>
          <p className="mt-4 max-w-[30ch] text-[14px] leading-[22px] text-[#5a5248] max-sm:hidden">
            Hand-thrown vases and vessels for a home that feels like yours.
          </p>
          <span className="mt-4 w-fit rounded-md bg-[#2f3a2a] px-4 py-2.5 text-[13px] text-[#f6f1e9] sm:mt-6 sm:px-5 sm:py-3">
            Shop the collection
          </span>
        </Blk>
        <Blk className="relative min-h-[118px] overflow-hidden sm:min-h-[220px]">
          <Image
            src={P.ceramicsHero}
            alt="A terracotta arch vase in warm sunlight"
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 rounded bg-[#F6F1E9]/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]">
            Stoneware, fired by hand
          </span>
        </Blk>
      </div>
      <div className="grid grid-cols-1 gap-3 px-7 py-3 sm:grid-cols-3 sm:py-4">
        {products.map((p, i) => (
          <Blk
            key={p.name}
            className={`group flex items-center gap-3 ${i === 2 ? "max-sm:hidden" : ""}`}
          >
            <span className="relative size-14 shrink-0 overflow-hidden rounded-md">
              <Image
                src={p.img}
                alt={p.name}
                fill
                sizes="56px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px]">{p.name}</span>
              <span className="block text-[11px] text-[#8a8174]">
                {p.note} · {p.price}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setBag((b) => b + 1);
                setAdded(p.name);
                window.setTimeout(() => setAdded(null), 1200);
              }}
              className="rounded-full border border-[#d9cfc1] px-3 py-1 text-[12px] transition-colors hover:bg-[#2f3a2a] hover:text-[#f6f1e9]"
            >
              {added === p.name ? "Added" : "Add"}
            </button>
          </Blk>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 2. Night Shift: coffee launch */

function NightShift() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <div className="grid h-full grid-cols-1 bg-[#17110d] text-[#f3e9dc] sm:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col justify-center px-6 py-6 sm:px-9 sm:py-9">
        <Blk>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f3e9dc]/15 px-3 py-1 text-[11px] text-[#cdb9a3]">
            <span className="size-1.5 rounded-full bg-[#e8a25c]" />
            Northbound Coffee · New roast
          </span>
        </Blk>
        <Blk>
          <p className="mt-4 text-[42px] font-semibold leading-[0.92] tracking-[-0.05em] sm:mt-5 sm:text-[52px] md:text-[62px]">
            Meet
            <br />
            <span className="text-[#e8a25c]">Night Shift.</span>
          </p>
        </Blk>
        <Blk>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-[23px] text-[#cdb9a3]">
            A dark roast for late builds and early mornings. Smooth, heavy, never bitter.
          </p>
        </Blk>
        <Blk className="mt-5 flex flex-wrap gap-2 max-sm:hidden">
          {["Dark chocolate", "Black cherry", "Molasses"].map((n) => (
            <span
              key={n}
              className="rounded-full bg-[#f3e9dc]/[0.07] px-3 py-1 text-[12px] text-[#e9d9c6]"
            >
              {n}
            </span>
          ))}
        </Blk>
        <Blk className="mt-5 sm:mt-7">
          <AnimatePresence mode="wait" initial={false}>
            {joined ? (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-[14px] text-[#e8a25c]"
              >
                <Check size={16} strokeWidth={2.25} aria-hidden />
                You&apos;re on the list. First bags ship Friday.
              </motion.p>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setJoined(true);
                }}
                className="flex max-w-[400px] gap-2"
              >
                <label className="sr-only" htmlFor="ns-email">
                  Email
                </label>
                <input
                  id="ns-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 rounded-lg bg-[#f3e9dc]/[0.08] px-4 py-3 text-[14px] text-[#f3e9dc] placeholder:text-[#8f7b67] focus:outline-none focus:ring-2 focus:ring-[#e8a25c]/60"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#e8a25c] px-5 py-3 text-[14px] font-semibold text-[#17110d] transition-transform active:scale-[0.97]"
                >
                  Notify me
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Blk>
      </div>
      <Blk className="relative min-h-[150px] overflow-hidden bg-[#c9a27a] sm:min-h-[260px]">
        <Image
          src={P.coffeeBag}
          alt="An unbranded kraft coffee bag"
          fill
          sizes="(min-width: 768px) 460px, 100vw"
          className="object-cover"
        />
        <span className="absolute right-4 top-4 rounded-full bg-[#17110d] px-3 py-1.5 text-[11px] font-medium text-[#e8a25c]">
          Ships Friday
        </span>
        <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl bg-[#17110d]/85 p-2 pr-4 backdrop-blur">
          <span className="relative size-10 overflow-hidden rounded-lg">
            <Image
              src={P.coffeeBeans}
              alt="A latte with leaf art"
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <span className="text-[12px] leading-4">
            Roasted in small batches
            <span className="block text-[#cdb9a3]">340g · whole bean</span>
          </span>
        </div>
      </Blk>
    </div>
  );
}

/* ------------------------------------------------------------ 3. Orbit revenue dashboard */

const RANGES: Record<string, number[]> = {
  "7d": [52, 55, 54, 58, 61, 60, 66],
  "30d": [38, 42, 41, 47, 45, 52, 55, 54, 60, 66],
  "90d": [21, 26, 25, 31, 34, 33, 40, 44, 47, 52, 58, 66],
};

const Spark = ({ d, color }: { d: number[]; color: string }) => {
  const lo = Math.min(...d);
  const hi = Math.max(...d);
  const path = d
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${((i / (d.length - 1)) * 64).toFixed(1)} ${(22 - ((v - lo) / (hi - lo || 1)) * 20).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 64 24" className="h-6 w-16" aria-hidden>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function Dashboard() {
  const [range, setRange] = useState<keyof typeof RANGES>("30d");
  const [hover, setHover] = useState<number | null>(null);
  const data = RANGES[range];
  const max = 70;
  const W = 600;
  const H = 200;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - (v / max) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H}Z`;
  const hv = hover ?? data.length - 1;
  const nav: [LucideIcon, string][] = [
    [LayoutGrid, "Overview"],
    [LineChart, "Revenue"],
    [Users, "Customers"],
    [FileText, "Reports"],
    [Settings, "Settings"],
  ];
  const accounts = [
    { n: "Lumen Health", p: "Scale", m: "$18.4k", d: "+9%", c: "#0EA5E9" },
    { n: "Parcel & Co", p: "Growth", m: "$12.1k", d: "+4%", c: "#F97316" },
    { n: "Kestrel", p: "Scale", m: "$9.8k", d: "+14%", c: "#10B981" },
    { n: "Northwind", p: "Growth", m: "$7.2k", d: "-2%", c: "#8B5CF6" },
    { n: "Fieldday", p: "Starter", m: "$5.6k", d: "+21%", c: "#EC4899" },
    { n: "Atlas Labs", p: "Growth", m: "$4.9k", d: "+3%", c: "#0F766E" },
  ];

  return (
    <div className="flex h-full bg-[#F7F8FA] text-[#0F1222]">
      <Blk className="hidden w-[188px] shrink-0 flex-col border-r border-black/[0.06] bg-white px-3 py-4 md:flex">
        <span className="flex items-center gap-2 px-2 text-[13.5px] font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-[#4F5BFF] text-white">
            <span className="size-2.5 rounded-full border-2 border-white" />
          </span>
          Orbit
          <ChevronDown size={13} className="ml-auto text-[#9AA0AE]" aria-hidden />
        </span>
        <nav className="mt-5 space-y-0.5 text-[13px]">
          {nav.map(([I, l]) => (
            <span
              key={l}
              className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 ${l === "Revenue" ? "bg-[#F0F1F5] font-medium text-[#0F1222]" : "text-[#6B7080]"}`}
            >
              <I size={14} strokeWidth={1.75} aria-hidden />
              {l}
            </span>
          ))}
        </nav>
        <span className="mt-auto flex items-center gap-2 px-2 text-[11.5px] text-[#6B7080]">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#22C55E] opacity-60" />
            <span className="relative size-2 rounded-full bg-[#22C55E]" />
          </span>
          Synced from Stripe
        </span>
      </Blk>

      <div className="flex min-w-0 flex-1 flex-col">
        <Blk className="flex items-center justify-between gap-3 px-6 pb-3 pt-5">
          <span>
            <span className="block text-[20px] font-semibold tracking-[-0.02em]">Revenue</span>
            <span className="block text-[12px] text-[#6B7080]">Updated 2 minutes ago</span>
          </span>
          <span
            className="flex rounded-lg bg-[#ECEEF3] p-0.5 text-[12px]"
            role="tablist"
            aria-label="Range"
          >
            {(Object.keys(RANGES) as (keyof typeof RANGES)[]).map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={range === r}
                onClick={() => {
                  setRange(r);
                  setHover(null);
                }}
                className={`rounded-md px-3 py-1 transition-colors ${range === r ? "bg-white font-medium shadow-sm" : "text-[#6B7080]"}`}
              >
                {r}
              </button>
            ))}
          </span>
        </Blk>
        <div className="grid grid-cols-2 gap-3 px-6 sm:grid-cols-3">
          {[
            { k: "MRR", v: "$412k", d: "+6.1%", s: [3, 4, 4, 5, 6, 6, 8], c: "#4F5BFF" },
            { k: "Active accounts", v: "318", d: "+12", s: [5, 5, 6, 6, 7, 7, 8], c: "#16A34A" },
            { k: "Net churn", v: "1.2%", d: "-0.4 pts", s: [8, 7, 7, 6, 5, 5, 4], c: "#16A34A" },
          ].map((m, i) => (
            <Blk
              key={m.k}
              className={`rounded-xl bg-white p-3.5 ring-1 ring-black/[0.05] ${i === 2 ? "max-sm:hidden" : ""}`}
            >
              <p className="text-[12px] text-[#6B7080]">{m.k}</p>
              <div className="mt-1 flex items-end justify-between">
                <span>
                  <span className="block text-[22px] font-semibold tracking-[-0.03em]">{m.v}</span>
                  <span className="block text-[11.5px] font-medium text-[#16A34A]">{m.d}</span>
                </span>
                <Spark d={m.s} color={m.c} />
              </div>
            </Blk>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 gap-3 px-6 py-4 lg:grid-cols-[1.55fr_1fr]">
          <Blk className="flex flex-col rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-[12.5px] font-medium">Weekly revenue</p>
              <p className="text-[13px] font-semibold tabular-nums">
                ${data[hv]}k <span className="font-normal text-[#6B7080]">week {hv + 1}</span>
              </p>
            </div>
            <div className="relative min-h-[150px] flex-1">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0 h-full w-full cursor-crosshair overflow-visible"
                preserveAspectRatio="none"
                onPointerMove={(e) => {
                  const r = (e.currentTarget as SVGElement).getBoundingClientRect();
                  const i = Math.round(((e.clientX - r.left) / r.width) * (data.length - 1));
                  setHover(Math.max(0, Math.min(data.length - 1, i)));
                }}
                onPointerLeave={() => setHover(null)}
                role="img"
                aria-label={`Weekly revenue over ${range}, rising to $${data[data.length - 1]}k`}
              >
                <defs>
                  <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F5BFF" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#4F5BFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((g) => (
                  <line
                    key={g}
                    x1="0"
                    x2={W}
                    y1={H * g}
                    y2={H * g}
                    stroke="#0F1222"
                    strokeOpacity="0.06"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <motion.path
                  d={area}
                  fill="url(#dashArea)"
                  animate={{ d: area }}
                  transition={{ duration: 0.5, ease }}
                />
                <motion.path
                  d={line}
                  fill="none"
                  stroke="#4F5BFF"
                  strokeWidth="2.25"
                  vectorEffect="non-scaling-stroke"
                  animate={{ d: line }}
                  transition={{ duration: 0.5, ease }}
                />
                <line
                  x1={pts[hv][0]}
                  x2={pts[hv][0]}
                  y1={0}
                  y2={H}
                  stroke="#0F1222"
                  strokeOpacity="0.12"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span
                className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-[#4F5BFF] bg-white transition-[left,top] duration-300"
                style={{ left: `${(pts[hv][0] / W) * 100}%`, top: `${(pts[hv][1] / H) * 100}%` }}
              />
            </div>
          </Blk>
          <Blk className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05] max-lg:hidden">
            <p className="text-[12.5px] font-medium">Top accounts</p>
            <ul className="mt-2 divide-y divide-black/[0.05]">
              {accounts.map((a) => (
                <li key={a.n} className="flex items-center gap-2.5 py-2.5">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold text-white"
                    style={{ background: a.c }}
                  >
                    {a.n[0]}
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[13px] font-medium">{a.n}</span>
                    <span className="block text-[11px] text-[#6B7080]">{a.p}</span>
                  </span>
                  <span className="text-right leading-tight">
                    <span className="block text-[13px] font-medium tabular-nums">{a.m}</span>
                    <span
                      className={`block text-[11px] ${a.d.startsWith("-") ? "text-[#DC2626]" : "text-[#16A34A]"}`}
                    >
                      {a.d}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Blk>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 4. Relay journal: a company blog */

const POSTS = [
  {
    cat: "Product",
    title: "Payouts now land in under a second",
    dek: "We rebuilt how money moves, so contractors get paid the moment the work is approved. In 40 countries, on weekends too.",
    who: "Ana Ruiz",
    role: "Head of Product",
    init: "AR",
    tone: "#F6D5C2",
    date: "Oct 14",
    read: "5 min read",
    cover: (
      <div className="relative h-full w-full overflow-hidden bg-[#FF5B1F]">
        <div className="absolute -right-16 -top-24 size-72 rounded-full bg-[#FF8A4C]" />
        <div className="absolute -bottom-28 -left-10 size-64 rounded-full bg-[#E84A12]" />
        <div className="absolute left-1/2 top-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 text-[#0E1116] shadow-[0_30px_60px_-20px_rgba(120,30,0,0.6)]">
          <div className="flex items-center justify-between text-[11px] text-[#6B6B6B]">
            <span className="flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-[#16A34A]">
                <Check size={10} strokeWidth={3} className="text-white" aria-hidden />
              </span>
              Payout sent
            </span>
            <span className="font-mono">0.8s</span>
          </div>
          <p className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.04em]">
            $4,820.00
          </p>
          <p className="text-[11px] text-[#6B6B6B]">To Marta Silva · Lisbon</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#FF5B1F]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
            />
          </div>
        </div>
      </div>
    ),
    thumb: (
      <div className="relative grid h-full w-full place-items-center overflow-hidden bg-[#FF5B1F]">
        <div className="absolute -right-6 -top-10 size-24 rounded-full bg-[#FF8A4C]" />
        <span className="relative rounded-md bg-white px-2.5 py-1 text-[13px] font-semibold tabular-nums tracking-[-0.03em] text-[#0E1116] shadow-md">
          $4,820.00
        </span>
      </div>
    ),
  },
  {
    cat: "Engineering",
    title: "Moving the ledger without a second of downtime",
    dek: "Two databases, one source of truth, and a very careful cutover. Here is how we did it.",
    who: "Sam Okafor",
    role: "Staff Engineer",
    init: "SO",
    tone: "#C7D2FE",
    date: "Oct 9",
    read: "9 min read",
    cover: (
      <div className="flex h-full w-full flex-col bg-[#0E1116] font-mono text-[11px] leading-[19px]">
        <div className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-2 text-[10px] text-[#7D8590]">
          <span className="text-[#E6EDF3]">ledger.ts</span>
          <span>cutover.ts</span>
        </div>
        <div className="flex flex-1 items-center px-4">
          <div className="grid grid-cols-[18px_1fr] gap-x-3 text-[#7D8590]">
            {[
              <span key="1">
                <span className="text-[#FF7B72]">const</span>{" "}
                <span className="text-[#E6EDF3]">ledger</span> ={" "}
                <span className="text-[#D2A8FF]">migrate</span>(v1, v2)
              </span>,
              <span key="2">
                <span className="text-[#FF7B72]">await</span> ledger.
                <span className="text-[#D2A8FF]">mirror</span>({"{"} writes:{" "}
                <span className="text-[#79C0FF]">true</span> {"}"})
              </span>,
              <span key="3">
                <span className="text-[#FF7B72]">await</span> ledger.
                <span className="text-[#D2A8FF]">verify</span>()
              </span>,
              <span key="4" className="text-[#56D364]">
                {"// 0 rows out of balance"}
              </span>,
              <span key="5">
                <span className="text-[#FF7B72]">await</span> ledger.
                <span className="text-[#D2A8FF]">switch</span>(
                <span className="text-[#A5D6FF]">&quot;v2&quot;</span>)
              </span>,
            ].map((l, i) => (
              <span key={i} className="contents">
                <span className="text-right text-[#484F58]">{i + 1}</span>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    thumb: (
      <div className="flex h-full w-full flex-col justify-center gap-1 bg-[#0E1116] px-3 font-mono text-[9px] leading-[13px] text-[#7D8590]">
        <span>
          <span className="text-[#FF7B72]">await</span> ledger.
          <span className="text-[#D2A8FF]">verify</span>()
        </span>
        <span className="text-[#56D364]">{"// 0 rows out of balance"}</span>
      </div>
    ),
  },
  {
    cat: "Company",
    title: "We raised $24M to rebuild payroll for contractors",
    dek: "What the round is for, who joined us, and the roles we are hiring for next.",
    who: "Lena Park",
    role: "Co-founder",
    init: "LP",
    tone: "#BBF7D0",
    date: "Sep 30",
    read: "4 min read",
    cover: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#E7F3E8] p-6 text-[#14532D]">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em]">Series A</span>
        <span className="text-[96px] font-semibold leading-[0.85] tracking-[-0.07em]">$24M</span>
        <div className="absolute -right-10 top-8 size-40 rounded-full border-[18px] border-[#C3E6C7]" />
      </div>
    ),
    thumb: (
      <div className="grid h-full w-full place-items-center bg-[#E7F3E8]">
        <span className="text-[26px] font-semibold tracking-[-0.06em] text-[#14532D]">$24M</span>
      </div>
    ),
  },
  {
    cat: "Product",
    title: "Invoices that write themselves",
    dek: "Relay drafts every invoice from your time logs. You read it once and press send.",
    who: "Ana Ruiz",
    role: "Head of Product",
    init: "AR",
    tone: "#F6D5C2",
    date: "Sep 22",
    read: "3 min read",
    cover: (
      <div className="grid h-full w-full place-items-center bg-[#F4F1EA]">
        <div className="w-[220px] rotate-[-3deg] rounded-xl bg-white p-4 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          <p className="flex justify-between text-[10px] text-[#6B6B6B]">
            <span className="font-semibold text-[#0E1116]">Invoice 0142</span>
            Due Nov 1
          </p>
          {[
            ["Design sprint", "$3,200"],
            ["Prototype", "$1,400"],
          ].map(([a, b]) => (
            <p key={a} className="mt-2 flex justify-between text-[11px]">
              <span>{a}</span>
              <span className="tabular-nums">{b}</span>
            </p>
          ))}
          <p className="mt-3 flex justify-between border-t border-black/[0.07] pt-2 text-[12px] font-semibold">
            <span>Total</span>
            <span className="tabular-nums text-[#FF5B1F]">$4,600</span>
          </p>
        </div>
      </div>
    ),
    thumb: (
      <div className="grid h-full w-full place-items-center bg-[#F4F1EA]">
        <span className="w-[90px] rotate-[-3deg] space-y-1 rounded bg-white p-2 shadow-sm ring-1 ring-black/5">
          <span className="block h-1 w-1/2 rounded bg-[#0E1116]" />
          <span className="block h-0.5 w-full rounded bg-black/10" />
          <span className="block h-0.5 w-4/5 rounded bg-black/10" />
          <span className="ml-auto block h-1 w-1/3 rounded bg-[#FF5B1F]" />
        </span>
      </div>
    ),
  },
];

const Byline = ({ p }: { p: (typeof POSTS)[number] }) => (
  <span className="flex items-center gap-2.5">
    <span
      className="grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-[#0E1116]"
      style={{ background: p.tone }}
    >
      {p.init}
    </span>
    <span className="leading-tight">
      <span className="block text-[13px] font-medium">{p.who}</span>
      <span className="block text-[11.5px] text-[#8A8A8A]">{p.role}</span>
    </span>
  </span>
);

function Journal() {
  const cats = ["All", "Product", "Engineering", "Company"];
  const [cat, setCat] = useState("All");
  const order =
    cat === "All"
      ? POSTS
      : [...POSTS.filter((p) => p.cat === cat), ...POSTS.filter((p) => p.cat !== cat)];
  const [lead, ...rest] = order;
  return (
    <div className="flex h-full flex-col bg-[#FCFCFA] text-[#0E1116]">
      <Blk className="flex items-center gap-6 px-7 py-3.5">
        <span className="flex items-center gap-1.5 text-[17px] font-semibold tracking-[-0.03em]">
          <span className="relative size-4">
            <span className="absolute left-0 top-0 size-3 rounded-full bg-[#FF5B1F]" />
            <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#0E1116] mix-blend-multiply" />
          </span>
          relay
        </span>
        <span className="flex gap-5 text-[13px] max-sm:hidden" role="tablist" aria-label="Topics">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`relative py-1 transition-colors ${cat === c ? "text-[#0E1116]" : "text-[#8A8A8A] hover:text-[#0E1116]"}`}
            >
              {c}
              {cat === c && (
                <motion.span
                  layoutId="journal-cat"
                  className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[#FF5B1F]"
                />
              )}
            </button>
          ))}
        </span>
        <span className="ml-auto flex items-center gap-4 text-[13px]">
          <Search size={15} className="text-[#8A8A8A] max-sm:hidden" aria-hidden />
          <span className="rounded-full bg-[#0E1116] px-3.5 py-1.5 text-[12px] font-medium text-white">
            Subscribe
          </span>
        </span>
      </Blk>

      {/* the lead story */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          key={lead.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease }}
          className="grid gap-6 px-7 pt-3 md:grid-cols-[1fr_1.12fr] md:items-center"
        >
          <div className="order-2 md:order-1">
            <p className="flex items-center gap-2 text-[12px]">
              <span className="font-medium text-[#FF5B1F]">{lead.cat}</span>
              <span className="text-[#B0B0B0]">·</span>
              <span className="text-[#8A8A8A]">
                {lead.date} · {lead.read}
              </span>
            </p>
            <p className="mt-2.5 text-[28px] font-semibold leading-[1.02] tracking-[-0.045em] md:text-[38px]">
              {lead.title}
            </p>
            <p className="mt-3 max-w-[40ch] text-[14px] leading-[22px] text-[#5B5B5B]">
              {lead.dek}
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <Byline p={lead} />
              <span className="group flex items-center gap-1.5 text-[13px] font-medium">
                Read story
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </div>
          <div className="order-1 h-[200px] overflow-hidden rounded-2xl md:order-2 md:h-[248px]">
            {lead.cover}
          </div>
        </motion.article>
      </AnimatePresence>

      {/* more stories */}
      <div className="mt-auto grid grid-cols-3 gap-5 px-7 pb-6 pt-5 max-md:hidden">
        {rest.map((p) => (
          <motion.button
            layout
            key={p.title}
            type="button"
            onClick={() => setCat(p.cat)}
            transition={{ duration: 0.4, ease }}
            className="group text-left"
          >
            <span className="block h-[86px] overflow-hidden rounded-xl ring-1 ring-black/[0.05]">
              <span className="block h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
                {p.thumb}
              </span>
            </span>
            <span className="mt-2.5 block text-[11px] font-medium text-[#FF5B1F]">{p.cat}</span>
            <span className="mt-0.5 block text-[14px] font-semibold leading-[18px] tracking-[-0.02em]">
              {p.title}
            </span>
            <span className="mt-1 block text-[11.5px] text-[#8A8A8A]">
              {p.who} · {p.read}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 5. Sundial: a one question at a time survey */

const USES = ["Client calls", "Team standups", "Hiring interviews", "Something else"];
const RESULTS = [46, 27, 19, 8];

function Survey() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [use, setUse] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const total = 3;
  const next = (s: number) => window.setTimeout(() => setStep(s), 380);

  return (
    <div className="relative flex h-full min-h-[460px] flex-col overflow-hidden bg-[#1631D8] text-[#F7F4EC]">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[250px] -right-[130px] max-md:hidden"
      >
        <motion.div
          className="grid size-[460px] place-items-center rounded-full bg-[#1C3AE6]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease }}
        >
          <div className="grid size-[320px] place-items-center rounded-full bg-[#2243EC]">
            <motion.div
              className="size-[120px] rounded-full bg-[#D7FF5A]"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
      <div className="h-1 w-full bg-white/15">
        <motion.div
          className="h-full bg-[#D7FF5A]"
          animate={{ width: `${(Math.min(step, total) / total) * 100}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>
      <Blk className="flex items-center justify-between px-8 pt-5 text-[13px]">
        <span className="flex items-center gap-2 font-semibold tracking-[-0.01em]">
          <span className="relative size-4 overflow-hidden rounded-full bg-[#D7FF5A]">
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[#F7F4EC]" />
          </span>
          sundial
        </span>
        <span className="text-white/60">{step < total ? `${step + 1} of ${total}` : "Done"}</span>
      </Blk>

      <div className="relative flex flex-1 items-center px-8 py-6 md:px-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            className="w-full max-w-[640px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease }}
          >
            {step === 0 && (
              <Blk>
                <p className="flex items-center gap-2 text-[14px] text-[#D7FF5A]">
                  1 <ArrowRight size={14} aria-hidden />
                </p>
                <p className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[32px]">
                  How likely are you to recommend Sundial to a friend?
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {Array.from({ length: 11 }, (_, n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setScore(n);
                        next(1);
                      }}
                      className={`grid h-11 w-10 place-items-center rounded-md text-[15px] tabular-nums ring-1 transition-colors md:w-11 ${score === n ? "bg-[#D7FF5A] text-[#1631D8] ring-[#D7FF5A]" : "bg-white/[0.06] ring-white/25 hover:bg-white/15"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="mt-2 flex max-w-[514px] justify-between text-[12px] text-white/60">
                  <span>Not likely</span>
                  <span>Very likely</span>
                </p>
              </Blk>
            )}
            {step === 1 && (
              <div>
                <p className="flex items-center gap-2 text-[14px] text-[#D7FF5A]">
                  2 <ArrowRight size={14} aria-hidden />
                </p>
                <p className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[32px]">
                  What did you book first?
                </p>
                <div className="mt-6 grid max-w-[420px] gap-2">
                  {USES.map((u, i) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        setUse(i);
                        next(2);
                      }}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-[15px] ring-1 transition-colors ${use === i ? "bg-white/20 ring-white/70" : "bg-white/[0.06] ring-white/25 hover:bg-white/15"}`}
                    >
                      <span
                        className={`grid size-6 place-items-center rounded text-[12px] font-semibold ring-1 ${use === i ? "bg-[#D7FF5A] text-[#1631D8] ring-[#D7FF5A]" : "ring-white/40"}`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {u}
                      {use === i && <Check size={16} className="ml-auto" aria-hidden />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }}
              >
                <p className="flex items-center gap-2 text-[14px] text-[#D7FF5A]">
                  3 <ArrowRight size={14} aria-hidden />
                </p>
                <label
                  htmlFor="sd-note"
                  className="mt-2 block text-[26px] font-medium leading-[1.15] tracking-[-0.02em] md:text-[32px]"
                >
                  One thing we could do better?
                </label>
                <input
                  id="sd-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type your answer here"
                  className="mt-6 w-full border-b-2 border-white/30 bg-transparent pb-2 text-[22px] text-white placeholder:text-white/35 focus:border-[#D7FF5A] focus:outline-none"
                />
                <span className="mt-5 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-md bg-[#D7FF5A] px-4 py-2 text-[15px] font-semibold text-[#1631D8] transition-transform active:scale-[0.97]"
                  >
                    Submit
                    <Check size={16} strokeWidth={2.5} aria-hidden />
                  </button>
                  <span className="text-[12px] text-white/60">
                    press <span className="font-semibold text-white">Enter</span>
                  </span>
                </span>
              </form>
            )}
            {step === 3 && (
              <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
                <div>
                  <p className="text-[30px] font-medium leading-[1.1] tracking-[-0.03em] md:text-[36px]">
                    Thank you. That helps a lot.
                  </p>
                  <p className="mt-3 text-[14px] text-white/70">
                    Here is how 412 new users answered this week.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setScore(null);
                      setUse(null);
                      setNote("");
                    }}
                    className="mt-5 text-[13px] text-[#D7FF5A] underline-offset-4 hover:underline"
                  >
                    Take it again
                  </button>
                </div>
                <div className="rounded-xl bg-white/[0.08] p-5 ring-1 ring-white/15">
                  <p className="flex items-baseline justify-between">
                    <span className="text-[13px] text-white/70">Net promoter score</span>
                    <span className="text-[30px] font-semibold tracking-[-0.04em] text-[#D7FF5A]">
                      62
                    </span>
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {USES.map((u, i) => (
                      <div key={u}>
                        <p className="flex justify-between text-[12px]">
                          <span>
                            {u}
                            {use === i && <span className="ml-2 text-[#D7FF5A]">You</span>}
                          </span>
                          <span className="tabular-nums text-white/70">{RESULTS[i]}%</span>
                        </p>
                        <div className="mt-1 h-1.5 rounded-full bg-white/10">
                          <motion.div
                            className={`h-full rounded-full ${use === i ? "bg-[#D7FF5A]" : "bg-white/70"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${RESULTS[i]}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ the section */

const apps = [
  { tab: "Website", url: "hearth.studio", App: Hearth },
  { tab: "Launch page", url: "northbound.coffee/night-shift", App: NightShift },
  { tab: "Dashboard", url: "app.orbit.com/revenue", App: Dashboard },
  { tab: "Blog", url: "relay.com/journal", App: Journal },
  { tab: "Survey", url: "sundial.app/first-week", App: Survey },
];

export function ChBuild() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const { App } = apps[tab];

  const choose = (i: number) => {
    if (i === tab) return;
    setTab(i);
  };

  // the screen floats and leans toward the pointer
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-4, 4]), spring);
  const rotateX = useSpring(useTransform(my, [-1, 1], [3, -3]), spring);
  const shiftX = useSpring(useTransform(mx, [-1, 1], [-6, 6]), spring);
  const shadowX = useSpring(useTransform(mx, [-1, 1], [24, -24]), spring);
  const glareX = useTransform(mx, [-1, 1], [10, 90]);
  const glareY = useTransform(my, [-1, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(700px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.16), transparent 45%)`;
  // flat while reading; it only leans when the pointer reaches the edges and corners
  const lean = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    if (Math.abs(nx) > 1.2 || Math.abs(ny) > 1.2) return settle();
    const edge = (v: number) =>
      Math.sign(v) * Math.min(1, Math.max(0, (Math.abs(v) - 0.72) / 0.28));
    const corner =
      Math.min(1, Math.max(0, (Math.abs(nx) - 0.6) / 0.3)) *
      Math.min(1, Math.max(0, (Math.abs(ny) - 0.5) / 0.3));
    mx.set(edge(nx) * (0.5 + corner * 0.5));
    my.set(edge(ny) * (0.5 + corner * 0.5));
  };
  // each app stays up for a while, then the next one opens; hovering the screen holds it
  const stage = useRef<HTMLDivElement>(null);
  const seen = useInView(stage, { amount: 0.4 });
  const [hold, setHold] = useState(false);

  const settle = () => {
    mx.set(0);
    my.set(0);
  };

  // the product shot starts tilted and settles flat as it scrolls in
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        gsap.fromTo(
          ".build-frame",
          { rotateX: 16, rotateZ: -2.5, y: 60, scale: 0.94 },
          {
            rotateX: 0,
            rotateZ: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".build-stage",
              start: "top 95%",
              end: "top 25%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="apps" aria-labelledby="build-title" className="chapter">
      <div className="container-page">
        <div className="flex flex-col items-center gap-8 md:gap-10">
          <Reveal>
            <ChapterIntro
              id="build-title"
              lead="Imagine it."
              muted="Make it an app."
              sub="Describe it in a sentence. Juno builds it on your data, ready to use and share."
            />
          </Reveal>
          <div
            className="flex max-w-full gap-6 overflow-x-auto pb-1 [scrollbar-width:none] max-md:[mask-image:linear-gradient(90deg,#000_85%,transparent)] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Apps Juno built"
          >
            {apps.map((a, i) => (
              <button
                key={a.tab}
                type="button"
                role="tab"
                aria-selected={i === tab}
                onClick={() => choose(i)}
                className={`relative shrink-0 pb-2 text-[16px] transition-colors md:text-[17px] ${i === tab ? "text-text" : "text-muted hover:text-text"}`}
              >
                {a.tab}
                {i === tab && (
                  <motion.span
                    layoutId="build-tab"
                    className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden rounded-full bg-white/15"
                  >
                    {/* fills while this app is on show, then the next one opens */}
                    <span
                      key={tab}
                      className="build-progress block h-full origin-left rounded-full bg-[#A6BBFF]"
                      style={
                        reduce
                          ? { animation: "none" }
                          : { animationPlayState: hold || !seen ? "paused" : "running" }
                      }
                      onAnimationEnd={() => setTab((t) => (t + 1) % apps.length)}
                    />
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={stage}
          className="build-stage mt-10 md:mt-14"
          style={{ perspective: 1600 }}
          onPointerMove={lean}
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => {
            settle();
            setHold(false);
          }}
        >
          {/* the app, floating */}
          <div
            className="build-frame relative mx-auto max-w-[1080px]"
            style={{ transformOrigin: "50% 0%" }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-[12%] -bottom-16 h-24 rounded-[50%] bg-black/70 blur-3xl"
              style={{ x: shadowX }}
              animate={reduce ? undefined : { scaleX: [1, 0.92, 1], opacity: [0.9, 0.7, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                ref={frame}
                className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/10"
                style={{ rotateX, rotateY, x: shiftX, transformPerspective: 1400 }}
              >
                <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#EDEDEA] px-4 py-3">
                  <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                    <span className="size-2.5 rounded-full bg-[#28C840]" />
                  </span>
                  <span className="mx-auto w-full max-w-[420px] truncate rounded-md bg-white px-3 py-1 text-center text-[12px] text-[#7a7f8c] ring-1 ring-black/[0.05]">
                    {apps[tab].url}
                  </span>
                </div>
                <div className="relative h-[560px] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={tab}
                      className="h-full"
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
                      }}
                    >
                      <App />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
                  style={{ background: glare }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
