import {
  CardDeck,
  GameControls,
  Header,
  MobileSelectionModal,
  ModeSelector,
  SelectedCardsDisplay,
  TarotInterpretation,
} from "@/components";
import { useEffect, useRef, useState } from "react";

import { TarotCard } from "@/types/tarot";
import { tarot_cards as cards } from "@/data.json";
import { findCardById } from "@/utils/cardHelpers";
import { useTarotGame } from "@/hooks/useTarotGame";

export default function Home() {
  const modeSelectorRef = useRef<HTMLDivElement>(null);

  // Mobile selection animation state
  const [mobileSelectionCard, setMobileSelectionCard] = useState<{
    card: TarotCard;
    isReversed: boolean;
  } | null>(null);

  const {
    cardOrder,
    selectedCards,
    readingMode,
    cardReversals,
    isGameStarted,
    canShuffle,
    question,
    isComplete,
    showInterpretationButton,
    forceOpenModal,
    setQuestion,
    selectCard: originalSelectCard,
    shuffleDeck,
    resetGame,
    startReading,
    openInterpretation,
    onModalClose,
  } = useTarotGame(cards as TarotCard[]);

  // Custom reset handler that also clears mobile animation
  const handleReset = () => {
    setMobileSelectionCard(null);
    resetGame();
  };
  const handleCardSelection = (cardId: number) => {
    if (!readingMode) {
      originalSelectCard(cardId);
      return;
    }

    // Check if this is mobile and if we can select the card
    const isMobile = window.innerWidth < 768;
    const maxCards = readingMode === "3-cards" ? 3 : 5;

    if (isMobile && selectedCards.length < maxCards) {
      // Show mobile selection animation first
      const cardData = findCardById(cards as TarotCard[], cardId);
      if (cardData) {
        setMobileSelectionCard({
          card: cardData,
          isReversed: cardReversals[cardId] || false,
        });

        // After a brief delay, actually select the card
        setTimeout(() => {
          setMobileSelectionCard(null);
          originalSelectCard(cardId);
        }, 800);
        return;
      }
    }

    // For desktop or if animation isn't needed, select immediately
    originalSelectCard(cardId);
  };

  // Scroll to mode selector (with Mélanger button) on mobile when reading mode is selected
  // DISABLED: This function was causing scrolling issues on mobile
  /*
  useEffect(() => {
    if (readingMode && modeSelectorRef.current) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        modeSelectorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [readingMode]);
  */

  return (
    <div className="pattern mobile-safe-container xl:max-h-screen xl:overflow-hidden">
      <div className="pb-4">
        <Header onReset={handleReset} />
        <div className="flex-col items-center flex pb-4">
          {/* Mode Selection with integrated GameControls */}
          <div ref={modeSelectorRef}>
            <ModeSelector
              readingMode={readingMode}
              setReadingMode={startReading}
              selectedCards={selectedCards}
              question={question}
              setQuestion={setQuestion}
              canShuffle={canShuffle}
              onShuffle={shuffleDeck}
              showInterpretationButton={showInterpretationButton}
              onOpenInterpretation={openInterpretation}
              onReset={handleReset}
            />
          </div>

          {/* Card Deck - Always visible */}
          <div className="flex flex-col items-center w-full">
            <CardDeck
              cardOrder={cardOrder}
              onCardClick={handleCardSelection}
              cardReversals={cardReversals}
              cards={cards as TarotCard[]}
              readingMode={readingMode}
            />
          </div>

          {/* Selected Cards Display */}
          {readingMode && (
            <SelectedCardsDisplay
              selectedCards={selectedCards}
              readingMode={readingMode}
              cardReversals={cardReversals}
              cards={cards as TarotCard[]}
            />
          )}

          {/* Tarot Interpretation */}
          {readingMode && (
            <TarotInterpretation
              question={question}
              selectedCards={selectedCards}
              cardReversals={cardReversals}
              readingMode={readingMode}
              isComplete={isComplete}
              cards={cards as TarotCard[]}
              forceOpen={forceOpenModal}
              onModalClose={onModalClose}
            />
          )}

          {/* Mobile Selection Modal */}
          {mobileSelectionCard && (
            <MobileSelectionModal
              isOpen={!!mobileSelectionCard}
              card={mobileSelectionCard.card}
              isReversed={mobileSelectionCard.isReversed}
            />
          )}
        </div>
      </div>
    </div>
  );
}
