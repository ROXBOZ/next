import { useEffect, useState } from "react";

import Image from "next/image";
import { TarotCard } from "@/types/tarot";
import { calculateCardRotation } from "@/utils/cardHelpers";

interface CardBackProps {
  data: TarotCard;
  position?: number;
  onClick?: () => void;
  isLast?: boolean;
  isReversed?: boolean;
}

function CardBack({
  data,
  position,
  onClick,
  isLast = false,
  isReversed = false,
}: CardBackProps) {
  const finalRotation = calculateCardRotation(data.id, isReversed);
  const [isTouched, setIsTouched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device supports touch
  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleTouchStart = () => {
    if (isMobile) {
      setIsTouched(true);
      // Add haptic feedback if supported (iOS Safari and some Android browsers)
      if ("vibrate" in navigator) {
        navigator.vibrate(10); // Very short vibration for feedback
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      // Small delay to allow user to see the visual feedback before reverting
      setTimeout(() => setIsTouched(false), 150);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg) ${
          isTouched && isMobile ? "translateY(-15px) scale(1.05)" : ""
        }`,
        touchAction: "manipulation",
      }}
      className={`
        aspect-[2/3] w-[190px] border bg-[#15102d]
        object-contain rounded-xl overflow-hidden flex items-center
        cursor-pointer flex-shrink-0 transition-all duration-200
        ${position && position > 1 ? "-ml-[172px]" : ""}
        ${
          isTouched && isMobile
            ? "border-violet-400 shadow-lg shadow-violet-400/30 animate-pulse"
            : "border-orange-950"
        }

        /* Desktop hover effects */
        md:hover:translate-y-[-30px] md:hover:rotate-${isReversed ? "180" : "0"}
        md:transition-all md:duration-300
      `}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isLast && (
        <div
          className="bg-gradient-to-r from-black/40 to-transparent w-full h-full absolute top-0 left-0"
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
