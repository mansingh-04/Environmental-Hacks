"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { ChatSheet } from "@/features/chat/chat-sheet";
import { SpeakButton } from "@/features/voice/speak-button";
import type { WasteAnalysis, WasteItemId } from "@/types/waste";
import { IdentificationCard } from "./identification-card";
import { DisposalSection, ImpactSection, RecyclerSection, ValueSection, VerdictCard } from "./result-sections";

export function ResultScreen({
  analysis,
  imageUrl,
  onScanAgain,
  onHome,
  onCorrect,
}: {
  analysis: WasteAnalysis;
  imageUrl: string;
  onScanAgain: () => void;
  onHome: () => void;
  onCorrect: (itemId: WasteItemId) => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <main className="mx-auto min-h-dvh max-w-md pb-32">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-canvas/85 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-lg">
        <button onClick={onHome} aria-label="Home" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
          <Icon name="back" />
        </button>
        <span className="font-semibold">Your result</span>
        <button onClick={onScanAgain} aria-label="Scan again" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
          <Icon name="camera" />
        </button>
      </header>

      <div key={analysis.identification.name} className="flex flex-col gap-3 px-4">
        <IdentificationCard analysis={analysis} imageUrl={imageUrl} onCorrect={onCorrect} />
        <VerdictCard analysis={analysis} action={<SpeakButton text={analysis.spokenSummary} />} />
        <DisposalSection analysis={analysis} />
        <ValueSection analysis={analysis} />
        <RecyclerSection analysis={analysis} />
        <ImpactSection analysis={analysis} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-canvas via-canvas/95 to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button onClick={() => setChatOpen(true)} className="mx-auto w-full max-w-md">
          <Icon name="chat" /> Ask about this item
          <Icon name="mic" className="ml-auto size-5 text-lime" />
        </Button>
      </div>

      {chatOpen && <ChatSheet analysis={analysis} imageUrl={imageUrl} onClose={() => setChatOpen(false)} />}
    </main>
  );
}
