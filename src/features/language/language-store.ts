"use client";

import { useSyncExternalStore } from "react";
import { LANGUAGE_CODES, normalizeScript, type Script, type SupportedLanguage } from "@/lib/languages";
import type { LanguageDetectionResult } from "@/providers/language/types";
import type { ConversationLanguageState } from "@/types/conversation";

export type LanguageMode = "auto" | "manual";

export interface LanguageState {
  mode: LanguageMode;
  manualLanguage: SupportedLanguage;
  conversation: ConversationLanguageState;
}

/** Below this, a detection is too weak to switch away from the language already in use. */
export const SWITCH_THRESHOLD = 0.55;

const STORAGE_KEY = "cleanitup.language";
const DEFAULT_STATE: LanguageState = {
  mode: "auto",
  manualLanguage: "en",
  conversation: { currentLanguage: "en", confidence: 0, script: "latin" },
};

let state: LanguageState = DEFAULT_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function load(): LanguageState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<LanguageState> | null;
    if (!saved) return DEFAULT_STATE;
    const valid = (l: unknown): l is SupportedLanguage => LANGUAGE_CODES.includes(l as SupportedLanguage);
    return {
      mode: saved.mode === "manual" ? "manual" : "auto",
      manualLanguage: valid(saved.manualLanguage) ? saved.manualLanguage : "en",
      conversation: saved.conversation && valid(saved.conversation.currentLanguage) ? saved.conversation : DEFAULT_STATE.conversation,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function getState(): LanguageState {
  if (!hydrated && typeof window !== "undefined") {
    state = load();
    hydrated = true;
  }
  return state;
}

function setState(next: LanguageState) {
  state = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode): preference just won't persist.
  }
  listeners.forEach((l) => l());
}

export function useLanguageState(): LanguageState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState,
    () => DEFAULT_STATE,
  );
}

export function setLanguagePreference(choice: "auto" | SupportedLanguage) {
  const current = getState();
  setState(choice === "auto" ? { ...current, mode: "auto" } : { ...current, mode: "manual", manualLanguage: choice });
}

/** The language CleanItUp should speak right now, before hearing anything new. */
export function activeLanguage(s: LanguageState): { language: SupportedLanguage; script: Script } {
  if (s.mode === "manual") return { language: s.manualLanguage, script: s.manualLanguage === "en" ? "latin" : "native" };
  return { language: s.conversation.currentLanguage, script: s.conversation.script };
}

/**
 * Decides the response language for one user turn and remembers it.
 * Manual override wins; an explicit request ("Hindi mein batao") switches; a confident detection
 * switches; a weak one ("ok", "aur?") keeps the current conversation language.
 */
export function resolveTurnLanguage(
  detection: LanguageDetectionResult,
  requested?: SupportedLanguage,
): { language: SupportedLanguage; script: Script; confidence: number } {
  const s = getState();
  if (s.mode === "manual") return { ...activeLanguage(s), confidence: 1 };

  const prev = s.conversation;
  let next: ConversationLanguageState = prev;
  if (requested) {
    next = { currentLanguage: requested, confidence: 1, script: normalizeScript(requested, detection.script), previousLanguage: prev.currentLanguage };
  } else if (detection.confidence >= SWITCH_THRESHOLD) {
    next = {
      currentLanguage: detection.language,
      confidence: detection.confidence,
      script: normalizeScript(detection.language, detection.script),
      previousLanguage: detection.language !== prev.currentLanguage ? prev.currentLanguage : prev.previousLanguage,
    };
  }
  if (next !== prev) setState({ ...s, conversation: next });
  return { language: next.currentLanguage, script: next.script, confidence: next.confidence };
}
