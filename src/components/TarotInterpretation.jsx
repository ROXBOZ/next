import { useEffect, useState } from "react";

import { generateTarotInterpretation } from "@/utils/aiInterpretation";

function TarotInterpretation({
  question,
  selectedCards,
  cardReversals,
  readingMode,
  isComplete,
}) {
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChoice, setShowChoice] = useState(true);
  const [userDeclined, setUserDeclined] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Show modal with 2 second delay when reading is complete
  useEffect(() => {
    if (isComplete && question && selectedCards.length > 0) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000); // 2 second delay

      return () => clearTimeout(timer);
    }
  }, [isComplete, question, selectedCards.length]);

  // Reset all states when game is reset (isComplete becomes false)
  useEffect(() => {
    if (!isComplete) {
      setShowModal(false);
      setShowChoice(true);
      setUserDeclined(false);
      setInterpretation(null);
      setError(null);
      setLoading(false);
    }
  }, [isComplete]);

  // Block/unblock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      // Block scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "unset";
    }

    // Cleanup: restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // Remove automatic generation - let user choose
  const generateInterpretation = async () => {
    setLoading(true);
    setError(null);
    setShowChoice(false);

    try {
      const result = await generateTarotInterpretation({
        question,
        selectedCards,
        cardReversals,
        readingMode,
      });

      if (result.success) {
        setInterpretation(result.interpretation);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'interprétation.");
    } finally {
      setLoading(false);
    }
  };

  const declineInterpretation = () => {
    setUserDeclined(true);
    setShowChoice(false);
    // Close modal immediately
    setShowModal(false);
  };

  const resetChoice = () => {
    setShowChoice(true);
    setUserDeclined(false);
    setInterpretation(null);
    setError(null);
    setShowModal(true); // Reopen modal
  };

  if (!isComplete || !showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80">
      <div className="bg-violet-950 text-violet-50 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="max-w-[65ch] mx-auto">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-xl font-semibold mb-2">
              Votre tirage est complet
            </h3>
            <p className=" italic">"{question}"</p>
          </div>

          {/* Choice Interface */}
          {showChoice && (
            <div className="text-center py-8">
              <h4 className="text-lg mb-6">
                Souhaitez-vous une interprétation générée par l'IA ?
              </h4>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={generateInterpretation}
                  className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Oui, interpréter avec l'IA
                </button>
                <button
                  onClick={declineInterpretation}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Non, je préfère interpréter moi-même
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                <p className="mt-4 ">
                  L'IA analyse vos cartes et génère votre interprétation...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={generateInterpretation}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={resetChoice}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Retour au choix
                </button>
              </div>
            </div>
          )}

          {/* AI Interpretation */}
          {interpretation && (
            <div>
              <h4 className="text-lg mb-4 border-b pb-2">
                🤖 Interprétation IA
              </h4>
              <div className="prose max-w-none">
                <div
                  className="leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: interpretation.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />

                <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                  <button onClick={generateInterpretation}>
                    Nouvelle interprétation
                  </button>
                  <button
                    onClick={resetChoice}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
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
