// Japanese character flash effect utility

export const FLASH_CHARACTERS = ['あ', 'い', 'う', 'え', 'お', 'カ', 'キ', 'ク', 'ケ', 'コ', 'ガ', 'ギ', 'ゴ', 'ン'];

export const FLASH_PROBABILITY = 0.15; // 15% chance
export const FLASH_DURATION = 1500; // 1.5 seconds

export const getRandomFlashCharacter = (): string => {
  return FLASH_CHARACTERS[Math.floor(Math.random() * FLASH_CHARACTERS.length)];
};

export const shouldCharacterFlash = (char: string, preCatastropheLevel: number = 0): boolean => {
  // Increase flash probability slightly during pre-catastrophe
  let adjustedProbability = FLASH_PROBABILITY;

  if (preCatastropheLevel === 1) {
    adjustedProbability = FLASH_PROBABILITY * 1.3; // 30% increase (15% -> 19.5%)
  } else if (preCatastropheLevel === 2) {
    adjustedProbability = FLASH_PROBABILITY * 1.6; // 60% increase (15% -> 24%)
  }

  return Math.random() < adjustedProbability && char.match(/[a-zA-Z]/) !== null;
};