import React, { useEffect, useState } from 'react';
import './VHSTapeLoadingIntro.css';

interface VHSTapeLoadingIntroProps {
  onIntroComplete: () => void;
}

const VHSTapeLoadingIntro: React.FC<VHSTapeLoadingIntroProps> = ({ onIntroComplete }) => {
  const [phase, setPhase] = useState<'inserting' | 'tracking' | 'stabilizing' | 'complete'>('inserting');

  useEffect(() => {
    // Phase 1: Tape insertion (2.5s)
    const insertTimer = setTimeout(() => {
      setPhase('tracking');
    }, 2500);

    // Phase 2: Tracking adjustment (2.5s)
    const trackingTimer = setTimeout(() => {
      setPhase('stabilizing');
    }, 5000);

    // Phase 3: Signal stabilization (2s)
    const stabilizeTimer = setTimeout(() => {
      setPhase('complete');
    }, 7000);

    // Complete and fade out (1s fade)
    const completeTimer = setTimeout(() => {
      onIntroComplete();
    }, 8000);

    return () => {
      clearTimeout(insertTimer);
      clearTimeout(trackingTimer);
      clearTimeout(stabilizeTimer);
      clearTimeout(completeTimer);
    };
  }, [onIntroComplete]);

  return (
    <div className={`vhs-tape-intro ${phase}`}>
      {/* VHS Static/Noise Layer */}
      <div className="intro-static-layer"></div>

      {/* Tracking Lines */}
      <div className="intro-tracking-lines"></div>

      {/* Scanlines */}
      <div className="intro-scanlines"></div>

      {/* VHS Tape Visual */}
      <div className="intro-tape-container">
        <div className="intro-tape">
          <div className="intro-tape-label">
            <div className="intro-tape-text">CORYMCDANIEL.DEV</div>
            <div className="intro-tape-subtext">PORTFOLIO_1986.VHS</div>
          </div>
          <div className="intro-tape-reels">
            <div className="intro-reel intro-reel-left"></div>
            <div className="intro-reel intro-reel-right"></div>
          </div>
        </div>
      </div>

      {/* VCR Slot */}
      <div className="intro-vcr-slot"></div>

      {/* Status Messages */}
      <div className="intro-status">
        {phase === 'inserting' && <div className="intro-status-text">LOADING TAPE...</div>}
        {phase === 'tracking' && <div className="intro-status-text">ADJUSTING TRACKING...</div>}
        {phase === 'stabilizing' && <div className="intro-status-text">SIGNAL ACQUIRED</div>}
        {phase === 'complete' && (
          <div className="intro-play-prompt">
            <div className="intro-play-symbol">▶</div>
            <div className="intro-play-text">PLAY</div>
          </div>
        )}
      </div>

      {/* Chromatic aberration overlay */}
      <div className="intro-chromatic"></div>
    </div>
  );
};

export default VHSTapeLoadingIntro;
