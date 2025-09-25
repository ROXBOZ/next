import { CardReversals, ReadingMode, TarotCard } from "@/types/tarot";
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
import { useCallback, useEffect, useState } from "react";

import { playDenySound } from "@/utils/sound";
import { showWarningToast } from "@/utils/toast";

export function useTarotGame(cards: TarotCard[]) {
  const [cardOrder, setCardOrder] = useState(() => initializeCardOrder(cards));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [readingMode, setReadingMode] = useState<ReadingMode | null>(null);
  const [cardReversals, setCardReversals] = useState<CardReversals>(() =>
    generateCardReversals(cards.map((card) => card.id)),
  );
  const [question, setQuestion] = useState<string>("");
  const [showInterpretationButton, setShowInterpretationButton] =
    useState(false);
  const [forceOpenModal, setForceOpenModal] = useState(false);
  const [modalHasBeenClosed, setModalHasBeenClosed] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const isComplete = readingMode
    ? isReadingComplete(selectedCards, readingMode)
    : false;

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
        showWarningToast("Posez votre question et choisissez un tirage");
        return;
      }

      handleCardSelect(
        cardId,
        selectedCards,
        setSelectedCards,
        cardOrder,
        setCardOrder,
        readingMode,
      );
    },
    [selectedCards, cardOrder, readingMode],
  );

  const shuffleDeck = useCallback(() => {
    if (selectedCards.length > 0) {
      return false;
    }

    setIsShuffling(true);
    shuffleCards(cardOrder, setCardOrder, setCardReversals);

    setTimeout(() => {
      setIsShuffling(false);
    }, 1800);

    return true;
  }, [cardOrder, selectedCards]);

  const resetGame = useCallback(() => {
    resetSelection(
      selectedCards,
      setSelectedCards,
      cardOrder,
      setCardOrder,
      (newOrder, setOrder) =>
        shuffleCards(newOrder, setOrder, setCardReversals, false),
    );
    setReadingMode(null);
    setQuestion("");
    setShowInterpretationButton(false);
    setForceOpenModal(false);
    setModalHasBeenClosed(false);
    setIsShuffling(false);
  }, [selectedCards, cardOrder]);

  const startReading = useCallback((mode: ReadingMode) => {
    setReadingMode(mode);
  }, []);

  const openInterpretation = useCallback(() => {
    setForceOpenModal((prev) => !prev);
  }, []);

  const onModalClose = useCallback(() => {
    setModalHasBeenClosed(true);
  }, []);

  return {
    cardOrder,
    selectedCards,
    readingMode,
    cardReversals,
    question,
    forceOpenModal,
    isShuffling,

    isGameStarted: readingMode !== null,
    hasSelectedCards: selectedCards.length > 0,
    canShuffle: selectedCards.length === 0,
    isComplete,
    showInterpretationButton,

    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
    setQuestion,
    openInterpretation,
    onModalClose,
  };
}
