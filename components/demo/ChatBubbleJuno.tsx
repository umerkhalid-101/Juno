import type { ReactNode } from "react";
import { MascotMark } from "@/components/mascot/Mascot";

/** No fill, 24px mascot avatar, left-aligned. Pairs with an OutputCard. */
export function ChatBubbleJuno({
  children,
  avatar,
  className = "",
}: {
  children: ReactNode;
  avatar?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center">{avatar ?? <MascotMark size={24} />}</span>
      <div className="min-w-0 flex-1 text-[15px] leading-6 text-text">{children}</div>
    </div>
  );
}
