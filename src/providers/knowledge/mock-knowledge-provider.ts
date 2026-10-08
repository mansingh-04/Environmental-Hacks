import { WASTE_ITEMS } from "@/data/waste/items";
import type { WasteDetection, WasteKnowledge } from "@/types/waste";
import type { RecyclerProvider } from "../recycler/types";
import type { WasteValueProvider } from "../value/types";
import type { WasteKnowledgeProvider } from "./types";

export class MockWasteKnowledgeProvider implements WasteKnowledgeProvider {
  constructor(
    private readonly values: WasteValueProvider,
    private readonly recyclers: RecyclerProvider,
  ) {}

  async getKnowledge(detection: WasteDetection): Promise<WasteKnowledge> {
    const item = WASTE_ITEMS[detection.itemId];
    if (!item) throw new Error(`No knowledge for "${detection.itemId}"`);

    const [value, recyclers] = await Promise.all([
      this.values.estimate(item.id, item.category),
      this.recyclers.findNearby(item.category),
    ]);

    return {
      itemId: item.id,
      displayName: item.name,
      categoryLabel: item.categoryLabel,
      recyclable: item.recyclable,
      hazardous: item.hazardous,
      disposalInstruction: item.disposalInstruction,
      preparationSteps: item.preparationSteps,
      warnings: item.warnings,
      earning: item.earning,
      impact: item.impact,
      value,
      recyclers,
    };
  }
}
