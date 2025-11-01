// src/store/search.store.ts
import { create } from 'zustand';
import { SearchState, SearchType, SearchFilters, SearchResponse } from '@/types';
import { SearchService } from '@/services';
import { SEARCH_CONFIG } from '@/config/constants';

/**
 * Search Store using Zustand
 * Manages global search state
 */
export const useSearchStore = create<SearchState>((set, get) => ({
  searchType: 'rag',
  query: '',
  filters: {},
  results: [],
  ragResult: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  hasMore: false,

  setSearchType: (searchType: SearchType) => {
    set({ searchType, results: [], ragResult: null, page: 1 });
  },

  setQuery: (query: string) => {
    set({ query });
  },

  setFilters: (filters: SearchFilters) => {
    set({ filters, page: 1 });
  },

  performSearch: async () => {
    const { searchType, query, filters, page } = get();

    if (!query || query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      set({ error: 'Please enter at least 2 characters to search' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await SearchService.search(searchType, {
        query,
        filters,
        page,
        pageSize: SEARCH_CONFIG.DEFAULT_PAGE_SIZE,
      });

      if (searchType === 'rag') {
        // RAG search returns answer and sources in new format
        const ragResponse = response as any;
        
        // Handle the new API response format
        if (ragResponse.instances && ragResponse.instances.length > 0) {
          const firstInstance = ragResponse.instances[0];
          set({
            ragResult: {
              answer: firstInstance.answer,
              confidence: firstInstance.confidence,
              sources: firstInstance.sources,
            },
            results: [],
            isLoading: false,
            error: null,
          });
        } else {
          set({
            ragResult: null,
            results: [],
            isLoading: false,
            error: 'No AI answer available',
          });
        }
      } else {
        // Standard search returns results
        const standardResponse = response as SearchResponse;

        console.log('Standard Search Response:', standardResponse);
        console.log('Results:', standardResponse.results);
        console.log('Results length:', standardResponse.results?.length);

        const resultsArray = Array.isArray(standardResponse.results) 
          ? standardResponse.results 
          : [];

        set({
          results: resultsArray,
          total: standardResponse.total || 0,
          hasMore: standardResponse.hasMore || false,
          ragResult: null,
          isLoading: false,
          error: null,
        });

        console.log('State set with results:', resultsArray.length);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Search failed. Please try again.';

      set({
        isLoading: false,
        error: errorMessage,
        results: [],
        ragResult: null,
      });
    }
  },

  clearResults: () => {
    set({
      results: [],
      ragResult: null,
      total: 0,
      page: 1,
      hasMore: false,
      error: null,
    });
  },

  loadMore: async () => {
    const { hasMore, page } = get();

    if (!hasMore) return;

    set({ page: page + 1 });
    await get().performSearch();
  },
}));
