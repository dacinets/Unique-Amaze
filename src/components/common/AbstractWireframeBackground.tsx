import React, { useEffect, useState } from 'react';

export const AbstractWireframeBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Parallax calculations for depth effect
  const parallaxOffset1 = scrollY * 0.15;
  const parallaxOffset2 = scrollY * 0.08;
  const mouseTiltX = mousePos.y * 5; // degrees
  const mouseTiltY = -mousePos.x * 5; // degrees

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ perspective: '1400px' }}
    >
      {/* Deep Space Base Gradients in brand tones */}
      <div className="absolute inset-0 bg-[#050607]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.06)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(54,117,136,0.06)_0%,transparent_60%)]" />

      {/* Layer 1: Global Architectural 64px Wireframe Grid with Depth Fade */}
      <div
        className="absolute inset-0 opacity-[0.06] transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${-parallaxOffset2 % 64}px)`,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Layer 2: 3D Perspective Wireframe Website Frame (Abstract Background Layer) */}
      <div
        className="absolute left-1/2 top-12 -translate-x-1/2 w-[92vw] max-w-[1500px] h-[1900px] transition-transform duration-700 ease-out opacity-60"
        style={{
          transform: `translateX(-50%) translateY(${-parallaxOffset1}px) rotateX(${8 + mouseTiltX}deg) rotateY(${mouseTiltY}deg) scale(0.92)`,
          transformOrigin: 'top center',
        }}
      >
        {/* Abstract Browser Window Chrome Wireframe */}
        <div className="abstract-wireframe-browser w-full rounded-xl border border-white/10 bg-[#080D10]/30 backdrop-blur-[1px] p-4 sm:p-6 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Wireframe Browser Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-white/30" />
              <span className="h-2 w-2 rounded-full border border-slate-400/30" />
              <span className="h-2 w-2 rounded-full border border-white/15" />
            </div>

            {/* URL Bar Skeleton */}
            <div className="h-5 w-64 rounded border border-white/10 bg-white/[0.02] flex items-center px-2.5">
              <div className="h-1.5 w-28 rounded-full bg-white/20" />
            </div>

            {/* Status pulse */}
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
          </div>

          {/* Wireframe Body Content */}
          <div className="pt-8 space-y-12">
            {/* Wireframe Nav Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded border border-white/20 bg-white/5 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full border border-white/30" />
                </div>
                <div className="h-2 w-24 rounded bg-white/15" />
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="h-2 w-14 rounded bg-slate-400/20" />
                <div className="h-2 w-14 rounded bg-slate-400/20" />
                <div className="h-2 w-14 rounded bg-slate-400/20" />
                <div className="h-6 w-24 rounded border border-white/20 bg-white/5" />
              </div>
            </div>

            {/* Wireframe Hero Composition (2-Col Grid) */}
            <div className="grid grid-cols-12 gap-8 items-center pt-6">
              {/* Left wireframe text blocks */}
              <div className="col-span-7 space-y-4">
                <div className="h-2.5 w-36 rounded bg-white/25" />
                <div className="space-y-2">
                  <div className="h-8 w-full rounded bg-white/15" />
                  <div className="h-8 w-4/5 rounded bg-white/10" />
                  <div className="h-8 w-3/5 rounded bg-slate-400/10" />
                </div>
                <div className="pt-2 space-y-1.5">
                  <div className="h-2 w-full rounded bg-[#94A3B8]/10" />
                  <div className="h-2 w-5/6 rounded bg-[#94A3B8]/10" />
                  <div className="h-2 w-4/6 rounded bg-[#94A3B8]/10" />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="h-10 w-36 rounded border border-white/20 bg-white/5" />
                  <div className="h-10 w-32 rounded border border-white/10" />
                </div>
              </div>

              {/* Right Wireframe 3D Perspective Box & Floating Rings */}
              <div className="col-span-5 relative flex items-center justify-center h-64 border border-dashed border-white/15 rounded-lg bg-white/[0.01]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Rotating wireframe rings */}
                  <div className="h-44 w-44 rounded-full border border-white/15 animate-[spin_25s_linear_infinite]" />
                  <div className="h-32 w-32 rounded-full border border-dashed border-slate-400/20 animate-[spin_18s_linear_infinite_reverse]" />
                  <div className="h-16 w-16 rounded border border-white/20 rotate-45" />
                </div>
              </div>
            </div>

            {/* Wireframe 4-Column Feature Grid (Fly-in Preview Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 bg-white/[0.01] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-6 rounded border border-white/20 bg-white/5" />
                    <div className="h-1.5 w-8 rounded bg-white/20" />
                  </div>
                  <div className="h-3 w-4/5 rounded bg-white/15" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded bg-white/5" />
                    <div className="h-1.5 w-5/6 rounded bg-white/5" />
                  </div>
                  <div className="h-4 w-12 rounded border border-white/10" />
                </div>
              ))}
            </div>

            {/* Wireframe Showcase Row with Horizontal Cards */}
            <div className="space-y-4 pt-10 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="h-4 w-48 rounded bg-white/20" />
                <div className="h-2 w-24 rounded bg-white/15" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded border border-white/10 p-3 space-y-2 bg-white/[0.01]"
                  >
                    <div className="aspect-video w-full rounded border border-dashed border-white/15 flex items-center justify-center">
                      <div className="h-5 w-5 rounded-full border border-white/20" />
                    </div>
                    <div className="h-2.5 w-3/4 rounded bg-white/15" />
                    <div className="h-1.5 w-1/2 rounded bg-white/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer 3: Subtle Animated Laser Scanning Beam passing down the wireframe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[scanline_10s_ease-in-out_infinite]"
          style={{
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
          }}
        />
      </div>

      {/* Layer 4: Floating Atmospheric Vignette to guarantee pristine foreground text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050607]/70 via-transparent to-[#050607]/80 pointer-events-none" />
    </div>
  );
};
