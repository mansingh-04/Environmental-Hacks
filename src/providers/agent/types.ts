import type { ChatMessage, WasteAnalysis, WasteDetection, WasteKnowledge } from "@/types/waste";

export interface WasteAgent {
  analyze(detection: WasteDetection, knowledge: WasteKnowledge): Promise<WasteAnalysis>;
  /** Answers a follow-up question scoped to the currently detected item. */
  answer(question: string, analysis: WasteAnalysis, history: ChatMessage[]): Promise<string>;
}
