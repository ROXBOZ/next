import { CardReversals, TarotCard } from "@/types/tarot";

import CardBack from "./CardBack";
import { findCardById } from "@/utils/cardHelpers";

interface CardDeckProps {
  cardOrder: number[];
  onCardClick: (cardId: number) => void;
  cardReversals: CardReversals;
  cards: TarotCard[];
}

function CardDeck({
  cardOrder,
  onCardClick,
  cardReversals,
  cards,
}: CardDeckProps) {
  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  // Calculate the actual width needed for all cards
  // First card: 190px, each additional card: 18px (190 - 172 overlap)
  const totalWidth =
    cardOrder.length > 0 ? 190 + (cardOrder.length - 1) * 18 : 190;

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto overflow-y-visible py-10">
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
