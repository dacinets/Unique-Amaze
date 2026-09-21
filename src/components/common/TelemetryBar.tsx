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
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.setAttribute('data-theme', 'obsidian');
        document.documentElement.classList.add('theme-obsidian');
        document.documentElement.classList.remove('theme-lunar');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
  };

  return (
    <div
      id="telemetry-bar"
      className={`relative z-50 w-full border-b px-4 py-1 font-mono text-[10px] select-none transition-colors duration-200 ${
        activeTheme === 'lunar'
          ? 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
          : 'border-white/[0.06] bg-[#050607]/95 text-[#64748B]'
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-0 sm:px-2 lg:px-4">
        {/* Left: System Status & Pulsing Beacon */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[#008280]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#008280] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#008280]" />
            </span>
            <span className="font-semibold tracking-wider uppercase text-current">CALGARY // MALAWI</span>
          </div>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="hidden sm:inline text-[#64748B]">BESPOKE 3D &amp; AI EXPERIENCES</span>
        </div>

        {/* Right: Audio Synthesizer & Local Studio Clock */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block font-mono text-[#94A3B8] opacity-80">
            {timeStr}
          </span>
          <button
            id="telemetry-audio-toggle"
            onClick={handleToggleMute}
            className={`flex items-center gap-1 hover:text-[#008280] transition-colors focus:outline-none ${
              !isMuted ? 'text-[#008280]' : 'text-[#64748B]'
            }`}
            title="Toggle Studio Audio Ambiance"
          >
            {!isMuted ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            <span className="text-[9px] uppercase tracking-wider">{!isMuted ? 'AUDIO ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
