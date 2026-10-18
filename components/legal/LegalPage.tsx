"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, Mail } from "lucide-react";
import { MascotMark } from "@/components/mascot/Mascot";
import { CONTACT_EMAIL, type Block, type LegalDoc } from "@/lib/legal";

/**
 * Privacy and Terms, in the site's newest look: a lit title with the other document a click
 * away, a contents panel that follows you down the page and lights the section you're in,
 * and the text set to be read, with numbered sections and glowing bullets.
 */

const calm = [0.16, 1, 0.3, 1] as const;

/** The few phrases that point somewhere: the other document, and the email. */
const links: [string, string][] = [
  ["Terms of Service", "/terms"],
  ["Privacy Policy", "/privacy"],
  [CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`],
];

function Linked({ text, self }: { text: string; self: string }) {
  const parts: ReactNode[] = [];
  let rest = text;
  let k = 0;
  while (rest) {
    let hit: { i: number; phrase: string; href: string } | null = null;
    for (const [phrase, href] of links) {
      if (href === self) continue;
      const i = rest.indexOf(phrase);
      if (i >= 0 && (!hit || i < hit.i)) hit = { i, phrase, href };
    }
    if (!hit) {
      parts.push(rest);
      break;
    }
    parts.push(rest.slice(0, hit.i));
    parts.push(
      hit.href.startsWith("/") ? (
        <Link key={k++} href={hit.href} className="text-[#A6BBFF] underline decoration-[#A6BBFF]/40 underline-offset-4 transition-colors hover:text-text">
          {hit.phrase}
        </Link>
      ) : (
        <a key={k++} href={hit.href} className="text-[#A6BBFF] underline decoration-[#A6BBFF]/40 underline-offset-4 transition-colors hover:text-text">
          {hit.phrase}
        </a>
      ),
    );
    rest = rest.slice(hit.i + hit.phrase.length);
  }
  return <>{parts}</>;
}

function Blocks({ blocks, self }: { blocks: Block[]; self: string }) {
  return (
    <>
      {blocks.map((b, i) =>
        "p" in b ? (
          <p key={i} className="mt-4 text-[17px] leading-[29px] text-muted first:mt-0">
            <Linked text={b.p} self={self} />
          </p>
        ) : (
          <ul key={i} className="mt-5 space-y-3.5 first:mt-0">
            {b.ul.map((li) => (
              <li key={li.text} className="relative pl-7 text-[17px] leading-[29px] text-muted">
                <span aria-hidden className="absolute left-1 top-[12px] size-[6px] rounded-full bg-[#A6BBFF] shadow-[0_0_10px_rgba(166,187,255,0.9)]" />
                {li.lead && <strong className="font-medium text-text">{li.lead} </strong>}
                <Linked text={li.text} self={self} />
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(doc.sections[0].id);
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: body, offset: ["start 30%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // light the section you're reading
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [doc.sections]);

  const other = doc.slug === "privacy" ? { href: "/terms", label: "Terms of service" } : { href: "/privacy", label: "Privacy policy" };
  const toc = (
    <ol className="space-y-0.5">
      {doc.sections.map((s, i) => {
        const on = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={() => setOpen(false)}
              className={`relative flex items-baseline gap-3 rounded-[10px] py-2 pl-4 pr-3 text-[14px] leading-5 transition-colors duration-200 ${on ? "bg-white/[0.04] text-text" : "text-muted hover:text-text"}`}
            >
              {on && (
                <motion.span
                  layoutId={`legal-light-${doc.slug}`}
                  aria-hidden
                  className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-[linear-gradient(180deg,#7A8FFF,#C3B6FF)] shadow-[0_0_10px_rgba(122,143,255,0.9)]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className={`w-5 shrink-0 font-mono text-[11.5px] ${on ? "text-[#A6BBFF]" : "text-subtle"}`}>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <section aria-labelledby="legal-title" className="relative pb-28 pt-[136px] md:pb-40 md:pt-[176px]">
      {/* glow 1 of 2 */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40px] h-[620px] w-[min(1300px,160vw)] -translate-x-1/2"
        style={{ background: "radial-gradient(40% 45% at 50% 40%, rgba(50,76,255,0.2), rgba(143,124,255,0.07) 55%, transparent 76%)" }}
      />

      {/* the title */}
      <div className="container-page relative flex flex-col items-center text-center">
        {/* the other document, a click away */}
        <div className="nav-pill inline-flex rounded-full p-1" role="navigation" aria-label="Legal">
          {[
            { href: "/privacy", label: "Privacy", on: doc.slug === "privacy" },
            { href: "/terms", label: "Terms", on: doc.slug === "terms" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              aria-current={t.on ? "page" : undefined}
              className={`relative rounded-full px-5 py-2 text-[14px] font-medium transition-colors ${t.on ? "bg-white/[0.08] text-text" : "text-text/55 hover:text-text"}`}
            >
              {t.label}
              {t.on && <span aria-hidden className="absolute inset-x-0 bottom-[3px] mx-auto h-[2px] w-4 rounded-full bg-[linear-gradient(90deg,#7A8FFF,#C3B6FF)] shadow-[0_0_8px_rgba(122,143,255,0.8)]" />}
            </Link>
          ))}
        </div>
        <motion.h1
          id="legal-title"
          className="t-display-xl mt-8 text-balance"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: calm }}
        >
          {doc.title}{" "}
          <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_55%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">{doc.word}</span>
        </motion.h1>
        <motion.p
          className="t-body-l mt-5 max-w-[42ch] text-pretty text-muted"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: calm }}
        >
          {doc.sub}
        </motion.p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-[13px] text-muted">
          <span className="size-1.5 rounded-full bg-[#5BE3A2] shadow-[0_0_8px_#5BE3A2]" />
          Last updated {doc.updated}
        </p>
      </div>

      <div ref={body} className="container-page relative mt-16 grid gap-10 md:mt-24 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
        {/* contents: a lit panel that follows you down (desktop), a drop-down on phones */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="nav-pill hidden overflow-hidden rounded-[22px] lg:block">
            <div className="relative px-5 pb-3 pt-5">
              <p className="text-[13px] font-medium text-text">On this page</p>
              <span aria-hidden className="absolute inset-x-5 bottom-0 h-px bg-white/[0.06]">
                <motion.span
                  className="block h-full origin-left bg-[linear-gradient(90deg,#7A8FFF,#C3B6FF)] shadow-[0_0_10px_rgba(122,143,255,0.9)]"
                  style={{ scaleX: reduce ? 1 : progress }}
                />
              </span>
            </div>
            <nav aria-label="On this page" className="max-h-[calc(100vh-220px)] overflow-y-auto p-2">
              {toc}
            </nav>
            <Link
              href={other.href}
              className="group flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5 text-[13.5px] text-[#A6BBFF] transition-colors hover:text-text"
            >
              {other.label}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
          <div className="nav-pill overflow-hidden rounded-[20px] lg:hidden">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-14 w-full items-center justify-between px-5 text-[15px] font-medium text-text"
            >
              On this page
              <ChevronDown size={18} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {open && <nav aria-label="On this page" className="border-t border-white/[0.06] p-2">{toc}</nav>}
          </div>
        </aside>

        {/* the text */}
        <div className="min-w-0 max-w-[720px]">
          {doc.sections.map((s, i) => (
            <Fragment key={s.id}>
              <section id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-t border-white/[0.06] py-10 first:border-t-0 first:pt-0 md:py-12">
                <h2 id={`${s.id}-h`} className="flex items-baseline gap-4 text-[24px] font-medium leading-[30px] tracking-[-0.02em] text-text md:text-[28px] md:leading-[34px]">
                  <span className="font-mono text-[13px] font-normal tracking-normal text-[#A6BBFF]">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                <div className="mt-5 md:pl-[38px]">
                  <Blocks blocks={s.blocks} self={`/${doc.slug}`} />
                </div>
              </section>
            </Fragment>
          ))}

          {/* questions */}
          <div className="contact-console relative mt-6 flex flex-col items-start gap-5 overflow-hidden rounded-[24px] p-6 sm:flex-row sm:items-center md:p-7">
            <span className="relative grid size-12 shrink-0 place-items-center">
              <span aria-hidden className="cta-breathe absolute -inset-3 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(110,140,255,0.5), transparent)" }} />
              <MascotMark size={40} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-medium text-text">Questions about this {doc.slug === "privacy" ? "policy" : "agreement"}?</p>
              <p className="mt-0.5 text-[14.5px] text-muted">Write to Mailmunch, Inc. We’re happy to help.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.14] px-4 text-[14px] font-medium text-text transition-colors hover:bg-white/[0.06]"
              >
                <Mail size={14} aria-hidden /> {CONTACT_EMAIL}
              </a>
              <Link href="/contact" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-text px-4 text-[14px] font-semibold text-bg transition-shadow hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)]">
                Contact <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
