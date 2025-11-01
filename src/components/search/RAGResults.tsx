// src/components/search/RAGResults.tsx
'use client';

import { RAGResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { useState } from 'react';

interface RAGResultsProps {
  result: RAGResult | null;
  isLoading: boolean;
}

export const RAGResults: React.FC<RAGResultsProps> = ({ result, isLoading }) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20">
        <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No answer generated
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try entering a question to get an AI-powered answer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI-Generated Answer */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl">AI-Generated Answer</CardTitle>
            </div>
            {result.confidence && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </p>
          </div>

          {result.confidence && (
            <div className="mt-6">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sources */}
      {result.sources && result.sources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Reference Papers ({result.sources.length})
          </h3>
          <div className="space-y-3">
            {result.sources.map((source, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-indigo-600"
                onClick={() => setSelectedDocumentId(source.documentId)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {/* Reference Number & Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-sm flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {source.title || source.text || 'Document'}
                        </h4>
                      </div>

                      {/* Text/Excerpt */}
                      {source.text && (
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 ml-11 line-clamp-2">
                          {source.text}
                        </p>
                      )}

                      {/* Click hint */}
                      <p className="text-xs text-blue-600 dark:text-blue-400 ml-11 mt-2">
                        Click to view details
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDocumentId && (
        <DocumentDetailsModal
          documentId={selectedDocumentId}
          onClose={() => setSelectedDocumentId(null)}
        />
      )}
    </div>
  );
};
