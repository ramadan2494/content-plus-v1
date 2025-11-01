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
  yearFrom?: number;
  yearTo?: number;
  minCitations?: number;
  venues?: string[];
  openAccess?: boolean;
}

export interface FilterRequest {
  field: string;
  value: string;
}

// OpenAlex Metadata
export interface OpenAlexMetadata {
  workId?: string;
  doi?: string;
  openAccess?: {
    isOpenAccess: boolean;
    oaStatus?: string;
    oaUrl?: string;
  };
  concepts?: Array<{
    id: string;
    displayName: string;
    score: number;
  }>;
  locations?: Array<{
    source?: {
      displayName: string;
      hostOrganization?: string;
    };
    pdfUrl?: string;
    landingPageUrl?: string;
  }>;
  referencedWorks?: string[];
  relatedWorks?: string[];
  primaryLocation?: {
    source?: {
      displayName: string;
      hostOrganization?: string;
      issn?: string[];
    };
    pdfUrl?: string;
    landingPageUrl?: string;
  };
  alternateHosts?: Array<{
    displayName: string;
    url: string;
  }>;
  authorships?: Array<{
    author: {
      id: string;
      displayName: string;
      orcid?: string;
    };
    institutions?: Array<{
      displayName: string;
      countryCode?: string;
    }>;
  }>;
  venues?: Array<{
    displayName: string;
    type?: string;
    publisher?: string;
  }>;
  biblio?: {
    volume?: string;
    issue?: string;
    firstPage?: string;
    lastPage?: string;
  };
  citationCount?: number;
  publicMetrics?: {
    citationCount: number;
    influenceMetrics?: {
      hIndex?: number;
      i10Index?: number;
    };
  };
}

// SciSpace Metadata
export interface SciSpaceMetadata {
  sciSpaceId?: string;
  summary?: string;
  methodology?: string;
  keyFindings?: string[];
  limitations?: string[];
  futureWork?: string[];
  fullTextUrl?: string;
  relatedPapers?: string[];
  similarPapers?: string[];
}

export interface AcademicMetadata {
  openAlex?: OpenAlexMetadata;
  sciSpace?: SciSpaceMetadata;
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
  // Academic-specific fields
  doi?: string;
  venue?: string;
  journal?: string;
  year?: number;
  keywords?: string[];
  academicMetadata?: AcademicMetadata;
  openAccess?: boolean;
  pdfUrl?: string;
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
  year?: number;
  venue?: string;
  citations?: number;
  doi?: string;
  academicMetadata?: AcademicMetadata;
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
