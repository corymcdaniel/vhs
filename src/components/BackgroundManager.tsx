import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BackgroundManager.css';
import VHSTransition from './VHSTransition';
import { backgroundImages } from '../data/backgroundImages';

interface BackgroundManagerProps {
  onImagesLoaded: (loaded: boolean) => void;
  isEjected: boolean;
  isPaused: boolean;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({
  onImagesLoaded,
  isEjected,
  isPaused
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerTransitionRef = useRef<((callback: () => void) => void) | null>(null);


  // Skip preloading for now - just proceed to main site immediately
  useEffect(() => {
    console.log('🚀 BackgroundManager: Skipping image preload - calling onImagesLoaded(true)');
    onImagesLoaded(true);
    console.log('🚀 BackgroundManager: onImagesLoaded(true) called');

    // Set initial background immediately
    if (containerRef.current && backgroundImages.length > 0) {
      const initialBackground = backgroundImages[0];
      containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${initialBackground}')`;
      console.log('🖼️ Initial background set:', initialBackground);
    }
  }, [onImagesLoaded]);

  // Handle transition trigger from VHSTransition component
  const handleTransitionTrigger = useCallback((triggerFn: (callback: () => void) => void) => {
    triggerTransitionRef.current = triggerFn;
  }, []);

  // Change to next background image
  const changeBackground = useCallback(() => {
    if (!containerRef.current || !triggerTransitionRef.current) {
      console.log('⚠️ Cannot change background - missing refs');
      return;
    }

    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const newBackground = backgroundImages[nextIndex];

    console.log(`🔄 Triggering background change to: ${newBackground}`);

    triggerTransitionRef.current(() => {
      if (containerRef.current) {
        containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;
        setCurrentImageIndex(nextIndex);
        console.log(`📺 Background changed to: ${newBackground}`);
      }
    });
  }, [currentImageIndex]);

  // Manual background change (for keyboard shortcut)
  const changeBackgroundManually = useCallback(() => {
    changeBackground();
  }, [changeBackground]);

  // Background cycling timer
  useEffect(() => {
    if (isPaused || isEjected) {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      return;
    }

    // Start first background change after 3 seconds, then every 10 seconds
    const firstTimer = setTimeout(() => {
      changeBackground();
      // Then start regular interval
      cycleTimerRef.current = setInterval(() => {
        changeBackground();
      }, 10000);
    }, 3000);

    return () => {
      clearTimeout(firstTimer);
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
    };
  }, [changeBackground, isPaused, isEjected]);

  // Cleanup on unmount
  useEffect(() => {
    const currentCycleTimer = cycleTimerRef.current;

    return () => {
      if (currentCycleTimer) {
        clearInterval(currentCycleTimer);
      }
    };
  }, []);

  // Expose manual change function to parent (for keyboard shortcuts)
  useEffect(() => {
    (window as any).changeBackgroundManually = changeBackgroundManually;
    return () => {
      delete (window as any).changeBackgroundManually;
    };
  }, [changeBackgroundManually]);

  return (
    <>
      <div
        ref={containerRef}
        className="background-manager"
      />
      <VHSTransition onTransitionTrigger={handleTransitionTrigger} />
    </>
  );
};

export default BackgroundManager;