import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone, MessageSquare, PhoneCall, Timer } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { ADVOCATES_LIST } from '../data/advocates';
import { AdvocateWallaLogo } from './AdvocateWallaLogo';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenStampModal?: () => void;
  onOpenPaymentModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenStampModal, onOpenPaymentModal }) => {
  const { totalItems, setIsCartOpen, startCallWithAdvocate } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'advocates', label: 'Advocates & Calling', badge: '₹10/m' },
    { id: 'payment-gateway', label: 'Pay Fees', badge: 'Gateway' },
    { id: 'health-checkup', label: 'Legal Health Score', badge: 'Tool' },
    { id: 'emergency-rights', label: 'Police Rights', badge: 'BNSS' },
    { id: 'ecourts-guide', label: 'eCourts & CNR', badge: 'Case' },
    { id: 'new-criminal-laws', label: 'BNS 2024 Laws', badge: 'New IPC' },
    { id: 'notice-generator', label: 'Notice Drafter', badge: 'Drafts' },
    { id: 'services', label: 'Services' },
    { id: 'constitution', label: 'Constitution', badge: 'Articles' },
    { id: 'partner-join', label: 'Join Partner', badge: 'Apply' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-2.5'
          : 'bg-white border-b border-slate-200/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo (Bilingual Devanagari & English Mix) */}
          <AdvocateWallaLogo
            size="sm"
            variant="light"
            showSubtitle={true}
            showDevnagriBadge={true}
            onClick={() => handleLinkClick('home')}
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative px-2.5 xl:px-3 py-1.5 rounded-md text-xs xl:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-slate-900 bg-slate-100 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Payment Gateway Trigger Button */}
            {onOpenPaymentModal && (
              <button
                id="navbar-pay-fee-btn"
                onClick={onOpenPaymentModal}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
                title="Pay Legal Fees Online"
              >
                <span>Pay Fees</span>
              </button>
            )}

            {/* Quick Instant Call Button */}
            <button
              id="navbar-call-now-btn"
              onClick={() => startCallWithAdvocate(ADVOCATES_LIST[0], 15)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Call Advocate</span>
              <span className="text-[11px] font-medium bg-slate-950/10 px-1 py-0.2 rounded">₹10/m</span>
            </button>

            {/* Direct WhatsApp Callout */}
            <a
              id="navbar-whatsapp-btn"
              href={getDirectWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold hidden md:inline">Cart</span>
              {totalItems > 0 ? (
                <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[11px] font-bold text-slate-900 bg-amber-400 rounded-full animate-pulse">
                  {totalItems}
                </span>
              ) : (
                <span className="text-xs text-slate-400 hidden sm:inline">0</span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 pb-2 space-y-1">
            <div className="grid grid-cols-2 gap-1 mb-3">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    id={`mobile-nav-link-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-900">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  startCallWithAdvocate(ADVOCATES_LIST[0], 15);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-bold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Advocate Now (from ₹10/min)</span>
              </button>

              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-4 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Advocate on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

