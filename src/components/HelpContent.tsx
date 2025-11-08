import React from 'react';

interface HelpContentProps {
  onAboutClick: () => void;
}

const HelpContent: React.FC<HelpContentProps> = ({ onAboutClick }) => {
  return (
    <>
      <div className="help-cta-section">
        <button className="help-about-cta" onClick={onAboutClick}>
          WHY I BUILT THIS WEBSITE
        </button>
      </div>

      <h3>Keyboard Controls</h3>
      <ul>
        <li><strong>SPACEBAR</strong> - Change background image</li>
        <li><strong>N</strong> - Next background image</li>
        <li><strong>G</strong> - Text glitch effect</li>
        <li><strong>E</strong> - Dramatic eject sequence</li>
        <li><strong>R</strong> - Reset/reload page</li>
      </ul>

      <h3>Navigation</h3>
      <ul>
        <li><strong>WORK</strong> - My github, but it's mostly private</li>
        <li><strong>PHOTOS</strong> - Check out my photography on Instagram</li>
        <li><strong>CHARLIE/PAPAGO</strong> - Meet my cats</li>
        <li><strong>PHOENIX/DESERT</strong> - Learn about where I live</li>
      </ul>

      <h3>VHS Controls</h3>
      <ul>
        <li><strong>⏸ PAUSE</strong> - Pause background cycling</li>
        <li><strong>&gt;&gt; FF</strong> - Fast forward to next background</li>
        <li><strong>⏏ EJECT</strong> - View gallery without text overlay</li>
        <li><strong>REDUCE EFFECTS</strong> - Disable visual effects for accessibility</li>
      </ul>

      <p><em>I wanted to create something different while only using AI as a director.</em></p>
    </>
  );
};

export default HelpContent;
