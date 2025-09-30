import { CardReversals, ReadingMode, TarotCard } from "@/types/tarot";
import { useEffect, useRef, useState } from "react";

import CardBack from "./CardBack";
import { playSpreadSound } from "@/utils/sound";
import { findCardById } from "@/utils/cardHelpers";

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
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Track when readingMode changes from null to a value (user enters game)
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
      setShowScrollIndicator(maxScrollLeft > 0 && readingMode !== null);
    };

    // Fire scroll when readingMode just became set (user entered game)
    const readingModeJustSet = false; // No longer needed, always false

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

      const handleScroll = () => {
        if (container.scrollLeft === 0) {
          setShowScrollIndicator(false);
        }
      };
      container.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("resize", scrollToRight);
        if (resizeObserver) resizeObserver.disconnect();
        container.removeEventListener("scroll", handleScroll);
      };
    } else {
      setShowScrollIndicator(false);
    }
  }, [cardOrder, readingMode]);

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  return (
    <div className="relative flex w-full -rotate-2 justify-center">
      <div
        ref={scrollContainerRef}
        key={readingMode || "no-mode"}
        className={`flex w-full items-center justify-center overflow-x-scroll bg-red-500 p-10`}
      >
        <div className="z-40 ml-48 flex min-w-max justify-center md:justify-center">
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
  );
}

export default CardDeck;
