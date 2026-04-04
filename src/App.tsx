import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import VHSContainer from './components/VHSContainer';
import CatModal from './components/CatModal';
import OsakaModal from './components/OsakaModal';
import VHSTapeLoadingIntro from './components/VHSTapeLoadingIntro';
import { useOsakaEffects } from './components/OsakaEffects';
import { useChannel } from './hooks/useChannel';

function App() {
  const location = useLocation();
  const blogMatch = location.pathname.match(/^\/blog\/?([^/]*)$/);
  const initialBlogOpen = !!blogMatch;
  const initialBlogSlug = blogMatch ? (blogMatch[1] || null) : null;

  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [effectsReduced, setEffectsReduced] = useState(false);
  const [isAutoEjecting, setIsAutoEjecting] = useState(false);
  const [showOsakaModal, setShowOsakaModal] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { channel, switchChannel, nextChannel, prevChannel } = useChannel();

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
      {showIntro && <VHSTapeLoadingIntro onIntroComplete={handleIntroComplete} />}

      {!showIntro && (
        <VHSContainer
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
        />
      )}

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
