import { Check, ChevronDown, Plus, UploadCloud } from "lucide-react";
import { Loadable, Sk } from "../Browser";
import { prog, typed, typingEnd, type Scenario } from "../kit";

/* A fictional app store developer console. */

const Harbor = ({ s = 14 }: { s?: number }) => (
  <svg viewBox="0 0 16 16" width={s} height={s} aria-hidden>
    <rect width="16" height="16" rx="4" fill="#5B4BFF" />
    <path d="M8 3.5 12 12H9.6L8 8.3 6.4 12H4z" fill="#fff" />
  </svg>
);
/** The user's app: Orbit, the dashboard Juno built earlier on the page. */
const OrbitIcon = ({ s = 40 }: { s?: number }) => (
  <svg viewBox="0 0 40 40" width={s} height={s} aria-hidden>
    <defs>
      <linearGradient id="orbitApp" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1B2350" />
        <stop offset="1" stopColor="#0A0E1F" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="url(#orbitApp)" />
    <ellipse cx="20" cy="20" rx="12" ry="5" fill="none" stroke="#7A8FFF" strokeWidth="1.6" transform="rotate(-20 20 20)" />
    <circle cx="20" cy="20" r="5" fill="#50E5FF" />
  </svg>
);

const URL = "console.appharbor.example/apps";
const NOTES = "Scheduled Reports, faster sync, and 12 fixes.";
const T = {
  url: 0.3,
  load: typingEnd(URL, 0.3) + 0.05,
  ready: 1.75,
  session: 1.5,
  app: 2.1,
  newVer: 2.6,
  ver: 2.95,
  notes: 3.6,
  build: 5.3,
  buildPick: 5.75,
  shots: 6.2,
  shotsDone: 7.5,
  checks: [7.8, 8.15, 8.5],
  submit: 9.0,
  ask: 9.1,
};

function Side({ app }: { app: boolean }) {
  return (
    <aside className="flex w-[170px] shrink-0 flex-col gap-0.5 border-r border-black/[0.06] bg-[#F7F7FB] p-3 text-[13px]">
      <span className="mb-4 flex items-center gap-2 px-2 pt-1 text-[14px] font-semibold tracking-[-0.01em]">
        <Harbor s={18} />
        AppHarbor
      </span>
      {app ? (
        <>
          <span className="mb-2 flex items-center gap-2 px-2">
            <OrbitIcon s={22} />
            <span className="font-medium">Orbit</span>
          </span>
          {["App information", "Pricing", "Version 2.4.0", "Ratings", "Analytics"].map((n) => (
            <span key={n} className={`rounded-md px-2 py-1.5 ${n === "Version 2.4.0" ? "bg-[#ECEAFF] font-medium text-[#3F2FE0]" : "text-[#4b515c]"}`}>
              {n}
            </span>
          ))}
        </>
      ) : (
        ["Apps", "Builds", "Payments", "Team"].map((n) => (
          <span key={n} className={`rounded-md px-2 py-1.5 ${n === "Apps" ? "bg-[#ECEAFF] font-medium text-[#3F2FE0]" : "text-[#4b515c]"}`}>
            {n}
          </span>
        ))
      )}
    </aside>
  );
}

