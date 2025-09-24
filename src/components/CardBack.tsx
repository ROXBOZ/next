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
  // Generate a consistent random rotation based on card id
  const getRandomRotation = (id: number) => {
    // Use the card id as seed for consistent rotation
    const seed = id * 9301 + 49297; // Simple seeding
    const randomValue = (seed % 233280) / 233280; // Normalize to 0-1
    return Math.floor((randomValue - 0.5) * 8); // Random rotation between -4 and 4 degrees
  };

  const baseRotation = getRandomRotation(data.id);
  const finalRotation = isReversed ? baseRotation + 180 : baseRotation;

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
      }}
      className={`h-[310px] border border-orange-950 bg-[#15102d] object-contain w-[200px] rounded-xl overflow-hidden flex items-center hover:translate-y-[-30px] hover:rotate-${
        isReversed ? "180" : "0"
      } transition-all duration-300 cursor-pointer ${
        position && position > 1 && "-ml-[182px]"
      }`}
      onClick={onClick}
    >
      {!isLast && (
        <div
          className="bg-gradient-to-r  from-black/40 to-transparent w-full h-full absolute top-0 left-0"
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
