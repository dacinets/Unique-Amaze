import React, { useState, useEffect } from 'react';
import { PageRoute, MarketType } from '../../types';
import { LOGO_DATA_URI, STUDIO_MARKETS } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { FooterHoverLines } from './FooterHoverLines';
import {
  ArrowUp,
  Terminal,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  Mail,
  Copy,
  Check,
  Phone,
  ArrowUpRight,
  Zap,
  Globe2,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
  onMarketChange?: (market: MarketType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentMarket, onMarketChange }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [canadaTime, setCanadaTime] = useState('');
  const [malawiTime, setMalawiTime] = useState('');

  // Live World Clocks for Dual Regional Studios
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();

      try {
        const caString = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Edmonton',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setCanadaTime(caString);
      } catch {
        setCanadaTime('10:45:12 AM');
      }

      try {
        const mwString = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Blantyre',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setMalawiTime(mwString);
      } catch {
        setMalawiTime('06:45:12 PM');
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    studioAudio.playClick(950);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    studioAudio.playClick(1100);
    navigator.clipboard.writeText('hello@uniqueamaze.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const socialChannels = [
    { label: 'LINKEDIN', url: 'https://linkedin.com' },
    { label: 'TWITTER / X', url: 'https://x.com' },
    { label: 'GITHUB', url: 'https://github.com' },
    { label: 'INSTAGRAM', url: 'https://instagram.com' },
    { label: 'DRIBBBLE', url: 'https://dribbble.com' },
    { label: 'READ.CV', url: 'https://read.cv' },
  ];

  return (
    <footer
      id="studio-footer"
      className="relative w-full border-t border-white/10 bg-[#090D14] pt-20 sm:pt-24 pb-12 overflow-hidden shadow-2xl"
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-t from-white/[0.03] to-transparent blur-[140px] z-0" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* ========================================================================= */}
        {/* FOOTER SECTION 1: ARCHITECTURAL CTA DOCK WITH BACKGROUND IMAGE            */}
        {/* ========================================================================= */}
        <div className="cta-image-container group rounded-2xl border border-white/10 p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
            alt="Unique Amaze Modern Architecture Studio"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Harmonized High Contrast Scrim Layer (Prevents font clash in Obsidian & Lunar) */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end relative z-10">
            {/* Left: Colossal Heading */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-bold">
                <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                <span>PROJECT DISPATCH &amp; COLLABORATION</span>
              </div>

              <h2 className="font-display text-[clamp(2.2rem,4.8vw,4.5rem)] font-black uppercase text-[#0F172A] dark:text-[#EBECF0] tracking-[-0.04em] leading-[0.96]">
                HAVE A VISION IN MIND?{' '}
                <span className="title-gradient-slate block sm:inline">
                  LET&apos;S TALK.
                </span>
              </h2>

              <p className="max-w-[65ch] font-sans text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed pt-3">
                Whether you need a high-converting digital flagship in North America or a blazing-fast, mobile-money integrated commerce experience in Africa, we build websites that transform business outcomes.
              </p>
            </div>

            {/* Right: Interactive Action Dock */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Primary Magnetic CTA Button with Image Texture */}
              <button
                onClick={() => {
                  studioAudio.playClick(1000);
                  onNavigate('planner');
                  scrollToTop();
                }}
                className="cta-image-btn group relative flex items-center justify-between w-full overflow-hidden rounded-xl px-6 py-5 text-white font-mono text-sm uppercase tracking-wider font-bold shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="relative z-10 flex items-center gap-3 text-white">
                  <Zap className="h-5 w-5" />
                  <span className="tracking-wider">START A PROJECT</span>
                </div>
                <div className="relative z-10 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="h-4 w-4 text-white" />
                </div>
              </button>

              {/* Direct 1-Click Copy Email Button */}
              <button
                onClick={handleCopyEmail}
                className="cta-secondary-btn group flex items-center justify-between w-full rounded-xl border px-6 py-4 font-mono text-xs uppercase transition-all"
                title="Click to copy email address"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <span className="font-semibold tracking-wider">
                    HELLO@UNIQUEAMAZE.COM
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] group-hover:text-white">
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">COPY ADDRESS</span>
                    </>
                  )}
                </div>
              </button>

              {/* Direct Studio Phone Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono text-[11px]">
                <a
                  href="tel:+14039096447"
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#070A0F] p-3 text-[#94A3B8] hover:border-white/30 hover:text-[#EBECF0] transition-colors"
                >
                  <Phone className="h-3 w-3 text-zinc-400" />
                  <span>CA: +1 (403) 909-6447</span>
                </a>
                <a
                  href="tel:+265991234567"
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#070A0F] p-3 text-[#94A3B8] hover:border-white/30 hover:text-[#EBECF0] transition-colors"
                >
                  <Phone className="h-3 w-3 text-zinc-400" />
                  <span>MW: +265 99 123 4567</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER SECTION 2: AUDIO STRING RACK (Shade: #06090E)                      */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#06090E]/90 p-6 sm:p-8 shadow-lg">
          <FooterHoverLines />
        </div>

        {/* ========================================================================= */}
        {/* FOOTER SECTION 3: DUAL STUDIO WORLD CLOCKS (Shade: #0C121A)               */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0C121A] p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-bold mb-5">
            <Clock className="h-3.5 w-3.5" />
            <span>SYNCHRONIZED STUDIO TIMEZONES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Canada Studio Clock */}
            <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#080C11] p-5 font-mono shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-[#EBECF0] tracking-wider uppercase">
                    CALGARY STUDIO · CANADA (MST)
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    HIGH-CONVERTING DIGITAL ARCHITECTURE &amp; AI
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <Clock className="h-4 w-4 text-zinc-400 hidden sm:block" />
                <div className="font-mono text-sm font-bold text-white tracking-wider">
                  {canadaTime || '11:42:09 AM'}
                </div>
              </div>
            </div>

            {/* Malawi Studio Clock */}
            <div className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#080C11] p-5 font-mono shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-[#EBECF0] tracking-wider uppercase">
                    LILONGWE STUDIO · MALAWI (CAT)
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    MOBILE MONEY &amp; SUB-1.2S ULTRA SPEED
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <Clock className="h-4 w-4 text-zinc-400 hidden sm:block" />
                <div className="font-mono text-sm font-bold text-white tracking-wider">
                  {malawiTime || '07:42:09 PM'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER SECTION 4: MULTI-COLUMN DIRECTORY (Shade: #070A0F)                 */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#070A0F]/95 p-8 sm:p-12 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 font-mono text-xs">
            {/* Col 1: Brand Philosophy (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-[#0C1014] p-1">
                  <img src={LOGO_DATA_URI} alt="Unique Amaze" className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-[#F3F7F8]">UNIQUE </span>
                  <span className="title-gradient-slate font-display text-xl font-black">AMAZE</span>
                </div>
              </div>

              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed max-w-sm">
                We design and engineer bespoke web platforms for ambitious companies. Combining kinetic scrollytelling, instantaneous load times, and custom intelligent integrations.
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] text-zinc-300 font-bold">
                  <Globe2 className="h-3 w-3" />
                  <span>CURRENT MARKET: {currentMarket === 'ca' ? 'CANADA (CAD)' : 'MALAWI (MWK)'}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Pillar Navigation (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="font-mono text-[11px] font-bold tracking-widest uppercase mb-4 text-zinc-300">
                PRIMARY NAVIGATION
              </div>
              <ul className="space-y-2.5 text-[#94A3B8]">
                {[
                  { label: 'WORK', route: 'work' as PageRoute },
                  { label: 'SERVICES', route: 'services' as PageRoute },
                  { label: 'INDUSTRIES', route: 'industries' as PageRoute },
                  { label: 'A.M.A.Z.E.™', route: 'process' as PageRoute },
                  { label: 'ABOUT', route: 'about' as PageRoute },
                  { label: 'CONTACT', route: 'contact' as PageRoute },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        studioAudio.playClick(920);
                        onNavigate(item.route);
                        scrollToTop();
                      }}
                      className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2"
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Interactive Portals & Utilities (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="font-mono text-[11px] font-bold tracking-widest uppercase mb-4 text-zinc-300">
                EXPLORE &amp; TOOLS
              </div>
              <ul className="space-y-2.5 text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick(960);
                      onNavigate('planner');
                      scrollToTop();
                    }}
                    className="text-white hover:text-zinc-200 flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <Sparkles className="h-3 w-3 text-zinc-400" />
                    <span>PROJECT PLANNER</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick(920);
                      onNavigate('pricing');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    PRICING
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick(920);
                      onNavigate('faq');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick(920);
                      onNavigate('planner');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors font-semibold"
                  >
                    START A PROJECT
                  </button>
                </li>
                <li>
                  <span className="text-[#64748B] text-[11px]">
                    CLIENT ROSTER: 2026 ACTIVE
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Network & Socials (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="font-mono text-[11px] font-bold tracking-widest uppercase mb-4 text-zinc-300">
                CHANNELS
              </div>
              <div className="grid grid-cols-2 gap-2">
                {socialChannels.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => studioAudio.playClick(1050)}
                    className="group flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#0B0F15] p-2.5 text-[#94A3B8] hover:border-white/30 hover:text-white transition-all"
                  >
                    <span className="text-[10px] tracking-wider">{soc.label}</span>
                    <ArrowUpRight className="h-3 w-3 text-[#64748B] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>

              {/* Accreditations Strip */}
              <div className="pt-3 space-y-1.5 font-mono text-[10px] text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-zinc-400" />
                  <span>LIGHTHOUSE 99+ SPEED PROTOCOL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-zinc-400" />
                  <span>WCAG 2.1 AA ACCESSIBILITY AUDITED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOOTER SECTION 5: BOTTOM METADATA & BACK-TO-APEX (Shade: #040608)         */}
        {/* ========================================================================= */}
        <div className="border-t border-white/[0.08] bg-[#040608] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-8 pb-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px] text-[#64748B]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#94A3B8]">
                <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                <span>UNIQUE AMAZE WEB STUDIO</span>
              </div>
              <span className="text-white/20">•</span>
              <span>© 2026 UNIQUE AMAZE. ALL RIGHTS RESERVED.</span>
              <span className="text-white/20">•</span>
              <button
                onClick={() => {
                  studioAudio.playClick(920);
                  onNavigate('privacy');
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                PRIVACY POLICY
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => {
                  studioAudio.playClick(920);
                  onNavigate('terms');
                  scrollToTop();
                }}
                className="hover:text-white transition-colors"
              >
                TERMS OF SERVICE
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:inline text-[10px]">
                CALGARY • LILONGWE • HYBRID DISPATCH
              </div>

              {/* Magnetic Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0A0D12] px-4 py-2 text-[#EBECF0] hover:border-white/30 hover:text-white transition-all cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ABSOLUTE FOOTER: MINIMAL REGIONAL PRESENCE CONTAINER (FLAGS, TIME, REGION) */}
        {/* ========================================================================= */}
        <div
          id="absolute-footer-regional-strip"
          className="border-t border-white/[0.08] bg-[#020306] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 sm:py-6"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 font-mono text-xs">
            {/* Dual Regional Hubs with Flags & Live Times */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-center sm:text-left">
              {/* Canadian Studio Hub */}
              <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2">
                <span className="text-lg leading-none select-none" role="img" aria-label="Canadian Flag">🇨🇦</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EBECF0] font-bold tracking-wider text-[11px] uppercase">
                      CALGARY · CANADA
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-emerald-400 font-semibold text-[10px]">
                      MST {canadaTime || '11:42:09 AM'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    MOUNTAIN TIME · HIGH-CONVERTING DIGITAL SYSTEMS &amp; AI
                  </div>
                </div>
              </div>

              {/* Malawian Studio Hub */}
              <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2">
                <span className="text-lg leading-none select-none" role="img" aria-label="Malawian Flag">🇲🇼</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#EBECF0] font-bold tracking-wider text-[11px] uppercase">
                      LILONGWE · MALAWI
                    </span>
                    <span className="text-white/20">|</span>
                    <span className="text-emerald-400 font-semibold text-[10px]">
                      CAT {malawiTime || '07:42:09 PM'}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    CENTRAL AFRICA TIME · MOBILE MONEY &amp; SUB-1.2S SPEED
                  </div>
                </div>
              </div>
            </div>

            {/* Seamless Regional Currency & Market Context Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold hidden sm:inline">
                REGIONAL CONTEXT:
              </span>
              <div className="inline-flex items-center rounded-lg border border-white/10 bg-[#080B10] p-1">
                <button
                  id="absolute-footer-region-ca-btn"
                  onClick={() => {
                    studioAudio.playClick(900);
                    onMarketChange?.('ca');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                    currentMarket === 'ca'
                      ? 'bg-white/15 text-white font-bold border border-white/25 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
                  }`}
                  title="Switch to Canada Regional Context (CAD $)"
                >
                  <span role="img" aria-label="Canada">🇨🇦</span>
                  <span>CAD ($)</span>
                </button>

                <button
                  id="absolute-footer-region-mw-btn"
                  onClick={() => {
                    studioAudio.playClick(900);
                    onMarketChange?.('mw');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                    currentMarket === 'mw'
                      ? 'bg-white/15 text-white font-bold border border-white/25 shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
                  }`}
                  title="Switch to Malawi Regional Context (MWK)"
                >
                  <span role="img" aria-label="Malawi">🇲🇼</span>
                  <span>MWK</span>
                </button>
              </div>

              {/* Status Beacon */}
              <div className="hidden xl:flex items-center gap-1.5 text-[10px] text-zinc-400 pl-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="tracking-wider uppercase">DUAL-HUB ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
