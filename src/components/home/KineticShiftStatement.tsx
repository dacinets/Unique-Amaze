import React, { useRef, useState, useEffect } from 'react';
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

  const scaleVal = 1 + Math.sin(scrollProgress * Math.PI) * 0.04;

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
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 radial-mesh-slate opacity-20 z-0" />

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-zinc-300 mb-5 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-widest uppercase font-semibold">
            The Digital Shift
          </span>
        </div>

        {/* Dynamic Typography Container */}
        <div
          className="will-change-transform transition-transform duration-100 ease-out my-4"
          style={{
            transform: `scale(${scaleVal})`,
          }}
        >
          <h2 className="font-display text-[clamp(2rem,4.4vw,4.2rem)] font-black uppercase text-[#EBECF0] leading-[1.08] max-w-4xl mx-auto select-none">
            {words.map((w, idx) => {
              const wordThreshold = (idx + 1) / (words.length + 2);
              const isIlluminated = scrollProgress >= wordThreshold * 0.5;

              return (
                <span
                  key={idx}
                  className={`inline-block mr-2 sm:mr-4 transition-all duration-200 ${
                    w.highlight
                      ? isIlluminated
                        ? 'text-white font-black drop-shadow-[0_0_24px_rgba(255,255,255,0.3)]'
                        : 'text-zinc-300 font-bold'
                      : isIlluminated
                      ? 'text-[#EBECF0]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {w.text}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Manifest Statement Subtitle */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-zinc-300 font-normal leading-relaxed max-w-[65ch] mx-auto mt-8">
          Modern digital flagships do not wait to be read — they guide, qualify, and convert visitors
          with seamless speed and clear intent.
        </p>
      </div>
    </section>
  );
};
