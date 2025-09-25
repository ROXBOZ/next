export interface TarotCard {
  id: number;
  number: number | string;
  name: string;
  keywords: string[];
  description: string;
  reversed: string;
  arcana: "majeur" | "mineur";
}

export interface CardReversals {
  [cardId: number]: boolean;
}

export type ReadingMode = "3-cards" | "5-cards";

export interface ReadingPosition {
  index: number;
  title: string;
  meaning: string;
}

export interface CardInterpretation {
  position: string;
  positionMeaning: string;
  card: {
    name: string;
    arcana: string;
    description: string;
    keywords: string[];
    isReversed: boolean;
  };
}

export interface TarotReading {
  question: string;
  selectedCards: number[];
  cardReversals: CardReversals;
  readingMode: ReadingMode;
}

export interface AIInterpretationResult {
  success: boolean;
  interpretation?: string;
  error?: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface GameState {
  cardOrder: number[];
  selectedCards: number[];
  readingMode: ReadingMode | null;
  cardReversals: CardReversals;
  question: string;
  isGameStarted: boolean;
  canShuffle: boolean;
}
