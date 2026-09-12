import React from 'react';
import { ArrowDown, ArrowUpRight, Compass, Sparkles, Terminal } from 'lucide-react';
import { studioAudio } from '../utils/audio';

interface HeroSectionProps {
  onExploreWorks: () => void;
  onOpenLab: () => void;
  onOpenCommission: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWorks,
  onOpenLab,
  onOpenCommission,
}) => {
  return (
    <section
      id="hero-manifesto-section"
      className="relative min-h-[90vh] w-full overflow-hidden border-b border-[#1E2629] bg-[#050607] pt-12 pb-24 lg:pt-20 lg:pb-32"
    >
      {/* Volumetric Radial Light Cones / Back-Mesh from Design System */}
      <div className="pointer-events-none absolute inset-0 radial-mesh-cyan opacity-80" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[#5EEAD4]/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-[#00F2FE]/5 blur-[100px]" />

      {/* Grid Hairline Ambient Lines */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1E2629_1px,transparent_1px),linear-gradient(to_bottom,#1E2629_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

      <div className="relative mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        {/* Telemetry Stamp Component (Design System Specification) */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div
            id="hero-telemetry-stamp"
            className="inline-flex items-center gap-2.5 rounded-[4px] border border-[#2A363A] bg-[#0D1214]/80 px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-[#94A3B8] uppercase backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5EEAD4] opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5EEAD4]" />
            </span>
            <span className="text-[#F3F7F8]">DISPATCH 2026</span>
            <span className="text-[#3A494B]">//</span>
            <span className="text-[#00F2FE]">OBSIDIAN LUMINA REPOSITORY</span>
          </div>

          <div className="hidden items-center gap-2 rounded-[4px] border border-[#1E2629] bg-[#0A0D0E]/60 px-3 py-1 font-mono text-[11px] text-[#64748B] sm:flex">
            <Terminal className="h-3 w-3 text-[#5EEAD4]" />
            <span>RENDER PROTOCOL: GPU ACCELERATED</span>
          </div>
        </div>

        {/* Hero Headline & Architectural Statement */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main Title Proclamation (Syne 800) */}
          <div className="lg:col-span-8">
            <h1 className="font-display text-[44px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#F3F7F8] sm:text-[68px] lg:text-[88px] lg:leading-[94px] lg:tracking-[-0.04em]">
              ARCHITECTURAL <br />
              <span className="text-transparent [-webkit-text-stroke:1px_#849495] hover:text-[#F3F7F8] transition-colors">
                AUSTERITY
              </span>{' '}
              <span className="font-mono text-3xl font-light text-[#00F2FE] lg:text-5xl">//</span>
              <br />
              <span className="text-[#00F2FE] drop-shadow-[0_0_35px_rgba(0,242,254,0.35)]">
                HYPER-LUMINESCENT
              </span>{' '}
              DIGITAL ENERGY.
            </h1>

            {/* Narrative Editorial Subtitle */}
            <p className="mt-8 max-w-2xl font-sans text-lg font-normal leading-relaxed text-[#94A3B8] sm:text-xl">
              We operate at the volatile intersection of structural minimalism and high-voltage code.
              Designing bespoke spatial computing systems, kinetic flagships, and autonomous creative consoles
              for visionary founders and luxury institutions worldwide.
            </p>

            {/* Action Buttons Cluster */}
            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Primary Action Button */}
              <button
                id="hero-explore-works-btn"
                onClick={() => {
                  studioAudio.playClick(900);
                  onExploreWorks();
                }}
                className="group relative flex items-center gap-2.5 rounded-[4px] bg-[#00F2FE] px-7 py-3.5 font-mono text-[13px] font-bold tracking-[0.1em] text-[#050607] uppercase transition-all duration-300 hover:bg-[#5EEAD4] hover:shadow-[0_0_28px_rgba(0,242,254,0.5)]"
              >
                <span>EXPLORE ARCHIVE</span>
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </button>

              {/* Secondary Ghost Button */}
              <button
                id="hero-launch-lab-btn"
                onClick={() => {
                  studioAudio.playClick(750);
                  onOpenLab();
                }}
                className="group flex items-center gap-2 rounded-[4px] border border-white/15 bg-white/[0.03] px-6 py-3.5 font-mono text-[13px] font-semibold tracking-[0.08em] text-[#F3F7F8] uppercase backdrop-blur-sm transition-all duration-200 hover:border-[#00F2FE] hover:bg-[#00F2FE]/10 hover:text-[#00F2FE]"
              >
                <Sparkles className="h-4 w-4 text-[#5EEAD4]" />
                <span>INTERACTIVE LAB</span>
              </button>

              {/* Magnetic Link Button */}
              <button
                id="hero-initiate-commission-link"
                onClick={() => {
                  studioAudio.playClick(1050);
                  onOpenCommission();
                }}
                className="group flex items-center gap-2 font-mono text-[13px] font-medium tracking-[0.08em] text-[#94A3B8] transition-colors hover:text-[#00F2FE]"
              >
                <span className="border-b border-[#2A363A] pb-0.5 group-hover:border-[#00F2FE]">
                  COMMISSION BRIEF
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#00F2FE]/40 transition-all duration-300 group-hover:border-[#00F2FE] group-hover:bg-[#00F2FE]/10 group-hover:scale-110">
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#00F2FE]" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Telemetry Card & Studio Metrics */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-4">
            {/* Glassmorphic Studio Pane (Tier 1 Glass) */}
            <div
              id="hero-studio-console"
              className="glass-tier-1 rounded-[8px] p-6 lg:p-7"
            >
              <div className="flex items-center justify-between border-b border-[#2A363A]/80 pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#00F2FE]" />
                  <span className="font-mono text-xs font-semibold tracking-[0.1em] text-[#F3F7F8] uppercase">
                    STUDIO MANIFESTO
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#64748B]">INDEX 01</span>
              </div>

              <p className="mt-4 font-mono text-xs leading-relaxed text-[#94A3B8]">
                &ldquo;True digital luxury is not ornamental embellishment; it is computational precision,
                frictionless latency, and uncompromising spatial balance.&rdquo;
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#2A363A]/80 pt-5">
                <div>
                  <div className="font-mono text-[10px] uppercase text-[#64748B] tracking-wider">RECOGNITION</div>
                  <div className="font-display text-2xl font-bold text-[#F3F7F8] mt-0.5">42+</div>
                  <div className="font-mono text-[9px] text-[#5EEAD4]">Awwwards & D&AD</div>
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase text-[#64748B] tracking-wider">FIDELITY</div>
                  <div className="font-display text-2xl font-bold text-[#00F2FE] mt-0.5">120 Hz</div>
                  <div className="font-mono text-[9px] text-[#94A3B8]">Spatial Refresh</div>
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase text-[#64748B] tracking-wider">TRANSACTED</div>
                  <div className="font-display text-2xl font-bold text-[#F3F7F8] mt-0.5">$8.4B+</div>
                  <div className="font-mono text-[9px] text-[#5EEAD4]">Asset Throughput</div>
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase text-[#64748B] tracking-wider">LAB DISPATCH</div>
                  <div className="font-display text-2xl font-bold text-[#00F2FE] mt-0.5">ONLINE</div>
                  <div className="font-mono text-[9px] text-[#94A3B8]">Zurich / Tokyo</div>
                </div>
              </div>
            </div>

            {/* Micro Badge / Live Experiment Teaser */}
            <div
              onClick={onOpenLab}
              className="group cursor-pointer rounded-[6px] border border-[#1E2629] bg-[#0D1214] p-4 transition-all hover:border-[#5EEAD4]/60 hover:bg-[#13191B]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5EEAD4] opacity-80" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5EEAD4]" />
                  </span>
                  <span className="font-mono text-xs font-bold text-[#5EEAD4] tracking-wider uppercase">
                    ACTIVE LAB: SHADER TENSION
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#64748B] transition-transform group-hover:text-[#5EEAD4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-2 font-mono text-[11px] text-[#94A3B8]">
                Interactive GPU particle mesh responding to real-time cursor velocity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
