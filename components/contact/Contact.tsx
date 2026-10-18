"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ArrowUpRight, Check, Globe, Loader2, RotateCcw } from "lucide-react";
import { Mascot, MascotMark, type MascotApi } from "@/components/mascot/Mascot";
import { Button } from "@/components/ui/Button";
import { CTA_HREF, CTA_LABEL } from "@/lib/site";
import { PRIVACY_HREF, contact } from "@/lib/contact";

/**
 * "Let's talk." The words and the two quick routes on the left; on the right, a message to the
 * Juno team, written in a lit compose window: who it's to, what it's about, who you are, and
 * what's on your mind. Send, and the window turns into the sent message.
 */

const calm = [0.16, 1, 0.3, 1] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BROWSER_HREF = "https://www.runjuno.ai/login";

type Key = keyof typeof contact.fields;
type Status = "idle" | "sending" | "sent" | "error";

/** A clean field: its label above, the line under it lights as you type. */
function Field({ k, wrong, done, children }: { k: Key; wrong: boolean; done: boolean; children: React.ReactNode }) {
  return (
    <div className={`ct-line relative ${wrong ? "ct-line--wrong" : ""}`}>
      <label htmlFor={`contact-${k}`} className="flex items-center justify-between text-[12.5px] font-medium text-muted">
        {contact.fields[k].label}
        <span
          aria-hidden
          className={`grid size-4 place-items-center rounded-full bg-[#7A8FFF]/25 text-[#C9D4FF] transition-[opacity,transform] duration-300 ${done ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          <Check size={10} strokeWidth={3} />
        </span>
      </label>
      {children}
    </div>
  );
}

export function ContactPage() {
  const reduce = useReducedMotion();
  const juno = useRef<MascotApi>(null);
  const [topic, setTopic] = useState<string>(contact.topics[0]);
  const [values, setValues] = useState<Record<Key, string>>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");

  const first = values.name.trim().split(/\s+/)[0] || "";
  const bad: Record<Key, boolean> = {
    name: !values.name.trim(),
    email: !EMAIL.test(values.email.trim()),
    message: !values.message.trim(),
  };

  const change = (k: Key) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const look = (e: React.FocusEvent<HTMLElement>) => juno.current?.lookAt(e.currentTarget);

  const send = async () => {
    setTouched(true);
    if (bad.name || bad.email || bad.message) {
      juno.current?.glance();
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topic, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || contact.failed);
      setStatus("sent");
      juno.current?.cheer();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error && err.message ? err.message : contact.failed);
      juno.current?.glance();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send();
    }
  };
  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setTouched(false);
    setStatus("idle");
  };

  const filled = (["name", "email", "message"] as Key[]).filter((k) => !bad[k]).length;
  const problem =
    status === "error"
      ? error
      : touched && (bad.name || bad.email || bad.message)
        ? bad.email && values.email.trim()
          ? "That email doesn’t look quite right."
          : "Please fill in your name, email and message."
        : "";

  return (
    <section aria-labelledby="contact-title" className="relative overflow-hidden pb-28 pt-[136px] md:pb-40 md:pt-[176px]">
      {/* glow 1 of 2, and a grid running to the horizon */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[80px] h-[900px] w-[min(1500px,170vw)] -translate-x-1/2"
        style={{ background: "radial-gradient(38% 40% at 66% 45%, rgba(50,76,255,0.24), rgba(143,124,255,0.08) 55%, transparent 76%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] [perspective:700px]">
        <div className="ct-grid absolute inset-x-[-50%] bottom-[-20%] top-0 origin-bottom [transform:rotateX(68deg)] [mask-image:linear-gradient(to_top,#000_10%,transparent_85%)]" />
      </div>

      <div className="container-page relative grid items-start gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* the words, and the quick routes */}
        <div className="text-center lg:sticky lg:top-36 lg:pt-6 lg:text-left">
          <h1 id="contact-title" className="t-display-xl text-balance">
            {[contact.title, contact.word].map((w, i) => (
              <motion.span
                key={w}
                className={`inline-block ${i ? "" : "mr-[0.24em]"}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05 + i * 0.12, ease: calm }}
              >
                {i ? <span className="bg-[linear-gradient(100deg,#A6BBFF_0%,#C3B6FF_55%,#F2C6B0_100%)] bg-clip-text pb-[0.06em] text-transparent">{w}</span> : w}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="t-body-l mx-auto mt-5 max-w-[34ch] text-pretty text-muted lg:mx-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: calm }}
          >
            {contact.sub}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: calm }}
          >
            <Button size="lg" variant="white" href={CTA_HREF} trailing={<ArrowUpRight size={17} strokeWidth={2} aria-hidden />}>
              {CTA_LABEL}
            </Button>
            <Button size="lg" variant="secondary" href={BROWSER_HREF} trailing={<Globe size={16} strokeWidth={1.75} aria-hidden />}>
              Open in your browser
            </Button>
          </motion.div>
        </div>

        {/* the message */}
        <motion.div
          className="contact-console relative overflow-hidden rounded-[28px]"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: calm }}
        >
          {/* who it's to, and how far along it is */}
          <div className="relative flex items-center gap-3.5 border-b border-white/[0.07] px-6 py-4">
            <span className="relative grid size-11 place-items-center">
              <span aria-hidden className="cta-breathe absolute -inset-3 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(110,140,255,0.5), transparent)" }} />
              <Mascot size={40} state="idle" halo={false} trackCursor apiRef={juno} />
            </span>
            <div className="min-w-0">
              <p className="text-[12px] text-muted">To</p>
              <p className="text-[15.5px] font-medium text-text">The Juno team</p>
            </div>
            <span aria-hidden className="absolute inset-x-0 bottom-[-1px] h-px bg-white/[0.04]">
              <motion.span
                className="block h-full bg-[linear-gradient(90deg,#7A8FFF,#C3B6FF)] shadow-[0_0_10px_rgba(122,143,255,0.9)]"
                initial={false}
                animate={{ width: status === "sent" ? "100%" : `${(filled / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: calm }}
              />
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {status !== "sent" ? (
              <motion.form
                key="form"
                aria-label={contact.formLabel}
                onSubmit={onSubmit}
                noValidate
                className="space-y-7 p-6 md:p-8"
                exit={reduce ? undefined : { opacity: 0, y: -16, transition: { duration: 0.25 } }}
              >
                {/* what it's about */}
                <fieldset>
                  <legend className="text-[12.5px] font-medium text-muted">About</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contact.topics.map((t) => {
                      const on = topic === t;
                      return (
                        <label
                          key={t}
                          className={`relative cursor-pointer rounded-full border px-4 py-2 text-[14px] transition-[color,border-color,background-color,box-shadow] duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#009CFF] ${
                            on
                              ? "border-[#7A8FFF]/60 bg-[#7A8FFF]/[0.14] text-text shadow-[0_0_24px_-8px_rgba(122,143,255,0.8)]"
                              : "border-white/[0.1] text-muted hover:border-white/[0.2] hover:text-text"
                          }`}
                        >
                          <input type="radio" name="topic" value={t} checked={on} onChange={() => setTopic(t)} className="sr-only" />
                          {t}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-7 sm:grid-cols-2">
                  <Field k="name" wrong={touched && bad.name} done={!bad.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={values.name}
                      onChange={change("name")}
                      onFocus={look}
                      aria-invalid={touched && bad.name}
                      placeholder="Your name"
                      className="mt-2 block h-11 w-full bg-transparent text-[17px] text-text outline-none placeholder:text-white/25"
                    />
                  </Field>
                  <Field k="email" wrong={touched && bad.email} done={!bad.email}>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={values.email}
                      onChange={change("email")}
                      onFocus={look}
                      aria-invalid={touched && bad.email}
                      placeholder="you@company.com"
                      className="mt-2 block h-11 w-full bg-transparent text-[17px] text-text outline-none placeholder:text-white/25"
                    />
                  </Field>
                </div>
                <Field k="message" wrong={touched && bad.message} done={!bad.message}>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    value={values.message}
                    onChange={change("message")}
                    onKeyDown={onKey}
                    onFocus={look}
                    aria-invalid={touched && bad.message}
                    placeholder="Tell us a little about what you need."
                    className="mt-2 block w-full resize-none bg-transparent pb-2 text-[17px] leading-[27px] text-text outline-none placeholder:text-white/25"
                  />
                </Field>

                {/* only bots fill this in */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </label>
                </div>

                <AnimatePresence>
                  {problem && (
                    <motion.p
                      role="alert"
                      className="rounded-[12px] border border-[#FF6568]/30 bg-[#FF6568]/[0.08] px-4 py-3 text-[14px] text-[#FFB4B5]"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {problem}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                  <p className="text-[13px] text-muted">
                    {contact.privacy.before}{" "}
                    <a href={PRIVACY_HREF} className="text-[#A6BBFF] underline-offset-4 hover:underline">
                      {contact.privacy.link}
                    </a>
                    {contact.privacy.after}
                  </p>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex h-12 items-center gap-2.5 rounded-full bg-text pl-6 pr-1.5 text-[15px] font-semibold text-bg transition-[box-shadow,transform] duration-200 hover:shadow-[0_0_0_5px_rgba(50,76,255,0.3)] active:scale-[0.98] disabled:opacity-80"
                  >
                    {contact.send}
                    <span className="grid size-9 place-items-center rounded-full bg-[#0B0E13] text-text">
                      {status === "sending" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <ArrowUp size={15} strokeWidth={2.25} aria-hidden />}
                    </span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                role="status"
                aria-live="polite"
                className="p-6 md:p-8"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: calm }}
              >
                <span className="grid size-12 place-items-center rounded-full bg-[#3DD68C]/15 text-[#5BE3A2]">
                  <Check size={22} strokeWidth={2.5} aria-hidden />
                </span>
                <p className="mt-5 text-[30px] font-medium leading-[36px] tracking-[-0.03em] text-text">Message received.</p>
                <p className="mt-2 max-w-[44ch] text-[16px] leading-[26px] text-muted">{contact.sent(first || "there", values.email)}</p>
                <div className="mt-6 rounded-[16px] border border-white/[0.07] bg-white/[0.02] p-4">
                  <p className="flex items-center gap-2 text-[12.5px] text-muted">
                    <MascotMark size={14} /> {topic}
                  </p>
                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-[14.5px] leading-[23px] text-text/85">{values.message}</p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.12] px-5 text-[14px] font-medium text-text transition-colors hover:bg-white/[0.05]"
                >
                  <RotateCcw size={14} aria-hidden /> Send another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
