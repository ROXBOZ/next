import {
  CardDeck,
  GameControls,
  Header,
  ModeSelector,
  SelectedCardsDisplay,
  TarotInterpretation,
} from "@/components";
import { useEffect, useRef } from "react";

import { TarotCard } from "@/types/tarot";
import { tarot_cards as cards } from "@/data.json";
import { useTarotGame } from "@/hooks/useTarotGame";

export default function Home() {
  const modeSelectorRef = useRef<HTMLDivElement>(null);

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
    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
    openInterpretation,
    onModalClose,
  } = useTarotGame(cards as TarotCard[]);

  // Scroll to mode selector (with Mélanger button) on mobile when reading mode is selected
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

  return (
    <div>
      <div className="pattern w-screen xl:h-screen fixed inset-0 xl:relative ">
        <div className="h-full pb-12 xl:h-screen overflow-y-auto xl:overflow-hidden xl:p-4">
          <Header onReset={resetGame} />
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
                onReset={resetGame}
              />
            </div>

            {/* Card Deck - Always visible */}
            <div className="flex flex-col items-center w-full">
              <CardDeck
                cardOrder={cardOrder}
                onCardClick={selectCard}
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
          </div>
        </div>
      </div>
    </div>
  );
}
