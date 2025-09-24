interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header>
      <button
        className="uppercase font-semibold text-orange-50"
        onClick={onReset}
      >
        L’oraclette
      </button>
    </header>
  );
}
