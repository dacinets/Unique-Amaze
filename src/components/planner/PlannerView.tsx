import React, { useState } from 'react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { Sparkles, Check, ArrowRight, ArrowLeft, RotateCcw, Copy, CheckCircle2, User, Building, Mail, Phone, Globe, MessageSquare } from 'lucide-react';

interface PlannerViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ onNavigate, currentMarket }) => {
  const STEPS = [
    {
      key: 'market',
      q: 'Where is your business based?',
      opts: ['Canada', 'Malawi'],
    },
    {
      key: 'type',
      q: 'What kind of website do you need?',
      opts: [
        'Business website',
        'Personal brand',
        'Wellness / clinic',
        'Trades / local service',
        'Restaurant / hospitality',
        'Real estate',
        'Ecommerce / online store',
        'Church or ministry',
        'NGO / nonprofit',
        'School / education',
        'Something else',
      ],
    },
    {
      key: 'goal',
      q: 'What is the main goal of this website?',
      opts: [
        'Get more leads',
        'Get more bookings',
        'Sell online',
        'Look more premium',
        'Explain services clearly',
        'Attract donors or members',
        'Recruit or hire',
        'Launch a new brand',
        'Replace an outdated site',
      ],
    },
    {
      key: 'situation',
      q: 'What best describes your current situation?',
      opts: [
        'No website yet',
        'Outdated website',
        'Website underperforms',
        'Rebranding',
        'Expanding services',
        'New business launch',
        'Need urgent replacement',
        'Not sure',
      ],
    },
    {
      key: 'pages',
      q: 'How many pages do you expect?',
      opts: ['1–3 pages', '4–8 pages', '9–15 pages', '16+ pages', 'Not sure'],
    },
    {
      key: 'func',
      q: 'Do you need advanced functionality?',
      opts: [
        'None (Pure display)',
        'Contact form only',
        'Smart intake form',
        'Online booking system',
        'Ecommerce / checkout',
        'Membership / portal',
        'Donation system',
        'CRM integration',
        'Automation / AI workflow',
      ],
    },
    {
      key: 'finish',
      q: 'What level of finish do you want?',
      opts: [
        'Clean and professional',
        'Refined and modern',
        'High-end visual experience',
        'Advanced interactive / 3D-inspired',
      ],
    },
    {
      key: 'timeline',
      q: 'When do you want to launch?',
      opts: ['ASAP (Rush)', '2–4 weeks', '1–2 months', '2–3 months', 'Flexible'],
    },
  ];

  const HEAVY_FUNC = [
    'Online booking system',
    'Ecommerce / checkout',
    'Membership / portal',
    'Donation system',
    'CRM integration',
    'Automation / AI workflow',
  ];

