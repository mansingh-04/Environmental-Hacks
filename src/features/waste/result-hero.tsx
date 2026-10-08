"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { FrameCorners } from "@/components/frame-corners";
import { WASTE_ITEMS } from "@/data/waste/items";
import { DURATION, EASE, fadeUp, stagger } from "@/lib/motion";
import type { WasteAnalysis, WasteItemId } from "@/types/waste";
import { MATERIAL_STYLE, VERDICT_LABEL } from "./materials";

/** Object → material → status. The detected item is the hero of the result. */
export function ResultHero({
  analysis,
  imageUrl,
  action,
  onCorrect,
}: {
  analysis: WasteAnalysis;
  imageUrl: string;
  action: ReactNode;
  onCorrect: (itemId: WasteItemId) => void;
}) {
  const { name, material, categoryKey, confidence } = analysis.identification;
  const [picking, setPicking] = useState(false);
  const pct = Math.round(confidence * 100);
  const hazardous = analysis.verdict.kind !== "recycle";

  return (
    <motion.section variants={stagger(0.07)} initial="hidden" animate="show">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-surface"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
        <img src={imageUrl} alt={name} className="size-full object-cover" />
        <span className="absolute inset-3">
          <FrameCorners className="border-white/90" size="size-5" />
        </span>
        <motion.span variants={fadeUp} className="label absolute bottom-3 left-3 rounded-sm bg-ink/75 px-2 py-1 text-paper">
          Detected · {pct === 100 ? "Confirmed" : `${pct}% match`}
        </motion.span>
      </motion.div>

      <motion.h1 variants={fadeUp} className="mt-5 text-[2rem] leading-[1.05] font-semibold tracking-[-0.025em]">
        {name}
      </motion.h1>
      <motion.p variants={fadeUp} className="label mt-2 flex items-center gap-2 text-material">
        <span className="size-2 rounded-[1px] bg-material" aria-hidden />
        {material} · {MATERIAL_STYLE[categoryKey].label}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-4 flex items-center gap-2">
        <span
          className={`label inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-semibold ${
            hazardous ? "border-hazard/30 bg-hazard-soft text-hazard" : "border-ink/15 bg-surface text-ink"
          }`}
        >
          <span className={`size-1.5 rounded-full ${hazardous ? "bg-hazard" : "bg-material"}`} />
          {VERDICT_LABEL[analysis.verdict.kind]}
        </span>
        <span className="flex-1" />
        {action}
      </motion.div>

      <motion.button variants={fadeUp} onClick={() => setPicking((p) => !p)} className="mt-3 text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink">
        {picking ? "Cancel" : "Not this item?"}
      </motion.button>
      <AnimatePresence initial={false}>
        {picking && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: DURATION.fast }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {Object.values(WASTE_ITEMS).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPicking(false);
                  onCorrect(item.id);
                }}
                className={`rounded-md border px-3 py-2 text-sm transition active:scale-95 ${item.name === name ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-ink/30"}`}
              >
                {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
