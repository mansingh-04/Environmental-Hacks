import { RECYCLERS } from "@/data/recyclers/recyclers";
import type { Recycler, WasteCategory } from "@/types/waste";
import type { RecyclerProvider } from "./types";

export class MockRecyclerProvider implements RecyclerProvider {
  async findNearby(category: string): Promise<Recycler[]> {
    const list = RECYCLERS[category as WasteCategory] ?? [];
    return [...list].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }
}
