import { playWitchSound } from "@/utils/sound";

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  const handleReset = () => {
    playWitchSound();
    onReset();
  };

  return (
    <header className="py-2 xl:p-0 flex justify-center">
      <button
        className="text-4xl tracking-wider text-white hover:ring-0!"
        onClick={handleReset}
      >
        {/* <span className="rfc-font flex gap-1 items-center">
          Velma <span className="text-sm">✦</span> Tarot
        </span> */}
        <div className="flex gap-1 items-center">
          <span className="rfc-font">L</span>
          <span className="text-xs">✦</span>
          <span className="rfc-font">oraclette</span>
        </div>
      </button>
    </header>
  );
}
