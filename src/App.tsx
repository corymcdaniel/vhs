import React, { useState } from 'react';
import './App.css';
import VHSContainer from './components/VHSContainer';
import CatModal from './components/CatModal';
import OsakaModal from './components/OsakaModal';
import { useOsakaEffects } from './components/OsakaEffects';

function App() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [effectsReduced, setEffectsReduced] = useState(false);
  const [isAutoEjecting, setIsAutoEjecting] = useState(false);
  const [showOsakaModal, setShowOsakaModal] = useState(false);

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

  return (
    <div className="App">
      <VHSContainer
        effectsReduced={effectsReduced}
        onCatClick={handleCatClick}
        onToggleEffects={toggleEffects}
        onAutoEjectStart={handleAutoEjectStart}
      />

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
