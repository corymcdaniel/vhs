import React, { useCallback, useEffect, useState } from 'react';
import './PhotoGalleryModal.css';
import { backgroundImages } from '../data/backgroundImages';

interface PhotoGalleryModalProps {
  onClose: () => void;
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleNext = useCallback(() => {
    setSelectedIndex(prevIndex => {
      if (prevIndex < backgroundImages.length - 1) {
        // Trigger glitch effect
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);

        const newIndex = prevIndex + 1;
        setSelectedImage(backgroundImages[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedIndex(prevIndex => {
      if (prevIndex > 0) {
        // Trigger glitch effect
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);

        const newIndex = prevIndex - 1;
        setSelectedImage(backgroundImages[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }, []);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
          setSelectedIndex(-1);
        } else {
          onClose();
        }
        return;
      }

      // Handle arrow keys (only when image is selected)
      if (selectedImage !== null && selectedIndex >= 0) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevious();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [onClose, selectedImage, selectedIndex, handleNext, handlePrevious]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (selectedImage) {
        setSelectedImage(null);
        setSelectedIndex(-1);
      } else {
        onClose();
      }
    }
  };

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  return (
    <div className="photo-gallery-modal" onClick={handleBackdropClick}>
      <div className="photo-gallery-content">
        <div className="photo-gallery-static"></div>
        <div className="photo-gallery-scanlines"></div>

        <div className="photo-gallery-header">
          <div className="gallery-title">
            <span className="vhs-label">VHS</span>
            <span className="gallery-counter">{backgroundImages.length} PHOTOS</span>
          </div>
          <h2 className="gallery-heading">PHOTO GALLERY</h2>
          <button className="photo-gallery-close" onClick={onClose}>
            ×
          </button>
        </div>

        {selectedImage ? (
          <div className="photo-detail-view">
            <button
              className="photo-nav-btn photo-nav-prev"
              onClick={handlePrevious}
              disabled={selectedIndex === 0}
              style={{ opacity: selectedIndex === 0 ? 0.3 : 1 }}
            >
              ‹
            </button>

            <div className="photo-detail-content" onClick={() => { setSelectedImage(null); setSelectedIndex(-1); }}>
              <img
                src={selectedImage}
                alt={`Gallery item ${selectedIndex + 1} of ${backgroundImages.length}`}
                className={`photo-detail-image ${isGlitching ? 'glitching' : ''}`}
              />
              <div className="photo-detail-info">
                <span className="photo-detail-counter">
                  {selectedIndex + 1} / {backgroundImages.length}
                </span>
                <span className="photo-detail-hint">Click to return to gallery • Use arrow keys to navigate</span>
              </div>
            </div>

            <button
              className="photo-nav-btn photo-nav-next"
              onClick={handleNext}
              disabled={selectedIndex === backgroundImages.length - 1}
              style={{ opacity: selectedIndex === backgroundImages.length - 1 ? 0.3 : 1 }}
            >
              ›
            </button>
          </div>
        ) : (
          <div className="photo-gallery-grid">
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className="photo-gallery-item"
                onClick={() => handleImageClick(image, index)}
              >
                <img src={image} alt={`Gallery item ${index + 1}`} />
                <div className="photo-overlay">
                  <span className="photo-number">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="photo-gallery-footer">
          <div className="tape-info">
            <span className="tape-label">TRAVEL_MEMORIES.VHS</span>
            <span className="tape-date">REC: 2023-2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
