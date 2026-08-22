import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, Scale } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

interface LegalPolicyModalProps {
  policyType: string | null;
  onClose: () => void;
}

export const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({
  policyType,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (policyType) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [policyType, onClose]);

  if (!policyType) return null;

  const renderContent = () => {
    switch (policyType) {
      case 'privacy':
        return (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Privacy Policy & Client Data Confidentiality
            </h3>
            <p>
              At <strong>{BUSINESS_CONFIG.name}</strong>, maintaining client confidentiality is the cornerstone of our legal practice. We adhere strictly to Section 126 of the Indian Evidence Act (Advocate-Client Privilege) and international privacy standards.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">1. Collection of Information</h4>
            <p>
              We only collect information directly submitted by you—such as your name, phone number, email address, contract drafts, and case facts necessary to evaluate your legal requirements and draft documents.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">2. Confidential Use</h4>
            <p>
              Your personal information, shared deeds, or draft notices will <strong>never</strong> be sold, rented, or disclosed to third-party marketing companies. Data is accessed solely by {BUSINESS_CONFIG.advocateName} and retained securely for document revision purposes.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">3. Storage & Deletion</h4>
            <p>
              Cart items and enquiry preferences stored in your browser's local storage can be cleared at any time by clicking "Clear Cart" or clearing browser cookies.
            </p>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Terms & Conditions of Service
            </h3>
            <p>
              Welcome to <strong>{BUSINESS_CONFIG.name}</strong>. By browsing this marketplace or submitting an enquiry for legal drafting, you agree to the following terms:
            </p>
            <h4 className="font-bold text-slate-900 pt-2">1. Scope of Online Drafting & Consultations</h4>
            <p>
              Our online services comprise document drafting, contract review audits, and telephonic/video legal consultations. Statutory court filings, physical representations, or out-of-pocket stamp paper expenses are not included unless expressly quoted and contracted separately.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">2. Turnaround & Revisions</h4>
            <p>
              Standard document drafting is completed within 24 to 48 working hours from the receipt of all required facts and supporting documents. Each service includes 1 round of factual revisions within 7 days of initial draft delivery.
            </p>
            <h4 className="font-bold text-slate-900 pt-2">3. No Guaranteed Legal Outcomes</h4>
            <p>
              Legal advice and notices represent professional legal opinions based on current legislation and facts provided. No advocate can legally guarantee specific judicial outcomes.
            </p>
          </div>
        );

      case 'disclaimer':
      default:
        return (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Bar Council of India Disclaimer
            </h3>
            <p>
              Under the rules of the Bar Council of India (BCI), advocates are not permitted to solicit clients or advertise their services.
            </p>
            <p>
              By accessing this website (<strong>{BUSINESS_CONFIG.name}</strong>), you acknowledge and confirm that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are seeking information relating to legal services of your own volition and there has been no advertisement, personal communication, solicitation, invitation, or inducement of any sort.</li>
              <li>The information provided under this website is solely available for informational purposes and should not be interpreted as legal advice.</li>
              <li>The Advocate is not liable for any action taken by relying on the material/information provided on this website.</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div
      id="legal-policy-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white font-display">
              Legal & Compliance Information
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
          {renderContent()}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