  // Questionnaire State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    market: currentMarket === 'ca' ? 'Canada' : 'Malawi',
  });

  // Client Details Form State
  const [clientDetails, setClientDetails] = useState({
    name: '',
    business: '',
    email: '',
    phone: '',
    website: '',
    preferredContact: 'Email',
    consent: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showHandoff, setShowHandoff] = useState<boolean>(false);

  const handleSelectOption = (key: string, val: string) => {
    studioAudio.playClick(900);
    setAnswers((prev) => ({ ...prev, [key]: val }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    studioAudio.playClick(600);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    studioAudio.playClick(750);
    setCurrentStep(0);
    setAnswers({ market: currentMarket === 'ca' ? 'Canada' : 'Malawi' });
    setIsCopied(false);
    setShowHandoff(false);
  };

  // Recommendation engine
  const recommendation = React.useMemo(() => {
    const isMW = answers.market === 'Malawi';
    const PRICES = isMW
      ? ['MWK 500,000 – 1,200,000', 'MWK 1,500,000 – 3,000,000', 'MWK 3,500,000 – 5,000,000']
      : ['CAD $1,200 – $2,000', 'CAD $2,500 – $4,500', 'CAD $4,500 – $6,000'];
    const NAMES = ['Starter Website', 'Business Website', isMW ? 'Premium Experience' : 'Intelligent Experience'];
    const TIMES = ['1–2 weeks', '2–4 weeks', '4–6 weeks'];

    const funcVal = answers.func || '';
    const isHeavy = HEAVY_FUNC.some((h) => funcVal.includes(h));
    const isCustom = isHeavy || answers.pages === '16+ pages' || answers.goal === 'Sell online';

    let score = 0;
    let unsureCount = 0;

    if (answers.pages === '1–3 pages') score -= 2;
    else if (answers.pages === '9–15 pages') score += 2;
    else if (answers.pages === 'Not sure') unsureCount++;

    if (answers.func === 'None (Pure display)') score -= 1;
    else if (answers.func === 'Smart intake form') score += 1;

    if (answers.finish === 'Clean and professional') score -= 1;
    else if (answers.finish === 'High-end visual experience') score += 2;
    else if (answers.finish === 'Advanced interactive / 3D-inspired') score += 3;

    let tier = score <= -2 ? 0 : score >= 2 ? 2 : 1;
    if (answers.finish === 'Advanced interactive / 3D-inspired') tier = Math.max(tier, 2);

    let confidence = 94 - unsureCount * 8;
    confidence = Math.max(70, Math.min(96, confidence));

    if (isCustom) {
      return {
        pkg: 'Custom / Complex',
        price: 'Request a Quote',
        time: 'Timeline after discovery',
        confidence,
        isCustom: true,
        reason: 'Your specific advanced functionality requires bespoke discovery before we price it.',
      };
    }

    return {
      pkg: NAMES[tier],
      price: PRICES[tier],
      time: TIMES[tier],
      confidence,
      isCustom: false,
      reason: '',
    };
  }, [answers]);

  const whyFitsBullets = React.useMemo(() => {
    const bullets: string[] = [];
    if (answers.goal) {
      bullets.push(`Aligned directly with your primary focus: ${answers.goal.toLowerCase()}.`);
    }
    if (answers.pages) {
      bullets.push(`Calibrated for your anticipated page volume (${answers.pages}).`);
    }
    if (answers.func) {
      bullets.push(`Configured around your functionality requirement: ${answers.func}.`);
    }
    if (answers.finish) {
      bullets.push(`Engineered to deliver a ${answers.finish.toLowerCase()} aesthetic.`);
    }
    return bullets.slice(0, 4);
  }, [answers]);

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!clientDetails.name.trim()) errors.name = 'Please provide your full name';
    if (!clientDetails.business.trim()) errors.business = 'Please provide your business or project name';
    if (!clientDetails.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientDetails.email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!clientDetails.phone.trim()) errors.phone = 'Please provide a phone or WhatsApp number';
    if (!clientDetails.consent) errors.consent = 'Please confirm consent so we can reply';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateBriefText = () => {
    return `UNIQUE AMAZE — PROJECT BRIEF (PREPARED BY SAGE)
==================================================

CLIENT CONTACT:
- Name: ${clientDetails.name}
- Business / Project: ${clientDetails.business}
- Email: ${clientDetails.email}
- Phone / WhatsApp: ${clientDetails.phone}
- Region: ${answers.market}
- Existing Website: ${clientDetails.website || 'None'}
- Preferred Contact Method: ${clientDetails.preferredContact}

PROJECT SPECIFICATION:
- Website Type: ${answers.type || 'N/A'}
- Primary Goal: ${answers.goal || 'N/A'}
- Current Situation: ${answers.situation || 'N/A'}
- Anticipated Pages: ${answers.pages || 'N/A'}
- Functionality Required: ${answers.func || 'N/A'}
- Level of Finish: ${answers.finish || 'N/A'}
- Target Timeline: ${answers.timeline || 'N/A'}

CONSULTANT RECOMMENDATION:
- Recommended Package: ${recommendation.pkg}
- Estimated Investment: ${recommendation.price}
- Estimated Timeline: ${recommendation.time}
- Fit Confidence Score: ${recommendation.confidence}%
${recommendation.reason ? `- Notes: ${recommendation.reason}` : ''}

Generated via Unique Amaze AI Planner. Ready for discovery call review.`;
  };

  const handlePrepareBrief = () => {
    studioAudio.playClick(1000);
    if (!validateForm()) return;

    const brief = generateBriefText();
    navigator.clipboard.writeText(brief).then(() => {
      setIsCopied(true);
      setShowHandoff(true);
    });
  };

  const isComplete = currentStep >= STEPS.length;

  return (
    <div className="relative w-full py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-20 sm:mb-28">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-[#008280]" />
            <span>AI PROJECT PLANNER // GUIDED BY SAGE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
            NO TEDIOUS INTAKE FORMS.{' '}
            <span className="text-[#008280] block sm:inline">A CONSULTATION THAT PLANS YOUR PROJECT.</span>
          </h1>

          <p className="mt-6 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Answer a few strategic questions. Sage analyzes your goals, recommends the ideal package and structure, and prepares a tailored brief for your free call.
          </p>
        </div>

        {/* Main Planner Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          {/* Main Interactive Stage (Questions or Result) */}
          <div className="lg:col-span-8 rounded-xl border border-white/10 glass-dominant p-8 sm:p-14 shadow-2xl">
            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-white/10 mb-10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#008280] via-[#16D2C8] to-[#367588] transition-all duration-300"
                style={{
                  width: `${Math.round(((currentStep + 1) / (STEPS.length + 1)) * 100)}%`,
                }}
              />
            </div>

            {!isComplete ? (
              /* ACTIVE QUESTION STEP */
              <div className="space-y-7 animate-in fade-in duration-200">
                <div className="flex justify-between items-center font-mono text-xs text-[#64748B] font-semibold">
                  <span className="text-[#16D2C8]">
                    QUESTION {currentStep + 1} OF {STEPS.length}
                  </span>
                  <span className="text-white/40 tracking-wider">// {STEPS[currentStep].key.toUpperCase()}</span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#EBECF0] uppercase tracking-wide">
                  {STEPS[currentStep].q}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  {STEPS[currentStep].opts.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(STEPS[currentStep].key, opt)}
                      className="rounded-xl border border-white/10 glass-smoke p-4 sm:p-5 text-left font-sans text-sm text-[#EBECF0] hover:border-[#16D2C8]/60 hover:bg-[#16D2C8]/10 transition-all flex items-center justify-between group shadow-sm"
                    >
                      <span>{opt}</span>
                      <ArrowRight className="h-4 w-4 text-[#16D2C8] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                {currentStep > 0 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] hover:text-[#EBECF0] pt-4 uppercase"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to previous question</span>
                  </button>
                )}
              </div>
            ) : (
              /* COMPLETED BRIEF & RECOMMENDATION */
              <div className="space-y-10 animate-in fade-in duration-300">
                <div className="rounded-lg border border-[#008280]/40 glass-tier-2 p-8 sm:p-10 space-y-7">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-widest text-[#008280] font-semibold">
                        RECOMMENDED ARCHITECTURAL FIT
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#EBECF0] mt-1 uppercase tracking-wide">
                        {recommendation.pkg}
                      </h2>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs text-[#94A3B8] block font-semibold">FIT CONFIDENCE</span>
                      <span className="font-mono text-xl font-bold text-[#008280]">
                        {recommendation.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-4 border-t border-b border-white/10 py-5 font-mono text-xs">
                    <span className="text-[#94A3B8]">ESTIMATED STARTING RANGE:</span>
                    <span className="text-xl font-bold text-[#EBECF0]">{recommendation.price}</span>
                    <span className="text-[#64748B]">|</span>
                    <span className="text-[#008280]">{recommendation.time}</span>
                  </div>

                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[#64748B] uppercase tracking-wider block font-semibold">
                      WHY SAGE RECOMMENDS THIS:
                    </span>
                    <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-[#EBECF0]">
                      {whyFitsBullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-[#008280] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Answers Snapshot Summary */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#64748B] font-semibold">
                    PROJECT SNAPSHOT
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 font-mono text-xs">
                    {Object.entries(answers).map(([k, v]) => (
                      <div key={k} className="rounded-lg border border-white/[0.08] bg-[#0E1217] p-3.5">
                        <span className="text-[#64748B] block uppercase text-[10px]">{k}</span>
                        <span className="text-[#EBECF0] truncate block font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Contact Capture Form */}
                <div className="space-y-5 pt-8 border-t border-white/10">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#008280] font-semibold">
                    YOUR DETAILS // PREPARE YOUR CONSULTATION BRIEF
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[#94A3B8]">Full Name *</label>
                      <input
                        type="text"
                        value={clientDetails.name}
                        onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                        placeholder="Rachel Miller"
                        className="w-full rounded-lg border border-white/10 bg-[#0E1217] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none"
                      />
                      {formErrors.name && <p className="text-[11px] text-red-400">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#94A3B8]">Business / Project Name *</label>
                      <input
                        type="text"
                        value={clientDetails.business}
                        onChange={(e) => setClientDetails({ ...clientDetails, business: e.target.value })}
                        placeholder="Miller Wellness Clinic"
                        className="w-full rounded-lg border border-white/10 bg-[#0E1217] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none"
                      />
                      {formErrors.business && (
                        <p className="text-[11px] text-red-400">{formErrors.business}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#94A3B8]">Email Address *</label>
                      <input
                        type="email"
                        value={clientDetails.email}
                        onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                        placeholder="rachel@millerwellness.ca"
                        className="w-full rounded-lg border border-white/10 bg-[#0E1217] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none"
                      />
                      {formErrors.email && <p className="text-[11px] text-red-400">{formErrors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#94A3B8]">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        value={clientDetails.phone}
                        onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                        placeholder="+1 (403) 555-0192"
                        className="w-full rounded-lg border border-white/10 bg-[#0E1217] p-3 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none"
                      />
                      {formErrors.phone && <p className="text-[11px] text-red-400">{formErrors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[#94A3B8]">Current Website (Optional)</label>
                      <input
                        type="url"
                        value={clientDetails.website}
                        onChange={(e) => setClientDetails({ ...clientDetails, website: e.target.value })}
                        placeholder="https://mycurrentsite.com"
                        className="w-full rounded-lg border border-white/10 bg-[#0E1217] p-3 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-mono text-[#94A3B8] block font-semibold">Preferred Contact Channel:</label>
                    <div className="flex flex-wrap gap-2">
                      {['Email', 'Phone Call', 'WhatsApp', 'Google Meet'].map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => {
                            studioAudio.playClick(800);
                            setClientDetails({ ...clientDetails, preferredContact: ch });
                          }}
                          className={`rounded-lg px-4 py-2 font-mono text-xs transition-all ${
                            clientDetails.preferredContact === ch
                              ? 'bg-[#008280] text-white font-semibold'
                              : 'border border-white/10 bg-[#0E1217] text-[#94A3B8]'
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 pt-2 text-xs text-[#94A3B8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clientDetails.consent}
                      onChange={(e) => setClientDetails({ ...clientDetails, consent: e.target.checked })}
                      className="mt-0.5 rounded border-white/20 bg-white/5 text-[#008280] accent-[#008280]"
                    />
                    <span>
                      I agree that Unique Amaze may contact me regarding this project brief. No spam, ever.
                    </span>
                  </label>
                  {formErrors.consent && <p className="text-[11px] text-red-400">{formErrors.consent}</p>}
                </div>

                {/* Final Submission & Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handlePrepareBrief}
                    className="cta-image-btn flex items-center gap-2 rounded-lg px-8 py-3.5 font-mono text-xs font-bold text-white shadow-lg transition-all uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isCopied ? (
                      <span className="relative z-10 flex items-center gap-2 text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        <span>BRIEF PREPARED &amp; COPIED TO CLIPBOARD</span>
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2 text-white">
                        <Copy className="h-4 w-4 text-white" />
                        <span>PREPARE &amp; COPY MY PROJECT BRIEF →</span>
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] hover:text-[#EBECF0] uppercase"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Start Over</span>
                  </button>
                </div>

                {/* Handoff Drawer */}
                {showHandoff && (
                  <div className="rounded-lg border border-[#008280]/50 bg-[#008280]/10 p-6 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#008280] font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>YOUR BRIEF IS READY AND COPIED!</span>
                    </div>
                    <p className="font-sans text-xs sm:text-sm text-[#EBECF0] leading-relaxed">
                      You can paste your brief directly into our contact form, send it via WhatsApp, or keep it handy for your free strategy call with our specialist.
                    </p>
                    <button
                      onClick={() => {
                        studioAudio.playClick(1000);
                        onNavigate('contact');
                      }}
                      className="cta-image-btn group/btn relative overflow-hidden inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-mono text-xs font-bold text-white uppercase tracking-wider shadow-md hover:scale-[1.01]"
                    >
                      <span className="relative z-10 text-white">CONTINUE TO BOOK FREE CALL</span>
                      <ArrowRight className="relative z-10 h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column / Sage AI Guide Companion */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-[#008280]/40 glass-teal p-7 sm:p-9 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#008280]/25 border border-[#16D2C8]/40 shadow-[0_0_12px_rgba(22,210,200,0.25)]">
                  <Sparkles className="h-5 w-5 text-[#16D2C8]" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-[#EBECF0] uppercase tracking-wide">Sage</h3>
                  <p className="font-mono text-[10px] text-[#16D2C8] uppercase tracking-wider font-semibold">
                    YOUR PROJECT GUIDE
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.08] glass-smoke p-4 text-xs font-sans text-[#94A3B8] leading-relaxed space-y-2">
                <p>
                  "I help translate business requirements into clean architectural scopes. No marketing fluff, no surprise fees — just an honest, transparent baseline."
                </p>
                <div className="pt-2 border-t border-white/[0.06] font-mono text-[10px] text-[#16D2C8] font-semibold">
                  STATUS: LIVE CONSULTANT
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16D2C8]" />
                  <span>Canada &amp; Malawi price books</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16D2C8]" />
                  <span>1-to-1 specialist dedicated focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#16D2C8]" />
                  <span>Lighthouse 90+ performance target</span>
                </div>
              </div>
            </div>

            {/* Strategic Diagnostic Artifact Card */}
            <div className="rounded-xl border border-white/10 glass-smoke p-5 space-y-3.5 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#16D2C8] uppercase tracking-wider">
                <span className="font-semibold">ARCHITECTURE BLUEPRINT</span>
                <span className="text-[#64748B]">DIAGNOSTIC</span>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-white/10 aspect-[16/9] w-full bg-[#080B0E] group">
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=700&q=75"
                  alt="Digital interface wireframe architecture and structural planning diagram"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover brightness-[0.55] contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-white/60">
                  <span>DISCOVERY MAPPING</span>
                  <span className="text-[#16D2C8]">100% TAILORED</span>
                </div>
              </div>

              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Every brief generates a calibrated information architecture blueprint before a single line of production code is authored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
