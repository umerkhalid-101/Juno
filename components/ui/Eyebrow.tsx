export function Eyebrow({
  children,
  dot = false,
  className = "",
}: {
  children: string;
  dot?: boolean;
  className?: string;
}) {
  return (
    <p className={`t-eyebrow inline-flex items-center gap-2 text-muted ${className}`}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-blue shadow-[0_0_8px_rgba(50,76,255,0.9)]" />}
      {children}
    </p>
  );
}
