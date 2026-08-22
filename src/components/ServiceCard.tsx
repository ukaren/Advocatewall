import React from 'react';
import { Clock, Plus, Check, MessageSquare, Info, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { ServiceIcon } from './ServiceIcon';
import { getServiceWhatsAppUrl } from '../utils/whatsapp';

interface ServiceCardProps {
  service: ServiceItem;
  onViewDetails: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onViewDetails }) => {
  const { cart, addToCart, setIsCartOpen } = useCart();
  const isInCart = cart.some((item) => item.service.id === service.id);

  return (
    <div
      id={`service-card-${service.id}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 p-5 sm:p-6"
    >
      <div>
        {/* Header: Icon & Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <ServiceIcon name={service.iconName} className="w-6 h-6" />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {service.badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200/70 whitespace-nowrap">
                {service.badge}
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
              {service.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2 font-display">
          {service.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {service.shortDescription}
        </p>

        {/* Key Features Pill */}
        <div className="space-y-1.5 mb-5">
          {service.whatsIncluded.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section: Duration, Price, and Buttons */}
      <div className="pt-4 border-t border-slate-100">
        {/* Duration & Price */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{service.duration}</span>
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-xs text-slate-400 font-medium">From</span>
              <span className="text-xl font-bold text-slate-900 font-display">
                {BUSINESS_CONFIG.currency}{service.price.toLocaleString('en-IN')}
              </span>
            </div>
            {service.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                {BUSINESS_CONFIG.currency}{service.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`view-details-${service.id}`}
            onClick={() => onViewDetails(service)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Details</span>
          </button>

          {isInCart ? (
            <button
              id={`in-cart-btn-${service.id}`}
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>In Cart</span>
            </button>
          ) : (
            <button
              id={`add-to-cart-${service.id}`}
              onClick={() => addToCart(service)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>

        {/* Secondary WhatsApp direct button */}
        <a
          id={`whatsapp-enquire-${service.id}`}
          href={getServiceWhatsAppUrl(service)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <MessageSquare className="w-3 h-3 text-emerald-600" />
          <span>Quick WhatsApp Enquiry</span>
        </a>
      </div>
    </div>
  );
};
