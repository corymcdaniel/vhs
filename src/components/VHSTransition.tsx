import React, { useRef, useCallback } from 'react';
import './VHSTransition.css';

interface VHSTransitionProps {
  onTransitionTrigger: (triggerFn: (callback: () => void) => void) => void;
}

const VHSTransition: React.FC<VHSTransitionProps> = ({ onTransitionTrigger }) => {
  const transitionRef = useRef<HTMLDivElement>(null);
  const activeTimers = useRef<Set<NodeJS.Timeout>>(new Set());

  const triggerTransition = useCallback((onPeak: () => void) => {
    if (!transitionRef.current) return;

    const element = transitionRef.current;

    // Clear any existing timers
    activeTimers.current.forEach(timer => clearTimeout(timer));
    activeTimers.current.clear();

    console.log('🔥 Starting VHS transition effect');

    // Phase 1: Heavy static and distortion
    element.className = 'vhs-transition phase-1';
    element.style.opacity = '1';

    // Phase 2: Peak distortion - trigger background change
    const timer1 = setTimeout(() => {
      element.className = 'vhs-transition phase-2';
      console.log('📺 Peak distortion - changing background');
      onPeak(); // Change background at peak distortion
    }, 200);
    activeTimers.current.add(timer1);

    // Phase 3: Gradual recovery
    const timer2 = setTimeout(() => {
      element.className = 'vhs-transition phase-3';
    }, 400);
    activeTimers.current.add(timer2);

    // Phase 4: Return to normal
    const timer3 = setTimeout(() => {
      element.style.opacity = '0';
      element.className = 'vhs-transition';
      console.log('✅ VHS transition complete');
    }, 800);
    activeTimers.current.add(timer3);
  }, []);

  // Expose the trigger function to parent
  React.useEffect(() => {
    onTransitionTrigger(triggerTransition);
  }, [onTransitionTrigger, triggerTransition]);

  // Cleanup on unmount
  React.useEffect(() => {
    const currentTimers = activeTimers.current;
    return () => {
      currentTimers.forEach(timer => clearTimeout(timer));
      currentTimers.clear();
    };
  }, []);

  return (
    <div
      ref={transitionRef}
      className="vhs-transition"
      style={{ opacity: 0 }}
    />
  );
};

export default VHSTransition;