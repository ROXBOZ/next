import { playHuhSound } from "./sound";
import { showWarningToast } from "./toast";

/**
 * Validates if a text looks like a real question or gibberish
 */
export const validateQuestion = (text: string): boolean => {
  const trimmedText = text.trim().toLowerCase();

  // Too short to validate meaningfully
  if (trimmedText.length < 5) {
    return true;
  }

  // Remove spaces and special characters for pattern checking
  const cleanText = trimmedText.replace(
    /[^a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g,
    "",
  );

  // Very obvious gibberish patterns
  const obviousGibberishPatterns = [
    // Same character repeated 4+ times
    /(.)\1{3,}/,
    // Obvious keyboard mashing (consecutive keys)
    /qwer|asdf|zxcv|poiu|lkjh|mnb/,
    /[qwertyuiop]{4,}|[asdfghjkl]{4,}|[zxcvbnm]{4,}/,
  ];

  // Check for obvious patterns first
  for (const pattern of obviousGibberishPatterns) {
    if (pattern.test(cleanText)) {
      showGibberishToast();
      return false;
    }
  }

  // Simple vowel check - real words usually have vowels
  const vowels =
    cleanText.match(/[aeiouàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g) || [];
  const totalLetters = cleanText.length;

  // If text is long enough and has virtually no vowels, it's likely gibberish
  if (totalLetters > 6 && vowels.length === 0) {
    showGibberishToast();
    return false;
  }

  // If vowel ratio is extremely low (less than 5%), likely gibberish
  if (totalLetters > 8 && vowels.length / totalLetters < 0.05) {
    showGibberishToast();
    return false;
  }

  // Check for at least one recognizable word pattern
  const words = trimmedText.split(/\s+/);
  let hasRecognizableWord = false;

  for (const word of words) {
    const cleanWord = word.replace(/[^a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g, "");

    // Skip very short words
    if (cleanWord.length < 2) continue;

    // Check if word has a reasonable vowel pattern
    const wordVowels =
      cleanWord.match(/[aeiouàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g) || [];

    // A word with vowels or common French/English patterns is likely real
    if (
      wordVowels.length > 0 ||
      /^(qu|ch|th|sh|ph|gh|ck|ng|tion|sion)/.test(cleanWord) ||
      /ing|tion|sion|ment|ance|ence$/.test(cleanWord)
    ) {
      hasRecognizableWord = true;
      break;
    }
  }

  // If no recognizable words and text is long enough, it's likely gibberish
  if (!hasRecognizableWord && cleanText.length > 8) {
    showGibberishToast();
    return false;
  }

  return true;
};

/**
 * Show a funny toast for gibberish detection
 */
const showGibberishToast = () => {
  // Play the huh sound
  playHuhSound();

  const funnyMessages = [
    "L’oracle comprend que pouic de pouic",
    "L’oracle comprend que dalle",
    "L’oracle comprend walou",
    "L'oracle catch pas",
    "T’écris avec tes pieds?",
    "L'oracle pige sweet fuck all",
    "Les esprits ont quitté le chat?",
    "Non mais what?",
  ];

  const randomMessage =
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  showWarningToast(randomMessage);
};