function Apps() {
  return (
    <div className="flex h-full">
      <Side app={false} />
      <main className="flex-1 p-5">
        <p className="text-[19px] font-semibold tracking-[-0.02em]">Apps</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { n: "Orbit", p: "iOS · 2.3.2 live", icon: <OrbitIcon s={44} />, c: "app" },
            { n: "Orbit for iPad", p: "iPadOS · 2.3.2 live", icon: <OrbitIcon s={44} />, c: "" },
            { n: "Orbit Widgets", p: "iOS · 1.1.0 live", icon: <OrbitIcon s={44} />, c: "" },
          ].map((a) => (
            <div key={a.n} data-c={a.c || undefined} className="rounded-xl bg-white p-3.5 ring-1 ring-black/[0.07]">
              {a.icon}
              <p className="mt-2.5 text-[14px] font-semibold">{a.n}</p>
              <p className="text-[12.5px] text-[#5d6370]">{a.p}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/** A tiny phone screenshot of the Orbit app. */
function Shot({ k, p }: { k: number; p: number }) {
  return (
    <div className="relative h-[118px] w-[58px] overflow-hidden rounded-[10px] bg-[#0A0E1F] ring-1 ring-black/20">
      <div className="h-[22px] bg-[linear-gradient(90deg,#1B2350,#2B2F7A)]" />
      <div className="space-y-1.5 p-1.5">
        <div className="h-[30px] rounded-md bg-[linear-gradient(180deg,rgba(80,229,255,0.4),rgba(122,143,255,0.1))]" style={{ clipPath: k === 1 ? "polygon(0 70%,25% 40%,50% 55%,75% 20%,100% 35%,100% 100%,0 100%)" : undefined }} />
        <div className="h-1.5 w-3/4 rounded bg-white/30" />
        <div className="h-1.5 w-1/2 rounded bg-white/20" />
        <div className="h-1.5 w-2/3 rounded bg-white/20" />
      </div>
      {p < 1 && (
        <div className="absolute inset-0 grid place-items-center bg-white/75">
          <span className="h-1 w-[40px] overflow-hidden rounded-full bg-black/10">
            <span className="block h-full origin-left bg-[#5B4BFF]" style={{ transform: `scaleX(${p})` }} />
          </span>
        </div>
      )}
    </div>
  );
}

function Version({ t }: { t: number }) {
  const form = t >= T.newVer;
  const ver = typed("2.4.0", t, T.ver + 0.05, 20);
  const notes = typed(NOTES, t, T.notes + 0.05, 34);
  const buildOpen = t >= T.build && t < T.buildPick + 0.15;
  const build = t >= T.buildPick;
  const focus = t < T.notes ? "ver" : t < typingEnd(NOTES, T.notes + 0.05, 34) + 0.1 ? "notes" : "";
  const field = (on: boolean) => `rounded-lg bg-white px-3 text-[13px] ${on ? "ring-2 ring-[#5B4BFF]/50" : "ring-1 ring-black/15"}`;
  const checks = ["Privacy details", "Age rating", "Export compliance"];
  return (
    <div className="flex h-full">
      <Side app />
      <main className="relative min-w-0 flex-1 overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <OrbitIcon s={36} />
            <div>
              <p className="text-[17px] font-semibold tracking-[-0.02em]">Orbit · iOS</p>
              <p className="text-[12.5px] text-[#5d6370]">{form ? "Version 2.4.0 · Prepare for submission" : "Version 2.3.2 · Ready for sale"}</p>
            </div>
          </div>
          {form ? (
            <span data-c="submit" className={`inline-flex h-[32px] items-center rounded-lg px-3.5 text-[13px] font-medium ${t >= T.checks[2] ? "bg-[#5B4BFF] text-white" : "bg-[#ECEBF3] text-[#9aa0ab]"}`}>
              Submit for review
            </span>
          ) : (
            <span data-c="new-ver" className="inline-flex h-[32px] items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-medium ring-1 ring-black/10">
              <Plus size={14} aria-hidden />
              New version
            </span>
          )}
        </div>

        {form && (
          <div className="page-in mt-4 grid grid-cols-[1fr_200px] gap-4">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-[12px] font-medium text-[#4b515c]">Version</span>
                <span data-c="ver" className={`${field(focus === "ver")} flex h-[34px] items-center`}>{ver}</span>
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] font-medium text-[#4b515c]">What&apos;s new</span>
                <span data-c="notes" className={`${field(focus === "notes")} block h-[52px] py-2`}>{notes}</span>
              </label>
              <label className="relative block">
                <span className="mb-1 block text-[12px] font-medium text-[#4b515c]">Build</span>
                <span data-c="build" className={`${field(buildOpen)} flex h-[34px] items-center justify-between`}>
                  {build ? "2.4.0 (318) · uploaded today" : <span className="text-[#9aa0ab]">Select a build</span>}
                  <ChevronDown size={14} className="text-[#8a909c]" aria-hidden />
                </span>
                {buildOpen && (
                  <span className="pop-in absolute inset-x-0 top-[56px] z-10 rounded-xl bg-white p-1.5 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.08]">
                    {["2.4.0 (318) · today", "2.4.0 (317) · yesterday", "2.3.2 (309)"].map((o, i) => (
                      <span key={o} data-c={i === 0 ? "build-318" : undefined} className={`block rounded-md px-2.5 py-1.5 text-[13px] ${i === 0 && t >= T.buildPick - 0.25 ? "bg-[#ECEAFF] text-[#3F2FE0]" : ""}`}>
                        {o}
                      </span>
                    ))}
                  </span>
                )}
              </label>
              <div>
                <span className="mb-1.5 flex items-center justify-between text-[12px] font-medium text-[#4b515c]">
                  Screenshots
                  <span data-c="shots" className="inline-flex items-center gap-1 text-[#5B4BFF]">
                    <UploadCloud size={13} aria-hidden />
                    {t >= T.shots ? "From Drive · 6 images" : "Upload"}
                  </span>
                </span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((k) =>
                    t >= T.shots + k * 0.15 ? (
                      <Shot key={k} k={k} p={prog(t, T.shots + k * 0.15, T.shotsDone - (3 - k) * 0.1)} />
                    ) : (
                      <span key={k} className="h-[118px] w-[58px] rounded-[10px] border border-dashed border-black/15" />
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="h-fit rounded-xl bg-[#F7F7FB] p-3.5 ring-1 ring-black/[0.06]">
              <p className="text-[13px] font-semibold">Before you submit</p>
              <ul className="mt-2.5 space-y-2 text-[12.5px]">
                {[
                  { n: "Build attached", ok: build },
                  { n: "Screenshots", ok: t >= T.shotsDone },
                  ...checks.map((c, i) => ({ n: c, ok: t >= T.checks[i] })),
                ].map((c) => (
                  <li key={c.n} className="flex items-center gap-2">
                    <span className={`grid size-4 place-items-center rounded-full transition-colors duration-[120ms] ${c.ok ? "bg-[#1f9d5c] text-white" : "ring-1 ring-black/20"}`}>
                      {c.ok && <Check size={10} strokeWidth={3} aria-hidden />}
                    </span>
                    <span className={c.ok ? "text-[#16181d]" : "text-[#8a909c]"}>{c.n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Skel() {
  return (
    <div className="flex h-full">
      <div className="w-[170px] space-y-3 bg-[#F7F7FB] p-4">
        <Sk className="h-5 w-24" />
        {[0, 1, 2, 3].map((i) => (
          <Sk key={i} className="h-4 w-20" />
        ))}
      </div>
      <div className="flex-1 space-y-4 p-5">
        <Sk className="h-6 w-24" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <Sk key={i} className="h-[110px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export const appstore: Scenario = {
  id: "appstore",
  tab: "Submit to the app store",
  duration: 12,
  askAt: T.ask,
  approval: "Submit Orbit 2.4.0 for app review?",
  log: [
    { at: T.session, text: "Signed in to AppHarbor (no API, using the site)" },
    { at: T.newVer, done: T.ver + 0.4, text: "Created version 2.4.0" },
    { at: T.notes, done: typingEnd(NOTES, T.notes + 0.05, 34), text: "Wrote release notes from the changelog" },
    { at: T.build, done: T.shotsDone, text: "Attached build 318 and 6 screenshots" },
    { at: T.checks[0], done: T.checks[2] + 0.2, text: "Checked privacy, age rating, and export compliance" },
  ],
  cursor: [
    { at: T.app, target: "app", click: true },
    { at: T.newVer, target: "new-ver", click: true },
    { at: T.ver, target: "ver", click: true },
    { at: T.notes, target: "notes", click: true },
    { at: T.build, target: "build", click: true },
    { at: T.buildPick, target: "build-318", click: true },
    { at: T.shots, target: "shots", click: true },
    { at: T.submit, target: "submit" },
  ],
  chrome: (t) => ({
    tabs: [
      { title: "Orbit · AppHarbor", icon: <Harbor />, active: true },
      { title: "Changelog · 2.4.0", icon: <span className="block size-3.5 rounded-[3px] bg-[#16181d]" />, active: false },
    ],
    url: t < T.load ? typed(URL, t, T.url) : t >= T.newVer ? "console.appharbor.example/apps/orbit/versions/new" : t >= T.app + 0.1 ? "console.appharbor.example/apps/orbit" : URL,
    typing: t < T.load,
    loading: t >= T.load && t < T.ready,
    session: t >= T.session,
  }),
  Page: ({ t }) => (
    <Loadable ready={t >= T.ready} skeleton={t >= T.load ? <Skel /> : <div className="h-full bg-white" />}>
      {t >= T.app + 0.1 ? <Version t={t} /> : <Apps />}
    </Loadable>
  ),
};
