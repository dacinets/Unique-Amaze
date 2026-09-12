import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { MarketType, PageRoute, ChatMessage } from '../../types';

interface ChatBoxProps {
  currentMarket: MarketType;
  onNavigate?: (route: PageRoute) => void;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

const QUICK_QUESTIONS = [
  'What are your website packages & pricing?',
  'How do your AI agents & autonomous chatbots work?',
  'What is the typical project timeline to build a site?',
  'Tell me about pricing and network optimization for Malawi',
  'What results have you achieved for past clients?',
];

const MODEL_OPTIONS = [
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite (Speed)', speed: 'Ultra-Fast' },
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Balanced)', speed: 'Fast & Deep' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (General)', speed: 'High Accuracy' },
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  currentMarket,
  onNavigate,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-flash-lite');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize messages with welcome greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-msg',
        role: 'model',
        content: `**Hello and welcome to Unique Amaze!** 👋 \n\nI am your **AI Studio Concierge**, powered by Google Gemini. I am here to help answer questions about our **zero-bloat digital flagships**, **autonomous AI agents**, **pricing packages in ${
          currentMarket === 'mw' ? 'MWK (Malawi Kwacha)' : 'CAD (Canadian Dollars)'
        }**, and our **2–3 week delivery process**.\n\nHow can I help you elevate your brand today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.8-flash',
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    // Format history for server API
    const historyPayload = newMessages
      .filter((m) => m.id !== 'welcome-msg')
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload.slice(0, -1), // previous turns before current message
          market: currentMarket,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || 'I received your question. How else can I assist you with Unique Amaze?';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'model',
        content: `I'm having a brief connection delay reaching our Gemini AI engine, but I can still assist! Unique Amaze specializes in **custom high-performance websites**, **intelligent 24/7 AI agents**, and **rapid 2–3 week turnarounds**.\n\nYou can also jump straight into our **2-Minute AI Project Planner** or view our full **Pricing & Packages** via the top navigation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'studio-local-fallback',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Conversation reset. Ask me anything about Unique Amaze's services, pricing, AI capabilities, or development timeline!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="unique-amaze-chat-widget" className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="chat-toggle-open-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full border border-[#16D2C8]/30 bg-[#0B0F12]/90 px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-[#16D2C8] hover:bg-[#10161A] hover:scale-105 active:scale-95"
          aria-label="Open Unique Amaze AI Chat"
        >
          {/* Animated turquoise ambient pulse */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#16D2C8]/30 to-[#367588]/30 opacity-70 blur-md transition-opacity group-hover:opacity-100" />

          {/* Sparkle Icon & Pulse Beacon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#16D2C8]/10 text-[#16D2C8] border border-[#16D2C8]/40">
            <Bot className="h-5 w-5 transition-transform group-hover:rotate-6" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16D2C8] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#16D2C8]" />
            </span>
          </div>

          <div className="relative text-left">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#16D2C8]">
              <Sparkles className="h-3 w-3" />
              <span>SAGE AI</span>
            </div>
            <div className="text-xs font-medium text-slate-200">
              Studio Concierge
            </div>
          </div>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          id="chat-console-panel"
          className={`relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070A0D]/95 text-slate-100 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
            isExpanded
              ? 'fixed inset-4 md:inset-8 z-50 max-w-none h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]'
              : 'w-[94vw] sm:w-[420px] md:w-[460px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Ambient Top Glow Strip */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#16D2C8] via-[#367588] to-[#16D2C8]" />

          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0B0F13]/80 px-4 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#16D2C8]/40 bg-[#16D2C8]/10 text-[#16D2C8]">
                <Bot className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#16D2C8]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold tracking-wide text-white">
                    SAGE AI Concierge
                  </h3>
                  <span className="rounded border border-[#16D2C8]/30 bg-[#16D2C8]/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[#16D2C8]">
                    Studio Advisor
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Studio Advisor
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-slate-300 uppercase">
                    {currentMarket === 'mw' ? '🇲🇼 MWK Market' : '🇨🇦 CAD Market'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                id="chat-clear-history-btn"
                onClick={handleClearHistory}
                title="Clear Conversation"
                className="rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-rose-400"
                aria-label="Clear chat history"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <button
                id="chat-expand-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore Size' : 'Expand View'}
                className="hidden sm:block rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Toggle full view"
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>

              <button
                id="chat-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close chat window"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Model Subheader Selector Pill */}
          <div className="flex items-center justify-between border-b border-white/5 bg-[#090C0F] px-4 py-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-[#16D2C8]" />
              <span>Model:</span>
              <select
                id="chat-model-selector"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-slate-200 border-none outline-none font-medium text-[11px] cursor-pointer focus:ring-0"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0B0F12] text-slate-200">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[10px] text-slate-500 font-mono">
              24/7 Multi-turn Q&A
            </span>
          </div>

          {/* Scrollable Message Thread */}
          <div
            id="chat-message-scroll-thread"
            className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#16D2C8]/30 bg-[#16D2C8]/10 text-[#16D2C8]">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-2xl p-3.5 shadow-sm transition-all ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-gradient-to-br from-[#16D2C8] to-[#0E837D] text-[#050607] font-medium'
                      : 'rounded-tl-sm border border-white/10 bg-[#0E1317]/90 text-slate-200'
                  }`}
                >
                  {/* Message Content */}
                  <div className="prose prose-invert max-w-none text-sm break-words leading-relaxed space-y-2">
                    <Markdown>{msg.content}</Markdown>
                  </div>

                  {/* Message Meta / Copy Toolbar */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[10px] ${
                      msg.role === 'user' ? 'text-[#050607]/70' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {msg.role === 'model' && (
                      <div className="flex items-center gap-1.5">
                        {msg.modelUsed && (
                          <span className="font-mono text-[9px] text-slate-500">
                            {msg.modelUsed.replace('gemini-', '')}
                          </span>
                        )}
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-slate-200">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing / Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#16D2C8]/30 bg-[#16D2C8]/10 text-[#16D2C8]">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-[#0E1317] px-4 py-3 text-slate-400">
                  <span className="text-xs">Amaze AI is crafting an answer</span>
                  <div className="flex gap-1 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-bounce [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16D2C8] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Starter Pills */}
          {messages.length <= 3 && (
            <div className="border-t border-white/5 bg-[#090C0F]/60 p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Suggested questions:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 transition-all hover:border-[#16D2C8]/40 hover:bg-[#16D2C8]/10 hover:text-[#16D2C8] active:scale-95 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* App Navigation Shortcut Strip */}
          {onNavigate && (
            <div className="flex items-center justify-between border-t border-white/5 bg-[#070A0D] px-4 py-2 text-[11px] text-slate-400">
              <span>Quick Navigate:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-[#16D2C8] transition-colors flex items-center gap-1"
                >
                  Packages <ArrowRight className="h-2.5 w-2.5" />
                </button>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-[#16D2C8] transition-colors flex items-center gap-1"
                >
                  AI Planner <ArrowRight className="h-2.5 w-2.5" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#16D2C8] transition-colors flex items-center gap-1"
                >
                  Book Call <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="border-t border-white/10 bg-[#0B0F13] p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                id="chat-input-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Unique Amaze services, pricing, AI agents..."
                rows={1}
                disabled={isLoading}
                className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-[#16D2C8] focus:bg-white/10 focus:ring-1 focus:ring-[#16D2C8]/30 disabled:opacity-50"
              />

              <button
                type="submit"
                id="chat-send-submit-btn"
                disabled={!inputText.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#16D2C8] to-[#0E837D] text-[#050607] font-semibold transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>Unique Amaze Studio</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
