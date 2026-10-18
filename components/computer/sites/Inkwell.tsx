import {
  ArrowLeft,
  Check,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Plus,
  Settings,
  Users,
  PenLine,
  LayoutGrid,
} from "lucide-react";
import { Loadable, Sk } from "../Browser";
import { prog, typed, typingEnd, type Scenario } from "../kit";

/** Inkwell, a blogging CMS. Juno writes the launch post, publishes it, then checks it is live. */

const Ink = ({ s = 14 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden>
    <rect width="16" height="16" rx="4" fill="#15171A" />
    <path d="M8 3.2c1.9 2.4 3 4.1 3 5.6a3 3 0 0 1-6 0c0-1.5 1.1-3.2 3-5.6z" fill="#fff" />
  </svg>
);

const URL = "cms.inkwell.com";
const TITLE = "Monday, handled: meet Scheduled Reports";
const BODY =
  "Every Monday at 9, Orbit now sends your team its weekly report on its own. No exports, no copy and paste, no chasing numbers before standup.\nPick the metrics once and choose who gets it. Orbit takes it from there, every week.";

const titleAt = 2.75;
const titleEnd = typingEnd(TITLE, titleAt, 30);
const bodyAt = titleEnd + 0.3;
const bodyEnd = typingEnd(BODY, bodyAt, 90);

const T = {
  url: 0.3,
  load: typingEnd(URL, 0.3) + 0.05,
  session: 1.2,
  ready: 1.5,
  newPost: 2.1,
  editor: 2.45,
  title: 2.65,
  titleEnd,
  body: bodyAt - 0.05,
  bodyEnd,
  feature: bodyEnd + 0.35,
  featureReady: bodyEnd + 0.85,
  settings: bodyEnd + 1.3,
  tags: bodyEnd + 1.8,
  tagPick: bodyEnd + 2.3,
  publish: bodyEnd + 2.8,
  only: bodyEnd + 3.3,
  confirm: bodyEnd + 3.75,
  live: bodyEnd + 4.25,
  liveReady: bodyEnd + 4.75,
  ask: bodyEnd + 5.8,
};

/** The feature image: a clean product shot of the weekly report. */
function Cover({ h }: { h: number }) {
  const pts = [30, 34, 31, 40, 38, 47, 45, 55, 52, 61, 66, 72];
  const line = pts
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${((i / (pts.length - 1)) * 200).toFixed(1)} ${(50 - (v / 80) * 50).toFixed(1)}`,
    )
    .join(" ");
  return (
    <div
      className="relative grid w-full place-items-center overflow-hidden rounded-lg bg-[linear-gradient(135deg,#E9ECFF,#F6E9FF)]"
      style={{ height: h }}
    >
      <div className="absolute -right-10 -top-12 size-40 rounded-full bg-white/50" />
      <div className="relative w-[58%] rounded-lg bg-white p-2.5 shadow-[0_18px_40px_-18px_rgba(60,50,140,0.45)] ring-1 ring-black/[0.05]">
        <p className="flex items-center justify-between text-[9px]">
          <span className="font-semibold">Weekly report</span>
          <span className="text-[#8a909c]">Mon 9:00</span>
        </p>
        <p className="mt-1 flex items-baseline gap-1 text-[14px] font-semibold tracking-[-0.02em]">
          $48.2K <span className="text-[8.5px] font-medium text-[#1f9d5c]">+12%</span>
        </p>
        <svg
          viewBox="0 0 200 50"
          className="mt-1 h-[34px] w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={`${line} L200 50 L0 50 Z`} fill="#5B6DFF" fillOpacity="0.14" />
          <path
            d={line}
            fill="none"
            stroke="#4F63F5"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}

function Side() {
  return (
    <div className="flex w-[168px] shrink-0 flex-col gap-0.5 border-r border-black/[0.06] bg-[#F7F7F5] px-3 py-4 text-[12.5px]">
      <span className="mb-4 flex items-center gap-2 px-2 text-[13.5px] font-semibold">
        <span className="grid size-6 place-items-center rounded-md bg-[#4F5BFF]">
          <span className="size-2.5 rounded-full border-2 border-white" />
        </span>
        Orbit blog
      </span>
      {(
        [
          [LayoutGrid, "Dashboard"],
          [PenLine, "Posts"],
          [FileText, "Pages"],
          [ImageIcon, "Media"],
          [Users, "Members"],
        ] as const
      ).map(([I, l]) => (
        <span
          key={l}
          className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 ${l === "Posts" ? "bg-white font-medium text-[#15171A] shadow-sm ring-1 ring-black/[0.04]" : "text-[#6B7080]"}`}
        >
          <I size={14} strokeWidth={1.75} aria-hidden />
          {l}
        </span>
      ))}
      <span className="mt-auto flex items-center gap-2 px-2 text-[11.5px] text-[#8a909c]">
        <Ink s={14} />
        Inkwell
      </span>
    </div>
  );
}

