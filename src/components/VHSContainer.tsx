import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VHSContainer.css';
import { useTypewriter } from '../hooks/useTypewriter';
import ContactModal from './ContactModal';
import RecordingModal from './RecordingModal';
import HelpModal from './HelpModal';
import VHSTopNavBar from './VHSTopNavBar';
import AboutModal from './AboutModal';
import SimpleBackgroundManager from './SimpleBackgroundManager';
import VHSEffects from './VHSEffects';
import VHSTimestamp from './VHSTimestamp';
import VHSLoadingScreen from './VHSLoadingScreen';
import VHSTextDisplay from './VHSTextDisplay';
import VHSNavigationBar from './VHSNavigationBar';
import VHSControlPanel from './VHSControlPanel';

interface VHSContainerProps {
  effectsReduced: boolean;
  onCatClick: (catName: string) => void;
  onToggleEffects: () => void;
}

const VHSContainer: React.FC<VHSContainerProps> = ({
  effectsReduced,
  onCatClick,
  onToggleEffects
}) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [isEjected, setIsEjected] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAutoEjecting, setIsAutoEjecting] = useState(false);
  const [scrambledTexts, setScrambledTexts] = useState<string[]>([]);
  const [isTextScrambled, setIsTextScrambled] = useState(false);
  const [showOsakaFlash, setShowOsakaFlash] = useState(false);
  const [showOsakaBurn, setShowOsakaBurn] = useState(false);
  const [showOhNoMessage, setShowOhNoMessage] = useState(false);
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
      "Eject to see the pictures without my rambling."
  ]).current;

  // Character sets for scrambling
  const hiraganaChars = [
    'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご',
    'さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'た', 'ち', 'つ', 'て', 'と',
    'だ', 'ぢ', 'づ', 'で', 'ど', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ',
    'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ', 'ま', 'み', 'む', 'め', 'も',
    'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'ゐ', 'ゑ', 'を', 'ん'
  ];

  const katakanaChars = [
    'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
    'サ', 'シ', 'ス', 'セ', 'ソ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ', 'タ', 'チ', 'ツ', 'テ', 'ト',
    'ダ', 'ヂ', 'ヅ', 'デ', 'ド', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
    'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ', 'マ', 'ミ', 'ム', 'メ', 'モ',
    'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヰ', 'ヱ', 'ヲ', 'ン'
  ];

  const romajiChars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  // Utility function to get random character from any character set
  const getRandomCharacter = useCallback(() => {
    const characterSets = [hiraganaChars, katakanaChars, romajiChars];
    const randomSet = characterSets[Math.floor(Math.random() * characterSets.length)];
    return randomSet[Math.floor(Math.random() * randomSet.length)];
  }, []);

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

  const { displayTexts, isComplete, currentLineIndex } = useTypewriter({
    texts: textLines,
    speed: 60,
    delay: 800,
    startDelay: 500
  });

  // Generate random hiragana versions of all text lines
  const generateScrambledTexts = useCallback(() => {
    console.log('📝 Generating scrambled hiragana texts...');
    console.log('📝 Current displayTexts:', displayTexts);
    console.log('📝 Using textLines instead:', textLines);

    // Use the original textLines instead of displayTexts which might be incomplete
    const scrambled = textLines.map(text => generateRandomHiraganaText(text));
    console.log('📝 Scrambled texts generated:', scrambled);
    setScrambledTexts(scrambled);
  }, [displayTexts, generateRandomHiraganaText, textLines]);

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
  }, [handleFastForward]);

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

  // Handle dramatic auto-eject sequence
  const handleAutoEject = useCallback(() => {
    console.log('🎬 Starting dramatic auto-eject sequence with OSAKA kanji flash');
    setIsAutoEjecting(true);

    // Show OSAKA kanji flash immediately for full duration
    setShowOsakaFlash(true);
    console.log('🔴 OSAKA kanji flash started - 5 second duration');

    // Show "oh no...." message slightly delayed for natural staggered effect
    setTimeout(() => {
      setShowOhNoMessage(true);
      console.log('😰 "oh no...." message appeared');
    }, 300);

    // Generate scrambled hiragana text during flash
    generateScrambledTexts();

    // Start text scrambling immediately
    setIsTextScrambled(true);
    console.log('⚡ Text scrambling with character cycling started');

    // Start character cycling for 60-80% of characters
    const startCharacterCycling = () => {
      const cyclingPercentage = 0.6 + (Math.random() * 0.2); // 60-80%
      console.log(`🔄 Starting character cycling for ${Math.round(cyclingPercentage * 100)}% of characters`);

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

            // Stop cycling after 3 seconds
            setTimeout(() => {
              clearInterval(cycleInterval);
              setCyclingCharacters(prev => {
                const newState = { ...prev };
                delete newState[charKey];
                return newState;
              });
            }, 3000);
          }
        });
      });
    };

    startCharacterCycling();

    // Stop text scrambling after lightning sequence (3 seconds)
    setTimeout(() => {
      setIsTextScrambled(false);
      setCyclingCharacters({}); // Clear all cycling characters
      console.log('⚡ Text scrambling ended - returning to normal');
    }, 3000);

    // After 5 seconds, stop flickering and switch to burn effect
    setTimeout(() => {
      setShowOsakaFlash(false);
      setShowOsakaBurn(true);
      // Keep "oh no...." visible - it will fade on its own after 30s
      console.log('🔴 OSAKA flickering stopped - switching to burn screen');
    }, 5000);

    // Hide "oh no...." message after 30 seconds
    setTimeout(() => {
      setShowOhNoMessage(false);
      console.log('😰 "oh no...." message ended after 30 seconds');
    }, 30000);

    // Hide burn effect after 15 seconds total
    setTimeout(() => {
      setShowOsakaBurn(false);
      console.log('🔴 OSAKA burn effect ended');
    }, 15000);

    // After 5 seconds of dramatic effects, complete the eject
    autoEjectTimerRef.current = setTimeout(() => {
      setIsAutoEjecting(false);
      setIsEjected(true);
      setIsTextScrambled(false); // Ensure text is normal when ejected
      // Don't hide "oh no...." here - let it run for 30 seconds total
      console.log('🎬 Auto-eject sequence complete - ejected! "oh no" continues for 25 more seconds...');
    }, 5000);
  }, [generateScrambledTexts]);

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
      {/* OSAKA Kanji Flash Overlay - Outside main content */}
      {showOsakaFlash && (
        <div className="osaka-flash-overlay">
          <div className="osaka-kanji">大阪</div>
        </div>
      )}

      {/* OSAKA Burn Screen Effect - Static burn after chaos */}
      {showOsakaBurn && (
        <div className="osaka-burn-overlay">
          <div className="osaka-burn-kanji">大阪</div>
        </div>
      )}

      {/* "oh no...." Message - Top left, typewriter style */}
      {showOhNoMessage && (
        <div className="oh-no-message">
          oh no....
        </div>
      )}

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
        scrambledTexts={scrambledTexts}
        isTextScrambled={isTextScrambled}
        currentLineIndex={currentLineIndex}
        isComplete={isComplete}
        textElementRef={textElementRef}
        showContactButton={showContactButton}
        onContactClick={handleContactClick}
        onEjectClick={handleEject}
        isEjected={isEjected}
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
    </div>
    </>
  );
};

export default VHSContainer;
