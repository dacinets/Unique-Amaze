import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children?: string;
  text?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p' | 'span';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'p' | 'span';
  mode?: 'words' | 'lines' | 'chars' | 'mask';
  split?: 'words' | 'lines' | 'chars' | 'mask';
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  blurReveal?: boolean;
}

export const RevealText: React.FC<RevealTextProps> = ({
  children,
  text,
  as,
  tag,
  mode,
  split,
  className = '',
  delay = 0,
  duration = 0.85,
  stagger = 0.04,
  triggerOnScroll = true,
  blurReveal = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const Component = as || tag || 'h2';
  const effectiveMode = mode || split || 'words';
  const rawContent = (children !== undefined && children !== null) ? children : (text || '');

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !rawContent) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Just reveal immediately without motion
      gsap.set(el.querySelectorAll('.reveal-unit'), { opacity: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    const targets = el.querySelectorAll('.reveal-unit');
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(targets, {
        y: '105%',
        opacity: 0,
        filter: blurReveal ? 'blur(8px)' : 'none',
        rotateX: effectiveMode === 'chars' ? -35 : -15,
        transformOrigin: '0% 50% -30px',
      });

      const tl = gsap.timeline({
        scrollTrigger: triggerOnScroll
          ? {
              trigger: el,
              start: 'top 88%',
              once: true,
            }
          : undefined,
        delay,
      });

      tl.to(targets, {
        y: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        rotateX: 0,
        duration,
        stagger,
        ease: 'power3.out',
      });
    }, el);

    return () => ctx.revert();
  }, [effectiveMode, delay, duration, stagger, triggerOnScroll, blurReveal, rawContent]);

  if (!rawContent) {
    return null;
  }

  // Render tokens based on mode
  if (effectiveMode === 'words') {
    const words = rawContent.split(' ');
    return (
      <Component
        ref={containerRef as unknown as React.RefObject<HTMLHeadingElement>}
        className={`inline-block overflow-hidden ${className}`}
        style={{ perspective: '1000px' }}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top py-0.5">
            <span className="reveal-unit inline-block will-change-transform">
              {word}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  if (effectiveMode === 'chars') {
    const chars = rawContent.split('');
    return (
      <Component
        ref={containerRef as unknown as React.RefObject<HTMLHeadingElement>}
        className={`inline-block overflow-hidden ${className}`}
        style={{ perspective: '1000px' }}
      >
        {chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden align-top py-0.5">
            <span className="reveal-unit inline-block will-change-transform">
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  // Mask mode: whole block reveals upward from clip-path
  return (
    <Component
      ref={containerRef as unknown as React.RefObject<HTMLHeadingElement>}
      className={`block overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      <span className="reveal-unit block will-change-transform">
        {rawContent}
      </span>
    </Component>
  );
};
