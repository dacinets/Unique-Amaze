import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import { ProgressiveImage } from '../common/ProgressiveImage';

export const TransformationCards: React.FC = () => {
  const cards = [
    {
      from: 'Static brochure',
      to: 'Intelligent experience',
      desc: 'Your website should not simply display static info. It should guide visitors, answer inquiries in real-time, capture interest, and support the next step.',
      glass: 'glass-smoke',
      dominant: false,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=75',
      imgAlt: 'Real-time telemetry and analytical intelligence dashboard',
    },
    {
      from: 'Generic template',
      to: 'Premium brand presence',
      desc: 'We replace cookie-cutter site builders with a crafted visual system that makes your business look established, modern, and unquestionably credible.',
      glass: 'glass-dominant',
      dominant: true,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=75',
      imgAlt: 'Architectural minimalism and quiet luxury spatial design',
    },
    {
      from: 'Confusing pages',
      to: 'Clear conversion journeys',
      desc: 'Visitors should immediately understand what you do, why it matters, and how to take action without second-guessing or hunting through clutter.',
      glass: 'glass-slate',
      dominant: false,
    },
    {
      from: 'Passive website',
      to: 'Lead-ready system',
      desc: 'Smart forms, call-to-action pathways, and intelligent planning tools help your website actively capture and nurture opportunities 24/7.',
      glass: 'glass-teal',
      dominant: false,
    },
  ];

  return (
    <section className="relative w-full border-t border-white/[0.08] bg-[#050607]/85 backdrop-blur-sm py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <GsapStaggerReveal stagger={0.12} yOffset={32} className="max-w-4xl mb-14 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-1 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#008280] animate-pulse" />
            <span>THE TRANSFORMATION STANDARD</span>
          </div>

          <h2 className="font-display text-[clamp(1.85rem,3.8vw,3.4rem)] font-black tracking-[-0.035em] text-[#EBECF0] leading-[1.12] uppercase">
            We do not just redesign websites. <br className="hidden sm:inline" />
            <span className="title-gradient-teal">We reshape how businesses are experienced.</span>
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-[65ch]">
            Every Unique Amaze project moves a business from a passive digital presence into a clearer, smarter, more premium experience built to earn trust and generate bookings.
          </p>
        </GsapStaggerReveal>

        {/* Clean Architectural Cards with Staggered GSAP Reveal */}
        <GsapStaggerReveal
          stagger={0.14}
          yOffset={50}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              data-cursor="card"
              className={`group relative h-full rounded-xl border p-8 sm:p-11 transition-all duration-300 will-change-transform flex flex-col justify-between overflow-hidden ${
                card.glass
              } ${
                card.dominant
                  ? 'border-[#16D2C8]/50 shadow-[0_25px_60px_rgba(0,130,128,0.22)]'
                  : 'border-white/[0.08] hover:border-[#008280]/50 hover:shadow-[0_20px_50px_rgba(0,130,128,0.15)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#64748B] mb-6 pb-4 border-b border-white/[0.06] font-semibold">
                  <span className={card.dominant ? 'text-[#16D2C8]' : ''}>TRANSFORMATION // 0{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {card.dominant && (
                      <span className="rounded bg-[#16D2C8]/15 border border-[#16D2C8]/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#16D2C8] uppercase tracking-wider">
                        FLAGSHIP SHIFT
                      </span>
                    )}
                    <Sparkles className={`h-3.5 w-3.5 ${card.dominant ? 'text-[#16D2C8]' : 'text-[#008280]'}`} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] font-semibold">FROM</span>
                    <div className="font-display text-lg sm:text-xl font-semibold text-[#64748B] line-through decoration-[#64748B]/50 mt-1 uppercase">
                      {card.from}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-1.5">
                    <div className="h-[2px] flex-1 bg-white/15" />
                    <ArrowRight className={`h-4 w-4 ${card.dominant ? 'text-[#16D2C8]' : 'text-[#008280]'}`} />
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#16D2C8] font-semibold">TO</span>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-[#EBECF0] mt-1 tracking-tight uppercase group-hover:text-[#16D2C8] transition-colors">
                      {card.to}
                    </div>
                  </div>

                  <p className="font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed pt-2">
                    {card.desc}
                  </p>
                </div>
              </div>

              {/* Optional editorial visual teaser with zero layout shift */}
              {card.image && (
                <div className="mt-7 relative overflow-hidden rounded-lg border border-white/10 w-full bg-[#080B0E] group shadow-inner">
                  <ProgressiveImage
                    src={card.image}
                    alt={card.imgAlt || ''}
                    aspectRatio="16/7"
                    overlayScrim="bottom"
                    imageClassName="brightness-[0.55] contrast-[1.1]"
                  />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[#16D2C8] z-30 pointer-events-none">
                    <span className="tracking-widest uppercase font-semibold">{card.to}</span>
                    <span className="text-[#64748B]">PROOF POINT</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </GsapStaggerReveal>
      </div>
    </section>
  );
};
