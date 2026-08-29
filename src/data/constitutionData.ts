export interface ConstitutionArticle {
  number: string;
  title: string;
  part: string;
  partName: string;
  category: 'Fundamental Rights' | 'DPSP' | 'Fundamental Duties' | 'Judiciary & Writs' | 'Executive & Parliament' | 'Emergency Provisions' | 'Amendments & Union' | 'Finance & Property';
  summary: string;
  keyClauses: string[];
  advocateTip: string;
  landmarkCases?: string[];
  popularKeywords: string[];
}

export interface ConstitutionPart {
  number: string;
  roman: string;
  name: string;
  articlesRange: string;
  description: string;
}

export interface ConstitutionSchedule {
  number: number;
  title: string;
  description: string;
  keyArticles: string;
}

export interface LandmarkJudgment {
  caseName: string;
  year: number;
  court: string;
  constitutionalRule: string;
  impact: string;
  relevantArticles: string[];
}

export const PREAMBLE_DATA = {
  title: "Preamble to the Constitution of India",
  text: `WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:
JUSTICE, social, economic and political;
LIBERTY of thought, expression, belief, faith and worship;
EQUALITY of status and of opportunity;
and to promote among them all
FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;
IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.`,
  adoptedDate: "26 November 1949 (Constitution Day / Samvidhan Divas)",
  enforcedDate: "26 January 1950 (Republic Day)",
  draftingCommitteeHead: "Dr. B.R. Ambedkar (Father of Indian Constitution)",
  keyPillars: [
    { term: "SOVEREIGN", meaning: "India is supreme internally and independent externally, free from any foreign rule or dictate." },
    { term: "SOCIALIST", meaning: "Added by 42nd Amendment (1976), aiming to eliminate inequality in income, status, and standard of life through democratic means." },
    { term: "SECULAR", meaning: "Added by 42nd Amendment (1976), all religions in India receive equal respect, protection, and state neutrality." },
    { term: "DEMOCRATIC", meaning: "Government is elected by the people through adult universal franchise with rule of law." },
    { term: "REPUBLIC", meaning: "The Head of State (President of India) is elected, not hereditary." },
    { term: "JUSTICE", meaning: "Social (no discrimination), Economic (equitable distribution), and Political (equal political access)." },
    { term: "LIBERTY", meaning: "Freedom of thought, expression, belief, faith, and worship protected under Fundamental Rights." },
    { term: "EQUALITY", meaning: "Absence of special privileges and provision of adequate opportunities for all individuals." },
    { term: "FRATERNITY", meaning: "Sense of common brotherhood among all Indians, assuring human dignity and national integrity." }
  ]
};

export const CONSTITUTION_PARTS: ConstitutionPart[] = [
  { number: "1", roman: "Part I", name: "The Union and its Territory", articlesRange: "Articles 1 – 4", description: "Name and territory of the Union, admission or establishment of new States, alteration of areas, boundaries, or names." },
  { number: "2", roman: "Part II", name: "Citizenship", articlesRange: "Articles 5 – 11", description: "Citizenship at the commencement of the Constitution, rights of citizenship for migrants, single citizenship principles." },
  { number: "3", roman: "Part III", name: "Fundamental Rights", articlesRange: "Articles 12 – 35", description: "Enforceable basic human and constitutional rights: Equality, Freedom, Against Exploitation, Religious Freedom, Cultural & Educational Rights, Constitutional Remedies." },
  { number: "4", roman: "Part IV", name: "Directive Principles of State Policy (DPSP)", articlesRange: "Articles 36 – 51", description: "Fundamental guidelines and socio-economic goals for the State in governance and policy formulation." },
  { number: "4A", roman: "Part IV-A", name: "Fundamental Duties", articlesRange: "Article 51A", description: "11 moral and civic obligations expected of every citizen of India toward the nation and fellow citizens." },
  { number: "5", roman: "Part V", name: "The Union Government", articlesRange: "Articles 52 – 151", description: "President, Vice-President, Prime Minister & Council of Ministers, Attorney-General, Parliament, Supreme Court of India, CAG." },
  { number: "6", roman: "Part VI", name: "The State Governments", articlesRange: "Articles 152 – 237", description: "Governor, Chief Minister, State Council of Ministers, State Legislatures, High Courts of States, Subordinate Courts." },
  { number: "8", roman: "Part VIII", name: "The Union Territories", articlesRange: "Articles 239 – 242", description: "Administration of Union Territories, Special provisions for National Capital Territory of Delhi (Art 239AA)." },
  { number: "9", roman: "Part IX", name: "The Panchayats", articlesRange: "Articles 243 – 243O", description: "Three-tier local self-governance in rural areas, Gram Sabhas, reservation of seats, powers, and taxation." },
  { number: "9A", roman: "Part IX-A", name: "The Municipalities", articlesRange: "Articles 243P – 243ZG", description: "Urban local self-governance: Nagar Panchayats, Municipal Councils, Municipal Corporations, Ward Committees." },
  { number: "9B", roman: "Part IX-B", name: "The Co-operative Societies", articlesRange: "Articles 243ZH – 243ZT", description: "Incorporation, regulation, management, and audit of co-operative societies." },
  { number: "10", roman: "Part X", name: "The Scheduled and Tribal Areas", articlesRange: "Articles 244 – 244A", description: "Special administrative mechanisms for 5th and 6th Schedule areas to safeguard tribal autonomy." },
  { number: "11", roman: "Part XI", name: "Relations between the Union and the States", articlesRange: "Articles 245 – 263", description: "Legislative powers (Union, State, Concurrent lists), administrative relations, Inter-State Council." },
  { number: "12", roman: "Part XII", name: "Finance, Property, Contracts and Suits", articlesRange: "Articles 264 – 300A", description: "Taxes, Consolidated Fund, Finance Commission, Borrowing, Right to Property as a Constitutional Right (Art 300A)." },
  { number: "13", roman: "Part XIII", name: "Trade, Commerce and Intercourse", articlesRange: "Articles 301 – 307", description: "Freedom of trade, commerce, and intercourse throughout the territory of India and reasonable restrictions." },
  { number: "14", roman: "Part XIV", name: "Services under Union and States", articlesRange: "Articles 308 – 323", description: "Public Services, UPSC, State Public Service Commissions, tenure and conditions of civil servants." },
  { number: "14A", roman: "Part XIV-A", name: "Tribunals", articlesRange: "Articles 323A – 323B", description: "Administrative Tribunals (CAT) and Tribunals for other matters (taxation, land, labour, elections)." },
  { number: "15", roman: "Part XV", name: "Elections", articlesRange: "Articles 324 – 329A", description: "Election Commission of India, universal adult suffrage, bar to interference by courts in electoral matters." },
  { number: "16", roman: "Part XVI", name: "Special Provisions Relating to Certain Classes", articlesRange: "Articles 330 – 342A", description: "Reservations for SCs, STs, and OBC commissions in Lok Sabha, Legislative Assemblies, and public appointments." },
  { number: "17", roman: "Part XVII", name: "Official Language", articlesRange: "Articles 343 – 351", description: "Official language of the Union (Hindi in Devanagari script), language of Supreme Court & High Courts, promotion of Hindi." },
  { number: "18", roman: "Part XVIII", name: "Emergency Provisions", articlesRange: "Articles 352 – 360", description: "National Emergency (Art 352), President's Rule in States (Art 356), and Financial Emergency (Art 360)." },
  { number: "19", roman: "Part XIX", name: "Miscellaneous", articlesRange: "Articles 361 – 367", description: "Protection of President and Governors, immunity from criminal proceedings, major ports and aerodromes." },
  { number: "20", roman: "Part XX", name: "Amendment of the Constitution", articlesRange: "Article 368", description: "Power of Parliament to amend the Constitution and procedure thereof subject to the Basic Structure Doctrine." },
  { number: "21", roman: "Part XXI", name: "Temporary, Transitional and Special Provisions", articlesRange: "Articles 369 – 392", description: "Special provisions for Maharashtra, Gujarat, Nagaland, Assam, Manipur, Andhra, Sikkim, Mizoram, Arunachal, Goa." },
  { number: "22", roman: "Part XXII", name: "Short Title, Commencement and Repeals", articlesRange: "Articles 393 – 395", description: "Short title 'Constitution of India', Hindi authoritative text, and repeal of Indian Independence Act 1947." }
];

