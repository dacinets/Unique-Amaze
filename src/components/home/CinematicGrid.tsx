import React, { useState } from 'react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import { ProgressiveImage } from '../common/ProgressiveImage';
import {
  Compass,
  Zap,
  ArrowRight,
  Activity,
  Layers,
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
      tag: '01 Structural Engineering',
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
      tag: '02 Kinetic Performance',
      title: 'Fluid Motion Without Data Penalties',
      subtitle: 'Calibrated micro-interactions and smooth hardware transitions.',
      narrative:
        'Kinetic feedback is not an ornament—it is an orientation mechanism. We deploy hardware-accelerated transitions and interaction loops that respond to human touch with precision.',
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
      tag: '03 Typographic Systems',
      title: 'Mathematical Scale & Optical Pacing',
      subtitle: 'Golden ratio baseline grids and AAA accessibility contrast.',
      narrative:
        'Every headline step, baseline margin, and tracking unit follows mathematical proportions. The result is typography that breathes with natural authority across all screens.',
      statLabel: 'CONTRAST RATIO',
      statValue: '14.8:1 AAA',
      imageUrl:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75',
      imageAlt:
        'Macro lens view of tactile architectural blueprints, calipers, and geometric typography',
      aspect: 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9]',
      glassClass: 'glass-smoke',
    },
  ];

  const filteredFrames =
    activeFilter === 'all'
      ? frames
      : frames.filter((f) => f.category === activeFilter);

  return (
    <section
      id="section-cinematic-grid"
      className="relative z-10 w-full border-t border-white/[0.08] bg-[#06080B]/90 backdrop-blur-md py-12 sm:py-14 lg:py-16 overflow-hidden"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 sm:mb-12">
          <GsapStaggerReveal stagger={0.12} yOffset={24} className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
              <Compass className="h-3.5 w-3.5 text-zinc-400" />
              <span>Design &amp; Engineering Rigor</span>
            </div>

            <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.3rem)] font-black tracking-[-0.035em] text-[#EBECF0] leading-[1.08] uppercase">
              The Architecture of Distinction. <br className="hidden sm:inline" />
              <span className="text-zinc-400">Where Art Direction Meets Engineering.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-[65ch]">
              We reject flat, monotonous page templates. By juxtaposing purposeful imagery,
              tactile geometry, and disciplined typography, we create a visual rhythm that
              commands immediate respect and guides visitor intent.
            </p>
          </GsapStaggerReveal>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'architecture', label: 'Architecture' },
                { key: 'physics', label: 'Motion' },
                { key: 'typography', label: 'Typography' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  studioAudio.playClick(900);
                  setActiveFilter(tab.key);
                }}
                className={`px-3.5 py-2 rounded-lg border transition-all duration-200 font-semibold tracking-wider ${
                  activeFilter === tab.key
                    ? 'bg-white/10 text-white border-white/25 shadow-sm'
                    : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PRESENTATION BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* 1. Flagship Left Frame (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col">
            {filteredFrames.find((f) => f.id === 'frame-arch') && (
              <div
                onMouseEnter={() => {
                  studioAudio.playHover();
                  setHoveredFrame('frame-arch');
                }}
                onMouseLeave={() => setHoveredFrame(null)}
                className="group relative h-full rounded-2xl border border-white/10 bg-[#090D12] overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/25"
              >
                {/* Visual Image Layer with Progressive Loading */}
                <div className="relative w-full overflow-hidden bg-[#050607]">
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Modern minimalist cantilevered concrete and glass pavilion with twilight reflections"
                    aspectRatio="16/10"
                    priority={true}
                    overlayScrim="editorial"
                    imageClassName="brightness-[0.65] contrast-[1.05]"
                  />
                </div>

                {/* Narrative & Typographic Body */}
                <div className="p-7 sm:p-9 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                      Engineered Like Fine Architecture. <br className="hidden sm:inline" />
                      Zero Digital Bloat.
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
                      We construct digital flagships the way modern master architects build cantilevered pavilions: every line of TypeScript carries load, every negative space directs attention, and every decorative excess is rigorously stripped away. Sub-second performance is not an afterthought—it is the foundation.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-white">
                        99
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-zinc-400 uppercase">LIGHTHOUSE SCORE</div>
                        <div className="font-sans text-xs font-bold text-zinc-200">Google Core Web Vitals Pass</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        studioAudio.playClick(950);
                        onNavigate('services');
                      }}
                      className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-300 hover:text-white transition-colors group/btn"
                    >
                      <span>INSPECT SPECIFICATIONS</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Right Asymmetrical Stack (Cols 8-12): Two Layered Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {/* Upper Right: Physics & Kinetic Shaders */}
            {filteredFrames.find((f) => f.id === 'frame-physics') && (
              <div
                onMouseEnter={() => {
                  studioAudio.playHover();
                  setHoveredFrame('frame-physics');
                }}
                onMouseLeave={() => setHoveredFrame(null)}
                className="group relative rounded-2xl border border-white/10 bg-[#090D12] p-6 sm:p-8 overflow-hidden shadow-xl transition-all duration-300 hover:border-white/25 flex flex-col justify-between"
              >
                <div className="relative z-10 space-y-3">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Fluid Motion with Zero Data Penalties
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Kinetic feedback is not an ornament—it is an orientation mechanism. We deploy hardware-accelerated transitions and interaction loops that respond dynamically to touch while keeping data footprints featherlight.
                  </p>
                </div>

                {/* Sub-visual Banner */}
                <div className="mt-5 relative overflow-hidden rounded-xl border border-white/10 w-full bg-[#07090C]">
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=75"
                    alt="Abstract refractive iridescent 3D crystal sculpture floating in twilight dark space"
                    aspectRatio="21/9"
                    overlayScrim="bottom"
                    imageClassName="brightness-[0.6] contrast-[1.1]"
                  />
                </div>
              </div>
            )}

            {/* Lower Right: Typographic Systems */}
            {filteredFrames.find((f) => f.id === 'frame-typo') && (
              <div
                onMouseEnter={() => {
                  studioAudio.playHover();
                  setHoveredFrame('frame-typo');
                }}
                onMouseLeave={() => setHoveredFrame(null)}
                className="group relative rounded-2xl border border-white/10 bg-[#090D12] p-6 sm:p-8 overflow-hidden shadow-xl transition-all duration-300 hover:border-white/25 flex flex-col justify-between"
              >
                <div className="relative z-10 space-y-3">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Mathematical Pacing &amp; Optical Balance
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Every headline step, baseline margin, and tracking unit follows mathematical proportions derived from the golden ratio. The result is typography that breathes with natural authority on desktop, tablet, and mobile screens.
                  </p>
                </div>

                {/* Macro Detail Fragment */}
                <div className="mt-5 relative overflow-hidden rounded-xl border border-white/10 w-full bg-[#07090C]">
                  <ProgressiveImage
                    src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75"
                    alt="Macro lens view of tactile architectural blueprints, calipers, and geometric typography"
                    aspectRatio="21/9"
                    overlayScrim="bottom"
                    imageClassName="brightness-[0.58] contrast-[1.15]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Full-Width Atelier Section */}
        <div className="rounded-2xl border border-white/10 bg-[#080B0E] p-7 sm:p-10 shadow-xl relative overflow-hidden">
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
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-end font-mono text-[10px] text-zinc-300 z-30 pointer-events-none">
                <span className="text-zinc-400">{currentMarket === 'mw' ? 'Blantyre & Lilongwe' : 'Calgary & Chestermere'}</span>
              </div>
            </div>

            {/* Right: Architectural Triad & Call to Action */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 font-semibold tracking-wider uppercase">
                  <Activity className="h-3.5 w-3.5 text-zinc-400" />
                  <span>The Three Pillars of Unique Amaze Delivery</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Crafted for Longevity. Protected for Growth.
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-white">Ergonomics</div>
                  <div className="font-sans text-xs text-zinc-300 leading-relaxed">
                    Engineered phone-first with 44px+ touch targets and 0 layout shift.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-white">Conversion Flow</div>
                  <div className="font-sans text-xs text-zinc-300 leading-relaxed">
                    Smart intake pathways and friction-free appointment scheduling.
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1.5">
                  <div className="font-mono text-xs font-bold text-white">Reliability & Care</div>
                  <div className="font-sans text-xs text-zinc-300 leading-relaxed">
                    Managed cloud care, regular security updates, and responsive support.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="font-mono text-xs text-zinc-400">
                  Disciplined 5-Step A.M.A.Z.E.™ Methodology
                </div>

                <button
                  onClick={() => {
                    studioAudio.playClick(950);
                    onNavigate('process');
                  }}
                  className="cta-image-btn inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-mono text-xs font-bold text-white shadow-md transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">Explore Our Process</span>
                  <ArrowRight className="relative z-10 h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
