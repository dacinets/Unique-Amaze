import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, MarketType, StudioTheme } from '../../types';
import { LOGO_DATA_URI } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { scrollEngine } from '../../utils/scrollEngine';
import { NavPreviewPanel } from './NavPreviewPanel';
import { NavDigitalTools } from './NavDigitalTools';
import { NavBottomStrip } from './NavBottomStrip';
import { X, ArrowUpRight, Sparkles, Sun, Moon } from 'lucide-react';

interface NavExpandedMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: PageRoute;
  currentMarket: MarketType;
  onNavigate: (route: PageRoute) => void;
  onMarketChange: (market: MarketType) => void;
  onOpenChat?: () => void;
  currentTheme?: StudioTheme;
  onToggleTheme?: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

interface NavItemConfig {
  id: PageRoute;
  number: string;
  label: string;
  shortLabel: string;
  ambientTone: string; // Subtle atmospheric glow
}

export const NavExpandedMenu: React.FC<NavExpandedMenuProps> = ({
  isOpen,
  onClose,
  currentRoute,
  currentMarket,
  onNavigate,
  onMarketChange,
  onOpenChat,
  currentTheme = 'obsidian',
  onToggleTheme,
  triggerRef,
}) => {
  const defaultHoverRoute: PageRoute = currentRoute === 'home' ? 'services' : currentRoute;
  const [hoveredRoute, setHoveredRoute] = useState<PageRoute>(defaultHoverRoute);
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems: NavItemConfig[] = [
    {
      id: 'services',
      number: '01',
      label: 'SERVICES & CARE',
      shortLabel: 'SERVICES',
      ambientTone: 'rgba(147, 51, 234, 0.10)', // Subtle lavender / violet atmosphere
    },
    {
      id: 'work',
      number: '02',
      label: 'SELECTED WORK',
      shortLabel: 'WORK',
      ambientTone: 'rgba(16, 185, 129, 0.10)', // Subtle emerald / project glow
    },
    {
      id: 'process',
      number: '03',
      label: 'A.M.A.Z.E.™',
      shortLabel: 'A.M.A.Z.E.',
      ambientTone: 'rgba(22, 210, 200, 0.14)', // Luminous AI / neural cyan
    },
    {
      id: 'pricing',
      number: '04',
      label: 'PRICING',
      shortLabel: 'PRICING',
      ambientTone: 'rgba(56, 189, 248, 0.10)', // Cool architectural glass
    },
    {
      id: 'contact',
      number: '05',
      label: 'CONTACT',
      shortLabel: 'CONTACT',
      ambientTone: 'rgba(245, 158, 11, 0.10)', // Warmer intake glow
    },
  ];

  // Update hoveredRoute when menu opens or currentRoute changes
  useEffect(() => {
    if (isOpen) {
      setHoveredRoute(currentRoute === 'home' ? 'services' : currentRoute);
    }
  }, [isOpen, currentRoute]);

  // Lock body scroll and pause Lenis smoothly when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      scrollEngine.getLenis()?.stop();

      // Keyboard ESC listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          studioAudio.playClick(600);
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        scrollEngine.getLenis()?.start();
        window.removeEventListener('keydown', handleKeyDown);

        // Restore focus to trigger button if available
        if (triggerRef?.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose, triggerRef]);

  const handleSelectRoute = (route: PageRoute) => {
    studioAudio.playClick(1000);
    onClose();
    onNavigate(route);
  };

  const activeAmbient =
    navItems.find((item) => item.id === hoveredRoute)?.ambientTone || 'rgba(0, 130, 128, 0.12)';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded Navigation Room"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto overflow-x-hidden bg-[#05070A]/95 text-white backdrop-blur-2xl"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Dynamic Ambient Environmental Aura responding to hovered item */}
          <motion.div
            animate={{
              backgroundColor: activeAmbient,
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 z-0 opacity-80 blur-3xl transition-all"
          />

          {/* Architectural Subtle Background Grid Lines */}
          <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40" />

          {/* TOP BAR: Replicating Minimal Resting Header in the Expanded Room */}
          <header className="relative z-10 w-full border-b border-white/[0.08] px-6 lg:px-12 py-4">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between">
              {/* Brand Monolith & Wordmark (Links to Studio Homepage) */}
              <button
                id="nav-expanded-logo-home-link"
                onClick={() => handleSelectRoute('home')}
                className="group flex items-center gap-3 text-left focus:outline-none"
                data-cursor="open"
                aria-label="Return to Studio Homepage"
                title="Return to Studio Homepage"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-[#0C1014] p-1 shadow-sm group-hover:border-[#008280] transition-colors">
                  <img
                    src={LOGO_DATA_URI}
                    alt="Unique Amaze Logo"
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-display text-base sm:text-lg font-bold tracking-tight text-white">
                    <span>UNIQUE</span>
                    <span className="text-[#008280] font-black">AMAZE</span>
                  </div>
                  <div className="font-mono text-[9px] tracking-widest text-[#94A3B8] uppercase">
                    NAVIGATION ROOM // SYSTEM 02
                  </div>
                </div>
              </button>

              {/* Center Navigation Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-[#008280] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-pulse" />
                <span>SPATIAL EXPLORER</span>
              </div>

              {/* Right Controls: Market Switcher, Theme & Close Trigger */}
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Market Switcher */}
                <div className="flex items-center gap-1 font-mono text-xs">
                  <button
                    onClick={() => {
                      studioAudio.playClick(900);
                      onMarketChange('ca');
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      currentMarket === 'ca'
                        ? 'text-[#008280] font-bold underline underline-offset-4 decoration-[#008280]'
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    CAD
                  </button>
                  <span className="text-white/20">/</span>
                  <button
                    onClick={() => {
                      studioAudio.playClick(900);
                      onMarketChange('mw');
                    }}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      currentMarket === 'mw'
                        ? 'text-[#008280] font-bold underline underline-offset-4 decoration-[#008280]'
                        : 'text-[#64748B] hover:text-white'
                    }`}
                  >
                    MWK
                  </button>
                </div>

                {/* Theme Toggle */}
                {onToggleTheme && (
                  <button
                    onClick={onToggleTheme}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#94A3B8] hover:text-white hover:border-[#008280] transition-colors focus:outline-none"
                    title={`Switch to ${currentTheme === 'lunar' ? 'Obsidian Dark' : 'Lunar Light'} theme`}
                    aria-label="Toggle visual theme"
                  >
                    {currentTheme === 'lunar' ? (
                      <Sun className="h-4 w-4 text-[#D97706]" />
                    ) : (
                      <Moon className="h-4 w-4 text-[#16D2C8]" />
                    )}
                  </button>
                )}

                {/* Close Button Trigger */}
                <button
                  onClick={() => {
                    studioAudio.playClick(600);
                    onClose();
                  }}
                  data-cursor="close"
                  aria-label="Close navigation menu"
                  className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs font-bold text-white hover:border-[#008280] hover:bg-[#008280]/20 hover:text-[#5EEAD4] transition-all focus:outline-none"
                >
                  <span className="tracking-widest uppercase text-[11px]">CLOSE</span>
                  <X className="h-4 w-4 transition-transform group-hover:rotate-90 text-[#008280] group-hover:text-[#5EEAD4]" />
                </button>
              </div>
            </div>
          </header>

          {/* MAIN ROOM CONTENT: Left large navigation links + Right contextual preview */}
          <div className="relative z-10 mx-auto my-auto w-full max-w-[1400px] px-6 lg:px-12 py-6 sm:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* LEFT COLUMN: Large Interactive Primary Navigation Links */}
              <nav
                aria-label="Primary Expanded Navigation"
                className="lg:col-span-7 flex flex-col space-y-2 sm:space-y-3"
              >
                {navItems.map((item, idx) => {
                  const isActive = currentRoute === item.id;
                  const isHovered = hoveredRoute === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -30, y: 15 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15 + idx * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onMouseEnter={() => {
                        setHoveredRoute(item.id);
                        studioAudio.playClick(750 + idx * 60);
                      }}
                      className="relative"
                    >
                      <button
                        onClick={() => handleSelectRoute(item.id)}
                        data-cursor="enter"
                        className={`group relative flex items-baseline gap-4 sm:gap-6 w-full text-left py-2.5 sm:py-3 transition-all duration-300 focus:outline-none ${
                          isHovered
                            ? 'translate-x-3 sm:translate-x-5 opacity-100'
                            : 'opacity-40 hover:opacity-100'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Numerical Identifier */}
                        <span
                          className={`font-mono text-sm sm:text-base md:text-lg font-bold transition-all duration-300 ${
                            isHovered
                              ? 'text-[#008280] scale-110'
                              : isActive
                              ? 'text-[#16D2C8]'
                              : 'text-white/40'
                          }`}
                        >
                          {item.number}
                        </span>

                        {/* Large Typography Link */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                          <span
                            className={`font-display text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight uppercase leading-none transition-colors duration-200 ${
                              isHovered
                                ? 'text-white'
                                : isActive
                                ? 'text-white'
                                : 'text-[#EBECF0]'
                            }`}
                          >
                            <span className="hidden sm:inline">{item.label}</span>
                            <span className="sm:hidden">{item.shortLabel}</span>
                          </span>

                          {/* Current Route Indicator Tag */}
                          {isActive && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#008280]/40 bg-[#008280]/15 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#5EEAD4] uppercase tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#008280]" />
                              <span>ACTIVE</span>
                            </span>
                          )}

                          {/* Hover Arrow Micro-interaction */}
                          <ArrowUpRight
                            className={`h-6 w-6 sm:h-8 sm:w-8 text-[#008280] transition-all duration-300 ${
                              isHovered
                                ? 'opacity-100 translate-x-1 -translate-y-1'
                                : 'opacity-0 -translate-x-2 translate-y-2'
                            }`}
                          />
                        </div>

                        {/* Hairline expanding indicator under active/hovered link */}
                        {isHovered && (
                          <motion.div
                            layoutId="nav-hover-line"
                            className="absolute -bottom-1 left-0 right-12 h-px bg-gradient-to-r from-[#008280] via-[#16D2C8]/60 to-transparent"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </nav>

              {/* RIGHT COLUMN: Contextual Editorial Preview System (Desktop & Tablet) */}
              <div className="hidden lg:block lg:col-span-5 h-[480px]">
                <NavPreviewPanel
                  hoveredRoute={hoveredRoute}
                  currentMarket={currentMarket}
                  onNavigate={handleSelectRoute}
                  onCloseMenu={onClose}
                />
              </div>
            </div>

            {/* SECONDARY DIGITAL TOOLS SECTION */}
            <div className="mt-8 sm:mt-12 pt-6 border-t border-white/[0.08]">
              <NavDigitalTools
                onNavigate={handleSelectRoute}
                onOpenChat={onOpenChat}
                onCloseMenu={onClose}
              />
            </div>
          </div>

          {/* BOTTOM RESTING UTILITY INFORMATION STRIP */}
          <footer className="relative z-10 w-full px-6 lg:px-12 pb-4">
            <div className="mx-auto max-w-[1400px]">
              <NavBottomStrip onNavigate={handleSelectRoute} onCloseMenu={onClose} />
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
