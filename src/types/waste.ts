export type WasteCategory = "plastic" | "paper" | "metal" | "glass" | "e-waste" | "hazardous";

export type WasteItemId =
  | "pet-bottle"
  | "cardboard-box"
  | "aluminum-can"
  | "glass-bottle"
  | "phone-charger"
  | "battery";

/** Stage 1 output: what the vision model sees. Not authoritative for rules, prices or locations. */
export interface WasteDetection {
  itemId: WasteItemId;
  objectName: string;
  material: string;
  category: WasteCategory;
  confidence: number;
  visualDetails?: Record<string, unknown>;
}

export interface WasteValue {
  min: number;
  max: number;
  currency: string;
  unit: string;
  explanation: string;
}

export interface Recycler {
  name: string;
  type: string;
  location: string;
  distanceKm?: number;
  hours?: string;
}

/** Trusted, structured facts about an item. The agent explains these; it never invents them. */
export interface WasteKnowledge {
  itemId: WasteItemId;
  displayName: string;
  categoryLabel: string;
  recyclable: boolean;
  hazardous: boolean;
  disposalInstruction: string;
  preparationSteps: string[];
  warnings: string[];
  earning: { method: string; explanation: string };
  impact: { harm: string; benefit: string; fact: string };
  value: WasteValue;
  recyclers: Recycler[];
}

export type Verdict = "recycle" | "special" | "hazardous";

export interface WasteAnalysis {
  identification: {
    name: string;
    material: string;
    category: string;
    confidence: number;
  };
  verdict: { kind: Verdict; headline: string };
  disposal: {
    instruction: string;
    preparationSteps: string[];
    warnings: string[];
  };
  value: {
    estimatedValue: string;
    unit: string;
    explanation: string;
  };
  earning: {
    method: string;
    explanation: string;
  };
  recycler: {
    name: string;
    type: string;
    location: string;
    distance?: string;
    hours?: string;
  };
  environmentalImpact: {
    explanation: string;
    harm: string;
    benefit: string;
    fact: string;
  };
  spokenSummary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}
