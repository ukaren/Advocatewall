import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow JSON body up to 25MB for document attachments
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// In-memory partner applications store
interface PartnerApplicationRecord {
  id: string;
  applicationId: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'verified' | 'active';
  fullName: string;
  email: string;
  phone: string;
  barRegistrationNo: string;
  stateBarCouncil: string;
  experienceYears: number;
  qualification: string;
  primaryCourts: string[];
  specializations: string[];
  perMinuteRateProposed: number;
  consultationModes: string[];
  city: string;
  state: string;
  chamberAddress: string;
  payoutUpiOrAccount: string;
  bio: string;
  documentsSummary: {
    barCertificate: { name: string; size: number; type: string } | null;
    aadhaarCard: { name: string; size: number; type: string } | null;
    addressProof: { name: string; size: number; type: string } | null;
    idCardOrCop: { name: string; size: number; type: string } | null;
    profilePhoto: { name: string; size: number; type: string } | null;
  };
}

const partnerApplications: PartnerApplicationRecord[] = [];

// N8N Webhook endpoints configured for ADVOCAT WALLA
const DEFAULT_CHAT_WEBHOOK = "https://sneha92.app.n8n.cloud/webhook/e4b448fe-d0a3-4afa-be23-de6261832b21/chat";
const DEFAULT_VIDEO_TOKEN_WEBHOOK = "https://sneha92.app.n8n.cloud/webhook/advocatewalla-video-token";
const DEFAULT_BOOK_CONSULTATION_WEBHOOK = "https://sneha92.app.n8n.cloud/webhook/advocatewalla-book-consultation";

// In-memory log of telephony & n8n webhook events for real-time visibility
interface TelephonyLog {
  id: string;
  timestamp: string;
  type: 'call_trigger' | 'scheduled_booking' | 'enquiry' | 'n8n_test' | 'inbound_webhook' | 'video_token' | 'payment_booking';
  clientName: string;
  clientPhone: string;
  advocateName: string;
  durationMinutes?: number;
  totalCost?: number;
  matterCategory?: string;
  status: 'dispatched' | 'success' | 'failed' | 'simulated';
  provider: string;
  n8nStatus?: number | string;
  details?: string;
  responsePayload?: any;
}

const telephonyLogs: TelephonyLog[] = [];

// Helper to push logs with limit
function logTelephonyEvent(log: Omit<TelephonyLog, 'id' | 'timestamp'>) {
  const newLog: TelephonyLog = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...log,
  };
  telephonyLogs.unshift(newLog);
  if (telephonyLogs.length > 50) telephonyLogs.pop();
  return newLog;
}

// 1. Health & Configuration endpoint
app.get("/api/telephony/config", (req, res) => {
  const n8nWebhookConfigured = Boolean(process.env.N8N_WEBHOOK_URL || DEFAULT_BOOK_CONSULTATION_WEBHOOK);
  const telephonyProvider = process.env.TELEPHONY_PROVIDER || "n8n_webhook";
  
  res.json({
    status: "ok",
    n8nWebhookConfigured,
    n8nChatWebhookUrl: process.env.N8N_CHAT_WEBHOOK_URL || DEFAULT_CHAT_WEBHOOK,
    n8nVideoTokenWebhookUrl: process.env.N8N_VIDEO_TOKEN_URL || DEFAULT_VIDEO_TOKEN_WEBHOOK,
    n8nBookConsultationWebhookUrl: process.env.N8N_BOOK_CONSULTATION_URL || DEFAULT_BOOK_CONSULTATION_WEBHOOK,
    telephonyProvider,
    supportedProviders: ["n8n_webhook", "exotel", "twilio", "custom_webhook"],
    activeAdvocate: "Advocate Seema Jha",
    ratePerMinute: 10,
    features: {
      instantCallBridge: true,
      n8nWorkflowTrigger: true,
      videoCallingToken: true,
      paymentConsultationBooking: true,
      smsWhatsAppDispatch: true,
      callLogging: true,
    }
  });
});