export const KEY_CONSTITUTION_ARTICLES: ConstitutionArticle[] = [
  {
    number: "Article 12",
    title: "Definition of 'State'",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Defines the entities against whom Fundamental Rights can be enforced. Includes the Government of India, Parliament, State Governments, State Legislatures, local authorities (Municipalities, Panchayats), and statutory/public corporations.",
    keyClauses: [
      "Government and Parliament of India",
      "Government and the Legislature of each of the States",
      "All local or other authorities within the territory of India or under the control of the Government of India"
    ],
    advocateTip: "To file a Writ Petition under Article 32 or 226, the respondent must qualify as 'State' under the Ajay Hasia or Pradeep Kumar Biswas tests.",
    landmarkCases: ["Ajay Hasia v. Khalid Mujib (1981)", "Pradeep Kumar Biswas v. Indian Institute of Chemical Biology (2002)"],
    popularKeywords: ["State definition", "writ against private body", "instrumentality of state", "Article 12"]
  },
  {
    number: "Article 13",
    title: "Laws Inconsistent with or in Derogation of Fundamental Rights (Judicial Review)",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Declares that all pre-constitutional and post-constitutional laws that violate Fundamental Rights are void to the extent of such inconsistency. Establishes the constitutional foundation of Judicial Review.",
    keyClauses: [
      "All laws in force in India before the commencement of this Constitution, so far as they are inconsistent with Part III, shall be void.",
      "The State shall not make any law which takes away or abridges the rights conferred by this Part.",
      "Law includes any Ordinance, order, bye-law, rule, regulation, notification, custom, or usage."
    ],
    advocateTip: "Use Doctrine of Severability (AK Gopalan case) or Doctrine of Eclipse (Bhikaji case) when challenging unconstitutional legislative provisions.",
    landmarkCases: ["Kesavananda Bharati v. State of Kerala (1973)", "Minerva Mills v. Union of India (1980)"],
    popularKeywords: ["judicial review", "void law", "doctrine of severability", "doctrine of eclipse", "Article 13"]
  },
  {
    number: "Article 14",
    title: "Equality Before Law & Equal Protection of the Laws",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Guarantees that the State shall not deny to any person equality before the law or equal protection of the laws within the territory of India. Strikes down arbitrary, unreasonable, or discriminatory state action.",
    keyClauses: [
      "Equality before law (Negative concept: No person is above the law)",
      "Equal protection of laws (Positive concept: Equal laws for persons similarly circumstanced)",
      "Prohibits arbitrariness (E.P. Royappa doctrine: Equality is dynamic and antithetic to arbitrariness)"
    ],
    advocateTip: "To establish an Article 14 violation in government tenders, service rules, or license cancellations, prove either manifest arbitrariness or irrational classification.",
    landmarkCases: ["E.P. Royappa v. State of Tamil Nadu (1974)", "Shayara Bano v. Union of India (Triple Talaq, 2017)"],
    popularKeywords: ["right to equality", "arbitrary action", "equal protection", "article 14 challenge"]
  },
  {
    number: "Article 15",
    title: "Prohibition of Discrimination on Grounds of Religion, Race, Caste, Sex, or Place of Birth",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Prohibits discrimination against any citizen on grounds only of religion, race, caste, sex, place of birth. Allows special provisions for women, children, socially and educationally backward classes (SEBC), SCs, STs, and EWS.",
    keyClauses: [
      "No citizen shall be subjected to disability, liability, restriction regarding access to shops, public restaurants, hotels, and places of public entertainment.",
      "Special provisions for women and children (Art 15(3)).",
      "Special provisions for advancement of SC/ST/OBCs (Art 15(4), 15(5)) and Economically Weaker Sections (EWS - Art 15(6))."
    ],
    advocateTip: "Article 15(3) empowers courts and state to create protective legislation for women such as workplace protection and domestic violence remedies.",
    landmarkCases: ["Indra Sawhney v. Union of India (1992)", "Janki Prasad Parimoo v. State of J&K (1973)"],
    popularKeywords: ["discrimination", "reservation", "EWS reservation", "gender justice", "Article 15"]
  },
  {
    number: "Article 16",
    title: "Equality of Opportunity in Matters of Public Employment",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Guarantees equal opportunity for all citizens in matters relating to employment or appointment to any office under the State. Regulates reservation quotas and roster systems.",
    keyClauses: [
      "No citizen shall, on grounds only of religion, race, caste, sex, descent, place of birth, residence, be ineligible for public employment.",
      "Permits reservations for backward classes not adequately represented in state services (Art 16(4)).",
      "Enables 10% reservation for Economically Weaker Sections (EWS - Art 16(6))."
    ],
    advocateTip: "50% ceiling rule on reservations laid down in Indra Sawhney remains the governing benchmark unless exceptional circumstances are proven.",
    landmarkCases: ["Indra Sawhney (Mandal Case, 1992)", "M. Nagaraj v. Union of India (2006)", "Jarnail Singh v. Lachhmi Narain Gupta (2018)"],
    popularKeywords: ["government job reservation", "public employment", "creamy layer", "Article 16"]
  },
  {
    number: "Article 19",
    title: "Protection of Six Democratic Freedoms",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Guarantees 6 core freedoms to Indian citizens: (a) Speech and expression, (b) Peaceful assembly without arms, (c) Forming associations/unions/co-operatives, (d) Free movement across India, (e) Residing and settling anywhere in India, (g) Practicing any profession, trade, or business. Subject to reasonable restrictions under Clauses (2) to (6).",
    keyClauses: [
      "19(1)(a): Freedom of speech and expression (includes freedom of press, commercial speech, right to know)",
      "19(1)(b): Right to assemble peacefully and without arms",
      "19(1)(c): Right to form associations, unions, or co-operative societies",
      "19(1)(d): Right to move freely throughout the territory of India",
      "19(1)(e): Right to reside and settle in any part of India",
      "19(1)(g): Right to practise any profession, trade, or business",
      "Clauses 19(2)-(6): Reasonable restrictions on grounds of sovereignty, security of State, public order, decency, morality, contempt of court, defamation."
    ],
    advocateTip: "To defend against criminal defamation (Sec 499 IPC) or internet bans, invoke proportionality test under Article 19(1)(a) as established in Anuradha Bhasin v. UOI.",
    landmarkCases: ["Romesh Thappar v. State of Madras (1950)", "Shreya Singhal v. Union of India (Sec 66A struck down, 2015)", "Anuradha Bhasin v. Union of India (2020)"],
    popularKeywords: ["freedom of speech", "freedom of press", "right to protest", "reasonable restrictions", "trade freedom", "Article 19"]
  },
  {
    number: "Article 20",
    title: "Protection in Respect of Conviction for Offences",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Crucial shield for accused persons providing three vital protections: (1) Protection against Ex-Post Facto Law (no retrospective criminal punishment), (2) Protection against Double Jeopardy (cannot be prosecuted and punished twice for the same offence), (3) Protection against Self-Incrimination (cannot be compelled to be a witness against oneself).",
    keyClauses: [
      "20(1): No person shall be convicted except for violation of law in force at the time of the act (Ex-post facto protection).",
      "20(2): No person shall be prosecuted and punished for the same offence more than once (Double Jeopardy / Nemo debet bis vexari).",
      "20(3): No person accused of any offence shall be compelled to be a witness against himself (Right to silence / Self-incrimination)."
    ],
    advocateTip: "Involuntary narco-analysis, polygraph, or brain mapping tests without consent violate Article 20(3) as held in the landmark Selvi v. State of Karnataka ruling.",
    landmarkCases: ["Selvi v. State of Karnataka (2010)", "Kedar Nath v. State of West Bengal (1953)", "Maqbool Hussain v. State of Bombay (1953)"],
    popularKeywords: ["double jeopardy", "right to silence", "narco test legality", "self incrimination", "ex post facto", "Article 20"]
  },
  {
    number: "Article 21",
    title: "Protection of Life and Personal Liberty (The Golden Article)",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "No person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has expanded Article 21 to encompass Right to Privacy, Right to Clean Environment, Right to Speedy Trial, Right to Legal Aid, Right to Health, and Right to Dignity.",
    keyClauses: [
      "Protects both citizens and foreigners against arbitrary executive and legislative action.",
      "Procedure must be 'just, fair, and reasonable' (Maneka Gandhi doctrine importing substantive Due Process).",
      "Subsumed Rights: Right to Privacy (Puttaswamy), Right to Livelihood (Olga Tellis), Right to Bail (Babu Singh), Right to Medical Care (Parmanand Katara), Right against Solitary Confinement (Sunil Batra)."
    ],
    advocateTip: "Article 21 is non-derogable even during a National Emergency (44th Amendment 1978). In bail hearings, argue 'Bail is the rule, jail is the exception' grounded in Article 21.",
    landmarkCases: [
      "Maneka Gandhi v. Union of India (1978)",
      "K.S. Puttaswamy v. Union of India (Right to Privacy, 2017)",
      "Navtej Singh Johar v. Union of India (Decriminalizing Sec 377, 2018)",
      "Olga Tellis v. Bombay Municipal Corporation (1985)"
    ],
    popularKeywords: ["right to life", "personal liberty", "right to privacy", "bail jurisprudence", "due process", "human dignity", "Article 21"]
  },
  {
    number: "Article 21A",
    title: "Right to Free and Compulsory Elementary Education",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Inserted by the 86th Constitutional Amendment Act (2002). Directs the State to provide free and compulsory education to all children between the ages of 6 and 14 years in such manner as the State may determine. Led to the Right to Education (RTE) Act 2009.",
    keyClauses: [
      "Mandatory free education for children aged 6 to 14 years.",
      "25% reservation for underprivileged children in private unaided schools under Section 12(1)(c) of RTE Act.",
      "Corresponds to Fundamental Duty under Article 51A(k) for parents/guardians."
    ],
    advocateTip: "Private schools cannot deny admission under RTE quota on arbitrary grounds of documentation if domicile and income criteria are met.",
    landmarkCases: ["Society for Unaided Private Schools of Rajasthan v. Union of India (2012)", "Mohini Jain v. State of Karnataka (1992)"],
    popularKeywords: ["right to education", "RTE admission", "free education 6-14", "86th amendment", "Article 21A"]
  },
  {
    number: "Article 22",
    title: "Protection Against Arrest and Detention",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Safeguards rights of arrested individuals: (1) Right to be informed of grounds of arrest as soon as possible, (2) Right to consult and be defended by a legal practitioner of choice, (3) Mandatory production before the nearest Magistrate within 24 hours (excluding travel time), (4) Detention beyond 24 hours only with Magistrate's authorization.",
    keyClauses: [
      "22(1): Right to grounds of arrest and legal representation.",
      "22(2): Mandatory production before judicial magistrate within 24 hours.",
      "22(4)-(7): Safeguards and Advisory Board provisions under Preventive Detention laws (UAPA, PSA, NSA)."
    ],
    advocateTip: "If police fail to produce the accused before a Magistrate within 24 hours of detention, immediately file a Habeas Corpus petition under Article 226 before the High Court.",
    landmarkCases: ["D.K. Basu v. State of West Bengal (Arrest Guidelines, 1997)", "Arnesh Kumar v. State of Bihar (Notice under Sec 41A CrPC, 2014)"],
    popularKeywords: ["arrest rights", "24 hours magistrate", "DK Basu guidelines", "preventive detention", "Article 22"]
  },
  {
    number: "Article 25 – 28",
    title: "Right to Freedom of Religion",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Fundamental Rights",
    summary: "Guarantees all persons equal entitlement to freedom of conscience and the right freely to profess, practise, and propagate religion (Art 25), manage religious affairs (Art 26), freedom from payment of taxes for promotion of any particular religion (Art 27), and freedom as to attendance at religious instruction in educational institutions (Art 28).",
    keyClauses: [
      "Article 25(1): Freedom of conscience and free profession, practice, and propagation of religion.",
      "Subject to public order, morality, and health, and other provisions of Part III.",
      "Essential Religious Practices (ERP) doctrine: State can regulate secular economic/political activities associated with religious practice."
    ],
    advocateTip: "Religious propagation does not include forced, fraudulent, or allured conversions as held in Rev. Stainislaus v. State of MP.",
    landmarkCases: ["Indian Young Lawyers Association (Sabarimala Case, 2018)", "Bijoe Emmanuel v. State of Kerala (National Anthem, 1986)", "Shayara Bano (2017)"],
    popularKeywords: ["freedom of religion", "secularism", "sabarimala verdict", "essential religious practices", "Article 25"]
  },
  {
    number: "Article 32",
    title: "Right to Constitutional Remedies ('The Heart and Soul of the Constitution')",
    part: "Part III",
    partName: "Fundamental Rights",
    category: "Judiciary & Writs",
    summary: "Empowers citizens to move the Supreme Court directly by appropriate proceedings for the enforcement of Fundamental Rights. Dr. B.R. Ambedkar called Article 32 the 'Heart and Soul of the Indian Constitution'. Supreme Court has the power to issue five prerogative writs: Habeas Corpus, Mandamus, Prohibition, Quo Warranto, and Certiorari.",
    keyClauses: [
      "Right to move the Supreme Court for enforcement of Fundamental Rights is itself a guaranteed Fundamental Right.",
      "Power of the Supreme Court to issue directions, orders, or writs.",
      "5 Writs: 1. Habeas Corpus (Produce the body / illegal detention), 2. Mandamus (Command a public official to perform statutory duty), 3. Quo Warranto (Challenge illegal usurpation of public office), 4. Prohibition (Stop subordinate court from exceeding jurisdiction), 5. Certiorari (Quash illegal order passed without jurisdiction)."
    ],
    advocateTip: "While Article 32 only enforces Fundamental Rights in the Supreme Court, Article 226 in the High Courts has a wider ambit covering both Fundamental Rights and any legal right.",
    landmarkCases: ["Romesh Thappar (1950)", "Bandhua Mukti Morcha (Bonded Labour PIL, 1984)", "SP Gupta v. Union of India (Locus Standi & PIL revolution, 1981)"],
    popularKeywords: ["habeas corpus", "mandamus", "certiorari", "quo warranto", "writ petition supreme court", "Article 32", "heart and soul"]
  },
  {
    number: "Article 39A",
    title: "Equal Justice and Free Legal Aid",
    part: "Part IV",
    partName: "Directive Principles",
    category: "DPSP",
    summary: "Added by 42nd Amendment (1976). Directs the State to secure that the operation of the legal system promotes justice on a basis of equal opportunity, and shall, in particular, provide free legal aid by suitable legislation to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities. Led to the Legal Services Authorities Act, 1987 (NALSA/DSLSA).",
    keyClauses: [
      "Equal justice regardless of economic vulnerability.",
      "Duty of State to provide free advocate representation to indigent accused, women, children, and custody prisoners.",
      "Statutory foundation of Lok Adalats and NALSA."
    ],
    advocateTip: "Any accused unable to afford a private advocate has a constitutional entitlement under Art 39A read with Art 21 to state-funded legal counsel at all stages.",
    landmarkCases: ["Hussainara Khatoon v. Home Secretary, State of Bihar (1979)", "Khatri v. State of Bihar (1981)"],
    popularKeywords: ["free legal aid", "NALSA", "legal service authority", "indigent justice", "Article 39A"]
  },
  {
    number: "Article 44",
    title: "Uniform Civil Code for the Citizens (UCC)",
    part: "Part IV",
    partName: "Directive Principles",
    category: "DPSP",
    summary: "The State shall endeavour to secure for the citizens a Uniform Civil Code throughout the territory of India, governing personal matters like marriage, divorce, maintenance, inheritance, and succession across all religious communities.",
    keyClauses: [
      "Harmonization of personal civil laws.",
      "Promotion of national integration and gender equality in property/inheritance rights.",
      "Non-justiciable Directive Principle guiding national legislation."
    ],
    advocateTip: "Supreme Court has repeatedly exhorted the legislature to implement UCC principles in landmark rulings like Shah Bano (1985) and Sarla Mudgal (1995).",
    landmarkCases: ["Mohd. Ahmed Khan v. Shah Bano Begum (1985)", "Sarla Mudgal v. Union of India (1995)", "Shayara Bano (2017)"],
    popularKeywords: ["uniform civil code", "UCC", "personal laws", "marriage and succession", "Article 44"]
  },
  {
    number: "Article 51A",
    title: "Fundamental Duties of Indian Citizens (11 Duties)",
    part: "Part IV-A",
    partName: "Fundamental Duties",
    category: "Fundamental Duties",
    summary: "Added by 42nd Amendment (1976) on the recommendation of Swaran Singh Committee (10 duties), with the 11th duty added by 86th Amendment (2002). Lays down moral obligations of every citizen to promote patriotism and preserve Indian heritage.",
    keyClauses: [
      "(a) Abide by the Constitution and respect National Flag and National Anthem.",
      "(b) Cherish and follow the noble ideals of the national freedom struggle.",
      "(c) Uphold and protect the sovereignty, unity, and integrity of India.",
      "(d) Defend the country and render national service when called upon.",
      "(e) Promote harmony and the spirit of common brotherhood, renounce practices derogatory to the dignity of women.",
      "(f) Value and preserve the rich heritage of our composite culture.",
      "(g) Protect and improve the natural environment including forests, lakes, rivers, and wildlife, and have compassion for living creatures.",
      "(h) Develop the scientific temper, humanism, and the spirit of inquiry and reform.",
      "(i) Safeguard public property and abjure violence.",
      "(j) Strive towards excellence in all spheres of individual and collective activity.",
      "(k) Parent/Guardian duty to provide educational opportunities to child between 6 and 14 years."
    ],
    advocateTip: "While Fundamental Duties are not directly enforceable by writs, the Supreme Court uses them to interpret statutory reasonableness under Article 14 and 19.",
    landmarkCases: ["AIIMS Students Union v. AIIMS (2002)", "MC Mehta v. Union of India (Environmental Duties, 1988)"],
    popularKeywords: ["fundamental duties", "51A", "respect national flag", "protect environment", "scientific temper", "Article 51A"]
  },
  {
    number: "Article 124 – 147",
    title: "The Supreme Court of India (Apex Constitutional Court)",
    part: "Part V",
    partName: "Union Judiciary",
    category: "Judiciary & Writs",
    summary: "Governs the establishment, constitution, jurisdiction, and powers of the Supreme Court of India. Article 129 establishes SC as a Court of Record with power to punish for contempt. Article 141 makes SC declarations of law binding on all courts across India. Article 142 grants extraordinary inherent powers to do 'Complete Justice'.",
    keyClauses: [
      "Article 124: Establishment and appointment of Chief Justice of India (CJI) and SC Judges.",
      "Article 129: Supreme Court is a Court of Record with power to punish for Contempt of Court.",
      "Article 131: Original Jurisdiction in disputes between Centre vs States or Inter-State disputes.",
      "Article 136: Special Leave Petition (SLP) against any judgment/decree of any court or tribunal in India.",
      "Article 141: Law declared by Supreme Court shall be binding on all courts within the territory of India.",
      "Article 142: Supreme Court may pass such decree or order as is necessary for doing complete justice in any cause or matter."
    ],
    advocateTip: "Article 136 (SLP) is a discretionary remedy invoked in cases of gross miscarriage of justice or substantial questions of general public importance.",
    landmarkCases: ["Supreme Court Advocates-on-Record Association (NJAC Case, 2015)", "Union Carbide Corporation v. UOI (Bhopal Gas Tragedy Art 142, 1991)"],
    popularKeywords: ["supreme court", "special leave petition", "SLP Art 136", "complete justice Art 142", "Article 141 binding law", "Article 124"]
  },
  {
    number: "Article 214 – 227",
    title: "High Courts of the States & High Court Writ Jurisdiction",
    part: "Part VI",
    partName: "State Judiciary",
    category: "Judiciary & Writs",
    summary: "Establishes a High Court for each State with vast constitutional jurisdiction. Article 226 empowers High Courts to issue writs for the enforcement of Fundamental Rights and for 'any other purpose'. Article 227 gives High Courts power of superintendence over all subordinate courts and tribunals in their territorial jurisdiction.",
    keyClauses: [
      "Article 215: High Courts are Courts of Record with contempt powers.",
      "Article 226: Power to issue directions, orders, or writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) for Fundamental Rights and ordinary statutory rights.",
      "Article 227: Power of superintendence over all courts and tribunals throughout territories in relation to which it exercises jurisdiction."
    ],
    advocateTip: "Article 226 is wider than Article 32 because it can be invoked not just for Fundamental Rights violations, but also for any statutory illegality, administrative overreach, or breach of natural justice.",
    landmarkCases: ["L. Chandra Kumar v. Union of India (1997)", "Whirlpool Corporation v. Registrar of Trade Marks (Alternative Remedy, 1998)"],
    popularKeywords: ["high court writ petition", "article 226", "article 227 superintendence", "stay order high court", "writs in high court"]
  },
  {
    number: "Article 300A",
    title: "Right to Property (Constitutional & Human Right)",
    part: "Part XII",
    partName: "Finance and Property",
    category: "Finance & Property",
    summary: "Inserted by 44th Amendment (1978) after removing Right to Property from Fundamental Rights (Art 19(1)(f) and Art 31). Provides that 'No person shall be deprived of his property save by authority of law'. The Supreme Court recognizes property rights as a human right.",
    keyClauses: [
      "Deprivation of private property requires valid legislative sanction, public purpose, and fair compensation.",
      "Arbitrary executive dispossession of land or property is unconstitutional.",
      "Land acquisition must strictly follow the Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act (RFCTLARR 2013)."
    ],
    advocateTip: "State cannot dispossess a citizen of land without following statutory acquisition procedure and paying determined compensation, or a Writ under Article 226 lies.",
    landmarkCases: ["K.T. Plantation Pvt. Ltd. v. State of Karnataka (2011)", "Vidya Devi v. State of Himachal Pradesh (Human Right to Property, 2020)"],
    popularKeywords: ["right to property", "article 300A", "illegal land acquisition", "compensation for land", "property demolition"]
  },
  {
    number: "Article 352 – 360",
    title: "Emergency Provisions (National, State & Financial)",
    part: "Part XVIII",
    partName: "Emergency Provisions",
    category: "Emergency Provisions",
    summary: "Governs emergency powers: Article 352 (National Emergency on grounds of war, external aggression, or armed rebellion), Article 356 (President's Rule due to failure of constitutional machinery in a State), and Article 360 (Financial Emergency).",
    keyClauses: [
      "Article 352: National Emergency proclaimed by President only on written advice of the Union Cabinet. Must be approved by Parliament by special majority within 1 month.",
      "Article 356: President's Rule in States (subject to judicial review under S.R. Bommai guidelines).",
      "Article 358 & 359: Suspension of Article 19 during war/external aggression. CRITICAL: Articles 20 and 21 CAN NEVER be suspended (44th Amendment 1978).",
      "Article 360: Financial Emergency (never invoked in India till date)."
    ],
    advocateTip: "Even during a proclaimed Emergency, no citizen can be deprived of life or personal liberty (Article 21) or subjected to double jeopardy/torture (Article 20).",
    landmarkCases: ["S.R. Bommai v. Union of India (Federalism and Art 356, 1994)", "ADM Jabalpur v. Shivkant Shukla (Overruled by Puttaswamy, 2017)"],
    popularKeywords: ["national emergency", "presidents rule", "article 356 misuse", "article 352", "financial emergency", "SR Bommai case"]
  },
  {
    number: "Article 368",
    title: "Power of Parliament to Amend the Constitution & Procedure",
    part: "Part XX",
    partName: "Amendment of Constitution",
    category: "Amendments & Union",
    summary: "Lays down the constitutional amendment procedure. Parliament can amend any provision of the Constitution by Simple Majority, Special Majority (2/3rd present and voting + absolute majority), or Special Majority with Ratification by half of the State Legislatures (for federal provisions). Bound strictly by the 'Basic Structure Doctrine'.",
    keyClauses: [
      "Constituent power of Parliament to add, vary, or repeal any provision of the Constitution.",
      "Requires Special Majority in both Lok Sabha and Rajya Sabha.",
      "Federal amendments (e.g. GST, Presidential elections, Supreme Court powers) require ratification by 50% of State Assemblies.",
      "Basic Structure Limitation: Parliament cannot alter or destroy the Basic Structure of the Constitution (Democracy, Secularism, Judicial Review, Rule of Law, Separation of Powers)."
    ],
    advocateTip: "Any constitutional amendment passed by Parliament can be challenged before the Supreme Court if it violates the Basic Structure Doctrine.",
    landmarkCases: [
      "Kesavananda Bharati v. State of Kerala (13-Judge Bench, 1973)",
      "Indira Nehru Gandhi v. Raj Narain (1975)",
      "Minerva Mills v. Union of India (1980)",
      "Supreme Court Advocates-on-Record Association (NJAC Struck Down, 2015)"
    ],
    popularKeywords: ["basic structure doctrine", "article 368", "constitutional amendment", "kesavananda bharati", "judicial review of amendments"]
  }
];

