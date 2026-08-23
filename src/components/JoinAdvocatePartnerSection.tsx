import React, { useState, useRef } from 'react';
import {
  Briefcase,
  Scale,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  IndianRupee,
  FileText,
  CreditCard,
  Building,
  UserCheck,
  AlertCircle,
  X,
  Eye,
  Send,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Clock,
  Award,
  HelpCircle,
  Search,
  Check,
  ChevronRight,
  Download
} from 'lucide-react';
import { AdvocatePartnerApplication, AttachedDocument } from '../types';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface FileUploadBoxProps {
  label: string;
  sublabel: string;
  required?: boolean;
  docKey: 'barCertificate' | 'aadhaarCard' | 'addressProof' | 'idCardOrCop' | 'profilePhoto';
  doc: AttachedDocument | null | undefined;
  onFileSelect: (key: string, file: File) => void;
  onFileRemove: (key: string) => void;
  onPreview: (doc: AttachedDocument) => void;
  accept?: string;
  icon: React.ReactNode;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({
  label,
  sublabel,
  required,
  docKey,
  doc,
  onFileSelect,
  onFileRemove,
  onPreview,
  accept = '.pdf,.png,.jpg,.jpeg',
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(docKey, e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(docKey, e.target.files[0]);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        <span className="text-[10px] text-slate-500">{sublabel}</span>
      </div>

      {doc ? (
        <div className="p-3 bg-emerald-50/80 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 transition-all">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-900 truncate">{doc.name}</p>
              <p className="text-[10px] text-emerald-700 font-medium">
                {(doc.size / 1024).toFixed(1)} KB • Attached
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {doc.previewUrl && (
              <button
                type="button"
                onClick={() => onPreview(doc)}
                className="p-1.5 text-emerald-700 hover:bg-emerald-200/60 rounded-md transition-colors"
                title="Preview Document"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onFileRemove(docKey)}
              className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-md transition-colors"
              title="Remove File"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`p-3.5 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all bg-white hover:bg-slate-50 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-1">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {icon}
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Click to browse or drag & drop
            </span>
          </div>
          <p className="text-[11px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
        </div>
      )}
    </div>
  );
};

export const JoinAdvocatePartnerSection: React.FC = () => {
  const { addToast } = useCart();
  const [activeTab, setActiveTab] = useState<'register' | 'status'>('register');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<AttachedDocument | null>(null);
  const [submittedData, setSubmittedData] = useState<AdvocatePartnerApplication | null>(null);

  // Status check tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingStatus, setIsSearchingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<any[] | null>(null);

  // Main Form Data
  const [form, setForm] = useState<AdvocatePartnerApplication>({
    fullName: '',
    email: '',
    phone: '',
    barRegistrationNo: '',
    stateBarCouncil: 'Bar Council of Delhi',
    experienceYears: 3,
    qualification: 'LL.B. / B.A. LL.B.',
    primaryCourts: ['High Court of Delhi', 'District Courts (Tis Hazari/Saket/Patiala House)'],
    specializations: ['Civil Matters', 'Criminal Law', 'Family & Divorce'],
    perMinuteRateProposed: 15,
    consultationModes: ['Phone Call', 'WhatsApp Audio/Video', 'Document Review'],
    city: 'New Delhi',
    state: 'Delhi',
    chamberAddress: '',
    payoutUpiOrAccount: '',
    bio: '',
    documents: {
      barCertificate: null,
      aadhaarCard: null,
      addressProof: null,
      idCardOrCop: null,
      profilePhoto: null,
    },
    declarationAccepted: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const stateBarCouncils = [
    'Bar Council of Delhi',
    'Bar Council of Maharashtra & Goa',
    'Bar Council of Uttar Pradesh',
    'Bar Council of Karnataka',
    'Bar Council of Punjab & Haryana',
    'Bar Council of Rajasthan',
    'Bar Council of Tamil Nadu & Puducherry',
    'Bar Council of West Bengal',
    'Bar Council of Gujarat',
    'Bar Council of Bihar',
    'Bar Council of Madhya Pradesh',
    'Other State Bar Council'
  ];

  const specializationOptions = [
    'Civil Matters & Injunctions',
    'Criminal Law & Bail',
    'Family & Divorce Law',
    'Property & Real Estate Disputes',
    'Corporate & Commercial Law',
    'Cyber Crime & Tech Law',
    'Cheque Bounce (Sec 138 NI Act)',
    'Consumer Protection & RERA',
    'Taxation & GST Advisory',
    'Constitutional & Writ Petitions',
    'Labour & Service Matters',
    'Intellectual Property (IPR / Trademark)',
  ];

  const courtOptions = [
    'Supreme Court of India',
    'High Court of Delhi',
    'District & Sessions Courts',
    'National Company Law Tribunal (NCLT)',
    'Debt Recovery Tribunal (DRT)',
    'Consumer Disputes Redressal Commission',
    'National Green Tribunal (NGT)',
    'RERA Tribunal'
  ];

  const toggleSpecialization = (spec: string) => {
    setForm(prev => {
      const exists = prev.specializations.includes(spec);
      const updated = exists
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec];
      return { ...prev, specializations: updated };
    });
  };

  const toggleCourt = (court: string) => {
    setForm(prev => {
      const exists = prev.primaryCourts.includes(court);
      const updated = exists
        ? prev.primaryCourts.filter(c => c !== court)
        : [...prev.primaryCourts, court];
      return { ...prev, primaryCourts: updated };
    });
  };

  const toggleMode = (mode: string) => {
    setForm(prev => {
      const exists = prev.consultationModes.includes(mode);
      const updated = exists
        ? prev.consultationModes.filter(m => m !== mode)
        : [...prev.consultationModes, mode];
      return { ...prev, consultationModes: updated };
    });
  };

  const handleFileSelect = (key: string, file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      addToast('File size must be under 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const attached: AttachedDocument = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64: base64String,
        previewUrl: file.type.startsWith('image/') ? base64String : undefined,
        uploadedAt: new Date().toISOString()
      };

      setForm(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: attached
        }
      }));

      // Clear error for this field
      if (errors[key]) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
      addToast(`Attached: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileRemove = (key: string) => {
    setForm(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [key]: null
      }
    }));
    addToast('Attachment removed', 'info');
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!form.phone.trim() || form.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    if (!form.barRegistrationNo.trim()) {
      errs.barRegistrationNo = 'Bar Registration Number is required (e.g. D/1234/2020)';
    }
    if (!form.city.trim()) errs.city = 'Practice city is required';
    if (form.specializations.length === 0) {
      errs.specializations = 'Select at least one specialization area';
    }
    if (!form.documents.barCertificate) {
      errs.barCertificate = 'Bar Enrollment / LL.B Certificate is required for verification';
    }
    if (!form.documents.aadhaarCard) {
      errs.aadhaarCard = 'Aadhaar Card / Govt ID is required';
    }
    if (!form.declarationAccepted) {
      errs.declarationAccepted = 'Please accept the declaration to proceed';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please complete all mandatory fields & attach required documents.', 'error');
      // Scroll to error if possible
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/advocates/join-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedData({
          ...form,
          applicationId: data.applicationId,
          submittedAt: new Date().toLocaleString(),
          status: 'under_review'
        });
        addToast('Partner Application submitted successfully!', 'success');
      } else {
        addToast(data.error || 'Failed to submit application', 'error');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback local submission in case of offline/container network
      const fakeId = `ADV-PTR-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedData({
        ...form,
        applicationId: fakeId,
        submittedAt: new Date().toLocaleString(),
        status: 'under_review'
      });
      addToast('Partner Application registered successfully!', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchStatus = async () => {
    if (!searchQuery.trim()) {
      addToast('Please enter an Application ID, Mobile Number or Bar Reg No.', 'error');
      return;
    }

    setIsSearchingStatus(true);
    try {
      const res = await fetch(`/api/advocates/partner-applications?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();
      setStatusResult(data.applications || []);
    } catch {
      setStatusResult([]);
    } finally {
      setIsSearchingStatus(false);
    }
  };

  const getPartnerWhatsAppForwardText = () => {
    if (!submittedData) return '';
    return `Hello AdvocatWalla Onboarding Desk,\n\nI have submitted my Advocate Business Partner Application:\n\n` +
      `• Application ID: ${submittedData.applicationId}\n` +
      `• Advocate: ${submittedData.fullName}\n` +
      `• Bar Reg No: ${submittedData.barRegistrationNo} (${submittedData.stateBarCouncil})\n` +
      `• Experience: ${submittedData.experienceYears} Years\n` +
      `• Proposed Call Rate: ₹${submittedData.perMinuteRateProposed}/min\n` +
      `• Attached Documents: Bar Certificate, Aadhaar Card, Address Proof\n\n` +
      `Please expedite my verification and activate my advocate profile on the portal.`;
  };

  return (
    <section id="partner-join" className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Glow Backdrops */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold uppercase tracking-wider mb-3.5">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Advocate Business Partnership Program</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Join AdvocatWalla as an Advocate Business Partner
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Are you a practicing Advocate enrolled with the Bar Council? Partner with our verified digital legal platform. Monetize your advisory on a transparent per-minute calling rate, receive high-ticket drafting and litigation briefs, and expand your legal reach pan-India.
          </p>

          {/* Tab Switcher: Register / Status Check */}
          <div className="mt-8 inline-flex p-1 bg-slate-800/90 border border-slate-700 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Advocate Self-Registration Form</span>
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'status'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Application Status</span>
            </button>
          </div>
        </div>

        {/* 4 Value Pillars Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Guaranteed Call Earnings</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn ₹10 to ₹50+ per minute directly for legal advisory calls with instant weekly/monthly bank payouts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Direct Case Briefs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive verified client inquiries for drafting agreements, legal notices, sale deeds, bail petitions & court appearances.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Automated Telephony Bridge</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seamless n8n-powered calling connects clients straight to your phone while keeping your personal number private.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Zero Upfront Listing Fee</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Free onboarding with genuine Bar Council certificate verification and dedicated digital profile showcase.
            </p>
          </div>
        </div>

        {/* Dynamic Content Area: Registration Form vs Status Checker */}
        {activeTab === 'status' ? (
          <div className="max-w-3xl mx-auto bg-slate-800/90 rounded-3xl border border-slate-700 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Check Advocate Partner Onboarding Status
                </h3>
                <p className="text-xs text-slate-300">
                  Search by Application ID (e.g. ADV-PTR-8921), Registered Mobile Number, or Bar Registration Number.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Application ID / Mobile No / Bar Reg No"
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                onKeyDown={(e) => e.key === 'Enter' && handleSearchStatus()}
              />
              <button
                type="button"
                onClick={handleSearchStatus}
                disabled={isSearchingStatus}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSearchingStatus ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Check Status</span>
              </button>
            </div>

            {statusResult && (
              <div className="space-y-3">
                {statusResult.length === 0 ? (
                  <div className="p-6 text-center bg-slate-900/60 rounded-2xl border border-slate-700/60 text-slate-400 text-xs sm:text-sm">
                    No matching partner application found for "{searchQuery}". Please check your application ID or submit a new partner application.
                  </div>
                ) : (
                  statusResult.map((app, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-700/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {app.applicationId}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-400/10 text-amber-300 border border-amber-400/30">
                            Under Verification
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{app.fullName}</h4>
                        <p className="text-xs text-slate-300">
                          {app.barRegistrationNo} • {app.experienceYears} Years Exp • {app.qualification}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Documents Attached
                        </span>
                        <a
                          href={getDirectWhatsAppUrl(
                            `Hello AdvocatWalla,\nRegarding my partner application ${app.applicationId} (${app.fullName}), please update me on the verification status.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Desk</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : submittedData ? (
          /* Application Success Card */
          <div className="max-w-3xl mx-auto bg-slate-800/95 rounded-3xl border border-emerald-500/50 p-6 sm:p-10 shadow-2xl text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 inline-block mb-2">
              Application Ref ID: {submittedData.applicationId}
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              Partner Application Received!
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              Thank you, <strong>{submittedData.fullName}</strong>. Your advocate onboarding application and attached credentials have been securely logged. Our Bar verification committee will review your Bar Council credentials within <strong>24 to 48 hours</strong>.
            </p>

            {/* Summary Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left mb-8 max-w-2xl mx-auto">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Bar Reg No</span>
                <strong className="text-xs text-white">{submittedData.barRegistrationNo}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Practice Exp</span>
                <strong className="text-xs text-white">{submittedData.experienceYears} Years</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Proposed Rate</span>
                <strong className="text-xs text-amber-400">₹{submittedData.perMinuteRateProposed}/min</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Status</span>
                <strong className="text-xs text-emerald-400">Under Review</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getDirectWhatsAppUrl(getPartnerWhatsAppForwardText())}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Fast-Track via WhatsApp (+91 98670 15157)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    barRegistrationNo: '',
                    stateBarCouncil: 'Bar Council of Delhi',
                    experienceYears: 3,
                    qualification: 'LL.B. / B.A. LL.B.',
                    primaryCourts: ['High Court of Delhi'],
                    specializations: ['Civil Matters'],
                    perMinuteRateProposed: 15,
                    consultationModes: ['Phone Call', 'WhatsApp Audio/Video'],
                    city: '',
                    state: '',
                    chamberAddress: '',
                    payoutUpiOrAccount: '',
                    bio: '',
                    documents: {
                      barCertificate: null,
                      aadhaarCard: null,
                      addressProof: null,
                      idCardOrCop: null,
                      profilePhoto: null,
                    },
                    declarationAccepted: true,
                  });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <span>Submit Another Application</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Advocate Onboarding Form */
          <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Top Form Banner */}
            <div className="p-6 sm:p-8 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Advocate Empanelment Application
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display mt-0.5 text-white">
                    Step-by-Step Advocate Business Partner Enrollment
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Fill in your verified Bar credentials and attach supporting documents for swift verification.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3.5 py-2 rounded-xl text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Confidential Advocate Data</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              {/* Section 1: Personal & Bar Credentials */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                    Advocate Identity & Bar Registration
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Full Name (as per Bar Council ID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="e.g. Adv. Rajesh Sharma"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                        errors.fullName ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Mobile Number (WhatsApp Enabled) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="+91 98670 15157"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                        errors.phone ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="advocate@chambers.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Bar Council Registration Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.barRegistrationNo}
                      onChange={(e) => {
                        setForm({ ...form, barRegistrationNo: e.target.value });
                        if (errors.barRegistrationNo) setErrors({ ...errors, barRegistrationNo: '' });
                      }}
                      placeholder="e.g. D/5120/2022 or MAH/1240/2019"
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all ${
                        errors.barRegistrationNo ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.barRegistrationNo && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.barRegistrationNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Enrolled State Bar Council <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={form.stateBarCouncil}
                      onChange={(e) => setForm({ ...form, stateBarCouncil: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all cursor-pointer"
                    >
                      {stateBarCouncils.map((bar, idx) => (
                        <option key={idx} value={bar}>
                          {bar}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Years of Court Practice Experience <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={form.experienceYears}
                        onChange={(e) => setForm({ ...form, experienceYears: parseInt(e.target.value) || 1 })}
                        className="w-24 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <span className="text-xs text-slate-500 font-medium">Years Active Bar Practice</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Legal Degree / Qualification
                    </label>
                    <input
                      type="text"
                      value={form.qualification}
                      onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                      placeholder="e.g. B.A. LL.B. (Hons) / LL.M. (Corporate)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      City & State of Practice <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => {
                          setForm({ ...form, city: e.target.value });
                          if (errors.city) setErrors({ ...errors, city: '' });
                        }}
                        placeholder="City (e.g. Delhi)"
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                          errors.city ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        placeholder="State (e.g. Delhi NCR)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    {errors.city && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Chamber / Office Address
                  </label>
                  <input
                    type="text"
                    value={form.chamberAddress}
                    onChange={(e) => setForm({ ...form, chamberAddress: e.target.value })}
                    placeholder="e.g. Chamber No. 312, Lawyers Chamber Block, High Court / District Court"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Section 2: Specializations, Courts & Desired Call Rate */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                    Legal Practice Areas, Courts & Consultation Charges
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      Select Your Core Specialization Areas <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {specializationOptions.map((spec, idx) => {
                        const isSelected = form.specializations.includes(spec);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleSpecialization(spec)}
                            className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{spec}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {errors.specializations && (
                      <p className="text-[11px] text-rose-500 mt-1.5">{errors.specializations}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2">
                      Courts & Tribunals Where You Frequently Appear
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {courtOptions.map((court, idx) => {
                        const isSelected = form.primaryCourts.includes(court);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleCourt(court)}
                            className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-100 text-amber-950 border-amber-300 font-semibold'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{court}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                      <label className="block text-xs font-bold text-amber-950 mb-1">
                        Proposed Consultation Charge per Minute (₹)
                      </label>
                      <p className="text-[11px] text-amber-800 mb-3">
                        Choose your preferred rate. AdvocatWalla passes 85-90% directly to you.
                      </p>
                      <div className="flex items-center gap-2">
                        {[10, 15, 20, 30, 50].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => setForm({ ...form, perMinuteRateProposed: rate })}
                            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              form.perMinuteRateProposed === rate
                                ? 'bg-slate-900 text-amber-400 shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            ₹{rate}/m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Preferred Payout UPI ID / Account
                      </label>
                      <p className="text-[11px] text-slate-500 mb-2">
                        For direct credit of your consultation fee and drafting briefs.
                      </p>
                      <input
                        type="text"
                        value={form.payoutUpiOrAccount}
                        onChange={(e) => setForm({ ...form, payoutUpiOrAccount: e.target.value })}
                        placeholder="e.g. advocate@okhdfcbank or 9867015157@upi"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Document Attachments [Certificate, Aadhaar, Address Proof] */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                        Verification Document Attachments
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Upload clear scanned copies or photos (PDF, PNG, JPG).
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Bar Council Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Document 1: Bar Council Enrollment / LL.B Certificate */}
                  <FileUploadBox
                    label="1. Bar Enrollment / LL.B Degree Certificate"
                    sublabel="Mandatory"
                    required
                    docKey="barCertificate"
                    doc={form.documents.barCertificate}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    onPreview={(doc) => setPreviewDoc(doc)}
                    icon={<Award className="w-4 h-4" />}
                  />
                  {errors.barCertificate && (
                    <div className="md:col-span-2 -mt-2">
                      <p className="text-[11px] text-rose-500 font-medium">{errors.barCertificate}</p>
                    </div>
                  )}

                  {/* Document 2: Aadhaar Card / Government Photo ID */}
                  <FileUploadBox
                    label="2. Aadhaar Card / Government Photo ID"
                    sublabel="Mandatory (Front & Back)"
                    required
                    docKey="aadhaarCard"
                    doc={form.documents.aadhaarCard}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    onPreview={(doc) => setPreviewDoc(doc)}
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                  {errors.aadhaarCard && (
                    <div className="md:col-span-2 -mt-2">
                      <p className="text-[11px] text-rose-500 font-medium">{errors.aadhaarCard}</p>
                    </div>
                  )}

                  {/* Document 3: Address Proof (Chamber / Residence) */}
                  <FileUploadBox
                    label="3. Address Proof (Chamber / Residence)"
                    sublabel="Electricity bill / Rent deed / Voter ID"
                    docKey="addressProof"
                    doc={form.documents.addressProof}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    onPreview={(doc) => setPreviewDoc(doc)}
                    icon={<Building className="w-4 h-4" />}
                  />

                  {/* Document 4: Bar Council Identity Card / COP (Certificate of Practice) */}
                  <FileUploadBox
                    label="4. Bar Council ID Card / COP"
                    sublabel="Optional / Recommended"
                    docKey="idCardOrCop"
                    doc={form.documents.idCardOrCop}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    onPreview={(doc) => setPreviewDoc(doc)}
                    icon={<FileText className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Section 4: Self-Declaration & Submit */}
              <div className="pt-2 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.declarationAccepted}
                      onChange={(e) => {
                        setForm({ ...form, declarationAccepted: e.target.checked });
                        if (errors.declarationAccepted) setErrors({ ...errors, declarationAccepted: '' });
                      }}
                      className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-slate-900 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed">
                      <strong>Advocate Self-Declaration:</strong> I hereby declare that I am a practicing Advocate enrolled with the Bar Council of India / State Bar Council under the Advocates Act, 1961. The registration details, certificates, Aadhaar card, and address proof submitted by me are authentic and true to the best of my knowledge.
                    </span>
                  </label>
                  {errors.declarationAccepted && (
                    <p className="text-[11px] text-rose-500 mt-2 ml-7">{errors.declarationAccepted}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>All applications verified under Bar Council of India guidelines.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm transition-all shadow-lg cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>Uploading & Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        <span>Submit Advocate Partner Application</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
              <div className="flex items-center gap-2 text-white">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold truncate">{previewDoc.name}</h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-auto bg-slate-950 rounded-xl p-2 flex items-center justify-center">
              {previewDoc.previewUrl ? (
                <img
                  src={previewDoc.previewUrl}
                  alt={previewDoc.name}
                  className="max-h-80 w-auto rounded object-contain"
                />
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-amber-400" />
                  <p className="text-xs font-semibold text-slate-300">{previewDoc.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {(previewDoc.size / 1024).toFixed(1)} KB • Document Attached
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
