import { useEffect, useState } from "react";

import Image from "next/image";
import { TarotCard } from "@/types/tarot";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: TarotCard;
  isReversed: boolean;
}

function CardModal({ isOpen, onClose, card }: CardModalProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [card.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div
          className={`card-classes relative flex w-full transform flex-col justify-between gap-4 overflow-hidden bg-orange-900 shadow-2xl transition-transform duration-300`}
        >
          <div className="sr-only z-40 flex h-full w-full flex-col items-center justify-between bg-gradient-to-b p-4 text-center text-orange-400 *:rounded-full *:bg-indigo-950">
            <span className="flex px-4 py-2 font-medium">{card.number}</span>

            <div className="w-full px-4 py-2 text-center font-medium uppercase">
              {card.name}
            </div>
          </div>
          {!imageError && (
            <Image
              src={`/cards/${card.id}.jpg`}
              alt={card.name}
              width={300}
              height={500}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardModal;
