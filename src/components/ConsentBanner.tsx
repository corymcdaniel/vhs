import React, { useEffect, useRef, useState } from 'react';
import './ConsentBanner.css';
import { analyticsAvailable, choose, getChoice, onOpenConsent } from '../utils/analytics';

// Asks once before any analytics load, styled like the VCR's on-screen display.
// Only shows on the live site; the Help modal can reopen it.
const ConsentBanner: React.FC = () => {
  // Ask only until the visitor answers; the saved choice carries over to future visits
  const [open, setOpen] = useState(() => analyticsAvailable() && getChoice() === null);
  // Only reopening from Help moves focus here; the first-visit banner leaves the keyboard on the TV
  const [focusOnOpen, setFocusOnOpen] = useState(false);
  const recRef = useRef<HTMLButtonElement>(null);

  useEffect(() => onOpenConsent(() => {
    if (!analyticsAvailable()) return;
    setFocusOnOpen(true);
    setOpen(true);
  }), []);

  useEffect(() => {
    if (open && focusOnOpen) recRef.current?.focus({ preventScroll: true });
  }, [open, focusOnOpen]);

  if (!open) return null;

  // Space and Enter press these buttons rather than triggering the TV's keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
  };

  const handleChoice = (granted: boolean) => {
    choose(granted);
    setOpen(false);
  };

  return (
    <div className="consent-osd" role="region" aria-label="Analytics" onKeyDown={handleKeyDown}>
      <div className="consent-osd-scanlines" aria-hidden="true"></div>
      <p className="consent-osd-title">Record this visit?</p>
      <p className="consent-osd-text">
        Google Analytics, so I can see which channels people tune to. No ads, no tracking across other sites.
      </p>
      <div className="consent-osd-actions">
        <button
          type="button"
          ref={recRef}
          className="consent-osd-btn consent-osd-rec"
          onClick={() => handleChoice(true)}
        >
          <span className="consent-osd-dot" aria-hidden="true">●</span> REC
        </button>
        <button
          type="button"
          className="consent-osd-btn"
          onClick={() => handleChoice(false)}
        >
          <span aria-hidden="true">■</span> STOP
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
