import React from 'react';

interface VHSNavigationBarProps {
  showWorkNav: boolean;
  showPhotoNav: boolean;
  showCatsNav: boolean;
  showLocationNav: boolean;
  onLinkClick: (url: string) => void;
  onCatClick: (catName: string) => void;
}

const VHSNavigationBar: React.FC<VHSNavigationBarProps> = ({
  showWorkNav,
  showPhotoNav,
  showCatsNav,
  showLocationNav,
  onLinkClick,
  onCatClick
}) => {
  return (
    <div className={`vhs-nav ${showWorkNav ? 'show' : ''}`}>
      {showWorkNav && (
        <button
          className="vhs-nav-item"
          style={{ animationDelay: '0.2s' }}
          onClick={() => onLinkClick('https://www.linkedin.com/in/corymcdaniel/')}
        >
          <span className="nav-label">WORK</span>
          <span className="nav-desc">LinkedIn</span>
        </button>
      )}

      {showPhotoNav && (
        <button
          className="vhs-nav-item"
          style={{ animationDelay: '0.4s' }}
          onClick={() => onLinkClick('https://www.instagram.com/corymcdaniel')}
        >
          <span className="nav-label">PHOTOS</span>
          <span className="nav-desc">Instagram</span>
        </button>
      )}

      {showCatsNav && (
        <>
          <button
            className="vhs-nav-item cat-nav"
            style={{ animationDelay: '0.6s' }}
            onClick={() => onCatClick('charlie')}
          >
            <span className="nav-label">CHARLIE</span>
            <span className="nav-desc">(chow chow)</span>
          </button>
          <button
            className="vhs-nav-item cat-nav"
            style={{ animationDelay: '0.8s' }}
            onClick={() => onCatClick('papago')}
          >
            <span className="nav-label">PAPAGO</span>
            <span className="nav-desc">(papachan)</span>
          </button>
        </>
      )}

      {showLocationNav && (
        <>
          <button
            className="vhs-nav-item"
            style={{ animationDelay: '1.0s' }}
            onClick={() => onLinkClick('https://www.google.com/maps?q=phoenix')}
          >
            <span className="nav-label">PHOENIX</span>
            <span className="nav-desc">Location</span>
          </button>
          <button
            className="vhs-nav-item"
            style={{ animationDelay: '1.2s' }}
            onClick={() => onLinkClick('https://dbg.org')}
          >
            <span className="nav-label">DESERT</span>
            <span className="nav-desc">Garden</span>
          </button>
        </>
      )}
    </div>
  );
};

export default VHSNavigationBar;