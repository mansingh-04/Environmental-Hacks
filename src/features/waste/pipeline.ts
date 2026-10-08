import { WASTE_ITEMS } from "@/data/waste/items";
import { formatValue } from "@/lib/format";
import type { Script, SupportedLanguage } from "@/lib/languages";
import { agent, knowledge, languageDetector, recyclers, values, vision } from "@/providers";
import { buildVoiceResponse } from "@/providers/agent/responses";
import type { LanguageDetectionResult } from "@/providers/language/types";
import type { ConversationContext } from "@/types/conversation";
import type { GeoPoint, WasteAnalysis, WasteDetection, WasteItemId } from "@/types/waste";

export type AnalysisStage = "vision" | "knowledge" | "agent";

/** Single analysis pipeline shared by camera capture and image upload. */
export async function analyzeImage(
  image: Blob,
  onStage?: (stage: AnalysisStage) => void,
): Promise<WasteAnalysis> {
  onStage?.("vision");
  const detection = await vision.analyzeImage(image);
  return analyzeDetection(detection, onStage);
}

async function analyzeDetection(
  detection: WasteDetection,
  onStage?: (stage: AnalysisStage) => void,
): Promise<WasteAnalysis> {
  onStage?.("knowledge");
  const facts = await knowledge.getKnowledge(detection);
  onStage?.("agent");
  return agent.analyze(detection, facts);
}

/** Location-dependent step: nearby recyclers and a regional value estimate. Independent of vision. */
export async function localizeAnalysis(analysis: WasteAnalysis, where: GeoPoint): Promise<WasteAnalysis> {
  const { itemId, categoryKey } = analysis.identification;
  const [nearby, value] = await Promise.all([
    recyclers.findNearby(categoryKey, where),
    values.estimate(itemId, categoryKey, where),
  ]);
  return {
    ...analysis,
    recyclers: nearby,
    value: { ...analysis.value, ...value, estimatedValue: formatValue(value) },
  };
}

/** User correction ("Not right?"): re-runs stage 2 with a user-confirmed detection. */
export function correctDetection(itemId: WasteItemId): Promise<WasteAnalysis> {
  const item = WASTE_ITEMS[itemId];
  return analyzeDetection({
    itemId,
    objectName: item.name,
    material: item.material,
    category: item.category,
    confidence: 1,
    visualDetails: { userConfirmed: true },
  });
}

/** Follow-up conversation, scoped to the current analysis and language. Only recent turns are sent. */
export function askFollowUp(question: string, context: ConversationContext): Promise<string> {
  return agent.answer(question, { ...context, messages: context.messages.slice(-6) });
}

export async function detectLanguage(text: string): Promise<LanguageDetectionResult & { requested?: SupportedLanguage }> {
  return { ...(await languageDetector.detect(text)), requested: languageDetector.requestedLanguage(text) };
}

/** Short spoken summary of a result (not a reading of the screen). */
export function voiceSummary(analysis: WasteAnalysis, language: SupportedLanguage, script: Script): string {
  return buildVoiceResponse(analysis, language, script);
}
