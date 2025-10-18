import React from 'react';
import './OsakaModal.css';

interface OsakaModalProps {
  onClose: () => void;
}

const OsakaModal: React.FC<OsakaModalProps> = ({ onClose }) => {
  return (
    <div className="osaka-modal-backdrop" onClick={onClose}>
      <div className="osaka-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="osaka-modal-static"></div>
        <div className="osaka-modal-scanlines"></div>

        <button className="osaka-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="osaka-modal-header">
          <h1 className="osaka-modal-title">大阪</h1>
          <p className="osaka-modal-subtitle">OSAKA</p>
        </div>

        <div className="osaka-modal-body">
          <div className="osaka-content">
            <p className="osaka-intro">
              The "大阪" (Osaka) kanji appears during the auto-eject sequence as a
              playful reference to a classic VHS artifact.
            </p>

            <h2>Why Osaka?</h2>
            <p>
              In the golden age of VHS trading and bootlegging, Japanese recordings often
              featured unique visual artifacts and overlays. The Osaka kanji stamp became
              an iconic marker of authentic Japanese VHS culture.
            </p>

            <h2>The Effect</h2>
            <p>
              During the chaos sequence, the kanji "burns" into the screen like phosphor
              persistence on old CRT displays - a digital recreation of analog authenticity.
            </p>

            <div className="osaka-technical">
              <h3>Technical Details</h3>
              <ul>
                <li>5-second intense flicker phase</li>
                <li>45-second exponential burn-in decay</li>
                <li>Mimics authentic phosphor persistence</li>
                <li>Triggers during auto-eject sequence</li>
              </ul>
            </div>

            <p className="osaka-footer">
              <em>Press 'e' to trigger the eject sequence and see the effect.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OsakaModal;
