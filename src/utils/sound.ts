/**
 * Play a sound file
 * @param soundPath - Path to the sound file
 * @param volume - Volume level (0-1), defaults to 0.5
 */
export const playSound = (soundPath: string, volume: number = 0.5): void => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp volume between 0 and 1
    audio.play().catch((error) => {
      console.warn("Failed to play sound:", error);
    });
  } catch (error) {
    console.warn("Error creating audio object:", error);
  }
};

/**
 * Play the card selection sound
 */
export const playCardSelectionSound = (): void => {
  playSound("/select-sound.wav", 0.3);
};

/**
 * Play the shuffle sound
 */
export const playShuffleSound = (): void => {
  playSound("/shuffle-sound.mp3", 0.4);
};

/**
 * Play the typing sound
 */
export const playTypingSound = (): void => {
  playSound("/typing-sound.mp3", 0.2);
};

/**
 * Play the magic sound
 */
export const playMagicSound = (): void => {
  playSound("/magic-sound.mp3", 0.4);
};

/**
 * Play the witch sound
 */
export const playWitchSound = (): void => {
  playSound("/witch-sound.mp3", 0.4);
};

/**
 * Play the click sound
 */
export const playClickSound = (): void => {
  playSound("/click-sound.mp3", 0.3);
};

/**
 * Play the deny sound
 */
export const playDenySound = (): void => {
  playSound("/deny-sound.mp3", 0.4);
};

/**
 * Play the huh sound
 */
export const playHuhSound = (): void => {
  playSound("/huh-sound.mp3", 0.4);
};
