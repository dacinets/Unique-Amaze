export type ViewMode = 'showcase' | 'archive' | 'lab' | 'capabilities' | 'commission';
export type ArchiveViewStyle = 'grid' | 'index';

export type PageRoute = 'home' | 'services' | 'work' | 'industries' | 'process' | 'pricing' | 'planner' | 'faq' | 'contact' | 'about' | 'privacy' | 'terms';
export type MarketType = 'ca' | 'mw';
export type StudioTheme = 'obsidian' | 'lunar';

export interface DeviceMockupItem {
  device: 'macbook' | 'ipad' | 'iphone';
  title: string;
  subtitle: string;
  badge: string;
  description: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl?: string;
  isFutureCard?: boolean;
  ctaText?: string;
  metrics?: { label: string; value: string }[];
  accentColor?: string;
  overview?: string;
  approach?: string;
  engineeringStack?: string[];
  clientQuote?: {
    text: string;
    author: string;
  };
  deviceMockups?: DeviceMockupItem[];
}

export interface IndustryItem {
  id: string;
  emoji: string;
  name: string;
  head: string;
  lede: string;
  outcomes: string[];
  img: string;
  alt: string;
  smart: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  eyebrow: string;
  bestFor: string;
  priceCA: string;
  priceMW: string;
  features: string[];
  isFeatured?: boolean;
  isCustom?: boolean;
  bgImage?: string;
}

export interface CarePlan {
  name: string;
  priceCAD: string;
  priceMWK: string;
  features: string[];
  recommended?: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export interface FAQCategory {
  id: number;
  label: string;
  items: { q: string; a: string }[];
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  initial: string;
  organization?: string;
  metric?: { label: string; value: string };
  verifiedProject?: string;
  sector?: string;
  avatarUrl?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  coordinate: string;
  title: string;
  client: string;
  year: string;
  category: 'Spatial & 3D' | 'Generative AI' | 'Brand Architecture' | 'Kinetic Systems' | 'Physical Computing';
  subtitle: string;
  overview: string;
  architecturalBrief: string;
  computationalSolution: string;
  heroImage: string;
  gallery: string[];
  metrics: ProjectMetric[];
  disciplines: string[];
  award: string;
  featured: boolean;
  accentColor: string;
}

export interface StudioLocation {
  city: string;
  country: string;
  coordinates: string;
  timezone: string;
  status: 'ACTIVE' | 'STANDBY' | 'SYNCHRONIZING';
  weather: string;
}

export interface AwardItem {
  id: string;
  organization: string;
  accolade: string;
  project: string;
  year: string;
}

export interface DisciplineItem {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  deliverables: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

