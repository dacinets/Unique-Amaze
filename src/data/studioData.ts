import { Project, StudioLocation, AwardItem, DisciplineItem } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'aura-neural',
    coordinate: '01 · SPATIAL AI',
    title: 'AURA NEURAL ARCHITECTURE',
    client: 'KRONOS MOBILITY GROUP',
    year: '2026',
    category: 'Spatial & 3D',
    subtitle: 'Adaptive spatial cockpit operating on real-time neural sensory models',
    overview: 'An avant-garde in-cockpit spatial interface merging biometric eye-tracking with generative holographic displays, crafted for autonomous hyper-vehicles.',
    architecturalBrief: 'Develop a zero-latency spatial interface capable of shifting between high-speed pilot telemetry and meditative spatial sanctuary within ultra-luxury autonomous transport.',
    computationalSolution: 'Engineered a bespoke WebGL-based spatial engine utilizing shader-level signed distance fields (SDF) and localized gaze-density lighting arrays.',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop'
    ],
    metrics: [
      { label: 'Render Latency', value: '< 4.2ms' },
      { label: 'Cognitive Load Reduction', value: '41%' },
      { label: 'Spatial FPS', value: '120 Hz' }
    ],
    disciplines: ['Spatial Computing', 'GLSL Shaders', 'Neural Telemetry', 'Interaction Design'],
    award: 'Awwwards Site of the Year Nominee',
    featured: true,
    accentColor: '#367588'
  },
  {
    id: 'synapse-exchange',
    coordinate: '02 · QUANTUM TERMINAL',
    title: 'SYNAPSE HIGH-FREQUENCY TERMINAL',
    client: 'AETHER DIGITAL ASSETS',
    year: '2026',
    category: 'Kinetic Systems',
    subtitle: 'Microsecond institutional order-book with dynamic multi-dimensional topology',
    overview: 'A high-frequency quantitative terminal visualizing multi-million transaction order streams through kinetic topographic surfaces and sonic micro-signatures.',
    architecturalBrief: 'Transform dry columnar market depth tables into a physical-feeling multi-dimensional topography that exposes liquidity flash-crashes and block orders in sub-milliseconds.',
    computationalSolution: 'Implemented instanced vertex buffers paired with offscreen Web Workers streaming WebSocket tick data directly into GPU uniforms without garbage collection overhead.',
    heroImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
    ],
    metrics: [
      { label: 'Throughput', value: '1.2M events/s' },
      { label: 'Draw Call Count', value: '3 Instanced' },
      { label: 'Global Liquidity Mapped', value: '$8.4B' }
    ],
    disciplines: ['Financial Telemetry', 'High-Performance WebGL', 'Sonic Feedback', 'Cybernetic UX'],
    award: 'FWA of the Month & SOTD',
    featured: true,
    accentColor: '#367588'
  },
  {
    id: 'chronos-horology',
    coordinate: '03 · GENERATIVE HOROLOGY',
    title: 'CHRONOS HAUTE HORLOGERIE',
    client: 'VACHERON & MAISON GENEVA',
    year: '2025',
    category: 'Spatial & 3D',
    subtitle: 'Photorealistic generative digital twin of grand complication timepieces',
    overview: 'A digital showroom allowing collectors to dismantle and examine 840 handcrafted micro-mechanical gears in real-time raytraced fidelity.',
    architecturalBrief: 'Create an uncompromising digital experience that honors centuries of Swiss horological heritage with sub-micron tactile precision and microscopic mechanical physics.',
    computationalSolution: 'Constructed physically-based microfacet shaders replicating brushed platinum, anti-reflective sapphire crystal, and heat-blued screws with real-time anisotropic highlights.',
    heroImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop'
    ],
    metrics: [
      { label: 'Polygon Budget', value: '4.8M Polys' },
      { label: 'Material Precision', value: '8K PBR' },
      { label: 'Collector Engagement', value: '9.4 mins avg' }
    ],
    disciplines: ['Raymarching', 'PBR Material Engineering', 'Luxury Brand Systems', 'Kinetic Animation'],
    award: 'D&AD Yellow Pencil in Digital Craft',
    featured: true,
    accentColor: '#367588'
  },
  {
    id: 'exo-biome',
    coordinate: '04 · PHYSICAL COMPUTING',
    title: 'EXO-BIOME ENVIRONMENTAL MATRIX',
    client: 'TOKYO BIOCENTRIC PAVILION',
    year: '2025',
    category: 'Physical Computing',
    subtitle: 'Kinetic architectural facade responsive to atmospheric humidity and carbon levels',
    overview: 'An interconnected physical-digital ecosystem converting live meteorological sensors across Shibuya into synchronized pneumatic kinetic louvers and luminous generative patterns.',
    architecturalBrief: 'Bridging physical civic architecture with digital environmental metrics to make invisible urban biospheric shifts tactile and arresting.',
    computationalSolution: 'Designed a real-time IoT synchronization protocol relaying carbon density data into an algorithmic tension web running simultaneous browser previews and servo-actuator controls.',
    heroImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
    ],
    metrics: [
      { label: 'Physical Actuators', value: '1,440 Units' },
      { label: 'Sensor Refresh', value: '60ms' },
      { label: 'Pavilion Footfall', value: '380k Visitors' }
    ],
    disciplines: ['Physical Computing', 'Algorithmic Architecture', 'Hardware Telemetry', 'Civic Installation'],
    award: 'Cannes Lions Design Gold',
    featured: false,
    accentColor: '#367588'
  },
  {
    id: 'void-monolith',
    coordinate: '05 · BRAND ARCHITECTURE',
    title: 'VOID MONOLITH IDENTITY & SYSTEM',
    client: 'ATELIER NOIR PARIS',
    year: '2025',
    category: 'Brand Architecture',
    subtitle: 'Minimalist cyber-editorial design system for avant-garde haute couture house',
    overview: 'A stark, brutalist typography and dynamic grid system rejecting commercial e-commerce conventions in favor of monumental scale, negative space, and dark materiality.',
    architecturalBrief: 'Design a digital flagship that treats haute couture garments like monolithic architectural sculptures, requiring deliberate exploration.',
    computationalSolution: 'Created an unconventional multi-axial navigation canvas with fluid inertial scroll mechanics and custom optical-size variable font axes.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop'
    ],
    metrics: [
      { label: 'Direct Conversion', value: '+184%' },
      { label: 'Page Weight', value: '< 850KB' },
      { label: 'Global Press Outlets', value: '42 Features' }
    ],
    disciplines: ['Brand Strategy', 'Custom Typography', 'Editorial Direction', 'Creative Engineering'],
    award: 'Awwwards Studio of the Month',
    featured: false,
    accentColor: '#367588'
  },
  {
    id: 'spectra-engine',
    coordinate: '06 · GENERATIVE AI',
    title: 'SPECTRA LATENT SOUNDSYNTH',
    client: 'NEXUS SOUND LABS BERLIN',
    year: '2026',
    category: 'Generative AI',
    subtitle: 'Neural audio synthesis interface navigating high-dimensional harmonic manifolds',
    overview: 'An exploratory sonic workspace where musicians sculpt synthesized instruments by dragging points across continuous latent vectors visualized through luminescent electric fields.',
    architecturalBrief: 'Demystify deep-learning latent vectors into an intuitive, visually mesmerizing performance instrument for live stage and studio producers.',
    computationalSolution: 'Embedded WebAudio worklets running ONNX neural embeddings with GPU-accelerated harmonic spectral visualizations in pure electric cyan.',
    heroImage: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop'
    ],
    metrics: [
      { label: 'Inference Time', value: '1.8ms' },
      { label: 'Latent Dimensions', value: '512 D' },
      { label: 'Audio Sample Rate', value: '96 kHz / 32-bit' }
    ],
    disciplines: ['Generative Neural Audio', 'Latent Space UI', 'WebAudio Worklets', 'Stage Visuals'],
    award: 'FWA of the Day',
    featured: true,
    accentColor: '#367588'
  }
];

