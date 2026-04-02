import React, { useEffect, useState } from 'react';
import './VHSTapeLoadingIntro.css';

interface VHSTapeLoadingIntroProps {
  onIntroComplete: () => void;
}

const VHSTapeLoadingIntro: React.FC<VHSTapeLoadingIntroProps> = ({ onIntroComplete }) => {
  const [phase, setPhase] = useState<'inserting' | 'tracking' | 'stabilizing' | 'complete'>('inserting');

  useEffect(() => {
    const insertTimer = setTimeout(() => { setPhase('tracking'); }, 2500);
    const trackingTimer = setTimeout(() => { setPhase('stabilizing'); }, 5000);
    const stabilizeTimer = setTimeout(() => { setPhase('complete'); }, 7000);
    const completeTimer = setTimeout(() => { onIntroComplete(); }, 8000);
    return () => {
      clearTimeout(insertTimer);
      clearTimeout(trackingTimer);
      clearTimeout(stabilizeTimer);
      clearTimeout(completeTimer);
    };
  }, [onIntroComplete]);

  return (
    <div className={`vhs-tape-intro ${phase}`}>
      {/* Background VFX layers */}
      <div className="intro-static-layer"></div>
      <div className="intro-tracking-lines"></div>
      <div className="intro-scanlines"></div>
      <div className="intro-chromatic"></div>

      {/* VHS Cassette — drops from above into the slot */}
      <div className="intro-cassette-wrapper">
        <div className="intro-cassette">
          <div className="intro-cassette-corner intro-cassette-corner--tl"></div>
          <div className="intro-cassette-corner intro-cassette-corner--tr"></div>
          <div className="intro-cassette-label">
            <div className="intro-cassette-title">CORYMCDANIEL.DEV</div>
            <div className="intro-cassette-subtitle">gaijin_1986 &middot; T-120 &middot; VHS</div>
          </div>
          <div className="intro-cassette-window">
            <div className="intro-cassette-reel intro-cassette-reel--left"></div>
            <div className="intro-cassette-reel intro-cassette-reel--right"></div>
            <div className="intro-cassette-tape-ribbon"></div>
          </div>
          <div className="intro-cassette-bottom-ridge"></div>
        </div>
      </div>

      {/* VCR Deck — full front-panel */}
      <div className="intro-vcr-deck">

        {/* Header strip: brand | LED display | power LED */}
        <div className="intro-vcr-header">
          <div className="intro-vcr-brand">VHS HI&#8209;FI STEREO</div>
          <div className="intro-vcr-display">
            <span className="intro-vcr-display-text">
              {phase === 'inserting' ? '--:--:--' : '00:00:01'}
            </span>
          </div>
          <div className={`intro-vcr-power-led ${phase !== 'inserting' ? 'active' : ''}`}></div>
        </div>

        {/* Tape window with smoked glass look */}
        <div className="intro-vcr-window-surround">
          <div className="intro-vcr-window">
            <div className="intro-vcr-window-sheen"></div>
            <div className="intro-vcr-reel intro-vcr-reel--left"></div>
            <div className="intro-vcr-reel intro-vcr-reel--right"></div>
          </div>
        </div>

        {/* Slot lip and opening */}
        <div className="intro-vcr-slot-lip"></div>
        <div className="intro-vcr-slot"></div>

        {/* Transport buttons */}
        <div className="intro-vcr-buttons">
          <div className="intro-vcr-button-group">
            <button className="intro-vcr-btn" tabIndex={-1} aria-hidden="true">&#9664;&#9664;</button>
            <button className="intro-vcr-btn intro-vcr-btn--play" tabIndex={-1} aria-hidden="true">&#9654;</button>
            <button className="intro-vcr-btn" tabIndex={-1} aria-hidden="true">&#9646;&#9646;</button>
            <button className="intro-vcr-btn" tabIndex={-1} aria-hidden="true">&#9632;</button>
            <button className="intro-vcr-btn" tabIndex={-1} aria-hidden="true">&#9654;&#9654;</button>
          </div>
          <div className="intro-vcr-button-sep"></div>
          <div className="intro-vcr-button-group">
            <button className="intro-vcr-btn intro-vcr-btn--eject" tabIndex={-1} aria-hidden="true">&#9167;</button>
          </div>
        </div>

        {/* Vent slots */}
        <div className="intro-vcr-vents">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="intro-vcr-vent"></div>
          ))}
        </div>

        {/* Power cord hanging from back-right */}
        <div className="intro-vcr-cord"></div>
      </div>

      {/* Status messages */}
      <div className="intro-status">
        {phase === 'inserting' && (
          <div className="intro-status-text">LOADING TAPE...</div>
        )}
        {phase === 'tracking' && (
          <div className="intro-status-text">ADJUSTING TRACKING...</div>
        )}
        {phase === 'stabilizing' && (
          <div className="intro-status-text">SIGNAL ACQUIRED</div>
        )}
        {phase === 'complete' && (
          <div className="intro-play-prompt">
            <div className="intro-play-symbol">&#9654;</div>
            <div className="intro-play-text">PLAY</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VHSTapeLoadingIntro;
