import React, { useState } from 'react';
import {
  Sparkles,
  PhoneCall,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Scale,
  Copy,
  Check,
  Settings,
  Maximize2,
  Minimize2,
  X,
  BookOpen,
  Send,
  HelpCircle,
  Award,
  Radio,
  Sliders,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { NEW_CRIMINAL_LAWS_MAPPINGS } from '../data/newCriminalLawsData';

const DEFAULT_N8N_URL = "https://sneha12345678.app.n8n.cloud/webhook/132d0d77-462f-4145-9ad3-834d69e75eaf/chat";

export const N8NMainChatStation: React.FC = () => {
  const { startCallWithAdvocate, setIsN8NModalOpen, addToast } = useCart();

  const [n8nUrl, setN8nUrl] = useState(() => {
    return localStorage.getItem('n8n_chat_webhook_url') || DEFAULT_N8N_URL;
  });
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'prompts' | 'settings'>('none');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const advocate = ADVOCATES_LIST[0];

  const quickPrompts = [
    {
      id: 'bns-420',
      title: '⚖️ BNS 2024: Cheating (Old IPC 420)',
      tag: 'Section 318(4)',
      promptText: 'What is the new section under Bharatiya Nyaya Sanhita (BNS 2024) for cheating (old IPC 420), what is the punishment, and is it cognizable / bailable?'
    },
    {
      id: 'sec-138-notice',
      title: '📜 Draft Section 138 Cheque Bounce Notice',
      tag: '15-Day Demand',
      promptText: 'Guide me step-by-step on how to draft and issue a statutory Legal Demand Notice under Section 138 of Negotiable Instruments Act for a bounced cheque of ₹2,50,000.'
    },
    {
      id: 'bail-procedure',
      title: '🛡️ Anticipatory Bail (BNSS 482)',
      tag: 'Old CrPC 438',
      promptText: 'How to apply for Anticipatory Bail under Section 482 of the Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) in apprehension of arrest in a false criminal case?'
    },
    {
      id: 'habeas-corpus',
      title: '🏛️ Article 226 Writ Petition',
      tag: 'High Court',
      promptText: 'A citizen is detained at a police station for over 24 hours without production before a Magistrate. How to file a Writ of Habeas Corpus under Article 226 of the Constitution of India?'
    },
    {
      id: 'property-eviction',
      title: '🏠 Tenant Eviction & Rent Recovery',
      tag: 'Legal Notice',
      promptText: 'My tenant has not paid rent for 4 months and refuses to vacate. What is the legal procedure to send a tenancy termination notice under Transfer of Property Act and file an eviction suit?'
    },
    {
      id: 'mutual-divorce',
      title: '💍 Mutual Consent Divorce (Sec 13B)',
      tag: 'Family Court',
      promptText: 'Explain the legal procedure, required documents, and timeline for filing a Mutual Consent Divorce petition under Section 13B of the Hindu Marriage Act, 1955.'
    }
  ];

  const handleRefreshChat = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
    addToast('Reloaded N8N Legal AI Session', 'info');
  };

  const handleCopyPrompt = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(title);
    addToast(`Copied: ${title}`, 'success');
    setTimeout(() => setCopiedText(null), 2200);
  };

  const handleSaveWebhook = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setN8nUrl(trimmed);
    localStorage.setItem('n8n_chat_webhook_url', trimmed);
    setIframeKey((prev) => prev + 1);
    setIsLoadingIframe(true);
    setActiveModal('none');
    addToast('Saved n8n Webhook URL', 'success');
  };

  return (
    <div className={`min-h-screen bg-[#040814] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      
      {/* Subtle modern ambient background */}
      <div className="fixed inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Top Clean Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg sticky top-0 z-30">
        
        {/* Brand & Live Online Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Scale className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white font-display">
                ADVOCAT WALLA
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>N8N AI Legal Assistant</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Indian Penal Laws (BNS 2024) • Writs • Verified by Adv. Seema Jha (D/5120/2022)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Quick Prompts modal button */}
          <button
            onClick={() => setActiveModal('prompts')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Prompts</span>
          </button>

          {/* Direct Advocate Consultation (₹10/min) */}
          <button
            onClick={() => startCallWithAdvocate(advocate, 15)}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40 cursor-pointer hover:scale-102 active:scale-98"
            title="Live consultation with Advocate Seema Jha"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>Call Advocate (₹10/m)</span>
          </button>

          {/* Automated Voice Call */}
          <button
            onClick={() => setIsN8NModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all cursor-pointer"
            title="Automated N8N AI phone call to your mobile"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Dispatch</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={getDirectWhatsAppUrl('Hello Advocate Seema Jha, I am using the N8N Legal AI Chatbot and need legal consultation.')}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="WhatsApp Chamber"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">WhatsApp</span>
          </a>

          {/* Refresh Chat */}
          <button
            onClick={handleRefreshChat}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Reload Chat"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIframe ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveModal('settings')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Webhook Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer hidden md:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Main Single-View Workstation Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-3">
        
        {/* Sleek Quick-Prompt Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 shrink-0 px-2 py-1 bg-amber-400/10 rounded-lg border border-amber-400/20">
            <Sparkles className="w-3 h-3" /> Quick Copy:
          </span>
          {quickPrompts.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => handleCopyPrompt(p.promptText, p.title)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/40 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span className="truncate max-w-[200px] sm:max-w-[260px] font-medium">{p.title}</span>
              {copiedText === p.title ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-slate-500 shrink-0" />
              )}
            </button>
          ))}
          <button
            onClick={() => setActiveModal('prompts')}
            className="shrink-0 px-2.5 py-1.5 rounded-xl text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
          >
            View all prompts →
          </button>
        </div>

        {/* Central Clean Chat Window Container */}
        <div className="flex-1 w-full bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative min-h-[600px]">
          
          {/* Iframe Loading State */}
          {isLoadingIframe && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <Scale className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-white">Loading N8N Legal AI Chatbot...</h4>
                <p className="text-xs text-slate-400">Connecting to secure chamber workflow</p>
              </div>
            </div>
          )}

          {/* Embedded n8n Live Chat Iframe */}
          <iframe
            key={iframeKey}
            src={n8nUrl}
            title="ADVOCAT WALLA N8N Legal AI Chatbot"
            onLoad={() => setIsLoadingIframe(false)}
            className="w-full flex-1 border-0 bg-slate-950 min-h-[580px]"
            allow="clipboard-write; microphone; camera; display-capture"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />

          {/* Clean Minimal Footer */}
          <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">Confidential Legal Consultation • Advocate Chamber Standing 12+ Years</span>
            </div>
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Popout</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      {/* Prompts Library Modal */}
      {activeModal === 'prompts' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-fadeIn overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Sample Legal Questions for N8N Chatbot</h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
              {quickPrompts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleCopyPrompt(item.promptText, item.title);
                    setActiveModal('none');
                  }}
                  className="p-3 bg-slate-950 hover:bg-slate-800/70 border border-slate-800 hover:border-amber-400/50 rounded-xl cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white group-hover:text-amber-300">{item.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 font-mono">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                    "{item.promptText}"
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                    <Copy className="w-3 h-3" />
                    <span>Click to copy & close</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">N8N Webhook Configuration</h3>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                N8N Chat Webhook URL
              </label>
              <textarea
                rows={3}
                value={n8nUrl}
                onChange={(e) => setN8nUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-white focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleSaveWebhook(n8nUrl)}
                className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Save & Connect
              </button>
              <button
                onClick={() => handleSaveWebhook(DEFAULT_N8N_URL)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
