"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraStatus = "starting" | "ready" | "unavailable";

/** Streams the rear camera into a <video> and captures frames as JPEG blobs. */
export function useCamera() {
  const video = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<CameraStatus>("starting");
  const stream = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) return setStatus("unavailable");
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) return media.getTracks().forEach((t) => t.stop());
        stream.current = media;
        if (video.current) {
          video.current.srcObject = media;
          await video.current.play();
        }
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    start();
    return () => {
      cancelled = true;
      stream.current?.getTracks().forEach((t) => t.stop());
      stream.current = null;
    };
  }, []);

  const capture = useCallback(async (): Promise<Blob | null> => {
    const el = video.current;
    if (!el || !el.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = el.videoWidth;
    canvas.height = el.videoHeight;
    canvas.getContext("2d")?.drawImage(el, 0, 0);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
  }, []);

  return { video, status, capture };
}
