import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageRoute, MarketType } from '../../types';
import { INDUSTRIES_DATA } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { analytics } from '../../utils/analytics';
import {
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';

interface IndustriesViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({
  onNavigate,
  currentMarket,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active sector from URL path (e.g., /industries/wellness) or search parameter (?sector=wellness)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const sectorFromPath = pathParts[0] === 'industries' && pathParts[1] ? pathParts[1] : null;
  const searchParams = new URLSearchParams(location.search);
  const sectorFromQuery = searchParams.get('sector');
  const activeSector = sectorFromPath || sectorFromQuery || 'all';

  const filterContainerRef = useRef<HTMLDivElement>(null);

  const displayedIndustries =
    activeSector === 'all'
      ? INDUSTRIES_DATA
      : INDUSTRIES_DATA.filter((ind) => ind.id === activeSector);

  const activeIndustryMeta = INDUSTRIES_DATA.find((ind) => ind.id === activeSector);

  const handleSelectSector = (sectorId: string) => {
    studioAudio.playClick(950);
    const targetUrl = sectorId === 'all' ? '/industries' : `/industries/${sectorId}`;
    analytics.trackEvent('sector_filter_click', { sector: sectorId, url: targetUrl });
    navigate(targetUrl);
  };

  return (
    <div className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Sector Expertise</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            Engineered for Your Industry. <br className="hidden sm:inline" />
            <span className="text-zinc-400">Proven Patterns That Convert.</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Generic website templates fail because every commercial sector has distinct buyer psychology. We design bespoke conversion paths calibrated specifically for your industry's decision-makers in {currentMarket === 'mw' ? 'Southern Africa' : 'North America'}.
          </p>
        </div>

        {/* Sector Navigation Filter Bar */}
        <div className="mb-10 pb-4 border-b border-white/[0.08]" ref={filterContainerRef}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Filter by Commercial Vertical:
            </span>
            {activeSector !== 'all' && (
              <button
                type="button"
                onClick={() => handleSelectSector('all')}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to All Sectors (8)</span>
              </button>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSelectSector('all')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition-all border cursor-pointer ${
                activeSector === 'all'
                  ? 'bg-white/15 border-white/30 text-white font-bold shadow-sm'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All Verticals (8)
            </button>
            {INDUSTRIES_DATA.map((ind) => {
              const isSelected = activeSector === ind.id;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => handleSelectSector(ind.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 border-white/30 text-white font-bold shadow-sm'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{ind.emoji}</span>
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sector Spotlight Active Banner if Deep Filtered */}
        {activeIndustryMeta && activeSector !== 'all' && (
          <div className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeIndustryMeta.emoji}</span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                  DEEP SECTOR SPECIFICATION
                </div>
                <div className="font-display text-base sm:text-lg font-bold text-white">
                  {activeIndustryMeta.name} — {activeIndustryMeta.head}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectSector('all')}
              className="shrink-0 font-mono text-xs text-zinc-400 hover:text-white underline uppercase transition-colors cursor-pointer"
            >
              View All 8 Sectors
            </button>
          </div>
        )}

        {/* Industry Cards Grid */}
        <div
          className={`grid gap-8 ${
            displayedIndustries.length === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {displayedIndustries.map((industry) => (
            <div
              key={industry.id}
              className="group rounded-xl border border-white/10 bg-[#090D12] overflow-hidden shadow-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-black/50">
                  <img
                    src={industry.img}
                    alt={industry.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080C10] via-transparent to-black/30" />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#080C10]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-mono text-xs text-[#EBECF0]">
                    <span>{industry.emoji}</span>
                    <span className="font-bold uppercase tracking-wider">{industry.name}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <h3 className="font-display text-lg font-semibold text-[#EBECF0] group-hover:text-white transition-colors leading-snug">
                    {industry.head}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {industry.lede}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                    <div className="font-mono text-[10px] uppercase text-[#64748B] font-semibold tracking-wider">
                      MEASURABLE OUTCOMES:
                    </div>
                    <ul className="space-y-1.5">
                      {industry.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-sans text-xs text-[#CBD5E1]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {industry.smart && (
                    <div className="rounded-lg bg-white/[0.03] border border-white/10 p-3 flex items-start gap-2 text-[11px] text-zinc-300 font-mono">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-zinc-400" />
                      <span>{industry.smart}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => {
                    studioAudio.playClick(1000);
                    onNavigate('contact');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 hover:border-white/30 py-2.5 font-mono text-xs font-bold text-white transition-all uppercase tracking-wider"
                >
                  <span>REQUEST INDUSTRY CONSULTATION</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner CTA */}
        <div className="mt-16 sm:mt-20 rounded-xl border border-white/10 bg-[#080B0E] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase font-semibold">
              <Zap className="h-3.5 w-3.5" />
              <span>Tailored Solutions for Your Industry</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
              We engineer bespoke digital systems for specialized verticals
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#94A3B8]">
              From logistics dashboards to specialized legal portals, our architectural methodology adapts to complex domain models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                studioAudio.playClick(1000);
                onNavigate('planner');
              }}
              className="cta-image-btn rounded-lg px-6 py-3 font-mono text-xs font-bold text-white uppercase tracking-wider shadow-lg hover:scale-[1.01]"
            >
              <span className="relative z-10">RUN AI PROJECT PLANNER</span>
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(950);
                onNavigate('contact');
              }}
              className="rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 font-mono text-xs font-semibold text-[#EBECF0] uppercase tracking-wider"
            >
              SCHEDULE STRATEGY CALL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
