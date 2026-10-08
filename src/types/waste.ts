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

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface WasteValue {
  /** Set when the estimate was adjusted for the user's area. */
  region?: string;
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
  accepts: string[];
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
  category: WasteCategory;
  /** Generic kind of drop-off point, used before nearby recyclers are known. */
  destination: string;
  disposalInstruction: string;
  preparationSteps: string[];
  warnings: string[];
  earning: { method: string; explanation: string };
  impact: { harm: string; benefit: string; fact: string };
  value: WasteValue;
}

export type Verdict = "recycle" | "special" | "hazardous";

export interface WasteAnalysis {
  identification: {
    itemId: WasteItemId;
    categoryKey: WasteCategory;
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
    min: number;
    max: number;
    currency: string;
    unit: string;
    explanation: string;
    region?: string;
  };
  earning: {
    method: string;
    explanation: string;
  };
  /** Generic drop-off guidance; always available. */
  destination: string;
  /** Nearby recyclers; empty until the user shares their location. */
  recyclers: Recycler[];
  environmentalImpact: {
    explanation: string;
    harm: string;
    benefit: string;
    fact: string;
  };
}

