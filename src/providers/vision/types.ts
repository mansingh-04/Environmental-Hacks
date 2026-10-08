import type { WasteDetection } from "@/types/waste";

export interface VisionProvider {
  analyzeImage(image: Blob): Promise<WasteDetection>;
}
