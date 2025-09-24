import { showToast } from "@/utils/select";

function GameControls({
  canShuffle,
  onShuffle,
  onOpenInterpretation,
  showInterpretationButton,
}) {
  const handleShuffleClick = () => {
    const success = onShuffle();
    if (!success) {
      showToast("Impossible de mélanger pendant le tirage!");
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleShuffleClick}
        className={`light ${canShuffle ? "" : "disabled"}`}
      >
        Mélanger
      </button>
      {showInterpretationButton && (
        <button onClick={onOpenInterpretation} className="light">
          Interpréter
        </button>
      )}
    </div>
  );
}

export default GameControls;
