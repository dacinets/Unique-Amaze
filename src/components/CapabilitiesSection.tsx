import React, { useState } from 'react';
import { DISCIPLINES } from '../data/studioData';
import { DisciplineItem } from '../types';
import { studioAudio } from '../utils/audio';
import { Cpu, CheckCircle2, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineItem>(DISCIPLINES[0]);

  return (
    <section
      id="studio-capabilities-section"
      className="relative w-full border-b border-[#1E2629] bg-[#0A0D0E] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-[#00F2FE] uppercase">
            <span>DISCIPLINES // 04 PILLARS</span>
            <span className="text-[#3A494B]">//</span>
            <span>TECHNICAL MASTERY</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#F3F7F8] sm:text-5xl">
            STUDIO CAPABILITIES & ARCHITECTURE
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-base text-[#94A3B8]">
            We operate without off-the-shelf templates. Every engagement begins from first principles,
            engineering custom GPU shaders, generative intelligence frameworks, and physical-digital installations.
          </p>
        </div>

        {/* 2-Column Split: Discipline Selector Tabs + Deep Architecture Inspector */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Discipline List */}
          <div className="space-y-3 lg:col-span-5">
            {DISCIPLINES.map((discipline) => {
              const isSelected = activeDiscipline.id === discipline.id;
              return (
                <div
                  key={discipline.id}
                  id={`discipline-tab-${discipline.id}`}
                  onClick={() => {
                    studioAudio.playClick(isSelected ? 700 : 880);
                    setActiveDiscipline(discipline);
                  }}
                  className={`cursor-pointer rounded-[6px] border p-6 transition-all duration-300 ${
                    isSelected
                      ? 'border-[#00F2FE] bg-[#13191B] shadow-[0_0_30px_rgba(0,242,254,0.15)]'
                      : 'border-[#1E2629] bg-[#050607]/80 hover:border-[#2A363A] hover:bg-[#0D1214]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isSelected ? 'text-[#00F2FE]' : 'text-[#64748B]'
                      }`}
                    >
                      {discipline.index} //
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 transition-transform ${
                        isSelected ? 'text-[#00F2FE] translate-x-1' : 'text-[#2A363A]'
                      }`}
                    />
                  </div>
                  <h3
                    className={`mt-2 font-display text-xl font-bold transition-colors ${
                      isSelected ? 'text-[#F3F7F8]' : 'text-[#94A3B8]'
                    }`}
                  >
                    {discipline.title}
                  </h3>
                  <p className="mt-1 font-sans text-xs text-[#64748B] line-clamp-1">
                    {discipline.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Architectural Inspector Panel */}
          <div className="lg:col-span-7">
            <div
              id="capability-inspector-panel"
              className="glass-tier-1 rounded-[8px] p-8 lg:p-10"
            >
              <div className="flex items-center justify-between border-b border-[#1E2629] pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE]">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[#00F2FE] tracking-widest uppercase">
                      DISCIPLINE {activeDiscipline.index} SPECIFICATION
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#F3F7F8]">
                      {activeDiscipline.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Tagline & Narrative */}
              <div className="mt-6">
                <div className="font-display text-lg font-semibold text-[#5EEAD4]">
                  &ldquo;{activeDiscipline.tagline}&rdquo;
                </div>
                <p className="mt-4 font-sans text-base leading-relaxed text-[#94A3B8]">
                  {activeDiscipline.description}
                </p>
              </div>

              {/* Technologies Array */}
              <div className="mt-8 border-t border-[#1E2629] pt-6">
                <h4 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-[#00F2FE]" />
                  <span>CORE TECHNICAL ARSENAL</span>
                </h4>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {activeDiscipline.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-[4px] border border-[#00F2FE]/30 bg-[#00F2FE]/5 px-3 py-1 font-mono text-xs text-[#00F2FE]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Deliverables */}
              <div className="mt-6 border-t border-[#1E2629] pt-6">
                <h4 className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase">
                  <Layers className="h-3.5 w-3.5 text-[#5EEAD4]" />
                  <span>CLIENT DELIVERABLES</span>
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {activeDiscipline.deliverables.map((deliv) => (
                    <div
                      key={deliv}
                      className="flex items-center gap-2 font-sans text-xs text-[#94A3B8]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#5EEAD4] shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
