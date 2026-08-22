import React from 'react';
import { Scale, Award, BookOpen, CheckCircle, Shield, Briefcase, ExternalLink, MessageSquare, PhoneCall } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const AboutSection: React.FC = () => {
  const { startCallWithAdvocate } = useCart();
  const advocate = ADVOCATES_LIST[0];

  const practiceAreas = [
    'Civil Litigation & Property Dispute Advisory',
    'Commercial Contracts, NDAs & Agreements',
    'Consumer Protection Claims & Statutory Notices',
    'Tenancy, Lease & Rent Agreements',
    'Family Law, Matrimonial & Mutual Divorce',
    'Negotiable Instruments Act (Cheque Dishonour)',
    'Criminal Law Advisory & Police Complaints'
  ];

  const values = [
    {
      title: 'Uncompromised Confidentiality',
      desc: 'Treating all client facts, documents, and call discussions under strict advocate-client legal privilege.'
    },
    {
      title: 'Pragmatic Legal Guidance',
      desc: 'Prioritizing sensible, cost-effective settlements and clear statutory notices before entering lengthy court battles.'
    },
    {
      title: 'Transparent Per-Minute Pricing',
      desc: 'No hidden chamber charges. Transparent ₹10/min rate or affordable fixed bundles for your exact consultation requirements.'
    }
  ];

  return (
    <section id="about" className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Advocate Profile & Credentials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={advocate.avatar}
                  alt={advocate.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {advocate.name}
                  </h3>
                  <p className="text-amber-300 text-xs sm:text-sm font-medium">
                    {advocate.education} • {advocate.title}
                  </p>
                  <p className="text-slate-400 text-[11px] font-mono mt-0.5">
                    {advocate.barRegistration}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-slate-800 pt-5 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Legal Practice Experience:</span>
                  <span className="text-white font-medium">4 Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Consultation Rate:</span>
                  <span className="text-amber-300 font-bold">₹10 / Minute</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Primary Jurisdictions:</span>
                  <span className="text-white font-medium">District & Sessions Courts, High Court</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Consultation Modes:</span>
                  <span className="text-emerald-400 font-medium">Direct Phone Call / WhatsApp Audio & Video</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => startCallWithAdvocate(advocate, 15)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors shadow-md text-xs sm:text-sm cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Adv. Seema Jha</span>
                </button>
                <a
                  href={getDirectWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-md text-xs sm:text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Chamber Location Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1 font-display">
                <Briefcase className="w-4 h-4 text-amber-700" />
                <span>Chamber Address</span>
              </div>
              <p className="text-slate-600">{BUSINESS_CONFIG.address}</p>
              <p className="text-slate-500 font-medium pt-1">
                Hours: {BUSINESS_CONFIG.workingHours}
              </p>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-md">
                Professional Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display mt-3 mb-4">
                Committed to Transparent, Accessible Legal Counsel
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                Legal consultations and agreement drafting shouldn't feel intimidating, opaque, or unnecessarily expensive. {BUSINESS_CONFIG.name} with Advocate Seema Jha (B.A. LL.B., 4 Years Experience) offers transparent per-minute legal calling and verified document drafting.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you need urgent advice for a police complaint, mutual family settlement, rental dispute, cheque dishonour under Sec 138, or a statutory legal notice, you can directly consult on call or request drafted agreements with ease.
              </p>
            </div>

            {/* Areas of Practice */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-3">
                Key Practice Areas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {practiceAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-3">
                Professional Standards
              </h3>
              <div className="space-y-3">
                {values.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

