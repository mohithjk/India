import React, { Suspense, lazy, useState } from 'react';
import IndiaMap from './components/IndiaMap';

const VirtualTour = lazy(() => import('./components/VirtualTour'));
const StoryMode = lazy(() => import('./components/StoryMode/StoryMode'));

const ScreenLoader = () => (
  <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 mx-auto rounded-full border-2 border-white/20 border-t-white animate-spin" />
      <p className="mt-4 text-xs uppercase tracking-[0.35em] text-white/50">
        Loading
      </p>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState('map'); // 'map' | 'story' | 'tour'
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Called from IndiaMap when:
  // 1. A state WITHOUT district data is clicked → go to story with state name
  // 2. A district marker is clicked inside the zoomed state → go to story with district name
  const handleSelectLocation = (locationName) => {
    setSelectedLocation(locationName);
    setCurrentView('story');
  };

  const handleBackToMap = () => {
    setSelectedLocation(null);
    setCurrentView('map');
  };

  if (currentView === 'story') {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <StoryMode
          location={selectedLocation}
          onBack={handleBackToMap}
        />
      </Suspense>
    );
  }

  if (currentView === 'tour') {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <VirtualTour
          location={selectedLocation}
          onBack={handleBackToMap}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen relative bg-[#020202] flex flex-col items-center">
      {/* Immersive background aura */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header section */}
      <header className="relative w-full p-8 pt-12 flex flex-col items-center z-30 select-none text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white/90 drop-shadow-md mb-2 uppercase">
          Discover India
        </h1>
        <p className="text-gray-400 font-medium tracking-wide max-w-xl text-sm md:text-base">
          Hover a state to explore · Click to zoom into its districts
        </p>
      </header>

      {/* Main Map Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center relative z-20 pb-12">
        <IndiaMap onSelectState={handleSelectLocation} />
      </main>
    </div>
  );
}

export default App;
