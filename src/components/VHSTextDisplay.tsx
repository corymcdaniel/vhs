import React from 'react';

interface VHSTextDisplayProps {
  displayTexts: string[];
  originalTexts: string[]; // Full original text lines for key matching
  scrambledTexts: string[];
  isTextScrambled: boolean;
  currentLineIndex: number;
  isComplete: boolean;
  textElementRef: React.RefObject<HTMLDivElement | null>;
  showContactButton: boolean;
  onContactClick: () => void;
  onEjectClick: () => void;
  isEjected: boolean;
  cyclingCharacters: {[key: string]: string};
}

const VHSTextDisplay: React.FC<VHSTextDisplayProps> = ({
  displayTexts,
  originalTexts,
  scrambledTexts,
  isTextScrambled,
  currentLineIndex,
  isComplete,
  textElementRef,
  showContactButton,
  onContactClick,
  onEjectClick,
  isEjected,
  cyclingCharacters
}) => {

  // Helper function to render text with cycling character overlays and word flashes
  const renderTextWithOverlay = (text: string, lineIndex: number) => {
    const originalText = originalTexts[lineIndex]; // Get the full original text for this line

    // During scramble, use the full original text length, otherwise use display text
    const textToRender = isTextScrambled ? originalText : text;
    const chars = textToRender.split('');
    const result: React.JSX.Element[] = [];

    // Check for word-level flashes (Japanese replacements)
    const wordFlashKeys = Object.keys(cyclingCharacters).filter(key => key.includes('-word-'));

    for (let charIndex = 0; charIndex < chars.length; charIndex++) {
      const char = chars[charIndex];
      let isPartOfWordFlash = false;

      // Check if this character is part of a word flash (only for non-scrambled text)
      if (!isTextScrambled) {
        for (const wordKey of wordFlashKeys) {
          if (wordKey.startsWith(originalText)) {
            const match = wordKey.match(/-word-(\d+)-(\d+)$/);
            if (match) {
              const start = parseInt(match[1]);
              const end = parseInt(match[2]);

              if (charIndex >= start && charIndex <= end) {
                isPartOfWordFlash = true;

                // Only render the Japanese text at the start position, hide original chars
                if (charIndex === start) {
                  const japaneseText = cyclingCharacters[wordKey];
                  // Calculate how many English characters to hide
                  const replacedChars = textToRender.substring(start, end + 1);
                  result.push(
                    <span key={`word-${charIndex}`} style={{ position: 'relative', display: 'inline-block', minWidth: `${replacedChars.length * 0.6}em` }}>
                      <span style={{ visibility: 'hidden' }}>{replacedChars}</span>
                      <span className="japanese-flash">
                        {japaneseText}
                      </span>
                    </span>
                  );
                }
                break;
              }
            }
          }
        }
      }

      // If not part of word flash, check for character-level cycling
      if (!isPartOfWordFlash) {
        // Use original full text for key, not the partial display text
        const charKey = `${originalText}-${charIndex}`;
        const cyclingChar = cyclingCharacters[charKey];

        if (cyclingChar) {
          // During text scramble (chaos), render directly without positioning/overlay
          if (isTextScrambled) {
            result.push(
              <span key={charIndex} className="cycling-char">
                {cyclingChar}
              </span>
            );
          } else {
            // For phonetic flashes, use overlay with positioning
            // Check if this is a random character flash (shorter animation)
            const isRandomFlash = !wordFlashKeys.some(key => {
              if (key.startsWith(originalText)) {
                const match = key.match(/-word-(\d+)-(\d+)$/);
                if (match) {
                  const start = parseInt(match[1]);
                  const end = parseInt(match[2]);
                  return charIndex >= start && charIndex <= end;
                }
              }
              return false;
            });

            result.push(
              <span key={charIndex} style={{ position: 'relative', display: 'inline-block', minWidth: '0.6em' }}>
                <span style={{ visibility: 'hidden' }}>{char}</span>
                <span
                  className={isRandomFlash ? "random-char-flash" : "cycling-char"}
                >
                  {cyclingChar}
                </span>
              </span>
            );
          }
        } else {
          result.push(<span key={charIndex}>{char}</span>);
        }
      }
    }

    return result;
  };

  return (
    <div className="vhs-text chromatic" ref={textElementRef}>
      {displayTexts.map((text, index) => {
        // Always use the normal typewriter text as base
        const isVisible = index <= currentLineIndex;
        const opacity = isVisible ? 1 : 0;
        const isCurrentLine = index === currentLineIndex && !isComplete;
        const lineClass = `line ${isCurrentLine ? 'typing' : ''}`;

        return (
          <span key={index} className={lineClass} style={{ opacity }}>
            {isTextScrambled || Object.keys(cyclingCharacters).length > 0 ? renderTextWithOverlay(text, index) : text}
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