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
  Share2
} from 'lucide-react';
import {
  PREAMBLE_DATA,
  CONSTITUTION_PARTS,
  KEY_CONSTITUTION_ARTICLES,
  CONSTITUTION_SCHEDULES,
  LANDMARK_JUDGMENTS,
  FIVE_PREROGATIVE_WRITS,
  ConstitutionArticle
} from '../data/constitutionData';
import { useCart } from '../context/CartContext';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const ConstitutionSection: React.FC = () => {
  const { addToast } = useCart();
  const [activeTab, setActiveTab] = useState<'articles' | 'preamble' | 'parts' | 'writs' | 'schedules' | 'judgments'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<ConstitutionArticle | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  return (
    <section id="constitution" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Subtle Background Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Bharatiya Samvidhan • Supreme Law of India</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display mb-4">
            Constitution of India Rules & Legal Articles
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Explore the comprehensive rules, fundamental rights, constitutional remedies, and landmark doctrines of the Indian Constitution. Search any article or connect with an advocate for writ petitions and constitutional advisory.
          </p>

          {/* Quick Tab Selector */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-inner max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'articles'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Key Articles & Rights</span>
            </button>

            <button
              onClick={() => setActiveTab('preamble')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'preamble'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>The Preamble</span>
            </button>

            <button
              onClick={() => setActiveTab('writs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'writs'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>5 Prerogative Writs</span>
            </button>

            <button
              onClick={() => setActiveTab('parts')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'parts'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All 22 Parts</span>
            </button>

            <button
              onClick={() => setActiveTab('schedules')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'schedules'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>12 Schedules</span>
            </button>

            <button
              onClick={() => setActiveTab('judgments')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'judgments'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Landmark Judgments</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Key Articles & Fundamental Rights Explorer */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
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
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold"
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
                          💡 Legal Practice Insight:
                        </span>
                        <p className="line-clamp-2">{art.advocateTip}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedArticle(art)}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full Rule & Clauses</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyCitation(`${art.number}: ${art.title} - ${art.summary}`, art.number)}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Copy Citation"
                        >
                          {copiedText === art.number ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={getDirectWhatsAppUrl(`Hello Advocate,\nI need legal advice regarding ${art.number} (${art.title}) for my matter.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1"
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

        {/* TAB 2: The Preamble */}
        {activeTab === 'preamble' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Preamble Parchment Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-800 to-slate-900 border-2 border-amber-400/40 shadow-2xl relative">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  The Soul of the Indian Constitution
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                  {PREAMBLE_DATA.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adopted on {PREAMBLE_DATA.adoptedDate} • Enforced on {PREAMBLE_DATA.enforcedDate}
                </p>
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
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
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

        {/* TAB 3: 5 Prerogative Writs (Articles 32 & 226) */}
        {activeTab === 'writs' && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 text-center max-w-3xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Gavel className="w-6 h-6" />
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
                      {writ.name}
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
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all"
                    >
                      File Writ Petition
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: All 22 Parts of Constitution */}
        {activeTab === 'parts' && (
          <div className="max-w-5xl mx-auto space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                Structure of the Indian Constitution (22 Parts)
              </h3>
              <p className="text-xs text-slate-300">
                The Constitution of India originally contained 395 Articles divided into 22 Parts (now expanded to 25 Parts).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {CONSTITUTION_PARTS.map((part, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/40 transition-all flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                    {part.roman.replace('Part ', '')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white truncate">{part.name}</h4>
                      <span className="text-[10px] font-mono text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 flex-shrink-0">
                        {part.articlesRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{part.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 12 Schedules */}
        {activeTab === 'schedules' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                The 12 Schedules of the Indian Constitution
              </h3>
              <p className="text-xs text-slate-300">
                Schedules provide categorized lists, allocation tables, oaths, administrative frameworks, and legislative powers.
              </p>
            </div>

            <div className="space-y-3">
              {CONSTITUTION_SCHEDULES.map((sch) => (
                <div
                  key={sch.number}
                  className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 hover:border-amber-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-md">
                      #{sch.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-white">{sch.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{sch.description}</p>
                    </div>
                  </div>

                  <div className="sm:text-right flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700">
                    <span className="text-[10px] font-mono text-amber-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 block sm:inline-block">
                      {sch.keyArticles}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Landmark Judgments */}
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
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
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

        {/* Bottom Direct Counsel Callout */}
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
              href="tel:+919867015157"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Advocate: 98670 15157</span>
            </a>
            <a
              href={getDirectWhatsAppUrl("Hello Advocate,\nI need constitutional legal counsel and advice on filing a Writ Petition in the High Court.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Counsel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Full Article Modal / Drawer */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Full Rule</span>
              </button>

              <a
                href={getDirectWhatsAppUrl(`Hello Advocate,\nI want consultation on ${selectedArticle.number} (${selectedArticle.title}) regarding my matter.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
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
