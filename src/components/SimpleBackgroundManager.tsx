import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BackgroundManager.css';
import './VHSContainer.css'; // Import for .static-flash class
import { backgroundImages } from '../data/backgroundImages';


interface SimpleBackgroundManagerProps {
  onImagesLoaded: (loaded: boolean) => void;
  isEjected: boolean;
  isPaused: boolean;
  effectsReduced: boolean;
  onAutoEject?: () => void;
}

const SimpleBackgroundManager: React.FC<SimpleBackgroundManagerProps> = ({
  onImagesLoaded,
  isEjected,
  isPaused,
  effectsReduced,
  onAutoEject
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTimers = useRef(new Set<NodeJS.Timeout>());

  // Auto-generated background images from /public/bg/ directory
  // No need to manually update - just add images to /public/bg/

  // Set initial background immediately and start site
  useEffect(() => {
    console.log('🚀 SimpleBackgroundManager: Setting initial background immediately');

    // Set initial background right away
    if (containerRef.current) {
      const initialBackground = backgroundImages[0];
      containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${initialBackground}')`;
      console.log('🖼️ Initial background set immediately:', initialBackground);
    }

    // Tell the main component we're ready to start immediately
    onImagesLoaded(true);

    // Preload remaining images in background (non-blocking)
    console.log('📸 Starting background image preload...');
    backgroundImages.slice(1).forEach((imageSrc) => {
      const img = new Image();
      img.onload = () => console.log(`📸 Preloaded: ${imageSrc}`);
      img.onerror = () => console.warn('⚠️ Failed to preload:', imageSrc);
      img.src = imageSrc;
    });
  }, [onImagesLoaded]);

  // VHS background change with authentic static flash effect
  const changeBackground = useCallback(() => {
    if (!containerRef.current) return;

    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const newBackground = backgroundImages[nextIndex];

    console.log(`🔄 Changing background to: ${newBackground}`);

    if (effectsReduced) {
      // Skip static flash effect when effects are reduced - just change immediately
      containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;
      setCurrentImageIndex(nextIndex);
      console.log(`📺 Background changed to: ${newBackground} (effects reduced)`);
    } else {
      // Add proper VHS static flash effect using CSS class
      // NOTE: Uses .static-flash CSS class from VHSContainer.css - DO NOT replace with inline styles!
      const container = containerRef.current;
      container.classList.add('static-flash');

      // Change background after static flash - TRACK ALL TIMERS
      const flashTimer = setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;
          setCurrentImageIndex(nextIndex);
          console.log(`📺 Background changed to: ${newBackground}`);

          // Remove static flash effect - TRACK NESTED TIMER
          const cleanupTimer = setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.classList.remove('static-flash');
            }
            // Clean up this timer from tracking
            activeTimers.current.delete(cleanupTimer);
          }, 1200); // Match the CSS animation duration (--vhs-static-flash-duration)

          activeTimers.current.add(cleanupTimer);
        }
        // Clean up outer timer from tracking
        activeTimers.current.delete(flashTimer);
      }, 200);

      activeTimers.current.add(flashTimer);
    }
  }, [currentImageIndex, effectsReduced]);

  // Manual background change
  const changeBackgroundManually = useCallback(() => {
    changeBackground();
  }, [changeBackground]);

  // Background cycling timer - starts immediately and runs independently
  useEffect(() => {
    console.log('🎬 Setting up background cycling timer');

    // Only stop if user manually pauses or ejects
    if (isPaused || isEjected) {
      console.log('🛑 Cycling paused/ejected:', { isPaused, isEjected });
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      return;
    }

    // Start first background change after 6 seconds, then every 10 seconds
    // This ensures the 4th background (auto-eject trigger) appears around 26s,
    // which is after typewriter completion (~22.5s) + giving time for 5s delay
    console.log('⏰ Starting background cycling - first change in 6 seconds, then every 10 seconds');
    const firstTimer = setTimeout(() => {
      console.log('🔄 First background change triggered');
      changeBackground();

      // Then start regular interval
      cycleTimerRef.current = setInterval(() => {
        console.log('🔄 Regular background change triggered');
        changeBackground();
      }, 10000);
    }, 6000);

    return () => {
      console.log('🧹 Cleaning up background cycling timers');
      clearTimeout(firstTimer);
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
    };
  }, [isPaused, isEjected, changeBackground]);

  // Comprehensive cleanup on unmount
  useEffect(() => {
    const currentCycleTimer = cycleTimerRef.current;
    const currentActiveTimers = activeTimers.current;

    return () => {
      // Clear cycle timer
      if (currentCycleTimer) {
        clearInterval(currentCycleTimer);
      }

      // Clear all tracked timers (flash effects, cleanup timers, etc.)
      currentActiveTimers.forEach(timer => clearTimeout(timer));
      currentActiveTimers.clear();
    };
  }, []);

  // Expose manual change function
  useEffect(() => {
    (window as any).changeBackgroundManually = changeBackgroundManually;
    return () => {
      delete (window as any).changeBackgroundManually;
    };
  }, [changeBackgroundManually]);

  return (
    <div
      ref={containerRef}
      className="background-manager"
    />
  );
};

export default SimpleBackgroundManager;