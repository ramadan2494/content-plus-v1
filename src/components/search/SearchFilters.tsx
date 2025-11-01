// src/components/search/SearchFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, TrendingUp, Database, Filter, Lock, Unlock } from 'lucide-react';

export const SearchFilters: React.FC = () => {
  const { filters, setFilters } = useSearchStore();
  const [categories] = useState<string[]>([]);
  const [databases] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.categories || []
  );
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>(filters.databases || []);
  
  // Academic-specific filters
  const [yearFrom, setYearFrom] = useState<string>(filters.yearFrom?.toString() || '');
  const [yearTo, setYearTo] = useState<string>(filters.yearTo?.toString() || '');
  const [minCitations, setMinCitations] = useState<string>(filters.minCitations?.toString() || '');
  const [openAccess, setOpenAccess] = useState<boolean | undefined>(filters.openAccess);

  const currentYear = new Date().getFullYear();
  const minYear = 1900;

  useEffect(() => {
    const loadFilters = async () => {
      try {
        // These methods don't exist yet, so we'll skip loading them
        // const [cats, dbs] = await Promise.all([
        //   SearchService.getCategories?.() || Promise.resolve([]),
        //   SearchService.getDatabases?.() || Promise.resolve([]),
        // ]);
        // setCategories(cats);
        // setDatabases(dbs);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    loadFilters();
  }, []);

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
  };

  const handleDatabaseToggle = (database: string) => {
    const newDatabases = selectedDatabases.includes(database)
      ? selectedDatabases.filter((d) => d !== database)
      : [...selectedDatabases, database];

    setSelectedDatabases(newDatabases);
  };

  const handleApply = () => {
    setFilters({
      ...filters,
      categories: selectedCategories,
      databases: selectedDatabases,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      minCitations: minCitations ? parseInt(minCitations) : undefined,
      openAccess: openAccess,
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedDatabases([]);
    setYearFrom('');
    setYearTo('');
    setMinCitations('');
    setOpenAccess(undefined);
    setFilters({});
  };

  return (
    <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Academic Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Year Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Publication Year
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="yearFrom" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                From
              </Label>
              <Input
                id="yearFrom"
                type="number"
                placeholder={`${minYear}`}
                min={minYear}
                max={currentYear}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="yearTo" className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                To
              </Label>
              <Input
                id="yearTo"
                type="number"
                placeholder={`${currentYear}`}
                min={minYear}
                max={currentYear}
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Minimum Citations */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Minimum Citations
          </Label>
          <Input
            type="number"
            placeholder="0"
            min="0"
            value={minCitations}
            onChange={(e) => setMinCitations(e.target.value)}
            className="h-9"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Only show papers with at least this many citations
          </p>
        </div>

        {/* Open Access */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            {openAccess ? (
              <Unlock className="h-4 w-4 text-green-600" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Access Type
          </Label>
          <div className="flex gap-2">
            <Button
              variant={openAccess === true ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOpenAccess(openAccess === true ? undefined : true)}
              className="flex-1"
            >
              <Unlock className="h-3.5 w-3.5 mr-1" />
              Open Access Only
            </Button>
            <Button
              variant={openAccess === false ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOpenAccess(openAccess === false ? undefined : false)}
              className="flex-1"
            >
              <Lock className="h-3.5 w-3.5 mr-1" />
              All Papers
            </Button>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Categories</Label>
            <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Databases */}
        {databases.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Databases
            </Label>
            <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              {databases.map((database) => (
                <div key={database} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`database-${database}`}
                    checked={selectedDatabases.includes(database)}
                    onChange={() => handleDatabaseToggle(database)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`database-${database}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {database}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(selectedCategories.length > 0 || 
          selectedDatabases.length > 0 || 
          yearFrom || 
          yearTo || 
          minCitations || 
          openAccess !== undefined) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Active Filters:
            </p>
            <div className="flex flex-wrap gap-2">
              {yearFrom && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                  From: {yearFrom}
                </span>
              )}
              {yearTo && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                  To: {yearTo}
                </span>
              )}
              {minCitations && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                  Min Citations: {minCitations}
                </span>
              )}
              {openAccess !== undefined && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                  {openAccess ? 'Open Access' : 'All Papers'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={handleApply} className="flex-1" size="lg">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1" size="lg">
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
