import React, { useState, useEffect } from 'react';
import { studioAudio } from '../../utils/audio';
import { ArrowUp, Compass } from 'lucide-react';

interface SpatialScrollHUDProps {
  scrollProgress: number; // 0 to 1
  activeSection: string;
  onScrollTo: (targetId: string) => void;
}

const SECTIONS = [
  { id: 'section-hero', label: '01 / ARCHITECTURE', short: '01' },
  { id: 'section-value', label: '02 / STANDARDS', short: '02' },
  { id: 'section-capabilities', label: '03 / CAPABILITIES', short: '03' },
  { id: 'section-shift', label: '04 / THE SHIFT', short: '04' },
  { id: 'section-transformation', label: '05 / PARADIGM', short: '05' },
  { id: 'section-cinematic-grid', label: '06 / CINEMATIC', short: '06' },
  { id: 'section-showcase', label: '07 / THE AMAZE ORBIT', short: '07' },
  { id: 'section-cta', label: '08 / INTAKE', short: '08' },
];

export const SpatialScrollHUD: React.FC<SpatialScrollHUDProps> = ({
  scrollProgress,
  activeSection,
  onScrollTo,
}) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const raw = typeof scrollProgress === 'number' && Number.isFinite(scrollProgress) ? scrollProgress : 0;
    setPercent(Math.min(100, Math.max(0, Math.round(raw * 100))));
  }, [scrollProgress]);

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentLabel = activeIndex !== -1 ? SECTIONS[activeIndex].label : '01 / ARCHITECTURE';

  const safePercent = Number.isFinite(percent) ? percent : 0;
  const strokeOffset = 125.66 - (125.66 * safePercent) / 100;
  const safeDashOffset = Number.isFinite(strokeOffset) ? strokeOffset : 125.66;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3">
      {/* Current Active Section Badge (Monospace Ticker) */}
      <div className="pointer-events-auto hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#07090C]/90 px-3.5 py-1.5 backdrop-blur-md shadow-xl transition-all font-mono text-[10px] text-[#94A3B8]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#008280] animate-pulse" />
        <span className="text-[#EBECF0] font-semibold tracking-wider uppercase">
          {currentLabel}
        </span>
      </div>

      {/* Floating Circular Scroll Compass & Progress Indicator */}
      <div className="pointer-events-auto group relative flex items-center justify-center">
        <button
          onClick={() => {
            studioAudio.playClick(900);
            if (percent > 90) {
              onScrollTo('section-hero');
            } else {
              const next = SECTIONS[Math.min(SECTIONS.length - 1, activeIndex + 1)];
              if (next) onScrollTo(next.id);
            }
          }}
          className="relative flex h-13 w-13 items-center justify-center rounded-full border border-white/15 bg-[#080B0E]/95 backdrop-blur-md text-[#EBECF0] shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#008280] hover:scale-105 active:scale-95"
          title="Scroll Progress / Click to Advance"
        >
          {/* Radial SVG Progress Track */}
          <svg className="absolute inset-0 -rotate-90 h-full w-full p-1" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-white/10"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              className="stroke-[#008280] transition-all duration-150"
              strokeWidth="2.5"
              strokeDasharray={125.66}
              strokeDashoffset={safeDashOffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Display: Percent Counter or Top Arrow on complete */}
          <div className="font-mono text-[10px] font-bold tracking-tighter text-[#EBECF0] group-hover:text-[#008280] transition-colors">
            {percent > 92 ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <span>{percent.toString().padStart(2, '0')}%</span>
            )}
          </div>
        </button>

        {/* Hover Flying Section Nav Rail (Dot Rails) */}
        <div className="pointer-events-none absolute bottom-full mb-3 right-0 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 flex flex-col items-end gap-1.5 p-2 rounded-lg bg-[#070A0D]/95 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="font-mono text-[9px] text-[#64748B] px-2 py-0.5 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Compass className="h-3 w-3 text-[#16D2C8]" />
            <span>TELEMETRY JUMP</span>
          </div>
          {SECTIONS.map((sec, idx) => {
            const isSecActive = sec.id === activeSection;
            return (
              <button
                key={sec.id}
                onClick={(e) => {
                  e.stopPropagation();
                  studioAudio.playClick(800 + idx * 80);
                  onScrollTo(sec.id);
                }}
                className={`flex items-center gap-2 px-2.5 py-1 rounded text-[10px] font-mono transition-all ${
                  isSecActive
                    ? 'bg-[#008280]/20 text-[#008280] font-bold border border-[#008280]/40'
                    : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
                }`}
              >
                <span>{sec.label}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSecActive ? 'bg-[#008280]' : 'bg-white/20'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
