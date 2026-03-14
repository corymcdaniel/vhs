import React from 'react';
import TVDial from './TVDial';
import { Channel } from '../hooks/useChannel';

interface VHSControlPanelProps {
  effectsReduced: boolean;
  isPaused: boolean;
  isEjected: boolean;
  currentChannel: Channel;
  onToggleEffects: () => void;
  onPause: () => void;
  onFastForward: () => void;
  onReopen: () => void;
  onPhotoGalleryClick: () => void;
  onChannelChange: (channel: Channel) => void;
}

const VHSControlPanel: React.FC<VHSControlPanelProps> = ({
  effectsReduced,
  isPaused,
  isEjected,
  currentChannel,
  onToggleEffects,
  onPause,
  onFastForward,
  onReopen,
  onPhotoGalleryClick,
  onChannelChange,
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
        <TVDial currentChannel={currentChannel} onChannelChange={onChannelChange} />

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
