export type PageRoute = 'home' | 'services' | 'work' | 'process' | 'pricing' | 'planner' | 'faq' | 'contact';
export type MarketType = 'ca' | 'mw';

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
}
