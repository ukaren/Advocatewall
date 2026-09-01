import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Building,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface PaymentGatewaySectionProps {
  onOpenPaymentModal: (amount?: number, purpose?: string) => void;
}

export const PaymentGatewaySection: React.FC<PaymentGatewaySectionProps> = ({
  onOpenPaymentModal,
}) => {
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number>(499);
  const [customAmount, setCustomAmount] = useState<string>('499');
  const [hasCopiedUpi, setHasCopiedUpi] = useState(false);

  const upiId = 'abhilendrakumar@okhdfcbank';

  const quickServices = [
    {
      title: 'Consultation On Call',
      desc: '15 Minutes Advice with Adv. Seema Jha',
      amount: 150,
      badge: '₹10/Min Rate'
    },
    {
      title: 'Extended Consultation',
      desc: '30 Minutes In-depth Case Strategy',
      amount: 300,
      badge: 'Deep Review'
    },
    {
      title: 'Legal Advice & Strategy',
      desc: 'Written analysis & procedural road-map',
      amount: 499,
      badge: 'Popular'
    },
    {
      title: 'Statutory Demand Notice',
      desc: 'Cheque bounce, recovery or consumer notice',
      amount: 999,
      badge: 'Court-Ready'
    },
    {
      title: 'Agreement / Lease Deed',
      desc: 'Rental, NDA, or Commercial Contract Draft',
      amount: 1499,
      badge: 'Comprehensive'
    },
    {
      title: 'Bail & Police Reply Draft',
      desc: 'Sec 35 BNSS appearance reply & pleadings',
      amount: 1999,
      badge: 'Urgent Filing'
    }
  ];

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setHasCopiedUpi(true);
    setTimeout(() => setHasCopiedUpi(false), 2000);
  };

  const handleLaunchRazorpayDirect = (amt: number, purpose: string) => {
    const merchantId = BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf';
    const txnId = `ADV-${Date.now().toString().slice(-6)}`;

    if (typeof (window as any).Razorpay !== 'undefined') {
      try {
        const options = {
          key: merchantId,
          amount: amt * 100,
          currency: 'INR',
          name: 'ADVOCAT वाला (Advocate Walla)',
          description: `${purpose} - Ref: ${txnId}`,
          image: '/images/advocate-walla-logo.png',
          prefill: {
            name: 'Client',
            email: 'consult@advocatwalla.com',
          },
          theme: {
            color: '#0f172a',
          },
          handler: function (response: any) {
            alert(`Payment of ₹${amt} successful! Razorpay Payment ID: ${response.razorpay_payment_id}`);
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay section trigger error:', err);
      }
    }

    onOpenPaymentModal(amt, purpose);
  };

  return (
    <section id="payment-gateway" className="py-16 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background Ambience */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Legal Fee Payment Gateway</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-serif mb-3">
            Pay Legal Fees, Consultation & Drafting Online
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-['Noto_Serif_Devanagari']">
            पारदर्शी और सुरक्षित पेमेंट गेटवे — Razorpay, UPI (Google Pay / PhonePe / Paytm), कार्ड्स व नेटबैंकिंग के माध्यम से तुरंत भुगतान करें
          </p>
        </div>

        {/* 3 Gateway Highlights Pill */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Advocate Escrow</h4>
              <p className="text-[11px] text-slate-400">Direct Lawyer Chambers Invoicing</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant UPI & QR</h4>
              <p className="text-[11px] text-slate-400">Zero Convenience Surcharges</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">256-Bit SSL Protection</h4>
              <p className="text-[11px] text-slate-400">RBI & NPCI Compliant Gateway</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Quick Legal Service Fee Selectors + Custom Pay Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Quick Service Cards */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
              Select Legal Matter to Pay Instantly:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-amber-400/80 transition-all flex flex-col justify-between text-left group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                        {srv.badge}
                      </span>
                      <span className="text-base font-black text-white">
                        ₹{srv.amount}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {srv.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleLaunchRazorpayDirect(srv.amount, srv.title)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Pay via Razorpay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenPaymentModal(srv.amount, srv.title)}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      More Options
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Custom Fee Terminal & Quick UPI Scan Card */}
          <div className="lg:col-span-5 bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">
                  Direct Payment Terminal
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400">Online 24x7</span>
            </div>

            {/* Custom Amount Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Enter Custom Legal Fee Amount:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter amount"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Main Pay Button */}
              <button
                onClick={() => {
                  const amt = parseInt(customAmount, 10) || 499;
                  onOpenPaymentModal(amt, 'Custom Legal Service Fee');
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Open Gateway for ₹{customAmount || '0'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick UPI ID & Merchant ID Bar */}
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Advocate Official UPI ID:</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Verified VPA</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-mono text-amber-300 text-xs font-bold truncate">
                      {upiId}
                    </span>
                    <button
                      onClick={copyUpi}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] ml-2 shrink-0 cursor-pointer"
                    >
                      {hasCopiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{hasCopiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Payment / Merchant Gateway ID:</span>
                    <span className="text-[10px] text-amber-400 font-bold">Razorpay ID</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="font-mono text-amber-300 text-xs font-bold truncate">
                      {BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf'}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf');
                        setHasCopiedUpi(true);
                        setTimeout(() => setHasCopiedUpi(false), 2000);
                      }}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] ml-2 shrink-0 cursor-pointer"
                      title="Copy Merchant ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Assistance */}
              <div className="pt-2">
                <a
                  href={getDirectWhatsAppUrl('Hello Adv. Seema Jha, I have a query regarding payment of legal fees / invoice receipt.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Facing Payment Issue? Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
