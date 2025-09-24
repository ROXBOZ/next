import { Dispatch, SetStateAction } from "react";

import { TarotCard } from "@/types/tarot";

/**
 * Fisher-Yates shuffle algorithm implementation
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generate random card reversals
 * @param cardIds - Array of card IDs
 * @param probability - Probability of reversal (default 0.5)
 * @returns Object mapping card IDs to reversal status
 */
export const generateCardReversals = (
  cardIds: number[],
  probability: number = 0.5
): Record<number, boolean> => {
  const reversals: Record<number, boolean> = {};
  cardIds.forEach((cardId) => {
    reversals[cardId] = Math.random() < probability;
  });
  return reversals;
};

/**
 * Shuffle cards and generate new reversals
 * @param cardOrder - Current card order
 * @param setCardOrder - Setter for card order
 * @param setCardReversals - Optional setter for card reversals
 */
export const shuffleCards = (
  cardOrder: number[],
  setCardOrder: Dispatch<SetStateAction<number[]>>,
  setCardReversals?: Dispatch<SetStateAction<Record<number, boolean>>>
): void => {
  const shuffledOrder = shuffleArray(cardOrder);
  const reversals = generateCardReversals(shuffledOrder);

  setCardOrder(shuffledOrder);
  if (setCardReversals) {
    setCardReversals(reversals);
  }
};

/**
 * Initialize card order from tarot cards data
 * @param cards - Array of tarot cards
 * @returns Array of card IDs in order
 */
export const initializeCardOrder = (cards: TarotCard[]): number[] => {
  return cards.map((card) => card.id);
};
