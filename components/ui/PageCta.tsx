"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Mascot, type MascotApi } from "@/components/mascot/Mascot";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import type { ToolId } from "@/lib/story";

/**
 * The closing call to action for inner pages. A quiet field of the things Juno takes on sits
 * around the button; hover it and every one is pulled into the button, handed over.
 * Pages can pass their own chips; the default set is drawn from across the site.
 */

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
    <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[linear-gradient(180deg,rgba(28,34,48,0.9),rgba(14,18,24,0.9))] py-1.5 pl-1.5 pr-3 text-[12.5px] text-text shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08]">
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

export function PageCta({
  title,
  sub,
  label = CTA_LABEL,
  href = CTA_HREF,
  chips = defaultChips,
}: {
  title: string;
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
  // the field spreads to fit the screen
  const [k, setK] = useState(1);
  useEffect(() => {
    const fit = () => setK(Math.min(1, ((root.current?.clientWidth ?? 1200) - 60) / 1040));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const calm = [0.16, 1, 0.3, 1] as const;

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
        <div className="relative mt-16 grid h-[360px] w-full place-items-center md:mt-14">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {chips.map((c, i) => (
              <motion.span
                key={c.text}
                className={`absolute left-1/2 top-1/2 ${c.m ? "" : "max-md:hidden"}`}
                initial={false}
                animate={
                  pull && !reduce
                    ? { x: "-50%", y: "-50%", translateX: 0, translateY: 0, scale: 0.3, opacity: 0 }
                    : {
                        x: "-50%",
                        y: "-50%",
                        translateX: (seen || reduce ? c.x : c.x * 1.25) * k,
                        translateY: (seen || reduce ? c.y : c.y * 1.25) * Math.max(0.85, k),
                        scale: 1,
                        opacity: seen || reduce ? 1 : 0,
                      }
                }
                transition={
                  pull
                    ? { duration: 0.55, delay: i * 0.025, ease: [0.55, 0, 0.75, 0.2] }
                    : { duration: reduce ? 0 : 0.9, delay: seen ? 0.2 + i * 0.04 : 0, ease: calm }
                }
              >
                <span className="cta-drift block" style={{ animationDelay: `${-i * 1.3}s` }}>
                  <Chip c={c} />
                </span>
              </motion.span>
            ))}
          </div>

          {/* Juno, at the centre, taking it all on */}
          <motion.div
            className="relative grid place-items-center"
            initial={false}
            animate={{ opacity: seen || reduce ? 1 : 0, scale: pull ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: calm }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-20 rounded-full transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(122,143,255,0.42), rgba(122,143,255,0.1) 55%, transparent)",
                opacity: pull ? 1 : 0.4,
              }}
            />
            <Mascot size={140} state="idle" halo={false} apiRef={juno} />
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
          <Button
            size="xl"
            variant="white"
            href={href}
            trailing={<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />}
          >
            {label}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
