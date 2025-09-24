import { ChangeEvent, useEffect, useRef } from "react";
import { ReadingMode } from "@/types/tarot";
import { playTypingSound, playClickSound } from "@/utils/sound";

interface ModeSelectorProps {
  readingMode: ReadingMode | null;
  setReadingMode: (mode: ReadingMode) => void;
  selectedCards: number[];
  question: string;
  setQuestion: (question: string) => void;
  canShuffle?: boolean;
  onShuffle?: () => boolean;
  showInterpretationButton?: boolean;
  onOpenInterpretation?: () => void;
}

function ModeSelector({
  readingMode,
  setReadingMode,
  question,
  setQuestion,
  canShuffle,
  onShuffle,
  showInterpretationButton,
  onOpenInterpretation,
}: ModeSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input after the animation delay when not in reading mode
  useEffect(() => {
    if (!readingMode && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Slightly after the animation starts (0.2s + buffer)

      return () => clearTimeout(timer);
    }
  }, [readingMode]);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
    playTypingSound();
  };

  const isQuestionValid = question.trim().length > 0;

  const getCardsText = () => {
    if (readingMode === "3-cards") return "choisissez 3 cartes";
    if (readingMode === "5-cards") return "choisissez 5 cartes";
    return "et choisissez vos cartes";
  };

  const handleShuffleClick = () => {
    if (onShuffle) {
      const success = onShuffle();
      if (!success) {
      }
    }
  };

  const handle3CardsClick = () => {
    playClickSound();
    setReadingMode("3-cards");
  };

  const handle5CardsClick = () => {
    playClickSound();
    setReadingMode("5-cards");
  };

  if (readingMode) {
    return (
      <div className="w-full flex flex-col items-center pt-4 h-fit xl:h-[100px] ">
        <div className=" flex flex-col items-center gap-3 w-1/2 p-2">
          <p className="text-violet-100  opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards]">
            <span className="italic">{question}</span>
          </p>

          <div className="flex flex-col xl:flex-row gap-2 items-center -ml-4! opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.4s_forwards]">
            {canShuffle && (
              <button onClick={handleShuffleClick} className="light">
                Mélangez
              </button>
            )}
            {!showInterpretationButton && canShuffle && (
              <div className="text-violet-50">{getCardsText()}</div>
            )}
            {showInterpretationButton && onOpenInterpretation && (
              <button onClick={onOpenInterpretation} className="light">
                Interprétez
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-4 h-[160px] xl:h-[100px]">
      <div className="flex flex-col gap-2 h-full w-full xl:w-1/2 mx-auto items-center">
        <div className="flex flex-col xl:flex-row w-full px-4 items-center gap-2 opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards]">
          <span className="text-violet-200  font-medium">
            Demandez à l’oracle
          </span>
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Quelle est votre question ?"
            className="px-3 w-full xl:w-96 py-2 bg-[#0d001a] border border-violet-500/20 rounded text-violet-100 placeholder-violet-500/40 focus:border-violet-400/50 focus:outline-none text-sm"
          />
        </div>

        <div className="flex flex-col xl:flex-row items-center gap-2 h-[32px]">
          {isQuestionValid && (
            <>
              <span className="text-violet-200  font-medium opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.4s_forwards]">
                Choisissez entre un tirage
              </span>
              <div className="flex gap-2 opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.6s_forwards]">
                <button
                  className="light text-sm px-3 py-1"
                  onClick={handle3CardsClick}
                >
                  simple
                </button>{" "}
                <span className="text-violet-200">ou</span>{" "}
                <button
                  className="light text-sm px-3 py-1"
                  onClick={handle5CardsClick}
                >
                  détaillé
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModeSelector;
