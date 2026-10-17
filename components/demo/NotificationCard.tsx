import { ToolBadge } from "@/components/ui/ToolLogo";
import { tools, type Notification } from "@/lib/story";

const tone = {
  neutral: { fg: "var(--text-muted)", bg: "rgba(154,166,184,0.12)", dot: "rgba(154,166,184,0.7)" },
  warning: { fg: "#FFB547", bg: "rgba(255,181,71,0.12)", dot: "#FFB547" },
  danger: { fg: "#FF6568", bg: "rgba(255,101,104,0.12)", dot: "#FF6568" },
};

/** A piece of work waiting on the founder, in the visual language of its tool. */
export function NotificationCard({ n, className = "", style }: { n: Notification; className?: string; style?: React.CSSProperties }) {
  const t = tools[n.tool];
  const w = tone[n.wait.tone];
  return (
    <article
      className={`relative w-[310px] overflow-hidden rounded-[20px] border border-white/[0.08] bg-[linear-gradient(180deg,#121722,#0E1218)] p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.05)] md:w-[460px] md:p-6 ${className}`}
      style={style}
      aria-label={`${t.name}, ${n.source}: ${n.title}. ${n.wait.label}.`}
    >
      <header className="flex items-center gap-3">
        <ToolBadge id={n.tool} size={34} className="rounded-[9px] border-white/[0.08] bg-white/[0.04]" />
        <span className="min-w-0 flex-1 truncate text-[13px] leading-5 text-muted md:text-[14px]">
          <span className="font-medium text-text">{t.name}</span>
          <span className="mx-1.5 text-subtle">·</span>
          {n.source}
        </span>
        <span className="t-eyebrow shrink-0 !text-[11px] text-subtle">{n.time}</span>
      </header>

      <div className="mt-4">
        {n.from && <p className="text-[13px] leading-5 text-muted">{n.from}</p>}
        <p className="text-[15px] leading-[22px] text-text md:text-[18px] md:leading-[26px]">{n.title}</p>
      </div>

      <footer className="mt-4 flex items-center">
        <span
          className="t-eyebrow inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 !text-[10.5px]"
          style={{ color: w.fg, background: w.bg }}
        >
          <span className="size-1.5 rounded-full" style={{ background: w.dot }} />
          {n.wait.label}
        </span>
      </footer>
    </article>
  );
}
