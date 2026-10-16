"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useSpring, useTransform, useReducedMotion } from "motion/react";
import { Check, ShoppingBag } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { Reveal } from "@/components/ui/Reveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * "Imagine it. Make it an app."
 * Four apps Juno built, each a different brand, each actually usable on the page.
 * Photos: Unsplash (free license), served from images.unsplash.com.
 */

const ease = [0.2, 0.8, 0.2, 1] as const;
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80`;
const P = {
  ceramicsHero: photo("1638303322325-ff70d6224a22"),
  ceramicsShelf: photo("1597696929736-6d13bed8e6a8"),
  vaseAmber: photo("1674390521253-79caf82d0ceb"),
  vaseField: photo("1613424777445-f93a2a48e285"),
  coffeeBag: photo("1695245503558-5cdb37f49092"),
  coffeeBeans: photo("1459755486867-b55449bb39ff"),
};

/** A block of the app that assembles in as Juno builds. */
const Blk = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 16, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
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
    { name: "Amber vase", note: "Glazed stoneware", price: "$64", img: P.vaseAmber },
    { name: "Field vase", note: "Raw clay", price: "$72", img: P.vaseField },
  ];
  return (
    <div className="flex h-full flex-col bg-[#F6F1E9] text-[#2d2a24]">
      <Blk className="flex items-center justify-between px-7 py-4">
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
        <Blk className="flex flex-col justify-center bg-[#EDE5D8] px-8 py-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a8174]">The autumn edit</p>
          <p className="mock-serif mt-3 text-[46px] leading-[0.95] text-[#2f3a2a] md:text-[54px]">Made slowly.</p>
          <p className="mock-serif text-[46px] italic leading-[0.95] text-[#9a4a2c] md:text-[54px]">Kept for years.</p>
          <p className="mt-4 max-w-[30ch] text-[14px] leading-[22px] text-[#5a5248]">Hand-thrown vases and vessels for a home that feels like yours.</p>
          <span className="mt-6 w-fit rounded-md bg-[#2f3a2a] px-5 py-3 text-[13px] text-[#f6f1e9]">Shop the collection</span>
        </Blk>
        <Blk className="relative min-h-[220px] overflow-hidden">
          <Image src={P.ceramicsHero} alt="Two white ceramic vases with red berries" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
          <span className="absolute bottom-4 left-4 rounded bg-[#F6F1E9]/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]">Stoneware, fired by hand</span>
        </Blk>
      </div>
      <div className="grid grid-cols-1 gap-3 px-7 py-4 sm:grid-cols-3">
        {products.map((p) => (
          <Blk key={p.name} className="group flex items-center gap-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-md">
              <Image src={p.img} alt={p.name} fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
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
      <div className="flex flex-col justify-center px-9 py-9">
        <Blk>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f3e9dc]/15 px-3 py-1 text-[11px] text-[#cdb9a3]">
            <span className="size-1.5 rounded-full bg-[#e8a25c]" />
            Northbound Coffee · New roast
          </span>
        </Blk>
        <Blk>
          <p className="mt-5 text-[52px] font-semibold leading-[0.92] tracking-[-0.05em] md:text-[62px]">
            Meet
            <br />
            <span className="text-[#e8a25c]">Night Shift.</span>
          </p>
        </Blk>
        <Blk>
          <p className="mt-4 max-w-[34ch] text-[15px] leading-[23px] text-[#cdb9a3]">A dark roast for late builds and early mornings. Smooth, heavy, never bitter.</p>
        </Blk>
        <Blk className="mt-5 flex flex-wrap gap-2">
          {["Dark chocolate", "Black cherry", "Molasses"].map((n) => (
            <span key={n} className="rounded-full bg-[#f3e9dc]/[0.07] px-3 py-1 text-[12px] text-[#e9d9c6]">
              {n}
            </span>
          ))}
        </Blk>
        <Blk className="mt-7">
          <AnimatePresence mode="wait" initial={false}>
            {joined ? (
              <motion.p key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 text-[14px] text-[#e8a25c]">
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
                <button type="submit" className="rounded-lg bg-[#e8a25c] px-5 py-3 text-[14px] font-semibold text-[#17110d] transition-transform active:scale-[0.97]">
                  Notify me
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Blk>
      </div>
      <Blk className="relative min-h-[260px] overflow-hidden bg-[#c9a27a]">
        <Image src={P.coffeeBag} alt="An unbranded kraft coffee bag" fill sizes="(min-width: 768px) 460px, 100vw" className="object-cover" />
        <span className="absolute right-4 top-4 rounded-full bg-[#17110d] px-3 py-1.5 text-[11px] font-medium text-[#e8a25c]">Ships Friday</span>
        <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-xl bg-[#17110d]/85 p-2 pr-4 backdrop-blur">
          <span className="relative size-10 overflow-hidden rounded-lg">
            <Image src={P.coffeeBeans} alt="Coffee beans and a cup" fill sizes="40px" className="object-cover" />
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

function Dashboard() {
  const [range, setRange] = useState<keyof typeof RANGES>("30d");
  const [hover, setHover] = useState<number | null>(null);
  const data = RANGES[range];
  const max = 70;
  const W = 600;
  const H = 180;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - (v / max) * H] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H}Z`;
  const hv = hover ?? data.length - 1;

  return (
    <div className="flex h-full flex-col bg-[#f7f8fb] text-[#14161f]">
      <Blk className="flex items-center justify-between border-b border-black/[0.06] bg-white px-6 py-3.5">
        <span className="flex items-center gap-2 text-[14px] font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-[#5b74ff] text-[11px] text-white">o</span>
          Revenue, every Monday
        </span>
        <span className="flex rounded-lg bg-[#eef0f5] p-0.5 text-[12px]" role="tablist" aria-label="Range">
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
              className={`rounded-md px-3 py-1 transition-colors ${range === r ? "bg-white font-medium shadow-sm" : "text-[#7a7f8c]"}`}
            >
              {r}
            </button>
          ))}
        </span>
      </Blk>
      <div className="grid gap-3 px-6 pt-5 sm:grid-cols-3">
        {[
          ["Revenue", "$412k", "+6.1%"],
          ["Active accounts", "318", "+12"],
          ["Churn", "1.2%", "-0.4%"],
        ].map(([k, v, d]) => (
          <Blk key={k} className="rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
            <p className="text-[12px] text-[#7a7f8c]">{k}</p>
            <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em]">{v}</p>
            <p className="text-[12px] text-[#2f8a5f]">{d} this period</p>
          </Blk>
        ))}
      </div>
      <Blk className="mx-6 my-4 flex-1 rounded-xl bg-white p-4 ring-1 ring-black/[0.05]">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[12px] text-[#7a7f8c]">Weekly revenue, hover to inspect</p>
          <p className="text-[13px] font-semibold">
            ${data[hv]}k <span className="font-normal text-[#7a7f8c]">week {hv + 1}</span>
          </p>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[150px] w-full cursor-crosshair overflow-visible"
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
              <stop offset="0%" stopColor="#5b74ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#5b74ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={area} fill="url(#dashArea)" animate={{ d: area }} transition={{ duration: 0.5, ease }} />
          <motion.path d={line} fill="none" stroke="#5b74ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" animate={{ d: line }} transition={{ duration: 0.5, ease }} />
          <line x1={pts[hv][0]} x2={pts[hv][0]} y1={0} y2={H} stroke="#14161f" strokeOpacity="0.12" vectorEffect="non-scaling-stroke" />
          <circle cx={pts[hv][0]} cy={pts[hv][1]} r="5" fill="#fff" stroke="#5b74ff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </Blk>
    </div>
  );
}

