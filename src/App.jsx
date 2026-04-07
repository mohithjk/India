import React, { useState } from 'react';
import IndiaMap from './components/IndiaMap';
import VirtualTour from './components/VirtualTour';
import StoryMode from './components/StoryMode/StoryMode';

function App() {
  const [currentView, setCurrentView] = useState('map'); // 'map' | 'story' | 'tour'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [flipTrigger, setFlipTrigger] = useState(null);

  const handleSelectState = (stateName, element) => {
    setSelectedLocation(stateName);
    setFlipTrigger(element);
    setCurrentView('story'); // Transition to the new 'Full Cinematic' story mode
  };

  const handleBackToMap = () => {
    setSelectedLocation(null);
    setFlipTrigger(null);
    setCurrentView('map');
  };

  if (currentView === 'story') {
    return (
      <StoryMode 
        location={selectedLocation} 
        flipTrigger={flipTrigger}
        onBack={handleBackToMap} 
      />
    );
  }

  if (currentView === 'tour') {
    return (
      <VirtualTour 
        location={selectedLocation} 
        onBack={handleBackToMap} 
      />
    );
  }

  return (
    <div className="min-h-screen relative bg-[#020202] flex flex-col items-center">
      {/* Immersive background aura */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Header section */}
      <header className="relative w-full p-8 pt-12 flex flex-col items-center z-30 select-none text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white/90 drop-shadow-md mb-2 uppercase">
          Discover India
        </h1>
        <p className="text-gray-400 font-medium tracking-wide max-w-xl text-sm md:text-base">
          Click any region to immerse yourself in a virtual tour.
        </p>
      </header>

      {/* Main Map Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center relative z-20 pb-12">
        <IndiaMap onSelectState={handleSelectState} />
      </main>

    </div>
  );
}

export default App;
