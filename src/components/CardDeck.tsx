import { CardReversals, ReadingMode, TarotCard } from "@/types/tarot";
import { useEffect, useRef } from "react";

import CardBack from "./CardBack";
import { findCardById } from "@/utils/cardHelpers";
import { playSpreadSound } from "@/utils/sound";

interface CardDeckProps {
  cardOrder: number[];
  onCardClick: (cardId: number) => void;
  cardReversals: CardReversals;
  cards: TarotCard[];
  readingMode?: ReadingMode | null;
  shouldSpread?: boolean;
}

function CardDeck({
  cardOrder,
  onCardClick,
  cardReversals,
  cards,
  readingMode,
  shouldSpread = false,
}: CardDeckProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldSpread) {
      playSpreadSound();
    }
  }, [shouldSpread]);

  useEffect(() => {
    if (!cardOrder || cardOrder.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    const scrollToRight = () => {
      if (!container) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = maxScrollLeft;
      // Removed showScrollIndicator logic
    };

    const readingModeJustSet = false;

    if (isMobile && (readingModeJustSet || cardOrder.length > 0)) {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToRight);
      });

      window.addEventListener("resize", scrollToRight);

      let resizeObserver;
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          scrollToRight();
        });
        resizeObserver.observe(container);
      }

      return () => {
        window.removeEventListener("resize", scrollToRight);
        if (resizeObserver) resizeObserver.disconnect();
      };
    } else {
    }
  }, [cardOrder, readingMode]);

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  return (
    <div className="relative flex w-full -rotate-2">
      <div className="mx-auto flex overflow-x-auto px-10">
        <div
          ref={scrollContainerRef}
          key={readingMode || "no-mode"}
          className="flex w-fit items-center justify-center"
        >
          <div className="z-40 ml-48 flex min-w-max justify-center py-10 md:justify-center">
            {cardOrder.map((cardId, index) => {
              const cardData = findCardById(cards, cardId);
              if (!cardData) return null;

              const isLastCard = index === cardOrder.length - 1;
              const isReversed = cardReversals[cardId] || false;

              return (
                <CardBack
                  key={cardId}
                  data={cardData}
                  position={index + 1}
                  onClick={() => onCardClick(cardId)}
                  isLast={isLastCard}
                  isReversed={isReversed}
                  readingMode={readingMode}
                  shouldSpread={shouldSpread}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDeck;
