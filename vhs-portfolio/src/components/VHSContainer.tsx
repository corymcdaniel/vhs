import React, { useState, useEffect, useRef } from 'react';
import './VHSContainer.css';
import { useTypewriter } from '../hooks/useTypewriter';
import ContactModal from './ContactModal';

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
  const [isEjected, setIsEjected] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const textElementRef = useRef<HTMLDivElement>(null);

  const backgroundImages = [
    '/backgrounds/20250906_194829.jpg',
    '/backgrounds/20250312_095352.jpg',
    '/backgrounds/20250315_152239.jpg',
    '/backgrounds/20250329_180257.jpg',
    '/backgrounds/20250502_152600.jpg',
    '/backgrounds/20250502_152748~2.jpg',
    '/backgrounds/20250814_204013-EDIT (2).jpg',
    '/backgrounds/20250906_201009.jpg',
    '/backgrounds/bg.jpg'
  ];

  const textLines = [
    "Hello, I'm Cory.",
    "I've been developing websites for years.",
    "I also do photography.",
    "I have two cats, Charlie and Papago.",
    "I live in Phoenix, Arizona and love the desert.",
    "..."
  ];

  const { displayTexts, isComplete, currentLineIndex } = useTypewriter({
    texts: textLines,
    speed: 60,
    delay: 800,
    startDelay: 500
  });

  // Track which navigation sections should be visible
  const showWorkNav = currentLineIndex >= 1; // After "developing websites" line
  const showPhotoNav = currentLineIndex >= 2; // After "photography" line
  const showCatsNav = currentLineIndex >= 3; // After "cats" line
  const showLocationNav = currentLineIndex >= 4; // After "location" line
  const showContactButton = isComplete; // After all text is complete


  // Update timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Background cycling with flash effect
  useEffect(() => {
    if (!effectsReduced) {
      const interval = setInterval(() => {
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
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [effectsReduced, backgroundImages.length]);

  // Keyboard commands
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for our custom keys
      if (['g', 'b', 'r', 'n', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Spacebar for static burst
          setShowFlash(true);
          setTimeout(() => setShowFlash(false), 300);
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

            setTimeout(() => {
              if (textElementRef.current) {
                textElementRef.current.style.transform = '';
                textElementRef.current.style.filter = '';
              }
            }, 400);
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
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Random glitch effects with useRef
  useEffect(() => {
    if (!effectsReduced) {
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
          }, 50 + Math.random() * 100);

          // Return cleanup for the reset timer
          return () => clearTimeout(resetTimer);
        }
      }, 200);

      return () => clearInterval(glitchInterval);
    }
  }, [effectsReduced]);

  const formatTimestamp = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `REC ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const handleEject = () => {
    setIsEjected(true);
  };

  const handleReopen = () => {
    setIsReopening(true);
    setIsEjected(false);

    // Reset reopening state after animation completes
    setTimeout(() => {
      setIsReopening(false);
    }, 1200);
  };

  const handleFastForward = () => {
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
  };

  return (
    <div
      className={`vhs-container ${effectsReduced ? 'effects-reduced' : ''} ${isEjected ? 'ejected' : ''} ${isReopening ? 'reopening' : ''}`}
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

      {/* Timestamp */}
      <div className="vhs-timestamp">{formatTimestamp(timestamp)}</div>

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
      <div className="vhs-nav">
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
    </div>
  );
};

export default VHSContainer;
