import type { WasteItemId, WasteValue } from "@/types/waste";

/** Indicative demo price ranges (INR). Replace with a live scrap-price feed later. */
export const WASTE_VALUES: Record<WasteItemId, WasteValue> = {
  "pet-bottle": {
    min: 15,
    max: 25,
    currency: "₹",
    unit: "per kg",
    explanation: "Clean, sorted PET bottles get the upper end of this range.",
  },
  "cardboard-box": {
    min: 8,
    max: 12,
    currency: "₹",
    unit: "per kg",
    explanation: "Dry, flattened cardboard without tape sells best.",
  },
  "aluminum-can": {
    min: 90,
    max: 120,
    currency: "₹",
    unit: "per kg",
    explanation: "Aluminium is one of the highest-value household recyclables.",
  },
  "glass-bottle": {
    min: 1,
    max: 3,
    currency: "₹",
    unit: "per bottle",
    explanation: "Only intact, reusable bottles usually have value.",
  },
  "phone-charger": {
    min: 10,
    max: 30,
    currency: "₹",
    unit: "per charger",
    explanation: "Value comes from the copper in the cable and transformer.",
  },
  battery: {
    min: 0,
    max: 0,
    currency: "₹",
    unit: "per cell",
    explanation: "Household batteries have no resale value, but drop-off is free.",
  },
};
