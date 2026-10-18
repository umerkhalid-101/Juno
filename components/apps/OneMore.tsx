"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, AppWindow } from "lucide-react";
import { ChapterIntro } from "@/components/ui/ChapterIntro";
import { MascotMark } from "@/components/mascot/Mascot";
import { apps } from "@/lib/apps";
import { useAutoPlay } from "@/components/ui/useAutoPlay";
import { Section, Window, base, calm } from "./kit";
import { CustomerPortal } from "./minis";

const o = apps.more;
type Msg = { from: "you" | "juno"; text: string; key: string };

/** Ask for one more thing, and the app changes in front of you. */
export function OneMore() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [used, setUsed] = useState<number[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [marks, setMarks] = useState<{ approve?: number; files?: number; date?: number }>({});
  const [run, setRun] = useState(0);

  const ask = (i: number) => {
    if (used.includes(i) || thinking) return;
    const c = o.chips[i];
    const now = Date.now();
    setUsed((u) => [...u, i]);
    setMsgs((m) => [...m, { from: "you", text: c.ask, key: `y${now}` }]);
    setThinking(true);
    const wait = reduce ? 0 : 900;
    window.setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [...m, { from: "juno", text: c.reply, key: `j${now}` }]);
    }, wait);
    window.setTimeout(() => setMarks((k) => ({ ...k, [(["approve", "files", "date"] as const)[i]]: now })), wait + (reduce ? 0 : 350));
  };
  const restart = () => {
    setUsed([]);
    setMsgs([]);
    setMarks({});
    setRun((r) => r + 1);
  };
  const left = o.chips.map((c, i) => ({ ...c, i })).filter((c) => !used.includes(c.i));
  // three seconds on screen and Juno is asked the next question, one after another
  useAutoPlay(root, () => left[0] && ask(left[0].i), !thinking && left.length > 0);
  const latest = msgs.slice(-2);

  const chips = (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {left.map((c) => (
          <motion.button
            key={c.i}
            type="button"
            layout
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
            onClick={() => ask(c.i)}
            className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-left text-[13px] leading-[18px] text-text/90 transition-colors hover:border-[#A6BBFF]/40 hover:bg-[#A6BBFF]/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009CFF]"
          >
            {c.ask}
          </motion.button>
        ))}
      </AnimatePresence>
      {left.length === 0 && (
        <button type="button" onClick={restart} className="h-9 px-1 text-[13px] text-[#A6BBFF] transition-colors hover:text-text">
          Start over
        </button>
      )}
    </div>
  );

  const bubble = (m: Msg) =>
    m.from === "you" ? (
      <p className="ml-auto max-w-[90%] rounded-[16px] rounded-br-[5px] bg-[#1C222C] px-3.5 py-2 text-[13.5px] leading-[20px] text-text ring-1 ring-white/[0.05]">{m.text}</p>
    ) : (
      <div className="flex items-start gap-2.5">
        <MascotMark size={22} className="mt-px shrink-0" />
        <p className="text-[13.5px] leading-[20px] text-text/90">{m.text}</p>
      </div>
    );

  return (
    <Section id="keep-making-it-yours" labelledBy="more-title">
      <ChapterIntro id="more-title" lead={o.lead} muted={o.muted} sub={o.sub} />

      <div ref={root} className="mx-auto mt-14 max-w-[1200px] md:mt-20">
        {/* phones: the latest exchange and the chips above the app */}
        <div className="mb-4 space-y-3 md:hidden">
          <div className="min-h-[44px] space-y-3">{latest.map((m) => <div key={m.key}>{bubble(m)}</div>)}</div>
          {chips}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0E1218] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
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
          </div>
          <div className="flex h-[600px]">
            {/* the conversation */}
            <div className="hidden w-[380px] shrink-0 flex-col border-r border-white/[0.07] md:flex">
              <div className="flex h-11 items-center border-b border-white/[0.06] px-4 text-[12.5px] text-muted">Customer portal</div>
              <div className="flex min-h-0 flex-1 flex-col justify-end gap-3.5 overflow-hidden p-4">
                <AnimatePresence initial={false}>
                  {msgs.map((m) => (
                    <motion.div key={m.key} layout="position" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: base }}>
                      {bubble(m)}
                    </motion.div>
                  ))}
                  {thinking && (
                    <motion.div key="t" layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="flex items-center gap-2.5">
                      <MascotMark size={22} className="animate-pulse" />
                      <span className="flex gap-1" aria-hidden>
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="size-1.5 animate-bounce rounded-full bg-white/40" style={{ animationDelay: `${i * 120}ms` }} />
                        ))}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-3 p-4 pt-0">
                {chips}
                <div className="flex h-11 items-center gap-2 rounded-[12px] border border-white/[0.09] bg-[#11151C] pl-3.5 pr-1.5 text-[13px] text-subtle">
                  One more thing
                  <span className="ml-auto grid size-8 place-items-center rounded-[9px] bg-white/[0.08] text-muted">
                    <ArrowUp size={14} aria-hidden />
                  </span>
                </div>
              </div>
            </div>

            {/* the app, changing as you ask */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4 text-[12.5px]">
                <AppWindow size={13} className="text-subtle" aria-hidden />
                <span className="text-muted">Apps</span>
                <span className="text-subtle">/</span>
                <span className="text-text/85">Customer portal</span>
                <span className="ml-auto text-[12px] text-subtle">Preview</span>
              </div>
              <div className="min-h-0 flex-1 p-3 md:p-6">
                <motion.div key={run} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: calm }} className="h-full">
                  <Window url="portal.yourcompany.com" chrome="#E4E7DA" className="h-full">
                    <CustomerPortal approveCard={marks.approve !== undefined} filesTab={marks.files !== undefined} launchDate={marks.date !== undefined} marks={marks} />
                  </Window>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <div className="sr-only" aria-live="polite">
          {msgs.map((m) => (
            <p key={m.key}>
              {m.from === "you" ? "You: " : "Juno: "}
              {m.text}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
