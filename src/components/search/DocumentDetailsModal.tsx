// src/components/search/DocumentDetailsModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchService } from '@/services';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDate } from '@/lib/utils';
import { ExternalLink, Copy, BookOpen, Calendar, Database, Globe, FileText, Tag, TrendingUp, Building2, Link2, Users, Award, BarChart3, Download } from 'lucide-react';
import { AcademicMetadata, OpenAlexMetadata, SciSpaceMetadata } from '@/types';
import { CitationGenerator } from './CitationGenerator';

interface DocumentDetailsModalProps {
  documentId: string;
  onClose: () => void;
}

interface DocumentDetails {
  title?: string;
  authors?: Array<{ name: string } | string>;
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
  citations?: number;
  venue?: string;
  journal?: string;
  academicMetadata?: AcademicMetadata;
  openAccess?: boolean;
  pdfUrl?: string;
  keywords?: string[];
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

  // Helper to get author name
  const getAuthorName = (author: { name: string } | string): string => {
    return typeof author === 'string' ? author : author.name;
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
                      {document.authors.map(getAuthorName).join(', ')}
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

              {/* OpenAlex Metadata */}
              {document.academicMetadata?.openAlex && (
                <OpenAlexSection metadata={document.academicMetadata.openAlex} />
              )}

              {/* SciSpace Metadata */}
              {document.academicMetadata?.sciSpace && (
                <SciSpaceSection metadata={document.academicMetadata.sciSpace} />
              )}

              {/* Citation Generator */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Generate Citation
                </h4>
                <CitationGenerator 
                  result={{
                    id: document.coreId || documentId,
                    documentId: documentId,
                    title: document.title || '',
                    authors: Array.isArray(document.authors) 
                      ? document.authors.map(a => typeof a === 'string' ? a : a.name)
                      : [],
                    abstract: document.abstract || '',
                    content: document.abstract || '',
                    category: '',
                    database: document.database?.[0] || '',
                    publicationDate: document.datePublished || '',
                    citations: document.citations,
                    url: document.downloadUrl || '',
                    score: 1,
                    year: document.year,
                    venue: document.venue || document.journal,
                    doi: document.doi,
                  }}
                />
              </div>

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

// OpenAlex Metadata Section Component
const OpenAlexSection: React.FC<{ metadata: OpenAlexMetadata }> = ({ metadata }) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          OpenAlex Metadata
        </h4>
      </div>

      {/* Citation Count */}
      {(metadata.citationCount || metadata.publicMetrics?.citationCount) && (
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Citations: 
            </span>
            <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">
              {(metadata.citationCount || metadata.publicMetrics?.citationCount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Open Access Status */}
      {metadata.openAccess && (
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            metadata.openAccess.isOpenAccess
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}>
            {metadata.openAccess.isOpenAccess ? '✓ Open Access' : 'Restricted Access'}
          </div>
          {metadata.openAccess.oaUrl && (
            <a
              href={metadata.openAccess.oaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              View Open Access Version
            </a>
          )}
        </div>
      )}

      {/* Concepts/Topics */}
      {metadata.concepts && metadata.concepts.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Research Concepts
          </h5>
          <div className="flex flex-wrap gap-2">
            {metadata.concepts.slice(0, 10).map((concept, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                title={`Score: ${concept.score.toFixed(2)}`}
              >
                {concept.displayName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Authorships with Institutions */}
      {metadata.authorships && metadata.authorships.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Authors & Institutions
          </h5>
          <div className="space-y-2">
            {metadata.authorships.slice(0, 5).map((authorship, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium text-gray-900 dark:text-white">
                  {authorship.author.displayName}
                </span>
                {authorship.institutions && authorship.institutions.length > 0 && (
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    ({authorship.institutions.map(i => i.displayName).join(', ')})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Venues */}
      {metadata.venues && metadata.venues.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Venues
          </h5>
          <div className="space-y-2">
            {metadata.venues.map((venue, idx) => (
              <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{venue.displayName}</span>
                {venue.type && (
                  <span className="ml-2 text-gray-500 dark:text-gray-400">({venue.type})</span>
                )}
                {venue.publisher && (
                  <span className="ml-2 text-gray-500 dark:text-gray-400">- {venue.publisher}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF URLs */}
      {(metadata.primaryLocation?.pdfUrl || metadata.locations?.some(l => l.pdfUrl)) && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Download className="h-4 w-4" />
            PDF Downloads
          </h5>
          <div className="space-y-2">
            {metadata.primaryLocation?.pdfUrl && (
              <a
                href={metadata.primaryLocation.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Primary Location PDF
              </a>
            )}
            {metadata.locations?.filter(l => l.pdfUrl).map((location, idx) => (
              <a
                key={idx}
                href={location.pdfUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1 block"
              >
                <ExternalLink className="h-4 w-4" />
                {location.source?.displayName || `PDF ${idx + 1}`}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Work ID */}
      {metadata.workId && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-blue-200 dark:border-blue-800">
          OpenAlex Work ID: {metadata.workId}
        </div>
      )}
    </div>
  );
};

// SciSpace Metadata Section Component
const SciSpaceSection: React.FC<{ metadata: SciSpaceMetadata }> = ({ metadata }) => {
  return (
    <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          SciSpace Metadata
        </h4>
      </div>

      {/* Summary */}
      {metadata.summary && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Summary
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {metadata.summary}
          </p>
        </div>
      )}

      {/* Key Findings */}
      {metadata.keyFindings && metadata.keyFindings.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Key Findings
          </h5>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {metadata.keyFindings.map((finding, idx) => (
              <li key={idx}>{finding}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Methodology */}
      {metadata.methodology && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Methodology
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {metadata.methodology}
          </p>
        </div>
      )}

      {/* Limitations */}
      {metadata.limitations && metadata.limitations.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Limitations
          </h5>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {metadata.limitations.map((limitation, idx) => (
              <li key={idx}>{limitation}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Future Work */}
      {metadata.futureWork && metadata.futureWork.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Future Work
          </h5>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {metadata.futureWork.map((work, idx) => (
              <li key={idx}>{work}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Text URL */}
      {metadata.fullTextUrl && (
        <div>
          <a
            href={metadata.fullTextUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
          >
            <Link2 className="h-4 w-4" />
            View Full Text on SciSpace
          </a>
        </div>
      )}

      {/* SciSpace ID */}
      {metadata.sciSpaceId && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-purple-200 dark:border-purple-800">
          SciSpace ID: {metadata.sciSpaceId}
        </div>
      )}
    </div>
  );
};
