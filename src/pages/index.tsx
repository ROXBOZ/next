import {
  CardDeck,
  GameControls,
  Header,
  ModeSelector,
  SelectedCardsDisplay,
  TarotInterpretation,
} from "@/components";

import { TarotCard } from "@/types/tarot";
import { tarot_cards as cards } from "@/data.json";
import { useTarotGame } from "@/hooks/useTarotGame";

export default function Home() {
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

  return (
    <div>
      <div className="pattern w-screen xl:h-screen fixed inset-0 xl:relative ">
        <div className="h-full pb-12 xl:h-screen overflow-y-auto xl:overflow-hidden xl:p-4">
          <Header onReset={resetGame} />
          <div className="flex-col items-center flex pb-4">
            {/* Mode Selection with integrated GameControls */}
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
            />

            {/* Card Deck - Always visible */}
            <div className="flex flex-col items-center w-full">
              <CardDeck
                cardOrder={cardOrder}
                onCardClick={selectCard}
                cardReversals={cardReversals}
                cards={cards as TarotCard[]}
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
