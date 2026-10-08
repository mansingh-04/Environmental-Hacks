import type { WasteValue } from "@/types/waste";

export const NO_VALUE = "No resale value";

export function formatValue(v: Pick<WasteValue, "min" | "max" | "currency">): string {
  if (v.max === 0) return NO_VALUE;
  return v.min === v.max ? `${v.currency}${v.min}` : `${v.currency}${v.min}–${v.max}`;
}
