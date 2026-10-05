import React, { useState, useEffect } from 'react';
import { studioAudio } from '../../utils/audio';
import { Volume2, VolumeX } from 'lucide-react';
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

  return (
    <aside
      id="telemetry-bar"
      aria-label="Studio Regional Presence & Telemetry"
      className={`fixed bottom-0 left-0 right-0 z-30 w-full border-t px-3 sm:px-6 py-1.5 font-mono text-[10px] select-none backdrop-blur-md transition-colors duration-200 ${
        currentTheme === 'lunar'
          ? 'border-[#E2E8F0] bg-[#F8FAFC]/95 text-[#334155] shadow-[0_-2px_12px_rgba(0,0,0,0.03)]'
          : 'border-white/[0.08] bg-[#050607]/92 text-[#94A3B8] shadow-[0_-2px_16px_rgba(0,0,0,0.5)]'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-1 sm:px-2">
        {/* Left: System Status, Regional Info & Pulsing Beacon */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span
              className={`font-bold tracking-widest uppercase truncate ${
                currentTheme === 'lunar' ? 'text-[#0F172A]' : 'text-white'
              }`}
            >
              CALGARY · MALAWI
            </span>
          </div>
          <span className="hidden md:inline text-white/20">|</span>
          <span className={`hidden md:inline truncate ${currentTheme === 'lunar' ? 'text-[#334155]' : 'text-zinc-400'}`}>
            BESPOKE 3D &amp; AI EXPERIENCES
          </span>
        </div>

        {/* Center / Right: Synchronized Clock, Audio Synthesizer Toggle & Network Speed */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className={`hidden lg:flex items-center gap-1.5 ${currentTheme === 'lunar' ? 'text-[#334155]' : 'text-zinc-400'}`}>
            <span className={`uppercase tracking-widest text-[9px] ${currentTheme === 'lunar' ? 'text-slate-600' : 'text-zinc-500'}`}>STUDIO CLOCK:</span>
            <span className={`font-semibold ${currentTheme === 'lunar' ? 'text-[#0F172A]' : 'text-zinc-300'}`}>
              {timeStr}
            </span>
          </div>

          <div className="hidden sm:inline text-white/10">|</div>

          <button
            id="telemetry-audio-toggle"
            onClick={handleToggleMute}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all duration-200 focus:outline-none cursor-pointer ${
              !isMuted
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : currentTheme === 'lunar'
                ? 'border-slate-300 bg-white text-[#334155] hover:text-[#0F172A] hover:bg-slate-50'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
            title="Toggle Studio Audio Feedback"
          >
            {!isMuted ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            <span className="text-[9px] uppercase tracking-wider font-semibold">
              {!isMuted ? 'AUDIO ON' : 'MUTED'}
            </span>
          </button>

          <div className={`hidden sm:flex items-center gap-1.5 text-[9px] ${currentTheme === 'lunar' ? 'text-[#334155]' : 'text-zinc-400'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>SUB-1.2S SPEED</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
