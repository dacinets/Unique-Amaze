import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect touch-only devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let currentMode = 'default';
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }

      // Check element under cursor for special attributes
      const target = e.target as HTMLElement | null;
      let newMode = 'default';
      let labelText = '';

      if (target) {
        const cursorAttr = target.closest('[data-cursor]')?.getAttribute('data-cursor');
        if (cursorAttr === 'view' || cursorAttr === 'card') {
          newMode = 'view';
          labelText = 'VIEW';
        } else if (cursorAttr === 'orbit' || cursorAttr === 'explore' || cursorAttr === 'lab') {
          newMode = 'explore';
          labelText = 'EXPLORE';
        } else if (cursorAttr === 'open') {
          newMode = 'open';
          labelText = 'OPEN';
        } else if (cursorAttr === 'enter') {
          newMode = 'enter';
          labelText = 'ENTER';
        } else if (cursorAttr === 'close') {
          newMode = 'close';
          labelText = 'CLOSE';
        } else if (cursorAttr === 'drag') {
          newMode = 'drag';
          labelText = 'DRAG';
        } else if (target.closest('button, a, input, textarea, select, [role="button"]')) {
          newMode = 'pointer';
          labelText = '';
        }
      }

      if (newMode !== currentMode) {
        currentMode = newMode;
        updateCursorVisuals(newMode, labelText);
      }
    };

    const updateCursorVisuals = (mode: string, label: string) => {
      if (!ringRef.current || !dotRef.current) return;

      const ring = ringRef.current;
      const dot = dotRef.current;
      const labelEl = labelRef.current;

      if (labelEl) {
        labelEl.textContent = label;
      }

      // Reset base classes
      ring.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center rounded-full transition-all duration-300 will-change-transform';

      if (mode === 'view') {
        ring.classList.add('h-22', 'w-22', 'border-2', 'border-white/40', 'bg-white/10', 'backdrop-blur-sm', 'shadow-[0_0_20px_rgba(255,255,255,0.15)]');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-1.5 w-1.5 bg-white';
      } else if (mode === 'enter') {
        ring.classList.add('h-24', 'w-24', 'border-2', 'border-white/60', 'bg-white/15', 'backdrop-blur-md', 'shadow-[0_0_25px_rgba(255,255,255,0.2)]');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-2 w-2 bg-white shadow-[0_0_10px_white]';
      } else if (mode === 'open') {
        ring.classList.add('h-20', 'w-20', 'border-2', 'border-white/40', 'bg-[#050607]/80', 'backdrop-blur-md', 'shadow-[0_0_20px_rgba(255,255,255,0.15)]');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-1.5 w-1.5 bg-zinc-200';
      } else if (mode === 'close') {
        ring.classList.add('h-18', 'w-18', 'border', 'border-red-500/50', 'bg-red-500/10', 'backdrop-blur-sm');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-1.5 w-1.5 bg-red-400';
      } else if (mode === 'explore') {
        ring.classList.add('h-24', 'w-24', 'border-2', 'border-white/50', 'bg-[#050607]/80', 'backdrop-blur-md', 'shadow-[0_0_20px_rgba(255,255,255,0.15)]');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-2 w-2 bg-white animate-ping';
      } else if (mode === 'drag') {
        ring.classList.add('h-20', 'w-20', 'border', 'border-slate-400', 'bg-slate-500/20', 'backdrop-blur-sm');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-1.5 w-1.5 bg-slate-300';
      } else if (mode === 'pointer') {
        ring.classList.add('h-11', 'w-11', 'border', 'border-white/40', 'bg-white/10');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-2 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]';
      } else {
        ring.classList.add('h-8', 'w-8', 'border', 'border-white/25', 'bg-transparent');
        dot.className = 'fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-1.5 w-1.5 bg-white/80';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    // Dedicated 60-120fps RAF loop directly mutating CSS transforms
    const render = () => {
      // Dot follows immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Ring follows with fluid lerp inertia
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Precision Center Dot */}
      <div
        id="custom-cursor-dot"
        ref={dotRef}
        className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full h-1.5 w-1.5 bg-white transition-opacity duration-150 will-change-transform"
        style={{ opacity: 0 }}
      />

      {/* Trailing Optical Ring with Micro-label */}
      <div
        id="custom-cursor-ring"
        ref={ringRef}
        className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex items-center justify-center rounded-full border border-white/30 h-8 w-8 transition-opacity duration-150 will-change-transform"
        style={{ opacity: 0 }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[9px] font-bold tracking-widest text-white uppercase select-none"
        />
      </div>
    </>
  );
};
