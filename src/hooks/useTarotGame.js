import {
  generateCardReversals,
  initializeCardOrder,
  shuffleCards,
} from "@/utils/shuffle";
import {
  handleCardSelect,
  isReadingComplete,
  resetSelection,
} from "@/utils/cardSelection";
import { useCallback, useState } from "react";

import { tarot_cards as cards } from "../data.json";

//
export function useTarotGame() {
  const [cardOrder, setCardOrder] = useState(() => initializeCardOrder(cards));
  const [selectedCards, setSelectedCards] = useState([]);
  const [readingMode, setReadingMode] = useState(null); // null, "3-cards", "5-cards"
  const [cardReversals, setCardReversals] = useState(() =>
    generateCardReversals(cards.map((card) => card.id))
  );
  const [question, setQuestion] = useState(""); // User's question for AI interpretation

  const selectCard = useCallback(
    (cardId) => {
      if (!readingMode) return;

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
    shuffleCards(cardOrder, setCardOrder, setCardReversals);
    return true; // Indicates shuffle was successful
  }, [cardOrder, selectedCards]);

  const resetGame = useCallback(() => {
    resetSelection(
      selectedCards,
      setSelectedCards,
      cardOrder,
      setCardOrder,
      (newOrder, setOrder) => shuffleCards(newOrder, setOrder, setCardReversals)
    );
    setReadingMode(null);
    setQuestion("");
  }, [selectedCards, cardOrder]);

  const startReading = useCallback((mode) => {
    setReadingMode(mode);
  }, []);

  return {
    // State
    cardOrder,
    selectedCards,
    readingMode,
    cardReversals,
    question,

    // Computed values
    isGameStarted: readingMode !== null,
    hasSelectedCards: selectedCards.length > 0,
    canShuffle: selectedCards.length === 0,
    isComplete: readingMode
      ? isReadingComplete(selectedCards, readingMode)
      : false,

    // Actions
    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
    setQuestion,
  };
}
