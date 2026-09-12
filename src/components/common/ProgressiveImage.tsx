import React, { useState, useEffect } from 'react';

export type AspectRatioPreset =
  | '16/9'
  | '16/10'
  | '16/7'
  | '21/9'
  | '4/3'
  | '3/2'
  | '1/1'
  | '4/5'
  | 'auto';

export interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** High-resolution image source */
  src: string;
  /** Accessible image description */
  alt: string;
  /** Pre-defined aspect ratio to lock dimensions and eliminate Cumulative Layout Shift (CLS) */
  aspectRatio?: AspectRatioPreset | string;
  /** Optional custom width & height to calculate aspect ratio mathematically */
  width?: number | string;
  height?: number | string;
  /** Optional low-res blur data URL or thumbnail. If omitted and Unsplash URL is used, auto-generates tiny blur */
  placeholderSrc?: string;
  /** Outer container wrapper classes */
  className?: string;
  /** Classes applied specifically to the <img> element */
  imageClassName?: string;
  /** If true, loads eagerly with high fetchpriority for above-the-fold heroes; otherwise lazy */
  priority?: boolean;
  /** Object-fit style for the rendered image */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Optional overlay scrim for text-heavy readability */
  overlayScrim?: 'bottom' | 'radial' | 'editorial' | 'subtle' | 'none';
  /** Enables smooth zoom transition on container hover */
  hoverZoom?: boolean;
  /** Optional corner badge (e.g. telemetry pill or status beacon) */
  badge?: React.ReactNode;
  /** Optional caption or technical coordinates below/over image */
  caption?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  width,
  height,
  placeholderSrc,
  className = '',
  imageClassName = '',
  priority = false,
  objectFit = 'cover',
  overlayScrim = 'none',
  hoverZoom = true,
  badge,
  caption,
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Map aspect ratio presets to Tailwind aspect utilities or inline ratio
  const getAspectRatioClass = (preset: AspectRatioPreset | string): string => {
    switch (preset) {
      case '16/9':
        return 'aspect-[16/9]';
      case '16/10':
        return 'aspect-[16/10]';
      case '16/7':
        return 'aspect-[16/7]';
      case '21/9':
        return 'aspect-[21/9]';
      case '4/3':
        return 'aspect-[4/3]';
      case '3/2':
        return 'aspect-[3/2]';
      case '1/1':
        return 'aspect-square';
      case '4/5':
        return 'aspect-[4/5]';
      case 'auto':
        return '';
      default:
        // Support custom Tailwind aspect classes passed directly (e.g. "aspect-[4/3] lg:aspect-[16/11]")
        return preset.startsWith('aspect-') ? preset : `aspect-[${preset}]`;
    }
  };

  // Derive automated low-res blurred thumbnail for Unsplash if no placeholder provided
  const derivedPlaceholder = React.useMemo(() => {
    if (placeholderSrc) return placeholderSrc;
    if (src && src.includes('images.unsplash.com')) {
      try {
        const url = new URL(src);
        url.searchParams.set('w', '40');
        url.searchParams.set('q', '20');
        url.searchParams.set('blur', '30');
        return url.toString();
      } catch {
        return null;
      }
    }
    return null;
  }, [src, placeholderSrc]);

  // Reset states if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) onError(e);
  };

  const aspectClass = getAspectRatioClass(aspectRatio);

  return (
    <figure
      role="group"
      aria-label={alt}
      className={`relative overflow-hidden select-none bg-[#05070A] ${aspectClass} ${className}`}
      style={
        width && height && !aspectClass
          ? { aspectRatio: `${width} / ${height}` }
          : undefined
      }
    >
      {/* 1. AMBIENT SHIMMER PLACEHOLDER (Always active while loading) */}
      <div
        className={`absolute inset-0 z-0 bg-[#06080B] transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Generative ambient brand gradient behind image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#008280]/15 via-[#0A0E14] to-[#16D2C8]/10" />

        {/* Low-Res Blurred Thumbnail (if available) */}
        {derivedPlaceholder && (
          <img
            src={derivedPlaceholder}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover scale-110 filter blur-xl opacity-60 transition-opacity duration-500"
          />
        )}

        {/* Animated Sweep Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[image-shimmer_2s_infinite_ease-in-out] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />

        {/* Studio Technical Micro-Wireframe Loading Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#06080B]/80 backdrop-blur-md border border-white/10 font-mono text-[10px] text-[#94A3B8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-pulse" />
            <span className="tracking-wider uppercase">SYNCHRONIZING ASSET</span>
          </div>
        </div>
      </div>

      {/* 2. ERROR STATE (Graceful studio fallback, no layout shift) */}
      {hasError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-[#080B0F] border border-white/10 text-center">
          <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <span className="font-mono text-xs text-[#94A3B8]">!</span>
          </div>
          <div className="font-mono text-[11px] text-[#EBECF0] tracking-wider uppercase font-semibold">
            ASSET UNAVAILABLE
          </div>
          <div className="font-sans text-[10px] text-[#94A3B8] mt-1 max-w-[200px] truncate">
            {alt || 'Visual placeholder'}
          </div>
        </div>
      ) : (
        /* 3. PRIMARY HIGH-RESOLUTION IMAGE ELEMENT */
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`relative z-10 h-full w-full transition-all duration-700 ease-out will-change-transform ${
            objectFit === 'cover'
              ? 'object-cover'
              : objectFit === 'contain'
              ? 'object-contain'
              : 'object-fill'
          } ${
            isLoaded
              ? 'opacity-100 blur-0 scale-100'
              : 'opacity-0 blur-md scale-105'
          } ${
            hoverZoom ? 'group-hover:scale-105' : ''
          } ${imageClassName}`}
          {...rest}
        />
      )}

      {/* 4. OPTIONAL EDITORIAL OVERLAY SCRIMS (For ensuring text legibility) */}
      {overlayScrim === 'bottom' && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#06080B] via-[#06080B]/40 to-transparent opacity-90" />
      )}
      {overlayScrim === 'editorial' && (
        <>
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#06080B] via-[#06080B]/50 to-transparent opacity-95" />
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-[#06080B]/70 via-transparent to-transparent opacity-80" />
        </>
      )}
      {overlayScrim === 'radial' && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,8,11,0.7)_100%)]" />
      )}
      {overlayScrim === 'subtle' && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-black/25" />
      )}

      {/* 5. OPTIONAL BADGE OR TELEMETRY ACCENT */}
      {badge && <div className="absolute top-4 left-4 z-30">{badge}</div>}

      {/* 6. OPTIONAL CAPTION */}
      {caption && (
        <figcaption className="absolute bottom-2 left-3 right-3 z-30 font-mono text-[9px] text-[#94A3B8] tracking-wider uppercase flex items-center justify-between pointer-events-none">
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
};
