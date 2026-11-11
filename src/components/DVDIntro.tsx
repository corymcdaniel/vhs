import React, { useEffect, useState } from 'react';
import './DVDIntro.css';

interface DVDIntroProps {
  onIntroComplete: () => void;
}

// A disc rides in on the player's tray, spins up with a rainbow sheen, then hands off to the DVD menu.
// Clicking anywhere skips ahead.
const DVDIntro: React.FC<DVDIntroProps> = ({ onIntroComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 3200);
    const completeTimer = setTimeout(onIntroComplete, 3600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onIntroComplete]);

  return (
    <div
      className={`dvd-intro${fading ? ' fading' : ''}`}
      onClick={onIntroComplete}
      role="presentation"
    >
      <div className="dvd-intro-stage">
        <div className="dvd-intro-tray">
          <div className="dvd-intro-disc">
            <div className="dvd-intro-disc-face">
              <div className="dvd-intro-disc-sheen" />
              <div className="dvd-intro-disc-hub" />
            </div>
          </div>
        </div>
        <div className="dvd-intro-player">
          <span className="dvd-intro-player-light" />
          <span className="dvd-intro-player-display">LOADING</span>
        </div>
      </div>
      <p className="dvd-intro-status">
        LOADING<span className="dvd-intro-dots" aria-hidden="true">...</span>
      </p>
      <p className="dvd-intro-skip">CLICK TO SKIP</p>
    </div>
  );
};

export default DVDIntro;
