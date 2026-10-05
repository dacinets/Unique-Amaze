import React from 'react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import { Shield, Sparkles, Check, ArrowRight, Award, Zap, Smartphone, CheckCircle2 } from 'lucide-react';

interface ValueIntroProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket?: MarketType;
}

export const ValueIntro: React.FC<ValueIntroProps> = ({ onNavigate, currentMarket = 'ca' }) => {
  const industries = currentMarket === 'mw'
    ? [
        'Safari Lodges & Hospitality',
        'Healthcare & Clinics',
        'Agribusiness & Export',
        'Financial Services & Fintech',
        'Corporate & Legal',
        'NGOs & Foundations',
        'Retail & Distribution',
        'Renewable Energy',
      ]
    : [
        'Medical & Wellness Clinics',
        'Trades & Contractors',
        'Restaurants & Hospitality',
        'Real Estate & Developers',
        'Consultants & Coaches',
        'Retail & E-commerce',
        'Boutique Manufacturers',
        'Professional Practices',
      ];

  return (
    <section className="relative w-full border-t border-white/[0.08] bg-[#050607]/80 backdrop-blur-sm py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Editorial Headline & Narrative with GSAP Staggered Reveal */}
          <GsapStaggerReveal
            stagger={0.12}
            yOffset={32}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {currentMarket === 'mw'
                    ? 'Malawi · Senior Craft · Local Price Book'
                    : 'Canada · Senior Craft · Transparent Rates'}
                </span>
              </div>

              <h2 className="font-display text-[clamp(1.85rem,3.8vw,3.4rem)] font-black tracking-[-0.035em] text-[#EBECF0] leading-[1.12] uppercase">
                Websites that don’t just sit there — they{' '}
                <span className="text-zinc-300 block sm:inline">grow your business.</span>
              </h2>
            </div>

            <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed max-w-[65ch]">
              {currentMarket === 'mw' ? (
                <>
                  Unique Amaze is a boutique digital engineering studio building premium, AI-integrated websites for ambitious businesses in Malawi and across Africa. You collaborate directly with a senior specialist who merges conversion strategy, sub-1.2s mobile optimization, and local Airtel Money / Mpamba checkout to turn visitors into enquiries.
                </>
              ) : (
                <>
                  Unique Amaze is a boutique digital engineering studio building premium, AI-integrated websites for ambitious businesses across Canada. You collaborate directly with a dedicated senior specialist who merges conversion strategy, modern architecture, and practical AI to craft platforms that attract clients and produce measurable revenue.
                </>
              )}
            </p>

            <div className="pt-3 flex flex-wrap gap-2.5">
              <span className="font-mono text-xs text-zinc-500 py-1.5 mr-1 uppercase tracking-wider font-semibold">
                ENGINEERED FOR:
              </span>
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-md border border-white/[0.08] bg-[#0E1216] px-3.5 py-1.5 font-mono text-xs text-zinc-400 hover:border-white/20 hover:text-white transition-colors"
                >
                  {ind}
                </span>
              ))}
            </div>
          </GsapStaggerReveal>

          {/* Right Column: Architectural Metric Cards with Staggered GSAP Reveal */}
          <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-10 flex flex-col justify-between space-y-8">
            <GsapStaggerReveal
              stagger={0.1}
              yOffset={40}
              className="grid grid-cols-2 gap-5"
            >
              <div className="rounded-xl border border-white/10 bg-[#090D12] p-6 sm:p-7 space-y-2.5 h-full will-change-transform shadow-lg hover:border-white/20 transition-colors">
                <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">1-to-1</div>
                <div className="font-mono text-xs text-zinc-200 font-bold uppercase tracking-wider">Specialist Attention</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Direct collaboration with the architect — zero junior handoffs or account managers.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090D12] p-6 sm:p-7 space-y-2.5 h-full will-change-transform shadow-lg hover:border-white/20 transition-colors">
                <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {currentMarket === 'mw' ? '< 1.2s' : '99+'}
                </div>
                <div className="font-mono text-xs text-zinc-200 font-bold uppercase tracking-wider">
                  {currentMarket === 'mw' ? 'Mobile Load Target' : 'Lighthouse Target'}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {currentMarket === 'mw'
                    ? 'Sub-1.2s load speeds on TNM & Airtel networks with zero data bloat.'
                    : 'Google Core Web Vitals tuned for dominant local search rankings.'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090D12] p-6 sm:p-7 space-y-2.5 h-full will-change-transform shadow-lg hover:border-white/20 transition-colors">
                <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {currentMarket === 'mw' ? 'MWK' : 'CAD $'}
                </div>
                <div className="font-mono text-xs text-zinc-200 font-bold uppercase tracking-wider">
                  {currentMarket === 'mw' ? 'Malawi Price Book' : 'Transparent Rates'}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {currentMarket === 'mw'
                    ? 'Calibrated in fair Malawi Kwacha with milestone payments.'
                    : 'Transparent pricing with no hidden fees or scope creep.'}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#090D12] p-6 sm:p-7 space-y-2.5 h-full will-change-transform shadow-lg hover:border-white/20 transition-colors">
                <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">24/7</div>
                <div className="font-mono text-xs text-zinc-200 font-bold uppercase tracking-wider">Intelligent Intake</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Smart intake and discovery tools capture and qualify opportunities smoothly.
                </p>
              </div>
            </GsapStaggerReveal>

            <GsapStaggerReveal delay={0.25} yOffset={25}>
              <button
                onClick={() => {
                  studioAudio.playClick(850);
                  onNavigate('process');
                }}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-[#080B0E] p-6 text-xs font-mono text-zinc-200 hover:border-white/30 hover:text-white transition-all group shadow-md"
              >
                <span className="font-bold tracking-wide">EXPLORE THE 5-STEP A.M.A.Z.E. METHOD™</span>
                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1.5 transition-all" />
              </button>
            </GsapStaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
