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
  isShuffling?: boolean;
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
  isShuffling = false,
}: ModeSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!readingMode && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [readingMode]);

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

    // Validate any text that's long enough to potentially be gibberish
    if (newValue.trim().length > 3) {
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
      <div className="flex h-fit w-full flex-col items-center pt-4 xl:h-[100px]">
        <div className="flex w-1/2 flex-col items-center gap-3 p-2">
          <div className="animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards] text-violet-100 opacity-0">
            <div className="group relative -mt-4 -rotate-2 rounded-full bg-indigo-950 px-12 py-1 font-semibold whitespace-nowrap">
              <span className="italic">{question}</span>
            </div>
          </div>

          <div className="-ml-4! flex w-screen animate-[fadeIn_0.2s_ease-in-out_0.4s_forwards] flex-col items-center justify-center gap-2 opacity-0 xl:flex-row">
            {canShuffle && (
              <button
                onClick={handleShuffleClick}
                className="light relative flex w-[100px] items-center justify-center overflow-hidden"
              >
                {isShuffling ? (
                  <span className="animate-[flopAnimation_0.6s_ease-in-out_infinite]">
                    flop flop
                  </span>
                ) : (
                  "Mélangez"
                )}
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
    <div className="h-[160px] w-full pt-4 xl:h-[100px]">
      <div className="mx-auto flex h-full w-screen flex-col items-center gap-2">
        <div className="flex w-full animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards] flex-col items-baseline justify-center gap-2 px-4 opacity-0 xl:flex-row">
          <span className="font-medium whitespace-nowrap text-violet-200">
            Demandez à l’oracle
          </span>
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Quelle est votre question ?"
            className="w-full touch-manipulation rounded-full border border-violet-500/20 bg-[#0d001a] px-3 py-2 text-sm text-violet-100 placeholder-violet-500/40 focus:border-violet-400/50 focus:outline-none xl:w-72"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="flex h-[32px] flex-col items-center gap-2 xl:flex-row">
          {isQuestionValid && (
            <>
              <span className="animate-[fadeIn_0.2s_ease-in-out_0.4s_forwards] font-medium whitespace-nowrap text-violet-200 opacity-0">
                Choisissez entre un tirage
              </span>
              <div className="flex animate-[fadeIn_0.2s_ease-in-out_0.6s_forwards] items-baseline gap-2 opacity-0">
                <button className="light" onClick={handle3CardsClick}>
                  simple
                </button>
                <span className="text-violet-200">ou</span>
                <button className="light" onClick={handle5CardsClick}>
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
