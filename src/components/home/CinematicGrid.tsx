import React, { useState } from 'react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import { ProgressiveImage } from '../common/ProgressiveImage';
import {
  Sparkles,
  ArrowRight,
  Maximize2,
  Layers,
  Compass,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface CinematicGridProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
}

type FrameCategory = 'all' | 'architecture' | 'physics' | 'typography';

interface EditorialFrame {
  id: string;
  category: 'architecture' | 'physics' | 'typography';
  tag: string;
  title: string;
  subtitle: string;
  narrative: string;
  statLabel: string;
  statValue: string;
  imageUrl: string;
  imageAlt: string;
  aspect: string;
  glassClass: string;
  isFlagship?: boolean;
}

export const CinematicGrid: React.FC<CinematicGridProps> = ({
  onNavigate,
  currentMarket,
}) => {
  const [activeFilter, setActiveFilter] = useState<FrameCategory>('all');
  const [hoveredFrame, setHoveredFrame] = useState<string | null>(null);

  const frames: EditorialFrame[] = [
    {
      id: 'frame-arch',
      category: 'architecture',
      tag: '// 01 STRUCTURAL TECTONICS',
      title: 'Architectural Purity & Spatial Balance',
      subtitle: 'Zero digital bloat. Uncompromised structural elegance.',
      narrative:
        'We construct digital flagships the way modern master architects build cantilevered pavilions: every line of TypeScript carries load, every negative space directs attention, and every decorative excess is rigorously stripped away.',
      statLabel: 'LIGHTHOUSE BENCHMARK',
      statValue: '99/100 SPEED',
      imageUrl:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      imageAlt:
        'Modern minimalist cantilevered concrete and glass pavilion with twilight reflections',
      aspect: 'aspect-[4/3] lg:aspect-[16/11]',
      glassClass: 'glass-dominant',
      isFlagship: true,
    },
    {
      id: 'frame-physics',
      category: 'physics',
      tag: '// 02 COMPUTATIONAL PHYSICS',
      title: 'Fluid Motion Without Data Penalties',
      subtitle: 'WebGL shaders and kinetic physics calibrated for mobile bandwidth.',
      narrative:
        'Kinetic feedback is not an ornament—it is an orientation mechanism. We deploy hardware-accelerated shaders and friction loops that respond to human touch in sub-16ms frames.',
      statLabel: 'FRAME RATE CADENCE',
      statValue: '60–120 FPS',
      imageUrl:
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=75',
      imageAlt:
        'Abstract refractive iridescent 3D crystal sculpture floating in twilight dark space',
      aspect: 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9]',
      glassClass: 'glass-violet',
    },
    {
      id: 'frame-typo',
      category: 'typography',
      tag: '// 03 TYPOGRAPHIC CALIPER',
      title: 'Mathematical Scale & Optical Pacing',
      subtitle: 'Golden ratio baseline grids and AAA accessibility contrast.',
      narrative:
        'Every headline step, baseline margin, and tracking unit follows mathematical proportions. The result is typography that breathes with natural authority on desktop, tablet, and mobile screens.',
      statLabel: 'CONTRAST RATIO',
      statValue: '14.8:1 AAA',
      imageUrl:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75',
      imageAlt:
        'Macro lens view of tactile architectural blueprints, calipers, and geometric typography',
      aspect: 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9]',
      glassClass: 'glass-teal',
    },
  ];

  const filteredFrames =
    activeFilter === 'all'
      ? frames
      : frames.filter((f) => f.category === activeFilter);

  return (
    <section
      id="section-cinematic-grid"
      className="relative z-10 w-full border-t border-white/[0.08] bg-[#06080B]/90 backdrop-blur-md py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#008280]/15 via-[#16D2C8]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Editorial Rigor */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 sm:mb-20">
          <GsapStaggerReveal stagger={0.12} yOffset={24} className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase font-semibold">
              <Compass className="h-3.5 w-3.5 text-[#16D2C8]" />
              <span>EDITORIAL COMPOSITION // CINEMATIC GRID</span>
            </div>

            <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.3rem)] font-black tracking-[-0.035em] text-[#EBECF0] leading-[1.08] uppercase">
              The Architecture of Distinction. <br className="hidden sm:inline" />
              <span className="title-gradient-teal">Where Art Direction Meets Engineering.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed max-w-[65ch]">
              We reject flat, monotonous page templates. By juxtaposing cinematic photography,
              tactile geometry, and disciplined typography, we create an asymmetrical visual
              rhythm that commands immediate respect and guides visitor intent.
            </p>
          </GsapStaggerReveal>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {(
              [
                { key: 'all', label: 'ALL FRAMES' },
                { key: 'architecture', label: 'STRUCTURE' },
                { key: 'physics', label: 'PHYSICS' },
                { key: 'typography', label: 'TYPOGRAPHY' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  studioAudio.playClick(900);
                  setActiveFilter(tab.key);
                }}
                className={`px-3.5 py-2 rounded-lg border transition-all duration-300 font-semibold tracking-wider ${
                  activeFilter === tab.key
                    ? 'bg-[#008280] text-white border-[#16D2C8]/50 shadow-[0_0_15px_rgba(0,130,128,0.4)] scale-105'
                    : 'bg-white/[0.04] text-[#94A3B8] border-white/10 hover:border-[#008280]/40 hover:text-[#EBECF0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ASYMMETRICAL EDITORIAL BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* 1. Flagship Left Editorial Frame (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col">
            {filteredFrames.find((f) => f.id === 'frame-arch') && (
              <div
                onMouseEnter={() => {
                  studioAudio.playHover();
                  setHoveredFrame('frame-arch');
                }}
                onMouseLeave={() => setHoveredFrame(null)}
                className="group relative h-full rounded-2xl border border-white/10 glass-dominant overflow-hidden flex flex-col justify-between shadow-2xl transition-all duration-500 hover:border-[#16D2C8]/60 hover:shadow-[0_20px_50px_rgba(0,130,128,0.25)]"
              >
                {/* Visual Image Layer with Progressive Loading & Zero Layout Shift */}
                <div className="relative w-full overflow-hidden bg-[#050607]">
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern minimalist cantilevered concrete and glass pavilion with twilight reflections"
                    aspectRatio="16/10"
                    priority={true}
                    overlayScrim="editorial"
                    imageClassName="brightness-[0.62] contrast-[1.08]"
                  />

                  {/* Corner Spatial Coordinates */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-[#EBECF0] z-30 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#06080B]/80 backdrop-blur-md border border-white/15">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-pulse" />
                      <span className="tracking-wider">ARCHITECTURAL TECTONICS</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06080B]/80 backdrop-blur-md border border-white/10 text-[#94A3B8]">
                      <span>{currentMarket === 'mw' ? 'LILONGWE // BLANTYRE' : 'CALGARY // CHESTERMERE'}</span>
                    </div>
                  </div>

                  {/* Bottom Metric Pill Floating Over Image */}
                  <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#008280]/60 backdrop-blur-md border border-[#16D2C8]/40 font-mono text-[11px] font-bold text-[#16D2C8] tracking-wider shadow-lg">
                      <Zap className="h-3 w-3" />
                      <span>SUB-0.8S CORE SPEED</span>
                    </span>
                  </div>
                </div>

                {/* Narrative & Typographic Body */}
                <div className="p-7 sm:p-9 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-3">
                    <div className="font-mono text-xs text-[#16D2C8] tracking-widest uppercase font-semibold">
                      // 01 STRUCTURAL PURITY
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EBECF0] tracking-tight leading-snug">
                      Engineered Like Fine Architecture. <br className="hidden sm:inline" />
                      Zero Digital Bloat.
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
                      We construct digital flagships the way modern master architects build cantilevered pavilions: every line of TypeScript carries load, every negative space directs attention, and every decorative excess is rigorously stripped away. Sub-second performance is not an afterthought—it is the foundation.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#008280]/20 border border-[#008280]/50 flex items-center justify-center font-mono text-xs font-bold text-[#16D2C8]">
                        99
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-[#94A3B8] uppercase">LIGHTHOUSE SCORE</div>
                        <div className="font-sans text-xs font-bold text-[#EBECF0]">Google Core Web Vitals Pass</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        studioAudio.playClick(950);
                        onNavigate('services');
                      }}
                      className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#16D2C8] hover:text-white transition-colors group/btn"
                    >
                      <span>INSPECT SPECIFICATIONS</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Right Asymmetrical Stack (Cols 8-12): Two Layered Editorial Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {/* Upper Right: Physics & Kinetic Shaders */}
            {filteredFrames.find((f) => f.id === 'frame-physics') && (
              <div
                onMouseEnter={() => {
                  studioAudio.playHover();
                  setHoveredFrame('frame-physics');
                }}
                onMouseLeave={() => setHoveredFrame(null)}
                className="group relative rounded-2xl border border-white/10 glass-violet p-6 sm:p-8 overflow-hidden shadow-xl transition-all duration-500 hover:border-[#16D2C8]/50 flex flex-col justify-between"
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#16D2C8] font-bold tracking-widest">// 02 COMPUTATIONAL PHYSICS</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-[#CBD5E1]">
                      60–120 FPS
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#EBECF0] tracking-tight">
                    Fluid Kinetic Shaders with Zero Data Penalties
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    Kinetic feedback is not an ornament—it is an orientation mechanism. We harness WebGL, Three.js, and GLSL shaders to craft tactile micro-interactions that respond dynamically to touch while keeping data footprints featherlight.
                  </p>
                </div>

                {/* Sub-visual Banner with Progressive Image & Aspect Ratio Preservation */}
                <div className="mt-5 relative overflow-hidden rounded-xl border border-white/10 w-full bg-[#07090C]">
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=75"
                    alt="Abstract refractive iridescent 3D crystal sculpture floating in twilight dark space"
                    aspectRatio="21/9"
                    overlayScrim="bottom"
                    imageClassName="brightness-[0.6] contrast-[1.1]"
                  />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[#16D2C8] z-30 pointer-events-none">
                    <span>GPU HARDWARE ACCELERATED</span>
                    <span className="text-[#94A3B8]">0.00% TEXTURE BLOAT</span>
                  </div>
                </div>
              </div>
            )}

            {/* Lower Right: Typographic Caliper & Mathematical Grids */}
            {filteredFrames.find((f) => f.id === 'frame-typo') && (
              <div
                onMouseEnter={() => {
                  studioAudio.playHover();
                  setHoveredFrame('frame-typo');
                }}
                onMouseLeave={() => setHoveredFrame(null)}
                className="group relative rounded-2xl border border-white/10 glass-teal p-6 sm:p-8 overflow-hidden shadow-xl transition-all duration-500 hover:border-[#008280]/60 flex flex-col justify-between"
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#008280] font-bold tracking-widest">// 03 TYPOGRAPHIC CALIPER</span>
                    <span className="px-2 py-0.5 rounded bg-[#008280]/20 text-[9px] font-mono text-[#16D2C8]">
                      14.8:1 AAA
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#EBECF0] tracking-tight">
                    Mathematical Pacing &amp; Optical Balance
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                    Every headline step, baseline margin, and tracking unit follows mathematical proportions derived from the golden ratio. The result is typography that breathes with natural authority on desktop, tablet, and mobile screens.
                  </p>
                </div>

                {/* Macro Detail Fragment with Progressive Image */}
                <div className="mt-5 relative overflow-hidden rounded-xl border border-white/10 w-full bg-[#07090C]">
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75"
                    alt="Macro lens view of tactile architectural blueprints, calipers, and geometric typography"
                    aspectRatio="21/9"
                    overlayScrim="bottom"
                    imageClassName="brightness-[0.58] contrast-[1.15]"
                  />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[#008280] z-30 pointer-events-none">
                    <span className="text-[#16D2C8]">φ 1.618 RATIO BASELINE</span>
                    <span className="text-[#94A3B8]">OPTICAL 8PX GRID</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Full-Width Asymmetrical Horizon Dossier (Studio Atelier & Verification Strip) */}
        <div className="rounded-2xl border border-white/10 glass-smoke p-7 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Studio Workbench Photography Fragment */}
            <div className="lg:col-span-5 relative overflow-hidden rounded-xl border border-white/10 bg-[#050607] group">
              <ProgressiveImage
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=75"
                alt="Studio atelier workbench with high-resolution test displays, mechanical keyboards, and architectural layouts"
                aspectRatio="16/10"
                overlayScrim="bottom"
                imageClassName="brightness-[0.6] contrast-[1.1]"
              />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-[#16D2C8] z-30 pointer-events-none">
                <span className="font-semibold tracking-wider">DUAL STUDIO ATELIER</span>
                <span className="text-[#94A3B8]">{currentMarket === 'mw' ? 'BLANTYRE & LILONGWE' : 'CALGARY & CHESTERMERE'}</span>
              </div>
            </div>

            {/* Right: Architectural Triad & Call to Action */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs text-[#008280] font-semibold tracking-wider uppercase">
                  <Activity className="h-3.5 w-3.5 text-[#16D2C8]" />
                  <span>THE THREE PILLARS OF UNIQUE AMAZE DELIVERY</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EBECF0] tracking-tight">
                  Crafted for Longevity. Protected for Growth.
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#16D2C8]">01 // ERGONOMICS</div>
                  <div className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
                    Engineered phone-first with 44px+ touch targets and 0 layout shift.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#16D2C8]">02 // INTELLIGENCE</div>
                  <div className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
                    Conversational Sage AI assistants qualifying high-intent leads 24/7.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-[#16D2C8]">03 // HARDENING</div>
                  <div className="font-sans text-xs text-[#CBD5E1] leading-relaxed">
                    Managed cloud care, daily offsite backups, and sub-1.2s uptime SLA.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-mono text-xs text-[#94A3B8]">
                  TRANSPARENT 5-STEP A.M.A.Z.E.™ PROCESS &bull; ZERO COMMODITIZATION
                </div>

                <button
                  onClick={() => {
                    studioAudio.playClick(950);
                    onNavigate('process');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008280] hover:bg-[#009491] px-5 py-3 font-mono text-xs font-bold text-white shadow-md transition-all uppercase tracking-wider"
                >
                  <span>EXPLORE OUR PROCESS</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
