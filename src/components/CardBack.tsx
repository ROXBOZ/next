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

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
      }}
      className={`
        aspect-[2/3] w-[190px] border border-orange-950 bg-[#15102d]
        object-contain rounded-xl overflow-hidden flex items-center
        hover:translate-y-[-30px] hover:rotate-${isReversed ? "180" : "0"}
        transition-all duration-300 cursor-pointer
        ${position && position > 1 ? "-ml-[172px]" : ""}
      `}
      onClick={onClick}
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
