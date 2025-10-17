// Phonetic mapping of English syllables to Japanese characters
// This creates intentional, meaningful replacements rather than random ones

interface PhoneticMatch {
  original: string;
  japanese: string;
  type: 'katakana' | 'hiragana';
}

// Katakana mappings (typically used for foreign words)
const KATAKANA_SYLLABLES: { [key: string]: string } = {
  // Consonant + vowel combinations
  'ka': 'カ', 'ki': 'キ', 'ku': 'ク', 'ke': 'ケ', 'ko': 'コ',
  'ga': 'ガ', 'gi': 'ギ', 'gu': 'グ', 'ge': 'ゲ', 'go': 'ゴ',
  'sa': 'サ', 'shi': 'シ', 'si': 'シ', 'su': 'ス', 'se': 'セ', 'so': 'ソ',
  'za': 'ザ', 'ji': 'ジ', 'zi': 'ジ', 'zu': 'ズ', 'ze': 'ゼ', 'zo': 'ゾ',
  'ta': 'タ', 'chi': 'チ', 'ti': 'チ', 'tsu': 'ツ', 'tu': 'ツ', 'te': 'テ', 'to': 'ト',
  'da': 'ダ', 'di': 'ヂ', 'du': 'ヅ', 'de': 'デ', 'do': 'ド',
  'na': 'ナ', 'ni': 'ニ', 'nu': 'ヌ', 'ne': 'ネ', 'no': 'ノ',
  'ha': 'ハ', 'hi': 'ヒ', 'fu': 'フ', 'hu': 'フ', 'he': 'ヘ', 'ho': 'ホ',
  'ba': 'バ', 'bi': 'ビ', 'bu': 'ブ', 'be': 'ベ', 'bo': 'ボ',
  'pa': 'パ', 'pi': 'ピ', 'pu': 'プ', 'pe': 'ペ', 'po': 'ポ',
  'ma': 'マ', 'mi': 'ミ', 'mu': 'ム', 'me': 'メ', 'mo': 'モ',
  'ya': 'ヤ', 'yu': 'ユ', 'yo': 'ヨ',
  'ra': 'ラ', 'ri': 'リ', 'ru': 'ル', 're': 'レ', 'ro': 'ロ',
  'wa': 'ワ', 'wi': 'ヰ', 'we': 'ヱ', 'wo': 'ヲ',
  // Single vowels
  'a': 'ア', 'i': 'イ', 'u': 'ウ', 'e': 'エ', 'o': 'オ',
  // Special consonant
  'n': 'ン',
};

// Hiragana mappings (typically used for Japanese words)
const HIRAGANA_SYLLABLES: { [key: string]: string } = {
  // Consonant + vowel combinations
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'sa': 'さ', 'shi': 'し', 'si': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'za': 'ざ', 'ji': 'じ', 'zi': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'ta': 'た', 'chi': 'ち', 'ti': 'ち', 'tsu': 'つ', 'tu': 'つ', 'te': 'て', 'to': 'と',
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'hu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wi': 'ゐ', 'we': 'ゑ', 'wo': 'を',
  // Single vowels
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  // Special consonant
  'n': 'ん',
};

/**
 * Find phonetic Japanese matches within an English word
 * Returns array of matches with their positions and Japanese equivalents
 */
export function findPhoneticMatches(word: string, preferKatakana: boolean = true): PhoneticMatch[] {
  const matches: PhoneticMatch[] = [];
  const lowerWord = word.toLowerCase();
  const syllables = preferKatakana ? KATAKANA_SYLLABLES : HIRAGANA_SYLLABLES;

  // Sort by length descending to match longer syllables first
  const sortedKeys = Object.keys(syllables).sort((a, b) => b.length - a.length);

  let i = 0;
  while (i < lowerWord.length) {
    let matched = false;

    // Try to match the longest possible syllable at current position
    for (const syllable of sortedKeys) {
      if (lowerWord.substring(i, i + syllable.length) === syllable) {
        matches.push({
          original: word.substring(i, i + syllable.length),
          japanese: syllables[syllable],
          type: preferKatakana ? 'katakana' : 'hiragana'
        });
        i += syllable.length;
        matched = true;
        break;
      }
    }

    // If no match found, keep the original character and move on
    if (!matched) {
      i++;
    }
  }

  return matches;
}

