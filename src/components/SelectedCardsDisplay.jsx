import CardFront from "./CardFront";
import { tarot_cards as cards } from "../data.json";

// Reading configurations
const READING_CONFIGS = {
  "3-cards": [
    { index: 0, title: "Passé" },
    { index: 1, title: "Présent" },
    { index: 2, title: "Avenir" },
  ],
  "5-cards": [
    { index: 0, title: "Présent" },
    { index: 1, title: "Défi" },
    { index: 2, title: "Passé" },
    { index: 3, title: "Avenir" },
    { index: 4, title: "Aide" },
  ],
};

function SelectedCardsDisplay({ selectedCards, readingMode, cardReversals }) {
  if (!readingMode || !(readingMode in READING_CONFIGS)) {
    return null;
  }

  const positions = READING_CONFIGS[readingMode];

  // Debug logging for rendering
  console.log("🎨 RENDERING SelectedCardsDisplay:", {
    selectedCardsLength: selectedCards.length,
    selectedCards: [...selectedCards],
    readingMode,
    positions: positions.map((p) => p.title),
    cardMapping: positions.map(({ index, title }) => ({
      title,
      index,
      cardId: selectedCards[index],
      hasCard: !!selectedCards[index],
      isReversed: cardReversals[selectedCards[index]],
    })),
  });

  return (
    <div className="flex gap-8">
      {positions.map(({ index, title }) => {
        const cardId = selectedCards[index];
        const cardData =
          cardId !== undefined
            ? cards.find((card) => card.id === cardId)
            : null;
        const hasCard = cardData !== null;
        const isReversed = cardReversals[cardId] || false;

        return (
          <div key={index} className="flex flex-col items-center gap-2">
            <p className={hasCard ? "" : "opacity-50"}>{title}</p>
            {hasCard && (
              <CardFront
                data={cardData}
                position={index + 1}
                isReversed={isReversed}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SelectedCardsDisplay;
