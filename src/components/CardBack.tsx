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
  // console.log("data", data);
  return (
    <div
      style={{ zIndex: position || data.id }}
      className={`aspect-[2/3] w-[160px] bg-red-300 rounded-lg flex items-center shadow-lg hover:translate-y-[-10px] transition-all duration-300 cursor-pointer ${
        position && position > 1 && "-ml-[148px]"
      } `}
      onClick={onClick}
    ></div>
  );
}

export default CardBack;
