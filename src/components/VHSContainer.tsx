import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VHSContainer.css';
import { useTypewriter } from '../hooks/useTypewriter';
import ContactModal from './ContactModal';
import RecordingModal from './RecordingModal';
import HelpModal from './HelpModal';
import VHSTopNavBar from './VHSTopNavBar';
import AboutModal from './AboutModal';
import PhotoGalleryModal from './PhotoGalleryModal';
import SimpleBackgroundManager from './SimpleBackgroundManager';
import VHSEffects from './VHSEffects';
import VHSTimestamp from './VHSTimestamp';
import VHSLoadingScreen from './VHSLoadingScreen';
import VHSTextDisplay from './VHSTextDisplay';
import VHSNavigationBar from './VHSNavigationBar';
import VHSControlPanel from './VHSControlPanel';
import { useAutoEjectSequence } from './AutoEjectSequence';
import { useOhNoMessage } from './OhNoMessage';
import TextScrambleEffect from './TextScrambleEffect';
import { logger } from '../utils/logger';

// Static character arrays - moved outside component to prevent recreation on every render
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

interface VHSContainerProps {
  effectsReduced: boolean;
  onCatClick: (catName: string) => void;
  onToggleEffects: () => void;
  onAutoEjectStart: () => void;
}

const VHSContainer: React.FC<VHSContainerProps> = ({
  effectsReduced,
  onCatClick,
  onToggleEffects,
  onAutoEjectStart
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState(false);
  const [isEjected, setIsEjected] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAutoEjecting, setIsAutoEjecting] = useState(false);
  const [scrambledTexts, setScrambledTexts] = useState<string[]>([]);
  const [isTextScrambled, setIsTextScrambled] = useState(false);
  const [cyclingCharacters, setCyclingCharacters] = useState<{[key: string]: string}>({});
  const textElementRef = useRef<HTMLDivElement>(null);
  const autoEjectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const textLines = useRef([
    "Hello, I'm Cory.",
    "I've been developing websites for years.",
    "...............",
    "I am also sort of an amateur photographer.",
    "I have two cats, Charlie and Papago.",
    "I live in Phoenix, Arizona and love the desert.",
      "................",
      "Eject to see the pictures. Or use the Photo Gallery."
  ]).current;

  // Utility function to get random character from any character set
  const getRandomCharacter = useCallback(() => {
    const characterSets = [HIRAGANA_CHARS, KATAKANA_CHARS, ROMAJI_CHARS];
    const randomSet = characterSets[Math.floor(Math.random() * characterSets.length)];
    return randomSet[Math.floor(Math.random() * randomSet.length)];
  }, []); // No dependencies needed - arrays are static constants

  // Utility function to generate random text with cycling characters
  const generateRandomHiraganaText = useCallback((originalText: string): string => {
    const chars = originalText.split('');
    const randomChars = chars.map((char, index) => {
      const charKey = `${originalText}-${index}`;

      // Preserve spaces and some punctuation for readability
      if (char === ' ') {
        return ' ';
      }
      if (char === '.' && Math.random() < 0.3) {
        return '.';
      }
      if (char === ',' && Math.random() < 0.2) {
        return ',';
      }

      // If this character is in the cycling characters state, use it
      if (cyclingCharacters[charKey]) {
        return cyclingCharacters[charKey];
      }

      // Everything else becomes random character from any set
      const randomChar = getRandomCharacter();
      return randomChar;
    });

    return randomChars.join('');
  }, [cyclingCharacters, getRandomCharacter]);

  const { displayTexts, isComplete, currentLineIndex, wordFlashCharacters } = useTypewriter({
    texts: textLines,
    speed: 60,
    delay: 800,
    startDelay: 500
  });

  // Track which navigation sections should be visible based on content
  const completedText = displayTexts.slice(0, currentLineIndex + 1).join(' ').toLowerCase();
  const showWorkNav = completedText.includes('developing websites') || completedText.includes('websites');
  const showPhotoNav = completedText.includes('photography') || completedText.includes('photographer');
  const showCatsNav = completedText.includes('cats') && (completedText.includes('charlie') || completedText.includes('papago'));
  const showLocationNav = completedText.includes('phoenix') || completedText.includes('desert');
  const showContactButton = isComplete; // After all text is complete

  // Handle images loaded callback from BackgroundManager
  const handleImagesLoaded = useCallback((loaded: boolean) => {
    setImagesLoaded(loaded);
  }, []);

  // Loading step progression with 1 second delays
  useEffect(() => {
    if (imagesLoaded) return; // Don't run if images are already loaded

    const loadingTimers: NodeJS.Timeout[] = [];

    // Show each loading line with 1 second delay
    const timer1 = setTimeout(() => setLoadingStep(1), 100);
    const timer2 = setTimeout(() => setLoadingStep(2), 200);
    const timer3 = setTimeout(() => setLoadingStep(3), 300);

    loadingTimers.push(timer1, timer2, timer3);

    return () => {
      loadingTimers.forEach(timer => clearTimeout(timer));
    };
  }, [imagesLoaded]);

  // Time management moved to VHSTimestamp component

  const handleFastForward = useCallback(() => {
    // Trigger manual background change via global function
    if ((window as any).changeBackgroundManually) {
      (window as any).changeBackgroundManually();
    }
  }, []);

  const generateScrambledTexts = useCallback(() => {
    logger.log('📝 Generating scrambled hiragana texts...');
    logger.log('📝 Current displayTexts:', displayTexts);
    logger.log('📝 Using textLines instead:', textLines);

    // Use the original textLines instead of displayTexts which might be incomplete
    const scrambled = textLines.map(text => generateRandomHiraganaText(text));
    logger.log('📝 Scrambled texts generated:', scrambled);
    setScrambledTexts(scrambled);
  }, [displayTexts, generateRandomHiraganaText, textLines]);

  // Handle dramatic auto-eject sequence - for manual triggers only
  const handleAutoEject = useCallback(() => {
    logger.log('🎬 Manual auto-eject triggered');
    setIsAutoEjecting(true);
    onAutoEjectStart(); // Notify App to show Osaka effects
  }, [onAutoEjectStart]);

  // Handle auto-eject completion
  const handleAutoEjectComplete = useCallback(() => {
    setIsAutoEjecting(false);
    setIsEjected(true);
    setIsTextScrambled(false); // Ensure text is normal when ejected
    logger.log('🎬 Auto-eject sequence complete - ejected!');
  }, []);

  // Use auto-eject hooks
  useAutoEjectSequence({ isActive: isAutoEjecting, onComplete: handleAutoEjectComplete });
  const showOhNoMessage = useOhNoMessage({ isActive: isAutoEjecting });

  // Auto-trigger eject 20 seconds after typewriter completes (when contact button shows)
  useEffect(() => {
    if (isComplete && !effectsReduced && !isAutoEjecting && !isEjected) {
      logger.log('🎬 Typewriter complete, starting 20 second countdown to chaos...');
      autoEjectTimerRef.current = setTimeout(() => {
        logger.log('🎬 20 seconds elapsed - triggering auto-eject chaos!');
        setIsAutoEjecting(true);
        onAutoEjectStart(); // Notify App to show Osaka effects
      }, 20000);

      return () => {
        if (autoEjectTimerRef.current) {
          clearTimeout(autoEjectTimerRef.current);
          autoEjectTimerRef.current = null;
        }
      };
    }
  }, [isComplete, effectsReduced, isAutoEjecting, isEjected, onAutoEjectStart]);


  // Keyboard commands
  useEffect(() => {
    const keyboardTimers = new Set<NodeJS.Timeout>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our custom keys
      if (['g', 'b', 'r', 'n', 'e', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Spacebar for background change
          handleFastForward();
          break;

        case 'g': // 'g' for text glitch
          if (textElementRef.current) {
            const element = textElementRef.current;
            const glitchX = Math.random() * 20 - 10;
            const glitchY = Math.random() * 20 - 10;
            const hueShift = Math.random() * 360;
            const contrastBoost = 2 + Math.random() * 3;

            element.style.transform = `translate(${glitchX}px, ${glitchY}px)`;
            element.style.filter = `hue-rotate(${hueShift}deg) contrast(${contrastBoost}) brightness(1.5)`;

            const glitchTimer = setTimeout(() => {
              if (textElementRef.current) {
                textElementRef.current.style.transform = '';
                textElementRef.current.style.filter = '';
              }
              keyboardTimers.delete(glitchTimer);
            }, 400);
            keyboardTimers.add(glitchTimer);
          }
          break;

        case 'n': // 'n' for next background (same as FF button)
          handleFastForward();
          break;

        case 'r': // 'r' to reset/reload page
          window.location.reload();
          break;

        case 'e': // 'e' for dramatic eject sequence
          if (!isEjected && !isAutoEjecting && !effectsReduced) {
            handleAutoEject();
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      keyboardTimers.forEach(timer => clearTimeout(timer));
      keyboardTimers.clear();
    };
  }, [handleFastForward, handleAutoEject, isEjected, isAutoEjecting, effectsReduced]);

  // Random glitch effects with useRef - OPTIMIZED for performance
  useEffect(() => {
    if (!effectsReduced) {
      const activeTimers = new Set<NodeJS.Timeout>();

      const glitchInterval = setInterval(() => {
        // Reduced frequency from 10% to 3% and increased interval
        if (Math.random() < 0.03 && textElementRef.current) {
          const textElement = textElementRef.current;
          const randomX = Math.random() * 2 - 1; // Reduced movement
          const randomY = Math.random() * 2 - 1;
          const randomHue = Math.random() * 180; // Reduced hue range
          const randomContrast = 1 + Math.random() * 0.2; // Reduced contrast

          textElement.style.transform = `translate(${randomX}px, ${randomY}px)`;
          textElement.style.filter = `hue-rotate(${randomHue}deg) contrast(${randomContrast})`;

          const resetTimer = setTimeout(() => {
            if (textElementRef.current) {
              textElementRef.current.style.transform = 'translate(0, 0)';
              textElementRef.current.style.filter = '';
            }
            activeTimers.delete(resetTimer);
          }, 50 + Math.random() * 50); // Shorter duration

          activeTimers.add(resetTimer);
        }
      }, 1000); // Increased from 200ms to 1000ms (5x less frequent)

      return () => {
        clearInterval(glitchInterval);
        activeTimers.forEach(timer => clearTimeout(timer));
        activeTimers.clear();
      };
    }
  }, [effectsReduced]);

  // formatCurrentTime moved to VHSTimestamp component

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleCatLinkClick = (catName: string) => {
    onCatClick(catName);
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleContactClose = () => {
    setShowContactModal(false);
  };

  const handleRecordingClick = () => {
    setShowRecordingModal(true);
  };

  const handleRecordingClose = () => {
    setShowRecordingModal(false);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  const handleHelpClose = () => {
    setShowHelpModal(false);
  };

  const handleAboutClick = useCallback(() => {
    setShowAboutModal(true);
  }, []);

  const handleAboutClose = useCallback(() => {
    setShowAboutModal(false);
  }, []);

  // Set up global function for AboutModal
  useEffect(() => {
    (window as any).openAboutModal = handleAboutClick;
    return () => {
      delete (window as any).openAboutModal;
    };
  }, [handleAboutClick]);

  const handlePhotoGalleryClick = () => {
    setShowPhotoGalleryModal(true);
  };

  const handlePhotoGalleryClose = () => {
    setShowPhotoGalleryModal(false);
  };

  const handleEject = () => {
    setIsEjected(true);
  };

  const reopenTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleReopen = useCallback(() => {
    // Clear any existing reopen timer
    if (reopenTimerRef.current) {
      clearTimeout(reopenTimerRef.current);
    }

    setIsReopening(true);
    setIsEjected(false);

    // Reset reopening state after animation completes
    reopenTimerRef.current = setTimeout(() => {
      setIsReopening(false);
      reopenTimerRef.current = null;
    }, 1200);
  }, []);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  // Comprehensive cleanup on unmount
  useEffect(() => {
    const currentReopenTimer = reopenTimerRef.current;
    const currentAutoEjectTimer = autoEjectTimerRef.current;

    return () => {
      // Clear reopen timer
      if (currentReopenTimer) {
        clearTimeout(currentReopenTimer);
      }
      // Clear auto-eject timer
      if (currentAutoEjectTimer) {
        clearTimeout(currentAutoEjectTimer);
      }
    };
  }, []);

  // Show loading screen while images are preloading
  if (!imagesLoaded) {
    return <VHSLoadingScreen loadingStep={loadingStep} />;
  }

  return (
    <>
      {/* Simple Background Manager handles all background cycling and effects */}
      <SimpleBackgroundManager
        onImagesLoaded={handleImagesLoaded}
        isEjected={isEjected}
        isPaused={isPaused}
        effectsReduced={effectsReduced}
        onAutoEject={handleAutoEject}
      />

      <div
        className={`vhs-container ${effectsReduced ? 'effects-reduced' : ''} ${isEjected ? 'ejected' : ''} ${isReopening ? 'reopening' : ''} ${isPaused ? 'paused' : ''} ${isAutoEjecting ? 'auto-ejecting' : ''}`}
      >
      {/* "oh no...." Message - Direct rendering */}
      {showOhNoMessage && (
        <div className="oh-no-message">
          oh no....
        </div>
      )}

      {/* Text Scramble Effect Component - Still needs to manage cycling */}
      <TextScrambleEffect
        isActive={isAutoEjecting}
        textLines={textLines}
        setCyclingCharacters={setCyclingCharacters}
        setIsTextScrambled={setIsTextScrambled}
        generateScrambledTexts={generateScrambledTexts}
      />

      {/* VHS Effects Component */}
      <VHSEffects effectsReduced={effectsReduced} isPaused={isPaused} isAutoEjecting={isAutoEjecting} />

      {/* Top Navigation Bar */}
      <VHSTopNavBar
        isEjected={isEjected}
        onHelpClick={handleHelpClick}
        onReopen={handleReopen}
      />

      {/* Timestamp */}
      <VHSTimestamp onRecordingClick={handleRecordingClick} />

      {/* Main Text */}
      <VHSTextDisplay
        displayTexts={displayTexts}
        originalTexts={textLines}
        scrambledTexts={scrambledTexts}
        isTextScrambled={isTextScrambled}
        currentLineIndex={currentLineIndex}
        isComplete={isComplete}
        textElementRef={textElementRef}
        showContactButton={showContactButton}
        onContactClick={handleContactClick}
        onEjectClick={handleEject}
        isEjected={isEjected}
        cyclingCharacters={{...cyclingCharacters, ...wordFlashCharacters}}
      />

      {/* Navigation Bar - appears as content is typed */}
      <VHSNavigationBar
        showWorkNav={showWorkNav}
        showPhotoNav={showPhotoNav}
        showCatsNav={showCatsNav}
        showLocationNav={showLocationNav}
        onLinkClick={handleLinkClick}
        onCatClick={handleCatLinkClick}
      />

      {/* Controls */}
      <VHSControlPanel
        effectsReduced={effectsReduced}
        isPaused={isPaused}
        isEjected={isEjected}
        onToggleEffects={onToggleEffects}
        onPause={handlePause}
        onFastForward={handleFastForward}
        onReopen={handleReopen}
        onPhotoGalleryClick={handlePhotoGalleryClick}
      />

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={handleContactClose} />
      )}

      {/* Recording Modal */}
      {showRecordingModal && (
        <RecordingModal onClose={handleRecordingClose} />
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={handleHelpClose} />
      )}

      {/* About Modal */}
      {showAboutModal && (
        <AboutModal onClose={handleAboutClose} />
      )}

      {/* Photo Gallery Modal */}
      {showPhotoGalleryModal && (
        <PhotoGalleryModal onClose={handlePhotoGalleryClose} />
      )}
    </div>
    </>
  );
};

export default VHSContainer;
