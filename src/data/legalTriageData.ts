export interface CaseTriageItem {
  id: string;
  category: string;
  iconName: string;
  title: string;
  hindiTitle: string;
  urgencyLevel: 'High' | 'Critical' | 'Standard';
  urgencyColor: string;
  statutoryTimeline: string;
  applicableLaw: string;
  recommendedAction: string;
  hindiAction: string;
  documentsNeeded: string[];
  estimatedConsultationDuration: number;
  estimatedDraftPrice: number;
  actionType: 'notice' | 'call' | 'bns' | 'stamp';
  actionTarget: string;
}

export const LEGAL_TRIAGE_SCENARIOS: CaseTriageItem[] = [
  {
    id: 'cheque-bounce',
    category: 'Banking & Financial',
    iconName: 'CreditCard',
    title: 'Cheque Bounce (Dishonour of Cheque)',
    hindiTitle: 'चेक बाउंस का मामला',
    urgencyLevel: 'Critical',
    urgencyColor: 'rose',
    statutoryTimeline: 'Strict 30 Days from Cheque Return Memo',
    applicableLaw: 'Section 138 & 142, Negotiable Instruments Act, 1881',
    recommendedAction: 'Serve a formal 15-day Statutory Demand Notice to drawer before filing complaint in Magistrate court.',
    hindiAction: 'चेक रिटर्न मेमो मिलने के 30 दिनों के भीतर 15-दिवसीय कानूनी नोटिस भेजना अनिवार्य है।',
    documentsNeeded: [
      'Original dishonoured cheque copy',
      'Bank memo showing "Insufficient Funds"',
      'Proof of debt / invoice / agreement',
      'Address of issuer for Speed Post delivery'
    ],
    estimatedConsultationDuration: 15,
    estimatedDraftPrice: 999,
    actionType: 'notice',
    actionTarget: 'notice-generator'
  },
  {
    id: 'police-notice-bnss-35',
    category: 'Criminal & Police',
    iconName: 'ShieldAlert',
    title: 'Police Notice for Appearance (Sec 35 BNSS / 41A CrPC)',
    hindiTitle: 'पुलिस नोटिस व पेशी (धारा 35 BNSS)',
    urgencyLevel: 'Critical',
    urgencyColor: 'rose',
    statutoryTimeline: 'Immediate (Within notice period, usually 3-7 days)',
    applicableLaw: 'Section 35(3) Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023',
    recommendedAction: 'Seek advocate counsel immediately, prepare written reply, and ensure compliance to prevent unwarranted arrest.',
    hindiAction: 'अनावश्यक गिरफ्तारी से बचने के लिए तुरंत वकील से सलाह लें और लिखित जवाब तैयार करें।',
    documentsNeeded: [
      'Copy of notice issued by Investigating Officer (IO)',
      'FIR copy (if available)',
      'Proof of alibi or relevant correspondence',
      'Identity documents'
    ],
    estimatedConsultationDuration: 15,
    estimatedDraftPrice: 799,
    actionType: 'call',
    actionTarget: 'advocates'
  },
  {
    id: 'unpaid-salary-termination',
    category: 'Employment & Labor',
    iconName: 'Briefcase',
    title: 'Unpaid Salary / Wrongful Termination',
    hindiTitle: 'बकाया वेतन / अवैध नौकरी से निष्कासन',
    urgencyLevel: 'High',
    urgencyColor: 'amber',
    statutoryTimeline: 'Within 30-90 days of exit/dues default',
    applicableLaw: 'Payment of Wages Act, 1936 & Industrial Disputes Act / Civil Contract',
    recommendedAction: 'Dispatch an advocate legal demand notice with calculation of dues, interest (18% p.a.), and full & final settlement claims.',
    hindiAction: 'कंपनी को 18% ब्याज व बकाया राशि का 15-दिवसीय वैधानिक लीगल नोटिस भेजें।',
    documentsNeeded: [
      'Appointment letter & salary slips',
      'Termination email / resignation acceptance',
      'Bank statement showing salary credits',
      'Timesheets / work proof'
    ],
    estimatedConsultationDuration: 15,
    estimatedDraftPrice: 899,
    actionType: 'notice',
    actionTarget: 'notice-generator'
  },
  {
    id: 'property-dispute-partition',
    category: 'Property & Real Estate',
    iconName: 'Landmark',
    title: 'Property Title Dispute / Ancestral Partition',
    hindiTitle: 'पैतृक संपत्ति बंटवारा व जमीनी विवाद',
    urgencyLevel: 'Standard',
    urgencyColor: 'blue',
    statutoryTimeline: 'Limitation period: 3 to 12 years based on cause',
    applicableLaw: 'Transfer of Property Act, 1882 & Hindu Succession Act, 1956 (Amended 2005)',
    recommendedAction: 'Conduct title search, verify mutation records (Jamabandi/Khatoni), and send partition/injunction legal notice.',
    hindiAction: 'रजिस्ट्री, खतौनी और पैतृक रिकॉर्ड की जांच कर कानूनी नोटिस और बंटवारे का दावा दाखिल करें।',
    documentsNeeded: [
      'Sale Deed / Registry / Mutation extract',
      'Family pedigree / succession tree (Vanshvali)',
      'Previous notices or revenue court orders',
      'Property site photos / boundary details'
    ],
    estimatedConsultationDuration: 30,
    estimatedDraftPrice: 1499,
    actionType: 'call',
    actionTarget: 'advocates'
  },
  {
    id: 'rera-builder-delay',
    category: 'Real Estate & Consumer',
    iconName: 'Building',
    title: 'Builder Flat Possession Delay (RERA Complaint)',
    hindiTitle: 'बिल्डर द्वारा फ्लैट देरी व RERA क्लेम',
    urgencyLevel: 'High',
    urgencyColor: 'amber',
    statutoryTimeline: 'Anytime after committed possession date',
    applicableLaw: 'Section 18, Real Estate (Regulation and Development) Act (RERA) 2016',
    recommendedAction: 'Demand interest on delayed possession (MCLR + 2%) or complete refund with compensation through formal legal notice.',
    hindiAction: 'बिल्डर से ब्याज सहित रिफंड या देरी का मुआवजा मांगने के लिए रेरा व कानूनी नोटिस भेजें।',
    documentsNeeded: [
      'Builder-Buyer Agreement (BBA)',
      'All payment receipts / demand letters',
      'Bank loan statement (if applicable)',
      'Possession commitment letters'
    ],
    estimatedConsultationDuration: 15,
    estimatedDraftPrice: 1199,
    actionType: 'notice',
    actionTarget: 'notice-generator'
  },
  {
    id: 'matrimonial-divorce-custody',
    category: 'Family & Matrimonial',
    iconName: 'Users',
    title: 'Mutual Divorce / Maintenance & Child Custody',
    hindiTitle: 'आपसी सहमति तलाक व भरण-पोषण',
    urgencyLevel: 'Standard',
    urgencyColor: 'blue',
    statutoryTimeline: '6 Months cooling period (Can be waived per SC rulings)',
    applicableLaw: 'Section 13B Hindu Marriage Act / Sec 28 Special Marriage Act & Sec 144 BNSS',
    recommendedAction: 'Draft comprehensive Memorandum of Understanding (MOU) covering alimony, child custody, and joint petition draft.',
    hindiAction: 'तलाक, गुजारा-भत्ता व बच्चे की कस्टडी की शर्तों पर आपसी सहमति समझौता (MOU) तैयार करें।',
    documentsNeeded: [
      'Marriage Certificate & Wedding photographs',
      'Joint settlement terms on alimony & assets',
      'Child birth certificates (if applicable)',
      'Current address proofs of both spouses'
    ],
    estimatedConsultationDuration: 30,
    estimatedDraftPrice: 1999,
    actionType: 'call',
    actionTarget: 'advocates'
  },
  {
    id: 'consumer-cyber-fraud',
    category: 'Consumer & Cyber Law',
    iconName: 'ShoppingBag',
    title: 'E-commerce Fraud / Defective Product / Cyber Scam',
    hindiTitle: 'ऑनलाइन फ्रॉड, साइबर ठगी व उपभोक्ता शिकायत',
    urgencyLevel: 'High',
    urgencyColor: 'amber',
    statutoryTimeline: '2 Years limitation under Consumer Protection Act',
    applicableLaw: 'Consumer Protection Act, 2019 & Information Technology Act, 2000',
    recommendedAction: 'Issue 15-day pre-litigation legal notice demanding full refund + mental harassment damages before e-Daakhil filing.',
    hindiAction: 'कंपनी को 15 दिन का नोटिस दें व ई-दाखिल पोर्टल पर उपभोक्ता अदालत में क्लेम करें।',
    documentsNeeded: [
      'Invoice / Order confirmation email',
      'Bank transaction reference (UTR) / UPI receipt',
      'Defect photos / unboxing video',
      'Customer support chat transcripts'
    ],
    estimatedConsultationDuration: 15,
    estimatedDraftPrice: 799,
    actionType: 'notice',
    actionTarget: 'notice-generator'
  }
];

