import {
  formatReadingMode,
  generateCardInterpretations,
  getPositionMeanings,
} from "./readingHelpers";

import { tarot_cards as cards } from "../data.json";

// Real AI integration with OpenAI
async function callOpenAI(systemPrompt, userPrompt) {
  try {
    const response = await fetch("/api/ai-interpretation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get AI interpretation");
    }

    return data.interpretation;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

export async function generateTarotInterpretation({
  question,
  selectedCards,
  cardReversals,
  readingMode,
}) {
  try {
    const cardInterpretations = generateCardInterpretations(
      selectedCards,
      cards,
      cardReversals,
      readingMode,
    );

    const systemPrompt = `You are an expert tarot reader with deep knowledge of card meanings, symbolism, and interpretation.

Your task is to provide a meaningful, insightful, and personalized tarot reading based on:
1. The user's specific question
2. The cards drawn and their positions
3. Whether cards are reversed or upright
4. The relationships between the cards

Provide a cohesive interpretation that:
- Addresses the user's question directly
- Explains each card in context of its position
- Shows how the cards relate to each other
- Offers practical guidance and insights
- Is compassionate and constructive

Write in French, using a warm and insightful tone.`;

    const userPrompt = `Question du consultant: "${question}"

Type de tirage: ${formatReadingMode(readingMode)}

Cartes tirées:
${cardInterpretations
  .map(
    (interp, i) =>
      `${i + 1}. ${interp.position} (${interp.positionMeaning}): ${
        interp.card.name
      } ${interp.card.isReversed ? "(inversée)" : "(droite)"}
   Description: ${interp.card.description}
  Mots-clés: ${(Array.isArray(interp.card.keywords) ? interp.card.keywords : []).join(", ")}`,
  )
  .join("\n\n")}

Merci de fournir une interprétation complète et personnalisée qui relie ces cartes entre elles pour répondre à la question posée.`;

    const interpretation = await callOpenAI(systemPrompt, userPrompt);

    return {
      success: true,
      interpretation,
    };
  } catch (error) {
    console.error("Error generating tarot interpretation:", error);
    return {
      success: false,
      error: "Impossible de générer l'interprétation pour le moment.",
    };
  }
}

// Export helper functions
export { getPositionMeanings };
