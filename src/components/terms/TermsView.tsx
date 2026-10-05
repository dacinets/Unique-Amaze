import React from 'react';
import { PageRoute } from '../../types';
import { FileText, CheckCircle2, ArrowLeft, Award, Scale } from 'lucide-react';
import { studioAudio } from '../../utils/audio';

interface TermsViewProps {
  onNavigate: (route: PageRoute) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full pt-8 sm:pt-12 lg:pt-14 pb-20 sm:pb-28 lg:pb-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => {
            studioAudio.playClick(800);
            onNavigate('home');
          }}
          className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>RETURN TO HOME</span>
        </button>

        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 tracking-widest uppercase font-semibold">
            <Scale className="h-3.5 w-3.5 text-zinc-400" />
            <span>COMMERCIAL TERMS &amp; SERVICE AGREEMENT</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-[#EBECF0] tracking-wide">
            Terms of Service &amp; Studio Warranties
          </h1>
          <p className="font-mono text-xs text-[#94A3B8]">
            Last Updated: March 2026 · Unique Amaze Web Studio
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 font-sans text-sm text-[#CBD5E1] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-zinc-300" />
              1. Scope of Work &amp; Performance Commitments
            </h2>
            <p>
              Unique Amaze provides bespoke software engineering, interactive web design, and digital consulting. Every custom website delivery includes our verified performance guarantee: 95+ score on Google PageSpeed Insights (mobile &amp; desktop) and sub-800ms initial load time on broadband networks, contingent upon approved media assets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              2. Commercial Packages &amp; Milestone Invoicing
            </h2>
            <p>
              Projects proceed according to fixed milestone commitments outlined in your formal Statement of Work (SOW):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#94A3B8]">
              <li><strong>Starter Website:</strong> 50% deposit upon kickoff, 50% upon verified staging acceptance and domain launch.</li>
              <li><strong>Business &amp; Intelligent Platforms:</strong> Structured across Discovery/Figma approval, Development staging, and Final production deployment.</li>
              <li>Supported currencies: Canadian Dollars (CAD) for international accounts and Malawian Kwacha (MWK) for local Southern African engagements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-300" />
              3. Intellectual Property Rights &amp; Ownership
            </h2>
            <p>
              Upon receipt of final payment, 100% of custom frontend code, custom design assets, and database schemas developed specifically for your project transfer entirely to you. You are never locked into proprietary studio platforms or hidden maintenance fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-[#EBECF0] uppercase tracking-wider">
              4. Contact &amp; Governance
            </h2>
            <p>
              For legal inquiries, contracts, or partnership notices, please contact <strong className="text-white">legal@uniqueamaze.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
