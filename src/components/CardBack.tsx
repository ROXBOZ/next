import { ReadingMode, TarotCard } from "@/types/tarot";
import { useEffect, useState } from "react";

import Image from "next/image";
import { calculateCardRotation } from "@/utils/cardHelpers";

interface CardBackProps {
  data: TarotCard;
  position?: number;
  onClick?: () => void;
  isLast?: boolean;
  isReversed?: boolean;
  lastCardRef?: React.RefObject<HTMLDivElement> | null;
  readingMode?: ReadingMode | null;
  shouldSpread?: boolean;
}

function CardBack({
  data,
  position,
  onClick,
  isLast = false,
  isReversed = false,
  shouldSpread = false,
  lastCardRef = null,
}: CardBackProps) {
  const finalRotation = calculateCardRotation(data.id, isReversed);
  const [isTouched, setIsTouched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [marginLeft, setMarginLeft] = useState(-180);
  const [hasModeJustBeenSelected, setHasModeJustBeenSelected] = useState(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (shouldSpread) {
      setTimeout(() => {
        setMarginLeft(-165);
      }, 2);
    } else {
      setMarginLeft(-180);
    }
  }, [shouldSpread, position]);

  useEffect(() => {
    if (hasModeJustBeenSelected) {
      if (position && position > 1) {
        const timeout = setTimeout(() => setMarginLeft(-165), 2);
        return () => clearTimeout(timeout);
      } else {
        setMarginLeft(-180);
      }
    } else {
      setMarginLeft(-180);
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
      ref={isLast && lastCardRef ? lastCardRef : undefined}
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
          ? "animate-pulse border-indigo-400 shadow-lg shadow-indigo-400/30"
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
        priority
      />
    </div>
  );
}

export default CardBack;
