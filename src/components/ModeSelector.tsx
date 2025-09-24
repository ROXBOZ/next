import { ChangeEvent } from "react";
import { ReadingMode } from "@/types/tarot";

interface ModeSelectorProps {
  readingMode: ReadingMode | null;
  setReadingMode: (mode: ReadingMode) => void;
  selectedCards: number[];
  question: string;
  setQuestion: (question: string) => void;
}

function ModeSelector({
  readingMode,
  setReadingMode,
  selectedCards,
  question,
  setQuestion,
}: ModeSelectorProps) {
  // Don't render if a mode is already selected or cards have been selected
  if (readingMode || selectedCards.length > 0) return null;

  const handleQuestionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const isQuestionValid = question.trim().length > 0;

  return (
    <div className="mb-8 text-center w-2/3 mx-auto">
      <h2 className="font-medium mb-4 text-violet-50">Posez votre question</h2>

      {/* Question Input */}
      <div className="mb-6 w-full">
        <textarea
          value={question}
          onChange={handleQuestionChange}
          placeholder="Quelle est votre question ?"
          className="
            p-4 w-1/2 bg-[#0d001a] rounded-lg text-violet-50
            placeholder-violet-500/30 resize-none transition-all duration-200
          "
          rows={3}
        />
      </div>

      <h2 className="font-medium mb-4 text-orange-50">
        Choisissez votre tirage
      </h2>

      <div className="flex gap-4 justify-center">
        <button
          className={`light ${!isQuestionValid ? "disabled" : ""}`}
          onClick={() => setReadingMode("3-cards")}
          disabled={!isQuestionValid}
        >
          3 Cartes
        </button>
        <button
          className={`light ${!isQuestionValid ? "disabled" : ""}`}
          onClick={() => setReadingMode("5-cards")}
          disabled={!isQuestionValid}
        >
          5 Cartes
        </button>
      </div>
    </div>
  );
}

export default ModeSelector;
