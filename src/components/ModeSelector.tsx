import { ChangeEvent, useEffect, useRef, useState } from "react";
import { playClickSound, playDenySound, playTypingSound } from "@/utils/sound";
import { showErrorToast, showToast } from "@/utils/toast";
import {
  validateQuestion,
  validateQuestionSilent,
} from "@/utils/questionValidation";

import { ReadingMode } from "@/types/tarot";

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
  const shuffleReminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hasShownShuffleReminder, setHasShownShuffleReminder] = useState(false);

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
      if (shuffleReminderTimeoutRef.current) {
        clearTimeout(shuffleReminderTimeoutRef.current);
      }
    };
  }, []);

  // Effect to show toast when shuffle button is visible for 3 seconds
  useEffect(() => {
    // If the shuffle button is visible and we haven't shown the reminder yet
    if (readingMode && canShuffle && !isShuffling && !hasShownShuffleReminder) {
      // Clear any existing timeout
      if (shuffleReminderTimeoutRef.current) {
        clearTimeout(shuffleReminderTimeoutRef.current);
      }

      // Set timeout to show the toast after 3 seconds
      shuffleReminderTimeoutRef.current = setTimeout(() => {
        // Check again if shuffle button is still visible before showing toast
        if (readingMode && canShuffle && !isShuffling) {
          const funnyMessages = ["C'est pour aujourd'hui ?"];

          const randomIndex = Math.floor(Math.random() * funnyMessages.length);
          showToast({ message: funnyMessages[randomIndex], type: "warning" });
          setHasShownShuffleReminder(true);
        }
      }, 3000);

      return () => {
        if (shuffleReminderTimeoutRef.current) {
          clearTimeout(shuffleReminderTimeoutRef.current);
        }
      };
    }

    // Reset the flag when conditions change
    if (!readingMode || !canShuffle || isShuffling) {
      setHasShownShuffleReminder(false);
    }
  }, [readingMode, canShuffle, isShuffling, hasShownShuffleReminder]);

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
    // Clear any pending shuffle reminder
    if (shuffleReminderTimeoutRef.current) {
      clearTimeout(shuffleReminderTimeoutRef.current);
      shuffleReminderTimeoutRef.current = null;
    }

    // Vérifions que la question est toujours valide avant de mélanger
    if (!question.trim()) {
      playDenySound();
      showToast({
        message: "Mais décidez déjà de ce que vous voulez savoir!",
        type: "warning",
      });
      return;
    }

    if (!validateQuestionSilent(question)) {
      playDenySound();
      // Appel direct de validateQuestion qui gérera l'affichage du toast de charabia
      validateQuestion(question);
      return;
    }

    if (onShuffle) {
      const success = onShuffle();
      if (!success) {
        // Handle shuffle failure if needed
      }
    }

    // Reset the flag so we don't show the toast again
    setHasShownShuffleReminder(true);
  };

  const handle3CardsClick = () => {
    if (!question.trim()) {
      playDenySound();
      showToast({
        message: "Mais décidez déjà de ce que vous voulez savoir!",
        type: "warning",
      });
      return;
    }
    if (!validateQuestion(question)) {
      playDenySound();
      // La fonction validateQuestion va déjà afficher le toast de charabia
      return;
    }
    playClickSound();
    setReadingMode("3-cards");
  };

  const handle5CardsClick = () => {
    if (!question.trim()) {
      playDenySound();
      showToast({
        message: "Mais décidez déjà de ce que vous voulez savoir!",
        type: "warning",
      });
      return;
    }
    if (!validateQuestion(question)) {
      playDenySound();
      // La fonction validateQuestion va déjà afficher le toast de charabia
      return;
    }
    playClickSound();
    setReadingMode("5-cards");
  };

  if (readingMode) {
    return (
      <div className="flex h-[110px] w-full flex-col items-center pt-4">
        <div className="flex w-[50vw] flex-col items-baseline justify-center gap-6 bg-red-500">
          <div className="z-50 w-full text-center text-lg font-medium text-indigo-50">
            {question}
          </div>

          {canShuffle ? (
            <button onClick={handleShuffleClick} className="dark mx-auto!">
              {isShuffling ? <span>flop flop</span> : <span>Mélangez</span>}
            </button>
          ) : (
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
