
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Radio, Clock, Settings, Headphones, Play, Pause, Volume2, MapPin, ShieldCheck, LogIn } from 'lucide-react';
import { View, PrayerTimings, RadioConfig } from './types';
import { DEFAULT_RADIO_CONFIG } from './constants';
import RadioPlayer from './components/RadioPlayer';
import PrayerTimes from './components/PrayerTimes';
import Admin from './components/Admin';

const Navigation = () => {
  const location = useLocation();
  const activeClass = "text-emerald-400 bg-emerald-400/10";
  const inactiveClass = "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800";

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-auto bg-zinc-900/80 backdrop-blur-md border-t lg:border-t-0 lg:border-b border-zinc-800 z-50">
      <div className="max-w-4xl mx-auto px-4 flex justify-around lg:justify-center lg:gap-8 h-16 items-center">
        <Link to="/" className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-4 py-2 rounded-lg transition-all ${location.pathname === '/' ? activeClass : inactiveClass}`}>
          <Radio size={20} />
          <span className="text-xs lg:text-sm font-medium">Direct</span>
        </Link>
        <Link to="/priere" className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-4 py-2 rounded-lg transition-all ${location.pathname === '/priere' ? activeClass : inactiveClass}`}>
          <Clock size={20} />
          <span className="text-xs lg:text-sm font-medium">Prières</span>
        </Link>
        <Link to="/admin" className={`flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-4 py-2 rounded-lg transition-all ${location.pathname === '/admin' ? activeClass : inactiveClass}`}>
          <Settings size={20} />
          <span className="text-xs lg:text-sm font-medium">Admin</span>
        </Link>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [config, setConfig] = useState<RadioConfig>(() => {
    const saved = localStorage.getItem('radio_config');
    return saved ? JSON.parse(saved) : DEFAULT_RADIO_CONFIG;
  });

  const updateConfig = (newConfig: Partial<RadioConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('radio_config', JSON.stringify(updated));
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen pb-20 lg:pb-0 lg:pt-16">
        <Navigation />
        
        <main className="flex-grow max-w-4xl mx-auto w-full p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<RadioPlayer config={config} />} />
            <Route path="/priere" element={<PrayerTimes />} />
            <Route path="/admin" element={<Admin config={config} onUpdate={updateConfig} />} />
          </Routes>
        </main>

        <footer className="text-center py-8 text-zinc-500 text-xs hidden lg:block">
          &copy; {new Date().getFullYear()} {config.stationName} — Développé pour Infomaniak Node.js
        </footer>
      </div>
    </Router>
  );
};

export default App;
