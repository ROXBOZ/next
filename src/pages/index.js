import { handleCardSelect, resetSelection } from "@/utils/select";
import { useCallback, useState } from "react";

import CardBack from "@/components/CardBack";
import CardFront from "@/components/CardFront";
import { tarot_cards as cards } from "../data.json";
import { shuffleCards } from "@/utils/suffle";

export default function Home() {
  const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [selectedCards, setSelectedCards] = useState([]);
  const buttonStyle =
    "cursor-pointer px-3 py-1 bg-red-300 flex items-center justify-center h-fit hover:bg-red-400 transition-colors rounded";
  const handleCardClick = useCallback(
    (cardId) => {
      handleCardSelect(
        cardId,
        selectedCards,
        setSelectedCards,
        cardOrder,
        setCardOrder
      );
    },
    [selectedCards, cardOrder]
  );
  const handleShuffle = useCallback(() => {
    shuffleCards(cardOrder, setCardOrder);
  }, [cardOrder]);
  const handleReset = useCallback(() => {
    resetSelection(
      selectedCards,
      setSelectedCards,
      cardOrder,
      setCardOrder,
      shuffleCards
    );
  }, [selectedCards, cardOrder]);

  return (
    <div className="p-4 flex flex-col items-center gap-12">
      <div className="flex">
        {cardOrder.map((cardId, index) => {
          const cardData = cards.find((card) => card.id === cardId);
          return (
            <CardBack
              key={cardId}
              data={cardData}
              position={index + 1}
              onClick={() => handleCardClick(cardId)}
            />
          );
        })}
      </div>
      <div className="flex gap-4">
        {selectedCards.map((cardId, index) => {
          const cardData = cards.find((card) => card.id === cardId);
          return (
            <CardFront key={cardId} data={cardData} position={index + 1} />
          );
        })}
      </div>
      <div className="flex gap-4">
        <button className={buttonStyle} onClick={handleShuffle}>
          Shuffle Cards
        </button>
        <button className={buttonStyle} onClick={handleReset}>
          Reset Selection
        </button>
      </div>
    </div>
  );
}
