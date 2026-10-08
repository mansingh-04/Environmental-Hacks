export type SupportedLanguage = "en" | "hi" | "pa" | "bn" | "mr" | "gu" | "ta" | "te" | "kn" | "ml" | "or" | "as" | "ur";

/** How the user wrote/spoke: romanized ("Isko recycle kahan karna hai?") or the language's own script. */
export type Script = "latin" | "native";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  locale: string;
  direction: "ltr" | "rtl";
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: { code: "en", name: "English", nativeName: "English", locale: "en-IN", direction: "ltr" },
  hi: { code: "hi", name: "Hindi", nativeName: "हिन्दी", locale: "hi-IN", direction: "ltr" },
  pa: { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", locale: "pa-IN", direction: "ltr" },
  bn: { code: "bn", name: "Bengali", nativeName: "বাংলা", locale: "bn-IN", direction: "ltr" },
  mr: { code: "mr", name: "Marathi", nativeName: "मराठी", locale: "mr-IN", direction: "ltr" },
  gu: { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", locale: "gu-IN", direction: "ltr" },
  ta: { code: "ta", name: "Tamil", nativeName: "தமிழ்", locale: "ta-IN", direction: "ltr" },
  te: { code: "te", name: "Telugu", nativeName: "తెలుగు", locale: "te-IN", direction: "ltr" },
  kn: { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", locale: "kn-IN", direction: "ltr" },
  ml: { code: "ml", name: "Malayalam", nativeName: "മലയാളം", locale: "ml-IN", direction: "ltr" },
  or: { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", locale: "or-IN", direction: "ltr" },
  as: { code: "as", name: "Assamese", nativeName: "অসমীয়া", locale: "as-IN", direction: "ltr" },
  ur: { code: "ur", name: "Urdu", nativeName: "اردو", locale: "ur-IN", direction: "rtl" },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES) as SupportedLanguage[];

/** Romanized Hindi/Punjabi get their own natural code-mixed phrasing; other languages answer in native script. */
export type ResponseStyle = SupportedLanguage | "hi-latn" | "pa-latn";

export function responseStyle(language: SupportedLanguage, script: Script): ResponseStyle {
  if (script === "latin" && (language === "hi" || language === "pa")) return `${language}-latn`;
  return language;
}

/** Only English, Hindi and Punjabi have romanized styles; every other language is answered in its own script. */
export function normalizeScript(language: SupportedLanguage, script: Script): Script {
  if (language === "en") return "latin";
  return language === "hi" || language === "pa" ? script : "native";
}
