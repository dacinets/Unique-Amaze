import React, { useState, useEffect } from 'react';
import { studioAudio } from '../../utils/audio';
import { ArrowUp } from 'lucide-react';

interface SpatialScrollHUDProps {
  scrollProgress: number; // 0 to 1
  activeSection: string;
  onScrollTo: (targetId: string) => void;
}

export const SpatialScrollHUD: React.FC<SpatialScrollHUDProps> = ({
  scrollProgress,
  onScrollTo,
}) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const raw = typeof scrollProgress === 'number' && Number.isFinite(scrollProgress) ? scrollProgress : 0;
    setPercent(Math.min(100, Math.max(0, Math.round(raw * 100))));
  }, [scrollProgress]);

  const safePercent = Number.isFinite(percent) ? percent : 0;
  const strokeOffset = 125.66 - (125.66 * safePercent) / 100;
  const safeDashOffset = Number.isFinite(strokeOffset) ? strokeOffset : 125.66;

  // Only show when page is scrolled
  if (percent < 5) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => {
          studioAudio.playClick(900);
          onScrollTo('section-hero');
        }}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#080B0E]/90 backdrop-blur-md text-zinc-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/30 hover:text-white hover:scale-105 active:scale-95"
        title="Scroll to Top"
        aria-label="Scroll to top of page"
      >
        {/* Radial SVG Progress Track */}
        <svg className="absolute inset-0 -rotate-90 h-full w-full p-0.5" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-white/10"
            strokeWidth="2"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-white transition-all duration-150"
            strokeWidth="2"
            strokeDasharray={125.66}
            strokeDashoffset={safeDashOffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
};
