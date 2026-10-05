import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProjectCard, PageRoute } from '../../types';
import { studioAudio } from '../../utils/audio';
import { FatsaniDeviceShowcase } from './FatsaniDeviceShowcase';
import {
  X,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface CaseStudyModalProps {
  project: ProjectCard;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onNavigate,
}) => {
  const isFatsani = project.id === 'fatsani-music';
  const defaultStack = [
    'React 19',
    'Next.js 15',
    'Tailwind CSS',
    'TypeScript',
    'Lighthouse 95+',
    'Sub-Second Global CDN',
  ];
  const techStack = project.engineeringStack && project.engineeringStack.length > 0
    ? project.engineeringStack
    : defaultStack;

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        studioAudio.playClick(600);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Case Study: ${project.title}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 lg:p-8 bg-slate-950/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          studioAudio.playClick(600);
          onClose();
        }
      }}
    >
      {/* Modal Surface Window: Solid high-contrast background to eliminate double-blur bugs */}
      <div className="case-study-modal-dialog relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-5 sm:p-8 lg:p-10 select-text">
        {/* Sticky/Fixed Top Close Button */}
        <button
          onClick={() => {
            studioAudio.playClick(600);
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 p-2.5 text-slate-300 hover:text-white transition-all cursor-pointer z-30 shadow-md"
          aria-label="Close Case Study"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Kicker & Sector Tag */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1 text-slate-200 border border-slate-700 font-bold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{project.category}</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 tracking-wider uppercase font-semibold">
            {project.isFutureCard ? 'Reserved Client Slot' : 'Verified Commercial Flagship'}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase mb-4 text-white leading-tight">
          {project.title}
        </h2>

        {/* Short Executive Summary Lede */}
        <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-3xl">
          {project.description}
        </p>

        {/* Media Preview: Multi-Device Showcase for Fatsani or High-Fidelity Stage for Others */}
        {isFatsani ? (
          <div className="my-6">
            <FatsaniDeviceShowcase />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 my-6 shadow-2xl group">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                loading="eager"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('unsplash')) {
                    target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80';
                  }
                }}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 pointer-events-none" />
            </div>

            {/* Stage Action Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between items-center gap-3 z-20">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/60 font-mono text-[11px] text-slate-200 backdrop-blur-md font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Production Verified</span>
              </div>

              {project.liveUrl && project.liveUrl.startsWith('http') && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-image-btn inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase pointer-events-auto hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">VISIT LIVE WEBSITE</span>
                  <ExternalLink className="relative z-10 h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Quantifiable Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="case-study-metric-card rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-center"
              >
                <div className="flex items-center justify-center gap-1 font-display text-xl sm:text-2xl font-black text-white">
                  <span>{m.value}</span>
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Structured In-Depth Case Study Story Sections */}
        <div className="space-y-6 pt-6 border-t border-slate-800 font-sans text-sm text-slate-300 leading-relaxed">
          {/* Section 1: Project Overview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">
                PROJECT OVERVIEW & STRATEGIC CONTEXT
              </h4>
            </div>
            <p className="leading-relaxed text-slate-300">
              {project.overview || project.description}
            </p>
          </div>

          {/* Section 2: The Unique Amaze Solution & Approach */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">
                THE UNIQUE AMAZE ARCHITECTURAL APPROACH
              </h4>
            </div>
            <p className="leading-relaxed text-slate-300">
              {project.approach ||
                'Rather than relying on generic page builders or repetitive pre-built templates, Unique Amaze designed and engineered this digital flagship from foundational principles. We prioritized mobile-first ergonomics, zero layout shift (CLS 0), instant sub-second response times, and an assertive conversion funnel that turns exploratory visitors into confirmed clients.'}
            </p>
          </div>

          {/* Section 3: Engineering Stack & Architecture */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">
                ENGINEERING STACK & INTEGRATIONS
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
              {techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-800 border border-slate-700/60 px-3 py-1.5 text-slate-200 font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Responsive Viewports (if present) */}
          {project.deviceMockups && project.deviceMockups.length > 0 && !isFatsani && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <h4 className="font-mono text-xs uppercase tracking-widest text-slate-200 font-bold">
                  MULTI-DEVICE VIEWPORT TESTING
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.deviceMockups.map((mockup, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5 space-y-1.5"
                  >
                    <div className="font-mono text-xs font-bold text-slate-200 uppercase">
                      {mockup.title}
                    </div>
                    <div className="font-sans text-xs text-slate-400 leading-relaxed">
                      {mockup.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                studioAudio.playClick(900);
                onClose();
                onNavigate('contact');
              }}
              className="cta-image-btn flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto cursor-pointer"
            >
              <span className="relative z-10">COMMISSION A SIMILAR PROJECT</span>
              <ArrowRight className="relative z-10 h-4 w-4" />
            </button>

            {project.liveUrl && project.liveUrl.startsWith('http') && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 px-5 py-3 font-mono text-xs font-semibold text-slate-200 hover:text-white transition-all uppercase hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span>VISIT LIVE SITE</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                studioAudio.playClick(800);
                onClose();
                onNavigate('planner');
              }}
              className="font-mono text-xs text-slate-400 hover:text-white flex items-center gap-1.5 uppercase font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-400" />
              <span>Launch 2-Min Discovery Planner →</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
