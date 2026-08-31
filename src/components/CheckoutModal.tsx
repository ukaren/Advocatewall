import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageSquare, ShieldCheck, Send, ArrowRight, Phone, Mail, User, FileText, Sparkles, CreditCard, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../data/config';
import { getCartEnquiryWhatsAppUrl } from '../utils/whatsapp';
import { EnquiryFormData } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, subtotal, totalItems, clearCart, isCheckoutOpen } = useCart();

  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    phone: '',
    email: '',
    preferredContact: 'WhatsApp',
    selectedServiceIds: cart.map((i) => i.service.id),
    requirement: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState('');
  const [submittedSnapshot, setSubmittedSnapshot] = useState<{
    cart: typeof cart;
    subtotal: number;
    formData: EnquiryFormData;
  } | null>(null);

  const handleRazorpayCheckout = () => {
    const merchantId = BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf';
    const amountToPay = submittedSnapshot?.subtotal || subtotal;

    if (typeof (window as any).Razorpay !== 'undefined') {
      try {
        const options = {
          key: merchantId,
          amount: amountToPay * 100,
          currency: 'INR',
          name: 'ADVOCAT वाला (Advocate Walla)',
          description: `Legal Services Checkout - Ref: ${enquiryRef || 'ADV-PORTAL'}`,
          image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=200',
          prefill: {
            name: submittedSnapshot?.formData.fullName || formData.fullName,
            contact: submittedSnapshot?.formData.phone || formData.phone,
            email: submittedSnapshot?.formData.email || formData.email || 'consult@advocatwalla.com',
          },
          notes: {
            merchant_id: merchantId,
            enquiry_ref: enquiryRef || 'DIRECT',
          },
          theme: {
            color: '#0f172a',
          },
          handler: function (response: any) {
            alert(`Payment received successfully! Razorpay Payment ID: ${response.razorpay_payment_id}`);
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay checkout trigger fallback:', err);
      }
    }

    window.open(BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar', '_blank');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCheckoutOpen, onClose]);

  if (!isCheckoutOpen) return null;

  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    }

    const phoneClean = formData.phone.replace(/[^0-9+]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const ref = `ADV-${Math.floor(100000 + Math.random() * 900000)}`;
    setEnquiryRef(ref);
    setSubmittedSnapshot({
      cart: [...cart],
      subtotal,
      formData: { ...formData },
    });
    setIsSubmitted(true);
    clearCart();
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="checkout-modal"
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advocate Direct Consultation Desk</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            {isSubmitted ? 'Enquiry Confirmation' : 'Submit Legal Service Enquiry'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {isSubmitted
              ? 'Your enquiry has been safely recorded.'
              : 'Provide your contact details so the Advocate can review your request and connect with you.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {isSubmitted && submittedSnapshot ? (
            /* Success State */
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-display mb-1.5">
                  Thank you. Your enquiry has been received.
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Reference No:{' '}
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {enquiryRef}
                  </span>
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="text-left bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-xs font-semibold uppercase text-slate-400">
                    Services Enquired
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Est. Total: {BUSINESS_CONFIG.currency}
                    {submittedSnapshot.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {submittedSnapshot.cart.map((item) => (
                    <li key={item.service.id} className="flex justify-between">
                      <span>• {item.service.name} (Qty: {item.quantity})</span>
                      <span className="font-semibold text-slate-900">
                        {BUSINESS_CONFIG.currency}
                        {(item.service.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-500 space-y-1">
                  <p>Client: <strong className="text-slate-800">{submittedSnapshot.formData.fullName}</strong> ({submittedSnapshot.formData.phone})</p>
                  <p>Preferred Channel: <strong className="text-slate-800">{submittedSnapshot.formData.preferredContact}</strong></p>
                </div>
              </div>

              {/* Next Steps Box & Instant Razorpay Payment Option */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-left text-xs sm:text-sm text-amber-900 space-y-2">
                <p className="font-bold mb-1">Payment & Confirmation Steps</p>
                <p className="text-slate-700 leading-relaxed">
                  {BUSINESS_CONFIG.advocateName} will contact you within 2–4 working hours to confirm your requirements. You can also make direct advance payment securely via Razorpay:
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    id="checkout-razorpay-direct-btn"
                    onClick={handleRazorpayCheckout}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Online via Razorpay Gateway</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </button>
                  <span className="font-mono text-[10px] bg-white border border-amber-300 text-amber-900 px-2 py-1 rounded-md font-semibold">
                    Merchant ID: {BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  id="checkout-success-whatsapp-btn"
                  href={getCartEnquiryWhatsAppUrl(
                    submittedSnapshot.cart,
                    submittedSnapshot.formData
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Continue on WhatsApp</span>
                </a>

                <button
                  type="button"
                  id="checkout-success-razorpay-btn"
                  onClick={handleRazorpayCheckout}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md text-xs sm:text-sm cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Now ({BUSINESS_CONFIG.currency}{submittedSnapshot.subtotal.toLocaleString('en-IN')})</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold hover:bg-slate-200 transition-colors cursor-pointer text-xs sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selected Services Summary Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Selected Services ({totalItems})</span>
                  <span className="text-slate-900 font-bold">
                    Est. Total: {BUSINESS_CONFIG.currency}
                    {subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cart.map((item) => (
                    <span
                      key={item.service.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-800"
                    >
                      <span>{item.service.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-amber-700 font-bold">×{item.quantity}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="checkout-fullname-input"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="e.g. Rajesh Sharma"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
                        errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="checkout-phone-input"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+91 98670 15157"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all ${
                        errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email & Contact Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      id="checkout-email-input"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Contact Channel
                  </label>
                  <select
                    id="checkout-contact-channel"
                    value={formData.preferredContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContact: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  >
                    <option value="WhatsApp">WhatsApp (Fastest Response)</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              {/* Requirement Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Brief description of legal requirement / dispute facts
                </label>
                <div className="relative">
                  <textarea
                    id="checkout-requirement-input"
                    rows={3}
                    value={formData.requirement}
                    onChange={(e) =>
                      setFormData({ ...formData, requirement: e.target.value })
                    }
                    placeholder="Provide brief context (e.g., Tenant not vacating property, Notice for unpaid freelancer invoice of ₹85k, Need review for commercial lease agreement)..."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Confidentiality notice */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Information submitted is protected by Advocate-Client Confidentiality.</span>
              </div>

              {/* Payment Methods Info Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>
                    Direct Online Payment: <strong className="text-slate-900 font-mono">{BUSINESS_CONFIG.razorpayHandle || 'razorpay.me/@abhilendrakumar'}</strong> (UPI, Cards, GPay, NetBanking)
                  </span>
                </div>
                <a
                  href={BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200 transition-colors whitespace-nowrap"
                >
                  <span>Pay Now via Razorpay</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  id="checkout-submit-btn"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-md cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Submit Enquiry</span>
                </button>

                <a
                  id="checkout-quick-whatsapp-order"
                  href={getCartEnquiryWhatsAppUrl(cart, formData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
