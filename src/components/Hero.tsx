import React, { useState } from 'react';
import { 
  Shield, 
  MessageSquare, 
  ArrowDown, 
  Sparkles, 
  Scale, 
  Clock, 
  Award, 
  PhoneCall, 
  Timer, 
  UserCheck, 
  Calculator,
  Zap,
  CheckCircle2,
  Video
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';
import { AdvocateWallaLogo } from './AdvocateWallaLogo';
import { InteractiveCaseTriage } from './InteractiveCaseTriage';

interface HeroProps {
  onExploreServices: () => void;
  onExploreAdvocates: () => void;
  onWhyUsClick: () => void;
  onExploreBns?: () => void;
  onExploreNotices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreServices, 
  onExploreAdvocates, 
  onWhyUsClick,
  onExploreBns,
  onExploreNotices
}) => {
  const { startCallWithAdvocate } = useCart();
  const leadAdvocate = ADVOCATES_LIST[0];
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [activeHeroTab, setActiveHeroTab] = useState<'triage' | 'calculator'>('triage');

  const durationOptions = [
    { mins: 10, price: 100, label: 'Quick Advice', desc: 'Notice reply / procedural doubts' },
    { mins: 15, price: 150, label: 'Standard Call', desc: 'Case review & draft discussion' },
    { mins: 30, price: 300, label: 'In-Depth Strategy', desc: 'Complex property / civil dispute' },
    { mins: 45, price: 450, label: 'Comprehensive', desc: 'Full document analysis & litigation plan' }
  ];

  return (
    <section id="home" className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200/70 overflow-hidden">
      {/* Subtle architectural background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Bilingual Brand Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex p-2 px-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xs backdrop-blur-xs">
              <AdvocateWallaLogo size="sm" showSubtitle={true} showDevnagriBadge={true} />
            </div>
          </div>

          {/* Trust pill with Calling Announcement */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-semibold tracking-wide uppercase shadow-xs">
              <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Advocate Consultation On Call • ₹10/Minute</span>
            </div>
            {onExploreBns && (
              <button
                onClick={onExploreBns}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/20 text-slate-900 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30 transition-colors cursor-pointer"
              >
                <Scale className="w-3 h-3 text-amber-700" />
                <span>BNS 2024 Law Mapper</span>
              </button>
            )}
            {onExploreNotices && (
              <button
                onClick={onExploreNotices}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Legal Notice Drafter</span>
              </button>
            )}
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.15] font-display mb-4">
            Legal Help.{' '}
            <span className="relative inline-block text-slate-900">
              Simplified.
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-amber-300/40 -z-10 rounded-sm"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-6 max-w-2xl mx-auto">
            Consult <strong>Advocate Seema Jha (B.A. LL.B., 4 Years Experience)</strong> directly on call with transparent ₹10/minute charges, or order custom verified legal drafts online.
          </p>

          {/* Advocate Header Card with Clean View Profile CTA */}
          <div className="max-w-xl mx-auto mb-6 p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all text-left">
            <div className="flex items-center gap-4">
              {/* Advocate Avatar */}
              <div className="relative shrink-0">
                <img
                  src={leadAdvocate.avatar}
                  alt={leadAdvocate.name}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-amber-400 object-cover shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" title="Online for Consultations">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75"></span>
                </span>
              </div>

              {/* Advocate Name & View Profile Button Directly Below */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display truncate">
                    {leadAdvocate.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online</span>
                  </span>
                </div>

                {/* View Advocate Profile Button - Cleanly positioned directly below Advocate Name */}
                <button
                  id="hero-explore-advocates-btn"
                  onClick={onExploreAdvocates}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Advocate Profile</span>
                </button>
              </div>
            </div>

            {/* Quick Action Strip below Advocate Info */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <span className="text-xs text-slate-600 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-600" />
                <span>Call Rate: <strong className="text-slate-900 font-bold">₹10/Minute</strong></span>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="hero-video-call-advocate-btn"
                  onClick={() => startCallWithAdvocate(leadAdvocate, selectedMinutes, 'video_call')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-300 hover:to-amber-200 transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-slate-950" />
                  <span>Video Call (₹{selectedMinutes * 10})</span>
                </button>

                <button
                  id="hero-call-advocate-btn"
                  onClick={() => startCallWithAdvocate(leadAdvocate, selectedMinutes, 'instant_phone')}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
                  title="Direct Voice Call"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden xs:inline">Voice</span>
                </button>

                <button
                  id="hero-explore-services-btn"
                  onClick={onExploreServices}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                >
                  <span>Drafting</span>
                  <ArrowDown className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Feature Toggles: Case Triage vs Live Fee Calculator */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveHeroTab('triage')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeHeroTab === 'triage'
                ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Interactive Case Triage & Timelines</span>
          </button>

          <button
            onClick={() => setActiveHeroTab('calculator')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeHeroTab === 'calculator'
                ? 'bg-slate-900 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>₹10/Min Live Call Estimator</span>
          </button>
        </div>

        {/* Active Hero Tab View */}
        {activeHeroTab === 'triage' ? (
          <InteractiveCaseTriage
            onExploreNotices={onExploreNotices || onExploreServices}
            onExploreAdvocates={onExploreAdvocates}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-8 text-left max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Transparent Pay-As-You-Go Consultation
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Select Call Duration & Calculate Exact Fee
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Rate:</span>
                <span className="text-lg font-black text-amber-600">₹10 / Minute</span>
              </div>
            </div>

            {/* Duration Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {durationOptions.map((opt) => {
                const isSelected = selectedMinutes === opt.mins;
                return (
                  <button
                    key={opt.mins}
                    onClick={() => setSelectedMinutes(opt.mins)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-amber-400 shadow-md'
                        : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                        {opt.mins} Minutes
                      </span>
                      <span className={`text-sm font-black ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
                        ₹{opt.price}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {opt.label}
                    </h4>
                    <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Instant Booking Trigger */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs text-slate-700">
                  You selected <strong className="text-slate-900">{selectedMinutes} Minutes</strong> of direct telephone consultation for <strong className="text-amber-800 font-bold">₹{selectedMinutes * 10}</strong> with Advocate Seema Jha.
                </div>
              </div>

              <button
                onClick={() => startCallWithAdvocate(leadAdvocate, selectedMinutes)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-slate-950" />
                <span>Start Call for ₹{selectedMinutes * 10}</span>
              </button>
            </div>
          </div>
        )}

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



