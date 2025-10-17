/**
 * Unified Japanese Character Flash Effects
 * Handles both random character flashes during typing and contextual phonetic/kanji replacements
 */

import { getContextualReplacements } from './phoneticJapanese';
import { getRandomFlashCharacter } from './japaneseFlash';

export interface FlashEffect {
  key: string;
  character: string;
  duration: number;
  type: 'phonetic' | 'kanji' | 'random';
}

/**
 * Get a flash effect for a newly typed character
 * Uses contextual phonetic/kanji mapping if available, otherwise random
 */
export function getTypingFlashEffect(
  fullText: string,
  charIndex: number,
  justTypedChar: string
): FlashEffect | null {
  // Only flash letter characters
  if (!justTypedChar.match(/[a-zA-Z]/)) {
    return null;
  }

  // 5% chance to flash during typing
  if (Math.random() >= 0.05) {
    return null;
  }

  const charKey = `${fullText}-${charIndex}`;

  // Try to get contextual replacement for this specific character position
  const replacements = getContextualReplacements(fullText);

  // Check if this character position is part of any phonetic/kanji mapping
  for (const replacement of replacements) {
    if (charIndex >= replacement.startIndex && charIndex <= replacement.endIndex) {
      // This character is part of a mapped syllable/word
      // Use the mapped Japanese character
      return {
        key: charKey,
        character: replacement.replacement,
        duration: 1200,
        type: replacement.replacement.length > 1 ? 'kanji' : 'phonetic'
      };
    }
  }

  // No contextual mapping found, use random Japanese character
  return {
    key: charKey,
    character: getRandomFlashCharacter(),
    duration: 1200,
    type: 'random'
  };
}

/**
 * Get a flash effect for a completed line
 * Only uses contextual phonetic/kanji mappings (no random)
 */
export function getCompletedLineFlashEffect(
  lineText: string
): FlashEffect | null {
  const replacements = getContextualReplacements(lineText);

  if (replacements.length === 0) {
    return null;
  }

  // Pick a random replacement from available contextual mappings
  const replacement = replacements[Math.floor(Math.random() * replacements.length)];

  // Create a word-level key for the Japanese flash
  const wordKey = `${lineText}-word-${replacement.startIndex}-${replacement.endIndex}`;

  return {
    key: wordKey,
    character: replacement.replacement,
    duration: 2500, // Longer duration for completed line flashes
    type: replacement.replacement.length > 1 ? 'kanji' : 'phonetic'
  };
}
