// src/components/search/DocumentDetailsModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchService } from '@/services';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDate } from '@/lib/utils';
import { ExternalLink, Copy, BookOpen, Calendar, Database, Globe, FileText, Tag } from 'lucide-react';

interface DocumentDetailsModalProps {
  documentId: string;
  onClose: () => void;
}

interface DocumentDetails {
  title?: string;
  authors?: Array<{ name: string }>;
  abstract?: string;
  year?: number;
  datePublished?: string;
  publisher?: string;
  doi?: string;
  downloadUrl?: string;
  language?: string;
  database?: string[];
  topics?: string[];
  subjects?: string[];
  identifiers?: Array<{ type: string; id: string }>;
  coreId?: string;
  [key: string]: any;
}

export const DocumentDetailsModal: React.FC<DocumentDetailsModalProps> = ({
  documentId,
  onClose,
}) => {
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await SearchService.getDocumentById(documentId);
        console.log('Document Details Data:', data);
        setDocument(data as any);
      } catch (err: any) {
        console.error('Error fetching document:', err);
        setError(err?.message || 'Failed to load document details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Document Details
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {document && !isLoading && (
            <div className="space-y-6">
              {/* Debug Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs">
                  <details>
                    <summary className="cursor-pointer font-semibold">Debug: Document Data</summary>
                    <pre className="mt-2 overflow-auto">{JSON.stringify(document, null, 2)}</pre>
                  </details>
                </div>
              )}

              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {document.title || document.text || 'No title available'}
                </h3>
              </div>

              {/* Authors */}
              {document.authors && document.authors.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Authors
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {document.authors.map((author) => author.name).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                {document.year && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Year
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{document.year}</p>
                    </div>
                  </div>
                )}

                {document.datePublished && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Published Date
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDate(document.datePublished)}
                      </p>
                    </div>
                  </div>
                )}

                {document.publisher && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Publisher
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{document.publisher}</p>
                    </div>
                  </div>
                )}

                {document.language && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Language
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 uppercase">
                        {document.language}
                      </p>
                    </div>
                  </div>
                )}

                {document.database && document.database.length > 0 && (
                  <div className="flex items-start gap-3 col-span-2">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Database
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {document.database.map((db, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                          >
                            {db}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* DOI */}
              {document.doi && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        DOI
                      </h4>
                      <a
                        href={document.doi.startsWith('http') ? document.doi : `https://doi.org/${document.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {document.doi}
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard(document.doi!)}
                      className="ml-2 p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                      title="Copy DOI"
                    >
                      <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Download URL */}
              {document.downloadUrl && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Download
                  </h4>
                  <a
                    href={document.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Download Full Text
                  </a>
                </div>
              )}

              {/* Identifiers */}
              {document.identifiers && document.identifiers.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Identifiers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {document.identifiers.map((identifier, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded"
                      >
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                          {identifier.type}:
                        </span>
                        <a
                          href={identifier.id}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline truncate ml-2"
                        >
                          {identifier.id.replace('https://', '')}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics */}
              {document.topics && document.topics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {document.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {document.subjects && document.subjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {document.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Abstract */}
              {document.abstract && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Abstract
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {document.abstract}
                  </p>
                </div>
              )}

              {/* Core ID */}
              {document.coreId && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Core ID: {document.coreId}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
