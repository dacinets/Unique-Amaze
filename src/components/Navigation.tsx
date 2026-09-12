import React, { useState } from 'react';
import { ViewMode } from '../types';
import { studioAudio } from '../utils/audio';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenCommission: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onOpenCommission,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAudioToggle = () => {
    const active = studioAudio.toggleMute();
    setIsAudioActive(active);
  };

  const navItems: { id: ViewMode; label: string; tag?: string }[] = [
    { id: 'showcase', label: 'SHOWCASE' },
    { id: 'archive', label: 'ARCHIVE', tag: '06' },
    { id: 'lab', label: 'LAB // EXPERIMENT', tag: 'LIVE' },
    { id: 'capabilities', label: 'CAPABILITIES' },
    { id: 'commission', label: 'COMMISSION' },
  ];

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-40 w-full border-b border-[#1E2629]/80 bg-[#050607]/85 backdrop-blur-xl transition-all duration-300"
    >
      <div className="mx-auto flex h-20 max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* Studio Monogram / Brand Identity */}
        <div className="flex items-center gap-6">
          <button
            id="nav-brand-button"
            onClick={() => {
              studioAudio.playClick(950);
              onViewChange('showcase');
            }}
            className="group text-left"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-extrabold tracking-tight text-[#F3F7F8] transition-colors group-hover:text-[#00F2FE]">
                OBSIDIAN
              </span>
              <span className="font-mono text-sm font-light text-[#2A363A]">//</span>
              <span className="font-display text-xl font-extrabold tracking-tight text-[#00F2FE] transition-colors group-hover:text-[#5EEAD4]">
                LUMINA
              </span>
            </div>
            <div className="font-mono text-[9px] tracking-[0.2em] text-[#64748B] uppercase">
              STUDIO FOR COMPUTATIONAL AESTHETICS
            </div>
          </button>
        </div>

        {/* Desktop View Navigation */}
        <nav id="desktop-nav-links" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  studioAudio.playClick(isActive ? 600 : 800);
                  onViewChange(item.id);
                }}
                className={`relative px-4 py-2 font-mono text-[13px] font-medium tracking-[0.08em] uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-[#00F2FE]'
                    : 'text-[#94A3B8] hover:text-[#F3F7F8]'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {item.label}
                  {item.tag && (
                    <span
                      className={`rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold ${
                        item.tag === 'LIVE'
                          ? 'bg-[#5EEAD4]/20 text-[#5EEAD4] animate-pulse'
                          : 'bg-[#1E2629] text-[#64748B]'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#00F2FE] shadow-[0_0_12px_#00F2FE]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Ambient Soundscape Controller */}
          <button
            id="nav-audio-toggle"
            onClick={handleAudioToggle}
            aria-label="Toggle ambient studio soundscape"
            title={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
            className={`flex items-center gap-2 rounded-[4px] border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 ${
              isAudioActive
                ? 'border-[#00F2FE] bg-[#00F2FE]/10 text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                : 'border-[#2A363A] bg-[#0A0D0E] text-[#64748B] hover:border-[#1E2629] hover:text-[#94A3B8]'
            }`}
          >
            {isAudioActive ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-[#00F2FE] animate-pulse" />
                <span className="hidden sm:inline">AUDIO // ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">SOUND: OFF</span>
              </>
            )}
          </button>

          {/* Primary Action Button (Obsidian Lumina Spec) */}
          <button
            id="nav-primary-commission-cta"
            onClick={() => {
              studioAudio.playClick(1000);
              onOpenCommission();
            }}
            className="group relative hidden rounded-[4px] bg-[#00F2FE] px-5 py-2.5 font-mono text-[12px] font-bold tracking-[0.1em] text-[#050607] uppercase transition-all duration-300 hover:bg-[#5EEAD4] hover:shadow-[0_0_28px_rgba(0,242,254,0.5)] sm:flex sm:items-center sm:gap-2"
          >
            <span>INITIATE BRIEF</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            id="nav-mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-[4px] border border-[#2A363A] bg-[#0D1214] p-2 text-[#F3F7F8] md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-[#00F2FE]" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="border-b border-[#1E2629] bg-[#0A0D0E]/95 px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  studioAudio.playClick();
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between rounded-[4px] border px-4 py-3 font-mono text-[13px] uppercase tracking-wider ${
                  currentView === item.id
                    ? 'border-[#00F2FE] bg-[#00F2FE]/10 text-[#00F2FE]'
                    : 'border-[#1E2629] bg-[#050607] text-[#94A3B8]'
                }`}
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span className="rounded bg-[#1E2629] px-2 py-0.5 text-[10px] text-[#00F2FE]">
                    {item.tag}
                  </span>
                )}
              </button>
            ))}
            <button
              id="mobile-nav-commission-btn"
              onClick={() => {
                onOpenCommission();
                setMobileMenuOpen(false);
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-[4px] bg-[#00F2FE] py-3.5 font-mono text-[13px] font-bold text-[#050607] uppercase"
            >
              <span>INITIATE BRIEF</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
