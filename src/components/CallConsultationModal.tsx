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
  User,
  Radio,
  Timer
} from 'lucide-react';
import { AdvocateProfile, CallBookingData } from '../types';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { triggerTelephonyCall } from '../utils/telephony';

interface CallConsultationModalProps {
  advocate: AdvocateProfile | null;
  onClose: () => void;
}

export const CallConsultationModal: React.FC<CallConsultationModalProps> = ({
  advocate,
  onClose,
}) => {
  const { callDurationMinutes, setCallDurationMinutes, addToast } = useCart();

  const [selectedMinutes, setSelectedMinutes] = useState<number>(callDurationMinutes || 15);
  const [callMode, setCallMode] = useState<'instant_phone' | 'whatsapp_call' | 'scheduled_call'>('instant_phone');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [matterType, setMatterType] = useState('Property / Civil Dispute');
  const [notes, setNotes] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Immediately (Within 5-10 Mins)');
  const [isCallingSimulated, setIsCallingSimulated] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (callDurationMinutes) {
      setSelectedMinutes(callDurationMinutes);
    }
  }, [callDurationMinutes]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCallingSimulated) onClose();
    };
    if (advocate) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [advocate, isCallingSimulated, onClose]);

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

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!clientName.trim()) errs.name = 'Please provide your full name';
    if (!clientPhone.trim() || clientPhone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStartSimulatedCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Dispatch asynchronous trigger to n8n webhook and telephony bridge
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
      notes,
      customN8nUrl: customN8n,
    }).catch((err) => console.warn('Telephony dispatch error:', err));

    if (callMode === 'whatsapp_call') {
      const text = `Hello ${advocate.name},\n\nI want to start a *${selectedMinutes}-Minute Legal Consultation Call* via WhatsApp.\n\n*Client Details:*\n• Name: ${clientName}\n• Phone: ${clientPhone}\n• Legal Matter: ${matterType}\n• Duration: ${selectedMinutes} minutes (₹${totalCost} @ ₹${advocate.perMinuteRate}/min)\n• Brief Notes: ${notes || 'Ready to consult on call'}\n\nPlease let me know when we can begin the call.`;
      const url = getDirectWhatsAppUrl(text);
      window.open(url, '_blank');
      addToast(`Connecting to ${advocate.name} on WhatsApp...`);
      onClose();
      return;
    }

    if (callMode === 'scheduled_call') {
      const ref = `CALL-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingRef(ref);
      setIsBooked(true);
      addToast(`Scheduled consultation confirmed with ${advocate.name}!`);
      return;
    }

    // Direct Instant Phone Call Mode
    setIsCallingSimulated(true);
    // Simulate connection delay
    setTimeout(() => {
      setCallConnected(true);
    }, 2200);
  };

  const handleEndCall = () => {
    setIsCallingSimulated(false);
    setCallConnected(false);
    setCallTimer(0);
    addToast('Call ended. Thank you for consulting with ' + advocate.name, 'info');
    onClose();
  };

  const generateWhatsAppConfirmationUrl = () => {
    const text = `Hello ${advocate.name},\n\nI have confirmed a Scheduled Call Booking (*Ref: ${bookingRef}*):\n• Client: ${clientName}\n• Mobile: ${clientPhone}\n• Matter: ${matterType}\n• Duration: ${selectedMinutes} Mins\n• Slot: ${preferredSlot}\n• Total: ₹${totalCost}\n\nPlease confirm chamber conference link/dial-in.`;
    return getDirectWhatsAppUrl(text);
  };

  return (
    <div
      id="call-consultation-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={isCallingSimulated ? undefined : onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* If Active In-App Calling Screen */}
        {isCallingSimulated ? (
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
              <span className={`absolute -bottom-1 -right-1 p-2 rounded-full border-2 border-slate-900 ${
                callConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400 animate-ping'
              }`}>
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
                  <span>Connected (Encrypted Legal Line)</span>
                </div>
                <div className="font-mono text-3xl font-bold text-white tracking-widest">
                  {formatTimer(callTimer)}
                </div>
                <p className="text-xs text-slate-400">
                  Duration: {selectedMinutes} mins limit • Rate: ₹{advocate.perMinuteRate}/min
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-medium animate-pulse">
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Connecting to Chamber Line ({advocate.phone})...</span>
                </div>
                <p className="text-xs text-slate-400 max-w-sm">
                  Connecting your mobile number <strong>{clientPhone}</strong> to Advocate's direct consultation bridge.
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
                <span>Open in Phone App</span>
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
        ) : isBooked ? (
          /* Booked Confirmation Screen */
          <div className="p-6 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
                Consultation Call Confirmed
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-display mt-2 mb-1">
                Booking ID: {bookingRef}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your consultation slot with <strong>{advocate.name}</strong> for <strong>{selectedMinutes} minutes</strong> has been reserved for <strong>{preferredSlot}</strong>.
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
                <span>Consultation Fee:</span>
                <strong className="text-emerald-700 font-bold text-sm">₹{totalCost}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Chamber Phone:</span>
                <strong className="text-slate-900">{advocate.phone}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={generateWhatsAppConfirmationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Receive Details on WhatsApp</span>
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
        ) : (
          /* Normal Booking / Minute Selector Screen */
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
                      Charge is strictly based on your selected call duration. No surprise post-call billing.
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
                          <span className={`absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-amber-400 text-slate-900' : 'bg-slate-900 text-amber-300'
                          }`}>
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
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Choose Calling Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCallMode('instant_phone')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      callMode === 'instant_phone'
                        ? 'border-slate-900 bg-slate-900/5 text-slate-900 ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Phone className={`w-4 h-4 mt-0.5 ${callMode === 'instant_phone' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Direct Phone Call</div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Instant connection via cellular voice line
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCallMode('whatsapp_call')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      callMode === 'whatsapp_call'
                        ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <MessageSquare className={`w-4 h-4 mt-0.5 ${callMode === 'whatsapp_call' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-slate-900">WhatsApp Audio/Video</div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Call on WhatsApp with doc sharing
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCallMode('scheduled_call')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      callMode === 'scheduled_call'
                        ? 'border-slate-900 bg-slate-900/5 text-slate-900 ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Calendar className={`w-4 h-4 mt-0.5 ${callMode === 'scheduled_call' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-xs text-slate-900">Schedule Later</div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        Pick a convenient time slot today/tomorrow
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Client Information Form */}
              <form onSubmit={handleStartSimulatedCall} className="space-y-3.5">
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

                {/* Call Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="start-call-action-btn"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {callMode === 'whatsapp_call' ? (
                      <>
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>Start WhatsApp Call • ₹{totalCost} ({selectedMinutes} Mins)</span>
                      </>
                    ) : callMode === 'scheduled_call' ? (
                      <>
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>Confirm Scheduled Slot • ₹{totalCost}</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4 text-amber-400 animate-bounce" />
                        <span>Call Advocate Now • ₹{totalCost} ({selectedMinutes} Mins @ ₹{advocate.perMinuteRate}/min)</span>
                      </>
                    )}
                  </button>
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
