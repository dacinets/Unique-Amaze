import React, { useState, useMemo } from 'react';
import { PageRoute, MarketType } from '../../types';
import { PRICING_PACKAGES } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { BrandDivider } from '../common/BrandDivider';
import { Check, Sparkles, ArrowRight, Calculator, Sliders, DollarSign, Calendar, Zap } from 'lucide-react';

interface PricingViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
  onMarketChange: (market: MarketType) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  onNavigate,
  currentMarket,
  onMarketChange,
}) => {
  // Calculator States
  const [pages, setPages] = useState<number>(6);
  const [complexityIdx, setComplexityIdx] = useState<number>(1); // 0: Clean, 1: Refined, 2: Premium, 3: Cinematic
  const [motionIdx, setMotionIdx] = useState<number>(1); // 0: None, 1: Light, 2: Medium, 3: Rich
  const [selectedChips, setSelectedChips] = useState<string[]>(['smart-forms']);

  const complexityNames = ['Clean & Minimal', 'Refined & Modern', 'Premium Cyber-Editorial', 'Cinematic 3D'];
  const motionNames = ['None (Static)', 'Light Smooth Transitions', 'Medium Micro-Interactions', 'Rich GPU 3D Shaders'];

  const chipsData = [
    { id: 'smart-forms', label: 'Smart Forms / AI Intake', ca: 450, mw: 280000 },
    { id: 'crm-sync', label: 'CRM & Email Sync', ca: 350, mw: 230000 },
    { id: 'online-booking', label: 'Online Booking System', ca: 500, mw: 320000 },
    { id: 'ecommerce', label: 'E-commerce & Checkout', ca: 950, mw: 620000 },
    { id: 'member-portal', label: 'Members / Private Portal', ca: 1300, mw: 880000 },
    { id: 'content-support', label: 'Copywriting & Content Direction', ca: 320, mw: 200000 },
    { id: 'priority-rush', label: 'Priority Rush Launch (+15%)', ca: 0, mw: 0, mult: 1.15 },
  ];

  const toggleChip = (id: string) => {
    studioAudio.playClick(850);
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculation logic based on separate price books
  const estimateResult = useMemo(() => {
    const isCA = currentMarket === 'ca';

    // Page base calculation
    const baseUnit = isCA ? 1050 + pages * 150 : 405000 + pages * 95000;
    const cxMultipliers = isCA ? [1.0, 1.18, 1.42, 1.7] : [1.0, 1.28, 1.6, 1.95];
    const baseCost = Math.round(baseUnit * cxMultipliers[complexityIdx]);

    // Motion cost
    const motionTiers = isCA ? [0, 350, 800, 1500] : [0, 220000, 520000, 1000000];
    const motionCost = motionTiers[motionIdx];

    // Feature chips
    let featuresCost = 0;
    let multiplier = 1.0;

    chipsData.forEach((c) => {
      if (selectedChips.includes(c.id)) {
        featuresCost += isCA ? c.ca : c.mw;
        if (c.mult) multiplier *= c.mult;
      }
    });

    const totalBeforeMult = baseCost + motionCost + featuresCost;
    const finalTotal = Math.round(totalBeforeMult * multiplier);
    const cap = isCA ? 6000 : 5000000;

    const isCustom = finalTotal > cap || selectedChips.includes('member-portal');

    // Package recommendation
    let recommendedPkg = isCA ? 'Business Website' : 'Business Website';
    let timeline = '2–4 weeks';

    if (isCA) {
      if (finalTotal <= 2000) {
        recommendedPkg = 'Starter Website';
        timeline = '1–2 weeks';
      } else if (finalTotal <= 4500) {
        recommendedPkg = 'Business Website';
        timeline = '2–4 weeks';
      } else if (!isCustom) {
        recommendedPkg = 'Intelligent Experience';
        timeline = '4–6 weeks';
      } else {
        recommendedPkg = 'Custom / Complex';
        timeline = 'Timeline after discovery';
      }
    } else {
      if (finalTotal <= 1200000) {
        recommendedPkg = 'Starter Website';
        timeline = '1–2 weeks';
      } else if (finalTotal <= 3000000) {
        recommendedPkg = 'Business Website';
        timeline = '2–4 weeks';
      } else if (!isCustom) {
        recommendedPkg = 'Premium Experience';
        timeline = '4–6 weeks';
      } else {
        recommendedPkg = 'Custom / Complex';
        timeline = 'Timeline after discovery';
      }
    }

    const formatCurrency = (val: number) => {
      if (isCA) {
        return `CAD $${val.toLocaleString()}`;
      }
      return `MWK ${(Math.round(val / 25000) * 25000).toLocaleString()}`;
    };

    return {
      baseCostFormatted: formatCurrency(baseCost),
      motionCostFormatted: formatCurrency(motionCost),
      featuresCostFormatted: formatCurrency(featuresCost),
      isCustom,
      recommendedPkg,
      timeline,
      rangeFormatted: isCustom
        ? 'Request a Quote'
        : `${formatCurrency(Math.round(finalTotal * 0.95))} – ${formatCurrency(
            Math.round(finalTotal * 1.15)
          )}`,
    };
  }, [currentMarket, pages, complexityIdx, motionIdx, selectedChips]);

  return (
    <div className="relative w-full py-20 sm:py-28 lg:py-32">
      {/* Header */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4 font-semibold">
              <DollarSign className="h-3.5 w-3.5" />
              <span>TRANSPARENT VALUE // DUAL-REGION PRICING</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
              PREMIUM WEBSITES, PRICED FOR <span className="text-[#008280]">YOUR MARKET.</span>
            </h1>

            <p className="mt-6 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
              Canada and Malawi have separate local price books — not speculative currency conversions. Choose your regional context below.
            </p>
          </div>

          {/* Market Switcher */}
          <div className="flex items-center rounded-lg border border-white/10 bg-[#0C1014] p-1 font-mono text-xs shadow-lg shrink-0">
            <button
              onClick={() => {
                studioAudio.playClick(900);
                onMarketChange('ca');
              }}
              className={`rounded-md px-4 py-2 transition-all uppercase ${
                currentMarket === 'ca'
                  ? 'bg-[#008280] text-white font-semibold shadow-md'
                  : 'text-[#94A3B8] hover:text-[#EBECF0]'
              }`}
            >
              CANADA · CAD $
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(900);
                onMarketChange('mw');
              }}
              className={`rounded-md px-4 py-2 transition-all uppercase ${
                currentMarket === 'mw'
                  ? 'bg-[#367588] text-white font-semibold shadow-md'
                  : 'text-[#94A3B8] hover:text-[#EBECF0]'
              }`}
            >
              MALAWI · MWK
            </button>
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {PRICING_PACKAGES.map((pkg, idx) => {
            const cardGlass = pkg.isFeatured
              ? 'glass-dominant border-[#16D2C8]/60 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,130,128,0.25)] scale-[1.02]'
              : idx === 0
              ? 'glass-smoke border-white/10'
              : idx === 2
              ? 'glass-violet border-white/10'
              : 'glass-slate border-white/10';

            return (
              <div
                key={pkg.id}
                data-cursor="card"
                className={`relative rounded-xl border p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${cardGlass}`}
              >
                {pkg.isFeatured && (
                  <div className="absolute -top-3 left-6 rounded-md bg-[#008280] px-3.5 py-0.5 font-mono text-[10px] font-bold text-[#EBECF0] uppercase tracking-wider shadow-md">
                    ★ Dominant Choice · Most Popular
                  </div>
                )}

                <div>
                  <div className="font-mono text-xs tracking-widest text-[#16D2C8] uppercase mb-2 font-semibold">
                    {pkg.eyebrow}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#EBECF0] mb-3 uppercase tracking-wide">
                    {pkg.name}
                  </h3>

                  <div className="font-mono text-2xl sm:text-3xl font-bold text-[#EBECF0] mb-5 tracking-tight">
                    {currentMarket === 'ca' ? pkg.priceCA : pkg.priceMW}
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] leading-relaxed mb-6 border-b border-white/[0.08] pb-5">
                    {pkg.bestFor}
                  </p>

                  <ul className="space-y-3.5 font-sans text-xs text-[#CBD5E1] mb-8">
                    {pkg.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-[#16D2C8] shrink-0 mt-0.5" />
                        <span className="text-[#EBECF0]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    studioAudio.playClick(1000);
                    onNavigate('contact');
                  }}
                  className={`w-full py-3.5 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all uppercase ${
                    pkg.isFeatured
                      ? 'bg-[#008280] text-white hover:bg-[#009491] shadow-[0_0_20px_rgba(0,130,128,0.35)]'
                      : 'border border-white/20 text-[#EBECF0] hover:border-[#16D2C8] hover:text-[#16D2C8]'
                  }`}
                >
                  {pkg.isCustom ? 'REQUEST CUSTOM QUOTE' : `CHOOSE ${pkg.name.toUpperCase()}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Horizontal Divider: Packages to Estimate Engine */}
      <BrandDivider
        variant="teal"
        width="container"
        spacing="xl"
        label="ESTIMATE ENGINE"
        sublabel="DYNAMIC CALCULATOR"
      />

      {/* 30-Second Instant Estimate Tool */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-3 font-semibold">
            <Calculator className="h-3.5 w-3.5 text-[#16D2C8]" />
            <span>INSTANT ESTIMATE // REAL-TIME CALCULATOR</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#EBECF0] uppercase tracking-wide">
            BUILD YOUR PROJECT ESTIMATE IN 30 SECONDS
          </h2>
          <p className="mt-4 font-sans text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
            Adjust the sliders below to see your starting range recalculate dynamically for {currentMarket === 'ca' ? 'Canada (CAD)' : 'Malawi (MWK)'}.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 glass-dominant p-8 sm:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            {/* Left Column: Sliders & Chips */}
            <div className="lg:col-span-7 space-y-10">
              {/* Pages Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-[#EBECF0] font-semibold">Number of Pages</span>
                  <span className="text-[#16D2C8] font-bold text-base">{pages} Pages</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={pages}
                  onChange={(e) => {
                    studioAudio.playClick(700);
                    setPages(Number(e.target.value));
                  }}
                  className="w-full h-2 rounded-lg bg-white/10 accent-[#008280] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span>1 Page (Landing)</span>
                  <span>6 Pages (Standard)</span>
                  <span>12+ Pages</span>
                </div>
              </div>

              {/* Design Complexity Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-[#EBECF0] font-semibold">Design Finish Level</span>
                  <span className="text-[#16D2C8] font-bold">{complexityNames[complexityIdx]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={complexityIdx}
                  onChange={(e) => {
                    studioAudio.playClick(750);
                    setComplexityIdx(Number(e.target.value));
                  }}
                  className="w-full h-2 rounded-lg bg-white/10 accent-[#367588] cursor-pointer"
                />
              </div>

              {/* Motion / 3D Visuals Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-[#EBECF0] font-semibold">Motion &amp; 3D Visuals</span>
                  <span className="text-[#16D2C8] font-bold">{motionNames[motionIdx]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={motionIdx}
                  onChange={(e) => {
                    studioAudio.playClick(800);
                    setMotionIdx(Number(e.target.value));
                  }}
                  className="w-full h-2 rounded-lg bg-white/10 accent-[#008280] cursor-pointer"
                />
              </div>

              {/* Feature Chips */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#CBD5E1] block font-semibold">
                  OPTIONAL FEATURES &amp; AUTOMATIONS:
                </span>
                <div className="flex flex-wrap gap-3">
                  {chipsData.map((chip) => {
                    const isSelected = selectedChips.includes(chip.id);
                    return (
                      <button
                        key={chip.id}
                        onClick={() => toggleChip(chip.id)}
                        className={`rounded-lg px-4 py-2 text-xs font-mono transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#008280]/30 border border-[#16D2C8] text-[#EBECF0] shadow-sm'
                            : 'border border-white/10 glass-smoke text-[#CBD5E1] hover:border-white/20'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? 'bg-[#16D2C8]' : 'bg-[#1E2629]'
                          }`}
                        />
                        <span>{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Output Card */}
            <div className="lg:col-span-5 rounded-xl border border-white/10 glass-smoke p-8 sm:p-10 space-y-6">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#94A3B8] font-semibold">
                  ESTIMATED INVESTMENT RANGE ({currentMarket === 'ca' ? 'CAD' : 'MWK'})
                </span>
                <div className="font-display text-3xl sm:text-4xl font-bold text-[#16D2C8] mt-1 tracking-tight">
                  {estimateResult.rangeFormatted}
                </div>
              </div>

              <div className="space-y-3 border-t border-b border-white/10 py-5 font-mono text-xs">
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>Base Architecture:</span>
                  <span className="text-[#EBECF0] font-semibold">{estimateResult.baseCostFormatted}</span>
                </div>
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>Motion &amp; 3D Engine:</span>
                  <span className="text-[#EBECF0] font-semibold">{estimateResult.motionCostFormatted}</span>
                </div>
                <div className="flex justify-between text-[#CBD5E1]">
                  <span>Features &amp; Modules:</span>
                  <span className="text-[#EBECF0] font-semibold">{estimateResult.featuresCostFormatted}</span>
                </div>
              </div>

              {/* Recommended Package Box */}
              <div className="rounded-xl border border-[#16D2C8]/30 glass-teal p-5 space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#16D2C8] font-semibold">
                  RECOMMENDED PACKAGE
                </span>
                <div className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wide">
                  {estimateResult.recommendedPkg}
                </div>
                <div className="font-mono text-xs text-[#CBD5E1]">
                  Estimated Timeline: <b className="text-[#EBECF0]">{estimateResult.timeline}</b>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <button
                  onClick={() => {
                    studioAudio.playClick(1100);
                    onNavigate('planner');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#008280] py-4 font-mono text-xs font-semibold text-white shadow-lg hover:bg-[#367588] transition-all uppercase tracking-wider"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>TAKE THIS TO AI PROJECT PLANNER</span>
                </button>

                <p className="text-[11px] font-sans text-[#94A3B8] text-center leading-relaxed">
                  Final quote is confirmed following a free strategy call. All plans include 1-to-1 specialist attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
