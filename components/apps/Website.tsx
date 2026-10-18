"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, FileText, Layers, Globe } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { apps } from "@/lib/apps";
import { IMG } from "@/lib/images";
import { Section, Window, base, snap, useIdle } from "./kit";

const w = apps.website;
const LAMP = "/home/spring-collection-hero.png";
type Page = "home" | "story" | "journal" | "article";
type PostId = (typeof w.posts)[number]["id"];
const postImg: Record<PostId, string> = { slow: LAMP, home: IMG.ceramicsHero };

/* Everyday Objects' own palette, used everywhere it appears */
const EO = { paper: "#F6F1E9", ink: "#26291f", olive: "#3f4a2f", rust: "#9a4a2c", muted: "#6f6a5f", line: "rgba(38,41,31,0.1)" };

export function Website() {
  const reduce = useReducedMotion();
  const [page, setPage] = useState<Page>("home");
  const [open, setOpen] = useState<PostId>("slow");
  const [published, setPublished] = useState<PostId[]>(["slow"]);
  const [fresh, setFresh] = useState<PostId | null>(null);
  const [cursor, setCursor] = useState<"off" | "move" | "press">("off");
  const cms = useRef<HTMLDivElement>(null);

  const publish = () => {
    if (published.includes("home")) return;
    setPublished((p) => [...p, "home"]);
    setPage("journal");
    setFresh("home");
    window.setTimeout(() => setFresh(null), 1600);
  };
  const touch = useIdle(cms, 6000, () => {
    if (reduce) return publish();
    setCursor("move");
    window.setTimeout(() => setCursor("press"), 900);
    window.setTimeout(() => {
      publish();
      setCursor("off");
    }, 1150);
  });
  const go = (p: Page) => {
    touch();
    setPage(p);
  };

  return (
    <Section id="website-blog-cms" labelledBy="web-title">
      <ChapterIntro id="web-title" lead={w.lead} muted={w.muted} sub={w.sub} />

      <div className="mx-auto mt-14 grid max-w-[1200px] gap-6 md:mt-20 lg:grid-cols-12 lg:gap-8">
        {/* the site */}
        <div className="lg:col-span-8">
          <Window url={w.url} chrome="#EDE7DC" ink={EO.ink} className="h-[600px] md:h-[620px]">
            <div className="flex h-full flex-col" style={{ background: EO.paper }}>
              <SiteNav page={page} go={go} />
              <div className="relative min-h-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={page === "article" ? `a-${open}` : page}
                    className="absolute inset-0 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: base }}
                  >
                    {page === "home" && <Home go={go} />}
                    {page === "story" && <Story />}
                    {page === "journal" && (
                      <Journal
                        posts={w.posts.filter((p) => published.includes(p.id))}
                        fresh={fresh}
                        openPost={(id) => {
                          touch();
                          setOpen(id);
                          setPage("article");
                        }}
                      />
                    )}
                    {page === "article" && <Article id={open} back={() => go("journal")} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Window>
          <p className="mt-4 text-[14px] text-muted">{w.note}</p>
        </div>

        {/* the CMS beside it */}
        <div ref={cms} className="flex flex-col gap-4 lg:col-span-4">
          <p className="flex items-center gap-2 text-[14px] text-text">
            <Layers size={15} className="text-muted" aria-hidden />
            {w.cms.title}
          </p>
          <div className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0E1218]">
            <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-4 text-[13px]">
              <span className="text-text">{w.cms.section}</span>
              <span className="text-muted">{w.cms.list}</span>
            </div>
            <ul>
              {w.posts.map((p) => {
                const live = published.includes(p.id);
                return (
                  <li key={p.id} className="flex items-start gap-3 border-b border-white/[0.05] px-4 py-4 last:border-0">
                    <FileText size={16} className="mt-0.5 shrink-0 text-muted" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] leading-5 text-text">
                        {p.title} {p.italic}
                      </p>
                      <p className="mt-1 text-[12.5px] text-muted">{live ? w.cms.ready : "Draft"}</p>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                      {live ? (
                        <motion.span
                          key="live"
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.12, ease: snap }}
                          className="shrink-0 rounded-full bg-[#3DD68C]/15 px-2.5 py-1 text-[11.5px] font-medium text-[#3DD68C]"
                        >
                          Published
                        </motion.span>
                      ) : (
                        <motion.span key="draft" exit={{ opacity: 0, transition: { duration: 0.1 } }} className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              touch();
                              publish();
                            }}
                            className={`h-8 rounded-full bg-[#F4F6F8] px-3.5 text-[12.5px] font-semibold text-[#07090D] transition-[box-shadow,transform] duration-200 hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)] ${cursor === "press" ? "scale-[0.96]" : ""}`}
                          >
                            Publish
                          </button>
                          {/* the idle hint: your cursor, once */}
                          <AnimatePresence>
                            {cursor !== "off" && (
                              <motion.span
                                aria-hidden
                                className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex items-start"
                                initial={{ x: 70, y: 60, opacity: 0 }}
                                animate={{ x: 4, y: 2, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: base }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                  <path d="M3.5 2.5 21 10.2l-7.6 2.3-3.3 7.9z" fill="#F4F6F8" stroke="#07090D" strokeWidth="1.2" strokeLinejoin="round" />
                                </svg>
                                <span className="ml-0.5 mt-3 rounded-full bg-[#324CFF] px-2 py-0.5 text-[11px] font-medium text-white">You</span>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-2 flex items-center justify-between text-[14px]">
            <span className="flex items-center gap-2 text-text">
              <FileText size={15} className="text-muted" aria-hidden />
              {w.cms.blog}
            </span>
            <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
              <Globe size={13} aria-hidden />
              {w.cms.live}
            </span>
          </div>
          {/* the newest post, as it reads on the site */}
          <LatestCard id={published[published.length - 1]} />
        </div>
      </div>
    </Section>
  );
}

function SiteNav({ page, go }: { page: Page; go: (p: Page) => void }) {
  const links: [Page, string][] = [
    ["home", "Home"],
    ["story", "Our story"],
    ["journal", "Journal"],
  ];
  return (
    <nav aria-label="Everyday Objects" className="flex h-16 shrink-0 items-center justify-between border-b px-5 @lg:px-8" style={{ borderColor: EO.line }}>
      <button type="button" onClick={() => go("home")} className="mock-serif text-left text-[17px] leading-[0.95]" style={{ color: EO.ink }}>
        everyday
        <br />
        objects.
      </button>
      <ul className="flex items-center gap-1">
        {links.map(([id, label]) => {
          const on = page === id || (id === "journal" && page === "article");
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => go(id)}
                aria-current={on ? "page" : undefined}
                className="relative h-11 px-2.5 text-[13px] transition-colors @lg:px-3.5"
                style={{ color: on ? EO.ink : EO.muted }}
              >
                {label}
                {on && <motion.span layoutId="eo-nav" className="absolute inset-x-2.5 bottom-2 h-px" style={{ background: EO.ink }} />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Home({ go }: { go: (p: Page) => void }) {
  const h = w.home;
  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 gap-5 px-5 pt-6 @lg:grid-cols-[1.1fr_1fr] @lg:gap-8 @lg:px-8 @lg:pt-8">
        <div className="flex flex-col justify-center">
          <p className="text-[11.5px]" style={{ color: EO.muted }}>
            {h.kicker}
          </p>
          <p className="mock-serif mt-3 text-[36px] leading-[1] @lg:text-[48px]" style={{ color: EO.ink }}>
            {h.title}
            <br />
            <em className="italic" style={{ color: EO.olive }}>
              {h.italic}
            </em>
          </p>
          <p className="mt-3 max-w-[30ch] text-[13px] leading-[19px]" style={{ color: EO.muted }}>
            {h.sub}
          </p>
          <button type="button" onClick={() => go("story")} className="mt-5 h-10 w-fit rounded-[8px] px-4 text-[12.5px] font-medium text-[#F6F1E9]" style={{ background: EO.olive }}>
            {h.cta}
          </button>
        </div>
        <div className="relative hidden min-h-[220px] overflow-hidden rounded-t-[999px] rounded-b-[18px] @lg:block">
          <Image src={LAMP} alt="Warm sunlight on a terracotta lamp, an oak table and an olive-green vase" fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover object-[60%_50%]" />
        </div>
      </div>
      <div className="px-5 pb-4 pt-5 @lg:px-8">
        <p className="text-[11.5px]" style={{ color: EO.muted }}>
          {h.inspo}
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          {w.posts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-[12px] bg-white/60 p-2 ring-1" style={{ ["--tw-ring-color" as string]: EO.line }}>
              <span className="relative size-12 shrink-0 overflow-hidden rounded-[8px]">
                <Image src={postImg[p.id]} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="min-w-0">
                <span className="block text-[10.5px]" style={{ color: EO.muted }}>
                  {p.tag}
                </span>
                <span className="mock-serif block truncate text-[14px] leading-tight" style={{ color: EO.ink }}>
                  {p.title} {p.italic}
                </span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 flex justify-between border-t pt-3 text-[10.5px]" style={{ borderColor: EO.line, color: EO.muted }}>
          <span>{h.footer.split(" Made")[0]}</span>
          <span className="max-@lg:hidden">Made{h.footer.split(" Made")[1]}</span>
        </p>
      </div>
    </div>
  );
}

function Story() {
  const s = w.story;
  return (
    <div className="grid h-full gap-6 px-5 py-8 @lg:grid-cols-[1fr_1fr] @lg:px-8">
      <div className="relative min-h-[200px] overflow-hidden rounded-[18px]">
        <Image src={IMG.vaseStone} alt="" fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-[11.5px]" style={{ color: EO.muted }}>
          Our story
        </p>
        <p className="mock-serif mt-3 text-[34px] leading-[1.02] @lg:text-[42px]" style={{ color: EO.ink }}>
          {s.title}{" "}
          <em className="italic" style={{ color: EO.rust }}>
            {s.italic}
          </em>
        </p>
        <p className="mt-4 max-w-[36ch] text-[13.5px] leading-[21px]" style={{ color: EO.muted }}>
          {s.body}
        </p>
      </div>
    </div>
  );
}

function Journal({ posts, fresh, openPost }: { posts: readonly (typeof w.posts)[number][]; fresh: PostId | null; openPost: (id: PostId) => void }) {
  return (
    <div className="h-full px-5 py-7 @lg:px-8">
      <p className="mock-serif text-[30px] leading-none" style={{ color: EO.ink }}>
        {w.journal}
      </p>
      <ul className="mt-6 space-y-3">
        <AnimatePresence initial={false}>
          {[...posts].reverse().map((p) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: base }}
              className="relative"
            >
              <button type="button" onClick={() => openPost(p.id)} className="group flex w-full items-center gap-4 rounded-[14px] bg-white/70 p-3 text-left ring-1" style={{ ["--tw-ring-color" as string]: EO.line }}>
                <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[10px]">
                  <Image src={postImg[p.id]} alt="" fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px]" style={{ color: EO.muted }}>
                    {p.tag}
                  </span>
                  <span className="mock-serif mt-1 block text-[19px] leading-tight" style={{ color: EO.ink }}>
                    {p.title} <em className="italic">{p.italic}</em>
                  </span>
                  <span className="mt-1 block truncate text-[12px]" style={{ color: EO.muted }}>
                    {p.line}
                  </span>
                </span>
                <ArrowRight size={16} className="mr-1 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: EO.muted }} aria-hidden />
              </button>
              <AnimatePresence>
                {fresh === p.id && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute -inset-1 rounded-[17px] ring-2 ring-[#324CFF]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                  >
                    <span className="absolute -top-2.5 right-3 rounded-full bg-[#324CFF] px-2 py-0.5 text-[10.5px] font-medium text-white">Just published</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Article({ id, back }: { id: PostId; back: () => void }) {
  const p = w.posts.find((x) => x.id === id)!;
  return (
    <div className="grid h-full @lg:grid-cols-[1fr_1fr]">
      <div className="relative hidden @lg:block">
        <Image src={postImg[id]} alt="" fill sizes="400px" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center px-5 py-8 @lg:px-8">
        <button type="button" onClick={back} className="flex w-fit items-center gap-1.5 text-[12px]" style={{ color: EO.muted }}>
          <ArrowLeft size={13} aria-hidden />
          {w.journal} / {p.tag}
        </button>
        <p className="mock-serif mt-5 text-[34px] leading-[1.02] @lg:text-[40px]" style={{ color: EO.ink }}>
          {p.title}
          <br />
          <em className="italic" style={{ color: EO.olive }}>
            {p.italic}
          </em>
        </p>
        <p className="mt-4 max-w-[30ch] text-[13.5px] leading-[21px]" style={{ color: EO.muted }}>
          {p.line}
        </p>
      </div>
    </div>
  );
}

/** The newest live post, the way it reads on the site. */
function LatestCard({ id }: { id: PostId }) {
  const p = w.posts.find((x) => x.id === id)!;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.4, ease: base }}
        className="grid grid-cols-[42%_1fr] overflow-hidden rounded-[18px]"
        style={{ background: EO.paper }}
      >
        <span className="relative min-h-[150px]">
          <Image src={postImg[id]} alt="" fill sizes="200px" className="object-cover" />
        </span>
        <span className="flex flex-col justify-center p-4">
          <span className="text-[10.5px]" style={{ color: EO.muted }}>
            {w.journal} / {p.tag}
          </span>
          <span className="mock-serif mt-2 text-[22px] leading-[1.02]" style={{ color: EO.ink }}>
            {p.title}
            <br />
            <em className="italic" style={{ color: EO.olive }}>
              {p.italic}
            </em>
          </span>
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
