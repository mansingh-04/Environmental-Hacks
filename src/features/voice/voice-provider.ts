export interface VoiceProvider {
  readonly canSpeak: boolean;
  readonly canListen: boolean;
  speak(text: string, onEnd?: () => void): void;
  stopSpeaking(): void;
  listen(): Promise<string>;
  stopListening(): void;
}

/* Minimal typings for the Web Speech API recognition interface (not in lib.dom). */
interface SpeechRecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/** Browser-native voice using the Web Speech API. Replaceable with a hosted voice provider. */
export class BrowserVoiceProvider implements VoiceProvider {
  private recognition: SpeechRecognitionLike | null = null;
  private readonly Recognition: SpeechRecognitionCtor | undefined;

  constructor() {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    this.Recognition = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  }

  get canSpeak() {
    return "speechSynthesis" in window;
  }

  get canListen() {
    return Boolean(this.Recognition);
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.canSpeak) return onEnd?.();
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith("en") && v.localService);
    if (voice) utterance.voice = voice;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.canSpeak) speechSynthesis.cancel();
  }

  listen(): Promise<string> {
    const Recognition = this.Recognition;
    if (!Recognition) return Promise.reject(new Error("Voice input isn't supported in this browser."));
    this.stopListening();

    return new Promise((resolve, reject) => {
      const recognition = new Recognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      let transcript = "";
      recognition.onresult = (e) => {
        transcript = e.results[0]?.[0]?.transcript ?? "";
      };
      recognition.onerror = (e) => {
        if (e.error !== "aborted" && e.error !== "no-speech") reject(new Error(e.error));
      };
      recognition.onend = () => {
        this.recognition = null;
        resolve(transcript.trim());
      };
      this.recognition = recognition;
      recognition.start();
    });
  }

  stopListening() {
    this.recognition?.stop();
    this.recognition = null;
  }
}
