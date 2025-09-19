import React, { useState, useEffect } from 'react';
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

  const backgroundImages = [
    '/backgrounds/20250906_194829.jpg',
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

  console.log('VHS Container - displayTexts:', displayTexts);
  console.log('VHS Container - currentLineIndex:', currentLineIndex);

  // Update timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Background cycling
  useEffect(() => {
    if (!effectsReduced) {
      const interval = setInterval(() => {
        setCurrentBackgroundIndex(prev => (prev + 1) % backgroundImages.length);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [effectsReduced, backgroundImages.length]);

  // Random glitch effects
  useEffect(() => {
    if (!effectsReduced) {
      const glitchInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          const textElement = document.querySelector('.vhs-text');
          if (textElement) {
            const randomX = Math.random() * 4 - 2;
            const randomY = Math.random() * 4 - 2;
            const randomHue = Math.random() * 360;
            const randomContrast = 1 + Math.random() * 0.5;

            (textElement as HTMLElement).style.transform = `translate(${randomX}px, ${randomY}px)`;
            (textElement as HTMLElement).style.filter = `hue-rotate(${randomHue}deg) contrast(${randomContrast})`;

            setTimeout(() => {
              (textElement as HTMLElement).style.transform = 'translate(0, 0)';
              (textElement as HTMLElement).style.filter = '';
            }, 50 + Math.random() * 100);
          }
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
    console.log(`🔗 External link clicked: ${url}`);
    window.open(url, '_blank');
  };

  const handleCatLinkClick = (catName: string) => {
    console.log(`🐱 Cat link clicked: ${catName}`);
    onCatClick(catName);
  };

  const handleContactClick = () => {
    console.log('📧 Contact button clicked');
    setShowContactModal(true);
  };

  const handleContactClose = () => {
    setShowContactModal(false);
  };

  return (
    <div
      className={`vhs-container ${effectsReduced ? 'effects-reduced' : ''}`}
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${backgroundImages[currentBackgroundIndex]}')`
      }}
    >
      {/* VHS Effects */}
      <div className="vhs-scramble"></div>
      <div className="static-overlay"></div>
      <div className="scan-lines"></div>
      <div className="tracking-lines"></div>

      {/* Timestamp */}
      <div className="vhs-timestamp">{formatTimestamp(timestamp)}</div>

      {/* Main Text */}
      <div className="vhs-text chromatic">
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

      <button className="test-btn">TEST GLITCH</button>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={handleContactClose} />
      )}
    </div>
  );
};

export default VHSContainer;
