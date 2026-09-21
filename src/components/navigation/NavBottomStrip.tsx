import React from 'react';
import { PageRoute } from '../../types';
import { ArrowUpRight, MapPin, Globe } from 'lucide-react';
import { studioAudio } from '../../utils/audio';

interface NavBottomStripProps {
  onNavigate: (route: PageRoute) => void;
  onCloseMenu: () => void;
}

export const NavBottomStrip: React.FC<NavBottomStripProps> = ({
  onNavigate,
  onCloseMenu,
}) => {
  return (
    <div className="w-full border-t border-white/[0.08] pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-[#94A3B8]">
      {/* Studio Location & Availability */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-center md:text-left">
        <div className="flex items-center gap-1.5 text-white">
          <MapPin className="h-3.5 w-3.5 text-[#008280]" />
          <span className="tracking-wider uppercase font-medium">CHESTERMERE / CALGARY / ALBERTA</span>
        </div>
        <span className="hidden sm:inline text-white/20">•</span>
        <div className="flex items-center gap-1.5 text-[#5EEAD4]">
          <Globe className="h-3.5 w-3.5" />
          <span className="tracking-wider uppercase text-[11px]">AVAILABLE FOR SELECT GLOBAL PROJECTS</span>
        </div>
      </div>

      {/* Social Links & Primary CTA */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3 text-[11px] tracking-widest uppercase">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            INSTAGRAM
          </a>
          <span className="text-white/20">/</span>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LINKEDIN
          </a>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => {
            studioAudio.playClick(1200);
            onCloseMenu();
            onNavigate('planner');
          }}
          data-cursor="enter"
          className="cta-image-btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md font-mono text-xs font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.98] shadow-md"
        >
          <span>START A PROJECT</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
