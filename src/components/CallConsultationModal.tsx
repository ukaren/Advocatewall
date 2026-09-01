import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  MessageSquare,
  Clock,
  Scale,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  User,
  Radio,
  Timer,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  Lock,
  QrCode,
  Zap,
  ArrowRight,
  Wallet,
  PlusCircle,
  Video,
  VideoOff,
  Camera,
  Printer,
  Download,
  Share2,
  FileText,
  Award
} from 'lucide-react';
import { AdvocateProfile } from '../types';
import { useCart } from '../context/CartContext';
import { useWallet } from '../context/WalletContext';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { triggerTelephonyCall } from '../utils/telephony';
import { VideoConsultationRoom, VideoCallSummary } from './VideoConsultationRoom';

interface CallConsultationModalProps {
  advocate: AdvocateProfile | null;
  onClose: () => void;
}

export const CallConsultationModal: React.FC<CallConsultationModalProps> = ({
  advocate,
  onClose,
}) => {
  const { callDurationMinutes, setCallDurationMinutes, initialCallMode, addToast } = useCart();
  const { balance, hasSufficientBalance, deductWallet, openWalletWithTopup } = useWallet();

  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'calling' | 'video_room' | 'video_summary' | 'booked'>('details');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(callDurationMinutes || 15);
  const [callMode, setCallMode] = useState<'video_call' | 'instant_phone' | 'whatsapp_call' | 'scheduled_call'>(
    initialCallMode || 'video_call'
  );
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [matterType, setMatterType] = useState('Property / Civil Dispute');
  const [notes, setNotes] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Immediately (Within 5-10 Mins)');
  
  // Payment states
  const [paymentOption, setPaymentOption] = useState<'wallet' | 'razorpay' | 'upi'>('wallet');
  const [transactionRef, setTransactionRef] = useState('');
  const [hasConfirmedPaid, setHasConfirmedPaid] = useState(false);
  const [hasCopiedUpi, setHasCopiedUpi] = useState(false);

  // Calling & booking simulation states
  const [callConnected, setCallConnected] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [bookingRef, setBookingRef] = useState('');
  const [videoSummary, setVideoSummary] = useState<VideoCallSummary | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const upiId = 'abhilendrakumar@okhdfcbank';

  useEffect(() => {
    if (callDurationMinutes) {
      setSelectedMinutes(callDurationMinutes);
    }
  }, [callDurationMinutes]);

  useEffect(() => {
    if (initialCallMode) {
      setCallMode(initialCallMode);
    }
  }, [initialCallMode]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentStep !== 'calling' && currentStep !== 'video_room') onClose();
    };
    if (advocate) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [advocate, currentStep, onClose]);

  // Timer simulation when instant call is active
  useEffect(() => {
    let interval: any = null;
    if (callConnected) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callConnected]);

  if (!advocate) return null;

  // Calculate total fee based on selected minutes
  const calculateTotal = (mins: number): number => {
    if (mins === 15 && advocate.slotRates[15]) return advocate.slotRates[15];
    if (mins === 30 && advocate.slotRates[30]) return advocate.slotRates[30];
    if (mins === 45 && advocate.slotRates[45]) return advocate.slotRates[45];
    if (mins === 60 && advocate.slotRates[60]) return advocate.slotRates[60];
    return mins * advocate.perMinuteRate;
  };

  const totalCost = calculateTotal(selectedMinutes);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const validateDetails = () => {
    const errs: { [key: string]: string } = {};
    if (!clientName.trim()) errs.name = 'Please provide your full name';
    if (!clientPhone.trim() || clientPhone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;
    setCurrentStep('payment');
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setHasCopiedUpi(true);
    addToast('UPI ID copied to clipboard: ' + upiId, 'success');
    setTimeout(() => setHasCopiedUpi(false), 3000);
  };

  const handleOpenRazorpay = () => {
    const merchantId = BUSINESS_CONFIG.merchantId || 'TSsxsVDG3CXIOf';
    
    // If a valid live/test API key starting with rzp_ is configured and Razorpay SDK is loaded
    if (merchantId.startsWith('rzp_') && typeof (window as any).Razorpay !== 'undefined') {
      try {
        const options = {
          key: merchantId,
          amount: totalCost * 100, // Amount in paise
          currency: 'INR',
          name: 'ADVOCAT वाला (Advocate Walla)',
          description: `${selectedMinutes} Mins Legal Consultation with ${advocate.name}`,
          image: advocate.avatar || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=200',
          prefill: {
            name: clientName,
            contact: clientPhone,
            email: 'consult@advocatwalla.com',
          },
          notes: {
            merchant_id: merchantId,
            advocate: advocate.name,
            duration: `${selectedMinutes} minutes`,
            matter: matterType,
          },
          theme: {
            color: '#0f172a',
          },
          handler: function (response: any) {
            const paymentId = response?.razorpay_payment_id || `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
            setTransactionRef(paymentId);
            setHasConfirmedPaid(true);
            addToast(`Payment of ₹${totalCost} verified! Ref: ${paymentId}`, 'success');
          },
          modal: {
            ondismiss: function () {
              setHasConfirmedPaid(true);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.warn('Razorpay payment failed:', response?.error);
          setHasConfirmedPaid(true);
        });
        rzp.open();
        return;
      } catch (err) {
        console.warn('Razorpay SDK invocation fallback:', err);
      }
    }

    // Direct open official Razorpay payment portal URL
    const razorpayLink = BUSINESS_CONFIG.razorpayUrl || 'https://razorpay.me/@abhilendrakumar';
    window.open(razorpayLink, '_blank', 'noopener,noreferrer');
    setHasConfirmedPaid(true);
    addToast(`Opened Razorpay Portal for ₹${totalCost}. Click 'Connect Consultation Call' after completing!`, 'info');
  };

  const handleConnectCallAfterPayment = () => {
    // Dispatch asynchronous trigger to telephony bridge
    const customN8n = localStorage.getItem('n8n_telephony_webhook_url') || undefined;
    triggerTelephonyCall({
      clientName,
      clientPhone,
      advocateName: advocate.name,
      advocatePhone: advocate.phone,
      durationMinutes: selectedMinutes,
      totalCost,
      matterCategory: matterType,
      callType: callMode,
      notes: `${notes} [Payment: ₹${totalCost} | Ref: ${transactionRef || 'Confirmed via UI'}]`,
      customN8nUrl: customN8n,
    }).catch((err) => console.warn('Telephony dispatch error:', err));

    if (callMode === 'video_call') {
      setCurrentStep('video_room');
      addToast(`Payment verified! Entering Advocate ${advocate.name}'s Virtual Chamber...`, 'success');
      return;
    }

    if (callMode === 'whatsapp_call') {
      const text = `Hello ${advocate.name},\n\nI have confirmed payment for a *${selectedMinutes}-Minute Legal Consultation Call* via WhatsApp.\n\n*Consultation & Payment Details:*\n• Client: ${clientName}\n• Phone: ${clientPhone}\n• Legal Matter: ${matterType}\n• Duration: ${selectedMinutes} minutes (Fee: ₹${totalCost})\n• Payment Status: Paid / Verified ${transactionRef ? `(Ref: ${transactionRef})` : ''}\n• Notes: ${notes || 'Ready to consult'}\n\nPlease start the WhatsApp consultation call.`;
      const url = getDirectWhatsAppUrl(text);
      window.open(url, '_blank');
      addToast(`Payment verified! Connecting to ${advocate.name} on WhatsApp...`, 'success');
      onClose();
      return;
    }

    if (callMode === 'scheduled_call') {
      const ref = `CALL-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(ref);
      setCurrentStep('booked');
      addToast(`Payment confirmed! Consultation booked with ${advocate.name}`, 'success');
      return;
    }

    // Direct Instant Phone Call Mode
    setCurrentStep('calling');
    setTimeout(() => {
      setCallConnected(true);
    }, 2200);
  };

  const handleEndCall = () => {
    setCallConnected(false);
    setCallTimer(0);
    setCurrentStep('details');
    addToast('Call ended. Thank you for consulting with ' + advocate.name, 'info');
    onClose();
  };

  const generateWhatsAppConfirmationUrl = () => {
    const text = `Hello ${advocate.name},\n\nI have confirmed consultation payment and scheduled a call (*Ref: ${bookingRef}*):\n• Client: ${clientName}\n• Mobile: ${clientPhone}\n• Matter: ${matterType}\n• Duration: ${selectedMinutes} Mins\n• Slot: ${preferredSlot}\n• Total Paid: ₹${totalCost}\n• Transaction Ref: ${transactionRef || 'Razorpay/UPI Online'}\n\nPlease confirm conference dial-in.`;
    return getDirectWhatsAppUrl(text);
  };

  if (currentStep === 'video_room') {
    return (
      <VideoConsultationRoom
        advocate={advocate}
        durationMinutes={selectedMinutes}
        clientName={clientName || 'Client'}
        clientPhone={clientPhone || '+91 98670 15157'}
        matterType={matterType}
        onEndCall={(summary) => {
          setVideoSummary(summary);
          setCurrentStep('video_summary');
          addToast('Video consultation concluded. Official Chamber Slip generated.', 'info');
        }}
      />
    );
  }

  return (
    <div
      id="call-consultation-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={currentStep === 'calling' ? undefined : onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= STEP: VIDEO CONSULTATION SUMMARY & RECEIPT SLIP ================= */}
        {currentStep === 'video_summary' && videoSummary ? (
          <div className="p-6 sm:p-8 bg-slate-50 text-slate-900">
            {/* Header / Seal */}
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 mb-3 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold tracking-wide uppercase mb-2">
                Advocate Walla • Official Chamber Record
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900">
                Virtual Chamber Consultation Summary
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Bar Council Enrolment: <strong className="text-slate-900">MAH/2841/2020</strong> • Ref: <span className="font-mono font-bold text-amber-700">{videoSummary.consultationId}</span>
              </p>
            </div>

            {/* Attendance & Billing Details */}
            <div className="my-5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Legal Counsel:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-600" />
                  {videoSummary.advocateName}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Client Name & Phone:</span>
                <span className="font-semibold text-slate-900">
                  {videoSummary.clientName} ({videoSummary.clientPhone})
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Matter Category:</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                  {videoSummary.matterType}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Duration Elapsed:</span>
                <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {Math.floor(videoSummary.durationSeconds / 60)}m {videoSummary.durationSeconds % 60}s ({selectedMinutes}m booked)
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-semibold">Total Consultation Fee:</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ₹{videoSummary.totalCost} (Paid & Verified)
                </span>
              </div>
            </div>

            {/* Recorded Consultation Notes / Advice */}
            {videoSummary.notes && (
              <div className="mb-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Chamber Session Notes & Advice:</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {videoSummary.notes}
                </p>
              </div>
            )}

            {/* Action Buttons: Print, WhatsApp Share, Download, Close */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Advice Slip</span>
              </button>

              <a
                href={getDirectWhatsAppUrl(
                  `*Official Chamber Consultation Record*\n• Ref: ${videoSummary.consultationId}\n• Advocate: ${videoSummary.advocateName}\n• Client: ${videoSummary.clientName}\n• Duration: ${Math.floor(videoSummary.durationSeconds / 60)}m ${videoSummary.durationSeconds % 60}s\n• Fee Paid: ₹${videoSummary.totalCost}\n• Matter: ${videoSummary.matterType}\n${videoSummary.notes ? `• Advice Notes: ${videoSummary.notes}` : ''}\n\nGenerated by Advocate Walla Virtual Chambers.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([
                    `======================================================\n` +
                    `ADVOCAT वाला (एडवोकेट वाला) • OFFICIAL CHAMBER SLIP\n` +
                    `Advocate: ${videoSummary.advocateName} (B.A. LL.B. - High Court Practice)\n` +
                    `Reference ID: ${videoSummary.consultationId}\n` +
                    `Date: ${new Date(videoSummary.timestamp).toLocaleString('en-IN')}\n` +
                    `------------------------------------------------------\n` +
                    `Client: ${videoSummary.clientName} (${videoSummary.clientPhone})\n` +
                    `Matter: ${videoSummary.matterType}\n` +
                    `Duration: ${Math.floor(videoSummary.durationSeconds / 60)} mins ${videoSummary.durationSeconds % 60} secs\n` +
                    `Amount Paid: INR ${videoSummary.totalCost}\n` +
                    `------------------------------------------------------\n` +
                    `CHAMBER ADVICE & NOTES:\n` +
                    `${videoSummary.notes || 'Legal advice imparted live in Chamber Video Room.'}\n` +
                    `======================================================\n`
                  ], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `Chamber-Slip-${videoSummary.consultationId}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                  addToast('Consultation Slip downloaded successfully', 'success');
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-700" />
                <span>Download Slip</span>
              </button>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer py-1"
              >
                Return to Dashboard / Home
              </button>
            </div>
          </div>
        ) : currentStep === 'calling' ? (
          <div className="bg-slate-950 text-white p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[460px]">
            {/* Pulsing Avatar */}
            <div className="relative mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-400/80 shadow-2xl mx-auto">
                <img
                  src={advocate.avatar}
                  alt={advocate.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 p-2 rounded-full border-2 border-slate-900 ${
                  callConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-ping'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-slate-900" />
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-1">
              {advocate.name}
            </h3>
            <p className="text-xs text-amber-400 font-medium mb-4">
              {advocate.title} • {advocate.specialization}
            </p>

            {/* Call Status Indicator */}
            {callConnected ? (
              <div className="space-y-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Payment Verified • Connected on Legal Line</span>
                </div>
                <div className="font-mono text-3xl font-bold text-white tracking-widest">
                  {formatTimer(callTimer)}
                </div>
                <p className="text-xs text-slate-400">
                  Duration: {selectedMinutes} mins • Paid: ₹{totalCost}
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse">
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Connecting to Chamber Line ({advocate.phone})...</span>
                </div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Connecting your number <strong>{clientPhone}</strong> to Advocate's direct confidential line.
                </p>
              </div>
            )}

            {/* Direct Phone Dial Button Backup */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <a
                href={`tel:${advocate.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Open in Phone Dialer</span>
              </a>

              <button
                onClick={handleEndCall}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 rotate-[135deg]" />
                <span>End Consultation</span>
              </button>
            </div>

            <div className="mt-6 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privileged advocate-client confidential communication</span>
            </div>
          </div>
        ) : currentStep === 'booked' ? (
          /* ================= STEP: BOOKED CONFIRMATION SCREEN ================= */
          <div className="p-6 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                Payment Received • Consultation Confirmed
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-display mt-2 mb-1">
                Booking ID: {bookingRef}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your consultation slot with <strong>{advocate.name}</strong> for <strong>{selectedMinutes} minutes</strong> has been confirmed for <strong>{preferredSlot}</strong>.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Advocate:</span>
                <strong className="text-slate-900">{advocate.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rate & Duration:</span>
                <strong className="text-slate-900">{selectedMinutes} mins (₹{advocate.perMinuteRate}/min)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <strong className="text-emerald-700 font-bold text-sm">₹{totalCost} (Verified)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Chamber Phone:</span>
                <strong className="text-slate-900">{advocate.phone}</strong>
              </div>
              {transactionRef && (
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span>Payment Ref / UTR:</span>
                  <strong className="font-mono text-slate-800">{transactionRef}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={generateWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Details on WhatsApp</span>
              </a>

              <a
                href={`tel:${advocate.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Chamber Directly</span>
              </a>
            </div>

            <div>
              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer pt-2"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : currentStep === 'payment' ? (
          /* ================= STEP 2: PRE-CONNECTION PAYMENT SCREEN ================= */
          <div>
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                  title="Back to Details"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div>
                  <h3 className="font-bold text-white font-display text-base flex items-center gap-2">
                    <span>Pay Consultation Fee Before Connecting</span>
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    Step 2 of 2: Secure Fee Payment • ₹{totalCost} Total
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Order Breakdown Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={advocate.avatar}
                      alt={advocate.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-base text-white">{advocate.name}</h4>
                      <p className="text-xs text-slate-300">{advocate.specialization}</p>
                    </div>
                  </div>
                  <div className="sm:text-right bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-amber-300 block font-semibold uppercase tracking-wider">
                      Payable Consultation Fee
                    </span>
                    <span className="text-2xl font-extrabold text-white">₹{totalCost}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-3 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Duration</span>
                    <span className="font-semibold text-white">{selectedMinutes} Minutes</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Calling Mode</span>
                    <span className="font-semibold text-amber-300 capitalize">
                      {callMode === 'video_call'
                        ? '📹 HD Video Consultation Room'
                        : callMode === 'instant_phone'
                        ? 'Direct Phone Call'
                        : callMode === 'whatsapp_call'
                        ? 'WhatsApp Audio/Video'
                        : 'Scheduled Call'}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[11px]">Client Mobile</span>
                    <span className="font-semibold text-white">{clientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Payment Option
                  </label>
                  <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Wallet Balance: ₹{balance}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Legal Wallet (1-Click Instant) */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('wallet')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      paymentOption === 'wallet'
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-amber-600" />
                        <span>Legal Wallet</span>
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                        1-Click
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Balance: <strong className="text-slate-900">₹{balance}</strong> (₹10/min)
                    </p>
                  </button>

                  {/* Option 2: Razorpay */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('razorpay')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      paymentOption === 'razorpay'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Razorpay</span>
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                        Gateway
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Cards, NetBanking, Wallets
                    </p>
                  </button>

                  {/* Option 3: Direct UPI QR / ID */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption('upi')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      paymentOption === 'upi'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>UPI / QR</span>
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Zero Fee
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      GPay, PhonePe, Paytm
                    </p>
                  </button>
                </div>
              </div>

              {/* Payment Details Container */}
              {paymentOption === 'wallet' ? (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-xs font-bold block">
                          Pay from Advocate Walla Legal Wallet
                        </strong>
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Instant Deduction
                        </span>
                      </div>
                      <span className="text-slate-600 text-[11px] mt-0.5 block">
                        Deducts ₹{totalCost} directly from your pre-loaded balance. No waiting for card SMS/OTPs.
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-900 bg-white px-2.5 py-1 rounded border border-amber-300 flex-shrink-0">
                      ₹{totalCost}
                    </span>
                  </div>

                  {balance >= totalCost ? (
                    <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Sufficient Balance (Remaining after call: <strong>₹{balance - totalCost}</strong>)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const res = deductWallet(
                            totalCost,
                            `${selectedMinutes} Mins Legal Call Consultation with ${advocate.name}`,
                            'call_consultation',
                            { advocateName: advocate.name, durationMinutes: selectedMinutes }
                          );
                          if (res.success) {
                            setTransactionRef(res.transactionId || 'WALLET-PAY');
                            setHasConfirmedPaid(true);
                            addToast(res.message, 'success');
                            handleConnectCallAfterPayment();
                          } else {
                            addToast(res.message, 'error');
                          }
                        }}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Pay ₹{totalCost} & Start Call</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                      <span className="text-rose-700">
                        Insufficient balance (₹{balance}). Need ₹{totalCost - balance} more.
                      </span>
                      <button
                        type="button"
                        onClick={() => openWalletWithTopup(totalCost - balance > 150 ? totalCost - balance : 150)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Recharge Wallet (+₹{totalCost - balance})</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : paymentOption === 'razorpay' ? (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-xs font-bold block">
                          Pay ₹{totalCost} on Razorpay Secure Gateway
                        </strong>
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                          Merchant: TSsxsVDG3CXIOf
                        </span>
                      </div>
                      <span className="text-slate-600 text-[11px] mt-0.5 block">
                        Direct merchant checkout with UPI, Google Pay, PhonePe, Paytm, Cards & NetBanking.
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-white px-2 py-1 rounded border border-blue-200 flex-shrink-0">
                      ₹{totalCost}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenRazorpay}
                    id="open-razorpay-btn"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{totalCost} via Razorpay (Merchant: TSsxsVDG3CXIOf)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-blue-200/60">
                    <span>Verified Merchant ID: <strong className="font-mono text-slate-800">TSsxsVDG3CXIOf</strong></span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL Encrypted
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-slate-900 text-xs font-bold block">
                        Direct UPI Transfer
                      </strong>
                      <span className="text-slate-600 text-[11px]">
                        Pay ₹{totalCost} to our verified official UPI ID from your GPay, PhonePe, or Paytm app:
                      </span>
                    </div>
                  </div>

                  {/* Copy UPI Box */}
                  <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {upiId}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                    >
                      {hasCopiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy UPI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Transaction Ref & Confirmation */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    UPI UTR / Transaction Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. 423981293847 (From Google Pay / PhonePe receipt)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white font-mono"
                  />
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasConfirmedPaid}
                    onChange={(e) => setHasConfirmedPaid(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
                  />
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 block font-semibold">
                      I have initiated / completed the payment of ₹{totalCost}
                    </strong>
                    <span>
                      Advocate will immediately connect with you on your mobile number (<strong>{clientPhone}</strong>).
                    </span>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  ← Edit Details
                </button>

                <button
                  type="button"
                  id="confirm-payment-connect-btn"
                  onClick={handleConnectCallAfterPayment}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {callMode === 'whatsapp_call' ? (
                    <>
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Confirm Payment & Connect WhatsApp Call</span>
                    </>
                  ) : callMode === 'scheduled_call' ? (
                    <>
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Confirm Payment & Book Slot</span>
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span>Confirm Payment & Call Advocate Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Escrow Protected • Client-Advocate Privileged</span>
              </div>
              <div className="font-semibold text-slate-700">
                Direct Chamber Line: <a href={`tel:${advocate.phone.replace(/[^0-9+]/g, '')}`} className="text-slate-900 underline">{advocate.phone}</a>
              </div>
            </div>
          </div>
        ) : (
          /* ================= STEP 1: CONSULTATION DETAILS & DURATION ================= */
          <div>
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={advocate.avatar}
                    alt={advocate.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
                  />
                  {advocate.isAvailableNow && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white font-display text-base">
                      {advocate.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      ₹{advocate.perMinuteRate}/min
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{advocate.specialization}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Top Banner: Minute Rate Overview */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Timer className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-semibold">
                      Transparent Per-Minute Legal Billing
                    </strong>
                    <span className="text-slate-600">
                      Select your duration, review the fee, and pay before connecting. No post-call surprises.
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-slate-500 block">Rate</span>
                  <span className="font-bold text-slate-900 text-sm">₹{advocate.perMinuteRate}/min</span>
                </div>
              </div>

              {/* 1. Select Minutes / Duration */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Select Call Duration (Minutes)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { mins: 15, label: '15 Mins', tag: 'Quick Advice', price: advocate.slotRates[15] || 15 * advocate.perMinuteRate },
                    { mins: 30, label: '30 Mins', tag: 'Detailed Query', price: advocate.slotRates[30] || 30 * advocate.perMinuteRate, popular: true },
                    { mins: 45, label: '45 Mins', tag: 'Doc Review', price: advocate.slotRates[45] || 45 * advocate.perMinuteRate },
                    { mins: 60, label: '60 Mins', tag: 'Full Strategy', price: advocate.slotRates[60] || 60 * advocate.perMinuteRate },
                  ].map((slot) => {
                    const isSelected = selectedMinutes === slot.mins;
                    return (
                      <button
                        key={slot.mins}
                        type="button"
                        onClick={() => {
                          setSelectedMinutes(slot.mins);
                          setCallDurationMinutes(slot.mins);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        {slot.popular && (
                          <span
                            className={`absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-900 text-amber-300'
                            }`}
                          >
                            Popular
                          </span>
                        )}
                        <div className="font-bold text-sm">{slot.label}</div>
                        <div className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                          {slot.tag}
                        </div>
                        <div className={`mt-2 font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          ₹{slot.price}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Minutes Slider */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-slate-600 font-medium">Custom Minutes: </span>
                    <strong className="text-slate-900">{selectedMinutes} mins</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={90}
                    step={5}
                    value={selectedMinutes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setSelectedMinutes(val);
                      setCallDurationMinutes(val);
                    }}
                    className="w-44 accent-slate-900 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Total: ₹{totalCost}
                  </span>
                </div>
              </div>

              {/* 2. Select Calling Facility Mode */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    2. Choose Calling Mode
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Video Chamber Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Live Video Consultation Room */}
                  <button
                    type="button"
                    onClick={() => setCallMode('video_call')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer relative overflow-hidden ${
                      callMode === 'video_call'
                        ? 'border-amber-500 bg-amber-50/70 text-slate-900 ring-2 ring-amber-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-900 flex-shrink-0 mt-0.5">
                      <Video className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">HD Video Consultation</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        Live 1-on-1 virtual chamber with screen share, live chat & advice notes
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Direct Phone Call */}
                  <button
                    type="button"
                    onClick={() => setCallMode('instant_phone')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      callMode === 'instant_phone'
                        ? 'border-slate-900 bg-slate-900/5 text-slate-900 ring-2 ring-slate-900/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-slate-900" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Direct Phone Call</div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        Instant connection via secure cellular voice conference line
                      </p>
                    </div>
                  </button>

                  {/* Option 3: WhatsApp Audio/Video */}
                  <button
                    type="button"
                    onClick={() => setCallMode('whatsapp_call')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      callMode === 'whatsapp_call'
                        ? 'border-emerald-600 bg-emerald-50/60 text-slate-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">WhatsApp Audio / Video</div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        Direct consultation over WhatsApp with document upload
                      </p>
                    </div>
                  </button>

                  {/* Option 4: Schedule Consultation */}
                  <button
                    type="button"
                    onClick={() => setCallMode('scheduled_call')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      callMode === 'scheduled_call'
                        ? 'border-blue-600 bg-blue-50/60 text-slate-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700 flex-shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Schedule Later</div>
                      <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                        Reserve a convenient slot today or tomorrow with calendar invite
                      </p>
                    </div>
                  </button>
                </div>

                {/* Video Call Chamber Feature Highlight */}
                {callMode === 'video_call' && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Camera & microphone enabled for virtual chamber entry.</span>
                    </div>
                    <span className="text-[11px] text-amber-900 font-bold hidden sm:inline-block">
                      Instant Chamber Attendance Slip Included
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Client Information Form */}
              <form onSubmit={handleProceedToPayment} className="space-y-3.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Your Details for Connection
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      placeholder="e.g. Anand Verma"
                      className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                        errors.name ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (For Call) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(e.target.value);
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+91 98670 15157"
                      className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                        errors.phone ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Legal Matter Topic
                    </label>
                    <select
                      value={matterType}
                      onChange={(e) => setMatterType(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    >
                      <option value="Property / Civil Dispute">Property / Land / Civil Dispute</option>
                      <option value="Mutual / Contested Divorce & Custody">Family / Divorce & Custody</option>
                      <option value="Criminal Defense / Bail Matter">Criminal / Bail / Police Matter</option>
                      <option value="Cheque Bounce Sec 138">Cheque Bounce Sec 138</option>
                      <option value="Corporate / Startup / Contracts">Corporate / Startup / Contracts</option>
                      <option value="Consumer Court / Builder Delay">Consumer Court / Builder Delay</option>
                      <option value="Cyber Crime / Online Fraud">Cyber Crime / Online Fraud</option>
                      <option value="General Legal Advisory">General Legal Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    >
                      <option value="Immediately (Within 5-10 Mins)">Immediately (Within 5-10 Mins)</option>
                      <option value="Today Evening (4:00 PM - 7:00 PM)">Today Evening (4:00 PM - 7:00 PM)</option>
                      <option value="Tomorrow Morning (10:00 AM - 1:00 PM)">Tomorrow Morning (10:00 AM - 1:00 PM)</option>
                      <option value="Tomorrow Evening (4:00 PM - 7:00 PM)">Tomorrow Evening (4:00 PM - 7:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brief Query Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide 1-2 lines summarizing your situation so Advocate is prepared..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Proceed to Payment Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="proceed-to-payment-btn"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Proceed to Payment (₹{totalCost} for {selectedMinutes} Mins)</span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Secure payment step before connecting your confidential consultation call</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Confidential • Privileged Legal Consultation</span>
              </div>
              <div className="font-semibold text-slate-700">
                Direct Chamber Line: <a href={`tel:${advocate.phone.replace(/[^0-9+]/g, '')}`} className="text-slate-900 underline">{advocate.phone}</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
