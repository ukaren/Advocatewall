import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Printer, 
  Send, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Download,
  BookOpen,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { LEGAL_NOTICE_TEMPLATES, LegalNoticeTemplate } from '../data/legalDraftTemplates';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface LegalNoticeGeneratorSectionProps {
  onOpenCallModal?: () => void;
  onShowToast?: (message: string) => void;
}

export const LegalNoticeGeneratorSection: React.FC<LegalNoticeGeneratorSectionProps> = ({
  onOpenCallModal,
  onShowToast
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LegalNoticeTemplate>(LEGAL_NOTICE_TEMPLATES[0]);
  const [fields, setFields] = useState<any>({ ...LEGAL_NOTICE_TEMPLATES[0].defaultFields });
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleSelectTemplate = (tmpl: LegalNoticeTemplate) => {
    setSelectedTemplate(tmpl);
    setFields({ ...tmpl.defaultFields });
    setAiAnalysis(null);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev: any) => ({ ...prev, [key]: value }));
  };

  const generatedNoticeText = selectedTemplate.sampleDraftGenerator(fields);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedNoticeText);
      setCopied(true);
      if (onShowToast) onShowToast('Legal Notice draft copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = generatedNoticeText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      if (onShowToast) onShowToast('Legal Notice draft copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedTemplate.title} - Draft</title>
          <style>
            body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; color: #111; font-size: 14pt; }
            pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; word-break: break-word; }
            h1 { font-size: 16pt; text-align: center; text-transform: uppercase; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <pre>${generatedNoticeText}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const handleAiRefine = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/legal-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Review and enhance the legal demand clauses for a ${selectedTemplate.title}. Sender: ${fields.senderName}, Recipient: ${fields.recipientName}, Claim/Transaction: ${fields.amountOrSubject}, Default details: ${fields.reasonOrDefault}. Provide key strategic statutory clauses and advice.`,
          taskType: 'draft_notice',
          contextData: { template: selectedTemplate.title, governingAct: selectedTemplate.governingAct }
        }),
      });
      const data = await response.json();
      if (data.answer) {
        setAiAnalysis(data.answer);
        if (onShowToast) onShowToast('AI Legal Review generated successfully!');
      }
    } catch (e: any) {
      console.warn('AI assist error:', e);
      setAiAnalysis('Statutory demand checklist: Ensure 15-day statutory window is calculated from date of delivery acknowledgment. Retain postal speed post receipt with Indian Post tracking log.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section id="notice-generator" className="py-16 md:py-20 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Court-Ready Statutory Notices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Instant <span className="text-amber-600">Legal Notice & Draft</span> Generator
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Generate compliant statutory demand notices for Cheque Bounce, Tenancy Eviction, Consumer Deficiency, and Government recovery under Section 138 NI Act, Section 106 TP Act, and Section 80 CPC.
          </p>
        </div>

        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none justify-start md:justify-center">
          {LEGAL_NOTICE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tmpl.title}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tmpl.statutoryDays} Days
                </span>
              </button>
            );
          })}
        </div>

        {/* Two Column Layout: Editor Form on Left, Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Form Controls */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">{selectedTemplate.category}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedTemplate.title}</h3>
              </div>
              <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                {selectedTemplate.statutoryDays}-Day Notice
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Sender Details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Sender / Complainant Name & Designation
                </label>
                <input
                  type="text"
                  value={fields.senderName || ''}
                  onChange={(e) => handleFieldChange('senderName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sender Complete Address & City
                </label>
                <input
                  type="text"
                  value={fields.senderAddress || ''}
                  onChange={(e) => handleFieldChange('senderAddress', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Recipient Details */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Recipient / Accused / Opposite Party
                </label>
                <input
                  type="text"
                  value={fields.recipientName || ''}
                  onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Full Address
                </label>
                <input
                  type="text"
                  value={fields.recipientAddress || ''}
                  onChange={(e) => handleFieldChange('recipientAddress', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Transaction & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Transaction / Cheque
                  </label>
                  <input
                    type="text"
                    value={fields.dateOfTransaction || ''}
                    onChange={(e) => handleFieldChange('dateOfTransaction', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount / Subject Claim
                  </label>
                  <input
                    type="text"
                    value={fields.amountOrSubject || ''}
                    onChange={(e) => handleFieldChange('amountOrSubject', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Specific fields if Cheque Bounce */}
              {selectedTemplate.id === 'sec-138-ni-act' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Cheque Number
                    </label>
                    <input
                      type="text"
                      value={fields.chequeNumber || ''}
                      onChange={(e) => handleFieldChange('chequeNumber', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Drawee Bank & Branch
                    </label>
                    <input
                      type="text"
                      value={fields.chequeBank || ''}
                      onChange={(e) => handleFieldChange('chequeBank', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Grounds / Reason for default */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cause of Action / Reason of Default
                </label>
                <textarea
                  rows={2}
                  value={fields.reasonOrDefault || ''}
                  onChange={(e) => handleFieldChange('reasonOrDefault', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Specific Demand */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Demand / Statutory Clause
                </label>
                <textarea
                  rows={2}
                  value={fields.specificDemand || ''}
                  onChange={(e) => handleFieldChange('specificDemand', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Actions Button Row */}
              <div className="pt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiRefine}
                  disabled={isAiLoading}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAiLoading ? 'Analyzing Clauses...' : 'AI Legal Review & Guidance'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFields({ ...selectedTemplate.defaultFields })}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* AI Guidance Box */}
              {aiAnalysis && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Advocate Strategy & Statutory Advice</span>
                  </div>
                  <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">{aiAnalysis}</p>
                </div>
              )}

            </div>
          </div>

          {/* Right: Live Court-Ready Notice Draft Preview */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden sticky top-24">
              
              {/* Draft Header Toolbar */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs sm:text-sm">Live Court Notice Preview</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {selectedTemplate.governingAct}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* Formatted Paper Notice Sheet */}
              <div className="p-6 sm:p-8 bg-[#fdfcf9] font-serif text-slate-900 text-xs sm:text-sm leading-relaxed max-h-[580px] overflow-y-auto border-b border-slate-200 select-text">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-center font-bold uppercase tracking-wide border-b-2 border-slate-900 pb-2 text-xs sm:text-sm">
                    {selectedTemplate.title}
                  </div>

                  <div className="flex justify-between text-xs text-slate-600 font-sans">
                    <span>MODE: REGISTERED POST A.D. / SPEED POST</span>
                    <span>DATE: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                  </div>

                  <pre className="whitespace-pre-wrap font-serif text-xs sm:text-sm text-slate-900 leading-relaxed break-words font-normal">
                    {generatedNoticeText}
                  </pre>
                </div>
              </div>

              {/* Bottom Notice Dispatch & Advocate Issuance Card */}
              <div className="p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600 text-center sm:text-left">
                  Need this notice officially drafted, vetted & dispatched on <span className="font-bold text-slate-900">Advocate Letterhead with Postal Tracking</span>?
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={getDirectWhatsAppUrl(`Hello Advocate,\nI have drafted a ${selectedTemplate.title} for ${fields.amountOrSubject || 'my dispute'}. Please vet and issue this on official Advocate Letterhead.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send for Advocate Vetting</span>
                  </a>

                  <button
                    onClick={onOpenCallModal}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold text-xs transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call ₹10/min</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
