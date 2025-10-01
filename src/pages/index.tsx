import {
  CardDeck,
  Header,
  MobileSelectionModal,
  ModeSelector,
  SelectedCardsDisplay,
  TarotInterpretation,
} from "@/components";
import { useRef, useState } from "react";

import { TarotCard } from "@/types/tarot";
import { tarot_cards as cards } from "@/data.json";
import { findCardById } from "@/utils/cardHelpers";
import { useTarotGame } from "@/hooks/useTarotGame";

export default function Home() {
  const modeSelectorRef = useRef<HTMLDivElement>(null);

  const [mobileSelectionCard, setMobileSelectionCard] = useState<{
    card: TarotCard;
    isReversed: boolean;
  } | null>(null);

  const {
    cardOrder,
    selectedCards,
    readingMode,
    cardReversals,
    canShuffle,
    question,
    isComplete,
    showInterpretationButton,
    forceOpenModal,
    isShuffling,
    setQuestion,
    selectCard: originalSelectCard,
    shuffleDeck,
    resetGame,
    startReading,
    openInterpretation,
    onModalClose,
    hasHydrated,
    canPickCards,
    shouldSpread,
  } = useTarotGame(cards as TarotCard[]);

  const handleReset = () => {
    setMobileSelectionCard(null);
    resetGame();
  };
  const handleCardSelection = (cardId: number) => {
    if (!readingMode) {
      // Block picking if no reading mode selected
      import("@/utils/sound").then(({ playDenySound }) => playDenySound());
      import("@/utils/toast").then(({ showWarningToast }) =>
        showWarningToast("Ahhhh! Choisissez le tirage"),
      );
      return;
    }
    if (!question.trim()) {
      // Block picking if no question and show toast
      import("@/utils/sound").then(({ playDenySound }) => playDenySound());
      import("@/utils/toast").then(({ showWarningToast }) =>
        showWarningToast("Mais décidez déjà de ce que vous voulez savoir!"),
      );
      return;
    }
    if (!canPickCards) {
      // Block picking and show toast
      import("@/utils/sound").then(({ playDenySound }) => playDenySound());
      import("@/utils/toast").then(({ showWarningToast }) =>
        showWarningToast("Tssss!! Mais mélangez !!!"),
      );
      return;
    }
    const isMobile = window.innerWidth < 1024;
    const maxCards = readingMode === "3-cards" ? 3 : 5;
    if (isMobile && selectedCards.length < maxCards) {
      const cardData = findCardById(cards as TarotCard[], cardId);
      if (cardData) {
        setMobileSelectionCard({
          card: cardData,
          isReversed: cardReversals[cardId] || false,
        });
        setTimeout(() => {
          setMobileSelectionCard(null);
          originalSelectCard(cardId);
        }, 800);
        return;
      }
    }
    originalSelectCard(cardId);
  };

  if (!hasHydrated) return null;

  return (
    <div className="pattern mobile-safe-container overflow-hidden lg:max-h-screen">
      <div className="pb-4">
        <Header onReset={handleReset} />
        <div className="flex flex-col items-center pb-4">
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
              isShuffling={isShuffling}
              shouldSpread={shouldSpread}
            />
          </div>

          <div className="flex w-full flex-col items-center">
            <CardDeck
              cardOrder={cardOrder}
              onCardClick={handleCardSelection}
              cardReversals={cardReversals}
              cards={cards as TarotCard[]}
              readingMode={readingMode}
              shouldSpread={shouldSpread}
            />
          </div>

          {readingMode && (
            <SelectedCardsDisplay
              selectedCards={selectedCards}
              readingMode={readingMode}
              cardReversals={cardReversals}
              cards={cards as TarotCard[]}
            />
          )}

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
