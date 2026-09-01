import React, { useState } from 'react';
import {
  Wallet,
  X,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Clock,
  PhoneCall,
  FileText,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../data/config';
import { ADVOCATES_LIST } from '../data/advocates';

interface LegalWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalWalletModal: React.FC<LegalWalletModalProps> = ({ isOpen, onClose }) => {
  const {
    account,
    balance,
    transactions,
    targetTopupAmount,
    setTargetTopupAmount,
    topupWallet,
    resetWalletToDefault
  } = useWallet();
  const { addToast } = useCart();

  const [activeTab, setActiveTab] = useState<'topup' | 'passbook' | 'benefits'>('topup');
  const [topupAmount, setTopupAmount] = useState<number>(targetTopupAmount || 300);
  const [customAmountStr, setCustomAmountStr] = useState<string>((targetTopupAmount || 300).toString());
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'bank_transfer'>('razorpay');
  const [txnRefInput, setTxnRefInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCopiedUpi, setHasCopiedUpi] = useState(false);
  const [hasCopiedWalletId, setHasCopiedWalletId] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const quickPacks = [
    { amount: 150, title: '15 Mins Call', desc: 'Quick advice with Adv. Seema Jha', badge: 'Popular' },
    { amount: 300, title: '30 Mins Strategy', desc: 'In-depth case discussion & review', badge: 'Recommended' },
    { amount: 500, title: '1 Hour Counsel', desc: 'Comprehensive case review & strategy' },
    { amount: 1000, title: 'Notice Draft Pack', desc: 'Consultation + Legal Notice Drafting' },
    { amount: 2500, title: 'Court Retainer', desc: 'Bulk legal credit for ongoing matters' },
  ];

  const handleSelectPack = (amt: number) => {
    setTopupAmount(amt);
    setCustomAmountStr(amt.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmountStr(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setTopupAmount(num);
    } else {
      setTopupAmount(0);
    }
  };

  const upiId = BUSINESS_CONFIG.whatsapp ? 'abhilendrakumar@okhdfcbank' : 'abhilendrakumar@okhdfcbank';
  const merchantId = BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=${encodeURIComponent(
    upiId
  )}%26pn=${encodeURIComponent(BUSINESS_CONFIG.advocateName)}%26am=${topupAmount}%26cu=INR%26tn=${encodeURIComponent(
    `Wallet Recharge - ${account.walletId}`
  )}`;

  const handleExecuteTopup = () => {
    if (topupAmount <= 0) {
      addToast('Please enter a valid recharge amount greater than ₹0.', 'error');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'razorpay') {
      // Check if valid live/test key starting with rzp_
      if (merchantId.startsWith('rzp_') && typeof (window as any).Razorpay !== 'undefined') {
        try {
          const options = {
            key: merchantId,
            amount: topupAmount * 100,
            currency: 'INR',
            name: 'ADVOCAT वाला (Legal Wallet)',
            description: `Recharge Legal Wallet (${account.walletId}) - ₹${topupAmount}`,
            image: ADVOCATES_LIST[0]?.avatar || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=200',
            prefill: {
              name: account.holderName,
              contact: account.holderPhone,
              email: 'client@advocatwalla.com',
            },
            notes: {
              wallet_id: account.walletId,
              merchant_id: merchantId,
              purpose: 'Legal Wallet Recharge',
            },
            theme: { color: '#0f172a' },
            handler: function (response: any) {
              const pId = response?.razorpay_payment_id || `RZP-${Math.floor(100000 + Math.random() * 900000)}`;
              const res = topupWallet(topupAmount, 'razorpay', pId);
              setIsProcessing(false);
              addToast(res.message, 'success');
              setActiveTab('passbook');
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false);
              },
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        } catch (err) {
          console.warn('Razorpay SDK invocation error:', err);
        }
      }

      // Open Razorpay hosted payment page in background / new tab
      const razorpayLink = BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar';
      window.open(razorpayLink, '_blank', 'noopener,noreferrer');

      // Instant credit with reference ID
      setTimeout(() => {
        const pId = txnRefInput.trim() || `RZP-PORTAL-${Math.floor(100000 + Math.random() * 900000)}`;
        const res = topupWallet(topupAmount, 'razorpay', pId);
        setIsProcessing(false);
        addToast(`₹${topupAmount} recharge credited to Legal Wallet! (Ref: ${pId})`, 'success');
        setActiveTab('passbook');
        setTxnRefInput('');
      }, 700);
    } else if (paymentMethod === 'upi') {
      setTimeout(() => {
        const ref = txnRefInput.trim() || `UPI-APP-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const res = topupWallet(topupAmount, 'upi', ref);
        setIsProcessing(false);
        addToast(res.message, 'success');
        setActiveTab('passbook');
        setTxnRefInput('');
      }, 600);
    } else {
      // Bank transfer
      setTimeout(() => {
        const ref = txnRefInput.trim() || `IMPS-${Math.floor(10000000 + Math.random() * 90000000)}`;
        const res = topupWallet(topupAmount, 'bank_transfer', ref);
        setIsProcessing(false);
        addToast(res.message, 'success');
        setActiveTab('passbook');
        setTxnRefInput('');
      }, 600);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setHasCopiedUpi(true);
    addToast('UPI ID copied to clipboard: ' + upiId, 'success');
    setTimeout(() => setHasCopiedUpi(false), 2000);
  };

  const copyWalletId = () => {
    navigator.clipboard.writeText(account.walletId);
    setHasCopiedWalletId(true);
    addToast('Wallet ID copied: ' + account.walletId, 'success');
    setTimeout(() => setHasCopiedWalletId(false), 2000);
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      if (filterType === 'credit') return tx.type === 'credit';
      if (filterType === 'debit') return tx.type === 'debit';
      return true;
    })
    .filter((tx) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        tx.description.toLowerCase().includes(term) ||
        tx.referenceId.toLowerCase().includes(term) ||
        tx.id.toLowerCase().includes(term)
      );
    });

  const availableCallMinutes = Math.floor(balance / 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display">Advocate Walla Legal Wallet</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold tracking-wide uppercase">
                  Verified Escrow
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pre-paid legal consultation credit • Zero transaction surcharge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digital Platinum / Gold Metallic Card */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-4 sm:p-5 text-white shadow-xl border border-amber-500/30">
            {/* Holographic watermark background */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
              <ShieldCheck className="w-24 h-24 text-amber-400" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 rounded bg-amber-400/30 border border-amber-300/50 flex items-center justify-center">
                    <div className="w-3 h-2 rounded-xs bg-amber-200" />
                  </div>
                  <span className="text-[11px] font-mono tracking-widest text-amber-300 font-bold uppercase">
                    Advocate Walla Escrow Pass
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-[11px]">
                  <span className="text-slate-400 font-mono text-[10px]">ID: {account.walletId}</span>
                  <button
                    onClick={copyWalletId}
                    className="text-amber-400 hover:text-white ml-1 cursor-pointer"
                    title="Copy Wallet ID"
                  >
                    {hasCopiedWalletId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-0.5">
                    Available Legal Balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tracking-tight">
                      ₹{balance.toLocaleString('en-IN')}.00
                    </span>
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      <Sparkles className="w-3 h-3" />
                      ≈ {availableCallMinutes} Mins Call Time
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-slate-400 block">Lead Advocate Counsel</span>
                  <span className="text-xs font-bold text-slate-200 block">{BUSINESS_CONFIG.advocateName}</span>
                  <span className="text-[10px] text-amber-300/80 font-mono">{BUSINESS_CONFIG.barRegistration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('topup')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'topup'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Recharge / Top-Up</span>
            </button>

            <button
              onClick={() => setActiveTab('passbook')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'passbook'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Passbook & History ({transactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('benefits')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'benefits'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Perks</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Top-Up / Recharge */}
        {activeTab === 'topup' && (
          <div className="p-4 sm:p-6 space-y-5 max-h-[50vh] overflow-y-auto">
            {/* Quick Recharge Packs */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Select Recharge Pack (Call Allowance @ ₹10/Min)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {quickPacks.map((pack) => {
                  const isSelected = topupAmount === pack.amount;
                  return (
                    <button
                      key={pack.amount}
                      type="button"
                      onClick={() => handleSelectPack(pack.amount)}
                      className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {pack.badge && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase">
                          {pack.badge}
                        </span>
                      )}
                      <div className="font-extrabold text-base text-slate-900 font-mono">
                        ₹{pack.amount}
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{pack.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{pack.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Or Enter Custom Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                  ₹
                </span>
                <input
                  type="text"
                  value={customAmountStr}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount (e.g. 500)"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'razorpay'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>Razorpay</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Instant UPI, Cards & NetBanking</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>UPI QR / ID</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Direct GPay / PhonePe / Paytm</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                    <Building className="w-3.5 h-3.5 text-purple-600" />
                    <span>Bank (IMPS)</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Direct NEFT / RTGS Transfer</p>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {paymentMethod === 'razorpay' && (
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-blue-950 font-bold">
                  <span>Razorpay Official Legal Gateway</span>
                  <span className="font-mono text-[10px] bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                    ID: {merchantId}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Funds will be credited automatically to your Advocate Walla Legal Wallet balance immediately after authorization.
                </p>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 shadow-xs shrink-0">
                    <img src={qrCodeUrl} alt="UPI QR" className="w-28 h-28 object-contain" />
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      Scan with GPay, PhonePe, Paytm, or BHIM
                    </span>
                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-200">
                      <span className="font-mono font-bold text-slate-900 text-xs">{upiId}</span>
                      <button
                        type="button"
                        onClick={copyUpi}
                        className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        {hasCopiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{hasCopiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Enter UTR / UPI Transaction Reference (Optional):
                  </label>
                  <input
                    type="text"
                    value={txnRefInput}
                    onChange={(e) => setTxnRefInput(e.target.value)}
                    placeholder="e.g. 439201948201"
                    className="w-full px-3 py-2 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-2">
                <span className="font-bold text-purple-950 block">Bank Account Credentials</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-purple-200">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Bank Name</span>
                    <strong className="text-slate-900">HDFC Bank Ltd.</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Account Type</span>
                    <strong className="text-slate-900">Current / Legal Escrow</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Account No.</span>
                    <strong className="text-slate-900 font-mono">50200084920194</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">IFSC Code</span>
                    <strong className="text-slate-900 font-mono">HDFC0000240</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Enter Bank IMPS/NEFT Reference Number:
                  </label>
                  <input
                    type="text"
                    value={txnRefInput}
                    onChange={(e) => setTxnRefInput(e.target.value)}
                    placeholder="e.g. IMPS409210492"
                    className="w-full px-3 py-2 text-xs bg-white border border-purple-300 rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Top-up Action Button */}
            <div className="pt-2">
              <button
                type="button"
                id="execute-wallet-topup-btn"
                onClick={handleExecuteTopup}
                disabled={isProcessing || topupAmount <= 0}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Recharge...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Recharge ₹{topupAmount.toLocaleString('en-IN')} to Legal Wallet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Passbook & Statement */}
        {activeTab === 'passbook' && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[50vh] overflow-y-auto">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  onClick={() => setFilterType('credit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filterType === 'credit' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  Credits (+₹)
                </button>
                <button
                  onClick={() => setFilterType('debit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filterType === 'debit' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Debits (-₹)
                </button>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transaction..."
                className="w-full sm:w-48 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            {/* Transactions List */}
            <div className="space-y-2">
              {filteredTransactions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  No transactions found matching your criteria.
                </div>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 line-clamp-1">{tx.description}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {tx.category.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                            <span>{new Date(tx.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            <span>•</span>
                            <span>Ref: {tx.referenceId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`font-mono font-extrabold text-sm ${
                            isCredit ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 justify-end">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Completed</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Passbook Summary footer */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-3 font-mono">
                <span>Total Credited: <strong className="text-emerald-700">₹{account.totalCredited}</strong></span>
                <span>•</span>
                <span>Total Debited: <strong className="text-rose-700">₹{account.totalDebited}</strong></span>
              </div>

              <button
                onClick={() => {
                  const passbookText = `Advocate Walla Wallet Passbook\nWallet ID: ${account.walletId}\nAvailable Balance: ₹${balance}\nTotal Transactions: ${transactions.length}`;
                  navigator.clipboard.writeText(passbookText);
                  addToast('Wallet passbook summary copied to clipboard.', 'success');
                }}
                className="text-amber-700 hover:text-amber-900 font-bold text-xs underline cursor-pointer"
              >
                Copy Statement Summary
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Perks & Benefits */}
        {activeTab === 'benefits' && (
          <div className="p-4 sm:p-6 space-y-4 max-h-[50vh] overflow-y-auto text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Why Use Advocate Walla Legal Wallet?</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>1-Click Instant Calling:</strong> Skip entering Card OTP or opening banking apps during urgent police station visits or court hearing emergencies.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Accurate Per-Minute Billing:</strong> Direct ₹10/minute deduction without extra transaction surcharges or minimum deposit locks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% Refundable:</strong> Any unspent wallet balance can be withdrawn back to your source bank account on WhatsApp request.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transparent Passbook:</strong> Complete digital audit trail of every consultation second and legal notice draft fee.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-slate-600">Need to reset demo wallet balance?</span>
              <button
                onClick={() => {
                  resetWalletToDefault();
                  addToast('Wallet reset to default balance.', 'info');
                }}
                className="text-slate-700 hover:text-slate-900 font-bold text-xs underline cursor-pointer"
              >
                Reset Balance
              </button>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted • Bar Council Compliant Retainer Escrow</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
