// src/components/search/RAGResults.tsx
'use client';

import { RAGResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, ExternalLink, BookOpen, Calendar, Users, FileText } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { AcademicBadges } from './AcademicBadges';
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reference Papers ({result.sources.length})
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Click any paper to view full details
            </span>
          </div>
          <div className="space-y-4">
            {result.sources.map((source, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-indigo-600 bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10"
                onClick={() => setSelectedDocumentId(source.documentId)}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Reference Number */}
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Title */}
                      <div>
                        <h4 className="font-bold text-base text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2">
                          {source.title || source.text?.substring(0, 100) || 'Document'}
                        </h4>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        {source.authors && source.authors.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {source.authors.length > 2 
                                ? `${source.authors.slice(0, 2).join(', ')}, et al.`
                                : source.authors.join(', ')}
                            </span>
                          </div>
                        )}

                        {source.year && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{source.year}</span>
                          </div>
                        )}

                        {source.venue && (
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span className="max-w-[200px] truncate">{source.venue}</span>
                          </div>
                        )}

                        {source.citations !== undefined && source.citations > 0 && (
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>{source.citations.toLocaleString()} citations</span>
                          </div>
                        )}
                      </div>

                      {/* Excerpt/Text */}
                      {(source.excerpt || source.text) && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border-l-2 border-blue-400">
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3">
                            {source.excerpt || source.text}
                          </p>
                        </div>
                      )}

                      {/* Academic Badges */}
                      {source.academicMetadata && (
                        <div className="pt-2">
                          <AcademicBadges 
                            result={{
                              id: source.documentId,
                              documentId: source.documentId,
                              title: source.title || '',
                              authors: source.authors || [],
                              abstract: source.excerpt || '',
                              content: source.text || '',
                              category: '',
                              database: '',
                              publicationDate: source.publicationDate || '',
                              citations: source.citations,
                              url: source.url,
                              score: source.score || source.relevanceScore || 0,
                              year: source.year,
                              venue: source.venue,
                              doi: source.doi,
                              academicMetadata: source.academicMetadata,
                            }}
                          />
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Click to view full details & metadata
                        </span>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open
                          </a>
                        )}
                      </div>
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
