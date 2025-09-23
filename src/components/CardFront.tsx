interface Data {
  id: number;
  name: string;
  keywords?: string[];
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
      className={`aspect-[2/3] w-[160px] rounded-lg bg-red-200 flex gap-4 flex-col p-2 justify-center shadow transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      {data.name}
      <div className="flex flex-col text-xs">
        {data.keywords &&
          data.keywords.map((k, index) => {
            return <span key={index}>{k}</span>;
          })}
      </div>
    </div>
  );
}

export default CardFront;
