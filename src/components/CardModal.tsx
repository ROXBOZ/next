import { TarotCard } from "@/types/tarot";
import { playFlipSound } from "@/utils/sound";
import { useEffect } from "react";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: TarotCard;
  isReversed: boolean;
}

function CardModal({ isOpen, onClose, card, isReversed }: CardModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      playFlipSound();

      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
          style={{ zIndex: 10000 }}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div
          className={`card-classes flex w-full transform flex-col justify-between gap-4 overflow-hidden bg-orange-900 shadow-2xl transition-transform duration-300`}
        >
          <div className="flex w-full flex-col items-center bg-indigo-950 bg-gradient-to-b pt-4 pb-6 text-center text-orange-400">
            {card.number}

            <div className="w-full px-4 text-center text-lg font-medium uppercase">
              {card.name}
            </div>
          </div>
          <div className="flex h-full w-full items-center justify-center text-lg text-orange-500">
            illustration
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
