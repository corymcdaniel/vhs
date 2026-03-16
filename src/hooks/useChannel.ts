import { useState, useCallback } from 'react';

// Channel is any number; named stops are 2, 3, 3.5, 4, 13, 14.
// 15+ are valid horror channels reachable only by dial.
export type Channel = number;

// Channels reachable via keyboard — 3.5 is dial-only
const CHANNEL_ORDER: Channel[] = [2, 3, 4, 6];

export function useChannel() {
  const [channel, setChannel] = useState<Channel>(3);

  const switchChannel = useCallback((newChannel: Channel) => {
    setChannel(newChannel);
  }, []);

  const nextChannel = useCallback(() => {
    setChannel(prev => {
      const above = CHANNEL_ORDER.find(ch => ch >= prev) ?? CHANNEL_ORDER[CHANNEL_ORDER.length - 1];
      // If we're between named channels (e.g. 3.5), jump to the one just above
      if (above > prev) return above;
      // Otherwise advance past the current named stop
      const idx = CHANNEL_ORDER.indexOf(above);
      return idx < CHANNEL_ORDER.length - 1 ? CHANNEL_ORDER[idx + 1] : prev;
    });
  }, []);

  const prevChannel = useCallback(() => {
    setChannel(prev => {
      const below = [...CHANNEL_ORDER].reverse().find(ch => ch <= prev) ?? CHANNEL_ORDER[0];
      // If we're between named channels, jump to the one just below
      if (below < prev) return below;
      // Otherwise step back from the current named stop
      const idx = CHANNEL_ORDER.indexOf(below);
      return idx > 0 ? CHANNEL_ORDER[idx - 1] : prev;
    });
  }, []);

  return { channel, switchChannel, nextChannel, prevChannel };
}
