import { Icon } from "@/components/icon";
import type { Verdict, WasteAnalysis } from "@/types/waste";
import { Section } from "./section";

const VERDICT_STYLE: Record<Verdict, { card: string; icon: "check" | "alert" }> = {
  recycle: { card: "bg-brand-deep text-white", icon: "check" },
  special: { card: "bg-warn-soft text-warn ring-1 ring-warn/20", icon: "alert" },
  hazardous: { card: "bg-danger-soft text-danger ring-1 ring-danger/20", icon: "alert" },
};

export function VerdictCard({ analysis, action }: { analysis: WasteAnalysis; action: React.ReactNode }) {
  const style = VERDICT_STYLE[analysis.verdict.kind];
  return (
    <section className={`rounded-3xl p-5 animate-rise [animation-delay:80ms] ${style.card}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium opacity-80">What should I do with it?</p>
        {action}
      </div>
      <h2 className="mt-2 flex items-center gap-2 text-2xl leading-tight font-bold">
        <Icon name={style.icon} className="size-7 shrink-0" />
        {analysis.verdict.headline}
      </h2>
      <p className="mt-2 leading-relaxed opacity-90">{analysis.disposal.instruction}</p>
    </section>
  );
}

export function DisposalSection({ analysis }: { analysis: WasteAnalysis }) {
  const { preparationSteps, warnings } = analysis.disposal;
  return (
    <Section icon="recycle" title="Prepare it" delay={160}>
      <ol className="flex flex-col gap-3">
        {preparationSteps.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-deep">{i + 1}</span>
            <span className="font-medium">{step}</span>
          </li>
        ))}
      </ol>
      {warnings.map((w) => (
        <p key={w} className="mt-4 flex gap-2 rounded-2xl bg-warn-soft p-3 text-sm font-medium text-warn">
          <Icon name="alert" className="size-4 shrink-0 translate-y-0.5" /> {w}
        </p>
      ))}
    </Section>
  );
}

export function ValueSection({ analysis }: { analysis: WasteAnalysis }) {
  const { value, earning } = analysis;
  return (
    <Section icon="coins" title="Estimated value" delay={240}>
      <p className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">{value.estimatedValue}</span>
        {value.estimatedValue !== "No resale value" && <span className="text-muted">{value.unit}</span>}
      </p>
      <p className="mt-1 text-sm text-muted">{value.explanation} Estimate only — actual prices vary.</p>
      <div className="mt-4 rounded-2xl bg-brand-soft p-4">
        <p className="text-xs font-semibold tracking-wide text-brand-deep uppercase">How to earn from it</p>
        <p className="mt-1 font-semibold text-brand-deep">{earning.method}</p>
        <p className="mt-1 text-sm leading-relaxed text-brand-deep/80">{earning.explanation}</p>
      </div>
    </Section>
  );
}

export function RecyclerSection({ analysis }: { analysis: WasteAnalysis }) {
  const r = analysis.recycler;
  return (
    <Section icon="pin" title="Where to take it" delay={320}>
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-deep text-lime">
          <Icon name="pin" className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-lg leading-tight font-semibold">{r.name}</p>
          <p className="text-sm text-muted">{r.type} · {r.location}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            {r.distance && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-brand-deep">{r.distance}</span>}
            {r.hours && (
              <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1">
                <Icon name="clock" className="size-3" /> {r.hours}
              </span>
            )}
            <span className="rounded-full bg-canvas px-2.5 py-1 text-muted">Demo location</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ImpactSection({ analysis }: { analysis: WasteAnalysis }) {
  const { harm, benefit, fact } = analysis.environmentalImpact;
  return (
    <Section icon="leaf" title="Why it matters" delay={400}>
      <div className="flex flex-col gap-3">
        <p className="flex gap-3 text-sm leading-relaxed">
          <Icon name="x" className="size-5 shrink-0 text-danger" />
          <span><strong className="font-semibold">If dumped: </strong>{harm}</span>
        </p>
        <p className="flex gap-3 text-sm leading-relaxed">
          <Icon name="check" className="size-5 shrink-0 text-brand" />
          <span><strong className="font-semibold">Done right: </strong>{benefit}</span>
        </p>
      </div>
      <p className="mt-4 rounded-2xl bg-lime/40 p-4 text-sm font-semibold text-brand-deep">{fact}</p>
    </Section>
  );
}
