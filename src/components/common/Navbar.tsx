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
  currentMarket?: MarketType;
  onMarketChange?: (market: MarketType) => void;
  onOpenChat?: () => void;
  currentTheme?: StudioTheme;
  onToggleTheme?: () => void;
  isMenuOpen?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  currentMarket = 'ca',
  onMarketChange = () => {},
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
        <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* LEFT: Unique Amaze Monolith / Animated Brand Mark (Links to Homepage) */}
          <button
            id="navbar-logo-home-link"
            onClick={() => handleNavClick('home')}
            className="group relative z-10 flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            data-cursor="open"
            aria-label="Unique Amaze — Studio Homepage"
            title="Unique Amaze — Studio Homepage"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-lg border border-white/10 bg-[#0C1014] p-1 shadow-sm group-hover:border-white/30 transition-colors">
              <img
                src={LOGO_DATA_URI}
                alt="Unique Amaze Logo"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Subtle Monolith Glow Core */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display text-sm sm:text-base font-bold tracking-tight text-white transition-colors group-hover:text-zinc-200">
                <span>UNIQUE</span>
                <span className="text-white font-black">AMAZE</span>
              </div>
              <div className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase">
                Bespoke Web Studio
              </div>
            </div>
          </button>

          {/* CENTER: Clean Centered Navigation Items */}
          <nav
            aria-label="Primary Destinations"
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-5 xl:gap-8"
          >
            {restingDestinations.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`navbar-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  data-cursor="pointer"
                  className={`group relative flex items-center gap-1.5 py-1.5 px-1 font-mono text-[11px] tracking-[0.2em] uppercase transition-all duration-200 focus:outline-none cursor-pointer ${
                    isActive
                      ? currentTheme === 'lunar'
                        ? 'text-slate-900 font-bold'
                        : 'text-white font-bold'
                      : currentTheme === 'lunar'
                      ? 'text-[#334155] hover:text-[#0F172A] font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Restrained Active Indicator: Dot before title */}
                  {isActive && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        currentTheme === 'lunar'
                          ? 'bg-slate-900 shadow-[0_0_8px_rgba(15,23,42,0.4)]'
                          : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                      }`}
                    />
                  )}

                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    {item.label}
                  </span>

                  {/* Subtle hover arrow micro-interaction */}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-current" />
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Action & Utility Controls (Theme Toggle & Menu Toggle remain always accessible) */}
          <div className="relative z-10 flex items-center gap-2.5 sm:gap-3.5">
            {/* Visual Theme Toggle: onToggleTheme - Accessible on both mobile and desktop */}
            {onToggleTheme && (
              <button
                id="navbar-theme-toggle-btn"
                onClick={onToggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none cursor-pointer ${
                  currentTheme === 'lunar'
                    ? 'border-slate-300 bg-white text-[#D97706] hover:bg-slate-50 shadow-sm'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/10'
                }`}
                title={`Switch to ${currentTheme === 'lunar' ? 'Obsidian Dark' : 'Lunar Light'} theme`}
                aria-label="Toggle visual theme"
              >
                {currentTheme === 'lunar' ? (
                  <Sun className="h-4 w-4 text-[#D97706]" />
                ) : (
                  <Moon className="h-4 w-4 text-zinc-300" />
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
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-[11px] font-medium transition-colors focus:outline-none cursor-pointer ${
                  currentTheme === 'lunar'
                    ? 'border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    : 'border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-white/25 hover:bg-white/10'
                }`}
                title="Open Studio Concierge"
              >
                <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                <span>AI CHAT</span>
              </button>
            )}

            {/* Menu Trigger: onMenuToggle - Accessible on both mobile and desktop */}
            <button
              ref={menuTriggerRef}
              id="navbar-menu-explore-trigger"
              onClick={() => handleToggleMenu(true)}
              data-cursor="open"
              aria-label="Open Navigation Menu"
              aria-expanded={isMenuOpen}
              className="group relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#090D12]/90 hover:border-white/30 hover:bg-white/10 px-4 sm:px-5 py-2 font-mono text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none cursor-pointer"
            >
              {/* Minimalist 2-line animated glyph */}
              <div className="flex flex-col gap-1 items-end justify-center w-4 h-3.5">
                <span className="h-[1.5px] w-4 bg-white/80 group-hover:bg-white transition-all duration-300 group-hover:w-3" />
                <span className="h-[1.5px] w-2.5 bg-zinc-400 group-hover:bg-white transition-all duration-300 group-hover:w-4" />
              </div>

              <span className="tracking-[0.2em] uppercase text-[11px]">MENU</span>
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
