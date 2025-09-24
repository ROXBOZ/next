import { handleCardSelect, resetSelection } from "@/utils/select";
import { useCallback, useState } from "react";

import { tarot_cards as cards } from "../data.json";
import { shuffleCards } from "@/utils/suffle";

export function useTarotGame() {
  const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [selectedCards, setSelectedCards] = useState([]);
  const [readingMode, setReadingMode] = useState(null); // null, "3-cards", "5-cards"

  const selectCard = useCallback(
    (cardId) => {
      handleCardSelect(
        cardId,
        selectedCards,
        setSelectedCards,
        cardOrder,
        setCardOrder,
        readingMode
      );
    },
    [selectedCards, cardOrder, readingMode]
  );

  const shuffleDeck = useCallback(() => {
    if (selectedCards.length > 0) {
      return false; // Indicates shuffle was blocked
    }
    shuffleCards(cardOrder, setCardOrder);
    return true; // Indicates shuffle was successful
  }, [cardOrder, selectedCards]);

  const resetGame = useCallback(() => {
    resetSelection(
      selectedCards,
      setSelectedCards,
      cardOrder,
      setCardOrder,
      shuffleCards
    );
    setReadingMode(null);
  }, [selectedCards, cardOrder]);

  const startReading = useCallback((mode) => {
    setReadingMode(mode);
  }, []);

  return {
    // State
    cardOrder,
    selectedCards,
    readingMode,

    // Computed values
    isGameStarted: readingMode !== null,
    hasSelectedCards: selectedCards.length > 0,
    canShuffle: selectedCards.length === 0,

    // Actions
    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
  };
}
