export interface LegalNoticeTemplate {
  id: string;
  title: string;
  category: 'Commercial & Dues' | 'Tenancy & Property' | 'Consumer & Deficiency' | 'Civil & Government' | 'Matrimonial & Family' | 'Agreements & Contracts';
  description: string;
  statutoryDays: number;
  governingAct: string;
  badge: string;
  defaultFields: {
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    dateOfTransaction: string;
    amountOrSubject: string;
    reasonOrDefault: string;
    specificDemand: string;
    chequeNumber?: string;
    chequeBank?: string;
    chequeReturnMemoDate?: string;
    chequeReturnReason?: string;
  };
  sampleDraftGenerator: (fields: any) => string;
}

export const LEGAL_NOTICE_TEMPLATES: LegalNoticeTemplate[] = [
  {
    id: 'sec-138-ni-act',
    title: 'Section 138 NI Act Cheque Bounce Notice',
    category: 'Commercial & Dues',
    description: 'Mandatory statutory 15-day demand notice sent within 30 days of receiving the Cheque Return Memo from the bank before filing criminal complaint under Section 138 of Negotiable Instruments Act, 1881.',
    statutoryDays: 15,
    governingAct: 'Section 138 & 142, Negotiable Instruments Act, 1881',
    badge: 'Criminal Statutory Demand',
    defaultFields: {
      senderName: 'M/s Rajesh Enterprise (Prop. Rajesh Kumar)',
      senderAddress: '42, Nehru Commercial Complex, New Delhi 110019',
      recipientName: 'Vikram Singh (Director, Alpha Infotech Pvt Ltd)',
      recipientAddress: 'Flat 302, Green Avenue, Sector 62, Noida, UP 201309',
      dateOfTransaction: '15/01/2026',
      amountOrSubject: '₹3,50,000/- (Rupees Three Lakh Fifty Thousand Only)',
      reasonOrDefault: 'Issuance of Cheque No. 458921 drawn on HDFC Bank towards discharge of legally enforceable debt for supply of IT equipment.',
      specificDemand: 'Make immediate payment of ₹3,50,000/- within 15 days of receipt of this notice, failing which criminal complaint under Section 138 NI Act and Section 318(4) of Bharatiya Nyaya Sanhita, 2023 will be instituted before the competent Metropolitan Magistrate.',
      chequeNumber: '458921',
      chequeBank: 'HDFC Bank Ltd, Connaught Place Branch',
      chequeReturnMemoDate: '05/02/2026',
      chequeReturnReason: 'Funds Insufficient / Exceeds Arrangement'
    },
    sampleDraftGenerator: (f) => `LEGAL DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 (AS AMENDED)

BY REGISTERED POST A.D. / SPEED POST / EMAIL

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}

TO,
${f.recipientName}
${f.recipientAddress}

SUBJECT: STATUTORY NOTICE OF DEMAND UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 FOR DISHONOUR OF CHEQUE NO. ${f.chequeNumber || '458921'} DATED ${f.dateOfTransaction} FOR AN AMOUNT OF ${f.amountOrSubject}.

Sir / Madam,

Under instructions and on behalf of my client, ${f.senderName}, having office/residence at ${f.senderAddress} (hereinafter referred to as "my Client"), I do hereby serve upon you this Statutory Legal Notice:

1. That in discharge of your legally enforceable debt and liability towards my Client for ${f.reasonOrDefault}, you had drawn and handed over Cheque No. ${f.chequeNumber || '458921'} dated ${f.dateOfTransaction} for a sum of ${f.amountOrSubject}, drawn on ${f.chequeBank || 'the bank'}.

2. That at the time of issuing the said cheque, you had expressly assured and represented to my Client that the cheque would be honoured upon presentation. Relying on your promise and assurance, my Client presented the said cheque for encashment through their banker.

3. That to my Client's utter shock and dismay, the said Cheque was returned unpaid and dishonoured by the bank vide Cheque Return Memo dated ${f.chequeReturnMemoDate || 'recent date'} with the remarks "${f.chequeReturnReason || 'Funds Insufficient'}".

4. That you were fully aware of the insufficiency of funds in your account, and you issued the said cheque with deliberate dishonest and fraudulent intention to cheat my Client.

5. THEREFORE, I, on behalf of my Client, hereby call upon you to make the full and final payment of the aforesaid cheque amount of ${f.amountOrSubject} to my Client within a period of 15 (FIFTEEN) DAYS from the date of receipt of this notice.

6. PLEASE NOTE that if you fail to make the aforesaid payment within the mandatory statutory period of 15 days, my Client shall be constrained to initiate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881 read with Section 318(4) of the Bharatiya Nyaya Sanhita, 2023 before the Court of the learned Metropolitan Magistrate / Judicial Magistrate, wherein you shall be liable for imprisonment for a term which may extend to two years, or with fine which may extend to twice the amount of the cheque, or with both, along with costs of this notice.

Yours faithfully,

ADVOCATE FOR THE COMPLAINANT / SENDER
Chamber / Office of Advocate
AdvocatWalla Legal Services`
  },
  {
    id: 'landlord-tenant-eviction',
    title: 'Landlord to Tenant Eviction & Rent Default Notice',
    category: 'Tenancy & Property',
    description: 'Statutory 15-day or 30-day notice under Section 106 of the Transfer of Property Act, 1882 terminating lease/tenancy due to default in rental arrears or expiry of license period.',
    statutoryDays: 15,
    governingAct: 'Section 106, Transfer of Property Act, 1882',
    badge: 'Property & Tenancy',
    defaultFields: {
      senderName: 'Smt. Anjali Mehra (Landlord / Owner)',
      senderAddress: 'House No. 12, Defence Colony, New Delhi 110024',
      recipientName: 'Mr. Deepak Verma (Tenant)',
      recipientAddress: 'Second Floor, House No. 12, Defence Colony, New Delhi 110024',
      dateOfTransaction: '01/04/2024',
      amountOrSubject: '₹1,20,000/- (Rent arrears for 4 months @ ₹30,000/month)',
      reasonOrDefault: 'Non-payment of monthly rent since October 2025 and unauthorized alteration of premises.',
      specificDemand: 'Vacate and deliver peaceful vacant possession of the demised premises within 15 days and clear outstanding rental arrears of ₹1,20,000/- along with interest @ 18% p.a.'
    },
    sampleDraftGenerator: (f) => `LEGAL NOTICE FOR TERMINATION OF TENANCY AND DEMAND FOR VACANT POSSESSION UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882

BY SPEED POST / REGISTERED POST WITH ACKNOWLEDGEMENT DUE

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}

TO,
${f.recipientName}
${f.recipientAddress}

SUBJECT: NOTICE FOR TERMINATION OF MONTH-TO-MONTH TENANCY AND DEMAND FOR VACANT POSSESSION AND CLEARANCE OF ARREARS OF RENT FOR PREMISES: ${f.recipientAddress}.

Sir / Madam,

Under instructions and on behalf of my client, ${f.senderName}, residing at ${f.senderAddress} (hereinafter referred to as "my Client / Landlord"), I do hereby serve upon you this Legal Notice:

1. That my Client is the absolute owner and landlord of the residential / commercial premises situated at ${f.recipientAddress} (hereinafter referred to as the "Demised Premises").

2. That the demised premises were let out to you on a monthly tenancy starting from ${f.dateOfTransaction}.

3. That you have committed persistent default in paying the agreed monthly rent. As of date, an amount of ${f.amountOrSubject} is due and outstanding against you towards ${f.reasonOrDefault}.

4. That despite repeated verbal requests and reminders by my Client, you have failed and neglected to clear the lawful dues and have violated the essential terms of tenancy.

5. NOW THEREFORE, through this notice, my Client hereby DETERMINES and TERMINATES your tenancy in respect of the Demised Premises upon the expiry of 15 (fifteen) days from the service of this notice upon you.

6. You are hereby called upon to:
   (a) Clear and pay the total outstanding rental arrears of ${f.amountOrSubject} to my Client; and
   (b) Hand over peaceful and vacant physical possession of the Demised Premises to my Client within 15 days of receipt of this notice.

7. TAKE FURTHER NOTICE that in default of compliance, my Client shall institute appropriate Eviction Suit / Summary proceedings for recovery of possession, arrears of rent, mesne profits/damages @ ₹2,000/- per day for unauthorized occupation, and legal costs at your entire risk.

Yours faithfully,

ADVOCATE FOR THE LANDLORD
AdvocatWalla Legal Services Portal`
  },
  {
    id: 'consumer-deficiency-notice',
    title: 'Consumer Protection Deficiency in Service Notice',
    category: 'Consumer & Deficiency',
    description: 'Pre-litigation legal notice served upon manufacturer, e-commerce company, builder, or service provider under Consumer Protection Act, 2019 for defective goods or deficiency in services.',
    statutoryDays: 15,
    governingAct: 'Consumer Protection Act, 2019',
    badge: 'Consumer Rights',
    defaultFields: {
      senderName: 'Amitabh Sen (Consumer)',
      senderAddress: 'B-404, Cyber Heights, Sector 50, Gurugram, Haryana',
      recipientName: 'The Managing Director, Zenith Electronics India Pvt Ltd',
      recipientAddress: 'Corporate Tower, Plot 88, Udyog Vihar, Gurugram, Haryana 122016',
      dateOfTransaction: '12/11/2025',
      amountOrSubject: '₹78,500/- (Invoice Amount + ₹50,000/- Compensation for mental agony)',
      reasonOrDefault: 'Defective Ultra-HD Smart Television unit delivering distorted display and complete failure of authorized service centre to repair or replace within warranty period.',
      specificDemand: 'Immediate 100% refund of ₹78,500/- along with ₹50,000/- compensation for harassment and deficiency in service within 15 days.'
    },
    sampleDraftGenerator: (f) => `LEGAL NOTICE UNDER THE CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND UNFAIR TRADE PRACTICE

BY REGISTERED POST A.D. / SPEED POST / EMAIL

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}

TO,
${f.recipientName}
${f.recipientAddress}

SUBJECT: LEGAL NOTICE FOR DEFICIENCY IN SERVICE, UNFAIR TRADE PRACTICE AND DEMAND FOR REFUND OF ${f.amountOrSubject}.

Sir / Madam,

Under instructions and on behalf of my client, ${f.senderName}, resident of ${f.senderAddress} (hereinafter referred to as "my Client / Consumer"), I do hereby serve you with this Legal Notice:

1. That my Client purchased/availed services on ${f.dateOfTransaction} from your company/establishment against lawful consideration.

2. That the goods/services provided were riddled with major defects and deficiencies, namely: ${f.reasonOrDefault}.

3. That my Client raised multiple service tickets and complaints with your customer care department, but you failed and neglected to rectify the defect, replace the product, or provide competent redressal, which constitutes gross "Deficiency in Service" under Section 2(11) and "Unfair Trade Practice" under Section 2(47) of the Consumer Protection Act, 2019.

4. That due to your negligence and failure, my Client has suffered immense financial loss, mental agony, inconvenience, and harassment.

5. THEREFORE, you are hereby called upon to comply with the following demands within 15 (FIFTEEN) DAYS of receipt of this notice:
   (i) ${f.specificDemand};
   (ii) Pay ₹10,000/- towards the cost of this legal notice.

6. TAKE NOTICE that failing compliance within 15 days, my Client shall file a Consumer Complaint before the District Consumer Disputes Redressal Commission (DCDRC) under Section 35 of the Consumer Protection Act, 2019 for refund, punitive damages, and litigation expenses.

Yours faithfully,

ADVOCATE FOR THE CONSUMER
AdvocatWalla Legal Services`
  },
  {
    id: 'sec-80-cpc-notice',
    title: 'Section 80 CPC Notice to Government / Public Officer',
    category: 'Civil & Government',
    description: 'Mandatory statutory 2-month (60-day) notice served to the Secretary to the Government or Public Officer prior to instituting a civil suit against the Government under Section 80 of Code of Civil Procedure, 1908.',
    statutoryDays: 60,
    governingAct: 'Section 80, Code of Civil Procedure, 1908',
    badge: 'Statutory 60-Day Notice',
    defaultFields: {
      senderName: 'M/s Shivalik Infrastructure Projects (Rep. by Partner Suresh Joshi)',
      senderAddress: 'Shop 15, Transport Nagar, Lucknow, UP 226012',
      recipientName: 'The Principal Secretary, Public Works Department (PWD), Govt. of Uttar Pradesh',
      recipientAddress: 'Secretariat, Vidhan Sabha Marg, Lucknow, UP 226001',
      dateOfTransaction: '20/08/2024',
      amountOrSubject: '₹18,45,000/- (Pending Running Account Contract Bills & Earnest Money Deposit)',
      reasonOrDefault: 'Arbitrary withholding of Final Bill payments for completed civil road construction work under Tender Agreement No. PWD/EE/2024/77.',
      specificDemand: 'Release payment of ₹18,45,000/- along with statutory interest @ 12% p.a. within 60 days of receipt of this notice.'
    },
    sampleDraftGenerator: (f) => `NOTICE UNDER SECTION 80 OF THE CODE OF CIVIL PROCEDURE, 1908

BY REGISTERED POST WITH ACKNOWLEDGEMENT DUE

Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}

TO,
1. ${f.recipientName}
   ${f.recipientAddress}

2. THE COLLECTOR / DISTRICT MAGISTRATE
   Lucknow, Uttar Pradesh

SUBJECT: STATUTORY NOTICE UNDER SECTION 80 OF THE CODE OF CIVIL PROCEDURE, 1908 PRIOR TO INSTITUTING SUIT FOR RECOVERY OF ${f.amountOrSubject} AND DAMAGES.

Sir,

Under instructions and on behalf of my client, ${f.senderName}, having its principal place of business at ${f.senderAddress} (hereinafter referred to as "the Intending Plaintiff / my Client"), I do hereby serve upon you this Statutory Notice under Section 80 CPC:

1. CAUSE OF ACTION & FACTS:
   That my Client entered into contract/transaction dated ${f.dateOfTransaction} with the Department. My Client duly executed all assigned works in full compliance with the tender specifications.

2. GRIEVANCE & ILLEGAL WITHHOLDING:
   ${f.reasonOrDefault}. Despite multiple representations and clearance of inspection audits, the Department has unlawfully and arbitrarily withheld the rightful dues of my Client.

3. RELIEF INTENDED TO BE CLAIMED IN THE PROPOSED SUIT:
   (a) Money Decree for an amount of ${f.amountOrSubject} against the State Government;
   (b) Interest pendent-lite and future interest @ 12% p.a. from the date of default until realization;
   (c) Full costs of the suit.

4. YOU ARE HEREBY CALLED UPON to redress the grievance and release the sum of ${f.amountOrSubject} along with interest within the statutory period of 2 (TWO) MONTHS from the service of this notice upon you.

5. PLEASE TAKE NOTICE that if the relief claimed is not granted within 60 days, my Client shall proceed to file a Civil Suit for Recovery and Mandatory Injunction in the Court of Civil Judge (Senior Division) at your risk as to costs and consequences.

Yours faithfully,

ADVOCATE FOR THE INTENDING PLAINTIFF
AdvocatWalla Legal Services`
  }
];

