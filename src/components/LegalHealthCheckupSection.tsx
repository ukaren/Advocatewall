import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  PhoneCall, 
  FileText, 
  ArrowRight, 
  HelpCircle,
  Award
} from 'lucide-react';
import { LEGAL_HEALTH_QUESTIONS } from '../data/legalTriageData';
import { ADVOCATES_LIST } from '../data/advocates';
import { useCart } from '../context/CartContext';

interface LegalHealthCheckupSectionProps {
  onOpenCallModal?: () => void;
}

export const LegalHealthCheckupSection: React.FC<LegalHealthCheckupSectionProps> = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { startCallWithAdvocate } = useCart();
  const leadAdvocate = ADVOCATES_LIST[0];

  const question = LEGAL_HEALTH_QUESTIONS[currentStep];

  const handleSelectOption = (questionId: string, score: number) => {
    const nextAnswers = { ...answers, [questionId]: score };
    setAnswers(nextAnswers);

    if (currentStep < LEGAL_HEALTH_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const totalScore = (Object.values(answers) as number[]).reduce((acc, curr) => acc + curr, 0);

  const getScoreAssessment = (score: number) => {
    if (score >= 80) {
      return {
        rating: 'Excellent Legal Readiness',
        hindiRating: 'मजबूत कानूनी सुरक्षा स्थिति',
        color: 'emerald',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        textColor: 'text-emerald-600',
        summary: 'Your property, financial, and contractual agreements have strong legal shielding. Keep periodic document renewals active.',
        risk: 'Low Risk'
      };
    } else if (score >= 50) {
      return {
        rating: 'Moderate Legal Vulnerability',
        hindiRating: 'मध्यम कानूनी जोखिम — सुधार की आवश्यकता',
        color: 'amber',
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
        textColor: 'text-amber-600',
        summary: 'Certain areas like informal lending or unregistered tenancy agreements leave you vulnerable to sudden litigation or financial loss.',
        risk: 'Moderate Action Needed'
      };
    } else {
      return {
        rating: 'High Litigation Exposure',
        hindiRating: 'उच्च कानूनी जोखिम — तत्काल परामर्श आवश्यक',
        color: 'rose',
        badgeBg: 'bg-rose-50 text-rose-900 border-rose-300',
        textColor: 'text-rose-600',
        summary: 'Missing formal agreements and unrecorded claims expose you to severe evidentiary difficulties in Indian courts. Immediate advocate documentation is advised.',
        risk: 'Immediate Advocate Review Recommended'
      };
    }
  };

  const assessment = getScoreAssessment(totalScore);

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  return (
    <section id="health-checkup" className="py-16 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background Ambience */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Interactive 60-Second Tool</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-serif mb-2">
          Citizen Legal Health & Risk Assessment
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-8 font-['Noto_Serif_Devanagari']">
          4 सरल सवालों के जवाब दें और अपनी कानूनी सुरक्षा का सटीक स्कोर (Score) व एडवाइस प्राप्त करें
        </p>

        {/* Card Container */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md text-left">
          {!isCompleted ? (
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Question {currentStep + 1} of {LEGAL_HEALTH_QUESTIONS.length}
                  </span>
                  <span className="text-xs text-slate-400 ml-2 font-medium">
                    • {question.category}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {LEGAL_HEALTH_QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentStep
                          ? 'w-7 bg-amber-400'
                          : idx < currentStep
                          ? 'w-3 bg-emerald-500'
                          : 'w-3 bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Title */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                  {question.title}
                </h3>
                <p className="text-sm text-slate-400 font-['Noto_Serif_Devanagari']">
                  {question.hindiTitle}
                </p>
              </div>

              {/* Options Stack */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(question.id, opt.score)}
                    className="w-full text-left p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-amber-400/80 hover:bg-slate-850 transition-all flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-400/10">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-amber-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white leading-relaxed">
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-500 group-hover:text-slate-400 mt-1">
                        💡 Legal Context: {opt.tip}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 border-4 border-amber-400 shadow-xl mb-4 relative">
                <span className="text-3xl font-black text-white font-mono">
                  {totalScore}
                </span>
                <span className="text-[10px] text-amber-400 absolute bottom-3 font-bold uppercase tracking-tighter">
                  / 100 Score
                </span>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-2 ${assessment.badgeBg}`}>
                  {assessment.risk}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {assessment.rating}
                </h3>
                <p className="text-sm text-amber-300 font-['Noto_Serif_Devanagari'] mt-1">
                  {assessment.hindiRating}
                </p>
              </div>

              <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-sm text-slate-300 mb-6 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-1">Advocate Advisory Summary:</strong>
                    {assessment.summary}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => startCallWithAdvocate(leadAdvocate, 15)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all shadow-lg cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-slate-950 animate-pulse" />
                  <span>Discuss Score With Advocate (₹10/Min)</span>
                </button>

                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
