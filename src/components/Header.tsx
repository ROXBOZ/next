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
    <header className="mb-12 xl:mb-0 py-2 xl:p-0 flex justify-center">
      <button
        className="uppercase font-semibold text-orange-50"
        onClick={handleReset}
      >
        L&apos;oraclette
      </button>
    </header>
  );
}
