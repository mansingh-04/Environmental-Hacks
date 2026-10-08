"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CameraScreen } from "@/features/camera/camera-screen";
import { HomeScreen } from "@/features/home/home-screen";
import { useLocation } from "@/features/location/use-location";
import { AnalyzingScreen } from "@/features/waste/analyzing-screen";
import { analyzeImage, correctDetection, localizeAnalysis, type AnalysisStage } from "@/features/waste/pipeline";
import { ResultScreen } from "@/features/waste/result-screen";
import { DURATION, EASE } from "@/lib/motion";
import type { WasteAnalysis, WasteItemId } from "@/types/waste";

type Screen =
  | { name: "home" }
  | { name: "camera" }
  | { name: "analyzing"; stage: AnalysisStage }
  | { name: "result"; analysis: WasteAnalysis; localized: boolean };

// Opacity-only so fixed-position children (camera, bottom bars) never shift during the transition.
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE } },
};

export default function Page() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const { coords, status: locationStatus, resumeIfGranted } = location;

  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl]);

  const resultAnalysis = screen.name === "result" ? screen.analysis : null;
  const needsLocalizing = screen.name === "result" && !screen.localized;

  // Location is only considered once there's a result to localize — never on page load.
  useEffect(() => {
    if (resultAnalysis && locationStatus === "idle") void resumeIfGranted();
  }, [resultAnalysis, locationStatus, resumeIfGranted]);

  useEffect(() => {
    if (!resultAnalysis || !needsLocalizing || !coords) return;
    let cancelled = false;
    localizeAnalysis(resultAnalysis, coords).then((analysis) => {
      if (!cancelled) setScreen({ name: "result", analysis, localized: true });
    });
    return () => {
      cancelled = true;
    };
  }, [resultAnalysis, needsLocalizing, coords]);

  // Camera capture and upload both land here: one pipeline for every image source.
  async function handleImage(image: Blob) {
    setError("");
    setImageUrl(URL.createObjectURL(image));
    setScreen({ name: "analyzing", stage: "vision" });
    try {
      const analysis = await analyzeImage(image, (stage) => setScreen({ name: "analyzing", stage }));
      setScreen({ name: "result", analysis, localized: false });
    } catch {
      setError("We couldn't analyse that image. Please try again.");
      setScreen({ name: "home" });
    }
  }

  async function handleCorrect(itemId: WasteItemId) {
    setScreen({ name: "result", analysis: await correctDetection(itemId), localized: false });
  }

  function render() {
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
            localized={screen.localized}
            locationStatus={locationStatus}
            onRequestLocation={location.request}
            onCorrect={handleCorrect}
            onScanAgain={() => setScreen({ name: "camera" })}
            onHome={() => setScreen({ name: "home" })}
          />
        );
      default:
        return <HomeScreen onScan={() => setScreen({ name: "camera" })} onImage={handleImage} />;
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={screen.name} {...fade}>
          {render()}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {error && screen.name === "home" && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-4 top-4 z-50 mx-auto max-w-sm rounded-lg border border-hazard/30 bg-hazard-soft px-4 py-3 text-sm font-medium text-hazard"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
