import React from 'react';
import VHSHelpBox from './VHSHelpBox';
import TVDial from './TVDial';
import { Channel } from '../hooks/useChannel';

interface VHSTopNavBarProps {
  isEjected: boolean;
  currentChannel: Channel;
  effectsReduced: boolean;
  onHelpClick: () => void;
  onReopen: () => void;
  onChannelChange: (channel: Channel) => void;
  onToggleEffects: () => void;
}

const VHSTopNavBar: React.FC<VHSTopNavBarProps> = ({
  isEjected,
  currentChannel,
  effectsReduced,
  onHelpClick,
  onReopen,
  onChannelChange,
  onToggleEffects,
}) => {
  return (
    <div className="top-button-container">
      <VHSHelpBox onHelpClick={onHelpClick} />
      <button
        className={`fx-button${effectsReduced ? ' fx-button--reduced' : ''}`}
        onClick={onToggleEffects}
        title={effectsReduced ? 'Restore Effects' : 'Reduce Effects'}
      >
        {effectsReduced ? '✓FX' : 'FX'}
      </button>
      <TVDial currentChannel={currentChannel} onChannelChange={onChannelChange} />
      {isEjected && (
        <button className="reopen-icon" onClick={onReopen} aria-label="re-open">
          ⏏
        </button>
      )}
    </div>
  );
};

export default VHSTopNavBar;