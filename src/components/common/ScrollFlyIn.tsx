import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollFlyInProps {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  distance?: number;
  scaleInitial?: number;
  rotateXInitial?: number;
  duration?: number;
  triggerStart?: string;
  blur?: boolean;
}

export const ScrollFlyIn: React.FC<ScrollFlyInProps> = ({
  children,
  delay = 0,
  stagger = 0,
  direction = 'up',
  className = '',
  distance = 45,
  scaleInitial = 0.98,
  rotateXInitial = 4,
  duration = 0.85,
  triggerStart = 'top 88%',
  blur = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, filter: 'none' });
      return;
    }

    const getInitialOffset = () => {
      switch (direction) {
        case 'up':
          return { y: distance, x: 0 };
        case 'down':
          return { y: -distance, x: 0 };
        case 'left':
          return { x: distance, y: 0 };
        case 'right':
          return { x: -distance, y: 0 };
        default:
          return { y: distance, x: 0 };
      }
    };

    const offset = getInitialOffset();

    const ctx = gsap.context(() => {
      // If stagger is requested and element has multiple direct children
      if (stagger > 0 && el.children.length > 1) {
        gsap.set(el.children, {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: scaleInitial,
          rotateX: rotateXInitial,
          filter: blur ? 'blur(6px)' : 'none',
          transformOrigin: '50% 50%',
        });

        gsap.to(el.children, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            once: true,
          },
        });
      } else {
        // Animate single container
        gsap.set(el, {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: scaleInitial,
          rotateX: rotateXInitial,
          filter: blur ? 'blur(6px)' : 'none',
          transformOrigin: '50% 50%',
        });

        gsap.to(el, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            once: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, direction, distance, scaleInitial, rotateXInitial, duration, triggerStart, blur]);

  return (
    <div
      ref={containerRef}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
