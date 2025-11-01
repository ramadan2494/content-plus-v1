// src/components/search/AcademicBadges.tsx
'use client';

import { SearchResult } from '@/types';
import { 
  Award, 
  FileText, 
  ExternalLink, 
  BookOpen,
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';

interface AcademicBadgesProps {
  result: SearchResult;
}

export const AcademicBadges: React.FC<AcademicBadgesProps> = ({ result }) => {
  const metadata = result.academicMetadata;
  const openAlex = metadata?.openAlex;
  const citations = result.citations || openAlex?.citationCount || openAlex?.publicMetrics?.citationCount;
  const isOpenAccess = result.openAccess || openAlex?.openAccess?.isOpenAccess;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {/* Citations Badge */}
      {citations !== undefined && citations > 0 && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{citations.toLocaleString()} citations</span>
        </div>
      )}

      {/* Open Access Badge */}
      {isOpenAccess !== undefined && (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isOpenAccess 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {isOpenAccess ? (
            <>
              <Unlock className="h-3.5 w-3.5" />
              <span>Open Access</span>
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              <span>Restricted</span>
            </>
          )}
        </div>
      )}

      {/* DOI Badge */}
      {result.doi && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
          <FileText className="h-3.5 w-3.5" />
          <span>DOI</span>
        </div>
      )}

      {/* Venue/Journal Badge */}
      {(result.venue || result.journal || openAlex?.venues?.[0]?.displayName) && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="max-w-[150px] truncate">
            {result.venue || result.journal || openAlex?.venues?.[0]?.displayName}
          </span>
        </div>
      )}

      {/* Year Badge */}
      {result.year && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
          <Award className="h-3.5 w-3.5" />
          <span>{result.year}</span>
        </div>
      )}

      {/* PDF Available Badge */}
      {(result.pdfUrl || openAlex?.primaryLocation?.pdfUrl || openAlex?.locations?.[0]?.pdfUrl) && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>PDF Available</span>
        </div>
      )}
    </div>
  );
};

