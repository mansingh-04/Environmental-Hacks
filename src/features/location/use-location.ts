"use client";

import { useCallback, useRef, useState } from "react";
import { location as provider } from "@/providers";
import { LocationError } from "@/providers/location/types";
import type { GeoPoint } from "@/types/waste";

export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "error";

export interface LocationState {
  status: LocationStatus;
  coords?: GeoPoint;
  /** Prompts the browser for permission (only call from a user action). */
  request: () => Promise<void>;
  /** Fetches silently if permission was granted before; never shows a prompt. */
  resumeIfGranted: () => Promise<void>;
}

export function useLocation(): LocationState {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [coords, setCoords] = useState<GeoPoint>();
  const busy = useRef(false);

  const request = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setStatus("requesting");
    try {
      const { latitude, longitude } = await provider.getCurrentLocation();
      setCoords({ lat: latitude, lng: longitude });
      setStatus("granted");
    } catch (err) {
      setStatus(err instanceof LocationError ? err.kind : "error");
    } finally {
      busy.current = false;
    }
  }, []);

  const resumeIfGranted = useCallback(async () => {
    if (await provider.isAlreadyGranted()) await request();
  }, [request]);

  return { status, coords, request, resumeIfGranted };
}
