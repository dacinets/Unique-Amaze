import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, MarketType, StudioTheme } from '../../types';
import { LOGO_DATA_URI } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { scrollEngine } from '../../utils/scrollEngine';
import { NavExpandedMenu } from '../navigation/NavExpandedMenu';
import { ArrowUpRight, Sun, Moon, Sparkles, Compass } from 'lucide-react';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
  onMarketChange: (market: MarketType) => void;
  onOpenChat?: () => void;
  currentTheme?: StudioTheme;
  onToggleTheme?: () => void;
  isMenuOpen?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  currentMarket,
  onMarketChange,
  onOpenChat,
  currentTheme = 'obsidian',
  onToggleTheme,
  isMenuOpen: controlledMenuOpen,
  onMenuToggle,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = controlledMenuOpen !== undefined ? controlledMenuOpen : internalMenuOpen;
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  // Synchronize scroll behavior via scrollEngine
  useEffect(() => {
    const unsubscribe = scrollEngine.subscribe((state) => {
      const currentY = state.scrollY;
      setIsScrolled(currentY > 70);

      if (currentY > 180 && currentY > lastScrollY.current + 10) {
        setIsScrollingDown(true);
      } else if (currentY < lastScrollY.current - 5 || currentY < 120) {
        setIsScrollingDown(false);
      }
      lastScrollY.current = currentY;
    });

    return () => unsubscribe();
  }, []);

  const handleToggleMenu = (openState?: boolean) => {
    const nextState = openState !== undefined ? openState : !isMenuOpen;
    studioAudio.playClick(nextState ? 900 : 600);
    if (onMenuToggle) {
      onMenuToggle(nextState);
    } else {
      setInternalMenuOpen(nextState);
    }
  };

  // Main 5 Destinations specified for State 01 Resting Navigation (Home is linked to the site logo)
  const restingDestinations: { id: PageRoute; label: string; number: string }[] = [
    { id: 'services', label: 'SERVICES & CARE', number: '01' },
    { id: 'work', label: 'SELECTED WORK', number: '02' },
    { id: 'process', label: 'A.M.A.Z.E.', number: '03' },
    { id: 'pricing', label: 'PRICING', number: '04' },
    { id: 'contact', label: 'CONTACT', number: '05' },
  ];

  const handleNavClick = (route: PageRoute) => {
    studioAudio.playClick(route === 'pricing' ? 950 : 800);
    onNavigate(route);
  };

  return (
    <>
      {/* STATE 01 — RESTING / MINIMAL HEADER */}
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrollingDown && !isMenuOpen
            ? '-translate-y-2 py-2.5 sm:py-3'
            : 'translate-y-0 py-3.5 sm:py-4.5'
        } ${
          isScrolled
            ? 'border-b border-white/[0.08] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.25)] ' +
              (currentTheme === 'lunar'
                ? 'bg-[#F8FAFC]/85 text-[#0F172A]'
                : 'bg-[#050607]/80 text-[#F3F7F8]')
            : 'border-b border-transparent bg-transparent'
        }`}
        style={{
          minHeight: '68px',
        }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* LEFT: Unique Amaze Monolith / Animated Brand Mark (Links to Homepage) */}
          <button
            id="navbar-logo-home-link"
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3 text-left focus:outline-none"
            data-cursor="open"
            aria-label="Unique Amaze — Studio Homepage"
            title="Unique Amaze — Studio Homepage"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-lg border border-white/10 bg-[#0C1014] p-1 shadow-sm group-hover:border-[#008280] transition-colors">
              <img
                src={LOGO_DATA_URI}
                alt="Unique Amaze Logo"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Subtle Monolith Glow Core */}
              <div className="absolute inset-0 bg-[#008280]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display text-sm sm:text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#5EEAD4]">
                <span>UNIQUE</span>
                <span className="text-[#008280] font-black">AMAZE</span>
              </div>
              <div className="font-mono text-[9px] tracking-widest text-[#94A3B8] uppercase">
                STUDIO // AI &amp; 3D
              </div>
            </div>
          </button>

          {/* CENTER: Restrained Main Destinations (Desktop) */}
          <nav
            aria-label="Resting Primary Destinations"
            className="hidden xl:flex items-center gap-6 2xl:gap-8"
          >
            {restingDestinations.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`navbar-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  data-cursor="pointer"
                  className={`group relative flex items-center gap-1.5 py-1 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'text-[#008280] font-bold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Restrained Active Indicator: Dot before title */}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#008280] animate-pulse shadow-[0_0_8px_#008280]" />
                  )}

                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    {item.label}
                  </span>

                  {/* Subtle hover arrow micro-interaction */}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-[#008280]" />
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Restrained Utility Area + EXPLORE / MENU Trigger */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* Currency Switcher (CAD / MWK) */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                id="currency-switch-ca-btn"
                onClick={() => {
                  studioAudio.playClick(900);
                  onMarketChange('ca');
                }}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentMarket === 'ca'
                    ? 'text-[#008280] font-bold underline underline-offset-4 decoration-[#008280]'
                    : 'text-[#64748B] hover:text-white'
                }`}
                title="Canada Market (CAD $)"
              >
                CAD
              </button>
              <span className="text-white/20 text-[10px]">/</span>
              <button
                id="currency-switch-mw-btn"
                onClick={() => {
                  studioAudio.playClick(900);
                  onMarketChange('mw');
                }}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentMarket === 'mw'
                    ? 'text-[#008280] font-bold underline underline-offset-4 decoration-[#008280]'
                    : 'text-[#64748B] hover:text-white'
                }`}
                title="Malawi Market (MWK)"
              >
                MWK
              </button>
            </div>

            {/* Visual Theme Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#94A3B8] hover:text-white hover:border-[#008280] transition-colors focus:outline-none"
                title={`Switch to ${currentTheme === 'lunar' ? 'Obsidian Dark' : 'Lunar Light'} theme`}
                aria-label="Toggle visual theme"
              >
                {currentTheme === 'lunar' ? (
                  <Sun className="h-3.5 w-3.5 text-[#D97706]" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-[#16D2C8]" />
                )}
              </button>
            )}

            {/* AI Studio Chat Trigger */}
            {onOpenChat && (
              <button
                onClick={() => {
                  studioAudio.playClick(1100);
                  onOpenChat();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 font-mono text-[11px] font-medium text-[#94A3B8] hover:text-white hover:border-[#008280] hover:bg-[#008280]/10 transition-colors focus:outline-none"
                title="Open Sage AI Studio Concierge"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#008280]" />
                <span>AI CHAT</span>
              </button>
            )}

            {/* EXPLORE / MENU TRIGGER: Transforms into State 02 Expanded Room */}
            <button
              ref={menuTriggerRef}
              id="navbar-menu-explore-trigger"
              onClick={() => handleToggleMenu(true)}
              data-cursor="open"
              aria-label="Open Expanded Navigation Menu"
              aria-expanded={isMenuOpen}
              className="group relative inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#090D12]/90 hover:border-[#008280] hover:bg-[#008280]/15 px-4 sm:px-5 py-2 font-mono text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none"
            >
              {/* Animated Architectonic Glyph */}
              <div className="flex flex-col gap-1 items-end justify-center w-4 h-3.5">
                <span className="h-[1.5px] w-4 bg-[#008280] group-hover:bg-[#16D2C8] transition-all duration-300 group-hover:w-3" />
                <span className="h-[1.5px] w-2.5 bg-[#5EEAD4] group-hover:bg-[#008280] transition-all duration-300 group-hover:w-4" />
              </div>

              <span className="tracking-[0.2em] uppercase text-[11px]">EXPLORE</span>
            </button>
          </div>
        </div>
      </header>

      {/* STATE 02 — EXPANDED NAVIGATION EXPERIENCE ("A ROOM YOU ENTER") */}
      <NavExpandedMenu
        isOpen={isMenuOpen}
        onClose={() => handleToggleMenu(false)}
        currentRoute={currentRoute}
        currentMarket={currentMarket}
        onNavigate={handleNavClick}
        onMarketChange={onMarketChange}
        onOpenChat={onOpenChat}
        currentTheme={currentTheme}
        onToggleTheme={onToggleTheme}
        triggerRef={menuTriggerRef}
      />
    </>
  );
};
