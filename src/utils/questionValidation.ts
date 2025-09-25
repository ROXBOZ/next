import { playHuhSound } from "./sound";
import { showWarningToast } from "./toast";

/**
 * Validates if a text looks like a real question or gibberish
 */
export const validateQuestion = (text: string): boolean => {
  const result = validateQuestionSilent(text);
  if (!result) {
    showGibberishToast();
  }
  return result;
};

/**
 * Validates if a text looks like a real question or gibberish (without showing toast)
 */
export const validateQuestionSilent = (text: string): boolean => {
  const trimmedText = text.trim().toLowerCase();

  // Too short to validate meaningfully
  if (trimmedText.length < 5) {
    return true;
  }

  // If it has spaces, it's likely a real sentence
  if (trimmedText.includes(" ")) {
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
    /qwerty|asdfgh|zxcvbn/,
    /[qwertyuiop]{4,}|[asdfghjkl]{4,}|[zxcvbnm]{4,}/,
  ];

  // Check for obvious patterns first
  for (const pattern of obviousGibberishPatterns) {
    if (pattern.test(cleanText)) {
      return false;
    }
  }

  // Simple vowel check - real words usually have vowels
  const vowels =
    cleanText.match(/[aeiouàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g) || [];
  const totalLetters = cleanText.length;

  // If text is long enough and has virtually no vowels, it's likely gibberish
  if (totalLetters > 8 && vowels.length === 0) {
    return false;
  }

  // If vowel ratio is extremely low (less than 3%), likely gibberish
  if (totalLetters > 10 && vowels.length / totalLetters < 0.03) {
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
    "Je comprends que pouic",
    "Je comprends que dalle",
    "Je comprends walou",
    "T’écris avec tes pieds?",
    "L'oracle pige sweet fuck all",
    "Les esprits ont quitté le chat?",
    "Non mais what?",
  ];

  const randomMessage =
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  showWarningToast(randomMessage);
};