export const CONSTITUTION_SCHEDULES: ConstitutionSchedule[] = [
  { number: 1, title: "First Schedule: States and Union Territories", description: "Lists the names of the 28 States and 8 Union Territories of India along with their territorial jurisdictions and boundary extents.", keyArticles: "Articles 1 & 4" },
  { number: 2, title: "Second Schedule: Emoluments, Allowances & Privileges", description: "Provisions relating to the salaries, allowances, and perks of the President, Governors, Speaker/Deputy Speaker, Judges of Supreme Court & High Courts, and CAG.", keyArticles: "Articles 59, 65, 75, 97, 125, 148, 158, 164, 186, 221" },
  { number: 3, title: "Third Schedule: Forms of Oaths and Affirmations", description: "Contains the text of oaths or affirmations taken by Union Ministers, MPs, Supreme Court Judges, CAG, State Ministers, MLAs, and High Court Judges upon assuming office.", keyArticles: "Articles 75, 84, 99, 124, 146, 173, 188, 219" },
  { number: 4, title: "Fourth Schedule: Allocation of Rajya Sabha Seats", description: "Specifies the number of seats allocated to each State and Union Territory in the Rajya Sabha (Council of States) based on population.", keyArticles: "Articles 4(1) & 80(2)" },
  { number: 5, title: "Fifth Schedule: Administration of Scheduled Areas & Scheduled Tribes", description: "Special provisions for administration and control of Scheduled Areas and Scheduled Tribes in States other than Assam, Meghalaya, Tripura, and Mizoram. Establishes Tribes Advisory Councils.", keyArticles: "Article 244(1)" },
  { number: 6, title: "Sixth Schedule: Tribal Areas in North-Eastern States (AMTM)", description: "Autonomous District Councils (ADCs) and Regional Councils with legislative, judicial, and administrative powers in Assam, Meghalaya, Tripura, and Mizoram.", keyArticles: "Articles 244(2) & 275(1)" },
  { number: 7, title: "Seventh Schedule: Division of Powers (Three Legislative Lists)", description: "Demarcates legislative competence between Centre and States into 3 Lists: List I (Union List - 100 items), List II (State List - 61 items), and List III (Concurrent List - 52 items).", keyArticles: "Article 246" },
  { number: 8, title: "Eighth Schedule: Official Recognized Languages of India", description: "Recognizes 22 official regional languages of India: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santhali, Sindhi, Tamil, Telugu, Urdu.", keyArticles: "Articles 344(1) & 351" },
  { number: 9, title: "Ninth Schedule: Validation of Certain Acts and Regulations", description: "Originally created by 1st Amendment (1951) to protect land reform laws from judicial review. In I.R. Coelho (2007), Supreme Court ruled that laws placed in 9th Schedule after 24 April 1973 are open to judicial review if they violate basic structure.", keyArticles: "Article 31B" },
  { number: 10, title: "Tenth Schedule: Anti-Defection Law (52nd Amendment 1985)", description: "Disqualification of Members of Parliament (MPs) and State Legislatures (MLAs) on grounds of political defection, party switching, or defying party whip. Decision lies with the Speaker/Chairman subject to judicial review (Kihoto Hollohan).", keyArticles: "Articles 102(2) & 191(2)" },
  { number: 11, title: "Eleventh Schedule: Panchayati Raj Powers & 29 Functional Subjects", description: "Added by 73rd Amendment (1992). Lists 29 functional matters entrusted to Panchayats including agriculture, land improvement, minor irrigation, rural housing, drinking water, and roads.", keyArticles: "Article 243G" },
  { number: 12, title: "Twelfth Schedule: Municipalities & Urban Local Bodies (18 Subjects)", description: "Added by 74th Amendment (1992). Lists 18 functional responsibilities of Municipal Corporations and Councils including urban planning, water supply, public health, fire services, and solid waste management.", keyArticles: "Article 243W" }
];

