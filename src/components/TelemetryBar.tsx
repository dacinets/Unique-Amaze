import React, { useState, useEffect } from 'react';
import { Activity, Radio, Cpu, ShieldCheck, Sun, Moon } from 'lucide-react';
import { StudioTheme } from '../types';

interface TelemetryBarProps {
  onOpenCommission: () => void;
  currentTheme?: StudioTheme;
  onToggleTheme?: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  onOpenCommission,
  currentTheme = 'obsidian',
  onToggleTheme,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [latency, setLatency] = useState<number>(11.2);
  const [internalTheme, setInternalTheme] = useState<StudioTheme>(() => {
    try {
      const saved = localStorage.getItem('unique_amaze_theme');
      if (saved === 'obsidian' || saved === 'lunar') return saved;
    } catch {
      // ignore
    }
    return currentTheme || 'obsidian';
  });

  const activeTheme = onToggleTheme ? currentTheme : internalTheme;

  const handleThemeToggle = () => {
    const nextTheme: StudioTheme = activeTheme === 'obsidian' ? 'lunar' : 'obsidian';
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(' ')[0] +
          '.' +
          Math.floor(now.getMilliseconds() / 100) +
          ' UTC'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 100);

    // Minor fluctuating latency simulator
    const latencyInterval = setInterval(() => {
      setLatency(Number((10.5 + Math.random() * 2.5).toFixed(1)));
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(latencyInterval);
    };
  }, []);

  return (
    <div
      id="system-telemetry-bar"
      className="w-full border-b border-[#1E2629] bg-[#050607]/90 px-4 py-2 font-mono text-[11px] text-[#64748B] tracking-[0.12em] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3">
        {/* Left Telemetry Cluster */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5EEAD4] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5EEAD4]" />
            </span>
            <span className="font-semibold text-[#F3F7F8]">NODE: ZURICH-ALPHA</span>
          </div>

          <span className="hidden text-[#2A363A] sm:inline">|</span>

          <div className="hidden items-center gap-1.5 md:flex">
            <Radio className="h-3 w-3 text-[#00F2FE]" />
            <span>RENDER_STREAM: 4K 120HZ</span>
          </div>

          <span className="hidden text-[#2A363A] lg:inline">|</span>

          <div className="hidden items-center gap-1.5 lg:flex">
            <Cpu className="h-3 w-3 text-[#5EEAD4]" />
            <span>LATENCY: <span className="text-[#5EEAD4]">{latency}ms</span></span>
          </div>
        </div>

        {/* Right Telemetry Cluster */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 sm:flex">
            <ShieldCheck className="h-3 w-3 text-[#00F2FE]" />
            <span>ENCRYPTED // TLS 1.3</span>
          </div>

          <span className="hidden text-[#2A363A] sm:inline">|</span>

          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-[#00F2FE]" />
            <span className="text-[#94A3B8]">{timeStr || '23:31:19 UTC'}</span>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            id="telemetry-theme-toggle-root"
            onClick={handleThemeToggle}
            className={`group flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1 text-[10px] font-mono tracking-wider transition-all duration-200 ${
              activeTheme === 'lunar'
                ? 'border-[#008280] bg-white text-[#0F172A] hover:bg-[#F8FAFC]'
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
            id="telemetry-dispatch-btn"
            onClick={onOpenCommission}
            className="group ml-2 flex items-center gap-1.5 rounded-[4px] border border-[#2A363A] bg-[#0A0D0E] px-2.5 py-1 text-[10px] font-semibold text-[#00F2FE] transition-all hover:border-[#00F2FE] hover:bg-[#00F2FE]/10"
          >
            <span>AVAILABILITY: Q3/Q4</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] group-hover:scale-125" />
          </button>
        </div>
      </div>
    </div>
  );
};