export const DISCIPLINES: DisciplineItem[] = [
  {
    id: 'computational-design',
    index: '01',
    title: 'Computational Design & Shaders',
    tagline: 'Sculpting light, mathematical physics, and real-time geometry on the GPU.',
    description: 'We discard generic templates to write raw GLSL shaders, custom particle engines, and volumetric light fields that elevate digital flagships into kinetic museum pieces.',
    technologies: ['Custom WebGL 2.0', 'GLSL Fragment Shaders', 'Three.js / WebGPU', 'Raymarching SDF'],
    deliverables: ['Real-time 3D Viewers', 'Generative Stage Installations', 'Micro-interaction Engines', 'Spatial UI Frameworks']
  },
  {
    id: 'generative-ai',
    index: '02',
    title: 'Generative AI & Agentic Interfaces',
    tagline: 'Synthesizing human intent with latent intelligence through tactile consoles.',
    description: 'We construct bespoke visual interfaces for complex foundational models—turning abstract vectors, embeddings, and autonomous agent swarms into transparent, tactile instruments.',
    technologies: ['Latent Space Navigation', 'Multi-Agent Visualization', 'Local ONNX Worklets', 'Adaptive Context Meshes'],
    deliverables: ['Generative Creative Workspaces', 'Executive AI Cockpits', 'Adaptive Data Topographies', 'Neural Toolkits']
  },
  {
    id: 'brand-architecture',
    index: '03',
    title: 'Brand Architecture & Typographic Direction',
    tagline: 'Forging indelible cultural identity through razor-sharp architectural systems.',
    description: 'For organizations redefining their industries: we design complete semiotic systems, custom display typefaces, editorial manifestos, and rigorous global brand guidelines.',
    technologies: ['Variable Font Engineering', 'Editorial Design Systems', 'Algorithmic Brand Logic', 'Print-to-Code Parity'],
    deliverables: ['Identity Standards & Guidelines', 'Custom Bespoke Typefaces', 'Flagship Digital Portals', 'Collector Edition Artifacts']
  },
  {
    id: 'physical-digital',
    index: '04',
    title: 'Spatial Computing & Physical Architecture',
    tagline: 'Dissolving the barrier between carbon architecture and silicon luminescence.',
    description: 'From kinetic physical facades in Tokyo to spatial headsets in Silicon Valley, we orchestrate multi-sensory experiences where physical matter and luminous code react as one.',
    technologies: ['Spatial Headset Telemetry', 'IoT Sensor Actuation', 'Biometric Feedback', 'Spatial Audio Topologies'],
    deliverables: ['Civic Pavilion Media Architecture', 'Spatial XR Applications', 'Interactive Retail Monoliths', 'Kinetic Facade Logic']
  }
];

