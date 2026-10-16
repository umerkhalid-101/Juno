import type { ReactNode } from "react";

export function ChatBubbleYou({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex justify-end ${className}`}>
      <div className="max-w-[480px] rounded-md bg-surface-2 px-4 py-3 text-[15px] leading-6 text-text">{children}</div>
    </div>
  );
}
