import React, { useState } from 'react';
import { PageRoute, ProjectCard } from '../../types';
import { PROJECTS_DATA, LOGO_DATA_URI } from '../../data/uniqueAmazeData';
import { CaseStudyModal } from './CaseStudyModal';
import { BrandDivider } from '../common/BrandDivider';
import { ProgressiveImage } from '../common/ProgressiveImage';
import { studioAudio } from '../../utils/audio';
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  RotateCw,
  Layers,
  LayoutGrid,
  Maximize2,
  SlidersHorizontal,
  CheckCircle2,
  TrendingUp,
  Globe
} from 'lucide-react';

interface WorkViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const WorkView: React.FC<WorkViewProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);
  const [activeAccordionId, setActiveAccordionId] = useState<string>(PROJECTS_DATA[0].id);
  const [viewMode, setViewMode] = useState<'accordion' | 'grid'>('accordion');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Flagships' },
    { id: 'music', label: 'Music & Culture' },
    { id: 'wellness', label: 'Wellness & Clinics' },
    { id: 'product', label: 'Product & Brand' },
    { id: 'community', label: 'Community & Faith' },
    { id: 'lab', label: 'Concept Lab' },
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'music')
      return p.category.toLowerCase().includes('music') || p.category.toLowerCase().includes('culture');
    if (activeCategory === 'wellness') return p.category.toLowerCase().includes('wellness');
    if (activeCategory === 'product')
      return p.category.toLowerCase().includes('product') || p.category.toLowerCase().includes('brand');
    if (activeCategory === 'community')
      return p.category.toLowerCase().includes('church') || p.category.toLowerCase().includes('presence');
    if (activeCategory === 'lab')
      return p.category.toLowerCase().includes('lab') || p.category.toLowerCase().includes('ai');
    return true;
  });

  // Ensure active accordion item is always valid inside filtered set
  const currentActiveProject =
    filteredProjects.find((p) => p.id === activeAccordionId) || filteredProjects[0] || PROJECTS_DATA[0];

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    studioAudio.playClick(900);
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative w-full py-20 sm:py-28 lg:py-32">
      {/* Header & Sub-header (Titles in UPPERCASE, not as bold as landing page) */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4">
            <Layers className="h-3.5 w-3.5" />
            <span>SELECTED WORK // ARCHITECTURAL PORTFOLIO</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            EVERY PROJECT BEGINS AS A SPARK.{' '}
            <span className="text-[#008280] block sm:inline">THEN WE SHAPE IT INTO AN EXPERIENCE.</span>
          </h1>

          <p className="mt-8 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Explore our curated flagship portfolio. Interactive digital systems engineered for high-intent client conversion, sub-second speed, and authoritative presence.
          </p>
        </div>

        {/* Filter Controls & Layout Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 sm:mt-14 sm:pt-10 border-t border-white/[0.08]">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#64748B] mr-1 uppercase">FILTER:</span>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  studioAudio.playClick(800);
                  setActiveCategory(c.id);
                  const firstMatching = PROJECTS_DATA.find((p) => {
                    if (c.id === 'all') return true;
                    if (c.id === 'music')
                      return p.category.toLowerCase().includes('music') || p.category.toLowerCase().includes('culture');
                    if (c.id === 'wellness') return p.category.toLowerCase().includes('wellness');
                    if (c.id === 'product')
                      return p.category.toLowerCase().includes('product') || p.category.toLowerCase().includes('brand');
                    if (c.id === 'community')
                      return p.category.toLowerCase().includes('church') || p.category.toLowerCase().includes('presence');
                    if (c.id === 'lab')
                      return p.category.toLowerCase().includes('lab') || p.category.toLowerCase().includes('ai');
                    return true;
                  });
                  if (firstMatching) {
                    setActiveAccordionId(firstMatching.id);
                  }
                }}
                className={`rounded-md px-3.5 py-1.5 font-mono text-xs transition-all uppercase ${
                  activeCategory === c.id
                    ? 'bg-[#008280] text-[#EBECF0] font-bold shadow-[0_0_15px_rgba(0,130,128,0.3)]'
                    : 'border border-white/10 bg-[#0E1217] text-[#94A3B8] hover:border-white/20 hover:text-[#EBECF0]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Interactive Accordion vs Grid Deck */}
          <div className="flex items-center gap-1 rounded-md border border-white/10 bg-[#0C1014] p-1 font-mono text-xs">
            <button
              onClick={() => {
                studioAudio.playClick(850);
                setViewMode('accordion');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all uppercase ${
                viewMode === 'accordion'
                  ? 'bg-[#008280] text-[#EBECF0] font-bold shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#EBECF0]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>ACCORDION VIEW</span>
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(850);
                setViewMode('grid');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all uppercase ${
                viewMode === 'grid'
                  ? 'bg-[#008280] text-[#EBECF0] font-bold shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#EBECF0]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>GRID DECK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Portfolio Viewport */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 1. HORIZONTAL EXPANDING ACCORDION (Matches Reference Pattern from Screenshot) */}
        {/* ========================================================================= */}
        {viewMode === 'accordion' && (
          <div className="space-y-6">
            {/* Desktop Horizontal Accordion Layout (>= lg) */}
            <div className="hidden lg:flex gap-3 xl:gap-4 h-[580px] w-full items-stretch select-none">
              {filteredProjects.map((project, index) => {
                const isActive = project.id === currentActiveProject.id;

                if (isActive) {
                  // EXPANDED CARD (Takes primary width ~ 65-75% with rich background and interactive controls)
                  return (
                    <div
                      key={project.id}
                      className="work-expanded-card relative flex-1 rounded-xl overflow-hidden border border-[#16D2C8]/45 glass-dominant shadow-2xl transition-all duration-500 ease-out flex flex-col justify-between"
                    >
                      {/* Background Image with Dark Atmospheric Gradient and Progressive Loading */}
                      <div className="absolute inset-0 z-0">
                        <ProgressiveImage
                          src={project.image}
                          alt={project.title}
                          aspectRatio="auto"
                          className="h-full w-full"
                          overlayScrim="editorial"
                          imageClassName="brightness-[0.38] contrast-[1.08]"
                        />
                      </div>

                      {/* Top Header Strip inside Card */}
                      <div className="relative z-10 p-8 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-[#050607]/80 to-transparent">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#16D2C8] px-2.5 py-1 rounded bg-[#050607]/90 border border-white/10">
                            0{index + 1}
                          </span>
                          <span className="font-mono text-xs uppercase tracking-widest text-[#16D2C8] font-semibold">
                            {project.category}
                          </span>
                        </div>

                        {/* Status Beacon */}
                        <div className="flex items-center gap-2 font-mono text-[11px] text-[#16D2C8] bg-[#050607]/80 px-3 py-1 rounded border border-[#008280]/40">
                          <span className="h-2 w-2 rounded-full bg-[#16D2C8] animate-pulse" />
                          <span>LIVE FLAGSHIP</span>
                        </div>
                      </div>

                      {/* Center Content Body */}
                      <div className="relative z-10 p-8 sm:p-14 max-w-2xl space-y-6">
                        <h2 className="font-display text-2xl sm:text-3xl xl:text-4xl font-semibold tracking-wide text-[#EBECF0] uppercase leading-[1.1]">
                          {project.title}
                        </h2>

                        <p className="font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed line-clamp-3">
                          {project.description}
                        </p>

                        {/* Metrics Bar */}
                        {project.metrics && project.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-4 pt-3">
                            {project.metrics.map((m, i) => (
                              <div
                                key={i}
                                className="rounded-md glass-smoke border border-white/10 px-4 py-2.5 font-mono text-xs"
                              >
                                <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">
                                  {m.label}
                                </span>
                                <span className="text-[#16D2C8] font-bold text-sm">{m.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-5">
                          <button
                            onClick={() => {
                              studioAudio.playClick(1100);
                              setSelectedProject(project);
                            }}
                            className="cta-image-btn flex items-center gap-2 rounded-md px-6 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all uppercase hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span className="relative z-10">EXPLORE CASE STUDY</span>
                            <ArrowRight className="relative z-10 h-4 w-4" />
                          </button>

                          {project.liveUrl && project.liveUrl.startsWith('http') && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="cta-secondary-btn flex items-center gap-2 rounded-md border px-5 py-3.5 font-mono text-xs font-semibold transition-all uppercase hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <span>LAUNCH LIVE SITE</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Bottom Footer Strip */}
                      <div className="relative z-10 px-8 py-4 border-t border-white/10 bg-[#050607]/80 flex items-center justify-between font-mono text-[11px] text-[#94A3B8]">
                        <span>UNIQUE AMAZE ARCHITECTURAL DECK</span>
                        <span className="text-[#16D2C8] font-semibold">CLICK OTHER PANELS TO EXPAND</span>
                      </div>
                    </div>
                  );
                }

                // COLLAPSED VERTICAL TAB (Slim column with vertical text)
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      studioAudio.playClick(950);
                      setActiveAccordionId(project.id);
                    }}
                    className="group relative w-16 xl:w-20 rounded-xl overflow-hidden border border-white/10 glass-smoke hover:border-[#16D2C8]/50 transition-all duration-300 flex flex-col items-center justify-between py-6 px-2 cursor-pointer shadow-md"
                    title={`Expand ${project.title}`}
                  >
                    {/* Ghost background image on hover */}
                    <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                      <img src={project.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </div>

                    {/* Top Index Pill */}
                    <div className="relative z-10 h-7 w-7 rounded bg-[#050607] border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-[#94A3B8] group-hover:text-[#16D2C8] group-hover:border-[#16D2C8]/50 transition-colors">
                      0{index + 1}
                    </div>

                    {/* Vertical Running Title (Matches reference screenshot style) */}
                    <div className="relative z-10 flex-1 flex items-center justify-center my-4 overflow-hidden">
                      <span className="font-display text-xs xl:text-sm font-semibold uppercase tracking-wider text-[#CBD5E1] whitespace-nowrap [writing-mode:vertical-rl] rotate-180 group-hover:text-[#16D2C8] transition-colors">
                        {project.title}
                      </span>
                    </div>

                    {/* Bottom Status Dot / Arrow */}
                    <div className="relative z-10 h-6 w-6 rounded bg-[#050607]/80 border border-white/10 flex items-center justify-center text-[#94A3B8] group-hover:text-[#16D2C8] group-hover:border-[#16D2C8]/50 transition-colors">
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile / Tablet Responsive Accordion (< lg) */}
            <div className="lg:hidden space-y-4">
              {filteredProjects.map((project, index) => {
                const isActive = project.id === currentActiveProject.id;
                return (
                  <div
                    key={project.id}
                    className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? 'border-[#008280]/50 glass-tier-2 shadow-xl'
                        : 'border-white/10 glass-tier-1'
                    }`}
                  >
                    {/* Accordion Header Bar */}
                    <button
                      onClick={() => {
                        studioAudio.playClick(950);
                        setActiveAccordionId(isActive ? '' : project.id);
                      }}
                      className="w-full flex items-center justify-between p-5 text-left font-mono text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#367588]">0{index + 1}</span>
                        <span className="font-display text-sm font-semibold text-[#EBECF0] uppercase tracking-wide">
                          {project.title}
                        </span>
                      </div>
                      <span
                        className={`text-xs uppercase px-2.5 py-1 rounded font-bold ${
                          isActive
                            ? 'bg-[#008280] text-[#EBECF0]'
                            : 'bg-white/5 text-[#94A3B8]'
                        }`}
                      >
                        {isActive ? 'CLOSE' : 'EXPAND'}
                      </span>
                    </button>

                    {/* Expanded Content Drawer */}
                    {isActive && (
                      <div className="p-5 pt-0 space-y-4 animate-in fade-in duration-200">
                        <div className="relative w-full rounded-md overflow-hidden border border-white/10">
                          <ProgressiveImage
                            src={project.image}
                            alt={project.title}
                            aspectRatio="16/9"
                            overlayScrim="bottom"
                          />
                          <div className="absolute top-2 left-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] text-[#16D2C8] z-30">
                            {project.category}
                          </div>
                        </div>

                        <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => {
                              studioAudio.playClick(1100);
                              setSelectedProject(project);
                            }}
                            className="cta-image-btn flex-1 py-2.5 rounded text-white font-mono text-xs font-bold text-center uppercase shadow-md hover:scale-[1.01] active:scale-[0.99]"
                          >
                            <span className="relative z-10">EXPLORE CASE STUDY</span>
                          </button>

                          {project.liveUrl && project.liveUrl.startsWith('http') && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="cta-secondary-btn px-4 py-2.5 rounded border font-mono text-xs flex items-center justify-center uppercase hover:border-[#008280]"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. GRID DECK VIEW (Alternative Classical Multi-Column Layout)             */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProjects.map((project, idx) => {
              const isFlipped = !!flippedCards[project.id];
              const cardGlass =
                project.category.toLowerCase().includes('wellness')
                  ? 'glass-teal'
                  : project.category.toLowerCase().includes('product')
                  ? 'glass-slate'
                  : project.category.toLowerCase().includes('church') || project.category.toLowerCase().includes('presence')
                  ? 'glass-violet'
                  : idx === 0
                  ? 'glass-dominant'
                  : 'glass-smoke';

              return (
                <div
                  key={project.id}
                  data-cursor="card"
                  onClick={() => {
                    if (!project.isFutureCard) {
                      studioAudio.playClick(1000);
                      setSelectedProject(project);
                    } else {
                      onNavigate('contact');
                    }
                  }}
                  className={`group relative rounded-xl border border-white/10 ${cardGlass} overflow-hidden transition-all duration-300 hover:border-[#16D2C8]/50 hover:shadow-xl cursor-pointer flex flex-col justify-between`}
                  style={{ perspective: '1200px' }}
                >
                  {/* 3D Flip Container */}
                  <div
                    className={`w-full transition-transform duration-500 transform-gpu ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* FRONT FACE */}
                    <div className="relative w-full [backface-visibility:hidden]">
                      <div className="relative w-full overflow-hidden bg-[#0A0D10]">
                        <ProgressiveImage
                          src={project.image}
                          alt={project.title}
                          aspectRatio="16/10"
                          overlayScrim="bottom"
                        />

                        <div className="absolute top-3 inset-x-3 flex justify-between items-center z-30 pointer-events-auto">
                          <span className="rounded bg-[#050607]/80 px-3 py-1 font-mono text-[10px] text-[#16D2C8] border border-white/10 backdrop-blur-md font-semibold">
                            {project.category}
                          </span>

                          <button
                            onClick={(e) => toggleFlip(project.id, e)}
                            className="flex items-center gap-1 rounded bg-[#050607]/80 px-2.5 py-1 font-mono text-[10px] text-[#CBD5E1] border border-white/10 hover:border-[#16D2C8] hover:text-[#16D2C8] transition-colors"
                            title="Flip card"
                          >
                            <RotateCw className="h-3 w-3" />
                            <span>FLIP</span>
                          </button>
                        </div>

                        {project.metrics && project.metrics[0] && (
                          <div className="absolute bottom-3 left-3 rounded bg-[#050607]/90 px-2.5 py-1 font-mono text-[11px] text-[#16D2C8] border border-white/10 z-30">
                            {project.metrics[0].label}: <b className="text-[#EBECF0]">{project.metrics[0].value}</b>
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-8 space-y-3">
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-[#EBECF0] group-hover:text-[#16D2C8] transition-colors uppercase tracking-wide">
                          {project.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="pt-4 flex items-center justify-between font-mono text-xs text-[#008280]">
                          <span className="flex items-center gap-1 uppercase font-semibold text-[#16D2C8]">
                            {project.isFutureCard ? 'RESERVE THIS SLOT' : 'EXPLORE CASE STUDY'}
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>

                          {project.liveUrl && project.liveUrl.startsWith('http') && (
                            <span className="text-[#94A3B8] hover:text-[#EBECF0] flex items-center gap-1 text-[11px]">
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="absolute inset-0 w-full h-full p-8 rounded-xl glass-dominant border border-[#16D2C8]/40 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="h-10 w-10 overflow-hidden rounded border border-white/10 bg-[#0C1014] p-1">
                          <img
                            src={LOGO_DATA_URI}
                            alt="Unique Amaze"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <button
                          onClick={(e) => toggleFlip(project.id, e)}
                          className="flex items-center gap-1 rounded bg-[#050607]/80 px-2.5 py-1 font-mono text-[10px] text-[#367588] border border-white/10 hover:border-[#008280]"
                        >
                          <RotateCw className="h-3 w-3" />
                          <span>FLIP BACK</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-center py-4">
                        <div className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wide">
                          UNIQUE AMAZE
                        </div>
                        <div className="font-mono text-xs text-[#008280] tracking-widest uppercase">
                          {project.title}
                        </div>
                        <p className="font-sans text-xs text-[#94A3B8] leading-relaxed pt-2">
                          {project.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex justify-between items-center font-mono text-[10px] text-[#64748B] uppercase">
                        <span>1-TO-1 SPECIALIST</span>
                        <span className="text-[#008280]">READY FOR PRODUCTION</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Subtle Horizontal Divider: Portfolio to Conversion Banner */}
        <BrandDivider
          variant="teal"
          width="container"
          spacing="xl"
          label="COMMISSION YOUR PROJECT"
          sublabel="TAILORED STRATEGY"
        />

        {/* Conversion Action Banner with Architectural Image Background */}
        <div className="cta-image-container group rounded-xl border border-white/10 p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80"
            alt="Unique Amaze Modern Architecture Space"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Adaptive Contrast Scrim */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="relative z-10 max-w-xl">
            <span className="font-mono text-xs text-[#008280] uppercase tracking-widest block mb-2 font-bold">
              WANT A FLAGSHIP LIKE THESE?
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
              LET’S ARCHITECT YOUR DIGITAL PRESENCE FROM THE GROUND UP.
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#94A3B8] font-sans leading-relaxed">
              Every project is individually crafted with high-intent UX, sub-second performance, and quiet conversational AI.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => {
                studioAudio.playClick(950);
                onNavigate('planner');
              }}
              className="cta-image-btn group/btn relative overflow-hidden rounded-lg px-6 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="relative z-10 h-4 w-4 text-white" />
              <span className="relative z-10 text-white">PROJECT PLANNER</span>
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(800);
                onNavigate('contact');
              }}
              className="cta-secondary-btn rounded-lg border px-6 py-3.5 font-mono text-xs font-bold transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              SCHEDULE A CALL
            </button>
          </div>
        </div>
      </div>

      {/* Case Study Modal Detail View */}
      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
