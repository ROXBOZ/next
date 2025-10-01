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
  const scrollToLastCard = () => {
    if (lastCardRef.current && scrollContainerRef.current) {
      const cardRect = lastCardRef.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();

      const scrollLeft =
        cardRect.left +
        cardRect.width / 2 -
        (containerRect.left + containerRect.width / 2) +
        scrollContainerRef.current.scrollLeft;

      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (shouldSpread) {
      playSpreadSound();

      setTimeout(() => {
        scrollToLastCard();
      }, 650);
    }
  }, [shouldSpread]);

  const lastCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldSpread && lastCardRef.current) {
      setTimeout(scrollToLastCard, 100);
    }
  }, [lastCardRef.current, shouldSpread]);

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  return (
    <div className="relative flex w-full bg-green-500">
      <div
        ref={scrollContainerRef}
        className="scrollbar-none flex overflow-x-auto bg-yellow-500"
      >
        <div
          key={readingMode || ""}
          className="flex items-center justify-center bg-violet-500 px-10"
        >
          <div className="z-40 ml-48 flex min-w-max -rotate-2 justify-center py-10 md:justify-center">
            {cardOrder.map((cardId, index) => {
              const cardData = findCardById(cards, cardId);
              if (!cardData) return null;

              const isLastCard = index === cardOrder.length - 1;
              const isReversed = cardReversals[cardId] || false;

              return (
                <CardBack
                  lastCardRef={isLastCard ? lastCardRef : null}
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
