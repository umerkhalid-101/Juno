"use client";

import { forwardRef, useState } from "react";
import { tools, type ToolId } from "@/lib/story";

type Props = {
  id: ToolId;
  lit?: boolean;
  onHover?: (id: ToolId | null, el: HTMLElement | null) => void;
  className?: string;
};

/** 64px tile. Monochrome logo, full brand color on hover. */
export const IntegrationTile = forwardRef<HTMLDivElement, Props>(function IntegrationTile(
  { id, lit, onHover, className = "" },
  ref,
) {
  const [hover, setHover] = useState(false);
  const t = tools[id];
  return (
    <div
      ref={ref}
      role="img"
      aria-label={t.name}
      tabIndex={0}
      data-lit={lit === undefined ? undefined : String(lit)}
      onPointerEnter={(e) => {
        setHover(true);
        onHover?.(id, e.currentTarget);
      }}
      onPointerLeave={() => {
        setHover(false);
        onHover?.(null, null);
      }}
      onFocus={(e) => {
        setHover(true);
        onHover?.(id, e.currentTarget);
      }}
      onBlur={() => {
        setHover(false);
        onHover?.(null, null);
      }}
      className={`group grid size-14 shrink-0 place-items-center rounded-md border bg-surface transition-[border-color,transform,background-color,box-shadow] duration-200 md:size-16 ${
        hover ? "-translate-y-1" : "border-line"
      } ${className}`}
      style={{
        transitionTimingFunction: "var(--ease-snap)",
        ...(hover
          ? { borderColor: `${t.hex}80`, background: `${t.hex}1f`, boxShadow: `0 10px 30px -10px ${t.hex}99` }
          : {}),
      }}
    >
      <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden className="tile-logo transition-[color,opacity] duration-[120ms]" style={{ color: t.hex, transitionTimingFunction: "var(--ease-snap)" }} fill="currentColor">
        <path d={t.path} />
      </svg>
    </div>
  );
});
