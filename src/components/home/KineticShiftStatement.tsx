import React, { useRef, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';

gsap.registerPlugin(ScrollTrigger);

export const KineticShiftStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // Tracking expands when section is centered (progress ~ 0.5)
  const trackingPx = Math.sin(scrollProgress * Math.PI) * 14;
  const scaleVal = 1 + Math.sin(scrollProgress * Math.PI) * 0.08;

  const words = [
    { text: 'WEBSITES', highlight: false },
    { text: 'ARE', highlight: false },
    { text: 'CHANGING.', highlight: true },
    { text: 'THE', highlight: false },
    { text: 'ERA', highlight: false },
    { text: 'OF', highlight: false },
    { text: 'THE', highlight: false },
    { text: 'DIGITAL', highlight: false },
    { text: 'BROCHURE', highlight: false },
    { text: 'IS', highlight: false },
    { text: 'ENDING.', highlight: true },
  ];

  return (
    <section
      id="section-shift"
      ref={sectionRef}
      className="relative w-full border-t border-white/[0.08] bg-[#07090C] py-10 sm:py-12 lg:py-14 overflow-hidden"
    >
      {/* Subtle background glow & draft grid */}
      <div className="pointer-events-none absolute inset-0 radial-mesh-teal opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0082800a_1px,transparent_1px),linear-gradient(to_bottom,#0082800a_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Telemetry Tag */}
        <GsapStaggerReveal yOffset={20} delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#008280]/40 bg-[#008280]/10 px-4 py-1.5 font-mono text-xs text-[#008280] mb-8">
            <Sparkles className="h-3.5 w-3.5 text-[#008280]" />
            <span className="tracking-[0.25em] uppercase font-bold">
              KINETIC SCROLL DYNAMICS // 04 THE SHIFT
            </span>
          </div>
        </GsapStaggerReveal>

        {/* Explosive Dynamic Typography Container */}
        <div
          className="will-change-transform transition-transform duration-100 ease-out my-4"
          style={{
            transform: `scale(${scaleVal})`,
            letterSpacing: `${trackingPx}px`,
          }}
        >
          <h2 className="font-display text-[clamp(2.2rem,4.8vw,4.5rem)] font-black uppercase text-[#EBECF0] leading-[1.02] max-w-4xl mx-auto select-none">
            {words.map((w, idx) => {
              const wordThreshold = (idx + 1) / (words.length + 2);
              const isIlluminated = scrollProgress >= wordThreshold * 0.7;

              return (
                <span
                  key={idx}
                  className={`inline-block mr-2.5 sm:mr-5 transition-all duration-300 ${
                    w.highlight
                      ? isIlluminated
                        ? 'title-gradient-teal drop-shadow-[0_0_25px_rgba(0,130,128,0.5)]'
                        : 'text-[#008280]/40'
                      : isIlluminated
                      ? 'text-[#EBECF0]'
                      : 'text-[#64748B]/40'
                  }`}
                >
                  {w.text}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Dynamic Architectural Caliper Coordinates */}
        <GsapStaggerReveal stagger={0.08} yOffset={24} className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 font-mono text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#008280]" />
            <span>KINETIC RATIO: {(scrollProgress * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#367588]" />
            <span>OPTICAL EXPANSION: +{trackingPx.toFixed(1)}px</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span>GOLDEN RATIO 1.618 CALIBRATION</span>
          </div>
        </GsapStaggerReveal>

        {/* Manifest Statement Subtitle */}
        <GsapStaggerReveal yOffset={32} delay={0.15}>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#94A3B8] font-normal leading-relaxed max-w-[65ch] mx-auto mt-8">
            The next generation of websites don’t wait to be read — they{' '}
            <strong className="title-gradient-teal font-bold">listen, qualify, and execute</strong> long after your office has closed for the evening.
          </p>
        </GsapStaggerReveal>
      </div>
    </section>
  );
};