/* ------------------------------------------------------------ 4. Time saved calculator */

function Slider({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-[13px]">
        <span className="text-[#5b5f7a]">{label}</span>
        <span className="font-semibold tabular-nums">
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-range mt-2 w-full"
        style={{ background: `linear-gradient(90deg, #5b5bd6 ${pct}%, #dcdcf3 ${pct}%)` }}
      />
    </label>
  );
}

function Calculator() {
  const [team, setTeam] = useState(12);
  const [reports, setReports] = useState(6);
  const [minutes, setMinutes] = useState(35);
  const hours = (team * reports * minutes * 4.3) / 60;
  const spring = useSpring(hours, { stiffness: 120, damping: 20 });
  useEffect(() => {
    spring.set(hours);
  }, [hours, spring]);
  const shown = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const money = useTransform(spring, (v) => `$${Math.round(v * 60).toLocaleString()}`);

  return (
    <div className="grid h-full grid-cols-1 bg-[#f4f2ff] text-[#1b1a3a] sm:grid-cols-[1fr_1fr]">
      <div className="flex flex-col justify-center gap-6 px-9 py-8">
        <Blk>
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#5b5bd6]">Orbit · Calculator</p>
          <p className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em]">How much time will Scheduled Reports save?</p>
        </Blk>
        <Blk>
          <Slider label="People on your team" value={team} min={2} max={60} unit="" onChange={setTeam} />
        </Blk>
        <Blk>
          <Slider label="Reports each week" value={reports} min={1} max={20} unit="" onChange={setReports} />
        </Blk>
        <Blk>
          <Slider label="Minutes per report" value={minutes} min={5} max={90} step={5} unit="min" onChange={setMinutes} />
        </Blk>
      </div>
      <Blk className="m-4 flex flex-col justify-center rounded-2xl bg-[#1b1a3a] p-8 text-white">
        <p className="text-[13px] text-white/60">Your team gets back</p>
        <p className="mt-2 text-[72px] font-semibold leading-none tracking-[-0.05em]">
          <motion.span>{shown}</motion.span>
          <span className="text-[28px] text-white/60"> hrs</span>
        </p>
        <p className="mt-1 text-[14px] text-white/60">every month</p>
        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="text-[13px] text-white/60">Worth about</p>
          <p className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[#b9b3ff]">
            <motion.span>{money}</motion.span>
          </p>
          <p className="text-[12px] text-white/50">at $60 an hour</p>
        </div>
      </Blk>
    </div>
  );
}

