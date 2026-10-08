import type { SupportedLanguage } from "@/lib/languages";
import type { LanguageDetectionResult, LanguageDetector } from "./types";

/** Unicode blocks → language. Bengali script is shared by Bengali and Assamese; Devanagari by Hindi and Marathi. */
const SCRIPTS: { range: RegExp; language: SupportedLanguage }[] = [
  { range: /[ऀ-ॿ]/g, language: "hi" },
  { range: /[਀-੿]/g, language: "pa" },
  { range: /[ঀ-৿]/g, language: "bn" },
  { range: /[઀-૿]/g, language: "gu" },
  { range: /[଀-୿]/g, language: "or" },
  { range: /[஀-௿]/g, language: "ta" },
  { range: /[ఀ-౿]/g, language: "te" },
  { range: /[ಀ-೿]/g, language: "kn" },
  { range: /[ഀ-ൿ]/g, language: "ml" },
  { range: /[؀-ۿ]/g, language: "ur" },
];

const MARATHI_MARKERS = ["आहे", "कुठे", "काय", "मला", "किती", "नाही", "करायचं", "द्यायचं", "कसं", "आणि"];
const ASSAMESE_LETTERS = /[ৰৱ]/;

/* Romanized markers. Words shared by both languages (de, ki, ho, kar…) and waste vocabulary
   (recycle, plastic, bottle, rate…) are deliberately excluded — they say nothing about language. */
const HINDI = new Set(
  "isko isse iska iski iske ise isme kahan kaha kahaan kidhar kya kyun kyon kyu hai hain karna karni karun kaise kitna kitne kitni mein yeh ye aur milega milegi milenge dena doon dun sakte sakta sakti nahi nahin wala wali paisa paise batao bataiye bata hoga hogi chahiye ko kaun kab bhi toh daalu dalna phek phenk kachra kooda bechna bech bolo mujhe hum".split(" "),
);
const PUNJABI = new Set(
  "eh ehnu ehnoo isnu inu ehda ehdi ehde kithe kitthe kithon kitthon kidda kiddan sakde sakda sakdi aa tusi tusin tuhanu sanu kina kinna kinne miluga milugi milange dasso daso dass vich nu hun kol laina karaan da vech vechna sutt paana paao".split(" "),
);
const ENGLISH = new Set(
  "where what how can could the this that it i my much worth nearest near does should which why will would me a an of for with sell take get there any please tell you about whats remove before am are".split(" "),
);
const SHARED_INDIC = new Set("karwa karwana karke kar de ho haan na ji".split(" "));

const LANGUAGE_NAMES: [RegExp, SupportedLanguage][] = [
  [/\b(english|angrezi|angreji)\b/i, "en"],
  [/\b(hindi)\b|हिन्दी|हिंदी/i, "hi"],
  [/\b(punjabi|panjabi)\b|ਪੰਜਾਬੀ/i, "pa"],
  [/\b(bengali|bangla)\b|বাংলা/i, "bn"],
  [/\b(marathi)\b|मराठी/i, "mr"],
  [/\b(gujarati)\b|ગુજરાતી/i, "gu"],
  [/\b(tamil)\b|தமிழ்/i, "ta"],
  [/\b(telugu)\b|తెలుగు/i, "te"],
  [/\b(kannada)\b|ಕನ್ನಡ/i, "kn"],
  [/\b(malayalam)\b|മലയാളം/i, "ml"],
  [/\b(odia|oriya)\b|ଓଡ଼ିଆ/i, "or"],
  [/\b(assamese)\b|অসমীয়া/i, "as"],
  [/\b(urdu)\b|اردو/i, "ur"],
];
const REQUEST_CUES = /\b(in|mein|me|vich|ch|language|bolo|bol|dasso|batao|speak|reply|answer|talk)\b|में|ਵਿੱਚ/i;

/**
 * Lightweight on-device detector: script ranges for native scripts, marker words for
 * romanized Hindi/Punjabi/English (including code-mixed speech). Replaceable by a model-based detector.
 */
export class HeuristicLanguageDetector implements LanguageDetector {
  async detect(text: string): Promise<LanguageDetectionResult> {
    return detectNativeScript(text) ?? detectRomanized(text);
  }

  requestedLanguage(text: string): SupportedLanguage | undefined {
    if (!REQUEST_CUES.test(text)) return undefined;
    return LANGUAGE_NAMES.find(([pattern]) => pattern.test(text))?.[1];
  }
}

function detectNativeScript(text: string): LanguageDetectionResult | null {
  const latin = (text.match(/[a-z]/gi) ?? []).length;
  let best: { language: SupportedLanguage; count: number } | null = null;
  for (const { range, language } of SCRIPTS) {
    const count = (text.match(range) ?? []).length;
    if (count > (best?.count ?? 0)) best = { language, count };
  }
  if (!best || best.count < latin) return null;

  let language = best.language;
  if (language === "hi" && MARATHI_MARKERS.some((m) => text.includes(m))) language = "mr";
  if (language === "bn" && ASSAMESE_LETTERS.test(text)) language = "as";

  return {
    language,
    script: "native",
    confidence: best.count >= 4 ? 0.95 : 0.7,
    isCodeMixed: latin > 0,
    secondaryLanguage: latin > 0 ? "en" : undefined,
  };
}

function detectRomanized(text: string): LanguageDetectionResult {
  const tokens = text.toLowerCase().split(/[^a-z']+/).filter(Boolean);
  let hi = 0;
  let pa = 0;
  let en = 0;
  let shared = 0;
  for (const t of tokens) {
    if (HINDI.has(t)) hi++;
    else if (PUNJABI.has(t)) pa++;
    else if (ENGLISH.has(t)) en++;
    else if (SHARED_INDIC.has(t)) shared++;
  }

  const indic = hi + pa;
  if (indic === 0) {
    return { language: "en", script: "latin", confidence: en >= 2 ? 0.9 : en === 1 ? 0.6 : 0.3 };
  }
  if (en > indic + shared && en >= 3) {
    return { language: "en", script: "latin", confidence: 0.7, isCodeMixed: true, secondaryLanguage: pa > hi ? "pa" : "hi" };
  }

  // Punjabi markers are more distinctive than Hindi ones, so a tie leans Punjabi only when both appear.
  const language: SupportedLanguage = pa > hi || (pa === hi && pa > 0 && tokens.some((t) => t === "aa")) ? "pa" : "hi";
  const other = language === "pa" ? hi : pa;
  const mixedIndic = other > 0;
  const confidence = Math.min(0.95, 0.45 + 0.15 * (indic + shared)) - (mixedIndic && Math.abs(hi - pa) <= 1 ? 0.1 : 0);

  return {
    language,
    script: "latin",
    confidence,
    isCodeMixed: mixedIndic || en > 0,
    secondaryLanguage: mixedIndic ? (language === "pa" ? "hi" : "pa") : en > 0 ? "en" : undefined,
  };
}
