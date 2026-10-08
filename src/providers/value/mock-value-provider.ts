import { PRICE_REGIONS, REGION_RADIUS_KM } from "@/data/waste/regions";
import { WASTE_VALUES } from "@/data/waste/values";
import { distanceKm } from "@/lib/geo";
import type { GeoPoint, WasteItemId, WasteValue } from "@/types/waste";
import type { WasteValueProvider } from "./types";

export class MockWasteValueProvider implements WasteValueProvider {
  async estimate(itemId: string, _category: string, location?: GeoPoint): Promise<WasteValue> {
    const value = WASTE_VALUES[itemId as WasteItemId];
    if (!value) throw new Error(`No value data for "${itemId}"`);
    if (!location) return value;

    const region = PRICE_REGIONS.find((r) => distanceKm(location, r) <= REGION_RADIUS_KM);
    if (!region) return value;

    return {
      ...value,
      region: region.name,
      min: Math.round(value.min * region.multiplier),
      max: Math.round(value.max * region.multiplier),
    };
  }
}
