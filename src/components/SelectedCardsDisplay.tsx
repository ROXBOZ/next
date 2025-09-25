import { CardReversals, ReadingMode, TarotCard } from "@/types/tarot";
import { useEffect, useRef, useState } from "react";

import CardFront from "./CardFront";
import CardModal from "./CardModal";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [modalCard, setModalCard] = useState<{
    card: TarotCard;
    isReversed: boolean;
  } | null>(null);

  // Handle click on a card (single tap/click for mobile compatibility)
  const handleCardClick = (cardId: number) => {
    const cardData = findCardById(cards, cardId);
    if (cardData) {
      setModalCard({
        card: cardData,
        isReversed: cardReversals[cardId] || false,
      });
    }
  };

  const closeModal = () => {
    setModalCard(null);
  };

  // Center the active placeholder on mobile
  useEffect(() => {
    if (!readingMode) return;

    const readingConfig = READING_CONFIGS[readingMode];
    const maxCards = readingConfig.length;
    const activeIndex =
      selectedCards.length < maxCards ? selectedCards.length : -1;

    if (activeIndex === -1 || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      setTimeout(() => {
        const cardWidth = 190 + 16; // card width + gap
        const containerWidth = container.clientWidth;
        const targetScrollLeft = Math.max(
          0,
          activeIndex * cardWidth - containerWidth / 2 + cardWidth / 2
        );

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [selectedCards, readingMode]);

  if (!readingMode) {
    return null;
  }

  const readingConfig = READING_CONFIGS[readingMode];
  const maxCards = readingConfig.length;

  // Find the next empty position (the active placeholder)
  // selectedCards is an array of card IDs, so the next position is at selectedCards.length
  const activeIndex =
    selectedCards.length < maxCards ? selectedCards.length : -1;

  return (
    <div className="w-full max-w-full">
      <div
        ref={scrollContainerRef}
        className="flex px-12 gap-4 overflow-x-auto justify-start md:justify-center min-w-0 pb-4 scrollbar-thin scrollbar-thumb-orange-200/20 scrollbar-track-transparent"
      >
        {Array.from({ length: maxCards }).map((_, index) => {
          const cardId = selectedCards[index]; // This will be undefined if we don't have enough cards yet
          const position = readingConfig[index];
          const isPositionFilled = index < selectedCards.length;

          if (isPositionFilled) {
            const cardData = findCardById(cards, cardId);
            if (!cardData) return null;

            const isReversed = cardReversals[cardId] || false;

            return (
              <div
                key={`filled-${index}`}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="text-sm text-orange-200 font-medium">
                  {position?.title || `Position ${index + 1}`}
                </div>
                <div className="relative group">
                  {/* Visual indicator for clickable card - only on mobile */}
                  {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400/80 rounded-full flex items-center justify-center text-[10px] text-white font-bold opacity-60 group-hover:opacity-100 transition-opacity z-10 md:hidden">
                    👁
                  </div> */}
                  <div
                    onClick={() => handleCardClick(cardId)}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  >
                    <CardFront
                      data={cardData}
                      position={index + 1}
                      isReversed={isReversed}
                    />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={`empty-${index}`}
              className="flex flex-col items-center gap-2 flex-shrink-0"
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

      {/* Card Modal */}
      {modalCard && (
        <CardModal
          isOpen={!!modalCard}
          onClose={closeModal}
          card={modalCard.card}
          isReversed={modalCard.isReversed}
        />
      )}
    </div>
  );
}

export default SelectedCardsDisplay;
