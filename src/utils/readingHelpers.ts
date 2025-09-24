import {
  CardInterpretation,
  ReadingMode,
  TarotCard,
  TarotReading,
} from "@/types/tarot";
import {
  findCardById,
  getArcanaExplanation,
  getCardDescription,
  getPositionExplanation,
  isMajorArcana,
} from "@/utils/cardHelpers";

import { READING_CONFIGS } from "@/constants/tarot";

/**
 * Get position meanings for a specific reading mode
 * @param readingMode - The reading mode
 * @returns Array of position configurations
 */
export const getPositionMeanings = (readingMode: ReadingMode) => {
  return READING_CONFIGS[readingMode];
};

/**
 * Generate card interpretations for a reading
 * @param selectedCards - Array of selected card IDs
 * @param cards - Array of all tarot cards
 * @param cardReversals - Card reversal status
 * @param readingMode - The reading mode
 * @returns Array of card interpretations
 */
export const generateCardInterpretations = (
  selectedCards: number[],
  cards: TarotCard[],
  cardReversals: Record<number, boolean>,
  readingMode: ReadingMode
): CardInterpretation[] => {
  const positions = getPositionMeanings(readingMode);

  return positions.map(({ index, title, meaning }) => {
    const cardId = selectedCards[index];
    const card = findCardById(cards, cardId);

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found`);
    }

    const isReversed = cardReversals[cardId] || false;

    return {
      position: title,
      positionMeaning: meaning,
      card: {
        name: card.name,
        arcana: card.arcana,
        description: getCardDescription(card, isReversed),
        keywords: card.keywords,
        isReversed,
      },
    };
  });
};

/**
 * Generate detailed card explanations for manual interpretation
 * @param reading - The tarot reading data
 * @param cards - Array of all tarot cards
 * @returns Formatted explanation string
 */
export const generateCardExplanations = (
  reading: TarotReading,
  cards: TarotCard[]
): string => {
  const { question, selectedCards, cardReversals, readingMode } = reading;
  const positions = getPositionMeanings(readingMode);

  let explanation = `**Question :** "${question}"\n\n`;

  selectedCards.forEach((cardId, index) => {
    const card = findCardById(cards, cardId);
    if (!card) return;

    const position = positions[index];
    const isReversed = cardReversals[cardId] || false;
    const arcanaType = isMajorArcana(card) ? "Arcane Majeur" : "Arcane Mineur";

    // Add explanations for arcana type and position
    const arcanaExplanation = getArcanaExplanation(card);
    const positionExplanation = getPositionExplanation(isReversed);

    explanation += `🔮 **${position.title} - ${card.name}**\n`;
    explanation += `${getCardDescription(card, isReversed)}\n`;
    explanation += `**${arcanaType} (${card.number}) :** ${arcanaExplanation}\n`;
    explanation += `${
      isReversed
        ? `**Position inversée :** ${
            positionExplanation.charAt(0).toLowerCase() +
            positionExplanation.slice(1)
          }\n\n`
        : `**Position droite :** ${
            positionExplanation.charAt(0).toLowerCase() +
            positionExplanation.slice(1)
          }\n\n`
    }`;
  });

  return explanation;
};

/**
 * Format reading mode for display
 * @param readingMode - The reading mode
 * @returns Formatted string for display
 */
export const formatReadingMode = (readingMode: ReadingMode): string => {
  return readingMode === "3-cards" ? "Tirage à 3 cartes" : "Tirage à 5 cartes";
};

/**
 * Validate reading completeness
 * @param reading - The tarot reading data
 * @returns True if reading is valid and complete
 */
export const isValidReading = (reading: TarotReading): boolean => {
  const { selectedCards, readingMode, question } = reading;
  const requiredCards = readingMode === "3-cards" ? 3 : 5;

  return (
    question.trim().length > 0 &&
    selectedCards.length === requiredCards &&
    readingMode !== null
  );
};
