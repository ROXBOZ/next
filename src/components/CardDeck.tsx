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

  return (
    <div className="flex z-40">
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
  );
}

export default CardDeck;
