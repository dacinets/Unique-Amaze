import React, { useState } from 'react';
import { studioAudio } from '../utils/audio';
import { Send, CheckCircle2, Shield, Sparkles, Copy, Check } from 'lucide-react';

interface CommissionSectionProps {
  onSuccessDispatch?: () => void;
}

const SERVICE_OPTIONS = [
  'Spatial Computing & 3D Shaders',
  'Generative AI & Agentic Interfaces',
  'Flagship Web & Kinetic Systems',
  'Brand Architecture & Custom Typography',
  'Physical-Digital Architecture & IoT',
];

const BUDGET_BRACKETS = [
  '$50K – $100K',
  '$100K – $250K',
  '$250K – $500K',
  '$500K+ / Enterprise',
];

const TIMEFRAMES = ['Q3 2026', 'Q4 2026', 'Q1 2027', 'Flexible'];

export const CommissionSection: React.FC<CommissionSectionProps> = ({ onSuccessDispatch }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Spatial Computing & 3D Shaders',
  ]);
  const [selectedBudget, setSelectedBudget] = useState<string>('$100K – $250K');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Q4 2026');

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [clientEntity, setClientEntity] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectBrief, setProjectBrief] = useState('');

  // Dispatch Confirmation State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dispatchHash, setDispatchHash] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const toggleService = (service: string) => {
    studioAudio.playClick(800);
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail) return;

    studioAudio.playChime(660, 'triangle', 0.4);
    // Generate pseudo cryptographic SHA checksum
    const randomHash =
      '0x' +
      Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    setDispatchHash(randomHash);
    setIsSubmitted(true);
    if (onSuccessDispatch) onSuccessDispatch();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(
      `OBSIDIAN LUMINA COMMISSION SPEC\nReference: ${dispatchHash}\nEntity: ${clientEntity}\nContact: ${clientEmail}\nServices: ${selectedServices.join(', ')}\nBudget: ${selectedBudget}\nTimeline: ${selectedTimeframe}`
    );
    setIsCopied(true);
    studioAudio.playClick(900);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section
      id="commission-dispatch-section"
      className="relative w-full border-b border-[#1E2629] bg-[#050607] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Headline & Studio Protocol */}
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-[#00F2FE] uppercase">
              <span>COMMISSION TERMINAL</span>
              <span className="text-[#3A494B]">//</span>
              <span>DIRECT DISPATCH</span>
            </div>

            <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#F3F7F8] sm:text-6xl">
              INITIATE COLLABORATION.
            </h2>

            <p className="font-sans text-base leading-relaxed text-[#94A3B8]">
              We take on a strictly limited roster of 6 to 8 bespoke commissions per calendar year.
              Direct engagement allows our partners unfettered access to our senior creative engineering team.
            </p>

            {/* Technical Protocol Specs */}
            <div className="space-y-3 rounded-[6px] border border-[#1E2629] bg-[#0D1214] p-5 font-mono text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2 text-[#5EEAD4] font-bold">
                <Shield className="h-4 w-4" />
                <span>CONFIDENTIAL DISPATCH PROTOCOL</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#64748B]">
                All transmissions are handled directly by partners. Non-disclosure agreements (NDAs) can be executed
                prior to deep-dive architecture reviews.
              </p>
              <div className="border-t border-[#1E2629] pt-3 text-[11px] text-[#00F2FE]">
                RESPONSE TIMEFRAME: &lt; 24 HOURS
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Brief Form or Confirmation Receipt */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div
                id="commission-receipt-card"
                className="glass-tier-2 rounded-[8px] p-8 lg:p-10 transition-all duration-500"
              >
                <div className="flex items-center gap-3 text-[#5EEAD4]">
                  <CheckCircle2 className="h-7 w-7" />
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#F3F7F8]">
                      COMMISSION DISPATCH CONFIRMED
                    </h3>
                    <div className="font-mono text-xs text-[#5EEAD4]">
                      ENCRYPTED TRANSMISSION RECEIVED
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4 rounded-[6px] border border-[#2A363A] bg-[#050607]/80 p-5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>DISPATCH CHECKSUM:</span>
                    <span className="text-[#00F2FE] font-bold">{dispatchHash}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>CLIENT ENTITY:</span>
                    <span className="text-[#F3F7F8]">{clientEntity || clientName || 'DIRECT COMMISSION'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>CONTACT ROUTE:</span>
                    <span className="text-[#F3F7F8]">{clientEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>ALLOCATED BRACKET:</span>
                    <span className="text-[#5EEAD4]">{selectedBudget}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>TARGET WINDOW:</span>
                    <span className="text-[#94A3B8]">{selectedTimeframe}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleCopyHash}
                    className="flex items-center gap-2 rounded-[4px] border border-[#00F2FE]/40 bg-[#00F2FE]/10 px-5 py-2.5 font-mono text-xs font-semibold text-[#00F2FE] hover:bg-[#00F2FE]/20"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{isCopied ? 'SPEC COPIED' : 'COPY SPEC MANIFEST'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setClientName('');
                      setClientEmail('');
                      setProjectBrief('');
                    }}
                    className="font-mono text-xs text-[#64748B] hover:text-[#F3F7F8]"
                  >
                    SUBMIT ANOTHER DISPATCH
                  </button>
                </div>
              </div>
            ) : (
              <form
                id="commission-brief-form"
                onSubmit={handleDispatch}
                className="glass-tier-1 rounded-[8px] p-8 lg:p-10 space-y-8"
              >
                {/* 1. Service Multiselect */}
                <div>
                  <label className="block font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase mb-3">
                    01 // REQUIRED DISCIPLINES
                  </label>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {SERVICE_OPTIONS.map((service) => {
                      const isSelected = selectedServices.includes(service);
                      return (
                        <button
                          type="button"
                          key={service}
                          onClick={() => toggleService(service)}
                          className={`flex items-center gap-3 rounded-[4px] border p-3 text-left font-mono text-xs transition-all ${
                            isSelected
                              ? 'border-[#00F2FE] bg-[#00F2FE]/10 text-[#F3F7F8]'
                              : 'border-[#1E2629] bg-[#0D1214] text-[#94A3B8] hover:border-[#2A363A]'
                          }`}
                        >
                          {/* 16px micro-box checkbox with solid #00F2FE on select (Design Spec) */}
                          <div
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border ${
                              isSelected
                                ? 'border-[#00F2FE] bg-[#00F2FE] text-[#050607]'
                                : 'border-[#2A363A] bg-[#050607]'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <span>{service}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Budget Bracket Selector */}
                <div>
                  <label className="block font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase mb-3">
                    02 // INVESTMENT ALLOCATION (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {BUDGET_BRACKETS.map((bracket) => {
                      const isSelected = selectedBudget === bracket;
                      return (
                        <button
                          type="button"
                          key={bracket}
                          onClick={() => {
                            studioAudio.playClick(750);
                            setSelectedBudget(bracket);
                          }}
                          className={`rounded-[4px] border p-2.5 text-center font-mono text-xs transition-all ${
                            isSelected
                              ? 'border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4] font-bold shadow-[0_0_15px_rgba(94,234,212,0.2)]'
                              : 'border-[#1E2629] bg-[#0D1214] text-[#94A3B8] hover:border-[#2A363A]'
                          }`}
                        >
                          {bracket}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Target Timeframe */}
                <div>
                  <label className="block font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase mb-3">
                    03 // TARGET LAUNCH WINDOW
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {TIMEFRAMES.map((time) => {
                      const isSelected = selectedTimeframe === time;
                      return (
                        <button
                          type="button"
                          key={time}
                          onClick={() => {
                            studioAudio.playClick(750);
                            setSelectedTimeframe(time);
                          }}
                          className={`rounded-[4px] border p-2 text-center font-mono text-xs transition-all ${
                            isSelected
                              ? 'border-[#00F2FE] bg-[#00F2FE]/10 text-[#00F2FE] font-bold'
                              : 'border-[#1E2629] bg-[#0D1214] text-[#94A3B8] hover:border-[#2A363A]'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Client Details Input Fields (Understated technical inputs with deep slate backings) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs text-[#94A3B8] uppercase mb-1.5">
                      NAME / PRINCIPAL
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Marcella Vance"
                      className="w-full rounded-[4px] border border-[#1E2629] bg-[#0D1214] px-4 py-3 font-mono text-xs text-[#F3F7F8] placeholder-[#64748B] outline-none transition-all focus:border-[#00F2FE] focus:shadow-[0_0_16px_rgba(0,242,254,0.2)]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-[#94A3B8] uppercase mb-1.5">
                      ENTITY / MAISON
                    </label>
                    <input
                      type="text"
                      value={clientEntity}
                      onChange={(e) => setClientEntity(e.target.value)}
                      placeholder="e.g. Vance Horizons AG"
                      className="w-full rounded-[4px] border border-[#1E2629] bg-[#0D1214] px-4 py-3 font-mono text-xs text-[#F3F7F8] placeholder-[#64748B] outline-none transition-all focus:border-[#00F2FE] focus:shadow-[0_0_16px_rgba(0,242,254,0.2)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs text-[#94A3B8] uppercase mb-1.5">
                      SECURE CONTACT (EMAIL) *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="principal@enterprise.com"
                      className="w-full rounded-[4px] border border-[#1E2629] bg-[#0D1214] px-4 py-3 font-mono text-xs text-[#F3F7F8] placeholder-[#64748B] outline-none transition-all focus:border-[#00F2FE] focus:shadow-[0_0_16px_rgba(0,242,254,0.2)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-mono text-xs text-[#94A3B8] uppercase mb-1.5">
                      PROJECT CHALLENGE & AMBITIONS
                    </label>
                    <textarea
                      rows={4}
                      value={projectBrief}
                      onChange={(e) => setProjectBrief(e.target.value)}
                      placeholder="Outline your architectural requirements, existing infrastructure, and aesthetic objectives..."
                      className="w-full rounded-[4px] border border-[#1E2629] bg-[#0D1214] px-4 py-3 font-mono text-xs text-[#F3F7F8] placeholder-[#64748B] outline-none transition-all focus:border-[#00F2FE] focus:shadow-[0_0_16px_rgba(0,242,254,0.2)] resize-none"
                    />
                  </div>
                </div>

                {/* Primary Action Dispatch Button */}
                <button
                  type="submit"
                  id="commission-submit-button"
                  className="w-full rounded-[4px] bg-[#00F2FE] py-4 font-mono text-xs font-bold tracking-[0.14em] text-[#050607] uppercase transition-all duration-300 hover:bg-[#5EEAD4] hover:shadow-[0_0_28px_rgba(0,242,254,0.5)] flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>DISPATCH SPECIFICATION PAYLOAD</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
