import { tools, type ToolId } from "@/lib/story";

export function ToolLogo({
  id,
  size = 20,
  brand = false,
  className = "",
}: {
  id: ToolId;
  size?: number;
  brand?: boolean;
  className?: string;
}) {
  const t = tools[id];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={brand && t.hex.toUpperCase() !== "#FFFFFF" ? t.hex : "currentColor"}
      className={className}
      aria-hidden
    >
      <path d={t.path} />
    </svg>
  );
}

/** Rounded app-icon badge: tool logo in brand color on a dark tile. */
export function ToolBadge({ id, size = 28, className = "" }: { id: ToolId; size?: number; className?: string }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-[8px] border border-line bg-surface-2 text-text ${className}`}
      style={{ width: size, height: size }}
    >
      <ToolLogo id={id} size={Math.round(size * 0.52)} brand />
    </span>
  );
}
