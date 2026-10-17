"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";
import { Button } from "./Button";
import { nav } from "@/lib/story";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isActive = (href: string) => !href.includes("#") && path.startsWith(href);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-line bg-surface/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-text focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <div className="container-page grid h-full grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
        <a
          href={path === "/" ? "#top" : "/"}
          className="flex items-center gap-2.5 justify-self-start"
          aria-label="Juno home"
        >
          <MascotMark size={26} />
          <span className="text-[19px] font-semibold tracking-[-0.03em]">Juno</span>
        </a>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] transition-colors duration-200 hover:text-text ${isActive(l.href) ? "bg-white/[0.06] text-text" : "text-muted"}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <a
            href="#signin"
            className="hidden rounded-full px-3.5 py-2 text-[14px] text-muted transition-colors hover:text-text md:inline-block"
          >
            Sign in
          </a>
          <Button size="sm" href={CTA_HREF} magnetic={false}>
            {CTA_LABEL}
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-text md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={20} strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu size={20} strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-b border-line bg-surface/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container-page flex flex-col py-3">
              {[...nav, { label: "Sign in", href: "#signin" }].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center text-[17px] ${isActive(l.href) ? "text-[#A6BBFF]" : "text-text"}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
