import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { INDUSTRIES_DATA } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { AmazeStepPanel } from './AmazeStepPanel';
import { BrandDivider } from '../common/BrandDivider';
import { Check, Sparkles, ArrowRight, Activity, Terminal, Wind } from 'lucide-react';

interface ProcessViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const ProcessView: React.FC<ProcessViewProps> = ({ onNavigate }) => {
  const [selectedIndustryIdx, setSelectedIndustryIdx] = useState<number>(0);
  const selectedIndustry = INDUSTRIES_DATA[selectedIndustryIdx];

  const steps = [
    {
      letter: 'A',
      word: 'Assess',
      stepNum: '01',
      summary: 'Deep Discovery & Diagnostic',
      desc: 'We analyze your business, target customers, market competitors, current friction points, and revenue goals to determine what your digital experience actually needs to accomplish.',
      deliverables: ['Competitive market teardown', 'Customer conversion path mapping', 'Technical gap assessment'],
    },
    {
      letter: 'M',
      word: 'Map',
      stepNum: '02',
      summary: 'Architecture & Journey Design',
      desc: 'We map the full site structure, wireframe the key customer flows, organize the content hierarchy, and ensure every page leads to a logical, frictionless action.',
      deliverables: ['Information architecture blueprint', 'High-conversion wireframes', 'Strategic call-to-action routing'],
    },
    {
      letter: 'A',
      word: 'Articulate',
      stepNum: '03',
      summary: 'Brand Voice & Visual Craft',
      desc: 'We shape your messaging, establish a distinctive typography pairing, and engineer a bespoke visual atmosphere that projects immediate trust and quiet luxury.',
      deliverables: ['Sculptural typographic hierarchy', 'Conversion copywriting direction', 'Tailored color palette & glassmorphism'],
    },
    {
      letter: 'Z',
      word: 'Zero Friction',
      stepNum: '04',
      summary: 'Precision Build & Optimization',
      desc: 'We build your site in clean modern code, integrating smooth 60fps animations, mobile-first touch ergonomics, instant quote forms, and 95+ Lighthouse speed targets.',
      deliverables: ['Mobile-first responsive engineering', 'Lighthouse 90+ speed audit', 'Smart forms & booking flow integration'],
    },
    {
      letter: 'E',
      word: 'Elevate',
      stepNum: '05',
      summary: 'Launch, Measurement & Growth',
      desc: 'We launch with zero downtime, configure local SEO indexing, establish analytics tracking, and provide handover training or continuous monthly care.',
      deliverables: ['Zero-downtime domain rollout', 'Google Business & local SEO launch', 'Automated analytics & client handover'],
    },
  ];

