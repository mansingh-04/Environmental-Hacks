import { responseStyle, type Script, type SupportedLanguage } from "@/lib/languages";
import type { WasteAnalysis } from "@/types/waste";
import type { Intent } from "./intents";
import { PHRASEBOOK } from "./phrasebook";

/** "PET Plastic Bottle" → "PET plastic bottle": how people say it, keeping acronyms. */
export function spokenItemName(name: string): string {
  return name
    .split(" ")
    .map((word) => (word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(" ");
}

/** Composes a short (1–3 sentence) answer from structured analysis facts in the requested language. */
export function composeAnswer(intent: Intent, analysis: WasteAnalysis, language: SupportedLanguage, script: Script): string {
  const p = PHRASEBOOK[responseStyle(language, script)];
  const item = spokenItemName(analysis.identification.name);
  const category = analysis.identification.categoryKey;
  const nearest = analysis.recyclers[0];
  const hasValue = analysis.value.max > 0;

  switch (intent) {
    case "prepare":
      return p.action[category];
    case "value":
      return hasValue ? `${p.value(analysis.value.estimatedValue, analysis.value.unit)} ${p.earn}` : p.noValue;
    case "where":
      return nearest?.distanceKm !== undefined ? p.nearest(nearest.name, nearest.distanceKm) : `${p.action[category]} ${p.needLocation}`;
    case "harm":
      return category === "e-waste" || category === "hazardous" ? p.toxicHarm : p.harm;
    case "recycle":
      return `${p.verdict[analysis.verdict.kind]} ${p.action[category]}`;
    case "confidence":
      return p.confidence(item, Math.round(analysis.identification.confidence * 100));
    case "fallback":
      return p.fallback(item);
  }
}

/** Opening line used once per conversation, so follow-ups don't repeat the identification. */
export function identify(analysis: WasteAnalysis, language: SupportedLanguage, script: Script): string {
  return PHRASEBOOK[responseStyle(language, script)].its(spokenItemName(analysis.identification.name));
}

/**
 * What CleanItUp says aloud about a result: conclusion + key action + one useful next fact.
 * Never reads UI labels or raw fields.
 */
export function buildVoiceResponse(analysis: WasteAnalysis, language: SupportedLanguage, script: Script = "native"): string {
  const p = PHRASEBOOK[responseStyle(language, script)];
  const action = p.action[analysis.identification.categoryKey];
  const parts = [identify(analysis, language, script), action];
  const actionIsLong = (action.match(/[.।۔]/g) ?? []).length > 1;
  if (!actionIsLong) {
    const nearest = analysis.recyclers[0];
    if (nearest?.distanceKm !== undefined) parts.push(p.nearest(nearest.name, nearest.distanceKm));
    else if (analysis.value.max > 0) parts.push(p.value(analysis.value.estimatedValue, analysis.value.unit));
  }
  return parts.join(" ");
}
