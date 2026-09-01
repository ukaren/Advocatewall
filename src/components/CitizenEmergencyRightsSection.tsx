import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Scale, 
  FileText, 
  PhoneCall, 
  Info, 
  Clock, 
  Award,
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { CITIZEN_EMERGENCY_RIGHTS, CitizenRightItem } from '../data/legalTriageData';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const CitizenEmergencyRightsSection: React.FC = () => {
  const [activeRightId, setActiveRightId] = useState<string>(CITIZEN_EMERGENCY_RIGHTS[0].id);
  const { startCallWithAdvocate } = useCart();
  const leadAdvocate = ADVOCATES_LIST[0];

  const currentRight = CITIZEN_EMERGENCY_RIGHTS.find(r => r.id === activeRightId) || CITIZEN_EMERGENCY_RIGHTS[0];

  const handleWhatsAppEmergency = () => {
    const msg = `🚨 *URGENT LEGAL AID QUERY - ADVOCATE WALLA*\n\nHello Adv. Seema Jha,\nI need immediate legal advice regarding police notice / citizen rights.\nApplicable Issue: ${currentRight.title}\n\nPlease guide me on immediate procedural steps.`;
    window.open(getDirectWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="emergency-rights" className="py-16 bg-slate-50 relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Citizen Rights & Police Guidelines (BNSS 2024–2026)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif">
            Emergency Police & Arrest Rights Shield
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-['Noto_Serif_Devanagari']">
            पुलिस जांच, नोटिस, गिरफ्तारी व जीरो एफआईआर से जुड़े आपके मौलिक अधिकार
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Tabs */}
          <div className="lg:col-span-4 space-y-2.5">
            {CITIZEN_EMERGENCY_RIGHTS.map((right) => {
              const isSelected = right.id === activeRightId;
              return (
                <button
                  key={right.id}
                  onClick={() => setActiveRightId(right.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-amber-400/40'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {right.badge}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {right.title}
                  </h3>
                  <p
                    className={`text-xs font-['Noto_Serif_Devanagari'] mt-1 truncate ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {right.hindiTitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md text-left">
            {/* Statute Title */}
            <div className="pb-4 mb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Applicable Legal Section:
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {currentRight.lawSection}
                </h3>
              </div>

              <button
                onClick={handleWhatsAppEmergency}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Legal Helpline</span>
              </button>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <p className="text-sm text-slate-700 leading-relaxed">
                {currentRight.description}
              </p>
              <p className="text-xs text-slate-600 font-['Noto_Serif_Devanagari'] mt-2 p-3 bg-amber-50/60 rounded-xl border border-amber-200/50">
                📌 <strong>सरल हिंदी अर्थ:</strong> {currentRight.hindiDescription}
              </p>
            </div>

            {/* Do's and Don'ts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Do's */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Citizen Rights (What you SHOULD do)</span>
                </h4>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {currentRight.citizenDos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-700 stroke-[3]" />
                  <span>Critical Cautions (What you MUST NOT do)</span>
                </h4>
                <ul className="space-y-2 text-xs text-rose-950">
                  {currentRight.citizenDonts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Advocate Connect Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-600">
                  Facing police summons or FIR? Speak to Advocate Seema Jha in strict confidentiality.
                </span>
              </div>

              <button
                onClick={() => startCallWithAdvocate(leadAdvocate, 15)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-slate-950" />
                <span>Call Legal Counsel (₹10/min)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
