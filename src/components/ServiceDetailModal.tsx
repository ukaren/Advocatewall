import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle, Clock, MessageSquare, Plus, Check, HelpCircle, ArrowRight, Shield } from 'lucide-react';
import { ServiceItem } from '../types';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { ServiceIcon } from './ServiceIcon';
import { getServiceWhatsAppUrl } from '../utils/whatsapp';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const { cart, addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (service) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [service, onClose]);

  if (!service) return null;

  const isInCart = cart.some((item) => item.service.id === service.id);

  return (
    <div
      id="service-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-800 text-amber-300 border border-slate-700">
              {service.category}
            </span>
            {service.badge && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {service.badge}
              </span>
            )}
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-inner">
              <ServiceIcon name={service.iconName} className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display mb-2">
                {service.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Turnaround: {service.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Advocate Privilege Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Full Description */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 font-display">
              Service Overview
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {service.fullDescription}
            </p>
          </div>

          {/* Grid: What's Included vs Not Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Included */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-sm font-display">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What's Included</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {service.whatsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm font-display">
                <XCircle className="w-4 h-4 text-slate-400" />
                <span>What's Excluded / Optional</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {service.whatsNotIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Process Timeline */}
          {service.processSteps && service.processSteps.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 font-display">
                How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {service.processSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left"
                  >
                    <div className="text-xs font-bold text-amber-700 mb-1 font-mono">
                      STEP 0{step.step}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-600 leading-snug">
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 font-display">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2.5">
                {service.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm"
                  >
                    <div className="font-semibold text-slate-900 mb-1 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500 font-medium">Fixed Price:</span>
            <span className="text-2xl font-bold text-slate-900 font-display">
              {BUSINESS_CONFIG.currency}{service.price.toLocaleString('en-IN')}
            </span>
            {service.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                {BUSINESS_CONFIG.currency}{service.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              id="modal-whatsapp-enquiry-btn"
              href={getServiceWhatsAppUrl(service)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp Chat</span>
            </a>

            {isInCart ? (
              <button
                id="modal-in-cart-btn"
                onClick={() => {
                  onClose();
                  setIsCartOpen(true);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>View In Cart</span>
              </button>
            ) : (
              <button
                id="modal-add-to-cart-btn"
                onClick={() => addToCart(service)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
