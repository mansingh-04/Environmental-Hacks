import type { GeoPoint, WasteValue } from "@/types/waste";

export interface WasteValueProvider {
  estimate(itemId: string, category: string, location?: GeoPoint): Promise<WasteValue>;
}