export interface HealthCheckQuestion {
  id: string;
  category: string;
  title: string;
  hindiTitle: string;
  options: {
    label: string;
    score: number;
    tip: string;
  }[];
}

export const LEGAL_HEALTH_QUESTIONS: HealthCheckQuestion[] = [
  {
    id: 'q1',
    category: 'Tenancy & Property',
    title: 'Do you have a registered/notarized agreement for your rental residence or commercial premises?',
    hindiTitle: 'क्या आपके पास अपने किराये के मकान या दुकान का रजिस्टर्ड/नोटरी एग्रीमेंट है?',
    options: [
      {
        label: 'Yes, registered on official stamp paper with police verification done',
        score: 25,
        tip: 'Excellent! Registered agreements provide 100% legal protection under Tenancy & Stamp Acts.'
      },
      {
        label: 'Informal notarized agreement / 11-month lease paper',
        score: 15,
        tip: 'Moderate protection. Ensure notice period clauses and security refund terms are unambiguous.'
      },
      {
        label: 'Verbal agreement / No written document',
        score: 5,
        tip: 'High legal risk! Evictions, rent disputes, and deposit claims become very hard to enforce without a written deed.'
      }
    ]
  },
  {
    id: 'q2',
    category: 'Financial Lending & Debt',
    title: 'When lending money or issuing invoices to clients, do you maintain written promissory notes or cheques?',
    hindiTitle: 'पैसों के लेनदेन या व्यापारिक उधारी में क्या आपके पास लिखित प्रॉमिसरी नोट, बिल या चेक है?',
    options: [
      {
        label: 'Yes, post-dated cheques / signed Promissory Notes + tax invoices with GST',
        score: 25,
        tip: 'Strong evidentiary value under Section 138 NI Act & Commercial Court summary recovery suits.'
      },
      {
        label: 'Only WhatsApp messages and online UPI bank transfer statements',
        score: 15,
        tip: 'Fair. WhatsApp & bank logs are admissible under Bharatiya Sakshya Adhiniyam (BSA) Section 63 electronic evidence certificate.'
      },
      {
        label: 'Cash payments with no receipts or written acknowledgments',
        score: 0,
        tip: 'Critical risk! Section 269SS/T of Income Tax Act and burden of proof makes recovery extremely difficult.'
      }
    ]
  },
  {
    id: 'q3',
    category: 'Succession & Will',
    title: 'Have you drafted a formal Will or updated nomination records across bank accounts, mutual funds & properties?',
    hindiTitle: 'क्या आपने वसीयत (Will) बनवाई है या सभी बैंक खातों व संपत्ति में नॉमिनी अपडेट किए हैं?',
    options: [
      {
        label: 'Yes, drafted a clear Will with two independent attesting witnesses & updated all nominees',
        score: 25,
        tip: 'Superb! Prevents lengthy succession certificate and legal heir disputes among family members.'
      },
      {
        label: 'Nominees updated in bank accounts, but no formal Will yet',
        score: 15,
        tip: 'Nominees are only caretakers/trustees; legal heirs still have ownership claims unless documented in a Will.'
      },
      {
        label: 'Neither Will nor nominations updated',
        score: 5,
        tip: 'High litigation risk for surviving family. Succession proceedings in civil courts can take 3–5 years.'
      }
    ]
  },
  {
    id: 'q4',
    category: 'Employment & Contractual Rights',
    title: 'Do you have a countersigned employment contract / client service agreement with clear dispute resolution?',
    hindiTitle: 'क्या आपके पास स्पष्ट शर्तों वाला रोजगार अनुबंध या सर्विस एग्रीमेंट है?',
    options: [
      {
        label: 'Yes, full signed appointment letter with notice period, severance, and IP/confidentiality clauses',
        score: 25,
        tip: 'Ideal! Strong shielding against sudden termination, salary withholding, or NDA breaches.'
      },
      {
        label: 'Only offer email without detailed employment terms',
        score: 15,
        tip: 'Partial. Clear terms on notice periods and non-compete enforceability are recommended.'
      },
      {
        label: 'No contract signed, working on informal understanding',
        score: 5,
        tip: 'Vulnerable position. Gratuity, PF compliance, and unpaid dues recovery are compromised.'
      }
    ]
  }
];

