import { ChangeEvent, useEffect, useRef } from "react";
import { playClickSound, playTypingSound } from "@/utils/sound";

import { ReadingMode } from "@/types/tarot";
import { validateQuestion } from "@/utils/questionValidation";

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
  onReset?: () => void;
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
  onReset,
}: ModeSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus the input after the animation delay when not in reading mode
  useEffect(() => {
    if (!readingMode && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Slightly after the animation starts (0.2s + buffer)

      return () => clearTimeout(timer);
    }
  }, [readingMode]);

  // Cleanup validation timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuestion(newValue);
    playTypingSound();

    // Clear previous validation timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Validate the question after a short delay to avoid spam
    if (newValue.trim().length > 5) {
      validationTimeoutRef.current = setTimeout(() => {
        validateQuestion(newValue);
      }, 1500); // Wait 1.5 seconds after typing stops
    }
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
          <div className="text-violet-100  opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards]">
            <div className=" px-12 py-2 -mt-4 bg-indigo-950 -rotate-2 rounded-full font-semibold relative group">
              <span className="italic">{question}</span>
              {onReset && (
                <button
                  onClick={onReset}
                  className="absolute -top-2 px-2! py-0! pt-0! font-normal text-xl -right-2 bg-orange-800 hover:bg-orange-900 text-white rounded-full flex items-center! justify-center! transition-colors opacity-0 group-hover:opacity-100"
                  title="Recommencer"
                >
                  <span className="-mt-1"> ×</span>{" "}
                </button>
              )}
            </div>
          </div>

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
        <div className="flex flex-col xl:flex-row w-full px-4 justify-center items-baseline gap-2 opacity-0 animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards]">
          <span className="text-violet-200  font-medium">
            Demandez à l’oracle
          </span>
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Quelle est votre question ?"
            className="px-3 w-full xl:w-96 py-2 bg-[#0d001a] border border-violet-500/20 rounded-full text-violet-100 placeholder-violet-500/40 focus:border-violet-400/50 focus:outline-none text-sm touch-manipulation"
            style={{ fontSize: "16px" }}
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
