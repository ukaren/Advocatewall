import React from 'react';
import { Shield, MessageSquare, ArrowDown, Sparkles, Scale, Clock, Award, PhoneCall, Timer, UserCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';

interface HeroProps {
  onExploreServices: () => void;
  onExploreAdvocates: () => void;
  onWhyUsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onExploreAdvocates, onWhyUsClick }) => {
  const { startCallWithAdvocate } = useCart();
  const leadAdvocate = ADVOCATES_LIST[0];

  return (
    <section id="home" className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200/70 overflow-hidden">
      {/* Subtle architectural background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust pill with Calling Announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-wide uppercase shadow-xs mb-6">
            <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Advocate Consultation On Call • ₹10/Minute</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15] font-display mb-5">
            Legal Help.{' '}
            <span className="relative inline-block text-slate-900">
              Simplified.
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-amber-300/40 -z-10 rounded-sm"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Consult <strong>Advocate Seema Jha (B.A. LL.B., 4 Years Experience)</strong> directly on call with transparent ₹10/minute charges, or order custom verified legal drafts online.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
            <button
              id="hero-call-advocate-btn"
              onClick={() => startCallWithAdvocate(leadAdvocate, 15)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-slate-950 animate-bounce" />
              <span>Call Adv. Seema Jha (₹10/min)</span>
            </button>

            <button
              id="hero-explore-advocates-btn"
              onClick={onExploreAdvocates}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>View Advocate Profile</span>
            </button>

            <button
              id="hero-explore-services-btn"
              onClick={onExploreServices}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <span>Legal Drafting</span>
              <ArrowDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Advocate Highlight Badge */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <img
                src={leadAdvocate.avatar}
                alt={leadAdvocate.name}
                className="w-9 h-9 rounded-full border-2 border-amber-400 object-cover shadow-xs"
              />
              <div className="text-left">
                <span className="font-bold text-slate-900 block leading-tight">{leadAdvocate.name}</span>
                <span className="text-[11px] text-slate-500">{leadAdvocate.education} • 4 Years Experience</span>
              </div>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="text-center sm:text-left">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Available for Direct Calling & WhatsApp Consultations</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Timer className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base mb-1">₹10/Min Consultation</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Transparent per-minute billing for 4 years experienced legal counsel.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base mb-1">100% Confidential</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Privileged advocate-client privacy for all calls & documents.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base mb-1">B.A. LL.B. Qualified</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bar Council verified legal practitioner across Civil, Family & Criminal.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Fast Turnaround</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Agreements & notices drafted and delivered in 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


