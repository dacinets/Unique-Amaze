import React, { useState, useRef, useEffect } from 'react';
import { PageRoute } from '../../types';
import { studioAudio } from '../../utils/audio';
import { Check, Wind, Sparkles, Compass } from 'lucide-react';
import { ProgressiveImage } from '../common/ProgressiveImage';

interface AmazeStepPanelProps {
  step: {
    letter: string;
    word: string;
    stepNum: string;
    summary: string;
    desc: string;
    deliverables: string[];
  };
  index: number;
  totalSteps: number;
  onNavigate?: (route: PageRoute) => void;
}

const STAGE_ARTIFACTS = [
  {
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=70',
    alt: 'Comprehensive discovery audit and diagnostic analysis',
    label: 'DISCOVERY AUDIT & STRATEGY BRIEF',
    glass: 'glass-smoke',
    dominant: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=70',
    alt: 'Structural wireframe blueprint and architectural site map',
    label: 'STRUCTURAL BLUEPRINT & UX NODES',
    glass: 'glass-slate',
    dominant: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=70',
    alt: 'Bespoke typography, sculptural letterforms and editorial layout craft',
    label: 'TYPOGRAPHIC CRAFT & ART DIRECTION',
    glass: 'glass-dominant',
    dominant: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=70',
    alt: 'High-performance TypeScript code architecture and precision optimization',
    label: 'ENGINEERED ZERO-FRICTION CORE',
    glass: 'glass-teal',
    dominant: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70',
    alt: 'Atmospheric launch momentum and commercial elevation',
    label: 'DEPLOYMENT ORCHESTRATION & GROWTH',
    glass: 'glass-violet',
    dominant: false,
  },
];

const AMAZE_LETTERS = [
  { char: 'A', name: 'Assess' },
  { char: 'M', name: 'Map' },
  { char: 'A', name: 'Articulate' },
  { char: 'Z', name: 'Zero Friction' },
  { char: 'E', name: 'Elevate' },
];

