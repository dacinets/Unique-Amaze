import React from 'react';
import { ProjectCard, PageRoute } from '../../types';
import { studioAudio } from '../../utils/audio';
import { ProgressiveImage } from '../common/ProgressiveImage';
import { X, ExternalLink, ArrowRight, CheckCircle, Sparkles, Shield, Cpu } from 'lucide-react';

interface CaseStudyModalProps {
  project: ProjectCard;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose, onNavigate }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 backdrop-blur-xl bg-black/80 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          studioAudio.playClick(600);
          onClose();
        }
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-[#16D2C8]/40 glass-dominant shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(0,130,128,0.25)] p-6 sm:p-10 text-[#EBECF0]">
        {/* Close Button */}
        <button
          onClick={() => {
            studioAudio.playClick(600);
            onClose();
          }}
          className="absolute top-6 right-6 rounded-lg border border-white/15 glass-smoke p-2 text-[#CBD5E1] hover:text-[#EBECF0] hover:border-[#16D2C8] transition-colors"
          aria-label="Close Case Study"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-4">
          <span className="rounded-md bg-[#008280]/25 px-3 py-1 text-[#16D2C8] border border-[#16D2C8]/35 font-bold uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-[#94A3B8] font-semibold">// BESPOKE ARCHITECTURE</span>
        </div>

        {/* Title (All caps, medium weight) */}
        <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-wide uppercase mb-4 text-[#EBECF0]">
          {project.title}
        </h2>

        {/* Preview Image Frame with Progressive Loading */}
        <div className="relative w-full overflow-hidden rounded-xl border border-white/15 my-6 shadow-2xl">
          <ProgressiveImage
            src={project.image}
            alt={project.title}
            aspectRatio="16/9"
            priority={true}
            overlayScrim="bottom"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-30">
            {project.liveUrl && project.liveUrl.startsWith('http') && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#008280] px-4 py-2 font-mono text-xs font-bold text-white shadow-lg hover:bg-[#009491] transition-colors uppercase pointer-events-auto"
              >
                <span>VISIT LIVE WEBSITE</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        {project.metrics && (
          <div className="grid grid-cols-3 gap-4 my-6">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="rounded-lg border border-white/10 glass-smoke p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-bold text-[#16D2C8]">{m.value}</div>
                <div className="font-mono text-[10px] sm:text-xs text-[#CBD5E1] uppercase tracking-wider mt-1 font-semibold">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Narrative Details */}
        <div className="space-y-6 pt-4 border-t border-white/10 font-sans text-sm text-[#CBD5E1] leading-relaxed">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#16D2C8] mb-2 font-bold">
              PROJECT OVERVIEW
            </h4>
            <p>{project.description}</p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#367588] mb-2 font-bold">
              THE UNIQUE AMAZE APPROACH
            </h4>
            <p>
              Rather than using pre-packaged templates, we designed this project directly in high-contrast custom code, engineering mobile-first touch targets, instant page rendering, and integrated booking funnels that remove all customer hesitation.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#16D2C8] mb-2 font-bold">
              ENGINEERING STACK
            </h4>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs text-[#EBECF0]">
              {['React 19', 'Next.js', 'Tailwind CSS', 'WebGL 3D', 'Lighthouse 95+', 'Automated Intake'].map((t) => (
                <span key={t} className="rounded-md glass-smoke px-3 py-1 border border-white/10 text-[#EBECF0]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              studioAudio.playClick(900);
              onClose();
              onNavigate('contact');
            }}
            className="flex items-center gap-2 rounded-md bg-[#008280] px-6 py-3 font-mono text-xs font-bold text-white shadow-lg hover:bg-[#009491] transition-all uppercase"
          >
            <span>RESERVE SIMILAR PROJECT</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigate('planner');
            }}
            className="font-mono text-xs text-[#008280] hover:text-[#367588] flex items-center gap-1.5 uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Plan in AI Project Planner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
