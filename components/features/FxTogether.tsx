"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CalendarDays, Lock } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Face } from "@/components/jobs/scenes";
import { feature, outcomes, tint, together, type FeatureId } from "@/lib/features";
import { FeatureIcon, SectionHead } from "./kit";
import { goToFeature } from "./goTo";
import { IMG } from "@/lib/images";

/**
 * With Juno, you can finally: six outcomes, each made of features working together. One column
 * is open at a time; hover or focus another to open it. It moves on by itself until you touch it.
 */

const base = [0.2, 0.8, 0.2, 1] as const;
const snap = [0.3, 0, 0, 1] as const;


/** A small, real piece of the result: what you'd actually see when it's done. */
function Pill({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "plain" | "ok" | "blue";
}) {
  const t =
    tone === "ok"
      ? "bg-[#3DD68C]/12 text-[#5BE3A2]"
      : tone === "blue"
        ? "bg-[#A6BBFF]/12 text-[#B9C8FF]"
        : "bg-white/[0.06] text-text/80";
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-[7px] px-2 text-[11.5px] ${t}`}
    >
      {children}
    </span>
  );
}
const Dots = ({ c }: { c: string[] }) => (
  <span className="flex -space-x-1">
    {c.map((x) => (
      <span
        key={x}
        className="size-[18px] rounded-full ring-2 ring-[#121722]"
        style={{ background: x }}
      />
    ))}
  </span>
);
const brand = ["#1F2A44", "#E9B949", "#F4EEE3"];

// what each feature contributes to the outcome, and the piece of it you'd see
const results: { text: string; receipt: ReactNode }[][] = [
  [
    { text: "Announcement in your brand", receipt: <Dots c={brand} /> },
    {
      text: "Launch page live",
      receipt: (
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={IMG.ceramicsHero}
            alt=""
            className="h-6 w-9 rounded-[5px] object-cover ring-1 ring-white/10"
          />
          <Pill tone="ok">Live</Pill>
        </span>
      ),
    },
    { text: "Post published", receipt: <Pill tone="ok">9:02 AM</Pill> },
    {
      text: "Weekly report scheduled",
      receipt: (
        <Pill>
          <CalendarDays size={12} aria-hidden />
          Mon 9:00
        </Pill>
      ),
    },
  ],
  [
    {
      text: "Request caught on the call",
      receipt: (
        <span className="flex items-center gap-2 text-[11.5px] text-muted">
          <Face who="maya" size={22} className="!ring-0" />
          10:14
        </span>
      ),
    },
    {
      text: "Issue created in Linear",
      receipt: (
        <Pill>
          <BrandIcon id="linear" size={14} className="!shadow-none" />
          CLI-214
        </Pill>
      ),
    },
    { text: "Wiki updated with it", receipt: <Pill tone="blue">Just now</Pill> },
  ],
  [
    {
      text: "Launch room built",
      receipt: (
        <span className="flex items-center gap-2 text-[11.5px] text-muted">
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-[72%] rounded-full bg-[#A6BBFF]" />
          </span>
          72%
        </span>
      ),
    },
    {
      text: "Pulls from HubSpot and Linear",
      receipt: (
        <span className="flex gap-1">
          <BrandIcon id="hubspot" size={22} />
          <BrandIcon id="linear" size={22} />
        </span>
      ),
    },
    {
      text: "Uses approved keys only",
      receipt: (
        <Pill tone="ok">
          <Lock size={11} aria-hidden />
          Approved
        </Pill>
      ),
    },
  ],
  [
    {
      text: "Runs every Monday at 8:00",
      receipt: (
        <Pill>
          <CalendarDays size={12} aria-hidden />
          Mon 8:00
        </Pill>
      ),
    },
    {
      text: "Numbers cleaned and merged",
      receipt: (
        <Pill>
          <span className="size-2.5 rounded-[3px] bg-[#1f8a4c]" />
          Weekly.xlsx
        </Pill>
      ),
    },
    {
      text: "Context from last week",
      receipt: (
        <span className="flex items-center gap-2">
          <BrandIcon id="slack" size={22} />
          <Pill tone="blue">3 updates</Pill>
        </span>
      ),
    },
  ],
  [
    { text: "Everything in one place", receipt: <Pill>24 pages</Pill> },
    { text: "How we do things, saved", receipt: <Pill>6 skills</Pill> },
    {
      text: "Questions answered with the team",
      receipt: (
        <span className="flex -space-x-1.5">
          <Face who="priya" size={22} className="!ring-[#121722]" />
          <Face who="sam" size={22} className="!ring-[#121722]" />
          <Face who="maya" size={22} className="!ring-[#121722]" />
        </span>
      ),
    },
  ],
  [
    { text: "Your colors and your tone", receipt: <Dots c={brand} /> },
    { text: "Remembers every edit", receipt: <Pill tone="blue">12 notes</Pill> },
    { text: "Your process, every time", receipt: <Pill>Used 12 times</Pill> },
  ],
];

function Open({ i }: { i: number }) {
  const o = outcomes[i];
  return (
    <motion.div
      key={i}
      className="flex h-full flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <h3 className="hidden text-[32px] font-medium leading-[38px] tracking-[-0.03em] text-text md:block">
        {o.title}
      </h3>
      {/* what got done, and the proof of each */}
      <ul className="md:mt-8">
        {o.features.map((id, k) => (
          <motion.li
            key={id}
            className="flex items-center gap-3.5 border-b border-white/[0.06] py-3.5 first:border-t"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: snap, delay: 0.25 + k * 0.1 }}
          >
            <FeatureIcon f={feature(id)} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14.5px] text-text">{results[i][k].text}</span>
              <span className="block text-[12px] text-subtle">{feature(id).name}</span>
            </span>
            <motion.span
              className="shrink-0"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: snap, delay: 0.45 + k * 0.1 }}
            >
              {results[i][k].receipt}
            </motion.span>
          </motion.li>
        ))}
      </ul>
      <p className="mt-6 text-[13px] leading-6 text-muted md:mt-auto">
        Made with{" "}
        {o.features.map((id: FeatureId, k) => (
          <span key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                goToFeature(id);
              }}
              className="text-text/85 underline decoration-white/20 underline-offset-4 transition-colors hover:text-text hover:decoration-white/60"
            >
              {feature(id).name}
            </a>
            {k < o.features.length - 2 ? ", " : k === o.features.length - 2 ? " and " : ""}
          </span>
        ))}
      </p>
    </motion.div>
  );
}

export function FxTogether() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [open, setOpen] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || !inView || reduce) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setOpen((o) => (o + 1) % outcomes.length);
    }, 5000);
    return () => window.clearInterval(t);
  }, [touched, inView, reduce]);

  const pick = (i: number) => {
    setTouched(true);
    setOpen(i);
  };

  return (
    <section aria-labelledby="together-title" className="relative py-24 md:py-40">
      <div className="container-page">
        <SectionHead
          id="together-title"
          title={together.title}
          muted={together.muted}
          sub={together.sub}
        />

        <div
          ref={ref}
          className="mt-14 flex flex-col gap-2 md:mt-20 md:h-[560px] md:flex-row md:gap-3"
        >
          {outcomes.map((o, i) => {
            const on = open === i;
            return (
              <motion.div
                key={o.title}
                layout
                transition={{ duration: reduce ? 0 : 0.4, ease: base }}
                onMouseEnter={() => pick(i)}
                className={`group/col relative overflow-hidden rounded-[24px] transition-colors duration-300 ${
                  on
                    ? "fx-ring bg-[#121722] md:flex-[4]"
                    : "border border-white/[0.06] bg-[linear-gradient(180deg,#10141B,#0C0F14)] hover:border-white/[0.12] md:flex-1"
                }`}
              >
                {/* the open outcome takes the light of its first feature's chapter */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}
                  style={{
                    background: `radial-gradient(100% 70% at 100% 0%, color-mix(in srgb, ${tint(feature(o.features[0]).group)} 18%, transparent), transparent 65%), radial-gradient(70% 50% at 0% 100%, color-mix(in srgb, ${tint(feature(o.features[1]).group)} 9%, transparent), transparent 70%)`,
                  }}
                />
                {/* collapsed: number and the title set vertically (desktop); a row on phones */}
                <button
                  type="button"
                  onClick={() => pick(i)}
                  onFocus={() => pick(i)}
                  aria-expanded={on}
                  aria-controls={`outcome-${i}`}
                  className={`flex w-full items-center gap-4 p-5 text-left md:absolute md:inset-0 md:flex-col md:items-start md:justify-between md:p-6 ${
                    on ? "md:pointer-events-none md:opacity-0" : ""
                  }`}
                >
                  <span className="flex flex-col gap-5">
                    <span className="text-[13px] tabular-nums text-muted">0{i + 1}</span>
                    <span className="hidden flex-col gap-1.5 md:flex">
                      {o.features.map((id) => (
                        <FeatureIcon key={id} f={feature(id)} size={26} />
                      ))}
                    </span>
                  </span>
                  <span className="text-[16px] font-medium text-text md:hidden">{o.title}</span>
                  <span className="hidden whitespace-nowrap text-[17px] font-medium text-text/70 transition-colors duration-300 [writing-mode:vertical-rl] group-hover/col:text-text md:block md:rotate-180">
                    {o.title}
                  </span>
                </button>
                <div
                  id={`outcome-${i}`}
                  className={on ? "relative px-5 pb-5 md:h-full md:p-9" : "hidden"}
                >
                  <span className="hidden text-[13px] tabular-nums text-muted md:block">
                    0{i + 1}
                  </span>
                  <div className="md:mt-4 md:h-[calc(100%-36px)]">
                    <AnimatePresence mode="wait">{on && <Open i={i} />}</AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
