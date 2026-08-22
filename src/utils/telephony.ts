// Utility for dispatching Telephony and N8N Webhook Call Triggers

export interface TriggerCallParams {
  clientName: string;
  clientPhone: string;
  advocateName?: string;
  advocatePhone?: string;
  durationMinutes?: number;
  totalCost?: number;
  matterCategory?: string;
  callType?: 'instant_phone' | 'whatsapp_call' | 'scheduled_call';
  notes?: string;
  customN8nUrl?: string;
}

export interface TelephonyResponse {
  success: boolean;
  message?: string;
  callId?: string;
  provider?: string;
  n8nWebhookTriggered?: boolean;
  n8nStatus?: string;
  error?: string;
}

export async function triggerTelephonyCall(params: TriggerCallParams): Promise<TelephonyResponse> {
  try {
    const res = await fetch('/api/telephony/trigger-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.warn('Telephony trigger offline or fallback:', error);
    return {
      success: true,
      provider: 'client_fallback',
      message: 'Direct device dialer active',
    };
  }
}

export async function testN8NWebhook(webhookUrl: string): Promise<any> {
  const res = await fetch('/api/telephony/test-n8n', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ webhookUrl }),
  });
  return res.json();
}

export async function getTelephonyConfig(): Promise<any> {
  try {
    const res = await fetch('/api/telephony/config');
    return res.json();
  } catch {
    return { status: 'fallback', n8nWebhookConfigured: false };
  }
}

export async function getTelephonyLogs(): Promise<any> {
  try {
    const res = await fetch('/api/telephony/logs');
    return res.json();
  } catch {
    return { total: 0, logs: [] };
  }
}
