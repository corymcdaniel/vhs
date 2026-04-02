import React, { useState, useCallback } from 'react';
import './TVDial.css';
import { Channel } from '../hooks/useChannel';

const CHANNELS: Channel[] = [2, 3, 3.5, 4, 6];

function formatChannel(ch: Channel): string {
  return String(ch);
}

interface TVDialProps {
  currentChannel: Channel;
  onChannelChange: (channel: Channel) => void;
}

const TVDial: React.FC<TVDialProps> = ({ currentChannel, onChannelChange }) => {
  const [rollKey, setRollKey] = useState(0);
  const [rollDir, setRollDir] = useState<'up' | 'down'>('down');

  const currentIdx = Math.max(0, CHANNELS.indexOf(currentChannel));

  const step = useCallback((dir: 'up' | 'down') => {
    const nextIdx = dir === 'up'
      ? (currentIdx - 1 + CHANNELS.length) % CHANNELS.length
      : (currentIdx + 1) % CHANNELS.length;
    setRollDir(dir);
    setRollKey(k => k + 1);
    onChannelChange(CHANNELS[nextIdx]);
  }, [currentIdx, onChannelChange]);

  const isHidden = currentChannel === 3.5;

  return (
    <div className={`tv-dial-container${isHidden ? ' channel-hidden' : ''}`}>
      <div className="tv-dial-label">ADJ</div>
      <button
        className="tv-adj-arrow"
        onClick={() => step('up')}
        aria-label="previous"
      >▲</button>
      <div className="tv-adj-roller">
        <div
          key={rollKey}
          className={`tv-adj-value tv-adj-roll-${rollDir}`}
        >
          {formatChannel(currentChannel)}
        </div>
      </div>
      <button
        className="tv-adj-arrow"
        onClick={() => step('down')}
        aria-label="next"
      >▼</button>
    </div>
  );
};

export default TVDial;
