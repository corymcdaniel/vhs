import React from 'react';
import './TrackingLostError.css';

interface TrackingLostErrorProps {
  errorCode?: string;
  message?: string;
  onRetry?: () => void;
}

const TrackingLostError: React.FC<TrackingLostErrorProps> = ({
  errorCode = '404',
  message = 'CONTENT NOT FOUND',
  onRetry
}) => {
  return (
    <div className="tracking-lost-container">
      <div className="tracking-lost-static"></div>
      <div className="tracking-lost-scanlines"></div>

      <div className="tracking-lost-content">
        <div className="tracking-lost-bars">
          <div className="tracking-bar"></div>
          <div className="tracking-bar"></div>
          <div className="tracking-bar"></div>
          <div className="tracking-bar"></div>
          <div className="tracking-bar"></div>
        </div>

        <div className="tracking-lost-message">
          <div className="error-code">{errorCode}</div>
          <div className="error-text">{message}</div>
          <div className="tracking-adjust-text">
            <span className="adjust-icon">⚠</span>
            TRACKING ADJUST
            <span className="adjust-icon">⚠</span>
          </div>
          <div className="error-hint">
            Signal degradation detected
          </div>
        </div>

        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            ⟲ REWIND &amp; RETRY
          </button>
        )}

        <div className="tracking-noise"></div>
      </div>
    </div>
  );
};

export default TrackingLostError;
