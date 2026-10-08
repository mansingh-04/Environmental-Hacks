import type { WasteValue } from "@/types/waste";

export interface WasteValueProvider {
  estimate(itemId: string, category: string): Promise<WasteValue>;
}
