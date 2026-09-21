import React, { useState } from 'react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Shield,
  ArrowRight,
  Zap,
  Lock,
  Compass,
} from 'lucide-react';

interface ContactViewProps {
  onNavigate: (route: PageRoute) => void;
  currentMarket: MarketType;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate, currentMarket }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    market: currentMarket === 'ca' ? 'Canada' : 'Malawi',
    timeline: '2–4 weeks',
    message: '',
  });

  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time email validation helper matching studio telemetry standard
  const getEmailValidation = (rawEmail: string) => {
    const trimmed = rawEmail.trim();
    if (!trimmed) {
      return {
        isValid: false,
        isEmpty: true,
        error: 'Email address is required to dispatch brief.',
        code: 'REQUIRED',
      };
    }

    if (!trimmed.includes('@')) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Missing "@" symbol in address (e.g. name@company.com).',
        code: 'SYNTAX_MISSING_AT',
      };
    }

    const parts = trimmed.split('@');
    if (parts.length > 2) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Only one "@" separator permitted in email format.',
        code: 'SYNTAX_MULTIPLE_AT',
      };
    }

    const [prefix, domain] = parts;
    if (!prefix) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Missing mailbox prefix before "@" symbol.',
        code: 'PREFIX_EMPTY',
      };
    }

    if (!domain) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Missing domain host after "@" (e.g. company.com).',
        code: 'DOMAIN_EMPTY',
      };
    }

    if (!domain.includes('.')) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Domain must include an extension (e.g. .com, .ca, .mw).',
        code: 'TLD_MISSING',
      };
    }

    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Domain extension must be at least 2 letters (e.g. .com).',
        code: 'TLD_TOO_SHORT',
      };
    }

    // RFC 5322 compatible regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmed)) {
      return {
        isValid: false,
        isEmpty: false,
        error: 'Please enter a valid work or personal email address.',
        code: 'INVALID_CHARACTERS',
      };
    }

    return {
      isValid: true,
      isEmpty: false,
      error: null,
      code: 'VERIFIED',
    };
  };

  const emailValidation = getEmailValidation(formData.email);
  const showEmailError = emailTouched && !emailValidation.isValid;
  const showEmailSuccess = emailTouched && emailValidation.isValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!emailValidation.isValid) {
      studioAudio.playClick(420);
      const emailEl = document.getElementById('contact-email-input');
      if (emailEl) {
        emailEl.focus();
      }
      return;
    }

    studioAudio.playClick(1000);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* SECTION 1: DIRECT STRATEGY CONSULTATION & BOOKING SUITE (Shade: #050607) */}
      {/* ========================================================================= */}
      <section
        id="contact-section-consultation"
        className="relative w-full bg-[#050607] py-20 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase mb-4 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#008280] animate-pulse" />
              <span>DIRECT ACCESS // FREE STRATEGY CALL</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
              START WITH A CONVERSATION.{' '}
              <span className="text-[#008280] block sm:inline">NO SALES PRESSURE, EVER.</span>
            </h1>

            <p className="mt-6 font-sans text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
              Whether you have a fully formed brief or just the earliest idea of what you need, let’s talk through your goals, your options, and what makes the most commercial sense.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            {/* Left Column: Direct Studio Contact Coordinates */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-xl border border-white/10 glass-smoke p-8 sm:p-10 space-y-7 shadow-xl">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-[#EBECF0] uppercase tracking-wide">
                  STUDIO TELEMETRY &amp; COORDINATES
                </h3>

                {/* Consultation Dialogue Visual Snippet */}
                <div className="relative overflow-hidden rounded-lg border border-white/10 aspect-[16/8] w-full bg-[#080B0E] group shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=75"
                    alt="Architectural studio consultation meeting space with quiet atmospheric lighting"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover brightness-[0.55] contrast-[1.1] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-[#16D2C8]">
                    <span className="tracking-widest uppercase font-semibold">1-ON-1 STRATEGY DIALOGUE</span>
                    <span className="text-[#64748B]">DIRECT ACCESS</span>
                  </div>
                </div>

                <div className="space-y-5 font-sans text-sm">
                  <a
                    href="tel:+14039096447"
                    className="flex items-start gap-3.5 text-[#94A3B8] hover:text-[#16D2C8] transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-[#008280] group-hover:border-[#16D2C8] group-hover:text-[#16D2C8] transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#64748B] block uppercase font-semibold">PHONE &amp; WHATSAPP</span>
                      <span className="text-base font-semibold text-[#EBECF0]">+1 (403) 909-6447</span>
                    </div>
                  </a>

                  <a
                    href="mailto:hello@uniqueamaze.com"
                    className="flex items-start gap-3.5 text-[#94A3B8] hover:text-[#16D2C8] transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-[#008280] group-hover:border-[#16D2C8] group-hover:text-[#16D2C8] transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#64748B] block uppercase font-semibold">EMAIL INQUIRIES</span>
                      <span className="text-base font-semibold text-[#EBECF0]">hello@uniqueamaze.com</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-3.5 text-[#94A3B8]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-[#367588]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#64748B] block uppercase font-semibold">LOCATIONS</span>
                      <span className="text-sm font-semibold text-[#EBECF0] block">
                        Chestermere &amp; Calgary, Alberta, Canada
                      </span>
                      <span className="text-xs text-[#94A3B8] block">Lilongwe &amp; Blantyre, Malawi</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 text-[#94A3B8]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-[#008280]">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#64748B] block uppercase font-semibold">RESPONSE PROTOCOL</span>
                      <span className="text-sm text-[#EBECF0]">
                        Within 24 business hours. You speak directly with our principal specialist.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Action Banner */}
              <div className="rounded-xl border border-[#008280]/40 glass-teal p-7 sm:p-8 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 font-mono text-xs text-[#16D2C8] font-bold uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4" />
                  <span>PREFER INSTANT CHAT?</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  Connect directly via WhatsApp for fast project triage, voice notes, or quick scope feedback.
                </p>
                <a
                  href="https://wa.me/14039096447"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-image-btn inline-flex items-center gap-2 rounded-lg px-5 py-3 font-mono text-xs font-semibold text-white transition-all uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10 text-white">OPEN WHATSAPP CHAT</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Consultation Booking Form with Real-Time Validation */}
            <div className="lg:col-span-7 rounded-xl border border-white/10 glass-dominant p-8 sm:p-14 shadow-2xl">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#008280]/20 text-[#008280] border border-[#008280]/40">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#EBECF0] uppercase tracking-wide">
                    CONSULTATION REQUEST RECEIVED
                  </h3>
                  <p className="font-sans text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#EBECF0]">{formData.name}</strong>. Our specialist will review your project parameters and reach out via {formData.email} within 24 business hours.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmailTouched(false);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          business: '',
                          market: currentMarket === 'ca' ? 'Canada' : 'Malawi',
                          timeline: '2–4 weeks',
                          message: '',
                        });
                      }}
                      className="font-mono text-xs text-[#008280] hover:underline uppercase tracking-wider font-semibold"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rachel Miller"
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email Field with Real-Time Validation & Visual Error States */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-email-input"
                          className="font-mono text-xs text-[#94A3B8] uppercase font-semibold"
                        >
                          Email Address *
                        </label>
                        {showEmailError && (
                          <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                            // FORMAT ERROR
                          </span>
                        )}
                        {showEmailSuccess && (
                          <span className="font-mono text-[10px] font-bold text-[#16D2C8] uppercase tracking-wider">
                            // VERIFIED
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          id="contact-email-input"
                          type="email"
                          required
                          value={formData.email}
                          onBlur={() => setEmailTouched(true)}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (!emailTouched) setEmailTouched(true);
                          }}
                          placeholder="rachel@company.com"
                          aria-invalid={showEmailError}
                          aria-describedby={
                            showEmailError
                              ? 'contact-email-error'
                              : showEmailSuccess
                              ? 'contact-email-success'
                              : undefined
                          }
                          className={`w-full rounded-lg p-3.5 pr-11 text-sm transition-all duration-200 focus:outline-none ${
                            showEmailError
                              ? 'border border-rose-500/80 bg-[#16080A] text-[#FEE2E2] placeholder:text-rose-300/40 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                              : showEmailSuccess
                              ? 'border border-[#16D2C8]/70 bg-[#061416] text-[#EBECF0] focus:border-[#16D2C8] focus:ring-1 focus:ring-[#16D2C8]/30 shadow-[0_0_20px_rgba(22,210,200,0.12)]'
                              : 'border border-white/10 bg-[#0A0D10] text-[#EBECF0] focus:border-[#008280]'
                          }`}
                        />

                        {/* Visual State Icon Right Edge */}
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {showEmailError && (
                            <div className="animate-in zoom-in-75 duration-150 text-rose-400">
                              <AlertCircle className="h-4 w-4" />
                            </div>
                          )}
                          {showEmailSuccess && (
                            <div className="animate-in zoom-in-75 duration-150 text-[#16D2C8]">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                          {!showEmailError && !showEmailSuccess && (
                            <Mail className="h-4 w-4 text-[#64748B]" />
                          )}
                        </div>
                      </div>

                      {/* Real-time Dynamic Error Telemetry Banner */}
                      {showEmailError && (
                        <div
                          id="contact-email-error"
                          role="alert"
                          className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] pt-1 tracking-wide animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                          <span className="font-semibold uppercase tracking-wider">
                            {emailValidation.error}
                          </span>
                        </div>
                      )}

                      {/* Real-time Dynamic Success Telemetry Banner */}
                      {showEmailSuccess && (
                        <div
                          id="contact-email-success"
                          className="flex items-center gap-1.5 text-[#16D2C8] font-mono text-[11px] pt-1 tracking-wide animate-in fade-in duration-200"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#16D2C8]" />
                          <span className="font-semibold uppercase tracking-wider">
                            VALID FORMAT // READY FOR STRATEGY CALL DISPATCH
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Business Name Field */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                        Business / Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.business}
                        onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                        placeholder="e.g. Miller &amp; Co"
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (403) 555-0192"
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Region Selector */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                        Your Region
                      </label>
                      <select
                        value={formData.market}
                        onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none transition-colors"
                      >
                        <option value="Canada">Canada (Chestermere, Calgary, Alberta, Other)</option>
                        <option value="Malawi">Malawi (Lilongwe, Blantyre, Other)</option>
                        <option value="International">Other / International</option>
                      </select>
                    </div>

                    {/* Target Timeline */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                        Target Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none transition-colors"
                      >
                        <option value="ASAP">ASAP / Urgent Launch</option>
                        <option value="2–4 weeks">2–4 weeks (Standard)</option>
                        <option value="1–2 months">1–2 months</option>
                        <option value="Flexible">Flexible / Exploring</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Brief Field */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                      Tell us about your project or paste your brief
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you do, what your current website lacks, and what success looks like for you..."
                      className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-[#008280] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Form Submission Button with Image Texture */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-image-btn w-full flex items-center justify-center gap-2 rounded-lg py-4 font-mono text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50 uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span className="relative z-10">DISPATCHING REQUEST...</span>
                    ) : (
                      <>
                        <Send className="relative z-10 h-4 w-4 text-white" />
                        <span className="relative z-10 text-white">SCHEDULE MY FREE STRATEGY CALL</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PROTOCOL STANDARDS & RESPONSE ASSURANCE (Shade: #080C11)       */}
      {/* ========================================================================= */}
      <section
        id="contact-section-sla"
        className="relative w-full bg-[#080C11] border-t border-white/[0.08] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 sm:mb-18 space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#16D2C8] tracking-widest uppercase font-semibold">
              <Shield className="h-3.5 w-3.5 text-[#16D2C8]" />
              <span>// PROTOCOL GUARANTEES &amp; ENGAGEMENT SLA</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#EBECF0] tracking-tight">
              The Unique Amaze Standard of Engagement
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Every inquiry is treated as a high-intent consultation. Here is what you can expect the moment you reach out:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-[#008280]/60 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-[#008280]/15 border border-[#008280]/30 flex items-center justify-center text-[#16D2C8]">
                <Clock className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                24h Guaranteed Turnaround
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                You speak directly with our principal specialist within one business day. No intermediaries or delay queues.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-[#008280]/60 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-[#008280]/15 border border-[#008280]/30 flex items-center justify-center text-[#16D2C8]">
                <Lock className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                Strict NDA &amp; Privacy
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Your business brief, concept ideas, and proprietary workflows are kept entirely confidential from day one.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-[#008280]/60 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-[#008280]/15 border border-[#008280]/30 flex items-center justify-center text-[#16D2C8]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                Commercial Clarity
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Transparent milestones, realistic timelines, and firm pricing estimates with zero hidden surprises.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-[#008280]/60 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-[#008280]/15 border border-[#008280]/30 flex items-center justify-center text-[#16D2C8]">
                <Compass className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                Dual Studio Availability
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Continuous business-hour coverage across North America (MST) and Southern Africa (CAT).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: ALTERNATIVE FAST-TRACK PATHWAYS                                 */}
      {/* ========================================================================= */}
      <section
        id="contact-section-pathways"
        className="relative w-full bg-slate-50 dark:bg-[#06090D] border-t border-slate-200 dark:border-white/[0.08] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Pathway 1: Project Planner with Architectural Background */}
            <div className="cta-image-container group rounded-xl border border-slate-200 dark:border-white/10 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Project Planner Concept"
                className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="cta-scrim pointer-events-none absolute inset-0" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase font-bold">
                  <Zap className="h-3.5 w-3.5 text-[#008280]" />
                  <span>PREFER A GUIDED SPECIFICATION?</span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-[#0F172A] dark:text-[#EBECF0]">
                  Launch the 2-Minute Project Planner
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Configure your target audience, required features, CMS needs, and get an instant transparent investment estimate tailored to your regional currency.
                </p>
              </div>
              <div className="relative z-10 pt-6">
                <button
                  onClick={() => {
                    studioAudio.playClick(950);
                    onNavigate('planner');
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008280] hover:text-[#00706E] uppercase tracking-wider transition-colors"
                >
                  <span>LAUNCH INTERACTIVE PLANNER</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Pathway 2: WhatsApp Chat with Architectural Background */}
            <div className="cta-image-container group rounded-xl border border-slate-200 dark:border-white/10 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Direct Mobile Triage"
                className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="cta-scrim pointer-events-none absolute inset-0" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#008280] tracking-widest uppercase font-bold">
                  <MessageSquare className="h-3.5 w-3.5 text-[#008280]" />
                  <span>URGENT TIMELINE / DIRECT WHATSAPP</span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-[#0F172A] dark:text-[#EBECF0]">
                  Immediate Mobile Triage
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                  Have an urgent launch deadline or want to leave a quick voice note with your current site link? Message our direct studio line for prompt triage.
                </p>
              </div>
              <div className="relative z-10 pt-6">
                <a
                  href="https://wa.me/14039096447"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#008280] hover:text-[#00706E] uppercase tracking-wider transition-colors"
                >
                  <span>OPEN DIRECT WHATSAPP</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

