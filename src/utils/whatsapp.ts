import { BUSINESS_CONFIG } from '../data/config';
import { CartItem, EnquiryFormData, ServiceItem } from '../types';

export function getDirectWhatsAppUrl(customMessage?: string): string {
  const defaultText = `Hi ${BUSINESS_CONFIG.advocateName}, I am visiting ${BUSINESS_CONFIG.name} and would like to enquire about legal consultation services.`;
  const text = customMessage || defaultText;
  return `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function getServiceWhatsAppUrl(service: ServiceItem): string {
  const message = `Hello ${BUSINESS_CONFIG.advocateName},

I am interested in your service: *${service.name}*
• Price: ${BUSINESS_CONFIG.currency}${service.price.toLocaleString('en-IN')}
• Turnaround: ${service.duration}

I would like to discuss my requirements and proceed with this service.`;

  return `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function getCartEnquiryWhatsAppUrl(
  items: CartItem[],
  customer?: Partial<EnquiryFormData>
): string {
  const serviceList = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.service.name}* (Qty: ${item.quantity}) - ${BUSINESS_CONFIG.currency}${(item.service.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  const total = items.reduce(
    (acc, curr) => acc + curr.service.price * curr.quantity,
    0
  );

  let message = `Hello ${BUSINESS_CONFIG.advocateName},\n\nI would like to enquire about the following legal services from *${BUSINESS_CONFIG.name}*:\n\n${serviceList}\n\n*Estimated Total:* ${BUSINESS_CONFIG.currency}${total.toLocaleString('en-IN')}\n`;

  if (customer && (customer.fullName || customer.phone)) {
    message += `\n*Client Details:*`;
    if (customer.fullName) message += `\n• Name: ${customer.fullName}`;
    if (customer.phone) message += `\n• Mobile: ${customer.phone}`;
    if (customer.email) message += `\n• Email: ${customer.email}`;
    if (customer.preferredContact) message += `\n• Preferred Contact: ${customer.preferredContact}`;
    if (customer.requirement) message += `\n• Requirement: ${customer.requirement}`;
  }

  message += `\n\nPlease let me know the next steps for proceeding. Thank you!`;

  return `https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}
