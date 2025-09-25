import { TarotCard } from "@/types/tarot";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset image error state when card changes
    setImageError(false);
  }, [card.id]);

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
          style={{
            transform: `rotate(${isReversed ? 180 : 0}deg) scale(1.1)`,
          }}
          className={`card-classes relative flex w-full flex-col justify-between gap-4 overflow-hidden bg-orange-900 transition-all duration-300 ${
            isReversed
              ? "shadow-[-4px_-4px_6px_rgba(0,0,0,0.5)]"
              : "shadow-[4px_4px_6px_rgba(0,0,0,0.5)]"
          } shadow-2xl`}
        >
          <div className="flex w-full flex-col items-center bg-indigo-950 bg-gradient-to-b pt-4 pb-6 text-center text-orange-400">
            {card.number}

            <div className="w-full px-4 text-center text-lg font-medium uppercase">
              {card.name}
            </div>
          </div>
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-sm text-orange-300/60">
              <div className="font-mono text-lg">{card.id}.jpg</div>
            </div>
          ) : (
            <Image
              src={`/frontIllustration/${card.id}.jpg`}
              alt={card.name}
              width={300}
              height={500}
              className="absolute inset-0 -z-30 h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileSelectionModal;