const posts = [
  { t: "How Lumen Health runs on Orbit", s: "Published", d: "Oct 9", a: "Lena Park" },
  {
    t: "Five reports every founder should read on Monday",
    s: "Published",
    d: "Sep 30",
    a: "Ana Ruiz",
  },
  { t: "Q4 roadmap: what we are building next", s: "Draft", d: "Edited 2d ago", a: "Sam Okafor" },
  { t: "Orbit for agencies", s: "Scheduled", d: "Oct 22", a: "Ana Ruiz" },
];

function List({ t }: { t: number }) {
  return (
    <div className="flex h-full bg-white">
      <Side />
      <div className="flex-1 px-7 py-5">
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-semibold tracking-[-0.03em]">Posts</p>
          <span
            data-c="new-post"
            className={`inline-flex h-[32px] items-center gap-1.5 rounded-lg bg-[#15171A] px-3.5 text-[12.5px] font-medium text-white transition-transform ${t >= T.newPost && t < T.newPost + 0.18 ? "scale-[0.96]" : ""}`}
          >
            <Plus size={14} aria-hidden />
            New post
          </span>
        </div>
        <div className="mt-4 flex gap-4 border-b border-black/[0.06] text-[12.5px] text-[#6B7080]">
          {["All posts", "Drafts", "Scheduled", "Published"].map((f, i) => (
            <span
              key={f}
              className={`pb-2 ${i === 0 ? "border-b-2 border-[#15171A] font-medium text-[#15171A]" : ""}`}
            >
              {f}
            </span>
          ))}
        </div>
        <ul className="divide-y divide-black/[0.05]">
          {posts.map((p) => (
            <li key={p.t} className="flex items-center gap-4 py-3.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{p.t}</span>
                <span className="block text-[12px] text-[#8a909c]">By {p.a} · in Product</span>
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  p.s === "Published"
                    ? "bg-[#E8F7EE] text-[#15803D]"
                    : p.s === "Draft"
                      ? "bg-[#F1F1EF] text-[#6B7080]"
                      : "bg-[#EEF0FF] text-[#4350D6]"
                }`}
              >
                {p.s}
              </span>
              <span className="w-[86px] text-right text-[12px] text-[#8a909c]">{p.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Editor({ t }: { t: number }) {
  const title = typed(TITLE, t, titleAt, 30);
  const body = typed(BODY, t, bodyAt, 90).split("\n");
  const focusTitle = t >= T.title && t < T.body;
  const focusBody = t >= T.body && t < T.feature;
  const feature = t >= T.feature;
  const panel = t >= T.settings;
  const tagsOpen = t >= T.tags && t < T.tagPick + 0.15;
  const tag = t >= T.tagPick;
  const modal = t >= T.publish;
  const only = t >= T.only;
  const words = BODY.slice(0, Math.max(0, Math.floor((t - bodyAt) * 90)))
    .split(/\s+/)
    .filter(Boolean).length;
  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* editor bar */}
      <div className="flex h-[44px] shrink-0 items-center gap-3 px-4 text-[12.5px] text-[#6B7080]">
        <span className="flex items-center gap-1.5">
          <ArrowLeft size={14} aria-hidden />
          Posts
        </span>
        <span className="text-[#B4B8C2]">/</span>
        <span>
          {t >= T.publish ? "Draft · Saved" : words ? `Draft · ${words} words` : "New draft"}
        </span>
        <span className="ml-auto">Preview</span>
        <span
          data-c="publish"
          className={`inline-flex h-[28px] items-center rounded-md px-3 font-medium text-white transition-transform ${tag ? "bg-[#14B886]" : "bg-[#14B886]/50"} ${t >= T.publish && t < T.publish + 0.18 ? "scale-[0.96]" : ""}`}
        >
          Publish
        </span>
        <span
          data-c="settings"
          className={`grid size-7 place-items-center rounded-md ${panel ? "bg-[#F1F1EF] text-[#15171A]" : ""}`}
        >
          <Settings size={15} aria-hidden />
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* the post */}
        <div className="min-w-0 flex-1 overflow-hidden px-10 pt-2">
          <div className="mx-auto max-w-[460px]">
            {feature ? (
              t >= T.featureReady ? (
                <div className="page-in">
                  <Cover h={118} />
                </div>
              ) : (
                <Sk className="h-[118px] w-full" />
              )
            ) : (
              <span
                data-c="feature"
                className="inline-flex h-[24px] items-center gap-1.5 text-[12.5px] text-[#8a909c]"
              >
                <Plus size={13} aria-hidden />
                Add feature image
              </span>
            )}
            <p
              data-c="title"
              className={`mt-3 text-[26px] font-bold leading-[1.12] tracking-[-0.03em] ${title ? "" : "text-[#C9CCD3]"}`}
            >
              {title || "Post title"}
              {focusTitle && (
                <span className="caret ml-0.5 inline-block h-[24px] w-[2px] translate-y-[4px] bg-[#15171A]" />
              )}
            </p>
            <div
              data-c="body"
              className="mt-3 space-y-2.5 text-[13.5px] leading-[21px] text-[#33363D]"
            >
              {body[0] ? (
                body.map((para, i) => (
                  <p key={i}>
                    {para}
                    {focusBody && i === body.length - 1 && (
                      <span className="caret ml-px inline-block h-[15px] w-px translate-y-[3px] bg-[#15171A]" />
                    )}
                  </p>
                ))
              ) : (
                <p className="text-[#C9CCD3]">Begin writing your post</p>
              )}
            </div>
          </div>
        </div>

        {/* post settings */}
        {panel && (
          <div className="tray-in w-[220px] shrink-0 space-y-3.5 border-l border-black/[0.06] bg-[#FBFBFA] p-4 text-[12px]">
            <p className="text-[14px] font-semibold">Post settings</p>
            <label className="block">
              <span className="mb-1 block font-medium text-[#4b515c]">Post URL</span>
              <span className="flex h-[30px] items-center truncate rounded-md bg-white px-2.5 ring-1 ring-black/10">
                orbit.blog/scheduled-reports
              </span>
            </label>
            <label className="relative block">
              <span className="mb-1 block font-medium text-[#4b515c]">Tags</span>
              <span
                data-c="tags"
                className={`flex h-[30px] items-center gap-1.5 rounded-md bg-white px-2 ${tagsOpen ? "ring-2 ring-[#14B886]/50" : "ring-1 ring-black/10"}`}
              >
                {tag ? (
                  <span className="rounded bg-[#15171A] px-1.5 py-0.5 text-[11px] text-white">
                    Product
                  </span>
                ) : tagsOpen ? (
                  <span>{typed("Prod", t, T.tags + 0.05, 16)}</span>
                ) : null}
              </span>
              {tagsOpen && (
                <span className="pop-in absolute inset-x-0 top-[52px] z-10 rounded-lg bg-white p-1 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.08]">
                  <span
                    data-c="tag-opt"
                    className={`block rounded px-2 py-1.5 ${t >= T.tagPick - 0.25 ? "bg-[#E8F7EE] text-[#15803D]" : ""}`}
                  >
                    Product
                  </span>
                  <span className="block px-2 py-1.5 text-[#8a909c]">Create &quot;Prod&quot;</span>
                </span>
              )}
            </label>
            <label className="block">
              <span className="mb-1 block font-medium text-[#4b515c]">Authors</span>
              <span className="flex h-[30px] items-center justify-between rounded-md bg-white px-2.5 ring-1 ring-black/10">
                Ana Ruiz
                <ChevronDown size={13} className="text-[#8a909c]" aria-hidden />
              </span>
            </label>
            <label className="block">
              <span className="mb-1 block font-medium text-[#4b515c]">Excerpt</span>
              <span className="block rounded-md bg-white p-2.5 leading-[16px] text-[#4b515c] ring-1 ring-black/10">
                Your weekly report, sent every Monday at 9 without anyone lifting a finger.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* publish flow */}
      {modal && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#15171A]/25">
          <div className="pop-in w-[340px] rounded-2xl bg-white p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
            <p className="text-[17px] font-semibold tracking-[-0.02em]">Ready to publish?</p>
            <p className="mt-1 text-[12.5px] text-[#6B7080]">
              It goes live on orbit.blog right away.
            </p>
            <div className="mt-4 space-y-2 text-[13px]">
              {[
                ["email", "Publish and email 4,212 subscribers"],
                ["only", "Publish on the site only"],
              ].map(([k, l]) => {
                const on = k === "only" ? only : !only;
                return (
                  <span
                    key={k}
                    data-c={k === "only" ? "only" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ring-1 ${on ? "bg-[#F2FBF7] ring-[#14B886]/60" : "ring-black/10"}`}
                  >
                    <span
                      className={`grid size-4 place-items-center rounded-full ${on ? "bg-[#14B886]" : "ring-1 ring-black/25"}`}
                    >
                      {on && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                    {l}
                  </span>
                );
              })}
            </div>
            <span
              data-c="confirm"
              className={`mt-4 flex h-[36px] items-center justify-center rounded-lg bg-[#15171A] text-[13px] font-medium text-white transition-transform ${t >= T.confirm && t < T.confirm + 0.18 ? "scale-[0.97]" : ""}`}
            >
              Publish post, right now
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Live({ t }: { t: number }) {
  const toast = prog(t, T.liveReady + 0.2, T.liveReady + 0.5);
  return (
    <div className="relative h-full bg-white">
      <div className="flex items-center gap-6 border-b border-black/[0.06] px-8 py-3 text-[12.5px] text-[#6B7080]">
        <span className="flex items-center gap-2 text-[14px] font-semibold text-[#15171A]">
          <span className="grid size-5 place-items-center rounded-md bg-[#4F5BFF]">
            <span className="size-2 rounded-full border-2 border-white" />
          </span>
          Orbit
        </span>
        <span>Product</span>
        <span>Customers</span>
        <span>Changelog</span>
        <span className="ml-auto rounded-full bg-[#15171A] px-3 py-1 text-[11.5px] font-medium text-white">
          Subscribe
        </span>
      </div>
      <div className="mx-auto max-w-[500px] pt-5">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[#4F5BFF]">
          Product
        </p>
        <p className="mt-1.5 text-[28px] font-bold leading-[1.08] tracking-[-0.035em]">{TITLE}</p>
        <p className="mt-2.5 flex items-center gap-2 text-[12px] text-[#6B7080]">
          <span className="grid size-5 place-items-center rounded-full bg-[#F6D5C2] text-[8px] font-semibold text-[#15171A]">
            AR
          </span>
          Ana Ruiz · Oct 18 · 2 min read
        </p>
        <div className="mt-4">
          <Cover h={150} />
        </div>
        <p className="mt-4 text-[13.5px] leading-[21px] text-[#33363D]">{BODY.split("\n")[0]}</p>
      </div>
      <div
        className="absolute right-4 top-14 flex items-center gap-2 rounded-xl bg-[#15171A] px-3.5 py-2.5 text-[12.5px] text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)]"
        style={{ opacity: toast, transform: `translateY(${(1 - toast) * -8}px)` }}
      >
        <span className="grid size-4 place-items-center rounded-full bg-[#14B886]">
          <Check size={10} strokeWidth={3} aria-hidden />
        </span>
        Published · live on orbit.blog
      </div>
    </div>
  );
}

function ListSkel() {
  return (
    <div className="flex h-full bg-white">
      <div className="w-[168px] shrink-0 bg-[#F7F7F5]" />
      <div className="flex-1 space-y-4 px-7 py-6">
        <Sk className="h-6 w-28" />
        {[0, 1, 2, 3].map((i) => (
          <Sk key={i} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}

function LiveSkel() {
  return (
    <div className="mx-auto h-full max-w-[500px] space-y-3 bg-white pt-14">
      <Sk className="h-3 w-16" />
      <Sk className="h-8 w-full" />
      <Sk className="h-[150px] w-full" />
    </div>
  );
}

export const publish: Scenario = {
  id: "publish",
  tab: "Publish a blog post",
  duration: T.ask + 3.1,
  askAt: T.ask,
  approval: "The post is live. Email it to Orbit’s 4,212 subscribers too?",
  log: [
    { at: T.session, done: T.ready, text: "Opened the blog in Inkwell" },
    {
      at: T.title,
      done: T.bodyEnd,
      text: "Wrote the post from release notes",
      live: (t) =>
        `Writing the post · ${
          BODY.slice(0, Math.max(0, Math.floor((t - bodyAt) * 90)))
            .split(/\s+/)
            .filter(Boolean).length
        } words`,
    },
    { at: T.feature, done: T.tagPick + 0.2, text: "Added a cover and a tag" },
    { at: T.publish, done: T.live, text: "Published to orbit.blog" },
    { at: T.liveReady, done: T.ask - 0.3, text: "Checked the live page" },
  ],
  cursor: [
    { at: T.newPost, target: "new-post", click: true },
    { at: T.title, target: "title", click: true },
    { at: T.body, target: "body", click: true },
    { at: T.feature, target: "feature", click: true },
    { at: T.settings, target: "settings", click: true },
    { at: T.tags, target: "tags", click: true },
    { at: T.tagPick, target: "tag-opt", click: true },
    { at: T.publish, target: "publish", click: true },
    { at: T.only, target: "only", click: true },
    { at: T.confirm, target: "confirm", click: true },
  ],
  chrome: (t) => ({
    tabs: [
      {
        title: t >= T.live ? "Monday, handled · Orbit" : "Orbit blog · Inkwell",
        icon: <Ink />,
        active: true,
      },
      {
        title: "Release notes · Notion",
        icon: <span className="block size-3.5 rounded-[3px] bg-[#16181d]" />,
        active: false,
      },
    ],
    url:
      t < T.load
        ? typed(URL, t, T.url)
        : t >= T.live
          ? "orbit.blog/scheduled-reports"
          : t >= T.editor
            ? "cms.inkwell.com/orbit/editor/post/new"
            : "cms.inkwell.com/orbit/posts",
    typing: t < T.load,
    loading: (t >= T.load && t < T.ready) || (t >= T.live && t < T.liveReady),
    session: t >= T.session && t < T.live,
  }),
  Page: ({ t }) => {
    if (t < T.editor)
      return (
        <Loadable
          ready={t >= T.ready}
          skeleton={t >= T.load ? <ListSkel /> : <div className="h-full bg-white" />}
        >
          {<List t={t} />}
        </Loadable>
      );
    if (t < T.live) return <Editor t={t} />;
    return (
      <Loadable ready={t >= T.liveReady} skeleton={<LiveSkel />}>
        {<Live t={t} />}
      </Loadable>
    );
  },
};
