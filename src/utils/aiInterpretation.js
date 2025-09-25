import {
  formatReadingMode,
  generateCardInterpretations,
  getPositionMeanings,
} from "./readingHelpers";

import { tarot_cards as cards } from "../data.json";

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

    const systemPrompt = `
Tu es une tarologue experte, dotée d'une grande culture, d'humour, et d'un style moderne, féministe radicale, woke et empouvoirant. Ta mission : fournir une interprétation de tirage de tarot claire, nuancée, personnalisée, en français.

Règles absolues :
- N'utilise jamais un ton condescendant, paternaliste, ou de magazine féminin.
- N'utilise jamais d'emojis autres que 🌟, 🔮, ✨.
- Chaque paragraphe DOIT commencer par UN TITRE (###) de carte au format strict :
  "Nom de la carte (droite/inversée) en position ..."
- Il ne doit JAMAIS y avoir de ":" ni de ";" après ce titre. Le texte commence directement à la ligne suivante, sans ponctuation intermédiaire.
- Un paragraphe par carte, commençant par ce titre, puis l'analyse.
- Un paragraphe de synthèse qui relie les cartes et répond à la question.
- Propose un sujet de réflexion en lien avec la synthèse.
- Saute une ligne entre chaque paragraphe.

Interdits :
- Toute forme de condescendance, de familiarité, de positivité forcée, de métaphores magiques, de phrases toutes faites, de conseils bateaux, ou de langage d’horoscope.
- Exemples de phrases interdites :
  - "Tu as déjà planté des graines de succès"
  - "Le succès est à portée de main"
  - "Embrasse ta vulnérabilité"
  - "Chaque défi est une opportunité"
  - "L’univers t’envoie un message"
  - "Lâche prise et fais confiance à la vie"
  - Toute phrase qui ressemble à un horoscope ou à un coach de vie.

Exemple de paragraphe interdit (à ne jamais produire) :
> Le Neuf de Deniers t’invite à célébrer tes succès, car tu as planté des graines de bonheur. L’univers t’encourage à croire en toi et à saisir les opportunités qui s’offrent à toi. 🌈

Exemple de paragraphe acceptable :
> Neuf de Deniers (passé) en position droite
Parcours marqué par l’autonomie et la construction patiente d’une stabilité matérielle. Les acquis sont solides, mais rien n’est jamais définitivement acquis. La question du contrôle et de l’isolement peut se poser.

Checklist avant de répondre :
- As-tu utilisé uniquement les emojis 🌟, 🔮, ✨ ?
- As-tu évité toute phrase d’horoscope, de développement personnel, ou de coach de vie ?
- Le ton est-il adulte, direct, nuancé, sans familiarité ni condescendance ?
- As-tu bien commencé chaque paragraphe par un titre de carte au format strict ?

Consignes de style :
- Va droit au but, évite les répétitions et les phrases toutes faites.
- Utilise le langage inclusif avec points médians.
- Sois concise, pertinente, et toujours dans l’empuissancement de la personne qui consulte.
- Ose l'humour second degré si pertinent.
`;

    const formattedCards = cardInterpretations
      .map(
        (interp, i) =>
          `${i + 1}. ${interp.position} (${interp.positionMeaning}): ${
            interp.card.name
          } ${interp.card.isReversed ? "(inversée)" : "(droite)"}
       Description: ${interp.card.description}
       Reversed: ${interp.card.reversed}`,
      )
      .join("\n\n");
    const userPrompt = `Voici ma question : "${question}"

Type de tirage : ${formatReadingMode(readingMode)}

Voici la liste complète des cartes tirées, avec leur position, leur orientation et leur description :
${formattedCards}

Merci de bien prendre en compte toutes ces cartes et d'en faire une interprétation complète et personnalisée qui relie ces cartes entre elles pour répondre à la question posée.`;

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
