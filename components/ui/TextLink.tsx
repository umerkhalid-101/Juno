import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 text-blue-text t-small font-medium hover:text-[#9aaaff] transition-colors duration-200"
    >
      {children}
      <ArrowRight
        size={16}
        strokeWidth={1.5}
        className="transition-transform duration-200 ease-out group-hover:translate-x-1"
        aria-hidden
      />
    </a>
  );
}
