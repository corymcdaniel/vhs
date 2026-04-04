import React from 'react';

interface VHSControlPanelProps {
  isPaused: boolean;
  isEjected: boolean;
  onPause: () => void;
  onFastForward: () => void;
  onReopen: () => void;
  onPhotoGalleryClick: () => void;
  onBlogClick: () => void;
}

const VHSControlPanel: React.FC<VHSControlPanelProps> = ({
  isPaused,
  isEjected,
  onPause,
  onFastForward,
  onReopen,
  onPhotoGalleryClick,
  onBlogClick,
}) => {
  return (
    <>
      {/* Left Side Controls */}
      <div className="control-buttons-left">
        <button className="blog-btn" onClick={onBlogClick}>
          BLOG
        </button>

        <button className="photo-gallery-btn" onClick={onPhotoGalleryClick}>
          PHOTO GALLERY
        </button>
      </div>

      {/* Right Side Controls */}
      <div className="control-buttons-right">
        <button className="pause-btn" onClick={onPause}>
          {isPaused ? '▶ PLAY' : '⏸ PAUSE'}
        </button>

        <button className="fast-forward-btn" onClick={onFastForward}>
          {'>> FF'}
        </button>
      </div>
    </>
  );
};

export default VHSControlPanel;
