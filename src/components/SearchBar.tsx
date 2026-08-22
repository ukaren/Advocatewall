import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  resultCount,
}) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          id="services-search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search legal services (e.g., Notice, Rent Agreement, Consumer, Consultation)..."
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-xs"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {query && typeof resultCount === 'number' && (
        <p className="mt-1.5 text-xs text-slate-500 pl-1">
          Showing {resultCount} {resultCount === 1 ? 'service' : 'services'} for "{query}"
        </p>
      )}
    </div>
  );
};
