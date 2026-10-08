import type { ConversationContext } from "@/types/conversation";
import type { WasteAnalysis, WasteDetection, WasteKnowledge } from "@/types/waste";

export interface WasteAgent {
  analyze(detection: WasteDetection, knowledge: WasteKnowledge): Promise<WasteAnalysis>;
  /** Answers a follow-up about the current item, in the conversation's language. */
  answer(question: string, context: ConversationContext): Promise<string>;
}
