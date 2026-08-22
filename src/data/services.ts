import { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  {
    id: "legal-consultation-general",
    name: "General Legal Consultation",
    category: "Consultation",
    price: 999,
    originalPrice: 1500,
    duration: "30 Minutes Call",
    shortDescription: "One-on-one confidential telephone/video consultation with an Advocate to assess your legal matter.",
    fullDescription: "Get direct, practical legal guidance on any civil, criminal, corporate, or personal legal dispute. The consultation includes review of brief summary notes and actionable next steps.",
    popular: true,
    badge: "Most Popular",
    iconName: "PhoneCall",
    whatsIncluded: [
      "30-minute dedicated phone/video consultation with Advocate",
      "Preliminary review of up to 3 relevant documents",
      "Clarity on legal rights, applicable laws, and jurisdictional court",
      "Recommended roadmap & litigation/settlement strategy",
      "Summary of consultation notes sent via WhatsApp/Email"
    ],
    whatsNotIncluded: [
      "Drafting of petitions, plaints, or notices (available as separate services)",
      "Court appearances or filing of cases",
      "Representation before statutory authorities"
    ],
    processSteps: [
      { step: 1, title: "Book Service", desc: "Select service and submit your brief requirement." },
      { step: 2, title: "Advocate Connect", desc: "Advocate connects via WhatsApp to schedule the call time." },
      { step: 3, title: "Consultation", desc: "30-minute dedicated confidential session." },
      { step: 4, title: "Action Plan", desc: "Receive summary checklist & next legal steps." }
    ],
    faqs: [
      { question: "How quickly can the consultation be scheduled?", answer: "Usually within 2 to 4 hours during working hours (Mon-Sat, 9:30 AM to 7:30 PM)." },
      { question: "Can I share my documents beforehand?", answer: "Yes, you can share up to 3 documents via WhatsApp or Email before the call for the Advocate to review." },
      { question: "Is this consultation strictly confidential?", answer: "Yes, all consultations and shared documents are protected by strict advocate-client professional privilege." }
    ]
  },
  {
    id: "legal-notice-drafting",
    name: "Legal Notice Drafting",
    category: "Documentation",
    price: 1999,
    originalPrice: 2800,
    duration: "24-48 Hours",
    shortDescription: "Custom drafting of a formal, strongly phrased Legal Notice on Advocate letterhead for disputes.",
    fullDescription: "A legally sound formal notice drafted by an experienced Advocate to assert your claims, demand remedies, or warn the opposite party before initiating court proceedings.",
    popular: true,
    badge: "High Demand",
    iconName: "FileText",
    whatsIncluded: [
      "Custom drafting of formal Legal Notice on Advocate Letterhead",
      "Detailed factual review and statutory compliance under relevant Acts",
      "1 round of revisions and factual corrections",
      "Ready-to-send printable PDF draft + editable Word copy",
      "Guidance on dispatching via Registered Post / Speed Post / Email"
    ],
    whatsNotIncluded: [
      "Postal dispatch charges (can be arranged upon request)",
      "Reply drafting to counter-notice (available separately)",
      "Court filing fees if matter proceeds to litigation"
    ],
    processSteps: [
      { step: 1, title: "Share Facts", desc: "Provide dates, agreement details, amount owed, or dispute facts." },
      { step: 2, title: "Initial Draft", desc: "Advocate prepares first draft within 24-36 hours." },
      { step: 3, title: "Review & Revisions", desc: "You review the facts and suggest any corrections." },
      { step: 4, title: "Final Dispatch Ready", desc: "Receive finalized legal notice on letterhead." }
    ],
    faqs: [
      { question: "What types of disputes require a legal notice?", answer: "Money recovery, breach of contract, landlord-tenant disputes, employer salary non-payment, consumer deficiency, and copyright infringement." },
      { question: "Will the notice be on official Advocate letterhead?", answer: "Yes, the notice includes the Advocate's Bar Council registration details and official letterhead signature." }
    ]
  },
  {
    id: "rent-agreement-drafting",
    name: "Rent Agreement Drafting",
    category: "Property",
    price: 1299,
    originalPrice: 1999,
    duration: "Same Day (12-24 Hours)",
    shortDescription: "Customized residential or commercial Rent Agreement with legally binding clauses and protection.",
    fullDescription: "Draft a compliant, comprehensive rent agreement covering security deposit refund terms, lock-in period, maintenance obligations, termination notice, and dispute resolution mechanisms.",
    iconName: "Home",
    whatsIncluded: [
      "Comprehensive 11-month or multi-year rent agreement draft",
      "Custom clauses tailored to Landlord or Tenant requirements",
      "Clauses for maintenance, painting, notice period, and forfeiture",
      "Ready-to-print format for e-stamp paper execution",
      "Step-by-step guidance on notarization or registration"
    ],
    whatsNotIncluded: [
      "Government Stamp duty & e-stamp paper purchase cost",
      "Sub-Registrar office biometric appointment fees"
    ],
    processSteps: [
      { step: 1, title: "Fill Details", desc: "Share property address, rent amount, deposit, and parties' names." },
      { step: 2, title: "Draft Creation", desc: "Advocate drafts agreement with custom safeguards." },
      { step: 3, title: "Final Approval", desc: "Quick verification by both parties before printing." }
    ],
    faqs: [
      { question: "Is this suitable for both residential and commercial properties?", answer: "Yes, we customize clauses depending on whether the premise is a residential flat, independent house, office, or shop." }
    ]
  },
  {
    id: "leave-license-agreement",
    name: "Leave & License Agreement",
    category: "Property",
    price: 1499,
    originalPrice: 2200,
    duration: "24 Hours",
    shortDescription: "Legally enforceable Leave and License Agreement protecting ownership rights against tenancy claims.",
    fullDescription: "Crucial legal document granting permissive possession without creating tenancy rights, protecting property owners against adverse possession or long-term lease claims.",
    iconName: "Building2",
    whatsIncluded: [
      "State-specific Leave & License agreement clauses",
      "Explicit non-tenancy permissive possession clause",
      "Default penalties and expedited eviction remedies",
      "Custom escalation and utility payment terms"
    ],
    whatsNotIncluded: [
      "State government registration stamp charges"
    ],
    processSteps: [
      { step: 1, title: "Submit Particulars", desc: "Provide licensor and licensee details." },
      { step: 2, title: "Drafting", desc: "Tailored draft created by property legal specialist." },
      { step: 3, title: "Handover", desc: "Final PDF + docx delivery." }
    ],
    faqs: [
      { question: "How does Leave & License differ from a lease?", answer: "Leave & License creates a personal permission without creating an interest in the immovable property, making property repossession significantly easier." }
    ]
  },
  {
    id: "property-agreement-review",
    name: "Property Agreement Review",
    category: "Property",
    price: 2499,
    originalPrice: 3500,
    duration: "48 Hours",
    shortDescription: "Complete legal risk audit of Builder-Buyer agreements, Sale Deeds, or Allotment letters.",
    fullDescription: "Protect yourself from one-sided penalty clauses, delayed possession loopholes, title ambiguities, and unfair terms in builder or seller contracts before making large financial commitments.",
    popular: true,
    badge: "Recommended",
    iconName: "ShieldCheck",
    whatsIncluded: [
      "Clause-by-clause scrutiny of up to 25 pages agreement",
      "Identification of onerous, one-sided, or ambiguous clauses",
      "Specific recommended counter-clauses to protect buyer interests",
      "Written Legal Opinion & Risk Assessment Summary Report",
      "15-minute clarification call with the Advocate"
    ],
    whatsNotIncluded: [
      "Physical land registry / Sub-Registrar title search (can be quoted separately)",
      "Direct negotiation with the builder"
    ],
    processSteps: [
      { step: 1, title: "Upload Agreement", desc: "Share the draft agreement in PDF format." },
      { step: 2, title: "Scrutiny & Review", desc: "Advocate examines fine print, RERA compliance, and hidden covenants." },
      { step: 3, title: "Risk Report", desc: "Receive red-flag report with amendment suggestions." },
      { step: 4, title: "Debrief Call", desc: "Discuss findings directly with the Advocate." }
    ],
    faqs: [
      { question: "Can you review RERA registration details?", answer: "Yes, we verify if the project RERA clauses align with statutory requirements." }
    ]
  },
  {
    id: "affidavit-drafting",
    name: "Affidavit & Declaration Drafting",
    category: "Documentation",
    price: 799,
    originalPrice: 1200,
    duration: "Same Day (4-8 Hours)",
    shortDescription: "Legally binding Affidavits for name change, address proof, lost documents, marriage, or financial claims.",
    fullDescription: "Accurately structured sworn statements formatted to meet court, bank, passport office, university, or municipal government requirements.",
    iconName: "ScrollText",
    whatsIncluded: [
      "Custom affidavit drafting based on your specific declaration purpose",
      "Appropriate legal verbiage and verification clause",
      "Format ready for standard Notary Public attestation",
      "Instructions on stamp paper denomination required in your state"
    ],
    whatsNotIncluded: [
      "Physical stamp paper & Notary stamp cost"
    ],
    processSteps: [
      { step: 1, title: "Specify Purpose", desc: "State the purpose (e.g., Name correction, Address, Lost Marksheet)." },
      { step: 2, title: "Draft Delivery", desc: "Receive formatted affidavit draft within a few hours." }
    ],
    faqs: [
      { question: "Can this be used for Passport or Bank purposes?", answer: "Yes, the draft follows standard gazette/government accepted wording." }
    ]
  },
  {
    id: "consumer-complaint-drafting",
    name: "Consumer Complaint & Notice",
    category: "Consumer",
    price: 2199,
    originalPrice: 3000,
    duration: "48 Hours",
    shortDescription: "Drafting of statutory Consumer Legal Notice & District Consumer Commission petition.",
    fullDescription: "Take firm legal action against deficient services, defective goods, unfair trade practices, insurance claim rejections, airlines, e-commerce, or real estate delays under Consumer Protection Act 2019.",
    iconName: "Scale",
    whatsIncluded: [
      "Pre-litigation statutory Consumer Notice to company/service provider",
      "Drafting of formal Complaint Petition for e-Daakhil / District Commission",
      "Computation of compensation claim, refund, and mental harassment damages",
      "Filing guideline & document checklist for Consumer Forum"
    ],
    whatsNotIncluded: [
      "In-person appearance in Consumer Forum"
    ],
    processSteps: [
      { step: 1, title: "Share Invoices & Comms", desc: "Upload bills, email exchanges, and grievance history." },
      { step: 2, title: "Notice & Petition Draft", desc: "Advocate prepares formal claim with statutory penalty clauses." },
      { step: 3, title: "Filing Support", desc: "Receive guide to file online on e-Daakhil or physically." }
    ],
    faqs: [
      { question: "Can I file the consumer case myself without hiring a lawyer in court?", answer: "Yes! The Consumer Protection Act allows complainants to represent themselves. Our ready-made draft makes it simple." }
    ]
  },
  {
    id: "employment-agreement",
    name: "Employment & NDA Agreement",
    category: "Documentation",
    price: 1799,
    originalPrice: 2500,
    duration: "24-48 Hours",
    shortDescription: "Bulletproof Employment Contract with Non-Disclosure, Non-Compete, and IP Assignment clauses.",
    fullDescription: "Protect your proprietary business secrets, customer lists, and intellectual property when hiring employees, contractors, or key executives.",
    iconName: "Briefcase",
    whatsIncluded: [
      "Custom employment contract drafted for Indian Labour Law compliance",
      "Stringent Non-Disclosure Agreement (NDA) & confidentiality covenants",
      "Intellectual Property (IP) assignment to company",
      "Clear termination terms, notice period, and non-solicitation rules",
      "1 round of customization for specific company roles"
    ],
    whatsNotIncluded: [
      "Statutory PF/ESI registration filings"
    ],
    processSteps: [
      { step: 1, title: "Submit Role Profile", desc: "Share designation, compensation structure, and probation terms." },
      { step: 2, title: "Contract Draft", desc: "Drafting of comprehensive agreement." },
      { step: 3, title: "Review", desc: "Fine-tune specifics for company operations." }
    ],
    faqs: [
      { question: "Is Non-Compete enforceable in India?", answer: "Under Section 27 of Indian Contract Act, post-employment non-competes are restricted, but non-solicitation and strict NDA protection are fully enforceable." }
    ]
  },
  {
    id: "cheque-bounce-consultation",
    name: "Cheque Bounce (Sec 138) Advisory",
    category: "Criminal",
    price: 1499,
    originalPrice: 2000,
    duration: "30 Minutes Call + Notice Plan",
    shortDescription: "Specialized legal strategy and timeline management for dishonoured cheques under NI Act.",
    fullDescription: "Strict statutory 30-day limitation timelines apply to dishonoured cheques. Get immediate legal strategy from an advocate to safeguard your recovery rights before the limitation expires.",
    badge: "Time Sensitive",
    iconName: "AlertTriangle",
    whatsIncluded: [
      "Immediate limitation date calculation (30 days notice rule)",
      "Evidence review (Cheque return memo, bank slip, underlying invoice)",
      "Drafting strategy for Statutory Demand Notice under Section 138",
      "Roadmap for Criminal Complaint vs Summary Civil Suit (Order 37 CPC)"
    ],
    whatsNotIncluded: [
      "Filing before the Metropolitan Magistrate Court"
    ],
    processSteps: [
      { step: 1, title: "Share Cheque Memo", desc: "Provide cheque photo, return memo, and date of dishonour." },
      { step: 2, title: "Urgent Consultation", desc: "Advocate verifies strict limitation deadlines." },
      { step: 3, title: "Next Action", desc: "Issue statutory notice within mandatory 30-day window." }
    ],
    faqs: [
      { question: "What is the deadline to send a legal notice for a bounced cheque?", answer: "You MUST issue the statutory demand notice within 30 days of receiving the bank memo of dishonour." }
    ]
  },
  {
    id: "divorce-family-consultation",
    name: "Divorce & Family Law Consultation",
    category: "Family",
    price: 1499,
    originalPrice: 2000,
    duration: "40 Minutes Call",
    shortDescription: "Empathetic, strictly confidential consultation on mutual divorce, maintenance, custody, and mediation.",
    fullDescription: "Understand your rights, legal remedies, child custody laws, alimony/maintenance calculations, and mutual consent divorce procedures in complete privacy.",
    iconName: "HeartHandshake",
    whatsIncluded: [
      "40-minute confidential consultation with family law advocate",
      "Analysis of Mutual Consent Divorce vs Contested Petitions",
      "Guidance on alimony, interim maintenance, and property division",
      "Child custody and visitation rights advisory",
      "Mediation & amicable settlement recommendations"
    ],
    whatsNotIncluded: [
      "Court filing of petition or appearance in Family Court"
    ],
    processSteps: [
      { step: 1, title: "Book Private Session", desc: "Schedule a confidential call slot." },
      { step: 2, title: "Private Consultation", desc: "Detailed discussion on options, timeline, and emotional/financial protection." },
      { step: 3, title: "Legal Roadmap", desc: "Step-by-step checklist for amicable or contested resolution." }
    ],
    faqs: [
      { question: "How long does a Mutual Consent Divorce take?", answer: "Under Section 13B of Hindu Marriage Act, mutual divorce usually takes 6 months, though cooling-off periods can be waived upon application." }
    ]
  },
  {
    id: "business-corporate-consultation",
    name: "Business & Corporate Legal Advisory",
    category: "Business",
    price: 1999,
    originalPrice: 3000,
    duration: "45 Minutes Consultation",
    shortDescription: "Strategic legal counsel for startups, MSMEs, partnership disputes, vendor contracts, and compliance.",
    fullDescription: "Protect your venture from costly contract disputes, trademark infringement, shareholder deadlocks, and regulatory non-compliance with practical business-first legal advice.",
    popular: true,
    badge: "For Founders & MSMEs",
    iconName: "Building",
    whatsIncluded: [
      "45-minute deep-dive consultation with corporate legal specialist",
      "Review of founders' equity division / partnership agreement",
      "Risk analysis on vendor, client, or software master service agreements",
      "Regulatory & trademark protection overview",
      "Summary report with prioritized risk mitigation steps"
    ],
    whatsNotIncluded: [
      "Company registration government fees",
      "Formal trademark filing fees"
    ],
    processSteps: [
      { step: 1, title: "Share Business Context", desc: "Briefly describe your venture and specific legal queries." },
      { step: 2, title: "Strategic Session", desc: "Advocate provides pragmatic commercial legal advice." },
      { step: 3, title: "Action Plan", desc: "Receive contract checklist and compliance timeline." }
    ],
    faqs: [
      { question: "Can you help review our client master service agreement?", answer: "Yes, we analyze limitation of liability, payment terms, SLA breaches, and indemnity risks." }
    ]
  },
  {
    id: "civil-dispute-consultation",
    name: "Civil Dispute Consultation",
    category: "Civil",
    price: 1299,
    originalPrice: 1800,
    duration: "30 Minutes Call",
    shortDescription: "Strategic advice on property partition, money recovery, injunctions, and breach of contract.",
    fullDescription: "Get clarity on whether civil litigation, arbitration, or out-of-court mediation is the most cost-effective remedy for your civil or property dispute.",
    iconName: "Gavel",
    whatsIncluded: [
      "Assessment of civil suit jurisdiction and court fee calculations",
      "Remedies including Specific Performance, Injunction, and Damages",
      "Analysis of Limitation Act timelines",
      "Out-of-court mediation and arbitration advisory"
    ],
    whatsNotIncluded: [
      "Plaint drafting or court attendance"
    ],
    processSteps: [
      { step: 1, title: "Submit Case Summary", desc: "Provide overview of dispute facts." },
      { step: 2, title: "Consultation Call", desc: "Explore litigation costs, timeline, and chances of interim relief." },
      { step: 3, title: "Strategy Note", desc: "Receive clear roadmap." }
    ],
    faqs: [
      { question: "What is an injunction?", answer: "An injunction is a court order restraining the other party from altering property status, transferring title, or causing harm until the lawsuit is resolved." }
    ]
  },
  {
    id: "criminal-law-consultation",
    name: "Criminal Law & Bail Advisory",
    category: "Criminal",
    price: 1499,
    originalPrice: 2200,
    duration: "30 Minutes Urgent Advisory",
    shortDescription: "Urgent legal advisory on Anticipatory Bail, Regular Bail, FIR quashing, and police summons.",
    fullDescription: "Immediate guidance on rights during police interrogation, remedies against false FIRs under BNSS / CrPC, anticipatory bail applications, and protection orders.",
    badge: "Urgent Support",
    iconName: "ShieldAlert",
    whatsIncluded: [
      "Immediate assessment of FIR allegations and bailable/non-bailable offences",
      "Anticipatory bail eligibility and urgent filing strategy",
      "Protection from unlawful arrest (Arnesh Kumar guidelines)",
      "Remedies under Section 482 (High Court FIR Quashing)"
    ],
    whatsNotIncluded: [
      "Physical presence at police station or magistrate court"
    ],
    processSteps: [
      { step: 1, title: "Share FIR / Summons", desc: "Upload copy of FIR, complaint, or summons." },
      { step: 2, title: "Urgent Call", desc: "Advocate guides on immediate rights and safeguarding steps." },
      { step: 3, title: "Bail Roadmap", desc: "Drafting guidance for urgent bail application." }
    ],
    faqs: [
      { question: "Can I get Anticipatory Bail before being arrested?", answer: "Yes, you can approach the Sessions Court or High Court for Anticipatory Bail if there is a reasonable apprehension of arrest in a non-bailable offence." }
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Consultation',
  'Documentation',
  'Property',
  'Family',
  'Criminal',
  'Civil',
  'Business',
  'Consumer'
] as const;
