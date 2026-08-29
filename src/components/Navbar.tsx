import React, { useState, useEffect } from 'react';
import { Scale, ShoppingBag, Menu, X, Phone, MessageSquare, PhoneCall, Timer, Workflow, Bot } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { ADVOCATES_LIST } from '../data/advocates';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenStampModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenStampModal }) => {
  const { totalItems, setIsCartOpen, startCallWithAdvocate, setIsN8NModalOpen, setIsN8NChatOpen } = useCart();
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
    { id: 'new-criminal-laws', label: 'BNS 2024 Laws', badge: 'New IPC' },
    { id: 'notice-generator', label: 'Legal Notice Drafter', badge: 'Drafts' },
    { id: 'services', label: 'Services' },
    { id: 'constitution', label: 'Constitution Rules', badge: 'Articles' },
    { id: 'partner-join', label: 'Join as Partner', badge: 'Apply' },
    { id: 'why-us', label: 'Why Us' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
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
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-xl tracking-tight text-slate-900 font-display">
                  {BUSINESS_CONFIG.name}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">
                {BUSINESS_CONFIG.tagline}
              </p>
            </div>
          </button>

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
            {/* AI Legal Assistant n8n Chat Button */}
            <button
              id="navbar-ai-chat-btn"
              onClick={() => setIsN8NChatOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg bg-amber-50 text-slate-900 hover:bg-amber-100 border border-amber-300/80 transition-colors shadow-2xs cursor-pointer"
              title="Open n8n AI Legal Assistant Chat"
            >
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline font-bold">AI Legal Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* N8N Telephony & CRM Workflow Button */}
            <button
              id="navbar-n8n-btn"
              onClick={() => setIsN8NModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
              title="Configure n8n Webhook & Telephony Bridge"
            >
              <Workflow className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">n8n / Telephony</span>
            </button>

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
                  setIsN8NChatOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-bold rounded-lg bg-slate-900 text-amber-300 hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Open AI Legal Assistant Chat (n8n)</span>
              </button>

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

