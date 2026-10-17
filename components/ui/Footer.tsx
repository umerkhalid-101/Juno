"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { FooterMark } from "./FooterMark";

const links = [
  { label: "Product", href: "/#brain" },
  { label: "Automations", href: "/jobs" },
  { label: "Apps", href: "/#apps" },
  { label: "Download", href: "#" },
  { label: "Sign in", href: "#" },
  { label: "Contact", href: "#" },
];

/** What you get back while Juno runs the work. */
const beats = [
  "You run the company.",
  "You close the round.",
  "You ship the launch.",
  "You take the weekend.",
];

/** The close of the page: the promise, a row of links, then the wordmark Juno peeks over. */
export function Footer() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % beats.length), 3200);
    return () => window.clearInterval(id);
  }, [reduce]);
  const beat = beats[i];

  return (
    <footer className="relative">
      {/* one centred composition that leads straight into the wordmark */}
      <div className="container-page flex flex-col items-center pt-24 text-center md:pt-36">
        <p className="text-[30px] font-semibold leading-[1.04] tracking-[-0.04em] text-text sm:text-[48px] md:text-[64px]">
          Juno runs the work.
          <span className="relative block h-[1.1em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={i} className="block whitespace-nowrap text-[#B4C2FF]">
                {beat.split(" ").map((w, k, all) => (
                  <motion.span
                    key={k}
                    className="inline-block"
                    initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    exit={{
                      y: "-110%",
                      opacity: 0,
                      filter: "blur(10px)",
                      transition: { duration: 0.4, delay: k * 0.03, ease: [0.4, 0, 1, 1] },
                    }}
                    transition={{ duration: 0.7, delay: 0.15 + k * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {w}
                    {k < all.length - 1 ? "\u00A0" : ""}
                  </motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>

        <nav aria-label="Footer" className="mt-10 md:mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[15px] md:gap-x-10 md:text-[16px]">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="group inline-block py-1">
                  <Roll text={l.label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <FooterMark />

      <div className="container-page flex flex-wrap items-center justify-between gap-4 pb-8 pt-6 text-[13px] text-muted">
        <span>© 2026 Juno</span>
        <span className="flex items-center gap-6">
          <a href="#" className="group">
            <Roll text="Privacy" />
          </a>
          <a href="#" className="group">
            <Roll text="Terms" />
          </a>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-text"
          >
            <Roll text="Back to top" />
            <ArrowUp
              size={13}
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </span>
      </div>
    </footer>
  );
}

/** Link text that rolls up letter by letter on hover, the bright copy rising in from below. */
function Roll({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <span className="roll" aria-label={text}>
      <span className="roll-a" aria-hidden>
        {chars.map((c, i) => (
          <span key={i} className="roll-c" style={{ ["--i" as string]: i }}>
            {c}
          </span>
        ))}
      </span>
      <span className="roll-b" aria-hidden>
        {chars.map((c, i) => (
          <span key={i} className="roll-c" style={{ ["--i" as string]: i }}>
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}
