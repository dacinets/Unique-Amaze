import React from 'react';
import { Sparkles } from 'lucide-react';

export const TheShiftStatement: React.FC = () => {
  return (
    <section className="relative w-full border-t border-white/[0.08] bg-[#0A0D10] py-28 sm:py-36 lg:py-44 overflow-hidden">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 radial-mesh-slate opacity-20" />

      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-[0.3em] uppercase mb-8 font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
          <span>THE SHIFT</span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-[#EBECF0] leading-[1.02] max-w-4xl mx-auto mb-8 uppercase">
          Websites are changing. <br className="hidden sm:inline" />
          <span className="text-[#64748B]">The era of the digital brochure is ending.</span>
        </h2>

        <p className="font-sans text-lg sm:text-2xl text-[#94A3B8] font-normal leading-relaxed max-w-3xl mx-auto">
          The next generation of websites don’t wait to be read — they{' '}
          <strong className="text-white font-semibold">listen, respond, and keep working</strong> long after you have closed your laptop.
        </p>
      </div>
    </section>
  );
};
