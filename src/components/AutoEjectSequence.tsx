import { useEffect } from 'react';

interface AutoEjectSequenceProps {
  isActive: boolean;
  onComplete: () => void;
}

// This hook just manages the timing of when auto-eject completes
export const useAutoEjectSequence = ({ isActive, onComplete }: AutoEjectSequenceProps) => {
  useEffect(() => {
    if (!isActive) return;

    console.log('🎬 Starting dramatic auto-eject sequence');

    // Complete the auto-eject after 5 seconds
    const completeTimer = setTimeout(() => {
      console.log('🎬 Auto-eject sequence complete - ejected!');
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);
};