import React from 'react';
import { Scale, ShieldCheck, Clock, FileCheck2, UserCheck, MessageSquare } from 'lucide-react';
import { BUSINESS_CONFIG } from '../data/config';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Scale,
      title: "Fixed & Transparent Pricing",
      description: "No billable hourly surprises or hidden chamber fees. Every service, notice, and consultation comes with a fixed, transparent upfront price.",
      tag: "100% Transparent"
    },
    {
      icon: UserCheck,
      title: "Direct Advocate Attention",
      description: "You consult and interact directly with an experienced Advocate, not sales agents, automated chatbots, or intermediate paralegals.",
      tag: "Certified Counsel"
    },
    {
      icon: ShieldCheck,
      title: "Privileged & Confidential",
      description: "All client documents, dispute facts, and audio/video consultations are protected under strict advocate-client legal professional privilege.",
      tag: "Strict Privacy"
    },
    {
      icon: FileCheck2,
      title: "Statutory Court Formats",
      description: "All draft agreements, statutory legal notices, and petitions follow the latest Indian statutes (BNS/BNSS, Contract Act, Consumer Protection Act).",
      tag: "Legally Sound"
    },
    {
      icon: Clock,
      title: "Prompt Turnaround (24–48h)",
      description: "Fast digital drafting turnaround. Receive complete drafts with a free revision round without endless waiting or courtroom queues.",
      tag: "Fast Digital Delivery"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp & Online Ease",
      description: "Send documents over WhatsApp, review drafts from home or office, and conduct scheduled video conferences at your convenience.",
      tag: "Complete Convenience"
    }
  ];

  return (
    <section id="why-us" className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-md">
            The {BUSINESS_CONFIG.name} Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display mt-3 mb-4">
            Why Clients Choose Our Legal Services
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Combining the rigor of traditional courtroom expertise with the speed, clarity, and convenience of modern digital delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