// 2. Trigger Telephony / n8n Call Bridge
app.post("/api/telephony/trigger-call", async (req, res) => {
  try {
    const {
      clientName,
      clientPhone,
      advocateName = "Advocate Seema Jha",
      advocatePhone = "+919876543210",
      durationMinutes = 15,
      totalCost = 149,
      matterCategory = "General Legal Consultation",
      callType = "instant_phone",
      notes = "",
      customN8nUrl = ""
    } = req.body;

    if (!clientName || !clientPhone) {
      return res.status(400).json({ error: "clientName and clientPhone are required." });
    }

    const targetWebhook = customN8nUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_BOOK_CONSULTATION_WEBHOOK;
    const provider = targetWebhook ? "n8n_webhook" : (process.env.TELEPHONY_PROVIDER || "telephony_bridge");

    const payload = {
      event: callType === "instant_phone" ? "instant_call_trigger" : "consultation_scheduled",
      timestamp: new Date().toISOString(),
      source: "Advocate Seema Jha Legal Portal",
      callDetails: {
        clientName,
        clientPhone,
        advocateName,
        advocatePhone,
        durationMinutes,
        ratePerMinute: 10,
        totalCost,
        matterCategory,
        callType,
        notes,
      },
      telephonyAction: {
        action: "bridge_call",
        from: clientPhone,
        to: advocatePhone,
        recordCall: true,
        maxDurationSeconds: durationMinutes * 60,
      }
    };

    let webhookResponseStatus = "simulated_success";
    let webhookResponseData: any = null;

    if (targetWebhook) {
      try {
        const response = await fetch(targetWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Advocate-Legal-Telephony/1.0",
          },
          body: JSON.stringify(payload),
        });

        webhookResponseStatus = response.ok ? `HTTP ${response.status} OK` : `HTTP ${response.status} Error`;
        try {
          webhookResponseData = await response.json();
        } catch {
          webhookResponseData = { statusText: response.statusText };
        }
      } catch (err: any) {
        console.warn("N8N Webhook dispatch warning:", err.message);
        webhookResponseStatus = `Error: ${err.message}`;
      }
    }

    const logEntry = logTelephonyEvent({
      type: callType === "instant_phone" ? "call_trigger" : "scheduled_booking",
      clientName,
      clientPhone,
      advocateName,
      durationMinutes,
      totalCost,
      matterCategory,
      status: targetWebhook ? "dispatched" : "simulated",
      provider,
      n8nStatus: webhookResponseStatus,
      details: targetWebhook ? `Dispatched to n8n webhook: ${targetWebhook}` : "Telephony bridge simulation (Configure N8N_WEBHOOK_URL for live outbound call routing)",
      responsePayload: webhookResponseData,
    });

    res.json({
      success: true,
      message: `Call bridge initiated for ${clientName} with ${advocateName}`,
      callId: logEntry.id,
      provider,
      n8nWebhookTriggered: Boolean(targetWebhook),
      n8nStatus: webhookResponseStatus,
      clientPhone,
      advocatePhone,
      durationMinutes,
      totalCost,
    });
  } catch (error: any) {
    console.error("Error triggering telephony call:", error);
    res.status(500).json({ error: error.message || "Failed to trigger telephony call." });
  }
});

// 3. Test n8n Webhook Endpoint
app.post("/api/telephony/test-n8n", async (req, res) => {
  try {
    const { webhookUrl, testType = "ping" } = req.body;
    const targetUrl = webhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_BOOK_CONSULTATION_WEBHOOK;

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        error: "No N8N Webhook URL provided. Please provide a webhook URL to test.",
      });
    }

    const testPayload = {
      event: testType === "video" ? "test_video_token_ping" : "test_n8n_telephony_ping",
      timestamp: new Date().toISOString(),
      message: "Advocate Legal Portal Telephony Integration Ping",
      portal: {
        advocate: "Advocate Seema Jha",
        experience: "4 Years B.A. LL.B.",
        rate: "₹10/min",
      },
      sampleCall: {
        clientName: "Rahul Sharma",
        clientPhone: "+919812345678",
        matterCategory: "Property Dispute Consultation",
        durationMinutes: 15,
        totalCost: 150,
      }
    };

    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Advocate-Legal-Portal-N8N-Tester/1.0",
      },
      body: JSON.stringify(testPayload),
    });
    const durationMs = Date.now() - startTime;

    let responseData: any = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = { status: response.status, statusText: response.statusText };
    }

    logTelephonyEvent({
      type: "n8n_test",
      clientName: "Test Lead (Rahul Sharma)",
      clientPhone: "+919812345678",
      advocateName: "Advocate Seema Jha",
      durationMinutes: 15,
      totalCost: 150,
      status: response.ok ? "success" : "failed",
      provider: "n8n_webhook",
      n8nStatus: `HTTP ${response.status}`,
      details: `Test payload delivered to ${targetUrl} in ${durationMs}ms`,
      responsePayload: responseData,
    });

    res.json({
      success: response.ok,
      httpStatus: response.status,
      durationMs,
      targetUrl,
      message: response.ok ? "n8n Webhook responded successfully!" : `n8n returned HTTP ${response.status} (${response.statusText})`,
      responseData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to reach n8n webhook",
    });
  }
});

