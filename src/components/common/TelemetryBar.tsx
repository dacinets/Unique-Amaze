import React, { useState, useEffect } from 'react';
import { studioAudio } from '../../utils/audio';
import { Volume2, VolumeX, Sparkles, Terminal, Activity, ArrowRight, Sun, Moon } from 'lucide-react';
import { PageRoute, StudioTheme } from '../../types';

interface TelemetryBarProps {
  onNavigate: (route: PageRoute) => void;
  currentTheme?: StudioTheme;
  onToggleTheme?: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  onNavigate,
  currentTheme = 'obsidian',
  onToggleTheme,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [internalTheme, setInternalTheme] = useState<StudioTheme>(() => {
    try {
      const saved = localStorage.getItem('unique_amaze_theme');
      if (saved === 'obsidian' || saved === 'lunar') return saved;
    } catch {
      // fallback
    }
    return currentTheme || 'obsidian';
  });

  const activeTheme = onToggleTheme ? currentTheme : internalTheme;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC-7'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleMute = () => {
    const unmuted = studioAudio.toggleMute();
    setIsMuted(!unmuted);
  };

  const handleThemeToggle = () => {
    const nextTheme: StudioTheme = activeTheme === 'obsidian' ? 'lunar' : 'obsidian';
    studioAudio.playClick(activeTheme === 'obsidian' ? 840 : 640);

    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalTheme(nextTheme);
      try {
        localStorage.setItem('unique_amaze_theme', nextTheme);
      } catch {
        // ignore
      }
      document.documentElement.setAttribute('data-theme', nextTheme);
      if (nextTheme === 'lunar') {
        document.documentElement.classList.add('theme-lunar');
        document.documentElement.classList.remove('theme-obsidian');
      } else {
        document.documentElement.setAttribute('data-theme', 'obsidian');
        document.documentElement.classList.add('theme-obsidian');
        document.documentElement.classList.remove('theme-lunar');
      }
    }
  };

  return (
    <div
      id="telemetry-bar"
      className={`relative z-50 w-full border-b px-4 py-2 font-mono text-[11px] backdrop-blur-md select-none transition-colors duration-200 ${
        activeTheme === 'lunar'
          ? 'border-[#CBD5E1] bg-[#F1F5F9]/95 text-[#475569]'
          : 'border-[#1E2629] bg-[#050607]/90 text-[#94A3B8]'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-0 sm:px-2 lg:px-4">
        {/* Left: System Status & Pulsing Beacon */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#16D2C8]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16D2C8] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16D2C8]" />
            </span>
            <span className="font-semibold tracking-wider uppercase text-[#F3F7F8]">UNIQUE AMAZE</span>
            <span className="text-[#3A494B]">//</span>
            <span className="text-[#16D2C8] tracking-widest hidden sm:inline">AI 3D STUDIO</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[#64748B] pl-2 border-l border-[#1E2629]">
            <Activity className="h-3 w-3 text-[#5EEAD4]" />
            <span>NODES: CHESTERMERE • CALGARY • ALBERTA • MALAWI</span>
          </div>
        </div>

        {/* Center: System Status Tag */}
        <div className="hidden md:flex items-center gap-2 text-[#64748B]">
          <Terminal className="h-3 w-3 text-[#008280]" />
          <span>1-TO-1 SPECIALIST PROTOCOL ACTIVE</span>
          <span className="text-[#2A363A]">|</span>
          <span className="text-[#367588]">LIGHTHOUSE 90+ TARGET</span>
        </div>

        {/* Right: Theme Toggle, Audio Synthesizer & Quick Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="hidden sm:inline-block font-mono text-[#EBECF0] bg-[#13191B] px-2 py-0.5 rounded border border-[#1E2629]">
            {timeStr}
          </span>

          {/* Theme Mode Toggle Button */}
          <button
            id="telemetry-theme-toggle"
            onClick={handleThemeToggle}
            className={`group flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all duration-200 ${
              activeTheme === 'lunar'
                ? 'border-[#008280] bg-white text-[#0F172A] hover:bg-[#F8FAFC] shadow-xs'
                : 'border-[#2A363A] bg-[#0D1214] text-[#EBECF0] hover:border-[#16D2C8] hover:text-[#16D2C8]'
            }`}
            title={`Active Theme: ${activeTheme === 'lunar' ? 'Lunar (High-Contrast Light)' : 'Obsidian (Dark)'}. Click to toggle.`}
            aria-label={`Toggle theme between Obsidian dark and Lunar high-contrast light. Current: ${activeTheme}`}
          >
            {activeTheme === 'lunar' ? (
              <>
                <Sun className="h-3 w-3 text-[#D97706] transition-transform group-hover:rotate-45" />
                <span className="font-bold">LUNAR</span>
              </>
            ) : (
              <>
                <Moon className="h-3 w-3 text-[#16D2C8] transition-transform group-hover:-rotate-12" />
                <span className="font-semibold">OBSIDIAN</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(600);
              onNavigate('planner');
            }}
            className="flex items-center gap-1.5 text-[#008280] hover:text-[#367588] transition-colors py-0.5 font-semibold"
            title="Launch Project Planner"
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">PROJECT PLANNER</span>
            <ArrowRight className="h-2.5 w-2.5" />
          </button>

          <button
            onClick={handleToggleMute}
            className="flex items-center gap-1.5 rounded-[4px] border border-[#2A363A] bg-[#0D1214] px-2 py-1 text-[#EBECF0] hover:border-[#008280] hover:text-[#008280] transition-colors"
            title="Toggle Ambient Soundscape"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3 w-3 text-[#64748B]" />
                <span className="hidden xs:inline text-[10px]">SOUND OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3 text-[#16D2C8] animate-pulse" />
                <span className="hidden xs:inline text-[10px] text-[#16D2C8]">SOUND ON</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
