import React, { useState, useEffect } from 'react';
import { getChoice, onChoiceChange } from '../utils/analytics';

interface VHSTimestampProps {
  onRecordingClick: () => void;
}

const VHSTimestamp: React.FC<VHSTimestampProps> = ({ onRecordingClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Visitors who picked STOP in the consent banner see the VCR in stop mode instead of REC
  const [stopped, setStopped] = useState(() => getChoice() === 'denied');
  useEffect(() => onChoiceChange(() => setStopped(getChoice() === 'denied')), []);

  const formatCurrentTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
  };

  return (
    <div
      className={`vhs-timestamp ${stopped ? 'is-stopped' : ''}`}
      onClick={onRecordingClick}
      title={stopped ? 'Analytics stopped. Click to change' : 'Analytics settings'}
    >
      <span className={stopped ? 'stop-square' : 'rec-dot'}></span>
      {stopped ? 'STOP' : 'REC'} {formatCurrentTime(currentTime)}
    </div>
  );
};

export default VHSTimestamp;