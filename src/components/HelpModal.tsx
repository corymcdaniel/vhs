import React, { useEffect } from 'react';
import './ContactModal.css'; // Reuse the same modal styling
import './HelpModal.css'; // Custom help modal styles
import './ConsentBanner.css';
import HelpContent from './HelpContent';
import { analyticsAvailable, openConsent } from '../utils/analytics';

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
          <HelpContent
            onAboutClick={() => {
              onClose();
              // Will trigger AboutModal
              if ((window as any).openAboutModal) {
                (window as any).openAboutModal();
              }
            }}
          />

          {analyticsAvailable() && (
            <button
              type="button"
              className="consent-settings-link"
              onClick={() => {
                onClose();
                openConsent();
              }}
            >
              Analytics settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
