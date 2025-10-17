import { useState, useEffect } from 'react';
import { getTypingFlashEffect, getCompletedLineFlashEffect } from '../utils/japaneseCharacterEffects';

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

  // Phonetic/kanji flash effect - flash contextual Japanese syllables/words in completed lines
  useEffect(() => {
    if (!hasStarted) return;

    const flashInterval = setInterval(() => {
      // Only flash in lines that have been fully typed (not the current typing line)
      for (let lineIndex = 0; lineIndex < currentLineIndex; lineIndex++) {
        const lineText = displayTexts[lineIndex];
        if (!lineText) continue;

        // 8% chance to flash a phonetic/kanji replacement per line per interval
        if (Math.random() < 0.08) {
          const flashEffect = getCompletedLineFlashEffect(lineText);

          if (flashEffect) {
            console.log(`🎌 Flashing ${flashEffect.type} in completed line: "${flashEffect.character}"`);

            setWordFlashCharacters(prev => ({
              ...prev,
              [flashEffect.key]: flashEffect.character
            }));

            setTimeout(() => {
              setWordFlashCharacters(prev => {
                const newState = { ...prev };
                delete newState[flashEffect.key];
                return newState;
              });
            }, flashEffect.duration);
          }
        }
      }
    }, 3000); // Check every 3 seconds

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

        // Flash effect for newly typed character (contextual or random)
        const justTypedChar = currentText[currentCharIndex];
        const flashEffect = getTypingFlashEffect(currentText, currentCharIndex, justTypedChar);

        if (flashEffect) {
          console.log(`⚡ Flashing typed char "${justTypedChar}" at index ${currentCharIndex} with "${flashEffect.character}" (${flashEffect.type})`);

          setWordFlashCharacters(prev => ({
            ...prev,
            [flashEffect.key]: flashEffect.character
          }));

          setTimeout(() => {
            setWordFlashCharacters(prev => {
              const newState = { ...prev };
              delete newState[flashEffect.key];
              return newState;
            });
          }, flashEffect.duration);
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