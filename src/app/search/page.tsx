// src/app/search/page.tsx
'use client';

import { useSearchStore } from '@/store';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchTabs } from '@/components/search/SearchTabs';
import { SearchResults } from '@/components/search/SearchResults';
import { RAGResults } from '@/components/search/RAGResults';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Academic Research Platform
              </div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Content Plus
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover and explore academic papers with AI-powered search. Ask questions, find research, and access metadata from OpenAlex and SciSpace.
              </p>
            </div>

            {/* Search Type Tabs */}
            <div className="flex justify-center">
              <SearchTabs value={searchType} onChange={setSearchType} />
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
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Search Results */}
            {((results && results.length > 0) || ragResult) && (
              <div className="mt-12">
                {searchType === 'rag' ? (
                  <RAGResults result={ragResult} isLoading={isLoading} />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                      <div className="sticky top-8">
                        <SearchFilters />
                      </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                      <SearchResults results={results || []} isLoading={isLoading} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No results message */}
            {!isLoading && query && (!results || results.length === 0) && !ragResult && (
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
                    Try adjusting your search query or filters. Consider using different keywords or broader terms.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      Try: "machine learning algorithms"
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      Try: "neural networks"
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      Try: broader keywords
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State - No search yet */}
            {!query && !isLoading && (!results || results.length === 0) && !ragResult && (
              <div className="text-center py-20">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Start your academic search
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Search for academic papers, ask questions using AI, and explore research metadata
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-3xl mb-3">🔬</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Regular Search</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Find papers by keywords and metadata
                      </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="text-3xl mb-3">🤖</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Search</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ask questions and get AI-powered answers
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-3xl mb-3">📊</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Rich Metadata</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Access OpenAlex and SciSpace data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
