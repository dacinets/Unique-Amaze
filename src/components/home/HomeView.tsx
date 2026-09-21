import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, MarketType, ProjectCard } from '../../types';
import { HeroSection } from './HeroSection';
import { ValueIntro } from './ValueIntro';
import { AmazeCapabilitiesPinned } from './AmazeCapabilitiesPinned';
import { KineticShiftStatement } from './KineticShiftStatement';
import { TransformationCards } from './TransformationCards';
import { CinematicGrid } from './CinematicGrid';
import { ProjectOrbitGallery } from './ProjectOrbitGallery';
import { SpatialScrollHUD } from '../common/SpatialScrollHUD';
import { AbstractWireframeBackground } from '../common/AbstractWireframeBackground';
import { ScrollFlyIn } from '../common/ScrollFlyIn';
import { RevealText } from '../common/RevealText';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import { PROJECTS_DATA } from '../../data/uniqueAmazeData';
import { CaseStudyModal } from '../work/CaseStudyModal';
import { BrandDivider } from '../common/BrandDivider';
import { studioAudio } from '../../utils/audio';
import { scrollEngine } from '../../utils/scrollEngine';
import { useScrollEngine } from '../../utils/useScrollEngine';
import { Sparkles, ArrowRight, Layers, ShieldCheck, Zap, Globe, Cpu, Check, CheckCircle2 } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
  onMarketChange: (market: MarketType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  currentMarket,
  onMarketChange,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);
  const [activeSection, setActiveSection] = useState('section-hero');
  const scrollState = useScrollEngine();

  // Detect active section based on scroll state
  useEffect(() => {
    const sections = [
      'section-hero',
      'section-value',
      'section-capabilities',
      'section-shift',
      'section-transformation',
      'section-cinematic-grid',
      'section-showcase',
      'section-cta',
    ];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          setActiveSection(id);
          break;
        }
      }
    }
  }, [scrollState.scrollY]);

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      scrollEngine.scrollTo(el, { offset: -60, duration: 1.2 });
    }
  };

  // Region-aware project priority:
  const featuredProjects = currentMarket === 'mw'
    ? [
        PROJECTS_DATA.find((p) => p.id === 'belle-afrique') || PROJECTS_DATA[2],
        PROJECTS_DATA.find((p) => p.id === 'fatsani-music') || PROJECTS_DATA[1],
        PROJECTS_DATA.find((p) => p.id === 'chestermere-massage') || PROJECTS_DATA[0],
        PROJECTS_DATA.find((p) => p.id === 'elvc-church') || PROJECTS_DATA[3],
        PROJECTS_DATA[4] || PROJECTS_DATA[0],
      ]
    : [
        PROJECTS_DATA.find((p) => p.id === 'chestermere-massage') || PROJECTS_DATA[0],
        PROJECTS_DATA.find((p) => p.id === 'fatsani-music') || PROJECTS_DATA[1],
        PROJECTS_DATA.find((p) => p.id === 'belle-afrique') || PROJECTS_DATA[2],
        PROJECTS_DATA.find((p) => p.id === 'elvc-church') || PROJECTS_DATA[3],
        PROJECTS_DATA[4] || PROJECTS_DATA[0],
      ];

  return (
    <div className="relative w-full">
      {/* Background Layer: 3D Perspective Abstract Wireframe with Parallax Depth */}
      <AbstractWireframeBackground />

      {/* Floating Telemetry HUD with Radial Progress Compass */}
      <SpatialScrollHUD
        scrollProgress={scrollState.scrollProgress ?? scrollState.progress ?? 0}
        activeSection={activeSection}
        onScrollTo={handleScrollTo}
      />

      {/* 1. Award-Winning Hero Stage with 3D Leaf Mark, Hold-to-Blast & Studio Workbench */}
      <div id="section-hero" className="relative z-10">
        <HeroSection
          onNavigate={onNavigate}
          currentMarket={currentMarket}
          onMarketChange={onMarketChange}
        />
      </div>

      {/* 2. Editorial Value Intro with Key Metrics (Regionally Tailored) */}
      <div id="section-value" className="relative z-10">
        <ValueIntro onNavigate={onNavigate} currentMarket={currentMarket} />
      </div>

      {/* Subtle Horizontal Divider: Value to Capabilities */}
      <BrandDivider
        variant="teal"
        width="container"
        spacing="none"
        className="py-3 sm:py-4"
        label="STUDIO CAPABILITIES"
        sublabel="ARCHITECTURE & AI"
      />

      {/* 3. Pinned Scrollytelling Section: Capabilities Stack */}
      <div className="relative z-10">
        <AmazeCapabilitiesPinned
          currentMarket={currentMarket}
          onNavigate={onNavigate}
        />
      </div>

      {/* 4. Kinetic Text Explosive Shift Statement */}
      <div className="relative z-10">
        <KineticShiftStatement />
      </div>

      {/* Subtle Horizontal Divider: Shift to Transformation */}
      <BrandDivider
        variant="gradient"
        width="container"
        spacing="none"
        className="py-3 sm:py-4"
        label="THE TRANSFORMATION"
        sublabel="BEFORE & AFTER"
      />

      {/* 5. Transformation Before/After Paradigm Comparison */}
      <div id="section-transformation" className="relative z-10">
        <TransformationCards />
      </div>

      {/* Subtle Horizontal Divider: Transformation to Cinematic Grid */}
      <BrandDivider
        variant="teal"
        width="container"
        spacing="none"
        className="py-3 sm:py-4"
        label="EDITORIAL COMPOSITION"
        sublabel="TACTILE CRAFT"
      />

      {/* 6. CinematicGrid: Asymmetrical Editorial Framing for Imagery & Typography */}
      <div className="relative z-10">
        <CinematicGrid
          onNavigate={onNavigate}
          currentMarket={currentMarket}
        />
      </div>

      {/* Subtle Horizontal Divider: Cinematic Grid to Showcase */}
      <BrandDivider
        variant="cyan"
        width="container"
        spacing="none"
        className="py-3 sm:py-4"
        label="SELECTED CLIENT WORK"
        sublabel="LIVE ARCHITECTURE"
      />

      {/* 7. Signature Amaze Orbit 3D / Editorial Project Gallery */}
      <div className="relative z-10">
        <ProjectOrbitGallery
          projects={featuredProjects}
          currentMarket={currentMarket}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onNavigate={onNavigate}
        />
      </div>

      {/* Subtle Horizontal Divider: Showcase to CTA */}
      <BrandDivider
        variant="teal"
        width="container"
        spacing="none"
        className="py-3 sm:py-4"
        label="PROJECT INITIATION"
        sublabel="START YOUR FLAGSHIP"
      />

      {/* 7. Closing Call to Action Banner with Architectural Image Background */}
      <section
        id="section-cta"
        className="cta-image-container group relative z-10 w-full border-t border-white/[0.08] py-12 sm:py-16 lg:py-20 overflow-hidden"
      >
        {/* Architectural Background Image */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
          alt="Unique Amaze Modern Architecture"
          loading="lazy"
          decoding="async"
          className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Theme-Adaptive Contrast Scrim Layer */}
        <div className="cta-scrim pointer-events-none absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 text-center">
          <GsapStaggerReveal stagger={0.12} yOffset={32} className="space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-[#008280]" />
              <span>LET’S BUILD SOMETHING EXTRAORDINARY</span>
            </div>

            <h2 className="font-display text-[clamp(1.9rem,4vw,3.5rem)] font-black tracking-[-0.035em] text-[#0F172A] dark:text-[#EBECF0] leading-[1.04] uppercase text-center">
              Ready to step into the future of business websites?
            </h2>

            <p className="font-sans text-sm sm:text-base md:text-lg text-slate-600 dark:text-[#94A3B8] max-w-[60ch] mx-auto leading-relaxed">
              {currentMarket === 'mw'
                ? 'Book a consultation for your Malawian business or launch our 2-minute interactive planner with instant MWK estimates.'
                : 'Book a consultation for your Canadian practice or launch our 2-minute interactive planner with instant CAD $ estimates.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
              {/* Primary CTA with Textured Image Background */}
              <button
                onClick={() => {
                  studioAudio.playClick(1100);
                  onNavigate('contact');
                }}
                className="cta-image-btn group/btn flex items-center gap-2.5 rounded-lg px-8 py-4 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  <span>BOOK A FREE STRATEGY CALL</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
              </button>

              {/* Secondary CTA with Subtle Backdrop */}
              <button
                onClick={() => {
                  studioAudio.playClick(900);
                  onNavigate('planner');
                }}
                className="cta-secondary-btn flex items-center gap-2 rounded-lg border px-8 py-4 font-mono text-xs font-bold transition-all uppercase tracking-wider hover:scale-[1.01]"
              >
                <Sparkles className="h-4 w-4 text-[#008280]" />
                <span className="relative z-10">LAUNCH PROJECT PLANNER</span>
              </button>
            </div>
          </GsapStaggerReveal>
        </div>
      </section>

      {/* Case Study Modal */}
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

