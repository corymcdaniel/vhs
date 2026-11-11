import { useEffect, useState } from 'react';
import { logger } from '../utils/logger';

interface OsakaEffectsProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface OsakaEffectsState {
  showFlash: boolean;
  showBurn: boolean;
}

export const useOsakaEffects = ({ isActive, onComplete }: OsakaEffectsProps): OsakaEffectsState => {
  const [showFlash, setShowFlash] = useState(false);
  const [showBurn, setShowBurn] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowFlash(false);
      setShowBurn(false);
      return;
    }

    logger.log('🔴 OSAKA effects started');

    // Start flickering immediately
    setShowFlash(true);
    logger.log('🔴 OSAKA kanji flash started - 5 second duration');

    // Stop flickering and start burn effect after 5 seconds
    const flashTimer = setTimeout(() => {
      setShowFlash(false);
      setShowBurn(true);
      logger.log('🔴 OSAKA flickering stopped - switching to burn screen - will burn for 45 seconds');
    }, 5000);

    // Hide burn effect after 50 seconds total (5s flash + 45s burn)
    const burnTimer = setTimeout(() => {
      setShowBurn(false);
      logger.log('🔴 OSAKA burn effect ended after 50 seconds total');
      onComplete?.();
    }, 50000);

    // Cleanup
    return () => {
      clearTimeout(flashTimer);
      clearTimeout(burnTimer);
      setShowFlash(false);
      setShowBurn(false);
    };
  }, [isActive, onComplete]);

  return { showFlash, showBurn };
};