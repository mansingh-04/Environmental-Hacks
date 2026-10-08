import type { GeoPoint, Recycler } from "@/types/waste";

export interface RecyclerProvider {
  findNearby(category: string, location?: GeoPoint): Promise<Recycler[]>;
}
