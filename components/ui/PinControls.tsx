"use client";

import { Pause, Play } from "lucide-react";
import type { RefObject } from "react";

/** Visible progress for a pinned chapter, plus a pause control (jumps to the final state). */
export function PinControls({
  barRef,
  paused,
  onToggle,
  active,
  label,
  steps,
  className = "",
}: {
  barRef: RefObject<HTMLDivElement | null>;
  paused: boolean;
  onToggle: () => void;
  active: boolean;
  label: string;
  steps?: string[];
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 transition-opacity duration-300 ${active ? "opacity-100" : "pointer-events-none opacity-0"} ${className}`} aria-hidden={!active}>
      <button
        type="button"
        onClick={onToggle}
        tabIndex={active ? 0 : -1}
        aria-label={paused ? `Play ${label} animation` : `Pause ${label} animation`}
        className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:text-text"
      >
        <span className="grid size-7 place-items-center rounded-full border border-line-strong">
          {paused ? <Play size={12} strokeWidth={1.5} aria-hidden /> : <Pause size={12} strokeWidth={1.5} aria-hidden />}
        </span>
      </button>
      <div className="flex-1">
        <div className="relative h-px w-full overflow-hidden rounded-full bg-white/10">
          <div ref={barRef} className="absolute inset-0 origin-left bg-[image:var(--accent-grad)]" style={{ transform: "scaleX(0)" }} />
        </div>
        {steps && (
          <ol className="mt-3 hidden justify-between md:flex">
            {steps.map((s, i) => (
              <li key={s} className="t-eyebrow text-subtle" data-step={i}>
                {String(i + 1).padStart(2, "0")} {s}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