export const LANDMARK_JUDGMENTS: LandmarkJudgment[] = [
  {
    caseName: "Kesavananda Bharati v. State of Kerala",
    year: 1973,
    court: "Supreme Court of India (13-Judge Bench - Largest ever)",
    constitutionalRule: "Basic Structure Doctrine",
    impact: "Established that Parliament has wide amending power under Article 368, but it cannot alter, destroy, or emasculate the 'Basic Structure' of the Constitution (such as democracy, rule of law, secularism, judicial review, separation of powers).",
    relevantArticles: ["Article 368", "Article 13", "Article 31C"]
  },
  {
    caseName: "Maneka Gandhi v. Union of India",
    year: 1978,
    court: "Supreme Court of India (7-Judge Bench)",
    constitutionalRule: "Golden Triangle (Articles 14, 19, and 21) & Substantive Due Process",
    impact: "Transformed Article 21. Ruled that any law depriving a person of life or personal liberty must satisfy the test of being 'just, fair, and reasonable', not merely statutory procedure.",
    relevantArticles: ["Article 21", "Article 14", "Article 19"]
  },
  {
    caseName: "Justice K.S. Puttaswamy (Retd.) v. Union of India",
    year: 2017,
    court: "Supreme Court of India (9-Judge Constitution Bench - Unanimous)",
    constitutionalRule: "Fundamental Right to Privacy",
    impact: "Held that Right to Privacy is an intrinsic and inalienable part of Right to Life and Personal Liberty under Article 21 and the entire Part III of the Constitution.",
    relevantArticles: ["Article 21", "Article 14", "Article 19", "Article 25"]
  },
  {
    caseName: "S.R. Bommai v. Union of India",
    year: 1994,
    court: "Supreme Court of India (9-Judge Bench)",
    constitutionalRule: "Federalism, Secularism & Limits on Article 356 (President's Rule)",
    impact: "Declared that Federalism and Secularism are part of the Basic Structure. Made Presidential proclamations under Article 356 subject to judicial review to curb arbitrary dissolution of State Governments.",
    relevantArticles: ["Article 356", "Article 352", "Preamble"]
  },
  {
    caseName: "Navtej Singh Johar v. Union of India",
    year: 2018,
    court: "Supreme Court of India (5-Judge Constitution Bench)",
    constitutionalRule: "Constitutional Morality & Human Autonomy",
    impact: "Decriminalized consensual same-sex relations by reading down Section 377 IPC, holding that constitutional morality prevails over public or majoritarian morality.",
    relevantArticles: ["Article 14", "Article 15", "Article 19", "Article 21"]
  },
  {
    caseName: "Shayara Bano v. Union of India",
    year: 2017,
    court: "Supreme Court of India (5-Judge Constitution Bench)",
    constitutionalRule: "Manifest Arbitrariness Doctrine under Article 14",
    impact: "Set aside the practice of instantaneous Talaq-e-Biddat (Triple Talaq) as unconstitutional, arbitrary, and violative of Muslim women's fundamental rights under Article 14 and 21.",
    relevantArticles: ["Article 14", "Article 21", "Article 25"]
  }
];

