import { Icon } from "@/components/icon";
import type { AnalysisStage } from "./pipeline";

const STEPS: { stage: AnalysisStage; label: string }[] = [
  { stage: "vision", label: "Identifying your waste…" },
  { stage: "agent", label: "Checking what you can do with it…" },
];

export function AnalyzingScreen({ imageUrl, stage }: { imageUrl: string; stage: AnalysisStage }) {
  const current = STEPS.findIndex((s) => s.stage === stage);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-10 px-6">
      <div className="relative aspect-square w-64 overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-deep/20 animate-rise">
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
        <img src={imageUrl} alt="Captured item" className="size-full object-cover" />
        <div className="absolute inset-0 bg-brand-deep/25" />
        <span className="absolute inset-x-0 h-1 bg-lime shadow-[0_0_24px_6px] shadow-lime/70 animate-scan" />
      </div>

      <ol className="flex w-full max-w-xs flex-col gap-3">
        {STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.stage} className={`flex items-center gap-3 transition-opacity ${i > current ? "opacity-30" : ""}`}>
              <span className={`grid size-7 shrink-0 place-items-center rounded-full ${done ? "bg-brand text-white" : "bg-surface ring-1 ring-line"}`}>
                {done ? (
                  <Icon name="check" className="size-4" />
                ) : (
                  <span className={`size-3 rounded-full ${active ? "animate-ping bg-brand" : "bg-line"}`} />
                )}
              </span>
              <span className={`font-medium ${active ? "text-ink" : "text-muted"}`}>{s.label}</span>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
