export interface AdvocateProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  secondarySpecialties: string[];
  experienceYears: number;
  rating: number;
  totalConsultations: number;
  languages: string[];
  courts: string[];
  barRegistration: string;
  education: string;
  avatar: string;
  bio: string;
  perMinuteRate: number; // e.g. 15 for ₹15/min
  slotRates: {
    15: number;
    30: number;
    45: number;
    60: number;
  };
  isAvailableNow: boolean;
  phone: string;
  whatsapp: string;
  badge?: string;
}

export interface CallBookingData {
  advocateId: string;
  advocateName: string;
  minutes: number;
  totalCost: number;
  clientName: string;
  clientPhone: string;
  matterCategory: string;
  callType: 'instant_phone' | 'whatsapp_call' | 'scheduled_call';
  scheduledTime?: string;
  notes?: string;
}

export type ServiceCategory =
  | 'All'
  | 'Consultation'
  | 'Documentation'
  | 'Property'
  | 'Family'
  | 'Criminal'
  | 'Civil'
  | 'Business'
  | 'Consumer';

export interface ServiceItem {
  id: string;
  name: string;
  category: Exclude<ServiceCategory, 'All'>;
  price: number;
  originalPrice?: number;
  duration: string;
  shortDescription: string;
  fullDescription: string;
  badge?: string;
  popular?: boolean;
  iconName: string;
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  processSteps: { step: number; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

export interface BusinessConfig {
  name: string;
  advocateName: string;
  advocateTitle: string;
  barRegistration: string;
  tagline: string;
  subTagline: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  consultationFee: number;
  currency: string;
  experienceYears: number;
  satisfiedClients: string;
  n8nChatWebhookUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  location: string;
  serviceUsed: string;
  feedback: string;
  rating: number;
  date: string;
}

export interface AttachedDocument {
  name: string;
  size: number;
  type: string;
  base64?: string;
  previewUrl?: string;
  uploadedAt?: string;
}

export interface AdvocatePartnerApplication {
  id?: string;
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
  documents: {
    barCertificate?: AttachedDocument | null;
    aadhaarCard?: AttachedDocument | null;
    addressProof?: AttachedDocument | null;
    idCardOrCop?: AttachedDocument | null;
    profilePhoto?: AttachedDocument | null;
  };
  declarationAccepted: boolean;
  applicationId?: string;
  submittedAt?: string;
  status?: 'submitted' | 'under_review' | 'verified' | 'active';
}

export interface EnquiryFormData {
  fullName: string;
  phone: string;
  email: string;
  preferredContact: 'WhatsApp' | 'Phone Call' | 'Email';
  selectedServiceIds: string[];
  requirement: string;
}
