// src/components/search/CitationGenerator.tsx
'use client';

import { SearchResult } from '@/types';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CitationGeneratorProps {
  result: SearchResult;
  format?: 'apa' | 'mla' | 'chicago' | 'ieee' | 'bibtex';
}

export const CitationGenerator: React.FC<CitationGeneratorProps> = ({ 
  result, 
  format = 'apa' 
}) => {
  const [copied, setCopied] = useState(false);
  const [currentFormat, setCurrentFormat] = useState(format);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateCitation = (fmt: string): string => {
    const authors = result.authors || [];
    const title = result.title || 'Untitled';
    const year = result.year || new Date(result.publicationDate || '').getFullYear();
    const venue = result.venue || result.journal || '';
    const doi = result.doi || '';

    switch (fmt) {
      case 'apa':
        const authorsStr = authors.length > 0 
          ? authors.length === 1 
            ? authors[0]
            : authors.length === 2
            ? `${authors[0]}, & ${authors[1]}`
            : `${authors[0]}, ${authors.slice(1, -1).join(', ')}, & ${authors[authors.length - 1]}`
          : 'Anonymous';
        return `${authorsStr} (${year}). ${title}. ${venue ? `${venue}. ` : ''}${doi ? `https://doi.org/${doi}` : ''}`;

      case 'mla':
        const mlaAuthors = authors.length > 0 
          ? authors.length === 1 
            ? authors[0]
            : `${authors[0]}, et al.`
          : 'Anonymous';
        return `${mlaAuthors}. "${title}." ${venue || 'N.p.'}, ${year}.${doi ? ` https://doi.org/${doi}.` : ''}`;

      case 'chicago':
        const chicagoAuthors = authors.length > 0 
          ? authors.length === 1 
            ? authors[0]
            : `${authors[0]} et al.`
          : 'Anonymous';
        return `${chicagoAuthors}. "${title}." ${venue ? `In ${venue}. ` : ''}${year}.${doi ? ` https://doi.org/${doi}.` : ''}`;

      case 'ieee':
        const ieeeAuthors = authors.join(', ');
        return `${ieeeAuthors}, "${title}," ${venue || 'Journal'}, ${year}.${doi ? ` DOI: ${doi}` : ''}`;

      case 'bibtex':
        const bibtexAuthors = authors.join(' and ');
        return `@article{${result.id},\n  author = {${bibtexAuthors}},\n  title = {${title}},\n  journal = {${venue}},\n  year = {${year}},\n  doi = {${doi}}\n}`;

      default:
        return `${authors.join(', ')}, "${title}", ${venue}, ${year}`;
    }
  };

  const handleCopy = async () => {
    const citation = generateCitation(currentFormat);
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  const citation = generateCitation(currentFormat);

  return (
    <div className="space-y-3">
      {/* Format Selector */}
      <div className="flex flex-wrap gap-2">
        {(['apa', 'mla', 'chicago', 'ieee', 'bibtex'] as const).map((fmt) => (
          <Button
            key={fmt}
            variant={currentFormat === fmt ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentFormat(fmt)}
            className="text-xs uppercase"
          >
            {fmt}
          </Button>
        ))}
      </div>

      {/* Citation Text */}
      <div className="relative">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
            {citation}
          </pre>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="absolute top-2 right-2"
          title="Copy citation"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

