import { TarotCard } from "@/types/tarot";
import { useEffect } from "react";

interface MobileSelectionModalProps {
  isOpen: boolean;
  card: TarotCard;
  isReversed: boolean;
}

function MobileSelectionModal({
  isOpen,
  card,
  isReversed,
}: MobileSelectionModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200"
      style={{ zIndex: 9999 }}
    >
      <div className="animate-in zoom-in-95 relative mx-4 w-full max-w-sm duration-300">
        <div
          className={`card-classes flex w-full scale-110 transform flex-col justify-between gap-4 overflow-hidden bg-orange-900 shadow-2xl`}
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

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 transform text-center text-white/80">
          <div className="text-sm font-medium">Carte sélectionnée!</div>
        </div>
      </div>
    </div>
  );
}

export default MobileSelectionModal;
