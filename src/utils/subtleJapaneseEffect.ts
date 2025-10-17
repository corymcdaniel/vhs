// Subtle Japanese character effects for specific words during typing

export const SUBTLE_FLASH_WORDS = [
  { word: 'Cory', japanese: 'コリー' },
  { word: 'websites', japanese: 'ウェブサイト' },
  { word: 'photographer', japanese: '写真家' },
  { word: 'cats', japanese: '猫' },
  { word: 'Charlie', japanese: 'チャーリー' },
  { word: 'Papago', japanese: 'パパゴ' },
  { word: 'Phoenix', japanese: 'フェニックス' },
  { word: 'Arizona', japanese: 'アリゾナ' },
  { word: 'desert', japanese: '砂漠' },
  { word: 'pictures', japanese: '写真' }
];

export const FLASH_DURATION = 2000; // 2 seconds
export const FLASH_PROBABILITY = 0.3; // 30% chance for each word

export const shouldWordFlash = (): boolean => {
  return Math.random() < FLASH_PROBABILITY;
};

export const getJapaneseForWord = (word: string): string | null => {
  const match = SUBTLE_FLASH_WORDS.find(item =>
    word.toLowerCase().includes(item.word.toLowerCase())
  );
  return match ? match.japanese : null;
};

export const findWordsInText = (text: string): Array<{word: string, japanese: string, start: number, end: number}> => {
  const words: Array<{word: string, japanese: string, start: number, end: number}> = [];

  SUBTLE_FLASH_WORDS.forEach(({ word, japanese }) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      words.push({
        word: match[0],
        japanese,
        start: match.index,
        end: match.index + match[0].length - 1
      });
    }
  });

  return words;
};