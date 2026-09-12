import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { studioAudio } from '../utils/audio';
import { X, ArrowUpRight, Award, Check, ChevronLeft, ChevronRight, Sparkles, Layers, Cpu } from 'lucide-react';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onNextProject?: () => void;
  onPrevProject?: () => void;
  onOpenCommission: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onNextProject,
  onPrevProject,
  onOpenCommission,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      id="case-study-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#050607]/90 p-3 sm:p-6 backdrop-blur-2xl"
    >
      <div
        id="case-study-modal-container"
        className="relative my-auto w-full max-w-5xl overflow-hidden rounded-[8px] border border-[#2A363A] bg-[#0A0D0E] shadow-[0_0_80px_rgba(0,0,0,0.9)]"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#1E2629] bg-[#050607]/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[3px] border border-[#00F2FE]/40 bg-[#00F2FE]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00F2FE]">
              {project.coordinate}
            </span>
            <span className="font-mono text-xs text-[#64748B] hidden sm:inline">
              CLIENT: {project.client} • {project.year}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onPrevProject && (
              <button
                onClick={onPrevProject}
                className="rounded-[4px] border border-[#2A363A] p-1.5 text-[#94A3B8] hover:border-[#00F2FE] hover:text-[#00F2FE]"
                title="Previous Project"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            {onNextProject && (
              <button
                onClick={onNextProject}
                className="rounded-[4px] border border-[#2A363A] p-1.5 text-[#94A3B8] hover:border-[#00F2FE] hover:text-[#00F2FE]"
                title="Next Project"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <button
              id="case-study-close-btn"
              onClick={() => {
                studioAudio.playClick(600);
                onClose();
              }}
              className="ml-2 rounded-[4px] border border-[#2A363A] p-1.5 text-[#F3F7F8] hover:border-[#00F2FE] hover:bg-[#00F2FE]/10 hover:text-[#00F2FE]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Interior Content */}
        <div className="max-h-[82vh] overflow-y-auto p-6 sm:p-10 space-y-10">
          {/* Header & Title */}
          <div>
            {project.award && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-[4px] border border-[#5EEAD4]/30 bg-[#5EEAD4]/10 px-3 py-1 font-mono text-xs text-[#5EEAD4]">
                <Award className="h-3.5 w-3.5" />
                <span>{project.award}</span>
              </div>
            )}
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#F3F7F8] sm:text-5xl">
              {project.title}
            </h2>
            <p className="mt-3 font-sans text-lg text-[#00F2FE]">
              {project.subtitle}
            </p>
          </div>

          {/* Primary High-Res Showcase Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-[#1E2629] bg-[#050607]">
            <img
              src={project.gallery[activeImageIndex] || project.heroImage}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            {project.gallery.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                {project.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      studioAudio.playClick(750);
                      setActiveImageIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      activeImageIndex === idx
                        ? 'w-8 bg-[#00F2FE] shadow-[0_0_10px_#00F2FE]'
                        : 'w-2.5 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Metrics Trio Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="glass-tier-1 rounded-[6px] p-5 text-center sm:text-left"
              >
                <div className="font-mono text-[10px] uppercase text-[#64748B]">
                  {m.label}
                </div>
                <div className="mt-1 font-display text-2xl font-bold text-[#5EEAD4]">
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* Architectural Narrative: Brief vs Solution */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-[6px] border border-[#1E2629] bg-[#0D1214] p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00F2FE] uppercase">
                <Layers className="h-4 w-4" />
                <span>THE ARCHITECTURAL BRIEF</span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-[#94A3B8]">
                {project.architecturalBrief}
              </p>
            </div>

            <div className="rounded-[6px] border border-[#1E2629] bg-[#0D1214] p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#5EEAD4] uppercase">
                <Cpu className="h-4 w-4" />
                <span>THE COMPUTATIONAL SOLUTION</span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-[#94A3B8]">
                {project.computationalSolution}
              </p>
            </div>
          </div>

          {/* Disciplines & Technical Stack */}
          <div className="border-t border-[#1E2629] pt-8">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase mb-3">
              DEPLOYED DISCIPLINES & CODEC
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.disciplines.map((disc) => (
                <span
                  key={disc}
                  className="rounded-[4px] border border-[#2A363A] bg-[#050607] px-3 py-1 font-mono text-xs text-[#94A3B8]"
                >
                  {disc}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Footer Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1E2629] pt-8">
            <div className="font-mono text-xs text-[#64748B]">
              INTERESTED IN A SYSTEM WITH SIMILAR SPECIFICATIONS?
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenCommission();
              }}
              className="flex items-center gap-2 rounded-[4px] bg-[#00F2FE] px-6 py-3 font-mono text-xs font-bold text-[#050607] uppercase hover:bg-[#5EEAD4] hover:shadow-[0_0_24px_rgba(0,242,254,0.4)] transition-all"
            >
              <span>DISCUSS SIMILAR COMMISSION</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
