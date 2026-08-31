import React, { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { BUSINESS_CONFIG } from '../data/config';

export const N8NChatWidget: React.FC = () => {
  useEffect(() => {
    const webhookUrl =
      BUSINESS_CONFIG.n8nChatWebhookUrl ||
      'https://sneha12345678.app.n8n.cloud/webhook/132d0d77-462f-4145-9ad3-834d69e75eaf/chat';

    try {
      createChat({
        webhookUrl,
        mode: 'window',
        showWelcomeScreen: true,
        defaultLanguage: 'en',
        initialMessages: [
          'नमस्ते! 🙏 Welcome to ADVOCAT वाला (Advocate Walla).',
          'I am your AI Legal Assistant powered by N8N. How can I help you with legal consultation, notices, BNS provisions, or booking today?',
        ],
        i18n: {
          en: {
            title: 'Advocate Walla • Legal AI',
            subtitle: 'Ask Indian Law queries, BNS/BNSS provisions & services',
            footer: 'ADVOCAT वाला • Powered by N8N',
            getStarted: 'Start Legal Chat',
            inputPlaceholder: 'Type your legal query here...',
          },
        },
      });
    } catch (err) {
      console.warn('N8N Chat initialization note:', err);
    }
  }, []);

  return null;
};
