import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BackgroundManager.css';

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
  const backgroundTimers = useRef<Set<NodeJS.Timeout>>(new Set());

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
    let loadedCount = 0;
    const totalImages = backgroundImages.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        onImagesLoaded(true);
      }
    };

    backgroundImages.forEach((imagePath) => {
      const img = new Image();
      img.onload = checkAllLoaded;
      img.onerror = () => {
        console.error(`Failed to load background image: ${imagePath}`);
        checkAllLoaded(); // Continue even if some images fail
      };
      img.src = imagePath;
    });
  }, [backgroundImages, onImagesLoaded]);

  // VHS transition effect for background changes
  const triggerVHSTransition = useCallback((onPeak: () => void) => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Clear any existing timers
    backgroundTimers.current.forEach(timer => clearTimeout(timer));
    backgroundTimers.current.clear();

    // Phase 1: Heavy static and distortion
    container.style.filter = `
      contrast(5)
      brightness(0.05)
      saturate(0.01)
      sepia(1.0)
      hue-rotate(${Math.random() * 360}deg)
      blur(4px)
    `;
    container.style.transform = `translateX(${Math.random() * 50 - 25}px) skewX(${Math.random() * 10 - 5}deg)`;

    // Phase 2: Peak distortion - trigger background change
    const timer1 = setTimeout(() => {
      container.style.filter = `
        contrast(8)
        brightness(0.02)
        saturate(0.005)
        sepia(1.0)
        hue-rotate(${Math.random() * 360}deg)
        blur(8px)
      `;
      container.style.transform = `translateX(${Math.random() * 80 - 40}px) skewX(${Math.random() * 15 - 7.5}deg)`;

      // Change background at peak distortion
      onPeak();
    }, 200);
    backgroundTimers.current.add(timer1);

    // Phase 3: Gradual recovery
    const timer2 = setTimeout(() => {
      container.style.filter = `
        contrast(3)
        brightness(0.1)
        saturate(0.02)
        sepia(0.8)
        hue-rotate(${Math.random() * 180}deg)
        blur(2px)
      `;
      container.style.transform = `translateX(${Math.random() * 20 - 10}px) skewX(${Math.random() * 5 - 2.5}deg)`;
    }, 400);
    backgroundTimers.current.add(timer2);

    // Phase 4: Return to normal
    const timer3 = setTimeout(() => {
      container.style.filter = '';
      container.style.transform = '';
    }, 800);
    backgroundTimers.current.add(timer3);
  }, []);

  // Change to next background image
  const changeBackground = useCallback(() => {
    if (!containerRef.current) return;

    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const newBackground = backgroundImages[nextIndex];

    triggerVHSTransition(() => {
      if (containerRef.current) {
        containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${newBackground}')`;
        setCurrentImageIndex(nextIndex);
        console.log(`📺 Background changed to: ${newBackground}`);
      }
    });
  }, [currentImageIndex, backgroundImages, triggerVHSTransition]);

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
    const currentBackgroundTimers = backgroundTimers.current;
    const currentCycleTimer = cycleTimerRef.current;

    return () => {
      currentBackgroundTimers.forEach(timer => clearTimeout(timer));
      currentBackgroundTimers.clear();
      if (currentCycleTimer) {
        clearInterval(currentCycleTimer);
      }
    };
  }, []);

  // Set initial background with gradient overlay
  useEffect(() => {
    if (containerRef.current && backgroundImages.length > 0) {
      containerRef.current.style.backgroundImage = `linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7)), url('${backgroundImages[0]}')`;
    }
  }, [backgroundImages]);

  // Expose manual change function to parent (for keyboard shortcuts)
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

export default BackgroundManager;