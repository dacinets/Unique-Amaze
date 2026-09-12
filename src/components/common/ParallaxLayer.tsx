import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type DepthLevel = 1 | 2 | 3 | 4;

interface ParallaxLayerProps {
  children: React.ReactNode;
  level?: DepthLevel;
  speed?: number; // Custom offset multiplier, defaults derived from level
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  level = 3,
  speed,
  className = '',
  style,
}) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Default rate by depth level:
    // Level 1 (Background): Slowest, moves ~20% of scroll
    // Level 2 (Large decorative type/watermarks): Moderate parallax, moves ~35% of scroll
    // Level 3 (Main content): Normal scroll baseline
    // Level 4 (Interactive elements / overlays): Faster forward floating, moves ~-15% of scroll
    const levelMultipliers: Record<DepthLevel, number> = {
      1: 0.15,
      2: 0.3,
      3: 0.0,
      4: -0.15,
    };

    const multiplier = speed !== undefined ? speed : levelMultipliers[level];
    if (multiplier === 0) return; // No parallax needed for level 3 unless specified

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => `${window.innerHeight * multiplier}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [level, speed]);

  return (
    <div
      ref={layerRef}
      className={`will-change-transform ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
