export type Intent = "prepare" | "value" | "where" | "harm" | "recycle" | "confidence" | "fallback";

/**
 * Cue words per intent across English, romanized Hindi/Punjabi and native scripts.
 * Substring match (lower-cased), so stems like "recycl" or "pollut" cover variants.
 * Order matters: the first matching intent wins.
 */
const CUES: [Intent, string[]][] = [
  [
    "prepare",
    ["remove", "before", "prepare", "clean", "wash", "rinse", "cap", "label", "tape", "saaf", "dho", "hata", "nikaal", "साफ", "धो", "हटा", "ਸਾਫ", "ਧੋ", "ধু", "धुव", "ધો", "கழுவ", "కడగ", "ತೊಳೆ", "കഴുക", "ଧୋ", "دھو"],
  ],
  [
    "where",
    ["where", "take", "drop", "near", "recycler", "dealer", "centre", "center", "location", "kahan", "kaha", "kidhar", "kithe", "kitthe", "kithon", "kol", "कहाँ", "कहां", "कुठे", "ਕਿੱਥੇ", "ਕਿਥੇ", "ਕਿੱਥੋਂ", "কোথায়", "ক'ত", "ક્યાં", "எங்கே", "எங்க", "ఎక్కడ", "ಎಲ್ಲಿ", "എവിടെ", "କେଉଁଠି", "کہاں"],
  ],
  [
    "value",
    ["worth", "much", "price", "value", "money", "earn", "sell", "pay", "cash", "₹", "rupee", "rate", "kitna", "kitne", "paisa", "paise", "kina", "kinne", "milega", "miluga", "daam", "bhav", "vech", "bech", "कितन", "पैस", "दाम", "रेट", "किंमत", "किती", "भाव", "ਕਿੰਨ", "ਪੈਸ", "ਰੇਟ", "দাম", "কত", "কিমান", "કિંમત", "કેટલા", "ભાવ", "விலை", "எவ்வளவு", "ரேட்", "ధర", "ఎంత", "రేటు", "ಬೆಲೆ", "ಎಷ್ಟು", "ರೇಟ್", "വില", "എത്ര", "ଦାମ", "କେତେ", "قیمت", "کتن", "ریٹ"],
  ],
  [
    "harm",
    ["harm", "why", "bad", "environment", "impact", "pollut", "danger", "toxic", "kyun", "kyon", "kyu", "nuksan", "nuksaan", "kharab", "kiun", "क्यों", "नुकसान", "ਕਿਉਂ", "ਨੁਕਸਾਨ", "কেন", "ক্ষতি", "কিয়", "કેમ", "નુકસાન", "ஏன்", "தீங்கு", "ఎందుకు", "హాని", "ಏಕೆ", "ಹಾನಿ", "എന്തുകൊണ്ട്", "ദോഷ", "କାହିଁକି", "କ୍ଷତି", "کیوں", "نقصان"],
  ],
  [
    "recycle",
    ["recycl", "bin", "throw", "dispose", "trash", "garbage", "dustbin", "e-waste", "dena", "daal", "paana", "paa do", "what do", "what should", "kya karu", "kya karun", "kya karna", "ki karaan", "ki karna", "क्या करूँ", "क्या करना", "kachra", "kooda", "koode", "phek", "phenk", "sutt", "रीसायकल", "रिसायकल", "कचरा", "फेंक", "ਰੀਸਾਈਕਲ", "ਕੂੜ", "রিসাইকেল", "ৰিচাইকেল", "રિસાયકલ", "ரீசைக்கிள்", "రీసైకిల్", "ರೀಸೈಕಲ್", "റീസൈക്കിൾ", "ରିସାଇକେଲ", "ری سائیکل"],
  ],
  ["confidence", ["sure", "confiden", "accurate", "what is this", "what's this", "pakka", "sach", "पक्का", "ਪੱਕਾ"]],
];

export function detectIntent(question: string): Intent {
  const q = ` ${question.toLowerCase()} `;
  return CUES.find(([, words]) => words.some((w) => q.includes(w)))?.[0] ?? "fallback";
}
