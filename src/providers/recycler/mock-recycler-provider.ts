import { RECYCLER_SITES } from "@/data/recyclers/recyclers";
import { distanceKm, offsetPoint } from "@/lib/geo";
import type { GeoPoint, Recycler, WasteCategory } from "@/types/waste";
import type { RecyclerProvider } from "./types";

export class MockRecyclerProvider implements RecyclerProvider {
  async findNearby(category: string, location?: GeoPoint): Promise<Recycler[]> {
    // Without a location we can't say what is nearby.
    if (!location) return [];

    return RECYCLER_SITES.filter((site) => site.categories.includes(category as WasteCategory))
      .map((site) => {
        const position = offsetPoint(location, site.offsetKm.north, site.offsetKm.east);
        return {
          name: site.name,
          type: site.type,
          location: site.address,
          accepts: site.accepts,
          hours: site.hours,
          distanceKm: Math.round(distanceKm(location, position) * 10) / 10,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
