import { delay } from "@/lib/delay";
import { formatValue } from "@/lib/format";
import type { ConversationContext } from "@/types/conversation";
import type { Verdict, WasteAnalysis, WasteDetection, WasteKnowledge } from "@/types/waste";
import { detectIntent } from "./intents";
import { composeAnswer, identify } from "./responses";
import type { WasteAgent } from "./types";

/**
 * Template-based agent: combines trusted knowledge into short, natural answers in the user's language.
 * A real multilingual LLM agent can implement the same interface, using the knowledge as grounding.
 */
export class MockWasteAgent implements WasteAgent {
  async analyze(detection: WasteDetection, knowledge: WasteKnowledge): Promise<WasteAnalysis> {
    await delay(700);
    const verdict = getVerdict(knowledge);
    const estimatedValue = formatValue(knowledge.value);

    return {
      identification: {
        itemId: knowledge.itemId,
        categoryKey: knowledge.category,
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
      value: { ...knowledge.value, estimatedValue },
      earning: knowledge.earning,
      destination: knowledge.destination,
      recyclers: [],
      environmentalImpact: {
        explanation: `${knowledge.impact.harm} ${knowledge.impact.benefit}`,
        ...knowledge.impact,
      },
    };
  }

  async answer(question: string, context: ConversationContext): Promise<string> {
    await delay(450);
    const { analysis, language, script, messages } = context;
    const intent = detectIntent(question);
    const answer = composeAnswer(intent, analysis, language, script);
    // Introduce the object once per language; later turns go straight to the point.
    const firstInLanguage = !messages.some((m) => m.role === "assistant" && m.language === language);
    return firstInLanguage && intent !== "confidence" && intent !== "fallback" ? `${identify(analysis, language, script)} ${answer}` : answer;
  }
}

function getVerdict(k: WasteKnowledge): { kind: Verdict; headline: string } {
  if (k.hazardous && k.itemId === "battery") return { kind: "hazardous", headline: "Hazardous — use a battery drop-off" };
  if (k.hazardous) return { kind: "special", headline: "Recyclable at an e-waste centre only" };
  return { kind: "recycle", headline: "Yes, this is recyclable" };
}
