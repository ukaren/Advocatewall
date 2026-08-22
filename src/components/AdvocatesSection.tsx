import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Scale,
  Star,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  Award,
  Search,
  CheckCircle,
  Phone,
  Timer,
  GraduationCap,
  FileCheck
} from 'lucide-react';
import { ADVOCATES_LIST } from '../data/advocates';
import { AdvocateProfile } from '../types';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const AdvocatesSection: React.FC = () => {
  const { startCallWithAdvocate } = useCart();
  const advocate = ADVOCATES_LIST[0]; // Adv. Seema Jha

  const whatsAppText = `Hello Adv. Seema Jha,\n\nI want to book a legal consultation call with you regarding your legal advisory.\n\nPlease let me know your availability for a 15/30-minute call.`;
  const whatsAppUrl = getDirectWhatsAppUrl(whatsAppText);

  return (
    <section id="advocates" className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Advocate On Call • ₹10/Minute</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display mb-3">
            Consult Advocate Seema Jha on Call
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connect directly with <strong>Adv. Seema Jha (B.A. LL.B., 4 Years Experience)</strong> for legal consultation over phone or WhatsApp audio/video with transparent per-minute charges.
          </p>
        </div>

        {/* Live Calling Advantage Bar */}
        <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-amber-400 font-bold text-lg block font-display">₹10/Min</span>
            <span className="text-[11px] text-slate-300">Affordable Per-Minute Rate</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold text-lg block font-display">4 Years</span>
            <span className="text-[11px] text-slate-300">Court Practice Experience</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-white font-bold text-lg block font-display">B.A. LL.B.</span>
            <span className="text-[11px] text-slate-300">Verified Legal Qualification</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold text-lg block font-display">100% Secure</span>
            <span className="text-[11px] text-slate-300">Advocate-Client Privilege</span>
          </div>
        </div>

        {/* Advocate Main Feature Card */}
        <div className="max-w-4xl mx-auto">
          <div
            id={`advocate-card-${advocate.id}`}
            className="rounded-3xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 shadow-2xl overflow-hidden transition-all"
          >
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
                {/* Profile Photo with Online Badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-3 border-amber-400/80 shadow-xl bg-slate-900">
                    <img
                      src={advocate.avatar}
                      alt={advocate.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-2 flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-[11px] font-semibold text-emerald-400 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online Now</span>
                  </span>
                </div>

                {/* Profile Information */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-md">
                      B.A. LL.B. • 4 Years Experience
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {advocate.barRegistration}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {advocate.name}
                  </h3>
                  <p className="text-sm text-amber-300 font-medium mt-0.5">
                    {advocate.title} • {advocate.education}
                  </p>

                  <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                    {advocate.bio}
                  </p>

                  {/* Rating & Fast Stats */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mt-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{advocate.rating} Rating</span>
                    </span>
                    <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                      <strong>4 Years</strong> Active Practice
                    </span>
                    <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                      <strong>{advocate.totalConsultations}+</strong> Consultations
                    </span>
                    <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                      Languages: <strong>{advocate.languages.join(', ')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialization Tags Grid */}
              <div className="mt-8 pt-6 border-t border-slate-700/80">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Core Practice Areas & Legal Expertise:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {advocate.secondarySpecialties.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-200"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-Minute Rates & Slot Bundles */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Consultancy Charge (Based on 4 Yrs Experience)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">
                      ₹{advocate.perMinuteRate}
                    </span>
                    <span className="text-xs text-slate-300 font-normal">/ minute (Transparent Billing)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto text-center">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                    <span className="text-[11px] text-slate-400 block">15 Mins</span>
                    <strong className="text-white font-display">₹{advocate.slotRates[15]}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                    <span className="text-[11px] text-slate-400 block">30 Mins</span>
                    <strong className="text-white font-display">₹{advocate.slotRates[30]}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                    <span className="text-[11px] text-slate-400 block">45 Mins</span>
                    <strong className="text-white font-display">₹{advocate.slotRates[45]}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                    <span className="text-[11px] text-slate-400 block">60 Mins</span>
                    <strong className="text-white font-display">₹{advocate.slotRates[60]}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-5 sm:p-6 bg-slate-950/80 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct consultation • 100% Confidential Legal Privilege</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  id={`call-advocate-btn-${advocate.id}`}
                  onClick={() => startCallWithAdvocate(advocate, 15)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-slate-950 animate-bounce" />
                  <span>Call Adv. Seema Jha (₹10/m)</span>
                </button>

                <a
                  id={`whatsapp-advocate-btn-${advocate.id}`}
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  title="WhatsApp Call / Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                <a
                  id={`tel-advocate-btn-${advocate.id}`}
                  href={`tel:${advocate.phone.replace(/[^0-9+]/g, '')}`}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  title={`Direct Chamber: ${advocate.phone}`}
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

