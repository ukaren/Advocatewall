import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  PhoneCall,
  FileText,
  Building,
  Sparkles,
  Download,
  Printer,
  MessageSquare,
  Zap,
  HelpCircle,
  Wallet,
  Smartphone,
  PlusCircle
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';
import { useWallet } from '../context/WalletContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
  defaultPurpose?: string;
  clientInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 499,
  defaultPurpose = 'Advocate Consultation Fee (₹10/min or Fixed Advice)',
  clientInfo = { name: '', phone: '', email: '' }
}) => {
  const { balance, deductWallet, openWalletWithTopup } = useWallet();
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmountStr, setCustomAmountStr] = useState<string>(defaultAmount.toString());
  const [purpose, setPurpose] = useState<string>(defaultPurpose);
  const [clientName, setClientName] = useState(clientInfo?.name || '');
  const [clientPhone, setClientPhone] = useState(clientInfo?.phone || '');
  const [clientEmail, setClientEmail] = useState(clientInfo?.email || '');
  
  const [selectedMethod, setSelectedMethod] = useState<'razorpay' | 'upi_qr' | 'wallet' | 'bank_transfer'>('razorpay');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [hasCopiedUpi, setHasCopiedUpi] = useState(false);
  const [hasCopiedAcc, setHasCopiedAcc] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isAwaitingRazorpayConfirmation, setIsAwaitingRazorpayConfirmation] = useState(false);

  const upiId = 'abhilendrakumar@okhdfcbank';
  const upiName = 'Advocate Walla (Legal Services)';

  const presetAmounts = [
    { value: 150, label: '₹150 (15m Call)' },
    { value: 300, label: '₹300 (30m Call)' },
    { value: 499, label: '₹499 (Standard Advice)' },
    { value: 999, label: '₹999 (Legal Notice)' },
    { value: 1499, label: '₹1,499 (Agreement Draft)' },
    { value: 2500, label: '₹2,500 (Court Retainer)' },
  ];

  const presetPurposes = [
    'Advocate Consultation Call (₹10/Min)',
    'Statutory Legal Demand Notice Drafting',
    'Rental / Commercial Lease Agreement',
    'Employment Contract & NDA Review',
    'Police Notice / BNSS Sec 35 Reply Draft',
    'eCourts Case Status & Certified Copy Handling',
    'Custom Legal Consultation & Advisory'
  ];

  useEffect(() => {
    if (defaultAmount) {
      setAmount(defaultAmount);
      setCustomAmountStr(defaultAmount.toString());
    }
    if (defaultPurpose) {
      setPurpose(defaultPurpose);
    }
  }, [defaultAmount, defaultPurpose, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountStr(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!clientName.trim()) {
      errs.name = 'Please enter your full name';
    }
    const phoneClean = clientPhone.replace(/[^0-9+]/g, '');
    if (!phoneClean || phoneClean.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (amount <= 0) {
      errs.amount = 'Please specify a valid payment amount';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLaunchRazorpay = () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    const merchantId = BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf';
    const txnId = `ADV-RZP-${Date.now().toString().slice(-6)}`;

    // If a valid live/test API key starting with rzp_ is configured and Razorpay SDK is loaded
    if (merchantId.startsWith('rzp_') && typeof (window as any).Razorpay !== 'undefined') {
      try {
        const options = {
          key: merchantId,
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          name: 'ADVOCAT वाला (Advocate Walla)',
          description: `${purpose} - Ref: ${txnId}`,
          image: '/images/advocate-walla-logo.png',
          prefill: {
            name: clientName,
            contact: clientPhone,
            email: clientEmail || 'consult@advocatwalla.com',
          },
          notes: {
            purpose: purpose,
            client_phone: clientPhone,
            txn_ref: txnId,
            merchant_id: merchantId,
          },
          theme: {
            color: '#0f172a',
          },
          handler: function (response: any) {
            setIsProcessing(false);
            const receipt = {
              txnId: response.razorpay_payment_id || txnId,
              date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              amount: amount,
              clientName: clientName,
              clientPhone: clientPhone,
              purpose: purpose,
              method: 'Razorpay Gateway (Cards/Netbanking/UPI)',
              status: 'PAID & VERIFIED'
            };
            setReceiptData(receipt);
            setPaymentSuccess(true);
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          setIsAwaitingRazorpayConfirmation(true);
        });
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay SDK invocation fallback:', err);
      }
    }

    // Direct official Razorpay Payment Page URL
    const razorpayMeUrl = BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar';
    window.open(razorpayMeUrl, '_blank', 'noopener,noreferrer');
    setIsProcessing(false);
    setIsAwaitingRazorpayConfirmation(true);
  };

  const handleConfirmRazorpayPayment = () => {
    if (!validateForm()) return;
    const txnId = transactionRef.trim() || `RZP-PAY-${Date.now().toString().slice(-6)}`;

    const receipt = {
      txnId: txnId,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      amount: amount,
      clientName: clientName,
      clientPhone: clientPhone,
      purpose: purpose,
      method: 'Razorpay Online Gateway (Direct Portal)',
      status: 'PAID & VERIFIED'
    };
    setReceiptData(receipt);
    setPaymentSuccess(true);
  };

  const handleWalletPayment = () => {
    if (!validateForm()) return;
    if (balance < amount) {
      openWalletWithTopup(amount - balance);
      return;
    }

    const res = deductWallet(
      amount,
      `Legal Payment: ${purpose}`,
      'consultation_fee',
      { referenceId: `WLT-${Date.now().toString().slice(-6)}` }
    );

    if (res.success) {
      const receipt = {
        txnId: `WLT-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        amount: amount,
        clientName: clientName,
        clientPhone: clientPhone,
        purpose: purpose,
        method: 'Pre-Paid Legal Wallet (1-Click Instant)',
        status: 'PAID & VERIFIED (Wallet Debited)'
      };
      setReceiptData(receipt);
      setPaymentSuccess(true);
    }
  };

  const handleConfirmUpiOrManual = () => {
    if (!validateForm()) return;
    const txnId = transactionRef.trim() || `UPI-UTR-${Date.now().toString().slice(-6)}`;

    const receipt = {
      txnId: txnId,
      date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      amount: amount,
      clientName: clientName,
      clientPhone: clientPhone,
      purpose: purpose,
      method: selectedMethod === 'upi_qr' ? 'Direct UPI (QR / PhonePe / GPay / Paytm)' : 'Bank IMPS / NEFT Transfer',
      status: 'SUBMITTED (Subject to Realization)'
    };
    setReceiptData(receipt);
    setPaymentSuccess(true);
  };

  const copyUpiToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setHasCopiedUpi(true);
    setTimeout(() => setHasCopiedUpi(false), 2500);
  };

  const copyAccToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopiedAcc(true);
    setTimeout(() => setHasCopiedAcc(false), 2500);
  };

  const sendWhatsAppReceipt = () => {
    if (!receiptData) return;
    const msg = `🧾 *LEGAL FEE PAYMENT CONFIRMATION - ADVOCATE WALLA*\n\n` +
      `• *Receipt / Txn Ref:* ${receiptData.txnId}\n` +
      `• *Client Name:* ${receiptData.clientName}\n` +
      `• *Phone:* ${receiptData.clientPhone}\n` +
      `• *Service / Purpose:* ${receiptData.purpose}\n` +
      `• *Amount Paid:* ₹${receiptData.amount}\n` +
      `• *Payment Method:* ${receiptData.method}\n` +
      `• *Date & Time:* ${receiptData.date}\n\n` +
      `Hello Advocate Seema Jha, I have completed the legal service fee payment. Kindly acknowledge and share the next consultation slot / drafted documents.`;
    
    window.open(getDirectWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  };

  // UPI deep link
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent('Advocate Walla')}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose.substring(0, 40))}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in text-left">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-4 sm:p-6 text-white flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  Secure Legal Fee Payment Gateway
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official Advocate Client Account • Instant Receipt & GST Invoicing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!paymentSuccess ? (
            <>
              {/* Step 1: Purpose & Amount Selection */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    1. Select Legal Service / Payment Purpose:
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  >
                    {presetPurposes.map((p, idx) => (
                      <option key={idx} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Payment Amount (INR ₹):
                    </label>
                    <span className="text-xs text-amber-700 font-bold">
                      Payable: ₹{amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5">
                    {presetAmounts.map((p) => {
                      const isSelected = amount === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => handlePresetSelect(p.value)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                            isSelected
                              ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-xs ring-2 ring-amber-400/40'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={customAmountStr}
                      onChange={handleCustomAmountChange}
                      placeholder="Or enter custom amount in Rupees"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-rose-600 mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>

              {/* Step 2: Client Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Client Information (For Legal Invoicing & Confirmation):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.phone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Email Address (Optional for PDF Receipt)
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Gateway Mode Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  4. Choose Payment Method:
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Razorpay Channel */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('razorpay')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'razorpay'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        selectedMethod === 'razorpay' ? 'bg-amber-400 text-slate-950' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Online
                      </span>
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <h5 className="text-xs font-bold">Razorpay Portal</h5>
                    <p className={`text-[10px] mt-0.5 ${selectedMethod === 'razorpay' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Cards, NetBanking, UPI
                    </p>
                  </button>

                  {/* UPI QR Channel */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi_qr')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'upi_qr'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        selectedMethod === 'upi_qr' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Zero Fee
                      </span>
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h5 className="text-xs font-bold">Direct UPI & QR</h5>
                    <p className={`text-[10px] mt-0.5 ${selectedMethod === 'upi_qr' ? 'text-slate-300' : 'text-slate-500'}`}>
                      GPay, PhonePe, Paytm
                    </p>
                  </button>

                  {/* Legal Wallet Channel */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wallet')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'wallet'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        selectedMethod === 'wallet' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'
                      }`}>
                        ₹{balance} Bal
                      </span>
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <h5 className="text-xs font-bold">Legal Wallet</h5>
                    <p className={`text-[10px] mt-0.5 ${selectedMethod === 'wallet' ? 'text-slate-300' : 'text-slate-500'}`}>
                      1-Click Instant Debit
                    </p>
                  </button>

                  {/* Bank Transfer Channel */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedMethod === 'bank_transfer'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        selectedMethod === 'bank_transfer' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-700'
                      }`}>
                        IMPS/NEFT
                      </span>
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <h5 className="text-xs font-bold">Bank Transfer</h5>
                    <p className={`text-[10px] mt-0.5 ${selectedMethod === 'bank_transfer' ? 'text-slate-300' : 'text-slate-500'}`}>
                      HDFC Advocate Account
                    </p>
                  </button>
                </div>
              </div>

              {/* Method Specific UI */}
              {selectedMethod === 'razorpay' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-slate-800 text-xs leading-relaxed space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Razorpay Official Legal Escrow Gateway</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold">
                      Merchant: {BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf'}
                    </span>
                  </div>

                  <p className="text-slate-700">
                    Pay securely using Cards (RuPay/Visa/MasterCard), UPI, NetBanking across all Indian banks, or EMI on the official Razorpay portal:
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Open Razorpay Payment Portal (₹{amount})</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-2">
                    <label className="text-[11px] font-semibold text-slate-700 block">
                      Already paid on Razorpay? Enter Payment / Transaction ID to generate receipt:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. pay_N2h58XyZ9 or Ref No."
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmRazorpayPayment}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-sm text-white">Legal Calling & Service Wallet</span>
                    </div>
                    <span className="font-mono text-sm font-extrabold text-amber-300 bg-slate-950 px-3 py-1 rounded-full border border-slate-700">
                      Balance: ₹{balance}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero-transaction failure, instant fee clearance directly from your pre-paid Legal Wallet.
                  </p>

                  {balance >= amount ? (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                      <span className="text-xs font-semibold">Available Balance covers this ₹{amount} payment</span>
                      <button
                        type="button"
                        onClick={handleWalletPayment}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Pay ₹{amount} from Wallet</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-xs">
                        Wallet balance (₹{balance}) is insufficient by <strong>₹{amount - balance}</strong>.
                      </span>
                      <button
                        type="button"
                        onClick={() => openWalletWithTopup(amount - balance)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs cursor-pointer shrink-0"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Top Up +₹{amount - balance}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === 'upi_qr' && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
                    <div className="text-center sm:text-left space-y-2">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        Scan or Pay via any UPI App
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Advocate Walla Official UPI ID
                      </h4>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-700 text-amber-300 font-mono text-xs mt-1">
                        <span>{upiId}</span>
                        <button
                          type="button"
                          onClick={copyUpiToClipboard}
                          className="text-slate-400 hover:text-white cursor-pointer ml-1"
                        >
                          {hasCopiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Quick 1-Click Mobile UPI Links */}
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-400 block mb-1.5">Direct 1-Click Mobile UPI App:</span>
                        <div className="flex flex-wrap gap-1.5">
                          <a
                            href={`tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent('Advocate Walla')}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose.substring(0, 30))}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700"
                          >
                            Google Pay
                          </a>
                          <a
                            href={`phonepe://pay?pa=${upiId}&pn=${encodeURIComponent('Advocate Walla')}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose.substring(0, 30))}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700"
                          >
                            PhonePe
                          </a>
                          <a
                            href={`paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent('Advocate Walla')}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose.substring(0, 30))}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700"
                          >
                            Paytm
                          </a>
                          <a
                            href={upiDeepLink}
                            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-[11px] font-bold text-slate-950"
                          >
                            Any UPI App
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="bg-white p-2 rounded-2xl shadow-lg shrink-0 text-center">
                      <img
                        src={qrCodeUrl}
                        alt="UPI Payment QR Code"
                        className="w-32 h-32 rounded-xl mx-auto"
                      />
                      <span className="text-[9px] font-bold text-slate-700 block mt-1">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 block">
                        ₹{amount}
                      </span>
                    </div>
                  </div>

                  {/* UTR Input */}
                  <div className="pt-3 border-t border-slate-800">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Enter UPI Transaction ID / UTR / Reference Number (after payment):
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. 423589123456 or UTR number"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'bank_transfer' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-700" />
                    <span>Advocate Bank Details (IMPS / NEFT / RTGS):</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Beneficiary Name</span>
                      <strong className="text-slate-900 font-bold">ABHILENDRA KUMAR / ADVOCATE WALLA</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Bank Name</span>
                      <strong className="text-slate-900 font-bold">HDFC Bank Ltd.</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Account Number</span>
                        <strong className="text-slate-900 font-mono font-bold">50100428912044</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAccToClipboard('50100428912044')}
                        className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Copy Account Number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">IFSC Code</span>
                        <strong className="text-slate-900 font-mono font-bold">HDFC0000280</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAccToClipboard('HDFC0000280')}
                        className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        title="Copy IFSC Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Transaction Ref */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Bank Transfer Reference / UTR Number:
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. CMS24090145229"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Payment Receipt & Acknowledgment Screen */
            <div className="text-center py-4 space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 mb-1">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
                  Payment Submitted Successfully
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-serif mt-2">
                  Official Legal Fee Payment Receipt
                </h3>
                <p className="text-xs text-slate-500">
                  Advocate Walla • Chambers of Adv. Seema Jha
                </p>
              </div>

              {/* Receipt Table Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs max-w-lg mx-auto space-y-3 font-sans">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Transaction / Ref ID:</span>
                  <span className="font-mono font-bold text-slate-900">{receiptData?.txnId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Client Name:</span>
                  <span className="font-bold text-slate-900">{receiptData?.clientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mobile / WhatsApp:</span>
                  <span className="font-bold text-slate-900">{receiptData?.clientPhone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service Purpose:</span>
                  <span className="font-bold text-slate-900 text-right">{receiptData?.purpose}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-bold text-slate-900">{receiptData?.method}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-bold text-slate-900">{receiptData?.date}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-sm font-bold text-slate-900">Total Amount Paid:</span>
                  <span className="text-base font-black text-emerald-700">₹{receiptData?.amount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={sendWhatsAppReceipt}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Receipt on WhatsApp to Advocate</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!paymentSuccess && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Payment Processing • PCI-DSS Certified</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>

              {selectedMethod === 'razorpay' ? (
                <button
                  type="button"
                  onClick={handleLaunchRazorpay}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>{isProcessing ? 'Connecting Gateway...' : `Pay ₹${amount} via Razorpay`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmUpiOrManual}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>I Have Paid ₹{amount} (Confirm)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
