import { WASTE_ITEMS } from "@/data/waste/items";
import { agent, knowledge, vision } from "@/providers";
import type { ChatMessage, WasteAnalysis, WasteDetection, WasteItemId } from "@/types/waste";

export type AnalysisStage = "vision" | "agent";

/** Single analysis pipeline shared by camera capture and image upload. */
export async function analyzeImage(
  image: Blob,
  onStage?: (stage: AnalysisStage) => void,
): Promise<WasteAnalysis> {
  onStage?.("vision");
  const detection = await vision.analyzeImage(image);
  onStage?.("agent");
  return analyzeDetection(detection);
}

export async function analyzeDetection(detection: WasteDetection): Promise<WasteAnalysis> {
  const facts = await knowledge.getKnowledge(detection);
  return agent.analyze(detection, facts);
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

/** Follow-up conversation, scoped to the current analysis. */
export function askFollowUp(question: string, analysis: WasteAnalysis, history: ChatMessage[]): Promise<string> {
  return agent.answer(question, analysis, history);
}
