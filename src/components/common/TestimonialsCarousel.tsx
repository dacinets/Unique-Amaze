import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial, MarketType, PageRoute } from '../../types';
import { TESTIMONIALS_DATA } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  CheckCircle2,
  Pause,
  Play,
  Building2,
  MapPin,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface TestimonialsCarouselProps {
  currentMarket?: MarketType;
  onNavigate?: (route: PageRoute) => void;
  className?: string;
  autoPlayInterval?: number;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  currentMarket = 'ca',
  onNavigate,
  className = '',
  autoPlayInterval = 6500,
}) => {
  // Sort or prioritize testimonials based on market if provided
  const testimonials = React.useMemo(() => {
    if (currentMarket === 'mw') {
      const mwItems = TESTIMONIALS_DATA.filter((t) => t.location.toLowerCase().includes('malawi'));
      const otherItems = TESTIMONIALS_DATA.filter((t) => !t.location.toLowerCase().includes('malawi'));
      return [...mwItems, ...otherItems];
    }
    const caItems = TESTIMONIALS_DATA.filter((t) => t.location.toLowerCase().includes('ab') || t.location.toLowerCase().includes('calgary'));
    const otherItems = TESTIMONIALS_DATA.filter((t) => !t.location.toLowerCase().includes('ab') && !t.location.toLowerCase().includes('calgary'));
    return [...caItems, ...otherItems];
  }, [currentMarket]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = testimonials.length;

  const goToNext = useCallback(() => {
    studioAudio.playClick(1000);
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    studioAudio.playClick(900);
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToIndex = (index: number) => {
    if (index === currentIndex) return;
    studioAudio.playClick(950);
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, autoPlayInterval, total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrev();
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diff > minSwipeDistance) {
      goToNext();
    } else if (diff < -minSwipeDistance) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -40 : 40,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <section
      id="section-testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Client Testimonials Carousel"
      className={`relative w-full outline-none focus:ring-1 focus:ring-white/20 select-none ${className}`}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Verified Client Endorsements</span>
              <span className="text-white/20">•</span>
              <span>{currentMarket === 'mw' ? 'Malawi Practice' : 'Canada Practice'}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-wide text-[#EBECF0] uppercase leading-tight">
              Real Experiences. <br className="hidden sm:inline" />
              <span className="text-zinc-400">Measurable Performance.</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-zinc-400 leading-relaxed">
              Every Unique Amaze partnership is built directly between founders and specialists.
              Here is how our digital flagships perform in production.
            </p>
          </div>

          {/* Top Carousel Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Slide Index Counter */}
            <div className="font-mono text-xs text-zinc-400 font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02]">
              <span className="text-white">0{currentIndex + 1}</span>
              <span className="text-zinc-500 mx-1">/</span>
              <span>0{total}</span>
            </div>

            {/* Play / Pause Autoplay Button */}
            <button
              onClick={() => {
                studioAudio.playClick(800);
                setIsPlaying((p) => !p);
              }}
              title={isPlaying ? 'Pause Auto-rotation' : 'Resume Auto-rotation'}
              className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/25 flex items-center justify-center text-zinc-300 hover:text-white transition-all"
              aria-label={isPlaying ? 'Pause carousel rotation' : 'Start carousel rotation'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            {/* Prev Button */}
            <button
              onClick={goToPrev}
              title="Previous Testimonial"
              className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/25 flex items-center justify-center text-zinc-300 hover:text-white transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              title="Next Testimonial"
              className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-white/25 flex items-center justify-center text-zinc-300 hover:text-white transition-all active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Stage Stage Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#090D12] shadow-2xl p-6 sm:p-10 lg:p-12">
          {/* Subtle Ambient Radial Light (Slate Monochromatic) */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-slate-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-slate-400/5 blur-3xl" />

          {/* Autoplay Progress Bar */}
          {isPlaying && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.06] overflow-hidden">
              <div
                key={currentIndex}
                className="h-full bg-slate-400/60"
                style={{
                  animation: `carouselProgress ${autoPlayInterval}ms linear forwards`,
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              />
            </div>
          )}

          {/* Animated Slide Content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative z-10 flex flex-col justify-between min-h-[340px]"
            >
              <div>
                {/* Meta Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Verified Flagship Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-zinc-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold uppercase tracking-wider">{current.verifiedProject || 'Verified Client'}</span>
                    </div>

                    {/* Sector Badge */}
                    {current.sector && (
                      <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[11px] text-zinc-400 uppercase tracking-wider hidden sm:inline-block">
                        {current.sector}
                      </span>
                    )}
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1.5 text-amber-400/90" title="5.0 Verified Rating">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="font-mono text-xs text-zinc-300 ml-1 font-bold">5.0</span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="my-8 sm:my-10 relative">
                  <Quote className="h-10 w-10 sm:h-12 sm:w-12 text-white/5 absolute -top-5 -left-3 sm:-left-6 pointer-events-none" />
                  <p className="font-sans text-lg sm:text-xl lg:text-2xl text-slate-100 font-medium leading-relaxed tracking-[-0.01em]">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Client Attribution Footer Bar */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Client Profile Identity */}
                <div className="flex items-center gap-4">
                  {current.avatarUrl ? (
                    <div className="relative h-13 w-13 rounded-full overflow-hidden border border-white/20 bg-zinc-800 shrink-0">
                      <img
                        src={current.avatarUrl}
                        alt={current.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-13 w-13 rounded-full border border-white/20 bg-white/10 flex items-center justify-center font-mono text-sm font-bold text-white shrink-0">
                      {current.initial}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base sm:text-lg font-bold text-white tracking-tight">
                        {current.name}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-zinc-300">
                      <span className="font-sans font-medium text-zinc-200">{current.role}</span>
                      {current.organization && (
                        <>
                          <span className="text-zinc-500">•</span>
                          <span className="font-sans font-semibold text-zinc-300 flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-zinc-400" />
                            {current.organization}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                      <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
                      <span>{current.location}</span>
                    </div>
                  </div>
                </div>

                {/* Outcome Metric Chip if available */}
                {current.metric && (
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:px-4 sm:py-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                    <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                      {current.metric.label}
                    </div>
                    <div className="font-display text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1 mt-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{current.metric.value}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Selector Strip / Pagination Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {testimonials.map((t, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-left font-mono text-xs ${
                    isActive
                      ? 'border-white/30 bg-white/10 text-white font-bold shadow-sm'
                      : 'border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
                  }`}
                  aria-label={`Jump to testimonial by ${t.name}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-zinc-600 group-hover:bg-zinc-400'}`} />
                  <span className="truncate max-w-[130px] sm:max-w-[160px]">{t.name}</span>
                  {t.organization && (
                    <span className="hidden md:inline text-[10px] text-zinc-500 truncate max-w-[110px]">
                      · {t.organization}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Context Hint */}
          <div className="font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-zinc-400" />
            <span>Direct Founder-to-Specialist Partnerships</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes carouselProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
