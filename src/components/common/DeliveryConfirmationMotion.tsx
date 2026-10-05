import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { Check, Copy, CheckCircle2, ArrowRight, Clock, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { studioAudio } from '../../utils/audio';

interface DeliveryConfirmationMotionProps {
  title: string;
  subtitle: string;
  referenceId?: string | null;
  clientName?: string;
  clientEmail?: string;
  badgeLabel?: string;
  briefSnippet?: string;
  metadataItems?: Array<{ label: string; value: string }>;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  showWhatsAppCta?: boolean;
}

export const DeliveryConfirmationMotion: React.FC<DeliveryConfirmationMotionProps> = ({
  title,
  subtitle,
  referenceId,
  clientName,
  clientEmail,
  badgeLabel = 'DISPATCH VERIFIED · ZERO RELOAD',
  briefSnippet,
  metadataItems,
  primaryAction,
  secondaryAction,
  showWhatsAppCta = true,
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [showBriefPreview, setShowBriefPreview] = useState(false);

  const handleCopyRef = async () => {
    if (!referenceId) return;
    studioAudio.playClick(1000);
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    } catch {
      setCopiedRef(true);
    }
  };

  const handleCopyBrief = async () => {
    if (!briefSnippet) return;
    studioAudio.playClick(1000);
    try {
      await navigator.clipboard.writeText(briefSnippet);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2500);
    } catch {
      setCopiedBrief(true);
    }
  };

  // Stagger variants for sleek entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // Particle positions for subtle burst
  const burstParticles = [
    { x: -32, y: -28, delay: 0.3 },
    { x: 34, y: -24, delay: 0.35 },
    { x: -40, y: 18, delay: 0.4 },
    { x: 38, y: 22, delay: 0.38 },
    { x: 0, y: -42, delay: 0.32 },
    { x: -22, y: -40, delay: 0.42 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-4 sm:py-6 text-center space-y-7"
    >
      {/* Animated Checkmark and Pulse Ring */}
      <motion.div variants={itemVariants} className="relative mx-auto flex items-center justify-center w-24 h-24">
        {/* Subtle Ambient Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.35, 0.2], scale: [0.6, 1.2, 1] }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl pointer-events-none"
        />

        {/* Expanding Pulse Wave 1 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.85, 1.45, 1.6], opacity: [0.7, 0.25, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border border-emerald-400/40 pointer-events-none"
        />

        {/* Expanding Pulse Wave 2 (delayed) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [0.85, 1.35, 1.5], opacity: [0.5, 0.15, 0] }}
          transition={{ duration: 1.6, delay: 0.35, repeat: Infinity, repeatDelay: 2, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border border-slate-400/30 pointer-events-none"
        />

        {/* Subtle Spark Burst Particles */}
        {burstParticles.map((pt, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ scale: [0, 1, 0], x: pt.x, y: pt.y, opacity: [1, 0.9, 0] }}
            transition={{ duration: 0.9, delay: pt.delay, ease: 'easeOut' }}
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-300 pointer-events-none shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          />
        ))}

        {/* SVG Drawing Checkmark Badge */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#081310] border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.22)]">
          <svg
            className="h-14 w-14 text-emerald-400"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animated Circular Path */}
            <motion.circle
              cx="30"
              cy="30"
              r="26"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-emerald-500/30"
            />
            <motion.circle
              cx="30"
              cy="30"
              r="26"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: -90 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'center' }}
              className="text-emerald-400"
            />

            {/* Animated Check Mark Path */}
            <motion.path
              d="M18 31.5L26 39.5L42 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
              className="text-emerald-300"
            />
          </svg>
        </div>
      </motion.div>

      {/* Real-time Status Badge */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-[11px] text-emerald-300 tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="font-semibold uppercase">{badgeLabel}</span>
        </div>
      </motion.div>

      {/* Headers */}
      <motion.div variants={itemVariants} className="space-y-3 max-w-xl mx-auto">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#EBECF0] uppercase tracking-wide">
          {title}
        </h3>
        <p className="font-sans text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          {subtitle}
        </p>
      </motion.div>

      {/* Dispatch Reference Bar (if present) */}
      {referenceId && (
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-[#0E1217] px-4 py-2 text-xs font-mono">
            <span className="text-zinc-400">DISPATCH REF:</span>
            <span className="font-bold text-emerald-300">{referenceId}</span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="ml-1 inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px] text-zinc-300 transition-colors hover:bg-white/20 hover:text-white"
              title="Copy Reference ID"
            >
              {copiedRef ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Structured Telemetry / Review Protocol */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-white/10 bg-[#080B0E]/70 p-5 sm:p-6 text-left max-w-xl mx-auto space-y-4"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>DISPATCH VERIFICATION PROTOCOL</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400/90 font-medium">QUEUED IN STUDIO CRM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <div className="font-mono text-[10px] text-zinc-300 uppercase">STEP 1</div>
            <div className="font-mono text-xs text-[#EBECF0] font-semibold">Instant Triage</div>
            <p className="font-sans text-[11px] text-[#94A3B8] leading-tight">
              Parameters securely recorded and logged to our studio pipeline.
            </p>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <div className="font-mono text-[10px] text-zinc-300 uppercase">STEP 2</div>
            <div className="font-mono text-xs text-[#EBECF0] font-semibold">Principal Review</div>
            <p className="font-sans text-[11px] text-[#94A3B8] leading-tight">
              Scope analyzed by our senior architect before discovery call.
            </p>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <div className="font-mono text-[10px] text-zinc-300 uppercase">STEP 3</div>
            <div className="font-mono text-xs text-[#EBECF0] font-semibold">&lt; 24h Response</div>
            <p className="font-sans text-[11px] text-[#94A3B8] leading-tight">
              Direct calendar invite or detailed initial appraisal sent.
            </p>
          </div>
        </div>

        {/* Metadata pills if provided */}
        {metadataItems && metadataItems.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06] flex flex-wrap gap-2 text-[11px] font-mono">
            {metadataItems.map((meta, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-300"
              >
                <span className="text-zinc-400">{meta.label}:</span>
                <span className="text-white font-medium">{meta.value}</span>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Optional Brief Clipboard Quick Access */}
      {briefSnippet && (
        <motion.div variants={itemVariants} className="max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => {
                studioAudio.playClick(800);
                setShowBriefPreview(!showBriefPreview);
              }}
              className="text-xs font-mono text-zinc-400 hover:text-white underline underline-offset-4 uppercase tracking-wider font-semibold transition-colors"
            >
              {showBriefPreview ? 'Hide Brief Preview' : 'Show Generated Brief Text'}
            </button>
            <button
              type="button"
              onClick={handleCopyBrief}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-zinc-200 hover:bg-white/10 transition-colors"
            >
              {copiedBrief ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-zinc-300" />
                  <span>RE-COPY BRIEF</span>
                </>
              )}
            </button>
          </div>

          {showBriefPreview && (
            <motion.pre
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-left font-mono text-[11px] leading-relaxed p-4 rounded-lg border border-white/10 bg-[#080B0E] text-zinc-300 overflow-x-auto max-h-48 whitespace-pre-wrap select-all"
            >
              {briefSnippet}
            </motion.pre>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center justify-center gap-4">
        {primaryAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              studioAudio.playClick(1000);
              primaryAction.onClick();
            }}
            className="cta-image-btn inline-flex items-center gap-2 rounded-lg px-7 py-3 font-mono text-xs font-bold text-white uppercase tracking-wider shadow-lg"
          >
            <span className="relative z-10 text-white">{primaryAction.label}</span>
            {primaryAction.icon || <ArrowRight className="relative z-10 h-3.5 w-3.5 text-white" />}
          </motion.button>
        )}

        {showWhatsAppCta && (
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/14039096447"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => studioAudio.playClick(900)}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 font-mono text-xs font-bold text-emerald-300 uppercase tracking-wider transition-all hover:bg-emerald-500/20"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
            <span>INSTANT WHATSAPP FOLLOW-UP</span>
          </motion.a>
        )}

        {secondaryAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              studioAudio.playClick(800);
              secondaryAction.onClick();
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs text-[#94A3B8] transition-colors hover:border-white/20 hover:text-[#EBECF0] uppercase tracking-wider font-semibold"
          >
            {secondaryAction.label}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
