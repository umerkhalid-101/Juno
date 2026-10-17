"use client";

import type { ReactNode } from "react";
import { ArrowRight, Check, Search } from "lucide-react";

/**
 * The mini visuals on each job card: light "paper" product moments in the homepage's language.
 * Copy is verbatim from the live page. `live` turns on the card's one hover change.
 */

const INK = "#14161f";
const MUTED = "#6b7080";

export function Paper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[18px] bg-[#FBFAF7] p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] ring-1 ring-black/[0.04] ${className}`}
      style={{ color: INK }}
    >
      {children}
    </div>
  );
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="font-mono text-[10.5px] uppercase tracking-[0.08em]" style={{ color: MUTED }}>
    {children}
  </p>
);
const Head = ({ children }: { children: ReactNode }) => (
  <p className="mt-2 text-[22px] font-semibold leading-[1.08] tracking-[-0.03em]">{children}</p>
);

/** A small status word on paper. Always a word, never color alone. */
export function Status({
  tone,
  children,
  className = "",
}: {
  tone: "ok" | "warn" | "blue";
  children: ReactNode;
  className?: string;
}) {
  const t =
    tone === "ok"
      ? "bg-[#E9F7EF] text-[#1f7a4d]"
      : tone === "warn"
        ? "bg-[#FFF4E0] text-[#a35f00]"
        : "bg-[#EEF0FF] text-[#3346e0]";
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center rounded-md px-2 font-mono text-[10px] uppercase tracking-[0.08em] ${t} ${className}`}
    >
      {children}
    </span>
  );
}

const pop = (on: boolean) =>
  `transition-[transform,opacity] duration-300 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] ${on ? "scale-100 opacity-100" : "scale-[0.92] opacity-0"}`;

export function JobVisual({ slug, live = false }: { slug: string; live?: boolean }) {
  switch (slug) {
    case "find-our-next-customers":
      return (
        <Paper className="w-[440px]">
          <Eyebrow>A reason to reach out</Eyebrow>
          <Head>Your next “let&apos;s talk.”</Head>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
            <span className="grid size-9 place-items-center rounded-lg bg-[#EEF0FF] text-[13px] font-semibold text-[#3346e0]">
              O
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[14px] font-medium">Orbit Studio</span>
              <span className="block text-[12px]" style={{ color: MUTED }}>
                Growing their client services team
              </span>
            </span>
            <Status tone="blue" className={pop(live)}>
              New lead
            </Status>
          </div>
          <p className="mt-3 text-[13px] leading-[19px]" style={{ color: MUTED }}>
            “Saw you&apos;re expanding the team. Here&apos;s a simpler way to share client reports.”
          </p>
        </Paper>
      );
    case "turn-search-into-signups":
      return (
        <Paper className="w-[400px]">
          <div className="flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] ring-1 ring-black/[0.08]">
            <Search size={14} style={{ color: MUTED }} aria-hidden />
            <span className="relative">
              best client reporting tools
              <span
                className={`absolute inset-y-0 right-0 bg-white transition-[width] duration-[900ms] ease-out ${live ? "w-0" : "w-0"}`}
              />
            </span>
          </div>
          <div className="mt-4">
            <Eyebrow>Your next comparison page</Eyebrow>
            <Head>
              The search.
              <br />
              The answer.
              <br />
              Your company.
            </Head>
            <p
              className={`mt-3 font-mono text-[12px] text-[#3346e0] transition-all duration-500 ${live ? "translate-y-0 opacity-100" : "translate-y-1 opacity-60"}`}
            >
              /compare/reporting-tools
            </p>
          </div>
        </Paper>
      );
    case "make-every-ad-dollar-count":
      return (
        <Paper className="w-[400px]">
          <Eyebrow>Your next campaign move</Eyebrow>
          <Head>Back the winner.</Head>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div
              className={`rounded-xl bg-white p-3 ring-1 ring-black/[0.06] transition-opacity duration-300 ${live ? "opacity-50" : ""}`}
            >
              <p className="text-[14px] font-semibold leading-[17px] tracking-[-0.02em]">
                Reporting,
                <br />
                simplified.
              </p>
              <Status tone="warn" className="mt-3">
                Needs a refresh
              </Status>
            </div>
            <div
              className={`rounded-xl bg-white p-3 transition-[transform,box-shadow] duration-300 ${live ? "-translate-y-1 shadow-[0_0_0_2px_#3DD68C,0_14px_30px_-14px_rgba(0,0,0,0.35)]" : "ring-1 ring-black/[0.06]"}`}
            >
              <p className="text-[14px] font-semibold leading-[17px] tracking-[-0.02em]">
                Your Monday.
                <br />
                Already handled.
              </p>
              <Status tone="ok" className="mt-3">
                Winner
              </Status>
            </div>
          </div>
          <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
            <span className="font-medium" style={{ color: INK }}>
              Next test
            </span>{" "}
            · New creative. Ready to test.
          </p>
        </Paper>
      );
    case "catch-customers-before-they-leave":
      return (
        <Paper className="w-[360px]">
          <Eyebrow>Before the renewal</Eyebrow>
          <Head>
            There&apos;s still
            <br />
            time to help.
          </Head>
          <p className="mt-4 rounded-xl bg-white p-3 text-[13px] leading-[19px] ring-1 ring-black/[0.06]">
            “We&apos;re still waiting on the export.”
          </p>
          <div className="relative mt-3 h-6">
            <Status
              tone="warn"
              className={`absolute left-0 top-0 transition-opacity duration-300 ${live ? "opacity-0" : "opacity-100"}`}
            >
              Blocker found
            </Status>
            <Status tone="ok" className={`absolute left-0 top-0 ${pop(live)}`}>
              Check-in ready
            </Status>
          </div>
        </Paper>
      );
    case "get-new-customers-to-their-first-win":
      return (
        <Paper className="w-[360px]">
          <Eyebrow>A little help at the right time</Eyebrow>
          <Head>
            One step from
            <br />
            their first win.
          </Head>
          <ul className="mt-4 space-y-2 text-[13px]">
            {["Account created", "Team invited"].map((s, k) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="grid size-5 place-items-center rounded-full bg-[#E9F7EF] text-[#1f7a4d]">
                  <Check
                    size={12}
                    strokeWidth={3}
                    className={`transition-transform duration-300 ${live ? "scale-100" : "scale-100"}`}
                    style={{ transitionDelay: `${k * 120}ms` }}
                    aria-hidden
                  />
                </span>
                {s}
              </li>
            ))}
            <li
              className={`flex items-center gap-2.5 rounded-lg px-1 transition-shadow duration-300 ${live ? "shadow-[0_0_0_1.5px_#FFB547]" : ""}`}
            >
              <span className="size-5 rounded-full border-[1.5px] border-black/20" />
              Connect your data
            </li>
          </ul>
          <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
            The right guide. Ready to send.
          </p>
        </Paper>
      );
    case "close-the-loop-with-customers":
      return (
        <Paper className="w-[360px]">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium">Client report sharing</span>
            <Status tone="ok" className={pop(true)}>
              Just shipped
            </Status>
          </div>
          <div
            className={`mt-3 rounded-xl bg-white p-3.5 ring-1 ring-black/[0.06] transition-transform duration-500 ${live ? "-translate-y-1" : ""}`}
          >
            <p className="text-[11.5px]" style={{ color: MUTED }}>
              To Maya · Asked for this last month
            </p>
            <p className="mt-1.5 text-[19px] font-semibold leading-[1.1] tracking-[-0.03em]">
              You asked. It&apos;s here.
            </p>
            <p className="mt-1.5 text-[12.5px] leading-[18px]" style={{ color: MUTED }}>
              You can now share a live report with your clients. I thought of your team.
            </p>
            <span className="mt-3 inline-flex h-8 items-center rounded-full bg-[#14161f] px-3.5 text-[12px] font-medium text-white">
              Try your first share link
            </span>
          </div>
        </Paper>
      );
    case "keep-every-promise-moving":
      return (
        <Paper className="w-[400px]">
          <Eyebrow>From Monday&apos;s meeting</Eyebrow>
          <Head>
            A promise.
            <br />
            With follow-through.
          </Head>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
            <span className="grid size-8 place-items-center rounded-full bg-[#E8F0FE] text-[12px] font-semibold text-[#1264A3]">
              S
            </span>
            <span className="leading-tight">
              <span className="block text-[13.5px] font-medium">Approve launch copy</span>
              <span className="block text-[12px]" style={{ color: MUTED }}>
                Sam · Needed by Thursday
              </span>
            </span>
          </div>
          <p
            className={`ml-11 mt-2 w-fit rounded-2xl rounded-tl-md bg-[#14161f] px-3 py-2 text-[12.5px] text-white ${pop(live)}`}
          >
            “Sam, anything you need to unblock this?”
          </p>
        </Paper>
      );
    case "keep-our-launches-on-track":
      return (
        <Paper className="w-[460px]">
          <Eyebrow>Friday&apos;s launch</Eyebrow>
          <Head>
            The last mile.
            <br />
            Taken care of.
          </Head>
          <ul className="mt-4 space-y-2 text-[13.5px]">
            {["Feature shipped", "Campaign ready"].map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="grid size-5 place-items-center rounded-full bg-[#E9F7EF] text-[#1f7a4d]">
                  <Check size={12} strokeWidth={3} aria-hidden />
                </span>
                {s}
              </li>
            ))}
            <li className="flex items-center gap-2.5">
              <span
                className={`grid size-5 place-items-center rounded-full transition-colors duration-300 ${live ? "bg-[#EEF0FF] text-[#3346e0]" : "bg-[#FFF4E0] text-[#a35f00]"}`}
              >
                <span className="size-1.5 rounded-full bg-current" />
              </span>
              <span className="relative">
                <span
                  className={`transition-opacity duration-300 ${live ? "opacity-0" : "opacity-100"}`}
                >
                  Help article missing
                </span>
                <span className={`absolute left-0 top-0 whitespace-nowrap ${pop(live)}`}>
                  Juno has the first draft.
                </span>
              </span>
            </li>
          </ul>
          <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
            Juno has the first draft.
          </p>
        </Paper>
      );
    case "walk-into-every-call-prepared":
      return (
        <Paper className="w-[360px]">
          <Eyebrow>Before your 10:00 with Maya</Eyebrow>
          <Head>
            Pick up where
            <br />
            you left off.
          </Head>
          <dl className="mt-4 space-y-2 text-[13px]">
            {[
              ["Last time", "Asked about client reporting."],
              ["Since then", "Share links are now live."],
              ["Next up", "Show her the new workflow."],
            ].map(([k, v], n) => (
              <div
                key={k}
                className={`flex gap-3 transition-[transform,opacity] duration-300 ${live ? "translate-x-0 opacity-100" : n === 0 ? "" : "opacity-60"}`}
                style={{ transitionDelay: `${n * 140}ms` }}
              >
                <dt className="w-[74px] shrink-0 font-medium">{k}</dt>
                <dd style={{ color: MUTED }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Paper>
      );
    case "show-me-whats-driving-growth":
      return (
        <Paper className="w-[360px]">
          <Eyebrow>Beyond the signup chart</Eyebrow>
          <Head>
            More of
            <br />
            what&apos;s working.
          </Head>
          <div className="mt-4 flex items-center gap-2 text-[12.5px]">
            <span className="rounded-lg bg-white px-2.5 py-2 ring-1 ring-black/[0.06]">
              Comparison pages
            </span>
            <span className="relative h-px flex-1 bg-black/10">
              <span
                className={`absolute inset-y-0 left-0 bg-[#3346e0] transition-[width] duration-700 ease-out ${live ? "w-full" : "w-1/3"}`}
              />
            </span>
            <span className="rounded-lg bg-white px-2.5 py-2 ring-1 ring-black/[0.06]">
              Activated teams
            </span>
          </div>
          <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
            Your next page brief is ready.
          </p>
        </Paper>
      );
    case "keep-us-ahead-of-competitors":
      return (
        <Paper className="w-[360px]">
          <Eyebrow>Know the change. Have the answer.</Eyebrow>
          <Head>
            They moved.
            <br />
            You&apos;re ready.
          </Head>
          <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-black/[0.06]">
            <p className="text-[13.5px] font-medium">Pricing changed</p>
            <p
              className="relative mt-0.5 h-[18px] overflow-hidden text-[12.5px]"
              style={{ color: MUTED }}
            >
              <span
                className={`block transition-transform duration-300 ${live ? "-translate-y-full" : ""}`}
              >
                Monthly and annual plans
              </span>
              <span
                className={`absolute left-0 top-full block transition-transform duration-300 ${live ? "-translate-y-full" : ""}`}
              >
                Annual-only plans introduced
              </span>
            </p>
          </div>
          <Status tone="ok" className="mt-3">
            Sales comparison updated
          </Status>
        </Paper>
      );
    case "keep-investors-in-the-loop":
      return (
        <Paper className="w-[360px]">
          <Eyebrow>Investor update</Eyebrow>
          <Head>
            The month.
            <br />
            Already written.
          </Head>
          <dl className="mt-4 space-y-2 text-[13px]">
            {[
              ["The win", "Team plans launched."],
              ["The focus", "Faster first-time setup."],
              ["The ask", "Introductions to agencies."],
            ].map(([k, v], n) => (
              <div key={k} className="flex gap-3">
                <dt className="w-[70px] shrink-0 font-medium">{k}</dt>
                <dd className="relative" style={{ color: MUTED }}>
                  <span
                    className={`transition-opacity duration-300 ${live ? "opacity-100" : "opacity-100"}`}
                    style={{ transitionDelay: `${n * 140}ms` }}
                  >
                    {v}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Paper>
      );
    default:
      return null;
  }
}

/** A small "go" link used on related job cards. */
export function GoLink({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#7A8FFF]">
      {children}
      <ArrowRight size={14} aria-hidden />
    </span>
  );
}
