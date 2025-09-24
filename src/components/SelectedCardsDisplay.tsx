import { CardReversals, ReadingMode, TarotCard } from "@/types/tarot";

import CardFront from "./CardFront";
import { READING_CONFIGS } from "@/constants/tarot";
import { findCardById } from "@/utils/cardHelpers";

interface SelectedCardsDisplayProps {
  selectedCards: number[];
  readingMode: ReadingMode;
  cardReversals: CardReversals;
  cards: TarotCard[];
}

function SelectedCardsDisplay({
  selectedCards,
  readingMode,
  cardReversals,
  cards,
}: SelectedCardsDisplayProps) {
  if (!readingMode) {
    return null;
  }

  const readingConfig = READING_CONFIGS[readingMode];
  const maxCards = readingConfig.length;

  return (
    <div className="flex gap-4 flex-wrap pb-12 justify-center">
      {/* Show ALL positions with titles, some empty if not selected yet */}
      {Array.from({ length: maxCards }).map((_, index) => {
        const cardId = selectedCards[index];
        const position = readingConfig[index];
        const isPositionFilled = cardId !== undefined;

        // If position is filled, show the card
        if (isPositionFilled) {
          const cardData = findCardById(cards, cardId);
          if (!cardData) return null;

          const isReversed = cardReversals[cardId] || false;

          return (
            <div
              key={`filled-${index}`}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-sm text-orange-200 font-medium">
                {position?.title || `Position ${index + 1}`}
              </div>
              <CardFront
                data={cardData}
                position={index + 1}
                isReversed={isReversed}
              />
            </div>
          );
        }

        // If position is empty, show just the title in reduced opacity
        return (
          <div
            key={`empty-${index}`}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-sm text-orange-200/40 font-medium">
              {position?.title || `Position ${index + 1}`}
            </div>
            <div className="w-[190px] h-[285px] border-2 border-dashed border-orange-200/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-200/30 text-sm">
                {position?.title || `Position ${index + 1}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SelectedCardsDisplay;
