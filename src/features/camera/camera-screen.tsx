"use client";

import { useState } from "react";
import { buttonStyles } from "@/components/button";
import { Icon } from "@/components/icon";
import { UploadLabel } from "@/components/upload-button";
import { useCamera } from "./use-camera";

export function CameraScreen({ onImage, onClose }: { onImage: (image: Blob) => void; onClose: () => void }) {
  const { video, status, capture } = useCamera();
  const [flash, setFlash] = useState(false);

  async function shoot() {
    setFlash(true);
    const image = await capture();
    if (image) onImage(image);
    else setFlash(false);
  }

  return (
    <main className="fixed inset-0 flex flex-col bg-black text-white">
      <video ref={video} playsInline muted className="absolute inset-0 size-full object-cover" />
      <div className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-200 ${flash ? "opacity-70" : "opacity-0"}`} />

      <header className="relative z-10 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button onClick={onClose} aria-label="Close camera" className="grid size-11 place-items-center rounded-full bg-black/40 backdrop-blur">
          <Icon name="close" />
        </button>
        <span className="rounded-full bg-black/40 px-3 py-1.5 text-sm font-semibold backdrop-blur">CleanItUp</span>
        <span className="size-11" />
      </header>

      {status === "unavailable" ? (
        <div className="relative z-10 m-auto flex max-w-xs flex-col items-center gap-5 px-6 text-center animate-rise">
          <span className="grid size-16 place-items-center rounded-2xl bg-white/10">
            <Icon name="camera" className="size-8" />
          </span>
          <p className="text-lg font-semibold">Camera access isn&apos;t available. Upload an image instead.</p>
          <UploadLabel onImage={onImage} className={buttonStyles("primary", "w-full bg-lime! text-brand-deep!")}>
            <Icon name="upload" /> Upload Image
          </UploadLabel>
        </div>
      ) : (
        <>
          <div className="relative z-10 flex flex-1 items-center justify-center px-10">
            <div className="relative aspect-square w-full max-w-sm">
              {(["top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl", "top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl", "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl", "bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl"]).map((c) => (
                <span key={c} className={`absolute size-12 border-lime ${c}`} />
              ))}
              {status === "ready" && (
                <span className="absolute inset-x-4 h-0.5 rounded-full bg-lime shadow-[0_0_16px_4px] shadow-lime/60 animate-scan" />
              )}
            </div>
          </div>

          <footer className="relative z-10 flex flex-col items-center gap-6 px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <p className="rounded-full bg-black/50 px-4 py-2 text-sm font-medium backdrop-blur">
              {status === "starting" ? "Starting camera…" : "Point your camera at a waste item"}
            </p>
            <div className="grid w-full max-w-sm grid-cols-3 items-center">
              <UploadLabel onImage={onImage} ariaLabel="Upload image" className="grid size-12 place-items-center justify-self-start rounded-2xl bg-white/15 backdrop-blur">
                <Icon name="upload" />
              </UploadLabel>
              <button
                onClick={shoot}
                disabled={status !== "ready"}
                aria-label="Capture and analyze"
                className="grid size-20 place-items-center justify-self-center rounded-full border-4 border-white/90 transition active:scale-95 disabled:opacity-40"
              >
                <span className="size-16 rounded-full bg-lime animate-pulse-ring" />
              </button>
              <span />
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
