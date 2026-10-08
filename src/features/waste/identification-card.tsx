"use client";

import { useState } from "react";
import { WASTE_ITEMS } from "@/data/waste/items";
import type { WasteAnalysis, WasteItemId } from "@/types/waste";

export function IdentificationCard({
  analysis,
  imageUrl,
  onCorrect,
}: {
  analysis: WasteAnalysis;
  imageUrl: string;
  onCorrect: (itemId: WasteItemId) => void;
}) {
  const { name, material, category, confidence } = analysis.identification;
  const [picking, setPicking] = useState(false);
  const pct = Math.round(confidence * 100);

  return (
    <section className="rounded-3xl bg-surface p-4 ring-1 ring-line animate-rise">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
        <img src={imageUrl} alt={name} className="size-24 shrink-0 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">Detected</p>
          <h1 className="text-2xl leading-tight font-bold tracking-tight">{name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-muted">{pct === 100 ? "Confirmed" : `${pct}% match`}</span>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-canvas px-3 py-2">
          <dt className="text-xs text-muted">Material</dt>
          <dd className="font-semibold">{material}</dd>
        </div>
        <div className="rounded-xl bg-canvas px-3 py-2">
          <dt className="text-xs text-muted">Category</dt>
          <dd className="font-semibold">{category}</dd>
        </div>
      </dl>

      <button onClick={() => setPicking((p) => !p)} className="mt-3 text-sm font-medium text-muted underline underline-offset-4">
        {picking ? "Cancel" : "Not right?"}
      </button>
      {picking && (
        <div className="mt-3 flex flex-wrap gap-2 animate-rise">
          {Object.values(WASTE_ITEMS).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPicking(false);
                onCorrect(item.id);
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${item.name === name ? "bg-brand-deep text-white ring-brand-deep" : "bg-surface ring-line"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
