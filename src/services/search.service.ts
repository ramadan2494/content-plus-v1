// src/services/search.service.ts
import { apiClient } from '@/lib/api/axios-client';
import {
  SearchType,
  SearchRequest,
  SearchResponse,
  RAGResponse,
  SearchResult,
  RAGResult,
} from '@/types';

/**
 * Search Service
 * Handles all search-related API calls
 * Following Single Responsibility Principle
 */
export class SearchService {
  private static readonly SEARCH_BASE = '/v1/search';

  /**
   * Perform search based on search type
   */
  static async search(
    searchType: SearchType,
    request: SearchRequest
  ): Promise<SearchResponse | RAGResponse> {
    if (searchType === 'rag') {
      return this.ragSearch(request);
    }

    return this.standardSearch(searchType, request);
  }

  /**
   * Perform standard search (fuzzy, exact, partial, semantic)
   */
  private static async standardSearch(
    searchType: SearchType,
    request: SearchRequest
  ): Promise<SearchResponse> {
    const response = await apiClient.post<{ results: SearchResult[]; total: number }>(
      `${this.SEARCH_BASE}/${searchType}`,
      {
        query: request.query,
        filters: request.filters,
        page: request.page || 1,
        pageSize: request.pageSize || 10,
        sortBy: request.sortBy,
        sortOrder: request.sortOrder,
      }
    );

    const { results, total } = response.data;
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    return {
      results,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    };
  }

  /**
   * Perform RAG search - returns AI-generated answer with sources
   */
  private static async ragSearch(request: SearchRequest): Promise<RAGResponse> {
    const response = await apiClient.post<RAGResponse>(`${this.SEARCH_BASE}/rag`, {
      query: request.query,
    });

    return response.data;
  }

  /**
   * Get document details by ID using filters endpoint
   */
  static async getDocumentById(documentId: string): Promise<any> {
    const response = await apiClient.post<any>(`${this.SEARCH_BASE}/filters`, {
      field: 'documentId',
      value: documentId,
    });

    console.log('Document API Response:', response.data);

    // Handle the response format: { totalRecords: 1, instances: [...] }
    if (response.data?.instances && Array.isArray(response.data.instances)) {
      return response.data.instances[0] || {};
    }

    // Handle if data is wrapped in a data property
    if (response.data?.data?.instances && Array.isArray(response.data.data.instances)) {
      return response.data.data.instances[0] || {};
    }
    
    // Or it might be an array directly
    if (Array.isArray(response.data)) {
      return response.data[0] || response.data;
    }

    // Or it might have results property
    if (response.data?.results && Array.isArray(response.data.results)) {
      return response.data.results[0] || response.data;
    }

    // Otherwise return as is
    return response.data;
  }
}
