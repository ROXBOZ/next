export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const shuffleCards = (cardOrder, setCardOrder, setCardReversals) => {
  const shuffledOrder = shuffleArray(cardOrder);

  // Generate random reversals for each card (50% chance)
  const reversals = {};
  shuffledOrder.forEach((cardId) => {
    reversals[cardId] = Math.random() < 0.5;
  });

  setCardOrder(shuffledOrder);
  if (setCardReversals) {
    setCardReversals(reversals);
  }
};
