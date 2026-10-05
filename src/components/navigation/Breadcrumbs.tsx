import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Home,
  Layers,
  Globe,
  Cpu,
  Search,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Briefcase,
  Sliders,
  DollarSign,
  HelpCircle,
  Mail,
  Shield,
  FileText,
} from 'lucide-react';
import { PageRoute, StudioTheme, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { analytics } from '../../utils/analytics';
import { INDUSTRIES_DATA } from '../../data/uniqueAmazeData';

interface BreadcrumbsProps {
  currentRoute: PageRoute;
  currentTheme: StudioTheme;
  currentMarket?: MarketType;
  onNavigate: (route: PageRoute) => void;
}

interface SiblingItem {
  id: string;
  label: string;
  shortLabel?: string;
  path: string;
  kicker?: string;
  emoji?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

// Deep Service Pillars definition for sibling jump navigation
const SERVICE_PILLARS: SiblingItem[] = [
  {
    id: 'web-architecture',
    label: 'Flagship Web Architecture',
    shortLabel: 'Websites & Apps',
    path: '/services/web-architecture',
    kicker: 'Spec 01',
    icon: Globe,
    description: 'Custom conversion-focused websites powered by modern frameworks',
  },
  {
    id: 'ai-integration',
    label: 'Practical AI Integration',
    shortLabel: 'AI & Intelligence',
    path: '/services/ai-integration',
    kicker: 'Spec 02',
    icon: Cpu,
    description: 'Autonomous 24/7 lead intake assistants and smart triage',
  },
  {
    id: 'local-seo',
    label: 'Local SEO Mastery',
    shortLabel: 'Local SEO',
    path: '/services/local-seo',
    kicker: 'Spec 03',
    icon: Search,
    description: 'Dominating high-intent search in Calgary, Chestermere & Malawi',
  },
  {
    id: 'care-plans',
    label: 'Proactive Website Care',
    shortLabel: 'Managed Care',
    path: '/services/care-plans',
    kicker: 'Spec 04',
    icon: ShieldCheck,
    description: 'Enterprise hosting, daily cloud backups, and proactive updates',
  },
  {
    id: 'business-automation',
    label: 'Business Automation',
    shortLabel: 'Automation',
    path: '/services/business-automation',
    kicker: 'Spec 05',
    icon: Zap,
    description: 'Automated appointment reminders, instant SMS & CRM integration',
  },
];

// Deep Industry Verticals mapped from INDUSTRIES_DATA
const INDUSTRY_VERTICALS: SiblingItem[] = [
  {
    id: 'all',
    label: 'All Industry Sectors',
    shortLabel: 'All Sectors',
    path: '/industries',
    kicker: 'Overview',
    emoji: '🌐',
    description: 'Complete cross-sector architectural overview',
  },
  ...INDUSTRIES_DATA.map((ind) => ({
    id: ind.id,
    label: ind.name,
    shortLabel: ind.name,
    path: `/industries/${ind.id}`,
    kicker: 'Sector',
    emoji: ind.emoji,
    description: ind.head,
  })),
];

// Work Categories
const WORK_CATEGORIES: SiblingItem[] = [
  { id: 'all', label: 'All Projects', path: '/work', kicker: 'Archive' },
  { id: 'development', label: 'Web Architecture', path: '/work?category=development', kicker: 'Engineering' },
  { id: 'consulting', label: 'Corporate & Advisory', path: '/work?category=consulting', kicker: 'Strategy' },
  { id: 'ecommerce', label: 'Commerce & Retail', path: '/work?category=ecommerce', kicker: 'Stores' },
  { id: 'branding', label: 'Brand & Visual Identity', path: '/work?category=branding', kicker: 'Design' },
];

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentRoute,
  currentTheme,
  currentMarket = 'ca',
  onNavigate,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close sibling dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname, location.search]);

  // If on homepage root, suppress breadcrumb completely to preserve hero purity
  if (currentRoute === 'home' && (location.pathname === '/' || location.pathname === '')) {
    return null;
  }

  // Extract path segments and search parameters
  const pathname = location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const searchParams = new URLSearchParams(location.search);

  // Determine section specifics
  let parentLabel = 'OVERVIEW';
  let parentPath = '/';
  let parentRoute: PageRoute = 'home';
  let parentIcon: React.ComponentType<{ className?: string }> = Layers;

  let deepLabel: string | null = null;
  let deepKicker: string | null = null;
  let siblings: SiblingItem[] | null = null;
  let activeSiblingId: string | null = null;

  switch (currentRoute) {
    case 'services': {
      parentLabel = 'SERVICES & CARE';
      parentPath = '/services';
      parentRoute = 'services';
      parentIcon = Layers;
      siblings = SERVICE_PILLARS;

      // Check if deep pillar is active (either via /services/:id or ?pillar=:id)
      const subId = segments[1] || searchParams.get('pillar');
      if (subId) {
        const found = SERVICE_PILLARS.find((p) => p.id === subId);
        if (found) {
          deepLabel = found.label;
          deepKicker = found.kicker || 'Service Pillar';
          activeSiblingId = found.id;
        }
      }
      break;
    }
    case 'industries': {
      parentLabel = 'SECTOR EXPERTISE';
      parentPath = '/industries';
      parentRoute = 'industries';
      parentIcon = Briefcase;
      siblings = INDUSTRY_VERTICALS;

      // Check if deep sector is active (either via /industries/:id or ?sector=:id)
      const sectorId = segments[1] || searchParams.get('sector');
      if (sectorId && sectorId !== 'all') {
        const found = INDUSTRY_VERTICALS.find((v) => v.id === sectorId);
        if (found) {
          deepLabel = `${found.emoji ? found.emoji + ' ' : ''}${found.label}`;
          deepKicker = 'Industry Vertical';
          activeSiblingId = found.id;
        }
      }
      break;
    }
    case 'work': {
      parentLabel = 'SELECTED WORK';
      parentPath = '/work';
      parentRoute = 'work';
      parentIcon = Briefcase;
      siblings = WORK_CATEGORIES;

      const cat = searchParams.get('category');
      if (cat) {
        const found = WORK_CATEGORIES.find((c) => c.id === cat);
        if (found && found.id !== 'all') {
          deepLabel = found.label;
          deepKicker = found.kicker || 'Category';
          activeSiblingId = found.id;
        }
      } else if (segments[1]) {
        // Project slug
        const projId = segments[1].replace(/-/g, ' ').toUpperCase();
        deepLabel = projId;
        deepKicker = 'Case Study';
      }
      break;
    }
    case 'process': {
      parentLabel = 'A.M.A.Z.E.™ METHODOLOGY';
      parentPath = '/process';
      parentRoute = 'process';
      parentIcon = Sliders;
      if (segments[1]) {
        deepLabel = segments[1].toUpperCase();
        deepKicker = 'Phase';
      }
      break;
    }
    case 'pricing': {
      parentLabel = 'PRICING & PACKAGES';
      parentPath = '/pricing';
      parentRoute = 'pricing';
      parentIcon = DollarSign;
      break;
    }
    case 'planner': {
      parentLabel = 'AI PROJECT PLANNER';
      parentPath = '/ai-planner';
      parentRoute = 'planner';
      parentIcon = Cpu;
      break;
    }
    case 'faq': {
      parentLabel = 'FAQ & KNOWLEDGE BASE';
      parentPath = '/faq';
      parentRoute = 'faq';
      parentIcon = HelpCircle;
      break;
    }
    case 'about': {
      parentLabel = 'ABOUT THE STUDIO';
      parentPath = '/about';
      parentRoute = 'about';
      parentIcon = Briefcase;
      break;
    }
    case 'contact': {
      parentLabel = 'STUDIO INTAKE';
      parentPath = '/contact';
      parentRoute = 'contact';
      parentIcon = Mail;
      break;
    }
    case 'privacy': {
      parentLabel = 'LEGAL & COMPLIANCE';
      parentPath = '/privacy';
      parentRoute = 'privacy';
      parentIcon = Shield;
      deepLabel = 'PRIVACY POLICY';
      deepKicker = 'GDPR Sovereign';
      break;
    }
    case 'terms': {
      parentLabel = 'LEGAL & COMPLIANCE';
      parentPath = '/terms';
      parentRoute = 'terms';
      parentIcon = FileText;
      deepLabel = 'TERMS OF ENGAGEMENT';
      deepKicker = 'Studio Agreement';
      break;
    }
    default: {
      parentLabel = currentRoute.toUpperCase();
      parentPath = `/${currentRoute}`;
      parentRoute = currentRoute;
    }
  }

  const handleCrumbClick = (path: string, route?: PageRoute) => {
    studioAudio.playClick(900);
    analytics.trackEvent('breadcrumb_navigate', { from: location.pathname, to: path });
    setDropdownOpen(false);

    if (route) {
      onNavigate(route);
    } else {
      navigate(path);
    }
  };

  const isLunar = currentTheme === 'lunar';

  return (
    <div
      role="region"
      aria-label="Navigation Breadcrumb Trail"
      className={`relative z-30 w-full pt-[70px] sm:pt-[76px] transition-colors duration-300 border-b select-none ${
        isLunar
          ? 'bg-[#F8FAFC]/95 border-slate-200/90 text-[#0F172A]'
          : 'bg-[#050607]/90 border-white/[0.08] text-[#EBECF0]'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Breadcrumb Navigation Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono tracking-wider uppercase">
              {/* Crumb 1: Home */}
              <li className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCrumbClick('/', 'home')}
                  className={`group inline-flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer ${
                    isLunar
                      ? 'text-[#334155] hover:text-[#0F172A] font-semibold'
                      : 'text-zinc-400 hover:text-white font-medium'
                  }`}
                  title="Return to Studio Homepage"
                >
                  <Home className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>HOME</span>
                </button>
              </li>

              {/* Separator 1 */}
              <li aria-hidden="true" className="flex items-center">
                <ChevronRight
                  className={`h-3 w-3 shrink-0 ${isLunar ? 'text-slate-400' : 'text-zinc-600'}`}
                />
              </li>

              {/* Crumb 2: Parent Section (e.g. SERVICES & CARE, SECTOR EXPERTISE) */}
              <li className="flex items-center gap-1.5">
                {deepLabel ? (
                  <button
                    type="button"
                    onClick={() => handleCrumbClick(parentPath, parentRoute)}
                    className={`transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer ${
                      isLunar
                        ? 'text-[#334155] hover:text-[#0F172A] font-semibold'
                        : 'text-zinc-400 hover:text-white font-medium'
                    }`}
                  >
                    {parentLabel}
                  </button>
                ) : (
                  <span
                    aria-current="page"
                    className={`inline-flex items-center gap-1.5 font-bold ${
                      isLunar ? 'text-[#0F172A]' : 'text-white'
                    }`}
                  >
                    <span>{parentLabel}</span>
                  </span>
                )}
              </li>

              {/* Crumb 3: Deep Subpage / Active Sector / Active Service Pillar */}
              {deepLabel && (
                <>
                  <li aria-hidden="true" className="flex items-center">
                    <ChevronRight
                      className={`h-3 w-3 shrink-0 ${
                        isLunar ? 'text-slate-400' : 'text-zinc-600'
                      }`}
                    />
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-current="page"
                      className={`inline-flex items-center gap-1.5 font-bold tracking-normal sm:tracking-wider ${
                        isLunar ? 'text-[#0F172A]' : 'text-white'
                      }`}
                    >
                      {deepKicker && (
                        <span
                          className={`hidden md:inline font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                            isLunar
                              ? 'bg-slate-100 border-slate-300 text-slate-700'
                              : 'bg-white/10 border-white/15 text-zinc-300'
                          }`}
                        >
                          {deepKicker}
                        </span>
                      )}
                      <span>{deepLabel}</span>
                    </span>
                  </li>
                </>
              )}
            </ol>

            {/* Sibling Jump Switcher Dropdown (for Services pillars and Industries sectors) */}
            {siblings && siblings.length > 0 && (
              <div className="relative inline-block ml-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    studioAudio.playClick(dropdownOpen ? 700 : 950);
                    setDropdownOpen(!dropdownOpen);
                  }}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  title={`Switch between ${currentRoute === 'industries' ? 'industry sectors' : 'service disciplines'}`}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase transition-colors border cursor-pointer ${
                    isLunar
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-[#0F172A]'
                      : 'bg-white/5 hover:bg-white/15 border-white/15 text-zinc-200 hover:text-white'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {currentRoute === 'industries' ? 'SECTORS' : 'DISCIPLINES'}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {/* Sibling Jump Flyout Menu */}
                {dropdownOpen && (
                  <div
                    className={`absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl shadow-2xl border p-2 z-50 transition-all duration-200 origin-top-left ${
                      isLunar
                        ? 'bg-white/98 border-slate-200 shadow-slate-900/10 text-slate-900'
                        : 'bg-[#0B0F14]/98 border-white/15 shadow-black/80 text-white backdrop-blur-xl'
                    }`}
                  >
                    <div className="px-2.5 py-1.5 border-b border-white/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      <span>
                        {currentRoute === 'industries'
                          ? 'Available Sector Verticals'
                          : 'Available Service Pillars'}
                      </span>
                      <span className="font-bold text-emerald-400">
                        {siblings.length} Options
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto py-1 space-y-0.5 custom-scrollbar">
                      {siblings.map((item) => {
                        const Icon = item.icon;
                        const isSelected = activeSiblingId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              handleCrumbClick(item.path);
                            }}
                            className={`w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition-all text-xs font-sans cursor-pointer ${
                              isSelected
                                ? isLunar
                                  ? 'bg-slate-100 text-[#0F172A] font-bold border-l-2 border-emerald-500'
                                  : 'bg-white/10 text-white font-bold border-l-2 border-emerald-400'
                                : isLunar
                                ? 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                            }`}
                          >
                            <span className="shrink-0 mt-0.5">
                              {item.emoji ? (
                                <span className="text-sm">{item.emoji}</span>
                              ) : Icon ? (
                                <Icon className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 block mt-1.5" />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="truncate font-medium">{item.label}</span>
                                {item.kicker && (
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 shrink-0 ml-1">
                                    {item.kicker}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p
                                  className={`text-[11px] truncate mt-0.5 font-normal ${
                                    isLunar ? 'text-slate-600' : 'text-zinc-400'
                                  }`}
                                >
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Side: Market & Regional Context Tag */}
          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] tracking-wider text-zinc-500 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase">
                {currentMarket === 'mw' ? 'Malawi / MWK' : 'North America / CAD'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
