import { ToolBadge } from "@/components/ui/ToolLogo";
import { tools, type Notification } from "@/lib/story";

const toneColor = { danger: "var(--st-bad)", warning: "var(--st-warn)", muted: "var(--st-muted)" };
const toneBg = { danger: "rgba(255,101,104,0.16)", warning: "rgba(255,181,71,0.17)", muted: "rgba(154,166,184,0.16)" };

/** Ch1 notification in the visual language of its tool. */
export function NotificationCard({ n, className = "", style }: { n: Notification; className?: string; style?: React.CSSProperties }) {
  const t = tools[n.tool];
  return (
    <article
      className={`w-[280px] rounded-md border border-line-strong bg-surface-2/95 p-3.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md md:w-[340px] md:p-4 ${className}`}
      style={style}
      aria-label={`${t.name}: ${n.title}`}
    >
      <header className="mb-2 flex items-center gap-2.5">
        <ToolBadge id={n.tool} size={24} />
        <span className="min-w-0 flex-1 truncate text-[13px] leading-5 text-muted">
          <span className="font-medium text-text">{t.name}</span>
          <span className="mx-1.5 text-subtle">·</span>
          {n.source}
        </span>
        <span className="shrink-0 font-mono text-[11px] text-subtle">{n.time}</span>
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-danger" />
      </header>
      {n.from && <p className="text-[13px] leading-5 font-medium text-text/90">{n.from}</p>}
      <p className="text-[14px] leading-[21px] text-text">{n.title}</p>
      {n.meta && (
        <span
          className="mt-2 inline-flex h-5 items-center rounded-[6px] px-1.5 font-mono text-[11px]"
          style={{ color: toneColor[n.meta.tone], background: toneBg[n.meta.tone] }}
        >
          {n.meta.label}
        </span>
      )}
    </article>
  );
}
