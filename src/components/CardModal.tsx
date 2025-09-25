import { TarotCard } from "@/types/tarot";
import { useEffect } from "react";
import { playFlipSound } from "@/utils/sound";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: TarotCard;
  isReversed: boolean;
}

function CardModal({ isOpen, onClose, card, isReversed }: CardModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Play flip sound when modal opens
      playFlipSound();

      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
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
        className="relative max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all"
          style={{ zIndex: 10000 }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Card in correct orientation (never reversed in modal) */}
        <div
          className={`
            aspect-[2/3] w-full rounded-3xl bg-orange-900
            flex gap-4 flex-col overflow-hidden justify-between
            shadow-2xl transform transition-transform duration-300
          `}
        >
          <div className="text-center flex flex-col w-full items-center pt-4 pb-6 bg-gradient-to-b bg-indigo-950 text-orange-400">
            {card.number}

            <div className="text-center w-full font-medium uppercase text-lg px-4">
              {card.name}
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center text-orange-500 text-lg">
            illustration
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
