"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { BookOpen, CalendarClock, Check, Database, Eye, FileText, LineChart, Mail, MessageSquareQuote, Send, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MascotMark } from "@/components/mascot/Mascot";
import { ToolLogo } from "@/components/ui/ToolLogo";
import type { ToolId } from "@/lib/story";
import { IMG } from "@/lib/images";

/**
 * "Set it once. Leave it to Juno."
 * A sequencer for the company's routine. Switches flip on once, then the weeks flow past
 * a "now" line. Each time work crosses it, the panel below shows the real report that
 * went out and the chain behind it: when, what it read, what it wrote, where it went.
 */

const INK = "#14161f";
const BEANS = IMG.coffeeLatte;

type Lane = {
  id: string;
  icon: LucideIcon;
  name: string;
  when: string;
  reads: ToolId[];
  sends: string;
  sendsTo: ToolId;
  days: (week: number) => number[];
};

const lanes: Lane[] = [
  { id: "growth", icon: LineChart, name: "Growth pulse", when: "Mondays, 9:00 AM", reads: ["hubspot", "linear"], sends: "#leadership", sendsTo: "slack", days: () => [0] },
  { id: "comp", icon: Eye, name: "Competitor watch", when: "Wednesdays, 2:00 PM", reads: ["drive", "notion"], sends: "#product", sendsTo: "slack", days: () => [2] },
  { id: "blog", icon: BookOpen, name: "Blog post", when: "Thursdays, 10:00 AM", reads: ["notion", "figma"], sends: "Draft in Notion", sendsTo: "notion", days: () => [3] },
  { id: "voice", icon: MessageSquareQuote, name: "Customer voice", when: "Fridays, 4:00 PM", reads: ["intercom", "gmail"], sends: "#customers", sendsTo: "slack", days: () => [4] },
  { id: "inv", icon: Mail, name: "Investor update", when: "1st of every month", reads: ["hubspot", "drive"], sends: "Investors, by email", sendsTo: "gmail", days: (w) => (w % 4 === 0 ? [0] : []) },
];

const WEEKS = 12;
const WEEK_W = 190;
const DAY_W = WEEK_W / 5;
const ROW_H = 60;
const HEAD = 56;
const SPEED = 48; // px per second
const START = new Date(2026, 9, 5); // Mon, Oct 5 2026

