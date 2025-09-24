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

  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  // Calculate the actual width needed for all cards
  // First card: 190px, each additional card: 18px (190 - 172 overlap)
  const totalWidth =
    cardOrder.length > 0 ? 190 + (cardOrder.length - 1) * 18 : 190;

  // Scroll to right side on mobile and check if scroll indicator is needed
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768; // md breakpoint

    if (isMobile) {
      // Scroll to the right side to show last cards
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = maxScrollLeft;

      // Show scroll indicator if content is scrollable AND reading mode is selected
      setShowScrollIndicator(maxScrollLeft > 0 && readingMode !== null);
    } else {
      setShowScrollIndicator(false);
    }

    // Handle scroll to hide indicator when user scrolls
    const handleScroll = () => {
      if (container.scrollLeft === 0) {
        setShowScrollIndicator(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardOrder, readingMode]);

  return (
    <div className="w-full relative">
      {/* Mobile scroll indicator */}
      {showScrollIndicator && (
        <div className="md:hidden absolute top-2 left-4 z-50 text-sm flex items-center gap-2 text-violet-100">
          <span>←</span>
          <span>Faites glisser</span>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-visible py-10"
      >
        <div
          className="flex z-40 px-4 mx-auto"
          style={{ width: `${totalWidth + 32}px` }} // +32 for px-4 padding
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
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CardDeck;
