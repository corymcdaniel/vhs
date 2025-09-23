import React from 'react';

interface VHSLoadingScreenProps {
  loadingStep: number;
}

const VHSLoadingScreen: React.FC<VHSLoadingScreenProps> = ({ loadingStep }) => {
  return (
    <div className="vhs-loading-container">
      <div className="vhs-loading-text">
        {loadingStep >= 1 && <div className="loading-line">VHS TAPE LOADING...</div>}
        {loadingStep >= 2 && <div className="loading-line">PREPARING BACKGROUND IMAGES...</div>}
        {loadingStep >= 3 && <div className="loading-line">MUTING BACKGROUND NOISES...</div>}
        {loadingStep >= 3 && (
          <div className="loading-progress">
            <div className="loading-bar"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VHSLoadingScreen;