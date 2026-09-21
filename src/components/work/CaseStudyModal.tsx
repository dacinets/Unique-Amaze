import React from 'react';
import { ProjectCard, PageRoute } from '../../types';
import { studioAudio } from '../../utils/audio';
import { ProgressiveImage } from '../common/ProgressiveImage';
import { FatsaniDeviceShowcase } from './FatsaniDeviceShowcase';
import { X, ExternalLink, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface CaseStudyModalProps {
  project: ProjectCard;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose, onNavigate }) => {
  const isFatsani = project.id === 'fatsani-music';
  const defaultStack = ['React 19', 'Next.js', 'Tailwind CSS', 'WebGL 3D', 'Lighthouse 95+', 'Automated Intake'];
  const techStack = project.engineeringStack || defaultStack;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 backdrop-blur-xl bg-black/80 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          studioAudio.playClick(600);
          onClose();
        }
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-[#16D2C8]/40 glass-dominant shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(0,130,128,0.25)] p-5 sm:p-8 lg:p-10 text-[#EBECF0]">
        {/* Close Button */}
        <button
          onClick={() => {
            studioAudio.playClick(600);
            onClose();
          }}
          className="absolute top-5 right-5 rounded-lg border border-white/15 glass-smoke p-2 text-[#CBD5E1] hover:text-[#EBECF0] hover:border-[#16D2C8] transition-colors z-20"
          aria-label="Close Case Study"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-3">
          <span className="rounded-md bg-[#008280]/25 px-3 py-1 text-[#16D2C8] border border-[#16D2C8]/35 font-bold uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-[#94A3B8] font-semibold">// BESPOKE ARCHITECTURAL CASE STUDY</span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-wide uppercase mb-4 text-white dark:text-[#EBECF0]">
          {project.title}
        </h2>

        {/* Device Renders Showcase for Fatsani Music or Standard Image Preview */}
        {isFatsani ? (
          <div className="my-6">
            <FatsaniDeviceShowcase />
          </div>
        ) : (
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
                  className="cta-image-btn inline-flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase pointer-events-auto hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">VISIT LIVE WEBSITE</span>
                  <ExternalLink className="relative z-10 h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        {project.metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
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
          {/* Project Overview */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#16D2C8]" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#16D2C8] font-bold">
                PROJECT OVERVIEW
              </h4>
            </div>
            <p className="leading-relaxed text-[#EBECF0]/90">
              {project.overview || project.description}
            </p>
          </div>

          {/* The Unique Amaze Approach */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#367588]" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#367588] font-bold">
                THE UNIQUE AMAZE APPROACH
              </h4>
            </div>
            <p className="leading-relaxed text-[#EBECF0]/90">
              {project.approach ||
                'Rather than using pre-packaged templates, we designed this project directly in high-contrast custom code, engineering mobile-first touch targets, instant page rendering, and integrated booking funnels that remove all customer hesitation.'}
            </p>
          </div>

          {/* Engineering Stack */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[#16D2C8]" />
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#16D2C8] font-bold">
                ENGINEERING STACK
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs text-[#EBECF0]">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-md glass-smoke px-3 py-1.5 border border-white/10 text-[#EBECF0] font-semibold hover:border-[#16D2C8]/40 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Device Mockup Highlights if present */}
          {project.deviceMockups && project.deviceMockups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: project.accentColor || '#008280' }}
                />
                <h4
                  className="font-mono text-xs uppercase tracking-widest font-bold"
                  style={{ color: project.accentColor || '#008280' }}
                >
                  MULTI-DEVICE ARCHITECTURE &amp; RESPONSIVE SUITE
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {project.deviceMockups.map((mockup, i) => (
                  <div key={i} className="rounded-lg border border-white/10 glass-smoke p-4 space-y-2">
                    <span
                      className="font-mono text-[10px] uppercase tracking-wider font-bold block"
                      style={{ color: project.accentColor || '#008280' }}
                    >
                      {mockup.badge}
                    </span>
                    <h5 className="font-display text-sm font-bold uppercase text-white">
                      {mockup.title}
                    </h5>
                    <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                      {mockup.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                studioAudio.playClick(900);
                onClose();
                onNavigate('contact');
              }}
              className="cta-image-btn flex items-center gap-2 rounded-md px-6 py-3 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">COMMISSION A SIMILAR FLAGSHIP</span>
              <ArrowRight className="relative z-10 h-4 w-4" />
            </button>

            {project.liveUrl && project.liveUrl.startsWith('http') && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary-btn flex items-center gap-2 rounded-md border px-5 py-3 font-mono text-xs font-semibold transition-all uppercase hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>VISIT LIVE FLAGSHIP</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigate('planner');
            }}
            className="font-mono text-xs text-[#008280] hover:text-[#367588] flex items-center gap-1.5 uppercase font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Plan in Interactive Project Planner →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
