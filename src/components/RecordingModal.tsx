import React, { useEffect } from 'react';
import './RecordingModal.css';

interface RecordingModalProps {
  onClose: () => void;
}

const RecordingModal: React.FC<RecordingModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="recording-modal-overlay" onClick={onClose}>
      <div className="recording-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="recording-modal-header">
          <span className="rec-indicator">
            <span className="rec-dot-large"></span>
            REC STATUS
          </span>
          <button className="recording-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="recording-modal-body">
          <div className="recording-info">
            <h3>RECORDING INDICATOR</h3>
            <p>Don't worry - I'm not actually recording anything!</p>
            <p>Your privacy is safe. As much as you let it be. I can actually help fix that, but really just use a vpn and better browser tool.</p>

            <div className="vhs-details">
              <div className="detail-line">
                <span className="label">STATUS:</span>
                <span className="value">AESTHETIC ONLY</span>
              </div>
              <div className="detail-line">
                <span className="label">DATA RECORDED:</span>
                <span className="value">NONE</span>
              </div>
              <div className="detail-line">
                <span className="label">PURPOSE:</span>
                <span className="value">IT KINDA LOOKS COOL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="recording-modal-footer">
          <button className="recording-modal-ok" onClick={onClose}>
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;
