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
        boxShadow: `inset 12px 0 25px -10px oklch(86.9% 0.005 56.366)`,
      }}
      className={`aspect-[2/3] w-[200px] bg-stone-100 rounded-lg flex items-center hover:translate-y-[-20px] hover:rotate-0 hover:shadow-[-4px_4px_4px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer ${
        position && position > 1 && "-ml-[182px]"
      }`}
      onClick={onClick}
    ></div>
  );
}

export default CardBack;
