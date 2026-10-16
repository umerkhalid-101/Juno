import type { ReactNode } from "react";

/**
 * Chapter header, shared by every section: centered headline with its second beat
 * on its own line in the accent gradient, and one supporting line underneath.
 */
export function ChapterIntro({
  lead,
  muted,
  sub,
  id,
  className = "",
  children,
}: {
  lead: string;
  muted: string;
  sub: string;
  id?: string;
  className?: string;
  /** @deprecated kept for older call sites; the second beat always sits on its own line */
  stack?: boolean;
  size?: "l" | "h2";
  children?: ReactNode;
}) {
  return (
    <header className={`mx-auto max-w-[820px] text-center ${className}`}>
      <h2 id={id} className="t-display-l text-balance">
        {lead} <span className="accent-text block">{muted}</span>
      </h2>
      <p className="mx-auto mt-5 max-w-[46ch] text-pretty text-[17px] leading-[27px] text-muted">{sub}</p>
      {children}
    </header>
  );
}
