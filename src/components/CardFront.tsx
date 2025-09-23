interface Data {
  id: number;
  name: string;
  keywords: string[];
  description: string;
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
  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${rotation}deg)`,
      }}
      className={`aspect-[2/3] w-[200px] rounded-lg bg-white flex gap-4 flex-col px-4 pb-3 pt-2 justify-between shadow transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-center">{data.name}</div>
      <div className="text-xs text-balance">{data.description}</div>
    </div>
  );
}

export default CardFront;
