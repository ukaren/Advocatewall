import React from 'react';
import {
  Wallet,
  Sparkles,
  PlusCircle,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CreditCard,
  QrCode,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { BUSINESS_CONFIG } from '../data/config';

interface LegalWalletSectionProps {
  onOpenWalletModal: (topupAmt?: number) => void;
}

export const LegalWalletSection: React.FC<LegalWalletSectionProps> = ({ onOpenWalletModal }) => {
  const { account, balance, transactions } = useWallet();

  const availableCallMinutes = Math.floor(balance / 10);

  return (
    <section id="wallet-section" className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Wallet Overview & Value Prop */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Wallet className="w-3.5 h-3.5" />
              <span>Advocate Walla Pre-Paid Calling Wallet</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white tracking-tight">
              Direct Per-Minute Legal Wallet
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Never worry about card OTPs during urgent police station visits or courtroom discussions. Pre-load your Legal Wallet and consult top High Court advocates at exactly <strong className="text-amber-400">₹10/minute</strong>.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1-Click Instant Calling (No OTP wait)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Refundable Unspent Balance</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Razorpay Gateway ID: {BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf'}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <QrCode className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Zero UPI/Gateway Convenience Surcharge</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Wallet Card */}
          <div className="w-full max-w-md">
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-850 to-amber-950/70 p-6 border-2 border-amber-500/40 shadow-2xl space-y-5">
              {/* Top Row: Chip & Title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-6 rounded bg-amber-400/30 border border-amber-300/50 flex items-center justify-center">
                    <div className="w-4 h-2.5 rounded-xs bg-amber-300" />
                  </div>
                  <span className="font-mono text-xs text-amber-300 font-bold tracking-wider uppercase">
                    CITIZEN LEGAL ESCROW
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  {account.walletId}
                </span>
              </div>

              {/* Balance Row */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
                  Active Wallet Balance
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
                    ₹{balance.toLocaleString('en-IN')}.00
                  </span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                    ≈ {availableCallMinutes} Mins Call
                  </span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => onOpenWalletModal(300)}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Recharge Wallet</span>
                </button>

                <button
                  onClick={() => onOpenWalletModal()}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Passbook ({transactions.length})</span>
                </button>
              </div>

              {/* Quick Packs Pills */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2 font-semibold">
                  Quick Recharge Amounts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[150, 300, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => onOpenWalletModal(amt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      +₹{amt} ({Math.floor(amt / 10)}m)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
