import type { Recycler } from "@/types/waste";

export interface RecyclerProvider {
  findNearby(category: string, location?: { lat: number; lng: number }): Promise<Recycler[]>;
}
