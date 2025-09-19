import React, { useState } from 'react';
import './App.css';
import VHSContainer from './components/VHSContainer';
import CatModal from './components/CatModal';

function App() {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [effectsReduced, setEffectsReduced] = useState(false);

  const handleCatClick = (catName: string) => {
    console.log(`🐱 Cat clicked: ${catName}`);
    setSelectedCat(catName);
  };

  const handleCloseModal = () => {
    setSelectedCat(null);
  };

  const toggleEffects = () => {
    setEffectsReduced(!effectsReduced);
    console.log(`✅ Effects ${!effectsReduced ? 'reduced' : 'restored'}`);
  };

  return (
    <div className="App">
      <VHSContainer
        effectsReduced={effectsReduced}
        onCatClick={handleCatClick}
        onToggleEffects={toggleEffects}
      />

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
