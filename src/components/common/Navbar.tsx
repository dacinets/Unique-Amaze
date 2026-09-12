import React, { useState } from 'react';
import { PageRoute, MarketType } from '../../types';
import { LOGO_DATA_URI } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { Menu, X, ArrowUpRight, Sparkles, Zap, Bot } from 'lucide-react';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
  onMarketChange: (market: MarketType) => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  currentMarket,
  onMarketChange,
  onOpenChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Primary Navigation: Clean, premium 5-item architecture
  const primaryNavItems: { id: PageRoute; label: string }[] = [
    { id: 'work', label: 'WORK' },
    { id: 'services', label: 'SERVICES' },
    { id: 'process', label: 'A.M.A.Z.E.™' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  // Secondary utility links (Footer, Mobile Drawer & Contextual journeys)
  const secondaryNavItems: { id: PageRoute; label: string }[] = [
    { id: 'planner', label: 'PROJECT PLANNER' },
    { id: 'pricing', label: 'PRICING' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (route: PageRoute) => {
    studioAudio.playClick(route === 'planner' ? 1100 : 750);
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-white/[0.07] backdrop-blur-xl">
      {/* 1200px–1280px Constrained Content Container */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Brand Logo & Logotype — Functions as HOME link */}
        <button
          id="navbar-logo-home-link"
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-3 text-left focus:outline-none"
          title="Unique Amaze — Return to Homepage"
        >
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-lg border border-white/10 bg-[#0C1014] p-1 shadow-md group-hover:border-[#008280] transition-all">
            <img
              src={LOGO_DATA_URI}
              alt="Unique Amaze Logo"
              className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,130,128,0.5)] group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display text-lg sm:text-xl font-bold tracking-tight text-[#EBECF0]">
              <span>UNIQUE</span>
              <span className="text-[#008280] font-black">AMAZE</span>
            </div>
            <div className="font-mono text-[9px] tracking-widest text-[#64748B] uppercase">
              AI-POWERED 3D WEB STUDIO
            </div>
          </div>
        </button>

        {/* Desktop Primary Navigation Links (WORK | SERVICES | A.M.A.Z.E.™ | ABOUT | CONTACT) */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1 bg-[#0A0D10]/80 px-2 py-1.5 rounded-lg border border-white/[0.08] shadow-inner"
        >
          {primaryNavItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                id={`navbar-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#008280]/20 text-[#EBECF0] border border-[#008280]/60 shadow-[0_0_15px_rgba(0,130,128,0.25)] font-bold'
                    : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/[0.04]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar: Currency Switcher & Distinct CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Dual-Market Currency Switcher */}
          <div className="flex items-center rounded-lg border border-white/10 bg-[#0C1014] p-1 font-mono text-xs">
            <button
              id="currency-switch-ca-btn"
              onClick={() => {
                studioAudio.playClick(900);
                onMarketChange('ca');
              }}
              className={`rounded-md px-2.5 py-1 transition-all ${
                currentMarket === 'ca'
                  ? 'bg-[#008280] text-white font-bold shadow-sm'
                  : 'text-[#64748B] hover:text-[#EBECF0]'
              }`}
              title="Switch to Canada Market (CAD $)"
            >
              CAD $
            </button>
            <button
              id="currency-switch-mw-btn"
              onClick={() => {
                studioAudio.playClick(900);
                onMarketChange('mw');
              }}
              className={`rounded-md px-2.5 py-1 transition-all ${
                currentMarket === 'mw'
                  ? 'bg-[#008280] text-white font-bold shadow-sm'
                  : 'text-[#64748B] hover:text-[#EBECF0]'
              }`}
              title="Switch to Malawi Market (MWK)"
            >
              MWK
            </button>
          </div>

          {/* Distinct Primary CTA Button: START A PROJECT (links to Project Planner / enquiry flow) */}
          <button
            id="navbar-start-a-project-cta"
            onClick={() => handleNavClick('planner')}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#16D2C8]/60 bg-gradient-to-r from-[#008280] via-[#0D8782] to-[#008280] px-5 py-2 font-mono text-xs font-bold text-white shadow-[0_0_22px_rgba(0,130,128,0.4)] hover:shadow-[0_0_32px_rgba(22,210,200,0.55)] hover:border-[#16D2C8] transition-all duration-300 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#16D2C8] group-hover:scale-110 transition-transform" />
              <span className="tracking-wider">START A PROJECT</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-white/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>

        {/* Mobile / Tablet Responsive Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Market Switcher for Mobile */}
          <div className="flex items-center rounded-md border border-white/10 bg-[#0C1014] p-0.5 font-mono text-[10px]">
            <button
              onClick={() => onMarketChange('ca')}
              className={`rounded px-2 py-0.5 ${
                currentMarket === 'ca' ? 'bg-[#008280] text-white font-bold' : 'text-[#94A3B8]'
              }`}
            >
              CAD $
            </button>
            <button
              onClick={() => onMarketChange('mw')}
              className={`rounded px-2 py-0.5 ${
                currentMarket === 'mw' ? 'bg-[#008280] text-white font-bold' : 'text-[#94A3B8]'
              }`}
            >
              MWK
            </button>
          </div>

          {/* Mobile Drawer Hamburger Button */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => {
              studioAudio.playClick(600);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="rounded-lg border border-white/10 bg-[#0C1014] p-2 text-[#EBECF0] hover:border-[#008280] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-[#16D2C8]" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay / Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-white/10 bg-[#07090B]/98 backdrop-blur-2xl px-4 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200"
        >
          {/* Primary Navigation Group */}
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#008280] px-3 pb-1 font-semibold">
              // PRIMARY NAVIGATION
            </div>
            {primaryNavItems.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full p-3 rounded-lg font-mono text-sm uppercase tracking-wide transition-colors ${
                    isActive
                      ? 'bg-[#008280]/20 text-[#16D2C8] border border-[#008280]/40 font-bold'
                      : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#EBECF0]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Prominent Mobile CTA */}
          <button
            id="mobile-drawer-start-a-project-btn"
            onClick={() => handleNavClick('planner')}
            className="w-full py-3.5 rounded-lg border border-[#16D2C8] bg-[#008280] text-white font-mono text-xs font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,130,128,0.45)] hover:bg-[#009491] active:scale-[0.99] transition-all"
          >
            <Zap className="h-4 w-4 text-[#16D2C8]" />
            <span>START A PROJECT</span>
            <ArrowUpRight className="h-4 w-4 text-white" />
          </button>

          {/* Secondary Utilities Group (PROJECT PLANNER, PRICING, FAQ) */}
          <div className="pt-3 border-t border-white/10 space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] px-3 pb-1 font-semibold">
              // SECONDARY & UTILITIES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {secondaryNavItems.map((item) => {
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-md font-mono text-xs uppercase tracking-wide transition-colors ${
                      isActive
                        ? 'bg-white/10 text-[#16D2C8] font-bold'
                        : 'text-[#64748B] hover:text-[#EBECF0] hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SAGE AI Studio Concierge Access in Drawer */}
          {onOpenChat && (
            <div className="pt-2 border-t border-white/10">
              <button
                id="mobile-drawer-open-sage-ai-btn"
                onClick={() => {
                  studioAudio.playClick(1050);
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full py-3 rounded-lg border border-[#16D2C8]/30 bg-[#16D2C8]/10 text-[#16D2C8] font-mono text-xs font-bold text-center flex items-center justify-center gap-2.5 hover:bg-[#16D2C8]/20 transition-all shadow-sm"
              >
                <Bot className="h-4 w-4 text-[#16D2C8]" />
                <span>ASK SAGE AI // STUDIO CONCIERGE</span>
                <Sparkles className="h-3.5 w-3.5 text-[#16D2C8] animate-pulse" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
