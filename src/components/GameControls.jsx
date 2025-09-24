import { showToast } from "@/utils/select";

function GameControls({ canShuffle, onShuffle, onReset }) {
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
        className={canShuffle ? "" : "disabled"}
      >
        Mélanger
      </button>
      <button onClick={onReset}>Recommencer</button>
    </div>
  );
}

export default GameControls;
