/**
 * The Juno wordmark: rounded single-weight strokes, drawn as paths so it stays crisp at any
 * size. It takes the current text colour.
 */
export function JunoLogo({ height = 22, className = "" }: { height?: number; className?: string }) {
  const w = (height * 116) / 38;
  return (
    <svg
      viewBox="-4 -1 116 38"
      width={w}
      height={height}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={5.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Juno"
    >
      {/* J */}
      <path d="M15 4 V24.5 A7.5 7.5 0 0 1 0 24.5" />
      {/* u */}
      <path d="M29 13 V24 A8 8 0 0 0 45 24 M45 13 V32" />
      {/* n */}
      <path d="M59 32 V13 M59 21 A8 8 0 0 1 75 21 V32" />
      {/* o */}
      <circle cx="97.5" cy="22.5" r="9.5" />
    </svg>
  );
}
