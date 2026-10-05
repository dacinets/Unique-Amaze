import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, MarketType } from '../../types';
import { studioAudio } from '../../utils/audio';
import { contactFormSchema, ContactFormData } from '../../utils/validationSchemas';
import { DeliveryConfirmationMotion } from '../common/DeliveryConfirmationMotion';
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
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    business: '',
    market: currentMarket === 'ca' ? 'Canada' : 'Malawi',
    timeline: '2–4 weeks',
    message: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [leadUuid, setLeadUuid] = useState<string | null>(null);

  // Validate a single field using Zod schema shape
  const validateSingleField = (field: keyof ContactFormData, value: unknown) => {
    const fieldSchema = contactFormSchema.shape[field];
    const parsed = fieldSchema.safeParse(value);
    if (!parsed.success) {
      return parsed.error.issues[0]?.message || 'Invalid value';
    }
    return null;
  };

  // Validate entire form with Zod
  const validateWholeForm = (data: ContactFormData) => {
    const result = contactFormSchema.safeParse(data);
    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const fieldName = issue.path[0] as string;
      if (fieldName && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    }
    setFieldErrors(errors);
    return false;
  };

  // Real-time change handler with immediate Zod feedback
  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Validate field in real-time
    const err = validateSingleField(field, value);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next[field] = err;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleFieldBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateSingleField(field, formData[field]);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (err) {
        next[field] = err;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const isEmailValid = !validateSingleField('email', formData.email) && formData.email.trim().length > 0;
  const showEmailError = touched.email && !!fieldErrors.email;
  const showEmailSuccess = touched.email && isEmailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Mark all required fields as touched
    const allTouched = {
      name: true,
      email: true,
      business: true,
      phone: true,
      market: true,
      timeline: true,
      message: true,
    };
    setTouched(allTouched);

    const isValid = validateWholeForm(formData);

    if (!isValid) {
      studioAudio.playClick(420);
      // Focus first element that has an error
      const firstInvalidField = ['name', 'email', 'business', 'phone', 'message'].find(
        (f) => !!fieldErrors[f] || !!validateSingleField(f as keyof ContactFormData, formData[f as keyof ContactFormData])
      );
      if (firstInvalidField) {
        const el = document.getElementById(`contact-${firstInvalidField}-input`);
        el?.focus();
      }
      return;
    }

    studioAudio.playClick(1000);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone?.trim() || '',
          business_name: formData.business.trim(),
          timeline: formData.timeline,
          message: formData.message.trim(),
          market: currentMarket,
          website_url: honeypot, // Honeypot trap
          consent: true
        })
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        studioAudio.playBlast();
        setIsSubmitted(true);
        if (result.lead_uuid) {
          setLeadUuid(result.lead_uuid);
        }
      } else {
        setServerError(result?.error || result?.message || 'Server encountered an error. Please try again or email hello@uniqueamaze.com.');
      }
    } catch {
      setServerError('Network request failed. Please verify your connection or email hello@uniqueamaze.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* SECTION 1: DIRECT STRATEGY CONSULTATION & BOOKING SUITE (Shade: #050607) */}
      {/* ========================================================================= */}
      <section
        id="contact-section-consultation"
        className="relative w-full bg-[#050607] pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-16 sm:mb-24">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase mb-4 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Free Strategy Consultation</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide text-[#EBECF0] leading-[1.12] uppercase">
              START WITH A CONVERSATION.{' '}
              <span className="text-zinc-400 block sm:inline">NO SALES PRESSURE.</span>
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
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-zinc-300">
                    <span className="tracking-widest uppercase font-semibold">1-on-1 Strategy Dialogue</span>
                    <span className="text-[#64748B]">DIRECT ACCESS</span>
                  </div>
                </div>

                <div className="space-y-5 font-sans text-sm">
                  <a
                    href="tel:+14039096447"
                    className="flex items-start gap-3.5 text-[#94A3B8] hover:text-white transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-zinc-400 group-hover:border-white/30 group-hover:text-white transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#64748B] block uppercase font-semibold">PHONE &amp; WHATSAPP</span>
                      <span className="text-base font-semibold text-[#EBECF0]">+1 (403) 909-6447</span>
                    </div>
                  </a>

                  <a
                    href="mailto:hello@uniqueamaze.com"
                    className="flex items-start gap-3.5 text-[#94A3B8] hover:text-white transition-colors group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-zinc-400 group-hover:border-white/30 group-hover:text-white transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-mono text-xs text-[#64748B] block uppercase font-semibold">EMAIL INQUIRIES</span>
                      <span className="text-base font-semibold text-[#EBECF0]">hello@uniqueamaze.com</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-3.5 text-[#94A3B8]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-zinc-400">
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E1217] border border-white/10 text-zinc-400">
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
              <div className="rounded-xl border border-white/10 glass-smoke p-7 sm:p-8 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-200 font-bold uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
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
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="submission-confirmed"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <DeliveryConfirmationMotion
                      title="CONSULTATION REQUEST CONFIRMED"
                      subtitle={`Thank you, ${formData.name}. Your project parameters have been securely dispatched and logged to our studio pipeline without reloading this page. Our principal specialist will review your scope and follow up directly.`}
                      referenceId={leadUuid}
                      clientName={formData.name}
                      clientEmail={formData.email}
                      badgeLabel="DISPATCH VERIFIED · ZERO RELOAD"
                      metadataItems={[
                        { label: 'CLIENT', value: formData.name },
                        { label: 'PROJECT', value: formData.business },
                        { label: 'REGION', value: formData.market },
                        { label: 'TIMELINE', value: formData.timeline },
                      ]}
                      primaryAction={{
                        label: 'EXPLORE OUR PROCESS',
                        onClick: () => onNavigate('process'),
                      }}
                      secondaryAction={{
                        label: 'SEND ANOTHER INQUIRY',
                        onClick: () => {
                          setIsSubmitted(false);
                          setTouched({});
                          setFieldErrors({});
                          setServerError(null);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            business: '',
                            market: currentMarket === 'ca' ? 'Canada' : 'Malawi',
                            timeline: '2–4 weeks',
                            message: '',
                          });
                        },
                      }}
                      showWhatsAppCta={true}
                    />
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-inquiry-form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 font-sans"
                  >
                  {/* Honeypot field (hidden from real users, traps bots) */}
                  <input
                    type="text"
                    name="website_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0"
                    aria-hidden="true"
                  />

                  {serverError && (
                    <div
                      role="alert"
                      className="rounded-lg border border-rose-500/50 bg-rose-950/40 p-4 font-sans text-xs text-rose-200 flex items-center gap-3 animate-in fade-in"
                    >
                      <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-name-input"
                          className="font-mono text-xs text-[#94A3B8] uppercase font-semibold"
                        >
                          Your Name *
                        </label>
                        {touched.name && fieldErrors.name && (
                          <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                            Required
                          </span>
                        )}
                        {touched.name && !fieldErrors.name && formData.name.trim().length >= 2 && (
                          <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Valid
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="contact-name-input"
                          type="text"
                          required
                          value={formData.name}
                          onBlur={() => handleFieldBlur('name')}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          placeholder="e.g. Rachel Miller"
                          aria-invalid={touched.name && !!fieldErrors.name}
                          aria-describedby={touched.name && fieldErrors.name ? 'contact-name-error' : undefined}
                          className={`w-full rounded-lg p-3.5 pr-10 text-sm transition-all duration-200 focus:outline-none ${
                            touched.name && fieldErrors.name
                              ? 'border border-rose-500/80 bg-[#16080A] text-[#FEE2E2] placeholder:text-rose-300/40 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                              : touched.name && !fieldErrors.name && formData.name.trim().length >= 2
                              ? 'border border-white/20 bg-white/5 text-[#EBECF0] focus:border-white/40'
                              : 'border border-white/10 bg-[#0A0D10] text-[#EBECF0] focus:border-white/30'
                          }`}
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {touched.name && fieldErrors.name && (
                            <AlertCircle className="h-4 w-4 text-rose-400 animate-in zoom-in-75 duration-150" />
                          )}
                          {touched.name && !fieldErrors.name && formData.name.trim().length >= 2 && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-in zoom-in-75 duration-150" />
                          )}
                        </div>
                      </div>
                      {touched.name && fieldErrors.name && (
                        <div
                          id="contact-name-error"
                          role="alert"
                          className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] pt-1 tracking-wide animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                          <span className="font-semibold uppercase tracking-wider">{fieldErrors.name}</span>
                        </div>
                      )}
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
                            Invalid format
                          </span>
                        )}
                        {showEmailSuccess && (
                          <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          id="contact-email-input"
                          type="email"
                          required
                          value={formData.email}
                          onBlur={() => handleFieldBlur('email')}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
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
                              ? 'border border-white/20 bg-white/5 text-[#EBECF0] focus:border-white/40 focus:ring-1 focus:ring-white/20'
                              : 'border border-white/10 bg-[#0A0D10] text-[#EBECF0] focus:border-white/30'
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
                            <div className="animate-in zoom-in-75 duration-150 text-emerald-400">
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
                            {fieldErrors.email}
                          </span>
                        </div>
                      )}

                      {/* Real-time Dynamic Success Telemetry Banner */}
                      {showEmailSuccess && (
                        <div
                          id="contact-email-success"
                          className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] pt-1 tracking-wide animate-in fade-in duration-200"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span className="font-semibold uppercase tracking-wider">
                            Valid email format
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Business Name Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-business-input"
                          className="font-mono text-xs text-[#94A3B8] uppercase font-semibold"
                        >
                          Business / Project Name *
                        </label>
                        {touched.business && fieldErrors.business && (
                          <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                            Required
                          </span>
                        )}
                        {touched.business && !fieldErrors.business && formData.business.trim().length >= 2 && (
                          <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            Valid
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="contact-business-input"
                          type="text"
                          required
                          value={formData.business}
                          onBlur={() => handleFieldBlur('business')}
                          onChange={(e) => handleFieldChange('business', e.target.value)}
                          placeholder="e.g. Miller &amp; Co"
                          aria-invalid={touched.business && !!fieldErrors.business}
                          aria-describedby={touched.business && fieldErrors.business ? 'contact-business-error' : undefined}
                          className={`w-full rounded-lg p-3.5 pr-10 text-sm transition-all duration-200 focus:outline-none ${
                            touched.business && fieldErrors.business
                              ? 'border border-rose-500/80 bg-[#16080A] text-[#FEE2E2] placeholder:text-rose-300/40 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                              : touched.business && !fieldErrors.business && formData.business.trim().length >= 2
                              ? 'border border-white/20 bg-white/5 text-[#EBECF0] focus:border-white/40'
                              : 'border border-white/10 bg-[#0A0D10] text-[#EBECF0] focus:border-white/30'
                          }`}
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {touched.business && fieldErrors.business && (
                            <AlertCircle className="h-4 w-4 text-rose-400 animate-in zoom-in-75 duration-150" />
                          )}
                          {touched.business && !fieldErrors.business && formData.business.trim().length >= 2 && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-in zoom-in-75 duration-150" />
                          )}
                        </div>
                      </div>
                      {touched.business && fieldErrors.business && (
                        <div
                          id="contact-business-error"
                          role="alert"
                          className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] pt-1 tracking-wide animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                          <span className="font-semibold uppercase tracking-wider">{fieldErrors.business}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-phone-input"
                          className="font-mono text-xs text-[#94A3B8] uppercase font-semibold"
                        >
                          Phone / WhatsApp (Optional)
                        </label>
                        {touched.phone && fieldErrors.phone && (
                          <span className="font-mono text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                            Invalid
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="contact-phone-input"
                          type="tel"
                          value={formData.phone || ''}
                          onBlur={() => handleFieldBlur('phone')}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          placeholder="+1 (403) 555-0192"
                          aria-invalid={touched.phone && !!fieldErrors.phone}
                          aria-describedby={touched.phone && fieldErrors.phone ? 'contact-phone-error' : undefined}
                          className={`w-full rounded-lg p-3.5 pr-10 text-sm transition-all duration-200 focus:outline-none ${
                            touched.phone && fieldErrors.phone
                              ? 'border border-rose-500/80 bg-[#16080A] text-[#FEE2E2] placeholder:text-rose-300/40 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40'
                              : 'border border-white/10 bg-[#0A0D10] text-[#EBECF0] focus:border-slate-400'
                          }`}
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {touched.phone && fieldErrors.phone ? (
                            <AlertCircle className="h-4 w-4 text-rose-400 animate-in zoom-in-75 duration-150" />
                          ) : (
                            <Phone className="h-4 w-4 text-[#64748B]" />
                          )}
                        </div>
                      </div>
                      {touched.phone && fieldErrors.phone && (
                        <div
                          id="contact-phone-error"
                          role="alert"
                          className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] pt-1 tracking-wide animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                          <span className="font-semibold uppercase tracking-wider">{fieldErrors.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Region Selector */}
                    <div className="space-y-1.5">
                      <label className="font-mono text-xs text-[#94A3B8] uppercase font-semibold">
                        Your Region
                      </label>
                      <select
                        value={formData.market}
                        onChange={(e) => handleFieldChange('market', e.target.value as 'Canada' | 'Malawi' | 'International')}
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-slate-400 focus:outline-none transition-colors"
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
                        onChange={(e) => handleFieldChange('timeline', e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#0A0D10] p-3.5 text-sm text-[#EBECF0] focus:border-slate-400 focus:outline-none transition-colors"
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
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="contact-message-input"
                        className="font-mono text-xs text-[#94A3B8] uppercase font-semibold"
                      >
                        Tell us about your project or paste your brief *
                      </label>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className={formData.message.trim().length >= 10 ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                          {formData.message.trim().length}/10 min chars
                        </span>
                        {touched.message && fieldErrors.message && (
                          <span className="text-rose-400 font-bold uppercase tracking-wider">
                            Min 10 chars
                          </span>
                        )}
                      </div>
                    </div>
                    <textarea
                      id="contact-message-input"
                      rows={4}
                      required
                      value={formData.message}
                      onBlur={() => handleFieldBlur('message')}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Tell us what you do, what your current website lacks, and what success looks like for you..."
                      aria-invalid={touched.message && !!fieldErrors.message}
                      aria-describedby={touched.message && fieldErrors.message ? 'contact-message-error' : undefined}
                      className={`w-full rounded-lg p-3.5 text-sm transition-all duration-200 focus:outline-none ${
                        touched.message && fieldErrors.message
                          ? 'border border-rose-500/80 bg-[#16080A] text-[#FEE2E2] placeholder:text-rose-300/40 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                          : touched.message && !fieldErrors.message && formData.message.trim().length >= 10
                          ? 'border border-white/20 bg-white/5 text-[#EBECF0] focus:border-white/40'
                          : 'border border-white/10 bg-[#0A0D10] text-[#EBECF0] focus:border-slate-400'
                      }`}
                    />
                    {touched.message && fieldErrors.message && (
                      <div
                        id="contact-message-error"
                        role="alert"
                        className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] pt-1 tracking-wide animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                        <span className="font-semibold uppercase tracking-wider">{fieldErrors.message}</span>
                      </div>
                    )}
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
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      </section>

      {/* SECTION 2: PROTOCOL STANDARDS & RESPONSE ASSURANCE */}
      <section
        id="contact-section-sla"
        className="relative w-full bg-[#080C11] border-t border-white/[0.08] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 sm:mb-18 space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Protocol Guarantees &amp; Standards</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[#EBECF0] tracking-tight">
              The Unique Amaze Standard of Engagement
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Every inquiry is treated as a high-intent consultation. Here is what you can expect the moment you reach out:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300">
                <Clock className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                24h Guaranteed Turnaround
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                You speak directly with our principal specialist within one business day. No intermediaries or delay queues.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300">
                <Lock className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                Strict Confidentiality &amp; Privacy
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Your business brief, concept ideas, and proprietary workflows are kept entirely confidential from day one.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="font-display font-bold text-sm uppercase text-[#EBECF0]">
                Commercial Clarity
              </h4>
              <p className="font-sans text-xs text-[#94A3B8] leading-relaxed">
                Transparent milestones, realistic timelines, and firm pricing estimates with zero hidden surprises.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0C1117] p-6 space-y-3 shadow-lg hover:border-white/20 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300">
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

      {/* SECTION 3: ALTERNATIVE FAST-TRACK PATHWAYS */}
      <section
        id="contact-section-pathways"
        className="relative w-full bg-slate-50 dark:bg-[#06090D] border-t border-slate-200 dark:border-white/[0.08] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Pathway 1: Project Planner */}
            <div className="cta-image-container group rounded-xl border border-slate-200 dark:border-white/10 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                alt="Project Planner Concept"
                className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="cta-scrim pointer-events-none absolute inset-0" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-300 tracking-widest uppercase font-semibold">
                  <Zap className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Prefer a guided specification?</span>
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
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-200 hover:text-white uppercase tracking-wider transition-colors"
                >
                  <span>LAUNCH INTERACTIVE PLANNER</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Pathway 2: WhatsApp Chat */}
            <div className="cta-image-container group rounded-xl border border-slate-200 dark:border-white/10 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Direct Mobile Triage"
                className="cta-bg-image pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="cta-scrim pointer-events-none absolute inset-0" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-300 tracking-widest uppercase font-semibold">
                  <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Direct Mobile Triage</span>
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-[#0F172A] dark:text-[#EBECF0]">
                  Instant WhatsApp Message
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
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-200 hover:text-white uppercase tracking-wider transition-colors"
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

