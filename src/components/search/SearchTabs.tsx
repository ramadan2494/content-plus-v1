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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2">
      <Tabs value={value} onValueChange={(val) => onChange(val as SearchType)}>
        <TabsList className="grid grid-cols-2 h-auto bg-transparent p-1 gap-1">
          <TabsTrigger 
            value="rag" 
            className="py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>
          </TabsTrigger>

          <TabsTrigger 
            value="fuzzy" 
            className="py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="font-semibold text-sm">Regular Search</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
