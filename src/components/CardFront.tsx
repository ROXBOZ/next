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
        aspect-[2/3] w-[190px] rounded-xl
        ${isCardMajor ? "bg-gray-400" : "bg-gray-300"}
        flex gap-4 flex-col overflow-hidden justify-between
        transition-all duration-300 cursor-pointer
      `}
      onClick={onClick}
    >
      <div className="text-center flex flex-col w-full items-center pt-1 pb-8 bg-gradient-to-b from-violet-50 to-transparent via-white">
        <span className="aspect-square size-6 flex items-center justify-center text-xs font-semibold">
          {data.number}
        </span>
        <div className="text-center w-full py-1 font-medium uppercase text-sm">
          {data.name}
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        illustration
      </div>
    </div>
  );
}

export default CardFront;
