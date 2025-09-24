import {
  calculateCardRotation,
  getCardBoxShadow,
  getCardDescription,
  isMajorArcana,
} from "@/utils/cardHelpers";

import { TarotCard } from "@/types/tarot";

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
  const isCardMajor = isMajorArcana(data);
  const displayDescription = getCardDescription(data, isReversed);

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
        boxShadow: isReversed
          ? "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      className={`
        aspect-[2/3] w-[190px] rounded-lg
        ${isCardMajor ? "bg-amber-500" : "bg-orange-500"}
        flex gap-4 flex-col px-4 pb-3 pt-2 justify-between
        transition-all duration-300 cursor-pointer
      `}
      onClick={onClick}
    >
      <div className="text-center flex flex-col w-full items-center">
        <span className="aspect-square size-6 flex items-center justify-center text-xs font-semibold">
          {data.number}
        </span>
        <div className="text-center w-full py-1 bg-white font-medium uppercase text-sm">
          {data.name}
        </div>
      </div>
    </div>
  );
}

export default CardFront;
