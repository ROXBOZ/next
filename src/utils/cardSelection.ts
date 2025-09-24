import { Dispatch, SetStateAction } from "react";

import { MAX_CARDS } from "@/constants/tarot";
import { ReadingMode } from "@/types/tarot";
import { playCardSelectionSound } from "@/utils/sound";
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
  readingMode: ReadingMode
): void => {
  const maxCards = MAX_CARDS[readingMode];

  console.log("🎯 CARD SELECTION ATTEMPT:", {
    cardId,
    currentSelectedLength: selectedCards.length,
    selectedCards: [...selectedCards],
    maxCards,
    readingMode,
    timestamp: new Date().toISOString(),
  });

  setSelectedCards((currentSelected) => {
    console.log("🔄 INSIDE setSelectedCards:", {
      cardId,
      currentSelectedLength: currentSelected.length,
      currentSelected: [...currentSelected],
      maxCards,
      canSelect: currentSelected.length < maxCards,
    });

    if (currentSelected.length < maxCards) {
      // Remove card from deck
      setCardOrder((currentOrder) => {
        console.log("🗂️ REMOVING from deck:", {
          cardId,
          deckSizeBefore: currentOrder.length,
          deckSizeAfter: currentOrder.filter((id) => id !== cardId).length,
        });
        return currentOrder.filter((id) => id !== cardId);
      });

      const newSelected = [...currentSelected, cardId];
      console.log("✅ CARD SELECTED:", {
        cardId,
        newSelectedLength: newSelected.length,
        newSelected: [...newSelected],
        positionIndex: newSelected.length - 1,
      });

      // Play card selection sound
      playCardSelectionSound();

      return newSelected;
    } else {
      console.log("❌ SELECTION BLOCKED:", {
        cardId,
        currentSelectedLength: currentSelected.length,
        maxCards,
        reason: "Max cards reached",
      });
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
    setOrder: Dispatch<SetStateAction<number[]>>
  ) => void
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
  readingMode: ReadingMode
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
  readingMode: ReadingMode
): boolean => {
  const maxCards = MAX_CARDS[readingMode];
  return selectedCards.length === maxCards;
};
