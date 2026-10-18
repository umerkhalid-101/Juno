"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import type { ToolId } from "@/lib/story";

/**
 * The closing call to action for inner pages. A quiet field of the things Juno takes on sits
 * around Juno. A soft light follows the cursor and the chips lean away from it; click one and
 * it is handed to Juno on its own. Hover the button and every one is pulled in at once.
 * Pages can pass their own chips; the default set is drawn from across the site.
 */

/** Where the mobile chips sit around Juno on a phone, clear of the screen edges and the button. */
const PHONE_SLOTS = [
  { x: -80, y: -126 },
  { x: 92, y: -92 },
  { x: -88, y: 98 },
  { x: 90, y: 114 },
];

export type CtaChip = { tool: ToolId | "browser"; text: string; x: number; y: number; m?: boolean };

const defaultChips: CtaChip[] = [
  { tool: "gmail", text: "Investor update", x: -430, y: -84, m: true },
  { tool: "hubspot", text: "Northwind renewal", x: -330, y: 64 },
  { tool: "slack", text: "Nudge Sam", x: -470, y: 150 },
  { tool: "intercom", text: "Setup help", x: -220, y: -150, m: true },
  { tool: "linear", text: "Launch check", x: -200, y: 150 },
  { tool: "notion", text: "Help article", x: 210, y: -150, m: true },
  { tool: "browser", text: "Competitor pricing", x: 330, y: -60 },
  { tool: "calendar", text: "Prep for 10:00", x: 450, y: 70, m: true },
  { tool: "hubspot", text: "Next customers", x: 230, y: 150 },
  { tool: "gmail", text: "Tell Maya it shipped", x: 470, y: -150 },
];

function Chip({ c }: { c: CtaChip }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(180deg,rgba(28,34,48,0.9),rgba(14,18,24,0.9))] py-1.5 pl-1.5 pr-3 text-[12.5px] text-text shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08] transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_1px_rgba(166,187,255,0.45),0_12px_34px_-10px_rgba(122,143,255,0.55)]">
      <span className="grid size-6 place-items-center rounded-full bg-white text-[#14161f]">
        {c.tool === "browser" ? (
          <Globe size={13} strokeWidth={1.75} aria-hidden />
        ) : (
          <ToolLogo id={c.tool} size={13} />
        )}
      </span>
      {c.text}
    </span>
  );
}

/** Leans each chip away from the cursor; nearer chips move more, so the field has depth. */
function Lean({
  mx,
  my,
  depth,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.span className="block" style={{ x, y }}>
      {children}
    </motion.span>
  );
}

