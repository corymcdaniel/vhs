import React, { useState } from 'react';
import './HoldForSpecs.css';

interface HoldForSpecsProps {
  // The everyday version, shown by default
  text: string;
  // The detailed, technical version, shown only while the button is held
  specs: string;
  // Class for the paragraphs, so they match the surrounding text (card summary, lede...)
  textClassName: string;
}

// A tape-deck "fast-forward" button: hold it to see the spec-sheet version of the text, let go to go back.
// Both versions share one grid cell, so the card keeps the taller one's height and never jumps.
const HoldForSpecs: React.FC<HoldForSpecsProps> = ({ text, specs, textClassName }) => {
  const [held, setHeld] = useState(false);
  // No tracking flicker on first render, only after the first press
  const [touched, setTouched] = useState(false);

  const press = () => {
    setTouched(true);
    setHeld(true);
  };
  const release = () => setHeld(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Keep getting pointerup even if the finger or mouse drifts off the button
    e.currentTarget.setPointerCapture(e.pointerId);
    press();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      press();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') release();
  };

  return (
    <div className={`hold-specs${held ? ' is-held' : ''}${touched ? ' is-touched' : ''}`}>
      <div className="hold-specs-stack" aria-live="polite">
        <p className={`${textClassName} hold-specs-text hold-specs-casual`} aria-hidden={held}>
          {text}
        </p>
        <p className={`${textClassName} hold-specs-text hold-specs-detail`} aria-hidden={!held}>
          {specs}
        </p>
      </div>
      <button
        type="button"
        className="hold-specs-btn"
        aria-pressed={held}
        aria-label="Hold to show the technical details"
        onPointerDown={handlePointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={release}
        onContextMenu={(e) => e.preventDefault()}
      >
        {!held && <span className="hold-specs-btn-hold">HOLD</span>}
        <span className="hold-specs-btn-ff" aria-hidden="true">▶▶</span>
        <span>SPECS</span>
      </button>
    </div>
  );
};

export default HoldForSpecs;
