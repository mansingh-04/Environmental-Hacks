"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { useVoice } from "./use-voice";

export function SpeakButton({ text }: { text: string }) {
  const voice = useVoice();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => voice?.stopSpeaking(), [voice]);

  if (!voice?.canSpeak) return null;

  function toggle() {
    if (!voice) return;
    if (speaking) {
      voice.stopSpeaking();
      return setSpeaking(false);
    }
    setSpeaking(true);
    voice.speak(text, () => setSpeaking(false));
  }

  return (
    <button
      onClick={toggle}
      aria-label={speaking ? "Stop" : "Listen"}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold ring-1 ring-current/20"
    >
      <Icon name={speaking ? "stop" : "volume"} className="size-4" />
      {speaking ? "Stop" : "Listen"}
    </button>
  );
}
