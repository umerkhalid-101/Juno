"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { FooterMark } from "./FooterMark";

const links = [
  { label: "Product", href: "#brain" },
  { label: "Jobs", href: "#work" },
  { label: "Apps", href: "#apps" },
  { label: "Download", href: "#" },
  { label: "Sign in", href: "#" },
  { label: "Contact", href: "#" },
];

/** The close of the page: one line, a handful of links, then the wordmark Juno peeks over. */
export function Footer() {
  return (
    <footer className="relative">
      <div className="container-page flex flex-col gap-10 pt-20 md:flex-row md:items-end md:justify-between md:pt-28">
        <p className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-text md:text-[44px]">
          Juno runs the work.
          <Rotating />
        </p>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-3 gap-x-10 gap-y-3 md:gap-x-12">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="group inline-block py-1 text-[15px] md:text-[16px]">
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

/** What you get back while Juno runs the work, one at a time. */
const lines = [
  "You run the company.",
  "You close the round.",
  "You ship the launch.",
  "You take the weekend.",
];

function Rotating() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % lines.length), 2800);
    return () => window.clearInterval(id);
  }, [reduce]);
  return (
    <span className="relative block h-[1.12em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="accent-text block whitespace-nowrap pb-[0.06em]"
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {lines[i]}
        </motion.span>
      </AnimatePresence>
    </span>
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
