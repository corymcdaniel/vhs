import React, { useEffect, useState } from 'react';
import './TubeTVIntro.css';

interface TubeTVIntroProps {
  onIntroComplete: () => void;
}

const TubeTVIntro: React.FC<TubeTVIntroProps> = ({ onIntroComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2100);
    const completeTimer = setTimeout(onIntroComplete, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onIntroComplete]);

  return (
    <div className={`tube-tv-intro${fading ? ' fading' : ''}`}>
      <div className="tube-tv-beam" />
      <div className="tube-tv-scanlines" />
      <div className="tube-tv-chromatic" />
    </div>
  );
};

export default TubeTVIntro;
