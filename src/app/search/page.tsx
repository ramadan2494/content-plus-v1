// src/app/search/page.tsx
'use client';

import { useSearchStore } from '@/store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { AIAssistant } from '@/components/search/AIAssistant';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchTabs } from '@/components/search/SearchTabs';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';

export default function SearchPage() {
  const {
    searchType,
    query,
    results,
    ragResult,
    isLoading,
    error,
    setSearchType,
    setQuery,
    performSearch,
  } = useSearchStore();

  const handleSearch = () => {
    if (query.trim().length > 0) {
      performSearch();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <Header />

        <main className="container mx-auto px-4 py-6">
          {/* AI Assistant Mode */}
          {searchType === 'rag' ? (
            <AIAssistant
              query={query}
              onQueryChange={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
              ragResult={ragResult}
              papers={results || []}
            />
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Regular Search Header */}
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Regular Search
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Search Academic Papers
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Find papers by keywords, filters, and metadata
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-4xl mx-auto">
                <SearchBar
                  value={query}
                  onChange={setQuery}
                  onSearch={handleSearch}
                  isLoading={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Search Results */}
              {results && results.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Filters Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-8">
                      <SearchFilters />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="lg:col-span-3">
                    <SearchResults results={results} isLoading={isLoading} />
                  </div>
                </div>
              )}

              {/* No results message */}
              {!isLoading && query && (!results || results.length === 0) && (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Try adjusting your search query or filters.
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!query && !isLoading && (!results || results.length === 0) && (
                <div className="text-center py-20">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      Start your academic search
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Search for academic papers or switch to AI Assistant mode
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Type Tabs - Always visible */}
          <div className="fixed bottom-6 left-6 z-50">
            <SearchTabs value={searchType} onChange={setSearchType} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
