import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import VHSContainer from './components/VHSContainer';
import CatModal from './components/CatModal';
import OsakaModal from './components/OsakaModal';
import VHSTapeLoadingIntro from './components/VHSTapeLoadingIntro';
import TubeTVIntro from './components/TubeTVIntro';
import DVDIntro from './components/DVDIntro';
import DVDMenu, { DVDMenuAction } from './components/DVDMenu';
import WorkModal from './components/WorkModal';
import IntroSelector from './components/IntroSelector';
import ConsentBanner from './components/ConsentBanner';
import { useOsakaEffects } from './components/OsakaEffects';
import { useChannel } from './hooks/useChannel';

type IntroVariant = 'vhs' | 'tv' | 'dvd';

function App() {
  const location = useLocation();
  const blogMatch = location.pathname.match(/^\/blog\/?([^/]*)$/);
  const initialBlogOpen = !!blogMatch;
  const initialBlogSlug = blogMatch ? (blogMatch[1] || null) : null;
  // /work skips the intro and lands on Channel 4 with the Work panel open
  const initialWorkOpen = /^\/work\/?$/.test(location.pathname);

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [effectsReduced, setEffectsReduced] = useState(false);
  const [isAutoEjecting, setIsAutoEjecting] = useState(false);
  const [showOsakaModal, setShowOsakaModal] = useState(false);
  const [showIntro, setShowIntro] = useState(!initialWorkOpen);
  const [introVariant, setIntroVariant] = useState<IntroVariant | null>(initialWorkOpen ? 'tv' : null);
  const { channel, switchChannel, nextChannel, prevChannel } = useChannel(initialWorkOpen ? 4 : 3);
  // DVD: the disc intro plays, then the main menu. Picks open over the menu and closing returns to it;
  // only PLAY enters the site.
  const [dvdStage, setDvdStage] = useState<'intro' | 'menu'>('intro');
  const [dvdWorkOpen, setDvdWorkOpen] = useState(false);

  // Stable so the intro's timers aren't reset by unrelated re-renders
  const handleDvdIntroComplete = useCallback(() => setDvdStage('menu'), []);

  const handleDvdSelect = (action: DVDMenuAction) => {
    if (action.type === 'play') setShowIntro(false);
    if (action.type === 'work') setDvdWorkOpen(true);
    if (action.type === 'cat') setSelectedCat(action.name);
    // Links already opened in a new tab from the menu, so the menu stays put
  };

  // Osaka effects at App level so they persist independently
  const { showFlash: showOsakaFlash, showBurn: showOsakaBurn } = useOsakaEffects({
    isActive: isAutoEjecting
  });

  const handleCatClick = (catName: string) => {
    setSelectedCat(catName);
  };

  const handleCloseModal = () => {
    setSelectedCat(null);
  };

  const toggleEffects = () => {
    setEffectsReduced(!effectsReduced);
  };

  const handleAutoEjectStart = () => {
    setIsAutoEjecting(true);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="App">
      {showIntro && introVariant === null && (
        <IntroSelector onSelect={setIntroVariant} />
      )}

      {showIntro && introVariant === 'vhs' && (
        <VHSTapeLoadingIntro onIntroComplete={handleIntroComplete} />
      )}

      {showIntro && introVariant === 'tv' && (
        <TubeTVIntro onIntroComplete={handleIntroComplete} />
      )}

      {showIntro && introVariant === 'dvd' && dvdStage === 'intro' && (
        <DVDIntro onIntroComplete={handleDvdIntroComplete} />
      )}

      {showIntro && introVariant === 'dvd' && dvdStage === 'menu' && (
        <DVDMenu onSelect={handleDvdSelect} overlayOpen={dvdWorkOpen || selectedCat !== null} />
      )}

      {/* WORK picked from the DVD menu: the panel opens over the menu, and closing returns to it */}
      {showIntro && dvdWorkOpen && (
        <WorkModal onClose={() => setDvdWorkOpen(false)} />
      )}

      {!showIntro && (
        <VHSContainer
          skipTypewriter={introVariant === 'tv' || introVariant === 'dvd'}
          effectsReduced={effectsReduced}
          currentChannel={channel}
          onCatClick={handleCatClick}
          onToggleEffects={toggleEffects}
          onAutoEjectStart={handleAutoEjectStart}
          onChannelChange={switchChannel}
          onNextChannel={nextChannel}
          onPrevChannel={prevChannel}
          initialBlogOpen={initialBlogOpen}
          initialBlogSlug={initialBlogSlug}
          initialWorkOpen={initialWorkOpen}
        />
      )}

      {/* Analytics consent shows on every page, intro included, until the visitor answers */}
      <ConsentBanner />

      {/* OSAKA effects at top level - persist independently */}
      {showOsakaFlash && (
        <div
          className="osaka-flash-overlay"
          onClick={() => setShowOsakaModal(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className="osaka-kanji">大阪</div>
        </div>
      )}

      {showOsakaBurn && (
        <div
          className="osaka-burn-overlay"
          onClick={() => setShowOsakaModal(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className="osaka-burn-kanji">大阪</div>
        </div>
      )}

      {selectedCat && (
        <CatModal
          catName={selectedCat}
          onClose={handleCloseModal}
        />
      )}

      {showOsakaModal && (
        <OsakaModal
          onClose={() => setShowOsakaModal(false)}
        />
      )}
    </div>
  );
}

export default App;
