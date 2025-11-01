// src/components/search/SearchBar.tsx
'use client';

import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  onToggleFilters?: () => void;
}

const EXAMPLE_QUERIES = [
  "machine learning algorithms",
  "neural networks in healthcare",
  "quantum computing applications",
  "renewable energy solutions",
  "climate change mitigation",
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  isLoading,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch();
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      onSearch();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    // Auto-search when suggestion is clicked
    setTimeout(() => {
      onSearch();
    }, 100);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              type="text"
              placeholder="Search academic papers, ask questions, explore research..."
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-12 pr-4 h-16 text-lg border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-600 shadow-lg rounded-xl transition-all"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading || !value.trim()} 
            className="h-16 px-10 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Search
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Example Queries */}
      {showSuggestions && !value && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 z-20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Try these searches:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(query)}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors border border-blue-200 dark:border-blue-800"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
