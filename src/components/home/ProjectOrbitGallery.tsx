import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ProjectCard, PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface ProjectOrbitGalleryProps {
  projects: ProjectCard[];
  currentMarket: MarketType;
  onSelectProject: (project: ProjectCard) => void;
  onNavigate: (route: PageRoute) => void;
}

export const ProjectOrbitGallery: React.FC<ProjectOrbitGalleryProps> = ({
  projects,
  currentMarket,
  onSelectProject,
  onNavigate,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const isUserInteractingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startScrollLeftRef = useRef<number>(0);

  // Filter definitions based on real business sectors
  const filters = [
    { key: 'all', label: 'All Work' },
    { key: 'wellness', label: 'Wellness & Health' },
    { key: 'music', label: 'Music & Media' },
    { key: 'community', label: 'Community & Faith' },
    { key: 'lab', label: 'AI & Lab' },
  ];

  const filteredProjects = useMemo(() => {
    if (selectedFilter === 'all') return projects;
    return projects.filter((p) => {
      const cat = p.category.toLowerCase();
      const title = p.title.toLowerCase();
      if (selectedFilter === 'wellness') return cat.includes('wellness') || cat.includes('massage') || title.includes('massage');
      if (selectedFilter === 'music') return cat.includes('music') || title.includes('fatsani');
      if (selectedFilter === 'community') return cat.includes('church') || cat.includes('community');
      if (selectedFilter === 'lab') return cat.includes('ai') || cat.includes('lab') || p.id.includes('lab');
      return true;
    });
  }, [projects, selectedFilter]);

  // Duplicate items array 4 times to ensure uninterrupted infinite width across wide displays
  const displayItems = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    return [
      ...filteredProjects,
      ...filteredProjects,
      ...filteredProjects,
      ...filteredProjects,
    ];
  }, [filteredProjects]);

  // Measure the exact horizontal distance between Set 0 and Set 1 for mathematically seamless wrapping
  const calculateOneSetWidth = useCallback((): number => {
    const el = scrollContainerRef.current;
    if (!el || filteredProjects.length === 0) return 0;
    const cards = el.querySelectorAll<HTMLElement>('.gallery-card-item');
    if (cards.length > filteredProjects.length) {
      const card0 = cards[0];
      const cardN = cards[filteredProjects.length];
      if (card0 && cardN) {
        const measured = cardN.offsetLeft - card0.offsetLeft;
        if (measured > 100) return measured;
      }
    }
    // Fallback based on card width and gap if DOM not yet rendered
    const card = el.querySelector<HTMLElement>('.gallery-card-item');
    const singleCardWidth = card ? card.offsetWidth + 32 : 440;
    return singleCardWidth * filteredProjects.length;
  }, [filteredProjects.length]);

  // Direct DOM update for scrubber bar to avoid React state re-rendering at 60fps
  const updateProgressBar = useCallback((oneSetWidth: number) => {
    if (progressBarRef.current && oneSetWidth > 0) {
      const mod = ((scrollXRef.current % oneSetWidth) + oneSetWidth) % oneSetWidth;
      const pct = Math.min(100, Math.max(6, (mod / oneSetWidth) * 100));
      progressBarRef.current.style.width = `${pct}%`;
    }
  }, []);

  // Initialize scroll position into Set 1 so user can navigate both left and right immediately
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const oneSet = calculateOneSetWidth();
      if (oneSet > 0) {
        scrollXRef.current = oneSet;
        el.scrollLeft = oneSet;
        updateProgressBar(oneSet);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [selectedFilter, filteredProjects.length, calculateOneSetWidth, updateProgressBar]);

  // Check prefers-reduced-motion to respect user system accessibility preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsAutoPlaying(false);
    }
  }, []);

  // Continuous autonomous horizontal motion across the section
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const el = scrollContainerRef.current;
      if (el && isAutoPlaying && !isDraggingRef.current && !isUserInteractingRef.current) {
        // Base gliding speed in pixels per second:
        // When hovered over card/dock, decelerate to a gentle drift (12px/s) so user can comfortably inspect/click
        const speedPxPerSec = isHovered ? 12 : 55;
        const delta = speedPxPerSec * dt;

        scrollXRef.current += delta;

        const oneSet = calculateOneSetWidth();
        if (oneSet > 0) {
          // Wrap forward seamlessly
          if (scrollXRef.current >= oneSet * 2.5) {
            scrollXRef.current -= oneSet;
          } else if (scrollXRef.current <= 40) {
            scrollXRef.current += oneSet;
          }
        }

        el.scrollLeft = scrollXRef.current;
        updateProgressBar(oneSet);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isAutoPlaying, isHovered, calculateOneSetWidth, updateProgressBar]);

  // Page Scroll Reactive Boost: Vertical scrolling dynamically drives horizontal motion across section
  useEffect(() => {
    let prevScrollY = window.scrollY;

    const handlePageScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - prevScrollY;
      prevScrollY = currentScrollY;

      if (Math.abs(deltaY) < 0.5) return;

      const sectionEl = document.getElementById('section-showcase');
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();

      // Only trigger when gallery section is in the viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const el = scrollContainerRef.current;
        if (el && !isDraggingRef.current) {
          // Dynamic horizontal translation driven by page scroll velocity
          const boost = deltaY * 0.45;
          scrollXRef.current += boost;

          const oneSet = calculateOneSetWidth();
          if (oneSet > 0) {
            if (scrollXRef.current >= oneSet * 2.5) {
              scrollXRef.current -= oneSet;
            } else if (scrollXRef.current <= 40) {
              scrollXRef.current += oneSet;
            }
          }

          el.scrollLeft = scrollXRef.current;
          updateProgressBar(oneSet);
        }
      }
    };

    window.addEventListener('scroll', handlePageScroll, { passive: true });
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, [calculateOneSetWidth, updateProgressBar]);

  // Manual Previous Card Navigation
  const handleScrollPrev = () => {
    studioAudio.playClick(850);
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.gallery-card-item');
    const cardWidth = card ? card.offsetWidth + 32 : 440;

    scrollXRef.current -= cardWidth;
    const oneSet = calculateOneSetWidth();
    if (oneSet > 0 && scrollXRef.current <= 40) {
      scrollXRef.current += oneSet;
    }
    el.scrollTo({ left: scrollXRef.current, behavior: 'smooth' });
    updateProgressBar(oneSet);
  };

  // Manual Next Card Navigation
  const handleScrollNext = () => {
    studioAudio.playClick(950);
    const el = scrollContainerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.gallery-card-item');
    const cardWidth = card ? card.offsetWidth + 32 : 440;

    scrollXRef.current += cardWidth;
    const oneSet = calculateOneSetWidth();
    if (oneSet > 0 && scrollXRef.current >= oneSet * 2.5) {
      scrollXRef.current -= oneSet;
    }
    el.scrollTo({ left: scrollXRef.current, behavior: 'smooth' });
    updateProgressBar(oneSet);
  };

  // Pointer Drag & Touch Swipe Handlers with inertia tracking
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        isUserInteractingRef.current = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }
    }

    if (!hasDraggedRef.current) return;

    const newScroll = startScrollLeftRef.current - dx;
    el.scrollLeft = newScroll;
    scrollXRef.current = newScroll;

    const oneSet = calculateOneSetWidth();
    if (oneSet > 0) {
      if (el.scrollLeft >= oneSet * 2.5) {
        scrollXRef.current -= oneSet;
        startScrollLeftRef.current -= oneSet;
        el.scrollLeft -= oneSet;
      } else if (el.scrollLeft <= 40) {
        scrollXRef.current += oneSet;
        startScrollLeftRef.current += oneSet;
        el.scrollLeft += oneSet;
      }
      updateProgressBar(oneSet);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    isUserInteractingRef.current = false;
    const el = scrollContainerRef.current;
    if (el) {
      scrollXRef.current = el.scrollLeft;
    }
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Native trackpad / mouse wheel sync
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (isUserInteractingRef.current) {
      scrollXRef.current = el.scrollLeft;
      const oneSet = calculateOneSetWidth();
      updateProgressBar(oneSet);
    }
  };

  return (
    <section
      id="section-showcase"
      className="relative w-full border-t border-white/[0.08] bg-[#050607] py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-0 radial-mesh-slate opacity-20 z-0" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 sm:mb-12 pb-6 border-b border-white/[0.08]">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">Live Portfolio Feed</span>
              <span className="text-white/20">•</span>
              <span>{currentMarket === 'mw' ? 'Malawi & Regional' : 'Canada & Global'}</span>
            </div>

            <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-black uppercase text-[#EBECF0] tracking-[-0.03em] leading-[1.08]">
              Built to Perform. <br />
              <span className="text-zinc-400">Crafted to Endure.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed">
              Explore our verified digital flagships moving across this gallery. Hover or tap any project to pause the motion and view in-depth case study architecture.
            </p>
          </div>

          {/* Interactive Navigation & Control Dock */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filters.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    studioAudio.playClick(920);
                    setSelectedFilter(tab.key);
                    // Reset scroll to beginning of Set 1 smoothly on filter change
                    const el = scrollContainerRef.current;
                    if (el) {
                      const oneSet = calculateOneSetWidth();
                      scrollXRef.current = oneSet > 0 ? oneSet : 0;
                      el.scrollTo({ left: scrollXRef.current, behavior: 'smooth' });
                    }
                  }}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                    selectedFilter === tab.key
                      ? 'bg-white/15 text-white font-bold border border-white/25 shadow-sm'
                      : 'bg-[#0D1115] text-zinc-400 border border-white/[0.08] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Carousel Control Buttons */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={() => {
                  studioAudio.playClick(1000);
                  setIsAutoPlaying((prev) => !prev);
                }}
                title={isAutoPlaying ? 'Pause Horizontal Motion' : 'Resume Horizontal Motion'}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-zinc-300" />
                    <span className="hidden md:inline text-[11px] font-semibold">PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                    <span className="hidden md:inline text-[11px] font-semibold text-emerald-400">PLAY</span>
                  </>
                )}
              </button>

              {/* Prev Button */}
              <button
                onClick={handleScrollPrev}
                aria-label="Scroll gallery left"
                className="rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 p-2 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleScrollNext}
                aria-label="Scroll gallery right"
                className="rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 p-2 text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL MOVING TRACK VIEWPORT */}
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          isDraggingRef.current = false;
          isUserInteractingRef.current = false;
        }}
      >
        {/* Soft edge gradient fades for luxury cinema finish */}
        <div className="gallery-edge-fade-left pointer-events-none absolute top-0 bottom-0 left-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[#050607] to-transparent z-20" />
        <div className="gallery-edge-fade-right pointer-events-none absolute top-0 bottom-0 right-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[#050607] to-transparent z-20" />

        {/* Scrollable Moving Track with Pointer Drag & Touch support */}
        <div
          ref={scrollContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onScroll={handleScroll}
          className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none px-6 sm:px-12 lg:px-16 py-4 cursor-grab active:cursor-grabbing select-none touch-pan-x"
          style={{
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {displayItems.map((project, index) => {
            const isFutureCard = project.isFutureCard;

            return (
              <div
                key={`${project.id}-${index}`}
                data-cursor="view"
                onClick={() => {
                  if (hasDraggedRef.current) return;
                  studioAudio.playClick(1000);
                  if (isFutureCard) {
                    onNavigate('contact');
                  } else {
                    onSelectProject(project);
                  }
                }}
                className="gallery-card-item group relative w-[320px] sm:w-[390px] lg:w-[440px] shrink-0 rounded-2xl border border-white/10 bg-[#090D12] overflow-hidden hover:border-white/30 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Media Viewport */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('unsplash')) {
                          target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80';
                        }
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                    />

                    {/* Calibrated Scrim Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090D12] via-[#090D12]/20 to-transparent opacity-85 pointer-events-none" />

                    {/* Top Status Tags */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-black/80 px-2.5 py-1 font-mono text-[10px] sm:text-[11px] text-zinc-200 border border-white/10 uppercase tracking-wider backdrop-blur-md font-semibold">
                        {project.category}
                      </span>

                      {project.metrics && project.metrics[0] && (
                        <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-3 py-1 font-mono text-[10px] sm:text-[11px] text-zinc-200 backdrop-blur-md">
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                          <span>{project.metrics[0].value}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-tight leading-snug group-hover:text-zinc-200 transition-colors">
                      {project.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Highlights */}
                    {project.engineeringStack && project.engineeringStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.engineeringStack.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-300 group-hover:text-white uppercase tracking-wider transition-colors">
                    <span>{isFutureCard ? 'Reserve Slot' : 'Explore Case Study'}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>

                  {project.liveUrl && !isFutureCard && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Live</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRACK CONTROLS & BOTTOM CONVERSION RAIL */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10 mt-8">
        {/* Progress Scrubber Bar */}
        <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden mb-8">
          <div
            ref={progressBarRef}
            className="h-full bg-white/40 transition-all duration-75 rounded-full"
            style={{ width: '12%' }}
          />
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="font-display text-base sm:text-lg font-bold text-white uppercase tracking-tight">
              Looking for a custom digital experience?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-0.5">
              Drag, swipe or hover to inspect details, or explore our full archive of case studies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                studioAudio.playClick(900);
                onNavigate('work');
              }}
              className="rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 font-mono text-xs font-semibold text-white uppercase tracking-wider transition-all cursor-pointer"
            >
              Browse Full Archive
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(1000);
                onNavigate('contact');
              }}
              className="cta-image-btn rounded-lg px-6 py-2.5 font-mono text-xs font-bold text-white uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
