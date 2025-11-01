// src/components/search/SearchTabs.tsx
'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchType } from '@/types';
import { Sparkles, Search } from 'lucide-react';

interface SearchTabsProps {
  value: SearchType;
  onChange: (value: SearchType) => void;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({ value, onChange }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700">
      <Tabs value={value} onValueChange={(val) => onChange(val as SearchType)}>
        <TabsList className="grid grid-cols-2 w-full max-w-2xl mx-auto h-auto bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
          <TabsTrigger 
            value="rag" 
            className="py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">AI Search</span>
                <span className="text-xs opacity-80">
                  Get AI-powered answers with sources
                </span>
              </div>
            </div>
          </TabsTrigger>

          <TabsTrigger 
            value="fuzzy" 
            className="py-4 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base">Regular Search</span>
                <span className="text-xs opacity-80">
                  Find papers by keywords
                </span>
              </div>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
