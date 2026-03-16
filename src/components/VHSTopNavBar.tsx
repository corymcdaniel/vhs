import React from 'react';
import VHSHelpBox from './VHSHelpBox';
import TVDial from './TVDial';
import { Channel } from '../hooks/useChannel';

interface VHSTopNavBarProps {
  isEjected: boolean;
  currentChannel: Channel;
  onHelpClick: () => void;
  onReopen: () => void;
  onChannelChange: (channel: Channel) => void;
}

const VHSTopNavBar: React.FC<VHSTopNavBarProps> = ({
  isEjected,
  currentChannel,
  onHelpClick,
  onReopen,
  onChannelChange,
}) => {
  return (
    <div className="top-button-container">
      <VHSHelpBox onHelpClick={onHelpClick} />
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