"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export function FaqItem({ q, a, placeholder }: { q: string; a: string; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b border-line" data-placeholder={placeholder ? "true" : undefined}>
      {/* {placeholder && `PLACEHOLDER: ${placeholder}`} */}
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((v) => !v)}
          className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span className="text-[17px] leading-6 font-medium tracking-[-0.01em] text-text md:text-[18px]">{q}</span>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors duration-200 group-hover:border-line-strong group-hover:text-text">
            <Plus
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="transition-transform duration-[400ms]"
              style={{ transform: open ? "rotate(45deg)" : "none", transitionTimingFunction: "var(--ease-base)" }}
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="t-body max-w-[60ch] pb-6 pr-12 text-muted">
              {a}
              {placeholder && (
                <span className="ml-2 inline-block rounded-sm border border-dashed border-line-strong px-1.5 font-mono text-[11px] text-subtle">
                  placeholder
                </span>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
