import React, { useState, useRef, useCallback, useEffect } from 'react';
import './TVDial.css';
import { Channel } from '../hooks/useChannel';

// Rotation angle (degrees) for each named channel stop
const CHANNEL_ANGLES: { [key: number]: number } = {
  2:   -55,
  3:     0,
  3.5:  32,
  4:    65,
  6:   110,
};

// Channels that snap to a fixed angle on release (3.5 floats freely)
const SNAP_CHANNELS = [2, 3, 4, 6];

const MAX_ANGLE = 130;
const MIN_ANGLE = -65;

function angleToChannel(angle: number): Channel {
  if (angle < -25) return 2;
  if (angle < 18)  return 3;
  if (angle < 50)  return 3.5;
  if (angle < 85)  return 4;
  return 6;
}

interface TVDialProps {
  currentChannel: Channel;
  onChannelChange: (channel: Channel) => void;
}

const TVDial: React.FC<TVDialProps> = ({ currentChannel, onChannelChange }) => {
  const [rotation, setRotation] = useState(() => CHANNEL_ANGLES[currentChannel] ?? 0);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(CHANNEL_ANGLES[currentChannel] ?? 0);
  const dragStartRef = useRef<{ mouseAngle: number; dialAngle: number } | null>(null);

  const setRot = useCallback((angle: number) => {
    rotationRef.current = angle;
    setRotation(angle);
  }, []);

  const getAngleFromClient = useCallback((clientX: number, clientY: number): number => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientX - cx, -(clientY - cy)) * 180) / Math.PI;
  }, []);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseAngle: getAngleFromClient(clientX, clientY),
      dialAngle: rotationRef.current,
    };
  }, [getAngleFromClient]);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragStartRef.current) return;
    let delta = getAngleFromClient(clientX, clientY) - dragStartRef.current.mouseAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const newAngle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, dragStartRef.current.dialAngle + delta));
    setRot(newAngle);
    onChannelChange(angleToChannel(newAngle));
  }, [getAngleFromClient, setRot, onChannelChange]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
    const ch = angleToChannel(rotationRef.current);
    if (SNAP_CHANNELS.includes(ch)) {
      setRot(CHANNEL_ANGLES[ch]);
    }
    onChannelChange(ch);
  }, [setRot, onChannelChange]);

  // Mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => updateDrag(e.clientX, e.clientY);
    const onUp = () => endDrag();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, updateDrag, endDrag]);

  // Touch
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, [startDrag]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      updateDrag(t.clientX, t.clientY);
    };
    const onEnd = () => endDrag();
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, updateDrag, endDrag]);

  // Sync knob when channel changes externally (keyboard nav)
  useEffect(() => {
    if (!isDragging && CHANNEL_ANGLES[currentChannel] !== undefined) {
      setRot(CHANNEL_ANGLES[currentChannel]);
    }
  }, [currentChannel, isDragging, setRot]);

  const isHidden = currentChannel === 3.5;
  const displayChannel = isHidden ? '??' : String(currentChannel);

  return (
    <div className={`tv-dial-container${isHidden ? ' channel-hidden' : ''}`}>
      <div className="tv-dial-label">TINT</div>
      <div
        ref={dialRef}
        className={`tv-dial-knob${isDragging ? ' dragging' : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title="Channel Dial — drag to tune"
      >
        <div className="tv-dial-indicator" />
        <div className="tv-dial-grip" />
      </div>
    </div>
  );
};

export default TVDial;
