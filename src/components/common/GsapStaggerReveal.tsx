import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface GsapStaggerRevealProps {
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'header' | 'footer' | 'nav';
  stagger?: number;
  delay?: number;
  yOffset?: number;
  xOffset?: number;
  duration?: number;
  ease?: string;
  selector?: string; // e.g. '> *', '.reveal-item', 'p, h2, h3, button, .card'
  triggerStart?: string;
  once?: boolean;
  blur?: boolean;
  scaleInitial?: number;
  className?: string;
  id?: string;
}

export const GsapStaggerReveal: React.FC<GsapStaggerRevealProps> = ({
  children,
  as = 'div',
  stagger = 0.09,
  delay = 0,
  yOffset = 36,
  xOffset = 0,
  duration = 0.85,
  ease = 'power3.out',
  selector = '> *',
  triggerStart = 'top 88%',
  once = true,
  blur = true,
  scaleInitial = 0.98,
  className = '',
  id,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const Component = as;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const targets = selector === '> *' ? el.children : el.querySelectorAll(selector);
      gsap.set(targets, { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none' });
      return;
    }

    const ctx = gsap.context(() => {
      // Find items to animate
      const targets = selector === '> *' ? el.children : el.querySelectorAll(selector);
      if (!targets.length) return;

      // Set initial state
      gsap.set(targets, {
        y: yOffset,
        x: xOffset,
        opacity: 0,
        scale: scaleInitial,
        filter: blur ? 'blur(6px)' : 'none',
        willChange: 'transform, opacity, filter',
      });

      // Stagger reveal animation triggered by ScrollTrigger
      gsap.to(targets, {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration,
        stagger,
        delay,
        ease,
        clearProps: 'willChange',
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          once,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, yOffset, xOffset, duration, ease, selector, triggerStart, once, blur, scaleInitial]);

  return (
    <Component ref={containerRef as any} id={id} className={className}>
      {children}
    </Component>
  );
};
