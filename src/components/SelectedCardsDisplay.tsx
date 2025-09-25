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
        const cardWidth = 190 + 16;
        const containerWidth = container.clientWidth;
        const targetScrollLeft = Math.max(
          0,
          activeIndex * cardWidth - containerWidth / 2 + cardWidth / 2,
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

  return (
    <div className="w-full max-w-full">
      <div
        ref={scrollContainerRef}
        className="scrollbar-thin scrollbar-thumb-orange-200/20 scrollbar-track-transparent flex min-w-0 justify-start gap-4 overflow-x-auto px-12 pb-4 md:justify-center"
      >
        {Array.from({ length: maxCards }).map((_, index) => {
          const cardId = selectedCards[index];
          const position = readingConfig[index];
          const isPositionFilled = index < selectedCards.length;

          if (isPositionFilled) {
            const cardData = findCardById(cards, cardId);
            if (!cardData) return null;

            const isReversed = cardReversals[cardId] || false;

            return (
              <div
                key={`filled-${index}`}
                className="flex flex-shrink-0 flex-col items-center gap-2"
              >
                <div className="text-sm font-medium text-orange-200">
                  {position?.title || `Position ${index + 1}`}
                </div>
                <div className="group relative">
                  <div
                    onClick={() => handleCardClick(cardId)}
                    className="cursor-pointer transition-transform hover:scale-105"
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
              className="flex flex-shrink-0 flex-col items-center gap-2"
            >
              <div className="text-sm font-medium text-orange-200/40">
                {position?.title || `Position ${index + 1}`}
              </div>
              <div className="flex h-[285px] w-[190px] items-center justify-center rounded-lg border-2 border-dashed border-orange-200/20">
                <span className="text-sm text-orange-200/30">
                  {position?.title || `Position ${index + 1}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

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