export interface CitizenRightItem {
  id: string;
  badge: string;
  title: string;
  hindiTitle: string;
  lawSection: string;
  description: string;
  hindiDescription: string;
  citizenDos: string[];
  citizenDonts: string[];
}

export const CITIZEN_EMERGENCY_RIGHTS: CitizenRightItem[] = [
  {
    id: 'right-against-arrest-notice',
    badge: 'Police Notice Mandate',
    title: 'Right to Notice before Arrest for Offences < 7 Years',
    hindiTitle: '7 वर्ष से कम सजा वाले मामलों में गिरफ्तारी से पहले नोटिस का अधिकार',
    lawSection: 'Section 35(3) BNSS 2023 / Section 41A CrPC (Arnesh Kumar Guidelines)',
    description: 'Police cannot arbitrarily arrest for offences carrying imprisonment up to 7 years without issuing a written Section 35 notice of appearance. As long as you comply and appear, arrest is prohibited unless reasons are recorded in writing.',
    hindiDescription: '7 साल से कम सजा वाले अपराधों में पुलिस सीधे गिरफ्तार नहीं कर सकती। धारा 35 BNSS के तहत लिखित नोटिस देना अनिवार्य है।',
    citizenDos: [
      'Demand a written Section 35(3) BNSS notice with official dispatch number',
      'Appear before Investigating Officer (IO) with your advocate or written reply',
      'Keep stamped acknowledgment copy of your appearance'
    ],
    citizenDonts: [
      'Do not ignore or evade the police notice',
      'Do not sign blank papers or confession statements at the police station',
      'Do not make informal verbal promises without written documentation'
    ]
  },
  {
    id: 'right-women-arrest',
    badge: 'Women Protection Protocol',
    title: 'Women Arrest Protocol (Sunset to Sunrise Protection)',
    hindiTitle: 'महिलाओं की गिरफ्तारी के विशेष सुरक्षा नियम',
    lawSection: 'Section 43(5) & Section 43(1) BNSS 2023 / Section 46(4) CrPC',
    description: 'No female can be arrested after sunset and before sunrise except in exceptional circumstances with prior permission of a Judicial Magistrate. Arrest and physical search can strictly be conducted only by a female police officer.',
    hindiDescription: 'सूर्यास्त के बाद और सूर्योदय से पहले किसी भी महिला को गिरफ्तार नहीं किया जा सकता। गिरफ्तारी केवल महिला पुलिस अधिकारी ही कर सकती है।',
    citizenDos: [
      'Politely insist on the presence of a female police officer for questioning/arrest',
      'Demand to see written Magistrate order if detention is attempted at night',
      'Contact family and advocate immediately'
    ],
    citizenDonts: [
      'No male police officer is permitted to physically touch or search a woman',
      'Do not accept interrogation in isolated rooms without female personnel present'
    ]
  },
  {
    id: 'right-zero-fir',
    badge: 'Zero FIR Mandate',
    title: 'Right to File "Zero FIR" in Any Police Station',
    hindiTitle: 'किसी भी थाने में जीरो एफआईआर (Zero FIR) दर्ज कराने का अधिकार',
    lawSection: 'Section 173(1) BNSS 2023 & Supreme Court Mandate (Lalita Kumari Case)',
    description: 'A victim can lodge an FIR at ANY police station regardless of territorial jurisdiction where the crime occurred. The station must register the Zero FIR and transfer it to the appropriate jurisdiction station.',
    hindiDescription: 'घटना कहीं भी हुई हो, आप किसी भी नजदीकी पुलिस स्टेशन में जीरो FIR दर्ज करा सकते हैं। पुलिस मना नहीं कर सकती।',
    citizenDos: [
      'State facts clearly in chronological sequence with dates and times',
      'Demand free physical copy of registered FIR on the spot (BNSS Sec 173(2))',
      'If officer refuses, send written complaint via Speed Post to Superintendent of Police (SP)'
    ],
    citizenDonts: [
      'Never leave the station without an official Diary Entry (GD Number) or FIR copy',
      'Do not mention speculative allegations without corroborating evidence'
    ]
  },
  {
    id: 'right-24hr-magistrate',
    badge: 'Constitutional Guarantee',
    title: 'Mandatory 24-Hour Production before Judicial Magistrate',
    hindiTitle: '24 घंटे के अंदर मजिस्ट्रेट के समक्ष पेशी का संवैधानिक अधिकार',
    lawSection: 'Article 22(2) Constitution of India & Section 58 BNSS 2023',
    description: 'Any person arrested must be produced before the nearest Judicial Magistrate within 24 hours of arrest (excluding travel time). Detention beyond 24 hours without Magistrate remand is illegal confinement.',
    hindiDescription: 'गिरफ्तारी के 24 घंटे के भीतर नजदीकी मजिस्ट्रेट के समक्ष पेश करना अनिवार्य है। 24 घंटे से अधिक पुलिस हिरासत गैरकानूनी है।',
    citizenDos: [
      'Inform the Magistrate immediately about any police ill-treatment or forced signature',
      'Request immediate medical examination under Section 53 BNSS',
      'Apply for regular or interim bail through your advocate during production'
    ],
    citizenDonts: [
      'Do not stay silent if police fabricated the arrest timing memo',
      'Do not agree to remand without advocate representation (State provides free legal aid)'
    ]
  }
];
