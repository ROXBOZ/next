// Example test file demonstrating how to test the refactored utilities
// This shows the benefits of separating logic from components

import { calculateCardRotation, isMajorArcana } from "../src/utils/cardHelpers";
import { generateCardReversals, shuffleArray } from "../src/utils/shuffle";
import {
  isReadingComplete,
  isSelectionValid,
} from "../src/utils/cardSelection";

describe("Shuffle Utilities", () => {
  test("shuffleArray should return array with same length", () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray(originalArray);

    expect(shuffledArray).toHaveLength(originalArray.length);
    expect(shuffledArray).toEqual(expect.arrayContaining(originalArray));
  });

  test("generateCardReversals should generate reversals for all cards", () => {
    const cardIds = [1, 2, 3, 4, 5];
    const reversals = generateCardReversals(cardIds);

    expect(Object.keys(reversals)).toHaveLength(cardIds.length);
    cardIds.forEach((id) => {
      expect(typeof reversals[id]).toBe("boolean");
    });
  });
});

describe("Card Helper Utilities", () => {
  test("calculateCardRotation should return consistent rotation", () => {
    const cardId = 1;
    const rotation1 = calculateCardRotation(cardId, false);
    const rotation2 = calculateCardRotation(cardId, false);

    expect(rotation1).toBe(rotation2);
  });

  test("isMajorArcana should correctly identify major arcana", () => {
    const majorArcanaCard = { id: 1, arcana: "majeur" };
    const minorArcanaCard = { id: 22, arcana: "mineur" };

    expect(isMajorArcana(majorArcanaCard)).toBe(true);
    expect(isMajorArcana(minorArcanaCard)).toBe(false);
  });
});

describe("Card Selection Utilities", () => {
  test("isReadingComplete should return true when correct number of cards selected", () => {
    const selectedCards = [1, 2, 3];
    const readingMode = "3-cards";

    expect(isReadingComplete(selectedCards, readingMode)).toBe(true);
  });

  test("isSelectionValid should validate card selection", () => {
    const selectedCards = [1, 2, 3];
    const readingMode = "3-cards";

    expect(isSelectionValid(selectedCards, readingMode)).toBe(true);

    const tooManyCards = [1, 2, 3, 4];
    expect(isSelectionValid(tooManyCards, readingMode)).toBe(false);
  });
});

// Component testing example (would require React Testing Library)
/*
import { render, screen } from '@testing-library/react';
import { CardFront } from '../src/components';

describe('CardFront Component', () => {
  test('renders card name correctly', () => {
    const mockCard = {
      id: 1,
      name: 'The Fool',
      number: '0',
      keywords: ['new beginnings', 'innocence'],
      description: 'A new journey begins',
      reversed: 'Recklessness',
      arcana: 'majeur'
    };

    render(<CardFront data={mockCard} />);
    expect(screen.getByText('The Fool')).toBeInTheDocument();
  });
});
*/

export {};
