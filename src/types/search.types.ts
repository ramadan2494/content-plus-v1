// src/types/search.types.ts
export type SearchType = 'fuzzy' | 'exact' | 'partial' | 'semantic' | 'rag';

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  categories?: string[];
  databases?: string[];
  dateFrom?: string;
  dateTo?: string;
  authors?: string[];
}

export interface FilterRequest {
  field: string;
  value: string;
}

export interface SearchResult {
  id: string;
  documentId: string;
  title: string;
  authors: string[];
  abstract: string;
  content: string;
  category: string;
  database: string;
  publicationDate: string;
  citations?: number;
  url?: string;
  score: number;
  highlights?: string[];
}

export interface RAGResult {
  answer: string;
  sources: RAGSource[];
  confidence: number;
  query?: string;
}

export interface RAGSource {
  documentId: string;
  text: string;
  score: number;
  title?: string;
  authors?: string[];
  excerpt?: string;
  relevanceScore?: number;
  url?: string;
  publicationDate?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface RAGResponse {
  totalRecords: number;
  instances: Array<{
    answer: string;
    confidence: number;
    sources: RAGSource[];
  }>;
}

export interface SearchState {
  searchType: SearchType;
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  ragResult: RAGResult | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  setSearchType: (type: SearchType) => void;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  performSearch: () => Promise<void>;
  clearResults: () => void;
  loadMore: () => Promise<void>;
}
