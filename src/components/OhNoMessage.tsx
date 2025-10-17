import { useEffect, useState } from 'react';

interface OhNoMessageProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const useOhNoMessage = ({ isActive, onComplete }: OhNoMessageProps): boolean => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowMessage(false);
      return;
    }

    console.log('😰 "oh no...." sequence started');

    // Show message after 300ms delay
    const showTimer = setTimeout(() => {
      setShowMessage(true);
      console.log('😰 "oh no...." message appeared');
    }, 300);

    // Hide message after 30 seconds total (let it persist longer)
    const hideTimer = setTimeout(() => {
      setShowMessage(false);
      console.log('😰 "oh no...." message ended after 30 seconds');
      onComplete?.();
    }, 30000);

    // Cleanup
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      setShowMessage(false);
    };
  }, [isActive, onComplete]);

  return showMessage;
};