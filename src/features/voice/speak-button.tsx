"use client";

import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { activeLanguage, useLanguageState } from "@/features/language/language-store";
import { voiceSummary } from "@/features/waste/pipeline";
import { LANGUAGES } from "@/lib/languages";
import { speechOutput } from "@/providers";
import type { WasteAnalysis } from "@/types/waste";
import { Waveform } from "./waveform";

/** Reads a short, conversational summary of the result in the current language. */
export function SpeakButton({ analysis }: { analysis: WasteAnalysis }) {
  const { language, script } = activeLanguage(useLanguageState());
  const [state, setState] = useState<"idle" | "speaking" | "no-voice">("idle");

  useEffect(() => () => speechOutput.stop(), []);

  if (!speechOutput.isSupported()) return null;

  async function toggle() {
    if (state === "speaking") {
      speechOutput.stop();
      return setState("idle");
    }
    setState("speaking");
    const started = await speechOutput.speak(voiceSummary(analysis, language, script), language, { script, onEnd: () => setState("idle") });
    if (!started) {
      setState("no-voice");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={state === "speaking" ? "Stop reading" : "Read result aloud"}
      className="inline-flex min-h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium transition hover:border-ink/30 active:scale-95"
    >
      {state === "speaking" ? <Waveform className="bg-accent" /> : <Volume2 className="size-4" />}
      {state === "speaking" ? "Stop" : state === "no-voice" ? `No ${LANGUAGES[language].name} voice here` : "Listen"}
    </button>
  );
}
