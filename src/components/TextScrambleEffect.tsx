import React, { useEffect, useCallback } from 'react';

// Static character arrays
const HIRAGANA_CHARS = [
  'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご',
  'さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'た', 'ち', 'つ', 'て', 'と',
  'だ', 'ぢ', 'づ', 'で', 'ど', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ',
  'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ゐ', 'ゑ', 'を', 'ん'
];

const KATAKANA_CHARS = [
  'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
  'サ', 'シ', 'ス', 'セ', 'ソ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'タ', 'チ', 'ツ', 'テ', 'ト',
  'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ', 'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン'
];

const ROMAJI_CHARS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

interface TextScrambleEffectProps {
  isActive: boolean;
  textLines: string[];
  setCyclingCharacters: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setIsTextScrambled: React.Dispatch<React.SetStateAction<boolean>>;
  generateScrambledTexts: () => void;
  onComplete?: () => void;
}

const TextScrambleEffect: React.FC<TextScrambleEffectProps> = ({
  isActive,
  textLines,
  setCyclingCharacters,
  setIsTextScrambled,
  generateScrambledTexts,
  onComplete
}) => {

  const getRandomCharacter = useCallback(() => {
    const characterSets = [HIRAGANA_CHARS, KATAKANA_CHARS, ROMAJI_CHARS];
    const randomSet = characterSets[Math.floor(Math.random() * characterSets.length)];
    return randomSet[Math.floor(Math.random() * randomSet.length)];
  }, []);

  useEffect(() => {
    if (!isActive) return;

    console.log('⚡ Text scrambling effect started');

    generateScrambledTexts();
    setIsTextScrambled(true);
    console.log('⚡ Text scrambling with character cycling started');

    // Start character cycling for 60-80% of characters
    const cyclingPercentage = 0.6 + (Math.random() * 0.2); // 60-80%
    console.log(`🔄 Starting character cycling for ${Math.round(cyclingPercentage * 100)}% of characters`);

    const intervals: NodeJS.Timeout[] = [];
    const timeouts: NodeJS.Timeout[] = [];

    textLines.forEach((line, lineIndex) => {
      line.split('').forEach((char, charIndex) => {
        if (char !== ' ' && char !== '.' && char !== ',' && Math.random() < cyclingPercentage) {
          const charKey = `${line}-${charIndex}`;

          // Initial character assignment
          setCyclingCharacters(prev => ({
            ...prev,
            [charKey]: getRandomCharacter()
          }));

          // Cycle this character every 100ms for more dynamic effect
          const cycleInterval = setInterval(() => {
            setCyclingCharacters(prev => ({
              ...prev,
              [charKey]: getRandomCharacter()
            }));
          }, 100);

          intervals.push(cycleInterval);

          // Stop cycling after 3 seconds
          const stopTimeout = setTimeout(() => {
            clearInterval(cycleInterval);
            setCyclingCharacters(prev => {
              const newState = { ...prev };
              delete newState[charKey];
              return newState;
            });
          }, 3000);

          timeouts.push(stopTimeout);
        }
      });
    });

    // Stop text scrambling after lightning sequence (3 seconds)
    const endTimeout = setTimeout(() => {
      setIsTextScrambled(false);
      setCyclingCharacters({}); // Clear all cycling characters
      console.log('⚡ Text scrambling ended - returning to normal');
      onComplete?.();
    }, 3000);

    timeouts.push(endTimeout);

    // Cleanup
    return () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
      setIsTextScrambled(false);
      setCyclingCharacters({});
    };
  }, [isActive, textLines, setCyclingCharacters, setIsTextScrambled, generateScrambledTexts, getRandomCharacter, onComplete]);

  // This component doesn't render anything, it just manages the scrambling effect
  return null;
};

export default TextScrambleEffect;