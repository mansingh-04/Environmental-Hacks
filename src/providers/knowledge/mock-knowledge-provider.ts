import { WASTE_ITEMS } from "@/data/waste/items";
import type { WasteDetection, WasteKnowledge } from "@/types/waste";
import type { WasteValueProvider } from "../value/types";
import type { WasteKnowledgeProvider } from "./types";

export class MockWasteKnowledgeProvider implements WasteKnowledgeProvider {
  constructor(private readonly values: WasteValueProvider) {}

  async getKnowledge(detection: WasteDetection): Promise<WasteKnowledge> {
    const item = WASTE_ITEMS[detection.itemId];
    if (!item) throw new Error(`No knowledge for "${detection.itemId}"`);

    return {
      itemId: item.id,
      displayName: item.name,
      categoryLabel: item.categoryLabel,
      category: item.category,
      recyclable: item.recyclable,
      hazardous: item.hazardous,
      destination: item.destination,
      disposalInstruction: item.disposalInstruction,
      preparationSteps: item.preparationSteps,
      warnings: item.warnings,
      earning: item.earning,
      impact: item.impact,
      value: await this.values.estimate(item.id, item.category),
    };
  }
}