/**
 * Get specific phonetic replacements for known words in the portfolio
 * These are hand-picked replacements that make sense contextually
 */
export function getContextualReplacements(text: string): Array<{
  word: string;
  startIndex: number;
  endIndex: number;
  replacement: string;
  syllable: string;
}> {
  const replacements: Array<{
    word: string;
    startIndex: number;
    endIndex: number;
    replacement: string;
    syllable: string;
  }> = [];

  // Define contextual word mappings
  const wordMappings: Array<{
    word: string;
    syllable: string;
    japanese: string;
    offset: number; // Where in the word the syllable starts
  }> = [
    // Names and proper nouns - use Katakana
    { word: 'Papago', syllable: 'go', japanese: 'ゴ', offset: 4 },
    { word: 'Papago', syllable: 'pa', japanese: 'パ', offset: 0 },
    { word: 'Charlie', syllable: 'chi', japanese: 'チ', offset: 4 },
    { word: 'Cory', syllable: 'ko', japanese: 'コ', offset: 0 },
    { word: 'Phoenix', syllable: 'ni', japanese: 'ニ', offset: 4 },
    { word: 'Arizona', syllable: 'zo', japanese: 'ゾ', offset: 4 },
    { word: 'Arizona', syllable: 'na', japanese: 'ナ', offset: 6 },

    // Common words - use Hiragana for more natural feel
    { word: 'Hello', syllable: 'he', japanese: 'へ', offset: 0 },
    { word: 'Hello', syllable: 'ro', japanese: 'ろ', offset: 3 },
    { word: 'years', syllable: 'ya', japanese: 'や', offset: 0 },
    { word: 'also', syllable: 'so', japanese: 'そ', offset: 2 },
    { word: 'amateur', syllable: 'ma', japanese: 'ま', offset: 1 },
    { word: 'photographer', syllable: 'to', japanese: 'と', offset: 3 },
    { word: 'live', syllable: 'li', japanese: 'り', offset: 0 },
    { word: 'love', syllable: 'ro', japanese: 'ろ', offset: 1 },
    { word: 'desert', syllable: 'de', japanese: 'で', offset: 0 },
    { word: 'Eject', syllable: 'ji', japanese: 'じ', offset:1 },
    { word: 'pictures', syllable: 'pi', japanese: 'ぴ', offset: 0 },
    { word: 'developing', syllable: 'de', japanese: 'で', offset: 0 },
    { word: 'websites', syllable: 'si', japanese: 'し', offset: 3 },
    { word: 'cats', syllable: 'ka', japanese: 'か', offset: 0 },

    // Kanji replacements for full words (rare, dramatic effect)
    { word: 'photographer', syllable: 'photographer', japanese: '写真家', offset: 0 },
    { word: 'Hello', syllable: 'Hello', japanese: '今日は', offset: 0 },
    { word: 'desert', syllable: 'desert', japanese: '砂漠', offset: 0 },
    { word: 'cats', syllable: 'cats', japanese: '猫', offset: 0 },
  ];

  // Search for each word mapping in the text
  for (const mapping of wordMappings) {
    const regex = new RegExp(`\\b${mapping.word}\\b`, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const wordStart = match.index;
      const syllableStart = wordStart + mapping.offset;
      const syllableEnd = syllableStart + mapping.syllable.length;

      replacements.push({
        word: mapping.word,
        startIndex: syllableStart,
        endIndex: syllableEnd - 1,
        replacement: mapping.japanese,
        syllable: mapping.syllable
      });
    }
  }

  return replacements;
}

/**
 * Convert a full word to Japanese phonetically
 * Useful for complete word replacement during effects
 */
export function convertWordToJapanese(word: string, preferKatakana: boolean = true): string {
  const matches = findPhoneticMatches(word, preferKatakana);
  return matches.map(m => m.japanese).join('');
}
