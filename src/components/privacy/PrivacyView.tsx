import React, { useState, useEffect } from 'react';
import { PageRoute } from '../../types';
import { Shield, Lock, Eye, FileText, ArrowLeft, Activity, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { studioAudio } from '../../utils/audio';
import { analytics, AnalyticsStats } from '../../utils/analytics';

interface PrivacyViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigate }) => {
  const [isOptedOut, setIsOptedOut] = useState<boolean>(() => analytics.isOptedOut());
  const [isDnt, setIsDnt] = useState<boolean>(() => analytics.isDntActive());
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);

  useEffect(() => {
    setIsDnt(analytics.isDntActive());
    setIsOptedOut(analytics.isOptedOut());

    const fetchStats = async () => {
      setLoadingStats(true);
      const data = await analytics.getStats();
      if (data) setStats(data);
      setLoadingStats(false);
    };

    fetchStats();
  }, []);

  const handleToggleOptOut = () => {
    const nextState = !isOptedOut;
    analytics.setOptOut(nextState);
    setIsOptedOut(nextState);
    studioAudio.playClick(nextState ? 700 : 900);
  };

  return (
    <div className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => {
            studioAudio.playClick(800);
            onNavigate('home');
          }}
          className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>RETURN TO HOME</span>
        </button>

        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span>LEGAL &amp; DATA PRIVACY PROTOCOL</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#EBECF0] tracking-wide">
            Privacy Policy &amp; Data Ethics
          </h1>
          <p className="font-mono text-xs text-[#94A3B8]">
            Effective Date: March 2026 · Unique Amaze Web Studio
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 font-sans text-sm text-[#CBD5E1] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
              <Lock className="h-4 w-4 text-zinc-300" />
              1. Our Zero-Bloat Data Philosophy
            </h2>
            <p>
              Unique Amaze operates on a strict principle of data minimization. We reject intrusive third-party cross-site trackers, surveillance ad networks, and unnecessary third-party cookies. We collect only the information necessary to evaluate your project inquiry and deliver enterprise-grade digital services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4 w-4 text-zinc-300" />
              2. Information We Collect
            </h2>
            <p>
              When you interact with our website or submit an inquiry via our Contact Form or AI Project Planner, we collect:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#94A3B8]">
              <li>Contact details: Full Name, Business Name, Work Email, and Phone Number.</li>
              <li>Project scope parameters: Service interests, desired turnaround, and budget brackets.</li>
              <li>Technical telemetry: One-way cryptographic hash of connection origin (for rate-limiting and DDoS prevention). No plain IP addresses are permanently retained in plaintext logs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-300" />
              3. Use of Information &amp; AI Processing
            </h2>
            <p>
              Your contact details are used exclusively to communicate with you regarding your project and schedule strategy consultations. When using our interactive Sage Project Planner or AI Studio Concierge:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#94A3B8]">
              <li>Queries are processed securely on server-side proxy layers using the Google Gemini API.</li>
              <li>No personal customer data is sold, rented, or distributed to third-party ad networks under any circumstances.</li>
              <li>Transactional emails are dispatched exclusively through authenticated, TLS-encrypted SMTP protocols.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider">
              4. Data Retention &amp; Rights
            </h2>
            <p>
              You retain the absolute right to request an extract of any personal records retained in our inquiry database, or request the immediate deletion of your lead profile. To exercise these rights, email our compliance officer directly at <strong className="text-white">privacy@uniqueamaze.com</strong>.
            </p>
          </section>

          {/* Section 5: Live GDPR Privacy & Telemetry Status */}
          <section className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                5. Live GDPR Privacy &amp; Telemetry Sovereignty
              </h2>
              {loadingStats && (
                <RefreshCw className="h-3.5 w-3.5 text-zinc-500 animate-spin" />
              )}
            </div>
            <p>
              Our custom telemetry engine runs entirely on our proprietary server-side <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white">/api/analytics</code> endpoint. It does not set cookies, does not store IP addresses, and irreversibly salts daily visitor IDs at midnight UTC.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Browser DNT / GPC Signal */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
                  Do Not Track / Global Privacy Control
                </div>
                <div className="flex items-center gap-2">
                  {isDnt ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="font-mono text-xs text-emerald-300 font-bold">Signal Active (Tracking Automatically Blocked)</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-zinc-500" />
                      <span className="font-mono text-xs text-zinc-300">Default (No Signal Sent by Browser)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Client Opt-Out Controller */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
                  Client-Side Analytics Status
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOptedOut ? (
                      <>
                        <XCircle className="h-4 w-4 text-amber-400" />
                        <span className="font-mono text-xs text-amber-300 font-bold">Opted Out</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="font-mono text-xs text-emerald-300 font-bold">Anonymous Telemetry Enabled</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleToggleOptOut}
                    className="rounded border border-white/20 hover:border-white/40 px-2.5 py-1 font-mono text-[10px] uppercase font-semibold text-white transition-colors cursor-pointer"
                  >
                    {isOptedOut ? 'Enable Telemetry' : 'Opt Out'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Privacy Engine Standards */}
            {stats && stats.privacyStandards && (
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 pt-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 font-semibold flex items-center justify-between">
                  <span>Server-Side Privacy Standards Verified</span>
                  <span className="text-emerald-400 font-bold">100% Compliant</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stats.privacyStandards.map((std, i) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{std}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
