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
    <header className="flex justify-center py-2 xl:p-0">
      <button
        className="text-4xl tracking-wider text-white hover:ring-0!"
        onClick={handleReset}
      >
        <div className="flex items-center gap-1">
          <span className="rfc-font">o'raclette</span>
        </div>
      </button>
    </header>
  );
}
