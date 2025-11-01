// src/components/search/SearchFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchStore } from '@/store';
import { SearchService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const SearchFilters: React.FC = () => {
  const { filters, setFilters } = useSearchStore();
  const [categories, setCategories] = useState<string[]>([]);
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    filters.categories || []
  );
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>(filters.databases || []);

  useEffect(() => {
    const loadFilters = async () => {
      const [cats, dbs] = await Promise.all([
        SearchService.getCategories(),
        SearchService.getDatabases(),
      ]);
      setCategories(cats);
      setDatabases(dbs);
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
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedDatabases([]);
    setFilters({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Categories</Label>
          <div className="space-y-2">
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
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Databases */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Databases</Label>
          <div className="space-y-2">
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
                  className="text-sm font-normal cursor-pointer"
                >
                  {database}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
