import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { studioAudio } from '../../utils/audio';
import { CheckCircle2, ArrowRight, Sparkles, Scroll as ScrollIcon } from 'lucide-react';
import { PageRoute } from '../../types';

interface UnrollingMatPanelProps {
  onNavigate: (route: PageRoute) => void;
}

export const UnrollingMatPanel: React.FC<UnrollingMatPanelProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const matBodyRef = useRef<HTMLDivElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isFullyUnrolled, setIsFullyUnrolled] = useState(false);
  const lastTickMilestoneRef = useRef<number>(-1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      setIsFullyUnrolled(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        end: 'bottom 55%',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = Math.min(1, Math.max(0, self.progress));
          setProgress(p);
          setIsFullyUnrolled(p >= 0.98);

          // Tactile audio feedback as the mat unfurls past quarter milestones
          const milestone = Math.floor(p * 4);
          if (milestone !== lastTickMilestoneRef.current && p > 0.05 && p < 0.95) {
            lastTickMilestoneRef.current = milestone;
            studioAudio.playScrollTick(920 + milestone * 70);
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // Calculate unroll percentage for clipping and roller position
  const unrollPercent = Math.round(progress * 100);
  const cylinderRotation = progress * 720; // 2 full revolutions as it unrolls

  return (
    <div
      ref={containerRef}
      id="our-commitment-mat-trigger"
      className="lg:col-span-5 relative group"
      style={{
        perspective: '1400px',
      }}
    >
      {/* Outer Mat Housing with Architectural Depth */}
      <div
        className="relative w-full rounded-2xl p-1 bg-gradient-to-b from-[#16D2C8]/40 via-white/[0.08] to-[#16D2C8]/20 shadow-2xl overflow-hidden"
      >
        {/* Top Roller Spindle / Wall Mounting Bracket */}
        <div className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-[#0A0E12] rounded-t-xl border-b border-white/10 font-mono text-[10px]">
          <div className="flex items-center gap-2 text-[#16D2C8]">
            <ScrollIcon className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-bold tracking-widest uppercase">
              ARCHITECTURAL COMPACT // UNROLLING MAT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 hidden sm:inline">STATE:</span>
            <span className="font-semibold text-[#16D2C8] bg-[#16D2C8]/10 px-2 py-0.5 rounded border border-[#16D2C8]/30">
              {isFullyUnrolled ? 'UNROLLED (100%)' : `DEPLOYING (${unrollPercent}%)`}
            </span>
          </div>
        </div>

        {/* The Mat Surface with Progressive Reveal Clip */}
        <div
          ref={matBodyRef}
          className="relative overflow-hidden rounded-b-xl transition-all duration-75"
          style={{
            // Physical clipping of the unrolling mat
            clipPath: `inset(0 0 ${(1 - progress) * 100}% 0 round 0 0 12px 12px)`,
            transformOrigin: 'top center',
            transform: `rotateX(${(1 - progress) * 12}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Authentic Tactile Mat Canvas Background */}
          <div className="relative glass-dominant p-8 sm:p-12 lg:p-12 flex flex-col justify-between min-h-[540px] bg-[#070B0E]/95 border border-[#16D2C8]/40 shadow-inner">
            {/* Architectural Blueprint Grid Pattern across the mat */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#16D2C808_1px,transparent_1px),linear-gradient(to_bottom,#16D2C808_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
            
            {/* Subtle Fabric Grain / Velvet Sheen on the Mat */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-[#16D2C8]/05" />

            {/* Content Inside the Mat */}
            <div className="relative z-10 space-y-6">
              {/* Header Bar */}
              <div
                className="flex items-center justify-between transition-all duration-500"
                style={{
                  opacity: Math.min(1, progress * 2.5),
                  transform: `translateY(${(1 - Math.min(1, progress * 2.5)) * 14}px)`,
                }}
              >
                <div className="font-mono text-xs text-[#16D2C8] tracking-widest uppercase font-semibold flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#16D2C8]" />
                  <span>// OUR COMMITMENT</span>
                </div>
                <span className="rounded-full bg-[#16D2C8]/15 border border-[#16D2C8]/40 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#16D2C8] uppercase tracking-wider">
                  DISCIPLINE
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-display text-xl sm:text-2xl font-bold text-[#EBECF0] leading-tight transition-all duration-500"
                style={{
                  opacity: Math.min(1, Math.max(0, (progress - 0.15) * 2.5)),
                  transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.15) * 2.5))) * 14}px)`,
                }}
              >
                Built for High Intent, Not Vanity Clicks.
              </h3>

              {/* Four Disciplined Commitments */}
              <ul className="space-y-4 pt-1 text-sm text-[#CBD5E1]">
                <li
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{
                    opacity: Math.min(1, Math.max(0, (progress - 0.25) * 3)),
                    transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.25) * 3))) * 14}px)`,
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 text-[#16D2C8] shrink-0 mt-1" />
                  <span>
                    <strong className="text-[#EBECF0]">Sub-1.2s Load Times:</strong> Engineered to pass Google Core Web Vitals with 90+ Lighthouse marks.
                  </span>
                </li>

                <li
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{
                    opacity: Math.min(1, Math.max(0, (progress - 0.4) * 3)),
                    transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.4) * 3))) * 14}px)`,
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 text-[#16D2C8] shrink-0 mt-1" />
                  <span>
                    <strong className="text-[#EBECF0]">Conversational Lead Capture:</strong> Intelligent forms and Sage AI assistants tailored to your services.
                  </span>
                </li>

                <li
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{
                    opacity: Math.min(1, Math.max(0, (progress - 0.55) * 3)),
                    transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.55) * 3))) * 14}px)`,
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 text-[#16D2C8] shrink-0 mt-1" />
                  <span>
                    <strong className="text-[#EBECF0]">A.M.A.Z.E.™ Methodology:</strong> A transparent 5-step process guaranteeing clarity from day one to launch.
                  </span>
                </li>

                <li
                  className="flex items-start gap-3 transition-all duration-500"
                  style={{
                    opacity: Math.min(1, Math.max(0, (progress - 0.7) * 3)),
                    transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.7) * 3))) * 14}px)`,
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 text-[#16D2C8] shrink-0 mt-1" />
                  <span>
                    <strong className="text-[#EBECF0]">Dedicated Care:</strong> Optional ongoing hosting, security, backups, and proactive speed tuning.
                  </span>
                </li>
              </ul>
            </div>

            {/* Bottom CTA Action Area */}
            <div
              className="mt-8 pt-6 border-t border-white/[0.08] relative z-10 transition-all duration-500"
              style={{
                opacity: Math.min(1, Math.max(0, (progress - 0.8) * 4)),
                transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.8) * 4))) * 14}px)`,
              }}
            >
              <button
                onClick={() => {
                  studioAudio.playClick(950);
                  onNavigate('planner');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#008280] hover:bg-[#009491] py-3.5 text-xs font-mono font-bold text-white tracking-wider uppercase transition-all shadow-md hover:shadow-[0_0_20px_rgba(0,130,128,0.4)]"
              >
                <span>START A PROJECT WITH US</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Physical Cylindrical Roller Rod that rolls down the panel during unroll */}
        {!isFullyUnrolled && (
          <div
            ref={rollerRef}
            className="pointer-events-none absolute left-0 right-0 z-30 flex items-center justify-center transition-all duration-75"
            style={{
              top: `${Math.min(97, progress * 100)}%`,
              transform: 'translateY(-50%)',
            }}
          >
            {/* The Rolling Mat Cylinder Rod */}
            <div className="relative w-[98%] h-5 rounded-full bg-gradient-to-r from-[#0E151A] via-[#16D2C8] to-[#0E151A] p-[1.5px] shadow-[0_12px_24px_rgba(0,0,0,0.85),0_0_15px_rgba(22,210,200,0.4)]">
              {/* Rotating Roller Surface */}
              <div
                className="w-full h-full rounded-full bg-gradient-to-b from-white/30 via-[#008280] to-[#050709] flex items-center justify-between px-3"
                style={{
                  transform: `rotate(${cylinderRotation}deg)`,
                }}
              >
                {/* Left Knurled Ring */}
                <div className="w-1.5 h-3.5 rounded-sm bg-white/40 border-r border-black/50" />
                {/* Center Core Line */}
                <div className="h-[1px] w-12 bg-white/30" />
                {/* Right Knurled Ring */}
                <div className="w-1.5 h-3.5 rounded-sm bg-white/40 border-l border-black/50" />
              </div>

              {/* Roller Trailing Shadow cast onto freshly unrolled section */}
              <div className="absolute -bottom-3 left-2 right-2 h-3 bg-black/60 blur-sm pointer-events-none" />

              {/* HUD Unroll Pill floating just above the roller */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#050709]/90 border border-[#16D2C8]/50 text-[#16D2C8] font-mono text-[9px] font-bold tracking-widest uppercase shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-ping" />
                <span>UNROLLING: {unrollPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
