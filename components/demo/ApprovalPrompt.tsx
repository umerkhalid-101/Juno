"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { StatusChip, type Status } from "@/components/ui/StatusChip";

/** surface-2 pill: question + Approve + Edit. Approve snaps to a Sent chip. */
export function ApprovalPrompt({
  question,
  approvedStatus = "Sent",
  approvedNote,
  onApprove,
  className = "",
}: {
  question: string;
  approvedStatus?: Status;
  approvedNote?: string;
  onApprove?: () => void;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <div
      className={`flex min-h-14 items-center justify-between gap-3 rounded-full border border-line bg-surface-2 py-2 pl-5 pr-2 ${className}`}
      role="group"
      aria-label="Approval"
    >
      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <motion.div
            key="ask"
            className="flex w-full items-center justify-between gap-3"
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12, ease: [0.3, 0, 0, 1] } }}
          >
            <span className="text-[14px] leading-5 text-text">{question}</span>
            <span className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                className="h-10 rounded-full px-4 text-[14px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setDone(true);
                  onApprove?.();
                }}
                className="h-10 rounded-full bg-text px-4 text-[14px] font-semibold text-bg transition-shadow duration-200 hover:shadow-[0_0_0_4px_rgba(50,76,255,0.3)] active:scale-[0.97]"
              >
                Approve
              </button>
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            className="flex w-full items-center justify-between gap-3 pr-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.12, ease: [0.3, 0, 0, 1] }}
          >
            <span className="inline-flex items-center gap-2 text-[14px] text-text">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.25, 1] }}
                transition={{ duration: 0.32, ease: [0.3, 0, 0, 1] }}
                className="grid size-5 place-items-center rounded-full bg-success text-bg"
              >
                <Check size={12} strokeWidth={3} aria-hidden />
              </motion.span>
              {approvedNote ?? "Approved"}
            </span>
            <StatusChip status={approvedStatus} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
