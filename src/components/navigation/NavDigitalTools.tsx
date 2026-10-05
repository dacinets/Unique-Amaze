import React from 'react';
import { PageRoute } from '../../types';
import { Sparkles, Terminal, MessageSquareCode, HelpCircle, ArrowUpRight } from 'lucide-react';
import { studioAudio } from '../../utils/audio';

interface NavDigitalToolsProps {
  onNavigate: (route: PageRoute) => void;
  onOpenChat?: () => void;
  onCloseMenu: () => void;
}

export const NavDigitalTools: React.FC<NavDigitalToolsProps> = ({
  onNavigate,
  onOpenChat,
  onCloseMenu,
}) => {
  const tools = [
    {
      id: 'planner',
      title: 'AI PLANNER',
      desc: 'Interactive Scoping & Milestone Calculator',
      icon: Terminal,
      action: () => {
        studioAudio.playClick(1050);
        onCloseMenu();
        onNavigate('planner');
      },
      tag: 'CALCULATOR',
    },
    {
      id: 'sage',
      title: 'SAGE',
      desc: 'Multi-turn AI Studio Concierge Assistant',
      icon: Sparkles,
      action: () => {
        studioAudio.playClick(1150);
        onCloseMenu();
        if (onOpenChat) onOpenChat();
      },
      tag: 'AI AGENT',
    },
    {
      id: 'faq',
      title: 'FAQ CONSOLE',
      desc: 'Architecture, SLA, & Engineering FAQ',
      icon: HelpCircle,
      action: () => {
        studioAudio.playClick(850);
        onCloseMenu();
        onNavigate('faq');
      },
      tag: 'KNOWLEDGE',
    },
    {
      id: 'chat',
      title: 'AI CHAT',
      desc: 'Direct Natural Language Studio Query',
      icon: MessageSquareCode,
      action: () => {
        studioAudio.playClick(950);
        onCloseMenu();
        if (onOpenChat) onOpenChat();
      },
      tag: 'CONVERSATIONAL',
    },
  ];

  return (
    <div className="w-full">
      {/* Header Strip */}
      <div className="flex items-center gap-3 mb-3">
        <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-semibold flex items-center gap-2">
          <Terminal className="h-3 w-3 text-zinc-400" />
          <span>STUDIO UTILITIES &amp; DISCOVERY</span>
        </div>
        <div className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={tool.action}
              data-cursor="explore"
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#090D12]/80 p-3 text-left transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none"
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-300 group-hover:bg-white/10 group-hover:text-white transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-[9px] text-zinc-500 group-hover:text-zinc-300 tracking-widest uppercase transition-colors">
                  {tool.tag}
                </span>
              </div>

              <div className="mt-2.5">
                <div className="flex items-center gap-1 font-mono text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                  <span>{tool.title}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-white" />
                </div>
                <div className="mt-0.5 font-sans text-[11px] text-[#94A3B8] leading-tight line-clamp-1">
                  {tool.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
