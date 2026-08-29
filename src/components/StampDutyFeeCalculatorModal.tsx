import React, { useState } from 'react';
import { X, Calculator, Scale, FileText, CheckCircle2, Info, Building2, PhoneCall } from 'lucide-react';
import { STATE_STAMP_DUTY_CALCULATOR_DATA } from '../data/legalDraftTemplates';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface StampDutyFeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCallModal?: () => void;
}

export const StampDutyFeeCalculatorModal: React.FC<StampDutyFeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenCallModal
}) => {
  const [selectedState, setSelectedState] = useState<string>(STATE_STAMP_DUTY_CALCULATOR_DATA[0].state);
  const [instrumentType, setInstrumentType] = useState<'agreement' | 'cheque_court_fee' | 'gift_deed' | 'affidavit'>('agreement');
  const [claimAmount, setClaimAmount] = useState<number>(250000);

  if (!isOpen) return null;

  const currentStateData = STATE_STAMP_DUTY_CALCULATOR_DATA.find(s => s.state === selectedState) || STATE_STAMP_DUTY_CALCULATOR_DATA[0];

  const estimatedChequeCourtFee = Math.min(Math.max(Math.round(claimAmount * 0.015), 500), 10000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Stamp Duty & Court Fee Estimator</h3>
              <p className="text-[11px] text-slate-400">State-wise schedule for e-Stamping, Court Fees & Agreements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-900 text-xs sm:text-sm">
          
          {/* State Selector */}
          <div>
            <label className="block font-bold text-xs text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Select State / Jurisdiction:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STATE_STAMP_DUTY_CALCULATOR_DATA.map((s) => (
                <button
                  key={s.state}
                  onClick={() => setSelectedState(s.state)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                    selectedState === s.state
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {s.state}
                </button>
              ))}
            </div>
          </div>

          {/* Instrument Type Selector */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-xs text-slate-700 mb-1.5">
              Select Legal Instrument / Document:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'agreement', label: 'Commercial Agreement' },
                { id: 'cheque_court_fee', label: 'Cheque Bounce Court Fee' },
                { id: 'gift_deed', label: 'Gift / Transfer Deed' },
                { id: 'affidavit', label: 'Affidavit / Undertaking' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setInstrumentType(t.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    instrumentType === t.id
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* If Cheque Bounce, show claim amount slider */}
          {instrumentType === 'cheque_court_fee' && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-900">Cheque / Claim Amount:</span>
                <span className="font-mono font-bold text-amber-950 text-sm">₹{claimAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2500000"
                step="10000"
                value={claimAmount}
                onChange={(e) => setClaimAmount(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-amber-800">
                <span>₹10,000</span>
                <span>₹10,00,000</span>
                <span>₹25,00,000</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex justify-between items-center text-xs">
                <span className="text-slate-700">Estimated Statutory Court Fee ({selectedState}):</span>
                <span className="font-bold text-slate-950 text-sm font-mono">≈ ₹{estimatedChequeCourtFee.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Overview Breakdown Table for Selected State */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>{selectedState} Statutory Duty Rates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">General Agreement e-Stamp:</span>
                <span className="font-bold text-slate-900">{currentStateData.agreementDuty}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Affidavit / Notary e-Stamp:</span>
                <span className="font-bold text-slate-900">{currentStateData.affidavitNotary}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Gift / Family Transfer Deed:</span>
                <span className="font-bold text-slate-900">{currentStateData.giftDeed}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Court Fee Act Governing Rule:</span>
                <span className="font-bold text-slate-900">{currentStateData.courtFeeCheque}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p>
              e-Stamp certificates are generated through Stock Holding Corporation of India Limited (SHCIL) or the respective State Revenue portal. Advocate Seema Jha provides comprehensive e-Stamping, franking & drafting support.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-600 text-center sm:text-left">
            Need custom e-Stamping & registration consultation?
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onOpenCallModal) onOpenCallModal();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Advocate ₹10/min</span>
            </button>
            <a
              href={getDirectWhatsAppUrl(`Hello Advocate,\nI need advice on Stamp Duty and Court Fee estimation in ${selectedState} for an agreement/claim.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
