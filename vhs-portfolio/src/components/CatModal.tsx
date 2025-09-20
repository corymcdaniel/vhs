import React, { useEffect } from 'react';
import './CatModal.css';

interface CatModalProps {
  catName: string;
  onClose: () => void;
}

const CatModal: React.FC<CatModalProps> = ({ catName, onClose }) => {
  const catData = {
    charlie: {
      name: 'Charlie',
      image: '/cats/charlie.jpg'
    },
    papago: {
      name: 'Papago',
      image: '/cats/papago.jpg'
    }
  };

  const cat = catData[catName.toLowerCase() as keyof typeof catData];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!cat) {
    console.error(`Cat data not found for: ${catName}`);
    return null;
  }

  return (
    <div className="cat-modal" onClick={handleBackdropClick}>
      <div className="cat-modal-content">
        <div className="cat-modal-static"></div>
        <div className="cat-modal-scanlines"></div>
        <button className="cat-modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="cat-modal-header">
          <span className="cat-name">{cat.name}</span>
          <span className="cat-modal-timestamp">VHS 01:23:45</span>
        </div>
        <div className="cat-modal-body">
          <img src={cat.image} alt={cat.name} />
        </div>
      </div>
    </div>
  );
};

export default CatModal;