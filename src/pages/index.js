import { handleCardSelect, resetSelection, showToast } from "@/utils/select";
import { useCallback, useState } from "react";

import CardBack from "@/components/CardBack";
import CardFront from "@/components/CardFront";
import ModeSelector from "@/components/ModeSelector";
import { tarot_cards as cards } from "../data.json";
import { shuffleCards } from "@/utils/suffle";

export default function Home() {
  const [cardOrder, setCardOrder] = useState(cards.map((card) => card.id));
  const [selectedCards, setSelectedCards] = useState([]);
  const [readingMode, setReadingMode] = useState(null);
  const handleCardClick = useCallback(
    (cardId) => {
      handleCardSelect(
        cardId,
        selectedCards,
        setSelectedCards,
        cardOrder,
        setCardOrder,
        readingMode
      );
    },
    [selectedCards, cardOrder, readingMode]
  );
  const handleShuffle = useCallback(() => {
    if (selectedCards.length > 0) {
      showToast("Impossible de mélanger pendant le tirage!");
      return;
    }
    shuffleCards(cardOrder, setCardOrder);
  }, [cardOrder, selectedCards]);
  const handleReset = useCallback(() => {
    resetSelection(
      selectedCards,
      setSelectedCards,
      cardOrder,
      setCardOrder,
      shuffleCards
    );
    setReadingMode(null);
  }, [selectedCards, cardOrder]);

  return (
    <div>
      <div className="p-12 flex-col items-center gap-12 h-screen bg-stone-200 hidden 2xl:flex">
        <ModeSelector
          readingMode={readingMode}
          setReadingMode={setReadingMode}
          selectedCards={selectedCards}
        />

        {readingMode && (
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
        )}

        {readingMode && (
          <div className="flex gap-4">
            <button onClick={handleShuffle}>Mélanger</button>
            <button onClick={handleReset}>Recommencer</button>
          </div>
        )}
        <div className="flex gap-8">
          {(() => {
            if (readingMode === "3-cards") {
              const positions = [
                { index: 0, title: "Passé" },
                { index: 1, title: "Présent" },
                { index: 2, title: "Avenir" },
              ];

              return positions.map(({ index, title }) => {
                const cardId = selectedCards[index];
                const cardData = cardId
                  ? cards.find((card) => card.id === cardId)
                  : null;
                const hasCard = cardData !== null;

                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <p className={hasCard ? "" : "opacity-50"}>{title}</p>
                    {hasCard && (
                      <CardFront data={cardData} position={index + 1} />
                    )}
                  </div>
                );
              });
            } else if (readingMode === "5-cards") {
              const positions = [
                { index: 0, title: "Présent" },
                { index: 1, title: "Défi" },
                { index: 2, title: "Passé" },
                { index: 3, title: "Avenir" },
                { index: 4, title: "Aide" },
              ];

              return positions.map(({ index, title }) => {
                const cardId = selectedCards[index];
                const cardData = cardId
                  ? cards.find((card) => card.id === cardId)
                  : null;
                const hasCard = cardData !== null;

                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <p className={hasCard ? "" : "opacity-50"}>{title}</p>
                    {hasCard && (
                      <CardFront data={cardData} position={index + 1} />
                    )}
                  </div>
                );
              });
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}