const dateOf = (week: number, day: number) =>
  new Date(START.getFullYear(), START.getMonth(), START.getDate() + (week % WEEKS) * 7 + day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
const pick = <T,>(arr: T[], i: number) => arr[((i % arr.length) + arr.length) % arr.length];

type Pill = { key: string; lane: number; week: number; day: number; x: number };
const pills: Pill[] = [];
lanes.forEach((l, li) => {
  for (let w = 0; w < WEEKS; w++) l.days(w).forEach((d) => pills.push({ key: `${l.id}-${w}-${d}`, lane: li, week: w, day: d, x: w * WEEK_W + d * DAY_W + 6 }));
});
const TRACK = WEEKS * WEEK_W;

/* ------------------------------------------------------------ the reports that go out */

function Paper({ kicker, date, children }: { kicker: string; date: string; children: ReactNode }) {
  return (
    <div className="h-full rounded-[20px] bg-[#F7F6F2] p-5" style={{ color: INK }}>
      <div className="mb-2 flex justify-between text-[11px] uppercase tracking-[0.14em] text-[#7a7f8c]">
        <span>{kicker}</span>
        <span className="normal-case tracking-normal">{date}</span>
      </div>
      {children}
    </div>
  );
}

function Report({ lane, w, date }: { lane: number; w: number; date: string }) {
  if (lane === 0) {
    const rows = [
      ["Organic search", 18 + ((w * 5) % 9)],
      ["Referrals", 9 + ((w * 3) % 8)],
      ["Paid ads", 5 + ((w * 7) % 6)],
    ] as const;
    return (
      <Paper kicker="Growth pulse" date={date}>
        <p className="text-[24px] font-semibold leading-[1.05] tracking-[-0.03em]">{pick(["Search is out in front.", "Referrals are climbing.", "Search holds the lead.", "Paid is finally paying."], w)}</p>
        <div className="mt-3 space-y-2">
          {rows.map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[100px_1fr_24px] items-center gap-3 text-[12px]">
              <span className="text-[#5b6070]">{k}</span>
              <span className="h-2 rounded-full bg-black/[0.06]">
                <motion.span
                  className="block h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(v / 30) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * i }}
                  style={{ background: ["#3f6b4c", "#7fa38a", "#b9cdbf"][i] }}
                />
              </span>
              <span className="text-right font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </Paper>
    );
  }
  if (lane === 1) {
    const changes = [
      ["Rival Analytics", "Cut Pro to $49/month", "#d4763a"],
      ["Metricly", "Shipped scheduled PDFs in beta", "#5b74ff"],
      ["Dashloop", "Hiring 6 enterprise sellers", "#9b6bd4"],
    ];
    return (
      <Paper kicker="Competitor watch" date={date}>
        <p className="text-[24px] font-semibold leading-[1.05] tracking-[-0.03em]">{2 + (w % 2)} things changed.</p>
        <div className="mt-3 space-y-1.5">
          {[0, 1].map((i) => {
            const [co, what, c] = pick(changes, w + i);
            return (
              <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-[12px] ring-1 ring-black/[0.05]">
                <span className="grid size-6 place-items-center rounded-md text-[11px] font-semibold text-white" style={{ background: c }}>
                  {co[0]}
                </span>
                <span className="font-medium">{co}</span>
                <span className="truncate text-[#7a7f8c]">{what}</span>
              </div>
            );
          })}
        </div>
      </Paper>
    );
  }
  if (lane === 2) {
    return (
      <div className="flex h-full overflow-hidden rounded-[20px] bg-white" style={{ color: INK }}>
        <div className="relative w-[38%] shrink-0">
          <Image src={BEANS} alt="A latte with leaf art" fill sizes="220px" className="object-cover" />
        </div>
        <div className="p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#7a7f8c]">Blog draft · {date}</p>
          <p className="mt-2 text-[20px] font-semibold leading-[1.15] tracking-[-0.02em]">
            {pick(["Five reports every Monday should start with", "How Northwind cut reporting time in half", "The quiet cost of the screenshot", "What your board actually reads"], w)}
          </p>
          <p className="mt-2 text-[12px] text-[#7a7f8c]">1,200 words · in your voice · 3 sources</p>
        </div>
      </div>
    );
  }
  if (lane === 3) {
    const [q, who] = pick(
      [
        ["Scheduled Reports saved my Mondays.", "Priya Shah, Northwind"],
        ["The PDF finally looks good enough for our board.", "Hannah Okafor, Meridian"],
        ["I wish I could schedule to Slack too.", "Diego Alvarez, Tallyhq"],
      ],
      w,
    );
    const pos = 72 + ((w * 7) % 15);
    return (
      <Paper kicker="Customer voice" date={date}>
        <p className="text-[19px] font-medium leading-[1.3] tracking-[-0.015em]">&ldquo;{q}&rdquo;</p>
        <p className="mt-1 text-[12px] text-[#7a7f8c]">{who}</p>
        <div className="mt-3 flex justify-between text-[12px]">
          <span>64 conversations</span>
          <span className="font-semibold text-[#2f8a5f]">{pos}% positive</span>
        </div>
        <div className="mt-1.5 flex h-2 overflow-hidden rounded-full">
          <span className="bg-[#2f8a5f]" style={{ width: `${pos}%` }} />
          <span className="bg-[#e3c27a]" style={{ width: `${(100 - pos) * 0.7}%` }} />
          <span className="flex-1 bg-[#d96b6b]" />
        </div>
      </Paper>
    );
  }
  const month = new Date(START.getFullYear(), START.getMonth(), START.getDate() + (w % WEEKS) * 7).toLocaleDateString("en-US", { month: "long" });
  return (
    <div className="h-full rounded-[20px] bg-white p-5" style={{ color: INK }}>
      <p className="flex items-center gap-1.5 text-[11px] text-[#7a7f8c]">
        <Mail size={12} strokeWidth={1.75} aria-hidden />
        To investors · {date}, 8:00 AM
      </p>
      <p className="mt-2 text-[13px] text-[#7a7f8c]">Orbit, {month} update</p>
      <div className="mt-1 flex items-end gap-4">
        <p className="text-[34px] font-semibold leading-none tracking-[-0.04em]">${412 + Math.floor(w / 4) * 19}k</p>
        <p className="pb-1 text-[12px] text-[#2f8a5f]">MRR, up 4.6%</p>
      </div>
      <p className="mt-3 text-[13px] leading-5">• Shipped Scheduled Reports · Churn down to 1.2%</p>
    </div>
  );
}

/* ------------------------------------------------------------ the section */

type Latest = { lane: number; week: number; day: number; n: number };

export function ChRepeat() {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pillEls = useRef(new Map<string, HTMLElement>());
  const inView = useInView(panel, { amount: 0.3 });
  const [switches, setSwitches] = useState(lanes.length); // lanes switched on
  const [flowing, setFlowing] = useState(false);
  const [delivered, setDelivered] = useState(0);
  // what just went out (default: a growth pulse, for no JS and reduced motion)
  const [latest, setLatest] = useState<Latest>({ lane: 0, week: 1, day: 0, n: 0 });
  const armed = useRef(false);
  const hold = useRef(false);
  const xRef = useRef<number | null>(null);

  // set it once: switches flip on, one lane at a time, then time starts flowing
  useEffect(() => {
    if (!inView || armed.current || reduce) return;
    armed.current = true;
    const ts = [window.setTimeout(() => setSwitches(0), 0)];
    lanes.forEach((_, i) => ts.push(window.setTimeout(() => setSwitches(i + 1), 500 + i * 240)));
    ts.push(window.setTimeout(() => setFlowing(true), 500 + lanes.length * 240 + 300));
    return () => {
      // scrolled away mid-way: finish the setup instead of leaving it half done
      ts.forEach(window.clearTimeout);
      setSwitches(lanes.length);
      setFlowing(true);
    };
  }, [inView, reduce]);

  // the flow: move the track; whatever crosses "now" is delivered
  useEffect(() => {
    const vp = viewport.current;
    const tr = track.current;
    if (!vp || !tr) return;
    const now = () => vp.clientWidth * 0.62;
    if (xRef.current === null) xRef.current = reduce ? now() - WEEK_W * 3.2 : now() + 28;
    let last = performance.now();
    let raf = 0;

    const paint = (announce: boolean) => {
      const x = xRef.current ?? 0;
      const nowX = now();
      tr.style.transform = `translate3d(${x}px,0,0)`;
      for (let copy = 0; copy < 2; copy++) {
        for (const p of pills) {
          const key = `${p.key}-${copy}`;
          const el = pillEls.current.get(key);
          if (!el) continue;
          const sx = x + copy * TRACK + p.x;
          const done = sx + 14 < nowX;
          if (done === (el.dataset.done === "true")) continue;
          el.dataset.done = String(done);
          if (done && announce && sx > nowX - 40) {
            setDelivered((d) => d + 1);
            setLatest((l) => ({ lane: p.lane, week: p.week, day: p.day, n: l.n + 1 }));
          }
        }
      }
    };

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (flowing && !hold.current && !reduce && xRef.current !== null) {
        xRef.current -= SPEED * dt;
        if (xRef.current <= now() - TRACK) xRef.current += TRACK;
      }
      paint(flowing);
      raf = requestAnimationFrame(frame);
    };
    paint(false);
    if (inView) raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [flowing, inView, reduce]);

  const lane = lanes[latest.lane];
  const hours = Math.round(delivered * 0.75);
  const chain: { icon: LucideIcon; k: string; v: ReactNode }[] = [
    { icon: CalendarClock, k: "When", v: lane.when },
    {
      icon: Database,
      k: "Reads",
      v: (
        <span className="flex items-center gap-2">
          {lane.reads.map((r) => (
            <ToolLogo key={r} id={r} size={14} brand />
          ))}
          <span className="text-muted">this week&apos;s live data</span>
        </span>
      ),
    },
    { icon: FileText, k: "Writes", v: `${lane.name}, in your voice` },
    {
      icon: Send,
      k: "Sends",
      v: (
        <span className="flex items-center gap-2">
          <ToolLogo id={lane.sendsTo} size={14} brand />
          {lane.sends}
        </span>
      ),
    },
  ];

  return (
    <section id="jobs" aria-labelledby="repeat-title" className="chapter">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <h2 id="repeat-title" className="t-display-l text-balance">
            Set it once. <span className="accent-text block">Leave it to Juno.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-[27px] text-muted">
            Switch on the work that repeats. Juno reads the latest data, writes it up, and sends it on schedule.
          </p>
        </Reveal>

        <div
          ref={panel}
          onPointerEnter={() => (hold.current = true)}
          onPointerLeave={() => (hold.current = false)}
          className="relative mt-12 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0d1119] md:mt-16"
        >
          {/* ---------- the schedule ---------- */}
          <div className="grid md:grid-cols-[290px_1fr]">
            <div className="hidden border-r border-white/[0.06] md:block">
              <div className="flex items-center border-b border-white/[0.06] px-5 text-[12px] text-subtle" style={{ height: HEAD }}>
                Automations
              </div>
              {lanes.map((l, i) => {
                const on = i < switches;
                const Icon = l.icon;
                return (
                  <div key={l.id} className="flex items-center gap-3 border-b border-white/[0.04] px-5" style={{ height: ROW_H }}>
                    <Icon size={16} strokeWidth={1.5} className={on ? "text-[#C9D5FF]" : "text-subtle"} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[14px] ${on ? "text-text" : "text-muted"}`}>{l.name}</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-subtle">
                        {l.when.replace(/, .*$/, "")}
                        <span aria-hidden>·</span>
                        {l.reads.map((r) => (
                          <ToolLogo key={r} id={r} size={10} brand />
                        ))}
                        <span aria-hidden>→</span>
                        <ToolLogo id={l.sendsTo} size={10} brand />
                      </span>
                    </span>
                    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${on ? "bg-[#A6BBFF]" : "bg-white/15"}`} role="img" aria-label={`${l.name} ${on ? "on" : "off"}`}>
                      <motion.span className="absolute top-0.5 size-4 rounded-full bg-white" animate={{ left: on ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                    </span>
                  </div>
                );
              })}
            </div>

            <div ref={viewport} className="relative overflow-hidden" style={{ height: HEAD + ROW_H * lanes.length }} aria-hidden>
              <div ref={track} className="absolute inset-y-0 left-0 will-change-transform">
                {[0, 1].map((copy) => (
                  <div key={copy} className="absolute inset-y-0" style={{ left: copy * TRACK, width: TRACK }}>
                    {Array.from({ length: WEEKS }).map((_, w) => (
                      <div key={w} className="absolute inset-y-0 border-l border-white/[0.05]" style={{ left: w * WEEK_W, width: WEEK_W }}>
                        <span className="absolute left-3 top-[20px] text-[11px] text-subtle">Week of {dateOf(w, 0).replace(/^\w+, /, "")}</span>
                      </div>
                    ))}
                    {lanes.map((l, li) => (
                      <div key={l.id} className="absolute inset-x-0 border-b border-white/[0.04]" style={{ top: HEAD + li * ROW_H, height: ROW_H }} />
                    ))}
                    {pills.map((p) => {
                      const key = `${p.key}-${copy}`;
                      const Icon = lanes[p.lane].icon;
                      return (
                        <span
                          key={key}
                          ref={(el) => {
                            if (el) pillEls.current.set(key, el);
                            else pillEls.current.delete(key);
                          }}
                          data-done="false"
                          className="group absolute flex h-8 items-center rounded-full border border-dashed border-white/20 px-2 text-[12px] text-subtle transition-[background-color,border-color,color] duration-300 data-[done=true]:animate-[pill-pop_0.9s_ease-out] data-[done=true]:border-solid data-[done=true]:border-[#A6BBFF]/35 data-[done=true]:bg-[#A6BBFF]/[0.14] data-[done=true]:text-[#e1e7ff]"
                          style={{ left: p.x, top: HEAD + p.lane * ROW_H + (ROW_H - 32) / 2 }}
                        >
                          <Icon size={13} strokeWidth={1.75} aria-hidden />
                          <span className="flex max-w-0 items-center gap-1 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-500 group-data-[done=true]:ml-1.5 group-data-[done=true]:max-w-[110px] group-data-[done=true]:opacity-100">
                            Sent
                            <Check size={12} strokeWidth={2.5} className="text-[#A6BBFF]" aria-hidden />
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0d1119] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0d1119] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: "62%" }}>
                <div className="absolute bottom-0 left-0 top-11 w-px bg-gradient-to-b from-[#A6BBFF] via-[#A6BBFF]/50 to-transparent" />
                <div className="absolute left-0 top-3 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#1b2134] py-1 pl-1 pr-3 text-[12px] font-medium text-white shadow-[0_0_0_6px_#0d1119] ring-1 ring-[#A6BBFF]/40">
                    <MascotMark size={18} />
                    Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- what just went out, and how ---------- */}
          <div className="grid gap-6 border-t border-white/[0.06] p-6 md:grid-cols-[1.25fr_1fr] md:gap-8 md:p-8">
            <div>
              <p className="mb-3 flex items-center gap-2 text-[13px] text-muted">
                <span className="size-1.5 rounded-full bg-success" />
                Just delivered
              </p>
              <div className="relative h-[200px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={latest.n}
                    className="absolute inset-0 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] [border-radius:20px]"
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Report lane={latest.lane} w={latest.week} date={dateOf(latest.week, latest.day)} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[13px] text-muted">How it ran</p>
              <ol className="relative space-y-3">
                <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px bg-white/10" />
                {chain.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.li
                      key={`${latest.n}-${c.k}`}
                      initial={{ opacity: 0.35 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.12 + i * 0.12, duration: 0.3 }}
                      className="relative flex items-center gap-3"
                    >
                      <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-[#1b2134] text-[#C9D5FF] ring-1 ring-white/10">
                        <Icon size={14} strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="w-14 shrink-0 text-[12px] text-subtle">{c.k}</span>
                      <span className="min-w-0 text-[14px] text-text">{c.v}</span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* ---------- totals ---------- */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.06] px-6 py-5 md:px-8">
            <p className="flex items-center gap-3 text-[15px] text-muted">
              <MascotMark size={26} />
              <span>
                Switched on once. <span className="text-text">Every week after, handled.</span>
              </span>
            </p>
            <div className="flex gap-10">
              <span>
                <span className="block text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-text">{delivered}</span>
                <span className="text-[13px] text-muted">reports sent</span>
              </span>
              <span>
                <span className="block text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-text">{hours}h</span>
                <span className="text-[13px] text-muted">back for Maya</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
