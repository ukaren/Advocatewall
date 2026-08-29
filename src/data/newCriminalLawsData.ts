export interface LawSectionMapping {
  id: string;
  topic: string;
  category: 'Offences Against Body' | 'Property & Fraud' | 'Women & Children' | 'Public Tranquility & State' | 'Criminal Procedure (BNSS)' | 'Evidence & Electronic Records (BSA)';
  oldAct: 'IPC 1860' | 'CrPC 1973' | 'IEA 1872';
  oldSection: string;
  oldTitle: string;
  newAct: 'BNS 2023' | 'BNSS 2023' | 'BSA 2023';
  newSection: string;
  newTitle: string;
  punishmentOld: string;
  punishmentNew: string;
  keyChanges: string[];
  cognizable: boolean;
  bailable: boolean;
  advocateNotes: string;
}

export const NEW_CRIMINAL_LAWS_MAPPINGS: LawSectionMapping[] = [
  {
    id: 'bns-murder',
    topic: 'Murder',
    category: 'Offences Against Body',
    oldAct: 'IPC 1860',
    oldSection: 'Section 302',
    oldTitle: 'Punishment for murder',
    newAct: 'BNS 2023',
    newSection: 'Section 103(1)',
    newTitle: 'Punishment for murder',
    punishmentOld: 'Death or imprisonment for life, and fine',
    punishmentNew: 'Death or imprisonment for life, and fine',
    keyChanges: [
      'Murder definition retained under Section 101 BNS.',
      'Section 103(2) introduced for Mob Lynching / Hate crime by 5 or more persons based on race, caste, community with death or life imprisonment.'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'For mob lynching cases, Section 103(2) BNS has specific mandatory penalties separate from generic Section 103(1).'
  },
  {
    id: 'bns-culpable-homicide',
    topic: 'Culpable Homicide not amounting to murder',
    category: 'Offences Against Body',
    oldAct: 'IPC 1860',
    oldSection: 'Section 304',
    oldTitle: 'Punishment for culpable homicide not amounting to murder',
    newAct: 'BNS 2023',
    newSection: 'Section 105',
    newTitle: 'Culpable homicide not amounting to murder',
    punishmentOld: 'Life imprisonment or up to 10 years + fine',
    punishmentNew: 'Life imprisonment or up to 10 years + fine (Part I) / Up to 7 years (Part II)',
    keyChanges: [
      'Separated clearly into Part I (with intention) and Part II (with knowledge).',
      'Hit and Run rash driving separated into Section 106(2) BNS with up to 10 years imprisonment if driver escapes without reporting.'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'Check if driver reported the accident to police or magistrate immediately to avoid Section 106(2) enhanced 10-year penalty.'
  },
  {
    id: 'bns-cheating',
    topic: 'Cheating & Dishonestly Inducing Delivery of Property',
    category: 'Property & Fraud',
    oldAct: 'IPC 1860',
    oldSection: 'Section 420',
    oldTitle: 'Cheating and dishonestly inducing delivery of property',
    newAct: 'BNS 2023',
    newSection: 'Section 318(4)',
    newTitle: 'Cheating and dishonestly inducing delivery of property',
    punishmentOld: 'Imprisonment up to 7 years and fine',
    punishmentNew: 'Imprisonment up to 7 years and fine',
    keyChanges: [
      'Replaced the iconic "Section 420" with Section 318(4) BNS.',
      'Simple cheating is under Section 318(2) (up to 3 years), cheating by personation under Section 319.'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'In commercial disputes, prove dishonest intention from inception to maintain criminal complaint under Section 318(4) BNS.'
  },
  {
    id: 'bns-rape',
    topic: 'Rape & Sexual Assault',
    category: 'Women & Children',
    oldAct: 'IPC 1860',
    oldSection: 'Section 376',
    oldTitle: 'Punishment for rape',
    newAct: 'BNS 2023',
    newSection: 'Section 64',
    newTitle: 'Punishment for rape',
    punishmentOld: 'Rigorous imprisonment not less than 10 years up to life imprisonment',
    punishmentNew: 'Rigorous imprisonment not less than 10 years up to life imprisonment + fine',
    keyChanges: [
      'Gang rape shifted to Section 70 BNS.',
      'Section 69 BNS explicitly criminalizes sexual intercourse by deceitful means or false promise of marriage (up to 10 years).'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'Section 69 BNS now codifies "deceitful promise of marriage" as a specific distinct offence from generic Section 64.'
  },
  {
    id: 'bns-theft',
    topic: 'Theft & Snatching',
    category: 'Property & Fraud',
    oldAct: 'IPC 1860',
    oldSection: 'Section 378 & 379',
    oldTitle: 'Theft and punishment for theft',
    newAct: 'BNS 2023',
    newSection: 'Section 303 & 304',
    newTitle: 'Theft and Snatching',
    punishmentOld: 'Imprisonment up to 3 years or fine or both',
    punishmentNew: 'Imprisonment up to 3 years or fine (Community service for petty theft under ₹5,000 upon return)',
    keyChanges: [
      'Snatching newly added as distinct defined offence under Section 304 BNS (up to 3 years + fine).',
      'Community service introduced for petty first-time theft of value under ₹5,000 under Section 303(2) proviso.'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'For theft valued under ₹5,000, advocates can plead for Community Service order instead of custodial jail time for first-time offenders.'
  },
  {
    id: 'bns-forgery',
    topic: 'Forgery of Documents / Electronic Records',
    category: 'Property & Fraud',
    oldAct: 'IPC 1860',
    oldSection: 'Section 465 / 468',
    oldTitle: 'Forgery & Forgery for purpose of cheating',
    newAct: 'BNS 2023',
    newSection: 'Section 336 / 338',
    newTitle: 'Forgery & Forgery for purpose of cheating',
    punishmentOld: 'Up to 2 years (465) / Up to 7 years (468) + fine',
    punishmentNew: 'Up to 2 years (336) / Up to 7 years (338) + fine',
    keyChanges: [
      'Includes digital signatures, metadata alteration, and digital fake certificates within definition of false document.'
    ],
    cognizable: false,
    bailable: true,
    advocateNotes: 'Electronic forged files must be certified with Section 63 BSA certificate for trial admissibility.'
  },
  {
    id: 'bns-defamation',
    topic: 'Defamation',
    category: 'Public Tranquility & State',
    oldAct: 'IPC 1860',
    oldSection: 'Section 499 & 500',
    oldTitle: 'Defamation and punishment for defamation',
    newAct: 'BNS 2023',
    newSection: 'Section 356',
    newTitle: 'Defamation',
    punishmentOld: 'Simple imprisonment up to 2 years or fine or both',
    punishmentNew: 'Simple imprisonment up to 2 years or fine or both OR Community Service',
    keyChanges: [
      'Community service introduced as an alternative punishment under Section 356(2) BNS.',
      'Maintains the 10 statutory exceptions protecting truth for public good and fair criticism.'
    ],
    cognizable: false,
    bailable: true,
    advocateNotes: 'Private complaint under Section 223 BNSS requires preliminary inquiry before issuing process against the accused.'
  },
  {
    id: 'bns-sedition-replacement',
    topic: 'Acts Endangering Sovereignty, Unity and Integrity of India (Replacing Sedition)',
    category: 'Public Tranquility & State',
    oldAct: 'IPC 1860',
    oldSection: 'Section 124A',
    oldTitle: 'Sedition',
    newAct: 'BNS 2023',
    newSection: 'Section 152',
    newTitle: 'Act endangering sovereignty, unity and integrity of India',
    punishmentOld: 'Imprisonment for life or up to 3 years + fine',
    punishmentNew: 'Imprisonment for life or up to 7 years + fine',
    keyChanges: [
      'The word "Sedition" completely omitted.',
      'Strictly penalizes exciting secession, armed rebellion, subversive activities, or endangering sovereignty.'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'Explanation clarifies that comments expressing disapprobation of govt measures without exciting armed rebellion or subversive acts do not constitute an offence.'
  },
  {
    id: 'bnss-fir',
    topic: 'Information in Cognizable Cases (FIR & Zero FIR / E-FIR)',
    category: 'Criminal Procedure (BNSS)',
    oldAct: 'CrPC 1973',
    oldSection: 'Section 154',
    oldTitle: 'Information in cognizable cases (FIR)',
    newAct: 'BNSS 2023',
    newSection: 'Section 173',
    newTitle: 'Information in cognizable cases (FIR, Zero FIR & E-FIR)',
    punishmentOld: 'Procedural section',
    punishmentNew: 'Mandatory Zero FIR & Electronic FIR registration',
    keyChanges: [
      'Section 173(1) expressly mandates Zero FIR registration irrespective of jurisdiction.',
      'Information can be given electronically (E-FIR), to be signed within 3 days.',
      'Preliminary enquiry allowed within 14 days for offences punishable between 3 to 7 years before FIR.'
    ],
    cognizable: true,
    bailable: false,
    advocateNotes: 'If police refuse FIR, Section 175(3) BNSS allows application to Superintendent of Police, followed by Section 175(4) application to Magistrate.'
  },
  {
    id: 'bnss-arrest',
    topic: 'Arrest of Persons & Safeguards',
    category: 'Criminal Procedure (BNSS)',
    oldAct: 'CrPC 1973',
    oldSection: 'Section 41 & 41A',
    oldTitle: 'When police may arrest without warrant / Notice of appearance',
    newAct: 'BNSS 2023',
    newSection: 'Section 35',
    newTitle: 'When police may arrest without warrant',
    punishmentOld: 'Procedural Section',
    punishmentNew: 'Enhanced safeguards and designated Police Officer',
    keyChanges: [
      'No arrest for offences punishable with less than 3 years without prior permission of an officer not below Deputy Superintendent of Police (DSP) for elderly/infirm.',
      'Designated Police Officer in every district and police station to display names and arrest details publicly.'
    ],
    cognizable: true,
    bailable: true,
    advocateNotes: 'Notice under Section 35(3) BNSS (formerly 41A CrPC) is mandatory before arrest in cases punishable with up to 7 years imprisonment (Arnesh Kumar guidelines codified).'
  },
  {
    id: 'bnss-bail',
    topic: 'Regular Bail & Anticipatory Bail',
    category: 'Criminal Procedure (BNSS)',
    oldAct: 'CrPC 1973',
    oldSection: 'Section 437, 438, 439',
    oldTitle: 'Bail in non-bailable offences & Anticipatory Bail',
    newAct: 'BNSS 2023',
    newSection: 'Section 480, 482, 483',
    newTitle: 'Bail in non-bailable offences & Anticipatory Bail',
    punishmentOld: 'Bail provisions',
    punishmentNew: 'First-time offender bail on 1/3rd sentence under Section 479 BNSS',
    keyChanges: [
      'Anticipatory Bail under Section 482 BNSS (formerly 438 CrPC).',
      'Special relief under Section 479 BNSS: First-time undertrial prisoner must be released on bond if undergone 1/3rd of maximum sentence.'
    ],
    cognizable: true,
    bailable: true,
    advocateNotes: 'Section 479 BNSS is a powerful tool for undertrial bail applications where the accused has spent 1/3rd of the term in judicial custody.'
  },
  {
    id: 'bsa-electronic-evidence',
    topic: 'Admissibility of Electronic Records (Replacing 65B Certificate)',
    category: 'Evidence & Electronic Records (BSA)',
    oldAct: 'IEA 1872',
    oldSection: 'Section 65B',
    oldTitle: 'Admissibility of electronic records',
    newAct: 'BSA 2023',
    newSection: 'Section 63',
    newTitle: 'Admissibility of electronic records',
    punishmentOld: 'Mandatory Section 65B Certificate',
    punishmentNew: 'Section 63 Certificate with Schedule format (Part A & Part B)',
    keyChanges: [
      'Electronic evidence given equal status as primary document under Section 57 BSA.',
      'Mandatory certificate prescribed in Schedule to BSA with details of hashing algorithm, device serials, and cryptographic integrity.'
    ],
    cognizable: false,
    bailable: false,
    advocateNotes: 'WhatsApp chats, emails, CCTV footage must be accompanied by the prescribed Section 63 BSA Schedule certificate for court exhibition.'
  }
];

export const NEW_ACTS_OVERVIEW = [
  {
    name: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
    replaces: 'Indian Penal Code, 1860 (IPC)',
    totalSections: '358 Sections (IPC had 511 Sections)',
    effectiveDate: '1st July 2024',
    highlights: [
      'Consolidated offences against women and children into Chapter V.',
      'Added Community Service as a non-custodial punishment for 6 petty offences.',
      'Codified Mob Lynching (Sec 103(2)) and Organized Crime (Sec 111).',
      'Replaced archaic Sedition with Section 152 (Endangering Sovereignty).'
    ]
  },
  {
    name: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
    replaces: 'Code of Criminal Procedure, 1973 (CrPC)',
    totalSections: '531 Sections (CrPC had 484 Sections)',
    effectiveDate: '1st July 2024',
    highlights: [
      'Mandatory Audio-Video recording for searches, seizures, and witness statements.',
      'Mandatory Forensic Investigation for offences punishable with 7+ years.',
      'Express statutory recognition of Zero FIR (Sec 173(1)) and E-FIR.',
      'Strict trial timelines: Judgment within 45 days of concluding arguments.'
    ]
  },
  {
    name: 'Bharatiya Sakshya Adhiniyam, 2023 (BSA)',
    replaces: 'Indian Evidence Act, 1872 (IEA)',
    totalSections: '170 Sections (IEA had 167 Sections)',
    effectiveDate: '1st July 2024',
    highlights: [
      'Electronic records recognized as primary evidence on par with physical documents.',
      'Expanded definition of documents to include server logs, cloud data, and emails.',
      'Prescribed statutory format for Section 63 electronic certification.',
      'Modernized rules regarding joint trial confessions and accomplice evidence.'
    ]
  }
];
