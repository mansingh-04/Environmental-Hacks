"use client";

import { Camera, ChevronLeft, Mic } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { Button } from "@/components/button";
import { ChatSheet } from "@/features/chat/chat-sheet";
import type { LocationStatus } from "@/features/location/use-location";
import { SpeakButton } from "@/features/voice/speak-button";
import { fadeUp, stagger, transition } from "@/lib/motion";
import type { WasteAnalysis, WasteItemId } from "@/types/waste";
import { Disclosure } from "./disclosure";
import { MATERIAL_STYLE } from "./materials";
import { RecyclerRow } from "./recycler-section";
import { ResultHero } from "./result-hero";
import { ActionSection, ImpactDetails, ValueDetails, ValueSummary } from "./result-sections";

export function ResultScreen({
  analysis,
  imageUrl,
  onScanAgain,
  onHome,
  onCorrect,
  localized,
  locationStatus,
  onRequestLocation,
}: {
  analysis: WasteAnalysis;
  imageUrl: string;
  localized: boolean;
  locationStatus: LocationStatus;
  onRequestLocation: () => void;
  onScanAgain: () => void;
  onHome: () => void;
  onCorrect: (itemId: WasteItemId) => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const material = MATERIAL_STYLE[analysis.identification.categoryKey];

  return (
    <main
      style={{ "--material": material.color } as CSSProperties}
      className="mx-auto min-h-dvh max-w-md pb-28"
    >
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
        <button onClick={onHome} aria-label="Home" className="grid size-11 place-items-center rounded-md transition hover:bg-ink/5 active:scale-90">
          <ChevronLeft className="size-5" />
        </button>
        <span className="label text-muted">Inspection result</span>
        <button onClick={onScanAgain} aria-label="Scan again" className="grid size-11 place-items-center rounded-md transition hover:bg-ink/5 active:scale-90">
          <Camera className="size-5" />
        </button>
      </header>

      <div key={analysis.identification.itemId} className="flex flex-col gap-8 px-5 pt-5">
        <ResultHero analysis={analysis} imageUrl={imageUrl} onCorrect={onCorrect} action={<SpeakButton analysis={analysis} />} />
        <ActionSection analysis={analysis} />

        <motion.div variants={stagger(0.06, 0.5)} initial="hidden" animate="show" className="border-t border-line">
          <motion.div variants={fadeUp}>
            <Disclosure label={analysis.value.region ? "Estimated local value" : "Estimated value"} summary={<ValueSummary analysis={analysis} />}>
              <ValueDetails analysis={analysis} />
            </Disclosure>
          </motion.div>
          <motion.div variants={fadeUp}>
            <RecyclerRow analysis={analysis} localized={localized} locationStatus={locationStatus} onRequestLocation={onRequestLocation} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <Disclosure label="Why this matters">
              <ImpactDetails analysis={analysis} />
            </Disclosure>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0, transition: { ...transition, delay: 0.6 } }}
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <Button variant="ink" onClick={() => setChatOpen(true)} className="mx-auto w-full max-w-md justify-between">
          <span>Ask about this item</span>
          <Mic className="size-4" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {chatOpen && <ChatSheet analysis={analysis} imageUrl={imageUrl} onClose={() => setChatOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}
