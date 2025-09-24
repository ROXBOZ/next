import { showWarningToast } from "@/utils/toast";

interface GameControlsProps {
  canShuffle: boolean;
  onShuffle: () => boolean;
  showInterpretationButton?: boolean;
  onOpenInterpretation?: () => void;
}

function GameControls({
  canShuffle,
  onShuffle,
  showInterpretationButton = false,
  onOpenInterpretation,
}: GameControlsProps) {
  const handleShuffleClick = () => {
    const success = onShuffle();
    if (!success) {
      showWarningToast("Impossible de mélanger pendant le tirage!");
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleShuffleClick}
        className={`light ${canShuffle ? "" : "disabled"}`}
        disabled={!canShuffle}
      >
        Mélanger
      </button>

      {showInterpretationButton && onOpenInterpretation && (
        <button onClick={onOpenInterpretation} className="light">
          Interpréter
        </button>
      )}
    </div>
  );
}

export default GameControls;
