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
  const textElementRef = useRef<HTMLDivElement>(null);

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

  const { displayTexts, isComplete, currentLineIndex } = useTypewriter({
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

  // Keyboard commands
  useEffect(() => {
    const keyboardTimers = new Set<NodeJS.Timeout>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our custom keys
      if (['g', 'b', 'r', 'n', ' '].includes(e.key.toLowerCase())) {
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

  // Comprehensive cleanup on unmount
  useEffect(() => {
    const currentReopenTimer = reopenTimerRef.current;

    return () => {
      // Clear reopen timer
      if (currentReopenTimer) {
        clearTimeout(currentReopenTimer);
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
      />

      <div
        className={`vhs-container ${effectsReduced ? 'effects-reduced' : ''} ${isEjected ? 'ejected' : ''} ${isReopening ? 'reopening' : ''} ${isPaused ? 'paused' : ''}`}
      >
      {/* VHS Effects Component */}
      <VHSEffects effectsReduced={effectsReduced} isPaused={isPaused} />

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
