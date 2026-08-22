import React from 'react';
import { MousePointerClick, FileText, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onExploreServices: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onExploreServices }) => {
  const steps = [
    {
      number: "01",
      icon: MousePointerClick,
      title: "Choose a Service",
      description: "Browse our transparent catalog of consultations, document drafting, notices, and contract audits. Add needed services to your cart."
    },
    {
      number: "02",
      icon: FileText,
      title: "Submit Your Requirement",
      description: "Provide brief context or documents through our simple enquiry checkout or directly via WhatsApp."
    },
    {
      number: "03",
      icon: PhoneCall,
      title: "Discuss With Advocate",
      description: "The Advocate connects with you via phone/video or WhatsApp to clarify facts, confirm strategy, and answer questions."
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Get Legal Assistance",
      description: "Receive your finalized legal notice, customized agreement, risk report, or detailed legal advice checklist."
    }
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-200/80 px-3 py-1 rounded-md">
            Seamless 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Get reliable, certified legal assistance delivered to your screen without unnecessary complexity.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step Top */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-slate-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreServices}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <span>Start by Choosing a Service</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
