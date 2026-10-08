import type { ResponseStyle } from "@/lib/languages";
import type { Verdict, WasteCategory } from "@/types/waste";

/**
 * Short, spoken-style phrasing per language. Everyday loanwords (recycle, plastic, scrap, e-waste,
 * km) are kept as people actually say them — naturalness over linguistic purity.
 * Facts (prices, distances, names) are always injected from structured data, never written here.
 */
export interface Phrasebook {
  its: (item: string) => string;
  action: Record<WasteCategory, string>;
  verdict: Record<Verdict, string>;
  value: (range: string, unit: string) => string;
  noValue: string;
  earn: string;
  nearest: (name: string, km: number) => string;
  needLocation: string;
  harm: string;
  toxicHarm: string;
  confidence: (item: string, pct: number) => string;
  fallback: (item: string) => string;
}

const withArticle = (item: string) => `${/^[aeiou]/i.test(item) ? "an" : "a"} ${item}`;

export const PHRASEBOOK: Record<ResponseStyle, Phrasebook> = {
  en: {
    its: (item) => `This is ${withArticle(item)}.`,
    action: {
      plastic: "Empty it, give it a quick rinse, then put it in dry waste or sell it to a scrap dealer.",
      paper: "Flatten it, keep it dry, and give it to a scrap dealer or dry-waste collection.",
      metal: "Empty and rinse it, then sell it to a scrap dealer — cans get a good rate.",
      glass: "Empty and rinse it, keep it unbroken, and give it to a scrap dealer or glass collection point.",
      "e-waste": "Don't put it in the dustbin — take it to an e-waste collection point.",
      hazardous: "Never put it in the dustbin. Tape the terminals and drop it in a battery collection box.",
    },
    verdict: {
      recycle: "Yes, this can be recycled.",
      special: "Yes, but only at an e-waste centre.",
      hazardous: "This is hazardous waste, so keep it out of normal bins.",
    },
    value: (range, unit) => `It's worth roughly ${range} ${unit}, depending on the dealer.`,
    noValue: "It has no resale value, but dropping it off is free.",
    earn: "Collect a few and sell them together to a kabadiwala.",
    nearest: (name, km) => `The nearest one is ${name}, about ${km} km away.`,
    needLocation: "Allow location on the result screen and the nearest recycler will show up.",
    harm: "In mixed waste it just becomes pollution; sorted properly, the material gets used again.",
    toxicHarm: "Dumped, it can leak toxic chemicals or even catch fire. Handled properly, the metals inside are recovered safely.",
    confidence: (item, pct) => `I'm about ${pct}% sure this is ${withArticle(item)}. If not, tap "Not this item?".`,
    fallback: (item) => `Ask me how to dispose of this ${item}, what it's worth, or where to take it.`,
  },

  "hi-latn": {
    its: (item) => `Ye ${item} hai.`,
    action: {
      plastic: "Isko khaali karke halka rinse kar lo, phir dry waste mein daalo ya kabadiwale ko bech do.",
      paper: "Isko flat karke sookha rakho, phir kabadiwale ya dry waste collection ko de do.",
      metal: "Isko khaali karke rinse kar lo, phir kabadiwale ko bech do — cans ka rate accha milta hai.",
      glass: "Isko khaali karke rinse kar lo, todna mat, aur kabadiwale ya glass collection point pe de do.",
      "e-waste": "Isko dustbin mein mat daalo, e-waste collection point pe de do.",
      hazardous: "Isko dustbin mein bilkul mat daalo. Terminals pe tape lagao aur battery collection box mein daal do.",
    },
    verdict: {
      recycle: "Haan, ye recycle ho sakta hai.",
      special: "Haan, par sirf e-waste centre pe.",
      hazardous: "Ye hazardous waste hai, normal dustbin mein mat daalna.",
    },
    value: (range, unit) => `Iska estimated rate ${range} ${unit} ke around hai, dealer pe depend karta hai.`,
    noValue: "Iski koi resale value nahi hai, par drop-off free hai.",
    earn: "Thode jama karke kabadiwale ko ek saath bech do.",
    nearest: (name, km) => `Sabse paas ${name} hai, lagbhag ${km} km door.`,
    needLocation: "Result screen pe location allow karo, phir nearest recycler dikh jaayega.",
    harm: "Mixed kachre mein jaake ye bas pollution banta hai; sahi se alag karoge to ye material dobara use hota hai.",
    toxicHarm: "Kachre mein phenkne se isse toxic chemicals leak ho sakte hain, aag bhi lag sakti hai. Sahi jagah doge to andar ke metals safely nikal jaate hain.",
    confidence: (item, pct) => `Lagta hai ye ${item} hai, around ${pct}% sure. Galat ho to "Not this item?" dabao.`,
    fallback: (item) => `Is ${item} ke baare mein poochho — kaise dispose karna hai, kitne ka bikega, ya kahan dena hai.`,
  },

  hi: {
    its: (item) => `ये ${item} है।`,
    action: {
      plastic: "इसे खाली करके हल्का सा धो लो, फिर ड्राई वेस्ट में डालो या कबाड़ीवाले को बेच दो।",
      paper: "इसे फ्लैट करके सूखा रखो, फिर कबाड़ीवाले या ड्राई वेस्ट कलेक्शन को दे दो।",
      metal: "इसे खाली करके धो लो, फिर कबाड़ीवाले को बेच दो — कैन का रेट अच्छा मिलता है।",
      glass: "इसे खाली करके धो लो, तोड़ना मत, और कबाड़ीवाले या ग्लास कलेक्शन पॉइंट पर दे दो।",
      "e-waste": "इसे डस्टबिन में मत डालो, ई-वेस्ट कलेक्शन पॉइंट पर दे दो।",
      hazardous: "इसे डस्टबिन में बिल्कुल मत डालो। टर्मिनल पर टेप लगाओ और बैटरी कलेक्शन बॉक्स में डाल दो।",
    },
    verdict: {
      recycle: "हाँ, ये रीसायकल हो सकता है।",
      special: "हाँ, पर सिर्फ़ ई-वेस्ट सेंटर पर।",
      hazardous: "ये ख़तरनाक कचरा है, नॉर्मल डस्टबिन में मत डालना।",
    },
    value: (range, unit) => `इसका अंदाज़न रेट ${range} ${unit} के आसपास है, डीलर पर निर्भर करता है।`,
    noValue: "इसकी कोई रीसेल वैल्यू नहीं है, पर जमा करना फ़्री है।",
    earn: "थोड़े जमा करके कबाड़ीवाले को एक साथ बेच दो।",
    nearest: (name, km) => `सबसे पास ${name} है, लगभग ${km} किलोमीटर दूर।`,
    needLocation: "रिज़ल्ट स्क्रीन पर लोकेशन की इजाज़त दो, फिर सबसे पास का रीसाइक्लर दिख जाएगा।",
    harm: "मिले-जुले कचरे में जाकर ये बस प्रदूषण बनता है; सही से अलग करोगे तो ये मटीरियल फिर से इस्तेमाल होता है।",
    toxicHarm: "कचरे में फेंकने से इससे ज़हरीले केमिकल रिस सकते हैं, आग भी लग सकती है। सही जगह दोगे तो अंदर के मेटल सुरक्षित निकाल लिए जाते हैं।",
    confidence: (item, pct) => `लगता है ये ${item} है, करीब ${pct}% पक्का। गलत हो तो "Not this item?" दबाओ।`,
    fallback: (item) => `इस ${item} के बारे में पूछो — कैसे फेंकना है, कितने का बिकेगा, या कहाँ देना है।`,
  },

  "pa-latn": {
    its: (item) => `Eh ${item} aa.`,
    action: {
      plastic: "Ehnu khaali karke thoda rinse kar lo, phir dry waste vich paa do ja kabaadi nu vech do.",
      paper: "Ehnu flat karke sukka rakho, phir kabaadi ja dry waste collection nu de do.",
      metal: "Ehnu khaali karke rinse kar lo, phir kabaadi nu vech do — cans da rate changa milda aa.",
      glass: "Ehnu khaali karke rinse kar lo, todna nahi, te kabaadi ja glass collection point te de do.",
      "e-waste": "Ehnu dustbin vich na paao, e-waste collection point te de do.",
      hazardous: "Ehnu dustbin vich bilkul na paao. Terminals te tape la ke battery collection box vich paa do.",
    },
    verdict: {
      recycle: "Haan ji, eh recycle ho sakda aa.",
      special: "Haan, par sirf e-waste centre te.",
      hazardous: "Eh hazardous waste aa, normal dustbin vich na paana.",
    },
    value: (range, unit) => `Ehda estimated rate ${range} ${unit} de kareeb aa, dealer te depend karda.`,
    noValue: "Ehdi koi resale value nahi, par drop-off free aa.",
    earn: "Thode ikathe karke kabaadi nu ikko vaari vech do.",
    nearest: (name, km) => `Sab ton nede ${name} aa, lagbhag ${km} km door.`,
    needLocation: "Result screen te location allow karo, phir nearest recycler dikh jaavega.",
    harm: "Mixed koode vich ja ke eh bas pollution banda aa; sahi tareeke naal vakh karoge taan eh material dobara vart hunda aa.",
    toxicHarm: "Koode vich sutteyan ehde ton toxic chemicals leak ho sakde ne, agg vi lag sakdi aa. Sahi jagah dooge taan andar de metals safely kadd laye jaande ne.",
    confidence: (item, pct) => `Lagda eh ${item} aa, kareeb ${pct}% pakka. Galat hove taan "Not this item?" dabao.`,
    fallback: (item) => `Is ${item} baare puchho — kiven dispose karna, kinne da vikuga, ja kithe dena.`,
  },

  pa: {
    its: (item) => `ਇਹ ${item} ਹੈ।`,
    action: {
      plastic: "ਇਹਨੂੰ ਖਾਲੀ ਕਰਕੇ ਥੋੜ੍ਹਾ ਧੋ ਲਓ, ਫਿਰ ਡਰਾਈ ਵੇਸਟ ਵਿੱਚ ਪਾ ਦਿਓ ਜਾਂ ਕਬਾੜੀ ਨੂੰ ਵੇਚ ਦਿਓ।",
      paper: "ਇਹਨੂੰ ਫਲੈਟ ਕਰਕੇ ਸੁੱਕਾ ਰੱਖੋ, ਫਿਰ ਕਬਾੜੀ ਜਾਂ ਡਰਾਈ ਵੇਸਟ ਕਲੈਕਸ਼ਨ ਨੂੰ ਦੇ ਦਿਓ।",
      metal: "ਇਹਨੂੰ ਖਾਲੀ ਕਰਕੇ ਧੋ ਲਓ, ਫਿਰ ਕਬਾੜੀ ਨੂੰ ਵੇਚ ਦਿਓ — ਕੈਨ ਦਾ ਰੇਟ ਚੰਗਾ ਮਿਲਦਾ ਹੈ।",
      glass: "ਇਹਨੂੰ ਖਾਲੀ ਕਰਕੇ ਧੋ ਲਓ, ਤੋੜਨਾ ਨਹੀਂ, ਤੇ ਕਬਾੜੀ ਜਾਂ ਗਲਾਸ ਕਲੈਕਸ਼ਨ ਪੁਆਇੰਟ ਤੇ ਦੇ ਦਿਓ।",
      "e-waste": "ਇਹਨੂੰ ਡਸਟਬਿਨ ਵਿੱਚ ਨਾ ਪਾਓ, ਈ-ਵੇਸਟ ਕਲੈਕਸ਼ਨ ਪੁਆਇੰਟ ਤੇ ਦੇ ਦਿਓ।",
      hazardous: "ਇਹਨੂੰ ਡਸਟਬਿਨ ਵਿੱਚ ਬਿਲਕੁਲ ਨਾ ਪਾਓ। ਟਰਮੀਨਲਾਂ ਤੇ ਟੇਪ ਲਾ ਕੇ ਬੈਟਰੀ ਕਲੈਕਸ਼ਨ ਬਾਕਸ ਵਿੱਚ ਪਾ ਦਿਓ।",
    },
    verdict: {
      recycle: "ਹਾਂ ਜੀ, ਇਹ ਰੀਸਾਈਕਲ ਹੋ ਸਕਦਾ ਹੈ।",
      special: "ਹਾਂ, ਪਰ ਸਿਰਫ਼ ਈ-ਵੇਸਟ ਸੈਂਟਰ ਤੇ।",
      hazardous: "ਇਹ ਖ਼ਤਰਨਾਕ ਕੂੜਾ ਹੈ, ਆਮ ਡਸਟਬਿਨ ਵਿੱਚ ਨਾ ਪਾਓ।",
    },
    value: (range, unit) => `ਇਹਦਾ ਅੰਦਾਜ਼ਨ ਰੇਟ ${range} ${unit} ਦੇ ਕਰੀਬ ਹੈ, ਡੀਲਰ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।`,
    noValue: "ਇਹਦੀ ਕੋਈ ਰੀਸੇਲ ਵੈਲਿਊ ਨਹੀਂ, ਪਰ ਜਮ੍ਹਾਂ ਕਰਾਉਣਾ ਮੁਫ਼ਤ ਹੈ।",
    earn: "ਥੋੜ੍ਹੇ ਇਕੱਠੇ ਕਰਕੇ ਕਬਾੜੀ ਨੂੰ ਇੱਕੋ ਵਾਰੀ ਵੇਚ ਦਿਓ।",
    nearest: (name, km) => `ਸਭ ਤੋਂ ਨੇੜੇ ${name} ਹੈ, ਲਗਭਗ ${km} ਕਿਲੋਮੀਟਰ ਦੂਰ।`,
    needLocation: "ਰਿਜ਼ਲਟ ਸਕ੍ਰੀਨ ਤੇ ਲੋਕੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ, ਫਿਰ ਸਭ ਤੋਂ ਨੇੜੇ ਦਾ ਰੀਸਾਈਕਲਰ ਦਿਖ ਜਾਵੇਗਾ।",
    harm: "ਰਲੇ-ਮਿਲੇ ਕੂੜੇ ਵਿੱਚ ਜਾ ਕੇ ਇਹ ਬੱਸ ਪ੍ਰਦੂਸ਼ਣ ਬਣਦਾ ਹੈ; ਸਹੀ ਤਰੀਕੇ ਨਾਲ ਵੱਖ ਕਰੋਗੇ ਤਾਂ ਇਹ ਮਟੀਰੀਅਲ ਦੁਬਾਰਾ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
    toxicHarm: "ਕੂੜੇ ਵਿੱਚ ਸੁੱਟਣ ਨਾਲ ਇਹਦੇ ਵਿੱਚੋਂ ਜ਼ਹਿਰੀਲੇ ਕੈਮੀਕਲ ਨਿਕਲ ਸਕਦੇ ਹਨ, ਅੱਗ ਵੀ ਲੱਗ ਸਕਦੀ ਹੈ। ਸਹੀ ਜਗ੍ਹਾ ਦਿਓਗੇ ਤਾਂ ਅੰਦਰਲੀਆਂ ਧਾਤਾਂ ਸੁਰੱਖਿਅਤ ਕੱਢ ਲਈਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
    confidence: (item, pct) => `ਲੱਗਦਾ ਹੈ ਇਹ ${item} ਹੈ, ਕਰੀਬ ${pct}% ਪੱਕਾ। ਗ਼ਲਤ ਹੋਵੇ ਤਾਂ "Not this item?" ਦਬਾਓ।`,
    fallback: (item) => `ਇਸ ${item} ਬਾਰੇ ਪੁੱਛੋ — ਕਿਵੇਂ ਸੁੱਟਣਾ ਹੈ, ਕਿੰਨੇ ਦਾ ਵਿਕੇਗਾ, ਜਾਂ ਕਿੱਥੇ ਦੇਣਾ ਹੈ।`,
  },

  bn: {
    its: (item) => `এটা একটা ${item}।`,
    action: {
      plastic: "খালি করে একটু ধুয়ে নিন, তারপর ড্রাই ওয়েস্টে দিন বা কাবাড়িওয়ালাকে বিক্রি করুন।",
      paper: "চ্যাপ্টা করে শুকনো রাখুন, তারপর কাবাড়িওয়ালাকে দিন।",
      metal: "খালি করে ধুয়ে নিন, তারপর কাবাড়িওয়ালাকে বিক্রি করুন — ক্যানের দাম ভালো পাওয়া যায়।",
      glass: "খালি করে ধুয়ে নিন, ভাঙবেন না, তারপর কাবাড়িওয়ালা বা গ্লাস কালেকশন পয়েন্টে দিন।",
      "e-waste": "ডাস্টবিনে ফেলবেন না, ই-ওয়েস্ট কালেকশন পয়েন্টে দিন।",
      hazardous: "কখনও ডাস্টবিনে ফেলবেন না। টার্মিনালে টেপ লাগিয়ে ব্যাটারি কালেকশন বক্সে দিন।",
    },
    verdict: {
      recycle: "হ্যাঁ, এটা রিসাইকেল করা যায়।",
      special: "হ্যাঁ, তবে শুধু ই-ওয়েস্ট সেন্টারে।",
      hazardous: "এটা বিপজ্জনক বর্জ্য, সাধারণ ডাস্টবিনে ফেলবেন না।",
    },
    value: (range, unit) => `এর আনুমানিক দাম ${range} ${unit}, ডিলারের উপর নির্ভর করে।`,
    noValue: "এর কোনো রিসেল ভ্যালু নেই, তবে জমা দেওয়া ফ্রি।",
    earn: "কয়েকটা জমিয়ে একসাথে কাবাড়িওয়ালাকে বিক্রি করুন।",
    nearest: (name, km) => `সবচেয়ে কাছে ${name}, প্রায় ${km} কিলোমিটার দূরে।`,
    needLocation: "রেজাল্ট স্ক্রিনে লোকেশনের অনুমতি দিন, তাহলে কাছের রিসাইক্লার দেখা যাবে।",
    harm: "মিশ্র আবর্জনায় গেলে এটা শুধু দূষণ বাড়ায়; ঠিকভাবে আলাদা করলে এই উপাদান আবার ব্যবহার হয়।",
    toxicHarm: "ফেলে দিলে এর থেকে বিষাক্ত কেমিক্যাল বেরোতে পারে, আগুনও লাগতে পারে। ঠিক জায়গায় দিলে ভেতরের ধাতু নিরাপদে বের করা হয়।",
    confidence: (item, pct) => `মনে হচ্ছে এটা ${item}, প্রায় ${pct}% নিশ্চিত। ভুল হলে "Not this item?" চাপুন।`,
    fallback: (item) => `এই ${item} নিয়ে জিজ্ঞেস করুন — কীভাবে ফেলবেন, কত দাম পাবেন, বা কোথায় দেবেন।`,
  },

  mr: {
    its: (item) => `हे ${item} आहे.`,
    action: {
      plastic: "रिकामं करून थोडं धुवून घ्या, मग सुक्या कचऱ्यात टाका किंवा भंगारवाल्याला विका.",
      paper: "सपाट करून कोरडं ठेवा, मग भंगारवाल्याला द्या.",
      metal: "रिकामं करून धुवून घ्या, मग भंगारवाल्याला विका — कॅनला चांगला भाव मिळतो.",
      glass: "रिकामं करून धुवून घ्या, फोडू नका, आणि भंगारवाल्याला किंवा ग्लास कलेक्शन पॉइंटला द्या.",
      "e-waste": "डस्टबिनमध्ये टाकू नका, ई-वेस्ट कलेक्शन पॉइंटला द्या.",
      hazardous: "डस्टबिनमध्ये अजिबात टाकू नका. टर्मिनलला टेप लावा आणि बॅटरी कलेक्शन बॉक्समध्ये टाका.",
    },
    verdict: {
      recycle: "हो, हे रिसायकल होऊ शकतं.",
      special: "हो, पण फक्त ई-वेस्ट सेंटरला.",
      hazardous: "हा धोकादायक कचरा आहे, नेहमीच्या डस्टबिनमध्ये टाकू नका.",
    },
    value: (range, unit) => `याचा अंदाजे भाव ${range} ${unit} आहे, डीलरवर अवलंबून.`,
    noValue: "याला रिसेल किंमत नाही, पण जमा करणं मोफत आहे.",
    earn: "थोडे जमवून एकदम भंगारवाल्याला विका.",
    nearest: (name, km) => `सगळ्यात जवळ ${name} आहे, साधारण ${km} किलोमीटर अंतरावर.`,
    needLocation: "रिझल्ट स्क्रीनवर लोकेशनची परवानगी द्या, मग जवळचा रिसायकलर दिसेल.",
    harm: "मिश्र कचऱ्यात गेलं तर फक्त प्रदूषण होतं; नीट वेगळं केलं तर हे मटेरियल पुन्हा वापरलं जातं.",
    toxicHarm: "कचऱ्यात टाकलं तर यातून विषारी केमिकल्स गळू शकतात, आगही लागू शकते. योग्य ठिकाणी दिलं तर आतले धातू सुरक्षितपणे काढले जातात.",
    confidence: (item, pct) => `हे ${item} वाटतंय, साधारण ${pct}% खात्री. चुकीचं असेल तर "Not this item?" दाबा.`,
    fallback: (item) => `या ${item} बद्दल विचारा — कसं टाकायचं, किती किंमत मिळेल, किंवा कुठे द्यायचं.`,
  },

  gu: {
    its: (item) => `આ ${item} છે.`,
    action: {
      plastic: "ખાલી કરીને થોડું ધોઈ લો, પછી સૂકા કચરામાં નાખો અથવા ભંગારવાળાને વેચી દો.",
      paper: "ચપટું કરીને સૂકું રાખો, પછી ભંગારવાળાને આપી દો.",
      metal: "ખાલી કરીને ધોઈ લો, પછી ભંગારવાળાને વેચી દો — કેનનો ભાવ સારો મળે છે.",
      glass: "ખાલી કરીને ધોઈ લો, તોડશો નહીં, અને ભંગારવાળા કે ગ્લાસ કલેક્શન પોઈન્ટ પર આપો.",
      "e-waste": "ડસ્ટબિનમાં ન નાખો, ઈ-વેસ્ટ કલેક્શન પોઈન્ટ પર આપો.",
      hazardous: "ડસ્ટબિનમાં બિલકુલ ન નાખો. ટર્મિનલ પર ટેપ લગાવીને બેટરી કલેક્શન બોક્સમાં નાખો.",
    },
    verdict: {
      recycle: "હા, આ રિસાયકલ થઈ શકે છે.",
      special: "હા, પણ ફક્ત ઈ-વેસ્ટ સેન્ટર પર.",
      hazardous: "આ જોખમી કચરો છે, સામાન્ય ડસ્ટબિનમાં ન નાખો.",
    },
    value: (range, unit) => `આનો અંદાજિત ભાવ ${range} ${unit} છે, ડીલર પર આધાર રાખે છે.`,
    noValue: "આની કોઈ રીસેલ કિંમત નથી, પણ જમા કરાવવું મફત છે.",
    earn: "થોડા ભેગા કરીને એકસાથે ભંગારવાળાને વેચો.",
    nearest: (name, km) => `સૌથી નજીક ${name} છે, લગભગ ${km} કિલોમીટર દૂર.`,
    needLocation: "રિઝલ્ટ સ્ક્રીન પર લોકેશનની પરવાનગી આપો, પછી નજીકનો રિસાયકલર દેખાશે.",
    harm: "મિશ્ર કચરામાં જાય તો ફક્ત પ્રદૂષણ થાય છે; બરાબર અલગ કરો તો આ મટીરિયલ ફરી વપરાય છે.",
    toxicHarm: "ફેંકી દો તો આમાંથી ઝેરી કેમિકલ નીકળી શકે છે, આગ પણ લાગી શકે છે. યોગ્ય જગ્યાએ આપો તો અંદરની ધાતુ સુરક્ષિત રીતે કાઢી લેવાય છે.",
    confidence: (item, pct) => `આ ${item} લાગે છે, લગભગ ${pct}% ખાતરી. ખોટું હોય તો "Not this item?" દબાવો.`,
    fallback: (item) => `આ ${item} વિશે પૂછો — કેવી રીતે ફેંકવું, કેટલા મળશે, કે ક્યાં આપવું.`,
  },

  ta: {
    its: (item) => `இது ஒரு ${item}.`,
    action: {
      plastic: "காலி செய்து லேசாக கழுவுங்க, பிறகு உலர் குப்பையில போடுங்க அல்லது பழைய பொருள் கடையில விற்றுடுங்க.",
      paper: "தட்டையாக்கி காய்ந்த நிலையில வைங்க, பிறகு பழைய பொருள் கடையில கொடுங்க.",
      metal: "காலி செய்து கழுவுங்க, பிறகு பழைய பொருள் கடையில விற்றுடுங்க — கேனுக்கு நல்ல ரேட் கிடைக்கும்.",
      glass: "காலி செய்து கழுவுங்க, உடைக்காதீங்க, பழைய பொருள் கடை அல்லது கிளாஸ் கலெக்ஷன் பாயிண்ட்ல கொடுங்க.",
      "e-waste": "குப்பைத் தொட்டியில போடாதீங்க, இ-வேஸ்ட் கலெக்ஷன் பாயிண்ட்ல கொடுங்க.",
      hazardous: "குப்பைத் தொட்டியில போடவே கூடாது. டெர்மினல்ல டேப் ஒட்டி பேட்டரி கலெக்ஷன் பாக்ஸ்ல போடுங்க.",
    },
    verdict: {
      recycle: "ஆமா, இதை ரீசைக்கிள் பண்ணலாம்.",
      special: "ஆமா, ஆனா இ-வேஸ்ட் சென்டர்ல மட்டும்.",
      hazardous: "இது ஆபத்தான குப்பை, சாதாரண தொட்டியில போடாதீங்க.",
    },
    value: (range, unit) => `இதோட தோராயமான விலை ${range} ${unit}, கடையைப் பொறுத்து மாறும்.`,
    noValue: "இதுக்கு மறுவிற்பனை மதிப்பு இல்லை, ஆனா கொடுக்க கட்டணம் இல்லை.",
    earn: "கொஞ்சம் சேர்த்து ஒரே நேரத்துல பழைய பொருள் கடையில விற்றுடுங்க.",
    nearest: (name, km) => `பக்கத்துல ${name} இருக்கு, சுமார் ${km} கிலோமீட்டர் தூரம்.`,
    needLocation: "ரிசல்ட் ஸ்கிரீன்ல லொகேஷன் அனுமதி கொடுங்க, பக்கத்து ரீசைக்ளர் தெரியும்.",
    harm: "கலப்பு குப்பையில போனா மாசு தான் ஆகும்; சரியா பிரிச்சா இந்த பொருள் மறுபடியும் பயன்படும்.",
    toxicHarm: "குப்பையில போட்டா இதுல இருந்து நச்சு கெமிக்கல் கசியலாம், தீ கூட பிடிக்கலாம். சரியான இடத்துல கொடுத்தா உள்ள இருக்குற உலோகங்கள் பாதுகாப்பா எடுக்கப்படும்.",
    confidence: (item, pct) => `இது ${item} மாதிரி தெரியுது, சுமார் ${pct}% உறுதி. தவறுன்னா "Not this item?" அழுத்துங்க.`,
    fallback: (item) => `இந்த ${item} பத்தி கேளுங்க — எப்படி அப்புறப்படுத்தணும், எவ்வளவு கிடைக்கும், எங்க கொடுக்கணும்.`,
  },

  te: {
    its: (item) => `ఇది ${item}.`,
    action: {
      plastic: "ఖాళీ చేసి కొంచెం కడగండి, తర్వాత పొడి చెత్తలో వేయండి లేదా పాత సామాన్ల వ్యాపారికి అమ్మేయండి.",
      paper: "చదునుగా చేసి పొడిగా ఉంచండి, తర్వాత పాత సామాన్ల వ్యాపారికి ఇవ్వండి.",
      metal: "ఖాళీ చేసి కడగండి, తర్వాత పాత సామాన్ల వ్యాపారికి అమ్మేయండి — క్యాన్లకు మంచి రేటు వస్తుంది.",
      glass: "ఖాళీ చేసి కడగండి, పగలగొట్టకండి, పాత సామాన్ల వ్యాపారికి లేదా గ్లాస్ కలెక్షన్ పాయింట్‌కి ఇవ్వండి.",
      "e-waste": "డస్ట్‌బిన్‌లో వేయకండి, ఇ-వేస్ట్ కలెక్షన్ పాయింట్‌కి ఇవ్వండి.",
      hazardous: "డస్ట్‌బిన్‌లో అస్సలు వేయకండి. టెర్మినల్స్‌కి టేప్ వేసి బ్యాటరీ కలెక్షన్ బాక్స్‌లో వేయండి.",
    },
    verdict: {
      recycle: "అవును, దీన్ని రీసైకిల్ చేయొచ్చు.",
      special: "అవును, కానీ ఇ-వేస్ట్ సెంటర్‌లో మాత్రమే.",
      hazardous: "ఇది ప్రమాదకరమైన చెత్త, మామూలు డస్ట్‌బిన్‌లో వేయకండి.",
    },
    value: (range, unit) => `దీని అంచనా రేటు ${range} ${unit}, వ్యాపారిని బట్టి మారుతుంది.`,
    noValue: "దీనికి రీసేల్ విలువ లేదు, కానీ ఇవ్వడం ఉచితం.",
    earn: "కొన్ని పోగుచేసి ఒకేసారి అమ్మేయండి.",
    nearest: (name, km) => `దగ్గరలో ${name} ఉంది, సుమారు ${km} కిలోమీటర్ల దూరంలో.`,
    needLocation: "రిజల్ట్ స్క్రీన్‌లో లొకేషన్‌కి అనుమతి ఇవ్వండి, దగ్గర్లోని రీసైక్లర్ కనిపిస్తుంది.",
    harm: "కలగలిపిన చెత్తలో పోతే కాలుష్యమే; సరిగ్గా వేరు చేస్తే ఈ పదార్థం మళ్లీ వాడుకలోకి వస్తుంది.",
    toxicHarm: "చెత్తలో పడేస్తే దీని నుంచి విషపూరిత రసాయనాలు లీక్ కావచ్చు, మంటలు కూడా రావచ్చు. సరైన చోట ఇస్తే లోపలి లోహాలు సురక్షితంగా తీస్తారు.",
    confidence: (item, pct) => `ఇది ${item} లా ఉంది, సుమారు ${pct}% ఖచ్చితంగా. తప్పైతే "Not this item?" నొక్కండి.`,
    fallback: (item) => `ఈ ${item} గురించి అడగండి — ఎలా పారేయాలి, ఎంత వస్తుంది, ఎక్కడ ఇవ్వాలి.`,
  },

  kn: {
    its: (item) => `ಇದು ${item}.`,
    action: {
      plastic: "ಖಾಲಿ ಮಾಡಿ ಸ್ವಲ್ಪ ತೊಳೆಯಿರಿ, ನಂತರ ಒಣ ಕಸಕ್ಕೆ ಹಾಕಿ ಅಥವಾ ಗುಜರಿಯವರಿಗೆ ಮಾರಿ.",
      paper: "ಚಪ್ಪಟೆ ಮಾಡಿ ಒಣಗಿರುವಂತೆ ಇಡಿ, ನಂತರ ಗುಜರಿಯವರಿಗೆ ಕೊಡಿ.",
      metal: "ಖಾಲಿ ಮಾಡಿ ತೊಳೆಯಿರಿ, ನಂತರ ಗುಜರಿಯವರಿಗೆ ಮಾರಿ — ಕ್ಯಾನ್‌ಗೆ ಒಳ್ಳೆ ರೇಟ್ ಸಿಗುತ್ತೆ.",
      glass: "ಖಾಲಿ ಮಾಡಿ ತೊಳೆಯಿರಿ, ಒಡೆಯಬೇಡಿ, ಗುಜರಿಯವರಿಗೆ ಅಥವಾ ಗ್ಲಾಸ್ ಕಲೆಕ್ಷನ್ ಪಾಯಿಂಟ್‌ಗೆ ಕೊಡಿ.",
      "e-waste": "ಡಸ್ಟ್‌ಬಿನ್‌ಗೆ ಹಾಕಬೇಡಿ, ಇ-ವೇಸ್ಟ್ ಕಲೆಕ್ಷನ್ ಪಾಯಿಂಟ್‌ಗೆ ಕೊಡಿ.",
      hazardous: "ಡಸ್ಟ್‌ಬಿನ್‌ಗೆ ಯಾವತ್ತೂ ಹಾಕಬೇಡಿ. ಟರ್ಮಿನಲ್‌ಗಳಿಗೆ ಟೇಪ್ ಹಾಕಿ ಬ್ಯಾಟರಿ ಕಲೆಕ್ಷನ್ ಬಾಕ್ಸ್‌ಗೆ ಹಾಕಿ.",
    },
    verdict: {
      recycle: "ಹೌದು, ಇದನ್ನು ರೀಸೈಕಲ್ ಮಾಡಬಹುದು.",
      special: "ಹೌದು, ಆದರೆ ಇ-ವೇಸ್ಟ್ ಸೆಂಟರ್‌ನಲ್ಲಿ ಮಾತ್ರ.",
      hazardous: "ಇದು ಅಪಾಯಕಾರಿ ಕಸ, ಸಾಮಾನ್ಯ ಡಸ್ಟ್‌ಬಿನ್‌ಗೆ ಹಾಕಬೇಡಿ.",
    },
    value: (range, unit) => `ಇದರ ಅಂದಾಜು ರೇಟ್ ${range} ${unit}, ಅಂಗಡಿಯ ಮೇಲೆ ಅವಲಂಬಿತ.`,
    noValue: "ಇದಕ್ಕೆ ಮರುಮಾರಾಟ ಬೆಲೆ ಇಲ್ಲ, ಆದರೆ ಕೊಡುವುದು ಉಚಿತ.",
    earn: "ಸ್ವಲ್ಪ ಕೂಡಿಸಿ ಒಂದೇ ಸಲ ಗುಜರಿಯವರಿಗೆ ಮಾರಿ.",
    nearest: (name, km) => `ಹತ್ತಿರದಲ್ಲಿ ${name} ಇದೆ, ಸುಮಾರು ${km} ಕಿಲೋಮೀಟರ್ ದೂರ.`,
    needLocation: "ರಿಸಲ್ಟ್ ಸ್ಕ್ರೀನ್‌ನಲ್ಲಿ ಲೊಕೇಶನ್ ಅನುಮತಿ ಕೊಡಿ, ಹತ್ತಿರದ ರೀಸೈಕ್ಲರ್ ಕಾಣಿಸುತ್ತೆ.",
    harm: "ಮಿಶ್ರ ಕಸಕ್ಕೆ ಹೋದರೆ ಮಾಲಿನ್ಯ ಅಷ್ಟೇ; ಸರಿಯಾಗಿ ಬೇರ್ಪಡಿಸಿದರೆ ಈ ವಸ್ತು ಮತ್ತೆ ಬಳಕೆಯಾಗುತ್ತದೆ.",
    toxicHarm: "ಕಸಕ್ಕೆ ಎಸೆದರೆ ಇದರಿಂದ ವಿಷಕಾರಿ ರಾಸಾಯನಿಕಗಳು ಸೋರಬಹುದು, ಬೆಂಕಿಯೂ ಹತ್ತಬಹುದು. ಸರಿಯಾದ ಕಡೆ ಕೊಟ್ಟರೆ ಒಳಗಿನ ಲೋಹಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ತೆಗೆಯುತ್ತಾರೆ.",
    confidence: (item, pct) => `ಇದು ${item} ಅನ್ನಿಸುತ್ತೆ, ಸುಮಾರು ${pct}% ಖಚಿತ. ತಪ್ಪಾದರೆ "Not this item?" ಒತ್ತಿ.`,
    fallback: (item) => `ಈ ${item} ಬಗ್ಗೆ ಕೇಳಿ — ಹೇಗೆ ವಿಲೇವಾರಿ ಮಾಡಬೇಕು, ಎಷ್ಟು ಸಿಗುತ್ತೆ, ಎಲ್ಲಿ ಕೊಡಬೇಕು.`,
  },

  ml: {
    its: (item) => `ഇത് ഒരു ${item} ആണ്.`,
    action: {
      plastic: "കാലിയാക്കി ചെറുതായി കഴുകുക, പിന്നെ ഉണങ്ങിയ മാലിന്യത്തിൽ ഇടുക അല്ലെങ്കിൽ ആക്രിക്കടയിൽ വിൽക്കുക.",
      paper: "പരത്തി ഉണങ്ങിയ നിലയിൽ സൂക്ഷിക്കുക, പിന്നെ ആക്രിക്കടയിൽ കൊടുക്കുക.",
      metal: "കാലിയാക്കി കഴുകുക, പിന്നെ ആക്രിക്കടയിൽ വിൽക്കുക — ക്യാനിന് നല്ല വില കിട്ടും.",
      glass: "കാലിയാക്കി കഴുകുക, പൊട്ടിക്കരുത്, ആക്രിക്കടയിലോ ഗ്ലാസ് കളക്ഷൻ പോയിന്റിലോ കൊടുക്കുക.",
      "e-waste": "ഡസ്റ്റ്ബിന്നിൽ ഇടരുത്, ഇ-വേസ്റ്റ് കളക്ഷൻ പോയിന്റിൽ കൊടുക്കുക.",
      hazardous: "ഒരിക്കലും ഡസ്റ്റ്ബിന്നിൽ ഇടരുത്. ടെർമിനലുകളിൽ ടേപ്പ് ഒട്ടിച്ച് ബാറ്ററി കളക്ഷൻ ബോക്സിൽ ഇടുക.",
    },
    verdict: {
      recycle: "അതെ, ഇത് റീസൈക്കിൾ ചെയ്യാം.",
      special: "അതെ, പക്ഷേ ഇ-വേസ്റ്റ് സെന്ററിൽ മാത്രം.",
      hazardous: "ഇത് അപകടകരമായ മാലിന്യമാണ്, സാധാരണ ബിന്നിൽ ഇടരുത്.",
    },
    value: (range, unit) => `ഇതിന് ഏകദേശം ${range} ${unit} വില കിട്ടും, കടയനുസരിച്ച് മാറും.`,
    noValue: "ഇതിന് വീണ്ടും വിൽക്കാനുള്ള വിലയില്ല, പക്ഷേ കൊടുക്കുന്നത് സൗജന്യമാണ്.",
    earn: "കുറച്ച് ശേഖരിച്ച് ഒരുമിച്ച് ആക്രിക്കടയിൽ വിൽക്കുക.",
    nearest: (name, km) => `ഏറ്റവും അടുത്ത് ${name} ഉണ്ട്, ഏകദേശം ${km} കിലോമീറ്റർ അകലെ.`,
    needLocation: "റിസൾട്ട് സ്ക്രീനിൽ ലൊക്കേഷൻ അനുവദിക്കുക, അടുത്തുള്ള റീസൈക്ലർ കാണാം.",
    harm: "കലർന്ന മാലിന്യത്തിൽ പോയാൽ മലിനീകരണം മാത്രം; ശരിയായി വേർതിരിച്ചാൽ ഈ വസ്തു വീണ്ടും ഉപയോഗിക്കും.",
    toxicHarm: "വലിച്ചെറിഞ്ഞാൽ ഇതിൽ നിന്ന് വിഷരാസവസ്തുക്കൾ ചോരാം, തീപിടിക്കാനും സാധ്യതയുണ്ട്. ശരിയായ സ്ഥലത്ത് കൊടുത്താൽ ഉള്ളിലെ ലോഹങ്ങൾ സുരക്ഷിതമായി വേർതിരിക്കും.",
    confidence: (item, pct) => `ഇത് ${item} ആണെന്ന് തോന്നുന്നു, ഏകദേശം ${pct}% ഉറപ്പ്. തെറ്റാണെങ്കിൽ "Not this item?" അമർത്തുക.`,
    fallback: (item) => `ഈ ${item} നെക്കുറിച്ച് ചോദിക്കൂ — എങ്ങനെ കളയണം, എത്ര കിട്ടും, എവിടെ കൊടുക്കണം.`,
  },

  or: {
    its: (item) => `ଏହା ଏକ ${item}।`,
    action: {
      plastic: "ଖାଲି କରି ଟିକେ ଧୋଇ ନିଅନ୍ତୁ, ତା'ପରେ ଶୁଖିଲା ଆବର୍ଜନାରେ ପକାନ୍ତୁ କିମ୍ବା କବାଡ଼ିବାଲାଙ୍କୁ ବିକି ଦିଅନ୍ତୁ।",
      paper: "ଚେପ୍ଟା କରି ଶୁଖିଲା ରଖନ୍ତୁ, ତା'ପରେ କବାଡ଼ିବାଲାଙ୍କୁ ଦିଅନ୍ତୁ।",
      metal: "ଖାଲି କରି ଧୋଇ ନିଅନ୍ତୁ, ତା'ପରେ କବାଡ଼ିବାଲାଙ୍କୁ ବିକି ଦିଅନ୍ତୁ — କ୍ୟାନର ଭଲ ଦାମ ମିଳେ।",
      glass: "ଖାଲି କରି ଧୋଇ ନିଅନ୍ତୁ, ଭାଙ୍ଗନ୍ତୁ ନାହିଁ, କବାଡ଼ିବାଲା କିମ୍ବା ଗ୍ଲାସ କଲେକ୍ସନ ପଏଣ୍ଟରେ ଦିଅନ୍ତୁ।",
      "e-waste": "ଡଷ୍ଟବିନରେ ପକାନ୍ତୁ ନାହିଁ, ଇ-ୱେଷ୍ଟ କଲେକ୍ସନ ପଏଣ୍ଟରେ ଦିଅନ୍ତୁ।",
      hazardous: "ଡଷ୍ଟବିନରେ କେବେବି ପକାନ୍ତୁ ନାହିଁ। ଟର୍ମିନାଲରେ ଟେପ ଲଗାଇ ବ୍ୟାଟେରୀ କଲେକ୍ସନ ବକ୍ସରେ ପକାନ୍ତୁ।",
    },
    verdict: {
      recycle: "ହଁ, ଏହାକୁ ରିସାଇକେଲ କରାଯାଇପାରିବ।",
      special: "ହଁ, କିନ୍ତୁ କେବଳ ଇ-ୱେଷ୍ଟ ସେଣ୍ଟରରେ।",
      hazardous: "ଏହା ବିପଜ୍ଜନକ ଆବର୍ଜନା, ସାଧାରଣ ଡଷ୍ଟବିନରେ ପକାନ୍ତୁ ନାହିଁ।",
    },
    value: (range, unit) => `ଏହାର ଆନୁମାନିକ ଦାମ ${range} ${unit}, ଦୋକାନ ଉପରେ ନିର୍ଭର କରେ।`,
    noValue: "ଏହାର କୌଣସି ପୁନଃବିକ୍ରୟ ମୂଲ୍ୟ ନାହିଁ, କିନ୍ତୁ ଜମା କରିବା ମାଗଣା।",
    earn: "କିଛି ଏକାଠି କରି ଥରେ କବାଡ଼ିବାଲାଙ୍କୁ ବିକନ୍ତୁ।",
    nearest: (name, km) => `ସବୁଠୁ ପାଖରେ ${name}, ପ୍ରାୟ ${km} କିଲୋମିଟର ଦୂରରେ।`,
    needLocation: "ରେଜଲ୍ଟ ସ୍କ୍ରିନରେ ଲୋକେସନ ଅନୁମତି ଦିଅନ୍ତୁ, ପାଖର ରିସାଇକ୍ଲର ଦେଖାଯିବ।",
    harm: "ମିଶା ଆବର୍ଜନାରେ ଗଲେ କେବଳ ପ୍ରଦୂଷଣ ହୁଏ; ଠିକ୍ ଭାବେ ଅଲଗା କଲେ ଏହି ପଦାର୍ଥ ପୁଣି ବ୍ୟବହାର ହୁଏ।",
    toxicHarm: "ଫିଙ୍ଗିଦେଲେ ଏଥିରୁ ବିଷାକ୍ତ ରାସାୟନିକ ବାହାରିପାରେ, ନିଆଁ ମଧ୍ୟ ଲାଗିପାରେ। ଠିକ୍ ଜାଗାରେ ଦେଲେ ଭିତରର ଧାତୁ ସୁରକ୍ଷିତ ଭାବେ ବାହାର କରାଯାଏ।",
    confidence: (item, pct) => `ଏହା ${item} ପରି ଲାଗୁଛି, ପ୍ରାୟ ${pct}% ନିଶ୍ଚିତ। ଭୁଲ ହେଲେ "Not this item?" ଦବାନ୍ତୁ।`,
    fallback: (item) => `ଏହି ${item} ବିଷୟରେ ପଚାରନ୍ତୁ — କିପରି ଫିଙ୍ଗିବେ, କେତେ ମିଳିବ, କେଉଁଠି ଦେବେ।`,
  },

  as: {
    its: (item) => `এইটো এটা ${item}।`,
    action: {
      plastic: "খালী কৰি অলপ ধুই লওক, তাৰ পিছত শুকান আৱৰ্জনাত দিয়ক বা কাবাড়ীৱালাক বিক্ৰী কৰক।",
      paper: "চেপেটা কৰি শুকান কৈ ৰাখক, তাৰ পিছত কাবাড়ীৱালাক দিয়ক।",
      metal: "খালী কৰি ধুই লওক, তাৰ পিছত কাবাড়ীৱালাক বিক্ৰী কৰক — কেনৰ ভাল দাম পোৱা যায়।",
      glass: "খালী কৰি ধুই লওক, নাভাঙিব, কাবাড়ীৱালা বা গ্লাছ কলেকচন পইণ্টত দিয়ক।",
      "e-waste": "ডাষ্টবিনত নেপেলাব, ই-ৱেষ্ট কলেকচন পইণ্টত দিয়ক।",
      hazardous: "কেতিয়াও ডাষ্টবিনত নেপেলাব। টাৰ্মিনেলত টেপ লগাই বেটাৰী কলেকচন বাকচত দিয়ক।",
    },
    verdict: {
      recycle: "হয়, এইটো ৰিচাইকেল কৰিব পাৰি।",
      special: "হয়, কিন্তু কেৱল ই-ৱেষ্ট চেণ্টাৰত।",
      hazardous: "এইটো বিপজ্জনক আৱৰ্জনা, সাধাৰণ ডাষ্টবিনত নেপেলাব।",
    },
    value: (range, unit) => `ইয়াৰ আনুমানিক দাম ${range} ${unit}, দোকানৰ ওপৰত নিৰ্ভৰ কৰে।`,
    noValue: "ইয়াৰ পুনৰ বিক্ৰীৰ মূল্য নাই, কিন্তু জমা দিয়াটো বিনামূলীয়া।",
    earn: "কেইটামান গোটাই একেলগে কাবাড়ীৱালাক বিক্ৰী কৰক।",
    nearest: (name, km) => `আটাইতকৈ ওচৰত ${name}, প্ৰায় ${km} কিলোমিটাৰ দূৰত।`,
    needLocation: "ৰিজাল্ট স্ক্ৰীনত লোকেচনৰ অনুমতি দিয়ক, ওচৰৰ ৰিচাইক্লাৰ দেখা পাব।",
    harm: "মিহলি আৱৰ্জনাত গ'লে কেৱল প্ৰদূষণ হয়; ঠিকমতে পৃথক কৰিলে এই সামগ্ৰী পুনৰ ব্যৱহাৰ হয়।",
    toxicHarm: "পেলাই দিলে ইয়াৰ পৰা বিষাক্ত ৰাসায়নিক ওলাব পাৰে, জুইও লাগিব পাৰে। সঠিক ঠাইত দিলে ভিতৰৰ ধাতু সুৰক্ষিতভাৱে উলিওৱা হয়।",
    confidence: (item, pct) => `এইটো ${item} যেন লাগিছে, প্ৰায় ${pct}% নিশ্চিত। ভুল হ'লে "Not this item?" টিপক।`,
    fallback: (item) => `এই ${item}ৰ বিষয়ে সোধক — কেনেকৈ পেলাব, কিমান পাব, বা ক'ত দিব।`,
  },

  ur: {
    its: (item) => `یہ ${item} ہے۔`,
    action: {
      plastic: "اسے خالی کر کے ہلکا سا دھو لیں، پھر خشک کچرے میں ڈالیں یا کباڑی کو بیچ دیں۔",
      paper: "اسے چپٹا کر کے خشک رکھیں، پھر کباڑی کو دے دیں۔",
      metal: "اسے خالی کر کے دھو لیں، پھر کباڑی کو بیچ دیں — کین کا ریٹ اچھا ملتا ہے۔",
      glass: "اسے خالی کر کے دھو لیں، توڑیں مت، اور کباڑی یا گلاس کلیکشن پوائنٹ پر دے دیں۔",
      "e-waste": "اسے ڈسٹ بن میں نہ ڈالیں، ای-ویسٹ کلیکشن پوائنٹ پر دے دیں۔",
      hazardous: "اسے ڈسٹ بن میں بالکل نہ ڈالیں۔ ٹرمینل پر ٹیپ لگا کر بیٹری کلیکشن باکس میں ڈال دیں۔",
    },
    verdict: {
      recycle: "جی ہاں، یہ ری سائیکل ہو سکتا ہے۔",
      special: "جی ہاں، مگر صرف ای-ویسٹ سینٹر پر۔",
      hazardous: "یہ خطرناک کچرا ہے، عام ڈسٹ بن میں نہ ڈالیں۔",
    },
    value: (range, unit) => `اس کا اندازاً ریٹ ${range} ${unit} کے آس پاس ہے، ڈیلر پر منحصر ہے۔`,
    noValue: "اس کی کوئی ری سیل ویلیو نہیں، مگر جمع کرانا مفت ہے۔",
    earn: "تھوڑے جمع کر کے ایک ساتھ کباڑی کو بیچ دیں۔",
    nearest: (name, km) => `سب سے قریب ${name} ہے، تقریباً ${km} کلومیٹر دور۔`,
    needLocation: "رزلٹ اسکرین پر لوکیشن کی اجازت دیں، پھر قریبی ری سائیکلر نظر آ جائے گا۔",
    harm: "ملے جلے کچرے میں جا کر یہ بس آلودگی بنتا ہے؛ صحیح سے الگ کریں تو یہ میٹیریل دوبارہ استعمال ہوتا ہے۔",
    toxicHarm: "کچرے میں پھینکنے سے اس سے زہریلے کیمیکل رس سکتے ہیں، آگ بھی لگ سکتی ہے۔ صحیح جگہ دیں تو اندر کی دھاتیں محفوظ طریقے سے نکال لی جاتی ہیں۔",
    confidence: (item, pct) => `لگتا ہے یہ ${item} ہے، تقریباً ${pct}% یقین۔ غلط ہو تو "Not this item?" دبائیں۔`,
    fallback: (item) => `اس ${item} کے بارے میں پوچھیں — کیسے پھینکنا ہے، کتنے کا بکے گا، یا کہاں دینا ہے۔`,
  },
};
