interface Data {
  id: number;
  number: number | string;
  name: string;
  keywords: string[];
  description: string;
  arcana: "majeur" | "mineur";
}
function CardFront({
  data,
  position,
  onClick,
}: {
  data: Data;
  position?: number;
  onClick?: () => void;
}) {
  const rotations = [-2, 3, 6];
  const rotation = rotations[data.id % 3];
  const isMajor = data.arcana === "majeur" ? true : false;

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${rotation}deg)`,
      }}
      className={`aspect-[2/3] w-[200px] rounded-lg ${
        isMajor ? "bg-amber-200" : "bg-amber-100"
      }  flex gap-4 flex-col px-4 pb-3 pt-2 justify-between shadow transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-center flex flex-col w-full items-center">
        <span className="aspect-square size-6 flex items-center justify-center text-xs font-semibold ">
          {data.number}
        </span>
        <div className="text-center w-full py-1 bg-white font-medium uppercase text-sm">
          {data.name}
        </div>
      </div>

      <div className="text-xs text-balance">{data.description}</div>
    </div>
  );
}

export default CardFront;
