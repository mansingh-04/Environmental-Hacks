import type { Script, SupportedLanguage } from "@/lib/languages";

export type SpeechInputErrorKind =
  | "unsupported" // no recognition API in this browser
  | "language-unsupported"
  | "denied"
  | "no-speech"
  | "service-unavailable"
  | "aborted";

export class SpeechInputError extends Error {
  constructor(readonly kind: SpeechInputErrorKind) {
    super(kind);
  }
}

export interface ListenOptions {
  /** BCP-47 locale for recognition, e.g. "hi-IN". */
  locale: string;
  onTranscript?: (text: string) => void;
}

export interface SpeechRecognitionProvider {
  /** Whether voice input exists at all. Per-language support can only be discovered by trying. */
  isSupported(language?: SupportedLanguage): boolean;
  listen(options: ListenOptions): Promise<string>;
  stop(): void;
}

export interface SpeechProfile {
  rate: number;
  pitch: number;
  volume: number;
}

export interface SpeakOptions {
  script?: Script;
  onEnd?: () => void;
}

export interface SpeechSynthesisProvider {
  isSupported(): boolean;
  /** Resolves true once speech starts, false if no suitable voice exists for this language. */
  speak(text: string, language: SupportedLanguage, options?: SpeakOptions): Promise<boolean>;
  stop(): void;
}
