import React, { useState, useMemo } from 'react';
import { SERVICES } from '../data/services';
import { ServiceCategory, ServiceItem } from '../types';
import { ServiceCard } from './ServiceCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { SearchX, Sparkles } from 'lucide-react';

interface ServiceGridProps {
  onViewDetails: (service: ServiceItem) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onViewDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.shortDescription.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.fullDescription.toLowerCase().includes(q) ||
        service.whatsIncluded.some((item) => item.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <section id="services" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title & Description */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100/80 text-amber-950 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Legal Services Marketplace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display mb-3">
            Choose Your Legal Service
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Select standard document drafting, contract reviews, or book a direct consultation with the Advocate. Add multiple services to your enquiry cart or chat on WhatsApp.
          </p>
        </div>

        {/* Search & Category Controls */}
        <div className="space-y-4 mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            resultCount={filteredServices.length}
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No matching legal services found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-5">
              We couldn't find any service matching "{searchQuery}". Try a different keyword or view all categories.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