export const STUDIO_LOCATIONS: StudioLocation[] = [
  {
    city: 'ZURICH',
    country: 'SWITZERLAND',
    coordinates: '47°22\'N 8°32\'E',
    timezone: 'Europe/Zurich',
    status: 'ACTIVE',
    weather: '12°C • Clear Night'
  },
  {
    city: 'TOKYO',
    country: 'JAPAN',
    coordinates: '35°41\'N 139°41\'E',
    timezone: 'Asia/Tokyo',
    status: 'ACTIVE',
    weather: '19°C • Neon Mist'
  },
  {
    city: 'LONDON',
    country: 'UNITED KINGDOM',
    coordinates: '51°30\'N 0°07\'W',
    timezone: 'Europe/London',
    status: 'ACTIVE',
    weather: '14°C • Overcast'
  },
  {
    city: 'SAN FRANCISCO',
    country: 'UNITED STATES',
    coordinates: '37°46\'N 122°25\'W',
    timezone: 'America/Los_Angeles',
    status: 'STANDBY',
    weather: '16°C • Pacific Fog'
  }
];

export const AWARDS_LEDGER: AwardItem[] = [
  { id: '1', organization: 'AWWWARDS', accolade: 'Studio of the Year', project: 'Global Recognition', year: '2025' },
  { id: '2', organization: 'FWA', accolade: 'FWA of the Month', project: 'Synapse High-Frequency Terminal', year: '2026' },
  { id: '3', organization: 'D&AD', accolade: 'Yellow Pencil in Digital Craft', project: 'Chronos Haute Horlogerie', year: '2025' },
  { id: '4', organization: 'AWWWARDS', accolade: 'Site of the Day x14', project: 'Selected Portfolio Works', year: '2024-2026' },
  { id: '5', organization: 'CANNES LIONS', accolade: 'Titanium & Design Gold', project: 'Exo-Biome Pavilion Facade', year: '2025' },
  { id: '6', organization: 'THE WEBBY AWARDS', accolade: 'Best Visual Design Aesthetic', project: 'Void Monolith Paris', year: '2025' }
];
