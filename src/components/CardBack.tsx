import Image from "next/image";

interface Data {
  id: number;
}
function CardBack({
  data,
  position,
  onClick,
  isLast,
  isReversed,
}: {
  data: Data;
  position?: number;
  onClick?: () => void;
  isLast?: boolean;
  isReversed?: boolean;
}) {
  const rotations = [-2, 0, 2];
  const baseRotation = rotations[data.id % 3];
  const finalRotation = isReversed ? baseRotation + 180 : baseRotation;

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
      }}
      className={`h-[310px] bg-[#15102d] object-contain w-[200px] rounded-xl overflow-hidden flex items-center hover:translate-y-[-30px] hover:rotate-${
        isReversed ? "180" : "0"
      } transition-all duration-300 cursor-pointer ${
        position && position > 1 && "-ml-[182px]"
      }`}
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
