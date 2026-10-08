"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import type { LocationStatus } from "@/features/location/use-location";
import { DURATION, EASE } from "@/lib/motion";
import type { Recycler, WasteAnalysis } from "@/types/waste";
import { Disclosure } from "./disclosure";

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: DURATION.fast, ease: EASE } },
};

interface Props {
  analysis: WasteAnalysis;
  locationStatus: LocationStatus;
  localized: boolean;
  onRequestLocation: () => void;
}

export function RecyclerRow({ analysis, locationStatus, localized, onRequestLocation }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const finding = locationStatus === "requesting" || (locationStatus === "granted" && !localized);
  const failed = locationStatus === "denied" || locationStatus === "unavailable" || locationStatus === "error";
  const nearest = localized ? analysis.recyclers[0] : undefined;

  const view = localized ? "list" : finding ? "finding" : failed ? "failed" : dismissed ? "dismissed" : "ask";

  const summary = nearest?.distanceKm !== undefined ? (
    <span className="flex items-center gap-1 text-[15px] font-semibold tabular-nums">
      <MapPin className="size-4 text-accent" />
      {nearest.distanceKm} km
    </span>
  ) : finding ? (
    <span className="label text-faint animate-blink">Locating</span>
  ) : (
    <span className="text-sm font-semibold text-accent">Find near you</span>
  );

  return (
    <Disclosure label={localized ? "Nearby recycler" : "Find a recycler"} summary={summary}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} {...swap}>
          {view === "list" && <RecyclerList recyclers={analysis.recyclers} destination={analysis.destination} />}

          {view === "finding" && (
            <p className="text-[15px] text-muted" aria-live="polite">
              Finding recyclers near you…
            </p>
          )}

          {view === "ask" && (
            <div>
              <p className="text-lg font-semibold">Find recyclers near you</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted">Allow location access to find nearby recycling and disposal options.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button onClick={onRequestLocation}>Allow Location</Button>
                <Button variant="secondary" onClick={() => setDismissed(true)}>
                  Not Now
                </Button>
              </div>
            </div>
          )}

          {view === "dismissed" && (
            <Fallback destination={analysis.destination} message="Enable location to find recyclers near you." action="Enable Location" onAction={onRequestLocation} />
          )}

          {view === "failed" && (
            <div>
              <p className="font-semibold">Location access is unavailable</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">You can still view disposal guidance, estimated value, and environmental information.</p>
              <Fallback
                destination={analysis.destination}
                message={
                  locationStatus === "denied"
                    ? "Enable location to find recyclers near you. If nothing happens, allow location in your browser's site settings."
                    : "Enable location to find recyclers near you."
                }
                action="Try Location Again"
                onAction={onRequestLocation}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Disclosure>
  );
}

function Fallback({ destination, message, action, onAction }: { destination: string; message: string; action: string; onAction: () => void }) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      <p className="border-l-2 border-material pl-3 text-[15px]">Take it to {destination}.</p>
      <p className="text-sm text-muted">{message}</p>
      <Button variant="secondary" onClick={onAction}>
        {action}
      </Button>
    </div>
  );
}

function RecyclerList({ recyclers, destination }: { recyclers: Recycler[]; destination: string }) {
  if (recyclers.length === 0) {
    return <p className="text-[15px] text-muted">No listed recyclers nearby. Take it to {destination}.</p>;
  }
  return (
    <div>
      <ul className="border-t border-line">
        {recyclers.slice(0, 2).map((r, i) => (
          <motion.li
            key={r.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE, delay: i * 0.06 } }}
            className="flex items-start gap-4 border-b border-line py-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">{r.name}</p>
              <p className="mt-0.5 text-sm text-muted">
                {r.type} · {r.location}
                {r.hours && ` · ${r.hours}`}
              </p>
              <p className="label mt-2 text-material">Accepts {r.accepts.join(" · ")}</p>
            </div>
            {r.distanceKm !== undefined && <span className="text-[15px] font-semibold tabular-nums">{r.distanceKm} km</span>}
          </motion.li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-faint">Demo listings — not live availability.</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${recyclers[0].type} near me`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:text-accent-strong"
        >
          View on Maps <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}
