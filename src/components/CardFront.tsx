interface Data {
  id: number;
  number: number | string;
  name: string;
  keywords: string[];
  description: string;
  reversed: string;
  arcana: "majeur" | "mineur";
}
function CardFront({
  data,
  position,
  onClick,
  isReversed,
}: {
  data: Data;
  position?: number;
  onClick?: () => void;
  isReversed?: boolean;
}) {
  const rotations = [-4, 0, 4];
  const baseRotation = rotations[data.id % 3];
  const finalRotation = isReversed ? baseRotation + 180 : baseRotation;
  const isMajor = data.arcana === "majeur" ? true : false;
  const displayDescription = isReversed ? data.reversed : data.description;

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${finalRotation}deg)`,
        boxShadow: isReversed
          ? "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      className={`aspect-[2/3] w-[200px] rounded-lg ${
        isMajor ? "bg-amber-500" : "bg-orange-500"
      } flex gap-4 flex-col px-4 pb-3 pt-2 justify-between transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-center flex flex-col w-full items-center">
        <span
          className={`aspect-square size-6 flex items-center justify-center text-xs font-semibold ${
            isReversed ? "rotate-180" : ""
          }`}
        >
          {data.number}
        </span>
        <div
          className={`text-center w-full py-1 bg-white font-medium uppercase text-sm ${
            isReversed ? "rotate-180" : ""
          }`}
        >
          {data.name}
        </div>
      </div>

      {/* <div
        className={`text-xs text-balance  w-full ${
          isReversed ? "rotate-180" : ""
        }`}
      >
        {displayDescription}
      </div> */}
    </div>
  );
}

export default CardFront;
