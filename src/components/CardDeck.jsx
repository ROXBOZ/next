import CardBack from "./CardBack";
import { tarot_cards as cards } from "../data.json";

function CardDeck({ cardOrder, onCardClick, cardReversals }) {
  if (!cardOrder || cardOrder.length === 0) {
    return null;
  }

  return (
    <div className="flex">
      {cardOrder.map((cardId, index) => {
        const cardData = cards.find((card) => card.id === cardId);
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
