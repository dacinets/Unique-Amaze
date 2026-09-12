/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { scrollEngine } from './utils/scrollEngine';
import { PageRoute, MarketType, StudioTheme } from './types';
import { CustomCursor } from './components/CustomCursor';
import { TelemetryBar } from './components/common/TelemetryBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';
import { ServicesView } from './components/services/ServicesView';
import { WorkView } from './components/work/WorkView';
import { ProcessView } from './components/process/ProcessView';
import { PricingView } from './components/pricing/PricingView';
import { PlannerView } from './components/planner/PlannerView';
import { FaqView } from './components/faq/FaqView';
import { ContactView } from './components/contact/ContactView';
import { AboutView } from './components/about/AboutView';
import { ChatBox } from './components/chat/ChatBox';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentMarket, setCurrentMarket] = useState<MarketType>(() => {
    try {
      const saved = localStorage.getItem('unique_amaze_market');
      if (saved === 'ca' || saved === 'mw') return saved;

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const malawiIndicators = [
        'Blantyre', 'Lilongwe', 'Harare', 'Lusaka', 'Johannesburg',
        'Maputo', 'Kigali', 'Nairobi', 'Dar_es_Salaam', 'Gaborone', 'Windhoek', 'Africa'
      ];
      const isMalawi = malawiIndicators.some((indicator) => tz.includes(indicator));
      return isMalawi ? 'mw' : 'ca';
    } catch {
      return 'ca';
    }
  });

  const [currentTheme, setCurrentTheme] = useState<StudioTheme>(() => {
    try {
      const saved = localStorage.getItem('unique_amaze_theme');
      if (saved === 'obsidian' || saved === 'lunar') return saved;
      return 'obsidian';
    } catch {
      return 'obsidian';
    }
  });

  // Centralized Smooth Inertial Scroll System via scrollEngine (Lenis + GSAP ScrollTrigger)
  useEffect(() => {
    scrollEngine.init();
    return () => {
      scrollEngine.destroy();
    };
  }, []);

  // Synchronize document-level theme attribute for high-contrast accessibility styling
  useEffect(() => {
    try {
      localStorage.setItem('unique_amaze_theme', currentTheme);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'lunar') {
      document.documentElement.classList.add('theme-lunar');
      document.documentElement.classList.remove('theme-obsidian');
    } else {
      document.documentElement.setAttribute('data-theme', 'obsidian');
      document.documentElement.classList.add('theme-obsidian');
      document.documentElement.classList.remove('theme-lunar');
    }
  }, [currentTheme]);

  const handleToggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'obsidian' ? 'lunar' : 'obsidian'));
  };

  const handleNavigate = (route: PageRoute) => {
    if (route === currentRoute) {
      scrollEngine.scrollTo(0, { immediate: false });
      return;
    }
    setCurrentRoute(route);
  };

  const handleMarketChange = (market: MarketType) => {
    setCurrentMarket(market);
    try {
      localStorage.setItem('unique_amaze_market', market);
    } catch (e) {
      console.warn(e);
    }
  };

  const renderRouteView = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <HomeView
            onNavigate={handleNavigate}
            currentMarket={currentMarket}
            onMarketChange={handleMarketChange}
          />
        );
      case 'services':
        return <ServicesView onNavigate={handleNavigate} currentMarket={currentMarket} />;
      case 'work':
        return <WorkView onNavigate={handleNavigate} />;
      case 'process':
        return <ProcessView onNavigate={handleNavigate} />;
      case 'pricing':
        return (
          <PricingView
            onNavigate={handleNavigate}
            currentMarket={currentMarket}
            onMarketChange={handleMarketChange}
          />
        );
      case 'planner':
        return <PlannerView onNavigate={handleNavigate} currentMarket={currentMarket} />;
      case 'faq':
        return <FaqView onNavigate={handleNavigate} />;
      case 'about':
        return <AboutView onNavigate={handleNavigate} currentMarket={currentMarket} />;
      case 'contact':
        return <ContactView onNavigate={handleNavigate} currentMarket={currentMarket} />;
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            currentMarket={currentMarket}
            onMarketChange={handleMarketChange}
          />
        );
    }
  };

  return (
    <div
      data-theme={currentTheme}
      className={`relative min-h-screen transition-colors duration-300 antialiased ${
        currentTheme === 'lunar'
          ? 'bg-[#F8FAFC] text-[#0F172A] selection:bg-[#008280] selection:text-white'
          : 'bg-[#050607] text-[#F3F7F8] selection:bg-[#16D2C8] selection:text-[#050607]'
      }`}
    >
      {/* Precision Dual-Ring Custom Optical Cursor */}
      <CustomCursor />

      {/* Top Telemetry and System Status Strip with Theme and Audio Controls */}
      <TelemetryBar
        onNavigate={handleNavigate}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Sticky Main Navigation with Market Switcher */}
      <Navbar
        currentRoute={currentRoute}
        currentMarket={currentMarket}
        onNavigate={handleNavigate}
        onMarketChange={handleMarketChange}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Primary Multi-Page Route Viewport with Seamless Fade Page Transitions */}
      <main id="unique-amaze-viewport" className="relative z-10 min-h-[calc(100vh-300px)]">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            scrollEngine.scrollTo(0, { immediate: true });
            window.scrollTo(0, 0);
          }}
        >
          <motion.div
            key={currentRoute}
            id={`route-view-${currentRoute}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              scrollEngine.refresh();
            }}
            className="w-full"
          >
            {renderRouteView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Rich Architectural Footer */}
      <Footer
        onNavigate={handleNavigate}
        currentMarket={currentMarket}
        onMarketChange={handleMarketChange}
      />

      {/* Floating Multi-Turn AI Studio Concierge Chatbot */}
      <ChatBox
        currentMarket={currentMarket}
        onNavigate={handleNavigate}
        isOpen={isChatOpen}
        onToggleOpen={setIsChatOpen}
      />
    </div>
  );
}
