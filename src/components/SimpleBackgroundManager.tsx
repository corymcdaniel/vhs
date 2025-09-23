import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BackgroundManager.css';

interface SimpleBackgroundManagerProps {
  onImagesLoaded: (loaded: boolean) => void;
  isEjected: boolean;
  isPaused: boolean;
}

const SimpleBackgroundManager: React.FC<SimpleBackgroundManagerProps> = ({
  onImagesLoaded,
  isEjected,
  isPaused
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundImages = useRef([
    '/bg/20250906_194829.jpg',
    '/bg/20250312_095352.jpg',
    '/bg/20250315_152239.jpg',
    '/bg/20250329_180257.jpg',
    '/bg/20250502_152600.jpg',
    '/bg/20250502_152748~2.jpg',
    '/bg/20250814_204013-EDIT (2).jpg',
    '/bg/20250906_201009.jpg',
    '/bg/20250908_200811.jpg',
    '/bg/20230305_160446.jpg',
    '/bg/20230305_194111.jpg',
    '/bg/20230310_113926.jpg',
    '/bg/20230310_170323.jpg',
    '/bg/20230311_114327~2.jpg',
    '/bg/20230415_091146.jpg',
    '/bg/20230603_095027~2.jpg',
    '/bg/20231214_174753.jpg',
    '/bg/20231220_091305.jpg',
    '/bg/20231222_135934.jpg',
    '/bg/20231224_132745.jpg',
    '/bg/20240309_174427.jpg',
    '/bg/20240601_192412.jpg',
    '/bg/20240704_201604.jpg',
    '/bg/20240805_191606.jpg',
    '/bg/20241227_162337.jpg',
    '/bg/20250104_150527-EDIT.jpg',
    '/bg/20250329_172513.jpg',
    '/bg/bg.jpg'
  ]).current;

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
  }, [onImagesLoaded, backgroundImages]);

  // VHS background change with authentic static flash effect
  const changeBackground = useCallback(() => {
    if (!containerRef.current) return;

    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const newBackground = backgroundImages[nextIndex];

    console.log(`🔄 Changing background to: ${newBackground}`);

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
        }, 800); // Match the CSS animation duration
      }
    }, 200);
  }, [currentImageIndex, backgroundImages]);

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

    // Start background cycling every 15 seconds
    cycleTimerRef.current = setInterval(() => {
      changeBackground();
    }, 15000);

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