export function PageCta({
  title,
  sub,
  label = CTA_LABEL,
  href = CTA_HREF,
  chips = defaultChips,
}: {
  title: React.ReactNode;
  sub?: string;
  label?: string;
  href?: string;
  chips?: CtaChip[];
}) {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(root, { once: true, amount: 0.35 });
  const juno = useRef<MascotApi>(null);
  const [pull, setPull] = useState(false);
  // chips handed over one at a time by clicking them
  const [sent, setSent] = useState<Set<number>>(() => new Set());
  const send = (i: number) => {
    if (sent.has(i) || pull) return;
    setSent((s) => new Set(s).add(i));
    window.setTimeout(() => juno.current?.nod(), 420);
    window.setTimeout(
      () =>
        setSent((s) => {
          const n = new Set(s);
          n.delete(i);
          return n;
        }),
      2600,
    );
  };
  // the cursor, relative to the field's centre; drives the light and the lean
  const field = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const lx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.6 });
  const ly = useSpring(py, { stiffness: 120, damping: 20, mass: 0.6 });
  const mx = useTransform(lx, (v) => -v * 0.035);
  const my = useTransform(ly, (v) => -v * 0.035);
  const [lit, setLit] = useState(false);
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !field.current) return;
    const r = field.current.getBoundingClientRect();
    px.set(e.clientX - (r.left + r.width / 2));
    py.set(e.clientY - (r.top + r.height / 2));
    if (!lit) setLit(true);
  };
  const onLeaveField = () => {
    setLit(false);
    px.set(0);
    py.set(0);
  };
  // the field spreads to fit the screen; phones get their own slots so no chip leaves the screen
  const [k, setK] = useState(1);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const fit = () => {
      const w = root.current?.clientWidth ?? 1200;
      setK(Math.min(1, (w - 60) / 1040));
      setPhone(w < 640);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const calm = [0.16, 1, 0.3, 1] as const;
  // phones: the chips marked for mobile take these places around Juno, in order
  const phoneChips = chips.map((c, i) => (c.m ? i : -1)).filter((i) => i >= 0);
  const slot = (i: number) => PHONE_SLOTS[Math.max(0, phoneChips.indexOf(i)) % PHONE_SLOTS.length];

  return (
    <section
      ref={root}
      aria-labelledby="page-cta-title"
      className="relative overflow-x-clip py-32 md:py-44"
    >
      <div className="container-page flex flex-col items-center text-center">
        <motion.h2
          id="page-cta-title"
          className="t-display-l max-w-[18ch] text-balance"
          initial={false}
          animate={{ opacity: seen || reduce ? 1 : 0, y: seen || reduce ? 0 : 16 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: calm }}
        >
          {title}
        </motion.h2>
        {sub && (
          <motion.p
            className="t-body-l mt-5 max-w-[40ch] text-muted"
            initial={false}
            animate={{ opacity: seen || reduce ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.8, delay: 0.15 }}
          >
            {sub}
          </motion.p>
        )}

        {/* Juno, with everything you could hand over gathered around it */}
        <div
          ref={field}
          onPointerMove={onMove}
          onPointerLeave={onLeaveField}
          className="relative mt-16 grid h-[360px] w-full place-items-center md:mt-14"
        >
          {/* a soft light that follows the cursor */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-[280px] -mt-[280px] size-[560px] rounded-full transition-opacity duration-500"
            style={{
              x: lx,
              y: ly,
              opacity: lit ? 1 : 0,
              background:
                "radial-gradient(closest-side, rgba(122,143,255,0.14), rgba(160,130,255,0.05) 55%, transparent)",
            }}
          />
          <div aria-hidden className="absolute inset-0">
            {chips.map((c, i) => (
              <motion.span
                key={c.text}
                className={`group absolute left-1/2 top-1/2 cursor-pointer ${c.m ? "" : "max-md:hidden"}`}
                onClick={() => send(i)}
                initial={false}
                animate={
                  (pull || sent.has(i)) && !reduce
                    ? { x: "-50%", y: "-50%", translateX: 0, translateY: 0, scale: 0.3, opacity: 0 }
                    : {
                        x: "-50%",
                        y: "-50%",
                        translateX: phone ? slot(i).x * (seen || reduce ? 1 : 1.2) : (seen || reduce ? c.x : c.x * 1.25) * k,
                        translateY: phone ? slot(i).y * (seen || reduce ? 1 : 1.2) : (seen || reduce ? c.y : c.y * 1.25) * Math.max(0.85, k),
                        scale: 1,
                        opacity: seen || reduce ? 1 : 0,
                      }
                }
                transition={
                  pull || sent.has(i)
                    ? {
                        duration: 0.55,
                        delay: pull ? i * 0.025 : 0,
                        ease: [0.55, 0, 0.75, 0.2],
                      }
                    : { duration: reduce ? 0 : 0.9, delay: seen ? 0.2 + i * 0.04 : 0, ease: calm }
                }
              >
                <Lean mx={mx} my={my} depth={0.6 + ((i * 7) % 5) * 0.2}>
                  <span className="cta-drift block" style={{ animationDelay: `${-i * 1.3}s` }}>
                    <Chip c={c} />
                  </span>
                </Lean>
              </motion.span>
            ))}
          </div>

          {/* Juno, at the centre, taking it all on */}
          <motion.div
            className="pointer-events-none relative grid place-items-center"
            initial={false}
            animate={{ opacity: seen || reduce ? 1 : 0, scale: pull ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: calm }}
          >
            <span
              aria-hidden
              className="cta-breathe pointer-events-none absolute -inset-20 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(122,143,255,0.42), rgba(122,143,255,0.1) 55%, transparent)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-20 rounded-full transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(150,170,255,0.5), rgba(122,143,255,0.12) 55%, transparent)",
                opacity: pull ? 1 : sent.size ? 0.55 : 0,
              }}
            />
            {/* a ring that goes out each time Juno takes something on */}
            {[...sent].map((i) => (
              <span
                key={i}
                aria-hidden
                className="cta-receive pointer-events-none absolute inset-0 rounded-full"
              />
            ))}
            <Mascot size={140} state="idle" halo={false} apiRef={juno} trackCursor={!pull} />
          </motion.div>
        </div>

        {/* hover the button and the work is handed over */}
        <motion.div
          className="-mt-6"
          initial={false}
          animate={{ opacity: seen || reduce ? 1 : 0, y: seen || reduce ? 0 : 10 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: 0.35, ease: calm }}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            setPull(true);
            juno.current?.look(0, -0.3);
            window.setTimeout(() => juno.current?.cheer(), 520);
          }}
          onPointerLeave={() => setPull(false)}
          onFocus={() => setPull(true)}
          onBlur={() => setPull(false)}
        >
          <span className="relative inline-flex">
            {/* glow pooled under the button, brighter when it is about to be pressed */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-full transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(122,143,255,0.45), rgba(160,130,255,0.12) 60%, transparent)",
                opacity: pull ? 1 : 0.7,
              }}
            />
            {/* a light that runs round the edge */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-[2px] overflow-hidden rounded-full"
            >
              <span
                className="cta-orbit absolute left-1/2 top-1/2 aspect-square w-[150%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(166,187,255,0.95) 40deg, rgba(200,170,255,0.8) 70deg, transparent 110deg, transparent 360deg)",
                }}
              />
            </span>
            <Button
              size="xl"
              variant="white"
              magnetic={false}
              href={href}
              trailing={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />}
            >
              {label}
            </Button>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
