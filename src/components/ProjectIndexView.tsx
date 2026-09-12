import React, { useState, useEffect } from 'react';
import { Project, ArchiveViewStyle } from '../types';
import { studioAudio } from '../utils/audio';
import { LayoutGrid, List, ArrowUpRight, Award, Filter } from 'lucide-react';

interface ProjectIndexViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

const CATEGORIES = [
  'All Dispatches',
  'Spatial & 3D',
  'Generative AI',
  'Brand Architecture',
  'Kinetic Systems',
  'Physical Computing',
] as const;

export const ProjectIndexView: React.FC<ProjectIndexViewProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Dispatches');
  const [viewStyle, setViewStyle] = useState<ArchiveViewStyle>('index');
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [skewDeg, setSkewDeg] = useState(0);

  // Track mouse position and calculate directional skew velocity
  useEffect(() => {
    let lastX = 0;
    let timeoutId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;

      // Calculate subtle skew clamped between -8 and +8 degrees
      const clampedSkew = Math.max(-8, Math.min(8, deltaX * 0.4));
      setSkewDeg(clampedSkew);

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setSkewDeg(0);
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All Dispatches') return true;
    return p.category === selectedCategory;
  });

  return (
    <section
      id="archive-works-section"
      className="relative min-h-screen w-full bg-[#050607] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#1E2629] pb-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-[#00F2FE] uppercase">
              <span>INDEX // 001—{String(projects.length).padStart(3, '0')}</span>
              <span className="text-[#3A494B]">//</span>
              <span>COMPLETE WORKS REPOSITORY</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[#F3F7F8] sm:text-6xl">
              PORTFOLIO ARCHIVE
            </h1>
          </div>

          {/* Grid vs Index List Toggle */}
          <div className="flex items-center gap-2 rounded-[4px] border border-[#2A363A] bg-[#0A0D0E] p-1">
            <button
              id="view-toggle-index-btn"
              onClick={() => {
                studioAudio.playClick(800);
                setViewStyle('index');
              }}
              className={`flex items-center gap-2 rounded-[3px] px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                viewStyle === 'index'
                  ? 'bg-[#00F2FE] text-[#050607]'
                  : 'text-[#94A3B8] hover:text-[#F3F7F8]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>INDEX ROW</span>
            </button>
            <button
              id="view-toggle-grid-btn"
              onClick={() => {
                studioAudio.playClick(800);
                setViewStyle('grid');
              }}
              className={`flex items-center gap-2 rounded-[3px] px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                viewStyle === 'grid'
                  ? 'bg-[#00F2FE] text-[#050607]'
                  : 'text-[#94A3B8] hover:text-[#F3F7F8]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>GRID</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips (Design Specification) */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4">
          <Filter className="h-4 w-4 text-[#64748B] shrink-0 mr-1" />
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`filter-chip-${category.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  studioAudio.playClick(isSelected ? 600 : 780);
                  setSelectedCategory(category);
                }}
                className={`whitespace-nowrap rounded-[4px] px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  isSelected
                    ? 'border border-[#00F2FE] bg-[#00F2FE]/10 text-[#5EEAD4] shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                    : 'border border-[#1E2629] bg-[#0A0D0E] text-[#94A3B8] hover:border-[#2A363A] hover:text-[#F3F7F8]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* VIEW STYLE: INDEX ROW (Design System Custom Component) */}
        {viewStyle === 'index' ? (
          <div id="project-index-rows-container" className="mt-12 divide-y divide-[#1E2629] border-y border-[#1E2629]">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                id={`index-row-${project.id}`}
                onMouseEnter={() => {
                  setHoveredProject(project);
                  studioAudio.playClick(620);
                }}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => {
                  studioAudio.playClick(900);
                  onSelectProject(project);
                }}
                className="group relative flex cursor-pointer flex-col justify-between py-6 transition-all duration-300 hover:bg-[#0A0D0E]/80 lg:flex-row lg:items-center lg:py-7 px-4 sm:px-6"
              >
                {/* Left Side: Number, Title, Coordinate */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="font-mono text-xs font-semibold text-[#64748B] group-hover:text-[#00F2FE]">
                    {String(idx + 1).padStart(2, '0')} //
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-[#F3F7F8] transition-colors group-hover:text-[#00F2FE] sm:text-2xl lg:text-3xl">
                      {project.title}
                    </h3>
                    <div className="mt-1 font-mono text-xs text-[#94A3B8]">
                      {project.subtitle}
                    </div>
                  </div>
                </div>

                {/* Right Side: Category, Client, Award, Year, Arrow */}
                <div className="mt-4 flex flex-wrap items-center gap-6 font-mono text-xs text-[#64748B] lg:mt-0">
                  <span className="rounded-[3px] border border-[#2A363A] bg-[#050607] px-2.5 py-1 text-[#5EEAD4]">
                    {project.category}
                  </span>
                  <span className="hidden uppercase text-[#94A3B8] sm:inline">
                    {project.client}
                  </span>
                  {project.award && (
                    <span className="hidden items-center gap-1 text-[#00F2FE] md:flex">
                      <Award className="h-3 w-3" />
                      {project.award}
                    </span>
                  )}
                  <span className="font-bold text-[#F3F7F8]">{project.year}</span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A363A] bg-[#050607] transition-all duration-300 group-hover:border-[#00F2FE] group-hover:bg-[#00F2FE] group-hover:text-[#050607]">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* VIEW STYLE: GRID CARDS */
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  studioAudio.playClick(850);
                  onSelectProject(project);
                }}
                className="glass-tier-1 group cursor-pointer overflow-hidden rounded-[6px] transition-all duration-300 hover:glass-tier-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#050607]">
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-[4px] bg-[#050607]/80 px-2 py-0.5 font-mono text-[10px] text-[#00F2FE]">
                    {project.coordinate}
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-mono text-[11px] text-[#64748B] uppercase">
                    {project.client} • {project.year}
                  </div>
                  <h4 className="mt-2 font-display text-xl font-bold text-[#F3F7F8] group-hover:text-[#00F2FE]">
                    {project.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 font-sans text-xs text-[#94A3B8]">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Case-Study Preview Thumbnail on Hover with Directional Skew */}
        {hoveredProject && (
          <div
            className="pointer-events-none fixed z-50 hidden lg:block"
            style={{
              left: `${mousePosition.x + 30}px`,
              top: `${mousePosition.y - 120}px`,
              transform: `skewX(${skewDeg}deg) rotate(${skewDeg * 0.5}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
            }}
          >
            <div className="relative w-80 overflow-hidden rounded-[6px] border border-[#00F2FE]/80 bg-[#050607] shadow-[0_0_35px_rgba(0,242,254,0.35)]">
              <img
                src={hoveredProject.heroImage}
                alt={hoveredProject.title}
                referrerPolicy="no-referrer"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="border-t border-[#1E2629] bg-[#0A0D0E] p-3 font-mono">
                <div className="flex items-center justify-between text-[10px] text-[#00F2FE]">
                  <span>{hoveredProject.coordinate}</span>
                  <span>{hoveredProject.year}</span>
                </div>
                <div className="mt-1 font-display text-xs font-bold text-[#F3F7F8]">
                  {hoveredProject.title}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
