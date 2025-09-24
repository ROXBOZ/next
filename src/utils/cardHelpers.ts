import {
  ARCANA_EXPLANATIONS,
  CARD_ROTATION,
  MAJOR_ARCANA_THRESHOLD,
  POSITION_EXPLANATIONS,
} from "@/constants/tarot";
import { CardReversals, TarotCard } from "@/types/tarot";

/**
 * Generate a deterministic rotation based on card ID
 * @param cardId - The card ID
 * @returns Rotation angle in degrees
 */
export const getRandomRotation = (cardId: number): number => {
  const seed =
    cardId * CARD_ROTATION.SEED_MULTIPLIER + CARD_ROTATION.SEED_OFFSET;
  const randomValue = (seed % CARD_ROTATION.MODULO) / CARD_ROTATION.MODULO;
  return Math.floor((randomValue - 0.5) * CARD_ROTATION.MAX_DEGREES);
};

/**
 * Calculate the final rotation for a card including reversal
 * @param cardId - The card ID
 * @param isReversed - Whether the card is reversed
 * @returns Final rotation angle in degrees
 */
export const calculateCardRotation = (
  cardId: number,
  isReversed: boolean
): number => {
  const baseRotation = getRandomRotation(cardId);
  return isReversed
    ? baseRotation + CARD_ROTATION.REVERSED_OFFSET
    : baseRotation;
};

/**
 * Determine if a card is a Major Arcana
 * @param card - The tarot card
 * @returns True if the card is a Major Arcana
 */
export const isMajorArcana = (card: TarotCard): boolean => {
  return card.id <= MAJOR_ARCANA_THRESHOLD || card.arcana === "majeur";
};

/**
 * Get the appropriate description for a card based on reversal status
 * @param card - The tarot card
 * @param isReversed - Whether the card is reversed
 * @returns The appropriate description
 */
export const getCardDescription = (
  card: TarotCard,
  isReversed: boolean
): string => {
  return isReversed ? card.reversed : card.description;
};

/**
 * Get arcana type explanation
 * @param card - The tarot card
 * @returns Explanation text for the arcana type
 */
export const getArcanaExplanation = (card: TarotCard): string => {
  return isMajorArcana(card)
    ? ARCANA_EXPLANATIONS.MAJEUR
    : ARCANA_EXPLANATIONS.MINEUR;
};

/**
 * Get position explanation for card reversal status
 * @param isReversed - Whether the card is reversed
 * @returns Explanation text for the position
 */
export const getPositionExplanation = (isReversed: boolean): string => {
  return isReversed
    ? POSITION_EXPLANATIONS.REVERSED
    : POSITION_EXPLANATIONS.UPRIGHT;
};

/**
 * Get card box shadow based on reversal status
 * @param isReversed - Whether the card is reversed
 * @returns CSS box-shadow value
 */
export const getCardBoxShadow = (isReversed: boolean): string => {
  return isReversed
    ? "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 69, 19, 0.8)"
    : "0 10px 30px rgba(0, 0, 0, 0.4)";
};

/**
 * Find a card by its ID
 * @param cards - Array of tarot cards
 * @param cardId - The card ID to find
 * @returns The found card or undefined
 */
export const findCardById = (
  cards: TarotCard[],
  cardId: number
): TarotCard | undefined => {
  return cards.find((card) => card.id === cardId);
};

/**
 * Get cards with their reversal status
 * @param cardIds - Array of card IDs
 * @param cards - Array of all tarot cards
 * @param cardReversals - Card reversal status
 * @returns Array of cards with their data and reversal status
 */
export const getCardsWithReversals = (
  cardIds: number[],
  cards: TarotCard[],
  cardReversals: CardReversals
): Array<{ card: TarotCard; isReversed: boolean }> => {
  return cardIds.map((cardId) => {
    const card = findCardById(cards, cardId);
    const isReversed = cardReversals[cardId] || false;

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found`);
    }

    return { card, isReversed };
  });
};
