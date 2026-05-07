import React from 'react';
import './IntroSelector.css';

type IntroVariant = 'vhs' | 'tv';

interface IntroSelectorProps {
  onSelect: (variant: IntroVariant) => void;
}

const IntroSelector: React.FC<IntroSelectorProps> = ({ onSelect }) => {
  return (
    <div className="intro-selector">
      <div className="intro-selector-static" />
      <div className="intro-selector-scanlines" />

      <div className="intro-selector-content">
        <p className="intro-selector-site-name">CORYMCDANIEL.COM</p>
        <h1 className="intro-selector-heading">SELECT EXPERIENCE</h1>
        <p className="intro-selector-subheading">CHOOSE YOUR INTRO SEQUENCE</p>

        <div className="intro-selector-panels">

          {/* VHS Tape option */}
          <button
            className="intro-selector-panel"
            onClick={() => onSelect('vhs')}
            aria-label="VHS Tape intro"
          >
            <div className="intro-panel-icon">
              <div className="selector-cassette">
                <div className="selector-cassette-label">
                  <span>VHS</span>
                </div>
                <div className="selector-cassette-window">
                  <div className="selector-cassette-reel selector-cassette-reel--left" />
                  <div className="selector-cassette-reel selector-cassette-reel--right" />
                  <div className="selector-cassette-ribbon" />
                </div>
                <div className="selector-cassette-base">
                  <div className="selector-cassette-bump" />
                  <div className="selector-cassette-bump" />
                </div>
              </div>
            </div>
            <p className="intro-panel-title">VHS TAPE</p>
            <p className="intro-panel-desc">T&#8209;120 &middot; HI&#8209;FI STEREO</p>
            <span className="intro-panel-cta">&#9632; INSERT TAPE</span>
          </button>

          <div className="intro-selector-divider" />

          {/* Tube TV option */}
          <button
            className="intro-selector-panel"
            onClick={() => onSelect('tv')}
            aria-label="Tube TV intro"
          >
            <div className="intro-panel-icon">
              <div className="selector-tv">
                <div className="selector-tv-antennas">
                  <div className="selector-tv-antenna selector-tv-antenna--left" />
                  <div className="selector-tv-antenna selector-tv-antenna--right" />
                </div>
                <div className="selector-tv-body">
                  <div className="selector-tv-screen">
                    <div className="selector-tv-scanline" />
                  </div>
                  <div className="selector-tv-controls">
                    <div className="selector-tv-knob" />
                    <div className="selector-tv-knob" />
                  </div>
                </div>
                <div className="selector-tv-stand" />
              </div>
            </div>
            <p className="intro-panel-title">TUBE TV</p>
            <p className="intro-panel-desc">INSTANT SIGNAL</p>
            <span className="intro-panel-cta">&#9675; POWER ON</span>
          </button>

        </div>

        <p className="intro-selector-footer">CLICK TO SELECT</p>
      </div>
    </div>
  );
};

export default IntroSelector;