  return (
    <div className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32">
      {/* Page Header */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Our Proven Framework</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            THE A.M.A.Z.E. METHOD™ <br />
            <span className="text-zinc-400">FROM FIRST PRINCIPLE TO DEPLOYED EXCELLENCE.</span>
          </h1>

          <p className="mt-6 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Every project follows a disciplined 5-step methodology designed to eliminate ambiguity, shape the right customer journey, and launch with precision.
          </p>
        </div>
      </div>

      {/* The 5 Steps Alternating Flagpole Rail */}
      <div className="mx-auto max-w-[1340px] px-6 sm:px-14 lg:px-20">
        <div className="relative space-y-20 sm:space-y-28">
          {/* Subtle dual side ambient guide rails */}
          <div className="hidden sm:block absolute left-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent pointer-events-none" />
          <div className="hidden sm:block absolute right-[-1px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent pointer-events-none" />

          {steps.map((s, sIdx) => (
            <AmazeStepPanel
              key={`step-${s.stepNum}-${s.letter}`}
              step={s}
              index={sIdx}
              totalSteps={steps.length}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

      {/* Subtle Horizontal Divider: 5-Step Rail to Industry Architectures */}
      <BrandDivider
        variant="minimal"
        width="container"
        spacing="xl"
      />

      {/* 10 Industries Interactive Selector */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase mb-3 font-semibold">
            <span>Tailored Industry Architectures</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#EBECF0] uppercase tracking-wide">
            BUILT FOR BUSINESSES THAT BENEFIT MOST FROM A COMPELLING PRESENCE
          </h2>
          <p className="mt-4 font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Explore how we tailor conversion funnels, smart intake, and visual credibility for your specific industry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          {/* Industry Options List */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {INDUSTRIES_DATA.map((ind, idx) => {
              const isSelected = selectedIndustryIdx === idx;
              return (
                <button
                  key={ind.id}
                  onClick={() => {
                    studioAudio.playClick(850);
                    setSelectedIndustryIdx(idx);
                  }}
                  className={`flex items-center justify-between rounded-xl px-4.5 py-3.5 text-left font-sans text-sm transition-all ${
                    isSelected
                      ? 'bg-white/10 text-white border border-white/20 font-semibold shadow-sm'
                      : 'border border-white/[0.07] glass-smoke text-[#94A3B8] hover:border-white/20 hover:text-[#EBECF0]'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">{ind.emoji}</span>
                    <span className="truncate">{ind.name}</span>
                  </span>
                  <ArrowRight
                    className={`h-4 w-4 text-white transition-transform shrink-0 ${
                      isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Industry Interactive Detail Stage */}
          <div className="lg:col-span-8 rounded-xl border border-white/10 glass-dominant overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 relative aspect-square md:aspect-auto min-h-[280px]">
                <img
                  src={selectedIndustry.img}
                  alt={selectedIndustry.alt}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover brightness-[0.7] contrast-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#050607]/40 to-[#050607]/90" />
              </div>

              <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 mb-2 font-semibold">
                    <span>{selectedIndustry.emoji}</span>
                    <span className="uppercase tracking-widest">{selectedIndustry.name}</span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#EBECF0] mb-3 uppercase tracking-wide">
                    {selectedIndustry.head}
                  </h3>

                  <p className="font-sans text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {selectedIndustry.lede}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    <span className="font-mono text-xs text-[#64748B] uppercase tracking-wider block font-semibold">
                      PROVEN OUTCOMES:
                    </span>
                    {selectedIndustry.outcomes.map((o, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2 text-sm text-[#EBECF0]">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-xs text-[#EBECF0]">
                    <span className="text-zinc-300 font-bold block mb-1">SMART FEATURE IDEA:</span>
                    <span>{selectedIndustry.smart}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <button
                    onClick={() => {
                      studioAudio.playClick(1100);
                      onNavigate('planner');
                    }}
                    className="flex items-center gap-2 font-mono text-xs text-zinc-300 hover:text-white font-bold uppercase transition-colors"
                  >
                    <span>LAUNCH IN PROJECT PLANNER</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Horizontal Divider: Industries to Conversion Banner */}
        <BrandDivider
          variant="minimal"
          width="container"
          spacing="xl"
        />

        {/* Closing Process CTA with Architectural Image Background */}
        <div className="cta-image-container group rounded-xl border border-white/10 p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=80"
            alt="Unique Amaze Modern Architectural Studio"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Adaptive Contrast Scrim */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="relative z-10 max-w-xl">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2 font-semibold">
              Ready to commence Step 01?
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
              EVERY ENGAGEMENT STARTS WITH DIRECT PRINCIPAL ACCESS.
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#94A3B8] font-sans leading-relaxed">
              No junior account managers, no automated proposals. You partner directly with our specialist to map out your digital flagship.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => {
                studioAudio.playClick(950);
                onNavigate('planner');
              }}
              className="cta-image-btn group/btn relative overflow-hidden rounded-lg px-6 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="relative z-10 h-4 w-4 text-white" />
              <span className="relative z-10 text-white">COMMENCE PROJECT PLAN</span>
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(800);
                onNavigate('contact');
              }}
              className="cta-secondary-btn rounded-lg border px-6 py-3.5 font-mono text-xs font-bold transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              SCHEDULE A CALL
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
