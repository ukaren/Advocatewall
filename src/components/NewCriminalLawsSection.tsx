import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Search, 
  BookOpen, 
  ArrowRightLeft, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  PhoneCall, 
  CheckCircle2, 
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import { NEW_CRIMINAL_LAWS_MAPPINGS, NEW_ACTS_OVERVIEW, LawSectionMapping } from '../data/newCriminalLawsData';
import { BUSINESS_CONFIG } from '../data/config';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface NewCriminalLawsSectionProps {
  onOpenCallModal?: () => void;
}

export const NewCriminalLawsSection: React.FC<NewCriminalLawsSectionProps> = ({ onOpenCallModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMapping, setSelectedMapping] = useState<LawSectionMapping | null>(NEW_CRIMINAL_LAWS_MAPPINGS[0]);
  const [activeTab, setActiveTab] = useState<'mapper' | 'overview'>('mapper');

  const categories = ['All', 'Offences Against Body', 'Property & Fraud', 'Women & Children', 'Public Tranquility & State', 'Criminal Procedure (BNSS)', 'Evidence & Electronic Records (BSA)'];

  const filteredMappings = useMemo(() => {
    return NEW_CRIMINAL_LAWS_MAPPINGS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesCategory;

      const matchesSearch = 
        item.topic.toLowerCase().includes(term) ||
        item.oldSection.toLowerCase().includes(term) ||
        item.newSection.toLowerCase().includes(term) ||
        item.oldTitle.toLowerCase().includes(term) ||
        item.newTitle.toLowerCase().includes(term) ||
        item.oldAct.toLowerCase().includes(term) ||
        item.newAct.toLowerCase().includes(term) ||
        item.advocateNotes.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <section id="new-criminal-laws" className="py-16 md:py-20 bg-slate-900 text-slate-100 relative overflow-hidden border-t border-b border-slate-800">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>India New Criminal Laws 2024–2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
            BNS, BNSS & BSA <span className="text-amber-400">Section Converter</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Transitioning from the Indian Penal Code (IPC 1860), CrPC (1973), and Evidence Act (1872) to the new Bharatiya Criminal Codes. Cross-reference sections, penalties, procedural mandates, and advocate strategies.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-800 border border-slate-700 rounded-xl mt-6">
            <button
              onClick={() => setActiveTab('mapper')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'mapper' 
                  ? 'bg-amber-400 text-slate-950 shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                <span>IPC to BNS Section Mapper</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-amber-400 text-slate-950 shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>3 New Acts Overview</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          /* Overview of 3 Acts */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEW_ACTS_OVERVIEW.map((act, index) => (
              <div 
                key={index}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-amber-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-bold font-mono">
                      {act.replaces}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {act.effectiveDate}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{act.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{act.totalSections}</p>

                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key Structural Reforms:</p>
                    {act.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      setActiveTab('mapper');
                      if (index === 0) setSelectedCategory('All');
                      if (index === 1) setSelectedCategory('Criminal Procedure (BNSS)');
                      if (index === 2) setSelectedCategory('Evidence & Electronic Records (BSA)');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Browse {act.name.split(',')[0]} Sections</span>
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Mapper Interface */
          <div>
            {/* Search & Filter Bar */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-6 backdrop-blur">
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by section (e.g. 302, 420, 376) or topic (FIR, Bail, Theft)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Main Interactive Mapper Grid: List on Left, Detail Card on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Mappings List */}
              <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {filteredMappings.length === 0 ? (
                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                    <p className="text-sm font-semibold text-white">No matching legal provisions found</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for Section numbers (e.g. 420, 302, 154) or keyword terms.</p>
                  </div>
                ) : (
                  filteredMappings.map((item) => {
                    const isSelected = selectedMapping?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedMapping(item)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-slate-800 border-amber-400 ring-1 ring-amber-400 shadow-md'
                            : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/70 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {item.bailable ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Bailable</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">Non-Bailable</span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-2">{item.topic}</h4>

                        {/* Conversion comparison badges */}
                        <div className="flex items-center gap-2 text-xs">
                          <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-mono flex-1">
                            <span className="text-[10px] text-slate-400 block">{item.oldAct}</span>
                            <span className="font-bold text-slate-200">{item.oldSection}</span>
                          </div>

                          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />

                          <div className="px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono flex-1">
                            <span className="text-[10px] text-amber-400/80 block">{item.newAct}</span>
                            <span className="font-bold text-amber-300">{item.newSection}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Detailed Comparative Analysis Card */}
              <div className="lg:col-span-7">
                {selectedMapping ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl sticky top-24">
                    
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700">
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-slate-700 text-slate-300 text-xs font-semibold">
                          {selectedMapping.category}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1.5">{selectedMapping.topic}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          selectedMapping.cognizable 
                            ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' 
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {selectedMapping.cognizable ? 'Cognizable' : 'Non-Cognizable'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          selectedMapping.bailable 
                            ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20' 
                            : 'bg-rose-400/10 text-rose-300 border border-rose-400/20'
                        }`}>
                          {selectedMapping.bailable ? 'Bailable' : 'Non-Bailable'}
                        </span>
                      </div>
                    </div>

                    {/* Old vs New Section Comparison Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                      {/* Old Provision */}
                      <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedMapping.oldAct}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Former Law</span>
                        </div>
                        <p className="text-base font-bold font-mono text-slate-200">{selectedMapping.oldSection}</p>
                        <p className="text-xs text-slate-300 mt-1">{selectedMapping.oldTitle}</p>
                        <div className="mt-3 pt-2.5 border-t border-slate-800">
                          <span className="text-[11px] text-slate-400 block mb-0.5">Statutory Penalty:</span>
                          <span className="text-xs text-slate-300 font-medium">{selectedMapping.punishmentOld}</span>
                        </div>
                      </div>

                      {/* New Provision */}
                      <div className="bg-amber-400/5 border border-amber-400/30 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{selectedMapping.newAct}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold">Active Since July 2024</span>
                        </div>
                        <p className="text-base font-bold font-mono text-amber-300">{selectedMapping.newSection}</p>
                        <p className="text-xs text-amber-100/90 mt-1">{selectedMapping.newTitle}</p>
                        <div className="mt-3 pt-2.5 border-t border-amber-400/20">
                          <span className="text-[11px] text-amber-300/80 block mb-0.5">Statutory Penalty / Relief:</span>
                          <span className="text-xs text-amber-200 font-medium">{selectedMapping.punishmentNew}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Legislative Changes */}
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                        <span>Key Legislative & Procedural Changes</span>
                      </h4>
                      <div className="space-y-1.5 bg-slate-900/60 rounded-xl p-3.5 border border-slate-700/60">
                        {selectedMapping.keyChanges.map((change, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advocate Practical Strategy */}
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Advocate Practical Insight & Defence Strategy</span>
                      </div>
                      <p className="text-xs text-emerald-100/90 leading-relaxed">
                        {selectedMapping.advocateNotes}
                      </p>
                    </div>

                    {/* Action Callout */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-700">
                      <div className="text-xs text-slate-400 text-center sm:text-left">
                        Facing an FIR or legal matter under <span className="text-amber-300 font-semibold">{selectedMapping.newSection} {selectedMapping.newAct}</span>?
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={onOpenCallModal}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Advocate (₹10/min)</span>
                        </button>
                        <a
                          href={getDirectWhatsAppUrl(`Hello Advocate,\nI have a legal case involving ${selectedMapping.topic} (${selectedMapping.newSection} ${selectedMapping.newAct} / formerly ${selectedMapping.oldSection} ${selectedMapping.oldAct}). Please advise.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-all cursor-pointer"
                        >
                          <span>WhatsApp Advice</span>
                        </a>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center text-slate-400">
                    <Info className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-sm">Select a section mapping from the left list to view detailed comparative legal analysis.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
