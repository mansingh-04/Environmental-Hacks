"use client";

import { ChevronDown, Languages } from "lucide-react";
import { LANGUAGE_CODES, LANGUAGES, type SupportedLanguage } from "@/lib/languages";
import { setLanguagePreference, useLanguageState } from "./language-store";

/** Small optional override. Auto (detect from speech) is the default. */
/** `showDetected` adds the language currently in use, so Auto mode quietly shows what it picked. */
export function LanguageSelect({ compact = false, showDetected = false }: { compact?: boolean; showDetected?: boolean }) {
  const { mode, manualLanguage, conversation } = useLanguageState();
  const value = mode === "auto" ? "auto" : manualLanguage;
  const label =
    value !== "auto" ? LANGUAGES[value].nativeName : showDetected ? `Auto · ${LANGUAGES[conversation.currentLanguage].nativeName}` : "Auto";

  return (
    <label className="relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-line px-2.5 text-sm text-ink transition hover:border-ink/30">
      {!compact && <Languages className="size-4 shrink-0" aria-hidden />}
      <span className="label whitespace-nowrap">{label}</span>
      <ChevronDown className="size-3.5 shrink-0 text-faint" aria-hidden />
      <select
        aria-label="Response language"
        value={value}
        onChange={(e) => setLanguagePreference(e.target.value as "auto" | SupportedLanguage)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="auto">Auto — detect from speech</option>
        {LANGUAGE_CODES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGES[code].nativeName}
            {code !== "en" ? ` · ${LANGUAGES[code].name}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
