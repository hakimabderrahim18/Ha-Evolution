import React, { useState, useEffect, useContext } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AppProvider, AppContext } from './context/AppContext';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import FloatingNav from './components/FloatingNav';
import CinematicIntro from './components/CinematicIntro';
import LevelUpOverlay from './components/LevelUpOverlay';
import AchievementToast from './components/AchievementToast';

import Dashboard from './pages/Dashboard';
import SportPlanner from './pages/SportPlanner';
import MoviesGamingPlanner from './pages/MoviesGamingPlanner';
import LearningPlanner from './pages/LearningPlanner';
import UnifiedCalendar from './pages/UnifiedCalendar';
import EvolutionAnalytics from './pages/EvolutionAnalytics';
import HabitsPlanner from './pages/HabitsPlanner';

import './App.css';

function AppContent() {
  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem('ha_has_entered') === 'true';
  });

  const {
    levelUpData,
    setLevelUpData,
    recentAchievement,
    setRecentAchievement
  } = useContext(AppContext);

  const location = useLocation();

  const handleEnter = () => {
    sessionStorage.setItem('ha_has_entered', 'true');
    setHasEntered(true);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!hasEntered) {
    return <CinematicIntro onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen relative bg-[#0B1220] overflow-x-hidden pb-12">
      {/* Particle Canvas */}
      <ParticleBackground />

      {/* Double ring Custom Cursor */}
      <CustomCursor />

      {/* Floating Dock Navigation */}
      <FloatingNav />

      {/* Route Switchboard with Framer motion exit transitions */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sport" element={<SportPlanner />} />
            <Route path="/entertainment" element={<MoviesGamingPlanner />} />
            <Route path="/learning" element={<LearningPlanner />} />
            <Route path="/calendar" element={<UnifiedCalendar />} />
            <Route path="/analytics" element={<EvolutionAnalytics />} />
            <Route path="/habits" element={<HabitsPlanner />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Level-Up Overlay Dialog Portal */}
      <AnimatePresence>
        {levelUpData && (
          <LevelUpOverlay
            levelData={levelUpData}
            onDismiss={() => setLevelUpData(null)}
          />
        )}
      </AnimatePresence>

      {/* Achievement Unlocked banner toast */}
      <AnimatePresence>
        {recentAchievement && (
          <AchievementToast
            achievement={recentAchievement}
            onDismiss={() => setRecentAchievement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
