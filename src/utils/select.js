export const handleCardSelect = (
  cardId,
  selectedCards,
  setSelectedCards,
  cardOrder,
  setCardOrder
) => {
  if (selectedCards.length < 3) {
    setSelectedCards([...selectedCards, cardId]);
    setCardOrder(cardOrder.filter((id) => id !== cardId));
  }
};

export const resetSelection = (
  selectedCards,
  setSelectedCards,
  cardOrder,
  setCardOrder,
  shuffleCards
) => {
  const newCardOrder = [...cardOrder, ...selectedCards];
  setSelectedCards([]);
  shuffleCards(newCardOrder, setCardOrder);
};
