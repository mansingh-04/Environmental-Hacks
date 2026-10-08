"use client";

import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion";
import type { WasteAnalysis } from "@/types/waste";
import { CountUp } from "./count-up";

/** "What should I do?" — the primary answer, shown without any interaction. */
export function ActionSection({ analysis }: { analysis: WasteAnalysis }) {
  const { instruction, preparationSteps, warnings } = analysis.disposal;
  return (
    <motion.section variants={stagger(0.05, 0.35)} initial="hidden" animate="show" className="border-t border-ink pt-5">
      <motion.h2 variants={fadeUp} className="label text-muted">
        What to do
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-2 text-lg leading-snug font-medium">
        {instruction}
      </motion.p>
      <ol className="mt-4 border-t border-line">
        {preparationSteps.map((step, i) => (
          <motion.li key={step} variants={fadeUp} className="flex items-baseline gap-4 border-b border-line py-3">
            <span className="label w-5 text-material">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[15px]">{step}</span>
          </motion.li>
        ))}
      </ol>
      {warnings.map((w) => (
        <motion.p key={w} variants={fadeUp} className="mt-4 flex gap-2.5 border-l-2 border-caution bg-caution-soft px-3 py-2.5 text-sm text-caution">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {w}
        </motion.p>
      ))}
    </motion.section>
  );
}

export function ValueSummary({ analysis }: { analysis: WasteAnalysis }) {
  const { value } = analysis;
  if (value.max === 0) return <span className="text-[15px] font-semibold">{value.estimatedValue}</span>;
  return (
    <span className="flex items-baseline gap-1 tabular-nums">
      <span className="text-xl font-semibold tracking-tight">
        {value.currency}
        <CountUp value={value.min} />
        {value.max !== value.min && (
          <>
            –<CountUp value={value.max} />
          </>
        )}
      </span>
      <span className="text-xs text-muted">{value.unit}</span>
    </span>
  );
}

export function ValueDetails({ analysis }: { analysis: WasteAnalysis }) {
  const { value, earning, identification } = analysis;
  return (
    <motion.div variants={stagger(0.05)} initial="hidden" animate="show" className="flex flex-col gap-4">
      <motion.p variants={fadeUp} className="label text-faint">
        Based on: {identification.material} · {value.region ? `${value.region} approximate local rate` : "approximate national rate"}
      </motion.p>
      <motion.p variants={fadeUp} className="text-[15px] leading-relaxed text-muted">
        {value.explanation} This is an estimate — actual prices vary by dealer and condition.
      </motion.p>
      <motion.div variants={fadeUp} className="rounded-md border border-line bg-surface p-4">
        <p className="label text-muted">How to earn from it</p>
        <p className="mt-1.5 font-semibold">{earning.method}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{earning.explanation}</p>
      </motion.div>
    </motion.div>
  );
}

export function ImpactDetails({ analysis }: { analysis: WasteAnalysis }) {
  const { harm, benefit, fact } = analysis.environmentalImpact;
  return (
    <motion.dl variants={stagger(0.06)} initial="hidden" animate="show" className="flex flex-col gap-4 text-[15px] leading-relaxed">
      <motion.div variants={fadeUp}>
        <dt className="label text-muted">If mixed or dumped</dt>
        <dd className="mt-1">{harm}</dd>
      </motion.div>
      <motion.div variants={fadeUp}>
        <dt className="label text-muted">Sorted correctly</dt>
        <dd className="mt-1">{benefit}</dd>
      </motion.div>
      <motion.p variants={fadeUp} className="border-l-2 border-material pl-3 text-sm font-medium">
        {fact}
      </motion.p>
    </motion.dl>
  );
}
