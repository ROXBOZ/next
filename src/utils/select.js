export const handleCardSelect = (
  cardId,
  selectedCards,
  setSelectedCards,
  cardOrder,
  setCardOrder,
  readingMode
) => {
  const maxCards = readingMode === "3-cards" ? 3 : 5;

  console.log("🎯 CARD SELECTION ATTEMPT:", {
    cardId,
    currentSelectedLength: selectedCards.length,
    selectedCards: [...selectedCards],
    maxCards,
    readingMode,
    timestamp: new Date().toISOString(),
  });

  setSelectedCards((currentSelected) => {
    console.log("🔄 INSIDE setSelectedCards:", {
      cardId,
      currentSelectedLength: currentSelected.length,
      currentSelected: [...currentSelected],
      maxCards,
      canSelect: currentSelected.length < maxCards,
    });

    if (currentSelected.length < maxCards) {
      setCardOrder((currentOrder) => {
        console.log("🗂️ REMOVING from deck:", {
          cardId,
          deckSizeBefore: currentOrder.length,
          deckSizeAfter: currentOrder.filter((id) => id !== cardId).length,
        });
        return currentOrder.filter((id) => id !== cardId);
      });

      const newSelected = [...currentSelected, cardId];
      console.log("✅ CARD SELECTED:", {
        cardId,
        newSelectedLength: newSelected.length,
        newSelected: [...newSelected],
        positionIndex: newSelected.length - 1,
      });

      return newSelected;
    } else {
      console.log("❌ SELECTION BLOCKED:", {
        cardId,
        currentSelectedLength: currentSelected.length,
        maxCards,
        reason: "Max cards reached",
      });
      showToast(`Max. ${maxCards} cartes!`);
      return currentSelected;
    }
  });
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

export { showToast };

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
