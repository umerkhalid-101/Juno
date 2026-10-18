"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AppWindow,
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  Command,
  Download,
  Library,
  Menu,
  Monitor,
  Palette,
  Plug,
  X,
  type LucideIcon,
} from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { AppsPreview, ComputerPreview, ImagesPreview, JobsPreview, KnowledgePreview } from "@/components/product/Overview";
import { Button } from "./Button";
import { JunoLogo } from "./JunoLogo";
import { nav } from "@/lib/story";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";

/**
 * A solid bar: Juno, the links with a line of light along the bottom edge that glides to what
 * you point at, and the actions. Product wipes down a solid sheet: the eight parts of Juno on
 * the left and, on the right, a live preview of whichever one you're on.
 */

const calm = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ small previews the hero doesn't have */

function ContentPreview() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-[12.5px] text-muted">
        <span className="grid size-6 place-items-center rounded-[7px] border border-white/[0.08] bg-white/[0.04]">
          <Library size={12} aria-hidden />
        </span>
        Juno CMS <span className="text-subtle">/</span> <span className="text-text">Blog posts</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          ["Meet Scheduled Reports.", "Product updates"],
          ["Share reports with your clients.", "Guides"],
          ["Turn feedback into priorities.", "Insights"],
        ].map(([t, c]) => (
          <div key={t} className="flex items-center gap-3 rounded-[10px] bg-white/[0.04] px-3 py-2.5 text-[13px]">
            <span className="min-w-0 flex-1 truncate text-text">{t}</span>
            <span className="hidden text-muted sm:block">{c}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#3DD68C]/12 px-2 py-0.5 text-[11px] text-[#5BE3A2]">
              <Check size={10} strokeWidth={3} aria-hidden />
              Live
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolsPreview() {
  return (
    <div className="p-4">
      <div className="flex gap-2">
        {(["slack", "linear", "hubspot", "notion", "gmail", "drive"] as const).map((t) => (
          <span key={t} className="grid size-10 place-items-center rounded-[11px] bg-white">
            <BrandIcon id={t} size={20} className="!shadow-none" />
          </span>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-[12px] bg-white text-[#16181d]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] bg-[#F7F7F8] px-3.5 py-2 text-[11.5px] text-[#6b7080]">
          <BrandIcon id="linear" size={13} className="!shadow-none" />
          Product · Todo
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#E9F7EF] px-2 py-0.5 text-[10.5px] font-medium text-[#1f7a4d]">
            <Check size={9} strokeWidth={3} aria-hidden />
            Created
          </span>
        </div>
        <div className="p-3.5">
          <p className="text-[14px] font-semibold">Export invoices by date range</p>
          <p className="mt-1 text-[12px] text-[#4a4f5c]">Customer call attached. Context included.</p>
        </div>
      </div>
    </div>
  );
}

function MacPreview() {
  return (
    <div className="p-4">
      <div className="rounded-[14px] border border-white/[0.12] bg-[#151A22] p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]">
        <p className="flex items-center gap-2.5 text-[14px] text-text">
          <MascotMark size={20} />
          What&apos;s left before launch?
          <span className="ml-auto flex gap-1">
            {["⌃", "⌘", "J"].map((k) => (
              <kbd key={k} className="grid h-6 min-w-6 place-items-center rounded-[6px] border border-white/[0.12] bg-white/[0.04] px-1 font-sans text-[11px] text-muted">
                {k}
              </kbd>
            ))}
          </span>
        </p>
        <p className="mt-3 border-t border-white/[0.07] pt-3 text-[13.5px] text-muted">Just the customer email. Want me to draft it?</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ the eight parts */

type Item = {
  icon: LucideIcon;
  title: string;
  line: string;
  href: string;
  hue: string;
  Preview: ComponentType<{ n: number; on: boolean }>;
};

const items: Item[] = [
  { icon: BookOpen, title: "Company knowledge", line: "The full picture, connected.", href: "/product#knowledge", hue: "143,220,203", Preview: ({ n }) => <KnowledgePreview n={n} /> },
  { icon: Palette, title: "Brand, skills & memory", line: "Work that feels like yours.", href: "/product#brand", hue: "242,198,176", Preview: ({ n, on }) => <ImagesPreview n={n} on={on} /> },
  { icon: Monitor, title: "A computer of its own", line: "Research. Browse. Get it done.", href: "/product#computer", hue: "166,187,255", Preview: ({ n }) => <ComputerPreview n={n} /> },
  { icon: AppWindow, title: "Apps & websites", line: "From an idea to a working app.", href: "/product#apps", hue: "214,219,160", Preview: ({ n }) => <AppsPreview n={n} /> },
  { icon: Library, title: "Content & CMS", line: "Create, organize, publish.", href: "/product#content", hue: "195,182,255", Preview: () => <ContentPreview /> },
  { icon: Plug, title: "Connected tools", line: "Move work across your stack.", href: "/product#tools", hue: "143,200,255", Preview: () => <ToolsPreview /> },
  { icon: CalendarClock, title: "Automations", line: "Set it once. Leave it to Juno.", href: "/jobs", hue: "122,143,255", Preview: ({ n }) => <JobsPreview n={n} /> },
  { icon: Command, title: "Juno for Mac", line: "One shortcut. Right there.", href: "/features#quick-ask", hue: "166,187,255", Preview: () => <MacPreview /> },
];

function ProductMenu({ onPick }: { onPick: () => void }) {
  const reduce = useReducedMotion();
  const [a, setA] = useState(0);
  const [n, setN] = useState(reduce ? 3 : 0);
  useEffect(() => {
    if (reduce) return;
    const iv = window.setInterval(() => setN((x) => (x + 1) % 4), 1700);
    return () => window.clearInterval(iv);
  }, [reduce]);
  const it = items[a];
  const { Preview } = it;

  return (
    <div className="relative grid grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-8 p-6 pl-4">
      {/* the list */}
      <div className="flex flex-col">
        <ul>
          {items.map((m, i) => {
            const Icon = m.icon;
            const on = a === i;
            return (
              <motion.li
                key={m.title}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: calm, delay: 0.08 + i * 0.025 }}
              >
                <a
                  href={m.href}
                  onClick={onPick}
                  onPointerEnter={() => setA(i)}
                  onFocus={() => setA(i)}
                  className="relative flex h-[50px] items-center gap-3.5 pl-4 pr-2 outline-none focus-visible:ring-2 focus-visible:ring-[#009CFF]"
                >
                  {/* the light marks the one you're on */}
                  {on && (
                    <motion.span
                      layoutId="mega-beam"
                      aria-hidden
                      className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-[linear-gradient(180deg,#A6BBFF,#C3B6FF)] shadow-[0_0_12px_rgba(166,187,255,0.8)]"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={1.7}
                    className={`shrink-0 transition-colors duration-200 ${on ? "text-[#C9D4FF]" : "text-[#6B7789]"}`}
                    aria-hidden
                  />
                  <span className={`flex-1 text-[16px] transition-colors duration-200 ${on ? "text-text" : "text-text/55"}`}>{m.title}</span>
                  <ArrowRight
                    size={15}
                    className={`transition-[opacity,transform] duration-300 ${on ? "translate-x-0 text-text/70 opacity-100" : "-translate-x-2 opacity-0"}`}
                    aria-hidden
                  />
                </a>
              </motion.li>
            );
          })}
        </ul>
        <div className="mt-auto flex items-center gap-6 border-t border-white/[0.07] pl-4 pt-5 text-[14px]">
          <Link href="/product" onClick={onPick} className="inline-flex items-center gap-1.5 font-medium text-[#A6BBFF] transition-colors hover:text-text">
            Explore the product <ArrowRight size={14} aria-hidden />
          </Link>
          <Link href="/download" onClick={onPick} className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-text">
            <Download size={14} aria-hidden /> Download for Mac
          </Link>
        </div>
      </div>

      {/* the preview */}
      <a
        href={it.href}
        onClick={onPick}
        tabIndex={-1}
        className="group/pv relative flex min-h-[460px] overflow-hidden rounded-[24px] border border-white/[0.07] outline-none"
        style={{
          background: `radial-gradient(80% 90% at 90% 100%, rgba(${it.hue},0.2), transparent 65%), radial-gradient(60% 60% at 0% 0%, rgba(${it.hue},0.07), transparent 60%), #0E1218`,
          transition: "background 450ms ease",
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(60%_70%_at_85%_85%,#000,transparent)]" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={a}
            className="relative grid flex-1 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-6 p-9"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.3, ease: calm }}
          >
            <div className="self-start">
              <motion.p
                className="text-[30px] font-medium leading-[34px] tracking-[-0.035em] text-text"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: calm }}
              >
                {it.title}
              </motion.p>
              <motion.p
                className="mt-2 text-[16px] leading-6 text-muted"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: calm, delay: 0.05 }}
              >
                {it.line}
              </motion.p>
              <span className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-semibold text-[#0B0E13] transition-shadow group-hover/pv:shadow-[0_0_0_4px_rgba(50,76,255,0.3)]">
                Explore
                <ArrowRight size={14} className="transition-transform duration-200 group-hover/pv:translate-x-0.5" aria-hidden />
              </span>
            </div>
            <motion.div
              className="justify-self-end"
              initial={reduce ? false : { opacity: 0, y: 24, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.55, ease: calm, delay: 0.05 }}
            >
              <div className="w-[380px] max-w-full overflow-hidden rounded-[18px] border border-white/[0.1] bg-[#0F1524] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <Preview n={n} on />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ the bar */

function BarLink({
  lit,
  current,
  children,
  ...rest
}: {
  lit: boolean;
  current: boolean;
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `relative flex h-11 items-center gap-1 rounded-full px-[18px] text-[15px] font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#009CFF] ${
    lit || current ? "text-text" : "text-text/55 hover:text-text"
  }`;
  const inner = (
    <>
      <span className="relative flex items-center gap-1">{children}</span>
      {/* a short stroke of light under the link: it glides to what you point at, and rests
          under the page you're on */}
      {lit && (
        <motion.span
          layoutId="nav-light"
          aria-hidden
          className="absolute inset-x-0 bottom-[5px] mx-auto h-[2px] w-5 rounded-full bg-[linear-gradient(90deg,#7A8FFF,#C3B6FF)] shadow-[0_0_8px_rgba(122,143,255,0.8)]"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        />
      )}
    </>
  );
  if (rest.href) return <a {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>{inner}</a>;
  return (
    <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>
      {inner}
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobileProduct, setMobileProduct] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const path = usePathname();
  const reduce = useReducedMotion();
  const isActive = (href: string) => !href.includes("#") && path.startsWith(href);
  const closeTimer = useRef(0);
  const openTimer = useRef(0);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open && !mega) return;
    const k = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setMega(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, mega]);

  const showMega = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setMega(true), 70);
  }, []);
  const hideMega = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 180);
  }, []);
  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const current = nav.find((l) => isActive(l.href))?.label ?? null;
  const lit = mega ? "Product" : (hover ?? current);
  const solid = scrolled || mega || open;

  return (
    <>
      {/* the page dims while the Product sheet is open */}
      <AnimatePresence>
        {mega && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-40 hidden bg-[#03050A]/55 backdrop-blur-md md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMega(false)}
          />
        )}
      </AnimatePresence>

      <header className="fixed inset-x-0 top-0 z-50" onPointerLeave={hideMega}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-text focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>

        {/* the bar: one big solid pill */}
        <div className="px-3 pt-3 md:px-6 md:pt-4">
          <div
            className={`nav-pill relative mx-auto flex h-[68px] max-w-[1200px] items-center rounded-full pl-8 pr-3.5 transition-shadow duration-300 ${solid ? "nav-pill--raised" : ""}`}
          >
            <a href={path === "/" ? "#top" : "/"} className="flex items-center gap-2.5" aria-label="Juno home" onPointerEnter={hideMega}>
              <JunoLogo height={22} className="text-text" />
            </a>

            <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
              <ul className="flex items-center" onPointerLeave={() => setHover(null)}>
                {nav.map((l) =>
                  l.label === "Product" ? (
                    <li key={l.label} onPointerEnter={showMega}>
                      <BarLink
                        lit={lit === l.label}
                        current={current === l.label}
                        aria-expanded={mega}
                        aria-controls="product-menu"
                        aria-haspopup="true"
                        onPointerEnter={() => setHover(l.label)}
                        onFocus={() => setHover(l.label)}
                        onClick={() => setMega((m) => !m)}
                      >
                        {l.label}
                        <ChevronDown size={14} strokeWidth={2.25} className={`opacity-70 transition-transform duration-300 ${mega ? "rotate-180" : ""}`} aria-hidden />
                      </BarLink>
                    </li>
                  ) : (
                    <li key={l.label} onPointerEnter={hideMega}>
                      <BarLink
                        lit={lit === l.label}
                        current={current === l.label}
                        href={l.href}
                        aria-current={current === l.label ? "page" : undefined}
                        onPointerEnter={() => setHover(l.label)}
                        onFocus={() => {
                          setHover(l.label);
                          setMega(false);
                        }}
                      >
                        {l.label}
                      </BarLink>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-1.5" onPointerEnter={hideMega}>
              <a href="#signin" className="hidden h-11 items-center rounded-full px-4 text-[15px] font-medium text-text/55 transition-colors hover:text-text md:inline-flex">
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
                {open ? <X size={20} strokeWidth={1.5} aria-hidden /> : <Menu size={20} strokeWidth={1.5} aria-hidden />}
              </button>
            </div>
          </div>
        </div>

        {/* Product: a solid panel that unfolds under the pill */}
        <AnimatePresence>
          {mega && (
            <motion.div
              id="product-menu"
              className="absolute inset-x-0 top-[88px] hidden px-6 pt-2 md:block"
              onPointerEnter={showMega}
              initial={reduce ? false : { opacity: 0, y: -10, clipPath: "inset(0% 0% 100% 0% round 28px)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 28px)" }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
              transition={{ duration: 0.45, ease: calm }}
            >
              <div className="nav-pill mx-auto max-w-[1200px] overflow-hidden rounded-[28px]">
                <ProductMenu onPick={() => setMega(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* phones */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="nav-pill mx-3 mt-2 max-h-[calc(100dvh-100px)] overflow-y-auto rounded-[28px] md:hidden"
            >
              <ul className="flex flex-col px-6 py-3">
                {nav.map((l) =>
                  l.label === "Product" ? (
                    <li key={l.label}>
                      <button
                        type="button"
                        aria-expanded={mobileProduct}
                        onClick={() => setMobileProduct((v) => !v)}
                        className={`flex min-h-12 w-full items-center justify-between text-[17px] ${current === l.label ? "text-[#A6BBFF]" : "text-text"}`}
                      >
                        {l.label}
                        <ChevronDown size={18} className={`text-muted transition-transform ${mobileProduct ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileProduct && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: calm }}
                            className="overflow-hidden"
                          >
                            {items.map(({ icon: Icon, title, href }) => (
                              <li key={title}>
                                <a href={href} onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 text-[15px] text-muted">
                                  <Icon size={16} strokeWidth={1.7} className="text-[#6B7789]" aria-hidden />
                                  {title}
                                </a>
                              </li>
                            ))}
                            <li>
                              <a href="/product" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-[#A6BBFF]">
                                Explore the product <ArrowRight size={14} aria-hidden />
                              </a>
                            </li>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        aria-current={current === l.label ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex min-h-12 items-center text-[17px] ${current === l.label ? "text-[#A6BBFF]" : "text-text"}`}
                      >
                        {l.label}
                      </a>
                    </li>
                  ),
                )}
                <li>
                  <a href="#signin" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[17px] text-text">
                    Sign in
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
