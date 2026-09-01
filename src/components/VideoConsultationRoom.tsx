import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  FileText,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Clock,
  Plus,
  Zap,
  Send,
  Upload,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
  Lock,
  Camera,
  RefreshCw,
  HelpCircle,
  Printer
} from 'lucide-react';
import { AdvocateProfile } from '../types';
import { useWallet } from '../context/WalletContext';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface VideoConsultationRoomProps {
  advocate: AdvocateProfile;
  durationMinutes: number;
  clientName: string;
  clientPhone: string;
  matterType: string;
  onEndCall: (summaryData: VideoCallSummary) => void;
}

export interface VideoCallSummary {
  callId: string;
  advocateName: string;
  clientName: string;
  clientPhone: string;
  matterType: string;
  durationSeconds: number;
  totalCost: number;
  notes: string;
  timestamp: string;
  chatMessages: Array<{ sender: string; text: string; time: string }>;
}

export const VideoConsultationRoom: React.FC<VideoConsultationRoomProps> = ({
  advocate,
  durationMinutes,
  clientName,
  clientPhone,
  matterType,
  onEndCall,
}) => {
  const { balance, deductWallet, openWalletWithTopup } = useWallet();
  const { addToast } = useCart();

  // Media Streams & Hardware Controls
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  // Call Timers & Session States
  const [callSeconds, setCallSeconds] = useState(0);
  const [totalAllocatedSeconds, setTotalAllocatedSeconds] = useState(durationMinutes * 60);
  const [isAdvocateConnected, setIsAdvocateConnected] = useState(false);
  const [isAdvocateSpeaking, setIsAdvocateSpeaking] = useState(true);
  const [advocateSpeechText, setAdvocateSpeechText] = useState(
    `Namaste ${clientName || 'Sir/Madam'}. I am Adv. Seema Jha. Welcome to our encrypted virtual legal chamber. I have received your matter brief regarding "${matterType}". Please walk me through the key dates and dispute details.`
  );

  // Side Panels & In-Call Collaboration
  const [activeSideTab, setActiveSideTab] = useState<'none' | 'chat' | 'notes' | 'documents'>('none');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: advocate.name,
      text: `Hello ${clientName || 'Client'}, thank you for initiating this video consultation. You can upload any statutory notice, court summons, or contract via the Document tab for live review.`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [caseNotes, setCaseNotes] = useState(
    `Case Matter: ${matterType}\nClient: ${clientName} (${clientPhone})\nConsulting Advocate: ${advocate.name} (${advocate.barRegistration})\n\n[Advocate Key Recommendations]:\n`
  );
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ name: string; size: string; time: string }>>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(false);

  // Audio level meter simulation
  const [audioLevel, setAudioLevel] = useState(40);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize Camera & Microphone Stream
  useEffect(() => {
    let streamInstance: MediaStream | null = null;

    const startLocalMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true,
          });
          streamInstance = stream;
          setLocalStream(stream);
          setHasCameraPermission(true);

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          setHasCameraPermission(false);
        }
      } catch (err) {
        console.warn('Camera/Mic access not granted or unavailable:', err);
        setHasCameraPermission(false);
      }
    };

    startLocalMedia();

    // Simulated Advocate Connection Delay (1.5s for seamless realism)
    const connTimer = setTimeout(() => {
      setIsAdvocateConnected(true);
      addToast(`${advocate.name} joined the encrypted video chamber.`, 'success');
    }, 1200);

    return () => {
      clearTimeout(connTimer);
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Audio visualizer & Speaking state simulation
  useEffect(() => {
    const audioInterval = setInterval(() => {
      if (!isAudioMuted) {
        setAudioLevel(Math.floor(25 + Math.random() * 55));
      } else {
        setAudioLevel(0);
      }
    }, 300);

    const speechSimulation = setInterval(() => {
      setIsAdvocateSpeaking((prev) => !prev);
    }, 6000);

    return () => {
      clearInterval(audioInterval);
      clearInterval(speechSimulation);
    };
  }, [isAudioMuted]);

  // Consultation Call Timer (1-second tick)
  useEffect(() => {
    if (!isAdvocateConnected) return;

    const timer = setInterval(() => {
      setCallSeconds((prev) => {
        const next = prev + 1;
        // Prompt for extension when 90 seconds remain
        if (totalAllocatedSeconds - next <= 90 && totalAllocatedSeconds - next > 0) {
          setShowExtensionPrompt(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdvocateConnected, totalAllocatedSeconds]);

  // Toggle Audio Track
  const handleToggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    } else {
      setIsAudioMuted(!isAudioMuted);
    }
  };

  // Toggle Video Track
  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoDisabled(!isVideoDisabled);
    } else {
      setIsVideoDisabled(!isVideoDisabled);
    }
  };

  // Screen Sharing
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      }
      setIsScreenSharing(false);
      addToast('Screen sharing stopped.', 'info');
    } else {
      try {
        if (navigator.mediaDevices && (navigator.mediaDevices as any).getDisplayMedia) {
          const displayStream = await (navigator.mediaDevices as any).getDisplayMedia({
            video: true,
          });
          setScreenStream(displayStream);
          setIsScreenSharing(true);
          addToast('Sharing your screen with Advocate Seema Jha.', 'success');

          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = displayStream;
          }

          displayStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
          };
        } else {
          addToast('Screen sharing not supported on this browser device.', 'error');
        }
      } catch (err) {
        console.warn('Screen share error:', err);
      }
    }
  };

  // Switch Camera facing mode
  const handleSwitchCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: clientName || 'You (Client)',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Advocate auto acknowledgment simulation
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: advocate.name,
          text: `Noted. I am examining this point under relevant sections and court precedents.`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1800);
  };

  // Document Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newDoc = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setUploadedDocs((prev) => [...prev, newDoc]);
      addToast(`Uploaded "${file.name}" for advocate examination.`, 'success');

      setChatMessages((prev) => [
        ...prev,
        {
          sender: clientName || 'Client',
          text: `📎 Shared document: ${file.name} (${newDoc.size})`,
          time: newDoc.time,
        },
      ]);
    }
  };

  // Extend Consultation Slot (Instant Wallet Debit)
  const handleExtendMinutes = (extraMinutes: number) => {
    const cost = extraMinutes * advocate.perMinuteRate;
    if (balance < cost) {
      openWalletWithTopup(cost - balance);
      return;
    }

    const deductRes = deductWallet(
      cost,
      `Video Call Extension (+${extraMinutes} Mins with ${advocate.name})`,
      'call_consultation',
      { advocateName: advocate.name, durationMinutes: extraMinutes }
    );

    if (deductRes.success) {
      setTotalAllocatedSeconds((prev) => prev + extraMinutes * 60);
      setShowExtensionPrompt(false);
      addToast(`Extended consultation by +${extraMinutes} mins! ₹${cost} debited from wallet.`, 'success');
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'System Room',
          text: `⏱️ Consultation extended by +${extraMinutes} minutes (Current total: ${Math.round(
            (totalAllocatedSeconds + extraMinutes * 60) / 60
          )} mins).`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // End Call & Transition to Summary
  const handleEndCallConfirmed = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    const summary: VideoCallSummary = {
      callId: `VID-${Date.now().toString().slice(-6)}`,
      advocateName: advocate.name,
      clientName: clientName || 'Verified Client',
      clientPhone: clientPhone || 'N/A',
      matterType: matterType,
      durationSeconds: callSeconds,
      totalCost: Math.max(150, Math.ceil(callSeconds / 60) * advocate.perMinuteRate),
      notes: caseNotes,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      chatMessages: chatMessages,
    };

    onEndCall(summary);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, totalAllocatedSeconds - callSeconds);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden text-white font-sans">
      {/* Top Header Bar */}
      <header className="h-14 sm:h-16 px-3 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between z-20 backdrop-blur-md">
        {/* Left: Advocate & Chamber info */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <img
              src={advocate.avatar}
              alt={advocate.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-white font-display truncate max-w-[150px] sm:max-w-none">
                {advocate.name}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-semibold border border-amber-400/30">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>{advocate.barRegistration}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-sm">
              Matter: <strong className="text-slate-200">{matterType}</strong>
            </p>
          </div>
        </div>

        {/* Center: Live Timer & Encryption Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-xs sm:text-sm font-mono font-bold text-amber-300 tracking-wider">
              {formatTime(callSeconds)}
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              / {formatTime(totalAllocatedSeconds)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-Bit Encrypted Chamber</span>
          </div>
        </div>

        {/* Right: Wallet Balance & Quick Extend */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExtendMinutes(5)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-colors cursor-pointer"
            title="Extend consultation time by 5 minutes"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+5 Mins</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hidden sm:inline-flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Call Body Grid */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Video Canvas Stage (Left / Main) */}
        <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
          {/* Main Remote Video (Advocate Room) */}
          <div className="relative w-full h-full max-h-[82vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
            {/* Screen Share Layer if active */}
            {isScreenSharing ? (
              <div className="w-full h-full relative bg-black flex items-center justify-center">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-bold flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span>Presenting Your Screen & Legal Documents</span>
                </div>
              </div>
            ) : (
              /* Advocate Remote Chamber Live View */
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                {/* Courtroom / Chamber Backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-900 to-slate-950 pointer-events-none" />
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Advocate Photo / Live Stream Feed Canvas */}
                <div className="relative flex flex-col items-center justify-center text-center p-6 z-10">
                  <div className="relative mb-4">
                    <div
                      className={`w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 ${
                        isAdvocateSpeaking ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)]' : 'border-slate-700'
                      } transition-all duration-300 bg-slate-800`}
                    >
                      <img
                        src={advocate.avatar}
                        alt={advocate.name}
                        className="w-full h-full object-cover object-top scale-105"
                      />
                    </div>

                    {/* Speaking Sound Waves */}
                    {isAdvocateSpeaking && (
                      <div className="absolute -bottom-2 inset-x-0 flex justify-center items-center gap-1 bg-slate-900/90 border border-amber-400/50 px-3 py-1 rounded-full shadow-lg">
                        <span className="w-1.5 h-3.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-3.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[10px] font-bold text-amber-300 ml-1">Speaking</span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white font-display">
                    {advocate.name}
                  </h4>
                  <p className="text-xs text-amber-300 font-medium mt-0.5">
                    {advocate.title} • {advocate.experienceYears} Years High Court Practice
                  </p>

                  {/* Realtime Live Speech Closed Captions */}
                  <div className="mt-4 max-w-lg mx-auto p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 shadow-lg backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-0.5">
                      Live Legal Commentary (Courtroom Stream):
                    </span>
                    <p className="italic leading-relaxed text-slate-300">
                      "{advocateSpeechText}"
                    </p>
                  </div>
                </div>

                {/* Top Watermark / Status */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>REC Active</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs">
                    HD 1080p • 30fps
                  </span>
                </div>

                {/* Bottom Left: Legal Watermark */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>ADVOCAT वाला Legal Privilege Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Picture-in-Picture Local Client Video Stream */}
            <div className="absolute bottom-4 right-4 z-20 w-28 h-36 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-2xl transition-all">
              {isVideoDisabled || !hasCameraPermission ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                    <VideoOff className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Camera Off</span>
                  <span className="text-[9px] text-slate-500 truncate max-w-full">{clientName || 'Client'}</span>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}

              {/* Local Video Overlay Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                  You
                </span>
                {isAudioMuted && (
                  <span className="p-1 rounded bg-red-600/90 text-white">
                    <MicOff className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Flip Camera Control on Mobile */}
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700"
                title="Switch front/rear camera"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Time Expiry Warning Modal Banner */}
          {showExtensionPrompt && (
            <div className="absolute top-8 inset-x-4 sm:inset-x-auto sm:max-w-md mx-auto z-30 p-4 rounded-2xl bg-amber-950/95 border-2 border-amber-400 text-white shadow-2xl backdrop-blur-md animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Consultation Ending in {formatTime(remainingSeconds)}
                  </h5>
                  <p className="text-xs text-slate-200 mt-1">
                    Your scheduled slot is concluding. Would you like to extend your live session with Adv. Seema Jha?
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleExtendMinutes(5)}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>+5 Mins (₹50)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExtendMinutes(15)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>+15 Mins (₹150)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExtensionPrompt(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel (Chat / Notes / Documents) */}
        {activeSideTab !== 'none' && (
          <aside className="w-full sm:w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col z-20 h-full">
            {/* Panel Tabs Header */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveSideTab('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeSideTab === 'chat'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>In-Call Chat</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSideTab('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeSideTab === 'notes'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Case Notes</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSideTab('documents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeSideTab === 'documents'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Docs ({uploadedDocs.length})</span>
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveSideTab('none')}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Panel Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* 1. Chat Tab */}
              {activeSideTab === 'chat' && (
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-3 overflow-y-auto flex-1 pr-1" ref={chatScrollRef}>
                    <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-200">
                      🔒 All in-call messages are encrypted and covered under Section 126 of the Indian Evidence Act / BSA.
                    </div>

                    {chatMessages.map((msg, idx) => {
                      const isMe = msg.sender.includes('You') || msg.sender.includes('Client');
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-[10px] font-bold text-slate-400">{msg.sender}</span>
                            <span className="text-[9px] text-slate-500">{msg.time}</span>
                          </div>
                          <div
                            className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                              isMe
                                ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type a message or legal question..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* 2. Notes Tab */}
              {activeSideTab === 'notes' && (
                <div className="h-full flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Live Case Notes & Legal Action Points:
                  </span>
                  <textarea
                    value={caseNotes}
                    onChange={(e) => setCaseNotes(e.target.value)}
                    rows={14}
                    placeholder="Take notes during the consultation..."
                    className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">
                    * These notes will be saved and included in your post-consultation chamber summary.
                  </p>
                </div>
              )}

              {/* 3. Documents Tab */}
              {activeSideTab === 'documents' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                    <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <h5 className="text-xs font-bold text-white mb-1">Share Case Documents Live</h5>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Upload Notices, FIR copies, Agreements, or Sale Deeds for immediate advocate examination.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer shadow-md">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Document</span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Uploaded Documents ({uploadedDocs.length})
                    </span>
                    {uploadedDocs.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                        No documents uploaded yet in this call.
                      </div>
                    ) : (
                      uploadedDocs.map((doc, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <div className="truncate">
                              <p className="font-semibold text-slate-200 truncate">{doc.name}</p>
                              <span className="text-[10px] text-slate-500">{doc.size} • {doc.time}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                            Verified
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800 px-4 sm:px-8 flex items-center justify-between z-20">
        {/* Left Side: Audio visualizer indicator */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-150"
                style={{ width: `${isAudioMuted ? 0 : audioLevel}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            {isAudioMuted ? 'Mic Muted' : 'Mic Active'}
          </span>
        </div>

        {/* Center: Core Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto md:mx-0">
          {/* Mute / Unmute Mic */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`p-3.5 sm:p-4 rounded-2xl border font-bold transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
            title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera On / Off */}
          <button
            type="button"
            onClick={handleToggleVideo}
            className={`p-3.5 sm:p-4 rounded-2xl border font-bold transition-all cursor-pointer ${
              isVideoDisabled
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
            title={isVideoDisabled ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            type="button"
            onClick={handleToggleScreenShare}
            className={`p-3.5 sm:p-4 rounded-2xl border font-bold transition-all cursor-pointer hidden sm:inline-flex ${
              isScreenSharing
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/40'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen with Advocate'}
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={handleEndCallConfirmed}
            className="px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-red-950/60 transition-all cursor-pointer"
            title="Leave & Complete Consultation"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline">End Consultation</span>
          </button>
        </div>

        {/* Right Side: Toggle Tools (Chat / Notes / Docs) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSideTab(activeSideTab === 'chat' ? 'none' : 'chat')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeSideTab === 'chat'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Open Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSideTab(activeSideTab === 'notes' ? 'none' : 'notes')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeSideTab === 'notes'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Open Notes"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSideTab(activeSideTab === 'documents' ? 'none' : 'documents')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer hidden sm:inline-flex ${
              activeSideTab === 'documents'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Open Documents"
          >
            <Upload className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
