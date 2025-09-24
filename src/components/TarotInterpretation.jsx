import {
  generateTarotInterpretation,
  getPositionMeanings,
} from "@/utils/aiInterpretation";
import { useEffect, useState } from "react";

import { tarot_cards } from "@/data.json";

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
  const [interpretationType, setInterpretationType] = useState(null); // 'ai' or 'explanation'

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
      setInterpretationType(null);
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
    setInterpretationType("explanation");

    try {
      // Generate card explanations instead of AI interpretation
      const explanation = generateCardExplanations();
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
      setError("Une erreur est survenue lors de l'interprétation AI.");
    } finally {
      setLoading(false);
    }
  };

  const generateCardExplanations = () => {
    const positions = getPositionMeanings(readingMode);
    let explanation = `**Question :** "${question}"\n\n`;

    selectedCards.forEach((cardId, index) => {
      const card = tarot_cards.find((c) => c.id === cardId);
      if (!card) return;

      const position = positions[index];
      const isReversed = cardReversals[cardId] || false;
      const arcanaType = card.id <= 21 ? "Arcane Majeur" : "Arcane Mineur";

      // Add explanations for arcana type and position
      const arcanaExplanation =
        card.id <= 21
          ? "Les Arcanes Majeurs représentent les grandes leçons de vie, les archétypes universels et les événements spirituellement significatifs."
          : "Les Arcanes Mineurs traitent des aspects quotidiens de la vie, des situations pratiques et des émotions courantes.";

      const positionExplanation = isReversed
        ? "Une carte inversée suggère des énergies bloquées, des leçons intérieures à apprendre, ou une approche différente nécessaire."
        : "Une carte à l’endroit indique des énergies qui s'expriment pleinement et positivement dans votre situation.";

      //   explanation += `**${position.title} (${position.meaning}):**\n`;
      explanation += `🔮 **${position.title} - ${card.name}**\n`;
      explanation += `${card.description}\n`;
      explanation += `**${arcanaType} (${card.number}) :** ${arcanaExplanation}\n`;
      explanation += `${
        isReversed
          ? `**Position inversée :** ${
              positionExplanation.charAt(0).toLowerCase() +
              positionExplanation.slice(1)
            }\n\n`
          : `**Position droite :** ${
              positionExplanation.charAt(0).toLowerCase() +
              positionExplanation.slice(1)
            }\n\n`
      }`;
    });

    // explanation += `**À vous d'interpréter :**\n`;
    // explanation += `Prenez le temps d'observer ces informations et de ressentir ce qu'elles évoquent pour vous en relation avec votre question. Votre intuition personnelle est la clé d'une interprétation authentique.`;

    return explanation;
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
    setInterpretationType(null);
    setShowModal(true); // Reopen modal
  };

  if (!isComplete || !showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90">
      <div className="bg-violet-950 relative text-violet-50 pb-2 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto  shadow-2xl">
        <div className="max-w-[65ch] mx-auto">
          <div className=" px-8 py-4 relative">
            <h3 className="font-semibold border-b border-violet-500 pb-2 pt-6">
              Votre tirage est complet
            </h3>
            <button
              onClick={declineInterpretation}
              className="absolute top-2 right-2 text-violet-300 hover:text-white transition-colors leading-none text-lg"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          {/* Choice Interface */}
          {showChoice && (
            <div className="text-center px-8 pb-4">
              <div className="flex flex-col gap-2 items-center">
                <button
                  className="dark w-full"
                  onClick={generateAIInterpretation}
                >
                  🤖 Interprétation IA
                </button>
                <button
                  className="dark w-full"
                  onClick={generateInterpretation}
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
                <p className="mt-4 ">
                  Génération de l'explication de vos cartes...
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
              <div className="prose max-w-none">
                <div
                  className="leading-relaxed whitespace-pre-line px-8"
                  dangerouslySetInnerHTML={{
                    __html: interpretation.replace(
                      /\*\*(.*?)\*\*/g,
                      "<span>$1</span>"
                    ),
                  }}
                />

                <button onClick={resetChoice} className="dark mx-8 mb-8">
                  Retour au choix
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarotInterpretation;
