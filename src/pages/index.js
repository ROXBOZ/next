import CardDeck from "@/components/CardDeck";
import GameControls from "@/components/GameControls";
import ModeSelector from "@/components/ModeSelector";
import SelectedCardsDisplay from "@/components/SelectedCardsDisplay";
import { useTarotGame } from "@/hooks/useTarotGame";

export default function Home() {
  const {
    cardOrder,
    selectedCards,
    readingMode,
    cardReversals,
    isGameStarted,
    canShuffle,
    selectCard,
    shuffleDeck,
    resetGame,
    startReading,
  } = useTarotGame();

  return (
    <div>
      <div className="p-12 flex-col items-center gap-12 bg-orange-800 h-screen hidden 2xl:flex">
        {/* Mode Selection */}
        <ModeSelector
          readingMode={readingMode}
          setReadingMode={startReading}
          selectedCards={selectedCards}
        />

        {/* Card Deck - Only show when game has started */}
        {isGameStarted && (
          <CardDeck
            cardOrder={cardOrder}
            onCardClick={selectCard}
            cardReversals={cardReversals}
          />
        )}

        {/* Game Controls - Only show when game has started */}
        {isGameStarted && (
          <GameControls
            canShuffle={canShuffle}
            onShuffle={shuffleDeck}
            onReset={resetGame}
          />
        )}

        {/* Selected Cards Display */}
        <SelectedCardsDisplay
          selectedCards={selectedCards}
          readingMode={readingMode}
          cardReversals={cardReversals}
        />
      </div>
    </div>
  );
}
