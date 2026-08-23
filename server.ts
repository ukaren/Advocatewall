import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
      advocatePhone = "+919867015157",
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

// 6. Vite / Static Server integration
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
