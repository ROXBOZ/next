interface Data {
  id: number;
  name: string;
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
  return (
    <div
      style={{ zIndex: position || data.id }}
      className={`aspect-[2/3] w-[160px] rounded-lg bg-red-200 flex justify-center items-center text-xs shadow transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      {data.name}
    </div>
  );
}

export default CardFront;
