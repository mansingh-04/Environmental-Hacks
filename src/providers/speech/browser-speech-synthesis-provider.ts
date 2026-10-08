import { LANGUAGES, type Script, type SupportedLanguage } from "@/lib/languages";
import type { SpeakOptions, SpeechProfile, SpeechSynthesisProvider } from "./types";

/** Conversational pacing: close to natural speed, a touch slower for languages with longer syllable runs. */
const PROFILES: Partial<Record<SupportedLanguage, SpeechProfile>> = {
  en: { rate: 1.0, pitch: 1.0, volume: 1 },
  ta: { rate: 0.93, pitch: 1.0, volume: 1 },
  te: { rate: 0.93, pitch: 1.0, volume: 1 },
  kn: { rate: 0.93, pitch: 1.0, volume: 1 },
  ml: { rate: 0.92, pitch: 1.0, volume: 1 },
};
const DEFAULT_PROFILE: SpeechProfile = { rate: 0.96, pitch: 1.0, volume: 1 };
const ROMANIZED_PROFILE: SpeechProfile = { rate: 0.98, pitch: 1.0, volume: 1 };

/** Cloud/neural voices generally sound far less robotic than legacy local ones. */
const NATURAL_VOICE = /google|natural|neural|enhanced|premium|online|siri/i;

const normalize = (lang: string) => lang.replace("_", "-").toLowerCase();

export class BrowserSpeechSynthesisProvider implements SpeechSynthesisProvider {
  private voices: SpeechSynthesisVoice[] = [];
  private loading: Promise<void> | null = null;

  isSupported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  async speak(text: string, language: SupportedLanguage, { script = "native", onEnd }: SpeakOptions = {}): Promise<boolean> {
    if (!this.isSupported()) return false;
    await this.loadVoices();
    speechSynthesis.cancel(); // Never queue: new speech replaces old.

    const voice = pickVoice(this.voices, language, script);
    // Without any matching voice, native-script text would be read as gibberish — stay silent instead.
    if (!voice && script === "native" && language !== "en") return false;

    const utterance = new SpeechSynthesisUtterance(toSpeakable(text, language, script));
    const profile = script === "latin" && language !== "en" ? ROMANIZED_PROFILE : (PROFILES[language] ?? DEFAULT_PROFILE);
    utterance.rate = profile.rate;
    utterance.pitch = profile.pitch;
    utterance.volume = profile.volume;
    utterance.lang = voice?.lang ?? (script === "latin" ? "en-IN" : LANGUAGES[language].locale);
    if (voice) utterance.voice = voice;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    speechSynthesis.speak(utterance);
    return true;
  }

  stop() {
    if (this.isSupported()) speechSynthesis.cancel();
  }

  /** Voices often arrive asynchronously (Chrome); wait briefly for `voiceschanged`. */
  private loadVoices(): Promise<void> {
    const current = speechSynthesis.getVoices();
    if (current.length) {
      this.voices = current;
      return Promise.resolve();
    }
    this.loading ??= new Promise<void>((resolve) => {
      const done = () => {
        this.voices = speechSynthesis.getVoices();
        this.loading = null;
        resolve();
      };
      speechSynthesis.addEventListener("voiceschanged", done, { once: true });
      setTimeout(done, 800);
    });
    return this.loading;
  }
}

/**
 * Ranking: exact Indian locale → same language elsewhere → Indian English (only for romanized text,
 * which Indian English voices read naturally) → any English. Natural/cloud voices win ties.
 */
function pickVoice(voices: SpeechSynthesisVoice[], language: SupportedLanguage, script: Script): SpeechSynthesisVoice | undefined {
  const locale = LANGUAGES[language].locale.toLowerCase();
  const romanized = script === "latin" && language !== "en";
  let best: { voice: SpeechSynthesisVoice; score: number } | undefined;

  for (const voice of voices) {
    const lang = normalize(voice.lang);
    let score = 0;
    if (romanized) {
      // "Isko rinse kar lo" reads best with an Indian English voice; a native voice is the next best.
      if (lang === "en-in") score = 100;
      else if (lang === locale) score = 70;
      else if (lang.startsWith("en")) score = 40;
    } else if (lang === locale) score = 100;
    else if (lang.split("-")[0] === language) score = 80;
    else if (language === "en" && lang.startsWith("en")) score = 50;

    if (!score) continue;
    if (NATURAL_VOICE.test(voice.name)) score += 8;
    if (best === undefined || score > best.score) best = { voice, score };
  }
  return best?.voice;
}

const RANGE_WORD: Partial<Record<SupportedLanguage, [string, string]>> = {
  en: ["to", "rupees"],
  hi: ["se", "rupaye"],
  pa: ["ton", "rupaye"],
};

/** "₹15–25" is read inconsistently by voices; spell it out for English and romanized speech. */
function toSpeakable(text: string, language: SupportedLanguage, script: Script): string {
  const words = script === "latin" ? RANGE_WORD[language] : undefined;
  if (!words) return text;
  const [to, rupees] = words;
  return text
    .replace(/₹\s?(\d+)\s?[–-]\s?(\d+)/g, `$1 ${to} $2 ${rupees}`)
    .replace(/₹\s?(\d+)/g, `$1 ${rupees}`);
}
