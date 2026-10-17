"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Check, ChevronRight, Paperclip, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Mascot, MascotMark, type MascotApi } from "@/components/mascot/Mascot";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { connectedTools, tools } from "@/lib/story";

/**
 * "Your whole stack. One Juno."
 * The tool cards fanned out fold into a single deck as you scroll, and Juno lands on top.
 * Then the proof: asked in Slack, done in Linear, with the Intercom context attached.
 */

const ease = [0.2, 0.8, 0.2, 1] as const;
const N = connectedTools.length;
const mid = (N - 1) / 2;

// fanned positions (desktop)
const fan = (i: number) => {
  const o = i - mid;
  return { x: o * 108, y: o * o * 5.5, rotate: o * 7 };
};

export function ChStack() {
  const root = useRef<HTMLElement>(null);

  // the fold: scrubbed by scroll, no pinning
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".stack-tool", root.current);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".stack-stage",
            start: "top 80%",
            end: "center 45%",
            scrub: 0.6,
          },
        });
        cards.forEach((c, i) => {
          const f = fan(i);
          tl.fromTo(
            c,
            { x: f.x, y: f.y, rotate: f.rotate },
            { x: 0, y: 0, rotate: (i - mid) * 1.2, ease: "power2.inOut", duration: 1 },
            0,
          );
        });
        tl.fromTo(
          ".stack-juno",
          { opacity: 0, scale: 0.7, y: 30 },
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.6)", duration: 0.35 },
          0.72,
        );
        tl.fromTo(".stack-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, 0.8);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stack" aria-labelledby="stack-title" className="chapter">
      <div className="container-page">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <h2 id="stack-title" className="t-display-l text-balance">
            Your whole stack. <span className="accent-text block">One Juno.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-[27px] text-muted">
            Ask in one tool, get it done in another. Juno already knows how they connect.
          </p>
        </Reveal>

        {/* the fold */}
        <div
          className="stack-stage relative mx-auto mt-14 hidden h-[290px] max-w-[1180px] md:mt-20 md:block"
          aria-label="Your tools fold into one Juno"
          role="img"
        >
          <div className="absolute left-1/2 top-[90px]">
            {connectedTools.map((id, i) => {
              const f = fan(i);
              return (
                <div
                  key={id}
                  className="stack-tool absolute -left-[64px] -top-[78px] flex h-[156px] w-[128px] flex-col items-center justify-center gap-3 rounded-[22px] bg-white text-[#14161f] shadow-[0_24px_50px_-22px_rgba(0,0,0,0.85)] ring-1 ring-black/5"
                  style={{
                    transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rotate}deg)`,
                    zIndex: i < mid ? i : N - i,
                  }}
                >
                  <ToolLogo id={id} size={40} brand />
                  <span className="text-[13px] text-[#3a3f4f]">{tools[id].name}</span>
                </div>
              );
            })}
            {/* Juno lands on top */}
            <div className="stack-juno absolute -left-[74px] -top-[90px] z-20 flex h-[180px] w-[148px] flex-col items-center justify-center gap-3 rounded-[24px] bg-[linear-gradient(160deg,#1b2140,#0e1120)] opacity-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-[#A6BBFF]/30">
              <Mascot size={78} state="idle" halo={false} />
              <span className="text-[14px] font-medium text-white">Juno</span>
            </div>
          </div>
          <p className="stack-label absolute inset-x-0 bottom-0 text-center text-[15px] text-muted opacity-0">
            All your tools, <span className="text-text">one teammate across them.</span>
          </p>
        </div>

        {/* mobile: a simple grid */}
        <div className="mt-10 grid grid-cols-5 gap-2 md:hidden">
          {connectedTools.map((id) => (
            <span
              key={id}
              className="grid aspect-square place-items-center rounded-xl bg-white text-[#14161f]"
            >
              <ToolLogo id={id} size={22} brand />
            </span>
          ))}
        </div>

        <Proof />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ the proof */

const BRIEF = "PDF layouts that fit every chart.";

/**
 * Asked in Slack, done in Linear. The two screens lean in toward Juno like a pair of monitors,
 * the conversation plays out, and the context travels through Juno into the brief.
 */
function Proof() {
  const stage = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const juno = useRef<MascotApi>(null);
  const reduce = useReducedMotion();
  const seen = useInView(stage, { once: true, amount: 0.45 });
  // phones get the pair flat and stacked; the lean is for wide screens
  const wide = useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(min-width: 768px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true,
  );
  const k = wide ? 1 : 0;
  // 0 waiting · 1 cards in · 2 Maya asks · 3 Juno reads · 4 context travels · 5 brief written · 6 Juno replies
  const [phase, setPhase] = useState(0);
  const p = reduce ? 6 : phase;

  useEffect(() => {
    if (!seen || reduce) return;
    const at: [number, () => void][] = [
      [0, () => setPhase(1)],
      [700, () => setPhase(2)],
      [
        1500,
        () => {
          setPhase(3);
          juno.current?.lookAt(left.current);
        },
      ],
      [
        2500,
        () => {
          setPhase(4);
          juno.current?.lookAt(right.current);
        },
      ],
      [3300, () => setPhase(5)],
      [
        4700,
        () => {
          setPhase(6);
          juno.current?.cheer();
        },
      ],
    ];
    const ids = at.map(([ms, fn]) => window.setTimeout(fn, ms));
    return () => ids.forEach(clearTimeout);
  }, [seen, reduce]);

  // the pair leans a little further toward the pointer
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sp = { stiffness: 70, damping: 18 };
  const tiltX = useSpring(useTransform(my, [-1, 1], [3, -3]), sp);
  const tiltY = useSpring(useTransform(mx, [-1, 1], [-4, 4]), sp);
  const lean = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    mx.set(Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2))));
    my.set(Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2))));
  };

  const card = "rounded-[20px] bg-white text-[#14161f] ring-1 ring-black/[0.06]";
  const shadow =
    "shadow-[0_50px_90px_-40px_rgba(0,0,0,0.95),0_18px_40px_-24px_rgba(40,60,160,0.45)]";

  return (
    <div
      ref={stage}
      onPointerMove={lean}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto mt-12 max-w-[1120px] md:mt-14"
      style={{ perspective: 1500 }}
    >
      {/* soft light pooled under the pair */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[90px]"
        style={{ background: "var(--glow)" }}
      />

      <motion.div
        className="grid grid-cols-1 items-center gap-5 md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] md:gap-0"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        {/* Slack, leaning in from the left */}
        <motion.div
          ref={left}
          className="min-w-0"
          initial={false}
          animate={
            p >= 1
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotateY: 16 * k,
                  rotateX: 5 * k,
                  rotateZ: wide ? -2.5 : -1.5,
                  z: 0,
                }
              : {
                  opacity: 0,
                  x: -80 * k,
                  y: wide ? 0 : 24,
                  rotateY: 40 * k,
                  rotateX: 12 * k,
                  rotateZ: -6,
                  z: -160 * k,
                }
          }
          transition={{ duration: 1.1, ease }}
          style={{ transformOrigin: "100% 50%" }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className={`${card} ${shadow} overflow-hidden`}
          >
            <div className="flex items-center gap-2 border-b border-black/[0.06] px-5 py-3.5 text-[14px] font-semibold">
              <ToolLogo id="slack" size={17} brand />
              <span># product</span>
              <span className="ml-auto flex items-center gap-1 text-[12px] font-normal text-[#7a7f8c]">
                <Users size={13} aria-hidden />
                14
              </span>
            </div>
            <div className="min-h-[268px] space-y-4 px-5 py-4">
              <AnimatePresence>
                {p >= 2 && (
                  <motion.div
                    key="maya"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="flex gap-3"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#ece9ff] text-[12px] font-semibold text-[#5b5bd6]">
                      MC
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px]">
                        <span className="font-semibold">Maya Chen</span>{" "}
                        <span className="text-[11.5px] text-[#9aa0ab]">10:42 AM</span>
                      </p>
                      <p className="mt-0.5 text-[14.5px] leading-[22px] text-[#2d313c]">
                        <span className="rounded bg-[#E8F0FE] px-0.5 text-[#1264A3]">@Juno</span>{" "}
                        turn the export questions in Intercom into a brief for Leo.
                      </p>
                    </div>
                  </motion.div>
                )}
                {p >= 3 && (
                  <motion.div
                    key="juno"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="flex gap-3"
                  >
                    <MascotMark size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[13px]">
                        <span className="font-semibold">Juno</span>
                        <span className="rounded bg-[#EEEEF0] px-1 text-[9.5px] font-semibold text-[#6b7080]">
                          APP
                        </span>
                        <span className="text-[11.5px] text-[#9aa0ab]">10:42 AM</span>
                      </p>
                      {p < 6 ? (
                        <p className="mt-1.5 flex items-center gap-2 text-[13px] text-[#7a7f8c]">
                          <span className="flex gap-1">
                            {[0, 1, 2].map((d) => (
                              <span
                                key={d}
                                className="think-dot size-1.5 rounded-full bg-[#9aa0ab]"
                                style={{ animationDelay: `${d * 0.15}s` }}
                              />
                            ))}
                          </span>
                          {p >= 4
                            ? "Writing the brief in Linear"
                            : "Reading 12 Intercom conversations"}
                        </p>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="mt-0.5 text-[14.5px] leading-[22px] text-[#2d313c]">
                            Done. Leo has it in Linear, with the 12 conversations attached.
                          </p>
                          <div className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2 ring-1 ring-black/[0.08]">
                            <ToolLogo id="linear" size={15} brand />
                            <span className="min-w-0 flex-1 leading-tight">
                              <span className="block truncate text-[13px] font-semibold text-[#1264A3]">
                                PRO-214 {BRIEF}
                              </span>
                              <span className="block text-[11.5px] text-[#7a7f8c]">
                                Todo · Leo · High priority
                              </span>
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Juno in between, passing the context across */}
        <div
          className="relative flex h-[90px] items-center justify-center md:h-auto"
          aria-hidden
          style={{ transform: "translateZ(60px)" }}
        >
          <span
            className={`absolute size-[92px] rounded-full bg-[#A6BBFF]/10 blur-xl transition-opacity duration-500 ${p >= 3 && p < 6 ? "opacity-100" : "opacity-0"}`}
          />
          <span className="relative grid size-[72px] place-items-center rounded-full bg-[#0E1220] ring-1 ring-[#A6BBFF]/30 shadow-[0_20px_40px_-14px_rgba(0,0,0,0.9)]">
            <Mascot
              size={50}
              state={p >= 3 && p < 5 ? "thinking" : "idle"}
              halo={false}
              apiRef={juno}
            />
          </span>
          {/* the 12 conversations, carried across */}
          <AnimatePresence>
            {p === 4 && (
              <motion.span
                key="packet"
                className="absolute left-1/2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-[#14161f] shadow-[0_10px_30px_-8px_rgba(166,187,255,0.7)] max-md:hidden"
                initial={{ x: "-190%", opacity: 0, scale: 0.8 }}
                animate={{
                  x: ["-190%", "-50%", "-50%", "90%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 1, 0.9],
                }}
                transition={{ duration: 1.1, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
              >
                <ToolLogo id="intercom" size={12} brand />
                12 conversations
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Linear, leaning in from the right */}
        <motion.div
          ref={right}
          className="min-w-0"
          initial={false}
          animate={
            p >= 1
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotateY: -16 * k,
                  rotateX: 5 * k,
                  rotateZ: wide ? 2.5 : 1.5,
                  z: 0,
                }
              : {
                  opacity: 0,
                  x: 80 * k,
                  y: wide ? 0 : 24,
                  rotateY: -40 * k,
                  rotateX: 12 * k,
                  rotateZ: 6,
                  z: -160 * k,
                }
          }
          transition={{ duration: 1.1, delay: 0.12, ease }}
          style={{ transformOrigin: "0% 50%" }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 6.5, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className={`${card} ${shadow} overflow-hidden`}
          >
            <div className="flex items-center gap-2 border-b border-black/[0.06] px-5 py-3.5 text-[13px] text-[#7a7f8c]">
              <ToolLogo id="linear" size={17} brand />
              <span className="font-semibold text-[#14161f]">Product</span>
              <ChevronRight size={13} aria-hidden />
              <span>PRO-214</span>
              <AnimatePresence>
                {p >= 5 && (
                  <motion.span
                    key="ok"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.9, ease }}
                    className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-[#2f8a5f]"
                  >
                    <Check size={13} strokeWidth={2.5} aria-hidden />
                    Created
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="min-h-[268px] px-5 py-4">
              {p >= 5 ? (
                <>
                  <p className="text-[24px] font-semibold leading-[1.1] tracking-[-0.03em]">
                    {BRIEF.split(" ").map((w, i) => (
                      <motion.span
                        key={i}
                        className="inline-block"
                        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.4, delay: i * 0.06, ease }}
                      >
                        {w}&nbsp;
                      </motion.span>
                    ))}
                  </p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-2.5 text-[14px] leading-[22px] text-[#5b6070]"
                  >
                    42 customers say exported PDFs cut off wide charts. Fit charts to the page
                    before Thursday&apos;s launch.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.6, ease }}
                    className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-[#3a3f4f]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-3 rounded-full border-[1.5px] border-[#9aa0ab]" />
                      Todo
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="flex items-end gap-px">
                        {[5, 8, 11].map((h) => (
                          <span
                            key={h}
                            className="w-[3px] rounded-sm bg-[#3a3f4f]"
                            style={{ height: h }}
                          />
                        ))}
                      </span>
                      High
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="grid size-4 place-items-center rounded-full bg-[#DCFCE7] text-[8px] font-semibold text-[#166534]">
                        L
                      </span>
                      Leo
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#F59E0B]" />
                      Customer ask
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.8 }}
                    className="mt-4 flex items-center gap-2.5 rounded-xl bg-[#F6F6F8] px-3 py-2.5 ring-1 ring-black/[0.04]"
                  >
                    <ToolLogo id="intercom" size={16} brand />
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-[13px] font-medium">12 conversations</span>
                      <span className="block text-[11.5px] text-[#7a7f8c]">
                        From Intercom · tagged export
                      </span>
                    </span>
                    <Paperclip size={14} className="text-[#9aa0ab]" aria-hidden />
                  </motion.div>
                </>
              ) : (
                <div className="space-y-3 pt-1">
                  <span className="sk block h-6 w-4/5 rounded-md" />
                  <span className="sk block h-3.5 w-full rounded" />
                  <span className="sk block h-3.5 w-2/3 rounded" />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
