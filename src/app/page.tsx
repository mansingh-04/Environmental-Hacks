"use client";

import { useEffect, useState } from "react";
import { CameraScreen } from "@/features/camera/camera-screen";
import { HomeScreen } from "@/features/home/home-screen";
import { AnalyzingScreen } from "@/features/waste/analyzing-screen";
import { analyzeImage, correctDetection, type AnalysisStage } from "@/features/waste/pipeline";
import { ResultScreen } from "@/features/waste/result-screen";
import type { WasteAnalysis, WasteItemId } from "@/types/waste";

type Screen =
  | { name: "home" }
  | { name: "camera" }
  | { name: "analyzing"; stage: AnalysisStage }
  | { name: "result"; analysis: WasteAnalysis };

export default function Page() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  // Camera capture and upload both land here: one pipeline for every image source.
  async function handleImage(image: Blob) {
    setError("");
    setImageUrl(URL.createObjectURL(image));
    setScreen({ name: "analyzing", stage: "vision" });
    try {
      const analysis = await analyzeImage(image, (stage) => setScreen({ name: "analyzing", stage }));
      setScreen({ name: "result", analysis });
    } catch {
      setError("We couldn't analyse that image. Please try again.");
      setScreen({ name: "home" });
    }
  }

  async function handleCorrect(itemId: WasteItemId) {
    setScreen({ name: "result", analysis: await correctDetection(itemId) });
  }

  switch (screen.name) {
    case "camera":
      return <CameraScreen onImage={handleImage} onClose={() => setScreen({ name: "home" })} />;
    case "analyzing":
      return <AnalyzingScreen imageUrl={imageUrl} stage={screen.stage} />;
    case "result":
      return (
        <ResultScreen
          analysis={screen.analysis}
          imageUrl={imageUrl}
          onCorrect={handleCorrect}
          onScanAgain={() => setScreen({ name: "camera" })}
          onHome={() => setScreen({ name: "home" })}
        />
      );
    default:
      return (
        <>
          <HomeScreen onScan={() => setScreen({ name: "camera" })} onImage={handleImage} />
          {error && (
            <p role="alert" className="fixed inset-x-4 top-4 z-50 mx-auto max-w-sm rounded-2xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger shadow-lg">
              {error}
            </p>
          )}
        </>
      );
  }
}
