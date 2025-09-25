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
  // LocalStorage key
  const STORAGE_KEY = "tarot-game-state-v1";
  // Load initial state from localStorage if available
  const loadState = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };
  const initial = loadState();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [cardOrder, setCardOrder] = useState<number[]>(
    initial?.cardOrder || initializeCardOrder(cards),
  );
  const [selectedCards, setSelectedCards] = useState<number[]>(
    initial?.selectedCards || [],
  );
  const [readingMode, setReadingMode] = useState<ReadingMode | null>(
    initial?.readingMode ?? null,
  );
  const [cardReversals, setCardReversals] = useState<CardReversals>(
    initial?.cardReversals ||
      generateCardReversals(cards.map((card) => card.id)),
  );
  const [question, setQuestion] = useState<string>(initial?.question || "");
  // Set hasHydrated to true after first client render
  useEffect(() => {
    setHasHydrated(true);
  }, []);
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

  // Persist state to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = {
      cardOrder,
      selectedCards,
      readingMode,
      cardReversals,
      question,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [cardOrder, selectedCards, readingMode, cardReversals, question]);

  const selectCard = useCallback(
    (cardId: number) => {
      if (!question.trim()) {
        playDenySound();
        showWarningToast("Posez votre question");
        return;
      }

      if (!readingMode) {
        playDenySound();
        showWarningToast("Choisissez votre tirage");
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
    [selectedCards, cardOrder, readingMode, question],
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

  // Only call this for a true reset (logo click)
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
    // Remove from localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
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
    hasHydrated,
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
