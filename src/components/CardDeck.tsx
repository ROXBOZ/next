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

  // Effect to initialize proper mobile scrolling
  useEffect(() => {
    // Only run on mobile
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      scrollContainerRef.current
    ) {
      // Force browser to recognize container as scrollable by setting/resetting scroll position
      const container = scrollContainerRef.current;
      // Store current scroll position
      const currentScroll = container.scrollLeft;
      // Force a scroll value change to trigger layout recalculation
      container.scrollLeft = 1;
      // Return to original position
      setTimeout(() => {
        container.scrollLeft = currentScroll;
      }, 10);
    }
  }, []);

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  // Mobile-specific inline styles to ensure consistent scrolling behavior
  const mobileScrollStyles =
    typeof window !== "undefined" && window.innerWidth < 768
      ? {
          WebkitOverflowScrolling: "touch" as "touch",
          overflowX: "auto" as "auto",
          paddingLeft: "40px",
          paddingRight: "40px",
          width: "100%",
          display: "flex",
          margin: "0 auto",
        }
      : {};

  return (
    <div className="relative flex w-full -rotate-2">
      <div
        ref={scrollContainerRef}
        style={mobileScrollStyles}
        className="scrollbar-none mx-auto flex overflow-x-auto"
      >
        {/* Removed padding containers for mobile - using inline style instead */}
        <div className="hidden w-10 flex-shrink-0 md:block"></div>
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
        {/* Only show end padding on desktop */}
        <div className="hidden w-10 flex-shrink-0 md:block"></div>
      </div>
    </div>
  );
}

export default CardDeck;
