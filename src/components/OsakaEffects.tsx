import { useEffect, useState } from 'react';

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

    console.log('🔴 OSAKA effects started');

    // Start flickering immediately
    setShowFlash(true);
    console.log('🔴 OSAKA kanji flash started - 5 second duration');

    // Stop flickering and start burn effect after 5 seconds
    const flashTimer = setTimeout(() => {
      setShowFlash(false);
      setShowBurn(true);
      console.log('🔴 OSAKA flickering stopped - switching to burn screen');
    }, 5000);

    // Hide burn effect after 15 seconds total (not 25)
    const burnTimer = setTimeout(() => {
      setShowBurn(false);
      console.log('🔴 OSAKA burn effect ended after 15 seconds total');
      onComplete?.();
    }, 15000);

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