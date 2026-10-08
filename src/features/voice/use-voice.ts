"use client";

import { useSyncExternalStore } from "react";
import { BrowserVoiceProvider, type VoiceProvider } from "./voice-provider";

let instance: VoiceProvider | null = null;
const getVoice = () => (instance ??= new BrowserVoiceProvider());
const subscribe = () => () => {};

/** Shared voice provider in the browser; null during server rendering. */
export function useVoice(): VoiceProvider | null {
  return useSyncExternalStore(subscribe, getVoice, () => null);
}
