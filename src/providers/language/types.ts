import type { Script, SupportedLanguage } from "@/lib/languages";

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  script: Script;
  isCodeMixed?: boolean;
  secondaryLanguage?: SupportedLanguage;
}

export interface LanguageDetector {
  detect(text: string): Promise<LanguageDetectionResult>;
  /** A language the user explicitly asked for ("Hindi mein batao", "answer in Tamil"), if any. */
  requestedLanguage(text: string): SupportedLanguage | undefined;
}