export const FIVE_PREROGATIVE_WRITS = [
  {
    name: "1. Habeas Corpus (To have the body)",
    hindiName: "बन्दी प्रत्यक्षीकरण (Habeas Corpus)",
    latin: "Habeas Corpus ad subjiciendum",
    meaning: "Command issued to an authority or private person holding someone in custody to produce the detained person before the court to inspect the legality of detention.",
    whenToUse: "Illegal police detention, custodial torture, detention beyond 24 hours without magistrate order, unlawful preventive detention.",
    target: "Can be issued against BOTH Public Authorities and Private Individuals.",
    articleReference: "Article 32 (SC) & Article 226 (HC)",
    landmarkPrecedent: "Sunil Batra v. Delhi Administration (1980) & ADM Jabalpur (Overruled by Puttaswamy)"
  },
  {
    name: "2. Mandamus (We Command)",
    hindiName: "परमादेश (Mandamus)",
    latin: "Mandamus",
    meaning: "Command issued by a superior court to a public official, statutory body, university, or government department directing them to perform a mandatory public/statutory duty which they failed to execute.",
    whenToUse: "Refusal by authorities to issue passports/licenses despite eligibility, non-consideration of representations, statutory inaction.",
    target: "Issued only against Public Authorities and Statutory Bodies (NOT private contracts or President/Governor).",
    articleReference: "Article 32 (SC) & Article 226 (HC)",
    landmarkPrecedent: "Gujarat State Financial Corporation v. Lotus Hotels (1983)"
  },
  {
    name: "3. Quo Warranto (By what warrant/authority?)",
    hindiName: "अधिकार पृच्छा (Quo Warranto)",
    latin: "Quo Warranto",
    meaning: "Inquiry into the legal authority of a person holding a substantive public office to prevent illegal usurpation of public posts.",
    whenToUse: "Appointment of an unqualified person to a public office (e.g. Vice-Chancellor, Advocate General, Public Prosecutor) in violation of statutory recruitment rules.",
    target: "Issued against persons holding a public office created by statute or Constitution.",
    articleReference: "Article 32 (SC) & Article 226 (HC)",
    landmarkPrecedent: "University of Mysore v. C.D. Govinda Rao (1965)"
  },
  {
    name: "4. Prohibition (Stay on jurisdictional excess)",
    hindiName: "प्रतिषेध (Prohibition)",
    latin: "Prohibition",
    meaning: "Judicial order issued by a higher court to a lower court or quasi-judicial tribunal preventing it from continuing proceedings outside or exceeding its legal jurisdiction.",
    whenToUse: "When a lower court or tribunal attempts to try a case where it lacks territorial, pecuniary, or subject-matter jurisdiction.",
    target: "Issued against Judicial and Quasi-Judicial Authorities during ongoing proceedings (Preventive in nature).",
    articleReference: "Article 32 (SC) & Article 226 (HC)",
    landmarkPrecedent: "East India Commercial Co. v. Collector of Customs (1962)"
  },
  {
    name: "5. Certiorari (To be certified / Quashing order)",
    hindiName: "उत्प्रेषण (Certiorari)",
    latin: "Certiorari",
    meaning: "Command issued to a subordinate court or tribunal to transfer the records of a case to the superior court and quash an illegal order passed without jurisdiction or in violation of natural justice.",
    whenToUse: "To quash ex-parte illegal orders passed without hearing, orders suffering from manifest error of law apparent on the face of the record.",
    target: "Issued against Judicial, Quasi-Judicial, and Administrative bodies affecting citizen rights (Curative & Corrective).",
    articleReference: "Article 32 (SC) & Article 226 (HC)",
    landmarkPrecedent: "Syed Yakoob v. K.S. Radhakrishnan (1964)"
  }
];

