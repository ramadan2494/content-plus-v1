// src/components/search/SearchResults.tsx
'use client';

import { SearchResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, ExternalLink, Calendar, Users, Download, Quote } from 'lucide-react';
import { formatDate, copyToClipboard } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { AcademicBadges } from './AcademicBadges';
import { CitationGenerator } from './CitationGenerator';
import { useState } from 'react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [showCitationId, setShowCitationId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleCopy = async (result: SearchResult) => {
    const citation = `${result.title}. ${result.authors.join(', ')}. ${formatDate(result.publicationDate)}. ${result.url || ''}`;
    const success = await copyToClipboard(citation);

    if (success) {
      setCopiedId(result.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleViewDetails = (documentId: string) => {
    setSelectedDocumentId(documentId);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getPdfUrl = (result: SearchResult): string | null => {
    return result.pdfUrl || 
           result.academicMetadata?.openAlex?.primaryLocation?.pdfUrl ||
           result.academicMetadata?.openAlex?.locations?.[0]?.pdfUrl ||
           null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search query or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {results.map((result) => {
        const isExpanded = expandedIds.has(result.id);
        const pdfUrl = getPdfUrl(result);
        
        return (
          <Card 
            key={result.id} 
            className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 dark:border-l-blue-600"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <CardTitle 
                    className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(result.documentId)}
                  >
                    {result.title}
                  </CardTitle>

                  {/* Authors and Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {result.authors && result.authors.length > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">
                          {result.authors.length > 3 
                            ? `${result.authors.slice(0, 3).join(', ')}, et al.` 
                            : result.authors.join(', ')}
                        </span>
                      </div>
                    )}

                    {(result.year || result.publicationDate) && (
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{result.year || new Date(result.publicationDate).getFullYear()}</span>
                      </div>
                    )}

                    {result.citations !== undefined && result.citations > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {result.citations.toLocaleString()} citations
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Academic Badges */}
                  <AcademicBadges result={result} />

                  {/* Keywords */}
                  {result.keywords && result.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.slice(0, 5).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(result)}
                    title="Copy citation"
                    className="h-9 w-9 p-0"
                  >
                    <Copy className={`h-4 w-4 ${copiedId === result.id ? 'text-green-600' : ''}`} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCitationId(showCitationId === result.id ? null : result.id)}
                    title="Show citation"
                    className="h-9 w-9 p-0"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>

                  {pdfUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer" title="Download PDF">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  {result.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={result.url} target="_blank" rel="noopener noreferrer" title="View online">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Abstract/Content */}
              <div className="space-y-2">
                <CardDescription className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {isExpanded 
                    ? (result.abstract || result.content)
                    : `${(result.abstract || result.content || '').substring(0, 250)}${(result.abstract || result.content || '').length > 250 ? '...' : ''}`
                  }
                </CardDescription>
                {(result.abstract || result.content) && 
                 (result.abstract || result.content || '').length > 250 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => toggleExpanded(result.id)}
                    className="h-auto p-0 text-blue-600 dark:text-blue-400"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </Button>
                )}
              </div>

              {/* Citation Generator */}
              {showCitationId === result.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
                    Citation
                  </h4>
                  <CitationGenerator result={result} />
                </div>
              )}

              {/* View Details Button */}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => handleViewDetails(result.documentId)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Full Details & Metadata
              </Button>
            </CardContent>
          </Card>
        );
      })}

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
