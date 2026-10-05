import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, MarketType } from '../../types';
import { ThreeLeafMark } from './ThreeLeafMark';
import { InteractiveStudioCanvas } from './InteractiveStudioCanvas';
import { ScrollFlyIn } from '../common/ScrollFlyIn';
import { GsapStaggerReveal } from '../common/GsapStaggerReveal';
import { studioAudio } from '../../utils/audio';
import { useScrollVelocity } from '../../utils/useScrollEngine';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Globe,
  Eye,
  Sliders,
  Maximize2,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Layers,
  Activity,
  Code2,
  Cpu,
  Terminal,
  Clock,
  CalendarCheck
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
  onMarketChange: (market: MarketType) => void;
}

type StudioLens = 'craft' | 'wireframe' | 'neural' | 'code';

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  currentMarket,
  onMarketChange,
}) => {
  const [activeLens, setActiveLens] = useState<StudioLens>('craft');
  const [kineticVerbIndex, setKineticVerbIndex] = useState(0);
  const [isClientTabActive, setIsClientTabActive] = useState<'service' | 'rates' | 'intake'>('service');
  const [interactiveCounter, setInteractiveCounter] = useState(3);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Kinetic "Hold to Blast / Surge" state
  const [holdCharge, setHoldCharge] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isBlasted, setIsBlasted] = useState(false);
  const [blastCount, setBlastCount] = useState(0);

  // Kinetic cycler
  useEffect(() => {
    let chargeTimer: NodeJS.Timeout;
    if (isHolding && !isBlasted) {
      chargeTimer = setInterval(() => {
        setHoldCharge((prev) => {
          const next = prev + 5;
          studioAudio.playCharge(Math.min(1, next / 100));
          if (next >= 100) {
            setIsHolding(false);
            setIsBlasted(true);
            setBlastCount((c) => c + 1);
            studioAudio.playBlast();
            setTimeout(() => {
              setIsBlasted(false);
              setHoldCharge(0);
            }, 3000);
            return 100;
          }
          return next;
        });
      }, 40);
    } else if (!isHolding && !isBlasted && holdCharge > 0) {
      // Decay charge
      setHoldCharge(0);
    }
    return () => clearInterval(chargeTimer);
  }, [isHolding, isBlasted, holdCharge]);

  const triggerInstantBlast = () => {
    studioAudio.playBlast();
    setIsBlasted(true);
    setBlastCount((c) => c + 1);
    setHoldCharge(100);
    setTimeout(() => {
      setIsBlasted(false);
      setHoldCharge(0);
    }, 2800);
  };

  // Dynamic kinetic headlines tailored to market
  const canadaVerbs = [
    'CONVERT CANADIAN CLIENTS',
    'DOMINATE LOCAL SEARCH',
    'AUTOMATE CLIENT BOOKINGS',
    'OUTPERFORM TEMPLATES',
  ];
  const malawiVerbs = [
    'LEAD ACROSS MALAWI',
    'LOAD UNDER 1.2 SECONDS',
    'ACCEPT AIRTEL & MPAMBA',
    'OUTPERFORM TEMPLATES',
  ];
  const activeVerbs = currentMarket === 'mw' ? malawiVerbs : canadaVerbs;

  // Kinetic cycler
  useEffect(() => {
    const timer = setInterval(() => {
      setKineticVerbIndex((prev) => (prev + 1) % activeVerbs.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [activeVerbs.length]);

  const handleBooking = () => {
    studioAudio.playClick(1100);
    setInteractiveCounter((prev) => prev + 1);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 3000);
  };

  const heroSectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const workbenchRef = useRef<HTMLDivElement>(null);
  const scrollVelocity = useScrollVelocity(30);

  // First 100-150vh Scroll Journey Choreography
  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (!heroEl) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroEl,
          start: 'top top',
          end: '+=120%',
          scrub: 0.6,
        },
      });

      if (headlineRef.current) {
        tl.to(
          headlineRef.current,
          {
            y: -50,
            scale: 0.94,
            opacity: 0.25,
            ease: 'none',
          },
          0
        );
      }

      if (workbenchRef.current) {
        tl.to(
          workbenchRef.current,
          {
            y: -30,
            scale: 0.96,
            opacity: 0.35,
            ease: 'none',
          },
          0
        );
      }
    }, heroEl);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroSectionRef}
      className="relative overflow-hidden flex flex-col justify-start pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 lg:pb-12 will-change-transform"
    >
      {/* Interactive Architectural Canvas Animation */}
      <InteractiveStudioCanvas />

      {/* Subtle Volumetric Slate Shading */}
      <div className="pointer-events-none absolute inset-0 radial-mesh-slate opacity-30 z-0" />

      <div className="mx-auto max-w-[1280px] w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Typographic Display Headline: Bold, Solid High-Contrast, Fluid Clamp */}
        <div ref={headlineRef} className="max-w-4xl mx-auto text-center mb-14 sm:mb-20 will-change-transform">
          <GsapStaggerReveal stagger={0.09} yOffset={26} className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
              <span className="tracking-widest uppercase font-semibold">
                {currentMarket === 'mw'
                  ? 'Boutique Web Studio · Malawi'
                  : 'Boutique Web Studio · Canada'}
              </span>
            </div>

            {/* Heavy Architectural Display Headline scaled with clamp */}
            <h1 className="font-display text-[clamp(2.2rem,5vw,4.6rem)] font-black tracking-[-0.035em] text-[#EBECF0] leading-[1.05] uppercase">
              WE ARCHITECT WEBSITES THAT <br />
              <span className="title-gradient-slate transition-all duration-300">
                {activeVerbs[kineticVerbIndex]}
              </span>
            </h1>

            {/* Clear, High-Contrast Subtitle with controlled line measure */}
            <p className="mx-auto max-w-2xl font-sans text-sm sm:text-base md:text-lg text-[#94A3B8] leading-relaxed">
              {currentMarket === 'mw' ? (
                <>
                  Unique Amaze crafts high-impact, ultra-fast websites and AI-powered booking systems for Malawian enterprises, clinics, safari lodges, and ambitious brands. Engineered to load in under 1.2s on TNM &amp; Airtel networks, integrated with Airtel Money &amp; Mpamba, and priced in fair Malawi Kwacha.
                </>
              ) : (
                <>
                  Unique Amaze crafts intelligent, high-converting digital flagships and AI-ready client portals for ambitious Canadian businesses across Alberta, BC, and Ontario. Engineered for dominant Google search rankings, frictionless booking, and 24/7 automated client qualification.
                </>
              )}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
              <button
                onClick={() => {
                  studioAudio.playClick(1100);
                  onNavigate('contact');
                }}
                className="cta-image-btn group flex items-center gap-2.5 rounded-lg px-8 py-4 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>BOOK A FREE STRATEGY CALL</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  studioAudio.playClick(900);
                  onNavigate('planner');
                }}
                className="cta-secondary-btn flex items-center gap-2 rounded-lg border px-8 py-4 font-mono text-xs font-bold transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4 text-zinc-400" />
                <span>START 2-MIN AI PROJECT PLANNER</span>
              </button>
            </div>

            {/* Regional Trust Marks Strip */}
            <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-mono text-xs text-zinc-400">
              {currentMarket === 'mw' ? (
                <>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>TRANSPARENT MWK PRICING</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Smartphone className="h-4 w-4 text-zinc-300" />
                    <span>AIRTEL MONEY &amp; MPAMBA READY</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Zap className="h-4 w-4 text-zinc-300" />
                    <span>SUB-1.2S SPEED ON MOBILE DATA</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Globe className="h-4 w-4 text-zinc-300" />
                    <span>LILONGWE &amp; BLANTYRE STUDIO</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>CAD $ TRANSPARENT PRICE BOOK</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CreditCard className="h-4 w-4 text-zinc-300" />
                    <span>INTERAC &amp; STRIPE INTEGRATION</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Zap className="h-4 w-4 text-zinc-300" />
                    <span>99+ LIGHTHOUSE SPEED SCORE</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Globe className="h-4 w-4 text-zinc-300" />
                    <span>1-TO-1 SPECIALIST ATTENTION</span>
                  </div>
                </>
              )}
            </div>
          </GsapStaggerReveal>
        </div>

        {/* Award-Winning Design Studio Workbench: 3D Kinetic Brand Emblem + Interactive Studio Console */}
        <div
          ref={workbenchRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start will-change-transform transition-transform duration-150"
          style={{ transform: `rotateY(${scrollVelocity * 0.08}deg) rotateX(${Math.abs(scrollVelocity) * 0.04}deg)` }}
        >
          {/* Left Column (4 Cols): 3D Kinetic Leaf Mark & Studio Spec Pedestal */}
          <GsapStaggerReveal stagger={0.14} yOffset={38} className="lg:col-span-4 flex flex-col gap-6 w-full">
            <div className="relative aspect-square rounded-lg border border-white/10 glass-tier-1 p-6 flex flex-col justify-between overflow-hidden group shadow-2xl">
              {/* Blast Shockwave Flash Effect */}
              {isBlasted && (
                <div className="pointer-events-none absolute inset-0 z-30 bg-white/20 animate-ping duration-1000 rounded-lg flex items-center justify-center">
                  <div className="rounded-md border border-white/30 bg-[#050709]/90 px-4 py-2 font-mono text-xs text-white font-bold shadow-2xl">
                    ⚡ SURGE DISPATCH COMPLETE
                  </div>
                </div>
              )}

              {/* Studio Emblem Header */}
              <div className="flex items-center justify-between font-mono text-[11px] text-[#94A3B8] z-20 font-semibold">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${isBlasted ? 'bg-white animate-ping' : 'bg-white'}`} />
                  <span className="text-[#EBECF0]">KINETIC BRAND EMBLEM</span>
                </div>
                <span className="text-zinc-400">THREE.JS 3D</span>
              </div>

              {/* Three.js 3D WebGL Canvas with Interactive Charge Aura */}
              <div
                data-cursor="lab"
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className={`relative w-full h-full flex items-center justify-center my-2 cursor-pointer transition-all duration-300 ${
                  isHolding ? 'scale-105' : ''
                }`}
              >
                {/* Dynamic Aura Glow based on charge */}
                <div
                  className="pointer-events-none absolute inset-4 rounded-full bg-white/20 blur-2xl transition-opacity duration-150"
                  style={{ opacity: Math.max(0.1, holdCharge / 100 * 0.8) }}
                />
                <ThreeLeafMark interactive={true} />
              </div>

              {/* Kinetic "HOLD TO BLAST" Interactive Trigger Dock */}
              <div className="z-20 pt-3 border-t border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] font-semibold">
                  <span>HOLD CHARGE: {holdCharge}%</span>
                  <span className={holdCharge > 0 ? 'text-white' : 'text-[#64748B]'}>
                    {holdCharge > 0 ? `${(220 + holdCharge * 6.6).toFixed(0)} Hz` : 'IDLE'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hold to Blast Button with live SVG radial track */}
                  <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className="relative flex-1 flex items-center justify-center gap-2.5 py-2.5 px-3 rounded border border-white/20 bg-white/10 hover:bg-white/15 text-[#EBECF0] font-mono text-xs font-bold uppercase tracking-wider transition-all select-none overflow-hidden"
                  >
                    {/* Background fill bar based on charge */}
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-75 pointer-events-none"
                      style={{ width: `${holdCharge}%` }}
                    />
                    <Sparkles className={`h-3.5 w-3.5 ${isHolding ? 'text-white animate-spin' : 'text-zinc-300'}`} />
                    <span className="relative z-10">
                      {isHolding ? `CHARGING ${holdCharge}%...` : isBlasted ? 'SURGE FIRED!' : 'HOLD TO BLAST'}
                    </span>
                  </button>

                  {/* 1-Click Blast Trigger */}
                  <button
                    onClick={triggerInstantBlast}
                    className="px-2.5 py-2.5 rounded border border-white/10 bg-white/5 hover:border-white/30 hover:text-white text-[#94A3B8] font-mono text-[10px] transition-all"
                    title="Instant Surge Blast"
                  >
                    <Zap className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Studio Engineering Spec Card (Reduced Radius) */}
            <div className="rounded-lg border border-white/10 glass-tier-1 p-6 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400 font-semibold">
                <span className="text-white">THE UNIQUE AMAZE STANDARD</span>
                <span className="text-zinc-400">VERIFIED 2026</span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#080B0E] border border-white/5">
                  <span className="text-zinc-400">CORE SPEED</span>
                  <span className="text-white font-bold">&lt; 0.9s First Contentful Paint</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#080B0E] border border-white/5">
                  <span className="text-zinc-400">ARCHITECTURE</span>
                  <span className="text-zinc-200">Zero-Bloat Next / Vite Stack</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#080B0E] border border-white/5">
                  <span className="text-zinc-400">AI INTEGRATION</span>
                  <span className="text-zinc-200 font-bold">24/7 Conversational Lead Intake</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#080B0E] border border-white/5">
                  <span className="text-zinc-400">DIRECT MODEL</span>
                  <span className="text-zinc-200">1-to-1 Senior Builder Direct</span>
                </div>
              </div>
            </div>
          </GsapStaggerReveal>

          {/* Right Column (8 Cols): The Interactive Studio Workbench */}
          <GsapStaggerReveal delay={0.12} yOffset={40} className="lg:col-span-8 w-full">
            <div className="rounded-lg border border-white/10 glass-tier-2 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
              {/* Studio Lens Switcher Controls Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-[#0B0E12] px-5 py-3.5 gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                    STUDIO WORKBENCH ·{' '}
                    {currentMarket === 'mw'
                      ? 'Nyika Eco-Sanctuary (Lilongwe)'
                      : 'Sage & Stone Sanctuary (Calgary)'}
                  </span>
                </div>

                {/* The 4 Interactive Studio Lenses */}
                <div className="flex items-center gap-1.5 bg-[#050607] border border-white/10 p-1 rounded-md">
                  <button
                    onClick={() => {
                      studioAudio.playClick(1000);
                      setActiveLens('craft');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs rounded transition-all ${
                      activeLens === 'craft'
                        ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>01 / CRAFT VIEW</span>
                  </button>

                  <button
                    onClick={() => {
                      studioAudio.playClick(1050);
                      setActiveLens('wireframe');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs rounded transition-all ${
                      activeLens === 'wireframe'
                        ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="h-3 w-3" />
                    <span>02 / BLUEPRINT</span>
                  </button>

                  <button
                    onClick={() => {
                      studioAudio.playClick(1100);
                      setActiveLens('neural');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs rounded transition-all ${
                      activeLens === 'neural'
                        ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Cpu className="h-3 w-3" />
                    <span>03 / AI INTAKE</span>
                  </button>

                  <button
                    onClick={() => {
                      studioAudio.playClick(1150);
                      setActiveLens('code');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs rounded transition-all ${
                      activeLens === 'code'
                        ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="h-3 w-3" />
                    <span>04 / CODE</span>
                  </button>
                </div>
              </div>

              {/* Viewport Content based on Active Lens */}
              <div className="relative min-h-[500px] bg-[#0A0D11] text-[#EBECF0] p-6 sm:p-10 transition-all duration-300">
                {/* LENS 01: CRAFT VIEW (The Live Client Experience) */}
                {activeLens === 'craft' && (
                  <div className="space-y-6">
                    {/* Client Mock Navigation Bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        {currentMarket === 'mw' ? (
                          <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                            NYIKA <span>RIDGE</span>
                            <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-normal mt-0.5">
                              ECO-SANCTUARY &amp; SAFARI LODGE · MALAWI
                            </span>
                          </div>
                        ) : (
                          <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                            SAGE <span>&amp;</span> STONE
                            <span className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-normal mt-0.5">
                              HOLISTIC MEDICINE &amp; WELLNESS · CHESTERMERE
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsClientTabActive('service')}
                          className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                            isClientTabActive === 'service'
                              ? 'border-white/30 text-white bg-white/10 font-semibold'
                              : 'border-transparent text-zinc-400 hover:text-white'
                          }`}
                        >
                          SERVICES
                        </button>
                        <button
                          onClick={() => setIsClientTabActive('rates')}
                          className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                            isClientTabActive === 'rates'
                              ? 'border-white/30 text-white bg-white/10 font-semibold'
                              : 'border-transparent text-zinc-400 hover:text-white'
                          }`}
                        >
                          RATES
                        </button>
                        <button
                          onClick={() => setIsClientTabActive('intake')}
                          className={`px-3 py-1 font-mono text-xs rounded border transition-all ${
                            isClientTabActive === 'intake'
                              ? 'border-white/30 text-white bg-white/10 font-semibold'
                              : 'border-transparent text-zinc-400 hover:text-white'
                          }`}
                        >
                          AI INTAKE
                        </button>
                      </div>
                    </div>

                    {/* Interactive Hero Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4">
                      <div className="md:col-span-7 space-y-4">
                        <div className="inline-flex items-center gap-2 rounded bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-300 border border-white/10 font-semibold">
                          <span>VERIFIED 5.0 RATING</span>
                          <span>·</span>
                          <span>24/7 AI BOOKINGS OPEN</span>
                        </div>

                        <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[#EBECF0] leading-tight uppercase">
                          {currentMarket === 'mw'
                            ? 'Unrivaled wilderness. Calibrated for restorative calm.'
                            : 'Modern clinical care in a boutique, unhurried sanctuary.'}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {currentMarket === 'mw'
                            ? 'Experience Malawi’s pristine highland plateau. Private solar chalets, guided wildlife tracks, and authentic lakeside cuisine.'
                            : 'Personalized naturopathy, botanical sauna rituals, and acupuncture appointments booked with zero wait times.'}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            onClick={handleBooking}
                            className="cta-image-btn rounded-md px-5 py-2.5 font-mono text-xs font-bold text-white transition-all flex items-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>RESERVE APPOINTMENT</span>
                            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white">
                              {interactiveCounter} Booked
                            </span>
                          </button>

                          <span className="font-mono text-xs text-zinc-300 font-semibold">
                            {currentMarket === 'mw' ? 'From MWK 140,000 / Night' : 'From $165 CAD / Session'}
                          </span>

                          {paymentSuccess && (
                            <span className="flex items-center gap-1 font-mono text-xs text-emerald-400 animate-fade-in font-bold">
                              <CalendarCheck className="h-3.5 w-3.5" />
                              <span>CONFIRMED &amp; DISPATCHED</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-5 relative">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 shadow-lg">
                          <img
                            src={
                              currentMarket === 'mw'
                                ? 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=700&q=80'
                                : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80'
                            }
                            alt="Studio Showcase"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] text-zinc-200 font-semibold">
                            {currentMarket === 'mw'
                              ? 'Plateau Chalet · High-Res 4G Optimized'
                              : 'Suite 04 · Private Botanical Steam'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Client Mock Highlights Strip */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="rounded-md bg-[#0E1216] border border-white/5 p-3.5">
                        <div className="font-mono text-[10px] text-zinc-400 font-semibold">PAYMENT RAILS</div>
                        <div className="font-display text-xs font-bold text-white uppercase mt-0.5">
                          {currentMarket === 'mw' ? 'Airtel Money & Mpamba' : 'Interac & Stripe'}
                        </div>
                      </div>
                      <div className="rounded-md bg-[#0E1216] border border-white/5 p-3.5">
                        <div className="font-mono text-[10px] text-zinc-400 font-semibold">MOBILE SPEED</div>
                        <div className="font-display text-xs font-bold text-white uppercase mt-0.5">
                          {currentMarket === 'mw' ? '0.7s TNM 4G Paint' : '0.8s Initial Paint'}
                        </div>
                      </div>
                      <div className="rounded-md bg-[#0E1216] border border-white/5 p-3.5">
                        <div className="font-mono text-[10px] text-zinc-400 font-semibold">INTELLIGENCE</div>
                        <div className="font-display text-xs font-bold text-white uppercase mt-0.5">24/7 AI Receptionist</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LENS 02: BLUEPRINT X-RAY (Architectural Wireframe Mode) */}
                {activeLens === 'wireframe' && (
                  <div className="relative space-y-6 font-mono text-xs">
                    {/* Wireframe Scanning Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-zinc-300" />
                        <span>System Blueprint</span>
                      </div>
                      <span className="text-zinc-400">Golden Ratio Baseline</span>
                    </div>

                    <div className="border border-white/20 border-dashed rounded-lg p-6 bg-[#041215]/80 space-y-6">
                      <div className="grid grid-cols-12 gap-4 text-[11px]">
                        <div className="col-span-8 border border-white/10 rounded-md p-4 bg-[#091C20]/60 space-y-3">
                          <div className="flex justify-between text-zinc-300 font-semibold">
                            <span>&lt;section id=&quot;hero-display&quot;&gt;</span>
                            <span>grid: 12-col / gap: 32px</span>
                          </div>
                          <div className="h-6 w-3/4 bg-white/10 border border-white/20 rounded flex items-center px-2 text-[10px] text-white">
                            H1 Display · Archivo 900 · Tracking -0.04em
                          </div>
                          <div className="h-4 w-1/2 bg-white/5 border border-white/10 rounded flex items-center px-2 text-[10px] text-zinc-300">
                            P Lead · Plus Jakarta Sans 400 · Leading 1.6
                          </div>
                          <div className="flex gap-3 pt-2">
                            <div className="h-8 w-32 bg-white/20 border border-white/40 rounded flex items-center justify-center text-[10px] text-white font-bold">
                              PRIMARY CTA
                            </div>
                            <div className="h-8 w-32 border border-white/20 rounded flex items-center justify-center text-[10px] text-zinc-400">
                              SECONDARY CTA
                            </div>
                          </div>
                        </div>

                        <div className="col-span-4 border border-white/10 rounded-md p-4 bg-[#08151A]/60 flex flex-col justify-between">
                          <div className="text-zinc-300 text-[10px] font-bold">
                            CALIPER GRID
                          </div>
                          <div className="my-auto border border-white/10 rounded-md p-3 text-center text-zinc-200 text-[10px]">
                            RESPONSIVE MEDIA NODE
                            <div className="text-[9px] text-zinc-400 mt-1">WebP 2x + AVIF Fallback</div>
                          </div>
                          <div className="text-[10px] text-zinc-400">LATENCY TARGET: 0ms</div>
                        </div>
                      </div>

                      {/* Diagnostic Specs */}
                      <div className="grid grid-cols-4 gap-3 pt-3 border-t border-white/10 text-[10px]">
                        <div>
                          <span className="text-zinc-500 block">VIEWPORT</span>
                          <span className="text-white font-bold">1440px FLUID</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">BASELINE</span>
                          <span className="text-white font-bold">8px MATHEMATICAL</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">CONTRAST RATIO</span>
                          <span className="text-white font-bold">14.8:1 (WCAG AAA)</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">DOM NODES</span>
                          <span className="text-white font-bold">&lt; 280 ULTRA-LEAN</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LENS 03: AI NEURAL ENGINE (Automated Intake Flow) */}
                {activeLens === 'neural' && (
                  <div className="space-y-6 font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-zinc-300" />
                        <span>24/7 CONVERSATIONAL CONVERSION PIPELINE</span>
                      </div>
                      <span className="text-zinc-400">REAL-TIME ACTIVE</span>
                    </div>

                    {/* Step-by-Step Flow Pipeline */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="rounded-md border border-white/10 bg-[#0E1216] p-4 space-y-2">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span>01 · INTAKE</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="font-bold text-white">Visitor Enquiry</div>
                        <p className="text-[11px] text-zinc-400">
                          Natural language intake form captures requirements and budget.
                        </p>
                      </div>

                      <div className="rounded-md border border-white/20 bg-[#0A1A1E] p-4 space-y-2">
                        <div className="flex items-center justify-between text-zinc-200">
                          <span>02 · QUALIFY</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                        <div className="font-bold text-white">AI Qualification</div>
                        <p className="text-[11px] text-zinc-400">
                          Calculates package match, timeline viability, and project scope.
                        </p>
                      </div>

                      <div className="rounded-md border border-white/10 bg-[#0F181D] p-4 space-y-2">
                        <div className="flex items-center justify-between text-zinc-300">
                          <span>03 · SCHEDULE</span>
                          <span className="h-2 w-2 rounded-full bg-zinc-400" />
                        </div>
                        <div className="font-bold text-white">Direct Calendar</div>
                        <p className="text-[11px] text-zinc-400">
                          Automatically books discovery calls in the client’s local timezone.
                        </p>
                      </div>

                      <div className="rounded-md border border-white/10 bg-[#0E1216] p-4 space-y-2">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span>04 · SYNC</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="font-bold text-white">CRM &amp; Payment</div>
                        <p className="text-[11px] text-zinc-400">
                          {currentMarket === 'mw'
                            ? 'Instant Airtel Money / Bank deposit notice & WhatsApp brief.'
                            : 'Stripe invoice generated and synced to project dashboard.'}
                        </p>
                      </div>
                    </div>

                    {/* Live Telemetry Output Log */}
                    <div className="rounded-md border border-white/10 bg-[#050608] p-4 font-mono text-[11px] text-zinc-300 space-y-1.5">
                      <div className="text-zinc-500">REAL-TIME CONVERSION AUDIT LOG</div>
                      <div className="text-zinc-200">
                        [08:14:02] Lead qualified: Commercial Dental Practice — Fit Score: 98%
                      </div>
                      <div className="text-zinc-300">
                        [08:14:05] Consultation slot reserved · Confirmation sent via SMS &amp; Email
                      </div>
                      <div className="text-zinc-400">
                        {currentMarket === 'mw'
                          ? '[08:14:08] Airtel Money webhook verified · MWK Deposit Recorded'
                          : '[08:14:08] Stripe deposit webhook verified · CAD $ Deposit Recorded'}
                      </div>
                    </div>
                  </div>
                )}

                {/* LENS 04: CODE MATRIX (Bespoke TSX Component Structure) */}
                {activeLens === 'code' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-300 font-semibold">
                      <div className="flex items-center gap-2">
                         <Terminal className="h-4 w-4 text-zinc-300" />
                        <span>ENGINEERING ARCHITECTURE</span>
                      </div>
                      <span className="text-zinc-400">BUNDLE: 14KB GZIPPED</span>
                    </div>

                    <pre className="rounded-md bg-[#050709] border border-white/10 p-5 overflow-x-auto text-[11px] leading-relaxed text-zinc-300 font-mono">
{`// Unique Amaze Client Component Architecture
import React, { useState } from 'react';
import { useMarketContext } from './market';

export const BookingEngine: React.FC = () => {
  const { region, currency, paymentRails } = useMarketContext();
  
  // Instant zero-data-bloat payment dispatch (Airtel/Mpamba/Stripe)
  const handleReserve = async (slotId: string) => {
    await paymentRails.dispatch({ slotId, currency });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <IntakePortal market={region} onReserve={handleReserve} />
    </section>
  );
};`}
                    </pre>
                  </div>
                )}
              </div>

              {/* Status Bar Footer */}
              <div className="flex flex-wrap items-center justify-between border-t border-white/10 bg-[#090C0F] px-5 py-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>
                    {currentMarket === 'mw'
                      ? 'CALIBRATED FOR MALAWI (MWK & AIRTEL MONEY/MPAMBA)'
                      : 'CALIBRATED FOR CANADA (CAD $ & STRIPE/INTERAC)'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400 font-semibold">
                  <span className="flex items-center gap-1 text-zinc-200">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span>CONVERSIONS +180%</span>
                  </span>
                  <span className="text-zinc-400">99+ LIGHTHOUSE TARGET</span>
                </div>
              </div>
            </div>
          </GsapStaggerReveal>
        </div>
      </div>
    </section>
  );
};
