import React from 'react';
import './VCROsd.css';

interface VCROsdProps {
  isPaused: boolean;
}

const VCROsd: React.FC<VCROsdProps> = ({ isPaused }) => {
  if (!isPaused) return null;

  return (
    <div className="vcr-osd">
      <div className="vcr-osd-top-bar"></div>
      <div className="vcr-osd-content">
        <div className="vcr-osd-icon">⏸</div>
        <div className="vcr-osd-text">PAUSE</div>
      </div>
      <div className="vcr-osd-bottom-bar"></div>
      <div className="vcr-osd-scanline"></div>
    </div>
  );
};

export default VCROsd;
