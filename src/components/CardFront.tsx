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

  // Calculate Kfsdlmkfsdfshadow offset that counteracts the card rotation
  const shadowAngle = -finalRotation * (Math.PI / 180); // Convert to radians and negate
  const shadowX = Math.sin(shadowAngle) * 4;
  const shadowY = Math.cos(shadowAngle) * 4;

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
        boxShadow: `${shadowX}px ${shadowY}px 6px rgba(0, 0, 0, 0.5)`,
      }}
      className={`
        aspect-[2/3] w-[190px] rounded-xl bg-orange-900
        flex gap-4 flex-col overflow-hidden justify-between
        transition-all duration-300 cursor-pointer
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
