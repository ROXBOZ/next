import { ChangeEvent, useEffect, useRef } from "react";
import { playClickSound, playDenySound, playTypingSound } from "@/utils/sound";
import {
  validateQuestion,
  validateQuestionSilent,
} from "@/utils/questionValidation";

import { ReadingMode } from "@/types/tarot";
import { showErrorToast } from "@/utils/toast";

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
  shouldSpread?: boolean;
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
  shouldSpread = false,
  selectedCards,
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
      }, 500); // Wait 1.5 seconds after typing stops
    }
  };

  const isQuestionValid = question.trim().length > 0;
  const isQuestionValidForSubmission =
    isQuestionValid && validateQuestionSilent(question);

  const getCardsText = () => {
    if (readingMode === "3-cards") return "Choisissez 3 cartes";
    if (readingMode === "5-cards") return "Choisissez 5 cartes";
  };

  const handleShuffleClick = () => {
    if (onShuffle) {
      const success = onShuffle();
      if (!success) {
      }
    }
  };

  const handle3CardsClick = () => {
    if (!validateQuestion(question)) {
      playDenySound();
      // Show the same funny toast (it will be random/alternating)
      validateQuestion(question);
      return;
    }
    playClickSound();
    setReadingMode("3-cards");
  };

  const handle5CardsClick = () => {
    if (!validateQuestion(question)) {
      playDenySound();
      // Show the same funny toast (it will be random/alternating)
      validateQuestion(question);
      return;
    }
    playClickSound();
    setReadingMode("5-cards");
  };

  if (readingMode) {
    return (
      <div className="flex h-[110px] w-full flex-col items-center pt-4">
        <div className="flex w-[50vw] flex-col items-baseline justify-center gap-2">
          <div className="w-full animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards] text-center text-lg font-medium text-indigo-50 opacity-0">
            {question}
          </div>

          {canShuffle ? (
            <button
              onClick={handleShuffleClick}
              className="dark mx-auto! animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards]"
            >
              {isShuffling ? (
                <span className="animate-[flopAnimation_0.6s_ease-in-out_infinite]">
                  flop flop
                </span>
              ) : (
                "Mélangez"
              )}
            </button>
          ) : (
            // Show card instructions when shuffle button is gone and before any card is selected
            shouldSpread &&
            selectedCards.length === 0 && (
              <div className="flex-block w-full text-center whitespace-nowrap text-indigo-400">
                {getCardsText()}
              </div>
            )
          )}

          {showInterpretationButton && onOpenInterpretation && (
            <button onClick={onOpenInterpretation} className="dark mx-auto!">
              Interprétez
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[110px] w-full pt-4">
      <div className="mx-auto flex h-full w-screen flex-col items-center gap-2">
        <div className="flex w-full animate-[fadeIn_0.2s_ease-in-out_0.2s_forwards] flex-col items-baseline justify-center gap-2 px-4 opacity-0 lg:flex-row">
          <span className="sr-only font-medium whitespace-nowrap text-indigo-200">
            Demandez à l’oracle
          </span>
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Quelle est votre question ?"
            className="mx-auto w-full max-w-[400px] touch-manipulation rounded-full border border-indigo-500/20 bg-[#0d001a] px-3 py-2 text-lg text-indigo-100 placeholder-indigo-500/40 focus:border-indigo-400/50 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {isQuestionValid && (
            <>
              <span className="animate-[fadeIn_0.2s_ease-in-out_0.4s_forwards] font-medium whitespace-nowrap text-indigo-200 opacity-0">
                Choisissez un tirage
              </span>
              <div className="flex animate-[fadeIn_0.2s_ease-in-out_0.6s_forwards] items-baseline gap-2 opacity-0">
                <button
                  className={`dark ${!isQuestionValidForSubmission ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={handle3CardsClick}
                  disabled={!isQuestionValidForSubmission}
                >
                  simple
                </button>
                <span className="text-indigo-200">ou</span>
                <button
                  className={`dark ${!isQuestionValidForSubmission ? "cursor-not-allowed opacity-50" : ""}`}
                  onClick={handle5CardsClick}
                  disabled={!isQuestionValidForSubmission}
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
