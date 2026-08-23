import { AdvocateProfile } from '../types';
import advocateSeemaJhaImg from '../assets/images/advocate_seema_jha_1786866487728.jpg';

export const ADVOCATES_LIST: AdvocateProfile[] = [
  {
    id: 'adv-seema-jha',
    name: 'Adv. Seema Jha',
    title: 'Advocate & Legal Consultant',
    specialization: 'Civil & Criminal Litigation, Matrimonial Disputes & Legal Drafting',
    secondarySpecialties: [
      'Property & Tenancy Disputes',
      'Matrimonial & Family Law',
      'Cheque Bounce (Sec 138 NI Act)',
      'Consumer Forum Disputes',
      'Legal Notice & Agreement Drafting',
      'Police Complaints & Bail Advisory',
    ],
    experienceYears: 4,
    rating: 4.9,
    totalConsultations: 640,
    languages: ['Hindi', 'English'],
    courts: ['District & Sessions Courts', 'High Court', 'Family Court & Consumer Forum'],
    barRegistration: 'Bar Council Registration: D/5120/2022',
    education: 'B.A. LL.B.',
    avatar: advocateSeemaJhaImg,
    bio: 'Advocate Seema Jha brings 4 years of dedicated practice across Civil, Family, Criminal, and Property matters. Known for clear, prompt, and client-centric legal advisory, statutory notice drafting, and proactive legal dispute resolution.',
    perMinuteRate: 10, // ₹10 per minute consultancy charge (affordable & transparent for 4 yrs experience)
    slotRates: {
      15: 149,
      30: 289,
      45: 429,
      60: 549,
    },
    isAvailableNow: true,
    phone: '+91 98670 15157',
    whatsapp: '919867015157',
    badge: 'Practicing Advocate',
  },
];

