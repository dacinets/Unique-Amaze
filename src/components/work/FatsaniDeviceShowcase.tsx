import React, { useState } from 'react';
import { studioAudio } from '../../utils/audio';
import {
  Laptop,
  Tablet,
  Smartphone,
  Layers,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface MockupItem {
  id: 'macbook' | 'ipad' | 'iphone';
  name: string;
  deviceLabel: string;
  viewportBadge: string;
  imageSrc: string;
  fallbackSrc: string;
  altText: string;
  description: string;
}

const MOCKUPS: MockupItem[] = [
  {
    id: 'macbook',
    name: 'MacBook Pro',
    deviceLabel: 'MacBook Pro 16"',
    viewportBadge: 'Desktop Viewport · 2560 × 1600',
    imageSrc: '/macbook_pro_mock_up.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=85',
    altText: 'MacBook Pro Viewport Render — Fatsani Music Portfolio',
    description: 'Expansive desktop composition showcasing live streaming media player, discography archive, and full-fidelity hero typography.',
  },
  {
    id: 'ipad',
    name: 'iPad Pro',
    deviceLabel: 'iPad Pro 12.9"',
    viewportBadge: 'Tablet Viewport · 2048 × 2732',
    imageSrc: '/ipad_mock_up.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1400&q=85',
    altText: 'iPad Pro Viewport Render — Fatsani Music Portfolio',
    description: 'Touch-optimized adaptive matrix with kinetic swipe interactions and tactile audio playback controls.',
  },
  {
    id: 'iphone',
    name: 'iPhone 17 Pro Max',
    deviceLabel: 'iPhone 17 Pro Max',
    viewportBadge: 'Mobile Viewport · 1320 × 2868',
    imageSrc: '/iphone_pro_max_mock_up.jpg',
    fallbackSrc: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=85',
    altText: 'iPhone Viewport Render — Fatsani Music Portfolio',
    description: 'Ultra-fast sub-600ms mobile experience engineered for cellular networks and instant thumb navigation.',
  }
];

export const FatsaniDeviceShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'macbook' | 'ipad' | 'iphone' | 'all'>('macbook');
  const [imgSources, setImgSources] = useState<Record<string, string>>({
    macbook: MOCKUPS[0].imageSrc,
    ipad: MOCKUPS[1].imageSrc,
    iphone: MOCKUPS[2].imageSrc,
  });

  const handleImageError = (id: string, fallback: string) => {
    setImgSources((prev) => ({ ...prev, [id]: fallback }));
  };

  const selectedMockup = MOCKUPS.find((m) => m.id === activeTab) || MOCKUPS[0];

  return (
    <div className="w-full space-y-4">
      {/* Viewport Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              studioAudio.playClick(1000);
              setActiveTab('macbook');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
              activeTab === 'macbook'
                ? 'bg-slate-800 text-white font-bold border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>MacBook Pro</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(1050);
              setActiveTab('ipad');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
              activeTab === 'ipad'
                ? 'bg-slate-800 text-white font-bold border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>iPad Pro</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(1100);
              setActiveTab('iphone');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
              activeTab === 'iphone'
                ? 'bg-slate-800 text-white font-bold border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>iPhone 17 Pro</span>
          </button>

          <button
            onClick={() => {
              studioAudio.playClick(950);
              setActiveTab('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white font-bold border border-slate-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Multi-Device Grid</span>
          </button>
        </div>

        {/* Live Site Link */}
        <a
          href="https://fatsanimusic.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 font-mono text-xs text-slate-200 hover:text-white uppercase transition-all"
        >
          <Sparkles className="h-3 w-3 text-emerald-400" />
          <span>VISIT LIVE PRODUCTION SITE</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Single Viewport Active Stage */}
      {activeTab !== 'all' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">
                {selectedMockup.deviceLabel}
              </span>
            </div>
          </div>

          {/* Image Container — Render Mockup */}
          <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-black/40 min-h-[440px]">
            <img
              src={imgSources[selectedMockup.id] || selectedMockup.fallbackSrc}
              alt={selectedMockup.altText}
              loading="lazy"
              decoding="async"
              onError={() => handleImageError(selectedMockup.id, selectedMockup.fallbackSrc)}
              className="max-h-[600px] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all"
            />
          </div>

          {/* Caption */}
          <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/40 font-sans text-xs text-slate-400">
            {selectedMockup.description}
          </div>
        </div>
      ) : (
        /* Multi-Device Grid View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCKUPS.map((mockup) => (
            <div
              key={mockup.id}
              className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl flex flex-col"
            >
              <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-200 font-bold uppercase tracking-wider">
                  {mockup.name}
                </span>
              </div>

              <div className="p-4 bg-black/40 flex-1 flex items-center justify-center min-h-[300px]">
                <img
                  src={imgSources[mockup.id] || mockup.fallbackSrc}
                  alt={mockup.altText}
                  loading="lazy"
                  decoding="async"
                  onError={() => handleImageError(mockup.id, mockup.fallbackSrc)}
                  className="max-h-[380px] w-auto max-w-full object-contain rounded-md shadow-lg"
                />
              </div>

              <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
                {mockup.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