export const STATE_STAMP_DUTY_CALCULATOR_DATA = [
  { state: 'Delhi (NCT)', agreementDuty: '₹100 (General) / ₹500 (Commercial)', giftDeed: '4% (Women) / 6% (Men) of Circle Rate', affidavitNotary: '₹10 - ₹50 e-Stamp', courtFeeCheque: '1% - 2% ad-valorem (Cap ₹5,000)' },
  { state: 'Maharashtra', agreementDuty: '₹500 (Standard) / 0.2% on loan', giftDeed: '3% (Family) / 5% (Others)', affidavitNotary: '₹100 e-Stamp', courtFeeCheque: 'As per Bombay Court Fees Act Schedule I' },
  { state: 'Karnataka', agreementDuty: '₹200 - ₹500', giftDeed: '2% - 5% + Cess', affidavitNotary: '₹20 - ₹100 e-Stamp', courtFeeCheque: 'Karnataka Court Fees and Suits Valuation Act' },
  { state: 'Uttar Pradesh', agreementDuty: '₹100 (General) / ₹500', giftDeed: '5% (Women) / 7% (Men) / Fixed for blood relatives', affidavitNotary: '₹10 - ₹100 e-Stamp', courtFeeCheque: 'Fixed + ad-valorem scale' },
  { state: 'Haryana', agreementDuty: '₹100 - ₹500', giftDeed: '5% (Men) / 3% (Women)', affidavitNotary: '₹10 - ₹50 e-Stamp', courtFeeCheque: 'Punjab & Haryana Court Fees Schedule' },
  { state: 'West Bengal', agreementDuty: '₹100 - ₹500', giftDeed: '0.5% (Family) / 5% (Others)', affidavitNotary: '₹10 - ₹50 e-Stamp', courtFeeCheque: 'WB Court Fees Act' }
];
