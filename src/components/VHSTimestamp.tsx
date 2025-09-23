import React, { useState, useEffect } from 'react';

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
    <div className="vhs-timestamp" onClick={onRecordingClick}>
      <span className="rec-dot"></span>
      REC {formatCurrentTime(currentTime)}
    </div>
  );
};

export default VHSTimestamp;