import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldAlert, 
  Briefcase, 
  Landmark, 
  Building, 
  Users, 
  ShoppingBag, 
  Clock, 
  Scale, 
  FileText, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Zap
} from 'lucide-react';
import { LEGAL_TRIAGE_SCENARIOS, CaseTriageItem } from '../data/legalTriageData';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';

interface InteractiveCaseTriageProps {
  onExploreNotices: () => void;
  onExploreAdvocates: () => void;
}

export const InteractiveCaseTriage: React.FC<InteractiveCaseTriageProps> = ({
  onExploreNotices,
  onExploreAdvocates
}) => {
  const [selectedId, setSelectedId] = useState<string>(LEGAL_TRIAGE_SCENARIOS[0].id);
  const { startCallWithAdvocate } = useCart();
  const leadAdvocate = ADVOCATES_LIST[0];

  const currentItem = LEGAL_TRIAGE_SCENARIOS.find(item => item.id === selectedId) || LEGAL_TRIAGE_SCENARIOS[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Landmark': return <Landmark className="w-5 h-5" />;
      case 'Building': return <Building className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      default: return <Scale className="w-5 h-5" />;
    }
  };

  const handleAction = () => {
    if (currentItem.actionType === 'call') {
      startCallWithAdvocate(leadAdvocate, currentItem.estimatedConsultationDuration);
    } else {
      onExploreNotices();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-4 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Instant Case Triage & Limitation Calculator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
            What legal issue are you facing today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-['Noto_Serif_Devanagari'] mt-0.5">
            अपनी कानूनी स्थिति चुनें और तत्काल समाधान, समय-सीमा व नियम जानें
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">Lawyer On-Call: ₹10/Min</span>
        </div>
      </div>

      {/* Main Grid: Selector Tabs + Solution Live Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Interactive Scenario Selector Buttons */}
        <div className="lg:col-span-5 p-3 sm:p-4 bg-slate-50/80 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-1.5 max-h-[380px] lg:max-h-[440px] overflow-y-auto">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5">
            Select Legal Situation (7 Categories)
          </p>
          {LEGAL_TRIAGE_SCENARIOS.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 border cursor-pointer ${
                  isSelected
                    ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {getIcon(item.iconName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.urgencyLevel === 'Critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.urgencyLevel} Urgency
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-['Noto_Serif_Devanagari'] truncate">
                    {item.hindiTitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Live Legal Action Breakdown */}
        <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-white">
          <div>
            {/* Urgency & Timeline Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">
                  Limitation Window:
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {currentItem.statutoryTimeline}
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Standard: <strong className="text-slate-800 font-bold">15-Day Notice Rule</strong>
              </span>
            </div>

            {/* Applicable Law Title */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Applicable Indian Law / Statute</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentItem.applicableLaw}
              </h4>
            </div>

            {/* Action Roadmap */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-4">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Recommended Immediate Legal Step:
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {currentItem.recommendedAction}
                  </p>
                  <p className="text-[11px] text-amber-900 font-['Noto_Serif_Devanagari'] font-medium mt-1">
                    {currentItem.hindiAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Required Checklist */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Documents Needed for Drafting / Case:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentItem.documentsNeeded.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[11px] text-slate-500 block">Consultation Cost:</span>
              <span className="text-base sm:text-lg font-bold text-slate-900">
                ₹{currentItem.estimatedConsultationDuration * 10}{' '}
                <span className="text-xs font-normal text-slate-500">({currentItem.estimatedConsultationDuration} min call)</span>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => startCallWithAdvocate(leadAdvocate, currentItem.estimatedConsultationDuration)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-slate-950" />
                <span>Call Advocate Now</span>
              </button>

              <button
                onClick={onExploreNotices}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <span>Draft Notice</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
