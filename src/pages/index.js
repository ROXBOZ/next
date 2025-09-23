import { handleCardSelect, resetSelection } from "@/utils/select";
import { useCallback, useState } from "react";

import CardBack from "@/components/CardBack";
import CardFront from "@/components/CardFront";
import { tarot_cards as cards } from "../data.json";
import { shuffleCards } from "@/utils/suffle";

export default function Home() {
  const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [selectedCards, setSelectedCards] = useState([]);
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
    <div className="p-12  flex-col items-center gap-12 h-screen bg-stone-200 hidden 2xl:flex">
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
        <button onClick={handleShuffle}>Shuffle Cards</button>
        <button onClick={handleReset}>Reset Selection</button>
      </div>
      <div className="flex gap-8">
        {selectedCards.map((cardId, index) => {
          const cardData = cards.find((card) => card.id === cardId);
          const titles = ["Passé", "Présent", "Futur", "Défi", "Guidance"];
          return (
            <div key={cardId} className="flex flex-col items-center gap-2">
              <p>{titles[index]}</p>
              <CardFront data={cardData} position={index + 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
