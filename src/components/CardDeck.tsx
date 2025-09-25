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

  useEffect(() => {
    if (!cardOrder || cardOrder.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = maxScrollLeft;

      setShowScrollIndicator(maxScrollLeft > 0 && readingMode !== null);
    } else {
      setShowScrollIndicator(false);
    }

    const handleScroll = () => {
      if (container.scrollLeft === 0) {
        setShowScrollIndicator(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardOrder, readingMode]);

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full -rotate-2">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-visible py-6"
        style={{
          touchAction: "pan-x",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="z-40 flex justify-center px-8 md:justify-center md:px-12"
          style={{ minWidth: "fit-content" }}
        >
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
