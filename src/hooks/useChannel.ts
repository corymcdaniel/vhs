import { useState, useCallback } from 'react';

export type Channel = 2 | 3 | 3.5 | 4;

const CHANNEL_ORDER: Channel[] = [2, 3, 4]; // 3.5 is dial-only

export function useChannel() {
  const [channel, setChannel] = useState<Channel>(3);

  const switchChannel = useCallback((newChannel: Channel) => {
    setChannel(newChannel);
  }, []);

  const nextChannel = useCallback(() => {
    setChannel(prev => {
      const base = prev === 3.5 ? 3 : prev;
      const idx = CHANNEL_ORDER.indexOf(base as 2 | 3 | 4);
      return idx < CHANNEL_ORDER.length - 1 ? CHANNEL_ORDER[idx + 1] : prev;
    });
  }, []);

  const prevChannel = useCallback(() => {
    setChannel(prev => {
      const base = prev === 3.5 ? 3 : prev;
      const idx = CHANNEL_ORDER.indexOf(base as 2 | 3 | 4);
      return idx > 0 ? CHANNEL_ORDER[idx - 1] : prev;
    });
  }, []);

  return { channel, switchChannel, nextChannel, prevChannel };
}
