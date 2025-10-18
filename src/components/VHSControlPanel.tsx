import React from 'react';

interface VHSControlPanelProps {
  effectsReduced: boolean;
  isPaused: boolean;
  isEjected: boolean;
  onToggleEffects: () => void;
  onPause: () => void;
  onFastForward: () => void;
  onReopen: () => void;
  onPhotoGalleryClick: () => void;
}

const VHSControlPanel: React.FC<VHSControlPanelProps> = ({
  effectsReduced,
  isPaused,
  isEjected,
  onToggleEffects,
  onPause,
  onFastForward,
  onReopen,
  onPhotoGalleryClick
}) => {
  return (
    <>
      {/* Left Side Controls */}
      <div className="control-buttons-left">
        <button className="toggle-effects-btn" onClick={onToggleEffects}>
          {effectsReduced ? 'RESTORE EFFECTS' : 'REDUCE EFFECTS'}
        </button>

        <button className="photo-gallery-btn" onClick={onPhotoGalleryClick}>
          PHOTO GALLERY
        </button>
      </div>

      {/* Right Side Controls */}
      <div className="control-buttons-right">
        <button className="pause-btn" onClick={onPause}>
          {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
        </button>

        <button className="fast-forward-btn" onClick={onFastForward}>
          {'>> FF'}
        </button>
      </div>
    </>
  );
};

export default VHSControlPanel;
