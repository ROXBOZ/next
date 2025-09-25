import { TarotCard } from "@/types/tarot";
import { calculateCardRotation } from "@/utils/cardHelpers";
import Image from "next/image";
import { useState, useEffect } from "react";

interface CardFrontProps {
  data: TarotCard;
  position?: number;
  onClick?: () => void;
  isReversed?: boolean;
}

function CardFront({
  data,
  position,
  onClick,
  isReversed = false,
}: CardFrontProps) {
  const [imageError, setImageError] = useState(false);
  const finalRotation = calculateCardRotation(data.id, isReversed);

  useEffect(() => {
    // Reset image error state when data changes
    setImageError(false);
  }, [data.id]);

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
      }}
      className={`card-classes relative flex w-[180px] cursor-pointer flex-col justify-between gap-4 overflow-hidden border border-orange-900 bg-orange-900 transition-all duration-300 ${
        isReversed
          ? "shadow-[-4px_-4px_6px_rgba(0,0,0,0.5)]"
          : "shadow-[4px_4px_6px_rgba(0,0,0,0.5)]"
      } `}
      onClick={onClick}
    >
      <div className="flex w-full flex-col items-center bg-indigo-950 bg-gradient-to-b pt-1 pb-3 text-center text-orange-400">
        <span className="flex aspect-square size-6 items-center justify-center text-xs font-semibold">
          {data.number}
        </span>
        <div className="w-full text-center text-sm font-medium uppercase">
          {data.name}
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center text-orange-500">
        {imageError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center text-xs text-orange-300/60">
            <div className="font-mono">{data.id}.jpg</div>
          </div>
        ) : (
          <Image
            src={`/frontIllustration/${data.id}.jpg`}
            alt={data.name}
            width={300}
            height={500}
            className="absolute inset-0 -z-30 h-full w-full"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </div>
  );
}

export default CardFront;
