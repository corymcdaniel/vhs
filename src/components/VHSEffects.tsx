import React from 'react';
import './VHSEffects.css';

interface VHSEffectsProps {
  effectsReduced: boolean;
  isPaused: boolean;
}

const VHSEffects: React.FC<VHSEffectsProps> = ({ effectsReduced, isPaused }) => {
  if (effectsReduced) {
    return null; // No effects when reduced
  }

  return (
    <>
      <div className="vhs-scramble"></div>
      <div className="static-overlay"></div>
      <div className="scan-lines"></div>
      <div className="tracking-lines"></div>

      {/* Static Text Overlay for paused state */}
      {isPaused && <div className="static-text-overlay"></div>}
    </>
  );
};

export default VHSEffects;