// 4. Video Calling Token endpoint -> n8n advocatewalla-video-token
app.post("/api/video/token", async (req, res) => {
  try {
    const {
      clientName = "Client",
      clientPhone = "",
      advocateName = "Advocate Seema Jha",
      matterType = "Legal Consultation",
      durationMinutes = 15,
      roomName = `chamber-${Date.now()}`,
      customWebhook = ""
    } = req.body;

    const targetUrl = customWebhook || process.env.N8N_VIDEO_TOKEN_URL || DEFAULT_VIDEO_TOKEN_WEBHOOK;
    const generatedToken = `VID-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      event: "advocatewalla_video_token_request",
      timestamp: new Date().toISOString(),
      roomName,
      sessionToken: generatedToken,
      client: {
        name: clientName,
        phone: clientPhone,
      },
      advocate: {
        name: advocateName,
      },
      consultation: {
        matterType,
        durationMinutes,
      }
    };

    let webhookStatus = "token_issued";
    let webhookData: any = null;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "AdvocateWalla-Video-Service/1.0",
        },
        body: JSON.stringify(payload),
      });

      webhookStatus = response.ok ? `HTTP ${response.status} OK` : `HTTP ${response.status} (${response.statusText})`;
      try {
        webhookData = await response.json();
      } catch {
        webhookData = { statusText: response.statusText };
      }
    } catch (err: any) {
      console.warn("Video Token Webhook dispatch note:", err.message);
      webhookStatus = `Notice: ${err.message}`;
    }

    logTelephonyEvent({
      type: "video_token",
      clientName,
      clientPhone: clientPhone || "N/A",
      advocateName,
      durationMinutes,
      status: "success",
      provider: "n8n_video_token",
      n8nStatus: webhookStatus,
      details: `Generated chamber video token (${generatedToken}) for ${clientName}. Webhook: ${targetUrl}`,
      responsePayload: webhookData,
    });

    res.json({
      success: true,
      token: webhookData?.token || webhookData?.sessionToken || generatedToken,
      roomUrl: webhookData?.roomUrl || webhookData?.meetingUrl || null,
      roomName,
      n8nWebhookUrl: targetUrl,
      n8nStatus: webhookStatus,
      message: "Virtual Chamber video consultation session initialized",
    });
  } catch (error: any) {
    console.error("Video token error:", error);
    res.status(500).json({ error: error.message || "Failed to generate video consultation token." });
  }
});

// 5. Payment & Consultation Booking endpoint -> n8n advocatewalla-book-consultation
app.post("/api/payments/book-consultation", async (req, res) => {
  try {
    const {
      clientName,
      clientPhone,
      clientEmail = "",
      advocateName = "Advocate Seema Jha",
      advocatePhone = "+919867015157",
      durationMinutes = 15,
      totalCost = 150,
      matterCategory = "General Legal Consultation",
      callMode = "video_call",
      paymentMethod = "razorpay",
      transactionRef = "",
      notes = "",
      bookingRef = `BOOK-${Date.now().toString().slice(-6)}`,
      customWebhook = ""
    } = req.body;

    const targetUrl = customWebhook || process.env.N8N_BOOK_CONSULTATION_URL || DEFAULT_BOOK_CONSULTATION_WEBHOOK;

    const payload = {
      event: "advocatewalla_consultation_booked",
      timestamp: new Date().toISOString(),
      source: "Advocate Walla Legal Platform",
      bookingRef,
      client: {
        name: clientName || "Valued Client",
        phone: clientPhone || "N/A",
        email: clientEmail,
      },
      advocate: {
        name: advocateName,
        phone: advocatePhone,
      },
      consultation: {
        matterCategory,
        durationMinutes,
        callMode,
        notes,
      },
      payment: {
        amount: totalCost,
        currency: "INR",
        method: paymentMethod,
        transactionRef: transactionRef || `TXN-${Date.now()}`,
        status: "CONFIRMED_PAID",
      }
    };

    let webhookStatus = "dispatched";
    let webhookData: any = null;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "AdvocateWalla-Payment-Booking/1.0",
        },
        body: JSON.stringify(payload),
      });

      webhookStatus = response.ok ? `HTTP ${response.status} OK` : `HTTP ${response.status} (${response.statusText})`;
      try {
        webhookData = await response.json();
      } catch {
        webhookData = { statusText: response.statusText };
      }
    } catch (err: any) {
      console.warn("Payment Consultation Booking Webhook dispatch note:", err.message);
      webhookStatus = `Notice: ${err.message}`;
    }

    logTelephonyEvent({
      type: "payment_booking",
      clientName: clientName || "Client",
      clientPhone: clientPhone || "N/A",
      advocateName,
      durationMinutes,
      totalCost,
      matterCategory,
      status: "success",
      provider: "n8n_book_consultation",
      n8nStatus: webhookStatus,
      details: `Payment confirmed (₹${totalCost}) and consultation booked (${callMode}). Webhook: ${targetUrl}`,
      responsePayload: webhookData,
    });

    res.json({
      success: true,
      bookingRef,
      amount: totalCost,
      paymentMethod,
      n8nWebhookUrl: targetUrl,
      n8nStatus: webhookStatus,
      message: "Consultation booking & payment dispatch logged successfully.",
      webhookResponse: webhookData,
    });
  } catch (error: any) {
    console.error("Error booking consultation / payment webhook:", error);
    res.status(500).json({ error: error.message || "Failed to process consultation booking." });
  }
});

// 6. Get Telephony & N8N Logs
app.get("/api/telephony/logs", (req, res) => {
  res.json({
    total: telephonyLogs.length,
    logs: telephonyLogs,
  });
});

// 5. Inbound Webhook from N8N (e.g. Call Completed, Recording Ready)
app.post("/api/webhooks/n8n", (req, res) => {
  const body = req.body;
  logTelephonyEvent({
    type: "inbound_webhook",
    clientName: body.clientName || "N8N Inbound Event",
    clientPhone: body.clientPhone || "N/A",
    advocateName: body.advocateName || "Advocate Seema Jha",
    status: "success",
    provider: "n8n_inbound",
    details: `Received inbound event from n8n: ${body.event || 'generic_event'}`,
    responsePayload: body,
  });

  res.json({ received: true, timestamp: new Date().toISOString() });
});

// 6. Advocate Business Partner Registration API
app.post("/api/advocates/join-partner", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      barRegistrationNo,
      stateBarCouncil = "Delhi Bar Council",
      experienceYears = 1,
      qualification = "LL.B.",
      primaryCourts = [],
      specializations = [],
      perMinuteRateProposed = 10,
      consultationModes = ["Phone Call"],
      city = "",
      state = "",
      chamberAddress = "",
      payoutUpiOrAccount = "",
      bio = "",
      documents = {},
      declarationAccepted = true
    } = req.body;

    if (!fullName || !phone || !barRegistrationNo) {
      return res.status(400).json({
        success: false,
        error: "Full Name, Mobile Number, and Bar Registration Number are required."
      });
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `ADV-PTR-${Date.now().toString().slice(-4)}${randomNum}`;
    const timestamp = new Date().toISOString();

    const record: PartnerApplicationRecord = {
      id: `PTR-${Date.now()}`,
      applicationId,
      submittedAt: timestamp,
      status: "submitted",
      fullName,
      email,
      phone,
      barRegistrationNo,
      stateBarCouncil,
      experienceYears: Number(experienceYears),
      qualification,
      primaryCourts: Array.isArray(primaryCourts) ? primaryCourts : [],
      specializations: Array.isArray(specializations) ? specializations : [],
      perMinuteRateProposed: Number(perMinuteRateProposed),
      consultationModes: Array.isArray(consultationModes) ? consultationModes : [],
      city,
      state,
      chamberAddress,
      payoutUpiOrAccount,
      bio,
      documentsSummary: {
        barCertificate: documents?.barCertificate ? {
          name: documents.barCertificate.name || "bar_certificate.pdf",
          size: documents.barCertificate.size || 0,
          type: documents.barCertificate.type || "application/pdf"
        } : null,
        aadhaarCard: documents?.aadhaarCard ? {
          name: documents.aadhaarCard.name || "aadhaar_card.pdf",
          size: documents.aadhaarCard.size || 0,
          type: documents.aadhaarCard.type || "application/pdf"
        } : null,
        addressProof: documents?.addressProof ? {
          name: documents.addressProof.name || "address_proof.pdf",
          size: documents.addressProof.size || 0,
          type: documents.addressProof.type || "application/pdf"
        } : null,
        idCardOrCop: documents?.idCardOrCop ? {
          name: documents.idCardOrCop.name || "id_card_cop.pdf",
          size: documents.idCardOrCop.size || 0,
          type: documents.idCardOrCop.type || "application/pdf"
        } : null,
        profilePhoto: documents?.profilePhoto ? {
          name: documents.profilePhoto.name || "profile_photo.jpg",
          size: documents.profilePhoto.size || 0,
          type: documents.profilePhoto.type || "image/jpeg"
        } : null,
      }
    };

    partnerApplications.unshift(record);
    if (partnerApplications.length > 100) partnerApplications.pop();

    // Log to Telephony / CRM stream
    logTelephonyEvent({
      type: "enquiry",
      clientName: fullName,
      clientPhone: phone,
      advocateName: "Partner Registration Portal",
      status: "success",
      provider: "partner_onboarding",
      details: `New Advocate Partner Registration: ${fullName} (${barRegistrationNo}, ${experienceYears} yrs exp). Attached: Certificate: ${Boolean(documents?.barCertificate)}, Aadhaar: ${Boolean(documents?.aadhaarCard)}, Address Proof: ${Boolean(documents?.addressProof)}`
    });

    // Optionally forward payload to N8N webhook if configured
    const targetWebhook = process.env.N8N_WEBHOOK_URL || DEFAULT_BOOK_CONSULTATION_WEBHOOK;

    if (targetWebhook) {
      try {
        fetch(targetWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "AdvocatWalla-Partner-Onboarding/1.0",
          },
          body: JSON.stringify({
            event: "advocate_partner_application_received",
            applicationId,
            timestamp,
            advocate: {
              fullName,
              phone,
              email,
              barRegistrationNo,
              stateBarCouncil,
              experienceYears,
              qualification,
              specializations,
              primaryCourts,
              proposedRate: perMinuteRateProposed,
              consultationModes,
              city,
              state,
              chamberAddress,
              payoutUpi: payoutUpiOrAccount,
            },
            attachedDocuments: record.documentsSummary
          }),
        }).catch((err) => console.warn("N8N Partner webhook trigger failed (non-blocking):", err.message));
      } catch (err: any) {
        console.warn("N8N Partner dispatch err:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Advocate Partner Application submitted successfully! Our Bar verification desk will review your documents within 24-48 hours.",
      applicationId,
      record: {
        applicationId,
        fullName,
        barRegistrationNo,
        phone,
        submittedAt: timestamp,
        status: "under_review",
        documentsCount: Object.values(record.documentsSummary).filter(Boolean).length
      }
    });
  } catch (error: any) {
    console.error("Partner Onboarding Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to submit partner application."
    });
  }
});

// 7. Get Partner Applications / Check Status API
app.get("/api/advocates/partner-applications", (req, res) => {
  const query = (req.query.q as string || "").toLowerCase().trim();
  if (query) {
    const filtered = partnerApplications.filter(
      (app) =>
        app.applicationId.toLowerCase().includes(query) ||
        app.phone.includes(query) ||
        app.barRegistrationNo.toLowerCase().includes(query) ||
        app.fullName.toLowerCase().includes(query)
    );
    return res.json({ total: filtered.length, applications: filtered });
  }

  res.json({
    total: partnerApplications.length,
    applications: partnerApplications.map((app) => ({
      applicationId: app.applicationId,
      fullName: app.fullName,
      phone: app.phone,
      barRegistrationNo: app.barRegistrationNo,
      experienceYears: app.experienceYears,
      stateBarCouncil: app.stateBarCouncil,
      qualification: app.qualification,
      specializations: app.specializations,
      status: app.status,
      submittedAt: app.submittedAt,
      documentsSummary: app.documentsSummary
    }))
  });
});

// 8. Gemini AI Legal Research & Notice Drafting Assistant API
let geminiClient: any = null;
function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = require("@google/genai");
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e: any) {
      console.warn("Failed to initialize GoogleGenAI:", e.message);
    }
  }
  return geminiClient;
}

app.post("/api/ai/legal-assist", async (req, res) => {
  try {
    const {
      prompt,
      taskType = "legal_research", // "draft_notice" | "bns_query" | "case_summary" | "clause_review"
      contextData = {}
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A valid prompt string is required." });
    }

    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `You are a Senior Practicing Advocate of the High Court of Delhi and Supreme Court of India, advising on Indian Law including Bharatiya Nyaya Sanhita (BNS 2023), BNSS 2023, BSA 2023, Negotiable Instruments Act, Transfer of Property Act, Consumer Protection Act 2019, and the Constitution of India.
Provide clear, authoritative, actionable, and professionally formatted legal guidance.
Structure your answers with:
1. Legal Provisions & Applicable Sections (BNS/BNSS/BSA or specific Special Acts)
2. Strategic Legal Advice & Immediate Procedural Steps
3. Draft Clauses or Statutory Notice Demand (if applicable)
4. Cautionary & Limitation Timelines (Statutory notice periods, limitation act periods)
Keep the tone professional, objective, and legally precise.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemInstruction}\n\nTask: ${taskType}\nUser Query / Case Facts:\n${prompt}\n\nAdditional Context: ${JSON.stringify(contextData)}` }] }
        ],
      });

      const responseText = response.text || "No response generated.";
      return res.json({
        success: true,
        source: "gemini_ai",
        model: "gemini-3.7-flash",
        answer: responseText,
      });
    }

    // Fallback if GEMINI_API_KEY is not configured yet in environment
    let fallbackText = "";
    if (taskType === "draft_notice") {
      fallbackText = `### Statutory Notice Framework under Indian Law\n\n**Applicable Statutes:**\n- Section 138 / 142 Negotiable Instruments Act, 1881 OR Section 106 Transfer of Property Act, 1882.\n- Section 318(4) Bharatiya Nyaya Sanhita, 2023 (Cheating & Dishonest Inducement).\n\n**Key Strategic Directives:**\n1. **Statutory Demand Window:** Ensure notice gives exactly the mandated statutory period (15 days for Section 138 NI Act / 60 days for Section 80 CPC).\n2. **Proof of Service:** Always dispatch via Registered Post A.D. & Speed Post with postal tracking consignment receipts preserved alongside email delivery.\n3. **Cause of Action:** Clearly delineate dates of invoice, dishonour memo, and exact quantified liability.\n\n*Note: Connect with Advocate Seema Jha for official Bar-certified notice dispatch and court representation.*`;
    } else if (taskType === "bns_query") {
      fallbackText = `### New Criminal Laws 2024 Reference (BNS, BNSS, BSA)\n\n- **IPC to BNS Transition:** Section 302 IPC is now Section 103(1) BNS; Section 420 IPC is now Section 318(4) BNS; Section 376 IPC is now Section 64 BNS.\n- **Mandatory Audio-Video:** Under Section 105 BNSS, seizure and search proceedings mandate video recording.\n- **Zero FIR Mandate:** Section 173(1) BNSS makes registration of Zero FIR mandatory across any police station.\n- **Electronic Evidence:** Section 63 BSA Schedule replaces the former Section 65B IEA certificate.`;
    } else {
      fallbackText = `### Professional Legal Assessment\n\n**Immediate Procedural Steps:**\n1. Consolidate all transactional records, receipts, WhatsApp correspondences, and bank statements.\n2. Ascertain limitation period under Limitation Act, 1963 (typically 3 years for debt recovery, 30 days for Section 138 notice).\n3. Issue formal Advocate Statutory Notice before initiating litigation before District Court or High Court.\n\n*For full case briefing and immediate consultation, book a ₹10/min direct call with Advocate Seema Jha.*`;
    }

    res.json({
      success: true,
      source: "knowledge_base",
      answer: fallbackText,
      note: "For live dynamic AI legal research, configure GEMINI_API_KEY in the platform environment."
    });
  } catch (error: any) {
    console.error("AI Legal Assistant error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process AI legal query."
    });
  }
});

// 9. Vite / Static Server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Advocate Legal Telephony Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
