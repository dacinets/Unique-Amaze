import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeLeafMarkProps {
  className?: string;
  interactive?: boolean;
}

export const ThreeLeafMark: React.FC<ThreeLeafMarkProps> = ({ className = '', interactive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 320;
    let height = mount.clientHeight || 360;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // Procedural Studio Environment for Metallic Sheen
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 128);
      grad.addColorStop(0, '#003333');
      grad.addColorStop(0.45, '#06080c');
      grad.addColorStop(0.55, '#06080c');
      grad.addColorStop(1, '#0e232b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = 'rgba(0, 130, 128, 0.7)';
      ctx.beginPath();
      ctx.arc(32, 36, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(54, 117, 136, 0.65)';
      ctx.beginPath();
      ctx.arc(96, 92, 26, 0, Math.PI * 2);
      ctx.fill();
    }
    const envTexture = new THREE.CanvasTexture(canvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // 3D Leaf Shapes
    function slateShape() {
      const s = new THREE.Shape();
      s.moveTo(0, 1.42);
      s.bezierCurveTo(-0.55, 1.05, -0.95, 0.35, -0.88, -0.36);
      s.bezierCurveTo(-0.82, -0.98, -0.42, -1.18, 0.02, -1.42);
      s.bezierCurveTo(-0.02, -0.6, -0.04, 0.55, 0, 1.42);
      return s;
    }

    function tealShape() {
      const s = new THREE.Shape();
      s.moveTo(0, 1.42);
      s.bezierCurveTo(0.6, 1.0, 1.02, 0.3, 0.92, -0.42);
      s.bezierCurveTo(0.84, -1.02, 0.44, -1.22, 0.06, -1.42);
      s.bezierCurveTo(0.04, -0.6, 0.03, 0.55, 0, 1.42);
      return s;
    }

    const exSettings = {
      depth: 0.44,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 5,
      curveSegments: 64
    };

    const slateMat = new THREE.MeshPhysicalMaterial({
      color: 0x367588,
      metalness: 0.90,
      roughness: 0.25,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
      emissive: 0x0c2026,
      emissiveIntensity: 0.14,
      envMapIntensity: 1.25
    });

    const tealMat = new THREE.MeshPhysicalMaterial({
      color: 0x008280,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
      emissive: 0x002424,
      emissiveIntensity: 0.16,
      envMapIntensity: 1.3
    });

    const group = new THREE.Group();
    const slateGeo = new THREE.ExtrudeGeometry(slateShape(), exSettings);
    const tealGeo = new THREE.ExtrudeGeometry(tealShape(), exSettings);
    const slateMesh = new THREE.Mesh(slateGeo, slateMat);
    const tealMesh = new THREE.Mesh(tealGeo, tealMat);
    group.add(slateMesh, tealMesh);

    // Center the group
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);

    const pivot = new THREE.Group();
    pivot.add(group);
    scene.add(pivot);

    // Lights
    scene.add(new THREE.AmbientLight(0x1e262c, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 5);
    scene.add(key);

    const tealLight = new THREE.PointLight(0x008280, 4.0, 25);
    tealLight.position.set(-4, 1.5, 3);
    scene.add(tealLight);

    const slateLight = new THREE.PointLight(0x367588, 3.8, 25);
    slateLight.position.set(4, -1, 3);
    scene.add(slateLight);

    const rim = new THREE.DirectionalLight(0x4a8fa3, 0.7);
    rim.position.set(-2, -3, -4);
    scene.add(rim);

    // Interaction handling
    const target = { x: 0.12, y: 0 };
    const current = { x: 0.12, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.y = x * 0.55;
      target.x = -y * 0.4 + 0.12;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrameId: number;
    let time = 0;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      time += 1;

      // Base rotation + lerped tilt
      pivot.rotation.y += 0.007;
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      pivot.rotation.x = current.x;
      pivot.rotation.y += current.y * 0.015;
      pivot.position.y = Math.sin(time / 50) * 0.12;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 320;
      height = mount.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      slateGeo.dispose();
      tealGeo.dispose();
      slateMat.dispose();
      tealMat.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      aria-label="Interactive 3D Unique Amaze Leaf Emblem"
    />
  );
};
