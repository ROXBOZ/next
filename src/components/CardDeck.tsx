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
  // Function to scroll to the last card
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
    } else {
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

  // Force layout recalculation on mobile devices (similar to what happens in MobileSelectionModal)
  useEffect(() => {
    // Only run on mobile devices
    if ("ontouchstart" in window && scrollContainerRef.current) {
      // Force browser reflow by accessing offsetWidth
      const forceReflow = () => {
        const _ = scrollContainerRef.current?.offsetWidth;
      };

      // Run immediately
      forceReflow();

      // Also run after a short delay to handle any async layout changes
      setTimeout(forceReflow, 300);
    }
  }, []);

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  // Simple, reliable approach that should work consistently on mobile
  return (
    <div className="relative flex w-full -rotate-2 bg-red-500">
      <div
        ref={scrollContainerRef}
        className="scrollbar-none mx-auto flex overflow-x-auto px-[10px]"
        style={{
          WebkitOverflowScrolling: "touch", // Better iOS scrolling
          maxWidth: "100%", // Ensure container doesn't exceed viewport
        }}
      >
        <div
          key={readingMode || "no-mode"}
          className="mx-auto flex w-fit items-center justify-center"
        >
          <div className="z-40 ml-48 flex min-w-max justify-center py-10 md:justify-center">
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
