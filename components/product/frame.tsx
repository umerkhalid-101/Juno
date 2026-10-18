"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AppWindow,
  BookOpen,
  CalendarClock,
  Check,
  FileSpreadsheet,
  FileText,
  Folder,
  Globe,
  LayoutPanelLeft,
  Lock,
  MessageSquare,
  Mic,
  Plus,
  ArrowUp,
} from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { useAutoPlay } from "@/components/ui/useAutoPlay";
import { MascotMark } from "@/components/mascot/Mascot";
import { Face } from "@/components/jobs/scenes";
import type { Src } from "@/lib/product";
import type { ToolId } from "@/lib/story";

/**
 * The Juno app, as every visual on the Product page shows it: window chrome, the sidebar,
 * the chat on the left and the Desk, where the work appears, on the right. Each demo is a
 * short script: chat messages land on steps, and the Desk builds part by part on the same
 * clock. Phones see the Desk alone, with the latest message above it and the approval below.
 */

export const snap = [0.3, 0, 0, 1] as const;
export const base = [0.2, 0.8, 0.2, 1] as const;
export const calm = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ the script */

export type Msg = { from: "you" | "juno"; text: string; title?: string; at: number };

export type DeskProps = { s: number; approved: boolean; approve: () => void; play: boolean };

export type Demo = {
  /** what the Desk's header says it's showing */
  label: string;
  chat: Msg[];
  /** the last step; the demo is done here */
  steps: number;
  /** ms between steps */
  gap?: number;
  /** the step that waits for a yes (approved by click, or by itself after a few seconds) */
  gate?: number;
  ask?: { q: string; at: number; done?: string };
  Desk: ComponentType<DeskProps>;
};

/** Runs a demo's clock once `play` is true. Remount (key) to replay. */
export function useDemo(d: Demo, play: boolean) {
  const reduce = useReducedMotion();
  const [s, setS] = useState(0);
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    if (!play) return;
    if (reduce) {
      const t = window.setTimeout(() => {
        setS(d.steps);
        setApproved(true);
      }, 0);
      return () => window.clearTimeout(t);
    }
    if (s >= d.steps) return;
    if (d.gate !== undefined && s >= d.gate && !approved) {
      const t = window.setTimeout(() => setApproved(true), 3000);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setS((x) => x + 1), s === 0 ? 450 : (d.gap ?? 820));
    return () => window.clearTimeout(t);
  }, [play, s, approved, reduce, d]);
  return { s, approved, approve: () => setApproved(true), done: s >= d.steps };
}

/* ------------------------------------------------------------------ small parts */

export function SrcIcon({ tool, size = 22 }: { tool: Src; size?: number }) {
  if (tool === "juno") return <MascotMark size={size} />;
  if (tool === "call" || tool === "file" || tool === "browser" || tool === "cms") {
    const I = tool === "call" ? Mic : tool === "file" ? FileText : tool === "cms" ? FileSpreadsheet : Globe;
    return (
      <span
        className="grid shrink-0 place-items-center rounded-[6px] border border-white/[0.08] bg-[linear-gradient(180deg,#1B2029,#12161D)] text-[#AEB8C6]"
        style={{ width: size, height: size }}
      >
        <I size={Math.round(size * 0.52)} strokeWidth={1.75} aria-hidden />
      </span>
    );
  }
  return <BrandIcon id={tool as ToolId} size={size} />;
}

/** Appears when the clock reaches `at`. */
export function In({ s, at, children, className = "", y = 8 }: { s: number; at: number; children: ReactNode; className?: string; y?: number }) {
  const on = s >= at;
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : y }}
      transition={{ duration: 0.4, ease: base }}
      aria-hidden={!on || undefined}
    >
      {children}
    </motion.div>
  );
}

