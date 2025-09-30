import { ReadingMode, TarotCard } from "@/types/tarot";
import { useEffect, useState } from "react";

import Image from "next/image";
import { calculateCardRotation } from "@/utils/cardHelpers";
import { playSpreadSound } from "@/utils/sound";

interface CardBackProps {
  data: TarotCard;
  position?: number;
  onClick?: () => void;
  isLast?: boolean;
  isReversed?: boolean;
  readingMode?: ReadingMode | null;
  shouldSpread?: boolean;
}

function CardBack({
  data,
  position,
  onClick,
  isLast = false,
  isReversed = false,
  readingMode = null,
  shouldSpread = false,
}: CardBackProps) {
  const finalRotation = calculateCardRotation(data.id, isReversed);
  const [isTouched, setIsTouched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [marginLeft, setMarginLeft] = useState(-180); // initial -ml-[180px]
  const [hasModeJustBeenSelected, setHasModeJustBeenSelected] = useState(false);
  // Remove prevReadingMode logic

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Animate marginLeft ONLY when readingMode transitions from null to a value
  // Animate marginLeft ONLY when shouldSpread is true
  useEffect(() => {
    if (shouldSpread) {
      setTimeout(() => setMarginLeft(-165), 2); // spring animation
    } else {
      setMarginLeft(-180); // reset if not spreading
    }
  }, [shouldSpread, position]);

  useEffect(() => {
    if (hasModeJustBeenSelected) {
      if (position && position > 1) {
        const timeout = setTimeout(() => setMarginLeft(-165), 2); // spring animation, adjust spread here
        return () => clearTimeout(timeout);
      } else {
        setMarginLeft(-180); // reset if not spreading
      }
    } else {
      setMarginLeft(-180); // always default before mode selection
    }
  }, [hasModeJustBeenSelected, position]);

  const handleTouchStart = () => {
    if (isMobile) {
      setIsTouched(true);
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) setTimeout(() => setIsTouched(false), 150);
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      style={{
        zIndex: position || data.id,
        marginLeft: `${marginLeft}px`,
        transform: `rotate(${finalRotation}deg) ${
          isTouched && isMobile ? "translateY(-10px) scale(1.05)" : ""
        }`,
        transition:
          "margin-left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.2s",
        touchAction: "manipulation",
      }}
      className={`card-classes flex w-[180px] flex-shrink-0 cursor-pointer items-center overflow-hidden border bg-[#15102d] object-contain ${
        isTouched && isMobile
          ? "animate-pulse border-violet-400 shadow-lg shadow-violet-400/30"
          : "border-orange-950"
      } md:hover:translate-y-[-30px] md:hover:rotate-${isReversed ? "180" : "0"} md:transition-all md:duration-300`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isLast && (
        <div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black/40 to-transparent"
          style={{
            transform: isReversed ? "rotate(180deg)" : "none",
          }}
        />
      )}
      <Image
        src="/backIllustration.png"
        alt="Card Back"
        width={200}
        height={300}
      />
    </div>
  );
}

export default CardBack;
