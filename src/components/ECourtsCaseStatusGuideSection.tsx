import React, { useState } from 'react';
import { 
  Landmark, 
  Search, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  PhoneCall, 
  ShieldCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';

export const ECourtsCaseStatusGuideSection: React.FC = () => {
  const [sampleCnr, setSampleCnr] = useState('DLHC010045232024');
  const [courtType, setCourtType] = useState<'district' | 'highcourt' | 'supreme'>('district');
  const { startCallWithAdvocate } = useCart();
  const leadAdvocate = ADVOCATES_LIST[0];

  // CNR Structure Breakdown Helper
  const parseCnr = (cnr: string) => {
    const clean = cnr.trim().toUpperCase();
    if (clean.length >= 16) {
      return {
        state: clean.substring(0, 2) + ' (State Code)',
        district: clean.substring(2, 4) + ' (District Code)',
        court: clean.substring(4, 6) + ' (Court Establishment)',
        caseNum: clean.substring(6, 12) + ' (Filing Serial No)',
        year: clean.substring(12, 16) + ' (Filing Year)',
        isValid: true
      };
    }
    return {
      state: 'State (2 Letters)',
      district: 'District (2 Digits)',
      court: 'Court (2 Digits)',
      caseNum: 'Number (6 Digits)',
      year: 'Year (4 Digits)',
      isValid: false
    };
  };

  const parsed = parseCnr(sampleCnr);

  return (
    <section id="ecourts-guide" className="py-16 bg-white relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Landmark className="w-3.5 h-3.5 text-blue-600" />
            <span>National Judicial Data Grid (eCourts) Guide</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif">
            eCourts Case Status & CNR Number Decoder
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-['Noto_Serif_Devanagari']">
            अपने 16-अंकों के CNR नंबर की बनावट समझें, सुनवाई की तारीखें व कोर्ट आदेश ट्रैक करें
          </p>
        </div>

        {/* CNR Interactive Decoder Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input & Explanation */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <h3 className="text-lg font-bold text-white font-serif">
                  Interactive 16-Digit CNR Decoder
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The <strong>Case Number Record (CNR)</strong> is a unique 16-alphanumeric code assigned to every pending case in Indian District & High Courts. Enter or customize your CNR to see the exact breakdown:
              </p>

              {/* Input Box */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Enter or Test a 16-Digit CNR Number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={16}
                    value={sampleCnr}
                    onChange={(e) => setSampleCnr(e.target.value.toUpperCase())}
                    placeholder="e.g. DLHC010045232024"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-amber-300 font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-amber-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                    {sampleCnr.length}/16 Digits
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="text-slate-400">Try Sample:</span>
                <button
                  onClick={() => setSampleCnr('DLHC010045232024')}
                  className="text-amber-400 underline hover:text-amber-300 cursor-pointer"
                >
                  Delhi High Court
                </button>
                <span>•</span>
                <button
                  onClick={() => setSampleCnr('UPHC020112342023')}
                  className="text-amber-400 underline hover:text-amber-300 cursor-pointer"
                >
                  Allahabad HC
                </button>
                <span>•</span>
                <button
                  onClick={() => setSampleCnr('MHCC030098762024')}
                  className="text-amber-400 underline hover:text-amber-300 cursor-pointer"
                >
                  Mumbai Sessions
                </button>
              </div>
            </div>

            {/* Visual Chip Breakdown */}
            <div className="lg:col-span-6 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Decoded Structural Anatomy:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">State Code</span>
                  <strong className="text-sm text-amber-300 font-mono">{parsed.state}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">District</span>
                  <strong className="text-sm text-amber-300 font-mono">{parsed.district}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Establishment</span>
                  <strong className="text-sm text-amber-300 font-mono">{parsed.court}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase block">Case Filing Serial</span>
                  <strong className="text-sm text-white font-mono">{parsed.caseNum}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Year</span>
                  <strong className="text-sm text-emerald-400 font-mono">{parsed.year}</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => startCallWithAdvocate(leadAdvocate, 15)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-slate-950" />
                  <span>Request Advocate Second Opinion on Your Case (₹10/min)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Guide to Check Hearing Dates & Orders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mb-3">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Find Next Hearing Date & Stage
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use official eCourts Services app or portal with your 16-digit CNR to verify whether the case is listed for Evidence, Framing of Charges, or Final Arguments.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs mb-3">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Download Daily Court Orders
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every interim order sheet and ruling is uploaded on CIS within 24 hours of court proceedings. Review signed order sheets before every next hearing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs mb-3">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Apply for Certified Copies
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              For appeals in High Courts or execution petitions, obtain court-stamped certified copies through your advocate directly from the court copying agency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
