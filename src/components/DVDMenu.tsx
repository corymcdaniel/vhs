import React, { useEffect, useRef } from 'react';
import './DVDMenu.css';

// What picking a menu item does once the site loads
export type DVDMenuAction =
  | { type: 'play' }
  | { type: 'work' }
  | { type: 'cat'; name: string }
  | { type: 'link'; url: string };

interface DVDMenuItem {
  label: string;
  desc: string;
  action: DVDMenuAction;
}

// The site's nav items, in clockwise order from 12 o'clock
const MENU_ITEMS: DVDMenuItem[] = [
  { label: 'WORK', desc: 'Portfolio', action: { type: 'work' } },
  { label: 'MUSIC', desc: 'Wrong Folks', action: { type: 'link', url: 'https://wrongfolks.com' } },
  { label: 'PHOTOS', desc: 'Instagram', action: { type: 'link', url: 'https://www.instagram.com/corymcdaniel' } },
  { label: 'CHARLIE', desc: '(chow chow)', action: { type: 'cat', name: 'charlie' } },
  { label: 'PAPAGO', desc: '(papachan)', action: { type: 'cat', name: 'papago' } },
  { label: 'PHOENIX', desc: 'Location', action: { type: 'link', url: 'https://www.google.com/maps?q=phoenix' } },
  { label: 'DESERT', desc: 'Garden', action: { type: 'link', url: 'https://dbg.org' } },
];

interface DVDMenuProps {
  onSelect: (action: DVDMenuAction) => void;
  // True while a pick (Work panel, cat modal) is open over the menu
  overlayOpen?: boolean;
}

// A glossy early-2000s DVD main menu. The site's nav items load one by one, clockwise from 12 o'clock,
// around a spinning PLAY disc. Arrow keys move around the ring like a remote; Enter picks.
const DVDMenu: React.FC<DVDMenuProps> = ({ onSelect, overlayOpen = false }) => {
  const ringRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  // The last item picked, so focus goes back to it when its modal closes
  const lastPickedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    playRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!overlayOpen) lastPickedRef.current?.focus({ preventScroll: true });
  }, [overlayOpen]);

  const handleSelect = (action: DVDMenuAction, e: React.MouseEvent<HTMLButtonElement>) => {
    lastPickedRef.current = e.currentTarget;
    // Open links inside the click itself so pop-up blockers allow the new tab
    if (action.type === 'link') window.open(action.url, '_blank', 'noopener');
    onSelect(action);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const buttons = Array.from(ringRef.current?.querySelectorAll<HTMLButtonElement>('.dvd-menu-item') ?? []);
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = current === -1 ? 0 : (current + 1) % buttons.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = current === -1 ? buttons.length - 1 : (current - 1 + buttons.length) % buttons.length;
    if (next === -1) return;

    e.preventDefault();
    e.stopPropagation();
    buttons[next].focus();
  };

  return (
    <div className="dvd-menu" onKeyDown={handleKeyDown}>
      <div className="dvd-menu-bg" aria-hidden="true">
        <div className="dvd-menu-bg-glow" />
        <div className="dvd-menu-bg-rings" />
      </div>

      <header className="dvd-menu-header">
        <p className="dvd-menu-kicker">CORYMCDANIEL.COM</p>
        <h1 className="dvd-menu-title">Main Menu</h1>
      </header>

      <div className="dvd-menu-ring" ref={ringRef}>
        <button
          ref={playRef}
          type="button"
          className="dvd-menu-play"
          onClick={(e) => handleSelect({ type: 'play' }, e)}
          aria-label="Play: enter the site"
        >
          <span className="dvd-menu-play-disc" aria-hidden="true">
            <span className="dvd-menu-play-sheen" />
          </span>
          <span className="dvd-menu-play-label">
            <span aria-hidden="true">▶</span> PLAY
          </span>
        </button>

        {/* Their own wrapper so the CSS position rules count from WORK, not the PLAY button */}
        <div className="dvd-menu-items">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="dvd-menu-item"
              onClick={(e) => handleSelect(item.action, e)}
            >
              <span className="dvd-menu-item-label">{item.label}</span>
              <span className="dvd-menu-item-desc">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="dvd-menu-hint">← → TO SELECT · ENTER TO PLAY</p>
    </div>
  );
};

export default DVDMenu;
