import React from 'react';

interface VHSHelpBoxProps {
  onHelpClick: () => void;
}

const VHSHelpBox: React.FC<VHSHelpBoxProps> = ({ onHelpClick }) => {
  return (
    <button
      className="help-button"
      onClick={onHelpClick}
    >
      ? HELP
    </button>
  );
};

export default VHSHelpBox;