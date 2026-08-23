import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Bot,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Send,
  Workflow,
  ChevronDown
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';

const N8N_CHAT_URL = "https://sneha12345678.app.n8n.cloud/webhook/132d0d77-462f-4145-9ad3-834d69e75eaf/chat";

export const N8NChatWidget: React.FC = () => {
  const { isN8NChatOpen, setIsN8NChatOpen, startCallWithAdvocate } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleOpenChat = () => {
    setIsN8NChatOpen(true);
    setShowNotificationBadge(false);
    setHasOpenedOnce(true);
  };

  const handleRefresh = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const quickPrompts = [
    {
      label: '📞 Call Adv. Seema Jha (₹10/m)',
      action: () => {
        setIsN8NChatOpen(false);
        const advocate = {
          id: 'adv-seema-jha',
          name: 'Advocate Seema Jha',
          title: 'Advocate & Legal Consultant (B.A. LL.B., 4 Yrs Exp.)',
          specialization: 'Civil & Family Law',
          secondarySpecialties: ['Property Disputes', 'Criminal Defense', 'Statutory Notices'],
          experienceYears: 4,
          rating: 4.9,
          totalConsultations: 650,
          languages: ['Hindi', 'English'],
          courts: ['Delhi High Court', 'Tis Hazari District Court', 'Saket District Court'],
          barRegistration: 'D/5120/2022',
          education: 'B.A. LL.B.',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
          bio: 'Advocate Seema Jha brings 4 years of dedicated practice across Civil, Family, Criminal, and Property matters.',
          perMinuteRate: 10,
          slotRates: { 15: 149, 30: 289, 45: 429, 60: 549 },
          isAvailableNow: true,
          phone: '+91 98670 15157',
          whatsapp: '919867015157',
        };
        startCallWithAdvocate(advocate, 15);
      },
    },
    {
      label: '📝 Legal Notice Drafting',
      urlParam: 'Legal Notice Drafting',
    },
    {
      label: '🏠 Property Dispute Advice',
      urlParam: 'Property Dispute Advice',
    },
  ];

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div
        id="n8n-chat-floating-trigger"
        className={`fixed bottom-6 left-6 z-40 flex items-center gap-3 transition-all duration-300 ${
          isN8NChatOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
      >
        <button
          onClick={handleOpenChat}
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 hover:scale-105 transition-all border border-amber-400/40 focus:ring-4 focus:ring-amber-400/30 cursor-pointer"
          aria-label="Open n8n AI Legal Assistant Chat"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold">
            <Bot className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>

          <div className="text-left hidden sm:block pr-1">
            <div className="text-xs font-bold flex items-center gap-1.5 text-white">
              <span>Legal AI Chat</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                n8n Live
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Ask legal query or book call</div>
          </div>

          {showNotificationBadge && !hasOpenedOnce && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-950 shadow-md animate-bounce">
              1
            </span>
          )}
        </button>
      </div>

      {/* Embedded n8n Chat Window */}
      {isN8NChatOpen && (
        <div
          id="n8n-chat-embedded-window"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-slate-300 overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10 rounded-2xl sm:rounded-3xl'
              : 'bottom-4 left-4 sm:bottom-6 sm:left-6 w-[calc(100vw-2rem)] sm:w-[420px] md:w-[450px] h-[580px] max-h-[88vh] rounded-2xl sm:rounded-3xl'
          }`}
          role="dialog"
          aria-label="n8n Legal Assistant Chat"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0">
                <Bot className="w-5 h-5 text-slate-950" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold font-display text-white">
                    Advocat Walla Legal AI
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Workflow className="w-3 h-3 text-amber-400" />
                  <span>Powered by n8n Workflow • Adv. Seema Jha Chamber</span>
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleRefresh}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Reload Chat"
              >
                <RefreshCw className={`w-4 h-4 ${iframeLoading ? 'animate-spin' : ''}`} />
              </button>

              <a
                href={N8N_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Open in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Restore window size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsN8NChatOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Consultation Banner & Action Chips */}
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0 text-xs">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={chip.action}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 text-slate-800 hover:text-slate-950 font-medium text-[11px] border border-slate-200 hover:border-amber-400 transition-colors cursor-pointer shadow-2xs flex-shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Embedded n8n Chat Iframe Container */}
          <div className="relative flex-1 w-full bg-slate-50 min-h-[350px]">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xs gap-3">
                <div className="w-9 h-9 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Connecting to n8n Legal Chat...</p>
                  <p className="text-[11px] text-slate-500 font-mono">sneha12345678.app.n8n.cloud</p>
                </div>
              </div>
            )}

            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={N8N_CHAT_URL}
              title="n8n Legal Assistant Chat"
              onLoad={() => setIframeLoading(false)}
              className="w-full h-full border-0"
              allow="clipboard-write; microphone; camera"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          </div>

          {/* Footer note */}
          <div className="bg-slate-900 px-3 py-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 flex-shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Direct counsel available on call (₹10/min)</span>
            </span>
            <span className="text-slate-500 font-mono text-[9px]">n8n webhook: 132d0d77...</span>
          </div>
        </div>
      )}
    </>
  );
};