/* ------------------------------------------------------------ the section */

const apps = [
  { tab: "Website", url: "hearth.studio", ask: "Build a website for our ceramics studio. Warm, calm, and easy to shop.", App: Hearth },
  { tab: "Launch page", url: "northbound.coffee/night-shift", ask: "Make a launch page for Night Shift, our new dark roast, with a signup.", App: NightShift },
  { tab: "Dashboard", url: "orbit.app/revenue", ask: "Turn our revenue data into a dashboard the team checks every Monday.", App: Dashboard },
  { tab: "Calculator", url: "orbit.com/time-saved", ask: "Build a calculator that shows how much time Scheduled Reports saves.", App: Calculator },
];

export function ChBuild() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [building, setBuilding] = useState(false);
  const { App } = apps[tab];

  const choose = (i: number) => {
    if (i === tab) return;
    setTab(i);
    if (reduce) return;
    setBuilding(true);
    window.setTimeout(() => setBuilding(false), 1100);
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
            scrollTrigger: { trigger: ".build-stage", start: "top 95%", end: "top 25%", scrub: 0.6 },
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
            <ChapterIntro id="build-title" lead="Imagine it." muted="Make it an app." sub="Describe it in a sentence. Juno builds it on your data, ready to use and share." />
          </Reveal>
          <div className="flex max-w-full gap-6 overflow-x-auto pb-1 [scrollbar-width:none] max-md:[mask-image:linear-gradient(90deg,#000_85%,transparent)] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Apps Juno built">
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
                {i === tab && <motion.span layoutId="build-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#A6BBFF]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="build-stage mt-10 md:mt-14" style={{ perspective: 1600 }}>
          {/* what Juno was asked */}
          <div className="mx-auto mb-5 flex max-w-[760px] items-center gap-3 rounded-full border border-white/10 bg-[#11151E]/80 py-2 pl-2 pr-4 backdrop-blur-md">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1b2134] text-[11px] font-semibold text-[#C9D5FF] ring-1 ring-white/10">MC</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="flex-1 truncate text-[14px] text-text md:text-[15px]">
                {apps[tab].ask}
              </motion.p>
            </AnimatePresence>
            <span className={`hidden shrink-0 items-center gap-1.5 text-[13px] sm:inline-flex ${building ? "text-muted" : "text-[#A6BBFF]"}`}>
              {building ? (
                <span className="shimmer-text">Juno is building</span>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.25} aria-hidden />
                  Built by Juno
                </>
              )}
            </span>
          </div>

          {/* the app */}
          <div className="build-frame mx-auto max-w-[1080px] overflow-hidden rounded-[20px] bg-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95)]" style={{ transformOrigin: "50% 0%" }}>
            <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#EDEDEA] px-4 py-3">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="size-2.5 rounded-full bg-[#28C840]" />
              </span>
              <span className="mx-auto w-full max-w-[420px] truncate rounded-md bg-white px-3 py-1 text-center text-[12px] text-[#7a7f8c] ring-1 ring-black/[0.05]">{apps[tab].url}</span>
            </div>
            <div className="relative md:h-[560px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  className="h-full"
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
                >
                  <App />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
