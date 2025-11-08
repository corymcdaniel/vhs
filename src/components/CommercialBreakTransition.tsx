import React, { useEffect, useState } from 'react';
import './CommercialBreakTransition.css';

interface CommercialBreakTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  type?: 'static' | 'colorbars';
  duration?: number;
}

const CommercialBreakTransition: React.FC<CommercialBreakTransitionProps> = ({
  isActive,
  onComplete,
  type = 'static',
  duration = 800
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="commercial-break-transition">
      {type === 'static' ? (
        <>
          <div className="commercial-static"></div>
          <div className="commercial-noise"></div>
        </>
      ) : (
        <div className="commercial-colorbars">
          <div className="colorbar colorbar-white"></div>
          <div className="colorbar colorbar-yellow"></div>
          <div className="colorbar colorbar-cyan"></div>
          <div className="colorbar colorbar-green"></div>
          <div className="colorbar colorbar-magenta"></div>
          <div className="colorbar colorbar-red"></div>
          <div className="colorbar colorbar-blue"></div>
          <div className="colorbar colorbar-black"></div>
        </div>
      )}
    </div>
  );
};

export default CommercialBreakTransition;
