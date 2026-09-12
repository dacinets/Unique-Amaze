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
    <div className="relative w-full py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4 font-semibold">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>COMMON QUESTIONS // NO SECRETS</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            EVERYTHING YOU MIGHT WANT TO KNOW{' '}
            <span className="text-[#008280] block sm:inline">BEFORE WE TALK.</span>
          </h1>

          <p className="mt-6 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Straightforward answers about our approach, pricing, timelines, technology, and what working with a boutique studio looks like.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3.5 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                studioAudio.playClick(750);
                setActiveTab(tab.id);
                setOpenIdx(null);
              }}
              className={`rounded-lg px-5 py-2.5 font-mono text-xs transition-all uppercase tracking-wider ${
                activeTab === tab.id
                  ? 'bg-[#008280] text-white font-semibold shadow-md'
                  : 'border border-white/10 bg-[#0E1217] text-[#94A3B8] hover:border-white/20 hover:text-[#EBECF0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl space-y-6">
          {filteredFaqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                data-cursor="card"
                className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#008280]/50 glass-tier-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)]'
                    : 'border-white/[0.08] glass-tier-1 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(i)}
                  className="w-full p-7 sm:p-8 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-[#EBECF0] uppercase tracking-wide">
                    {faq.q}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0A0D10] text-[#008280] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#008280] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-7 pb-7 sm:px-8 sm:pb-8 font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed border-t border-white/[0.06] pt-5 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more answers banner */}
        <div className="mt-24 sm:mt-32 rounded-lg border border-white/10 glass-tier-1 p-10 sm:p-14 max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#EBECF0] uppercase tracking-wide">
              HAVE A QUESTION NOT COVERED HERE?
            </h3>
            <p className="font-sans text-sm text-[#94A3B8] mt-2 leading-relaxed">
              Book a quick strategy call and speak directly with our specialist.
            </p>
          </div>
          <button
            onClick={() => {
              studioAudio.playClick(1000);
              onNavigate('contact');
            }}
            className="shrink-0 rounded-lg bg-[#008280] px-6 py-3.5 font-mono text-xs font-semibold text-white hover:bg-[#367588] transition-all flex items-center gap-2 uppercase tracking-wider shadow-md"
          >
            <span>BOOK A STRATEGY CALL</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
