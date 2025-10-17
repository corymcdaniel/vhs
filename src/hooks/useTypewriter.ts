import { useState, useEffect } from 'react';
import { getRandomFlashCharacter } from '../utils/japaneseFlash';

interface UseTypewriterProps {
  texts: string[];
  speed?: number;
  delay?: number;
  startDelay?: number;
}

interface UseTypewriterReturn {
  displayTexts: string[];
  isComplete: boolean;
  currentLineIndex: number;
  wordFlashCharacters: {[key: string]: string};
}

export const useTypewriter = ({
  texts,
  speed = 80,
  delay = 500,
  startDelay = 1000
}: UseTypewriterProps): UseTypewriterReturn => {
  const [displayTexts, setDisplayTexts] = useState<string[]>(() => texts.map(() => ''));
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [wordFlashCharacters, setWordFlashCharacters] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Start delay
    const startTimer = setTimeout(() => {
      setHasStarted(true);
      setCurrentLineIndex(0);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  // Random character flash effect - flash characters randomly as they appear
  useEffect(() => {
    if (!hasStarted) return;

    // Flash random characters in already-typed lines
    const flashInterval = setInterval(() => {
      // Only flash in lines that have been fully typed (not the current typing line)
      for (let lineIndex = 0; lineIndex < currentLineIndex; lineIndex++) {
        const lineText = displayTexts[lineIndex];
        if (!lineText) continue;

        // Random chance to flash a character in this completed line
        if (Math.random() < 0.05) { // 5% chance per line per interval
          const chars = lineText.split('');
          const validIndices = chars
            .map((char, idx) => ({ char, idx }))
            .filter(({ char }) => char.match(/[a-zA-Z]/))
            .map(({ idx }) => idx);

          if (validIndices.length > 0) {
            const randomIdx = validIndices[Math.floor(Math.random() * validIndices.length)];
            const charKey = `${lineText}-${randomIdx}`;
            const randomJapanese = getRandomFlashCharacter();

            console.log(`🔥 Flashing character at completed line "${lineText}" index ${randomIdx} with "${randomJapanese}"`);

            setWordFlashCharacters(prev => ({
              ...prev,
              [charKey]: randomJapanese
            }));

            setTimeout(() => {
              setWordFlashCharacters(prev => {
                const newState = { ...prev };
                delete newState[charKey];
                return newState;
              });
            }, 1200);
          }
        }
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(flashInterval);
  }, [hasStarted, currentLineIndex, displayTexts]);


  useEffect(() => {
    if (!hasStarted || currentLineIndex === -1 || currentLineIndex >= texts.length) {
      return;
    }

    const currentText = texts[currentLineIndex];

    if (currentCharIndex < currentText.length) {
      // Normal character reveal with natural variation
      const baseDelay = speed;
      const randomVariation = Math.random() * 30 - 15; // ±15ms variation
      const occasionalPause = Math.random() < 0.02 ? 50 + Math.random() * 100 : 0; // 2% chance of brief pause
      const totalDelay = baseDelay + randomVariation + occasionalPause;

      const timer = setTimeout(() => {
        setDisplayTexts(prev => {
          const newTexts = [...prev];
          newTexts[currentLineIndex] = currentText.slice(0, currentCharIndex + 1);
          return newTexts;
        });

        // Random chance to flash the character that was just typed
        const justTypedChar = currentText[currentCharIndex];
        if (justTypedChar && justTypedChar.match(/[a-zA-Z]/) && Math.random() < 0.05) { // 5% chance
          // Use the FULL original text as key base, not the partial display text
          const charKey = `${currentText}-${currentCharIndex}`;
          const randomJapanese = getRandomFlashCharacter();

          console.log(`⚡ Flashing newly typed character "${justTypedChar}" at index ${currentCharIndex} with "${randomJapanese}", key: "${charKey}"`);

          setWordFlashCharacters(prev => ({
            ...prev,
            [charKey]: randomJapanese
          }));

          setTimeout(() => {
            setWordFlashCharacters(prev => {
              const newState = { ...prev };
              delete newState[charKey];
              return newState;
            });
          }, 1200);
        }

        setCurrentCharIndex(prev => prev + 1);
      }, totalDelay);

      return () => clearTimeout(timer);
    } else {
      // Line complete, move to next line
      const nextLineTimer = setTimeout(() => {
        if (currentLineIndex < texts.length - 1) {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        } else {
          setIsComplete(true);
        }
      }, delay + Math.random() * 200); // Brief random delay between lines

      return () => clearTimeout(nextLineTimer);
    }
  }, [hasStarted, currentLineIndex, currentCharIndex, texts, speed, delay]);

  return {
    displayTexts,
    isComplete,
    currentLineIndex,
    wordFlashCharacters
  };
};