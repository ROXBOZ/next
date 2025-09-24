interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className="mb-12 xl:mb-0 p-2">
      <button
        className="uppercase font-semibold text-orange-50"
        onClick={onReset}
      >
        L’oraclette
      </button>
    </header>
  );
}
