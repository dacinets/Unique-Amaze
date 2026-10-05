import React, { useState, useEffect } from 'react';
import { PageRoute, MarketType } from '../../types';
import { ArrowUpRight, Sparkles, Cpu, Layers, ShieldCheck, Activity, Terminal, ExternalLink } from 'lucide-react';
import { studioAudio } from '../../utils/audio';

interface NavPreviewPanelProps {
  hoveredRoute: PageRoute;
  currentMarket: MarketType;
  onNavigate: (route: PageRoute) => void;
  onCloseMenu: () => void;
}

export const NavPreviewPanel: React.FC<NavPreviewPanelProps> = ({
  hoveredRoute,
  currentMarket,
  onNavigate,
  onCloseMenu,
}) => {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);

  const workItems = [
    {
      title: 'Fatsani Music',
      category: 'Flagship Interactive EP Experience',
      image: '/macbook_pro_mock_up.jpg',
      stat: '89.2% Retention',
      badge: 'MacBook & Mobile Flagship',
    },
    {
      title: 'Chestermere Mobile Massage',
      category: '2-Tap Booking Engine',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      stat: '98/100 Lighthouse',
      badge: 'Mobile Booking Engine',
    },
    {
      title: 'Belle Afrique Wellness',
      category: 'Quiet Luxury Digital Sanctuary',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
      stat: 'Full Waitlist',
      badge: 'Private Wellness Brand',
    },
    {
      title: 'Unique Amaze Concept Lab',
      category: 'Generative Spatial Computing UI',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      stat: '120 FPS Target',
      badge: 'Three.js Shader Lab',
    },
  ];

  // Auto-rotate featured work when work is hovered
  useEffect(() => {
    if (hoveredRoute !== 'work') return;
    const interval = setInterval(() => {
      setSelectedWorkIndex((prev) => (prev + 1) % workItems.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [hoveredRoute, workItems.length]);

  return (
    <div className="relative h-full w-full rounded-2xl border border-white/10 bg-[#07090C]/90 p-6 lg:p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-500">
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl transition-opacity duration-700" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500/[0.06] blur-3xl transition-opacity duration-700" />

      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-zinc-300 uppercase font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>OVERVIEW · {hoveredRoute.toUpperCase()}</span>
        </div>
        <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
          UNIQUE AMAZE STUDIO
        </span>
      </div>

      {/* Main Dynamic Content per Hovered Route */}
      <div className="my-auto py-4">
        {/* OVERVIEW PREVIEW */}
        {hoveredRoute === 'home' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-zinc-300">
              <Sparkles className="h-3 w-3 text-zinc-400" />
              <span>HIGH-PERFORMANCE STUDIO</span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
              Architectural Digital Systems &amp; Creative Engineering.
            </h3>
            <p className="font-sans text-sm text-[#94A3B8] leading-relaxed max-w-md">
              We design and construct bespoke digital flagships, intelligent web applications, and immersive media systems for industry leaders across Calgary, Canada, and global markets.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="text-[10px] text-white/50 tracking-wider">COORDINATES</div>
                <div className="mt-1 font-bold text-white">51.0447° N, 114.0719° W</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="text-[10px] text-white/50 tracking-wider">CORE SPEED</div>
                <div className="mt-1 font-bold text-white">SUB-100MS LATENCY</div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES PREVIEW */}
        {hoveredRoute === 'services' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-zinc-300">
              <Layers className="h-3 w-3 text-zinc-400" />
              <span>CAPABILITIES &amp; ARCHITECTURE</span>
            </div>
            <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-white">
              Strategy / Web / AI / Immersive Experiences
            </h3>
            <div className="space-y-2 pt-1 font-mono text-xs">
              {[
                { title: 'Bespoke Web Flagships', desc: 'React 19, Next.js, and zero-CLS high-conversion platforms.' },
                { title: 'Generative AI Integrations', desc: 'Custom RAG agents, workflow copilots, and intelligent tools.' },
                { title: '3D Spatial & WebGL UI', desc: 'Interactive shaders, tactile media, and ambient audio.' },
                { title: 'Continuous Care Retainers', desc: 'SLA uptime, Lighthouse 95+ guarantees, and rapid iterations.' },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 transition-colors hover:border-white/20"
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{service.title}</span>
                    <span className="text-[10px] text-zinc-400">0{idx + 1}</span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-sans mt-0.5">{service.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORK PREVIEW */}
        {hoveredRoute === 'work' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-zinc-300">
                <Activity className="h-3 w-3 text-zinc-400" />
                <span>SELECTED RELEASES</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50">
                {workItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedWorkIndex(i)}
                    className={`h-1.5 transition-all rounded-full ${
                      selectedWorkIndex === i ? 'w-5 bg-white' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 group">
              <img
                src={workItems[selectedWorkIndex].image}
                alt={workItems[selectedWorkIndex].title}
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // graceful fallback
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="rounded bg-black/75 px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {workItems[selectedWorkIndex].badge}
                  </span>
                  <div className="mt-1 font-display text-base font-bold text-white">
                    {workItems[selectedWorkIndex].title}
                  </div>
                  <div className="font-mono text-[10px] text-[#94A3B8]">
                    {workItems[selectedWorkIndex].category}
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-white">
                  {workItems[selectedWorkIndex].stat}
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
              Explore our verified digital case studies, mobile-first booking engines, and interactive listening flagships.
            </p>
          </div>
        )}

        {/* A.M.A.Z.E. PREVIEW */}
        {hoveredRoute === 'process' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-zinc-300">
              <Cpu className="h-3 w-3 text-zinc-400" />
              <span>THE 5-PILLAR FORMULA</span>
            </div>
            <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight text-white">
              A.M.A.Z.E.™ Framework
            </h3>
            <div className="space-y-2 font-mono text-xs">
              {[
                { letter: 'A', name: 'Architecture', desc: 'Bespoke component engineering without template bloat.' },
                { letter: 'M', name: 'Motion', desc: '60-120fps spatial physics and tactile micro-interactions.' },
                { letter: 'A', name: 'Artificial Intelligence', desc: 'Embedded generative copilots and automated lead triage.' },
                { letter: 'Z', name: 'Zero-Latency', desc: 'Sub-100ms global edge delivery and instant interaction.' },
                { letter: 'E', name: 'Engineering', desc: 'Strict TypeScript typing, WCAG AA contrast, and bulletproof code.' },
              ].map((item) => (
                <div
                  key={item.letter}
                  className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-2"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/10 font-bold text-white">
                    {item.letter}
                  </span>
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="font-sans text-[11px] text-[#94A3B8]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICING PREVIEW */}
        {hoveredRoute === 'pricing' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-zinc-300">
              <ShieldCheck className="h-3 w-3 text-zinc-400" />
              <span>TRANSPARENT VALUE</span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white italic">
              “Built around ambition, not templates.”
            </h3>
            <p className="font-sans text-sm text-[#94A3B8] leading-relaxed">
              Every Unique Amaze engagement features fixed milestones, 100% intellectual property ownership, and clear deliverables. No hidden hourly billing.
            </p>
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="text-white">SPRINT MVP ARCHITECTURE</span>
                <span className="font-bold text-white">{currentMarket === 'ca' ? 'From $1,500 CAD' : 'From MK 950,000'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/5 p-3">
                <span className="font-bold text-white">BESPOKE DIGITAL FLAGSHIP</span>
                <span className="font-bold text-white">{currentMarket === 'ca' ? '$3,200 CAD' : 'MK 2,800,000'}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="text-white">ENTERPRISE MONOLITH / AI</span>
                <span className="font-bold text-white">{currentMarket === 'ca' ? '$6,500+ CAD' : 'Custom'}</span>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT PREVIEW */}
        {hoveredRoute === 'contact' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-zinc-300">
              <Activity className="h-3 w-3 text-zinc-400" />
              <span>CURRENT INTAKE OPEN</span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Have something ambitious in mind?
            </h3>
            <p className="font-sans text-sm text-[#94A3B8] leading-relaxed">
              Direct line to our principal engineer &amp; creative director. We limit concurrent commissions to ensure undivided attention to each flagship.
            </p>
            <div className="space-y-2.5 pt-1 font-mono text-xs">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="text-[10px] text-white/50 tracking-wider">DIRECT EMAIL</div>
                <a
                  href="mailto:hello@uniqueamaze.com"
                  className="mt-1 block font-bold text-white hover:text-zinc-200 transition-colors truncate"
                >
                  hello@uniqueamaze.com
                </a>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <span className="text-white/60">AVERAGE RESPONSE TIME</span>
                <span className="font-bold text-emerald-400">&lt; 4 HOURS</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between">
        <button
          onClick={() => {
            studioAudio.playClick(1100);
            onCloseMenu();
            onNavigate(hoveredRoute);
          }}
          data-cursor="enter"
          className="inline-flex items-center gap-2 rounded-lg bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 font-mono text-xs font-bold text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>EXPLORE {hoveredRoute.toUpperCase()}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>

        <span className="font-mono text-[10px] text-[#94A3B8]">
          PRESS <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">ENTER</kbd> TO NAVIGATE
        </span>
      </div>
    </div>
  );
};
