import { delay } from "@/lib/delay";
import type { Verdict, WasteAnalysis, WasteDetection, WasteKnowledge, WasteValue } from "@/types/waste";
import type { WasteAgent } from "./types";

/**
 * Template-based agent: combines trusted knowledge into plain-language answers.
 * A real LLM agent can implement the same interface, using the knowledge as grounding.
 */
export class MockWasteAgent implements WasteAgent {
  async analyze(detection: WasteDetection, knowledge: WasteKnowledge): Promise<WasteAnalysis> {
    await delay(700);
    const recycler = knowledge.recyclers[0];
    const verdict = getVerdict(knowledge);
    const estimatedValue = formatValue(knowledge.value);

    return {
      identification: {
        name: knowledge.displayName,
        material: detection.material,
        category: knowledge.categoryLabel,
        confidence: detection.confidence,
      },
      verdict,
      disposal: {
        instruction: knowledge.disposalInstruction,
        preparationSteps: knowledge.preparationSteps,
        warnings: knowledge.warnings,
      },
      value: { estimatedValue, unit: knowledge.value.unit, explanation: knowledge.value.explanation },
      earning: knowledge.earning,
      recycler: {
        name: recycler?.name ?? "Your local municipal collection",
        type: recycler?.type ?? "Collection service",
        location: recycler?.location ?? "Ask your ward office for the nearest point",
        distance: recycler?.distanceKm !== undefined ? `${recycler.distanceKm} km away` : undefined,
        hours: recycler?.hours,
      },
      environmentalImpact: {
        explanation: `${knowledge.impact.harm} ${knowledge.impact.benefit}`,
        ...knowledge.impact,
      },
      spokenSummary: [
        `This looks like a ${knowledge.displayName}.`,
        verdict.headline + ".",
        knowledge.disposalInstruction,
        knowledge.value.max > 0 ? `Estimated value is ${estimatedValue} ${knowledge.value.unit}.` : knowledge.earning.method + ".",
      ].join(" "),
    };
  }

  async answer(question: string, a: WasteAnalysis): Promise<string> {
    await delay(500);
    const q = question.toLowerCase();
    const name = a.identification.name;
    const has = (...words: string[]) => words.some((w) => q.includes(w));

    if (has("remove", "before", "prepare", "clean", "wash", "rinse", "cap", "label", "tape")) {
      return `Before disposing of your ${name}: ${a.disposal.preparationSteps.join("; ").toLowerCase()}.`;
    }
    if (has("worth", "much", "price", "value", "money", "earn", "sell", "pay", "cash", "₹", "rupee")) {
      const value =
        a.value.estimatedValue === "No resale value"
          ? "It has no resale value."
          : `The estimated value is ${a.value.estimatedValue} ${a.value.unit} — prices vary by dealer and condition.`;
      return `${value} ${a.earning.method}. ${a.earning.explanation}`;
    }
    if (has("where", "take", "drop", "near", "recycler", "dealer", "centre", "center", "location")) {
      const distance = a.recycler.distance ? `, about ${a.recycler.distance}` : "";
      const hours = a.recycler.hours ? ` It's open ${a.recycler.hours}.` : "";
      return `Take it to ${a.recycler.name} (${a.recycler.type.toLowerCase()}) at ${a.recycler.location}${distance}.${hours}`;
    }
    if (has("harm", "why", "bad", "environment", "impact", "pollut", "danger", "toxic", "planet")) {
      return `${a.environmentalImpact.harm} ${a.environmentalImpact.benefit} ${a.environmentalImpact.fact}`;
    }
    if (has("recycl", "bin", "throw", "dispose", "trash", "garbage", "what do", "what should")) {
      const warning = a.disposal.warnings[0] ? ` ${a.disposal.warnings[0]}` : "";
      return `${a.verdict.headline}. ${a.disposal.instruction}${warning}`;
    }
    if (has("sure", "confiden", "accurate", "right", "what is", "what's this")) {
      return `I'm ${Math.round(a.identification.confidence * 100)}% confident this is a ${name} made of ${a.identification.material}. If that's wrong, tap "Not right?" to correct it.`;
    }
    return `I can help with your ${name}: whether it's recyclable, how to prepare it, what it's worth, where to take it, or why it matters. What would you like to know?`;
  }
}

function getVerdict(k: WasteKnowledge): { kind: Verdict; headline: string } {
  if (k.hazardous && k.itemId === "battery") return { kind: "hazardous", headline: "Hazardous — use a battery drop-off" };
  if (k.hazardous) return { kind: "special", headline: "Recyclable at an e-waste centre only" };
  return { kind: "recycle", headline: "Yes, this is recyclable" };
}

function formatValue(v: WasteValue): string {
  if (v.max === 0) return "No resale value";
  return v.min === v.max ? `${v.currency}${v.min}` : `${v.currency}${v.min}–${v.max}`;
}
