import React, { useRef, useEffect, useState, useCallback } from 'react';
import { studioAudio } from '../utils/audio';
import { Play, Pause, RefreshCw, Sliders, Sparkles, Download, Maximize2 } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
}

export const InteractiveLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lab Parameter States
  const [isPlaying, setIsPlaying] = useState(true);
  const [particleDensity, setParticleDensity] = useState(120);
  const [tensionDistance, setTensionDistance] = useState(130);
  const [glowIntensity, setGlowIntensity] = useState(0.85);
  const [colorPreset, setColorPreset] = useState<'cyan' | 'mint' | 'hybrid' | 'quantum'>('hybrid');
  const [activePresetName, setActivePresetName] = useState('HYBRID FLUX');
  const [fps, setFps] = useState(60);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 180, isDown: false });

  // Preset Configurations
  const applyPreset = (preset: 'cyan' | 'mint' | 'hybrid' | 'quantum') => {
    studioAudio.playClick(820);
    setColorPreset(preset);
    if (preset === 'cyan') {
      setActivePresetName('ELECTRIC CYAN ARC');
      setTensionDistance(140);
      setGlowIntensity(0.9);
    } else if (preset === 'mint') {
      setActivePresetName('MINT AURORA TENSION');
      setTensionDistance(120);
      setGlowIntensity(0.8);
    } else if (preset === 'quantum') {
      setActivePresetName('QUANTUM VOID MESH');
      setTensionDistance(90);
      setGlowIntensity(0.95);
    } else {
      setActivePresetName('HYBRID FLUX');
      setTensionDistance(130);
      setGlowIntensity(0.85);
    }
  };

  const getPresetColors = useCallback(() => {
    if (colorPreset === 'cyan') return ['#00F2FE', '#05D5E4', '#00C4CC'];
    if (colorPreset === 'mint') return ['#5EEAD4', '#4DDCC6', '#00B4A0'];
    if (colorPreset === 'quantum') return ['#F3F7F8', '#00F2FE', '#5EEAD4'];
    return ['#00F2FE', '#5EEAD4', '#F3F7F8'];
  }, [colorPreset]);

  // Initialize Particles
  const initParticles = useCallback((width: number, height: number) => {
    const colors = getPresetColors();
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleDensity; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        size: Math.random() * 2.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = newParticles;
  }, [particleDensity, getPresetColors]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initParticles(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      frameCount++;
      if (time - lastFpsUpdate >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsUpdate = time;
      }

      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();

      // Clear with dark subtle fade for motion blur
      ctx.fillStyle = 'rgba(5, 6, 7, 0.28)';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Draw particle connections & vector tension
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (isPlaying) {
          p1.x += p1.vx;
          p1.y += p1.vy;

          // Bounce off boundaries
          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;

          // Mouse gravity / repulsion
          const dxMouse = mouse.x - p1.x;
          const dyMouse = mouse.y - p1.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            const force = (mouse.radius - distMouse) / mouse.radius;
            const direction = mouse.isDown ? 1.5 : -1.2;
            p1.x += (dxMouse / distMouse) * force * direction * 4;
            p1.y += (dyMouse / distMouse) * force * direction * 4;
          }
        }

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < tensionDistance) {
            const alpha = (1 - dist / tensionDistance) * 0.45 * glowIntensity;
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.globalAlpha = p1.alpha * glowIntensity;
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = glowIntensity * 16;
        ctx.shadowColor = p1.color;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, particleDensity, tensionDistance, glowIntensity, initParticles]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    setMouseCoords({ x: Math.round(x), y: Math.round(y) });
  };

  const handleMouseDown = () => {
    mouseRef.current.isDown = true;
    studioAudio.playClick(1100);
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  const handleSnapshot = () => {
    studioAudio.playClick(920);
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `obsidian-lumina-experiment-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <section
      id="studio-lab-section"
      className="relative w-full border-b border-[#1E2629] bg-[#050607] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        {/* Header with strictly capped pill geometry for LIVE EXPERIMENT (Design System Spec) */}
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              {/* Fully capped pill geometry exclusively when denoting real-time dynamic tags */}
              <div
                id="live-experiment-pill"
                className="inline-flex items-center gap-2 rounded-full border border-[#5EEAD4]/40 bg-[#0A0D0E] px-4 py-1.5 font-mono text-xs font-bold text-[#5EEAD4] shadow-[0_0_18px_rgba(94,234,212,0.25)] uppercase"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5EEAD4] opacity-80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5EEAD4]" />
                </span>
                LIVE EXPERIMENT // SHADER LAB
              </div>

              <span className="font-mono text-xs text-[#64748B]">GPU ACCELERATED</span>
            </div>

            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#F3F7F8] sm:text-5xl">
              KINETIC TOPOLOGY & PARTICLE TENSION
            </h2>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {(['hybrid', 'cyan', 'mint', 'quantum'] as const).map((preset) => (
              <button
                key={preset}
                id={`preset-btn-${preset}`}
                onClick={() => applyPreset(preset)}
                className={`rounded-[4px] px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                  colorPreset === preset
                    ? 'border border-[#00F2FE] bg-[#00F2FE]/10 text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                    : 'border border-[#1E2629] bg-[#0A0D0E] text-[#94A3B8] hover:border-[#2A363A]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Canvas Stage */}
        <div
          ref={containerRef}
          data-cursor="lab"
          className="group relative h-[580px] w-full overflow-hidden rounded-[8px] border border-[#2A363A] bg-[#050607] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="h-full w-full cursor-crosshair"
          />

          {/* HUD Overlay: Top Left Telemetry */}
          <div className="pointer-events-none absolute left-5 top-5 flex flex-col gap-1.5 rounded-[4px] border border-white/10 bg-[#050607]/80 p-3 font-mono text-[11px] backdrop-blur-md">
            <div className="flex items-center gap-2 text-[#00F2FE]">
              <Sparkles className="h-3 w-3" />
              <span className="font-bold">{activePresetName}</span>
            </div>
            <div className="text-[#94A3B8]">
              NODES: <span className="text-[#F3F7F8]">{particleDensity}</span> | FPS:{' '}
              <span className="text-[#5EEAD4]">{fps}</span>
            </div>
            <div className="text-[#64748B]">
              COORDINATES: X:{mouseCoords.x} Y:{mouseCoords.y}
            </div>
          </div>

          {/* HUD Overlay: Bottom Floating Controls */}
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4 rounded-[6px] border border-white/10 bg-[#0A0D0E]/90 p-4 backdrop-blur-md">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-3">
              <button
                id="lab-play-toggle-btn"
                onClick={() => {
                  studioAudio.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="flex items-center gap-2 rounded-[4px] bg-[#00F2FE] px-4 py-2 font-mono text-xs font-bold text-[#050607] uppercase transition-all hover:bg-[#5EEAD4]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>FREEZE</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>RUN</span>
                  </>
                )}
              </button>

              <button
                id="lab-reset-btn"
                onClick={() => {
                  studioAudio.playClick();
                  if (containerRef.current) {
                    const { width, height } = containerRef.current.getBoundingClientRect();
                    initParticles(width, height);
                  }
                }}
                className="flex items-center gap-1.5 rounded-[4px] border border-[#2A363A] bg-[#0D1214] px-3 py-2 font-mono text-xs text-[#F3F7F8] hover:border-[#00F2FE]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">RESET</span>
              </button>
            </div>

            {/* Parameter Sliders */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <span>DENSITY:</span>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={particleDensity}
                  onChange={(e) => setParticleDensity(Number(e.target.value))}
                  className="h-1.5 w-24 accent-[#00F2FE] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>TENSION:</span>
                <input
                  type="range"
                  min="80"
                  max="180"
                  value={tensionDistance}
                  onChange={(e) => setTensionDistance(Number(e.target.value))}
                  className="h-1.5 w-24 accent-[#5EEAD4] cursor-pointer"
                />
              </div>

              <div className="hidden lg:flex lg:items-center lg:gap-2">
                <span>GLOW:</span>
                <input
                  type="range"
                  min="0.3"
                  max="1.2"
                  step="0.1"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(Number(e.target.value))}
                  className="h-1.5 w-20 accent-[#00F2FE] cursor-pointer"
                />
              </div>
            </div>

            {/* Snapshot Trigger */}
            <button
              id="lab-export-snapshot-btn"
              onClick={handleSnapshot}
              className="flex items-center gap-1.5 rounded-[4px] border border-[#2A363A] bg-[#050607] px-3 py-2 font-mono text-xs text-[#00F2FE] hover:border-[#00F2FE] hover:bg-[#00F2FE]/10"
              title="Download Canvas Snapshot"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">SNAPSHOT</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
