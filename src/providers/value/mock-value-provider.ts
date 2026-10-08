import { WASTE_VALUES } from "@/data/waste/values";
import type { WasteItemId, WasteValue } from "@/types/waste";
import type { WasteValueProvider } from "./types";

export class MockWasteValueProvider implements WasteValueProvider {
  async estimate(itemId: string): Promise<WasteValue> {
    const value = WASTE_VALUES[itemId as WasteItemId];
    if (!value) throw new Error(`No value data for "${itemId}"`);
    return value;
  }
}
