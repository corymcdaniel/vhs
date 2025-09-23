import React, { useEffect } from 'react';
import './ContactModal.css'; // Reuse the same modal styling
import './HelpModal.css'; // Custom help modal styles

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="contact-modal" onClick={handleBackdropClick}>
      <div className="contact-modal-content">
        <div className="contact-modal-static"></div>
        <div className="contact-modal-scanlines"></div>

        <button className="contact-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="contact-modal-header">
          <h2 className="contact-title">VHS Controls</h2>
        </div>

        <div className="contact-modal-body help-content">
          <div className="help-cta-section">
            <button className="help-about-cta" onClick={() => {
              onClose();
              // Will trigger AboutModal
              if ((window as any).openAboutModal) {
                (window as any).openAboutModal();
              }
            }}>
              📖 WHY I BUILT THIS WEBSITE
            </button>
          </div>

          <h3>Keyboard Controls</h3>
          <ul>
            <li><strong>SPACEBAR</strong> - Change background image</li>
            <li><strong>N</strong> - Next background image</li>
            <li><strong>G</strong> - Text glitch effect</li>
            <li><strong>R</strong> - Reset/reload page</li>
          </ul>

          <h3>Navigation</h3>
          <ul>
            <li><strong>WORK</strong> - View my professional LinkedIn profile</li>
            <li><strong>PHOTOS</strong> - Check out my photography on Instagram</li>
            <li><strong>CHARLIE/PAPAGO</strong> - Meet my cats</li>
            <li><strong>PHOENIX/DESERT</strong> - Learn about where I live</li>
          </ul>

          <h3>VHS Controls</h3>
          <ul>
            <li><strong>⏸ PAUSE</strong> - Pause background cycling</li>
            <li><strong>&gt;&gt; FF</strong> - Fast forward to next background</li>
            <li><strong>⏏ EJECT</strong> - View gallery without text overlay</li>
            <li><strong>REDUCE EFFECTS</strong> - Disable visual effects for accessibility</li>
          </ul>

          <p><em>This is a VHS-themed portfolio showcasing photography and web development work. Navigate using the controls above or click the navigation items as they appear.</em></p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;