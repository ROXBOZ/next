import { ANIMATION_DELAYS, Z_INDEX } from "@/constants/tarot";
import {
  CardReversals,
  ReadingMode,
  TarotCard,
  TarotReading,
} from "@/types/tarot";
import {
  generateCardExplanations,
  isValidReading,
} from "@/utils/readingHelpers";
import { useEffect, useState } from "react";

import { generateTarotInterpretation } from "@/utils/aiInterpretation";

interface TarotInterpretationProps {
  question: string;
  selectedCards: number[];
  cardReversals: CardReversals;
  readingMode: ReadingMode;
  isComplete: boolean;
  cards: TarotCard[];
  forceOpen?: boolean;
  onModalClose?: () => void;
}

type InterpretationType = "ai" | "explanation" | null;

function TarotInterpretation({
  question,
  selectedCards,
  cardReversals,
  readingMode,
  isComplete,
  cards,
  forceOpen = false,
  onModalClose,
}: TarotInterpretationProps) {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChoice, setShowChoice] = useState(true);
  const [userDeclined, setUserDeclined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [interpretationType, setInterpretationType] =
    useState<InterpretationType>(null);

  // Show modal with delay when reading is complete
  useEffect(() => {
    if (isComplete && question && selectedCards.length > 0) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, ANIMATION_DELAYS.MODAL_SHOW);

      return () => clearTimeout(timer);
    }
  }, [isComplete, question, selectedCards.length]);

  // Handle force open from external button - automatically show guide
  useEffect(() => {
    if (forceOpen && isComplete && question && selectedCards.length > 0) {
      setShowModal(true);
      setShowChoice(false);
      setUserDeclined(false);
      // Automatically generate the guide interpretation
      generateManualInterpretation();
    }
  }, [forceOpen, isComplete, question, selectedCards.length]);

  // Reset all states when game is reset (isComplete becomes false)
  useEffect(() => {
    if (!isComplete) {
      resetInterpretationState();
    }
  }, [isComplete]);

  // Block/unblock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const resetInterpretationState = () => {
    setShowModal(false);
    setShowChoice(true);
    setUserDeclined(false);
    setInterpretation(null);
    setError(null);
    setLoading(false);
    setInterpretationType(null);
  };

  const createReading = (): TarotReading => ({
    question,
    selectedCards,
    cardReversals,
    readingMode,
  });

  const generateManualInterpretation = async () => {
    setLoading(true);
    setError(null);
    setShowChoice(false);
    setInterpretationType("explanation");

    try {
      const reading = createReading();

      if (!isValidReading(reading)) {
        throw new Error("Données de lecture invalides");
      }

      const explanation = generateCardExplanations(reading, cards);
      setInterpretation(explanation);
    } catch (err) {
      setError(
        "Une erreur est survenue lors de la génération des explications."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateAIInterpretation = async () => {
    setLoading(true);
    setError(null);
    setShowChoice(false);
    setInterpretationType("ai");

    try {
      const reading = createReading();

      if (!isValidReading(reading)) {
        throw new Error("Données de lecture invalides");
      }

      const result = await generateTarotInterpretation(reading);

      if (result.success) {
        setInterpretation(result.interpretation || "");
      } else {
        setError(result.error || "Erreur inconnue");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'interprétation AI.");
    } finally {
      setLoading(false);
    }
  };

  const declineInterpretation = () => {
    setUserDeclined(true);
    setShowChoice(false);
    setShowModal(false);
    // Notify parent that modal has been closed
    onModalClose?.();
  };

  const resetChoice = () => {
    setShowChoice(true);
    setUserDeclined(false);
    setInterpretation(null);
    setError(null);
    setInterpretationType(null);
    setShowModal(true);
  };

  const formatInterpretationText = (text: string): string => {
    return text.replace(
      /\*\*(.*?)\*\*/g,
      "<span class='font-semibold text-amber-300'>$1</span>"
    );
  };

  if (!isComplete || !showModal) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 bg-black/95`}
      style={{ zIndex: Z_INDEX.MODAL }}
    >
      <div className="bg-orange-950 relative text-violet-50 pb-4 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="max-w-[65ch] mx-auto">
          {/* Header */}
          <div className="p-4 relative">
            <button
              onClick={declineInterpretation}
              className="absolute top-0 right-0 aspect-square text-violet-300 hover:text-violet-50 transition-colors leading-none text-lg"
              aria-label="Fermer"
            >
              ×
            </button>{" "}
            <h3 className="font-semibold border-b border-violet-500 pb-2 pt-8">
              Votre tirage est complet
            </h3>
          </div>

          {/* Choice Interface */}
          {showChoice && (
            <div className="text-center p-4">
              <div className="flex flex-col gap-2 items-center">
                <button
                  className="light w-full"
                  onClick={generateAIInterpretation}
                >
                  🤖 Interprétation IA
                </button>
                <button
                  className="light w-full"
                  onClick={generateManualInterpretation}
                >
                  ✨ Guide pratique
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                <p className="mt-4 text-violet-200">
                  Génération de l'explication de vos cartes...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-8 mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={
                    interpretationType === "ai"
                      ? generateAIInterpretation
                      : generateManualInterpretation
                  }
                  className="px-4 py-2 bg-red-600 text-violet-50 rounded hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={resetChoice}
                  className="px-4 py-2 bg-gray-600 text-violet-50 rounded hover:bg-gray-700 transition-colors"
                >
                  Retour au choix
                </button>
              </div>
            </div>
          )}

          {/* Interpretation Result */}
          {interpretation && (
            <div className="mx-8 mb-4">
              <div className="max-w-none border-0">
                <div
                  className="leading-relaxed whitespace-pre-line text-violet-100 border-0"
                  style={{ border: "none", outline: "none" }}
                  dangerouslySetInnerHTML={{
                    __html: formatInterpretationText(interpretation),
                  }}
                />

                <div className="flex gap-3 justify-center mt-6">
                  {interpretationType === "explanation" ? (
                    <button
                      onClick={generateAIInterpretation}
                      className="light"
                    >
                      🤖 Interprétation IA
                    </button>
                  ) : (
                    <button
                      onClick={generateManualInterpretation}
                      className="light"
                    >
                      ✨ Guide pratique
                    </button>
                  )}
                  <button onClick={resetChoice} className="dark">
                    Retour au choix
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarotInterpretation;
