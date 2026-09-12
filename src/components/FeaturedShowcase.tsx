import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { studioAudio } from '../utils/audio';
import { ArrowUpRight, Award, Layers } from 'lucide-react';

interface FeaturedShowcaseProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAllWorks: () => void;
}

export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({
  projects,
  onSelectProject,
  onViewAllWorks,
}) => {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section
      id="featured-showcase-section"
      className="relative w-full border-b border-[#1E2629] bg-[#0A0D0E] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-[#00F2FE] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE]" />
              CURATED MONOLITHS // 2025-2026
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F3F7F8] sm:text-5xl">
              FEATURED COMMISSIONS
            </h2>
          </div>

          <button
            id="featured-view-archive-btn"
            onClick={() => {
              studioAudio.playClick(850);
              onViewAllWorks();
            }}
            className="group flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#94A3B8] transition-colors hover:text-[#00F2FE]"
          >
            <span>VIEW FULL ARCHIVE ({projects.length})</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2A363A] transition-all group-hover:border-[#00F2FE] group-hover:bg-[#00F2FE]/10">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#00F2FE]" />
            </div>
          </button>
        </div>

        {/* Featured Cards Grid (Asymmetric avant-garde 12-column split) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
          {featuredProjects.map((project, index) => {
            // Asymmetric layout: 1st card spans 7 cols, 2nd spans 5 cols, 3rd spans 5 cols, 4th spans 7 cols
            const colSpan =
              index === 0
                ? 'lg:col-span-7'
                : index === 1
                ? 'lg:col-span-5'
                : index === 2
                ? 'lg:col-span-5'
                : 'lg:col-span-7';

            return (
              <div key={project.id} className={colSpan}>
                <StudioCard
                  project={project}
                  onSelect={() => onSelectProject(project)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Isolated Glassmorphic Studio Card with mouse-following localized spotlight
interface StudioCardProps {
  project: Project;
  onSelect: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ project, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      data-cursor="card"
      onMouseEnter={() => {
        setIsHovered(true);
        studioAudio.playClick(650);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onSelect}
      className={`group relative cursor-pointer overflow-hidden rounded-[8px] transition-all duration-500 ${
        isHovered ? 'glass-tier-2' : 'glass-tier-1'
      }`}
    >
      {/* Localized Subtle Radial Spotlight following cursor coordinates */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 242, 254, 0.12), transparent 45%)`,
        }}
      />

      {/* Top Media Container with Progressive Zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050607]">
        <img
          src={project.heroImage}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0E] via-transparent to-[#050607]/40" />

        {/* Inner Corner Accent Coordinate (Design System Spec) */}
        <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-[4px] border border-white/10 bg-[#050607]/80 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-[#00F2FE] uppercase backdrop-blur-md">
          <span>{project.coordinate}</span>
        </div>

        {/* Award Badge if present */}
        {project.award && (
          <div className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-[4px] border border-[#5EEAD4]/30 bg-[#050607]/80 px-2.5 py-1 font-mono text-[10px] font-medium text-[#5EEAD4] backdrop-blur-md">
            <Award className="h-3 w-3" />
            <span className="hidden sm:inline">{project.award}</span>
          </div>
        )}
      </div>

      {/* Card Content Interior */}
      <div className="relative z-10 p-6 sm:p-7">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B]">
          <span className="uppercase tracking-widest text-[#94A3B8]">
            {project.client}
          </span>
          <span className="font-semibold text-[#00F2FE]">{project.year}</span>
        </div>

        <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-[#F3F7F8] transition-colors group-hover:text-[#00F2FE] sm:text-3xl">
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-[#94A3B8]">
          {project.subtitle}
        </p>

        {/* Disciplines Chips & Action Trigger */}
        <div className="mt-6 flex items-center justify-between border-t border-[#1E2629] pt-4">
          <div className="flex flex-wrap gap-2">
            {project.disciplines.slice(0, 2).map((disc) => (
              <span
                key={disc}
                className="rounded-[3px] border border-[#2A363A] bg-[#0A0D0E] px-2 py-0.5 font-mono text-[10px] text-[#94A3B8]"
              >
                {disc}
              </span>
            ))}
          </div>

          {/* Magnetic Arrow Indicator */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A363A] bg-[#050607] transition-all duration-300 group-hover:border-[#00F2FE] group-hover:bg-[#00F2FE] group-hover:text-[#050607] group-hover:scale-110">
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
