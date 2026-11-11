import React, { useState, useEffect } from 'react';
import {
  X,
  Workflow,
  PhoneCall,
  Activity,
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  Check,
  Server,
  Layers,
  Radio,
  Clock,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Code
} from 'lucide-react';
import { testN8NWebhook, getTelephonyConfig, getTelephonyLogs } from '../utils/telephony';
import { BUSINESS_CONFIG } from '../data/config';

interface N8NTelephonyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const N8NTelephonyModal: React.FC<N8NTelephonyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'webhook' | 'telephony' | 'logs'>('webhook');
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return (
      localStorage.getItem('n8n_telephony_webhook_url') ||
      BUSINESS_CONFIG.n8nBookConsultationWebhookUrl ||
      'https://sneha92.app.n8n.cloud/webhook/advocatewalla-book-consultation'
    );
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [serverConfig, setServerConfig] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'n8n_webhook' | 'exotel' | 'twilio'>('n8n_webhook');

  useEffect(() => {
    if (isOpen) {
      loadServerConfig();
      fetchLogs();
    }
  }, [isOpen]);

  const loadServerConfig = async () => {
    const config = await getTelephonyConfig();
    setServerConfig(config);
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const data = await getTelephonyLogs();
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('n8n_telephony_webhook_url', webhookUrl);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      handleSaveWebhook();
      const res = await testN8NWebhook(webhookUrl.trim());
      setTestResult(res);
      fetchLogs();
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || 'Failed to ping n8n' });
    } finally {
      setIsTesting(false);
    }
  };

  const samplePayload = {
    event: "instant_call_trigger",
    timestamp: "2026-08-22T10:30:00.000Z",
    source: "Advocate Legal Portal",
    callDetails: {
      clientName: "Rahul Sharma",
      clientPhone: "+91 98670 15157",
      advocateName: "Advocate Seema Jha",
      advocatePhone: "+91 98670 15157",
      durationMinutes: 15,
      ratePerMinute: 10,
      totalCost: 149,
      matterCategory: "Civil / Property Dispute"
    },
    telephonyAction: {
      action: "bridge_call",
      from: "+91 98670 15157",
      to: "+91 98670 15157",
      recordCall: true
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="n8n-telephony-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  n8n & Telephony Integration
                </h3>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated call triggers, CRM syncing & telephony workflow dispatcher
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('webhook')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'webhook'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>n8n Webhook</span>
          </button>

          <button
            onClick={() => setActiveTab('telephony')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'telephony'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Telephony Providers</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('logs');
              fetchLogs();
            }}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-amber-500 text-slate-950'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Dispatch Logs</span>
            {logs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800 font-bold">
                {logs.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: n8n Webhook Setup */}
        {activeTab === 'webhook' && (
          <div className="p-5 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
              <Workflow className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                <strong>How n8n Telephony Works:</strong> Whenever a client clicks <em>"Call Adv. Seema Jha"</em> or books a consultation, this portal dispatches a structured JSON payload to your n8n Webhook. Your n8n workflow can automatically trigger outbound calling (Exotel/Twilio/Asterisk), send WhatsApp/SMS notifications, and add leads to Google Sheets or Notion.
              </div>
            </div>

            {/* Active n8n Webhook Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Configured n8n Webhook Pipelines
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Payment & Booking */}
                <button
                  type="button"
                  onClick={() => setWebhookUrl('https://sneha92.app.n8n.cloud/webhook/advocatewalla-book-consultation')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    webhookUrl === 'https://sneha92.app.n8n.cloud/webhook/advocatewalla-book-consultation'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">💳 Payment & Booking</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-mono">
                    advocatewalla-book-consultation
                  </p>
                </button>

                {/* 2. Video Calling Token */}
                <button
                  type="button"
                  onClick={() => setWebhookUrl('https://sneha92.app.n8n.cloud/webhook/advocatewalla-video-token')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    webhookUrl === 'https://sneha92.app.n8n.cloud/webhook/advocatewalla-video-token'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">📹 Video Calling Token</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-mono">
                    advocatewalla-video-token
                  </p>
                </button>

                {/* 3. AI Chatbot */}
                <button
                  type="button"
                  onClick={() => setWebhookUrl('https://sneha92.app.n8n.cloud/webhook/f34dd539-a2e0-4b4f-9088-19a6dd29d389/chat')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    webhookUrl === 'https://sneha92.app.n8n.cloud/webhook/f34dd539-a2e0-4b4f-9088-19a6dd29d389/chat'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">💬 Legal AI Chat Bot</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-mono">
                    .../chat
                  </p>
                </button>
              </div>
            </div>

            {/* Webhook URL Input & Test Ping */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Target n8n Webhook URL to Test or Customize
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  placeholder="https://n8n.yourdomain.com/webhook/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-mono"
                />
                <button
                  onClick={handleTestWebhook}
                  disabled={isTesting || !webhookUrl.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Test Webhook Ping</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Persistence: Stored in browser storage and dispatched automatically across booking, video calling, and consultation events.
              </p>
            </div>

            {/* Test Ping Result Banner */}
            {testResult && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm flex flex-col gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Success: n8n Webhook Responded ({testResult.durationMs}ms)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Failed to reach n8n Webhook</span>
                    </>
                  )}
                </div>
                <p className="text-xs opacity-90">{testResult.message || testResult.error}</p>
                {testResult.responseData && (
                  <pre className="p-2.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] overflow-x-auto mt-1">
                    {JSON.stringify(testResult.responseData, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Sample Payload Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dispatched JSON Payload Schema</span>
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(samplePayload, null, 2))}
                  className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
                {JSON.stringify(samplePayload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Telephony Providers Setup */}
        {activeTab === 'telephony' && (
          <div className="p-5 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Supported Telephony Architectures</h4>
              
              {/* Option 1: n8n Automated Bridge */}
              <div
                onClick={() => setSelectedProvider('n8n_webhook')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedProvider === 'n8n_webhook'
                    ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">n8n Custom Telephony Workflow (Recommended)</h5>
                      <p className="text-xs text-slate-500">Connect with any SIP, Exotel, Twilio, Asterisk or WhatsApp Call API</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              </div>

              {/* Option 2: Exotel Click-to-Call */}
              <div
                onClick={() => setSelectedProvider('exotel')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedProvider === 'exotel'
                    ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-900 text-blue-300 flex items-center justify-center font-bold">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Exotel India Telephony Bridge</h5>
                      <p className="text-xs text-slate-500">Direct PSTN calling between client mobile and Adv. Seema Jha</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">
                    Ready
                  </span>
                </div>
              </div>

              {/* Option 3: Twilio Voice */}
              <div
                onClick={() => setSelectedProvider('twilio')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedProvider === 'twilio'
                    ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300/40'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-900 text-rose-300 flex items-center justify-center font-bold">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Twilio Programmable Voice</h5>
                      <p className="text-xs text-slate-500">Global VoIP, call recording and IVR routing</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600">
                    Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Advocate Chamber Specs */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Active Advocate Telephony Endpoint</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                <div>Counsel: <strong className="text-white">Advocate Seema Jha</strong></div>
                <div>Practice: <strong className="text-white">4 Years Experience (B.A. LL.B.)</strong></div>
                <div>Per Minute Fee: <strong className="text-amber-300">₹10 / Minute</strong></div>
                <div>Chamber Line: <strong className="text-white">+91 98670 15157</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Real-Time Event Logs */}
        {activeTab === 'logs' && (
          <div className="p-5 sm:p-7 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Recent Telephony & Webhook Events</span>
                <span className="text-xs text-slate-500 font-normal">({logs.length} logged)</span>
              </h4>
              <button
                onClick={fetchLogs}
                className="text-xs text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No calls or webhooks dispatched yet.</p>
                <p className="text-[11px] text-slate-400">Trigger a call test in the "n8n Webhook" tab.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.clientName}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{log.clientPhone}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'success' || log.status === 'dispatched'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'simulated'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                      <span>Counsel: <strong>{log.advocateName}</strong></span>
                      {log.durationMinutes && <span>Duration: <strong>{log.durationMinutes} mins</strong></span>}
                      {log.totalCost && <span>Amount: <strong className="text-amber-700">₹{log.totalCost}</strong></span>}
                      <span>Provider: <code className="font-mono bg-slate-100 px-1 py-0.2 rounded">{log.provider}</code></span>
                    </div>

                    {log.details && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 font-mono break-all">
                        {log.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>Backend Server Active on port 3000</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
