import React from 'react';
import { ViewMode } from '../types';
import { studioAudio } from '../utils/audio';
import { ArrowUp, Terminal, Shield } from 'lucide-react';

interface FooterProps {
  onViewChange: (view: ViewMode) => void;
  onOpenCommission: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange, onOpenCommission }) => {
  const scrollToTop = () => {
    studioAudio.playClick(900);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="studio-footer"
      className="relative w-full border-t border-[#1E2629] bg-[#050607] py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Studio Brand & Bio */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold text-[#F3F7F8]">
                OBSIDIAN
              </span>
              <span className="font-mono text-base text-[#2A363A]">//</span>
              <span className="font-display text-2xl font-extrabold text-[#00F2FE]">
                LUMINA
              </span>
            </div>

            <p className="max-w-md font-sans text-sm leading-relaxed text-[#94A3B8]">
              An avant-garde computational design laboratory engineering bespoke spatial systems,
              kinetic brand flagships, and autonomous creative consoles for forward-leaning institutions.
            </p>

            <div className="flex items-center gap-3 pt-2 font-mono text-xs text-[#64748B]">
              <span className="flex h-2 w-2 rounded-full bg-[#5EEAD4]" />
              <span>NODES SYNCHRONIZED: ZURICH • TOKYO • LONDON • SF</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 font-mono text-xs">
            <div>
              <div className="font-semibold text-[#F3F7F8] tracking-widest uppercase mb-4">
                EXPLORE
              </div>
              <ul className="space-y-3 text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick();
                      onViewChange('showcase');
                      scrollToTop();
                    }}
                    className="hover:text-[#00F2FE] transition-colors"
                  >
                    // SHOWCASE
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick();
                      onViewChange('archive');
                      scrollToTop();
                    }}
                    className="hover:text-[#00F2FE] transition-colors"
                  >
                    // PORTFOLIO ARCHIVE
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick();
                      onViewChange('lab');
                      scrollToTop();
                    }}
                    className="hover:text-[#5EEAD4] transition-colors"
                  >
                    // SHADER LAB (LIVE)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick();
                      onViewChange('capabilities');
                      scrollToTop();
                    }}
                    className="hover:text-[#00F2FE] transition-colors"
                  >
                    // CAPABILITIES & ETHOS
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#F3F7F8] tracking-widest uppercase mb-4">
                COMMISSIONS
              </div>
              <ul className="space-y-3 text-[#94A3B8]">
                <li>
                  <button
                    onClick={() => {
                      studioAudio.playClick();
                      onOpenCommission();
                    }}
                    className="text-[#00F2FE] hover:underline"
                  >
                    // INITIATE BRIEF
                  </button>
                </li>
                <li>
                  <span className="text-[#64748B]">AVAILABILITY: Q3/Q4</span>
                </li>
                <li>
                  <span className="text-[#64748B]">ROSTER: 8 / YR MAX</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Terminal Badge & Back to Top */}
          <div className="flex flex-col justify-between items-start lg:items-end lg:col-span-3">
            <div className="rounded-[4px] border border-[#1E2629] bg-[#0D1214] p-4 font-mono text-[11px] text-[#64748B] w-full lg:w-auto">
              <div className="flex items-center gap-2 text-[#00F2FE]">
                <Terminal className="h-3.5 w-3.5" />
                <span>OBSIDIAN OS // 4.8.2</span>
              </div>
              <div className="mt-1 text-[#94A3B8]">SECURE PROTOCOL ACTIVE</div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 lg:mt-0 flex items-center gap-2 rounded-[4px] border border-[#2A363A] bg-[#0A0D0E] px-4 py-2 font-mono text-xs text-[#F3F7F8] hover:border-[#00F2FE] hover:text-[#00F2FE] transition-all"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Legal & Telemetry Line */}
        <div className="mt-16 flex flex-col justify-between items-center gap-4 border-t border-[#1E2629] pt-8 sm:flex-row font-mono text-[11px] text-[#64748B]">
          <div className="flex items-center gap-3">
            <Shield className="h-3 w-3 text-[#00F2FE]" />
            <span>© 2026 OBSIDIAN LUMINA. ALL ARCHITECTURAL RIGHTS RESERVED.</span>
          </div>
          <div>ESTABLISHED IN ZURICH & TOKYO</div>
        </div>
      </div>
    </footer>
  );
};
