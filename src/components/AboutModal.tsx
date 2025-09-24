import React, { useEffect, useState } from 'react';
import './AboutModal.css';
import VideoModal from './VideoModal';
import AboutContent from './AboutContent';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('x9yp2wVWdiU');

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

  return (
    <div className="about-modal-backdrop" onClick={handleBackdropClick}>
      <div className="about-modal-content">
        <div className="about-modal-static"></div>
        <div className="about-modal-scanlines"></div>

        <button className="about-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="about-modal-header">
          <h1 className="about-title">WHY I BUILT THIS WEBSITE</h1>
        </div>

        <div className="about-modal-body">
          <AboutContent
            onVideoClick={(videoId) => {
              setCurrentVideoId(videoId);
              setShowVideoModal(true);
            }}
          />
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <VideoModal
          videoId={currentVideoId}
          title="Escapism"
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </div>
  );
};

export default AboutModal;
