import { useEffect } from 'react';
import { AnimX } from '@animx-jaya/core';
import { HeroSection } from './components/HeroSection';
import { ShowcaseGrid } from './components/ShowcaseGrid';
import { CoreEngineSection, GodModeSection, PracticalUXSection } from './components/PowerSection';
import { IframeSection } from './components/IframeSection';
import { MetricsSection, Footer, CustomCursorDemo } from './components/FooterSections';
import './App.css';

function App() {
  useEffect(() => {
    // NEW v2.0: Global Smooth Page Scrolling — wrapped in try/catch for safety
    try {
      const scroller = AnimX.scroll(document.documentElement).smooth({ intensity: 1.2, damping: 0.1 });
      return () => scroller.stop();
    } catch {
      // smooth() may not be available in older cached builds — graceful degradation
    }
  }, []);

  return (
    <div className="app">
      {/* v2.0 Custom Cursor Engine */}
      <CustomCursorDemo />

      <HeroSection />

      <ShowcaseGrid />

      <div className="power-showcase-container">
        <CoreEngineSection />
        <GodModeSection />
        <PracticalUXSection />
      </div>

      <IframeSection />

      <MetricsSection />

      <Footer />
    </div>
  );
}

export default App;
