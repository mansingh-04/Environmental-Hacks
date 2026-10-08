import { MockWasteAgent } from "./agent/mock-waste-agent";
import type { WasteAgent } from "./agent/types";
import { MockWasteKnowledgeProvider } from "./knowledge/mock-knowledge-provider";
import type { WasteKnowledgeProvider } from "./knowledge/types";
import { HeuristicLanguageDetector } from "./language/heuristic-language-detector";
import type { LanguageDetector } from "./language/types";
import { BrowserLocationProvider } from "./location/browser-location-provider";
import type { LocationProvider } from "./location/types";
import { MockRecyclerProvider } from "./recycler/mock-recycler-provider";
import type { RecyclerProvider } from "./recycler/types";
import { MockWasteValueProvider } from "./value/mock-value-provider";
import type { WasteValueProvider } from "./value/types";
import { BrowserSpeechRecognitionProvider } from "./speech/browser-speech-recognition-provider";
import { BrowserSpeechSynthesisProvider } from "./speech/browser-speech-synthesis-provider";
import type { SpeechRecognitionProvider, SpeechSynthesisProvider } from "./speech/types";
import { MockVisionProvider } from "./vision/mock-vision-provider";
import type { VisionProvider } from "./vision/types";

/** Composition root — swap mocks for real implementations here. */
export const vision: VisionProvider = new MockVisionProvider();
export const values: WasteValueProvider = new MockWasteValueProvider();
export const recyclers: RecyclerProvider = new MockRecyclerProvider();
export const knowledge: WasteKnowledgeProvider = new MockWasteKnowledgeProvider(values);
export const agent: WasteAgent = new MockWasteAgent();
export const location: LocationProvider = new BrowserLocationProvider();
export const languageDetector: LanguageDetector = new HeuristicLanguageDetector();
export const speechInput: SpeechRecognitionProvider = new BrowserSpeechRecognitionProvider();
export const speechOutput: SpeechSynthesisProvider = new BrowserSpeechSynthesisProvider();
