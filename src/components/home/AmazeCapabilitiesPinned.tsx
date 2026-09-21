import React, { useRef, useState, useEffect } from 'react';
import { studioAudio } from '../../utils/audio';
import { MarketType, PageRoute } from '../../types';
import {
  Globe,
  Sparkles,
  Boxes,
  Cpu,
  Workflow,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Activity,
  CreditCard,
  Compass,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AmazeCapabilitiesPinnedProps {
  currentMarket: MarketType;
  onNavigate: (route: PageRoute) => void;
}

interface ServiceScene {
  id: string;
  step: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  visualType: 'websites' | 'ai' | '3d' | 'branding' | 'products';
  badge: string;
  glass: string;
}

export const AmazeCapabilitiesPinned: React.FC<AmazeCapabilitiesPinnedProps> = ({
  currentMarket,
  onNavigate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const lastIndexRef = useRef(0);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const services: ServiceScene[] = [
    {
      id: 'service-websites',
      step: '01',
      category: 'WEBSITE DESIGN & CONVERSION',
      title: 'HIGH-CONVERTING WEBSITES',
      subtitle: 'Zero-Bloat Digital Flagships Built to Command Market Authority',
      description:
        currentMarket === 'mw'
          ? 'Sub-1.2s loading speeds engineered for TNM and Airtel 4G networks. We eliminate bloated themes and slow page builders, turning your site into an autonomous booking and revenue generator across Malawi.'
          : 'Bespoke, conversion-engineered digital flagships for Canadian service firms and practices. Built phone-first with instant First Contentful Paint, seamless Google ranking, and 2-tap client intake.',
      metrics: [
        { label: 'LOAD SPEED', value: '< 0.8s' },
        { label: 'LIGHTHOUSE', value: '99/100' },
        { label: 'CONVERSION LIFT', value: '+140%' },
      ],
      visualType: 'websites',
      badge: 'ARCHITECTURAL WEB ENGINE',
      glass: 'glass-dominant',
    },
    {
      id: 'service-ai',
      step: '02',
      category: 'AI EXPERIENCES & AUTOMATION',
      title: 'INTELLIGENT AI AGENTS',
      subtitle: '24/7 Conversational Intake & Autonomous Client Qualification',
      description:
        'Never lose a high-value client to delayed follow-ups. Our custom AI assistants qualify inquiries in real-time, explain service tiers, quote project pricing, and reserve consultation slots without human delay.',
      metrics: [
        { label: 'RESPONSE LATENCY', value: '< 1.8s' },
        { label: 'LEAD CAPTURE', value: '24/7 Live' },
        { label: 'MANUAL ENTRY', value: '0 hrs' },
      ],
      visualType: 'ai',
      badge: 'GEMINI 2.5 NEURAL DISPATCH',
      glass: 'glass-violet',
    },
    {
      id: 'service-3d',
      step: '03',
      category: '3D & IMMERSIVE EXPERIENCES',
      title: 'SPATIAL 3D & SHADERS',
      subtitle: 'Hardware-Accelerated Fluidity with Zero Data Penalties',
      description:
        'We harness WebGL, GLSL shaders, and Three.js physics to craft tactile spatial interactions. Your digital flagship commands instant fascination while maintaining lightweight mobile performance.',
      metrics: [
        { label: 'FRAME RATE', value: '60–120 FPS' },
        { label: 'TEXTURE BLOAT', value: '0.00%' },
        { label: 'ACCELERATION', value: 'GPU Native' },
      ],
      visualType: '3d',
      badge: 'THREE.JS + HARDWARE ACCEL',
      glass: 'glass-slate',
    },
    {
      id: 'service-branding',
      step: '04',
      category: 'BRANDING & VISUAL IDENTITY',
      title: 'AUTHORITATIVE IDENTITY',
      subtitle: 'Mathematical Typography, Golden Ratios & Design Systems',
      description:
        'We reject generic SaaS templates and cliché gradients. Every typographic pairing, caliper margin, and dark architectural tone is calibrated to position your business as the undisputed leader in its category.',
      metrics: [
        { label: 'RATIO BASELINE', value: '1.618 φ' },
        { label: 'WCAG ACCESSIBILITY', value: 'AAA 14.8:1' },
        { label: 'DESIGN SYSTEM', value: '100% Bespoke' },
      ],
      visualType: 'branding',
      badge: 'BESPOKE DESIGN MATHEMATICS',
      glass: 'glass-smoke',
    },
    {
      id: 'service-products',
      step: '05',
      category: 'DIGITAL PRODUCTS & COMMERCE',
      title: 'REGIONAL COMMERCE RAILS',
      subtitle: currentMarket === 'mw' ? 'Airtel Money, TNM Mpamba & National Bank' : 'Stripe, Apple Pay & Interac e-Transfer',
      description:
        currentMarket === 'mw'
          ? 'Frictionless local commerce calibrated for Malawi. Accept deposits via Airtel Money, TNM Mpamba, and local bank transfers with instant automated SMS/WhatsApp receipt confirmation.'
          : 'Frictionless Canadian checkout experiences. Support one-click Apple Pay, Google Pay, automated Stripe deposits, and direct Interac billing configured for Calgary and nationwide.',
      metrics: [
        { label: currentMarket === 'mw' ? 'MWK RAILS' : 'CAD $ RAILS', value: 'Instant' },
        { label: 'CHECKOUT LATENCY', value: '< 15s' },
        { label: 'UPTIME SLA', value: '99.98%' },
      ],
      visualType: 'products',
      badge: currentMarket === 'mw' ? 'AIRTEL & MPAMBA INTEGRATED' : 'STRIPE + INTERAC NATIVE',
      glass: 'glass-teal',
    },
  ];

  // GSAP ScrollTrigger timeline to scrub through the 5 services (Desktop only)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          const index = Math.min(
            services.length - 1,
            Math.floor(progress * services.length)
          );
          if (index !== lastIndexRef.current) {
            lastIndexRef.current = index;
            setActiveIndex(index);
            studioAudio.playScrollTick(950 + index * 60);
          }
        },
      });
    }, el);

    return () => ctx.revert();
  }, [services.length, isMobile]);

  // Gentle GSAP staggered slide-up and fade transition for active scene elements
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (narrativeRef.current) {
      const targets = narrativeRef.current.children;
      gsap.fromTo(
        targets,
        { opacity: 0, y: 22, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.48, stagger: 0.08, ease: 'power2.out' }
      );
    }

    if (visualCardRef.current) {
      gsap.fromTo(
        visualCardRef.current,
        { opacity: 0.65, scale: 0.96, y: 16 },
        { opacity: 1, scale: 1, y: 0, duration: 0.52, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  const activeService = services[activeIndex] || services[0];
  const titleWords = (activeService?.title || '').split(' ');
  const titleFirst = titleWords[0] || '';
  const titleRest = titleWords.slice(1).join(' ');

  return (
    <section
      id="section-capabilities"
      ref={containerRef}
      className="relative w-full bg-[#050709] border-t border-white/[0.08]"
    >
      {/* Pinned Viewport Container */}
      <div
        className={`${
          isMobile
            ? 'relative w-full flex flex-col justify-start px-4 sm:px-6 py-12 sm:py-16'
            : 'h-screen w-full flex flex-col justify-between overflow-hidden px-4 sm:px-6 lg:px-8 py-6 sm:py-8'
        }`}
      >
        {/* Ambient Subtle Radial Mesh */}
        <div className="pointer-events-none absolute inset-0 radial-mesh-teal opacity-30 z-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00828006_1px,transparent_1px),linear-gradient(to_bottom,#00828006_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* TOP SECTION STATUS BAR */}
        <div className="mx-auto max-w-[1240px] w-full relative z-10 flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#008280] animate-ping" />
            <span className="text-[#008280] font-bold tracking-widest uppercase">
              STUDIO CAPABILITIES // INTERACTIVE JOURNEY
            </span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-[#94A3B8] hidden sm:inline">
              SCROLL DRIVEN SCENIC REVEAL
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#64748B]">SCENE:</span>
            <span className="text-[#16D2C8] font-bold">
              {activeService.step} / 05
            </span>
            <div className="h-1.5 w-28 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#008280] to-[#16D2C8] transition-all duration-150"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[#94A3B8] font-semibold">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* MAIN SPLIT VIEWPORT */}
        <div className="mx-auto max-w-[1240px] w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto">
          {/* LEFT: Pinned Narrative Statement & Active Service Details */}
          <div ref={narrativeRef} className="lg:col-span-6 space-y-7 will-change-transform">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#008280]/40 bg-[#008280]/10 px-3.5 py-1.5 font-mono text-xs text-[#008280] font-semibold tracking-wider uppercase">
                <Sparkles className="h-3 w-3" />
                <span>{activeService.category}</span>
              </div>

              <h2 className="font-display text-[clamp(1.75rem,3.4vw,3.2rem)] font-black uppercase text-[#EBECF0] tracking-[-0.03em] leading-[1.08]">
                {titleFirst}{' '}
                <span className="title-gradient-teal">
                  {titleRest}
                </span>
              </h2>

              <p className="font-mono text-xs text-[#16D2C8] tracking-wide uppercase pt-1 font-semibold">
                {activeService.subtitle}
              </p>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-[60ch]">
              {activeService.description}
            </p>

            {/* Metrics Panel */}
            <div className="grid grid-cols-3 gap-3.5 pt-3">
              {activeService.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 glass-smoke p-4 sm:p-5 transition-colors hover:border-[#16D2C8]/40"
                >
                  <div className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">
                    {metric.label}
                  </div>
                  <div className="font-display text-lg sm:text-xl font-bold text-[#EBECF0] mt-1 tracking-tight">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => {
                  studioAudio.playClick(1100);
                  onNavigate('services');
                }}
                className="cta-image-btn flex items-center gap-2 rounded-lg px-6 py-3.5 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>EXPLORE {titleFirst} SERVICES</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2 font-mono text-[11px] text-[#94A3B8]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#16D2C8]" />
                <span>{activeService.badge}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Dynamic Abstract 3D / Environment Visualization Scene with Scene-Specific Tinted Glass */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div
              ref={visualCardRef}
              className={`relative w-full max-w-[580px] aspect-square rounded-2xl border ${activeService.glass} overflow-hidden p-6 sm:p-7 shadow-2xl flex flex-col justify-between will-change-transform`}
            >
              {/* Corner Telemetry Readout */}
              <div className="flex items-center justify-between font-mono text-[10px] text-[#94A3B8] pb-3 border-b border-white/[0.08] relative z-20">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-[#16D2C8]" />
                  <span className="font-semibold tracking-wider">ENVIRONMENT TELEMETRY</span>
                </div>
                <div className="text-[#16D2C8] font-bold tracking-wider">STATE // 0{activeIndex + 1} ACTIVE</div>
              </div>

              {/* DYNAMIC VISUAL STATE RENDERING */}
              <div className="relative flex-1 w-full flex items-center justify-center my-auto">
                {/* 1. Website Design Visual: Interface Wireframe Fragments */}
                {activeService.visualType === 'websites' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-[340px] rounded-xl border border-[#008280]/60 bg-[#0B0F14] p-4 shadow-[0_0_40px_rgba(0,130,128,0.25)] space-y-3 transform -rotate-3 transition-transform duration-500">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-500/80" />
                          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
                          <span className="h-2 w-2 rounded-full bg-green-500/80" />
                        </div>
                        <span className="font-mono text-[9px] text-[#008280]">https://uniqueamaze.com</span>
                      </div>
                      <div className="h-16 w-full rounded-md bg-gradient-to-r from-[#008280]/20 to-[#16D2C8]/10 border border-white/5 flex items-center justify-center font-mono text-xs text-[#EBECF0] font-bold">
                        HERO APEX // CONVERT 2X
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 rounded bg-white/5 border border-white/5 p-2 font-mono text-[9px] text-[#94A3B8]">
                          2-TAP BOOKING
                        </div>
                        <div className="h-12 rounded bg-[#008280]/20 border border-[#008280]/40 p-2 font-mono text-[9px] text-[#16D2C8] font-bold">
                          100% LIGHTHOUSE
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AI Experiences Visual: Neural Network Data Streams */}
                {activeService.visualType === 'ai' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <svg className="w-64 h-64" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="80" stroke="#008280" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" className="animate-spin-slow" />
                      <circle cx="100" cy="100" r="50" stroke="#16D2C8" strokeWidth="1.5" fill="none" opacity="0.6" />
                      <circle cx="100" cy="100" r="12" fill="#008280" className="animate-pulse" />
                      <line x1="100" y1="100" x2="30" y2="50" stroke="#16D2C8" strokeWidth="1.5" />
                      <line x1="100" y1="100" x2="170" y2="60" stroke="#16D2C8" strokeWidth="1.5" />
                      <line x1="100" y1="100" x2="150" y2="160" stroke="#16D2C8" strokeWidth="1.5" />
                      <line x1="100" y1="100" x2="40" y2="150" stroke="#16D2C8" strokeWidth="1.5" />
                      <circle cx="30" cy="50" r="6" fill="#16D2C8" />
                      <circle cx="170" cy="60" r="6" fill="#16D2C8" />
                      <circle cx="150" cy="160" r="6" fill="#16D2C8" />
                      <circle cx="40" cy="150" r="6" fill="#16D2C8" />
                    </svg>
                    <div className="font-mono text-[10px] text-[#16D2C8] tracking-widest uppercase mt-2">
                      AUTONOMOUS SAGE INTAKE ENGINE
                    </div>
                  </div>
                )}

                {/* 3. 3D Experiences Visual: Dimensional Geometric Wireframe */}
                {activeService.visualType === '3d' && (
                  <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
                    <div
                      className="relative w-44 h-44 border-2 border-[#16D2C8] rounded-xl flex items-center justify-center shadow-[0_0_50px_rgba(22,210,200,0.35)]"
                      style={{
                        transform: `rotateX(45deg) rotateZ(${scrollProgress * 360}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.1s linear',
                      }}
                    >
                      <div className="w-28 h-28 border border-[#008280] rounded-lg rotate-45" />
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#EBECF0] font-bold">
                        THREE.JS GLSL
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Branding Visual: Typographic Fragments & Golden Ratio Caliper */}
                {activeService.visualType === 'branding' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
                    <div className="font-display text-5xl font-black tracking-[-0.04em] text-[#EBECF0] border-b-2 border-[#008280] pb-2">
                      Aa <span className="text-[#008280]">φ 1.618</span>
                    </div>
                    <div className="font-mono text-[11px] text-[#94A3B8] text-center max-w-[280px]">
                      OPTICAL BASELINE 8PX GRID &bull; WCAG 2.1 AAA CONTRAST &bull; ZERO TEMPLATES
                    </div>
                  </div>
                )}

                {/* 5. Products Visual: Regional Commerce Card & Live Rails */}
                {activeService.visualType === 'products' && (
                  <div className="relative w-full h-full flex flex-col items-center justify-center space-y-3">
                    <div className="w-[300px] rounded-xl border border-white/10 bg-[#0B0F14] p-4 shadow-xl space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B]">
                        <span>SETTLEMENT ENGINE</span>
                        <span className="text-green-400 font-bold">ACTIVE</span>
                      </div>
                      <div className="font-display text-2xl font-bold text-[#EBECF0]">
                        {currentMarket === 'mw' ? 'MWK 450,000' : 'CAD $1,850.00'}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[#16D2C8]">
                        <CreditCard className="h-3 w-3" />
                        <span>
                          {currentMarket === 'mw'
                            ? 'AIRTEL MONEY & TNM MPAMBA'
                            : 'STRIPE & INTERAC E-TRANSFER'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Step Indicator Pips */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] relative z-20">
                <div className="flex items-center gap-1.5">
                  {services.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        studioAudio.playClick(900 + i * 40);
                        setActiveIndex(i);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeIndex === i
                          ? 'w-6 bg-[#008280]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-[#64748B]">
                  UNIQUE AMAZE CHOREOGRAPHY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA RAIL */}
        <div className="mx-auto max-w-[1240px] w-full relative z-10 flex items-center justify-between pt-3 border-t border-white/[0.08] font-mono text-[11px] text-[#64748B]">
          <div className="flex items-center gap-2 text-[#16D2C8]">
            <Compass className="h-3.5 w-3.5" />
            <span>CONTINUOUS CINEMATIC SCROLLING &bull; STAGE 0{activeIndex + 1} OF 05</span>
          </div>
          <button
            onClick={() => onNavigate('planner')}
            className="flex items-center gap-1.5 text-[#EBECF0] hover:text-[#008280] transition-colors uppercase font-bold"
          >
            <span>LAUNCH AI ESTIMATOR</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
