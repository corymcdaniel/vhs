import React from 'react';
import VHSHelpBox from './VHSHelpBox';

interface VHSTopNavBarProps {
  isEjected: boolean;
  onHelpClick: () => void;
  onReopen: () => void;
}

const VHSTopNavBar: React.FC<VHSTopNavBarProps> = ({
  isEjected,
  onHelpClick,
  onReopen
}) => {
  return (
    <div className="top-button-container">
      <VHSHelpBox onHelpClick={onHelpClick} />
      {isEjected && (
        <button className="reopen-icon" onClick={onReopen} aria-label="re-open">
          ⏏
        </button>
      )}
    </div>
  );
};

export default VHSTopNavBar;