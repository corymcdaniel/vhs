import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BackgroundManager.css';
import './VHSContainer.css'; // Import for .static-flash class
import { backgroundImages } from '../data/backgroundImages';


interface SimpleBackgroundManagerProps {
  onImagesLoaded: (loaded: boolean) => void;
  isEjected: boolean;
  isPaused: boolean;
  effectsReduced: boolean;
}

const SimpleBackgroundManager: React.FC<SimpleBackgroundManagerProps> = ({
  onImagesLoaded,
  isEjected,
  isPaused,
  effectsReduced
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-generated background images from /public/bg/ directory
  // No need to manually update - just add images to /public/bg/

  // Preload all background images
  useEffect(() => {
    console.log('🚀 SimpleBackgroundManager: Starting image preload...');

    let loadedCount = 0;
    const totalImages = backgroundImages.length;

    const handleImageLoad = () => {
      loadedCount++;
      console.log(`📸 Loaded ${loadedCount}/${totalImages} images`);

      if (loadedCount === totalImages) {
        console.log('✅ All images preloaded');
        onImagesLoaded(true);

        // Set initial background after all images are loaded
        if (containerRef.current) {
          const initialBackground = backgroundImages[0];
          containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${initialBackground}')`;
          console.log('🖼️ Initial background set:', initialBackground);
        }
      }
    };

    // Preload each image
    backgroundImages.forEach((imageSrc) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = () => {
        console.warn('⚠️ Failed to load:', imageSrc);
        handleImageLoad(); // Count as loaded to prevent hanging
      };
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

      // Change background after static flash
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;
          setCurrentImageIndex(nextIndex);
          console.log(`📺 Background changed to: ${newBackground}`);

          // Remove static flash effect
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.classList.remove('static-flash');
            }
          }, 1200); // Match the CSS animation duration (--vhs-static-flash-duration)
        }
      }, 200);
    }
  }, [currentImageIndex, effectsReduced]);

  // Manual background change
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

    // Start background cycling every 10 seconds
    cycleTimerRef.current = setInterval(() => {
      changeBackground();
    }, 10000);

    return () => {
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