export interface CitizenRightScenario {
  id: string;
  scenarioTitle: string;
  category: 'Police & Custody' | 'Property & Demolition' | 'Digital & Privacy' | 'Employment & Equality' | 'Consumer & Free Speech';
  situationDescription: string;
  applicableArticles: string[];
  constitutionalRight: string;
  appropriateRemedy: string;
  writType: string;
  supremeCourtPrecedent: string;
  advocateActionPlan: string;
}

export const CITIZEN_RIGHTS_SCENARIOS: CitizenRightScenario[] = [
  {
    id: 'police-custody-detention',
    scenarioTitle: 'Unlawful Police Detention Beyond 24 Hours without Magistrate Production',
    category: 'Police & Custody',
    situationDescription: 'A family member or friend is taken into custody by local police and kept in the station for over 24 hours without being formally produced before a Judicial Magistrate or given a copy of the FIR / arrest memo.',
    applicableArticles: ['Article 21', 'Article 22(1)', 'Article 22(2)'],
    constitutionalRight: 'Right to Personal Liberty and Mandatory Production before Magistrate within 24 Hours',
    appropriateRemedy: 'Immediate Writ of Habeas Corpus before the High Court (Art 226) or Supreme Court (Art 32)',
    writType: 'Writ of Habeas Corpus',
    supremeCourtPrecedent: 'D.K. Basu v. State of West Bengal (1997) & Arnesh Kumar v. State of Bihar (2014)',
    advocateActionPlan: 'Advocate immediately prepares an emergency Habeas Corpus petition demanding production of the detenu, inspects GD (General Diary) entry, and seeks departmental compensation for illegal confinement.'
  },
  {
    id: 'property-demolition-bulldozer',
    scenarioTitle: 'Bulldozer / Arbitrary Demolition of Residential/Commercial Property without Notice',
    category: 'Property & Demolition',
    situationDescription: 'Municipal or police authorities arrive with bulldozers to demolish a residential house or commercial establishment without serving a prior 15-day show-cause notice, opportunity of hearing, or statutory demolition order.',
    applicableArticles: ['Article 21', 'Article 14', 'Article 300A'],
    constitutionalRight: 'Right to Shelter as part of Life (Art 21) & Constitutional Right to Property (Art 300A) against Arbitrariness (Art 14)',
    appropriateRemedy: 'Urgent Article 226 Writ Petition before High Court seeking Interim Injunction / Stay on Demolition',
    writType: 'Writ of Mandamus / Certiorari with Stay Application',
    supremeCourtPrecedent: 'Supreme Court Demolition Guidelines (In Re: Demolition of Properties, Nov 2024) & Olga Tellis (1985)',
    advocateActionPlan: 'Advocate files urgent mention before the High Court Vacation/Regular Bench for stay of demolition, citing mandatory 15-day notice, videography requirement, and Supreme Court nationwide demolition guidelines.'
  },
  {
    id: 'phone-tapping-digital-privacy',
    scenarioTitle: 'Unauthorized Phone Tapping, Digital Surveillance & Phone Seizure during Search',
    category: 'Digital & Privacy',
    situationDescription: 'Investigating agency or police seize personal mobile phones and laptops without a judicial search warrant or clone digital devices without maintaining cryptographic hash value logs.',
    applicableArticles: ['Article 21', 'Article 20(3)', 'Article 19(1)(a)'],
    constitutionalRight: 'Fundamental Right to Privacy (Puttaswamy) & Protection Against Compelled Self-Incrimination (Art 20(3))',
    appropriateRemedy: 'Writ Petition under Article 226 / Section 482 CrPC (Sec 528 BNSS) for safe custody and return of cloned data',
    writType: 'Writ of Mandamus',
    supremeCourtPrecedent: 'Justice K.S. Puttaswamy (2017) & Supreme Court Digital Device Seizure Directions (2023)',
    advocateActionPlan: 'Advocate demands provision of Hash value at time of seizure, challenges wholesale cloning of personal data, and invokes privacy safeguards against coercive password disclosure.'
  },
  {
    id: 'wrongful-government-job-denial',
    scenarioTitle: 'Arbitrary Disqualification in Public Recruitment / Roster Manipulation',
    category: 'Employment & Equality',
    situationDescription: 'A qualified candidate passes a government recruitment examination, but authorities change eligibility criteria midway, alter answer keys unfairly, or fail to adhere to statutory reservation rosters.',
    applicableArticles: ['Article 14', 'Article 16(1)', 'Article 16(4)'],
    constitutionalRight: 'Right to Equality of Opportunity in Public Employment & Non-Arbitrariness',
    appropriateRemedy: 'Writ Petition under Article 226 before High Court or Central Administrative Tribunal (CAT) under Art 323A',
    writType: 'Writ of Mandamus / Certiorari',
    supremeCourtPrecedent: 'K. Manjusree v. State of A.P. (Rules of the game cannot be changed mid-way) & E.P. Royappa (1974)',
    advocateActionPlan: 'Advocate challenges the retrospective alteration of selection norms, quashes flawed merit lists, and secures provisional appointment directions.'
  },
  {
    id: 'speech-social-media-fir',
    scenarioTitle: 'Frivolous FIR / Criminal Defamation for Social Media Criticism / Free Speech',
    category: 'Consumer & Free Speech',
    situationDescription: 'Police register an FIR against a citizen or journalist for posting fair criticism of government policies or public officials on social media platforms.',
    applicableArticles: ['Article 19(1)(a)', 'Article 21', 'Article 14'],
    constitutionalRight: 'Fundamental Freedom of Speech and Expression & Protection against Vexatious Prosecution',
    appropriateRemedy: 'Writ Petition under Article 226 / Section 482 CrPC (Section 528 BNSS) before High Court for Quashing of FIR',
    writType: 'Writ of Certiorari / Section 482 Quashing',
    supremeCourtPrecedent: 'Shreya Singhal v. Union of India (2015) & Patricia Mukhim v. State of Meghalaya (2021)',
    advocateActionPlan: 'Advocate invokes landmark Shreya Singhal precedents to demonstrate absence of incitement to violence, staying coercive police action and quashing vexatious charges.'
  }
];

