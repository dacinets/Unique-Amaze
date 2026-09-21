import React from 'react';
import { PageRoute, MarketType } from '../../types';
import { CARE_PLANS } from '../../data/uniqueAmazeData';
import { studioAudio } from '../../utils/audio';
import { BrandDivider } from '../common/BrandDivider';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Search, RefreshCw, Cpu } from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, currentMarket }) => {
  const pillars = [
    {
      num: '01',
      title: 'Premium Websites, Powered by AI',
      kicker: 'THE FLAGSHIP PILLAR',
      lead: 'Custom conversion-focused websites with bespoke design, smooth motion, and responsive performance across every viewport.',
      features: [
        'Tailored architectural visual design matching your brand aesthetic',
        'Mobile-first responsive engineering with 90+ Lighthouse targets',
        'Conversion-centered page structure and clear value proposition',
        'Clean, accessible codebase built with modern frameworks',
      ],
      icon: Globe,
      accent: '#008280',
      glassClass: 'glass-dominant',
      isDominant: true,
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=75',
      imageAlt: 'Architectural web interface design and responsive layout engineering',
      caption: 'FLAGSHIP DIGITAL ARCHITECTURE',
    },
    {
      num: '02',
      title: 'Practical AI Integration',
      kicker: 'INTELLIGENCE ENGINE',
      lead: 'AI that works quietly in the background 24/7 to answer customer questions, qualify inquiries, and route high-value leads directly to you.',
      features: [
        'Guided intake assistants that understand visitor needs',
        'Automated lead qualification and inquiry prioritization',
        'Seamless integration with your existing CRM and inbox',
        'Custom conversational flows trained on your exact business facts',
      ],
      icon: Cpu,
      accent: '#367588',
      glassClass: 'glass-teal',
      isDominant: false,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=75',
      imageAlt: 'Neural intelligence and conversational workflow streams',
      caption: 'SAGE AI CONVERSATIONAL DISPATCH',
    },
    {
      num: '03',
      title: 'Local SEO Mastery',
      kicker: 'DISCOVERABILITY',
      lead: 'Get found by customers searching for your services right now in Chestermere, Calgary, Alberta, or across Malawi.',
      features: [
        'Complete Google Business Profile setup and synchronization',
        'Local keyword targeting (“near me” search optimization)',
        'Structured schema markup for rich search snippet display',
        'On-page speed optimization for search engine priority',
      ],
      icon: Search,
      accent: '#008280',
      glassClass: 'glass-slate',
      isDominant: false,
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=75',
      imageAlt: 'Geospatial local search and regional visibility coordinates',
      caption: 'REGIONAL GEO-SIGNAL AUTHORITY',
    },
    {
      num: '04',
      title: 'Proactive Website Care',
      kicker: 'CONTINUOUS PROTECTION',
      lead: 'Managed cloud hosting, daily backups, security monitoring, and regular updates — so your site stays fast, secure, and always working.',
      features: [
        'Enterprise-grade cloud hosting with automatic SSL certificates',
        'Automated daily offsite backups with instant rollback recovery',
        '24/7 uptime monitoring and proactive malware screening',
        'Monthly content adjustments and ongoing performance tuning',
      ],
      icon: ShieldCheck,
      accent: '#367588',
      glassClass: 'glass-smoke',
      isDominant: false,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75',
      imageAlt: 'High-availability infrastructure and continuous architectural security',
      caption: '99.98% UPTIME CLOUD SHIELD',
    },
    {
      num: '05',
      title: 'Business Automation',
      kicker: 'EFFICIENCY MULTIPLIER',
      lead: 'Simple, reliable automations that eliminate repetitive administrative friction and save you valuable hours on every single lead.',
      features: [
        'Instant WhatsApp and SMS client booking confirmations',
        'Automated appointment reminders that prevent costly no-shows',
        'Lead routing into Notion, Airtable, HubSpot, or Google Sheets',
        'Payment gateway and invoice generation integrations',
      ],
      icon: Zap,
      accent: '#008280',
      glassClass: 'glass-violet',
      isDominant: false,
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=75',
      imageAlt: 'Precision kinetic automation workflows and friction-free intake',
      caption: 'AUTONOMOUS INTAKE PIPELINES',
    },
  ];

  const comparison = [
    {
      feature: 'Visitor Interaction',
      traditional: 'Displays static text and waits passively for visitors to email',
      uniqueAmaze: 'Engages visitors 24/7 with smart guided forms and instant booking',
    },
    {
      feature: 'After-Hours Capture',
      traditional: 'Zero response between 6pm and 8am; high drop-off',
      uniqueAmaze: 'Captures, qualifies, and schedules bookings automatically while you sleep',
    },
    {
      feature: 'Load Speed & SEO',
      traditional: 'Heavy page templates with poor mobile load times and neglected SEO',
      uniqueAmaze: 'Built mobile-first with 90+ Lighthouse targets and dedicated local SEO',
    },
    {
      feature: 'Design Polish',
      traditional: 'Generic builder themes that look like hundreds of competitors',
      uniqueAmaze: 'Bespoke, high-contrast visual architecture with quiet luxury finish',
    },
    {
      feature: 'Maintenance & Care',
      traditional: 'Left on your own after launch; vulnerable to crashes and malware',
      uniqueAmaze: 'Dedicated care plans with backups, security, updates, and direct support',
    },
  ];

  return (
    <div className="relative w-full py-20 sm:py-28 lg:py-32">
      {/* Header */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#008280]" />
            <span>WHAT WE DO // SERVICES &amp; CARE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#0F172A] dark:text-[#EBECF0] leading-[1.12] uppercase">
            FIVE CORE DISCIPLINES, EXECUTED WITH <span className="text-[#008280]">ARCHITECTURAL RIGOR.</span>
          </h1>

          <p className="mt-8 font-sans text-base sm:text-lg text-slate-600 dark:text-[#94A3B8] leading-relaxed max-w-2xl">
            Everything a modern business needs to win online — thoughtfully designed, precision built, and reliably maintained by a dedicated specialist.
          </p>
        </div>
      </div>

      {/* 5 Core Pillars Grid */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={p.num}
              data-cursor="card"
              className={`services-pillar-panel relative rounded-xl border p-8 sm:p-12 lg:p-14 transition-all duration-300 ${p.glassClass} ${
                p.isDominant
                  ? 'hover:border-[#16D2C8]/60 shadow-xl'
                  : 'hover:border-[#008280]/40 hover:shadow-lg'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Left Column: Metadata & Narrative */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className={`font-display text-3xl sm:text-4xl font-bold ${p.isDominant ? 'text-[#008280] dark:text-[#16D2C8]' : 'text-[#008280]'}`}>
                        {p.num}
                      </span>
                      <span className="text-slate-400 dark:text-[#3A494B] font-mono">//</span>
                      <span className="font-mono text-xs tracking-widest text-[#007A78] dark:text-[#367588] uppercase font-bold">
                        {p.kicker}
                      </span>
                      {p.isDominant && (
                        <span className="ml-auto rounded-full bg-[#008280]/15 border border-[#008280]/40 px-2.5 py-0.5 font-mono text-[9px] font-bold text-[#008280] dark:text-[#16D2C8] uppercase tracking-wider">
                          FLAGSHIP
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide leading-tight">
                      {p.title}
                    </h2>

                    <p className="font-sans text-sm sm:text-base text-[#334155] dark:text-[#94A3B8] leading-relaxed font-normal">
                      {p.lead}
                    </p>
                  </div>

                  {/* Supporting Thumbnail Visual / Spatial Anchor */}
                  <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 aspect-[16/8] sm:aspect-[16/7] w-full bg-[#080B0E] group">
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover brightness-[0.62] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-transparent to-transparent opacity-85" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[10px] !text-white z-20">
                      <span className="tracking-wider uppercase font-semibold !text-white">{p.caption}</span>
                      <span className="!text-white flex items-center gap-1 font-semibold">
                        <Icon className="h-3 w-3 text-[#16D2C8]" />
                        <span className="!text-white">SPEC // {p.num}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Key Deliverables & Architectural Specs */}
                <div className="services-deliverables-box lg:col-span-7 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/95 dark:bg-[#0A0D10]/85 backdrop-blur-md p-8 sm:p-10 flex flex-col justify-between shadow-sm dark:shadow-inner">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-white/[0.06]">
                      <span className="font-mono text-xs text-[#007A78] dark:text-[#16D2C8] uppercase tracking-wider block font-bold">
                        DELIVERABLES &amp; CAPABILITIES:
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B] font-semibold">
                        ENGINEERED SPECIFICATION
                      </span>
                    </div>
                    <ul className="space-y-4 font-sans text-sm">
                      {p.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3.5 group/item">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#008280]/15 text-[#008280] border border-[#008280]/30 mt-0.5 group-hover/item:text-[#008280] group-hover/item:border-[#008280] dark:bg-[#008280]/20 dark:text-[#008280] dark:border-[#008280]/40 dark:group-hover/item:text-[#16D2C8] dark:group-hover/item:border-[#16D2C8]">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="leading-snug text-[#0F172A] dark:text-[#EBECF0] font-medium group-hover/item:text-[#008280] dark:group-hover/item:text-white transition-colors">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-500 dark:text-[#64748B] font-medium">DISCIPLINE {p.num} // PRODUCTION READY</span>
                    <button
                      onClick={() => {
                        studioAudio.playClick(900);
                        onNavigate('planner');
                      }}
                      className="text-[#008280] hover:text-[#005F5E] dark:hover:text-[#16D2C8] flex items-center gap-1 transition-colors uppercase font-bold"
                    >
                      <span>INCLUDE IN SCOPE</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Horizontal Divider: Pillars to Comparison */}
      <BrandDivider
        variant="teal"
        width="container"
        spacing="lg"
        label="SYSTEM COMPARISON"
        sublabel="TRADITIONAL VS INTELLIGENT"
      />

      {/* Comparison: Traditional vs. Unique Amaze */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#007A78] dark:text-[#367588] tracking-widest uppercase mb-3 font-semibold">
            <span>WHY IT MATTERS // COMPARISON</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
            WHY AI-POWERED SITES OUTPERFORM TRADITIONAL BROCHURES
          </h2>
        </div>

        <div className="services-comparison-table overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0E1217]/90 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0E1217]/90 p-6 sm:p-8 font-mono text-xs font-bold">
            <div className="md:col-span-3 text-slate-500 dark:text-[#94A3B8] uppercase">EVALUATION AREA</div>
            <div className="md:col-span-4 text-[#EF4444] mt-2 md:mt-0 uppercase">TRADITIONAL BROCHURE SITES</div>
            <div className="md:col-span-5 text-[#008280] mt-2 md:mt-0 uppercase">UNIQUE AMAZE INTELLIGENT EXPERIENCE</div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {comparison.map((item, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 p-6 sm:p-8 text-sm gap-6 items-center">
                <div className="md:col-span-3 font-mono text-xs text-[#0F172A] dark:text-[#EBECF0] font-semibold uppercase">
                  {item.feature}
                </div>
                <div className="md:col-span-4 flex items-start gap-2.5 text-slate-600 dark:text-[#94A3B8]">
                  <X className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
                  <span>{item.traditional}</span>
                </div>
                <div className="md:col-span-5 flex items-start gap-2.5 text-[#0F172A] dark:text-[#EBECF0] font-medium">
                  <Check className="h-4 w-4 text-[#008280] shrink-0 mt-0.5" />
                  <span>{item.uniqueAmaze}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Horizontal Divider: Comparison to Care Plans */}
      <BrandDivider
        variant="cyan"
        width="container"
        spacing="lg"
        label="LIFETIME RELIABILITY"
        sublabel="MANAGED CLOUD CARE"
      />

      {/* Website Care Plans Section */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-3 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>ONGOING CARE // WE DO NOT DISAPPEAR AFTER LAUNCH</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
            PROACTIVE WEBSITE CARE THAT KEEPS YOUR INVESTMENT PERFORMING
          </h2>
          <p className="mt-5 font-sans text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed">
            Choose an ongoing care plan so hosting, security, updates, and search rankings are taken care of each month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {CARE_PLANS.map((plan, i) => {
            const isRec = plan.recommended;
            const glassType = isRec ? 'glass-dominant' : i === 0 ? 'glass-smoke' : 'glass-violet';
            return (
              <div
                key={plan.name}
                data-cursor="card"
                className={`relative rounded-xl border p-8 sm:p-12 flex flex-col justify-between transition-all ${glassType} ${
                  isRec
                    ? 'border-[#16D2C8]/60 shadow-xl scale-[1.01]'
                    : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3 left-6 rounded bg-[#008280] px-3.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                    ★ Dominant Choice · Recommended For Growth
                  </div>
                )}

                <div>
                  <h3 className="font-display text-lg font-semibold text-[#0F172A] dark:text-[#EBECF0] mb-2 uppercase tracking-wide">{plan.name}</h3>
                  <div className="font-mono text-2xl font-bold text-[#008280] mb-6">
                    {currentMarket === 'ca' ? plan.priceCAD : plan.priceMWK}
                  </div>

                  <ul className="space-y-3 font-sans text-xs text-slate-600 dark:text-[#94A3B8] mb-8">
                    {plan.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-[#008280] shrink-0 mt-0.5" />
                        <span className="text-slate-800 dark:text-[#CBD5E1] font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    studioAudio.playClick(900);
                    onNavigate('contact');
                  }}
                  className={`w-full py-3.5 rounded-lg font-mono text-xs font-bold transition-all uppercase ${
                    isRec
                      ? 'cta-image-btn text-white shadow-md hover:scale-[1.01] active:scale-[0.99]'
                      : 'cta-secondary-btn border hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  SELECT {plan.name.toUpperCase()}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subtle Horizontal Divider: Care Plans to Action Banner */}
      <BrandDivider
        variant="gradient"
        width="container"
        spacing="md"
        label="PLAN YOUR PROJECT"
        sublabel="INSTANT ESTIMATES"
      />

      {/* Action Banner with Architectural Image Background */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="cta-image-container group rounded-xl border border-white/10 p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Architectural Background Image */}
          <img
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80"
            alt="Unique Amaze Modern Architectural Glass"
            className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Theme-Adaptive Contrast Scrim */}
          <div className="cta-scrim pointer-events-none absolute inset-0" />

          <div className="relative z-10 max-w-xl">
            <span className="font-mono text-xs text-[#008280] uppercase tracking-widest block mb-2 font-bold">
              READY TO PLAN YOUR PROJECT?
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#EBECF0] uppercase tracking-wide">
              GET AN INSTANT ESTIMATE OR LET OUR PROJECT PLANNER GUIDE YOU.
            </h3>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => {
                studioAudio.playClick(950);
                onNavigate('pricing');
              }}
              className="cta-secondary-btn rounded-lg border px-6 py-3 font-mono text-xs font-bold transition-all uppercase hover:scale-[1.02] active:scale-[0.98]"
            >
              INSTANT ESTIMATE
            </button>
            <button
              onClick={() => {
                studioAudio.playClick(1100);
                onNavigate('planner');
              }}
              className="cta-image-btn group/btn relative overflow-hidden rounded-lg px-6 py-3 font-mono text-xs font-bold text-white shadow-md transition-all flex items-center gap-2 uppercase hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="relative z-10 h-4 w-4 text-white" />
              <span className="relative z-10 text-white">START PROJECT PLANNER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
