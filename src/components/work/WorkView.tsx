import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, ProjectCard } from '../../types';
import { PROJECTS_DATA, LOGO_DATA_URI } from '../../data/uniqueAmazeData';
import { CaseStudyModal } from './CaseStudyModal';
import { BrandDivider } from '../common/BrandDivider';
import { ProgressiveImage } from '../common/ProgressiveImage';
import { studioAudio } from '../../utils/audio';
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  RotateCw,
  Layers,
  LayoutGrid,
  Maximize2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  CheckCircle2,
  TrendingUp,
  Globe
} from 'lucide-react';

interface WorkViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const WorkView: React.FC<WorkViewProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);
  const [activeAccordionId, setActiveAccordionId] = useState<string>(PROJECTS_DATA[0].id);
  const [viewMode, setViewMode] = useState<'accordion' | 'grid'>('accordion');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentSnappedIndex, setCurrentSnappedIndex] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const startScrollLeftRef = useRef<number>(0);
  const pointerHistoryRef = useRef<Array<{ x: number; time: number }>>([]);
  const animFrameRef = useRef<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Flagships' },
    { id: 'music', label: 'Music & Culture' },
    { id: 'wellness', label: 'Wellness & Clinics' },
    { id: 'product', label: 'Product & Brand' },
    { id: 'community', label: 'Community & Faith' },
    { id: 'lab', label: 'Concept Lab' },
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'music')
      return p.category.toLowerCase().includes('music') || p.category.toLowerCase().includes('culture');
    if (activeCategory === 'wellness') return p.category.toLowerCase().includes('wellness');
    if (activeCategory === 'product')
      return p.category.toLowerCase().includes('product') || p.category.toLowerCase().includes('brand');
    if (activeCategory === 'community')
      return p.category.toLowerCase().includes('church') || p.category.toLowerCase().includes('presence');
    if (activeCategory === 'lab')
      return p.category.toLowerCase().includes('lab') || p.category.toLowerCase().includes('ai');
    return true;
  });

  // Ensure active accordion item is always valid inside filtered set
  const currentActiveProject =
    filteredProjects.find((p) => p.id === activeAccordionId) || filteredProjects[0] || PROJECTS_DATA[0];

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    studioAudio.playClick(900);
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Stop any active inertia or snapping animations
  const stopPhysicsAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Update progress indicator based on scroll position
  const updateScrollProgress = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (el.scrollLeft / maxScroll) * 100));
      setScrollProgress(pct);
    }
  }, []);

  // Calculate snap target positions for each project card
  const getCardSnapPositions = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return [];
    const containerRect = el.getBoundingClientRect();
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 16;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-project-id]'));
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

    return cards.map((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const relativeLeft = cardRect.left - containerRect.left + el.scrollLeft - padLeft;
      return {
        id: card.dataset.projectId || '',
        index,
        targetScroll: Math.max(0, Math.min(maxScroll, relativeLeft)),
      };
    });
  }, []);

  // Smoothly snap to target scroll position with cushioned quintic ease-out
  const snapToTarget = useCallback(
    (targetScroll: number, onComplete?: () => void) => {
      const el = scrollContainerRef.current;
      if (!el) return;

      stopPhysicsAnimation();

      const startPos = el.scrollLeft;
      const delta = targetScroll - startPos;
      if (Math.abs(delta) < 1) {
        el.scrollLeft = targetScroll;
        updateScrollProgress();
        onComplete?.();
        return;
      }

      const duration = Math.min(420, Math.max(220, Math.abs(delta) * 0.5));
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Quintic ease out for a silky, cushioned tactile settle
        const ease = 1 - Math.pow(1 - progress, 4);

        el.scrollLeft = startPos + delta * ease;
        updateScrollProgress();

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          el.scrollLeft = targetScroll;
          updateScrollProgress();
          animFrameRef.current = null;
          onComplete?.();
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [stopPhysicsAnimation, updateScrollProgress]
  );

  // Snap to nearest item based on current position and momentum direction bias
  const snapToNearestCard = useCallback(
    (directionBias: number = 0) => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const snapPoints = getCardSnapPositions();
      if (snapPoints.length === 0) return;

      const currentScroll = el.scrollLeft;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

      if (currentScroll <= 2) {
        snapToTarget(0, () => setCurrentSnappedIndex(0));
        return;
      }
      if (currentScroll >= maxScroll - 2) {
        snapToTarget(maxScroll, () => setCurrentSnappedIndex(snapPoints.length - 1));
        return;
      }

      const biasedPos = currentScroll + directionBias;

      let closest = snapPoints[0];
      let minDiff = Math.abs(snapPoints[0].targetScroll - biasedPos);

      for (let i = 1; i < snapPoints.length; i++) {
        const diff = Math.abs(snapPoints[i].targetScroll - biasedPos);
        if (diff < minDiff) {
          minDiff = diff;
          closest = snapPoints[i];
        }
      }

      snapToTarget(closest.targetScroll, () => {
        setCurrentSnappedIndex(closest.index);
      });
    },
    [getCardSnapPositions, snapToTarget]
  );

  // Inertial deceleration physics loop
  const startInertialScroll = useCallback(
    (initialVelocity: number) => {
      const el = scrollContainerRef.current;
      if (!el) return;

      stopPhysicsAnimation();

      let v = initialVelocity; // in px per ms
      let lastTime = performance.now();
      const friction = 0.94; // friction decay coefficient per 16ms
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

      const step = (now: number) => {
        const dt = Math.min(32, Math.max(8, now - lastTime));
        lastTime = now;

        // Apply velocity displacement
        el.scrollLeft += v * dt;
        updateScrollProgress();

        // Boundary safety check
        if (el.scrollLeft <= 0) {
          el.scrollLeft = 0;
          animFrameRef.current = null;
          snapToTarget(0, () => setCurrentSnappedIndex(0));
          return;
        }
        if (el.scrollLeft >= maxScroll) {
          el.scrollLeft = maxScroll;
          animFrameRef.current = null;
          snapToTarget(maxScroll, () => setCurrentSnappedIndex(filteredProjects.length - 1));
          return;
        }

        // Decay velocity via exponential friction
        v *= Math.pow(friction, dt / 16);

        // When velocity drops below threshold, seamlessly transition into magnetic snap
        if (Math.abs(v) < 0.12) {
          animFrameRef.current = null;
          // Directional bias in px: flinging forward nudges snap toward next card
          const bias = v * 140;
          snapToNearestCard(bias);
          return;
        }

        animFrameRef.current = requestAnimationFrame(step);
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [stopPhysicsAnimation, snapToNearestCard, snapToTarget, updateScrollProgress, filteredProjects.length]
  );

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Pointer Drag-to-Scroll Handlers (Unified for Mouse and Touch with velocity tracking)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only track primary left click or touch
    const el = scrollContainerRef.current;
    if (!el) return;

    // Halt any active inertia or snapping instantly when user touches rail
    stopPhysicsAnimation();

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollLeftRef.current = el.scrollLeft;

    const now = performance.now();
    pointerHistoryRef.current = [{ x: e.clientX, time: now }];
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // Distinguish intentional horizontal drag from vertical page scroll
    if (!hasDraggedRef.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 7) {
        // User is scrolling the page vertically; release drag
        isDraggingRef.current = false;
        return;
      }
      if (Math.abs(dx) > 6) {
        hasDraggedRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }
    }

    if (!hasDraggedRef.current) return;

    // Record recent pointer coordinates for accurate release velocity
    const now = performance.now();
    pointerHistoryRef.current.push({ x: e.clientX, time: now });
    // Keep trailing 100ms window
    pointerHistoryRef.current = pointerHistoryRef.current.filter((p) => now - p.time <= 100);

    el.scrollLeft = startScrollLeftRef.current - dx;
    updateScrollProgress();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }

    if (!hasDraggedRef.current) {
      return;
    }

    // Calculate release velocity from pointer history window
    const history = pointerHistoryRef.current;
    let releaseVelocity = 0;
    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = last.time - first.time;
      if (dt > 10) {
        const dx = last.x - first.x;
        // dx > 0 means pulled right (scrollLeft should decrease), dx < 0 means pulled left (scrollLeft should increase)
        releaseVelocity = -dx / dt; // in px/ms
      }
    }

    // If user flicked with momentum, execute inertial deceleration then snap
    if (Math.abs(releaseVelocity) > 0.14) {
      startInertialScroll(releaseVelocity);
    } else {
      // Gentle drag release: directly snap to closest card
      snapToNearestCard(0);
    }
  };

  // Navigation Arrow Controls: Snap cleanly to prev / next card
  const handleScrollPrev = () => {
    studioAudio.playClick(850);
    const el = scrollContainerRef.current;
    if (!el) return;

    stopPhysicsAnimation();
    const snapPoints = getCardSnapPositions();
    if (snapPoints.length === 0) return;

    const currentScroll = el.scrollLeft;
    // Find highest snap target that is less than currentScroll - 24
    const prevPoints = snapPoints.filter((p) => p.targetScroll < currentScroll - 24);
    if (prevPoints.length > 0) {
      const target = prevPoints[prevPoints.length - 1];
      snapToTarget(target.targetScroll, () => setCurrentSnappedIndex(target.index));
    } else {
      snapToTarget(0, () => setCurrentSnappedIndex(0));
    }
  };

  const handleScrollNext = () => {
    studioAudio.playClick(950);
    const el = scrollContainerRef.current;
    if (!el) return;

    stopPhysicsAnimation();
    const snapPoints = getCardSnapPositions();
    if (snapPoints.length === 0) return;

    const currentScroll = el.scrollLeft;
    // Find lowest snap target that is greater than currentScroll + 24
    const nextPoints = snapPoints.filter((p) => p.targetScroll > currentScroll + 24);
    if (nextPoints.length > 0) {
      const target = nextPoints[0];
      snapToTarget(target.targetScroll, () => setCurrentSnappedIndex(target.index));
    } else {
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      snapToTarget(maxScroll, () => setCurrentSnappedIndex(snapPoints.length - 1));
    }
  };

  // Card click with drag discrimination
  const handleCardClick = (project: ProjectCard) => {
    if (hasDraggedRef.current) return;
    studioAudio.playClick(950);
    setActiveAccordionId(project.id);

    // Smoothly scroll the activated card into clear view
    const el = scrollContainerRef.current;
    if (el) {
      const cardEl = el.querySelector<HTMLElement>(`[data-project-id="${project.id}"]`);
      if (cardEl) {
        const containerLeft = el.getBoundingClientRect().left;
        const cardLeft = cardEl.getBoundingClientRect().left;
        const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 16;
        const targetScroll = el.scrollLeft + (cardLeft - containerLeft) - padLeft;
        snapToTarget(Math.max(0, targetScroll));
      }
    }
  };

  return (
    <div className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32">
      {/* Header & Sub-header (Titles in UPPERCASE, not as bold as landing page) */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Selected Portfolio</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            Every project begins as a spark. <br className="hidden sm:inline" />
            <span className="text-zinc-400">Then we shape it into an experience.</span>
          </h1>

          <p className="mt-8 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Explore our curated flagship portfolio. Interactive digital systems engineered for high-intent client conversion, sub-second speed, and authoritative presence.
          </p>
        </div>

        {/* Filter Controls & Layout Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 sm:mt-14 sm:pt-10 border-t border-white/[0.08]">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-[#64748B] mr-1 uppercase">Filter:</span>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  studioAudio.playClick(800);
                  setActiveCategory(c.id);
                  const firstMatching = PROJECTS_DATA.find((p) => {
                    if (c.id === 'all') return true;
                    if (c.id === 'music')
                      return p.category.toLowerCase().includes('music') || p.category.toLowerCase().includes('culture');
                    if (c.id === 'wellness') return p.category.toLowerCase().includes('wellness');
                    if (c.id === 'product')
                      return p.category.toLowerCase().includes('product') || p.category.toLowerCase().includes('brand');
                    if (c.id === 'community')
                      return p.category.toLowerCase().includes('church') || p.category.toLowerCase().includes('presence');
                    if (c.id === 'lab')
                      return p.category.toLowerCase().includes('lab') || p.category.toLowerCase().includes('ai');
                    return true;
                  });
                  if (firstMatching) {
                    setActiveAccordionId(firstMatching.id);
                  }
                }}
                className={`rounded-md px-3.5 py-1.5 font-mono text-xs transition-all uppercase ${
                  activeCategory === c.id
                    ? 'bg-white/10 text-white font-bold border border-white/20 shadow-sm'
                    : 'border border-white/10 bg-[#0E1217] text-[#94A3B8] hover:border-white/20 hover:text-[#EBECF0]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Interactive Accordion vs Grid Deck */}
          <div className="flex items-center gap-1 rounded-md border border-white/10 bg-[#0C1014] p-1 font-mono text-xs">
            <button
              onClick={() => {
                studioAudio.playClick(850);
                setViewMode('accordion');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all uppercase ${
                viewMode === 'accordion'
                  ? 'bg-white/10 text-white font-bold border border-white/20 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#EBECF0]'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>HORIZONTAL GALLERY</span>
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(850);
                setViewMode('grid');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all uppercase ${
                viewMode === 'grid'
                  ? 'bg-white/10 text-white font-bold border border-white/20 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#EBECF0]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>GRID VIEW</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Portfolio Viewport */}
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 1. HORIZONTAL DRAG-TO-SCROLL PORTFOLIO GALLERY (MAINTAINS HORIZONTAL LAYOUT ON ALL SCREENS) */}
        {/* ========================================================================= */}
        {viewMode === 'accordion' && (
          <div className="space-y-6">
            {/* Top Navigation & Drag Controls Dock */}
            <div className="flex items-center justify-between px-2 sm:px-4">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-zinc-400 uppercase tracking-widest"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Drag or swipe to explore flagships</span>
                <motion.span
                  animate={{ x: [0, 4, 0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                  className="hidden sm:inline-flex items-center text-emerald-400"
                >
                  <MoveHorizontal className="h-3.5 w-3.5 ml-1" />
                </motion.span>
              </motion.div>

              {/* Prev / Next Scroll Buttons & Tactile Counter */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 mr-1">
                  <span className="text-white font-bold">{Math.min(filteredProjects.length, currentSnappedIndex + 1)}</span>
                  <span className="text-zinc-500">/</span>
                  <span>{filteredProjects.length}</span>
                </div>
                <button
                  onClick={handleScrollPrev}
                  aria-label="Scroll gallery backward"
                  className="rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 active:scale-95 p-2 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleScrollNext}
                  aria-label="Scroll gallery forward"
                  className="rounded-lg border border-white/15 bg-white/5 hover:bg-white/15 active:scale-95 p-2 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Moving Stage with Pointer & Touch Drag */}
            <div className="relative w-full overflow-hidden">
              {/* Luxury edge gradient fades */}
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-6 sm:w-12 bg-gradient-to-r from-[#050607] to-transparent z-20" />
              <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-6 sm:w-12 bg-gradient-to-l from-[#050607] to-transparent z-20" />

              {/* Horizontal Scrollable Rail with Inertia and Magnetic Snap */}
              <div
                ref={scrollContainerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onScroll={updateScrollProgress}
                className={`flex flex-row items-stretch gap-3 sm:gap-5 overflow-x-auto scrollbar-none py-3 px-3 sm:px-6 select-none touch-pan-y min-h-[540px] sm:min-h-[590px] transition-[cursor] ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  scrollBehavior: 'auto',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {filteredProjects.map((project, index) => {
                  const isActive = project.id === currentActiveProject.id;

                  if (isActive) {
                    // EXPANDED PANORAMIC CARD WITH FRAMER MOTION HORIZONTAL ENTRY
                    return (
                      <motion.div
                        key={`${project.id}-${activeCategory}`}
                        data-project-id={project.id}
                        data-cursor="open"
                        initial={{ opacity: 0, x: 48, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                          duration: 0.48,
                          delay: Math.min(index * 0.06, 0.35),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{ y: -3 }}
                        onClick={(e) => {
                          if (hasDraggedRef.current) return;
                          const target = e.target as HTMLElement;
                          if (target.closest('button') || target.closest('a')) return;
                          studioAudio.playClick(1000);
                          setSelectedProject(project);
                        }}
                        className="work-expanded-card relative w-[85vw] max-w-[340px] sm:max-w-none sm:w-[520px] lg:w-[660px] xl:w-[720px] shrink-0 rounded-2xl overflow-hidden border border-slate-700/60 bg-[#0B1117] shadow-2xl transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer group/card"
                      >
                        {/* Background Image with Dark Atmospheric Gradient */}
                        <div className="absolute inset-0 z-0">
                          <ProgressiveImage
                            src={project.image}
                            alt={project.title}
                            aspectRatio="auto"
                            className="h-full w-full"
                            overlayScrim="editorial"
                            imageClassName="brightness-[0.38] contrast-[1.08] pointer-events-none group-hover/card:scale-105 transition-transform duration-700 ease-out"
                          />
                        </div>

                        {/* Top Header Strip inside Card */}
                        <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between border-b border-slate-700/40 bg-gradient-to-b from-[#0B1117]/90 to-transparent">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-3 py-1 font-mono text-[11px] sm:text-xs uppercase tracking-widest text-slate-200 font-semibold border border-slate-700/60 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span>{project.category}</span>
                          </span>

                          <span className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                            Active Flagship
                          </span>
                        </div>

                        {/* Center Content Body */}
                        <div className="relative z-10 p-5 sm:p-8 lg:p-10 max-w-2xl space-y-4 sm:space-y-6">
                          <h2 className="font-display text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight text-slate-100 uppercase leading-[1.12]">
                            {project.title}
                          </h2>

                          <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>

                          {/* Metrics Bar */}
                          {project.metrics && project.metrics.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
                              {project.metrics.slice(0, 3).map((m, i) => (
                                <div
                                  key={i}
                                  className="rounded-lg bg-slate-900/80 border border-slate-700/50 px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-xs shadow-sm backdrop-blur-md"
                                >
                                  <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-semibold">
                                    {m.label}
                                  </span>
                                  <span className="text-slate-100 font-bold text-xs sm:text-sm">{m.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-3 pt-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasDraggedRef.current) return;
                                studioAudio.playClick(1100);
                                setSelectedProject(project);
                              }}
                              className="cta-image-btn flex items-center gap-2 rounded-lg px-5 py-3 font-mono text-xs font-bold text-white shadow-md transition-all uppercase hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                              <span className="relative z-10">EXPLORE CASE STUDY</span>
                              <ArrowRight className="relative z-10 h-4 w-4" />
                            </button>

                            {project.liveUrl && project.liveUrl.startsWith('http') && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                onClick={(e) => {
                                  if (hasDraggedRef.current) e.preventDefault();
                                }}
                                className="cta-secondary-btn flex items-center gap-2 rounded-lg border px-4 py-3 font-mono text-xs font-semibold transition-all uppercase hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                              >
                                <span>LIVE SITE</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // COMPANION / COLLAPSED CARD WITH FRAMER MOTION HORIZONTAL ENTRY
                  return (
                    <motion.div
                      key={`${project.id}-${activeCategory}`}
                      data-project-id={project.id}
                      initial={{ opacity: 0, x: 38, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        duration: 0.44,
                        delay: Math.min(index * 0.06, 0.35),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCardClick(project)}
                      className="group relative w-[160px] sm:w-[200px] lg:w-[220px] shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0E13] hover:border-white/30 transition-all duration-300 flex flex-col justify-between p-4 sm:p-5 cursor-pointer shadow-lg hover:shadow-2xl"
                      title={`Expand ${project.title}`}
                    >
                      {/* Background Thumbnail Image with subtle hover zoom */}
                      <div className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity">
                        <img
                          src={project.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E13] via-[#0A0E13]/60 to-transparent" />
                      </div>

                      {/* Top Header Strip */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="h-2 w-2 rounded-full bg-zinc-500 group-hover:bg-emerald-400 transition-colors" />
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest truncate max-w-[120px]">
                          {project.category}
                        </span>
                      </div>

                      {/* Middle Body */}
                      <div className="relative z-10 my-auto py-6">
                        <h3 className="font-display text-base sm:text-lg font-bold text-white uppercase tracking-tight group-hover:text-emerald-300 transition-colors leading-snug">
                          {project.title}
                        </h3>

                        {project.metrics && project.metrics[0] && (
                          <div className="mt-3 font-mono text-[10px] sm:text-[11px] text-zinc-300 bg-black/60 rounded px-2 py-1 inline-block border border-white/10 backdrop-blur-md">
                            {project.metrics[0].value}
                          </div>
                        )}
                      </div>

                      {/* Bottom Expand Prompt */}
                      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[11px] text-zinc-400 group-hover:text-white transition-colors">
                        <span>EXPAND</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Progress Scrubber Bar with Click-to-Snap */}
            <div
              onClick={(e) => {
                const bar = e.currentTarget;
                const rect = bar.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const snapPoints = getCardSnapPositions();
                if (snapPoints.length > 0) {
                  const targetIdx = Math.min(
                    snapPoints.length - 1,
                    Math.floor(ratio * snapPoints.length)
                  );
                  snapToTarget(snapPoints[targetIdx].targetScroll, () =>
                    setCurrentSnappedIndex(targetIdx)
                  );
                }
              }}
              role="slider"
              aria-label="Gallery navigation scrubber"
              aria-valuenow={Math.round(scrollProgress)}
              className="w-full bg-white/[0.08] hover:bg-white/[0.14] transition-colors rounded-full h-1.5 overflow-hidden px-1 cursor-pointer py-0.5 group"
              title="Click scrubber to jump between flagships"
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-400/80 via-white/70 to-emerald-400/80 transition-all duration-150 rounded-full group-hover:brightness-110"
                style={{ width: `${Math.max(12, scrollProgress)}%` }}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. GRID DECK VIEW (Alternative Classical Multi-Column Layout)             */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProjects.map((project, idx) => {
              const isFlipped = !!flippedCards[project.id];
              const cardGlass =
                project.category.toLowerCase().includes('wellness')
                  ? 'glass-smoke'
                  : project.category.toLowerCase().includes('product')
                  ? 'glass-slate'
                  : project.category.toLowerCase().includes('church') || project.category.toLowerCase().includes('presence')
                  ? 'glass-violet'
                  : idx === 0
                  ? 'glass-dominant'
                  : 'glass-smoke';

              return (
                <div
                  key={project.id}
                  data-cursor="card"
                  onClick={() => {
                    if (!project.isFutureCard) {
                      studioAudio.playClick(1000);
                      setSelectedProject(project);
                    } else {
                      onNavigate('contact');
                    }
                  }}
                  className={`group relative rounded-xl border border-white/10 ${cardGlass} overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-xl cursor-pointer flex flex-col justify-between`}
                  style={{ perspective: '1200px' }}
                >
                  {/* 3D Flip Container */}
                  <div
                    className={`w-full transition-transform duration-500 transform-gpu ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* FRONT FACE */}
                    <div className="relative w-full [backface-visibility:hidden]">
                      <div className="relative w-full overflow-hidden bg-[#0A0D10]">
                        <ProgressiveImage
                          src={project.image}
                          alt={project.title}
                          aspectRatio="16/10"
                          overlayScrim="bottom"
                        />

                        <div className="absolute top-3 inset-x-3 flex justify-between items-center z-30 pointer-events-auto">
                          <span className="rounded bg-[#050607]/80 px-3 py-1 font-mono text-[10px] text-zinc-300 border border-white/10 backdrop-blur-md font-semibold">
                            {project.category}
                          </span>

                          <button
                            onClick={(e) => toggleFlip(project.id, e)}
                            className="flex items-center gap-1 rounded bg-[#050607]/80 px-2.5 py-1 font-mono text-[10px] text-zinc-300 border border-white/10 hover:border-white/30 hover:text-white transition-colors"
                            title="Flip card"
                          >
                            <RotateCw className="h-3 w-3" />
                            <span>FLIP</span>
                          </button>
                        </div>

                        {project.metrics && project.metrics[0] && (
                          <div className="absolute bottom-3 left-3 rounded bg-[#050607]/90 px-2.5 py-1 font-mono text-[11px] text-zinc-300 border border-white/10 z-30">
                            {project.metrics[0].label}: <b className="text-[#EBECF0]">{project.metrics[0].value}</b>
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-8 space-y-3">
                        <h3 className="font-display text-lg sm:text-xl font-semibold text-[#EBECF0] group-hover:text-white transition-colors uppercase tracking-wide">
                          {project.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="pt-4 flex items-center justify-between font-mono text-xs">
                          <span className="flex items-center gap-1 uppercase font-semibold text-zinc-300 group-hover:text-white transition-colors">
                            {project.isFutureCard ? 'RESERVE THIS SLOT' : 'EXPLORE CASE STUDY'}
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>

                          {project.liveUrl && project.liveUrl.startsWith('http') && (
                            <span className="text-[#94A3B8] hover:text-[#EBECF0] flex items-center gap-1 text-[11px]">
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="absolute inset-0 w-full h-full p-8 rounded-xl glass-dominant border border-white/20 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="h-10 w-10 overflow-hidden rounded border border-white/10 bg-[#0C1014] p-1">
                          <img
                            src={LOGO_DATA_URI}
                            alt="Unique Amaze"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <button
                          onClick={(e) => toggleFlip(project.id, e)}
                          className="flex items-center gap-1 rounded bg-[#050607]/80 px-2.5 py-1 font-mono text-[10px] text-zinc-400 border border-white/10 hover:border-white/30 hover:text-white"
                        >
                          <RotateCw className="h-3 w-3" />
                          <span>FLIP BACK</span>
                        </button>
                      </div>

                      <div className="space-y-2 text-center py-4">
                        <div className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wide">
                          UNIQUE AMAZE
                        </div>
                        <div className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
                          {project.title}
                        </div>
                        <p className="font-sans text-xs text-[#94A3B8] leading-relaxed pt-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Subtle Horizontal Divider: Portfolio to Conversion Banner */}
        <BrandDivider
          variant="minimal"
          width="container"
          spacing="xl"
        />

        {/* Conversion Action Banner with Architectural Image Background */}
        <div className="cta-image-container group rounded-xl border border-white/10 p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80"
            alt="Unique Amaze Modern Architecture Space"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Adaptive Contrast Scrim */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="relative z-10 max-w-xl">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-2 font-semibold">
              Ready to elevate your presence?
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
              LET’S ARCHITECT YOUR DIGITAL PRESENCE FROM THE GROUND UP.
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#94A3B8] font-sans leading-relaxed">
              Every project is individually crafted with high-intent UX, sub-second performance, and quiet conversational AI.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => {
                studioAudio.playClick(950);
                onNavigate('planner');
              }}
              className="cta-image-btn group/btn relative overflow-hidden rounded-lg px-6 py-3.5 font-mono text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="relative z-10 h-4 w-4 text-white" />
              <span className="relative z-10 text-white">PROJECT PLANNER</span>
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(800);
                onNavigate('contact');
              }}
              className="cta-secondary-btn rounded-lg border px-6 py-3.5 font-mono text-xs font-bold transition-all uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
            >
              SCHEDULE A CALL
            </button>
          </div>
        </div>
      </div>

      {/* Case Study Modal Detail View */}
      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
