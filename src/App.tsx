/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { scrollEngine } from './utils/scrollEngine';
import { PageRoute, MarketType, StudioTheme } from './types';
import { analytics } from './utils/analytics';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';
import { ServicesView } from './components/services/ServicesView';
import { WorkView } from './components/work/WorkView';
import { IndustriesView } from './components/industries/IndustriesView';
import { ProcessView } from './components/process/ProcessView';
import { PricingView } from './components/pricing/PricingView';
import { PlannerView } from './components/planner/PlannerView';
import { FaqView } from './components/faq/FaqView';
import { ContactView } from './components/contact/ContactView';
import { AboutView } from './components/about/AboutView';
import { PrivacyView } from './components/privacy/PrivacyView';
import { TermsView } from './components/terms/TermsView';
import { ChatBox } from './components/chat/ChatBox';
import { Breadcrumbs } from './components/navigation/Breadcrumbs';

const ROUTE_MAP: Record<string, PageRoute> = {
  '/': 'home',
  '/services': 'services',
  '/work': 'work',
  '/industries': 'industries',
  '/process': 'process',
  '/pricing': 'pricing',
  '/ai-planner': 'planner',
  '/planner': 'planner',
  '/faq': 'faq',
  '/about': 'about',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/terms': 'terms',
};

export const resolveRouteFromPath = (pathname: string): PageRoute => {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];
  const clean = pathname.toLowerCase();
  if (clean.startsWith('/services')) return 'services';
  if (clean.startsWith('/work')) return 'work';
  if (clean.startsWith('/industries')) return 'industries';
  if (clean.startsWith('/process')) return 'process';
  if (clean.startsWith('/pricing')) return 'pricing';
  if (clean.startsWith('/ai-planner') || clean.startsWith('/planner')) return 'planner';
  if (clean.startsWith('/faq')) return 'faq';
  if (clean.startsWith('/about')) return 'about';
  if (clean.startsWith('/contact')) return 'contact';
  if (clean.startsWith('/privacy')) return 'privacy';
  if (clean.startsWith('/terms')) return 'terms';
  return 'home';
};

const PAGE_PATHS: Record<PageRoute, string> = {
  home: '/',
  services: '/services',
  work: '/work',
  industries: '/industries',
  process: '/process',
  pricing: '/pricing',
  planner: '/ai-planner',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute: PageRoute = resolveRouteFromPath(location.pathname);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Update document title dynamically based on route
  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      home: 'Unique Amaze | Bespoke Web Architecture & Intelligent Engineering',
      services: 'Services & Digital Care | Unique Amaze Web Studio',
      work: 'Selected Work & Flagship Portfolio | Unique Amaze Web Studio',
      industries: 'Industry Conversion Architecture | Unique Amaze',
      process: 'The A.M.A.Z.E.™ Framework | Unique Amaze Web Studio',
      pricing: 'Transparent Pricing & Packages (CAD & MWK) | Unique Amaze',
      planner: '2-Minute AI Project Planner & Discovery | Unique Amaze',
      faq: 'Frequently Asked Questions & SLAs | Unique Amaze',
      about: 'About Unique Amaze Studio | Calgary & Lilongwe Hubs',
      contact: 'Book Free Strategy Consultation | Unique Amaze',
      privacy: 'Privacy Protocol & Data Ethics | Unique Amaze',
      terms: 'Terms of Service & Performance Warranties | Unique Amaze',
    };
    document.title = titles[currentRoute] || 'Unique Amaze | Bespoke Web Studio';
  }, [currentRoute]);

  // Privacy-focused GDPR-compliant anonymous pageview telemetry
  useEffect(() => {
    analytics.trackPageview(location.pathname);
  }, [location.pathname]);

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
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.setAttribute('data-theme', 'obsidian');
      document.documentElement.classList.add('theme-obsidian');
      document.documentElement.classList.remove('theme-lunar');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [currentTheme]);

  const handleToggleTheme = () => {
    const nextTheme = currentTheme === 'obsidian' ? 'lunar' : 'obsidian';
    setCurrentTheme(nextTheme);
    analytics.trackEvent('theme_toggle', { theme: nextTheme });
  };

  const handleNavigate = (route: PageRoute) => {
    setIsMenuOpen(false);
    const targetPath = PAGE_PATHS[route] || '/';
    analytics.trackEvent('navigation_click', { route, path: targetPath });
    if (location.pathname === targetPath) {
      scrollEngine.scrollTo(0, { immediate: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(targetPath);
  };

  const handleMarketChange = (market: MarketType) => {
    setCurrentMarket(market);
    analytics.trackEvent('market_change', { market });
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
      case 'industries':
        return <IndustriesView onNavigate={handleNavigate} currentMarket={currentMarket} />;
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
      case 'privacy':
        return <PrivacyView onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsView onNavigate={handleNavigate} />;
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
          ? 'bg-[#F8FAFC] text-[#0F172A] selection:bg-slate-200 selection:text-slate-900'
          : 'bg-[#050607] text-[#F3F7F8] selection:bg-slate-800 selection:text-white'
      }`}
    >
      {/* Precision Dual-Ring Custom Optical Cursor */}
      <CustomCursor />

      {/* Sticky Main Navigation with Clean Minimal Header */}
      <Navbar
        currentRoute={currentRoute}
        currentMarket={currentMarket}
        onNavigate={handleNavigate}
        onMarketChange={handleMarketChange}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
        onOpenChat={() => setIsChatOpen(true)}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
      />

      {/* App Shell Breadcrumb Navigation Component for Enhanced Deep Path Readability */}
      <Breadcrumbs
        currentRoute={currentRoute}
        currentTheme={currentTheme}
        currentMarket={currentMarket}
        onNavigate={handleNavigate}
      />

      {/* Primary Multi-Page Route Viewport with Seamless Fade Transitions and Dynamic Depth Transform */}
      <main
        id="unique-amaze-viewport"
        className={`relative z-10 min-h-[calc(100vh-300px)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center will-change-transform ${
          isMenuOpen
            ? 'scale-[0.985] -translate-y-1.5 blur-[3px] opacity-60 brightness-75 contrast-95 pointer-events-none'
            : 'scale-100 translate-y-0 blur-0 opacity-100 brightness-100 contrast-100'
        }`}
      >
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

      {/* Rich Architectural Footer with Absolute Footer Regional Container */}
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
