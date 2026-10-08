import type { Verdict, WasteCategory } from "@/types/waste";

/** Material accents identify the object's stream; they never decorate the whole UI. */
export const MATERIAL_STYLE: Record<WasteCategory, { color: string; label: string }> = {
  plastic: { color: "#3d6795", label: "Plastic" },
  metal: { color: "#56606b", label: "Metal" },
  glass: { color: "#2c7a80", label: "Glass" },
  paper: { color: "#8f6c3e", label: "Paper" },
  "e-waste": { color: "#65558f", label: "E-waste" },
  hazardous: { color: "#a83a24", label: "Hazardous" },
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  recycle: "Recyclable",
  special: "E-waste only",
  hazardous: "Hazardous",
};
