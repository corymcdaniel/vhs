import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VHSContainer.css';
import { useTypewriter } from '../hooks/useTypewriter';
import ContactModal from './ContactModal';
import RecordingModal from './RecordingModal';
import SimpleBackgroundManager from './SimpleBackgroundManager';
import VHSEffects from './VHSEffects';

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

  // Current time display (updates every second)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  // Random glitch effects with useRef
  useEffect(() => {
    if (!effectsReduced) {
      const activeTimers = new Set<NodeJS.Timeout>();

      const glitchInterval = setInterval(() => {
        if (Math.random() < 0.1 && textElementRef.current) {
          const textElement = textElementRef.current;
          const randomX = Math.random() * 4 - 2;
          const randomY = Math.random() * 4 - 2;
          const randomHue = Math.random() * 360;
          const randomContrast = 1 + Math.random() * 0.5;

          textElement.style.transform = `translate(${randomX}px, ${randomY}px)`;
          textElement.style.filter = `hue-rotate(${randomHue}deg) contrast(${randomContrast})`;

          const resetTimer = setTimeout(() => {
            if (textElementRef.current) {
              textElementRef.current.style.transform = 'translate(0, 0)';
              textElementRef.current.style.filter = '';
            }
            activeTimers.delete(resetTimer);
          }, 50 + Math.random() * 100);

          activeTimers.add(resetTimer);
        }
      }, 200);

      return () => {
        clearInterval(glitchInterval);
        activeTimers.forEach(timer => clearTimeout(timer));
        activeTimers.clear();
      };
    }
  }, [effectsReduced]);

  const formatCurrentTime = (date: Date) => {
    const hours = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Debug logging
  console.log('VHSContainer render - imagesLoaded:', imagesLoaded, 'loadingStep:', loadingStep);

  // Show loading screen while images are preloading
  if (!imagesLoaded) {
    console.log('Showing loading screen');
    return (
      <div className="vhs-loading-container">
        <div className="vhs-loading-text">
          {loadingStep >= 1 && <div className="loading-line">VHS TAPE LOADING...</div>}
          {loadingStep >= 2 && <div className="loading-line">PREPARING BACKGROUND IMAGES...</div>}
          {loadingStep >= 3 && <div className="loading-line">MUTING BACKGROUND NOISES...</div>}
          {loadingStep >= 3 && (
            <div className="loading-progress">
              <div className="loading-bar"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  console.log('Showing main VHS interface');

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

      {/* Timestamp */}
      <div className="vhs-timestamp" onClick={handleRecordingClick}>
        <span className="rec-dot"></span>
        REC {formatCurrentTime(currentTime)}
      </div>

      {/* Main Text */}
      <div className="vhs-text chromatic" ref={textElementRef}>
        {displayTexts.map((text, index) => {
          const isVisible = index <= currentLineIndex;
          const opacity = isVisible ? 1 : 0;
          const isCurrentLine = index === currentLineIndex && !isComplete;
          const lineClass = `line ${isCurrentLine ? 'typing' : ''}`;

          return (
            <span key={index} className={lineClass} style={{ opacity }}>
              {text}
            </span>
          );
        })}

        {showContactButton && (
          <button
            className="contact-button"
            style={{ animationDelay: '0.5s' }}
            onClick={handleContactClick}
          >
            CONTACT ME
          </button>
        )}

        {showContactButton && !isEjected && (
          <button
            className="eject-button"
            style={{ animationDelay: '3.0s' }}
            onClick={handleEject}
          >
            ⏏ EJECT
          </button>
        )}
      </div>

      {/* Navigation Bar - appears as content is typed */}
      <div className={`vhs-nav ${showWorkNav ? 'show' : ''}`}>
        {showWorkNav && (
          <button
            className="vhs-nav-item"
            style={{ animationDelay: '0.2s' }}
            onClick={() => handleLinkClick('https://www.linkedin.com/in/corymcdaniel/')}
          >
            <span className="nav-label">WORK</span>
            <span className="nav-desc">LinkedIn</span>
          </button>
        )}

        {showPhotoNav && (
          <button
            className="vhs-nav-item"
            style={{ animationDelay: '0.4s' }}
            onClick={() => handleLinkClick('https://www.instagram.com/corymcdaniel')}
          >
            <span className="nav-label">PHOTOS</span>
            <span className="nav-desc">Instagram</span>
          </button>
        )}

        {showCatsNav && (
          <>
            <button
              className="vhs-nav-item cat-nav"
              style={{ animationDelay: '0.6s' }}
              onClick={() => handleCatLinkClick('charlie')}
            >
              <span className="nav-label">CHARLIE</span>
              <span className="nav-desc">(chow chow)</span>
            </button>
            <button
              className="vhs-nav-item cat-nav"
              style={{ animationDelay: '0.8s' }}
              onClick={() => handleCatLinkClick('papago')}
            >
              <span className="nav-label">PAPAGO</span>
              <span className="nav-desc">(papachan)</span>
            </button>
          </>
        )}

        {showLocationNav && (
          <>
            <button
              className="vhs-nav-item"
              style={{ animationDelay: '1.0s' }}
              onClick={() => handleLinkClick('https://www.google.com/maps?q=phoenix')}
            >
              <span className="nav-label">PHOENIX</span>
              <span className="nav-desc">Location</span>
            </button>
            <button
              className="vhs-nav-item"
              style={{ animationDelay: '1.2s' }}
              onClick={() => handleLinkClick('https://dbg.org')}
            >
              <span className="nav-label">DESERT</span>
              <span className="nav-desc">Garden</span>
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      <button className="toggle-effects-btn" onClick={onToggleEffects}>
        {effectsReduced ? 'RESTORE EFFECTS' : 'REDUCE EFFECTS'}
      </button>

      <button className="pause-btn" onClick={handlePause}>
        {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
      </button>

      <button className="fast-forward-btn" onClick={handleFastForward}>
        {'>> FF'}
      </button>

      {/* Reopen Icon - shows when ejected */}
      {isEjected && (
        <button className="reopen-icon" onClick={handleReopen}>
          ⏏
        </button>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={handleContactClose} />
      )}

      {/* Recording Modal */}
      {showRecordingModal && (
        <RecordingModal onClose={handleRecordingClose} />
      )}
    </div>
    </>
  );
};

export default VHSContainer;
