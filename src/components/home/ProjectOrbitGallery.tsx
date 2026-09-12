import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ProjectCard, PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { ScrollFlyIn } from '../common/ScrollFlyIn';
import { RevealText } from '../common/RevealText';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import {
  Sparkles,
  ArrowUpRight,
  Sliders,
  Layers,
  CheckCircle2,
  Maximize2,
  Eye,
  Zap,
  TrendingUp,
  Compass,
  LayoutGrid,
  Orbit,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectOrbitGalleryProps {
  projects: ProjectCard[];
  currentMarket: MarketType;
  onSelectProject: (project: ProjectCard) => void;
  onNavigate: (route: PageRoute) => void;
}

export const ProjectOrbitGallery: React.FC<ProjectOrbitGalleryProps> = ({
  projects,
  currentMarket,
  onSelectProject,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'orbit' | 'editorial'>('orbit');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(projects.map((p) => p.category)))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  // GSAP ScrollTrigger synchronization for the pinned orbit stage
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [isMobile]);

  // Determine current active focused card based on orbit progress
  useEffect(() => {
    if (filteredProjects.length === 0) return;
    // Phase 2 to 3 maps 0.15 -> 0.85 across projects
    const orbitProgress = Math.max(0, Math.min(1, (scrollProgress - 0.15) / 0.7));
    const rawIndex = Math.round(orbitProgress * (filteredProjects.length - 1));
    const clampedIndex = Math.max(0, Math.min(filteredProjects.length - 1, rawIndex));
    if (clampedIndex !== activeProjectIndex) {
      setActiveProjectIndex(clampedIndex);
    }
  }, [scrollProgress, filteredProjects.length, activeProjectIndex]);

  // Phase Calculations for the 4-stage choreography:
  // Phase 1 (0.00 - 0.20): Emergence from depth
  // Phase 2 (0.20 - 0.75): Orbital Rotation through Focus Zone
  // Phase 3 (0.75 - 0.85): Dolly in and metadata intensification
  // Phase 4 (0.85 - 1.00): Spatial Unfolding: 3D Orbit -> 2D Editorial Portfolio Grid
  const emergenceT = Math.min(1, scrollProgress / 0.2);
  const orbitT = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.55));
  const morphT = Math.max(0, Math.min(1, (scrollProgress - 0.78) / 0.22));

  // Orbital geometry settings
  const totalProjects = filteredProjects.length;
  const angularSpread = totalProjects > 1 ? (Math.PI * 0.95) / (totalProjects - 1) : 0;
  const currentRotationAngle = orbitT * (totalProjects - 1) * angularSpread;

  // Configuration for animated turquoise sparkles orbiting the gallery
  const outerOrbitSparkles = [
    { id: 'sp-out-0', begin: '0s', size: 'hero' as const, tail: true },
    { id: 'sp-out-1', begin: '-2.75s', size: 'medium' as const, tail: true },
    { id: 'sp-out-2', begin: '-5.5s', size: 'hero' as const, tail: true },
    { id: 'sp-out-3', begin: '-8.25s', size: 'micro' as const, tail: false },
    { id: 'sp-out-4', begin: '-11.0s', size: 'hero' as const, tail: true },
    { id: 'sp-out-5', begin: '-13.75s', size: 'medium' as const, tail: true },
    { id: 'sp-out-6', begin: '-16.5s', size: 'hero' as const, tail: true },
    { id: 'sp-out-7', begin: '-19.25s', size: 'micro' as const, tail: false },
  ];

  const innerOrbitSparkles = [
    { id: 'sp-in-0', begin: '0s', size: 'medium' as const, tail: true },
    { id: 'sp-in-1', begin: '-2.66s', size: 'micro' as const, tail: false },
    { id: 'sp-in-2', begin: '-5.33s', size: 'hero' as const, tail: true },
    { id: 'sp-in-3', begin: '-8.0s', size: 'micro' as const, tail: false },
    { id: 'sp-in-4', begin: '-10.66s', size: 'medium' as const, tail: true },
    { id: 'sp-in-5', begin: '-13.33s', size: 'hero' as const, tail: true },
  ];

  return (
    <section
      id="section-showcase"
      ref={containerRef}
      className="relative w-full border-t border-white/[0.08] bg-[#050607]"
    >
      {/* Pinned Viewport Stage for Desktop Orbit */}
      <div
        ref={stageRef}
        className={`${
          isMobile
            ? 'relative w-full px-4 sm:px-6 py-16 sm:py-20'
            : 'h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
        }`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute inset-0 radial-mesh-teal opacity-35 z-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00828008_1px,transparent_1px),linear-gradient(to_bottom,#00828008_1px,transparent_1px)] bg-[size:54px_54px]" />

        {/* TOP CONTROLS & TELEMETRY STRIP */}
        <div className="mx-auto max-w-[1280px] w-full relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#008280]">
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-[#16D2C8]" />
              <span className="font-bold tracking-widest uppercase text-[#16D2C8]">
                THE AMAZE ORBIT // SIGNATURE PORTFOLIO
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[#94A3B8]">
                {currentMarket === 'mw' ? 'MALAWI & REGIONAL' : 'CANADA & GLOBAL'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#16D2C8]/30 bg-[#16D2C8]/10 px-2.5 py-0.5 text-[10px] text-[#16D2C8] font-bold shadow-[0_0_12px_rgba(22,210,200,0.25)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-ping" />
                <span>TURQUOISE ORBIT STREAM</span>
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <h2 className="font-display text-[clamp(1.75rem,3.4vw,3.2rem)] font-black uppercase text-[#EBECF0] tracking-[-0.035em]">
                BUILT TO <span className="title-gradient-teal">AMAZE.</span>
              </h2>

              {!isMobile && (
                <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-[#080B0E]/90 px-3 py-1 font-mono text-[11px] text-[#94A3B8]">
                  <span>CHOREOGRAPHY:</span>
                  <span className="text-[#16D2C8] font-bold">
                    {morphT > 0.4
                      ? 'PHASE 4 // 2D EDITORIAL UNFOLD'
                      : orbitT > 0.05
                      ? `PHASE 2 // FOCUS ZONE [0${activeProjectIndex + 1}/0${totalProjects}]`
                      : 'PHASE 1 // SPATIAL EMERGENCE'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Controls: Sector Filters & Mode Toggles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[420px] scrollbar-none py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    studioAudio.playClick(920);
                    setSelectedCategory(cat);
                  }}
                  className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#008280] text-white font-bold border border-[#008280] shadow-[0_0_15px_rgba(0,130,128,0.4)]'
                      : 'bg-[#0D1115] text-[#94A3B8] border border-white/[0.08] hover:border-[#008280] hover:text-[#EBECF0]'
                  }`}
                >
                  {cat === 'all' ? 'ALL WORK' : cat}
                </button>
              ))}
            </div>

            {/* Desktop Mode Toggle: Orbit vs 2D Editorial */}
            {!isMobile && (
              <div className="flex items-center rounded-lg border border-white/10 bg-[#0A0D10] p-1 font-mono text-[11px]">
                <button
                  onClick={() => {
                    studioAudio.playClick(980);
                    setViewMode('orbit');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    viewMode === 'orbit'
                      ? 'bg-[#008280] text-white font-bold'
                      : 'text-[#64748B] hover:text-[#EBECF0]'
                  }`}
                  title="3D Orbit Experience"
                >
                  <Orbit className="h-3 w-3" />
                  <span>3D ORBIT</span>
                </button>
                <button
                  onClick={() => {
                    studioAudio.playClick(980);
                    setViewMode('editorial');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                    viewMode === 'editorial'
                      ? 'bg-[#008280] text-white font-bold'
                      : 'text-[#64748B] hover:text-[#EBECF0]'
                  }`}
                  title="2D Editorial Grid"
                >
                  <LayoutGrid className="h-3 w-3" />
                  <span>2D GRID</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* DESKTOP 3D SPATIAL ORBIT ENVIRONMENT                     */}
        {/* ======================================================== */}
        {!isMobile && viewMode === 'orbit' && (
          <div
            className="relative flex-1 w-full flex items-center justify-center my-auto overflow-visible select-none"
            style={{
              perspective: `${1400 + morphT * 1800}px`,
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* Ambient Orbit Guide Track & Animated Turquoise Sparkles Stream */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1600 700"
              fill="none"
              style={{
                transform: `rotateX(62deg) scale(${1 - morphT * 0.4})`,
                transformOrigin: '50% 55%',
                opacity: Math.max(0, 1 - morphT),
                transition: 'opacity 0.4s ease',
              }}
            >
              <defs>
                {/* Turquoise Sparkle Glow Filters */}
                <filter id="turquoise-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="turquoise-glow-bright" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.5" result="sharpBlur" />
                  <feGaussianBlur stdDeviation="6" result="wideBlur" />
                  <feMerge>
                    <feMergeNode in="wideBlur" />
                    <feMergeNode in="sharpBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="turquoise-halo" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="10" result="halo" />
                </filter>

                {/* Laser Light Stream Gradients for Orbit Rings */}
                <linearGradient id="orbit-laser-stream-outer" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#16D2C8" stopOpacity="0" />
                  <stop offset="65%" stopColor="#16D2C8" stopOpacity="0.75" />
                  <stop offset="88%" stopColor="#00F5D4" stopOpacity="1" />
                  <stop offset="97%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#16D2C8" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="orbit-laser-stream-inner" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#008280" stopOpacity="0" />
                  <stop offset="60%" stopColor="#16D2C8" stopOpacity="0.7" />
                  <stop offset="90%" stopColor="#00F5D4" stopOpacity="1" />
                  <stop offset="98%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#008280" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Base Static Orbit Guide Ellipses with Subtle Turquoise Glow */}
              <ellipse
                cx="800"
                cy="350"
                rx="650"
                ry="260"
                stroke="#008280"
                strokeWidth="1.5"
                strokeDasharray="6 10"
                strokeOpacity="0.4"
              />
              <ellipse
                cx="800"
                cy="350"
                rx="480"
                ry="190"
                stroke="#16D2C8"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="4 8"
              />

              {/* Orbiting Turquoise Laser Beams */}
              <path
                d="M 150 350 A 650 260 0 0 1 1450 350 A 650 260 0 0 1 150 350 Z"
                stroke="url(#orbit-laser-stream-outer)"
                strokeWidth="2.5"
                strokeDasharray="180 2850"
                fill="none"
                filter="url(#turquoise-glow)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-3030"
                  dur="11s"
                  repeatCount="indefinite"
                />
              </path>

              <path
                d="M 320 350 A 480 190 0 0 1 1280 350 A 480 190 0 0 1 320 350 Z"
                stroke="url(#orbit-laser-stream-inner)"
                strokeWidth="1.8"
                strokeDasharray="130 2100"
                fill="none"
                filter="url(#turquoise-glow)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-2230"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Outer Orbit Animated Turquoise Sparkles Stream (dur=22s) */}
              {outerOrbitSparkles.map((sp) => {
                const dur = '22s';
                const outerPath = 'M 150 350 A 650 260 0 0 1 1450 350 A 650 260 0 0 1 150 350 Z';
                const baseTime = parseFloat(sp.begin);

                return (
                  <g key={sp.id}>
                    {/* Trailing Turquoise Comet Dust Particles */}
                    {sp.tail && (
                      <>
                        <g>
                          <animateMotion
                            path={outerPath}
                            dur={dur}
                            begin={`${baseTime + 0.18}s`}
                            repeatCount="indefinite"
                          />
                          <circle r="3" fill="#16D2C8" opacity="0.65" filter="url(#turquoise-glow)" />
                        </g>
                        <g>
                          <animateMotion
                            path={outerPath}
                            dur={dur}
                            begin={`${baseTime + 0.38}s`}
                            repeatCount="indefinite"
                          />
                          <circle r="2" fill="#00F5D4" opacity="0.5" filter="url(#turquoise-glow)" />
                        </g>
                        <g>
                          <animateMotion
                            path={outerPath}
                            dur={dur}
                            begin={`${baseTime + 0.58}s`}
                            repeatCount="indefinite"
                          />
                          <circle r="1.3" fill="#80FFF4" opacity="0.35" />
                        </g>
                      </>
                    )}

                    {/* Main Turquoise Sparkle */}
                    <g>
                      <animateMotion
                        path={outerPath}
                        dur={dur}
                        begin={sp.begin}
                        repeatCount="indefinite"
                      />
                      {sp.size === 'hero' ? (
                        <g className="animate-sparkle-twinkle">
                          {/* Radial turquoise glow halo */}
                          <circle r="15" fill="#16D2C8" opacity="0.25" filter="url(#turquoise-halo)" />
                          {/* 4-point concave turquoise star */}
                          <path
                            d="M 0,-16 Q 0,0 16,0 Q 0,0 0,16 Q 0,0 -16,0 Q 0,0 0,-16 Z"
                            fill="#16D2C8"
                            filter="url(#turquoise-glow-bright)"
                          />
                          {/* Inner diagonal glint */}
                          <path
                            d="M 0,-7 Q 0,0 7,0 Q 0,0 0,7 Q 0,0 -7,0 Q 0,0 0,-7 Z"
                            fill="#E6FFFA"
                            transform="rotate(45)"
                          />
                          {/* White core spark */}
                          <circle r="2.2" fill="#FFFFFF" />
                        </g>
                      ) : sp.size === 'medium' ? (
                        <g className="animate-sparkle-twinkle-fast">
                          <circle r="10" fill="#00F5D4" opacity="0.2" filter="url(#turquoise-halo)" />
                          <path
                            d="M 0,-11 Q 0,0 11,0 Q 0,0 0,11 Q 0,0 -11,0 Q 0,0 0,-11 Z"
                            fill="#00F5D4"
                            filter="url(#turquoise-glow)"
                          />
                          <path
                            d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z"
                            fill="#E6FFFA"
                            transform="rotate(45)"
                          />
                          <circle r="1.6" fill="#FFFFFF" />
                        </g>
                      ) : (
                        <g className="animate-sparkle-pulse">
                          <path
                            d="M 0,-6.5 Q 0,0 6.5,0 Q 0,0 0,6.5 Q 0,0 -6.5,0 Q 0,0 0,-6.5 Z"
                            fill="#2DD4BF"
                            filter="url(#turquoise-glow)"
                          />
                          <circle r="1.2" fill="#FFFFFF" />
                        </g>
                      )}
                    </g>
                  </g>
                );
              })}

              {/* Inner Orbit Animated Turquoise Sparkles Stream (dur=16s) */}
              {innerOrbitSparkles.map((sp) => {
                const dur = '16s';
                const innerPath = 'M 320 350 A 480 190 0 0 1 1280 350 A 480 190 0 0 1 320 350 Z';
                const baseTime = parseFloat(sp.begin);

                return (
                  <g key={sp.id}>
                    {sp.tail && (
                      <g>
                        <animateMotion
                          path={innerPath}
                          dur={dur}
                          begin={`${baseTime + 0.18}s`}
                          repeatCount="indefinite"
                        />
                        <circle r="2.2" fill="#16D2C8" opacity="0.6" filter="url(#turquoise-glow)" />
                      </g>
                    )}
                    <g>
                      <animateMotion
                        path={innerPath}
                        dur={dur}
                        begin={sp.begin}
                        repeatCount="indefinite"
                      />
                      {sp.size === 'hero' ? (
                        <g className="animate-sparkle-twinkle">
                          <circle r="12" fill="#16D2C8" opacity="0.22" filter="url(#turquoise-halo)" />
                          <path
                            d="M 0,-14 Q 0,0 14,0 Q 0,0 0,14 Q 0,0 -14,0 Q 0,0 0,-14 Z"
                            fill="#16D2C8"
                            filter="url(#turquoise-glow-bright)"
                          />
                          <path
                            d="M 0,-6 Q 0,0 6,0 Q 0,0 0,6 Q 0,0 -6,0 Q 0,0 0,-6 Z"
                            fill="#E6FFFA"
                            transform="rotate(45)"
                          />
                          <circle r="2" fill="#FFFFFF" />
                        </g>
                      ) : sp.size === 'medium' ? (
                        <g className="animate-sparkle-twinkle-fast">
                          <path
                            d="M 0,-9.5 Q 0,0 9.5,0 Q 0,0 0,9.5 Q 0,0 -9.5,0 Q 0,0 0,-9.5 Z"
                            fill="#00F5D4"
                            filter="url(#turquoise-glow)"
                          />
                          <path
                            d="M 0,-4.5 Q 0,0 4.5,0 Q 0,0 0,4.5 Q 0,0 -4.5,0 Q 0,0 0,-4.5 Z"
                            fill="#E6FFFA"
                            transform="rotate(45)"
                          />
                          <circle r="1.4" fill="#FFFFFF" />
                        </g>
                      ) : (
                        <g className="animate-sparkle-pulse">
                          <path
                            d="M 0,-5.5 Q 0,0 5.5,0 Q 0,0 0,5.5 Q 0,0 -5.5,0 Q 0,0 0,-5.5 Z"
                            fill="#2DD4BF"
                          />
                          <circle r="1.1" fill="#FFFFFF" />
                        </g>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* 3D Spatial Canvas Stage */}
            <div
              className="relative w-full h-[520px] max-w-[1600px] flex items-center justify-center will-change-transform transition-all duration-300"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {filteredProjects.map((project, index) => {
                // Calculate 3D position along elliptical arc
                const angleOffset = index * angularSpread - currentRotationAngle;
                const radiusX = 640;
                const radiusZ = 380;

                // 3D coordinates in orbit mode
                const orbitX = Math.sin(angleOffset) * radiusX;
                const orbitZ = Math.cos(angleOffset) * radiusZ - radiusZ; // Closer cards at Z=0, further at -Z
                const orbitRotateY = -(angleOffset * 0.7 * (180 / Math.PI));
                const orbitScale = 0.88 + Math.max(0, Math.cos(angleOffset)) * 0.22;
                const orbitOpacity = Math.max(0.4, Math.cos(angleOffset) * 0.95 + 0.15);

                // Initial Emergence Offset (Phase 1)
                const emergenceZ = (1 - emergenceT) * -700;
                const emergenceBlur = (1 - emergenceT) * 10;
                const emergenceOpacity = Math.min(1, emergenceT * 1.3);

                // 2D Editorial Target Coordinates (Phase 4 morph)
                // In 2-column grid, alternate left and right columns
                const col = index % 2;
                const row = Math.floor(index / 2);
                const editorialX = (col === 0 ? -320 : 320);
                const editorialY = (row - 0.5) * 160;
                const editorialZ = 0;
                const editorialRotateY = 0;
                const editorialScale = 0.92;

                // Interpolate between 3D Orbit and 2D Editorial Grid
                const finalX = orbitX * (1 - morphT) + editorialX * morphT;
                const finalY = (morphT > 0 ? editorialY * morphT : 0);
                const finalZ = (orbitZ + emergenceZ) * (1 - morphT) + editorialZ * morphT;
                const finalRotateY = orbitRotateY * (1 - morphT) + editorialRotateY * morphT;
                const finalScale = orbitScale * (1 - morphT) + editorialScale * morphT;
                const finalOpacity = (orbitOpacity * emergenceOpacity) * (1 - morphT) + 1.0 * morphT;

                const isFocused = Math.abs(angleOffset) < 0.45 && morphT < 0.5;
                const isHovered = hoveredProjectId === project.id;

                return (
                  <div
                    key={project.id}
                    data-cursor="view"
                    onMouseEnter={() => {
                      setHoveredProjectId(project.id);
                      studioAudio.playHover(680 + index * 40);
                    }}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    onClick={() => {
                      studioAudio.playClick(1000);
                      onSelectProject(project);
                    }}
                    className={`absolute w-[440px] rounded-xl border glass-tier-1 overflow-hidden cursor-pointer transition-shadow duration-300 will-change-transform ${
                      isFocused || isHovered
                        ? 'border-[#008280] shadow-[0_20px_60px_rgba(0,130,128,0.35)] z-30'
                        : 'border-white/10 hover:border-white/30 z-10'
                    }`}
                    style={{
                      transform: `translate3d(${finalX}px, ${finalY}px, ${finalZ}px) rotateY(${finalRotateY}deg) scale(${
                        isHovered ? finalScale * 1.05 : finalScale
                      })`,
                      opacity: finalOpacity,
                      filter: emergenceBlur > 0.5 ? `blur(${emergenceBlur}px)` : 'none',
                      transition: 'transform 0.15s ease-out, opacity 0.2s ease-out, border-color 0.3s ease',
                      transformOrigin: '50% 50%',
                    }}
                  >
                    {/* Media Preview Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0D10]">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06080A] via-[#06080A]/30 to-transparent opacity-90" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="rounded-md bg-[#050607]/90 px-2.5 py-1 font-mono text-[10px] text-[#008280] border border-white/10 font-bold uppercase tracking-wider backdrop-blur-md">
                          {project.category}
                        </div>
                        <div className="rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/70 border border-white/10 backdrop-blur-md">
                          0{index + 1} / 0{totalProjects}
                        </div>
                      </div>

                      {/* Floating Key Metric Pill */}
                      {project.metrics && project.metrics[0] && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-[#008280]/40 bg-[#050607]/90 px-3 py-1 font-mono text-[10px] text-[#EBECF0] backdrop-blur-md">
                          <TrendingUp className="h-3 w-3 text-[#16D2C8]" />
                          <span className="text-[#64748B]">{project.metrics[0].label}:</span>
                          <span className="text-[#16D2C8] font-bold">{project.metrics[0].value}</span>
                        </div>
                      )}

                      {/* Focus View Hover Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
                        <div className="flex items-center gap-2 rounded-full border border-[#16D2C8] bg-[#050607]/95 px-4 py-2 font-mono text-xs text-white font-bold shadow-[0_0_20px_rgba(22,210,200,0.5)]">
                          <Eye className="h-3.5 w-3.5 text-[#16D2C8]" />
                          <span>VIEW CASE STUDY</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Description & Action Bar */}
                    <div className="p-4 bg-[#080B0E]/95 space-y-2 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-base font-bold text-[#EBECF0] tracking-tight truncate">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 text-[#008280] shrink-0" />
                      </div>
                      <p className="font-sans text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* 3D Dimensional Turquoise Sparkles Orbiting in Spatial Field */}
              {Array.from({ length: 8 }).map((_, i) => {
                const sparkleAngle = (i / 8) * (Math.PI * 2) - currentRotationAngle;
                const sx = Math.sin(sparkleAngle) * 640;
                const sz = Math.cos(sparkleAngle) * 380 - 380;
                const sy = Math.sin(i * 1.7) * 45;
                const sScale = 0.75 + Math.max(0, Math.cos(sparkleAngle)) * 0.45;
                const sOpacity = Math.max(0.3, Math.cos(sparkleAngle) * 0.7 + 0.3) * (1 - morphT);

                return (
                  <div
                    key={`spatial-sparkle-${i}`}
                    className="pointer-events-none absolute flex items-center justify-center will-change-transform z-20"
                    style={{
                      transform: `translate3d(${sx}px, ${sy}px, ${sz}px) scale(${sScale})`,
                      opacity: sOpacity,
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute h-8 w-8 rounded-full bg-[#16D2C8]/25 blur-md animate-pulse" />
                      <Sparkles className="h-4 w-4 text-[#16D2C8] drop-shadow-[0_0_10px_#16D2C8] animate-sparkle-twinkle" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DESKTOP 2D EDITORIAL GRID VIEW (TOGGLED OR PHASE 4)     */}
        {/* ======================================================== */}
        {!isMobile && viewMode === 'editorial' && (
          <div className="relative flex-1 w-full max-w-[1480px] mx-auto overflow-y-auto py-8 pr-2 scrollbar-none">
            <div className="grid grid-cols-2 gap-10">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  data-cursor="view"
                  onClick={() => {
                    studioAudio.playClick(1000);
                    onSelectProject(project);
                  }}
                  className="group relative rounded-xl border border-white/10 bg-[#0A0D10] overflow-hidden hover:border-[#008280] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06080A] via-transparent to-transparent opacity-85" />
                    <div className="absolute top-4 left-4 rounded-md bg-[#050607]/90 px-3 py-1 font-mono text-[10px] text-[#008280] border border-white/10 font-bold uppercase">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold text-[#EBECF0]">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-[#008280] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                      {project.description}
                    </p>
                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06] font-mono text-[10px]">
                        {project.metrics.map((m, i) => (
                          <div key={i}>
                            <div className="text-[#64748B]">{m.label}</div>
                            <div className="text-[#16D2C8] font-bold">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DESKTOP 2D EDITORIAL GRID VIEW                           */}
        {/* ======================================================== */}
        {!isMobile && viewMode === 'editorial' && (
          <div className="relative flex-1 w-full max-w-[1280px] mx-auto my-auto overflow-y-auto max-h-[calc(100vh-180px)] pr-2 py-4">
            <div className="grid grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    studioAudio.playClick(1000);
                    onSelectProject(project);
                  }}
                  className="rounded-xl border border-white/10 bg-[#0A0D10]/95 overflow-hidden hover:border-[#16D2C8]/50 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(22,210,200,0.18)] group"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06080A] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 rounded-md bg-[#050607]/90 px-2.5 py-1 font-mono text-[10px] text-[#16D2C8] border border-white/10 font-bold uppercase">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-[#EBECF0] group-hover:text-[#16D2C8] transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-[#16D2C8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/[0.06] font-mono text-[10px]">
                        {project.metrics.map((m, i) => (
                          <div key={i}>
                            <div className="text-[#64748B]">{m.label}</div>
                            <div className="text-[#16D2C8] font-bold">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MOBILE RESPONSIVE EXPERIENCE (TOUCH-FRIENDLY & FAST)     */}
        {/* ======================================================== */}
        {isMobile && (
          <GsapStaggerReveal stagger={0.1} yOffset={45} className="space-y-8 pt-8">
            <div className="flex items-center justify-center gap-2 py-2.5 font-mono text-[11px] text-[#16D2C8] uppercase tracking-wider bg-[#16D2C8]/10 rounded-lg border border-[#16D2C8]/25 shadow-[0_0_15px_rgba(22,210,200,0.15)]">
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-[#16D2C8]" />
              <span>THE AMAZE ORBIT &bull; TURQUOISE SPARKLE STREAM</span>
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-[#16D2C8]" />
            </div>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  studioAudio.playClick(1000);
                  onSelectProject(project);
                }}
                className="w-full rounded-xl border border-white/10 bg-[#0A0D10] overflow-hidden active:scale-[0.99] transition-transform will-change-transform"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06080A] via-transparent to-transparent opacity-85" />
                  <div className="absolute top-3 left-3 rounded-md bg-[#050607]/90 px-2.5 py-1 font-mono text-[10px] text-[#008280] border border-white/10 font-bold uppercase">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-[#EBECF0]">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-[#008280]" />
                  </div>
                  <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                    {project.description}
                  </p>
                  {project.metrics && (
                    <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/[0.06] font-mono text-[10px]">
                      {project.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="text-[#64748B]">{m.label}</div>
                          <div className="text-[#16D2C8] font-bold">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </GsapStaggerReveal>
        )}

        {/* BOTTOM METADATA RAIL */}
        <div className="mx-auto max-w-[1280px] w-full relative z-20 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.08] font-mono text-[11px] text-[#64748B]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#16D2C8]">
              <Compass className="h-3.5 w-3.5" />
              <span>THE AMAZE ORBIT ENGINE // 3D SPATIAL PATHWAY</span>
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              SCROLL TO TRAVERSE &bull; CLICK TO INSPECT CASE STUDY
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('work')}
              className="flex items-center gap-1.5 text-[#EBECF0] hover:text-[#008280] transition-colors font-bold uppercase"
            >
              <span>EXPLORE ALL ARCHIVES</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
