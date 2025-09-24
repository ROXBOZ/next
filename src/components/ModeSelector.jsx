function ModeSelector({ readingMode, setReadingMode, selectedCards }) {
  if (readingMode || selectedCards.length > 0) return null;

  return (
    <div className="mb-8 text-center">
      <h2 className="font-medium mb-4 text-orange-50">
        Choisissez votre tirage
      </h2>
      <div className="flex gap-4 justify-center">
        <button onClick={() => setReadingMode("3-cards")}>3 Cartes</button>
        <button onClick={() => setReadingMode("5-cards")}>5 Cartes</button>
      </div>
    </div>
  );
}

export default ModeSelector;
