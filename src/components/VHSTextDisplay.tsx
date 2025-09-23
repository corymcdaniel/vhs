import React from 'react';

interface VHSTextDisplayProps {
  displayTexts: string[];
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
  currentLineIndex,
  isComplete,
  textElementRef,
  showContactButton,
  onContactClick,
  onEjectClick,
  isEjected
}) => {
  return (
    <div className="vhs-text chromatic" ref={textElementRef}>
      {displayTexts.map((text, index) => {
        const isVisible = index <= currentLineIndex;
        const opacity = isVisible ? 1 : 0;
        const isCurrentLine = index === currentLineIndex && !isComplete;
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