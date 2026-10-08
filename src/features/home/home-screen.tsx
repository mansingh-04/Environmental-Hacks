"use client";

import { ArrowRight, Camera, ScanLine, Upload } from "lucide-react";
import { motion } from "motion/react";
import { buttonStyles } from "@/components/button";
import { FrameCorners } from "@/components/frame-corners";
import { UploadLabel } from "@/components/upload-button";
import { LanguageSelect } from "@/features/language/language-select";
import { fadeUp, stagger } from "@/lib/motion";

const SEQUENCE = ["Object", "Material", "Action", "Value", "Location"];

export function HomeScreen({ onScan, onImage }: { onScan: () => void; onImage: (file: File) => void }) {
  return (
    <motion.main
      variants={stagger(0.07, 0.04)}
      initial="hidden"
      animate="show"
      className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <motion.header variants={fadeUp} className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-md bg-ink text-paper">
          <ScanLine className="size-4" strokeWidth={2.25} />
        </span>
        <span className="flex-1 text-[17px] font-semibold tracking-tight">CleanItUp</span>
        <LanguageSelect />
      </motion.header>

      <section className="flex flex-1 flex-col justify-center py-8">
        <motion.h1 variants={fadeUp} className="text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.03em]">
          Know Your Waste.
          <br />
          <span className="text-muted">Do the Right Thing.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 max-w-[19rem] text-[15px] leading-relaxed text-muted">
          Point your camera at an item and find out what it is, what it&apos;s worth, and where it belongs.
        </motion.p>

        <motion.button
          variants={fadeUp}
          type="button"
          onClick={onScan}
          whileTap={{ scale: 0.985 }}
          className="group relative mt-8 flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-xl bg-ink p-5 text-left text-paper"
        >
          <span className="label text-paper/60">Scan · Identify · Sort</span>
          <span className="absolute inset-x-14 inset-y-16">
            <FrameCorners className="border-paper/50 transition-colors duration-200 group-hover:border-paper" size="size-7" />
          </span>
          <span className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent transition-transform duration-200 group-hover:scale-105">
            <Camera className="size-6 text-white" />
          </span>
          <span className="flex items-end justify-between">
            <span className="text-2xl font-semibold tracking-tight">Scan Waste</span>
            <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </motion.button>

        <motion.div variants={fadeUp} className="mt-3">
          <UploadLabel onImage={onImage} className={buttonStyles("secondary", "w-full")}>
            <Upload className="size-4" /> Upload Image
          </UploadLabel>
        </motion.div>
      </section>

      <motion.ol variants={fadeUp} className="flex items-center justify-between border-t border-line pt-4" aria-label="What CleanItUp tells you">
        {SEQUENCE.map((step, i) => (
          <li key={step} className="label flex items-center gap-1.5 text-faint">
            <span className="text-ink/70">{step}</span>
            {i < SEQUENCE.length - 1 && <span aria-hidden>→</span>}
          </li>
        ))}
      </motion.ol>
    </motion.main>
  );
}
