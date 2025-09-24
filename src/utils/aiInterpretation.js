import { tarot_cards as cards } from "../data.json";

// Reading position configurations with meanings
const POSITION_MEANINGS = {
  "3-cards": [
    {
      index: 0,
      title: "Passé",
      meaning:
        "past influences and experiences that led to the current situation",
    },
    {
      index: 1,
      title: "Présent",
      meaning: "current situation and energies at play",
    },
    {
      index: 2,
      title: "Avenir",
      meaning: "potential future outcome and what to expect",
    },
  ],
  "5-cards": [
    {
      index: 0,
      title: "Présent",
      meaning: "current situation and immediate influences",
    },
    {
      index: 1,
      title: "Défi",
      meaning: "main challenge or obstacle to overcome",
    },
    {
      index: 2,
      title: "Passé",
      meaning: "past influences that shape the current situation",
    },
    {
      index: 3,
      title: "Avenir",
      meaning: "potential future outcome and what to expect",
    },
    {
      index: 4,
      title: "Aide",
      meaning: "guidance, advice, and resources available to help",
    },
  ],
};

export async function generateTarotInterpretation({
  question,
  selectedCards,
  cardReversals,
  readingMode,
}) {
  try {
    const positions = POSITION_MEANINGS[readingMode];

    const cardInterpretations = positions.map(({ index, title, meaning }) => {
      const cardId = selectedCards[index];
      const card = cards.find((c) => c.id === cardId);
      const isReversed = cardReversals[cardId] || false;

      return {
        position: title,
        positionMeaning: meaning,
        card: {
          name: card.name,
          arcana: card.arcana,
          description: isReversed ? card.reversed : card.description,
          keywords: card.keywords,
          isReversed,
        },
      };
    });

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

Type de tirage: ${
      readingMode === "3-cards" ? "Tirage à 3 cartes" : "Tirage à 5 cartes"
    }

Cartes tirées:
${cardInterpretations
  .map(
    (interp, i) =>
      `${i + 1}. ${interp.position} (${interp.positionMeaning}): ${
        interp.card.name
      }${interp.card.isReversed ? " (Inversée)" : ""}
     Signification: ${interp.card.description}
     Mots-clés: ${interp.card.keywords.join(", ")}`
  )
  .join("\n")}

Veuillez fournir une interprétation complète et personnalisée de ce tirage en français.`;

    // Call the real AI API - with proper error handling
    console.log("🤖 Attempting OpenAI API call...");
    try {
      const interpretation = await callOpenAI(systemPrompt, userPrompt);
      console.log("✅ OpenAI API success!");

      return {
        success: true,
        interpretation,
        cardInterpretations,
      };
    } catch (apiError) {
      console.error("❌ OpenAI API error:", apiError.message);

      // Return the actual error message from the API
      return {
        success: false,
        error:
          apiError.message ||
          "Impossible de générer l'interprétation pour le moment.",
      };
    }
  } catch (error) {
    console.error("Error generating tarot interpretation:", error);
    return {
      success: false,
      error: "Erreur inattendue lors de la génération de l'interprétation.",
    };
  }
}

// Real AI integration with OpenAI
async function callOpenAI(systemPrompt, userPrompt) {
  const response = await fetch("/api/ai-interpretation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, userPrompt }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Failed to get AI interpretation");
  }

  return data.interpretation;
}

// Export position meanings for card explanations
export function getPositionMeanings(readingMode) {
  return POSITION_MEANINGS[readingMode] || [];
}
