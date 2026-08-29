import React from 'react';
import { Scale, Phone, Mail, MessageSquare, ArrowUp, ShieldCheck, Heart, Workflow } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { LegalDisclaimer } from './LegalDisclaimer';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPolicy: (policy: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy }) => {
  const { setIsN8NModalOpen } = useCart();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-white">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white font-display">
                  {BUSINESS_CONFIG.name}
                </span>
                <p className="text-xs text-amber-400 font-medium">
                  {BUSINESS_CONFIG.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Professional, confidential, and transparent legal services & consultations, available online across India.
            </p>

            <div className="pt-2 text-xs text-slate-400">
              <span className="block text-slate-300 font-medium">{BUSINESS_CONFIG.advocateName}</span>
              <span className="text-slate-400">{BUSINESS_CONFIG.advocateTitle}</span>
              <span className="block text-slate-400 font-mono text-[11px] mt-0.5">{BUSINESS_CONFIG.barRegistration}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Why Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Advocate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Chamber
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('new-criminal-laws')}
                  className="text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>New Criminal Laws 2024 (BNS/BNSS)</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">BNS</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notice-generator')}
                  className="text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Legal Notice Drafter (Sec 138 / Eviction)</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">Drafts</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('constitution')}
                  className="text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Constitution of India (All Rules)</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">Samvidhan</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('partner-join')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Join as Advocate Partner</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/40">Empanelment</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsN8NModalOpen(true)}
                  className="hover:text-amber-400 text-amber-300/90 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Workflow className="w-3.5 h-3.5" />
                  <span>n8n & Telephony Setup</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy & Confidentiality
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Bar Council Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
              Get in Touch
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <a
                href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{BUSINESS_CONFIG.phone}</span>
              </a>

              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp Chat</span>
              </a>

              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">{BUSINESS_CONFIG.email}</span>
              </a>

              <div className="pt-2 text-[11px] text-slate-400">
                Hours: {BUSINESS_CONFIG.workingHours}
              </div>
            </div>
          </div>
        </div>

        {/* Back to top button & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All Rights Reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mandatory Bar Council Legal Disclaimer Bar */}
      <LegalDisclaimer />
    </footer>
  );
};
