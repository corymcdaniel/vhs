import React, { useEffect, useRef, useState } from 'react';
import './VideoModal.css';

interface VideoModalProps {
  onClose: () => void;
  videoId: string;
  title?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ onClose, videoId, title = "VHS Video Player" }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePlayPause = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const message = isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' : '{"event":"command","func":"playVideo","args":""}';
      iframe.contentWindow?.postMessage(message, '*');
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.contentWindow?.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
    }
  };

  const handleFastForward = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.contentWindow?.postMessage('{"event":"command","func":"getCurrentTime","args":""}', '*');
    }
  };

  return (
    <div className="video-modal-backdrop" onClick={handleBackdropClick}>
      <div className="video-modal-content">
        <div className="video-modal-static"></div>
        <div className="video-modal-scanlines"></div>

        <div className="video-modal-header">
          <div className="vhs-player-controls">
            <span className="vhs-label">VHS</span>
            <div className="tape-counter">00:00:00</div>
            <div className="vhs-indicators">
              <span className="play-indicator">▶</span>
              <span className="rec-indicator">●</span>
            </div>
          </div>
          <h2 className="video-title">{title}</h2>
          <button className="video-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="video-modal-body">
          <div className="video-container">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&color=white&modestbranding=1&enablejsapi=1`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            />
          </div>

          <div className="vhs-controls-panel">
            <div className="control-group">
              <button className="vhs-control-btn" onClick={handleRewind} title="Rewind to start">⏮</button>
              <button className="vhs-control-btn" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="vhs-control-btn" onClick={handleFastForward} title="Fast forward">⏭</button>
            </div>
            <div className="volume-control">
              <span>VOL</span>
              <div className="volume-bars">
                <div className="volume-bar active"></div>
                <div className="volume-bar active"></div>
                <div className="volume-bar active"></div>
                <div className="volume-bar"></div>
                <div className="volume-bar"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="video-modal-footer">
          <div className="tape-info">
            <span className="tape-label">ESCAPISM_001.VHS</span>
            <span className="tape-date">REC: 2025.09.23</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;