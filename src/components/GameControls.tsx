import { ReadingMode } from "@/types/tarot";
import { showWarningToast } from "@/utils/toast";

interface GameControlsProps {
  canShuffle: boolean;
  onShuffle: () => boolean;
  showInterpretationButton?: boolean;
  onOpenInterpretation?: () => void;
  readingMode?: ReadingMode | null;
}

function GameControls({
  canShuffle,
  onShuffle,
  showInterpretationButton = false,
  onOpenInterpretation,
  readingMode,
}: GameControlsProps) {
  const handleShuffleClick = () => {
    const success = onShuffle();
    if (!success) {
      showWarningToast("Impossible de mélanger pendant le tirage!");
    }
  };

  const getCardsText = () => {
    if (readingMode === "3-cards") return "choisissez 3 cartes";
    if (readingMode === "5-cards") return "choisissez 5 cartes";
    return "et choisissez vos cartes";
  };

  return (
    <div className="mb-4 flex min-h-[40px] items-center justify-center gap-4">
      {readingMode && (
        <>
          <button
            onClick={handleShuffleClick}
            className={`light ${canShuffle ? "" : "hidden!"}`}
          >
            Mélangez
          </button>
          {!showInterpretationButton && canShuffle && (
            <div className="text-indigo-50">{getCardsText()}</div>
          )}
        </>
      )}
      {showInterpretationButton && onOpenInterpretation && (
        <button onClick={onOpenInterpretation} className="light">
          Interprétez
        </button>
      )}
    </div>
  );
}

export default GameControls;
