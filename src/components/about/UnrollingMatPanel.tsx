import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { studioAudio } from '../../utils/audio';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { PageRoute } from '../../types';

interface UnrollingMatPanelProps {
  onNavigate: (route: PageRoute) => void;
}

export const UnrollingMatPanel: React.FC<UnrollingMatPanelProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const matBodyRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
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
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="our-commitment-mat-trigger"
      className="lg:col-span-5 relative group"
    >
      {/* Outer Mat Housing */}
      <div className="relative w-full rounded-2xl p-1 bg-gradient-to-b from-white/15 via-white/[0.05] to-white/10 shadow-2xl overflow-hidden">
        {/* Top Header Strip */}
        <div className="relative z-30 flex items-center justify-between px-5 py-3 bg-[#0A0E12] rounded-t-xl border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-semibold tracking-wider uppercase">
              Our Core Commitment
            </span>
          </div>
          <span className="text-zinc-500 text-[10px] uppercase font-semibold">
            Quality Guarantee
          </span>
        </div>

        {/* The Mat Surface */}
        <div
          ref={matBodyRef}
          className="relative overflow-hidden rounded-b-xl"
        >
          {/* Card Body */}
          <div className="relative glass-dominant p-8 sm:p-10 flex flex-col justify-between min-h-[500px] bg-[#070B0E]/95 border border-white/10 shadow-inner">
            <div className="relative z-10 space-y-6">
              {/* Title */}
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#EBECF0] leading-tight">
                Built for High Intent, Not Vanity Clicks.
              </h3>

              {/* Four Disciplined Commitments */}
              <ul className="space-y-4 pt-2 text-sm text-[#CBD5E1]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Sub-1.2s Load Times:</strong> Engineered to pass Google Core Web Vitals with 90+ Lighthouse marks.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Conversational Lead Capture:</strong> Intelligent forms and inquiry intake tailored to your specific services.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">A.M.A.Z.E.™ Methodology:</strong> A transparent 5-step process guaranteeing clarity from day one to launch.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Dedicated Care:</strong> Optional ongoing hosting, security, backups, and proactive speed tuning.
                  </span>
                </li>
              </ul>
            </div>

            {/* Bottom CTA Action Area */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] relative z-10">
              <button
                onClick={() => {
                  studioAudio.playClick(950);
                  onNavigate('planner');
                }}
                className="cta-image-btn w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 text-xs font-mono font-bold text-white tracking-wider uppercase transition-all shadow-md hover:scale-[1.01] active:scale-[0.99]"
              >
                <span className="relative z-10">START A PROJECT WITH US</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
