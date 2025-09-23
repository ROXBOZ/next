interface Data {
  id: number;
}
function CardBack({
  data,
  position,
  onClick,
}: {
  data: Data;
  position?: number;
  onClick?: () => void;
}) {
  const rotations = [-2, 0, 2];
  const rotation = rotations[data.id % 3];

  return (
    <div
      style={{
        zIndex: position || data.id,
        transform: `rotate(${rotation}deg)`,
        boxShadow: `inset 12px 0 25px -10px oklch(70.9% 0.01 56.259)`,
      }}
      className={`aspect-[2/3] w-[160px] bg-stone-200 rounded-lg flex items-center hover:translate-y-[-20px] hover:rotate-0 hover:shadow-[-4px_8px_16px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer ${
        position && position > 1 && "-ml-[148px]"
      }`}
      onClick={onClick}
    ></div>
  );
}

export default CardBack;
