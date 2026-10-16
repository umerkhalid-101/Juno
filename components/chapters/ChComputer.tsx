"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  Check,
  Download,
  Lock,
  MousePointer2,
  Plane,
  RotateCcw,
  Search,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MascotMark } from "@/components/mascot/Mascot";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";

/**
 * "And a computer of its own to handle the rest."
 * Hard, multi-window jobs on tools with no integration. Juno works them like a person
 * would, makes a judgment call along the way, and asks before the final action.
 *
 * Each job is a script of steps. A step optionally moves Juno's cursor to a target and
 * clicks, then advances `stage`. Each job's screen renders from `stage`.
 */

type Step = { target?: string; wait?: number };
type LogLine = { t: string; at: number; flag?: boolean };
type Job = {
  tab: string;
  ask: string;
  steps: Step[];
  log: LogLine[];
  final: string;
  Screen: (p: { stage: number }) => ReactNode;
};

/* ------------------------------------------------------------ shared window chrome */

function Win({
  title,
  url,
  front,
  className,
  children,
}: {
  title: string;
  url: string;
  front: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      animate={{ scale: front ? 1 : 0.97, opacity: front ? 1 : 0.72 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className={`absolute overflow-hidden rounded-xl bg-white text-[#14161f] shadow-[0_24px_60px_-20px_rgba(10,14,40,0.55)] ring-1 ring-black/10 ${className}`}
      style={{ zIndex: front ? 5 : 2 }}
    >
      <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F1F1F4] px-3 py-2">
        <span className="flex gap-1">
          <span className="size-2 rounded-full bg-[#FF5F57]" />
          <span className="size-2 rounded-full bg-[#FEBC2E]" />
          <span className="size-2 rounded-full bg-[#28C840]" />
        </span>
        <span className="text-[11px] font-medium text-[#3a3f4f]">{title}</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-[#9aa0ad]">
          <Lock size={9} strokeWidth={2} aria-hidden />
          {url}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

const Fade = ({
  on,
  children,
  className = "",
}: {
  on: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={false}
    animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------ job 1: reconcile the cloud bill */

const charges = [
  { date: "Oct 1", amount: "$2,140", match: "INV-1041", bad: false },
  { date: "Oct 1", amount: "$2,140", match: "Duplicate charge", bad: true },
  { date: "Oct 15", amount: "$1,980", match: "INV-1052", bad: false },
];

function ReconcileScreen({ stage }: { stage: number }) {
  const sheetFront = stage >= 3 && stage < 6;
  const rows = stage >= 3 ? Math.min(3, stage - 2) : 0;
  const dispute = stage >= 6;
  return (
    <>
      <Win
        title="CloudHost"
        url="billing.cloudhost.example"
        front={!sheetFront}
        className="left-0 top-0 h-[80%] w-[84%]"
      >
        <div className="t-portal flex items-center gap-4 border-b border-black/[0.06] px-4 py-2.5 text-[12px] text-[#5b6070]">
          <span className="font-semibold text-[#14161f]">Billing</span>
          <span
            className={`t-invtab ${!dispute ? "text-[#14161f] underline decoration-[#5b74ff] underline-offset-[9px]" : ""}`}
          >
            Invoices
          </span>
          <span
            className={
              dispute ? "text-[#14161f] underline decoration-[#5b74ff] underline-offset-[9px]" : ""
            }
          >
            Disputes
          </span>
        </div>
        {!dispute ? (
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium">October invoices</p>
              <span className="t-download inline-flex items-center gap-1.5 rounded-md border border-black/10 px-2.5 py-1 text-[11px]">
                <Download size={11} strokeWidth={2} aria-hidden />
                {stage >= 2 ? "Downloaded" : "Download all"}
              </span>
            </div>
            <Fade
              on={stage >= 1}
              className="divide-y divide-black/[0.06] rounded-lg ring-1 ring-black/[0.06]"
            >
              {[
                ["INV-1041", "Oct 1", "$2,140"],
                ["INV-1043", "Oct 1", "$2,140"],
                ["INV-1052", "Oct 15", "$1,980"],
              ].map(([a, b, c]) => (
                <div key={a} className="grid grid-cols-3 px-3 py-2.5 text-[12px] text-[#3a3f4f]">
                  <span className="font-medium text-[#14161f]">{a}</span>
                  <span>{b}</span>
                  <span className="text-right">{c}</span>
                </div>
              ))}
            </Fade>
          </div>
        ) : (
          <div className="space-y-2.5 p-4">
            <p className="text-[13px] font-medium">Open a billing dispute</p>
            {[
              ["Invoice", "INV-1043"],
              ["Reason", "Charged twice on Oct 1 for the same plan"],
              ["Amount", "$2,140"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="mb-1 text-[10px] uppercase tracking-[0.08em] text-[#9aa0ad]">{k}</p>
                <div className="rounded-md px-2.5 py-2 text-[12px] ring-1 ring-black/10">{v}</div>
              </div>
            ))}
            <span className="t-submit inline-block rounded-md bg-[#14161f] px-3 py-1.5 text-[11px] font-medium text-white">
              Submit dispute
            </span>
          </div>
        )}
      </Win>
      <Win
        title="October reconciliation"
        url="sheets"
        front={sheetFront}
        className="bottom-0 right-0 h-[64%] w-[82%]"
      >
        <div className="t-sheet border-b border-black/[0.06] px-3 py-1.5 text-[10px] text-[#9aa0ad]">
          fx
        </div>
        <div className="text-[11px] text-[#3a3f4f]">
          <div className="grid grid-cols-[60px_1fr_70px_1.3fr] bg-[#F6F7F9] px-3 py-1.5 font-medium text-[#7a7f8c]">
            <span>Date</span>
            <span>Bank charge</span>
            <span className="text-right">Amount</span>
            <span className="pl-4">Matched to</span>
          </div>
          {charges.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-[60px_1fr_70px_1.3fr] items-center border-t border-black/[0.05] px-3 py-2 ${r.bad && i < rows ? "bg-[#fdecec]" : ""}`}
              style={{ opacity: i < rows ? 1 : 0.3 }}
            >
              <span>{r.date}</span>
              <span>CloudHost</span>
              <span className="text-right">{r.amount}</span>
              <span
                className={`flex items-center gap-1.5 pl-4 ${r.bad ? "font-medium text-[#c63a3a]" : "text-[#2f8a5f]"}`}
              >
                {i < rows &&
                  (r.bad ? (
                    <AlertTriangle size={11} strokeWidth={2.25} aria-hidden />
                  ) : (
                    <Check size={11} strokeWidth={2.5} aria-hidden />
                  ))}
                {i < rows ? r.match : ""}
              </span>
            </div>
          ))}
          <div className="border-t border-black/[0.05] px-3 py-2 text-[#9aa0ad]">
            {rows >= 3 ? "+ 39 more charges, all matched" : ""}
          </div>
        </div>
      </Win>
    </>
  );
}

/* ------------------------------------------------------------ job 2: book the offsite */

function OffsiteScreen({ stage }: { stage: number }) {
  const front = stage >= 5 ? "cal" : stage >= 3 ? "hotel" : "flights";
  return (
    <>
      <Win
        title="Flights"
        url="flights.example/lisbon"
        front={front === "flights"}
        className="left-0 top-0 h-[70%] w-[72%]"
      >
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-2.5 text-[12px]">
          <Plane size={13} strokeWidth={1.75} className="text-[#5b74ff]" aria-hidden />
          <span>SFO to LIS · Nov 12 · 6 travelers</span>
          <span className="t-search ml-auto inline-flex items-center gap-1 rounded-md bg-[#14161f] px-2.5 py-1 text-[11px] text-white">
            <Search size={11} aria-hidden />
            Search
          </span>
        </div>
        <Fade on={stage >= 1} className="space-y-1.5 p-3">
          {[
            { a: "TAP", t: "7:40 AM · nonstop · 11h 05m", p: "$412", best: true },
            { a: "United", t: "9:15 AM · 1 stop · 15h 40m", p: "$389", best: false },
            { a: "Lufthansa", t: "6:05 PM · 1 stop · 14h 20m", p: "$455", best: false },
          ].map((f) => (
            <div
              key={f.a}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] ring-1 transition-colors ${
                f.best && stage >= 2 ? "bg-[#eef1ff] ring-[#5b74ff]/50" : "ring-black/[0.06]"
              } ${f.best ? "t-pick" : ""}`}
            >
              <span className="w-16 font-semibold">{f.a}</span>
              <span className="flex-1 text-[#5b6070]">{f.t}</span>
              <span className="font-semibold">{f.p}</span>
              {f.best && stage >= 2 && (
                <Check size={12} strokeWidth={2.5} className="text-[#5b74ff]" aria-hidden />
              )}
            </div>
          ))}
        </Fade>
      </Win>
      <Win
        title="Hotels"
        url="stay.example/lisbon"
        front={front === "hotel"}
        className="right-0 top-[10%] h-[62%] w-[66%]"
      >
        <div className="t-hotel border-b border-black/[0.06] px-4 py-2.5 text-[12px]">
          Lisbon · Nov 12 to 14 · 6 rooms · under $180/night
        </div>
        <div className="space-y-1.5 p-3">
          {[
            { n: "Hotel Mirador", p: "$240/night", over: true },
            { n: "Casa Alfama", p: "$165/night", over: false },
            { n: "Baixa Grand", p: "$215/night", over: true },
          ].map((h) => (
            <div
              key={h.n}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[12px] ring-1 ring-black/[0.06] ${h.over && stage >= 3 ? "opacity-40 line-through" : ""}`}
            >
              <span className="flex-1 font-medium">{h.n}</span>
              <span>{h.p}</span>
              {!h.over && (
                <span
                  className={`t-hold rounded-md px-2 py-0.5 text-[11px] ${stage >= 4 ? "bg-[#e5f2ea] text-[#2f8a5f]" : "bg-[#14161f] text-white"}`}
                >
                  {stage >= 4 ? "6 rooms held" : "Hold"}
                </span>
              )}
            </div>
          ))}
        </div>
      </Win>
      <Win
        title="Calendar"
        url="calendar"
        front={front === "cal"}
        className="bottom-0 left-[8%] h-[46%] w-[84%]"
      >
        <div className="t-cal grid grid-cols-5 border-b border-black/[0.06] text-center text-[10px] text-[#9aa0ad]">
          {["Mon 11", "Tue 12", "Wed 13", "Thu 14", "Fri 15"].map((d) => (
            <span key={d} className="py-1.5">
              {d}
            </span>
          ))}
        </div>
        <div className="relative h-[calc(100%-26px)]">
          <Fade
            on={stage >= 5}
            className="absolute inset-y-3 left-[21%] w-[57%] rounded-lg bg-[#eef1ff] p-2.5 text-[11px] ring-1 ring-[#5b74ff]/30"
          >
            <p className="font-semibold text-[#3346e0]">Lisbon offsite</p>
            <p className="text-[#5b6070]">TAP 7:40 AM · Casa Alfama · 6 people</p>
          </Fade>
        </div>
      </Win>
    </>
  );
}

/* ------------------------------------------------------------ job 3: update supplier prices */

const skus = [
  ["SR-PDF-01", "$24.00", "$26.50"],
  ["SR-CSV-02", "$18.00", "$19.00"],
  ["SR-API-03", "$42.00", "$45.00"],
  ["SR-OLD-17", "$12.00", "$13.00"],
];

function PricesScreen({ stage }: { stage: number }) {
  const portalFront = stage >= 2;
  const done = stage >= 4 ? 38 : stage >= 3 ? 14 : stage >= 2 ? 1 : 0;
  return (
    <>
      <Win
        title="Price sheet, Q4"
        url="sheets"
        front={!portalFront}
        className="left-0 top-0 h-[66%] w-[62%]"
      >
        <div className="t-sheet text-[11px] text-[#3a3f4f]">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-[#F6F7F9] px-3 py-1.5 font-medium text-[#7a7f8c]">
            <span>SKU</span>
            <span>Old</span>
            <span>New</span>
          </div>
          {skus.map(([s, o, n]) => (
            <div
              key={s}
              className={`grid grid-cols-[1.3fr_1fr_1fr] border-t border-black/[0.05] px-3 py-1.5 ${stage >= 1 ? "bg-[#f6f8ff]" : ""}`}
            >
              <span className="font-medium text-[#14161f]">{s}</span>
              <span>{o}</span>
              <span className="font-medium text-[#3346e0]">{n}</span>
            </div>
          ))}
          <div className="border-t border-black/[0.05] px-3 py-1.5 text-[#9aa0ad]">
            + 36 more rows
          </div>
        </div>
      </Win>
      <motion.div
        animate={{ scale: portalFront ? 1 : 0.97, opacity: portalFront ? 1 : 0.72 }}
        className="absolute bottom-0 right-0 h-[74%] w-[70%] overflow-hidden rounded-md bg-[#d9d9d2] text-[#1a1a1a] shadow-[0_24px_60px_-20px_rgba(10,14,40,0.55)] ring-1 ring-black/20"
        style={{ zIndex: portalFront ? 5 : 2, fontFamily: "Tahoma, Verdana, sans-serif" }}
      >
        <div className="t-portal flex items-center justify-between bg-[#24447a] px-3 py-1.5 text-[11px] font-bold text-white">
          <span>SupplyNet Vendor Portal v3.2</span>
          <span className="font-normal">Logged in: orbit-buyer</span>
        </div>
        <div className="p-2.5 text-[11px]">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold">Item price maintenance</span>
            <span className="t-save border border-[#7a7a72] bg-[#ecece6] px-2 py-0.5">
              {stage >= 6 ? "Saved as draft" : "Save draft"}
            </span>
          </div>
          <table className="w-full border-collapse bg-white">
            <tbody>
              {skus.map(([s, , n], i) => {
                const missing = s === "SR-OLD-17";
                const updated = i < Math.min(done, 3);
                return (
                  <tr
                    key={s}
                    className={`border border-[#b9b9b0] ${missing && stage >= 5 ? "bg-[#fde2e2]" : updated ? "bg-[#e6f4e6]" : ""}`}
                  >
                    <td className="px-2 py-1">{s}</td>
                    <td className="px-2 py-1">
                      {missing && stage >= 5 ? "Not found" : updated ? n : "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-2.5 h-2 border border-[#7a7a72] bg-white">
            <motion.div
              className="h-full bg-[#3a8a3a]"
              animate={{ width: `${(done / 40) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="mt-1 text-[10px]">{done} of 40 items updated</p>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------ the jobs */

const jobs: Job[] = [
  {
    tab: "Reconcile a bill",
    ask: "Reconcile October's cloud bill and flag anything wrong.",
    steps: [
      { target: ".t-invtab" },
      { target: ".t-download" },
      { target: ".t-sheet" },
      { wait: 0.5 },
      { wait: 0.5 },
      { target: ".t-portal" },
      { target: ".t-submit" },
    ],
    log: [
      { t: "Signed in to CloudHost. No API, so I'm using the site.", at: 1 },
      { t: "Downloaded 3 October invoices", at: 2 },
      { t: "Found a duplicate charge: $2,140 on Oct 1", at: 4, flag: true },
      { t: "Matched the other 41 bank charges", at: 5 },
      { t: "Drafted a dispute for INV-1043", at: 6 },
    ],
    final: "Submit a $2,140 dispute for the double charge?",
    Screen: ReconcileScreen,
  },
  {
    tab: "Book an offsite",
    ask: "Book the Lisbon offsite for 6 people, under $6k: flights, hotel, calendar.",
    steps: [
      { target: ".t-search" },
      { target: ".t-pick" },
      { target: ".t-hotel" },
      { target: ".t-hold" },
      { target: ".t-cal" },
      { wait: 0.6 },
    ],
    log: [
      { t: "Compared 18 flights across 3 airlines", at: 1 },
      { t: "Picked the 7:40 AM nonstop, $412 each. The cheaper one adds 4 hours.", at: 2 },
      { t: "Skipped 2 hotels over your $180 nightly limit", at: 3, flag: true },
      { t: "Held 6 rooms at Casa Alfama, $1,980", at: 4 },
      { t: "Added the itinerary to everyone's calendar", at: 5 },
      { t: "Total $4,452, $1,548 under budget", at: 6 },
    ],
    final: "Book flights and hotel for $4,452?",
    Screen: OffsiteScreen,
  },
  {
    tab: "Update 40 prices",
    ask: "Update all 40 prices in the supplier portal from the new price sheet.",
    steps: [
      { target: ".t-sheet" },
      { target: ".t-portal" },
      { wait: 0.8 },
      { wait: 0.9 },
      { wait: 0.6 },
      { target: ".t-save" },
    ],
    log: [
      { t: "Read 40 new prices from the Q4 sheet", at: 1 },
      { t: "Signed in to SupplyNet. No API, so I'm editing by hand.", at: 2 },
      { t: "Updated 38 of 40 items", at: 4 },
      { t: "2 SKUs aren't in the portal. Left a note for Sam.", at: 5, flag: true },
      { t: "Saved as a draft. Nothing is live yet.", at: 6 },
    ],
    final: "Publish the 38 price changes?",
    Screen: PricesScreen,
  },
];

/* ------------------------------------------------------------ the section */

export function ChComputer() {
  const root = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const buildRef = useRef<((j: number) => gsap.core.Timeline) | null>(null);
  const [jobIdx, setJobIdx] = useState(0);
  const job = jobs[jobIdx];
  // final state by default (no JS, reduced motion)
  const [stage, setStage] = useState(job.steps.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const c = screen.current;
        if (!c) return;
        const q = gsap.utils.selector(c);
        // targets are measured as each move starts; if not rendered yet, stay put
        const at = (sel: string, axis: "x" | "y") => () => {
          const target = q(sel)[0] as HTMLElement | undefined;
          if (!target) return Number(gsap.getProperty(".jc-cursor", axis)) || 0;
          const box = c.getBoundingClientRect();
          const r = target.getBoundingClientRect();
          return axis === "x"
            ? r.left - box.left + Math.min(r.width * 0.5, 50)
            : r.top - box.top + r.height * 0.55;
        };
        const click = () =>
          gsap.fromTo(
            ".jc-ripple",
            { scale: 0, opacity: 0.55 },
            { scale: 2.6, opacity: 0, duration: 0.45, ease: "power2.out" },
          );

        const build = (j: number) => {
          const steps = jobs[j].steps;
          const tl = gsap.timeline({ paused: true });
          tl.call(() => setStage(0))
            .set(".jc-cursor", { x: 60, y: 260, opacity: 0 })
            .to(".jc-cursor", { opacity: 1, duration: 0.25 }, "+=0.2");
          steps.forEach((s, i) => {
            if (s.target) {
              tl.to(
                ".jc-cursor",
                {
                  x: at(s.target, "x"),
                  y: at(s.target, "y"),
                  duration: 0.75,
                  ease: "power2.inOut",
                },
                "+=0.35",
              ).call(click);
            } else {
              tl.to({}, { duration: s.wait ?? 0.5 });
            }
            tl.call(() => setStage(i + 1));
          });
          tl.to(".jc-cursor", { opacity: 0.35, duration: 0.4 }, "+=0.5");
          return tl;
        };
        buildRef.current = build;
        const first = build(0);
        tlRef.current = first;
        first.progress(0).pause();
        // reset to a blank desktop just before it scrolls into view, then start
        ScrollTrigger.create({
          trigger: c,
          start: "top 98%",
          once: true,
          onEnter: () => setStage(0),
        });
        ScrollTrigger.create({
          trigger: c,
          start: "top 70%",
          once: true,
          onEnter: () => first.play(0),
        });
        return () => {
          tlRef.current?.kill();
          tlRef.current = null;
          buildRef.current = null;
        };
      });
    },
    { scope: root },
  );

  const run = (j: number) => {
    setJobIdx(j);
    const build = buildRef.current;
    if (!build) {
      setStage(jobs[j].steps.length);
      return;
    }
    tlRef.current?.kill();
    const tl = build(j);
    tlRef.current = tl;
    tl.play(0);
  };

  const finished = stage >= job.steps.length;
  const Screen = job.Screen;

  return (
    <section ref={root} id="computer" aria-labelledby="computer-title" className="chapter">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[900px] text-center">
          <h2 id="computer-title" className="t-display-l text-balance">
            And a computer of its own <span className="accent-text block">to handle the rest.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-[17px] leading-[27px] text-muted">
            No integration? Juno signs in, clicks through, and does the hard part on its own secure
            computer.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 w-full max-w-[860px] md:mt-16">
          {/* job picker */}
          <div
            className="mb-5 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Jobs Juno can do on its computer"
          >
            {jobs.map((j, i) => (
              <button
                key={j.tab}
                type="button"
                role="tab"
                aria-selected={i === jobIdx}
                onClick={() => run(i)}
                className={`h-10 rounded-full border px-4 text-[14px] transition-colors ${
                  i === jobIdx
                    ? "border-[#A6BBFF]/40 bg-[#A6BBFF]/10 text-text"
                    : "border-white/10 text-muted hover:text-text"
                }`}
              >
                {j.tab}
              </button>
            ))}
          </div>

          {/* the job as asked */}
          <div className="mx-auto mb-6 flex w-fit max-w-full items-center gap-3 rounded-full border border-white/10 bg-[#11151E]/80 py-2 pl-2 pr-5 backdrop-blur-md">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1b2134] text-[11px] font-semibold text-[#C9D5FF] ring-1 ring-white/10">
              MC
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={jobIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="truncate text-[14px] text-text md:text-[15px]"
              >
                {job.ask}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* a dark laptop */}
          <div className="relative rounded-t-[22px] rounded-b-[6px] bg-[linear-gradient(180deg,#2a2c31,#16171a)] p-[10px] pb-[12px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] md:p-[12px] md:pb-[14px]">
            <div className="relative overflow-hidden rounded-[12px] bg-black p-[2px]">
              <span
                aria-hidden
                className="absolute left-1/2 top-0 z-40 h-[14px] w-[110px] -translate-x-1/2 rounded-b-[8px] bg-black"
              />
              <div
                ref={screen}
                className="relative h-[440px] overflow-hidden rounded-[10px] bg-[radial-gradient(120%_120%_at_0%_0%,#cfd8ff_0%,#9aa9f0_40%,#6f7fd8_100%)] md:h-[500px]"
                role="img"
                aria-label={`Juno's own computer working on: ${job.ask}`}
              >
                <div className="absolute inset-y-5 left-4 right-4 md:right-[262px]">
                  <Screen stage={stage} />
                </div>

                {/* Juno's live log */}
                <div className="absolute bottom-4 right-4 top-5 hidden w-[236px] flex-col rounded-2xl bg-[#0f1320]/92 p-4 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 backdrop-blur-xl md:flex">
                  <div className="mb-3 flex items-center gap-2.5">
                    <MascotMark size={26} />
                    <span className="flex-1">
                      <span className="block text-[13px] font-semibold">Juno</span>
                      <span className="block text-[11px] text-white/50">
                        {finished ? "Waiting for you" : "Working on its computer"}
                      </span>
                    </span>
                    {!finished && (
                      <span className="size-1.5 animate-pulse rounded-full bg-[#A6BBFF]" />
                    )}
                  </div>
                  <ul className="min-h-0 flex-1 space-y-2 overflow-hidden">
                    {job.log.map((l) => (
                      <motion.li
                        key={`${jobIdx}-${l.t}`}
                        initial={false}
                        animate={{ opacity: stage >= l.at ? 1 : 0, y: stage >= l.at ? 0 : 6 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-2 text-[11.5px] leading-[16px] ${l.flag ? "text-[#ffcf8a]" : "text-white/85"}`}
                      >
                        <span
                          className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ${l.flag ? "bg-[#ffb547]/25" : "bg-[#A6BBFF]/20"}`}
                        >
                          {l.flag ? (
                            <AlertTriangle size={9} strokeWidth={2.5} aria-hidden />
                          ) : (
                            <Check size={9} strokeWidth={3} aria-hidden />
                          )}
                        </span>
                        {l.t}
                      </motion.li>
                    ))}
                  </ul>
                  <AnimatePresence>
                    {finished && (
                      <motion.div
                        key={`ask-${jobIdx}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-xl bg-white/[0.06] p-3 ring-1 ring-white/10"
                      >
                        <p className="text-[12px] text-[#ffcf8a]">Needs you</p>
                        <p className="mt-1 text-[13px] leading-[18px]">{job.final}</p>
                        <span className="mt-3 flex gap-2">
                          <span className="flex-1 rounded-full bg-[#A6BBFF] py-1.5 text-center text-[12px] font-medium text-[#07111F]">
                            Approve
                          </span>
                          <span className="rounded-full px-3 py-1.5 text-[12px] text-white/60">
                            Review
                          </span>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Juno's cursor */}
                <div
                  aria-hidden
                  className="jc-cursor pointer-events-none absolute left-0 top-0 z-30 opacity-0"
                >
                  <span className="jc-ripple absolute -left-3 -top-3 size-6 rounded-full bg-[#5b74ff] opacity-0" />
                  <MousePointer2
                    size={22}
                    strokeWidth={1.5}
                    className="relative fill-[#5b74ff] text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]"
                  />
                  <span className="absolute left-5 top-6 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1b2134] py-1 pl-1 pr-3 text-[12px] font-medium text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)]">
                    <MascotMark size={18} />
                    Juno
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden
            className="relative -mx-[6%] h-[14px] rounded-b-[18px] rounded-t-[3px] bg-[linear-gradient(180deg,#3a3c42_0%,#1c1d21_60%,#0e0f11_100%)] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)]"
          >
            <span className="absolute left-1/2 top-0 h-[6px] w-[16%] -translate-x-1/2 rounded-b-[8px] bg-[#121316]" />
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => run(jobIdx)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[13px] text-muted transition-colors hover:text-text"
            >
              <RotateCcw size={14} strokeWidth={1.5} aria-hidden />
              Watch again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
