import { Dispatch, SetStateAction } from "react";
import { playCardSelectionSound, playDenySound } from "@/utils/sound";

import { MAX_CARDS } from "@/constants/tarot";
import { ReadingMode } from "@/types/tarot";
import { showToast } from "@/utils/toast";

/**
 * Handle card selection logic
 * @param cardId - ID of the selected card
 * @param selectedCards - Currently selected cards
 * @param setSelectedCards - Setter for selected cards
 * @param cardOrder - Current deck order
 * @param setCardOrder - Setter for deck order
 * @param readingMode - Current reading mode
 */
export const handleCardSelect = (
  cardId: number,
  selectedCards: number[],
  setSelectedCards: Dispatch<SetStateAction<number[]>>,
  cardOrder: number[],
  setCardOrder: Dispatch<SetStateAction<number[]>>,
  readingMode: ReadingMode,
): void => {
  const maxCards = MAX_CARDS[readingMode];

  setSelectedCards((currentSelected) => {
    if (currentSelected.length < maxCards) {
      setCardOrder((currentOrder) => {
        return currentOrder.filter((id) => id !== cardId);
      });

      const newSelected = [...currentSelected, cardId];

      playCardSelectionSound();

      return newSelected;
    } else {
      playDenySound();
      showToast({
        message: `Maximum ${maxCards} cartes!`,
        type: "warning",
      });
      return currentSelected;
    }
  });
};

/**
 * Reset card selection and return cards to deck
 * @param selectedCards - Currently selected cards
 * @param setSelectedCards - Setter for selected cards
 * @param cardOrder - Current deck order
 * @param setCardOrder - Setter for deck order
 * @param shuffleCallback - Optional callback to shuffle cards after reset
 */
export const resetSelection = (
  selectedCards: number[],
  setSelectedCards: Dispatch<SetStateAction<number[]>>,
  cardOrder: number[],
  setCardOrder: Dispatch<SetStateAction<number[]>>,
  shuffleCallback?: (
    newOrder: number[],
    setOrder: Dispatch<SetStateAction<number[]>>,
  ) => void,
): void => {
  const newCardOrder = [...cardOrder, ...selectedCards];
  setSelectedCards([]);

  if (shuffleCallback) {
    shuffleCallback(newCardOrder, setCardOrder);
  } else {
    setCardOrder(newCardOrder);
  }
};

/**
 * Check if card selection is valid
 * @param selectedCards - Currently selected cards
 * @param readingMode - Current reading mode
 * @returns True if selection is valid
 */
export const isSelectionValid = (
  selectedCards: number[],
  readingMode: ReadingMode,
): boolean => {
  const maxCards = MAX_CARDS[readingMode];
  return selectedCards.length <= maxCards;
};

/**
 * Check if reading is complete
 * @param selectedCards - Currently selected cards
 * @param readingMode - Current reading mode
 * @returns True if reading is complete
 */
export const isReadingComplete = (
  selectedCards: number[],
  readingMode: ReadingMode,
): boolean => {
  const maxCards = MAX_CARDS[readingMode];
  return selectedCards.length === maxCards;
};
