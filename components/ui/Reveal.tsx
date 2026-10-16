"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType; children: ReactNode };

/** Fade in + rise 32px at 20% in view, children staggered 60ms, once only. */
export function Reveal({ as: Tag = "div", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}
