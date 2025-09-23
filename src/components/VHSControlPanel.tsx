import React from 'react';

interface VHSControlPanelProps {
  effectsReduced: boolean;
  isPaused: boolean;
  isEjected: boolean;
  onToggleEffects: () => void;
  onPause: () => void;
  onFastForward: () => void;
  onReopen: () => void;
}

const VHSControlPanel: React.FC<VHSControlPanelProps> = ({
  effectsReduced,
  isPaused,
  isEjected,
  onToggleEffects,
  onPause,
  onFastForward,
  onReopen
}) => {
  return (
    <>
      {/* Controls */}
      <button className="toggle-effects-btn" onClick={onToggleEffects}>
        {effectsReduced ? 'RESTORE EFFECTS' : 'REDUCE EFFECTS'}
      </button>

      <button className="pause-btn" onClick={onPause}>
        {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
      </button>

      <button className="fast-forward-btn" onClick={onFastForward}>
        {'>> FF'}
      </button>

    </>
  );
};

export default VHSControlPanel;