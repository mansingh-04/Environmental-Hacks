import { WASTE_ITEMS } from "@/data/waste/items";
import { delay } from "@/lib/delay";
import type { WasteDetection, WasteItemId } from "@/types/waste";
import type { VisionProvider } from "./types";

interface ColorStats {
  hue: number;
  saturation: number;
  brightness: number;
}

/**
 * Stand-in for a real vision model. It reads the centre of the frame and maps its dominant
 * colour to one of the demo items, so different objects give different results in a live demo.
 * Swap for a real model/API by implementing VisionProvider.
 */
export class MockVisionProvider implements VisionProvider {
  async analyzeImage(image: Blob): Promise<WasteDetection> {
    const [stats] = await Promise.all([readCenterColor(image), delay(1100)]);
    const { itemId, confidence } = classify(stats);
    const item = WASTE_ITEMS[itemId];

    return {
      itemId,
      objectName: item.name,
      material: item.material,
      category: item.category,
      confidence,
      visualDetails: { dominantHue: Math.round(stats.hue), brightness: round(stats.brightness) },
    };
  }
}

function classify({ hue, saturation, brightness }: ColorStats): { itemId: WasteItemId; confidence: number } {
  const strength = Math.min(1, saturation * 1.6);
  const confident = (base: number) => round(Math.min(0.97, base + strength * 0.12));

  if (saturation < 0.16) {
    if (brightness < 0.28) return { itemId: "phone-charger", confidence: confident(0.78) };
    if (brightness < 0.62) return { itemId: "aluminum-can", confidence: confident(0.8) };
    return { itemId: "pet-bottle", confidence: confident(0.84) };
  }
  if (hue < 18 || hue >= 330) return { itemId: "aluminum-can", confidence: confident(0.82) };
  if (hue < 48) return { itemId: "cardboard-box", confidence: confident(0.85) };
  if (hue < 70) return { itemId: "battery", confidence: confident(0.76) };
  if (hue < 170) return { itemId: "glass-bottle", confidence: confident(0.8) };
  return { itemId: "pet-bottle", confidence: confident(0.86) };
}

async function readCenterColor(image: Blob): Promise<ColorStats> {
  const bitmap = await createImageBitmap(image);
  const size = 48;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  const cropW = bitmap.width * 0.5;
  const cropH = bitmap.height * 0.5;
  ctx.drawImage(bitmap, (bitmap.width - cropW) / 2, (bitmap.height - cropH) / 2, cropW, cropH, 0, 0, size, size);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, size, size);
  let r = 0;
  let g = 0;
  let b = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  return toHsv(r / pixels / 255, g / pixels / 255, b / pixels / 255);
}

function toHsv(r: number, g: number, b: number): ColorStats {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue = (hue * 60 + 360) % 360;
  }
  return { hue, saturation: max === 0 ? 0 : d / max, brightness: max };
}

const round = (n: number) => Math.round(n * 100) / 100;
