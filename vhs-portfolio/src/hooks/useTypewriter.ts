import { useState, useEffect } from 'react';

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


  useEffect(() => {
    // Start delay
    const startTimer = setTimeout(() => {
      setHasStarted(true);
      setCurrentLineIndex(0);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!hasStarted || currentLineIndex === -1 || currentLineIndex >= texts.length) {
      return;
    }

    const currentText = texts[currentLineIndex];

    if (currentCharIndex < currentText.length) {
      // Add random typing variation and occasional pause
      const randomDelay = speed + Math.random() * 20 - 10;
      const pauseDelay = Math.random() < 0.03 ? 100 + Math.random() * 150 : 0;
      const totalDelay = randomDelay + pauseDelay;

      const timer = setTimeout(() => {
        setDisplayTexts(prev => {
          const newTexts = [...prev];
          newTexts[currentLineIndex] = currentText.slice(0, currentCharIndex + 1);
          return newTexts;
        });
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
      }, delay + Math.random() * 300); // Reduced random delay

      return () => clearTimeout(nextLineTimer);
    }
  }, [hasStarted, currentLineIndex, currentCharIndex, texts, speed, delay]);

  return {
    displayTexts,
    isComplete,
    currentLineIndex
  };
};