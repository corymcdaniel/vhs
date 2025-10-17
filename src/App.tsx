import React, { useState } from 'react';
import './App.css';
import VHSContainer from './components/VHSContainer';
import CatModal from './components/CatModal';
import { useOsakaEffects } from './components/OsakaEffects';

function App() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [effectsReduced, setEffectsReduced] = useState(false);
  const [isAutoEjecting, setIsAutoEjecting] = useState(false);

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
        <div className="osaka-flash-overlay">
          <div className="osaka-kanji">大阪</div>
        </div>
      )}

      {showOsakaBurn && (
        <div className="osaka-burn-overlay">
          <div className="osaka-burn-kanji">大阪</div>
        </div>
      )}

      {selectedCat && (
        <CatModal
          catName={selectedCat}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
