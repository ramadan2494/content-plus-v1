// src/components/search/SearchResults.tsx
'use client';

import { SearchResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, ExternalLink, Calendar, Users } from 'lucide-react';
import { formatDate, copyToClipboard } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { useState } from 'react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

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
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {results.map((result) => (
        <Card 
          key={result.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleViewDetails(result.documentId)}
        >
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2 hover:text-primary">
                  {result.title}
                </CardTitle>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{result.authors.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(result.publicationDate)}</span>
                  </div>

                  {result.category && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {result.category}
                    </span>
                  )}

                  {result.database && (
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                      {result.database}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(result)}
                  title="Copy citation"
                >
                  <Copy className={`h-4 w-4 ${copiedId === result.id ? 'text-green-500' : ''}`} />
                </Button>

                {result.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" title="Open">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <CardDescription className="text-base leading-relaxed line-clamp-3">
              {result.abstract || result.content}
            </CardDescription>

            {result.score && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Relevance: {(result.score * 100).toFixed(0)}%
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${result.score * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

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
