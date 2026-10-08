import { SpeechInputError, type ListenOptions, type SpeechInputErrorKind, type SpeechRecognitionProvider } from "./types";

/* Minimal typings for the Web Speech API recognition interface (not in lib.dom). */
interface RecognitionResultList {
  length: number;
  [index: number]: { 0: { transcript: string } };
}
interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: RecognitionResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => RecognitionLike;

const ERRORS: Record<string, SpeechInputErrorKind> = {
  "not-allowed": "denied",
  "no-speech": "no-speech",
  aborted: "aborted",
  "language-not-supported": "language-unsupported",
  "audio-capture": "service-unavailable",
  network: "service-unavailable",
  "service-not-allowed": "service-unavailable",
  "bad-grammar": "service-unavailable",
};

function getRecognition(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export class BrowserSpeechRecognitionProvider implements SpeechRecognitionProvider {
  private active: RecognitionLike | null = null;

  isSupported() {
    return Boolean(getRecognition());
  }

  async listen({ locale, onTranscript }: ListenOptions): Promise<string> {
    const Recognition = getRecognition();
    if (!Recognition) throw new SpeechInputError("unsupported");
    this.stop();
    await ensureMicrophonePermission();

    return new Promise((resolve, reject) => {
      const recognition = new Recognition();
      recognition.lang = locale;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let transcript = "";
      let failure: SpeechInputErrorKind | null = null;

      recognition.onresult = (e) => {
        transcript = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join("");
        onTranscript?.(transcript);
      };
      recognition.onerror = (e) => {
        failure = ERRORS[e.error] ?? "service-unavailable";
      };
      recognition.onend = () => {
        if (this.active === recognition) this.active = null;
        const text = transcript.trim();
        if (text) resolve(text);
        else reject(new SpeechInputError(failure ?? "no-speech"));
      };

      this.active = recognition;
      try {
        recognition.start();
      } catch {
        this.active = null;
        reject(new SpeechInputError("service-unavailable"));
      }
    });
  }

  stop() {
    // stop() keeps whatever was heard so far; onend then resolves with it.
    this.active?.stop();
  }
}

/**
 * Microphone permission is separate from camera permission. Asking explicitly gives a clear
 * browser prompt and lets us tell "blocked" apart from other failures. Tracks are released at once.
 */
async function ensureMicrophonePermission(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) return; // Let recognition request access itself.
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
  } catch (err) {
    const name = err instanceof DOMException ? err.name : "";
    if (name === "NotAllowedError" || name === "SecurityError") throw new SpeechInputError("denied");
    throw new SpeechInputError("service-unavailable");
  }
}
