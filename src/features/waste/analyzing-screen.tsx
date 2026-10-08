"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { FrameCorners } from "@/components/frame-corners";
import { DURATION, EASE } from "@/lib/motion";
import type { AnalysisStage } from "./pipeline";

/** One step per real pipeline stage — progress is never simulated. */
const STEPS: { stage: AnalysisStage; label: string }[] = [
  { stage: "vision", label: "Identifying object" },
  { stage: "knowledge", label: "Checking material" },
  { stage: "agent", label: "Preparing disposal guidance" },
];

export function AnalyzingScreen({ imageUrl, stage }: { imageUrl: string; stage: AnalysisStage }) {
  const current = STEPS.findIndex((s) => s.stage === stage);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-10 px-5">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        className="relative mx-auto aspect-square w-full max-w-[18rem] p-3"
      >
        <FrameCorners className="border-ink" size="size-6" />
        <div className="relative size-full overflow-hidden rounded-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
          <img src={imageUrl} alt="Captured item" className="size-full object-cover" />
          <span className="absolute inset-0 animate-scan">
            <span className="absolute inset-x-0 top-0 h-px bg-accent" />
          </span>
        </div>
      </motion.div>

      <ol className="mx-auto w-full max-w-[18rem] border-t border-line" aria-live="polite">
        {STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <motion.li
              key={s.stage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: i > current ? 0.4 : 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE, delay: i * 0.05 }}
              className="flex items-center gap-3 border-b border-line py-3"
            >
              <span className="label w-5 text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className={`flex-1 text-[15px] ${active ? "font-semibold text-ink" : "text-muted"}`}>{s.label}</span>
              <span className="grid size-4 place-items-center">
                {done ? (
                  <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: DURATION.fast }}>
                    <Check className="size-4 text-ink" strokeWidth={2.5} />
                  </motion.span>
                ) : (
                  active && <span className="size-1.5 rounded-full bg-accent animate-blink" />
                )}
              </span>
            </motion.li>
          );
        })}
      </ol>
    </main>
  );
}
