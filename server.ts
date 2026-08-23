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

// In-memory log of telephony & n8n webhook events for real-time visibility
interface TelephonyLog {
  id: string;
  timestamp: string;
  type: 'call_trigger' | 'scheduled_booking' | 'enquiry' | 'n8n_test' | 'inbound_webhook';
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
  const n8nWebhookConfigured = Boolean(process.env.N8N_WEBHOOK_URL);
  const telephonyProvider = process.env.TELEPHONY_PROVIDER || "n8n_webhook";
  
  res.json({
    status: "ok",
    n8nWebhookConfigured,
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL ? `${process.env.N8N_WEBHOOK_URL.slice(0, 20)}...` : null,
    telephonyProvider,
    supportedProviders: ["n8n_webhook", "exotel", "twilio", "custom_webhook"],
    activeAdvocate: "Advocate Seema Jha",
    ratePerMinute: 10,
    features: {
      instantCallBridge: true,
      n8nWorkflowTrigger: true,
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

    const DEFAULT_N8N_URL = "https://sneha12345678.app.n8n.cloud/webhook/132d0d77-462f-4145-9ad3-834d69e75eaf/chat";
    const targetWebhook = customN8nUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_URL;
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
    const { webhookUrl } = req.body;
    const DEFAULT_N8N_URL = "https://sneha12345678.app.n8n.cloud/webhook/132d0d77-462f-4145-9ad3-834d69e75eaf/chat";
    const targetUrl = webhookUrl || process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_URL;

    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        error: "No N8N Webhook URL provided. Please provide a webhook URL to test.",
      });
    }

    const testPayload = {
      event: "test_n8n_telephony_ping",
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
        totalCost: 149,
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
      totalCost: 149,
      status: response.ok ? "success" : "failed",
      provider: "n8n_webhook",
      n8nStatus: `HTTP ${response.status}`,
      details: `Test payload delivered in ${durationMs}ms`,
      responsePayload: responseData,
    });

    res.json({
      success: response.ok,
      httpStatus: response.status,
      durationMs,
      message: response.ok ? "n8n Webhook responded successfully!" : `n8n returned HTTP ${response.status}`,
      responseData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to reach n8n webhook",
    });
  }
});

// 4. Get Telephony & N8N Logs
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
    const DEFAULT_N8N_URL = "https://sneha12345678.app.n8n.cloud/webhook/132d0d77-462f-4145-9ad3-834d69e75eaf/chat";
    const targetWebhook = process.env.N8N_WEBHOOK_URL || DEFAULT_N8N_URL;

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

// 8. Vite / Static Server integration
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
