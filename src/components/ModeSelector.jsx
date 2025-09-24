function ModeSelector({
  readingMode,
  setReadingMode,
  selectedCards,
  question,
  setQuestion,
}) {
  if (readingMode || selectedCards.length > 0) return null;

  return (
    <div className="mb-8 text-center w-2/3 mx-auto">
      <h2 className="font-medium mb-4 text-orange-50">Posez votre question</h2>
      {/* Question Input */}
      <div className="mb-6 w-full">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Quelle est votre question ?"
          className=" p-4 w-1/2 border bg-orange-300 rounded-lg text-orange-950 placeholder-orange-950/50 resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          rows={3}
        />
      </div>
      <h2 className="font-medium mb-4 text-orange-50">
        Choisissez votre tirage
      </h2>
      <div className="flex gap-4 justify-center">
        <button
          className="light"
          onClick={() => setReadingMode("3-cards")}
          disabled={!question.trim()}
        >
          3 Cartes
        </button>
        <button
          className="light"
          onClick={() => setReadingMode("5-cards")}
          disabled={!question.trim()}
        >
          5 Cartes
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;
