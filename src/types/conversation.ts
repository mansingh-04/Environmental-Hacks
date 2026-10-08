import type { Script, SupportedLanguage } from "@/lib/languages";
import type { WasteAnalysis } from "./waste";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  language?: SupportedLanguage;
}

export interface ConversationLanguageState {
  currentLanguage: SupportedLanguage;
  confidence: number;
  script: Script;
  previousLanguage?: SupportedLanguage;
}

/** Everything the agent needs for one follow-up turn — and nothing else. */
export interface ConversationContext {
  analysis: WasteAnalysis;
  language: SupportedLanguage;
  languageConfidence: number;
  script: Script;
  /** Recent turns only. */
  messages: ConversationMessage[];
}
