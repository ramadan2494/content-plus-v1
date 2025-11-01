// src/types/document.types.ts
export interface Document {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  content: string;
  category: string;
  database: string;
  publicationDate: string;
  keywords: string[];
  doi?: string;
  url?: string;
  citations?: number;
  embedding?: number[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadRequest {
  title: string;
  authors: string[];
  abstract: string;
  content: string;
  category: string;
  database: string;
  publicationDate: string;
  keywords?: string[];
  doi?: string;
  url?: string;
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

export interface BatchUploadRequest {
  documents: DocumentUploadRequest[];
}

export interface UploadResponse {
  success: boolean;
  documentId?: string;
  message: string;
  errors?: string[];
}

export interface BatchUploadResponse {
  success: boolean;
  uploadedCount: number;
  failedCount: number;
  results: UploadResponse[];
}
