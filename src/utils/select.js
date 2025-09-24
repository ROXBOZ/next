export const handleCardSelect = (
  cardId,
  selectedCards,
  setSelectedCards,
  cardOrder,
  setCardOrder
) => {
  if (selectedCards.length < 5) {
    setSelectedCards([...selectedCards, cardId]);
    setCardOrder(cardOrder.filter((id) => id !== cardId));
  } else {
    showToast("Max. 5 cartes!");
  }
};

const showToast = (message) => {
  if (document.querySelector(".toast-notification")) {
    return;
  }

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.classList.add(
    "fixed",
    "top-5",
    "right-5",
    "bg-red-800",
    "text-white",
    "px-3",
    "py-2",
    "rounded-md",
    "font-medium",
    "z-[9999]",
    "shadow-lg",
    "transform",
    "translate-x-full",
    "transition-transform",
    "duration-300",
    "ease-out",
    "toast-notification"
  );

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-x-full");
    toast.classList.add("translate-x-0");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("translate-x-0");
    toast.classList.add("translate-x-full");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
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
