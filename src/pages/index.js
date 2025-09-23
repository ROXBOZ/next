import { handleCardSelect, resetSelection } from "@/utils/select";

import CardBack from "@/components/CardBack";
import CardFront from "@/components/CardFront";
import { tarot_cards as cards } from "../data.json";
import { shuffleCards } from "@/utils/suffle";
import { useState } from "react";

export default function Home() {
  const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [selectedCards, setSelectedCards] = useState([]);

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
              onClick={() =>
                handleCardSelect(
                  cardId,
                  selectedCards,
                  setSelectedCards,
                  cardOrder,
                  setCardOrder
                )
              }
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
        <button
          className="cursor-pointer px-3 py-1 bg-red-300 flex items-center justify-center h-fit hover:bg-red-400 transition-colors rounded"
          onClick={() => shuffleCards(cardOrder, setCardOrder)}
        >
          Shuffle Cards
        </button>
        <button
          className="cursor-pointer px-3 py-1 bg-gray-300 flex items-center justify-center h-fit hover:bg-gray-400 transition-colors rounded"
          onClick={() =>
            resetSelection(
              selectedCards,
              setSelectedCards,
              cardOrder,
              setCardOrder,
              shuffleCards
            )
          }
        >
          Reset Selection
        </button>
      </div>
    </div>
  );
}
