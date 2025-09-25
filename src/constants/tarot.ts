import { ReadingMode, ReadingPosition } from "@/types/tarot";

export const READING_CONFIGS: Record<ReadingMode, ReadingPosition[]> = {
  "3-cards": [
    {
      index: 0,
      title: "Passé",
      meaning:
        "past influences and experiences that led to the current situation",
    },
    {
      index: 1,
      title: "Présent",
      meaning: "current situation and energies at play",
    },
    {
      index: 2,
      title: "Avenir",
      meaning: "potential future outcome and what to expect",
    },
  ],
  "5-cards": [
    {
      index: 0,
      title: "Présent",
      meaning: "current situation and immediate influences",
    },
    {
      index: 1,
      title: "Défi",
      meaning: "main challenge or obstacle to overcome",
    },
    {
      index: 2,
      title: "Passé",
      meaning: "past influences that shape the current situation",
    },
    {
      index: 3,
      title: "Avenir",
      meaning: "potential future outcome and what to expect",
    },
    {
      index: 4,
      title: "Conseil",
      meaning: "guidance, advice, and resources available to help",
    },
  ],
};

export const MAX_CARDS: Record<ReadingMode, number> = {
  "3-cards": 3,
  "5-cards": 5,
};

export const ARCANA_TYPES = {
  MAJEUR: "majeur" as const,
  MINEUR: "mineur" as const,
};

export const MAJOR_ARCANA_THRESHOLD = 21;

export const ARCANA_EXPLANATIONS = {
  MAJEUR:
    "Les Arcanes Majeurs représentent les grandes leçons de vie, les archétypes universels et les événements spirituellement significatifs.",
  MINEUR:
    "Les Arcanes Mineurs traitent des aspects quotidiens de la vie, des situations pratiques et des émotions courantes.",
};

export const POSITION_EXPLANATIONS = {
  UPRIGHT:
    "Une carte à l'endroit indique des énergies qui s'expriment pleinement et positivement dans votre situation.",
  REVERSED:
    "Une carte inversée suggère des énergies bloquées, des leçons intérieures à apprendre, ou une approche différente nécessaire.",
};

export const ANIMATION_DELAYS = {
  MODAL_SHOW: 2000,
  TOAST_SHOW: 10,
  TOAST_HIDE: 3000,
  TOAST_REMOVE: 300,
};

export const Z_INDEX = {
  MODAL: 9999,
  TOAST: 9999,
  CARDS: 40,
};

export const CARD_ROTATION = {
  MAX_DEGREES: 12,
  SEED_MULTIPLIER: 9301,
  SEED_OFFSET: 49297,
  MODULO: 233280,
  REVERSED_OFFSET: 180,
};
