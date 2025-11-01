// src/services/document.service.ts
import { apiClient } from '@/lib/api/axios-client';
import {
  DocumentUploadRequest,
  BatchUploadRequest,
  UploadResponse,
  BatchUploadResponse,
} from '@/types';

/**
 * Document Service
 * Handles all document-related API calls
 * Following Single Responsibility Principle
 */
export class DocumentService {
  private static readonly DOCUMENT_BASE = '/v1/documents';

  /**
   * Upload a single document
   */
  static async uploadDocument(document: DocumentUploadRequest): Promise<UploadResponse> {
    const response = await apiClient.post<UploadResponse>(
      `${this.DOCUMENT_BASE}/upload`,
      document
    );

    return response.data;
  }

  /**
   * Upload multiple documents in batch
   */
  static async batchUpload(request: BatchUploadRequest): Promise<BatchUploadResponse> {
    const response = await apiClient.post<BatchUploadResponse>(
      `${this.DOCUMENT_BASE}/batch`,
      request
    );

    return response.data;
  }

  /**
   * Upload document from file
   */
  static async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>(
      `${this.DOCUMENT_BASE}/upload-file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
}
