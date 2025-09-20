import React, { useState, useEffect, useRef, useCallback } from 'react';
import './VHSContainer.css';
import { useTypewriter } from '../hooks/useTypewriter';
import ContactModal from './ContactModal';
import RecordingModal from './RecordingModal';

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
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [timestamp, setTimestamp] = useState(257); // Starting at 00:42:17
  const [showContactModal, setShowContactModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [isEjected, setIsEjected] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const textElementRef = useRef<HTMLDivElement>(null);

  const backgroundImages = useRef([
    '/backgrounds/20250906_194829.jpg',
    '/backgrounds/20250312_095352.jpg',
    '/backgrounds/20250315_152239.jpg',
    '/backgrounds/20250329_180257.jpg',
    '/backgrounds/20250502_152600.jpg',
    '/backgrounds/20250502_152748~2.jpg',
    '/backgrounds/20250814_204013-EDIT (2).jpg',
    '/backgrounds/20250906_201009.jpg',
    '/backgrounds/20250908_200811.jpg',
    '/backgrounds/20230305_160446.jpg',
    '/backgrounds/20230305_194111.jpg',
    '/backgrounds/20230310_113926.jpg',
    '/backgrounds/20230310_170323.jpg',
    '/backgrounds/20230311_114327~2.jpg',
    '/backgrounds/20230415_091146.jpg',
    '/backgrounds/20230603_095027~2.jpg',
    '/backgrounds/20231214_174753.jpg',
    '/backgrounds/20231220_091305.jpg',
    '/backgrounds/20231222_135934.jpg',
    '/backgrounds/20231224_132745.jpg',
    '/backgrounds/20240309_174427.jpg',
    '/backgrounds/20240601_192412.jpg',
    '/backgrounds/20240704_201604.jpg',
    '/backgrounds/20240805_191606.jpg',
    '/backgrounds/20241227_162337.jpg',
    '/backgrounds/20250104_150527-EDIT.jpg',
    '/backgrounds/20250329_172513.jpg',
    '/backgrounds/bg.jpg'
  ]).current;

  const textLines = useRef([
    "Hello, I'm Cory.",
    "I've been developing websites for years.",
    "...............",
    "I am also sort of an amateur photographer.",
    "I have two cats, Charlie and Papago.",
    "I live in Phoenix, Arizona and love the desert.",
    "...............",
      "It is a bit dry, but so am I?",
      "Oof, that was lame."
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
  const showPhotoNav = completedText.includes('photography');
  const showCatsNav = completedText.includes('cats') && (completedText.includes('charlie') || completedText.includes('papago'));
  const showLocationNav = completedText.includes('phoenix') || completedText.includes('desert');
  const showContactButton = isComplete; // After all text is complete

  // Preload background images
  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      try {
        await Promise.all(backgroundImages.map(preloadImage));
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to load:', error);
        setImagesLoaded(true); // Still show the site
      }
    };

    preloadAllImages();
  }, [backgroundImages]);

  // Update timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Background cycling with flash effect
  useEffect(() => {
    if (!effectsReduced && !isPaused) {
      const activeTimers = new Set<NodeJS.Timeout>();

      const interval = setInterval(() => {
        // Show flash
        setShowFlash(true);

        // Change background after brief flash
        const bgTimer = setTimeout(() => {
          setCurrentBackgroundIndex(prev => (prev + 1) % backgroundImages.length);
          activeTimers.delete(bgTimer);
        }, 50);

        // Hide flash after longer duration
        const flashTimer = setTimeout(() => {
          setShowFlash(false);
          activeTimers.delete(flashTimer);
        }, 200);

        activeTimers.add(bgTimer);
        activeTimers.add(flashTimer);
      }, 15000);

      return () => {
        clearInterval(interval);
        activeTimers.forEach(timer => clearTimeout(timer));
        activeTimers.clear();
      };
    }
  }, [effectsReduced, isPaused, backgroundImages.length]);

  const handleFastForward = useCallback(() => {
    // Show flash
    setShowFlash(true);

    // Change background after brief flash
    setTimeout(() => {
      setCurrentBackgroundIndex(prev => (prev + 1) % backgroundImages.length);
    }, 50);

    // Hide flash after longer duration
    setTimeout(() => {
      setShowFlash(false);
    }, 200);
  }, [backgroundImages.length]);

  // Keyboard commands
  useEffect(() => {
    const keyboardTimers = new Set<NodeJS.Timeout>();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our custom keys
      if (['g', 'b', 'r', 'n', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Spacebar for static burst
          setShowFlash(true);
          const flashTimer = setTimeout(() => {
            setShowFlash(false);
            keyboardTimers.delete(flashTimer);
          }, 300);
          keyboardTimers.add(flashTimer);
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

  const formatTimestamp = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
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

  const handleReopen = useCallback(() => {
    setIsReopening(true);
    setIsEjected(false);

    // Reset reopening state after animation completes
    const timer = setTimeout(() => {
      setIsReopening(false);
    }, 1200);

    // Store timer for potential cleanup (though this is less critical since it's user-triggered)
    return () => clearTimeout(timer);
  }, []);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  // Show loading screen while images are preloading
  if (!imagesLoaded) {
    return (
      <div className="vhs-loading-container">
        <div className="vhs-loading-text">
          <div className="loading-line">LOADING VHS PORTFOLIO...</div>
          <div className="loading-line">PREPARING BACKGROUND IMAGES...</div>
          <div className="loading-progress">
            <div className="loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`vhs-container ${effectsReduced ? 'effects-reduced' : ''} ${isEjected ? 'ejected' : ''} ${isReopening ? 'reopening' : ''} ${isPaused ? 'paused' : ''}`}
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${backgroundImages[currentBackgroundIndex]}')`
      }}
    >
      {/* VHS Effects */}
      <div className="vhs-scramble"></div>
      <div className="static-overlay"></div>
      <div className="scan-lines"></div>
      <div className="tracking-lines"></div>

      {/* Static Flash for background transitions */}
      {showFlash && <div className="static-flash"></div>}

      {/* Static Text Overlay for paused state */}
      {isPaused && <div className="static-text-overlay"></div>}

      {/* Timestamp */}
      <div className="vhs-timestamp" onClick={handleRecordingClick}>
        <span className="rec-dot"></span>
        REC {formatTimestamp(timestamp)}
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
            style={{ animationDelay: '6.0s' }}
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
        ⏩ FF
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
  );
};

export default VHSContainer;
