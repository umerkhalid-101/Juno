import { trustLogos } from "@/lib/story";

// PLACEHOLDER: fictional customer wordmarks. Not real customers.
const glyphs: Record<string, React.ReactNode> = {
  "Lumen Labs": <circle cx="8" cy="8" r="6" />,
  Fieldnote: <path d="M2 3h12v2H2zM2 7h9v2H2zM2 11h12v2H2z" />,
  Paperplane: <path d="M1 8 15 2l-4 13-3-5z" />,
  Kestrel: <path d="M8 1 15 14H1z" />,
  Brightside: <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zm0-3v2M8 14v2M0 8h2M14 8h2" strokeWidth="1.5" stroke="currentColor" />,
  Quarry: <rect x="2" y="2" width="12" height="12" rx="2" />,
};

export function TrustStrip({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <div data-placeholder="true" className={className}>
      <p className={`t-eyebrow text-center text-subtle ${compact ? "mb-5" : "mb-6"}`}>
        Teams handing off the busywork
      </p>
      <ul
        className={`flex flex-wrap items-center justify-center text-subtle ${
          compact ? "gap-x-8 gap-y-4" : "gap-x-10 gap-y-5 md:gap-x-14"
        }`}
        aria-label="Example customer logos (placeholders)"
      >
        {trustLogos.map((name) => (
          <li key={name} className="flex items-center gap-2 grayscale">
            <svg viewBox="0 0 16 16" width={compact ? 14 : 16} height={compact ? 14 : 16} fill="currentColor" aria-hidden>
              {glyphs[name]}
            </svg>
            <span className={`font-medium tracking-[-0.02em] ${compact ? "text-[15px]" : "text-[17px]"}`}>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
