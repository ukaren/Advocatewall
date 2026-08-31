import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck, Scale, CreditCard, ExternalLink } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    matterType: 'General Legal Consultation',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = 'Please provide your full name';
    if (!form.phone.trim() || form.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }
    if (!form.message.trim()) errs.message = 'Please provide brief details of your enquiry';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
  };

  const generateContactWhatsAppUrl = () => {
    const text = `Hello ${BUSINESS_CONFIG.advocateName},\n\nI am contacting you from ${BUSINESS_CONFIG.name}:\n• Name: ${form.name || 'Not provided'}\n• Phone: ${form.phone || 'Not provided'}\n• Matter: ${form.matterType}\n• Details: ${form.message || 'I would like to enquire about legal consultation.'}`;
    return getDirectWhatsAppUrl(text);
  };

  return (
    <section id="contact" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-200/80 px-3 py-1 rounded-md">
            Direct Chamber Access
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display mt-3 mb-3">
            Contact & Chamber Details
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Reach out directly to {BUSINESS_CONFIG.advocateName} via phone, WhatsApp, email, or submit a confidential enquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Quick Action Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Chamber Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-display text-base">
                    {BUSINESS_CONFIG.advocateName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{BUSINESS_CONFIG.advocateTitle}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Chamber Address:</strong>
                    <span className="text-slate-600 leading-snug">{BUSINESS_CONFIG.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Consultation Hours:</strong>
                    <span className="text-slate-600">{BUSINESS_CONFIG.workingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Phone Support:</strong>
                    <a
                      href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                      className="text-slate-900 hover:text-amber-800 font-semibold transition-colors"
                    >
                      {BUSINESS_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-medium">Email Enquiries:</strong>
                    <a
                      href={`mailto:${BUSINESS_CONFIG.email}`}
                      className="text-slate-900 hover:text-amber-800 font-semibold transition-colors"
                    >
                      {BUSINESS_CONFIG.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Communication Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  id="contact-call-now-btn"
                  href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Now</span>
                </a>

                <a
                  id="contact-whatsapp-btn"
                  href={getDirectWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Direct Razorpay Payment Card */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-blue-950">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Direct Online Payment / Retainer</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200/70 text-blue-800">
                    Razorpay
                  </span>
                </div>
                <p className="text-slate-600 leading-snug">
                  Pay consultation fees, notice drafting fees or advance retainers via UPI, Cards, GPay, or NetBanking:
                </p>
                <a
                  id="contact-razorpay-direct-btn"
                  href={BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors shadow-xs"
                >
                  <span className="truncate">{BUSINESS_CONFIG.razorpayHandle || 'razorpay.me/@abhilendrakumar'}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-1.5" />
                </a>
              </div>
            </div>

            {/* Confidentiality Reminder */}
            <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                All inquiries and information submitted are strictly confidential and protected under Advocate professional ethics.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-1.5">
                Send a Confidential Enquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill in the details and the Advocate will get back to you with guidance.
              </p>

              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 font-display">
                    Thank you! Enquiry received.
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    We will review your submission and connect with you shortly. You may also expedite the conversation directly on WhatsApp.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={generateContactWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Continue on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setForm({
                          name: '',
                          phone: '',
                          email: '',
                          matterType: 'General Legal Consultation',
                          message: '',
                        });
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="e.g. Ramesh K."
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                          errors.name ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-phone-input"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder="+91 98670 15157"
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                          errors.phone ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email (Optional)
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Legal Category / Matter
                      </label>
                      <select
                        id="contact-category-select"
                        value={form.matterType}
                        onChange={(e) =>
                          setForm({ ...form, matterType: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                      >
                        <option value="General Legal Consultation">General Legal Consultation</option>
                        <option value="Legal Notice Drafting">Legal Notice Drafting</option>
                        <option value="Rent / Lease Agreement">Rent / Lease Agreement</option>
                        <option value="Property Agreement Review">Property Agreement Review</option>
                        <option value="Consumer Complaint">Consumer Complaint</option>
                        <option value="Business / Corporate Advisory">Business / Corporate Advisory</option>
                        <option value="Civil Dispute">Civil Dispute</option>
                        <option value="Criminal / Bail Matter">Criminal / Bail Matter</option>
                        <option value="Family / Divorce Matter">Family / Divorce Matter</option>
                        <option value="Custom Legal Requirement">Other Custom Requirement</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Brief Legal Query / Dispute Context <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message-input"
                      rows={3}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: '' });
                      }}
                      placeholder="Describe what you need assistance with..."
                      className={`w-full p-3.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none ${
                        errors.message ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-rose-500">{errors.message}</p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      id="contact-form-submit-btn"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                    >
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>Send Enquiry</span>
                    </button>

                    <a
                      id="contact-form-whatsapp-direct"
                      href={generateContactWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send via WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
