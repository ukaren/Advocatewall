import React from 'react';
import { AlertCircle, Scale } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

export const LegalDisclaimer: React.FC = () => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 sm:px-6 lg:px-8 text-[11px] sm:text-xs leading-relaxed">
      <div className="max-w-7xl mx-auto flex items-start gap-3">
        <Scale className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-slate-300 font-semibold mb-1">
            Bar Council of India Compliance & Legal Disclaimer
          </p>
          <p className="text-slate-400 leading-normal">
            As per the rules of the Bar Council of India, advocates are prohibited from soliciting work or advertising. This website ({BUSINESS_CONFIG.name}) is intended for general informational purposes only and does not constitute an advertisement, solicitation, personal communication, invitation, or legal advice. Transmission, receipt, or use of this site does not establish an advocate-client relationship. All visitors acknowledge that they are accessing information voluntarily to understand legal services and drafting assistance.
          </p>
        </div>
      </div>
    </div>
  );
};
