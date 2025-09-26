import { CardReversals, ReadingMode, TarotCard } from "@/types/tarot";
import { useEffect, useRef, useState } from "react";

import CardBack from "./CardBack";
import { findCardById } from "@/utils/cardHelpers";

interface CardDeckProps {
  cardOrder: number[];
  onCardClick: (cardId: number) => void;
  cardReversals: CardReversals;
  cards: TarotCard[];
  readingMode?: ReadingMode | null;
}

function CardDeck({
  cardOrder,
  onCardClick,
  cardReversals,
  cards,
  readingMode,
}: CardDeckProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Track when readingMode changes from null to a value (user enters game)
  const prevReadingModeRef = useRef<ReadingMode | null | undefined>(undefined);
  useEffect(() => {
    prevReadingModeRef.current = readingMode;
  }, [readingMode]);

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
    const readingModeJustSet =
      prevReadingModeRef.current == null && readingMode != null;

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
    <div className="relative w-full -rotate-2">
      <div
        ref={scrollContainerRef}
        key={readingMode || "no-mode"}
        className="w-full overflow-x-auto overflow-y-visible py-10"
        style={{
          touchAction: "pan-x",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="z-40 flex min-w-fit justify-center px-8 md:justify-center md:px-12">
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CardDeck;
