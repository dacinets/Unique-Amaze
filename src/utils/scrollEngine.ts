import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export interface ScrollEngineState {
  lenis: Lenis | null;
  scrollY: number;
  scrollProgress: number;
  progress: number;
  velocity: number;
  direction: number;
  isReducedMotion: boolean;
}

type ScrollListener = (state: ScrollEngineState) => void;

class ScrollEngine {
  private lenis: Lenis | null = null;
  private listeners: Set<ScrollListener> = new Set();
  private state: ScrollEngineState = {
    lenis: null,
    scrollY: 0,
    scrollProgress: 0,
    progress: 0,
    velocity: 0,
    direction: 1,
    isReducedMotion: false,
  };
  private isInitialized = false;

  public init(): Lenis | null {
    if (typeof window === 'undefined') return null;
    if (this.isInitialized && this.lenis) return this.lenis;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.state.isReducedMotion = mediaQuery.matches;

    mediaQuery.addEventListener('change', (e) => {
      this.state.isReducedMotion = e.matches;
      if (e.matches && this.lenis) {
        this.lenis.stop();
      } else if (!e.matches && this.lenis) {
        this.lenis.start();
      }
    });

    if (this.state.isReducedMotion) {
      // Respect accessibility preference: skip smooth inertial scroll
      return null;
    }

    try {
      this.lenis = new Lenis({
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        infinite: false,
      });

      this.state.lenis = this.lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = this.lenis;

      // 1. Synchronize Lenis scroll position with GSAP ScrollTrigger
      this.lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        this.state.scrollY = e.scroll;
        this.state.velocity = e.velocity || 0;
        this.state.direction = e.direction || 1;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const normalized = maxScroll > 0 && typeof e.scroll === 'number' ? Math.max(0, Math.min(1, e.scroll / maxScroll)) : 0;
        this.state.scrollProgress = Number.isFinite(normalized) ? normalized : 0;
        this.state.progress = this.state.scrollProgress;

        // Broadcast to subscribers
        this.listeners.forEach((listener) => {
          try {
            listener(this.state);
          } catch (err) {
            console.error('ScrollEngine listener error:', err);
          }
        });
      });

      // 2. Synchronize Lenis animation frames into GSAP's central ticker
      gsap.ticker.add((time) => {
        if (this.lenis) {
          this.lenis.raf(time * 1000);
        }
      });

      // 3. Disable GSAP lag smoothing to ensure zero frame stutter with Lenis
      gsap.ticker.lagSmoothing(0);

      this.isInitialized = true;
      return this.lenis;
    } catch (err) {
      console.warn('ScrollEngine initialization fallback:', err);
      return null;
    }
  }

  public subscribe(listener: ScrollListener): () => void {
    this.listeners.add(listener);
    // Send immediate initial state
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): ScrollEngineState {
    return this.state;
  }

  public getLenis(): Lenis | null {
    return this.lenis;
  }

  public scrollTo(
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number; immediate?: boolean }
  ) {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: options?.offset ?? -50,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.getElementById(target.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    }
  }

  public refresh() {
    ScrollTrigger.refresh();
  }

  public destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    }
    this.listeners.clear();
    this.isInitialized = false;
  }
}

export const scrollEngine = new ScrollEngine();
