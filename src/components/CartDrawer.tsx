import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, MessageSquare, ShieldCheck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../data/config';
import { getCartEnquiryWhatsAppUrl } from '../utils/whatsapp';
import { ServiceIcon } from './ServiceIcon';

interface CartDrawerProps {
  onExploreServices: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onExploreServices }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
    setIsCheckoutOpen,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleExplore = () => {
    setIsCartOpen(false);
    onExploreServices();
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="cart-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Your Enquiry Cart</h2>
              <p className="text-xs text-slate-400">
                {totalItems} {totalItems === 1 ? 'service' : 'services'} selected
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {cart.length > 0 ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Selected Services
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.service.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ServiceIcon name={item.service.iconName} className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {item.service.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.service.category} • {item.service.duration}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.service.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.service.id, item.quantity - 1)
                          }
                          className="text-slate-500 hover:text-slate-900 cursor-pointer p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 px-1 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.service.id, item.quantity + 1)
                          }
                          className="text-slate-500 hover:text-slate-900 cursor-pointer p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for Item */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 font-display">
                          {BUSINESS_CONFIG.currency}
                          {(item.service.price * item.quantity).toLocaleString(
                            'en-IN'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Zero advance risk. Discuss & confirm details with the Advocate before payment.</span>
              </div>
            </>
          ) : (
            /* Empty Cart State */
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-display">
                Your cart is empty
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-6">
                You haven't selected any legal services yet. Browse our catalog to add consultations or document drafting.
              </p>
              <button
                onClick={handleExplore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                <span>Explore Legal Services</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Services ({totalItems})</span>
                <span>
                  {BUSINESS_CONFIG.currency}
                  {subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-slate-900">
                <span>Estimated Total</span>
                <span className="font-display text-xl text-slate-900">
                  {BUSINESS_CONFIG.currency}
                  {subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                Applicable taxes & statutory stamp duty (if any) confirmed by Advocate
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="cart-checkout-proceed-btn"
                onClick={handleProceedToCheckout}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-md cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <span>Proceed to Enquiry Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  id="cart-instant-whatsapp-btn"
                  href={getCartEnquiryWhatsAppUrl(cart)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs truncate"
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">WhatsApp Chat</span>
                </a>

                <a
                  id="cart-instant-razorpay-btn"
                  href={BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs truncate"
                >
                  <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Pay Online (Razorpay)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
