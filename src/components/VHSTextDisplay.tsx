import React from 'react';

interface VHSTextDisplayProps {
  displayTexts: string[];
  scrambledTexts: string[];
  isTextScrambled: boolean;
  currentLineIndex: number;
  isComplete: boolean;
  textElementRef: React.RefObject<HTMLDivElement | null>;
  showContactButton: boolean;
  onContactClick: () => void;
  onEjectClick: () => void;
  isEjected: boolean;
}

const VHSTextDisplay: React.FC<VHSTextDisplayProps> = ({
  displayTexts,
  scrambledTexts,
  isTextScrambled,
  currentLineIndex,
  isComplete,
  textElementRef,
  showContactButton,
  onContactClick,
  onEjectClick,
  isEjected
}) => {
  // Use scrambled text during lightning sequence, otherwise use normal text
  const currentTexts = isTextScrambled && scrambledTexts.length > 0 ? scrambledTexts : displayTexts;
  return (
    <div className="vhs-text chromatic" ref={textElementRef}>
      {currentTexts.map((text, index) => {
        // During text scrambling, show all lines at full opacity
        const isVisible = isTextScrambled || index <= currentLineIndex;
        const opacity = isVisible ? 1 : 0;
        const isCurrentLine = index === currentLineIndex && !isComplete && !isTextScrambled;
        const lineClass = `line ${isCurrentLine ? 'typing' : ''}`;

        return (
          <span key={index} className={lineClass} style={{ opacity }}>
            {text}
          </span>
        );
      })}

      {showContactButton && (
        <button
          className="contact-button"
          style={{ animationDelay: '0.5s' }}
          onClick={onContactClick}
        >
          CONTACT ME
        </button>
      )}

      {showContactButton && !isEjected && (
        <button
          className="eject-button"
          style={{ animationDelay: '3.0s' }}
          onClick={onEjectClick}
        >
          ⏏ EJECT
        </button>
      )}
    </div>
  );
};

export default VHSTextDisplay;