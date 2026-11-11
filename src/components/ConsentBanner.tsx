import React, { useEffect, useRef, useState } from 'react';
import './ConsentBanner.css';
import { analyticsAvailable, choose, getChoice, onOpenConsent } from '../utils/analytics';

// Asks once before any analytics load, styled like the VCR's on-screen display.
// Only shows on the live site; the Help modal can reopen it.
const ConsentBanner: React.FC = () => {
  // Ask only until the visitor answers; the saved choice carries over to future visits
  const [open, setOpen] = useState(() => analyticsAvailable() && getChoice() === null);
  // Opened from Help's "Analytics settings": show the current choice and what each button does,
  // and move focus here (the first-visit banner leaves the keyboard on the TV)
  const [fromSettings, setFromSettings] = useState(false);
  const recRef = useRef<HTMLButtonElement>(null);

  useEffect(() => onOpenConsent(() => {
    if (!analyticsAvailable()) return;
    setFromSettings(true);
    setOpen(true);
  }), []);

  useEffect(() => {
    if (open && fromSettings) recRef.current?.focus({ preventScroll: true });
  }, [open, fromSettings]);

  if (!open) return null;

  // Space and Enter press these buttons rather than triggering the TV's keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') e.stopPropagation();
  };

  const handleChoice = (granted: boolean) => {
    choose(granted);
    setOpen(false);
    setFromSettings(false);
  };

  const choice = getChoice();
  let status = 'Not set';
  if (choice === 'granted') status = '● Recording';
  if (choice === 'denied') status = '■ Stopped';

  return (
    <div className="consent-osd" role="region" aria-label="Analytics" onKeyDown={handleKeyDown}>
      <div className="consent-osd-scanlines" aria-hidden="true"></div>
      <p className="consent-osd-title">Record this visit?</p>
      <p className="consent-osd-text">
        Google Analytics, so I can see which channels people tune to. No ads, no tracking across other sites.
      </p>
      {fromSettings && (
        <>
          <p className="consent-osd-status">
            Now: <span className={`consent-osd-status-value ${choice === 'granted' ? 'is-rec' : ''}`}>{status}</span>
          </p>
          <p className="consent-osd-text consent-osd-detail">
            REC lets Google Analytics count your visits here. STOP turns it off right away and deletes its cookies.
            Your choice is saved in this browser, and you can change it anytime from Help or the REC button up top.
          </p>
        </>
      )}
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
