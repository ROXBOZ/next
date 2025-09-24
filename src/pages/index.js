import CardDeck from "@/components/CardDeck";
import GameControls from "@/components/GameControls";
import ModeSelector from "@/components/ModeSelector";
import SelectedCardsDisplay from "@/components/SelectedCardsDisplay";
import TarotInterpretation from "@/components/TarotInterpretation";
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
    setQuestion,
    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
  } = useTarotGame();

  return (
    <div className="pattern w-screen h-screen p-8 overflow-hidden">
      <div className="flex-col items-center gap-8 h-screen hidden 2xl:flex">
        {/* Mode Selection */}
        <ModeSelector
          readingMode={readingMode}
          setReadingMode={startReading}
          selectedCards={selectedCards}
          question={question}
          setQuestion={setQuestion}
        />

        {/* Card Deck - Only show when game has started */}
        {isGameStarted && (
          <div className="flex flex-col items-center gap-6">
            {/* Question display above deck */}
            {question && (
              <div className="text-center text-xl text-violet-50">
                {question}
              </div>
            )}

            <CardDeck
              cardOrder={cardOrder}
              onCardClick={selectCard}
              cardReversals={cardReversals}
            />
          </div>
        )}

        {/* Game Controls - Only show when game has started */}
        {isGameStarted && (
          <GameControls canShuffle={canShuffle} onShuffle={shuffleDeck} />
        )}

        {/* Selected Cards Display */}
        <SelectedCardsDisplay
          selectedCards={selectedCards}
          readingMode={readingMode}
          cardReversals={cardReversals}
        />

        {/* Recommencer button under selected cards */}
        {isGameStarted && (
          <button className="light absolute bottom-8" onClick={resetGame}>
            Recommencer
          </button>
        )}

        {/* Tarot Interpretation */}
        <TarotInterpretation
          question={question}
          selectedCards={selectedCards}
          cardReversals={cardReversals}
          readingMode={readingMode}
          isComplete={
            selectedCards.length === (readingMode === "3-cards" ? 3 : 5)
          }
        />
      </div>
    </div>
  );
}
