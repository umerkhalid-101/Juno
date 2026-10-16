import type { ReactNode } from "react";
import { ToolBadge } from "@/components/ui/ToolLogo";
import type { ToolId } from "@/lib/story";

/** xl radius surface with real UI inside. Tool logo + status chip in the header. */
export function OutputCard({
  tool,
  title,
  chip,
  children,
  className = "",
  headerProps,
}: {
  tool: ToolId;
  title: string;
  chip?: ReactNode;
  children: ReactNode;
  className?: string;
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-surface ${className}`}>
      <div {...headerProps} className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <ToolBadge id={tool} size={28} />
          <span className="truncate text-[14px] font-medium text-text">{title}</span>
        </div>
        {chip}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
