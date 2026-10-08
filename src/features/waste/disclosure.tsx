"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion";

/** Progressive-disclosure row: label + key fact visible, detail on demand. */
export function Disclosure({ label, summary, children }: { label: string; summary?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-16 w-full items-center gap-3 py-4 text-left"
      >
        <span className="label flex-1 text-muted">{label}</span>
        {summary}
        <ChevronDown className={`size-4 shrink-0 text-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: DURATION.base, ease: EASE } }}
            exit={{ height: 0, opacity: 0, transition: { duration: DURATION.fast, ease: EASE } }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
