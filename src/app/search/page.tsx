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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Content Plus
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                AI-Powered Academic Search Platform
              </p>
            </div>

            {/* Search Type Tabs */}
            <SearchTabs value={searchType} onChange={setSearchType} />

            {/* Search Bar */}
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Search Results */}
            {(results.length > 0 || ragResult) && (
              <div className="mt-8">
                {searchType === 'rag' ? (
                  <RAGResults result={ragResult} isLoading={isLoading} />
                ) : (
                  <SearchResults results={results} isLoading={isLoading} />
                )}
              </div>
            )}

            {/* No results message */}
            {!isLoading && query && results.length === 0 && !ragResult && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No results found. Try a different search term.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