export interface ConstitutionalAmendment {
  number: string;
  year: number;
  title: string;
  keyHighlights: string;
  impactOnCitizens: string;
  governingArticles: string[];
}

export const KEY_CONSTITUTIONAL_AMENDMENTS: ConstitutionalAmendment[] = [
  {
    number: "106th Amendment Act",
    year: 2023,
    title: "Nari Shakti Vandan Adhiniyam (Women's Reservation Act)",
    keyHighlights: "Provides 33% (one-third) reservation for women in the Lok Sabha, State Legislative Assemblies, and National Capital Territory of Delhi Assembly.",
    impactOnCitizens: "Historic constitutional reform empowering women in legislative governance and electoral policy-making for a period of 15 years.",
    governingArticles: ["Article 330A", "Article 332A", "Article 239AA"]
  },
  {
    number: "103rd Amendment Act",
    year: 2019,
    title: "10% Economically Weaker Sections (EWS) Reservation",
    keyHighlights: "Enables the State to make special provisions and up to 10% reservation in educational institutions and public employment for citizens belonging to Economically Weaker Sections.",
    impactOnCitizens: "Upheld by Supreme Court in Janhit Abhiyan (2022) as not violating the basic structure of the Constitution.",
    governingArticles: ["Article 15(6)", "Article 16(6)"]
  },
  {
    number: "101st Amendment Act",
    year: 2016,
    title: "Goods and Services Tax (GST) & Fiscal Federalism",
    keyHighlights: "Introduced the unified Goods and Services Tax regime across India, creating the constitutional GST Council (Art 279A).",
    impactOnCitizens: "Harmonized indirect taxation across States and Union, establishing collaborative fiscal federalism.",
    governingArticles: ["Article 246A", "Article 269A", "Article 279A"]
  },
  {
    number: "99th Amendment Act",
    year: 2014,
    title: "National Judicial Appointments Commission (NJAC) - Struck Down",
    keyHighlights: "Sought to replace the Supreme Court Collegium system with the NJAC for appointment of higher judiciary judges.",
    impactOnCitizens: "Struck down in entirety by the Supreme Court Constitution Bench (2015) as unconstitutional for violating Judicial Independence as part of the Basic Structure.",
    governingArticles: ["Article 124A", "Article 124B", "Article 124C"]
  },
  {
    number: "86th Amendment Act",
    year: 2002,
    title: "Right to Free & Compulsory Elementary Education",
    keyHighlights: "Inserted Article 21A making free and compulsory elementary education for children aged 6–14 a Fundamental Right, and added Article 51A(k) Fundamental Duty.",
    impactOnCitizens: "Paved the path for the Right to Education (RTE) Act, 2009, mandating 25% quota for underprivileged children in private schools.",
    governingArticles: ["Article 21A", "Article 45", "Article 51A(k)"]
  },
  {
    number: "73rd & 74th Amendment Acts",
    year: 1992,
    title: "Constitutional Status to Panchayati Raj & Municipalities",
    keyHighlights: "Granted constitutional status to rural Panchayats (Part IX, 11th Schedule) and urban Municipalities (Part IX-A, 12th Schedule) with 33% mandatory reservation for women.",
    impactOnCitizens: "Decentralized grassroots democracy across 3-tier local self-governments throughout India.",
    governingArticles: ["Article 243 – 243ZG", "11th & 12th Schedules"]
  },
  {
    number: "44th Amendment Act",
    year: 1978,
    title: "Post-Emergency Constitutional Safeguards & Property Right Shift",
    keyHighlights: "Replaced 'internal disturbance' with 'armed rebellion' for Art 352 emergency, made Articles 20 & 21 non-suspendable during emergency, and transformed Right to Property from Fundamental Right (Art 31) to Constitutional Right (Art 300A).",
    impactOnCitizens: "Protected citizens forever against custodial despotism and arbitrary suspension of fundamental personal liberty.",
    governingArticles: ["Article 20", "Article 21", "Article 300A", "Article 352"]
  },
  {
    number: "42nd Amendment Act",
    year: 1976,
    title: "The 'Mini-Constitution' of India",
    keyHighlights: "Added terms 'SOCIALIST', 'SECULAR', and 'INTEGRITY' to the Preamble; inserted Part IV-A Fundamental Duties (Art 51A); and added Article 39A Free Legal Aid.",
    impactOnCitizens: "Major structural expansion of welfare state commitments and civic responsibilities.",
    governingArticles: ["Preamble", "Article 39A", "Article 43A", "Article 48A", "Article 51A"]
  },
  {
    number: "1st Amendment Act",
    year: 1951,
    title: "First Constitutional Amendment & Ninth Schedule",
    keyHighlights: "Introduced Article 31A, 31B, and the Ninth Schedule to insulate agricultural land reform and zamindari abolition laws from fundamental rights challenge.",
    impactOnCitizens: "Established the foundations of economic restructuring and reasonable restrictions on speech under Art 19(2).",
    governingArticles: ["Article 15(3)", "Article 19(2)", "Article 31A", "Article 31B", "Ninth Schedule"]
  }
];

export const CONSTITUTIONAL_AI_PRESET_QUESTIONS = [
  "What are my constitutional remedies under Article 226 if my house is threatened with illegal demolition?",
  "Can the police arrest me without giving written grounds of arrest under Article 22 & D.K. Basu guidelines?",
  "What is the difference between filing a Writ Petition in Supreme Court (Article 32) vs High Court (Article 226)?",
  "How does the Basic Structure Doctrine restrict Parliament from amending the Constitution under Article 368?",
  "What are the 11 Fundamental Duties under Article 51A and how are they interpreted in courts?",
  "Explain the Golden Triangle of Articles 14, 19, and 21 and the test of substantive Due Process."
];
