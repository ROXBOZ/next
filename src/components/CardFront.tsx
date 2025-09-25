import { TarotCard } from "@/types/tarot";
import { calculateCardRotation } from "@/utils/cardHelpers";

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
  const finalRotation = calculateCardRotation(data.id, isReversed);

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
      }}
      className={`
        aspect-[2/3] w-[190px] rounded-xl border border-orange-900 bg-orange-900
        flex gap-4 flex-col overflow-hidden justify-between
        transition-all duration-300 cursor-pointer
        ${
          isReversed
            ? "shadow-[-4px_-4px_6px_rgba(0,0,0,0.5)]"
            : "shadow-[4px_4px_6px_rgba(0,0,0,0.5)]"
        }
      `}
      onClick={onClick}
    >
      <div className="text-center flex flex-col w-full items-center pt-1 pb-3 bg-gradient-to-b bg-indigo-950 text-orange-400">
        <span className="aspect-square size-6 flex items-center justify-center text-xs font-semibold">
          {data.number}
        </span>
        <div className="text-center w-full font-medium uppercase text-sm">
          {data.name}
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center text-orange-500">
        illustration
      </div>
    </div>
  );
}

export default CardFront;
