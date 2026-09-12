import React, { useState, useEffect } from 'react';
import { STUDIO_LOCATIONS, AWARDS_LEDGER } from '../data/studioData';
import { Globe, Award, Clock, MapPin } from 'lucide-react';

export const StudioEthos: React.FC = () => {
  const [worldTimes, setWorldTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTimes = () => {
      const times: Record<string, string> = {};
      STUDIO_LOCATIONS.forEach((loc) => {
        try {
          const now = new Date();
          const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: loc.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
          times[loc.city] = formatter.format(now);
        } catch {
          times[loc.city] = '--:--:--';
        }
      });
      setWorldTimes(times);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="studio-ethos-section"
      className="relative w-full border-b border-[#1E2629] bg-[#050607] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-8 lg:px-12">
        {/* Ethos & Philosophy */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-[#00F2FE] uppercase">
              <span>MANIFESTO</span>
              <span className="text-[#3A494B]">//</span>
              <span>ETHOS & ORIGIN</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#F3F7F8] sm:text-5xl">
              THE CODE IS THE SCULPTURE.
            </h2>
          </div>

          <div className="space-y-6 font-sans text-base leading-relaxed text-[#94A3B8] lg:col-span-7">
            <p className="text-lg text-[#F3F7F8]">
              Obsidian Lumina was founded on an unapologetic refusal to treat digital interfaces as disposable skins.
              We treat computational physics, typography, and optical light as classical structural materials.
            </p>
            <p>
              By fusing architectural restraint with high-voltage GPU shaders, we build artifacts that linger in cultural memory.
              We partner with founders who refuse commoditization and luxury houses that view digital craft with the same solemn
              gravity as physical haute couture.
            </p>
          </div>
        </div>

        {/* Global Studio Coordinates & Real-Time World Clocks */}
        <div className="mt-20 border-t border-[#1E2629] pt-16">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase">
              <Globe className="h-4 w-4 text-[#00F2FE]" />
              <span>GLOBAL LABORATORIES & COORDINATES</span>
            </div>
            <span className="font-mono text-xs text-[#5EEAD4] animate-pulse">SYNCHRONIZED</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STUDIO_LOCATIONS.map((loc) => (
              <div
                key={loc.city}
                className="glass-tier-1 rounded-[6px] p-6 transition-all hover:border-[#00F2FE]/40"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#F3F7F8] tracking-widest">{loc.city}</span>
                  <span
                    className={`rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold ${
                      loc.status === 'ACTIVE'
                        ? 'bg-[#5EEAD4]/10 text-[#5EEAD4]'
                        : 'bg-[#1E2629] text-[#64748B]'
                    }`}
                  >
                    {loc.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 font-mono text-2xl font-bold text-[#00F2FE]">
                  <Clock className="h-5 w-5 text-[#5EEAD4]" />
                  <span>{worldTimes[loc.city] || '12:00:00'}</span>
                </div>

                <div className="mt-4 space-y-1 font-mono text-[11px] text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-[#3A494B]" />
                    <span>{loc.coordinates}</span>
                  </div>
                  <div>{loc.weather}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Ledger */}
        <div className="mt-20 border-t border-[#1E2629] pt-16">
          <div className="mb-8 flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#F3F7F8] uppercase">
            <Award className="h-4 w-4 text-[#5EEAD4]" />
            <span>HONORS & JURY RECOGNITION</span>
          </div>

          <div className="divide-y divide-[#1E2629] border-y border-[#1E2629]">
            {AWARDS_LEDGER.map((award) => (
              <div
                key={award.id}
                className="flex flex-col justify-between py-4 sm:flex-row sm:items-center font-mono text-xs"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#00F2FE]">{award.organization}</span>
                  <span className="text-[#F3F7F8]">{award.accolade}</span>
                </div>
                <div className="mt-2 flex items-center gap-6 text-[#64748B] sm:mt-0">
                  <span>{award.project}</span>
                  <span className="text-[#94A3B8]">{award.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