export const AmazeStepPanel: React.FC<AmazeStepPanelProps> = ({
  step,
  index,
  totalSteps,
  onNavigate,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [windForce, setWindForce] = useState({ x: 0, y: 0, gust: 1 });
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal trigger using IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            // Optional: trigger subtle scroll tick when card locks in
            studioAudio.playScrollTick(900 + index * 120);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  // Alternating flag pole alignment: Panel 0 (left), Panel 1 (right), Panel 2 (left), etc.
  const isPoleRight = index % 2 === 1;

  // Mouse move handler to compute aerodynamic wind gust and flutter deflection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Free edge is opposite the flagpole mast
    const flutterDistFromPole = isPoleRight ? (1 - rawX) : rawX;
    const normalizedGust = 0.8 + flutterDistFromPole * 1.2;

    setWindForce({
      x: (rawX - 0.5) * (isPoleRight ? -12 : 12),
      y: (y - 0.5) * 8,
      gust: normalizedGust,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    studioAudio.playClick(1050);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setWindForce({ x: 0, y: 0, gust: 1 });
  };

  return (
    <div
      ref={containerRef}
      id={`amaze-step-panel-${step.stepNum}`}
      className="relative group transition-all duration-700 ease-out"
      style={{
        perspective: '1400px',
      }}
    >
      {/* ARCHITECTURAL FLAGPOLE MAST ASSEMBLY (Alternates Left / Right per panel) */}
      <div
        className={`absolute z-20 top-0 bottom-0 pointer-events-none flex flex-col items-center ${
          isPoleRight
            ? '-right-[28px] sm:-right-[48px]'
            : '-left-[28px] sm:-left-[48px]'
        }`}
      >
        {/* Top Finial Sphere (Acorn / Truck) */}
        <div className="relative -top-3 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-white via-[#16D2C8] to-[#008280] border border-[#16D2C8] shadow-[0_0_12px_#16D2C8]" />
          <span className="absolute -inset-1 rounded-full bg-[#16D2C8]/30 animate-ping" />
        </div>

        {/* Mast Beam with dual titanium/cyan glow */}
        <div className="relative w-[3px] sm:w-[4px] h-full bg-gradient-to-b from-white/20 via-[#16D2C8] to-white/20 rounded-full shadow-[0_0_14px_rgba(22,210,200,0.45)]">
          {/* Halyard Rigging Wire */}
          <div
            className={`absolute top-0 bottom-0 w-[1px] bg-white/20 ${
              isPoleRight ? 'right-[5px]' : 'left-[5px]'
            }`}
          />
        </div>

        {/* Base Ground Stanchion / Cleat */}
        <div className="relative -bottom-2 h-3 w-6 rounded-sm bg-[#090D10] border border-[#16D2C8]/50 shadow-md" />

        {/* Mast Node Pin (Attachment Pivot) */}
        <div className="absolute top-5 flex items-center justify-center">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <span
              className={`absolute inline-flex h-full w-full rounded-full bg-[#16D2C8] transition-opacity duration-700 ${
                isRevealed ? 'animate-ping opacity-60' : 'opacity-0'
              }`}
            />
            <span
              className={`relative inline-flex h-4 w-4 rounded-full border-2 transition-all duration-500 ${
                isRevealed
                  ? 'bg-[#050607] border-[#16D2C8] shadow-[0_0_16px_#16D2C8]'
                  : 'bg-[#0E1217] border-white/20'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Flag Tether Connector Bridging Mast Node to Card */}
      <div
        className={`absolute top-[27px] h-[2px] z-10 transition-all duration-700 ${
          isPoleRight
            ? '-right-[24px] sm:-right-[42px]'
            : '-left-[24px] sm:-left-[42px]'
        } ${
          isRevealed
            ? 'w-[24px] sm:w-[42px] bg-gradient-to-r from-[#16D2C8] to-[#16D2C8]/60 shadow-[0_0_8px_#16D2C8]'
            : 'w-0 bg-white/10'
        }`}
      />

      {/* Aerodynamic Flag Deflection Shell */}
      <div
        className="w-full"
        style={{
          transformOrigin: isPoleRight ? 'right center' : 'left center',
          transform: isHovered
            ? `rotateY(${windForce.x * 0.45}deg) rotateX(${-windForce.y * 0.35}deg) translateZ(10px)`
            : 'rotateY(0deg) rotateX(0deg) translateZ(0px)',
          transition: isHovered
            ? 'transform 0.12s ease-out'
            : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* The Flag Panel Card with Continuous Billow Wave */}
        <div
          ref={cardRef}
          data-cursor="card"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative rounded-xl border ${STAGE_ARTIFACTS[index]?.glass || 'glass-tier-1'} p-8 sm:p-12 overflow-hidden transition-all duration-500 ease-out ${
            isRevealed
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-12 scale-[0.97]'
          } ${
            isHovered
              ? 'border-[#16D2C8]/60 shadow-xl'
              : STAGE_ARTIFACTS[index]?.dominant
              ? 'border-[#16D2C8]/45 shadow-lg'
              : 'border-white/[0.08] hover:border-white/20 shadow-md'
          }`}
          style={{
            transformOrigin: isPoleRight ? 'right center' : 'left center',
            transformStyle: 'preserve-3d',
            animation: isHovered
              ? 'windy-flag-billow 2.4s ease-in-out infinite'
              : 'none',
          }}
        >
        {/* Flag Pole Edge Reinforcement & Nautical Grommets (Mast Edge) */}
        <div
          className={`absolute top-0 bottom-0 w-2.5 pointer-events-none z-30 flex flex-col justify-between py-6 items-center ${
            isPoleRight
              ? 'right-0 bg-gradient-to-l from-white/[0.15] via-white/[0.05] to-transparent'
              : 'left-0 bg-gradient-to-r from-white/[0.15] via-white/[0.05] to-transparent'
          }`}
        >
          {/* Top Brass Grommet Eyelet */}
          <span
            className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-300 ${
              isHovered
                ? 'border-[#16D2C8] bg-[#050607] shadow-[0_0_8px_#16D2C8]'
                : 'border-white/30 bg-[#0E1217]'
            }`}
          />
          {/* Center Flag Seam */}
          <span className="h-16 w-[1px] bg-white/20" />
          {/* Bottom Brass Grommet Eyelet */}
          <span
            className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-300 ${
              isHovered
                ? 'border-[#16D2C8] bg-[#050607] shadow-[0_0_8px_#16D2C8]'
                : 'border-white/30 bg-[#0E1217]'
            }`}
          />
        </div>

        {/* Dynamic Traveling Wind Wave Light Sheen (Simulates cloth folding in high wind) */}
        <div
          className={`pointer-events-none absolute inset-0 overflow-hidden rounded-xl transition-opacity duration-500 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute -inset-full bg-gradient-to-r from-transparent via-[rgba(22,210,200,0.14)] to-transparent"
            style={{
              animation: isHovered
                ? 'windy-sheen-sweep 2.2s ease-in-out infinite'
                : 'none',
              transform: 'skewX(-25deg)',
            }}
          />
        </div>

        {/* Free-Fluttering Flag Hem Edge (Opposite mast ripple highlight) */}
        <div
          className={`pointer-events-none absolute top-0 bottom-0 w-1 transition-all duration-500 z-20 ${
            isPoleRight ? 'left-0' : 'right-0'
          } ${
            isHovered
              ? 'bg-gradient-to-b from-transparent via-[#16D2C8] to-transparent opacity-80 shadow-[0_0_12px_#16D2C8]'
              : 'opacity-0'
          }`}
        />

        {/* Wind Status HUD Indicator on Hover */}
        <div
          className={`pointer-events-none absolute top-4 flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase transition-all duration-500 z-20 ${
            isPoleRight ? 'left-6' : 'right-6'
          } ${
            isHovered
              ? 'opacity-100 translate-y-0 text-[#16D2C8]'
              : 'opacity-0 -translate-y-2 text-white/40'
          }`}
        >
          <Wind className="h-3 w-3 animate-pulse text-[#16D2C8]" />
          <span>WIND VECTOR: {isPoleRight ? '318°' : '042°'} // FLUTTERING</span>
        </div>

        {/* Monumental Sculptural Background Monogram */}
        <div
          className={`pointer-events-none absolute select-none transition-all duration-1000 ease-out z-0 ${
            isPoleRight ? '-left-6 -bottom-12' : '-right-6 -bottom-12'
          } ${
            isRevealed
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-8'
          }`}
          style={{
            transform: isHovered
              ? 'translateZ(15px) scale(1.05)'
              : 'translateZ(0px) scale(1)',
            transition: 'transform 0.5s ease',
          }}
        >
          <span className="font-display text-[10rem] sm:text-[13rem] font-black text-white/[0.035] leading-none tracking-tighter block">
            {step.letter}
          </span>
        </div>

        {/* Main Content Layout */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Left Column: Stage Identifier, Summary & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#16D2C8] tracking-widest uppercase bg-[#16D2C8]/10 px-2.5 py-1 rounded border border-[#16D2C8]/30">
                STEP // {step.stepNum}
              </span>
              <span className="text-[#3A494B]">|</span>
              <span className="font-display text-lg font-semibold text-[#16D2C8] uppercase tracking-wide flex items-center gap-1.5">
                <span>{step.word}</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-pulse" />
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#EBECF0] uppercase tracking-wide leading-snug">
              {step.summary}
            </h2>

            <p className="font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              {step.desc}
            </p>

            {/* Stage Artifact Visual Vignette with ProgressiveImage */}
            {STAGE_ARTIFACTS[index] && (
              <div className="relative overflow-hidden rounded-lg border border-white/10 w-full bg-[#080B0E] group my-3 shadow-md">
                <ProgressiveImage
                  src={STAGE_ARTIFACTS[index].image}
                  alt={STAGE_ARTIFACTS[index].alt}
                  aspectRatio="16/7"
                  overlayScrim="bottom"
                  hoverZoom={true}
                  className="w-full"
                />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[#16D2C8] z-20 pointer-events-none">
                  <span className="tracking-widest uppercase font-semibold">{STAGE_ARTIFACTS[index].label}</span>
                  <span className="text-[#94A3B8] font-mono">SPEC 0{index + 1}</span>
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
              <Compass className="h-3.5 w-3.5 text-[#16D2C8]" />
              <span>PHASE {step.stepNum} OF {totalSteps.toString().padStart(2, '0')} // ARCHITECTURAL RAIL</span>
            </div>
          </div>

          {/* Right Column: Key Deliverables Card */}
          <div className="lg:col-span-7 glass-smoke rounded-xl border border-white/10 p-7 sm:p-9 space-y-5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs text-[#16D2C8] uppercase tracking-wider font-semibold flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>KEY DELIVERABLES & ARTIFACTS:</span>
              </div>
              <span className="font-mono text-[10px] text-[#CBD5E1] font-semibold tracking-wider">
                VERIFIED EXCELLENCE
              </span>
            </div>

            <ul className="space-y-3.5 font-sans text-sm text-[#EBECF0]">
              {step.deliverables.map((d, dIdx) => (
                <li
                  key={dIdx}
                  className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16D2C8]/15 text-[#16D2C8] border border-[#16D2C8]/30 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="leading-snug">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* THE LETTERS A.M.A.Z.E ON THE CORNER (Opposite Mast) */}
        {/* Animates on scroll reveal, flutters with 3D depth when the card behaves like a flag */}
        <div
          id={`amaze-corner-badge-${step.stepNum}`}
          className={`absolute bottom-5 sm:bottom-6 z-20 transition-all duration-700 ease-out select-none ${
            isPoleRight
              ? 'left-6 sm:left-8'
              : 'right-6 sm:right-8'
          } ${
            isRevealed
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
          style={{
            transform: isHovered
              ? 'translateZ(38px) scale(1.04)'
              : 'translateZ(10px) scale(1)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s ease, opacity 0.7s ease',
          }}
        >
          <div className={`flex flex-col gap-1.5 ${isPoleRight ? 'items-start' : 'items-end'}`}>
            {/* Top Micro-Header for Stage Context */}
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#16D2C8]/80">
              <span className="inline-block h-1 w-1 rounded-full bg-[#16D2C8] animate-ping" />
              <span>THE A.M.A.Z.E. METHOD™</span>
            </div>

            {/* Futuristic HUD Letterplate Badge */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 ${
                isHovered
                  ? 'bg-[#050607]/90 border-[#16D2C8] shadow-[0_0_25px_rgba(22,210,200,0.45)]'
                  : 'bg-[#090D10]/80 border-white/10 shadow-lg'
              }`}
            >
              {AMAZE_LETTERS.map((item, lIdx) => {
                const isCurrentStepLetter = lIdx === index;
                // Delay each letter stagger on scroll reveal
                const staggerDelay = isRevealed ? `${lIdx * 90 + 150}ms` : '0ms';

                return (
                  <React.Fragment key={`amaze-letter-${step.stepNum}-${lIdx}`}>
                    {/* Individual Animated Letter */}
                    <div
                      className={`relative flex items-center justify-center font-display text-sm sm:text-base font-bold transition-all duration-500 ${
                        isRevealed
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-3 scale-75'
                      } ${
                        isCurrentStepLetter
                          ? 'text-[#16D2C8] font-black scale-110 drop-shadow-[0_0_10px_#16D2C8]'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                      style={{
                        transitionDelay: staggerDelay,
                        transform: isHovered && isCurrentStepLetter ? 'translateZ(12px) scale(1.2)' : undefined,
                      }}
                      title={`${item.char} - ${item.name}`}
                    >
                      {/* Active Letter Halo / Glow Pill */}
                      {isCurrentStepLetter && (
                        <span className="absolute -inset-1 rounded-md bg-[#16D2C8]/20 border border-[#16D2C8]/40 animate-pulse pointer-events-none" />
                      )}
                      <span className="relative z-10 px-0.5">{item.char}</span>
                    </div>

                    {/* Letter Separator Dot */}
                    {lIdx < AMAZE_LETTERS.length - 1 && (
                      <span
                        className={`text-[9px] transition-all duration-500 ${
                          isRevealed ? 'opacity-100' : 'opacity-0'
                        } ${
                          isCurrentStepLetter || lIdx === index - 1
                            ? 'text-[#16D2C8]'
                            : 'text-white/20'
                        }`}
                        style={{ transitionDelay: staggerDelay }}
                      >
                        ·
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
