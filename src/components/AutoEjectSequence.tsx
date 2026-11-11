import { useEffect } from 'react';
import { logger } from '../utils/logger';

interface AutoEjectSequenceProps {
  isActive: boolean;
  onComplete: () => void;
}

// This hook just manages the timing of when auto-eject completes
export const useAutoEjectSequence = ({ isActive, onComplete }: AutoEjectSequenceProps) => {
  useEffect(() => {
    if (!isActive) return;

    logger.log('🎬 Starting dramatic auto-eject sequence');

    // Complete the auto-eject after 5 seconds
    const completeTimer = setTimeout(() => {
      logger.log('🎬 Auto-eject sequence complete - ejected!');
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);
};