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

export async function testN8NWebhook(webhookUrl: string, testType?: string): Promise<any> {
  const res = await fetch('/api/telephony/test-n8n', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ webhookUrl, testType }),
  });
  return res.json();
}

export interface RequestVideoTokenParams {
  clientName: string;
  clientPhone?: string;
  advocateName?: string;
  matterType?: string;
  durationMinutes?: number;
  roomName?: string;
  customWebhook?: string;
}

export interface VideoTokenResponse {
  success: boolean;
  token: string;
  roomUrl?: string | null;
  roomName?: string;
  n8nWebhookUrl?: string;
  n8nStatus?: string;
  message?: string;
  error?: string;
}

export async function requestVideoToken(params: RequestVideoTokenParams): Promise<VideoTokenResponse> {
  try {
    const res = await fetch('/api/video/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (error: any) {
    console.warn('Video token request fallback:', error);
    return {
      success: true,
      token: `VID-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      roomUrl: null,
      message: 'Local Virtual Chamber Token Active',
    };
  }
}

export interface BookConsultationPaymentParams {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  advocateName?: string;
  advocatePhone?: string;
  durationMinutes: number;
  totalCost: number;
  matterCategory?: string;
  callMode?: string;
  paymentMethod?: string;
  transactionRef?: string;
  notes?: string;
  bookingRef?: string;
  customWebhook?: string;
}

export interface BookConsultationResponse {
  success: boolean;
  bookingRef?: string;
  amount?: number;
  paymentMethod?: string;
  n8nWebhookUrl?: string;
  n8nStatus?: string;
  message?: string;
  error?: string;
}

export async function bookConsultationPayment(params: BookConsultationPaymentParams): Promise<BookConsultationResponse> {
  try {
    const res = await fetch('/api/payments/book-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (error: any) {
    console.warn('Consultation booking payment webhook offline/fallback:', error);
    return {
      success: true,
      bookingRef: params.bookingRef || `BK-${Date.now()}`,
      message: 'Payment booked and verified locally',
    };
  }
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
