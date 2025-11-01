// src/services/search.service.ts
import { apiClient } from '@/lib/api/axios-client';
import {
  SearchType,
  SearchRequest,
  SearchResponse,
  RAGResponse,
  SearchResult,
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
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.post<any>(
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

      const page = request.page || 1;
      const pageSize = request.pageSize || 10;

      // Handle different API response formats
      let results: SearchResult[] = [];
      let total = 0;

      // Check if response and response.data exist
      if (!response || !response.data) {
        return {
          results: [],
          total: 0,
          page,
          pageSize,
          hasMore: false,
        };
      }

      // Format 1: { results: [...], total: number }
      if (response.data?.results && Array.isArray(response.data.results)) {
        results = response.data.results;
        total = response.data.total || response.data.results.length;
      }
      // Format 2: { totalRecords: number, instances: [...] }
      else if (response.data?.instances && Array.isArray(response.data.instances)) {
        results = response.data.instances;
        total = response.data.totalRecords || response.data.instances.length;
      }
      // Format 3: Data wrapped in data property
      else if (response.data?.data?.results && Array.isArray(response.data.data.results)) {
        results = response.data.data.results;
        total = response.data.data.total || response.data.data.results.length;
      }
      // Format 4: Direct array response
      else if (Array.isArray(response.data)) {
        results = response.data;
        total = response.data.length;
      }
      // Format 5: { data: [...] } (array wrapped in data)
      else if (Array.isArray(response.data?.data)) {
        results = response.data.data;
        total = response.data.data.length;
      }
      // Format 6: Empty response or unexpected format
      else {
        results = [];
        total = 0;
      }

      return {
        results,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      };
    } catch (error) {
      console.error('Error in standardSearch:', error);
      // Return empty results instead of throwing
      return {
        results: [],
        total: 0,
        page: request.page || 1,
        pageSize: request.pageSize || 10,
        hasMore: false,
      };
    }
  }

  /**
   * Perform RAG search - returns AI-generated answer with sources
   */
  private static async ragSearch(request: SearchRequest): Promise<RAGResponse> {
    try {
      const response = await apiClient.post<RAGResponse>(`${this.SEARCH_BASE}/rag`, {
        query: request.query,
      });

      if (!response || !response.data) {
        return {
          totalRecords: 0,
          instances: [],
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error in ragSearch:', error);
      // Return empty RAG response instead of throwing
      return {
        totalRecords: 0,
        instances: [],
      };
    }
  }

  /**
   * Get document details by ID using filters endpoint
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getDocumentById(documentId: string): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.post<any>(`${this.SEARCH_BASE}/filters`, {
        field: 'documentId',
        value: documentId,
      });

      if (!response || !response.data) {
        return {};
      }

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
    } catch (error) {
      console.error('Error in getDocumentById:', error);
      // Return empty object instead of throwing
      return {};
    }
  }
}
