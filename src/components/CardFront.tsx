import { useEffect, useRef, useState } from "react";

import { TarotCard } from "@/types/tarot";
import { calculateCardRotation } from "@/utils/cardHelpers";
import { createKaleidoscope } from "@/utils/kaleidoscope";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const finalRotation = calculateCardRotation(data.id, isReversed);

  useEffect(() => {
    setImageError(false);
  }, [data.id]);

  useEffect(() => {
    if (imageError || !containerRef.current) return;

    let destroyed = false;
    let instance: { destroy: () => void } | null = null;

    // Check if image exists before initializing
    const img = new Image();
    img.onload = () => {
      if (destroyed || !containerRef.current) return;
      createKaleidoscope({
        container: containerRef.current,
        imageSrc: `/cards/${data.id}.jpg`,
        mode: "loop",
        segments: 6,
        scale: 1,
        motion: 0.5,
        imageAspect: 9 / 14,
      }).then((k) => {
        if (destroyed) {
          k.destroy();
        } else {
          instance = k;
        }
      });
    };
    img.onerror = () => {
      if (!destroyed) setImageError(true);
    };
    img.src = `/cards/${data.id}.jpg`;

    return () => {
      destroyed = true;
      instance?.destroy();
    };
  }, [data.id, imageError]);

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
      <div className="pointer-events-none absolute z-10 flex h-full w-full flex-col items-center justify-between p-2 text-center text-orange-400 *:rounded-full *:bg-indigo-950/80">
        <span className="flex px-4 text-xs font-medium">{data.number}</span>
        <div className="w-full px-4 text-center text-xs font-medium whitespace-nowrap uppercase">
          {data.name}
        </div>
      </div>
      <div className="flex h-full w-full items-center justify-center text-orange-500">
        {imageError ? (
          <div className="flex flex-col items-center justify-center p-4 text-center text-xs text-orange-300/60">
            <div className="font-mono">{data.id}.jpg</div>
          </div>
        ) : (
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        )}
      </div>
    </div>
  );
}

export default CardFront;
