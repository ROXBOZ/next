import { ANIMATION_DELAYS, Z_INDEX } from "@/constants/tarot";
import {
  CardReversals,
  ReadingMode,
  TarotCard,
  TarotReading,
} from "@/types/tarot";
import {
  generateCardInterpretations,
  isValidReading,
} from "@/utils/readingHelpers";
import { playClickSound, playMagicSound, playSound } from "@/utils/sound";
import { useEffect, useRef, useState } from "react";

import { generateTarotInterpretation } from "@/utils/aiInterpretation";

let whisperAudio: HTMLAudioElement | null = null;

function startWhisperSound() {
  if (whisperAudio) return;
  whisperAudio = new Audio("/archives/whisper-sound.mp3");
  whisperAudio.loop = true;
  whisperAudio.volume = 0.25;
  whisperAudio.play().catch(() => {});
}

function stopWhisperSound() {
  if (whisperAudio) {
    whisperAudio.pause();
    whisperAudio.currentTime = 0;
    whisperAudio = null;
  }
}

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
  const [manualInterpretation, setManualInterpretation] = useState<
    any[] | null
  >(null);
  // Ref pour le scroll du modal
  const modalScrollRef = useRef<HTMLDivElement>(null);
  // Store last game state to avoid unnecessary regeneration
  const [lastGameState, setLastGameState] = useState<{
    question: string;
    selectedCards: number[];
    cardReversals: CardReversals;
    readingMode: ReadingMode;
  } | null>(null);
  const [lastAIInterpretation, setLastAIInterpretation] = useState<
    string | null
  >(null);
  const [lastManualInterpretation, setLastManualInterpretation] = useState<
    any[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChoice, setShowChoice] = useState(true);
  const [userDeclined, setUserDeclined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [interpretationType, setInterpretationType] =
    useState<InterpretationType>(null);

  // Lance/arrête le son whisper quand l'interprétation IA est visible
  useEffect(() => {
    if (showModal && interpretationType === "ai") {
      startWhisperSound();
    } else {
      stopWhisperSound();
    }
    return () => {
      stopWhisperSound();
    };
  }, [showModal, interpretationType]);

  // Réinitialise l'état à chaque ouverture du modal (tirage complet ou forceOpen)
  useEffect(() => {
    if (isComplete && question && selectedCards.length > 0) {
      setShowChoice(true);
      setInterpretationType(null);
      setInterpretation(null);
      setManualInterpretation(null);
      setError(null);
      setLoading(false);
      setUserDeclined(false);
      const timer = setTimeout(() => {
        setShowModal(true);
        playMagicSound();
      }, ANIMATION_DELAYS.MODAL_SHOW);
      return () => clearTimeout(timer);
    }
  }, [isComplete, question, selectedCards.length]);

  useEffect(() => {
    if (forceOpen && isComplete && question && selectedCards.length > 0) {
      setShowChoice(false);
      setInterpretationType("explanation");
      setInterpretation(null);
      setManualInterpretation(null);
      setError(null);
      setLoading(false);
      setUserDeclined(false);
      setShowModal(true);
      playMagicSound();
      generateManualInterpretation();
    }
  }, [forceOpen, isComplete, question, selectedCards.length]);

  useEffect(() => {
    if (!isComplete) {
      resetInterpretationState();
    }
  }, [isComplete]);

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

    const reading = createReading();
    // Check if manual interpretation is already cached for this game state
    if (
      lastGameState &&
      lastManualInterpretation &&
      lastGameState.question === reading.question &&
      JSON.stringify(lastGameState.selectedCards) ===
        JSON.stringify(reading.selectedCards) &&
      JSON.stringify(lastGameState.cardReversals) ===
        JSON.stringify(reading.cardReversals) &&
      lastGameState.readingMode === reading.readingMode
    ) {
      setManualInterpretation(lastManualInterpretation);
      setInterpretation(null);
      setLoading(false);
      return;
    }
    try {
      if (!isValidReading(reading)) {
        throw new Error("Données de lecture invalides");
      }
      const interpretations = generateCardInterpretations(
        reading.selectedCards,
        cards,
        reading.cardReversals,
        reading.readingMode,
      );
      setManualInterpretation(interpretations);
      setLastManualInterpretation(interpretations);
      setLastGameState({
        question: reading.question,
        selectedCards: [...reading.selectedCards],
        cardReversals: { ...reading.cardReversals },
        readingMode: reading.readingMode,
      });
      setInterpretation(null);
    } catch (err) {
      setError(
        "Une erreur est survenue lors de la génération des explications.",
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
    setManualInterpretation(null); // Clear manual guide when switching to AI

    const reading = createReading();
    // Check if AI interpretation is already cached for this game state
    if (
      lastGameState &&
      lastAIInterpretation &&
      lastGameState.question === reading.question &&
      JSON.stringify(lastGameState.selectedCards) ===
        JSON.stringify(reading.selectedCards) &&
      JSON.stringify(lastGameState.cardReversals) ===
        JSON.stringify(reading.cardReversals) &&
      lastGameState.readingMode === reading.readingMode
    ) {
      setInterpretation(lastAIInterpretation);
      setLoading(false);
      return;
    }
    try {
      if (!isValidReading(reading)) {
        throw new Error("Données de lecture invalides");
      }
      const result = await generateTarotInterpretation(reading);
      if (result.success) {
        setInterpretation(result.interpretation || "");
        setLastAIInterpretation(result.interpretation || "");
        setLastGameState({
          question: reading.question,
          selectedCards: [...reading.selectedCards],
          cardReversals: { ...reading.cardReversals },
          readingMode: reading.readingMode,
        });
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

  const handleDeclineInterpretation = () => {
    playClickSound();
    declineInterpretation();
  };

  const scrollModalToTop = () => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGenerateAIInterpretation = () => {
    playClickSound();
    scrollModalToTop();
    generateAIInterpretation();
  };

  const handleGenerateManualInterpretation = () => {
    playClickSound();
    scrollModalToTop();
    generateManualInterpretation();
  };

  const handleResetChoice = () => {
    playClickSound();
    resetChoice();
  };

  const formatInterpretationText = (text: string): string => {
    let formatted = text.replace(
      /^### (.*)$/gm,
      "<span class='font-medium text-indigo-200 block mt-4 mb-2'>$1</span>",
    );

    formatted = formatted.replace(
      /\*\*(.*?)\*\*/g,
      "<span class='font-medium text-indigo-200'>$1</span>",
    );
    return formatted;
  };

  if (!isComplete || !showModal) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/80 px-4 py-12`}
      style={{ zIndex: Z_INDEX.MODAL }}
    >
      <div
        ref={modalScrollRef}
        className="relative max-h-[80vh] w-full overflow-y-scroll rounded-lg bg-orange-950 pb-12 text-indigo-50 shadow-2xl lg:w-fit"
      >
        <div className="px-4 pb-4">
          <button
            onClick={handleDeclineInterpretation}
            className="absolute top-0 right-0 aspect-square text-lg leading-none text-indigo-200 transition-colors hover:text-indigo-50"
            aria-label="Fermer"
          >
            ×
          </button>{" "}
          <h3 className="border-b border-indigo-500 pt-8 pb-2 text-center font-medium">
            Les cartes ont parlé...
          </h3>
        </div>
        <div className="mx-auto max-w-[65ch]">
          {showChoice && (
            <div className="px-4 pb-4 text-center">
              <div className="flex flex-col items-center gap-2 lg:flex-row">
                <button
                  className="light w-full"
                  onClick={handleGenerateAIInterpretation}
                >
                  ☁️ Interprétation célèste
                </button>
                <button
                  className="light w-full"
                  onClick={handleGenerateManualInterpretation}
                >
                  ✨ Guide pratique
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                <p className="mt-4 px-4 text-indigo-200">
                  Génération de l’explication de vos cartes...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col p-4 text-center">
              <p className="mb-2 font-medium text-balance text-indigo-300">
                Et voilà, ça merde.
              </p>
              <div className="mt-3 flex justify-center gap-3">
                <button
                  className="light"
                  onClick={
                    interpretationType === "ai"
                      ? handleGenerateAIInterpretation
                      : handleGenerateManualInterpretation
                  }
                >
                  Réessayer
                </button>
                <button onClick={handleResetChoice} className="light">
                  Retour au choix
                </button>
              </div>
            </div>
          )}

          {!showChoice && (interpretation || manualInterpretation) && (
            <div className="mx-4 mb-4">
              <div className="max-w-none border-0">
                {manualInterpretation ? (
                  <div className="flex flex-col gap-1 overflow-y-auto text-indigo-100">
                    <div className="mb-2 text-lg font-medium text-indigo-200 italic">
                      {question}
                    </div>
                    {manualInterpretation.map((interp, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-orange-900 px-4 pt-3 pb-5"
                      >
                        <div className="mb-2 font-medium">
                          {interp.position} -{" "}
                          <span className="font-medium">
                            {interp.card.name}
                          </span>
                          <span className="ml-2 text-sm font-medium text-indigo-200">
                            {interp.card.arcana === "majeur"
                              ? "arcane majeure"
                              : "arcane mineure"}
                            {interp.card.isReversed ? " (renversée)" : ""}
                          </span>
                        </div>
                        <div className="whitespace-pre-line text-indigo-100">
                          {interp.card.description}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="ai-interpretation flex flex-col text-indigo-100"
                    dangerouslySetInnerHTML={{
                      __html: formatInterpretationText(interpretation),
                    }}
                  />
                )}
                <div className="mt-6 flex justify-center gap-3">
                  {interpretationType === "explanation" ? (
                    <button
                      onClick={handleGenerateAIInterpretation}
                      className="light"
                    >
                      ☁️ Interprétation célèste
                    </button>
                  ) : (
                    <button
                      onClick={handleGenerateManualInterpretation}
                      className="light"
                    >
                      ✨ Guide pratique
                    </button>
                  )}
                  <button onClick={handleResetChoice} className="dark">
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
