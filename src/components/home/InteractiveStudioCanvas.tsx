import React, { useEffect, useRef } from 'react';

export const InteractiveStudioCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates with damping
    const mouse = { x: width * 0.5, y: height * 0.4, targetX: width * 0.5, targetY: height * 0.4 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Grid properties
    const gridSize = 48;
    let time = 0;

    const render = () => {
      time += 0.015;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle architectural coordinate grid
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += gridSize) {
        const distToMouse = Math.abs(x - mouse.x);
        const alpha = Math.max(0.02, 0.15 - distToMouse / 500);
        ctx.strokeStyle = `rgba(0, 130, 128, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        const distToMouse = Math.abs(y - mouse.y);
        const alpha = Math.max(0.02, 0.15 - distToMouse / 500);
        ctx.strokeStyle = `rgba(54, 117, 136, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw floating precision nodes that react to mouse proximity
      const numNodesX = Math.floor(width / (gridSize * 3));
      const numNodesY = Math.floor(height / (gridSize * 3));

      for (let i = 1; i <= numNodesX; i++) {
        for (let j = 1; j <= numNodesY; j++) {
          const nx = i * gridSize * 3;
          const ny = j * gridSize * 3;
          const dx = mouse.x - nx;
          const dy = mouse.y - ny;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const influence = (1 - dist / 220);
            const pulse = Math.sin(time * 2 + i + j) * 1.5;

            // Connect line to cursor
            ctx.strokeStyle = `rgba(0, 130, 128, ${influence * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nx, ny);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Caliper Crosshair
            ctx.strokeStyle = `rgba(235, 236, 240, ${influence * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(nx - 4, ny);
            ctx.lineTo(nx + 4, ny);
            ctx.moveTo(nx, ny - 4);
            ctx.lineTo(nx, ny + 4);
            ctx.stroke();

            // Small node circle
            ctx.fillStyle = `rgba(0, 130, 128, ${influence * 0.8})`;
            ctx.beginPath();
            ctx.arc(nx, ny, 2 + pulse * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Subtle dormant dot
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(nx - 1, ny - 1, 2, 2);
          }
        }
      }

      // 3. Subtle ambient glow around cursor
      const radial = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 350);
      radial.addColorStop(0, 'rgba(0, 130, 128, 0.08)');
      radial.addColorStop(0.5, 'rgba(54, 117, 136, 0.03)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70 z-0"
    />
  );
};
