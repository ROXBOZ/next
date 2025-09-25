import { CardReversals, ReadingMode, TarotCard } from  const selectCard = useCallback(
    (cardId: number) => {
      if (!readingMode) {
        playDenySound();
        showWarningToast("Demandez à l'oracle et choisissez un tirage");
        return;
      }

      // Check if this is mobile and if we can select the card
      const isMobile = window.innerWidth < 768;
      const maxCards = readingMode === "single" ? 1 : readingMode === "three" ? 3 : 7;
      
      if (isMobile && selectedCards.length < maxCards) {
        // Show mobile selection animation first
        const cardData = findCardById(cards, cardId);
        if (cardData) {
          setMobileSelectionCard({
            card: cardData,
            isReversed: cardReversals[cardId] || false,
          });
          
          // After a brief delay, actually select the card and hide the animation
          setTimeout(() => {
            setMobileSelectionCard(null);
            handleCardSelect(
              cardId,
              selectedCards,
              setSelectedCards,
              cardOrder,
              setCardOrder,
              readingMode
            );
          }, 800); // Show for 800ms
          return;
        }
      }

      // For desktop or if animation isn't needed, select immediately
      handleCardSelect(
        cardId,
        selectedCards,
        setSelectedCards,
        cardOrder,
        setCardOrder,
        readingMode
      );
    },
    [selectedCards, cardOrder, readingMode, cards, cardReversals]
  );mport {
  generateCardReversals,
  initializeCardOrder,
  shuffleCards,
} from "@/utils/shuffle";
import {
  handleCardSelect,
  isReadingComplete,
  resetSelection,
} from "@/utils/cardSelection";
import { playDenySound } from "@/utils/sound";
import { showWarningToast } from "@/utils/toast";
import { useCallback, useEffect, useState } from "react";
import { findCardById } from "@/utils/cardHelpers";

export function useTarotGame(cards: TarotCard[]) {
  const [cardOrder, setCardOrder] = useState(() => initializeCardOrder(cards));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [readingMode, setReadingMode] = useState<ReadingMode | null>(null);
  const [cardReversals, setCardReversals] = useState<CardReversals>(() =>
    generateCardReversals(cards.map((card) => card.id))
  );
  const [question, setQuestion] = useState<string>("");
  const [showInterpretationButton, setShowInterpretationButton] =
    useState(false);
  const [forceOpenModal, setForceOpenModal] = useState(false);
  const [modalHasBeenClosed, setModalHasBeenClosed] = useState(false);
  
  // Mobile selection animation state
  const [mobileSelectionCard, setMobileSelectionCard] = useState<{
    card: TarotCard;
    isReversed: boolean;
  } | null>(null);

  const isComplete = readingMode
    ? isReadingComplete(selectedCards, readingMode)
    : false;

  // Show interpretation button only AFTER modal has been closed at least once
  useEffect(() => {
    if (
      isComplete &&
      question &&
      selectedCards.length > 0 &&
      modalHasBeenClosed
    ) {
      setShowInterpretationButton(true);
    } else {
      setShowInterpretationButton(false);
    }
  }, [isComplete, question, selectedCards.length, modalHasBeenClosed]);

  const selectCard = useCallback(
    (cardId: number) => {
      if (!readingMode) {
        playDenySound();
        showWarningToast("Demandez à l’oracle et choisissez un tirage");
        return;
      }

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
      (newOrder, setOrder) =>
        shuffleCards(newOrder, setOrder, setCardReversals, false) // No sound for reset
    );
    setReadingMode(null);
    setQuestion("");
    setShowInterpretationButton(false);
    setForceOpenModal(false);
    setModalHasBeenClosed(false);
  }, [selectedCards, cardOrder]);

  const startReading = useCallback((mode: ReadingMode) => {
    setReadingMode(mode);
  }, []);

  const openInterpretation = useCallback(() => {
    setForceOpenModal((prev) => !prev); // Toggle to trigger useEffect
  }, []);

  const onModalClose = useCallback(() => {
    setModalHasBeenClosed(true);
  }, []);

  return {
    // State
    cardOrder,
    selectedCards,
    readingMode,
    cardReversals,
    question,
    forceOpenModal,

    // Computed values
    isGameStarted: readingMode !== null,
    hasSelectedCards: selectedCards.length > 0,
    canShuffle: selectedCards.length === 0,
    isComplete,
    showInterpretationButton,

    // Actions
    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
    setQuestion,
    openInterpretation,
    onModalClose,
  };
}
