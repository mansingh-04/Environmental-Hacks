"use client";

import { CameraOff, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/button";
import { FrameCorners } from "@/components/frame-corners";
import { UploadLabel } from "@/components/upload-button";
import { DURATION, EASE, fadeUp, stagger } from "@/lib/motion";
import { useCamera } from "./use-camera";

export function CameraScreen({ onImage, onClose }: { onImage: (image: Blob) => void; onClose: () => void }) {
  const { video, status, capture } = useCamera();
  const [frozenFrame, setFrozenFrame] = useState("");

  useEffect(() => () => URL.revokeObjectURL(frozenFrame), [frozenFrame]);

  async function shoot() {
    const image = await capture();
    if (!image) return;
    // Freeze the captured frame so the hand-off to analysis isn't abrupt.
    setFrozenFrame(URL.createObjectURL(image));
    onImage(image);
  }

  const ready = status === "ready" && !frozenFrame;
  const statusLabel = frozenFrame ? "Captured" : status === "starting" ? "Starting camera" : "Scanning";

  return (
    <main className="fixed inset-0 flex flex-col bg-ink text-paper">
      <video ref={video} playsInline muted className="absolute inset-0 size-full object-cover" />
      {frozenFrame && (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL
        <img src={frozenFrame} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <AnimatePresence>
        {frozenFrame && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-paper"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: DURATION.base }}
          />
        )}
      </AnimatePresence>

      <header className="relative z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button onClick={onClose} aria-label="Close camera" className="grid size-11 place-items-center rounded-full bg-ink/50 transition active:scale-90">
          <X className="size-5" />
        </button>
        {status !== "unavailable" && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={statusLabel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
              className="label flex items-center gap-2 rounded-md bg-ink/60 px-2.5 py-1.5"
            >
              <span className={`size-1.5 rounded-full ${ready ? "bg-accent animate-blink" : "bg-paper/60"}`} />
              {statusLabel}
            </motion.span>
          </AnimatePresence>
        )}
        <span className="size-11" />
      </header>

      {status === "unavailable" ? (
        <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="relative z-10 m-auto flex max-w-xs flex-col items-center gap-4 px-6 text-center">
          <motion.span variants={fadeUp}>
            <CameraOff className="size-8 text-paper/70" strokeWidth={1.5} />
          </motion.span>
          <motion.p variants={fadeUp} className="text-lg font-semibold">
            Camera access isn&apos;t available. Upload an image instead.
          </motion.p>
          <motion.div variants={fadeUp} className="w-full pt-2">
            <UploadLabel onImage={onImage} className={buttonStyles("primary", "w-full")}>
              <Upload className="size-4" /> Upload Image
            </UploadLabel>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="relative z-10 flex flex-1 items-center justify-center px-12">
            <motion.div
              className="relative aspect-square w-full max-w-xs"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: frozenFrame ? 0.96 : 1 }}
              transition={{ duration: DURATION.base, ease: EASE }}
            >
              <FrameCorners className={ready ? "border-paper" : "border-paper/50"} size="size-8" />
              {/* Centre reticle */}
              <span aria-hidden className="absolute top-1/2 left-1/2 h-4 w-px -translate-1/2 bg-paper/60" />
              <span aria-hidden className="absolute top-1/2 left-1/2 h-px w-4 -translate-1/2 bg-paper/60" />
              {ready && (
                <span className="absolute inset-x-3 inset-y-3 animate-scan">
                  <span className="absolute inset-x-0 top-0 h-px bg-accent" />
                </span>
              )}
            </motion.div>
          </div>

          <footer className="relative z-10 flex flex-col items-center gap-6 px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <p className="text-sm text-paper/80">Point your camera at a waste item</p>
            <motion.div
              className="grid w-full max-w-xs grid-cols-3 items-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: status === "starting" ? 0.5 : 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE }}
            >
              <UploadLabel onImage={onImage} ariaLabel="Upload image" className="grid size-12 place-items-center justify-self-start rounded-lg bg-paper/10 transition hover:bg-paper/20 active:scale-90">
                <Upload className="size-5" />
              </UploadLabel>
              <motion.button
                onClick={shoot}
                disabled={!ready}
                aria-label="Capture and analyze"
                whileTap={{ scale: 0.92 }}
                className="grid size-[4.5rem] place-items-center justify-self-center rounded-full border-2 border-paper disabled:opacity-40"
              >
                <span className="size-14 rounded-full bg-paper transition-colors duration-150 hover:bg-accent-soft" />
              </motion.button>
              <span />
            </motion.div>
          </footer>
        </>
      )}
    </main>
  );
}
