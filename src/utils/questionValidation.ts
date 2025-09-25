import { playHuhSound } from "./sound";
import { showWarningToast } from "./toast";

/**
 * Validates if a text looks like a real question or gibberish
 */
export const validateQuestion = (text: string): boolean => {
  const trimmedText = text.trim().toLowerCase();

  // Too short to be meaningful
  if (trimmedText.length < 3) {
    return true; // Allow short text to avoid annoying users
  }

  // Check for common gibberish patterns
  const gibberishPatterns = [
    // Repeating characters (4+ times) - made less strict
    /(.)\1{3,}/,
    // Too many consonants in a row (6+ instead of 5+)
    /[bcdfghjklmnpqrstvwxyz]{6,}/,
    // Random keyboard mashing patterns
    /[qwertyuiop]{5,}|[asdfghjkl]{5,}|[zxcvbnm]{5,}/,
  ];

  // Check for gibberish patterns
  for (const pattern of gibberishPatterns) {
    if (pattern.test(trimmedText)) {
      showGibberishToast();
      return false;
    }
  }

  // Check vowel ratio - made less strict
  const vowels =
    trimmedText.match(/[aeiouàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ]/g) || [];
  const vowelRatio = vowels.length / trimmedText.replace(/\s/g, "").length;

  // Only flag if vowel ratio is extremely low (less than 10%) and text is long
  if (vowelRatio < 0.1 && trimmedText.length > 15) {
    showGibberishToast();
    return false;
  }

  // Check for meaningful words (basic dictionary check)
  const commonWords = [
    // French question words
    "que",
    "qui",
    "quoi",
    "comment",
    "pourquoi",
    "quand",
    "où",
    "combien",
    "quel",
    "quelle",
    "quels",
    "quelles",
    // French common words
    "je",
    "tu",
    "il",
    "elle",
    "nous",
    "vous",
    "ils",
    "elles",
    "on",
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "du",
    "de",
    "d",
    "l",
    "au",
    "aux",
    "ce",
    "cette",
    "ces",
    "cet",
    "mon",
    "ma",
    "mes",
    "ton",
    "ta",
    "tes",
    "son",
    "sa",
    "ses",
    "notre",
    "nos",
    "votre",
    "vos",
    "leur",
    "leurs",
    "est",
    "être",
    "avoir",
    "faire",
    "aller",
    "venir",
    "voir",
    "savoir",
    "pouvoir",
    "vouloir",
    "devoir",
    "falloir",
    "dire",
    "prendre",
    "donner",
    "mettre",
    "partir",
    "sortir",
    "venir",
    "tenir",
    "porter",
    "garder",
    "amour",
    "travail",
    "argent",
    "santé",
    "famille",
    "ami",
    "amis",
    "amie",
    "vie",
    "avenir",
    "futur",
    "passé",
    "dois",
    "peux",
    "vais",
    "suis",
    "sera",
    "serai",
    "aura",
    "aurai",
    "avec",
    "dans",
    "pour",
    "par",
    "sur",
    "sous",
    "mais",
    "ou",
    "et",
    "donc",
    "or",
    "ni",
    "car",
    "si",
    "comme",
    "quand",
    "lorsque",
    "alors",
    "puis",
    "aussi",
    "très",
    "plus",
    "moins",
    "beaucoup",
    "peu",
    "trop",
    "assez",
    "tant",
    "autant",
    "si",
    "aussi",
    "même",
    "bien",
    "mal",
    "mieux",
    "pire",
    "jamais",
    "toujours",
    "souvent",
    "parfois",
    "peut-être",
    "oui",
    "non",
    // English question words (in case user writes in English)
    "what",
    "who",
    "when",
    "where",
    "why",
    "how",
    "will",
    "should",
    "can",
    "could",
    "would",
    "might",
    "love",
    "work",
    "money",
    "health",
    "family",
    "friend",
    "life",
    "future",
    "past",
    "time",
    "day",
    "year",
    "am",
    "is",
    "are",
    "was",
    "were",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "if",
    "then",
    "when",
    "where",
    "how",
    "why",
    "what",
    "who",
    "which",
    "my",
    "your",
    "his",
    "her",
    "our",
    "their",
    "me",
    "you",
    "him",
    "her",
    "us",
    "them",
    "this",
    "that",
    "these",
    "those",
  ];

  const words = trimmedText.split(/\s+/);
  const meaningfulWords = words.filter(
    (word) => commonWords.includes(word) || word.length > 2
  );

  // Only flag if less than 15% of words seem meaningful and text is quite long
  if (meaningfulWords.length / words.length < 0.15 && trimmedText.length > 15) {
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
    "L’oracle comprend que pouik",
    "L’oracle comprend que dalle",
    "Tu tapes avec tes pieds ou quoi?",
    "Les esprits ont quitté le chat. Réessaie.",
  ];

  const randomMessage =
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
  showWarningToast(randomMessage);
};
