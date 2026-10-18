"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { siApple } from "simple-icons";
import { MascotMark } from "@/components/mascot/Mascot";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { FooterMark } from "./FooterMark";

/** What you get back while Juno runs the work. */
const beats = ["You run the company.", "You close the round.", "You ship the launch.", "You take the weekend."];

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Product", href: "/product" },
      { label: "Features", href: "/features" },
      { label: "Automations", href: "/jobs" },
      { label: "Download", href: "/download" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Sign in", href: "https://www.runjuno.ai/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

/**
 * The close of every page: the promise and the two ways in, then Juno for Mac, the pages and the
 * way back up, all under a diagonal sweep of Juno's light; then the wordmark Juno peeks over.
 */
export function Footer() {
  const reduce = useReducedMotion();
  const path = usePathname();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % beats.length), 3200);
    return () => window.clearInterval(id);
  }, [reduce]);
  const beat = beats[i];

  return (
    <footer className="relative overflow-hidden">
      {/* a diagonal sweep of light across the footer */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_35%,#000_80%,transparent)]"
        style={{
          background:
            "radial-gradient(60% 45% at 25% 78%, rgba(50,76,255,0.09), transparent 70%), radial-gradient(55% 40% at 55% 70%, rgba(143,124,255,0.07), transparent 70%), radial-gradient(45% 35% at 82% 58%, rgba(242,160,170,0.05), transparent 70%)",
        }}
      />

      {/* the promise, and the two ways in */}
      <div className="container-page relative flex flex-col items-center pt-20 text-center md:pt-28">
        <p className="text-[36px] font-semibold leading-[1.02] tracking-[-0.045em] text-text sm:text-[56px] md:text-[80px]">
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
                    exit={{ y: "-110%", opacity: 0, filter: "blur(10px)", transition: { duration: 0.4, delay: k * 0.03, ease: [0.4, 0, 1, 1] } }}
                    transition={{ duration: 0.7, delay: 0.15 + k * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {w}
                    {k < all.length - 1 ? " " : ""}
                  </motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>
        <p className="mt-6 max-w-[40ch] text-pretty text-[18px] leading-[28px] text-muted md:text-[20px] md:leading-[30px]">
          Your AI chief of staff, from company knowledge to the work that runs every week.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/download"
            className="inline-flex h-12 items-center gap-2.5 rounded-[14px] bg-[#D9DCE6] px-5 text-[15px] font-semibold text-[#0B0E13] transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_0_0_4px_rgba(122,143,255,0.25)]"
          >
            <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
              <path d={siApple.path} />
            </svg>
            Download for Mac
          </a>
          <a
            href={CTA_HREF}
            className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-[#D9DCE6] px-5 text-[15px] font-semibold text-[#0B0E13] transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_0_0_4px_rgba(122,143,255,0.25)]"
          >
            {CTA_LABEL}
            <ArrowUpRight size={16} strokeWidth={2.25} aria-hidden />
          </a>
        </div>
      </div>

      {/* Juno for Mac, the pages, and the way back up */}
      <div className="container-page relative mt-16 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto] lg:gap-10">
        <Link href="/download" className="group flex items-center gap-5 self-start">
          <span className="relative grid size-[112px] shrink-0 place-items-center rounded-[28px] border border-white/[0.1] bg-[linear-gradient(180deg,#141A28,#0D111A)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.07)] transition-colors group-hover:border-white/[0.2]">
            <span aria-hidden className="cta-breathe absolute inset-4 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(110,140,255,0.45), transparent)" }} />
            <MascotMark size={52} className="relative" />
          </span>
          <span>
            <span className="block text-[16px] font-medium leading-6 text-text">
              Keep Juno close.
              <br />
              One shortcut on your Mac.
            </span>
          </span>
        </Link>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-[13px] text-subtle">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => {
                  const on = l.href.startsWith("/") && path === l.href;
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        aria-current={on ? "page" : undefined}
                        className={`text-[19px] tracking-[-0.01em] underline-offset-[6px] transition-colors duration-200 md:text-[21px] ${
                          on ? "text-text underline decoration-[#A6BBFF]/70 decoration-1" : "text-text/70 hover:text-text"
                        }`}
                      >
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <a
          href="#top"
          aria-label="Back to top"
          className="hidden size-14 place-items-center self-start rounded-[18px] border border-white/[0.08] bg-[#11151E] text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/[0.18] hover:text-text lg:grid"
        >
          <ArrowUp size={18} aria-hidden />
        </a>
      </div>

      <div className="relative mt-10 md:mt-14">
        <FooterMark />
      </div>

      <div className="container-page relative flex flex-wrap items-center justify-between gap-4 pb-8 pt-6 text-[13px] text-muted">
        <span>© 2026 Juno</span>
        <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-text lg:hidden">
          Back to top <ArrowUp size={13} aria-hidden />
        </a>
      </div>
    </footer>
  );
}
