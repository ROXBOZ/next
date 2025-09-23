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
      className={`aspect-[2/3] w-[160px] rounded-lg flex items-center text-xs shadow hover:translate-y-[-10px] transition-all duration-300 cursor-pointer ${
        position && position > 1 ? "-ml-[148px]" : ""
      } ${data.id % 2 === 0 ? "bg-blue-300" : "bg-green-300"}`}
      onClick={onClick}
    ></div>
  );
}

export default CardBack;
