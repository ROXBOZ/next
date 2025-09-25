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
  // Prevent body scroll when modal is open
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
      className="fixed inset-0 p-4 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ zIndex: 9999 }}
    >
      <div className="relative max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
        {/* Card in correct orientation */}
        <div
          className={`
            aspect-[2/3] w-full rounded-2xl bg-orange-900
            flex gap-4 flex-col overflow-hidden justify-between
            shadow-2xl transform scale-110
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

        {/* Selection indicator */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-center">
          <div className="text-sm font-medium">Carte sélectionnée!</div>
        </div>
      </div>
    </div>
  );
}

export default MobileSelectionModal;
