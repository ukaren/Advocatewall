import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Scale,
  ShieldCheck,
  Search,
  FileText,
  Award,
  Layers,
  HelpCircle,
  PhoneCall,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Globe,
  Gavel,
  Compass,
  Bookmark,
  X,
  Share2,
  Volume2,
  VolumeX,
  Download,
  AlertTriangle,
  History,
  Languages,
  ArrowRight,
  Send,
  Loader2
} from 'lucide-react';
import {
  PREAMBLE_DATA,
  CONSTITUTION_PARTS,
  KEY_CONSTITUTION_ARTICLES,
  CONSTITUTION_SCHEDULES,
  LANDMARK_JUDGMENTS,
  FIVE_PREROGATIVE_WRITS,
  CITIZEN_RIGHTS_SCENARIOS,
  KEY_CONSTITUTIONAL_AMENDMENTS,
  CONSTITUTIONAL_AI_PRESET_QUESTIONS,
  ConstitutionArticle,
  CitizenRightScenario
} from '../data/constitutionData';
import { BUSINESS_CONFIG } from '../data/config';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const ConstitutionSection: React.FC = () => {
  const { addToast } = useCart();
  
  // Navigation & Sub-modules
  const [activeTab, setActiveTab] = useState<
    'articles' | 'scenarios' | 'ai-assistant' | 'writ-drafter' | 'preamble' | 'amendments' | 'writs' | 'judgments' | 'parts' | 'schedules'
  >('articles');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<ConstitutionArticle | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<CitizenRightScenario | null>(CITIZEN_RIGHTS_SCENARIOS[0]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Bilingual Hindi/English Toggle
  const [isHindiMode, setIsHindiMode] = useState<boolean>(false);
  
  // Preamble Audio Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI Constitutional Assistant State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Interactive Writ Synopsis Drafter State
  const [writType, setWritType] = useState<string>('Habeas Corpus');
  const [writCourt, setWritCourt] = useState<'High Court (Art 226)' | 'Supreme Court (Art 32)'>('High Court (Art 226)');
  const [petitionerName, setPetitionerName] = useState<string>('Vikram Malhotra');
  const [respondentAuthority, setRespondentAuthority] = useState<string>('State of NCT of Delhi & Commissioner of Police');
  const [impugnedAction, setImpugnedAction] = useState<string>('Unlawful detention of petitioner without producing before Magistrate within statutory 24 hours under Article 22(2).');
  const [writJurisdictionGrounds, setWritJurisdictionGrounds] = useState<string>('Violation of fundamental right to personal liberty under Article 21 and arbitrary non-compliance with statutory arrest guidelines.');

  const categories = [
    'All',
    'Fundamental Rights',
    'DPSP',
    'Fundamental Duties',
    'Judiciary & Writs',
    'Finance & Property',
    'Emergency Provisions',
    'Amendments & Union'
  ];

  // Filtered Articles based on search & category
  const filteredArticles = useMemo(() => {
    return KEY_CONSTITUTION_ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.number.toLowerCase().includes(q) ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.popularKeywords.some((kw) => kw.toLowerCase().includes(q)) ||
        article.advocateTip.toLowerCase().includes(q) ||
        (article.landmarkCases && article.landmarkCases.some((c) => c.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyCitation = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    addToast(`Copied ${label} citation to clipboard`, 'success');
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Text-to-Speech Preamble Reader
  const togglePlayPreambleAudio = () => {
    if (!('speechSynthesis' in window)) {
      addToast('Speech synthesis not supported in this browser.', 'error');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(PREAMBLE_DATA.text);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    addToast('Reading Preamble aloud...', 'info');
  };

  // Trigger Gemini AI Constitutional Assistant
  const handleAskConstitutionalAI = async (customPrompt?: string) => {
    const query = customPrompt || aiQuestion;
    if (!query.trim()) {
      addToast('Please enter a constitutional question or select a preset topic.', 'error');
      return;
    }

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/legal-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'constitutional_query',
          userInput: query,
          context: 'Focus on Indian Constitutional law, Fundamental Rights, Writs under Articles 32/226, DPSP, landmark Supreme Court constitutional bench rulings, and procedural remedies for citizens.'
        })
      });

      if (!res.ok) {
        throw new Error('AI Assistant is currently unavailable.');
      }

      const data = await res.json();
      setAiResponse(data.reply || data.suggestion || data.text || 'Unable to generate constitutional analysis.');
      addToast('Constitutional Analysis Generated', 'success');
    } catch (err: any) {
      // Fallback helpful guidance if API key isn't active
      setAiResponse(
        `### Constitutional Legal Analysis:\n**Query:** "${query}"\n\n**1. Governing Constitutional Articles:**\n- Invokes fundamental rights protections under Part III (Articles 14, 19, 21, and 22).\n\n**2. Judicial Remedy:**\n- You may file a Writ Petition under **Article 226** before the High Court or **Article 32** before the Supreme Court.\n- If administrative inaction or arbitrary order is involved, a **Writ of Mandamus / Certiorari** is appropriate.\n\n**3. Landmark Precedents:**\n- *Maneka Gandhi v. Union of India (1978)* (Substantive Due Process)\n- *Justice K.S. Puttaswamy v. Union of India (2017)* (Right to Privacy & Personal Liberty)\n\n**Recommended Next Step:** Schedule an urgent consultation with an advocate for writ drafting and case listing.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Generate Court-Ready Writ Synopsis Text
  const generatedWritSynopsis = useMemo(() => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return `IN THE HON'BLE ${writCourt.toUpperCase()}
EXTRAORDINARY ORIGINAL WRIT JURISDICTION

WRIT PETITION (CIVIL / CRIMINAL) NO. ______ OF ${new Date().getFullYear()}

IN THE MATTER OF:
${petitionerName}
...PETITIONER

VERSUS

${respondentAuthority}
...RESPONDENTS

WRIT PETITION UNDER ${writCourt.includes('226') ? 'ARTICLE 226' : 'ARTICLE 32'} OF THE CONSTITUTION OF INDIA PRAYING FOR ISSUANCE OF A WRIT IN THE NATURE OF ${writType.toUpperCase()} OR ANY OTHER APPROPRIATE WRIT, ORDER, OR DIRECTION.

--------------------------------------------------------------------------------
SYNOPSIS & LIST OF DATES:
--------------------------------------------------------------------------------
1. That the Petitioner is constrained to invoke the extraordinary writ jurisdiction of this Hon'ble Court seeking urgent intervention against the arbitrary, illegal, and unconstitutional action of the Respondents.

2. IMPUGNED ACTION / CAUSE OF ACTION:
   ${impugnedAction}

3. CONSTITUTIONAL GROUNDS & QUESTIONS OF LAW:
   a. Whether the impugned actions of the Respondent Authority violate the fundamental rights of the Petitioner guaranteed under ${writJurisdictionGrounds}?
   b. Whether the Respondent Authority has acted in manifest arbitrariness, contrary to the rule of law and the principles of natural justice?
   c. Whether the Petitioner is entitled to an immediate Writ of ${writType} against the Respondents?

4. PRAYER:
   It is most respectfully prayed that this Hon'ble Court may graciously be pleased to:
   i. Issue a Writ of ${writType} or any other appropriate Writ quashing/restraining the impugned action of the Respondents;
   ii. Grant interim ex-parte relief pending the final disposal of the present petition;
   iii. Pass any such further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

DRAWN & FILED BY:
Advocate Seema Jha & Associates
Counsel for the Petitioner
Date: ${today}
Place: New Delhi`;
  }, [writCourt, writType, petitionerName, respondentAuthority, impugnedAction, writJurisdictionGrounds]);

  return (
    <section id="constitution" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindiMode ? 'भारतीय संविधान • सर्वोच्च विधि' : 'Bharatiya Samvidhan • Supreme Law of India'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display mb-4">
            {isHindiMode ? 'भारतीय संविधान के नियम, अधिकार व उपचार' : 'Constitution of India Rules, Rights & Writs'}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isHindiMode
              ? 'नागरिक अधिकारों, संवैधानिक उपचारों (अनुच्छेद 32/226), 5 रिटों और ऐतिहासिक निर्णयों का आधुनिक संवादात्मक अध्ययन केंद्र।'
              : 'Interactive legal knowledge hub for Fundamental Rights, Writs (Articles 32 & 226), Citizen Remedy Scenarios, AI Constitutional Assistant, and Landmark Judgments.'}
          </p>

          {/* Bilingual Toggle Pill */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setIsHindiMode(!isHindiMode)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHindiMode ? 'English View' : 'हिंदी में देखें (Bilingual)'}</span>
            </button>
          </div>

          {/* Modern Interactive Feature Tab Selector */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-inner max-w-5xl mx-auto">
            
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'articles'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isHindiMode ? 'प्रमुख अनुच्छेद' : 'Articles & Rights'}</span>
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'scenarios'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isHindiMode ? 'नागरिक उपचार गाइड' : 'Citizen Remedy Guide'}</span>
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-mono">Live</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'ai-assistant'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isHindiMode ? 'एआई संविधान सहायक' : 'AI Constitution Query'}</span>
            </button>

            <button
              onClick={() => setActiveTab('writ-drafter')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'writ-drafter'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>{isHindiMode ? 'रिट ड्राफ्टर (Art 226)' : 'Writ Drafter (Art 226/32)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('preamble')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preamble'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isHindiMode ? 'प्रस्तावना (Preamble)' : 'The Preamble'}</span>
            </button>

            <button
              onClick={() => setActiveTab('amendments')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'amendments'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{isHindiMode ? 'संशोधन (Amendments)' : '106th Amendments'}</span>
            </button>

            <button
              onClick={() => setActiveTab('writs')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'writs'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isHindiMode ? '5 रिटें' : '5 Writs Matrix'}</span>
            </button>

            <button
              onClick={() => setActiveTab('judgments')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'judgments'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isHindiMode ? 'ऐतिहासिक निर्णय' : 'Landmark Rulings'}</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: Key Articles & Fundamental Rights Explorer */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search & Category Filter Bar */}
            <div className="bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Article No (e.g. 21, 32, 226), Keyword (e.g. Privacy, Arrest, Bail, Property), or Topic..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Category:</span>
                  <div className="flex gap-1.5 overflow-x-auto">
                    {categories.slice(0, 5).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extended Categories */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-700/60">
                <span className="text-[11px] text-slate-400 mr-1">Filter by Area:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center bg-slate-800/40 rounded-3xl border border-slate-700/60">
                <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Constitutional Articles Found</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  We couldn't find any articles matching "{searchQuery}". Try searching for terms like "Equality", "Life", "Writs", or "Supreme Court".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArticles.map((art, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-5 hover:border-amber-400/50 transition-all flex flex-col justify-between shadow-md hover:shadow-xl group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold">
                          {art.number}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {art.part}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-display mb-2 group-hover:text-amber-300 transition-colors">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-3">
                        {art.summary}
                      </p>

                      {/* Key Clause Highlight */}
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700/60 mb-3 text-[11px] text-slate-300 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Core Rule & Mandate:
                        </span>
                        <p className="text-slate-300 italic line-clamp-2">
                          "{art.keyClauses[0]}"
                        </p>
                      </div>

                      {/* Advocate Practice Tip */}
                      <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-800/40 mb-3 text-[11px] text-emerald-300">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                          💡 Advocate Practice Strategy:
                        </span>
                        <p className="line-clamp-2">{art.advocateTip}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedArticle(art)}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Clauses & Cases</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyCitation(`${art.number}: ${art.title} - ${art.summary}`, art.number)}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Copy Citation"
                        >
                          {copiedText === art.number ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={getDirectWhatsAppUrl(`Hello Advocate,\nI need legal advice regarding ${art.number} (${art.title}) for my matter.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Advise</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: Citizen Real-World Scenario Remedies Diagnostic */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'scenarios' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
                Real-World Citizen Situations & Immediate Constitutional Remedies
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Select your real-life legal grievance to immediately find the violated constitutional rights, appropriate writ petitions, and advocate action blueprint.
              </p>
            </div>

            {/* Scenario Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CITIZEN_RIGHTS_SCENARIOS.map((scen) => (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenario(scen)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedScenario?.id === scen.id
                      ? 'bg-slate-800 border-amber-400 shadow-xl ring-2 ring-amber-400/20'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                        {scen.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {scen.writType}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white mb-2 leading-snug">
                      {scen.scenarioTitle}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                      {scen.situationDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <span>View Action Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {scen.applicableArticles.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Scenario Action Blueprint */}
            {selectedScenario && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/95 border-2 border-amber-400/40 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
                        Grievance Diagnostic
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{selectedScenario.category}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {selectedScenario.scenarioTitle}
                    </h3>
                  </div>

                  <a
                    href={getDirectWhatsAppUrl(`Hello Advocate,\nI am facing the following situation: "${selectedScenario.scenarioTitle}". I need urgent legal counsel under ${selectedScenario.applicableArticles.join(', ')}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md flex-shrink-0"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Emergency Consult</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
                  {/* Left Column: Constitutional Protection */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        🛡️ Violated Fundamental Right:
                      </span>
                      <p className="text-white font-semibold">{selectedScenario.constitutionalRight}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedScenario.applicableArticles.map((art, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700">
                            {art}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-1.5">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                        ⚖️ Statutory Legal & Writ Remedy:
                      </span>
                      <p className="text-slate-200">{selectedScenario.appropriateRemedy}</p>
                      <p className="text-xs text-amber-300 font-mono pt-1">Recommended: {selectedScenario.writType}</p>
                    </div>
                  </div>

                  {/* Right Column: Precedents & Action Plan */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        📜 Supreme Court Benchmark Precedent:
                      </span>
                      <p className="text-white font-semibold">{selectedScenario.supremeCourtPrecedent}</p>
                    </div>

                    <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/50 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                        ⚡ Advocate Immediate Action Plan:
                      </span>
                      <p className="text-emerald-100 leading-relaxed">{selectedScenario.advocateActionPlan}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 text-center sm:text-left">
                    Facing this right now? Advocate Seema Jha provides emergency writ mentionings and bail filings.
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleCopyCitation(
                        `Case Law Reference: ${selectedScenario.scenarioTitle}\nArticles: ${selectedScenario.applicableArticles.join(', ')}\nPrecedent: ${selectedScenario.supremeCourtPrecedent}`,
                        'Remedy Summary'
                      )}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Legal Points</span>
                    </button>
                    <button
                      onClick={() => {
                        setImpugnedAction(selectedScenario.situationDescription);
                        setWritJurisdictionGrounds(selectedScenario.applicableArticles.join(', ') + ' - ' + selectedScenario.constitutionalRight);
                        setActiveTab('writ-drafter');
                        addToast('Loaded scenario into Writ Drafter', 'info');
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Load into Writ Drafter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: Interactive AI Constitutional Assistant */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'ai-assistant' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
                AI Constitutional Law & Fundamental Rights Assistant
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Powered by Gemini AI for in-depth analysis of Constitutional Articles, Supreme Court bench ratios, and writ jurisprudence.
              </p>
            </div>

            {/* Prompt Input Box */}
            <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-5 sm:p-6 shadow-xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Ask Any Constitutional Question or Scenario:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g. Can police seize my smartphone without a warrant under Article 21? How does Basic Structure apply to 106th amendment? What is the difference between Article 32 and Article 226?"
                    className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                  />
                  <button
                    onClick={() => handleAskConstitutionalAI()}
                    disabled={isAiLoading || !aiQuestion.trim()}
                    className="absolute right-3 bottom-3 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Analyze Constitution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preset Sample Questions */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                  Popular Constitutional Questions (Click to Analyze):
                </span>
                <div className="flex flex-wrap gap-2">
                  {CONSTITUTIONAL_AI_PRESET_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAiQuestion(q);
                        handleAskConstitutionalAI(q);
                      }}
                      className="text-left text-[11px] bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Response Card */}
            {aiResponse && (
              <div className="bg-slate-800/95 rounded-3xl border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">Constitutional Analysis & Judicial Reference</span>
                  </div>
                  <button
                    onClick={() => handleCopyCitation(aiResponse, 'AI Constitutional Analysis')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Analysis</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans space-y-2">
                  {aiResponse}
                </div>

                <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 text-center sm:text-left">
                    Need to turn this analysis into a High Court / Supreme Court Writ Petition?
                  </span>
                  <a
                    href={getDirectWhatsAppUrl(`Hello Advocate,\nI used the Constitutional AI Analyzer for: "${aiQuestion}". I need formal legal consultation on filing.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Counsel</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: Instant Interactive Writ Drafter (Art 32 vs Art 226) */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'writ-drafter' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
                Court-Ready Writ Petition Synopsis Drafter
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Configure your extraordinary constitutional writ petition under <strong>Article 226</strong> (High Court) or <strong>Article 32</strong> (Supreme Court) with live synopsis and prayer formatting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls (Left Col) */}
              <div className="lg:col-span-5 bg-slate-800/90 rounded-3xl border border-slate-700 p-5 space-y-4">
                <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>1. Configure Writ Parameters</span>
                </h4>

                {/* Court Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Select Jurisdiction Forum:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['High Court (Art 226)', 'Supreme Court (Art 32)'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setWritCourt(c)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          writCourt === c
                            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Writ Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Select Writ Nature:</label>
                  <select
                    value={writType}
                    onChange={(e) => setWritType(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="Habeas Corpus">Habeas Corpus (Illegal detention / custody)</option>
                    <option value="Mandamus">Mandamus (Command authority to perform statutory duty)</option>
                    <option value="Certiorari">Certiorari (Quash unconstitutional / arbitrary order)</option>
                    <option value="Quo Warranto">Quo Warranto (Challenge illegal public appointment)</option>
                    <option value="Prohibition">Prohibition (Restrain jurisdictional excess)</option>
                  </select>
                </div>

                {/* Petitioner Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Petitioner Name / Aggrieved Citizen:</label>
                  <input
                    type="text"
                    value={petitionerName}
                    onChange={(e) => setPetitionerName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Respondent Authority */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Respondent Public Authority / State:</label>
                  <input
                    type="text"
                    value={respondentAuthority}
                    onChange={(e) => setRespondentAuthority(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Impugned Action */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Impugned Action / Core Grievance:</label>
                  <textarea
                    rows={2}
                    value={impugnedAction}
                    onChange={(e) => setImpugnedAction(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                {/* Legal Grounds */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Violated Constitutional Articles / Grounds:</label>
                  <textarea
                    rows={2}
                    value={writJurisdictionGrounds}
                    onChange={(e) => setWritJurisdictionGrounds(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Draft Preview (Right Col) */}
              <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Formatted Writ Synopsis & Grounds</span>
                    </div>
                    <button
                      onClick={() => handleCopyCitation(generatedWritSynopsis, 'Writ Synopsis')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Synopsis</span>
                    </button>
                  </div>

                  <pre className="text-[11px] sm:text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                    {generatedWritSynopsis}
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    High Court & Supreme Court filing requires formal verification and vakalatnama.
                  </span>
                  <a
                    href={getDirectWhatsAppUrl(`Hello Advocate,\nI have drafted a Writ of ${writType} under ${writCourt} for ${petitionerName}. I would like you to review and file it in court.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Engage Advocate for Filing</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: The Preamble & Constituent Assembly Foundations */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'preamble' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Preamble Parchment Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-800 to-slate-900 border-2 border-amber-400/40 shadow-2xl relative">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {isHindiMode ? 'भारतीय संविधान की आत्मा एवं दर्शन' : 'The Soul of the Indian Constitution'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                  {PREAMBLE_DATA.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adopted on {PREAMBLE_DATA.adoptedDate} • Enforced on {PREAMBLE_DATA.enforcedDate}
                </p>

                {/* Audio Recitation Button */}
                <div className="mt-3">
                  <button
                    onClick={togglePlayPreambleAudio}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4 text-red-700 animate-pulse" />
                        <span>Stop Preamble Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-slate-950" />
                        <span>Listen to Preamble (Audio Recitation)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Text Container */}
              <div className="p-6 sm:p-8 bg-slate-950/80 rounded-2xl border border-amber-400/30 text-amber-100 font-serif leading-relaxed text-sm sm:text-base text-center shadow-inner tracking-wide whitespace-pre-line">
                {PREAMBLE_DATA.text}
              </div>

              {/* Historical Annotation */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 border-t border-slate-700/60 pt-4">
                <span>Drafting Committee Chairman: <strong className="text-white">{PREAMBLE_DATA.draftingCommitteeHead}</strong></span>
                <button
                  onClick={() => handleCopyCitation(PREAMBLE_DATA.text, 'Preamble')}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Preamble Text</span>
                </button>
              </div>
            </div>

            {/* Key Constitutional Pillars Explained */}
            <div>
              <h4 className="text-xl font-bold text-white font-display mb-4 text-center">
                Constitutional Ideals & Key Terminology
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {PREAMBLE_DATA.keyPillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-amber-400/40 transition-all"
                  >
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      {pillar.term}
                    </span>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {pillar.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: Major Constitutional Amendments Tracker */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'amendments' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
                Landmark Constitutional Amendments (1st to 106th Amendment)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Explore the pivotal constitutional changes that transformed Indian democracy, civil rights, GST fiscal federalism, and women's legislative representation.
              </p>
            </div>

            <div className="space-y-4">
              {KEY_CONSTITUTIONAL_AMENDMENTS.map((amend, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700/80 hover:border-amber-400/40 transition-all space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-mono font-bold">
                          {amend.number}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold font-mono">
                          Year {amend.year}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white font-display mt-1">
                        {amend.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-amber-400">Key Highlights:</strong> {amend.keyHighlights}
                  </p>

                  <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-xs text-slate-300">
                    <strong className="text-emerald-400 block mb-0.5">Impact on Citizens:</strong>
                    <p className="leading-relaxed">{amend.impactOnCitizens}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Articles Affected:</span>
                      {amend.governingArticles.map((art, i) => (
                        <span key={i} className="text-[10px] font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {art}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopyCitation(`${amend.number} (${amend.year}): ${amend.title}\n${amend.keyHighlights}`, amend.number)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: 5 Prerogative Writs Matrix */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'writs' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-1">
                The 5 Constitutional Prerogative Writs
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empowered under <strong>Article 32</strong> (Supreme Court) and <strong>Article 226</strong> (High Courts) to protect citizens against unlawful arrest, administrative inaction, illegal government orders, and usurpation of office.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FIVE_PREROGATIVE_WRITS.map((writ, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-lg hover:border-amber-400/50 transition-all ${
                    idx === 0 ? 'md:col-span-2 bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/30 border-amber-400/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-base sm:text-lg font-bold text-amber-300 font-display">
                      {isHindiMode && writ.hindiName ? writ.hindiName : writ.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {writ.articleReference}
                    </span>
                  </div>

                  <p className="text-xs italic text-amber-200/80 mb-3">"{writ.latin}"</p>

                  <div className="space-y-3 text-xs text-slate-300">
                    <p className="leading-relaxed"><strong className="text-white">Meaning:</strong> {writ.meaning}</p>
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        When to File this Writ:
                      </span>
                      <p className="text-slate-300">{writ.whenToUse}</p>
                    </div>
                    <p className="text-[11px] text-slate-400"><strong className="text-slate-300">Target:</strong> {writ.target}</p>
                    {writ.landmarkPrecedent && (
                      <p className="text-[11px] text-emerald-300"><strong className="text-emerald-400">Precedent:</strong> {writ.landmarkPrecedent}</p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Constitutional Remedy
                    </span>
                    <a
                      href={getDirectWhatsAppUrl(`Hello Advocate,\nI want to consult and file a Writ Petition for ${writ.name} in the High Court / Supreme Court.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                    >
                      File Writ Petition
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 8: Landmark Constitutional Bench Judgments */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'judgments' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Landmark Constitutional Bench Judgments
              </h3>
              <p className="text-xs text-slate-300">
                Foundational verdicts that shaped Indian constitutional jurisprudence, basic structure, and personal liberties.
              </p>
            </div>

            <div className="space-y-4">
              {LANDMARK_JUDGMENTS.map((jud, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700/80 hover:border-amber-400/40 transition-all space-y-3 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
                    <div>
                      <h4 className="text-base font-bold text-white font-display">{jud.caseName} ({jud.year})</h4>
                      <p className="text-xs text-amber-400 font-semibold">{jud.court}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-bold inline-block self-start sm:self-auto">
                      {jud.constitutionalRule}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-white">Constitutional Impact:</strong> {jud.impact}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">Articles Covered:</span>
                      {jud.relevantArticles.map((art, i) => (
                        <span key={i} className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {art}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopyCitation(`${jud.caseName} (${jud.year}) - ${jud.constitutionalRule}: ${jud.impact}`, jud.caseName)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Citation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Bottom Direct Counsel Callout */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-800 via-slate-800 to-amber-950/40 border border-amber-400/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-display">
                Need Constitutional Advisory or High Court Writ Filing?
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Connect directly with practicing High Court & Supreme Court advocates for Habeas Corpus, Mandamus, Quo Warranto, Fundamental Rights enforcement, and legal notices.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-shrink-0">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Advocate: {BUSINESS_CONFIG.phone}</span>
            </a>
            <a
              href={getDirectWhatsAppUrl("Hello Advocate,\nI need constitutional legal counsel and advice on filing a Writ Petition in the High Court.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Counsel</span>
            </a>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Full Article Modal / Drawer */}
      {/* ------------------------------------------------------------- */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-mono font-bold">
                {selectedArticle.number}
              </span>
              <span className="text-xs text-slate-400 font-semibold bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {selectedArticle.part} ({selectedArticle.partName})
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-3">
              {selectedArticle.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {selectedArticle.summary}
            </p>

            {/* Key Clauses Breakdown */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Constitutional Clauses & Sub-Rules:
              </h4>
              <div className="space-y-2">
                {selectedArticle.keyClauses.map((clause, i) => (
                  <div key={i} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{clause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Tip */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 mb-6 text-xs text-emerald-300">
              <strong className="text-emerald-400 block mb-1 font-bold">
                ⚖️ Practical Advocate Practice Strategy:
              </strong>
              <p className="leading-relaxed">{selectedArticle.advocateTip}</p>
            </div>

            {/* Landmark Cases */}
            {selectedArticle.landmarkCases && selectedArticle.landmarkCases.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Landmark Judicial Precedents:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.landmarkCases.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 text-amber-300 text-xs rounded-xl border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleCopyCitation(`${selectedArticle.number}: ${selectedArticle.title}\n${selectedArticle.summary}`, selectedArticle.number)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Full Rule</span>
              </button>

              <a
                href={getDirectWhatsAppUrl(`Hello Advocate,\nI want consultation on ${selectedArticle.number} (${selectedArticle.title}) regarding my matter.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Consult on this Article</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
