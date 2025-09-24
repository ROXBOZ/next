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

    // Build the reading context
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

    // Create the prompt for AI interpretation
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

    // For demo purposes, I'll use a mock response
    // In production, you'd integrate with OpenAI, Claude, or another AI service
    const interpretation = await mockAIInterpretation(
      question,
      cardInterpretations
    );

    return {
      success: true,
      interpretation,
      cardInterpretations,
    };
  } catch (error) {
    console.error("Error generating tarot interpretation:", error);
    return {
      success: false,
      error: "Impossible de générer l'interprétation pour le moment.",
    };
  }
}

// Mock AI function - replace with actual AI service
async function mockAIInterpretation(question, cardInterpretations) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return `
**Interprétation de votre tirage**

Votre question "${question}" révèle une situation complexe que les cartes éclairent avec sagesse.

${cardInterpretations
  .map(
    (interp, i) =>
      `**${interp.position}** - ${interp.card.name}${
        interp.card.isReversed ? " (Inversée)" : ""
      }

  Dans le contexte de ${interp.positionMeaning.toLowerCase()}, cette carte suggère ${interp.card.description.toLowerCase()} Cette énergie ${
        interp.card.isReversed
          ? "inversée indique des blocages ou des leçons à apprendre"
          : "positive vous encourage à avancer"
      }.\n`
  )
  .join("\n")}

**Synthèse et conseils:**

Les cartes vous invitent à considérer l'ensemble de votre situation. ${
    cardInterpretations[0]?.card.name
  } vous rappelle l'importance de ${
    cardInterpretations[0]?.card.keywords[0]
  }, tandis que ${cardInterpretations[1]?.card.name} vous guide vers ${
    cardInterpretations[1]?.card.keywords[0]
  }.

La voie forward semble claire : embrassez les leçons du passé tout en restant ouvert aux opportunités futures.
  `.trim();
}

// Integration with actual AI services would look like this:
/*
async function callOpenAI(systemPrompt, userPrompt) {
  const response = await fetch('/api/ai-interpretation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, userPrompt })
  });

  const data = await response.json();
  return data.interpretation;
}
*/
