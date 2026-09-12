import React, { useState, useRef, useEffect, useCallback } from 'react';
import { studioAudio } from '../../utils/audio';
import { Volume2, VolumeX, Sparkles, Activity } from 'lucide-react';

interface SoundLine {
  id: number;
  freq: number;
  note: string;
  label: string;
}

const HARMONIC_STRINGS: SoundLine[] = [
  { id: 1, freq: 146.83, note: 'D3', label: '146.8 Hz // DEEP RESONANCE' },
  { id: 2, freq: 185.00, note: 'F#3', label: '185.0 Hz // FOUNDATION' },
  { id: 3, freq: 220.00, note: 'A3', label: '220.0 Hz // CALIBRATION' },
  { id: 4, freq: 293.66, note: 'D4', label: '293.7 Hz // HARMONIC CENTER' },
  { id: 5, freq: 369.99, note: 'F#4', label: '370.0 Hz // CLARITY' },
  { id: 6, freq: 440.00, note: 'A4', label: '440.0 Hz // CONCERT PITCH' },
  { id: 7, freq: 587.33, note: 'D5', label: '587.3 Hz // HIGH REGISTER' },
];

export const FooterHoverLines: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeString, setActiveString] = useState<number | null>(null);
  const [lastFrequency, setLastFrequency] = useState<string>('440.0 Hz (A4)');
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const lastTriggeredRef = useRef<{ [key: number]: number }>({});

  // Measure container dimensions
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const heightPerString = rect.height / HARMONIC_STRINGS.length;
    const hoveredIndex = Math.floor(y / heightPerString);

    if (hoveredIndex >= 0 && hoveredIndex < HARMONIC_STRINGS.length) {
      const stringData = HARMONIC_STRINGS[hoveredIndex];
      const now = Date.now();
      const lastTime = lastTriggeredRef.current[stringData.id] || 0;

      // Rate limit individual string plucks to prevent harsh spam
      if (now - lastTime > 160) {
        lastTriggeredRef.current[stringData.id] = now;
        setActiveString(stringData.id);
        setLastFrequency(`${stringData.freq.toFixed(1)} Hz (${stringData.note})`);

        if (!isSoundMuted) {
          studioAudio.playStringPluck(stringData.freq);
        }

        setTimeout(() => {
          setActiveString((current) => (current === stringData.id ? null : current));
        }, 400);
      }
    }
  }, [isSoundMuted]);

  const handleMouseLeave = () => {
    setMousePos(null);
    setActiveString(null);
  };

  const toggleSound = () => {
    setIsSoundMuted((prev) => !prev);
    if (isSoundMuted) {
      studioAudio.playStringPluck(440);
    }
  };

  const totalHeight = 160;
  const lineSpacing = totalHeight / (HARMONIC_STRINGS.length + 1);

  return (
    <div className="relative w-full my-12 pt-6 pb-4 border-y border-white/[0.08] bg-[#07090C]/60 backdrop-blur-sm">
      {/* Header Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 mb-4">
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#94A3B8]">
          <span className="flex h-2 w-2 rounded-full bg-[#008280] animate-ping" />
          <span className="text-[#008280] font-bold tracking-widest uppercase">
            HOVER THE LINES
          </span>
          <span className="text-white/20">/</span>
          <span className="text-[#64748B]">HARMONIC AUDIO INTERACTION</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-[#64748B] hidden sm:flex">
            <Activity className="h-3.5 w-3.5 text-[#008280]" />
            <span>RESONANCE:</span>
            <span className="text-[#008280] font-semibold">{lastFrequency}</span>
          </div>

          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] uppercase font-semibold transition-all ${
              !isSoundMuted
                ? 'border-[#008280]/60 bg-[#008280]/15 text-[#008280]'
                : 'border-white/10 bg-white/5 text-[#64748B] hover:text-white'
            }`}
            title="Toggle Line Sound Interaction"
          >
            {!isSoundMuted ? (
              <>
                <Volume2 className="h-3 w-3" />
                <span>AUDIO ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3 w-3" />
                <span>AUDIO MUTED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Sound Lines Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full cursor-pointer select-none overflow-hidden"
        style={{ height: `${totalHeight}px` }}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${containerWidth} ${totalHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGlowTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#008280" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#16D2C8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#008280" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineIdle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E2629" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#008280" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E2629" stopOpacity="0.3" />
            </linearGradient>
            <filter id="stringBloom" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {HARMONIC_STRINGS.map((stringItem, index) => {
            const baseY = (index + 1) * lineSpacing;
            const isHovered = activeString === stringItem.id;

            // Compute wave deflection when mouse is nearby
            let pathD = `M 0 ${baseY} L ${containerWidth} ${baseY}`;

            if (mousePos) {
              const distanceY = Math.abs(mousePos.y - baseY);
              if (distanceY < 35) {
                const pullFactor = (1 - distanceY / 35) * (mousePos.y - baseY) * 0.9;
                const controlX = mousePos.x;
                const controlY = baseY + pullFactor;
                pathD = `M 0 ${baseY} Q ${controlX} ${controlY}, ${containerWidth} ${baseY}`;
              }
            }

            return (
              <g key={stringItem.id}>
                {/* Background Shadow / Bloom on active */}
                {isHovered && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#008280"
                    strokeWidth="5"
                    strokeOpacity="0.5"
                    filter="url(#stringBloom)"
                  />
                )}

                {/* Primary String Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHovered ? 'url(#lineGlowTeal)' : 'url(#lineIdle)'}
                  strokeWidth={isHovered ? '2.5' : '1'}
                  className="transition-colors duration-200"
                />

                {/* Left Note Indicator */}
                <text
                  x="20"
                  y={baseY - 4}
                  className={`font-mono text-[9px] select-none uppercase tracking-wider transition-colors duration-200 ${
                    isHovered ? 'fill-[#16D2C8] font-bold' : 'fill-[#64748B]'
                  }`}
                >
                  {stringItem.note}
                </text>

                {/* Right Frequency Indicator */}
                <text
                  x={containerWidth - 75}
                  y={baseY - 4}
                  textAnchor="end"
                  className={`font-mono text-[9px] select-none uppercase tracking-wider transition-colors duration-200 ${
                    isHovered ? 'fill-[#16D2C8] font-bold' : 'fill-[#64748B]'
                  }`}
                >
                  {stringItem.freq.toFixed(0)} HZ
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Mouse Cursor Particle on Line Hover */}
        {mousePos && (
          <div
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#008280] bg-[#008280]/20 blur-[1px] transition-transform duration-75"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          />
        )}
      </div>

      {/* Footer Sub-Rail with Instructions */}
      <div className="flex items-center justify-between px-4 sm:px-8 mt-2 font-mono text-[10px] text-[#64748B]">
        <span>SWEEP CURSOR ACROSS HARMONIC STRINGS</span>
        <span className="hidden sm:inline">PENTATONIC AUDIO SYNTHESIZER V4</span>
      </div>
    </div>
  );
};
