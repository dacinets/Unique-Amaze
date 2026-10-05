import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { FAQ_ITEMS } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { ChevronDown, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';

interface FaqViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General & Approach' },
    { id: 'pricing', label: 'Pricing & Markets' },
    { id: 'process', label: 'Timeline & Process' },
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const toggleAccordion = (idx: number) => {
    studioAudio.playClick(openIdx === idx ? 600 : 850);
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase mb-4 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            Everything you might want to know{' '}
            <span className="text-zinc-400 block sm:inline">before we begin.</span>
          </h1>

          <p className="mt-6 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Straightforward answers about our approach, pricing, timelines, technology, and what working with a boutique studio looks like.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                studioAudio.playClick(750);
                setActiveTab(tab.id);
                setOpenIdx(null);
              }}
              className={`rounded-lg px-4 py-2 font-mono text-xs transition-all uppercase tracking-wider ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white font-semibold border border-white/20 shadow-sm'
                  : 'border border-white/10 bg-[#0E1217] text-[#94A3B8] hover:border-white/20 hover:text-[#EBECF0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl space-y-4">
          {filteredFaqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                data-cursor="card"
                className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-white/20 glass-tier-2 shadow-md'
                    : 'border-white/[0.08] glass-tier-1 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(i)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-[#EBECF0] uppercase tracking-wide">
                    {faq.q}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0A0D10] text-zinc-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-white/10 text-white' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed border-t border-white/[0.06] pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more answers banner with Architectural Image Background */}
        <div className="cta-image-container group mt-24 sm:mt-32 rounded-xl border border-white/10 p-10 sm:p-14 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
            alt="Unique Amaze Architectural Space"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Adaptive Contrast Scrim */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="relative z-10">
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
              HAVE A QUESTION NOT COVERED HERE?
            </h3>
            <p className="font-sans text-sm text-slate-600 dark:text-[#94A3B8] mt-2 leading-relaxed">
              Book a quick strategy call and speak directly with our specialist.
            </p>
          </div>
          <button
            onClick={() => {
              studioAudio.playClick(1000);
              onNavigate('contact');
            }}
            className="cta-image-btn group/btn relative overflow-hidden shrink-0 rounded-lg px-6 py-3.5 font-mono text-xs font-bold text-white transition-all flex items-center gap-2 uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="relative z-10 text-white">BOOK A STRATEGY CALL</span>
            <ArrowRight className="relative z-10 h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
