import type { WasteDetection, WasteKnowledge } from "@/types/waste";

export interface WasteKnowledgeProvider {
  getKnowledge(detection: WasteDetection): Promise<WasteKnowledge>;
}
