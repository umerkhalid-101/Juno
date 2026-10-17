import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, FileDown, KeyRound, Lock, RotateCw, X } from "lucide-react";
import type { Chrome } from "./kit";

/** Design canvas for every site. The section scales it to fit. */
export const CANVAS = { w: 760, h: 540 };

/** A light, believable desktop browser: tabs with favicons, toolbar, URL bar. */
export function Browser({ chrome, children }: { chrome: Chrome; children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[12px] bg-white text-[#16181d] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-black/10">
      {/* tab strip */}
      <div className="flex h-[38px] shrink-0 items-end gap-1 bg-[#E9EBEF] pl-3 pr-2">
        <span className="mb-[13px] mr-3 flex gap-[7px]" aria-hidden>
          <span className="size-3 rounded-full bg-[#FF5F57]" />
          <span className="size-3 rounded-full bg-[#FEBC2E]" />
          <span className="size-3 rounded-full bg-[#28C840]" />
        </span>
        {chrome.tabs.map((tab, i) => (
          <span
            key={i}
            data-c={`tab-${i}`}
            className={`relative flex h-[30px] w-[170px] shrink-0 items-center gap-2 rounded-t-[9px] px-3 text-[12.5px] ${
              tab.active ? "bg-white text-[#16181d]" : "text-[#5d6370]"
            }`}
          >
            <span className="grid size-4 shrink-0 place-items-center">{tab.icon}</span>
            <span className="truncate">{tab.title}</span>
            {tab.active && <X size={12} className="ml-auto shrink-0 text-[#8a909c]" aria-hidden />}
          </span>
        ))}
        {/* downloads land in the tab bar */}
        {chrome.downloads && chrome.downloads.length > 0 && (
          <span className="mb-[6px] ml-auto flex shrink-0 items-center gap-1">
            {chrome.downloads.map((d) => (
              <span key={d} className="dl-pop inline-flex h-[24px] items-center gap-1 whitespace-nowrap rounded-full bg-white px-2 text-[11px] text-[#16181d] shadow-sm ring-1 ring-black/[0.06]">
                <FileDown size={12} className="text-[#2f8a5f]" aria-hidden />
                {d}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* toolbar */}
      <div className="flex h-[40px] shrink-0 items-center gap-3 border-b border-black/[0.07] bg-white px-3">
        <span className="flex items-center gap-2.5 text-[#8a909c]" aria-hidden>
          <ArrowLeft size={15} />
          <ArrowRight size={15} className="opacity-50" />
          <RotateCw size={14} className={chrome.loading ? "animate-spin" : ""} />
        </span>
        <span className="flex h-[28px] flex-1 items-center gap-2 rounded-full bg-[#F1F2F5] px-3 text-[13px] text-[#16181d]">
          <Lock size={12} className="shrink-0 text-[#5d6370]" aria-hidden />
          <span className="truncate">
            {chrome.url}
            {chrome.typing && <span className="caret ml-px inline-block h-[14px] w-px translate-y-[2px] bg-[#16181d]" />}
          </span>
        </span>
        {chrome.session && (
          <span className="session-pop inline-flex h-[24px] shrink-0 items-center gap-1.5 rounded-full bg-[#E9F7EF] px-2.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] text-[#1f7a4d]">
            <KeyRound size={11} aria-hidden />
            Signed in with saved session
          </span>
        )}
      </div>

      {/* page */}
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** Skeleton block with a soft shimmer, used while a page loads. */
export function Sk({ className = "" }: { className?: string }) {
  return <span className={`sk block rounded-md ${className}`} />;
}

/** A page that loads: skeleton until `ready`, then the real content fades in. */
export function Loadable({ ready, skeleton, children }: { ready: boolean; skeleton: ReactNode; children: ReactNode }) {
  return ready ? <div className="page-in h-full">{children}</div> : <div className="h-full">{skeleton}</div>;
}
