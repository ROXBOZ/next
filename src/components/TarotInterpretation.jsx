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

  useEffect(() => {
    if (isComplete && question && selectedCards.length > 0) {
      generateInterpretation();
    }
  }, [isComplete, question, selectedCards, cardReversals, readingMode]);

  const generateInterpretation = async () => {
    setLoading(true);
    setError(null);

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

  if (!isComplete) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Interprétation de votre tirage
        </h3>
        <p className="text-gray-600 italic">"{question}"</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            <p className="mt-4 text-gray-600">
              L'IA analyse vos cartes et génère votre interprétation...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={generateInterpretation}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {interpretation && (
        <div className="prose max-w-none">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: interpretation.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              ),
            }}
          />

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={generateInterpretation}
              className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
            >
              Nouvelle interprétation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TarotInterpretation;
