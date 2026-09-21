import React, { useState, useEffect } from 'react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { TESTIMONIALS_DATA, STUDIO_MARKETS, LOGO_DATA_URI } from '../../data/uniqueAmazeData';
import { BrandDivider } from '../common/BrandDivider';
import { ProgressiveImage } from '../common/ProgressiveImage';
import { UnrollingMatPanel } from './UnrollingMatPanel';
import {
  Globe,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Award,
  Layers,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, currentMarket }) => {
  const [worldTimes, setWorldTimes] = useState<Record<string, string>>({});

  // Synchronized Real-Time World Clocks for Studio Hubs
  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      STUDIO_MARKETS.forEach((loc) => {
        try {
          const now = new Date();
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: loc.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });
          times[loc.city] = formatter.format(now);
        } catch {
          times[loc.city] = '--:--:--';
        }
      });
      setWorldTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const corePillars = [
    {
      num: '01',
      title: 'Architectural Restraint',
      subtitle: 'ZERO BLOAT & MATHEMATICAL SCALES',
      desc: 'We reject generic theme builders and bloated visual baggage. Every layout is mathematically balanced using deliberate typographic ratios, intentional negative space, and clean semantic code.',
      icon: Layers,
      glass: 'glass-smoke',
      dominant: false,
    },
    {
      num: '02',
      title: 'The 1-to-1 Specialist Model',
      subtitle: 'DIRECT COLLABORATION // NO INTERMEDIARIES',
      desc: 'You work directly with the specialist architecting, designing, and coding your site. No account managers playing telephone, no bureaucratic overhead, and no junior handoffs.',
      icon: Users,
      glass: 'glass-slate',
      dominant: false,
    },
    {
      num: '03',
      title: 'Zero Friction Engineering',
      subtitle: 'SUB-SECOND LOADS & 95+ LIGHTHOUSE TARGETS',
      desc: 'Speed is conversion. We engineer sites that load in under 1.2 seconds, prioritize mobile-first ergonomic touch targets, and ensure frictionless lead capture and appointment booking.',
      icon: Zap,
      glass: 'glass-teal',
      dominant: false,
    },
    {
      num: '04',
      title: 'Practical AI Intelligence',
      subtitle: 'SAGE AI & AUTONOMOUS CLIENT CONCIERGES',
      desc: 'We integrate practical, quiet AI workflows that work 24/7 in the background — conversational assistants, automated client qualification, and CRM synchronization — rather than superficial gimmicks.',
      icon: Sparkles,
      glass: 'glass-dominant',
      dominant: true,
    },
    {
      num: '05',
      title: 'Dual-Region Local Value',
      subtitle: 'HONEST LOCAL PRICING // CANADA & MALAWI',
      desc: 'We maintain independent local price books calibrated for real purchasing power in Canada (CAD) and Malawi (MWK) — never arbitrary speculative currency conversions.',
      icon: Globe,
      glass: 'glass-amber',
      dominant: false,
    },
    {
      num: '06',
      title: 'Complete Client Ownership',
      subtitle: '100% ASSETS, CODE & DOMAIN AUTHORITY',
      desc: 'Upon handover, you own every line of code, design asset, and domain setting. We provide full administrative access, clear documentation, and optional proactive care plans.',
      icon: ShieldCheck,
      glass: 'glass-smoke',
      dominant: false,
    },
  ];

  return (
    <div className="relative w-full py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header & Philosophy Statement */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4 font-semibold">
            <Target className="h-3.5 w-3.5 text-[#008280]" />
            <span>ABOUT UNIQUE AMAZE // STUDIO PHILOSOPHY</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            WE BUILD DIGITAL EXPERIENCES THAT{' '}
            <span className="text-[#008280] block sm:inline">REFUSE COMMODITIZATION.</span>
          </h1>

          <p className="mt-8 font-sans text-base sm:text-lg text-[#CBD5E1] leading-relaxed max-w-2xl">
            Unique Amaze was founded on an unapologetic refusal to treat digital interfaces as disposable skins.
            We treat computational physics, typographic pacing, and quiet AI intelligence as core structural materials.
          </p>
        </div>

        {/* Studio Origin & Manifesto Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch mb-24 sm:mb-32">
          <div className="lg:col-span-7 rounded-xl border border-white/10 glass-smoke p-8 sm:p-12 lg:p-14 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6 font-sans text-base leading-relaxed text-[#CBD5E1]">
              <div className="font-mono text-xs text-[#16D2C8] tracking-widest uppercase font-semibold">
                // THE STUDIO MANIFESTO
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EBECF0] tracking-tight">
                The code is the sculpture. The experience is the conversion.
              </h2>
              <p>
                Most business websites are built on bloated, off-the-shelf templates stitched together with fifty conflicting plugins.
                They look generic, load sluggishly, and leak high-intent visitors before the second scroll.
              </p>
              <p>
                At Unique Amaze, we engineer websites from first principles. By fusing modern TypeScript architecture with
                kinetic scrollytelling and practical conversational AI, we build digital flagships that position our clients
                as the unmistakable authority in their industry.
              </p>

              {/* Atelier / Creative Workspace Visual Fragment with Progressive Image & Locked Aspect Ratio */}
              <div className="relative overflow-hidden rounded-lg border border-white/10 w-full bg-[#080B0E] group my-4 shadow-md">
                <ProgressiveImage
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=75"
                  alt="Architectural studio atelier with design sketches, computational wireframes, and dual monitors"
                  aspectRatio="16/7"
                  overlayScrim="bottom"
                  imageClassName="brightness-[0.58] contrast-[1.1]"
                />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[#16D2C8] z-30 pointer-events-none">
                  <span className="tracking-widest uppercase font-semibold">STUDIO ATELIER // WORKBENCH ARTIFACTS</span>
                  <span className="text-[#94A3B8]">CALGARY &amp; LILONGWE</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center gap-4">
              <div className="h-11 w-11 overflow-hidden rounded-lg border border-white/10 bg-[#0C1014] p-1 shadow-md">
                <img
                  src={LOGO_DATA_URI}
                  alt="Unique Amaze Logo"
                  className="h-full w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,130,128,0.5)]"
                />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-[#EBECF0]">UNIQUE AMAZE STUDIO</div>
                <div className="font-mono text-[10px] text-[#008280] tracking-wider uppercase">
                  Bespoke Web Architecture & AI Engineering
                </div>
              </div>
            </div>
          </div>

          {/* Unrolling Mat Panel Section for Our Commitment */}
          <UnrollingMatPanel onNavigate={onNavigate} />
        </div>

        {/* Subtle Horizontal Divider: Manifesto to Global Hubs */}
        <BrandDivider
          variant="teal"
          width="container"
          spacing="lg"
          label="GLOBAL HUBS"
          sublabel="SYNCHRONIZED TIMEZONES"
        />

        {/* Global Studio Coordinates & Live Regional Clocks */}
        <div className="rounded-xl border border-white/10 glass-smoke p-8 sm:p-14 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#008280] uppercase">
                <Globe className="h-4 w-4 text-[#16D2C8]" />
                <span>GLOBAL STUDIO HUBS & SYNCHRONIZED TIMEZONES</span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#EBECF0] tracking-tight">
                Two Continents. One Disciplined Standard.
              </h2>
            </div>
            <span className="self-start sm:self-center font-mono text-xs text-[#16D2C8] bg-[#16D2C8]/10 border border-[#16D2C8]/30 px-3.5 py-1.5 rounded-full animate-pulse">
              ● STUDIOS SYNCHRONIZED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STUDIO_MARKETS.map((loc) => (
              <div
                key={loc.city}
                className="rounded-xl border border-white/10 glass-slate p-7 hover:border-[#16D2C8]/50 transition-all group"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#EBECF0] tracking-widest">{loc.city}</span>
                  <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-[#008280]/20 text-[#16D2C8]">
                    {loc.status}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2 font-mono text-2xl font-bold text-[#16D2C8]">
                  <Clock className="h-4 w-4 text-[#008280]" />
                  <span>{worldTimes[loc.city] || '--:--:--'}</span>
                </div>

                <div className="mt-5 space-y-1.5 font-mono text-[11px] text-[#94A3B8]">
                  <div className="flex items-center gap-1.5 text-[#CBD5E1]">
                    <MapPin className="h-3 w-3 text-[#16D2C8]" />
                    <span>{loc.region}</span>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">TZ: {loc.tz}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-xs font-mono text-[#94A3B8] flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
            <span>CANADIAN STUDIO: CHESTERMERE & CALGARY, AB</span>
            <span>MALAWI STUDIO: BLANTYRE & LILONGWE</span>
            <span className="text-[#16D2C8] font-bold">ACTIVE CLIENT ROSTER 2026</span>
          </div>
        </div>

        {/* Subtle Horizontal Divider: Global Hubs to Studio Pillars */}
        <BrandDivider
          variant="slate"
          width="container"
          spacing="xl"
          label="STUDIO PILLARS"
          sublabel="DISCIPLINED METHODOLOGY"
        />

        {/* The 6 Core Studio Pillars */}
        <div>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <div className="font-mono text-xs text-[#008280] tracking-widest uppercase font-semibold mb-2">
              // STUDIO PILLARS
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide text-[#EBECF0] uppercase">
              HOW WE OPERATE & DELIVER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corePillars.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className={`rounded-xl border p-8 sm:p-9 transition-all group flex flex-col justify-between ${pillar.glass} ${
                    pillar.dominant
                      ? 'border-[#16D2C8]/50 shadow-xl'
                      : 'border-white/[0.08] hover:border-[#008280]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-[#64748B] mb-6">
                      <span className={`${pillar.dominant ? 'text-[#16D2C8]' : 'text-[#008280]'} font-bold text-sm`}>
                        {pillar.num}
                      </span>
                      <IconComp className={`h-4 w-4 ${pillar.dominant ? 'text-[#16D2C8]' : 'text-[#008280]'} group-hover:text-[#16D2C8] transition-colors`} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#EBECF0] tracking-tight mb-2">
                      {pillar.title}
                    </h3>
                    <div className="font-mono text-[10px] text-[#008280] tracking-wider uppercase mb-4">
                      {pillar.subtitle}
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Horizontal Divider: Pillars to Verified Testimonials */}
        <BrandDivider
          variant="cyan"
          width="container"
          spacing="xl"
          label="CLIENT EXPERIENCES"
          sublabel="VERIFIED REVIEWS"
        />

        {/* Client Endorsements / Testimonials */}
        <div>
          <div className="max-w-2xl mb-12 sm:mb-14">
            <div className="font-mono text-xs text-[#008280] tracking-widest uppercase font-semibold mb-2">
              // VERIFIED CLIENT EXPERIENCES
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-wide text-[#EBECF0] uppercase">
              TRUSTED ACROSS CANADA & MALAWI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((t, idx) => {
              const isHighlight = idx === 1; // Middle card dominant
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-8 sm:p-10 flex flex-col justify-between ${
                    isHighlight
                      ? 'glass-teal border-[#008280]/50 shadow-md'
                      : 'glass-smoke border-white/[0.08]'
                  }`}
                >
                  <div>
                    <div className="flex text-[#16D2C8] text-xs gap-1 mb-5">
                      {'★'.repeat(t.rating)}
                    </div>
                    <p className="font-sans text-sm text-[#EBECF0] leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center gap-3.5">
                    <div className="h-9 w-9 rounded-full bg-[#008280]/20 border border-[#008280]/40 flex items-center justify-center font-mono text-xs font-bold text-[#16D2C8]">
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-sans text-xs font-bold text-[#EBECF0]">{t.name}</div>
                      <div className="font-mono text-[10px] text-[#64748B]">{t.role}</div>
                      <div className="font-mono text-[9px] text-[#008280]">{t.location}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subtle Horizontal Divider: Testimonials to Conversion Banner */}
        <BrandDivider
          variant="gradient"
          width="container"
          spacing="xl"
          label="PARTNERSHIP"
          sublabel="START YOUR PROJECT"
        />

        {/* Bottom Conversion Banner with Architectural Background Image */}
        <div className="cta-image-container group rounded-2xl border border-white/10 p-10 sm:p-16 text-center shadow-xl relative overflow-hidden">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
            alt="Unique Amaze Modern Architecture Interior"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Adaptive Contrast Scrim */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase font-bold">
              <Sparkles className="h-3.5 w-3.5 text-[#008280]" />
              <span>READY TO ELEVATE YOUR BRAND?</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#EBECF0] tracking-tight uppercase">
              LET’S DESIGN A DIGITAL FLAGSHIP THAT WORKS FOR YOU.
            </h2>

            <p className="font-sans text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Book a free strategy conversation with our specialist or use our Project Planner to receive a custom recommendation tailored to your budget and objectives.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono text-xs">
              <button
                onClick={() => {
                  studioAudio.playClick(950);
                  onNavigate('planner');
                }}
                className="cta-image-btn group/btn relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
              >
                <span className="relative z-10 text-white">START A PROJECT</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5 text-white" />
              </button>

              <button
                onClick={() => {
                  studioAudio.playClick(800);
                  onNavigate('services');
                }}
                className="cta-secondary-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-bold transition-all uppercase tracking-wider hover:scale-105 active:scale-95"
              >
                <span>EXPLORE SERVICES</span>
              </button>

              <button
                onClick={() => {
                  studioAudio.playClick(800);
                  onNavigate('contact');
                }}
                className="cta-secondary-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 font-bold transition-all uppercase tracking-wider hover:scale-105 active:scale-95"
              >
                <span>CONTACT US</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
