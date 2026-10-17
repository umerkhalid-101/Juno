import type { ReactNode } from "react";

/** Everything on Juno's screen is a pure function of one clock, `t` in seconds. */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** 0 → 1 between `a` and `b`. */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
/** Text typed character by character from `start`, at `cps` characters per second. */
export const typed = (text: string, t: number, start: number, cps = 30) =>
  text.slice(0, Math.max(0, Math.floor((t - start) * cps)));
export const typingEnd = (text: string, start: number, cps = 30) => start + text.length / cps;
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/** Wall clock shown in the log: Juno's session started at 09:41:00. */
export const clock = (sec: number) => {
  const s = 9 * 3600 + 41 * 60 + Math.floor(sec);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export type BrowserTab = { title: string; icon: ReactNode; active: boolean };
export type Chrome = {
  tabs: BrowserTab[];
  url: string;
  /** The address is still being typed. */
  typing: boolean;
  loading: boolean;
  /** Shown in the toolbar once Juno is in, instead of ever typing a password. */
  session: boolean;
  downloads?: string[];
};

export type Scenario = {
  id: string;
  tab: string;
  /** Total loop length for this scenario, seconds. */
  duration: number;
  /** When the work is done and the approval prompt appears. */
  askAt: number;
  approval: string;
  /** A step appears at `at` with a spinner and flips to a check at `done` (default at + 0.8). */
  log: { at: number; done?: number; text: string; live?: (t: number) => string }[];
  /** Juno's cursor arrives at `target` (a data-c value) at `at`, and clicks if `click`. */
  cursor: { at: number; target: string; click?: boolean }[];
  chrome: (t: number) => Chrome;
  Page: (p: { t: number }) => ReactNode;
};
