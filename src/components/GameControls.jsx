import { showToast } from "@/utils/select";

function GameControls({ canShuffle, onShuffle }) {
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
    </div>
  );
}

export default GameControls;
