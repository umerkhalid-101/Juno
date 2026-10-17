import { tools, type ToolId } from "@/lib/story";
import { BrandMark } from "@/components/ui/BrandIcon";

/**
 * A tool's real logo in its official colors, everywhere on the site.
 * Notion and GitHub use their official one-color marks and follow the text color,
 * so they read black on light cards and white on dark ones.
 */
export function ToolLogo({
  id,
  size = 20,
  className = "",
}: {
  id: ToolId;
  size?: number;
  /** @deprecated logos are always shown in their real colors now */
  brand?: boolean;
  className?: string;
}) {
  if (id === "notion" || id === "github") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden>
        <path d={tools[id].path} />
      </svg>
    );
  }
  return <BrandMark id={id} size={size} className={className} />;
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