/** A value that snaps from one state to the next. */
export function Flip({ on, a, b, className = "" }: { on: boolean; a: ReactNode; b: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-grid ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={on ? "b" : "a"}
          className="col-start-1 row-start-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12, ease: snap }}
        >
          {on ? b : a}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type Tone = "ok" | "blue" | "muted" | "light" | "lightOk";
export function Pill({ children, tone = "muted", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  const t = {
    ok: "bg-[#3DD68C]/12 text-[#5BE3A2]",
    blue: "bg-[#7A8FFF]/14 text-[#B9C8FF]",
    muted: "bg-white/[0.06] text-muted",
    light: "bg-black/[0.05] text-[#4a4f5c]",
    lightOk: "bg-[#E9F7EF] text-[#1f7a4d]",
  }[tone];
  return (
    <span className={`inline-flex h-[22px] shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[11.5px] font-medium ${t} ${className}`}>
      {(tone === "ok" || tone === "lightOk") && <Check size={11} strokeWidth={3} aria-hidden />}
      {children}
    </span>
  );
}

/** White, document-like output on the Desk. */
export function Paper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] ${className}`}>{children}</div>;
}

/** A page open in Juno's browser. */
export function Browser({ url, children, className = "", lock = true }: { url: string; children: ReactNode; className?: string; lock?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="flex h-9 items-center gap-2 border-b border-black/[0.07] bg-[#F3F4F6] px-3">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2 rounded-full bg-black/[0.12]" />
          ))}
        </span>
        <span className="mx-auto flex h-6 min-w-0 max-w-[70%] flex-1 items-center justify-center gap-1.5 truncate rounded-[6px] bg-white px-2.5 text-[11.5px] text-[#4a4f5c] ring-1 ring-black/[0.06]">
          {lock && <Lock size={10} className="shrink-0 text-[#8a909c]" aria-hidden />}
          <span className="truncate">{url}</span>
        </span>
        <span className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}

/** Juno's own cursor, moving to where it's working. Positions are % of the Desk. */
export function Cursor({ x, y, show = true }: { x: number; y: number; show?: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 flex items-start"
      initial={false}
      animate={{ left: `${x}%`, top: `${y}%`, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.9, ease: calm }}
    >
      <JunoPointer />
    </motion.span>
  );
}

/** Juno's pointer: a blue arrow, and a dark tag with the mascot and its name. */
export function JunoPointer() {
  return (
    <span className="flex flex-col items-start">
      <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
        <path d="M3.5 2.5 21 10.2l-7.6 2.3-3.3 7.9z" fill="#6B7BFF" stroke="#6B7BFF" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="ml-4 -mt-0.5 flex items-center gap-1.5 rounded-full bg-[#1A2033] py-1 pl-1 pr-3 text-[12.5px] font-medium text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <MascotMark size={20} />
        Juno
      </span>
    </span>
  );
}

/** Text that types itself out once, for the message you send. */
function Typed({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (reduce) return;
    const iv = window.setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), 900 / Math.max(text.length, 1));
    return () => window.clearInterval(iv);
  }, [text, reduce]);
  return (
    <>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span className="sr-only">{text}</span>
    </>
  );
}

function YouMsg({ text, typed }: { text: string; typed?: boolean }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[88%] rounded-[16px] rounded-br-[5px] bg-[#1C222C] px-3.5 py-2 text-[13.5px] leading-[20px] text-text ring-1 ring-white/[0.05]">
        {typed ? <Typed text={text} /> : text}
      </p>
    </div>
  );
}

function JunoMsg({ text, title }: { text: string; title?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-px shrink-0">
        <MascotMark size={22} />
      </span>
      <div className="min-w-0 text-[13.5px] leading-[20px] text-text/85">
        {title && <p className="mb-0.5 text-[14.5px] font-medium text-text">{title}</p>}
        <p>{text}</p>
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex items-center gap-2.5">
      <MascotMark size={22} className="animate-pulse" />
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 animate-bounce rounded-full bg-white/40" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </span>
    </div>
  );
}

/** The ask, at the end of the chat: Approve is real, and it approves itself after three seconds on screen. */
export function Ask({ q, approved, onApprove, done = "Approved by you", className = "" }: { q: string; approved: boolean; onApprove: () => void; done?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAutoPlay(ref, onApprove, !approved);
  return (
    <div ref={ref} className={`rounded-[14px] border border-white/[0.1] bg-[#151A22] p-3 ${className}`} role="group" aria-label="Approval">
      <AnimatePresence mode="wait" initial={false}>
        {!approved ? (
          <motion.div key="ask" exit={{ opacity: 0, y: -4, transition: { duration: 0.12, ease: snap } }}>
            <p className="text-[13.5px] leading-5 text-text">{q}</p>
            <div className="mt-2.5 flex justify-end gap-1.5">
              <button type="button" className="h-8 rounded-full px-3 text-[12.5px] font-medium text-muted transition-colors hover:text-text">
                Edit
              </button>
              <button
                type="button"
                onClick={onApprove}
                className="h-8 rounded-full bg-text px-3.5 text-[12.5px] font-semibold text-bg transition-shadow duration-200 hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)] active:scale-[0.97]"
              >
                Approve
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="done"
            className="flex items-center gap-2 text-[13.5px] text-text"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.12, ease: snap }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-[#3DD68C] text-[#06120c]">
              <Check size={12} strokeWidth={3} aria-hidden />
            </span>
            {done}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ the frame */

export type NavId = "Chat" | "Desk" | "Jobs" | "Apps" | "Knowledge" | "Files";
const navItems: { id: NavId; I: typeof MessageSquare }[] = [
  { id: "Chat", I: MessageSquare },
  { id: "Desk", I: LayoutPanelLeft },
  { id: "Jobs", I: CalendarClock },
  { id: "Apps", I: AppWindow },
  { id: "Knowledge", I: BookOpen },
  { id: "Files", I: Folder },
];
const recent = ["Launch Scheduled Reports", "Weekly competitor watch"];

function Sidebar({ active, rail }: { active: NavId; rail: boolean }) {
  return (
    <aside className={`hidden shrink-0 flex-col border-r border-white/[0.07] bg-[#0B0E13] md:flex ${rail ? "w-[60px] items-center px-2 py-4" : "w-[208px] p-3.5"}`}>
      <div className={`flex items-center gap-2 ${rail ? "" : "px-1.5"}`}>
        <MascotMark size={22} />
        {!rail && <span className="text-[14px] font-medium text-text">Juno</span>}
      </div>
      {!rail && (
        <span className="mt-4 flex h-8 items-center gap-2 rounded-[8px] border border-white/[0.08] px-2.5 text-[12.5px] text-muted">
          <Plus size={13} aria-hidden />
          New chat
        </span>
      )}
      <ul className={`mt-4 space-y-0.5 ${rail ? "" : "w-full"}`}>
        {navItems.map(({ id, I }) => (
          <li
            key={id}
            title={id}
            className={`flex items-center gap-2.5 rounded-[8px] text-[13px] ${rail ? "size-9 justify-center" : "h-8 px-2.5"} ${
              id === active ? "bg-[#1A2029] text-text" : "text-muted"
            }`}
          >
            <I size={15} strokeWidth={1.75} aria-hidden />
            {!rail && id}
          </li>
        ))}
      </ul>
      {!rail && (
        <>
          <p className="mt-6 px-2.5 text-[11.5px] text-subtle">Recent</p>
          <ul className="mt-1.5 space-y-0.5">
            {recent.map((r, i) => (
              <li key={r} className={`truncate rounded-[8px] px-2.5 py-1.5 text-[12.5px] ${i === 0 ? "text-text/90" : "text-muted"}`}>
                {r}
              </li>
            ))}
          </ul>
        </>
      )}
      <div className={`mt-auto flex items-center gap-2 ${rail ? "" : "px-1.5"}`}>
        <Face who="sam" size={24} className="!ring-0" />
        {!rail && <span className="text-[12.5px] text-muted">Sam Rivera</span>}
      </div>
    </aside>
  );
}

function ChatPane({ chat, s, ask, approved, approve, width, title }: { chat: Msg[]; s: number; ask?: Demo["ask"]; approved: boolean; approve: () => void; width: number; title: string }) {
  const shown = chat.filter((m) => s >= m.at);
  const thinking = chat.some((m) => m.from === "juno" && s === m.at - 1 && s > 0);
  return (
    <div className="hidden shrink-0 flex-col border-r border-white/[0.07] md:flex" style={{ width }}>
      <div className="flex h-11 shrink-0 items-center border-b border-white/[0.06] px-4 text-[12.5px] text-muted">
        <span className="truncate">{title}</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden p-4">
        <AnimatePresence initial={false}>
          {shown.map((m, i) => (
            <motion.div
              key={`${m.at}-${i}`}
              layout="position"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: base }}
            >
              {m.from === "you" ? <YouMsg text={m.text} typed={i === shown.length - 1 && s === m.at} /> : <JunoMsg text={m.text} title={m.title} />}
            </motion.div>
          ))}
          {thinking && (
            <motion.div key="thinking" layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <Thinking />
            </motion.div>
          )}
          {ask && s >= ask.at && (
            <motion.div key="ask" layout="position" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: calm }}>
              <Ask q={ask.q} approved={approved} onApprove={approve} done={ask.done} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="shrink-0 p-3 pt-0">
        <div className="flex h-11 items-center gap-2 rounded-[12px] border border-white/[0.09] bg-[#11151C] pl-3.5 pr-1.5 text-[13px] text-subtle">
          Ask Juno
          <span className="ml-auto grid size-8 place-items-center rounded-[9px] bg-white/[0.08] text-muted">
            <ArrowUp size={14} aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

export type Variant = "full" | "chat+desk" | "desk";

/**
 * The frame on its stage. `height` is the desktop height; on phones the Desk is fixed at
 * `mobileHeight` with the latest message above and the approval below.
 */
export function AppFrame({
  demo,
  play,
  variant = "chat+desk",
  nav = "Chat",
  project = "Product launch",
  thread = "Launch Scheduled Reports",
  height = 620,
  mobileHeight = 540,
  chatWidth = 360,
  rail = false,
  stage = false,
  onDone,
}: {
  demo: Demo;
  play: boolean;
  variant?: Variant;
  nav?: NavId;
  project?: string;
  thread?: string;
  height?: number;
  mobileHeight?: number;
  chatWidth?: number;
  rail?: boolean;
  stage?: boolean;
  onDone?: () => void;
}) {
  const { s, approved, approve, done } = useDemo(demo, play);
  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);
  const { Desk } = demo;
  const latest = [...demo.chat].reverse().find((m) => s >= m.at);

  const frame = (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0E1218] shadow-[0_40px_120px_rgba(0,0,0,0.5)] md:rounded-[24px]"
      style={{ ["--fh" as string]: `${height}px`, ["--mh" as string]: `${mobileHeight}px` }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
      {/* chrome */}
      <div className="relative flex h-10 items-center border-b border-white/[0.07] bg-[#0B0E13] px-4">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-[10px] rounded-full bg-white/[0.12]" />
          ))}
        </span>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[12.5px] font-medium text-text/80">
          <MascotMark size={14} />
          Juno
        </span>
        <span className="ml-auto hidden text-[12px] text-subtle sm:block">{project}</span>
      </div>
      <div className="flex h-[var(--mh)] md:h-[var(--fh)]">
        {variant === "full" && <Sidebar active={nav} rail={rail} />}
        {variant !== "desk" && (
          <ChatPane chat={demo.chat} s={s} ask={demo.ask} approved={approved} approve={approve} width={chatWidth} title={thread} />
        )}
        <div className="relative flex min-w-0 flex-1 flex-col bg-[#0E1218]">
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4 text-[12.5px]">
            <LayoutPanelLeft size={13} className="text-subtle" aria-hidden />
            <span className="text-muted">Desk</span>
            <span className="text-subtle">/</span>
            <span className="truncate text-text/85">{demo.label}</span>
          </div>
          <div className="@container relative min-h-0 flex-1 overflow-hidden p-4 md:p-6">
            <Desk s={s} approved={approved} approve={approve} play={play} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={stage ? "rounded-[28px] border border-white/[0.07] bg-[#0E1218]/40 p-3 sm:p-6 md:p-10 lg:p-12" : ""}>
      {/* phones: the latest message above the Desk */}
      {variant !== "desk" && (
        <div className="mb-3 min-h-[44px] md:hidden">
          <AnimatePresence mode="wait" initial={false}>
            {latest && (
              <motion.div key={latest.at} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: base }}>
                {latest.from === "you" ? <YouMsg text={latest.text} /> : <JunoMsg text={latest.text} title={latest.title} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {frame}
      {/* phones: the approval below it */}
      {demo.ask && variant !== "desk" && (
        <div className="mt-3 md:hidden">
          {s >= demo.ask.at && <Ask q={demo.ask.q} approved={approved} onApprove={approve} done={demo.ask.done} />}
        </div>
      )}
      {/* every word of the demo, for screen readers and search */}
      <div className="sr-only">
        {demo.chat.map((m, i) => (
          <p key={i}>
            {m.from === "you" ? "You: " : "Juno: "}
            {m.title ? `${m.title} ` : ""}
            {m.text}
          </p>
        ))}
        {demo.ask && <p>{demo.ask.q}</p>}
      </div>
    </div>
  );
}
