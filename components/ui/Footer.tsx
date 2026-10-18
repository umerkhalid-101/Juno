"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { siApple } from "simple-icons";
import { FooterMark } from "./FooterMark";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Product", href: "/product" },
      { label: "Features", href: "/features" },
      { label: "Automations", href: "/jobs" },
      { label: "Apps", href: "/apps" },
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
 * The close of every page: Juno for Mac, the pages and the way back up, under a diagonal sweep of
 * Juno's light; then the wordmark Juno peeks over.
 */
export function Footer() {
  const path = usePathname();

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

      {/* Juno for Mac, the pages, and the way back up */}
      <div className="container-page relative grid gap-10 pt-20 md:pt-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto] lg:gap-10">
        <div className="self-start">
          <Link href="/download" className="group flex items-center gap-4">
            <Image
              src="/home/juno-mac-icon.png"
              alt=""
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-[16px] shadow-[0_16px_32px_-16px_rgba(50,76,255,0.55),0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            <span className="block text-[16px] font-medium leading-6 text-text">
              Keep Juno close.
              <br />
              One shortcut on your Mac.
            </span>
          </Link>
          <Link
            href="/download"
            className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-[14px] bg-[#D9DCE6] px-5 text-[15px] font-semibold text-[#0B0E13] transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-[0_0_0_4px_rgba(122,143,255,0.25)]"
          >
            <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
              <path d={siApple.path} />
            </svg>
            Download for Mac
          </Link>
        </div>

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
