import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
            Client Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display mt-3 mb-3">
            Trusted by Individuals & Businesses
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Real feedback from clients who simplified their legal documentation, property audits, and dispute notices with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Service Tag */}
                <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 mb-3">
                  {test.serviceUsed}
                </div>

                {/* Feedback */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-4">
                  "{test.feedback}"
                </p>
              </div>

              {/* Client Info */}
              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {test.clientName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {test.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{test.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
