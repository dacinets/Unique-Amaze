import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PricingPackage, MarketType, PageRoute } from '../../types';
import { studioAudio } from '../../utils/audio';
import {
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  Layers,
  Bot,
  ChevronRight,
  Table,
  SlidersHorizontal,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface ComparisonMeta {
  tierNumber: string;
  pagesScope: string;
  turnaround: string;
  speedSla: string;
  aiLevel: string;
  designFinish: string;
  supportSla: string;
}

const COMPARISON_SPECS: Record<string, ComparisonMeta> = {
  starter: {
    tierNumber: '01',
    pagesScope: '1–3 Pages (Focused Launch)',
    turnaround: '1–2 Weeks',
    speedSla: '95+ Score · Sub-1.2s Load',
    aiLevel: 'Smart Contact Form & Direct WhatsApp',
    designFinish: 'Clean, Modern Architecture',
    supportSla: '14-Day Warranty & Launch Guide'
  },
  business: {
    tierNumber: '02',
    pagesScope: '6–8 Pages (Complete Presence)',
    turnaround: '2–4 Weeks',
    speedSla: '98+ Score · Sub-1.0s Load',
    aiLevel: 'Booking Engine + Google SEO Sync',
    designFinish: 'Tailored Brand Identity & Smooth Transitions',
    supportSla: '30-Day Priority Support & Video Training'
  },
  intelligent: {
    tierNumber: '03',
    pagesScope: '8–15 Pages (Multi-Page Flagship)',
    turnaround: '4–6 Weeks',
    speedSla: '99+ Score · Sub-0.8s Load',
    aiLevel: '24/7 AI Client Concierge & CRM Sync',
    designFinish: 'Spatial Shaders & Micro-Interactions',
    supportSla: '60-Day Dedicated Support & CRO Audit'
  },
  custom: {
    tierNumber: '04',
    pagesScope: 'Custom Scope (Unlimited Architecture)',
    turnaround: 'Phased Discovery Sprints',
    speedSla: 'Enterprise SLA & Cloudflare Edge',
    aiLevel: 'Custom Multi-Agent AI Workflows & Portals',
    designFinish: 'Full WebGL 3D & Bespoke Experiences',
    supportSla: 'Dedicated SLA & Retainer Options'
  }
};

interface PricingAccordionComparisonProps {
  packages: PricingPackage[];
  currentMarket: MarketType;
  onNavigate: (route: PageRoute) => void;
}

export const PricingAccordionComparison: React.FC<PricingAccordionComparisonProps> = ({
  packages,
  currentMarket,
  onNavigate
}) => {
  const [activePackageId, setActivePackageId] = useState<string>('business');
  const [viewMode, setViewMode] = useState<'accordion' | 'matrix'>('accordion');

  const activePackage = packages.find((p) => p.id === activePackageId) || packages[1];
  const activeSpec = COMPARISON_SPECS[activePackage.id] || COMPARISON_SPECS['business'];

  const handleSelectPackage = (id: string) => {
    if (id !== activePackageId) {
      studioAudio.playClick(950);
      setActivePackageId(id);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Controls: Mode Switcher & Quick Context */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-xl bg-[#090D12] border border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold px-2.5 py-1 bg-white/5 rounded border border-white/10 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>PACKAGE COMPARISON</span>
          </span>
          <span className="hidden sm:inline font-mono text-xs text-[#94A3B8]">
            Interactive Comparison Suite:
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => {
              studioAudio.playClick(850);
              setViewMode('accordion');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all uppercase font-semibold ${
              viewMode === 'accordion'
                ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>HORIZONTAL ACCORDION</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(850);
              setViewMode('matrix');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all uppercase font-semibold ${
              viewMode === 'matrix'
                ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#EBECF0] hover:bg-white/5'
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            <span>FULL COMPARISON MATRIX</span>
          </button>
        </div>
      </div>

      {/* ACCORDION VIEW */}
      {viewMode === 'accordion' ? (
        <div className="space-y-4">
          {/* Desktop & Tablet: Horizontal Accordion */}
          <div className="hidden md:flex flex-row min-h-[600px] lg:min-h-[640px] rounded-2xl border border-white/10 bg-[#070A0D] overflow-hidden shadow-2xl">
            {packages.map((pkg) => {
              const isExpanded = pkg.id === activePackageId;
              const spec = COMPARISON_SPECS[pkg.id] || COMPARISON_SPECS['starter'];
              const priceDisplay = currentMarket === 'ca' ? pkg.priceCA : pkg.priceMW;

              return (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`relative flex transition-all duration-500 ease-out cursor-pointer select-none border-r last:border-r-0 border-white/10 ${
                    isExpanded
                      ? 'flex-[3.8] lg:flex-[4] bg-gradient-to-b from-[#0C1217] via-[#090E13] to-[#070A0D] pricing-accordion-expanded cursor-default'
                      : 'flex-1 hover:bg-white/[0.03] bg-[#070A0D] pricing-accordion-collapsed'
                  }`}
                >
                  {/* EXPANDED VIEW */}
                  {isExpanded ? (
                    <motion.div
                      key={`expanded-${pkg.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full p-6 lg:p-8 flex flex-col justify-between overflow-y-auto"
                    >
                      {/* Top Header */}
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-zinc-300 tracking-widest uppercase">
                              {spec.tierNumber} · {pkg.eyebrow}
                            </span>
                            {pkg.isFeatured && (
                              <span className="px-2.5 py-0.5 rounded bg-zinc-800 border border-white/20 font-mono text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                                ★ DOMINANT CHOICE
                              </span>
                            )}
                          </div>

                          <span className="font-mono text-xs text-[#94A3B8] uppercase">
                            MARKET: {currentMarket === 'ca' ? 'CANADA (CAD)' : 'MALAWI (MWK)'}
                          </span>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/10 pb-5">
                          <div>
                            <h3 className="font-display text-2xl lg:text-3xl font-semibold text-white uppercase tracking-wide">
                              {pkg.name}
                            </h3>
                            <p className="mt-1 font-sans text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-xl">
                              {pkg.bestFor}
                            </p>
                          </div>

                          <div className="text-left lg:text-right shrink-0">
                            <span className="block font-mono text-[10px] uppercase tracking-widest text-[#94A3B8]">
                              INVESTMENT LEVEL
                            </span>
                            <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">
                              {priceDisplay}
                            </div>
                          </div>
                        </div>

                        {/* Direct Comparison Spec Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                            <span className="text-[10px] uppercase text-[#94A3B8] flex items-center gap-1 mb-1">
                              <Layers className="h-3 w-3 text-zinc-400" />
                              <span>Pages &amp; Scope</span>
                            </span>
                            <span className="font-semibold text-white block text-[11px] sm:text-xs">
                              {spec.pagesScope}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                            <span className="text-[10px] uppercase text-[#94A3B8] flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3 text-zinc-400" />
                              <span>Turnaround</span>
                            </span>
                            <span className="font-semibold text-white block text-[11px] sm:text-xs">
                              {spec.turnaround}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                            <span className="text-[10px] uppercase text-[#94A3B8] flex items-center gap-1 mb-1">
                              <Zap className="h-3 w-3 text-zinc-400" />
                              <span>Speed SLA</span>
                            </span>
                            <span className="font-semibold text-white block text-[11px] sm:text-xs">
                              {spec.speedSla}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                            <span className="text-[10px] uppercase text-[#94A3B8] flex items-center gap-1 mb-1">
                              <Bot className="h-3 w-3 text-zinc-400" />
                              <span>Automation &amp; AI</span>
                            </span>
                            <span className="font-semibold text-white block text-[11px] sm:text-xs">
                              {spec.aiLevel}
                            </span>
                          </div>
                        </div>

                        {/* Included Features Checklist */}
                        <div>
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] block mb-3 font-semibold">
                            INCLUDED DELIVERABLES &amp; ARCHITECTURE:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                            {pkg.features.map((feature, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex items-start gap-2.5 p-2 rounded-md bg-white/[0.02] border border-white/5"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-[#CBD5E1] leading-relaxed">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="pt-6 border-t border-white/10 mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="font-mono text-xs text-[#94A3B8] flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-zinc-400" />
                          <span>{spec.supportSla}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            studioAudio.playClick(1000);
                            onNavigate('contact');
                          }}
                          className={`px-6 py-3.5 rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] ${
                            pkg.isFeatured
                              ? 'cta-image-btn text-white shadow-lg'
                              : 'bg-white/10 hover:bg-white/15 text-white border border-white/20 pricing-secondary-btn'
                          }`}
                        >
                          <span>
                            {pkg.isCustom ? 'REQUEST CUSTOM QUOTE' : `SELECT ${pkg.name.toUpperCase()}`}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* COLLAPSED VERTICAL ACCORDION COLUMN */
                    <div className="w-full h-full p-4 flex flex-col justify-between items-center text-center relative group">
                      {/* Top Numeral & Indicator */}
                      <div className="space-y-1">
                        <span className="font-mono text-xs font-bold text-[#94A3B8] group-hover:text-white transition-colors">
                          {spec.tierNumber}
                        </span>
                        {pkg.isFeatured && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mx-auto" />
                        )}
                      </div>

                      {/* Vertical Title & Price */}
                      <div className="my-auto flex flex-col items-center justify-center py-6">
                        <div
                          className="font-display text-sm lg:text-base font-bold text-[#EBECF0] uppercase tracking-widest whitespace-nowrap"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)'
                          }}
                        >
                          {pkg.name}
                        </div>

                        <div
                          className="mt-6 font-mono text-xs text-zinc-300 font-bold whitespace-nowrap"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)'
                          }}
                        >
                          {priceDisplay}
                        </div>
                      </div>

                      {/* Bottom Expand Prompt */}
                      <div className="pt-2">
                        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 group-hover:text-white text-[#94A3B8] transition-all">
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile (< md): Responsive Vertical Accordion */}
          <div className="md:hidden space-y-3">
            {packages.map((pkg) => {
              const isExpanded = pkg.id === activePackageId;
              const spec = COMPARISON_SPECS[pkg.id] || COMPARISON_SPECS['starter'];
              const priceDisplay = currentMarket === 'ca' ? pkg.priceCA : pkg.priceMW;

              return (
                <div
                  key={pkg.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'border-white/20 bg-[#0C1217] shadow-xl'
                      : 'border-white/10 bg-[#070A0D]'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-400 font-bold">
                          {spec.tierNumber} · {pkg.eyebrow}
                        </span>
                        {pkg.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded bg-white/15 text-[9px] font-mono font-bold text-white">
                            ★ POPULAR
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-lg font-bold text-white uppercase">
                        {pkg.name}
                      </h4>
                      <span className="font-mono text-xs text-white font-bold block">
                        {priceDisplay}
                      </span>
                    </div>

                    <div
                      className={`p-2 rounded-full transition-transform ${
                        isExpanded
                          ? 'bg-white/10 text-white rotate-90'
                          : 'bg-white/5 text-[#94A3B8]'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-white/10 space-y-4 bg-black/40">
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{pkg.bestFor}</p>

                      {/* Specs pills */}
                      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-[#94A3B8] block text-[9px] uppercase">Scope</span>
                          <span className="text-white font-semibold">{spec.pagesScope}</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/5">
                          <span className="text-[#94A3B8] block text-[9px] uppercase">Timeline</span>
                          <span className="text-white font-semibold">{spec.turnaround}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase text-[#94A3B8] font-bold block">
                          Included Features:
                        </span>
                        {pkg.features.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                            <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          studioAudio.playClick(1000);
                          onNavigate('contact');
                        }}
                        className="w-full py-3 rounded-lg font-mono text-xs font-bold text-white uppercase cta-image-btn shadow-md tracking-wider mt-2"
                      >
                        {pkg.isCustom ? 'REQUEST CUSTOM QUOTE' : `SELECT ${pkg.name.toUpperCase()}`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* FULL COMPARISON MATRIX VIEW */
        <div className="rounded-2xl border border-white/10 bg-[#070A0D] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#0C1217]">
                  <th className="p-4 sm:p-5 font-mono text-xs text-[#94A3B8] uppercase tracking-wider w-1/4">
                    Comparison Metric
                  </th>
                  {packages.map((pkg) => (
                    <th
                      key={pkg.id}
                      className={`p-4 sm:p-5 font-mono text-xs uppercase tracking-wider ${
                        pkg.isFeatured ? 'bg-white/5 text-white' : 'text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold">{pkg.name}</span>
                        {pkg.isFeatured && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white">
                            ★
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm text-white">
                        {currentMarket === 'ca' ? pkg.priceCA : pkg.priceMW}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 font-mono text-xs">
                <tr>
                  <td className="p-4 text-[#94A3B8] uppercase">Ideal For</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 font-sans text-xs text-[#CBD5E1] leading-relaxed">
                      {pkg.bestFor}
                    </td>
                  ))}
                </tr>

                <tr className="bg-white/[0.01]">
                  <td className="p-4 text-[#94A3B8] uppercase">Page Scope</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-white font-semibold">
                      {COMPARISON_SPECS[pkg.id]?.pagesScope}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 text-[#94A3B8] uppercase">Turnaround SLA</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-white font-semibold">
                      {COMPARISON_SPECS[pkg.id]?.turnaround}
                    </td>
                  ))}
                </tr>

                <tr className="bg-white/[0.01]">
                  <td className="p-4 text-[#94A3B8] uppercase">Speed SLA &amp; Score</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-zinc-200 font-semibold">
                      {COMPARISON_SPECS[pkg.id]?.speedSla}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 text-[#94A3B8] uppercase">AI &amp; Automation</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-white">
                      {COMPARISON_SPECS[pkg.id]?.aiLevel}
                    </td>
                  ))}
                </tr>

                <tr className="bg-white/[0.01]">
                  <td className="p-4 text-[#94A3B8] uppercase">Design Finish</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-[#CBD5E1]">
                      {COMPARISON_SPECS[pkg.id]?.designFinish}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 text-[#94A3B8] uppercase">Post-Launch Support</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4 text-[#CBD5E1]">
                      {COMPARISON_SPECS[pkg.id]?.supportSla}
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#0C1217]">
                  <td className="p-4 text-[#94A3B8] uppercase">Action</td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="p-4">
                      <button
                        onClick={() => {
                          studioAudio.playClick(1000);
                          onNavigate('contact');
                        }}
                        className={`w-full py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                          pkg.isFeatured
                            ? 'cta-image-btn text-white shadow-md'
                            : 'bg-white/10 text-white hover:bg-white/20 pricing-secondary-btn'
                        }`}
                      >
                        {pkg.isCustom ? 'QUOTE' : 'SELECT'}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
