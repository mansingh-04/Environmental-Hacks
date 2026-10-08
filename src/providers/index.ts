import { MockWasteAgent } from "./agent/mock-waste-agent";
import type { WasteAgent } from "./agent/types";
import { MockWasteKnowledgeProvider } from "./knowledge/mock-knowledge-provider";
import type { WasteKnowledgeProvider } from "./knowledge/types";
import { MockRecyclerProvider } from "./recycler/mock-recycler-provider";
import { MockWasteValueProvider } from "./value/mock-value-provider";
import { MockVisionProvider } from "./vision/mock-vision-provider";
import type { VisionProvider } from "./vision/types";

/** Composition root — swap mocks for real implementations here. */
export const vision: VisionProvider = new MockVisionProvider();
export const knowledge: WasteKnowledgeProvider = new MockWasteKnowledgeProvider(
  new MockWasteValueProvider(),
  new MockRecyclerProvider(),
);
export const agent: WasteAgent = new MockWasteAgent();
