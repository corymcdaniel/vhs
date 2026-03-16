import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BackgroundManager.css';
import './VHSContainer.css'; // Import for .static-flash class
import { backgroundImages, channelBackgroundImages } from '../data/backgroundImages';
import { Channel } from '../hooks/useChannel';

interface SimpleBackgroundManagerProps {
  onImagesLoaded: (loaded: boolean) => void;
  isEjected: boolean;
  isPaused: boolean;
  effectsReduced: boolean;
  currentChannel: Channel;
  onAutoEject?: () => void;
}

// Map a channel number to its image pool, falling back to the default pool
function getImagePool(channel: Channel): string[] {
  if (channel === 2) return channelBackgroundImages.ch2.length ? channelBackgroundImages.ch2 : backgroundImages;
  if (channel === 4) return channelBackgroundImages.ch4.length ? channelBackgroundImages.ch4 : backgroundImages;
  if (channel === 6) return channelBackgroundImages.ch6.length ? channelBackgroundImages.ch6 : backgroundImages;
  return backgroundImages; // channels 3 and 3.5
}

function getChannelBgClass(channel: Channel): string {
  if (channel === 2) return 'bg-channel-2';
  if (channel === 4) return 'bg-channel-4';
  if (channel === 6) return 'bg-channel-6';
  return '';
}

const GRADIENT_BY_CHANNEL: { [key: string]: string } = {
  'bg-channel-2': 'linear-gradient(rgba(40, 30, 10, 0.5), rgba(30, 25, 5, 0.5), rgba(20, 15, 0, 0.5))',
  'bg-channel-4': 'linear-gradient(rgba(5, 10, 30, 0.7), rgba(5, 8, 25, 0.7), rgba(3, 5, 20, 0.7))',
  'bg-channel-6': 'linear-gradient(rgba(20, 10, 30, 0.65), rgba(15, 5, 25, 0.65), rgba(10, 0, 20, 0.65))',
  '':             'linear-gradient(rgba(26, 26, 46, 0.7), rgba(22, 33, 62, 0.7), rgba(15, 52, 96, 0.7))',
};

const SimpleBackgroundManager: React.FC<SimpleBackgroundManagerProps> = ({
  onImagesLoaded,
  isEjected,
  isPaused,
  effectsReduced,
  currentChannel,
  onAutoEject,
}) => {
  const [, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTimers = useRef(new Set<NodeJS.Timeout>());
  const currentChannelRef = useRef<Channel>(currentChannel);

  const getGradient = useCallback(() => {
    const cls = getChannelBgClass(currentChannelRef.current);
    return GRADIENT_BY_CHANNEL[cls] ?? GRADIENT_BY_CHANNEL[''];
  }, []);

  const applyBackground = useCallback((imageSrc: string) => {
    if (!containerRef.current) return;
    const gradient = getGradient();
    containerRef.current.style.backgroundImage = `${gradient}, url('${imageSrc}')`;
  }, [getGradient]);

  // Set initial background immediately
  useEffect(() => {
    const pool = getImagePool(currentChannel);
    applyBackground(pool[0]);
    onImagesLoaded(true);

    // Preload remaining images
    pool.slice(1).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [onImagesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // On channel change: reset to index 0 of the new pool
  useEffect(() => {
    currentChannelRef.current = currentChannel;

    // Update the container class
    if (containerRef.current) {
      const allBgClasses = Object.values(GRADIENT_BY_CHANNEL)
        .map((_, i) => Object.keys(GRADIENT_BY_CHANNEL)[i])
        .filter(Boolean);
      containerRef.current.classList.remove(...allBgClasses);
      const cls = getChannelBgClass(currentChannel);
      if (cls) containerRef.current.classList.add(cls);
    }

    const pool = getImagePool(currentChannel);
    setCurrentImageIndex(0);
    applyBackground(pool[0]);

    // Preload the new pool
    pool.slice(1).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [currentChannel, applyBackground]);

  // VHS background change with static flash effect
  const changeBackground = useCallback(() => {
    if (!containerRef.current) return;
    const pool = getImagePool(currentChannelRef.current);

    setCurrentImageIndex(prev => {
      const nextIndex = (prev + 1) % pool.length;
      const newBackground = pool[nextIndex];

      if (effectsReduced) {
        applyBackground(newBackground);
      } else {
        const container = containerRef.current!;
        container.classList.add('static-flash');

        const flashTimer = setTimeout(() => {
          applyBackground(newBackground);

          const cleanupTimer = setTimeout(() => {
            containerRef.current?.classList.remove('static-flash');
            activeTimers.current.delete(cleanupTimer);
          }, 1200);

          activeTimers.current.add(cleanupTimer);
          activeTimers.current.delete(flashTimer);
        }, 200);

        activeTimers.current.add(flashTimer);
      }

      return nextIndex;
    });
  }, [effectsReduced, applyBackground]);

  const changeBackgroundManually = useCallback(() => {
    changeBackground();
  }, [changeBackground]);

  // Background cycling timer
  useEffect(() => {
    if (isPaused) {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      return;
    }

    const firstTimer = setTimeout(() => {
      changeBackground();
      cycleTimerRef.current = setInterval(changeBackground, 10000);
    }, 6000);

    return () => {
      clearTimeout(firstTimer);
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, [isPaused, changeBackground]);

  // Cleanup on unmount
  useEffect(() => {
    const currentCycleTimer = cycleTimerRef.current;
    const currentActiveTimers = activeTimers.current;
    return () => {
      if (currentCycleTimer) clearInterval(currentCycleTimer);
      currentActiveTimers.forEach(timer => clearTimeout(timer));
      currentActiveTimers.clear();
    };
  }, []);

  // Expose manual change function globally
  useEffect(() => {
    (window as any).changeBackgroundManually = changeBackgroundManually;
    return () => {
      delete (window as any).changeBackgroundManually;
    };
  }, [changeBackgroundManually]);

  return (
    <div
      ref={containerRef}
      className={`background-manager ${getChannelBgClass(currentChannel)}`}
    />
  );
};

export default SimpleBackgroundManager;
